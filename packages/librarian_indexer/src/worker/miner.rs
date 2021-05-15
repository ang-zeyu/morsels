use std::borrow::Cow;
use regex::Regex;
use std::cmp::Ordering;
use std::collections::HashMap;
use std::fs::File;
use std::io::BufWriter;
use std::io::Write;
use std::path::PathBuf;
use std::str;
use std::sync::Arc;

use crate::FieldInfos;
use crate::tokenize::english::tokenize;

pub struct DocField {
    pub field_id: u8,
    pub field_positions: Vec<u32>
}

pub struct TermDoc {
    pub doc_id: u32,
    pub doc_fields: Vec<DocField>
}

// Intermediate BSBI miner for use in a worker
// Outputs (termID, docID, fieldId, fieldTf, positions ...., fieldId, fieldTf, positions ....) tuples
pub struct WorkerMiner {
    pub field_infos: Arc<FieldInfos>,

    pub terms: HashMap<String, Vec<TermDoc>>
}

pub struct TermDocComparator {
    pub val: TermDoc,
    pub idx: usize
}

impl Eq for TermDocComparator {}

impl Ord for TermDocComparator {
    fn cmp(&self, other: &Self) -> Ordering {
        other.val.doc_id.cmp(&self.val.doc_id)
    }
}

impl PartialOrd for TermDocComparator {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(other.val.doc_id.cmp(&self.val.doc_id))
    }
}

impl PartialEq for TermDocComparator {
    fn eq(&self, other: &Self) -> bool {
        self.val.doc_id == other.val.doc_id
    }
}

// Adapted from https://lise-henry.github.io/articles/optimising_strings.html
fn find_u8_unsafe_morecap<'a, S: Into<Cow<'a, str>>>(input: S) -> Cow<'a, str> {
    lazy_static! {
        static ref REGEX: Regex = Regex::new(r#"[\n\r\t"\\]"#).unwrap();
    }
    let input = input.into();
    let first = REGEX.find(&input);
    if let Some(first) = first {
        let start = first.start();
        let len = input.len();
        let mut output:Vec<u8> = Vec::with_capacity(len + len/2);
        output.extend_from_slice(input[0..start].as_bytes());
        let rest = input[start..].bytes();
        for c in rest {
            match c {
                b'\n' => output.extend_from_slice(b"\\n"),
                b'\r' => output.extend_from_slice(b"\\r"),
                b'\t' => output.extend_from_slice(b"\\t"),
                b'"' => output.extend_from_slice(b"\\\""),
                b'\\' => output.extend_from_slice(b"\\"),
                _ => output.push(c),
            }
        }
        Cow::Owned(unsafe { String::from_utf8_unchecked(output) })
    } else {
        input
    }
}

impl WorkerMiner {
    pub fn index_doc(&mut self, doc_id: u32, field_texts: Vec<(String, String)>, field_store_path: PathBuf) {
        let mut field_store_buffered_writer = BufWriter::new(File::create(field_store_path).expect("Failed to open field store file for writing!"));
        field_store_buffered_writer.write_all(b"[").unwrap();

        for (field_name, field_text) in field_texts {
            let mut field_pos = 0;
            let field_info = self.field_infos.get(&field_name).expect(&format!("Inexistent field: {}", field_name));
            let field_id = field_info.id;

            // Store raw text
            if field_info.do_store {
                field_store_buffered_writer.write_all(format!("[{},\"", field_id).as_bytes()).unwrap();
                field_store_buffered_writer.write_all(find_u8_unsafe_morecap(&field_text).as_bytes()).unwrap();
                field_store_buffered_writer.write_all(b"\"]").unwrap();
            }

            if field_info.weight == 0.0 {
                continue;
            }

            let field_terms = tokenize(&field_text);

            for field_term in field_terms {
                field_pos += 1;

                let term_docs = self.terms.entry(field_term).or_insert_with(Vec::new);

                let term_doc: &mut TermDoc = if let Some(term_doc) = term_docs.last_mut() {
                    if term_doc.doc_id != doc_id {
                        term_docs.push(TermDoc {
                            doc_id,
                            doc_fields: Vec::new()
                        });
                        term_docs.last_mut().unwrap()
                    } else {
                        term_doc
                    }
                } else {
                    term_docs.push(TermDoc {
                        doc_id,
                        doc_fields: Vec::new()
                    });
                    term_docs.last_mut().unwrap()
                };

                let doc_field: &mut DocField = if let Some(doc_field) = term_doc.doc_fields.last_mut() {
                    if doc_field.field_id != field_id {
                        term_doc.doc_fields.push(DocField {
                            field_id,
                            field_positions: Vec::new()
                        });
                        term_doc.doc_fields.last_mut().unwrap()
                    } else {
                        doc_field
                    }
                } else {
                    term_doc.doc_fields.push(DocField {
                        field_id,
                        field_positions: Vec::new()
                    });
                    term_doc.doc_fields.last_mut().unwrap()
                };

                doc_field.field_positions.push(field_pos);
            }
        }

        field_store_buffered_writer.write_all(b"]").unwrap();
        field_store_buffered_writer.flush().unwrap();
    }
}
