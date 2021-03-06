import escapeStringRegexp from 'escape-string-regexp';
import { Query } from '@morsels/search-lib';
import { FieldInfo, MorselsConfig } from '@morsels/search-lib/lib/results/Config';
import Result from '@morsels/search-lib/lib/results/Result';
import { SearchUiOptions } from './SearchUiOptions';
import createElement, { CreateElement, createInvisibleLoadingIndicator } from './utils/dom';
import { parseURL } from './utils/url';
import { InputState } from './utils/input';
import { transformHtml, transformJson, transformText } from './searchResultTransform/transform';

const domParser = new DOMParser();

const RELATIVE_LINK_FIELD_NAME = '_relative_fp';


/**
 * Determines from where (source files / field stores) to retrieve the document's fields.
 * Then calls one of the transformXx variants above.
 */
async function singleResultRender(
  result: Result,
  options: SearchUiOptions,
  configs: MorselsConfig,
  hasStoredContentField: FieldInfo,
  searchedTermsJSON: string,
  termRegexes: RegExp[],
) {
  const { loaderConfigs } = configs.indexingConfig;

  const fields = result.getFields();

  let link: string;
  let relativeLink: string;
  let resultTitle: string;
  for (const fieldNameAndField of fields) {
    const [fieldName, fieldText] = fieldNameAndField;
    switch (fieldName) {
      case 'link':
        link = link || fieldText;
        break;
      case RELATIVE_LINK_FIELD_NAME:
        relativeLink = relativeLink || fieldText;
        break;
      case 'title':
        resultTitle = resultTitle || fieldText;
        break;
    }
    if (link && relativeLink && resultTitle) {
      break;
    }
  }

  const {
    sourceFilesUrl,
    resultsRenderOpts: { addSearchedTerms, listItemRender },
  } = options.uiOptions;

  const hasSourceFilesUrl = typeof sourceFilesUrl === 'string';
  const fullLink = link
    || (hasSourceFilesUrl && relativeLink && `${sourceFilesUrl}${relativeLink}`)
    || '';

  if (!resultTitle) {
    if (relativeLink) {
      // HTML files: remove the extension
      // PDF: <...breadcumbs...> (PDF)

      const breadCrumbed = relativeLink.split('/').join(' ?? ');
      const breadCrumbsAndExt = breadCrumbed.split('.');

      let ext = breadCrumbsAndExt.pop().toUpperCase();
      if (ext === 'HTML') {
        ext = '';
      } else if (ext === 'PDF') {
        ext = ' (PDF)';
      } else {
        ext = '.' + ext;
      }

      resultTitle = breadCrumbsAndExt.join('.') + ext;
    } else {
      resultTitle = link;
    }
  }

  let linkToAttach = fullLink;
  if (addSearchedTerms && fullLink) {
    const fullLinkUrl = parseURL(fullLink);
    fullLinkUrl.searchParams.append(
      addSearchedTerms,
      searchedTermsJSON,
    );
    linkToAttach = fullLinkUrl.toString();
  }

  let resultHeadingsAndTexts: (string | HTMLElement)[];
  if (hasStoredContentField) {
    resultHeadingsAndTexts = transformText(
      fields,
      termRegexes,
      linkToAttach,
      options,
    );
  } else if (!fullLink) {
    // Unable to retrieve and load from source file
    resultHeadingsAndTexts = [];
  } else if (fullLink.endsWith('.html') && loaderConfigs.HtmlLoader) {
    const asText = await (await fetch(fullLink)).text();
    const doc = domParser.parseFromString(asText, 'text/html');

    const { title: newTitle, bodies: newHeadingsAndTexts } = transformHtml(
      doc, loaderConfigs.HtmlLoader, termRegexes, linkToAttach, options,
    );
    resultTitle = newTitle || resultTitle;
    resultHeadingsAndTexts = newHeadingsAndTexts;
  } else if (fullLink.endsWith('.txt') && loaderConfigs.TxtLoader) {
    const asText = await (await fetch(fullLink)).text();
    resultHeadingsAndTexts = transformText(
      [['body', asText]], termRegexes, linkToAttach, options,
    );
  } else {
    const fullLinkUrl = parseURL(fullLink);
    if (fullLinkUrl.pathname.endsWith('.json') && loaderConfigs.JsonLoader) {
      const asJson = await (await fetch(fullLink)).json();

      const { title: newTitle, bodies: newBodies } = transformJson(
        fullLinkUrl.hash ? asJson[fullLinkUrl.hash.substring(1)] : asJson,
        loaderConfigs.JsonLoader,
        termRegexes, linkToAttach, options,
      );
      resultTitle = newTitle || resultTitle;
      resultHeadingsAndTexts = newBodies;
    }
  }

  return listItemRender(
    createElement,
    options,
    searchedTermsJSON,
    fullLink,
    resultTitle,
    resultHeadingsAndTexts,
    fields,
  );
}

export function resultsRender(
  h: CreateElement,
  options: SearchUiOptions,
  config: MorselsConfig,
  results: Result[],
  query: Query,
): Promise<HTMLElement[]> {
  const termRegexes: RegExp[] = [];
  const searchedTerms: string[] = [];
  for (const innerTerms of query.searchedTerms) {
    const innerTermsJoined = innerTerms
      .map(t => {
        searchedTerms.push(t);
        return escapeStringRegexp(t);
      })
      .sort((a, b) => b.length - a.length)
      .join('|');

    // A little hardcoded, not so pretty but gets the job done for now
    if (config.langConfig.lang === 'ascii') {
      const boundariedRegex = new RegExp(`(^|\\W|_)(${innerTermsJoined})((?=\\W|$))`, 'gi');
      termRegexes.push(boundariedRegex);
    } else if (config.langConfig.lang === 'latin') {
      const nonEndBoundariedRegex = new RegExp(`(^|\\W|_)(${innerTermsJoined})(\\w*?)(?=\\W|$)`, 'gi');
      termRegexes.push(nonEndBoundariedRegex);
    } else if (config.langConfig.lang === 'chinese') {
      const nonBoundariedRegex = new RegExp(`()(${innerTermsJoined})()`, 'gi');
      termRegexes.push(nonBoundariedRegex);
    }
  }

  const hasStoredContentField = config.fieldInfos.find((info) => info.do_store
      && (info.name === 'body' || info.name === 'title' || info.name === 'heading'));

  return Promise.all(results.map(
    (result) => singleResultRender(
      result, options, config, hasStoredContentField, JSON.stringify(searchedTerms), termRegexes,
    ),
  ));
}

/**
 * @returns Whether the results were computed and displayed, or pre-emptively disrupted by a new query
 */
export default async function loadQueryResults(
  inputState: InputState,
  query: Query,
  config: MorselsConfig,
  isFirst: boolean,
  container: HTMLElement,
  options: SearchUiOptions,
): Promise<boolean> {
  if (inputState._mrlNextAction) {
    // If a new query interrupts the current one
    return false;
  }

  const bottomLoader = options.uiOptions.loadingIndicatorRender(createElement, options, false, true);
  if (!isFirst) {
    container.appendChild(bottomLoader);
  }

  if (inputState._mrlLastElObserver) {
    inputState._mrlLastElObserver.disconnect();
  }

  const fragment = document.createDocumentFragment();
  const termInfoEls = isFirst
    ? options.uiOptions.termInfoRender(createElement, options, query.queryParts)
    : [];
  termInfoEls.forEach((el) => fragment.appendChild(el));

  //let now = performance.now();

  const results = await query.getNextN(options.uiOptions.resultsPerPage);

  //console.log(`Search Result Retrieval took ${performance.now() - now} milliseconds`);
  //now = performance.now();

  if (inputState._mrlNextAction) {
    // If a new query interrupts the current one
    return false;
  }

  const resultsEls = await options.uiOptions.resultsRender(
    createElement, options, config, results, query,
  );

  if (inputState._mrlNextAction) {
    // If a new query interrupts the current one
    return false;
  }

  if (resultsEls.length) {
    resultsEls.forEach((el) => fragment.appendChild(el));
  } else if (isFirst) {
    fragment.appendChild(options.uiOptions.noResultsRender(createElement, options));
  }
  const sentinel = fragment.lastElementChild;

  if (isFirst) {
    container.innerHTML = '';
    inputState._mrlLoader = createInvisibleLoadingIndicator();
    container.append(inputState._mrlLoader);
    container.append(fragment);
  } else {
    bottomLoader.replaceWith(fragment);
  }

  //console.log(`Result transformation took ${performance.now() - now} milliseconds`);

  if (resultsEls.length) {
    inputState._mrlLastElObserver = new IntersectionObserver(async ([entry], observer) => {
      if (!entry.isIntersecting) {
        return;
      }
  
      observer.unobserve(sentinel);
      await loadQueryResults(inputState, query, config, false, container, options);
    }, { root: container, rootMargin: '150px 0px' });

    inputState._mrlLastElObserver.observe(sentinel);
  }

  return true;
}
