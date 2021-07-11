import * as levenshtein from 'fast-levenshtein';

import decodeVarInt from '../utils/varInt';
import getTriGrams from '../Dictionary/triGrams';
import TermInfo from '../results/TermInfo';

const PREFIX_FRONT_CODE = 123; // '{'
const SUBSEQUENT_FRONT_CODE = 125; // '}'

const CORRECTION_ALPHA = 0.85;
const SPELLING_CORRECTION_BASE_ALPHA = 0.625;

async function getTermInfos(url: string, numDocs: number): Promise<{ [term: string]: TermInfo }> {
  const dictionaryTablePromise = fetch(`${url}/dictionaryTable`, {
    method: 'GET',
  });

  const dictionaryStringBuffer = await (await fetch(`${url}/dictionaryString`, {
    method: 'GET',
  })).arrayBuffer();
  const dictionaryStringView = new DataView(dictionaryStringBuffer);

  const decoder = new TextDecoder();

  const dictionaryTableBuffer = await (await dictionaryTablePromise).arrayBuffer();
  const dictionaryTableView = new DataView(dictionaryTableBuffer);

  const termInfo: { [term: string]: TermInfo } = Object.create(null);

  let postingsFileName = 0;
  let dictStringPos = 0;
  let frontCodingPrefix = '';
  for (let dictTablePos = 0; dictTablePos < dictionaryTableBuffer.byteLength;) {
    const { value: docFreq, newPos: dictTablePos1 } = decodeVarInt(dictionaryTableView, dictTablePos);
    dictTablePos = dictTablePos1;

    // new postings list delimiter
    if (docFreq === 0) {
      postingsFileName += 1;
      continue;
    }

    const postingsFileOffset = dictionaryTableView.getUint16(dictTablePos, true);
    dictTablePos += 2;

    const maxTermScore = dictionaryTableView.getFloat32(dictTablePos, true);
    dictTablePos += 4;

    const termLen = dictionaryStringView.getUint8(dictStringPos);
    dictStringPos += 1;

    if (frontCodingPrefix) {
      if (dictionaryStringView.getUint8(dictStringPos) !== SUBSEQUENT_FRONT_CODE) {
        frontCodingPrefix = '';
      } else {
        dictStringPos += 1;
      }
    }

    let term = decoder.decode(dictionaryStringBuffer.slice(dictStringPos, dictStringPos + termLen));
    dictStringPos += termLen;

    if (frontCodingPrefix) {
      term = frontCodingPrefix + term;
    } else if (term.indexOf('{') !== -1) {
      [frontCodingPrefix] = term.split('{');

      // Redecode the full string, then remove the '{'
      term = decoder
        .decode(dictionaryStringBuffer.slice(dictStringPos - termLen, dictStringPos + 1))
        .replace('{', '');
      dictStringPos += 1;
    } else if (dictStringPos < dictionaryStringBuffer.byteLength
      && dictionaryStringView.getUint8(dictStringPos) === PREFIX_FRONT_CODE) {
      frontCodingPrefix = term;
      dictStringPos += 1;
    }

    // console.log(`${frontCodingPrefix} ${term} | df: ${docFreq} | ms: ${maxTermScore}`);
    if (term.indexOf('{') !== -1 || term.indexOf('}') !== -1) {
      throw new Error(`Uh oh ${term}`);
    }

    termInfo[term] = {
      docFreq,
      idf: Math.log(1 + (numDocs - docFreq + 0.5) / (docFreq + 0.5)),
      maxTermScore,
      postingsFileName,
      postingsFileOffset,
    };
  }

  return termInfo;
}

function setupTrigrams(termInfo: { [term: string]: TermInfo }): { [triGram: string]: string[] } {
  const triGrams: { [triGram: string]: string[] } = Object.create(null);
  Object.keys(termInfo).forEach((term) => {
    getTriGrams(term).forEach((triGram) => {
      triGrams[triGram] = triGrams[triGram] ?? [];
      triGrams[triGram].push(term);
    });
  });

  return triGrams;
}

class WorkerDictionary {
  constructor(
    public termInfo: {
      [term: string]: TermInfo
    },
    public triGrams: {
      [triGram: string]: string[]
    },
  ) {}

  getBestCorrectedTerm(misSpelledTerm: string): string {
    let bestTerm;
    let minIdf = Number.MAX_VALUE;
    this.getCorrectedTerms(misSpelledTerm).forEach((term) => {
      if (this.termInfo[term].idf < minIdf) {
        minIdf = this.termInfo[term].idf;
        bestTerm = term;
      }
    });
    return bestTerm;
  }

  getCorrectedTerms(misSpelledTerm: string): string[] {
    const levenshteinCandidates = this.getTermCandidates(misSpelledTerm, true);

    const editDistances: { [term: string]: number } = Object.create(null);
    levenshteinCandidates.forEach((term) => {
      editDistances[term] = levenshtein.get(misSpelledTerm, term);
    });

    let minEditDistanceTerms = [];
    let minEditDistance = 99999;
    Object.entries(editDistances).forEach(([term, editDistance]) => {
      if (editDistance >= 3) {
        return;
      }

      if (editDistance < minEditDistance) {
        minEditDistanceTerms = [];
        minEditDistanceTerms.push(term);
        minEditDistance = editDistance;
      } else if (editDistance === minEditDistance) {
        minEditDistanceTerms.push(term);
      }
    });

    return minEditDistanceTerms;
  }

  getExpandedTerms(baseTerm: string): { [term: string]: number } {
    if (baseTerm.length < 4) {
      return Object.create(null);
    }

    const expandedTerms: { [term: string]: number } = Object.create(null);
    const prefixCheckCandidates = this.getTermCandidates(baseTerm, false);

    const minBaseTermSubstring = baseTerm.substring(0, Math.floor(CORRECTION_ALPHA * baseTerm.length));
    prefixCheckCandidates.forEach((term) => {
      if (term.startsWith(minBaseTermSubstring) && term !== baseTerm) {
        expandedTerms[term] = 1 / (term.length - minBaseTermSubstring.length + 1);
      }
    });

    return expandedTerms;
  }

  private getTermCandidates(baseTerm: string, useJacard: boolean): string[] {
    const triGrams = getTriGrams(baseTerm);
    const minMatchingTriGrams = Math.floor(CORRECTION_ALPHA * triGrams.length);

    const candidates: { [term: string]: number } = Object.create(null);
    triGrams.forEach((triGram) => {
      if (!this.triGrams[triGram]) {
        return;
      }

      this.triGrams[triGram].forEach((term) => {
        candidates[term] = candidates[term] ? candidates[term] + 1 : 1;
      });
    });

    return Object.keys(candidates).filter((term) => (useJacard
      // (A intersect B) / (A union B)
      // For n-gram string, there are n - 2 tri-grams
      ? (candidates[term] / (term.length + baseTerm.length - 4 - candidates[term]))
      >= SPELLING_CORRECTION_BASE_ALPHA
      : candidates[term] >= minMatchingTriGrams));
  }
}

let workerDictionary: WorkerDictionary;

onmessage = async function setupDictionary(ev) {
  if (ev.data.url) {
    const { url, numDocs } = ev.data;
    const termInfo = await getTermInfos(url, numDocs);
    const triGrams = setupTrigrams(termInfo);
    workerDictionary = new WorkerDictionary(termInfo, triGrams);
  } else if (ev.data.term) {
    const { term } = ev.data;
    postMessage({ term, termInfo: workerDictionary.termInfo[term] });
  } else if (ev.data.termToCorrect) {
    const { termToCorrect } = ev.data;
    const correctedTerm = workerDictionary.termInfo[termToCorrect]
      ? termToCorrect
      : workerDictionary.getBestCorrectedTerm(termToCorrect);
    postMessage({ termToCorrect, correctedTerm });
  } else if (ev.data.termToExpand) {
    const { termToExpand } = ev.data;
    const termsExpanded = workerDictionary.getExpandedTerms(termToExpand);
    postMessage({ termToExpand, termsExpanded });
  }
};