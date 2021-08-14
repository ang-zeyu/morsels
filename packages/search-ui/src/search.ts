import './styles/search.css';

import { Searcher, Query } from '@morsels/search-lib';
import createElement from './utils/dom';
import transformResults, { resultsRender } from './searchResultTransform';
import { SearchUiOptions } from './SearchUiOptions';

let query: Query;

let autoPortalControlFlag = false;

let isUpdating = false;
let nextUpdate: () => any;
async function update(
  queryString: string,
  root: HTMLElement,
  listContainer: HTMLElement,
  forPortal: boolean,
  searcher: Searcher,
  options: SearchUiOptions,
): Promise<void> {
  try {
    const now = performance.now();

    if (query) {
      query.free();
    }

    query = await searcher.getQuery(queryString);

    console.log(`getQuery "${queryString}" took ${performance.now() - now} milliseconds`);

    await transformResults(query, searcher.morselsConfig, true, listContainer, options);
  } catch (ex) {
    listContainer.innerHTML = ex.message;
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

function prepareOptions(options: SearchUiOptions, isMobile: boolean) {
  if (!('numberOfExpandedTerms' in options.searcherOptions)) {
    options.searcherOptions.numberOfExpandedTerms = 3;
  }

  if (!('useQueryTermProximity' in options.searcherOptions)) {
    options.searcherOptions.useQueryTermProximity = !isMobile;
  }

  if (!('inputId' in options)) {
    options.inputId = 'morsels-search';
  }

  if (!('resultsPerPage' in options)) {
    options.resultsPerPage = 8;
  }

  if (!('sourceFilesUrl' in options)) {
    options.sourceFilesUrl = '';
  }

  if (!('render' in options)) {
    options.render = {};
  }

  autoPortalControlFlag = !options.render.manualPortalControl && isMobile;

  options.render.manualPortalControl = options.render.manualPortalControl || false;

  options.render.portalTo = options.render.portalTo || document.getElementsByTagName('body')[0];

  options.render.show = options.render.show || ((root, forPortal) => {
    if (forPortal) {
      options.render.portalTo.appendChild(root);
      (root.firstElementChild.firstElementChild as HTMLInputElement).focus();
    } else {
      (root.lastElementChild as HTMLElement).style.display = 'block';
      (root.lastElementChild.previousSibling as HTMLElement).style.display = 'block';
    }
  });

  options.render.hide = options.render.hide || ((root, forPortal) => {
    if (forPortal) {
      root.remove();
    } else {
      (root.lastElementChild as HTMLElement).style.display = 'none';
      (root.lastElementChild.previousSibling as HTMLElement).style.display = 'none';
    }
  });

  options.render.rootRender = options.render.rootRender || ((h, inputEl, portalCloseHandler) => {
    const root = h(
      'div',
      {
        class: `morsels-root${portalCloseHandler ? ' morsels-portal-root' : ''}`,
      },
    );

    if (portalCloseHandler) {
      const buttonEl = h('button', { class: 'morsels-input-close-portal' });
      buttonEl.onclick = portalCloseHandler;
      root.appendChild(h('div', { class: 'morsels-portal-input-button-wrapper' },
        inputEl, buttonEl));
    } else {
      root.appendChild(inputEl);
    }

    if (!portalCloseHandler) {
      root.appendChild(h('div', { class: 'morsels-input-dropdown-separator', style: 'display: none;' }));
    }

    const listContainer = h('ul', {
      class: 'morsels-list',
      style: portalCloseHandler ? '' : 'display: none;',
    });
    root.appendChild(listContainer);

    return {
      root,
      listContainer,
    };
  });

  options.render.portalInputRender = options.render.portalInputRender || ((h) => h(
    'input', { class: 'morsels-portal-input', type: 'text' },
  ) as HTMLInputElement);

  options.render.noResultsRender = options.render.noResultsRender
      || ((h) => h('div', { class: 'morsels-no-results' }, 'No results found'));

  options.render.portalBlankRender = options.render.portalBlankRender
      || ((h) => h('div', { class: 'morsels-portal-blank' }, 'Powered by tiny Morsels of 🧀'));

  options.render.loadingIndicatorRender = options.render.loadingIndicatorRender
      || ((h) => h('span', { class: 'morsels-loading-indicator' }));

  options.render.termInfoRender = options.render.termInfoRender || (() => []);

  options.render.resultsRender = options.render.resultsRender || resultsRender;

  options.render.listItemRender = options.render.listItemRender || ((h, fullLink, title, bodies) => {
    const linkEl = h('a', { class: 'morsels-link' },
      h('div', { class: 'morsels-title' }, title),
      ...bodies);
    if (fullLink) {
      linkEl.setAttribute('href', fullLink);
    }

    return h(
      'li', { class: 'morsels-list-item' },
      linkEl,
    );
  });

  options.render.headingBodyRender = options.render.headingBodyRender || ((
    h, heading, bodyHighlights, href,
  ) => {
    const el = h('a', { class: 'morsels-heading-body' },
      h('div', { class: 'morsels-heading' }, heading),
      h('div', { class: 'morsels-bodies' },
        h('div', { class: 'morsels-body' }, ...bodyHighlights)));
    if (href) {
      el.setAttribute('href', href);
    }
    return el;
  });

  options.render.bodyOnlyRender = options.render.bodyOnlyRender || ((h, bodyHighlights) => h(
    'div', { class: 'morsels-body' }, ...bodyHighlights,
  ));

  options.render.highlightRender = options.render.highlightRender || ((h, matchedPart) => h(
    'span', { class: 'morsels-highlight' }, matchedPart,
  ));
}

function initMorsels(options: SearchUiOptions): { showPortalUI: () => void } {
  const isMobile = window.matchMedia('only screen and (max-width: 1024px)').matches;
  prepareOptions(options, isMobile);

  const searcher = new Searcher(options.searcherOptions);

  let inputTimer: any = -1;
  let isFirstQueryFromBlank = true;
  const inputListener = (root: HTMLElement, listContainer: HTMLElement, forPortal: boolean) => (ev) => {
    const query = (ev.target as HTMLInputElement).value;

    clearTimeout(inputTimer);
    if (query.length) {
      inputTimer = setTimeout(() => {
        if (isFirstQueryFromBlank) {
          listContainer.innerHTML = '';
          listContainer.appendChild(options.render.loadingIndicatorRender(createElement));
          options.render.show(root, forPortal);
        }

        if (isUpdating) {
          nextUpdate = () => update(query, root, listContainer, forPortal, searcher, options);
        } else {
          isUpdating = true;
          update(query, root, listContainer, forPortal, searcher, options);
        }
        isFirstQueryFromBlank = false;
      }, 200);
    } else {
      const reset = () => {
        if (forPortal) {
          listContainer.innerHTML = '';
          listContainer.appendChild(options.render.portalBlankRender(createElement));
        } else {
          options.render.hide(root, forPortal);
        }
        isUpdating = false;
        isFirstQueryFromBlank = true;
      };

      if (isUpdating) {
        nextUpdate = reset;
      } else {
        reset();
      }
    }
  };

  // Fullscreen portal-ed version
  const mobileInput: HTMLInputElement = options.render.portalInputRender(createElement);
  const { root: portalRoot, listContainer: portalListContainer } = options.render.rootRender(
    createElement, mobileInput, () => options.render.hide(portalRoot, true),
  );
  mobileInput.addEventListener('input', inputListener(portalRoot, portalListContainer, true));
  portalListContainer.appendChild(options.render.portalBlankRender(createElement));

  const showPortalUI = () => {
    autoPortalControlFlag = true;
    options.render.show(portalRoot, true);
  };

  // Dropdown version
  const input = options.inputId && document.getElementById(options.inputId);
  if (input) {
    const parent = input.parentElement;
    input.remove();
    const {
      root, listContainer,
    } = options.render.rootRender(createElement, input);
    parent.appendChild(root);

    input.addEventListener('input', inputListener(root, listContainer, false));

    input.addEventListener('blur', () => {
      if (autoPortalControlFlag) {
        return;
      }

      setTimeout(() => {
        let activeEl = document.activeElement;
        while (activeEl) {
          activeEl = activeEl.parentElement;
          if (activeEl === listContainer) {
            input.focus();
            return;
          }
        }
        options.render.hide(root, false);
      }, 100);
    });

    input.addEventListener('focus', () => {
      if (autoPortalControlFlag) {
        if (!options.render.manualPortalControl) {
          showPortalUI();
        }
      } else if (listContainer.childElementCount) {
        options.render.show(root, false);
      }
    });
  }

  if (!options.render.manualPortalControl && input) {
    let debounce;
    window.addEventListener('resize', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        autoPortalControlFlag = window.matchMedia('only screen and (max-width: 1024px)').matches;
      }, 200);
    });
  }

  return { showPortalUI };
}

export default initMorsels;
