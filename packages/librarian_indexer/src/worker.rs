pub mod miner;

use scraper::ElementRef;
use scraper::Selector;
use scraper::Html;
use std::sync::Barrier;
use std::sync::Mutex;
use dashmap::DashMap;
use std::path::PathBuf;
use std::fs::File;
use std::io::BufReader;
use std::io::Read;
use std::str;
use std::sync::Arc;
use std::thread;

use byteorder::{ByteOrder, LittleEndian};
use crossbeam::Sender;
use crossbeam::Receiver;
use rustc_hash::FxHashMap;

use miner::WorkerMiner;
use crate::spimiwriter;
use crate::utils::varint;
use crate::DocInfos;
use crate::FieldInfos;
use crate::spimireader::TermDocsForMerge;
use crate::spimireader::PostingsStreamDecoder;
use crate::spimireader::PostingsStreamReader;

static LAST_FIELD_MASK: u8 = 0x80; // 1000 0000

pub struct Worker {
    pub id: usize,
    pub join_handle: thread::JoinHandle<()>,
}

impl Worker {
    pub fn terminate_all_workers(workers: Vec<Worker>, tx_main: Sender<MainToWorkerMessage>) {
        for _worker in &workers {
            tx_main.send(MainToWorkerMessage::Terminate).expect("Failed to request worker termination!");
        }

        for worker in workers {
            worker.join_handle.join().expect("Failed to join worker.");
        }
    }

    pub fn wait_on_all_workers(tx_main: &Sender<MainToWorkerMessage>, num_threads: u32) {
        let receive_work_barrier: Arc<Barrier> = Arc::new(Barrier::new((num_threads + 1) as usize));
        for _i in 0..num_threads {
            tx_main.send(MainToWorkerMessage::Synchronize(Arc::clone(&receive_work_barrier))).unwrap();
        }
        receive_work_barrier.wait();
    }
}

pub enum MainToWorkerMessage {
    Synchronize(Arc<Barrier>),
    Reset(Arc<Barrier>),
    Terminate,
    Combine {
        worker_miners: Vec<WorkerMiner>,
        output_folder_path: PathBuf,
        block_number: u32,
        num_docs: u32,
        total_num_docs: u32,
        doc_infos: Arc<Mutex<DocInfos>>,
    },
    Index {
        doc_id: u32,
        field_texts: Vec<(&'static str, String)>,
    },
    IndexHtml {
        doc_id: u32,
        link: String,
        html_text: String
    },
    Decode {
        n: u32,
        postings_stream_reader: PostingsStreamReader,
        postings_stream_decoders: Arc<DashMap<u32, PostingsStreamDecoder>>,
    }
}

pub struct WorkerToMainMessage {
    pub id: usize,
    pub doc_miner: Option<WorkerMiner>,
}

fn traverse_node(node: ElementRef, field_texts: &mut Vec<(&str, String)>) {
    match node.value().name() {
        "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6" => {
            field_texts.push(("heading", node.text().collect()));
        }
        _ => {
            if !node.has_children() {
                // field_texts.push(("body", node.text().collect()));
                return;
            }

            for child in node.children() {
                if let Some(el_child) = ElementRef::wrap(child) {
                    traverse_node(el_child, field_texts);
                } else {
                    if let Some(text) = child.value().as_text() {
                        if let Some(last) = field_texts.last_mut() {
                            if last.0 == "body" {
                                last.1 += text;
                            } else {
                                field_texts.push(("body", text.to_string()));
                            }
                        } else {
                            field_texts.push(("body", text.to_string()));
                        }
                    }
                }
            }
        }
    }
}

lazy_static! {
    static ref TITLE_SELECTOR: Selector = Selector::parse("title").unwrap();
    static ref BODY_SELECTOR: Selector = Selector::parse("body").unwrap();
}

pub fn worker (
    id: usize,
    sndr: Sender<WorkerToMainMessage>, 
    rcvr: Receiver<MainToWorkerMessage>,
    /* Immutable shared data structures... */
    field_infos: Arc<FieldInfos>,
    expected_num_docs_per_reset: usize,
    num_workers_writing_blocks_clone: Arc<Mutex<usize>>,
) {
    // Initialize data structures...
    let mut doc_miner = WorkerMiner {
        field_infos: Arc::clone(&field_infos),
        terms: FxHashMap::default(),
        doc_infos: Vec::with_capacity(expected_num_docs_per_reset),
    };

    loop {
        let msg = rcvr.recv().expect("Failed to receive message on worker side!");
        match msg {
            MainToWorkerMessage::Index { doc_id, field_texts } => {
                doc_miner.index_doc(doc_id, field_texts);
            },
            MainToWorkerMessage::IndexHtml { doc_id, link, html_text } => {
                let mut field_texts: Vec<(&str, String)> = Vec::with_capacity(20);
                let document = Html::parse_document(&html_text);

                field_texts.push(("link", link));

                if let Some(title) = document.select(&TITLE_SELECTOR).next() {
                    field_texts.push(("title", title.text().collect()));
                }

                if let Some(body) = document.select(&BODY_SELECTOR).next() {
                    traverse_node(body, &mut field_texts);
                }

                doc_miner.index_doc(doc_id, field_texts);
            },
            MainToWorkerMessage::Combine {
                worker_miners,
                output_folder_path,
                block_number,
                num_docs,
                total_num_docs,
                doc_infos,
            } => {
                spimiwriter::combine_worker_results_and_write_block(
                    worker_miners,
                    doc_infos,
                    output_folder_path,
                    &field_infos,
                    block_number,
                    num_docs,
                    total_num_docs,
                );
                println!("Worker {} wrote spimi block {}!", id, block_number);
                
                {
                    *num_workers_writing_blocks_clone.lock().unwrap() -= 1;
                }
            },
            MainToWorkerMessage::Reset(barrier) => {
                println!("Worker {} resetting!", id);
            
                // return the indexed documents...
                sndr.send(WorkerToMainMessage {
                    id,
                    doc_miner: Option::from(doc_miner),
                }).expect("Failed to send message back to main thread!");
                
                // reset local variables...
                doc_miner = WorkerMiner {
                    field_infos: Arc::clone(&field_infos),
                    terms: FxHashMap::default(),
                    doc_infos: Vec::with_capacity(expected_num_docs_per_reset),
                };

                barrier.wait();
            },
            MainToWorkerMessage::Synchronize(barrier) => {
                barrier.wait();
            },
            MainToWorkerMessage::Decode {
                n,
                mut postings_stream_reader,
                postings_stream_decoders,
            } => {
                let mut u32_buf: [u8; 4] = [0; 4];
                let mut u8_buf: [u8; 1] = [0; 1];

                let pl_reader = &mut postings_stream_reader.buffered_reader;
                let doc_infos = &postings_stream_reader.doc_infos_unlocked;
                
                for _unused in 0..n {
                    if let Ok(()) = postings_stream_reader.buffered_dict_reader.read_exact(&mut u8_buf) {
                        // Temporary combined dictionary table / dictionary string
                        let mut term_vec = vec![0; u8_buf[0] as usize];
                        postings_stream_reader.buffered_dict_reader.read_exact(&mut term_vec).unwrap();
                        let term = str::from_utf8(&term_vec).unwrap().to_owned();
        
                        postings_stream_reader.buffered_dict_reader.read_exact(&mut u32_buf).unwrap();
                        let doc_freq = LittleEndian::read_u32(&u32_buf);

                        // TODO improve the capacity heuristic
                        let mut combined_var_ints = Vec::with_capacity((doc_freq * 20) as usize);

                        let mut max_doc_term_score: f32 = 0.0;
        
                        let mut read_and_write_doc = |doc_id, pl_reader: &mut BufReader<File>, combined_var_ints: &mut Vec<u8>, u8_buf: &mut [u8; 1], u32_buf: &mut [u8; 4]| {        
                            let mut curr_doc_term_score: f32 = 0.0;
                            let mut read_and_write_field = |field_id, pl_reader: &mut BufReader<File>, combined_var_ints: &mut Vec<u8>, u32_buf: &mut [u8; 4]| {
                                pl_reader.read_exact(u32_buf).unwrap();
                                let field_tf = LittleEndian::read_u32(u32_buf);
                                varint::get_var_int_vec(field_tf, combined_var_ints);

                                /*
                                 Pre-encode field tf and position gaps into varint in the worker,
                                 then write it out in the main thread later.
                                */
                                
                                let mut prev_pos = 0;
                                for _k in 0..field_tf {
                                    pl_reader.read_exact(u32_buf).unwrap();
                                    let curr_pos = LittleEndian::read_u32(u32_buf);
                                    varint::get_var_int_vec(curr_pos - prev_pos, combined_var_ints);
                                    prev_pos = curr_pos;
                                }

                                let field_info = field_infos.field_infos_by_id.get(field_id as usize).unwrap();
                                let k = field_info.k;
                                let b = field_info.b;
                                curr_doc_term_score += (field_tf as f32 * (k + 1.0))
                                    / (field_tf as f32
                                        + k * (
                                            1.0
                                            - b
                                            + b * (doc_infos.get_field_len_factor(doc_id as usize, field_id as usize))
                                        )
                                    )
                                    * field_info.weight;
                            };

                            pl_reader.read_exact(u8_buf).unwrap();
                            let num_fields = u8_buf[0];
                            for _j in 1..num_fields {
                                pl_reader.read_exact(u8_buf).unwrap();
                                let field_id = u8_buf[0];
                                combined_var_ints.push(field_id);
                                
                                read_and_write_field(field_id, pl_reader, combined_var_ints, u32_buf);
                            }

                            // Delimit the last field with LAST_FIELD_MASK
                            pl_reader.read_exact(u8_buf).unwrap();
                            let field_id = u8_buf[0];
                            combined_var_ints.push(field_id | LAST_FIELD_MASK);
                            read_and_write_field(field_id, pl_reader, combined_var_ints, u32_buf);

                            if curr_doc_term_score > max_doc_term_score {
                                max_doc_term_score = curr_doc_term_score;
                            }
                        };

                        
                        /*
                         For the first document, don't encode the doc id variable integer.
                         Encode it in the main thread later where the gap information between blocks is available.
                         */
                        pl_reader.read_exact(&mut u32_buf).unwrap();
                        let first_doc_id = LittleEndian::read_u32(&u32_buf);

                        let mut prev_doc_id = first_doc_id;
                        read_and_write_doc(first_doc_id, pl_reader, &mut combined_var_ints, &mut u8_buf, &mut u32_buf);

                        for _i in 1..doc_freq {
                            pl_reader.read_exact(&mut u32_buf).unwrap();
                            let doc_id = LittleEndian::read_u32(&u32_buf);
                            varint::get_var_int_vec(doc_id - prev_doc_id, &mut combined_var_ints);

                            prev_doc_id = doc_id;
                            read_and_write_doc(doc_id, pl_reader, &mut combined_var_ints, &mut u8_buf, &mut u32_buf);
                        }

                        postings_stream_reader.future_term_buffer.push_back(TermDocsForMerge {
                            term,
                            max_doc_term_score,
                            doc_freq,
                            combined_var_ints,
                            first_doc_id,
                            last_doc_id: prev_doc_id,
                        });
                    } else {
                        break; // eof
                    }
                }

                {
                    let mut postings_stream_decoder_entry = postings_stream_decoders.get_mut(&postings_stream_reader.idx).unwrap();
                    let postings_stream_decoder = postings_stream_decoder_entry.value_mut();
                    match postings_stream_decoder {
                        PostingsStreamDecoder::None => {
                            *postings_stream_decoder = PostingsStreamDecoder::Reader(postings_stream_reader);
                        },
                        PostingsStreamDecoder::Notifier(_tx) => {
                            let notifier_decoder = std::mem::replace(postings_stream_decoder, PostingsStreamDecoder::Reader(postings_stream_reader));
                            
                            // Main thread was blocked as this worker was still decoding
                            // Re-notify that decoding is done!
                            if let PostingsStreamDecoder::Notifier(tx) = notifier_decoder {
                                tx.lock().unwrap().send(()).unwrap();
                            }
                        },
                        PostingsStreamDecoder::Reader(_r) => panic!("Reader still available in array @worker")
                    }
                }
            },
            MainToWorkerMessage::Terminate => {
                break;
            },
        }
    }
}
