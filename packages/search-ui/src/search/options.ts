import { resultsRender } from '../searchResultTransform';
import { SearchUiOptions, UiMode } from '../SearchUiOptions';
import { parseURL } from '../utils/url';
import { LOADING_INDICATOR_ID } from '../utils/dom';

export function prepareOptions(options: SearchUiOptions, isMobile: boolean) {
  // ------------------------------------------------------------
  // Search Lib Options
  
  options.searcherOptions = options.searcherOptions || ({} as any);
  
  if (!('url' in options.searcherOptions)) {
    throw new Error('Mandatory url parameter not specified');
  } else if (!options.searcherOptions.url.endsWith('/')) {
    options.searcherOptions.url += '/';
  }
  
  if (options.searcherOptions.url.startsWith('/')) {
    options.searcherOptions.url = window.location.origin + options.searcherOptions.url;
  }

  if (!('numberOfExpandedTerms' in options.searcherOptions)) {
    options.searcherOptions.numberOfExpandedTerms = 3;
  }
  
  if (!('useQueryTermProximity' in options.searcherOptions)) {
    options.searcherOptions.useQueryTermProximity = !isMobile;
  }
  
  if (!('resultLimit' in options.searcherOptions)) {
    options.searcherOptions.resultLimit = null; // unlimited
  }
  
  // ------------------------------------------------------------
  // Ui Options
  
  options.uiOptions = options.uiOptions || ({} as any);
  const { uiOptions } = options;
  
  if (uiOptions.sourceFilesUrl && !uiOptions.sourceFilesUrl.endsWith('/')) {
    uiOptions.sourceFilesUrl += '/';
  }
  
  uiOptions.mode = uiOptions.mode || UiMode.Auto;
  
  if (uiOptions.mode === UiMode.Target) {
    if (typeof uiOptions.target === 'string') {
      uiOptions.target = document.getElementById(uiOptions.target);
    }
  
    if (!uiOptions.target) {
      throw new Error('\'target\' mode specified but no valid target option specified');
    }
  }
  
  if (!('input' in uiOptions) || typeof uiOptions.input === 'string') {
    uiOptions.input = document.getElementById(uiOptions.input as any || 'morsels-search') as HTMLInputElement;
  }
  
  if ([UiMode.Dropdown, UiMode.Target].includes(uiOptions.mode) && !uiOptions.input) {
    throw new Error('\'dropdown\' or \'target\' mode specified but no input element found');
  }
  
  if (!('inputDebounce' in uiOptions)) {
    uiOptions.inputDebounce = 100;
  }
  
  uiOptions.preprocessQuery = uiOptions.preprocessQuery || ((q) => q);
  
  uiOptions.dropdownAlignment = uiOptions.dropdownAlignment || 'bottom-end';
  
  if (typeof uiOptions.fsContainer === 'string') {
    uiOptions.fsContainer = document.getElementById(uiOptions.fsContainer) as HTMLElement;
  }
  uiOptions.fsContainer = uiOptions.fsContainer || document.getElementsByTagName('body')[0] as HTMLElement;
  
  uiOptions.resultsPerPage = uiOptions.resultsPerPage || 8;
  
  uiOptions.label = uiOptions.label || 'Search this site';
  uiOptions.fsPlaceholder = uiOptions.fsPlaceholder || 'Search this site...';
  uiOptions.fsCloseText = uiOptions.fsCloseText || 'Close';
  
  uiOptions.errorRender = uiOptions.errorRender
        || ((h) => h('div', { class: 'morsels-error' }, 'Oops! Something went wrong... 🙁'));
  
  uiOptions.noResultsRender = uiOptions.noResultsRender
        || ((h) => h('div', { class: 'morsels-no-results' }, 'No results found'));
  
  uiOptions.fsBlankRender = uiOptions.fsBlankRender
        || ((h) => h('div', { class: 'morsels-fs-blank' }, 'Start Searching Above!'));
  
  if (!uiOptions.loadingIndicatorRender) {
    uiOptions.loadingIndicatorRender = ((
      h, opts, isInitialising, wasResultsBlank,
    ) => {
      const loadingSpinner = h('span', { class: 'morsels-loading-indicator' });
      if (isInitialising) {
        const initialisingText = h('div', { class: 'morsels-initialising-text' }, '... Initialising ...');
        return h('div', { class: 'morsels-initialising' }, initialisingText, loadingSpinner);
      }
    
      if (!wasResultsBlank) {
        loadingSpinner.classList.add('morsels-loading-indicator-subsequent');
      }
    
      return loadingSpinner;
    });
  }
  const loadingIndicatorRenderer = uiOptions.loadingIndicatorRender;
  uiOptions.loadingIndicatorRender = (...args) => {
    const loadingIndicator = loadingIndicatorRenderer(...args);
    // Add an identifier for keyboard events (up / down / home / end)
    loadingIndicator.setAttribute(LOADING_INDICATOR_ID, 'true');
    return loadingIndicator;
  };
  
  uiOptions.termInfoRender = uiOptions.termInfoRender || (() => []);
  
  uiOptions.resultsRender = uiOptions.resultsRender || resultsRender;
  
  uiOptions.resultsRenderOpts = uiOptions.resultsRenderOpts || {};

  const { resultsRenderOpts } = uiOptions;
  
  resultsRenderOpts.listItemRender = resultsRenderOpts.listItemRender || ((
    h, opts, searchedTermsJSON, fullLink, title, resultHeadingsAndTexts,
  ) => {
    const linkEl = h(
      'a', { class: 'morsels-link' },
      h('div', { class: 'morsels-title' }, title),
      ...resultHeadingsAndTexts,
    );
  
    if (fullLink) {
      let linkToAttach = fullLink;
      const { addSearchedTerms } = resultsRenderOpts;
      if (addSearchedTerms) {
        const fullLinkUrl = parseURL(fullLink);
        fullLinkUrl.searchParams.append(addSearchedTerms, searchedTermsJSON);
        linkToAttach = fullLinkUrl.toString();
      }
      linkEl.setAttribute('href', linkToAttach);
    }
  
    return h(
      'li', { class: 'morsels-list-item', role: 'option' },
      linkEl,
    );
  });
  
  resultsRenderOpts.headingBodyRender = resultsRenderOpts.headingBodyRender
    || ((
      h, opts, headingHighlights, bodyHighlights, href,
    ) => {
      const el = h('a', { class: 'morsels-heading-body' },
        h('div', { class: 'morsels-heading' }, ...headingHighlights),
        h('div', { class: 'morsels-bodies' },
          h('div', { class: 'morsels-body' }, ...bodyHighlights)));
      if (href) {
        el.setAttribute('href', href);
      }
      return el;
    });
  
  resultsRenderOpts.bodyOnlyRender = resultsRenderOpts.bodyOnlyRender || ((
    h, opts, bodyHighlights,
  ) => h(
    'div', { class: 'morsels-body' }, ...bodyHighlights,
  ));
  
  resultsRenderOpts.highlightRender = resultsRenderOpts.highlightRender || ((
    h, opts, matchedPart,
  ) => h(
    'span', { class: 'morsels-highlight' }, matchedPart,
  ));
  
  options.otherOptions = options.otherOptions || {};
}