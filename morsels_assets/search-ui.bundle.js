!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.initMorsels=t():e.initMorsels=t()}(self,(function(){return(()=>{"use strict";var e={m:{},d:(t,n)=>{for(var s in n)e.o(n,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:n[s]})},u:e=>"search.worker.bundle.js"};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var n=e.g.document;if(!t&&n&&(n.currentScript&&(t=n.currentScript.src),!t)){var s=n.getElementsByTagName("script");s.length&&(t=s[s.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.b=document.baseURI||self.location.href;var t={};e.d(t,{default:()=>O});const n=class{constructor(e,t,n,s,r){this.query=e,this.searchedTerms=t,this.queryParts=n,this.retrieve=s,this.free=r}};var s=function(e,t,n,s){return new(n||(n=Promise))((function(r,o){function i(e){try{d(s.next(e))}catch(e){o(e)}}function l(e){try{d(s.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}d((s=s.apply(e,t||[])).next())}))};const r=class{constructor(e,t,n){this.docId=e,this.score=t,this.fieldInfos=n,this.storage=Object.create(null)}populate(e,t,n,r){return s(this,void 0,void 0,(function*(){const s=Math.floor(this.docId/n),o=Math.floor(s/r),i=`${e}field_store/${o}/${s}.json`;try{const e=yield t.fetch(i);this.storage=e[this.docId%n]}catch(e){console.log(e)}}))}getSingleField(e){const t=this.fieldInfos.find((t=>t.name===e));if(!t)return"";const n=this.storage.find((e=>e[0]===t.id));return n?n[1]:""}getStorageWithFieldNames(){return this.storage.map((e=>{const t=e.map((e=>e));return t[0]=this.fieldInfos[t[0]].name,t}))}};class o{constructor(){this.linkToJsons=Object.create(null)}fetch(e){return this.linkToJsons[e]||(this.linkToJsons[e]=fetch(e).then((e=>e.json()))),this.linkToJsons[e]}}var i=function(e,t,n,s){return new(n||(n=Promise))((function(r,o){function i(e){try{d(s.next(e))}catch(e){o(e)}}function l(e){try{d(s.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}d((s=s.apply(e,t||[])).next())}))};const l=class{constructor(t){this.options=t,this.workerQueryPromises=Object.create(null),this.worker=new Worker(new URL(e.p+e.u(658),e.b));const n=new Promise((e=>{this.worker.onmessage=t=>{if(t.data.isSetupDone)e();else if(t.data.query){const{query:e,timestamp:n,nextResults:s,searchedTerms:r,queryParts:o}=t.data;this.workerQueryPromises[e][n].resolve({query:e,nextResults:s,searchedTerms:r,queryParts:o})}},this.worker.onmessageerror=e=>{console.log(e)}}));this.setupPromise=this.retrieveConfig().then((()=>(t.useQueryTermProximity=t.useQueryTermProximity&&this.morselsConfig.indexingConfig.withPositions,this.worker.postMessage(this.morselsConfig),n)))}retrieveConfig(){return i(this,void 0,void 0,(function*(){const e=yield(yield fetch(`${this.options.url}morsels_config.json`,{method:"GET",headers:{"Content-Type":"application/json"}})).json();if("0.0.2"!==e.ver)throw new Error("Morsels search version not equal to indexer version!");const{field_infos:t}=e,n=[];Object.entries(t.field_infos_map).forEach((([e,t])=>{t.name=e,n.push(t)})),n.sort(((e,t)=>e.id-t.id)),this.morselsConfig={indexingConfig:{loaderConfigs:e.indexing_config.loader_configs,plNamesToCache:e.indexing_config.pl_names_to_cache,numPlsPerDir:e.indexing_config.num_pls_per_dir,numStoresPerDir:e.indexing_config.num_stores_per_dir,withPositions:e.indexing_config.with_positions},langConfig:e.lang_config,fieldInfos:n,numScoredFields:t.num_scored_fields,fieldStoreBlockSize:t.field_store_block_size,searcherOptions:this.options}}))}deleteQuery(e,t){delete this.workerQueryPromises[e][t],0===Object.keys(this.workerQueryPromises[e]).length&&delete this.workerQueryPromises[e]}getQuery(e){return i(this,void 0,void 0,(function*(){yield this.setupPromise;const t=(new Date).getTime();this.workerQueryPromises[e]=this.workerQueryPromises[e]||{},this.workerQueryPromises[e][t]={promise:void 0,resolve:void 0},this.workerQueryPromises[e][t].promise=new Promise((n=>{this.workerQueryPromises[e][t].resolve=n,this.worker.postMessage({query:e,timestamp:t})}));const s=yield this.workerQueryPromises[e][t].promise;return new n(e,s.searchedTerms,s.queryParts,(n=>i(this,void 0,void 0,(function*(){yield this.workerQueryPromises[e][t].promise,this.workerQueryPromises[e][t].promise=new Promise((s=>{this.workerQueryPromises[e][t].resolve=s,this.worker.postMessage({query:e,timestamp:t,isGetNextN:!0,n})}));const s=(yield this.workerQueryPromises[e][t].promise).nextResults.map((([e,t])=>new r(e,t,this.morselsConfig.fieldInfos))),i=new o;return yield Promise.all(s.map((e=>e.populate(this.options.url,i,this.morselsConfig.fieldStoreBlockSize,this.morselsConfig.indexingConfig.numStoresPerDir)))),s}))),(()=>{this.deleteQuery(e,t),this.worker.postMessage({query:e,isFree:!0})}))}))}};const d=function(e,t,...n){const s=document.createElement(e);return Object.entries(t).forEach((([e,t])=>{s.setAttribute(e,t)})),n.forEach((e=>{if("string"==typeof e){const t=document.createElement("span");t.textContent=e,s.appendChild(t)}else s.appendChild(e)})),s};var c=function(e,t,n,s){return new(n||(n=Promise))((function(r,o){function i(e){try{d(s.next(e))}catch(e){o(e)}}function l(e){try{d(s.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}d((s=s.apply(e,t||[])).next())}))};const a=new DOMParser,u="_relative_fp";function p(e,t,n,s,r){const{highlightRender:o,bodyOnlyRender:i,headingBodyRender:l}=r.uiOptions.resultsRenderOpts,c=Object.create(null);function a(e){let s,i,l;for(const r of n){s=t.map((()=>-1e8)),i=s.map((e=>e)),l=0;let n=1e8,o=r.exec(e);if(o){for(;o;){const t=o[2].toLowerCase(),d=c[t];s[d]=o.index+o[1].length,o[1].length>0&&(r.lastIndex=s[d]);const a=s.filter((e=>e>=0)),u=Math.max(...a)-Math.min(...a),p=a.length>l;(p||u<n)&&(p&&(l=a.length),n=u,i=s.map((e=>e))),o=r.exec(e)}r.lastIndex=0;break}r.lastIndex=0}const a=i.map(((e,n)=>({pos:e,term:t[n]}))).filter((e=>e.pos>=0)).sort(((e,t)=>e.pos-t.pos)),u=[];if(!a.length)return{result:u,numberTermsMatched:l};let p=0;for(let t=0;t<a.length;t+=1){const{pos:n,term:s}=a[t],i=n+s.length;n>p+80?(u.push(d("span",{class:"morsels-ellipsis"})),u.push(e.substring(n-40,n)),u.push(o(d,r,s)),u.push(e.substring(i,i+40))):(u.pop(),u.push(e.substring(p,n)),u.push(o(d,r,s)),u.push(e.substring(i,i+40))),p=i}return u.push(d("span",{class:"morsels-ellipsis"})),{result:u,numberTermsMatched:l}}t.forEach(((e,t)=>{c[e.toLowerCase()]=t}));let u=-1,p={result:void 0,numberTermsMatched:0};const h=[];let f=-1;for(const t of e){if(f+=1,t[0].startsWith("heading"))continue;const{result:n,numberTermsMatched:o}=a(t[1]);if(0===o)continue;let c=f-1;for(;c>u;c-=1)if("heading"===e[c][0]){u=c,h.push({result:l(d,r,e[c][1],n,c-1>=0&&"headingLink"===e[c-1][0]&&`${s}#${e[c-1][1]}`),numberTermsMatched:o});break}!h.length&&o>p.numberTermsMatched&&(p={result:i(d,r,n),numberTermsMatched:o})}return!h.length&&p.numberTermsMatched>0&&h.push(p),h.sort(((e,t)=>t.numberTermsMatched-e.numberTermsMatched)).map((e=>e.result)).slice(0,2)}function h(e,t,n,s,r,o){return c(this,void 0,void 0,(function*(){const{loaderConfigs:i}=n.indexingConfig,l=e.getStorageWithFieldNames(),c=l.find((e=>e[0]===u)),h=c&&c[1]||"",f="string"==typeof t.uiOptions.sourceFilesUrl,m=f?`${t.uiOptions.sourceFilesUrl}${h}`:void 0,g=l.find((e=>"title"===e[0]));let y,w=g&&g[1]||h;if(s)y=p(l.filter((e=>e[0]!==u&&"title"!==e[0])),r.searchedTerms,o,h,t);else if(c&&f)if(m.endsWith(".html")&&i.HtmlLoader){const e=yield(yield fetch(m)).text(),n=a.parseFromString(e,"text/html"),{title:s,bodies:l}=function(e,t,n,s,r,o){const i=[];if(t.exclude_selectors)for(const n of t.exclude_selectors){const t=e.querySelectorAll(n);for(let e=0;e<t.length;e+=1)t[e].remove()}t.selectors=t.selectors||[];const l=t.selectors.map((e=>e.selector)).join(",");!function e(n,s){for(const e of t.selectors)if(n.matches(e.selector)){Object.entries(e.attr_map).forEach((([e,t])=>{n.attributes[e]&&i.push([t,n.attributes[e].value])})),s=e.field_name;break}if(n.querySelector(l))for(let t=0;t<n.childNodes.length;t+=1){const r=n.childNodes[t];r.nodeType===Node.ELEMENT_NODE?e(r,s):r.nodeType===Node.TEXT_NODE&&s&&(i.length&&i[i.length-1][0]===s?i[i.length-1][1]+=r.data:i.push([s,r.data]))}else s&&(i.length&&i[i.length-1][0]===s?i[i.length-1][1]+=n.innerText:i.push([s,n.innerText||""]))}(e.documentElement,void 0);const d=i.find((e=>"title"===e[0]));let c="";return d&&([,c]=d,d[1]=""),{title:c,bodies:p(i,n,s,r,o)}}(n,i.HtmlLoader,r.searchedTerms,o,h,t);w=s||w,y=l}else{const e=new URL(m);if(e.pathname.endsWith(".json")&&i.JsonLoader){const n=yield(yield fetch(m)).json(),{title:s,bodies:l}=function(e,t,n,s,r,o){const i=[],{field_map:l,field_order:d}=t,c=Object.entries(l).find((([,e])=>"title"===e)),a=c&&c[0];for(const t of d)t!==a&&e[t]&&i.push([l[t],e[t]]);return{title:a&&e[a],bodies:p(i,n,s,r,o)}}(e.hash?n[e.hash.substring(1)]:n,i.JsonLoader,r.searchedTerms,o,h,t);w=s||w,y=l}}else y=[];return t.uiOptions.resultsRenderOpts.listItemRender(d,t,m,w,y,l)}))}function f(e,t,n,s,r){const o=r.searchedTerms.map((e=>`(${function(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}(e)})`)).join("|"),i=new RegExp(`(^|\\W)(${o})(?=\\W|$)`,"gi"),l=new RegExp(`(^|\\W)(${o})`,"gi"),d=new RegExp(`()(${o})`,"gi"),c=[];"ascii"===n.langConfig.lang?c.push(i):"latin"===n.langConfig.lang?c.push(l):"chinese"===n.langConfig.lang&&c.push(d);const a=n.fieldInfos.find((e=>e.do_store&&("body"===e.name||"title"===e.name||"heading"===e.name)));return Promise.all(s.map((e=>h(e,t,n,a,r,c))))}function m(e,t,n,s,r){return c(this,void 0,void 0,(function*(){const o=r.uiOptions.loadingIndicatorRender(d,r);n||s.appendChild(o);const i=document.createDocumentFragment();(n?r.uiOptions.termInfoRender(d,r,e.queryParts):[]).forEach((e=>i.appendChild(e)));const l=yield e.retrieve(r.uiOptions.resultsPerPage),a=yield r.uiOptions.resultsRender(d,r,t,l,e);a.length?a.forEach((e=>i.appendChild(e))):n&&i.appendChild(r.uiOptions.noResultsRender(d,r));const u=i.lastElementChild;n?(s.innerHTML="",s.appendChild(i)):o.replaceWith(i);const p=new IntersectionObserver(((n,o)=>c(this,void 0,void 0,(function*(){n[0].isIntersecting&&(o.unobserve(u),yield m(e,t,!1,s,r))}))),{rootMargin:"10px 10px 10px 10px"});a.length&&p.observe(u)}))}var g;!function(e){e.Auto="auto",e.Dropdown="dropdown",e.Fullscreen="fullscreen",e.Target="target"}(g||(g={}));var y=function(e,t,n,s){return new(n||(n=Promise))((function(r,o){function i(e){try{d(s.next(e))}catch(e){o(e)}}function l(e){try{d(s.throw(e))}catch(e){o(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}d((s=s.apply(e,t||[])).next())}))};let w,v,b=!1,R=!1;function T(e,t,n,s,r){return y(this,void 0,void 0,(function*(){try{w&&w.free(),w=yield s.getQuery(e),yield m(w,s.morselsConfig,!0,n,r),t.scrollTo({top:0}),n.scrollTo({top:0})}catch(e){throw n.innerHTML=e.message,e}finally{if(v){const e=v;v=void 0,yield e()}else R=!1}}))}function x(e){return e.mode===g.Auto&&!b||e.mode===g.Dropdown}const O=function(e){const t=e.isMobileDevice||(()=>window.matchMedia("only screen and (max-width: 1024px)").matches);b=t(),function(e){e.searcherOptions=e.searcherOptions||{},"numberOfExpandedTerms"in e.searcherOptions||(e.searcherOptions.numberOfExpandedTerms=3),"useQueryTermProximity"in e.searcherOptions||(e.searcherOptions.useQueryTermProximity=!b),e.uiOptions=e.uiOptions||{};const{uiOptions:t}=e;if(t.mode=t.mode||g.Auto,t.mode===g.Target&&("string"==typeof t.target&&(t.target=document.getElementById(t.target)),!t.target))throw new Error("'target' mode specified but no valid target option specified");if("input"in t&&"string"!=typeof t.input||(t.input=document.getElementById(t.input||"morsels-search")),[g.Dropdown,g.Target].includes(t.mode)&&!t.input)throw new Error("'dropdown' or 'target' mode specified but no input element found");"inputDebounce"in t||(t.inputDebounce=b?275:200),t.preprocessQuery||(t.preprocessQuery=e=>e),"string"==typeof t.fullscreenContainer&&(t.fullscreenContainer=document.getElementById(t.fullscreenContainer)),t.fullscreenContainer||(t.fullscreenContainer=document.getElementsByTagName("body")[0]),"resultsPerPage"in t||(t.resultsPerPage=8),t.showDropdown=t.showDropdown||((e,t)=>{t.childElementCount&&(t.style.display="block",t.previousSibling.style.display="block")}),t.hideDropdown=t.hideDropdown||((e,t)=>{t.style.display="none",t.previousSibling.style.display="none"}),t.showFullscreen=t.showFullscreen||((e,t,n)=>{n.appendChild(e);const s=e.querySelector("input.morsels-fs-input");s&&s.focus()}),t.hideFullscreen=t.hideFullscreen||(e=>{e.remove()}),t.dropdownRootRender=t.dropdownRootRender||((e,t,n)=>{const s=e("div",{class:"morsels-root"},n);s.appendChild(e("div",{class:`morsels-input-dropdown-separator ${t.uiOptions.dropdownAlignment||"right"}`,style:"display: none;"}));const r=e("ul",{class:`morsels-list ${t.uiOptions.dropdownAlignment||"right"}`,style:"display: none;"});return s.appendChild(r),{dropdownRoot:s,dropdownListContainer:r}}),t.fsRootRender=t.fsRootRender||((e,t,n)=>{const s=e("div",{class:"morsels-root morsels-fs-root"});s.onclick=e=>e.stopPropagation();const r=e("div",{class:"morsels-fs-backdrop"},s);r.onclick=()=>r.remove(),r.addEventListener("keyup",(e=>{"Escape"===e.code&&(e.stopPropagation(),r.remove())}));const o=e("input",{class:"morsels-fs-input",type:"text",placeholder:"Search..."}),i=e("button",{class:"morsels-input-close-fs"});i.onclick=n,s.appendChild(e("div",{class:"morsels-fs-input-button-wrapper"},o,i));const l=e("ul",{class:"morsels-list"});return s.appendChild(l),{root:r,listContainer:l,input:o}}),t.noResultsRender=t.noResultsRender||(e=>e("div",{class:"morsels-no-results"})),t.fsBlankRender=t.fsBlankRender||(e=>e("div",{class:"morsels-fs-blank"})),t.loadingIndicatorRender=t.loadingIndicatorRender||(e=>e("span",{class:"morsels-loading-indicator"})),t.termInfoRender=t.termInfoRender||(()=>[]),t.resultsRender=t.resultsRender||f,t.resultsRenderOpts=t.resultsRenderOpts||{},t.resultsRenderOpts.listItemRender=t.resultsRenderOpts.listItemRender||((e,t,n,s,r)=>{const o=e("a",{class:"morsels-link"},e("div",{class:"morsels-title"},s),...r);return n&&o.setAttribute("href",n),e("li",{class:"morsels-list-item"},o)}),t.resultsRenderOpts.headingBodyRender=t.resultsRenderOpts.headingBodyRender||((e,t,n,s,r)=>{const o=e("a",{class:"morsels-heading-body"},e("div",{class:"morsels-heading"},n),e("div",{class:"morsels-bodies"},e("div",{class:"morsels-body"},...s)));return r&&o.setAttribute("href",r),o}),t.resultsRenderOpts.bodyOnlyRender=t.resultsRenderOpts.bodyOnlyRender||((e,t,n)=>e("div",{class:"morsels-body"},...n)),t.resultsRenderOpts.highlightRender=t.resultsRenderOpts.highlightRender||((e,t,n)=>e("span",{class:"morsels-highlight"},n)),e.otherOptions=e.otherOptions||{}}(e);const{uiOptions:n}=e,s=new l(e.searcherOptions);let r=-1,o=!0;const i=(t,i)=>l=>{const c=n.preprocessQuery(l.target.value);if(clearTimeout(r),c.length)r=setTimeout((()=>{o&&(i.innerHTML="",i.appendChild(n.loadingIndicatorRender(d,e)),x(n)&&n.showDropdown(t,i,e)),R?v=()=>T(c,t,i,s,e):(R=!0,T(c,t,i,s,e)),o=!1}),n.inputDebounce);else{const s=()=>{n.mode===g.Target?i.innerHTML="":x(n)?n.hideDropdown(t,i,e):(i.innerHTML="",i.appendChild(n.fsBlankRender(d,e))),R=!1,o=!0};R?v=s:s()}},{root:c,listContainer:a,input:u}=n.fsRootRender(d,e,(()=>n.hideFullscreen(c,a,n.fullscreenContainer,e)));u.addEventListener("input",i(c,a)),u.addEventListener("keydown",(e=>e.stopPropagation())),a.appendChild(n.fsBlankRender(d,e));const{input:p}=n;if(p&&n.mode!==g.Target){const s=p.parentElement;p.remove();const{dropdownRoot:r,dropdownListContainer:o}=n.dropdownRootRender(d,e,p);if(s.appendChild(r),p.addEventListener("input",i(r,o)),p.addEventListener("keydown",(e=>e.stopPropagation())),n.mode===g.Auto){let s;window.addEventListener("resize",(()=>{clearTimeout(s),s=setTimeout((()=>{const s=t();b!==s&&(b=s,b?n.hideDropdown(r,o,e):n.hideFullscreen(c,a,n.fullscreenContainer,e))}),250)}))}p.addEventListener("blur",(()=>{x(n)&&setTimeout((()=>{let t=document.activeElement;for(;t;)if(t=t.parentElement,t===o)return void p.focus();n.hideDropdown(r,o,e)}),100)})),p.addEventListener("focus",(()=>{x(n)?n.showDropdown(r,o,e):n.showFullscreen(c,a,n.fullscreenContainer,e)}))}else p&&n.mode===g.Target&&p.addEventListener("input",i(n.target,n.target));return{showFullscreen:()=>{n.showFullscreen(c,a,n.fullscreenContainer,e)},hideFullscreen:()=>{n.hideFullscreen(c,a,n.fullscreenContainer,e)}}};return t=t.default})()}));