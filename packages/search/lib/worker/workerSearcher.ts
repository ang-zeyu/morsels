import { LibrarianConfig } from '../results/FieldInfo';
import WorkerQuery from './workerQuery';

export default class WorkerSearcher {
  workerQueries: {
    [query: string]: {
      [timestamp: number]: WorkerQuery
    }
  } = Object.create(null);

  wasmModule: any;

  wasmSearcher: any;

  constructor(private config: LibrarianConfig) {}

  async processQuery(query: string, timestamp: number): Promise<WorkerQuery> {
    const wasmQuery: any = await this.wasmModule.get_query(this.wasmSearcher.get_ptr(), query);

    this.workerQueries[query] = this.workerQueries[query] || {};
    this.workerQueries[query][timestamp] = new WorkerQuery(
      wasmQuery.get_searched_terms(),
      wasmQuery.get_query_parts(),
      wasmQuery,
    );

    return this.workerQueries[query][timestamp];
  }

  getQueryNextN(query: string, timestamp: number, n: number): number[] {
    return this.workerQueries[query][timestamp].getNextN(n);
  }

  freeQuery(query: string, timestamp: number) {
    if (this.workerQueries[query][timestamp]) {
      this.workerQueries[query][timestamp].free();
    }
    delete this.workerQueries[query][timestamp];
    if (Object.keys(this.workerQueries[query]).length === 0) {
      delete this.workerQueries[query];
    }
  }

  private async setupWasm() {
    const language = this.config.language.lang;
    this.wasmModule = await import(
      /* webpackChunkName: "wasm.[request]" */
      `@morsels/lang-${language}/index.js`
    );
    this.wasmSearcher = await this.wasmModule.get_new_searcher(this.config);
  }

  static async setup(data: LibrarianConfig): Promise<WorkerSearcher> {
    const workerSearcher = new WorkerSearcher(data);

    await workerSearcher.setupWasm();

    return workerSearcher;
  }
}
