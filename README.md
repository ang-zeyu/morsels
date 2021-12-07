# Morsels.`j/rs` 🧀

A complete and more scalable pre-built index approach to client-side search.

---

## Description

Morsels is a complete **client-side** search solution, including a search **user interface and library** that depends on a **pre-built index** generated by a **command-line build tool**.

The secondary value proposition here versus other pre-built index options is the splitting of this index to many smaller chunks ("morsels"), which enables the client to retrieve and load only what it needs when searched. This avoids blowing up network and memory usage immediately on startup.

## Features

- Multi-threaded command-line indexer powered by Rust
- WebWorker / WebAssembly (Rust) powered search
- Standard set of boolean, phrase query syntax
- Customisable dropdown / fullscreen popup user interface
- A plugin for mdbook!

## Use Cases

As you might imagine, the main target use case for this tool right now, is providing a complete search solution for static sites (and possibly really large ones) or static site generators. That said, the indexing tool was built with support for a few other file formats (`.json`, `.csv`, `.html`) in mind, and might be useful elsewhere as such.

If you find other use cases for this tool, do leave a post in the issue tracker!

## Getting Started & Demo

Please check out the [docs](http://ang-zeyu.github.io/morsels/).

## Contributing

Contributions are highly welcome! Please refer to the [setup guide](http://ang-zeyu.github.io/morsels/contributing.html) to get started.

## License

This project is [MIT licensed](./LICENSE.md).
