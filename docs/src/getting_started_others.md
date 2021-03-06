# Others

Since its indexer is essentially just a CLI tool, Morsels could be used almost anywhere (e.g. other static site generators) even without a custom wrapper implementation (e.g. the Mdbook plugin).

For example, to deploy another static site generator's output to gh-pages using github actions, simply chain the morsels tool on top of the static site generator output, after you've linked the necessary scripts:

```yml
name: docs
on:
  push:
    branches:
      - docs
jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build documentation
        run: # <insert your favourite ssg build command>
      - name: Install Morsels
        run: cargo install morsels_indexer # or, using the binary release
      - name: Run Morsels
        run: morsels <docs_build_folder> <docs_build_folder/morsels_output> -c <morsels_config_path>
      - name: Deploy to github pages 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.5
        with:
          branch: gh-pages
          folder: <docs_build_folder>
```
