# Getting Started

This page assumes the use case of a **static site**, that is:
- You have some HTML files you want to index.
- These HTML files are served in a static file server, and are linkable to.
- You have an `<input>` element to attach a search dropdown to.
  <details>
  <summary><em>For mobile devices</em></summary>
  <br>A fullscreen UI will show instead when the input element is focused.

  This documentation uses an alternative user interface (try the search function!), which is covered [later](./search_configuration.md#ui-mode).
  To preview the defaults, head on over [here](./search_configuration_styling.html).
  </details>

If you require more (e.g. indexing custom json files), have a quick look through here, then head on over to the subsequent configuration pages.

## Installing the indexer

There are two options here:
- If you have the rust / cargo toolchains setup, simply run `cargo install morsels_indexer --vers 0.2.1`.
- Alternatively, the cli binaries are also available [here](https://github.com/ang-zeyu/morsels/releases).

## Running the indexer

Run the executable as such, replacing `<source-folder-path>` with the relative or absolute folder path of your source html files, and `<output-folder-path>` with your desired index output folder.

```
morsels <source-folder-path> <output-folder-path>
```

If you are using the binaries, replace `morsels` with the appropriate executable name.

### Other Cli Options

- `-c <config-file-path>`: You may also change the config file location (relative to the `source-folder-path`) using the `-c <config-file-path>` option.
- `--preserve-output-folder`: All existing contents in the output folder are removed before starting. Specify this option to avoid this.

## Installing the search UI

### Installation via CDN

```html
<!-- Replace "v0.2.1" as appropriate -->

<!--  Search UI script -->
<script src="https://cdn.jsdelivr.net/gh/ang-zeyu/morsels@v0.2.1/packages/search-ui/dist/search-ui.bundle.js"></script>
<!-- Search UI css, this provides some basic styling for the search dropdown, and can be omitted if desired -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/ang-zeyu/morsels@v0.2.1/packages/search-ui/dist/search-ui-light.css" />
```

> ?????? Ensure the versions here **match the indexer version** used exactly.

### Hosting the Files

If you wish to serve the files locally instead, you can find the necessary files in the release packages [here](https://github.com/ang-zeyu/morsels/releases). The following files inside `search.morsels.zip` are required:

- `search-ui.bundle.js`
- Either `search-ui-light.css` / `search-ui-dark.css`
  - unless you want to design your own stylesheet from scratch!
- A pair of language-specific bundles which are requested as necessary at runtime.
  - `search.worker-*.bundle.js`
  - an accompanying wasm binary

> ?????? All files are expected to be **accessible in the same folder** relative to the linked `search-ui.bundle.js`.

### UI Initialisation

Once you have loaded the bundles, simply call the `initMorsels` function in your page.

This requires an input element with an `id=morsels-search` to be present in the page by default. The `id` can be configured via `uiOptions.input`.

```ts
initMorsels({
  searcherOptions: {
    // Output folder url specified as the second parameter in the cli command
    // Urls like '/output/' will work as well
    url: 'http://<your-domain>/output/',
  },
  uiOptions: {
    // Input / source folder url, specified as the first parameter in the cli command
    sourceFilesUrl: 'http://<your-domain>/source/',
    input: 'morsels-search',
  }
});
```

## What's Next

Head on over to the search configuration chapter to learn more about configuring the UI behaviours / outputs.

The indexer configuration chapters covers a wide range of topics such as adding additional fields to index, mapping file contents to fields, and language configurations.
