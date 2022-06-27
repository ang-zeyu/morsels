# Morsels.`j/rs`

![CI workflow](https://github.com/ang-zeyu/morsels/actions/workflows/ci.yml/badge.svg)

Feature rich client-side search for static sites.

## Description

Morsels is a complete client-side search solution tailored for static sites, including a search *user interface and library* that depends on a *pre-built index* generated by a *command-line* tool.

![Preview of Morsels search ui](./docs/src/images/light-theme-joined.png)

## Features

- **Multi-threaded** 🏇 CLI indexer powered by Rust
- **Typo tolerance** ⌨ with spelling correction and automatic prefix search
- **Feature-rich search** 🔍: boolean queries, field filters, phrase queries, BM25 scoring, query term proximity boosts, persistent caching and WebWorker built-in
- Powered by **WebAssembly**, enabling efficient index (de)compression and query processing 
- **Semi-Scalable** 📈, achieved by (optionally) splitting the index into chunks ("morsels").
- **Incremental** Indexing
- **Customisable** and **Accessible** dropdown / fullscreen popup user [interface](http://ang-zeyu.github.io/morsels/search_configuration_styling.html) 🖥️

## Use Cases

The main target use case for this tool right now is providing a complete and feature-rich, but efficient search solution for static sites or static site generators.

The indexing tool supports a few other file formats (`.json`, `.csv`, `.pdf`, `.html`) as well, which can help support more custom data requirements (e.g. linking to another domain).

## Getting Started

Powering static site search requires just a folder of your HTML files! Titles, links, headings, etc. are automatically sourced.

Please check out the [documentation](http://ang-zeyu.github.io/morsels/getting_started.html), which also uses Morsels for its search function.

A much heavier demo on a 500MB, 52000 document Gutenberg collection subcorpus is also available [here](https://ang-zeyu.github.io/morsels-demo-1/).

## Contributing

Contributions are highly welcome! Please see [contributing.md](./CONTRIBUTING.md) to get started.

## License

This project is [MIT licensed](./LICENSE.md).
