# Developing

## Building and Running the Development Site

Once you have you test files placed in the correct folder per the previous chapter, run the `npm run index1` script to index your content, then run `npm run devServer1` to serve up the indexer's output on port `3000`.

Finally, use the `npm run dev` script to open the development site on port `8080`. This script runs the webpack build process, which in turn triggers the WebAssembly build process as well through the wasm-pack webpack plugin.

## Working With the mdbook-morsels Plugin

As mdbook plugins are basically separate executables, operating on `stdin / stdout`, you'll need to first run `npm run installIndexer` to build and install the indexer command-line tool to your `PATH`. (including whenever changes are made to the indexer code)

Next, run the `npm run devdocs` script, which similarly build and installs the `mdbook-morsels` executable. This script then serves up the documentation at port `8000`.