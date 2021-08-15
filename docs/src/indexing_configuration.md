# Indexer Configuration

All indexer configurations are sourced from a json file. By default, the cli tool looks for `_morsels_config.json` in the source folder (first argument) specified in the command.

Run the cli command with the `--init` option to initialise the default configuration file instead.

## `fields_config`

The first step to indexing any documents is defining the field configurations.

The default configurations are as follows, already setup for interfacing with the `@morsels/search-ui` package.

```json
{
  "fields_config": {
    "field_store_block_size": 1,
    "fields": [
      {
        "name": "title",
        "do_store": false,
        "weight": 0.2,
        "k": 1.2,
        "b": 0.25
      },
      {
        "name": "heading",
        "do_store": false,
        "weight": 0.3,
        "k": 1.2,
        "b": 0.3
      },
      {
        "name": "body",
        "do_store": false,
        "weight": 0.5,
        "k": 1.2,
        "b": 0.75
      },
      {
        "name": "headingLink",
        "do_store": false,
        "weight": 0.0,
        "k": 1.2,
        "b": 0.75
      },
      // Internal field sourced from the relative file path of the file from the root directory
      {
        "name": "_relative_fp",
        "do_store": true,
        "weight": 0.0,
        "k": 1.2,
        "b": 0.75
      }
    ]
  }
}
```

**`field_store_block_size` and `do_store`**

Morsels stores fields that have `do_store: true` specified in the field configuration into a json file in the output folder.

At search time, the search-lib package populates fields saved in this manner through the json files.

The `field_store_block_size` parameter controls how many documents to store in one such json file. Batching multiple files together if the fields stored are small can lead to less files and better browser caching.

**`weight`**

This parameter simply specifies the weight the field should have during scoring. Specifying `0.0` will result in the field not being indexed.

**`k` & `b`**

These are Okapi BM25 model parameters. The following [article](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables) provides a good overview on how to configure these, although, the defaults should serve sufficiently.

### Fields Needed for @morsels/search-ui

The search-ui package, *by default*, requires **at least** one of the `body` / `heading` / `title` fields, and the `_relative_fp` field above.

The body field (and title, headings if available) are used to generate the result preview, whilst the `_relative_fp` field is used for navigating to the generated result.

The next [chapter](search_ui_configuration.md) will detail several options to help rename these fields, or even add additional fields and render them in result previews.

## `language`

The snippet below shows the default values for language configuration. The key controlling the main tokenizer module to use is the `lang` key (only `latin` is supported for now). The `options` key supplies tokenization options unique to each module.

Note that these options are also applied to the search library, which uses the same tokenizers through wasm.

```json
{
  "language": {
    "lang": "latin",
    "options": null
  }
}
```

### Latin Tokenizer

The default tokenizer splits on sentences, then whitespaces into terms.

*Tantivy*'s [asciiFoldingFilter](https://github.com/tantivy-search/tantivy/blob/main/src/tokenizer/ascii_folding_filter.rs) is then applied, followed by punctuation and non-word boundary removal.

If specified, a stemmer is also applied.

```json
"options": {
  // Stop words are only filtered at query time, allowing phrase queries and such to function
  "stop_words": ["a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into",
    "is", "it", "no", "not", "of", "on", "or", "such", "that", "the", "their", "then",
    "there", "these", "they", "this", "to", "was", "will", "with"],
  // any of the languages here https://docs.rs/rust-stemmers/1.2.0/rust_stemmers/enum.Algorithm.html
  // for example, "english"
  "stemmer": null,
  "max_term_len": 80
}
```

### Chinese Tokenizer

A basic `chinese` tokenizer based on [jieba-rs](https://github.com/messense/jieba-rs) is also available, although, it is still a heavy WIP at the moment. Use at your own discretion.

```json
"options": {
  "stop_words": []
}
```


### Size Considerations for Language Modules

While using the same tokenizer for both indexing / search unifies the codebase, one downside is that code size has to be taken into account.

The chinese tokenizer for example, which uses *jieba-rs*, accounts for half of the wasm binary size alone.

Therefore, the tokenizers will aim to be reasonably powerful and configurable enough, such that wasm size dosen't blow up. At least, until dynamic linking in wasm ala llvm / rust reaches maturity.

## `indexing_config`

All configurations are optional (reasonable defaults), save for the `loader_configs` key. The cli tool will simply do nothing if no loaders are specified.

The snippet below shows the default values, which need not be altered if you are only indexing html files.

```json
{
  "indexing_config": {
    "num_threads": 5,              // by default, this is num physical cores - 1
    "num_docs_per_block": 1000,    // this roughly controls the memory usage of the indexer
    "exclude": [
      "_morsels_config.json"       // glob patterns to exclude from indexing
    ],
    "loader_configs": {
      "HtmlLoader": {}
    },

    // Any postings lists ("morsels") above this size (in bytes)
    // will be pre-loaded on initialisation of the search library
    "pl_cache_threshold": 1048576,
    
    // Number of postings lists ("morsels") to store per directory
    "num_pls_per_dir": 1000,

    // Number of field stores (`.json` files) to store per directory
    "num_stores_per_dir": 1000,

    // Whether positions will be stored.
    // Phrase queries / related features will be unavailable if this is false.
    // You'll want this for obscenely large collections.
    "with_positions": true
  }
}
```

### Loaders

The indexer is able to handle html, json or csv files. Support for each file type is provided by a "`Loader`" abstraction.

You may configure loaders by including them under the `loader_configs` key, with any applicable options.

The below sections shows the available loaders and configuration options available for each of them.

`HtmlLoader`

```json
{
  "HtmlLoader": {
    "exclude_selectors": [], // list of selectors to exclude from indexing. Empty by default.
    "selectors": [
      {
        "attr_map": {},
        "field_name": "title",
        "selector": "title"
      },
      {
        "attr_map": {},
        "field_name": "body",
        "selector": "body"
      },
      {
        "attr_map": {
          "id": "headingLink" // "store the id attribute of any heading under headingLink"
        },
        "field_name": "heading",
        "selector": "h1,h2,h3,h4,h5,h6"
      }
    ]
  }
}
```

Each **selector** configuration above has a mandatory `field_name`. All nodes (text / elements) under this selector will be indexed under the specified field name.

`JsonLoader`

```json
{
  "JsonLoader": {
    "field_map": {
      "body": "body",
      "heading": "heading",
      "link": "_relative_fp",
      "title": "title"
    },
    // Order in which to index the fields of the json {} document
    "field_order": [
      "title",
      "heading",
      "body",
      "link"
    ]
  }
}
```

`CsvLoader`

```json
{
  "CsvLoader": {
    "header_field_map": {},
    "header_field_order": [],
    "index_field_map": {
      "0": "link",
      "1": "title",
      "2": "body",
      "4": "heading"
    },
    "index_field_order": [
      1,
      4,
      2,
      0
    ],
    "parse_options": {
      "comment": null,
      "delimiter": 44,
      "double_quote": true,
      "escape": null,
      "has_headers": true,
      "quote": 34
    },
    "type": "CsvLoader",
    "use_headers": false
  }
}
```

Field mappings for csv can be configured using one of the `field_map / field_order` pairs, and the `use_headers` parameter.




## Full Example

```json
{
  "fields_config": {
    "field_store_block_size": 100,
    "fields": [
      {
        "name": "title",
        "do_store": false,
        "weight": 0.2,
        "k": 1.2,
        "b": 0.25
      },
      {
        "name": "heading",
        "do_store": false,
        "weight": 0.3,
        "k": 1.2,
        "b": 0.3
      },
      {
        "name": "body",
        "do_store": false,
        "weight": 0.5,
        "k": 1.2,
        "b": 0.75
      },
      {
        "name": "headingLink",
        "do_store": false,
        "weight": 0.0,
        "k": 1.2,
        "b": 0.75
      },
      {
        "name": "_relative_fp",
        "do_store": true,
        "weight": 0.0,
        "k": 1.2,
        "b": 0.75
      }
    ]
  },
  "language": {
    "lang": "latin",
    "options": null
  },
  "indexing_config": {
    "num_docs_per_block": 1000,
    "pl_cache_threshold": 1048576,
    "exclude": [
      "_morsels_config.json"
    ],
    "loader_configs": {
      "HtmlLoader": {
        "exclude_selectors": [
          ".no-index"
        ]
      },
      "JsonLoader": {
        "field_map": {
          "body": "body",
          "heading": "heading",
          "link": "_relative_fp",
          "title": "title"
        },
        "field_order": [
          "title",
          "heading",
          "body",
          "link"
        ]
      }
    },
    "pl_names_to_cache": [],
    "num_pls_per_dir": 1000,
    "num_stores_per_dir": 1000,
    "with_positions": true
  }
}
```

