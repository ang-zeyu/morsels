import { QueryPart } from './queryParser';
import Dictionary from '../Dictionary/Dictionary';

// Deal with non-existent terms, spelling errors
export default async function preprocess(
  queryParts: QueryPart[],
  dictionary: Dictionary,
) : Promise<QueryPart[]> {
  for (let i = 0; i < queryParts.length; i += 1) {
    const queryPart = queryParts[i];
    if (queryPart.terms) {
      for (let j = 0; j < queryPart.terms.length; j += 1) {
        const term = queryPart.terms[j];
        const termInfo = await dictionary.getTermInfo(term);
        if (!termInfo) {
          queryPart.isCorrected = true;
          queryPart.originalTerms = queryPart.originalTerms || queryPart.terms.map((t) => t);

          const correctedTerm = await dictionary.getBestCorrectedTerm(term);
          if (correctedTerm) {
            queryPart.terms[j] = correctedTerm;
          } else {
            queryPart.terms.splice(j, 1);
            j -= 1;
          }
        }
      }
    } else if (queryPart.children) {
      preprocess(queryPart.children, dictionary);
    }
  }

  return queryParts;
}
