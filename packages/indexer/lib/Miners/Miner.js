"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const English_1 = require("../tokenizers/English");
const Dictionary_1 = require("../Dictionary/Dictionary");
const PostingsListManager_1 = require("../Postings/PostingsListManager");
const DocInfo_1 = require("../DocInfo/DocInfo");
const tokenizer = new English_1.default();
class Miner {
    constructor(outputFolder, fields) {
        this.outputFolder = outputFolder;
        this.fields = fields;
        this.lastDocId = 0;
        this.docInfos = {};
        this.fieldInfo = Object.create(null);
        this.dictionary = new Dictionary_1.default();
        let fieldId = 0;
        Object.values(fields).forEach((field) => {
            fieldId += 1;
            this.fieldInfo[field.name] = {
                id: fieldId,
                storage: field.storage.constructor.name,
                baseFileName: field.storage.baseName,
                weight: field.weight,
            };
        });
        this.postingsListManager = new PostingsListManager_1.default(this.fieldInfo);
    }
    add(fields) {
        this.lastDocId += 1;
        this.docInfos[this.lastDocId] = new DocInfo_1.default(this.lastDocId);
        let pos = -1;
        fields.forEach((item) => {
            const { fieldName, text } = item;
            const field = this.fields[fieldName];
            if (!field) {
                throw new Error('Indexing undefined field.');
            }
            pos += 1;
            field.add(this.lastDocId, text);
            if (!field.weight) {
                // E.g. auxillary document info - links
                return;
            }
            const terms = tokenizer.tokenize(text);
            terms.forEach((term) => {
                pos += 1;
                if (term.length > 255) {
                    return;
                }
                this.postingsListManager.addTerm(field.name, term, this.lastDocId, pos);
            });
        });
    }
    dump() {
        this.postingsListManager.dump(this.dictionary, this.docInfos, this.outputFolder);
        this.dictionary.dump(this.outputFolder);
        this.dumpDocInfo();
        this.dumpFields();
    }
    dumpDocInfo() {
        const linkFullPath = path.join(this.outputFolder, 'docInfo.txt');
        const numDocs = Object.keys(this.docInfos).length;
        const buffer = [`${numDocs}`];
        Object.values(this.docInfos).forEach((info) => {
            buffer.push(String(Math.sqrt(info.normalizationFactor)));
        });
        fs.writeFileSync(linkFullPath, buffer.join('\n'));
    }
    dumpFields() {
        fs.writeJSONSync(path.join(this.outputFolder, 'fieldInfo.json'), this.fieldInfo);
        Object.values(this.fields).forEach((field) => field.dump());
    }
}
exports.default = Miner;
//# sourceMappingURL=Miner.js.map