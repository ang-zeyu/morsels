import './styles/search.css';

import { Searcher, Query } from '@morsels/search-lib';
import domUtils from './utils/dom';
import transformResults from './searchResultTransform';

const { h } = domUtils;

let query: Query;

let isUpdating = false;
let nextUpdate: () => any;
async function update(
  queryString: string,
  container: HTMLElement,
  searcher: Searcher,
  sourceHtmlFilesUrl: string,
): Promise<void> {
  try {
    const now = performance.now();

    if (query) {
      query.free();
    }

    container.innerHTML = '';
    container.appendChild(h('span', { class: 'morsels-loading-indicator' }));
    show(container);

    query = await searcher.getQuery(queryString);

    console.log(`getQuery "${queryString}" took ${performance.now() - now} milliseconds`);

    await transformResults(query, true, container, sourceHtmlFilesUrl);
  } catch (ex) {
    container.innerHTML = ex.message;
    throw ex;
  } finally {
    if (nextUpdate) {
      const nextUpdateTemp = nextUpdate;
      nextUpdate = undefined;
      await nextUpdateTemp();
    } else {
      isUpdating = false;
    }
  }
}

function hide(container: HTMLElement): void {
  (container.previousSibling as HTMLElement).style.display = 'none';
  container.style.display = 'none';
}

function show(container: HTMLElement): void {
  (container.previousSibling as HTMLElement).style.display = 'block';
  container.style.display = 'block';
}

function initMorsels(
  morselsOutputUrl: string,
  workerUrl: string,
  sourceHtmlFilesUrl: string,
): void {
  const input = document.getElementById('morsels-search');
  if (!input) {
    return;
  }

  const container = h('ul', { class: 'morsels-dropdown', style: 'display: none;' });
  const parent = input.parentElement;
  input.remove();
  parent.appendChild(h('div', { class: 'morsels-input-wrapper' },
    input,
    h('div', { class: 'morsels-input-dropdown-separator', style: 'display: none;' }),
    container));

  const isMobile = window.matchMedia('only screen and (max-width: 1024px)').matches;

  const searcher = new Searcher({
    url: morselsOutputUrl,
    workerUrl,
    useQueryTermExpansion: !isMobile,
    useQueryTermProximity: !isMobile,
  });

  let inputTimer: any = -1;
  input.addEventListener('input', (ev) => {
    const query = (ev.target as HTMLInputElement).value;

    if (query.length) {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        if (isUpdating) {
          nextUpdate = () => update(query, container, searcher, sourceHtmlFilesUrl);
        } else {
          isUpdating = true;
          update(query, container, searcher, sourceHtmlFilesUrl);
        }
      }, 200);
    } else {
      clearTimeout(inputTimer);
      if (isUpdating) {
        nextUpdate = () => {
          hide(container);
          isUpdating = false;
        };
      } else {
        hide(container);
      }
    }
  });

  const blurListener = () => {
    setTimeout(() => {
      let activeEl = document.activeElement;
      while (activeEl) {
        activeEl = activeEl.parentElement;
        if (activeEl === container) {
          input.focus();
          return;
        }
      }
      hide(container);
    }, 100);
  };

  input.addEventListener('blur', blurListener);

  input.addEventListener('focus', () => {
    if (container.childElementCount) {
      show(container);
    }
  });
}

export default initMorsels;
