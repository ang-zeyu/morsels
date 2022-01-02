pub mod query;
pub mod query_parser;
pub mod query_preprocessor;
pub mod query_processor;
pub mod query_retriever;

use std::collections::HashSet;

use morsels_common::BITMAP_DOCINFO_DICT_TABLE_FILE;
use morsels_common::BitmapDocinfoDicttableReader;
use morsels_common::dictionary;
use morsels_common::dictionary::DICTIONARY_STRING_FILE_NAME;
use serde::Deserialize;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsCast;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;
use web_sys::Response;

use crate::dictionary::Dictionary;
use crate::docinfo::DocInfo;
use crate::postings_list_file_cache::PostingsListFileCache;

#[cfg(feature = "lang_ascii")]
use morsels_lang_ascii::ascii;
#[cfg(feature = "lang_latin")]
use morsels_lang_latin::latin;
#[cfg(feature = "lang_chinese")]
use morsels_lang_chinese::chinese;

use morsels_common::tokenize::Tokenizer;
use morsels_common::MorselsLanguageConfig;
use query_parser::{parse_query, QueryPart, QueryPartType};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SearcherConfig {
    indexing_config: IndexingConfig,
    lang_config: MorselsLanguageConfig,
    field_infos: Vec<FieldInfo>,
    num_scored_fields: usize,
    searcher_options: SearcherOptions,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct IndexingConfig {
    pl_names_to_cache: Vec<u32>,
    num_pls_per_dir: u32,
    with_positions: bool,
}

#[derive(Deserialize)]
struct FieldInfo {
    name: String,
    weight: f32,
    k: f32,
    b: f32,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SearcherOptions {
    url: String,
    number_of_expanded_terms: usize,
    pub use_query_term_proximity: bool,
    use_wand: Option<usize>,
    result_limit: Option<u32>,
}

#[wasm_bindgen]
pub struct Searcher {
    dictionary: Dictionary,
    tokenizer: Box<dyn Tokenizer>,
    doc_info: DocInfo,
    pl_file_cache: PostingsListFileCache,
    searcher_config: SearcherConfig,
    invalidation_vector: Vec<u8>,
}

#[cfg(feature = "lang_ascii")]
fn get_tokenizer(lang_config: &mut MorselsLanguageConfig) -> Box<dyn Tokenizer> {
    if let Some(options) = &mut lang_config.options {
        Box::new(ascii::new_with_options(serde_json::from_value(std::mem::take(options)).unwrap(), true))
    } else {
        Box::new(ascii::Tokenizer::default())
    }
}

#[cfg(feature = "lang_latin")]
fn get_tokenizer(lang_config: &mut MorselsLanguageConfig) -> Box<dyn Tokenizer> {
    if let Some(options) = &mut lang_config.options {
        Box::new(latin::new_with_options(serde_json::from_value(std::mem::take(options)).unwrap(), true))
    } else {
        Box::new(latin::Tokenizer::default())
    }
}

#[cfg(feature = "lang_chinese")]
fn get_tokenizer(lang_config: &mut MorselsLanguageConfig) -> Box<dyn Tokenizer> {
    if let Some(options) = &mut lang_config.options {
        Box::new(chinese::new_with_options(serde_json::from_value(std::mem::take(options)).unwrap(), true))
    } else {
        Box::new(chinese::Tokenizer::default())
    }
}

#[allow(dead_code)]
#[wasm_bindgen]
pub async fn get_new_searcher(config_js: JsValue) -> Result<Searcher, JsValue> {
    let mut searcher_config: SearcherConfig = config_js.into_serde().expect("Morsels config does not match schema");

    let window: web_sys::Window = js_sys::global().unchecked_into();

    let bitmap_docinfo_dt_future = JsFuture::from(
        window.fetch_with_str(&(searcher_config.searcher_options.url.to_owned() + BITMAP_DOCINFO_DICT_TABLE_FILE)),
    );
    let string_resp_future = JsFuture::from(
        window.fetch_with_str(&(searcher_config.searcher_options.url.to_owned() + DICTIONARY_STRING_FILE_NAME))
    );

    let bitmap_docinfo_dt_resp: Response = bitmap_docinfo_dt_future.await?.dyn_into().unwrap();
    let bitmap_docinfo_dt_buf = JsFuture::from(bitmap_docinfo_dt_resp.array_buffer()?).await?;
    let bitmap_docinfo_dt = js_sys::Uint8Array::new(&bitmap_docinfo_dt_buf).to_vec();
    let mut bitmap_docinfo_dt_rdr = BitmapDocinfoDicttableReader { buf: bitmap_docinfo_dt, pos: 0 };

    let mut invalidation_vector = Vec::new();
    bitmap_docinfo_dt_rdr.read_invalidation_vec(&mut invalidation_vector);

    let doc_info = DocInfo::create(&mut bitmap_docinfo_dt_rdr, searcher_config.num_scored_fields);

    let tokenizer = get_tokenizer(&mut searcher_config.lang_config);
    let build_trigram = tokenizer.use_default_trigram();

    let string_resp: Response = string_resp_future.await?.dyn_into().unwrap();
    let string_array_buffer = JsFuture::from(string_resp.array_buffer()?).await?;
    let string_vec = js_sys::Uint8Array::new(&string_array_buffer).to_vec();

    #[cfg(feature = "perf")]
    let performance = window.performance().unwrap();
    #[cfg(feature = "perf")]
    let start = performance.now();

    let dictionary = dictionary::setup_dictionary(
        bitmap_docinfo_dt_rdr.get_dicttable_slice(), string_vec, doc_info.num_docs, build_trigram,
    );

    #[cfg(feature = "perf")]
    web_sys::console::log_1(
        &format!("Finished reading bitmap_docinfo_dt_rdr. Pos {} Len {}",
        bitmap_docinfo_dt_rdr.pos, bitmap_docinfo_dt_rdr.buf.len(),
    ).into());

    #[cfg(feature = "perf")]
    web_sys::console::log_1(
        &format!("Dictionary initial setup took {}, num terms {}",
        performance.now() - start, dictionary.term_infos.len(),
    ).into());

    let pl_file_cache = PostingsListFileCache::create(
        &searcher_config.searcher_options.url,
        &searcher_config.indexing_config.pl_names_to_cache,
        searcher_config.indexing_config.num_pls_per_dir,
    )
    .await;

    Ok(Searcher { dictionary, tokenizer, doc_info, pl_file_cache, searcher_config, invalidation_vector })
}

#[wasm_bindgen]
impl Searcher {
    pub fn get_ptr(&self) -> *const Searcher {
        self
    }
}

fn get_searched_terms(query_parts: &[QueryPart], seen: &mut HashSet<String>, result: &mut Vec<String>) {
    for query_part in query_parts {
        if let Some(terms) = &query_part.terms {
            if query_part.is_stop_word_removed {
                result.push(query_part.original_terms.as_ref().unwrap()[0].clone());
            }

            for term in terms {
                if seen.contains(term) {
                    continue;
                }
                seen.insert(term.clone());
                result.push(term.clone());
            }
        } else if let Some(children) = &query_part.children {
            get_searched_terms(children, seen, result);
        }
    }
}

#[allow(dead_code)]
#[wasm_bindgen]
pub async fn get_query(searcher: *const Searcher, query: String) -> Result<query::Query, JsValue> {
    #[cfg(feature = "perf")]
    let window: web_sys::Window = js_sys::global().unchecked_into();
    #[cfg(feature = "perf")]
    let performance = window.performance().unwrap();
    #[cfg(feature = "perf")]
    let start = performance.now();

    let searcher_val = unsafe { &*searcher };
    let mut query_parts = parse_query(query, &*searcher_val.tokenizer);

    #[cfg(feature = "perf")]
    web_sys::console::log_1(&format!("parse query took {}", performance.now() - start).into());

    let is_free_text_query = query_parts.iter().all(|query_part| {
        if let QueryPartType::Term = query_part.part_type {
            query_part.field_name.is_none()
        } else {
            false
        }
    });

    searcher_val.preprocess(&mut query_parts, is_free_text_query);

    #[cfg(feature = "perf")]
    web_sys::console::log_1(&format!("Preprocess took {}, is_free_text_query {}", performance.now() - start, is_free_text_query).into());

    let term_pls = searcher_val.populate_term_pls(&mut query_parts).await?;

    #[cfg(feature = "perf")]
    web_sys::console::log_1(&format!("Population took {}", performance.now() - start).into());

    let pls = searcher_val.process(&mut query_parts, term_pls);

    #[cfg(feature = "perf")]
    web_sys::console::log_1(&format!("Process took {}", performance.now() - start).into());

    let mut searched_terms: Vec<String> = Vec::new();
    get_searched_terms(&query_parts, &mut HashSet::new(), &mut searched_terms);

    let use_wand = is_free_text_query && searcher_val.searcher_config.searcher_options.use_wand.is_some();
    let wand_n = searcher_val.searcher_config.searcher_options.use_wand.unwrap_or(20);
    let result_limit = searcher_val.searcher_config.searcher_options.result_limit;
    let query = searcher_val.create_query(searched_terms, query_parts, pls, result_limit, use_wand, wand_n);

    #[cfg(feature = "perf")]
    web_sys::console::log_1(&format!("Ranking took {}", performance.now() - start).into());

    Ok(query)
}

#[cfg(test)]
pub mod test {
    use rustc_hash::FxHashMap;

    use morsels_common::MorselsLanguageConfig;
    use morsels_lang_ascii::ascii;

    use super::{FieldInfo, IndexingConfig, Searcher, SearcherConfig, SearcherOptions};
    use crate::dictionary::Dictionary;
    use crate::docinfo::DocInfo;
    use crate::postings_list_file_cache;

    pub fn create_searcher(num_docs: usize, num_fields: usize) -> Searcher {
        let mut field_infos = Vec::new();
        for i in 0..num_fields {
            field_infos.push(FieldInfo {
                name: format!("field{}", i).to_owned(),
                weight: 0.3,
                k: 1.2,
                b: 0.75,
            });
        }

        Searcher {
            dictionary: Dictionary { term_infos: FxHashMap::default(), trigrams: FxHashMap::default() },
            tokenizer: Box::new(ascii::Tokenizer::default()),
            doc_info: DocInfo {
                doc_length_factors: vec![vec![1.0; num_fields]; num_docs],
                doc_length_factors_len: num_docs as u32,
                num_docs: num_docs as u32,
            },
            pl_file_cache: postings_list_file_cache::test::get_empty(),
            searcher_config: SearcherConfig {
                indexing_config: IndexingConfig {
                    pl_names_to_cache: Vec::new(),
                    num_pls_per_dir: 0,
                    with_positions: true,
                },
                lang_config: MorselsLanguageConfig {
                    lang: "latin".to_owned(),
                    options: serde_json::from_str("{}").unwrap(),
                },
                field_infos,
                num_scored_fields: num_fields,
                searcher_options: SearcherOptions {
                    url: "/".to_owned(),
                    number_of_expanded_terms: 0,
                    use_query_term_proximity: true,
                    use_wand: None,
                    result_limit: None,
                },
            },
            invalidation_vector: vec![0; num_docs],
        }
    }
}
