import * as path from 'path';
import * as fs from 'fs-extra';

import DictionaryEntry from './DictionaryEntry';

class Dictionary {
  entries: { [term: string]: DictionaryEntry } = Object.create(null);

  static getCommonPrefixLength(str1: string, str2: string): number {
    let len = 0;

    while (len < str1.length && len < str2.length
      && str1.charAt(len) === str2.charAt(len)) {
      len += 1;
    }

    return len;
  }

  dump(folderPath: string): void {
    this.dumpDictAsAString(folderPath);
    this.dumpDictTable(folderPath);
  }

  private dumpDictTable(folderPath: string) {
    const fullPath = path.join(folderPath, 'dictionaryTable.txt');

    fs.writeFileSync(fullPath, '');

    const buffer: Buffer = Buffer.allocUnsafe(16);
    const sortedTerms: string[] = Object.keys(this.entries).sort();

    for (let i = 0; i < sortedTerms.length; i += 1) {
      const entry = this.entries[sortedTerms[i]];

      buffer.writeUInt32LE(entry.postingsFileName);
      buffer.writeUInt32LE(entry.docFreq, 4);
      buffer.writeUInt32LE(entry.postingsFileLength, 8);
      buffer.writeUInt32LE(entry.postingsFileOffset, 12);

      fs.appendFileSync(fullPath, buffer);
    }
  }

  private dumpDictAsAString(folderPath: string) {
    const fullPath = path.join(folderPath, 'dictionaryString.txt');

    const buffers: Buffer[] = [];
    const sortedTerms: string[] = Object.keys(this.entries).sort();

    for (let i = 0; i < sortedTerms.length; i += 1) {
      let currCommonPrefix = sortedTerms[i];
      let numFrontcodedTerms = 0;

      let j = i + 1;
      while (j < sortedTerms.length) {
        const commonPrefixLen = Dictionary.getCommonPrefixLength(currCommonPrefix, sortedTerms[j]);
        if (commonPrefixLen <= 2) {
          break;
        }

        if (commonPrefixLen < currCommonPrefix.length) {
          if (commonPrefixLen === currCommonPrefix.length - 1) {
            // equally worth it
            currCommonPrefix = currCommonPrefix.substring(0, commonPrefixLen);
          } else {
            // not worth it
            break;
          }
        }

        numFrontcodedTerms += 1;
        j += 1;
      }

      const termBuffer = Buffer.from(sortedTerms[i]);
      const currPrefixBuffer = Buffer.from(currCommonPrefix);
      buffers.push(Buffer.from([termBuffer.length]));
      buffers.push(currPrefixBuffer);
      if (numFrontcodedTerms > 0) {
        buffers.push(Buffer.from(`*${sortedTerms[i].substring(currCommonPrefix.length)}`));
      }

      while (numFrontcodedTerms > 0) {
        i += 1;
        numFrontcodedTerms -= 1;
        const frontCodedTermBuffer = Buffer.from(sortedTerms[i]);
        buffers.push(Buffer.from([frontCodedTermBuffer.length - currPrefixBuffer.length]));
        buffers.push(Buffer.from(`&${sortedTerms[i].substring(currCommonPrefix.length)}`));
      }
    }

    fs.writeFileSync(fullPath, Buffer.concat(buffers));
  }
}

export default Dictionary;