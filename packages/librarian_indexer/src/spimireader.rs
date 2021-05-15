use dashmap::DashMap;
use std::sync::mpsc::Sender;
use std::sync::Arc;
use std::sync::Mutex;
use std::collections::VecDeque;
use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::fs::File;
use std::io::BufWriter;
use std::io::BufReader;
use std::io::Write;
use std::path::Path;

use crate::Receiver;
use crate::utils::varint::get_var_int;
use crate::WorkerToMainMessage;
use crate::Worker;
use crate::worker::miner::DocField;
use crate::worker::miner::TermDoc;

static POSTINGS_STREAM_BUFFER_SIZE: u32 = 2000;
static POSTINGS_STREAM_READER_ADVANCE_READ_THRESHOLD: usize = 2000;

static POSTINGS_FILE_LIMIT: u32 = 65535;
static LAST_FIELD_MASK: u8 = 0x80; // 1000 0000

static PREFIX_FRONT_CODE: u8 = 123;
static SUBSEQUENT_FRONT_CODE: u8 = 125;

pub enum PostingsStreamDecoder {
    Reader(PostingsStreamReader),
    Notifier(Mutex<Sender<()>>),
    None
}

pub struct PostingsStreamReader {
    pub idx: u32,
    pub buffered_reader: BufReader<File>,
    pub buffered_dict_reader: BufReader<File>,
    pub future_term_buffer: VecDeque<(String, Vec<TermDoc>)>
}

impl PostingsStreamReader {
    fn read_next_batch (
        self,
        rx_main: &Receiver<WorkerToMainMessage>,
        workers: &Vec<Worker>,
        postings_stream_decoders: Arc<DashMap<u32, PostingsStreamDecoder>>,
    ) {
        let w = Worker::get_available_worker(workers, rx_main);
        w.decode_spimi(
            POSTINGS_STREAM_BUFFER_SIZE,
            self,
            postings_stream_decoders,
        );
    }
}

struct PostingsStream {
    idx: u32,
    is_empty: bool,
    is_reader_decoding: bool,
    curr_term: String,
    curr_term_docs: Vec<TermDoc>,
    term_buffer: VecDeque<(String, Vec<TermDoc>)>,
}

// Order by term, then block number
impl Eq for PostingsStream {}

impl PartialEq for PostingsStream {
    fn eq(&self, other: &Self) -> bool {
        self.curr_term == other.curr_term && self.idx == other.idx
    }
}

impl Ord for PostingsStream {
    fn cmp(&self, other: &Self) -> Ordering {
        match other.curr_term.cmp(&self.curr_term) {
            Ordering::Equal => other.idx.cmp(&self.idx),
            Ordering::Greater => Ordering::Greater,
            Ordering::Less => Ordering::Less,
        }
    }
}

impl PartialOrd for PostingsStream {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        match other.curr_term.cmp(&self.curr_term) {
            Ordering::Equal => Some(other.idx.cmp(&self.idx)),
            Ordering::Greater => Some(Ordering::Greater),
            Ordering::Less => Some(Ordering::Less),
        }
    }
}

impl PostingsStream {
    // Transfer first term of term_buffer into curr_term and curr_term_docs
    fn get_term (
        &mut self,
        postings_stream_decoders: &Arc<DashMap<u32, PostingsStreamDecoder>>,
        rx_main: &Receiver<WorkerToMainMessage>,
        workers: &Vec<Worker>,
        blocking_sndr: &Sender<()>,
        blocking_rcvr: &Receiver<()>,
    ) {
        if self.term_buffer.len() == 0 {
            let mut lock = postings_stream_decoders.get_mut(&self.idx).unwrap();
            let lock_value_mut = lock.value_mut();
            match lock_value_mut {
                PostingsStreamDecoder::Reader(postings_stream_reader) => {
                    std::mem::swap(&mut postings_stream_reader.future_term_buffer, &mut self.term_buffer);
                },
                PostingsStreamDecoder::None => {
                    println!("Blocked! Ouch! Consider increasing the decode buffer size...");

                    // Set to notifier
                    *lock_value_mut = PostingsStreamDecoder::Notifier(Mutex::from(blocking_sndr.clone()));

                    // Deadlock otherwise - worker will never be able to acquire postings_stream_readers_vec
                    drop(lock);

                    // Wait for worker to finish decoding...
                    blocking_rcvr.recv().unwrap();

                    // Done! Reacquire lock
                    match postings_stream_decoders.get_mut(&self.idx).unwrap().value_mut() {
                        PostingsStreamDecoder::Reader(postings_stream_reader) => {
                            std::mem::swap(&mut postings_stream_reader.future_term_buffer, &mut self.term_buffer);
                        },
                        _ => panic!("Unexpected state @get_term blocking branch")
                    }
                },
                _ => panic!("Unexpected state @get_term notifier")
            }
            self.is_reader_decoding = false;
        } else if !self.is_reader_decoding && self.term_buffer.len() < POSTINGS_STREAM_READER_ADVANCE_READ_THRESHOLD {
            // Request for an in-advance worker decode...

            match std::mem::replace(postings_stream_decoders.get_mut(&self.idx).unwrap().value_mut(), PostingsStreamDecoder::None) {
                PostingsStreamDecoder::Reader(postings_stream_reader) => {
                    postings_stream_reader.read_next_batch(rx_main, workers, Arc::clone(postings_stream_decoders));
                    self.is_reader_decoding = true;
                },
                _ => panic!("Unexpected state @get_term")
            }
        }

        // Pluck out the first tuple
        if let Some(term_termdocs_pair) = self.term_buffer.pop_front() {
            self.curr_term = term_termdocs_pair.0;
            self.curr_term_docs = term_termdocs_pair.1;
        } else {
            self.is_empty = true;
        }
    }
}


fn get_common_unicode_prefix_byte_len(str1: &str, str2: &str) -> usize {
    let mut byte_len = 0;
    let mut str1_it = str1.chars();
    let mut str2_it = str2.chars();
    
    loop {
        let str1_next = str1_it.next();
        let str2_next = str2_it.next();
        if str1_next == None || str2_next == None || (str1_next.unwrap() != str2_next.unwrap()) {
            break;
        }

        byte_len += str1_next.unwrap().len_utf8();
    }

    byte_len
}

pub fn merge_blocks<'a> (
    num_blocks: u32,
    workers: &Vec<Worker>,
    rx_main: &Receiver<WorkerToMainMessage>,
    output_folder_path: &Path
) {
    /*
     Threading algorithm:
     Whenever a postings stream's primary buffer depletes below a certain count,
     request a worker to decode more terms and postings lists into the secondary buffer.

     Once the primary buffer is fully depleted, wait for the decoding to complete if not yet done, then swap the two buffers.

     Thus, we'll need to keep track of postings streams being decoded by threads... (secondary buffers being filled)
     using a simple hashset...
     */
    let mut postings_streams: BinaryHeap<PostingsStream> = BinaryHeap::new();
    let postings_stream_readers: Arc<DashMap<u32, PostingsStreamDecoder>> = Arc::from(DashMap::with_capacity(num_blocks as usize));
    let (blocking_sndr, blocking_rcvr): (Sender<()>, Receiver<()>) = std::sync::mpsc::channel();

    // let (tx_stream, rx_stream) : (Sender<WorkerToMainMessage>, Receiver<WorkerToMainMessage>) = std::sync::mpsc::channel();

    // Initialize postings streams and readers, start reading
    for idx in 1..(num_blocks + 1) {
        let block_file_path = Path::new(output_folder_path).join(format!("bsbi_block_{}", idx));
        let block_dict_file_path = Path::new(output_folder_path).join(format!("bsbi_block_dict_{}", idx));

        let block_file = File::open(block_file_path).expect("Failed to open block for reading.");
        let block_dict_file = File::open(block_dict_file_path).expect("Failed to open block dictionary table for reading.");

        // Transfer reader to thread and begin reads
        postings_stream_readers.insert(idx, PostingsStreamDecoder::None);

        (PostingsStreamReader {
            idx,
            buffered_reader: BufReader::with_capacity(819200, block_file),
            buffered_dict_reader: BufReader::with_capacity(819200, block_dict_file),
            future_term_buffer: VecDeque::with_capacity(POSTINGS_STREAM_BUFFER_SIZE as usize)
        }).read_next_batch(rx_main, workers, Arc::clone(&postings_stream_readers));
    }

    // Initialize postings streams...
    // And wait for all decoding to finish...
    for idx in 1..(num_blocks + 1) {
        let mut postings_stream = PostingsStream {
            idx,
            is_empty: false,
            is_reader_decoding: false,
            curr_term: "".to_owned(),
            curr_term_docs: Vec::new(),
            term_buffer: VecDeque::with_capacity(POSTINGS_STREAM_BUFFER_SIZE as usize), // transfer ownership of future term buffer to the main postings stream
        };
        postings_stream.get_term(&postings_stream_readers, rx_main, workers, &blocking_sndr, &blocking_rcvr);
        postings_streams.push(postings_stream);
    }
    println!("Initialized postings streams...");

    // N-way merge according to lexicographical order
    // Sort and aggregate worker docIds into one vector
    
    let mut dict_table_writer = BufWriter::new(
        File::create(
            Path::new(output_folder_path).join("dictionaryTable")
        ).expect("Failed to open final dictionary table for writing.")
    );
    let mut dict_string_writer = BufWriter::new(
        File::create(
            Path::new(output_folder_path).join("dictionaryString")
        ).expect("Failed to final dictionary string for writing.")
    );
    let mut pl_writer = BufWriter::new(
        File::create(
            Path::new(output_folder_path).join("pl_0")
        ).expect("Failed to final dictionary string for writing.")
    );

    // N-way merge trackers
    let mut prev_term = "".to_owned();
    let mut prev_combined_term_docs: Vec<TermDoc> = Vec::new();

    // Dictionary front coding trackers
    let mut prev_common_prefix = "".to_owned();
    let mut pending_terms: Vec<String> = Vec::new();
    let write_pending_terms = |dict_string_writer: &mut BufWriter<File>, prev_common_prefix: &mut String, pending_terms: &mut Vec<String>| {
        // Write the prefix (if there are frontcoded terms) **or** just the term (pending_terms.len() == 1)
        dict_string_writer.write_all(prev_common_prefix.as_bytes()).unwrap();
                
        if pending_terms.len() > 1 {
            // Write frontcoded terms...
            dict_string_writer.write_all(&[PREFIX_FRONT_CODE]).unwrap();
            dict_string_writer.write_all(&pending_terms.remove(0).as_bytes()[prev_common_prefix.len()..]).unwrap(); // first term suffix

            for term in pending_terms {
                dict_string_writer.write_all(&[(term.len() -  prev_common_prefix.len()) as u8]).unwrap();
                dict_string_writer.write_all(&[SUBSEQUENT_FRONT_CODE]).unwrap();
                dict_string_writer.write_all(&term.as_bytes()[prev_common_prefix.len()..]).unwrap();
            }
        }
    };

    // Dictionary table / Postings list trackers
    let mut curr_pl = 0;
    let mut curr_pl_offset: u32 = 0;

    println!("Starting main decode loop! Num postings streams {}", postings_streams.len());
    while !postings_streams.is_empty() {
        let mut postings_stream = postings_streams.pop().unwrap();
        // println!("term {} idx {} first doc {}", postings_stream.curr_term, postings_stream.idx, postings_stream.curr_term_docs[0].doc_id);
        if postings_stream.is_empty {
            continue;
        }

        if prev_term == postings_stream.curr_term {
            // Add on
            prev_combined_term_docs.extend(std::mem::take(&mut postings_stream.curr_term_docs));
            
            if !postings_streams.is_empty() {
                // Plop the next term from the term buffer into curr_term and curr_term_docs
                postings_stream.get_term(&postings_stream_readers, rx_main, workers, &blocking_sndr, &blocking_rcvr);
                postings_streams.push(postings_stream);
                continue; // go to the next postings stream which has the same term, if any.
            }
        }

        // Commit the **previous** term's n-way merged postings (curr_combined_term_docs),
        // and dictionary table, dictionary-as-a-string for the term.

        // ---------------------------------------------
        // Dictionary table writing: gap (1 byte), doc freq (var-int), pl offset (u16)
        let difference: u8 = if curr_pl_offset == 0 { 1 } else { 0 };
        dict_table_writer.write_all(&[difference]).unwrap();
        
        dict_table_writer.write_all(&get_var_int(prev_combined_term_docs.len() as u32)).unwrap();

        dict_table_writer.write_all(&(curr_pl_offset as u16).to_le_bytes()).unwrap();

        // ---------------------------------------------
        // Postings writing
        let mut prev_doc_id = 0;
        for mut term_doc in prev_combined_term_docs {
            // println!("term {} curr {} prev {}", prev_term, term_doc.doc_id, prev_doc_id);
            let doc_id_gap_varint = get_var_int(term_doc.doc_id - prev_doc_id);
            pl_writer.write_all(&doc_id_gap_varint).unwrap();
            prev_doc_id = term_doc.doc_id;

            curr_pl_offset += (doc_id_gap_varint.len()
                + term_doc.doc_fields.len()) as u32; // field id contribution

            let mut write_doc_field = |doc_field: DocField, pl_writer: &mut BufWriter<File>| {
                let field_tf_varint = get_var_int(doc_field.field_positions.len() as u32);
                pl_writer.write_all(&field_tf_varint).unwrap();
                curr_pl_offset += field_tf_varint.len() as u32;

                /* for i in 0..doc_field.field_positions.len() {
                    println!("prev_term {} doc {} curr pos {} next pos {}", prev_term, prev_doc_id, doc_field.field_positions[i],
                        if i == (doc_field.field_positions.len() - 1) { 999999999 } else { doc_field.field_positions[i + 1] });
                } */
                /* if prev_doc_id == 3552 {
                    return;
                } */

                let mut prev_pos = 0;
                for field_term_pos in doc_field.field_positions {
                    //println!("prev_term {} doc {} curr pos {} prev pos {}", prev_term, prev_doc_id, field_term_pos, prev_pos);
                    let pos_gap_varint = get_var_int(field_term_pos - prev_pos);
                    pl_writer.write_all(&pos_gap_varint).unwrap();
                    curr_pl_offset += pos_gap_varint.len() as u32;
                    prev_pos = field_term_pos;
                }
            };

            let last_doc_field = term_doc.doc_fields.remove(term_doc.doc_fields.len() - 1);

            for doc_field in term_doc.doc_fields {
                let field_id = doc_field.field_id;
                pl_writer.write_all(&[field_id]).unwrap();
                write_doc_field(doc_field, &mut pl_writer);
            }

            let last_field_id = last_doc_field.field_id | LAST_FIELD_MASK;
            pl_writer.write_all(&[last_field_id]).unwrap();
            write_doc_field(last_doc_field, &mut pl_writer);
        }
        // ---------------------------------------------

        // ---------------------------------------------
        // Dictionary string writing
        // With simultaneous front coding
        // For frontcoding, candidates are temporarily stored
        if pending_terms.is_empty() {
            prev_common_prefix = prev_term.clone();
            pending_terms.push(prev_term.clone());
        } else {
            // Compute the cost if we add this term in, it should be <= 0 to also frontcode this term
            // TODO make this optimal?
            let unicode_prefix_byte_len = get_common_unicode_prefix_byte_len(&prev_common_prefix, &prev_term);
            // println!("{} {} ", prev_common_prefix.len(), unicode_prefix_byte_len);
            let frontcode_cost: i32 = (pending_terms.len() * (prev_common_prefix.len() - unicode_prefix_byte_len)) as i32 // num already frontcoded terms * prefix length reduction
                + 2 // len + symbol
                + (if pending_terms.len() == 1 { 1 } else { 0 })
                - unicode_prefix_byte_len as i32 /* expands to + (prev_term.len() - unicode_prefix_byte_len) - prev_term.len() */;
    
            if frontcode_cost <= 0 {
                prev_common_prefix = prev_common_prefix[0..unicode_prefix_byte_len].to_owned();
                pending_terms.push(prev_term.clone());
            } else {
                write_pending_terms(&mut dict_string_writer, &mut prev_common_prefix, &mut pending_terms);

                prev_common_prefix = prev_term.clone();
                pending_terms = vec![prev_term.clone()];
            }
        }
        // ---------------------------------------------

        // ---------------------------------------------
        // Split postings file if necessary
        if curr_pl_offset > POSTINGS_FILE_LIMIT {
            pl_writer.flush().unwrap();

            curr_pl += 1;
            curr_pl_offset = 0;
            pl_writer = BufWriter::new(
                File::create(
                    Path::new(output_folder_path).join(format!("pl_{}", curr_pl))
                ).expect("Failed to create new buffered writer for new postings list.")
            );
        }
        // ---------------------------------------------

        // Update some things
        prev_term = std::mem::take(&mut postings_stream.curr_term);
        prev_combined_term_docs = std::mem::take(&mut postings_stream.curr_term_docs);

        // ---------------------------------------------
        // Plop the next term from the term buffer into the stream
        // Then push it back into the heap.
        postings_stream.get_term(&postings_stream_readers, rx_main, workers, &blocking_sndr, &blocking_rcvr);
        postings_streams.push(postings_stream);
        // ---------------------------------------------
    }

    println!("Commiting pending terms");

    // Commit frontcoded terms
    write_pending_terms(&mut dict_string_writer, &mut prev_common_prefix, &mut pending_terms);

    dict_table_writer.flush().unwrap();
    pl_writer.flush().unwrap();
    dict_string_writer.flush().unwrap();
}