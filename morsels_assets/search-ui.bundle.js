!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.initMorsels=t():e.initMorsels=t()}(self,(function(){return(()=>{"use strict";var e={m:{},d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},u:e=>"search.worker.bundle.js"};e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),e.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var t;e.g.importScripts&&(t=e.g.location+"");var n=e.g.document;if(!t&&n&&(n.currentScript&&(t=n.currentScript.src),!t)){var o=n.getElementsByTagName("script");o.length&&(t=o[o.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),e.p=t})(),e.b=document.baseURI||self.location.href;var t={};function n(e){return e.split("-")[0]}function o(e){return e.split("-")[1]}function r(e){return["top","bottom"].includes(n(e))?"x":"y"}function s(e){return"y"===e?"height":"width"}function i(e){let{reference:t,floating:i,placement:l}=e;const c=t.x+t.width/2-i.width/2,a=t.y+t.height/2-i.height/2;let u;switch(n(l)){case"top":u={x:c,y:t.y-i.height};break;case"bottom":u={x:c,y:t.y+t.height};break;case"right":u={x:t.x+t.width,y:a};break;case"left":u={x:t.x-i.width,y:a};break;default:u={x:t.x,y:t.y}}const d=r(l),f=s(d);switch(o(l)){case"start":u[d]=u[d]-(t[f]/2-i[f]/2);break;case"end":u[d]=u[d]+(t[f]/2-i[f]/2)}return u}e.d(t,{default:()=>he});function l(e){return"number"!=typeof e?function(e){return{top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}function c(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}async function a(e,t){void 0===t&&(t={});const{x:n,y:o,platform:r,rects:s,elements:i,strategy:a}=e,{boundary:u="clippingParents",rootBoundary:d="viewport",elementContext:f="floating",altBoundary:h=!1,padding:p=0}=t,m=l(p),g=i[h?"floating"===f?"reference":"floating":f],y=await r.getClippingClientRect({element:await r.isElement(g)?g:g.contextElement||await r.getDocumentElement({element:i.floating}),boundary:u,rootBoundary:d}),w=c(await r.convertOffsetParentRelativeRectToViewportRelativeRect({rect:"floating"===f?{...s.floating,x:n,y:o}:s.reference,offsetParent:await r.getOffsetParent({element:i.floating}),strategy:a}));return{top:y.top-w.top+m.top,bottom:w.bottom-y.bottom+m.bottom,left:y.left-w.left+m.left,right:w.right-y.right+m.right}}const u={left:"right",right:"left",bottom:"top",top:"bottom"};function d(e){return e.replace(/left|right|bottom|top/g,(e=>u[e]))}function f(e,t){const n="start"===o(e),i=r(e),l=s(i);let c="x"===i?n?"right":"left":n?"bottom":"top";return t.reference[l]>t.floating[l]&&(c=d(c)),{main:c,cross:d(c)}}const h={start:"end",end:"start"};function p(e){return e.replace(/start|end/g,(e=>h[e]))}const m=["top","right","bottom","left"];m.reduce(((e,t)=>e.concat(t,t+"-start",t+"-end")),[]);const g=function(e){return void 0===e&&(e={}),{name:"flip",async fn(t){var o,r;const{placement:s,middlewareData:i,rects:l,initialPlacement:c}=t;if(null!=(o=i.flip)&&o.skip)return{};const{mainAxis:u=!0,crossAxis:h=!0,fallbackPlacements:m,fallbackStrategy:g="bestFit",flipAlignment:y=!0,...w}=e,v=n(s),b=m||(v===c||!y?[d(c)]:function(e){const t=d(e);return[p(e),t,p(t)]}(c)),x=[c,...b],R=await a(t,w),T=[];let O=(null==(r=i.flip)?void 0:r.overflows)||[];if(u&&T.push(R[v]),h){const{main:e,cross:t}=f(s,l);T.push(R[e],R[t])}if(O=[...O,{placement:s,overflows:T}],!T.every((e=>e<=0))){var C,k;const e=(null!=(C=null==(k=i.flip)?void 0:k.index)?C:0)+1,t=x[e];if(t)return{data:{index:e,overflows:O},reset:{placement:t}};let n="bottom";switch(g){case"bestFit":{var P;const e=null==(P=O.slice().sort(((e,t)=>e.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)-t.overflows.filter((e=>e>0)).reduce(((e,t)=>e+t),0)))[0])?void 0:P.placement;e&&(n=e);break}case"initialPlacement":n=c}return{data:{skip:!0},reset:{placement:n}}}return{}}}};const y=function(e){return void 0===e&&(e=0),{name:"offset",fn(t){const{x:o,y:s,placement:i,rects:l}=t,c=function(e){let{placement:t,rects:o,value:s}=e;const i=n(t),l=["left","top"].includes(i)?-1:1,c="function"==typeof s?s({...o,placement:t}):s,{mainAxis:a,crossAxis:u}="number"==typeof c?{mainAxis:c,crossAxis:0}:{mainAxis:0,crossAxis:0,...c};return"x"===r(i)?{x:u,y:a*l}:{x:a*l,y:u}}({placement:i,rects:l,value:e});return{x:o+c.x,y:s+c.y,data:c}}}};const w=function(e){return void 0===e&&(e={}),{name:"size",async fn(t){var r;const{placement:s,rects:i,middlewareData:l}=t,{apply:c,...u}=e,d=await a(t,u),f=n(s),h="end"===o(s);let p,m;"top"===f||"bottom"===f?(p=f,m=h?"left":"right"):(m=f,p=h?"top":"bottom");const g={height:i.floating.height-d[p],width:i.floating.width-d[m]};return null!=(r=l.size)&&r.skip?{}:(null==c||c({...g,...i}),{data:{skip:!0},reset:!0})}}};function v(e){return"[object Window]"===(null==e?void 0:e.toString())}function b(e){if(null==e)return window;if(!v(e)){const t=e.ownerDocument;return t&&t.defaultView||window}return e}function x(e){return b(e).getComputedStyle(e)}function R(e){return v(e)?"":e?(e.nodeName||"").toLowerCase():""}function T(e){return e instanceof b(e).HTMLElement}function O(e){return e instanceof b(e).Element}function C(e){return e instanceof b(e).ShadowRoot||e instanceof ShadowRoot}function k(e){const{overflow:t,overflowX:n,overflowY:o}=x(e);return/auto|scroll|overlay|hidden/.test(t+o+n)}function P(e){return["table","td","th"].includes(R(e))}function E(e){const t=navigator.userAgent.toLowerCase().includes("firefox"),n=x(e);return"none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||["transform","perspective"].includes(n.willChange)||t&&"filter"===n.willChange||t&&!!n.filter&&"none"!==n.filter}function S(e,t){void 0===t&&(t=!1);const n=e.getBoundingClientRect();let o=1,r=1;return t&&T(e)&&(o=e.offsetWidth>0&&Math.round(n.width)/e.offsetWidth||1,r=e.offsetHeight>0&&Math.round(n.height)/e.offsetHeight||1),{width:n.width/o,height:n.height/r,top:n.top/r,right:n.right/o,bottom:n.bottom/r,left:n.left/o,x:n.left/o,y:n.top/r}}function L(e){return(t=e,(t instanceof b(t).Node?e.ownerDocument:e.document)||window.document).documentElement;var t}function D(e){return v(e)?{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}:{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}}function Q(e){return S(L(e)).left+D(e).scrollLeft}function _(e,t,n){const o=T(t),r=L(t),s=S(e,o&&function(e){const t=S(e);return Math.round(t.width)!==e.offsetWidth||Math.round(t.height)!==e.offsetHeight}(t));let i={scrollLeft:0,scrollTop:0};const l={x:0,y:0};if(o||!o&&"fixed"!==n)if(("body"!==R(t)||k(r))&&(i=D(t)),T(t)){const e=S(t,!0);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop}else r&&(l.x=Q(r));return{x:s.left+i.scrollLeft-l.x,y:s.top+i.scrollTop-l.y,width:s.width,height:s.height}}function M(e){return"html"===R(e)?e:e.assignedSlot||e.parentNode||(C(e)?e.host:null)||L(e)}function I(e){return T(e)&&"fixed"!==getComputedStyle(e).position?e.offsetParent:null}function N(e){const t=b(e);let n=I(e);for(;n&&P(n)&&"static"===getComputedStyle(n).position;)n=I(n);return n&&("html"===R(n)||"body"===R(n)&&"static"===getComputedStyle(n).position&&!E(n))?t:n||function(e){let t=M(e);for(;T(t)&&!["html","body"].includes(R(t));){if(E(t))return t;t=t.parentNode}return null}(e)||t}function F(e){return{width:e.offsetWidth,height:e.offsetHeight}}function j(e){return["html","body","#document"].includes(R(e))?e.ownerDocument.body:T(e)&&k(e)?e:j(M(e))}function A(e,t){var n;void 0===t&&(t=[]);const o=j(e),r=o===(null==(n=e.ownerDocument)?void 0:n.body),s=b(o),i=r?[s].concat(s.visualViewport||[],k(o)?o:[]):o,l=t.concat(i);return r?l:l.concat(A(M(i)))}function W(e,t){return"viewport"===t?c(function(e){const t=b(e),n=L(e),o=t.visualViewport;let r=n.clientWidth,s=n.clientHeight,i=0,l=0;return o&&(r=o.width,s=o.height,Math.abs(t.innerWidth/o.scale-o.width)<.001&&(i=o.offsetLeft,l=o.offsetTop)),{width:r,height:s,x:i,y:l}}(e)):O(t)?function(e){const t=S(e),n=t.top+e.clientTop,o=t.left+e.clientLeft;return{top:n,left:o,x:o,y:n,right:o+e.clientWidth,bottom:n+e.clientHeight,width:e.clientWidth,height:e.clientHeight}}(t):c(function(e){var t;const n=L(e),o=D(e),r=null==(t=e.ownerDocument)?void 0:t.body,s=Math.max(n.scrollWidth,n.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),i=Math.max(n.scrollHeight,n.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0);let l=-o.scrollLeft+Q(e);const c=-o.scrollTop;return"rtl"===x(r||n).direction&&(l+=Math.max(n.clientWidth,r?r.clientWidth:0)-s),{width:s,height:i,x:l,y:c}}(L(e)))}function $(e){const t=A(M(e)),n=["absolute","fixed"].includes(x(e).position),o=n&&T(e)?N(e):e;return O(o)?t.filter((e=>O(e)&&function(e,t){const n=null==t.getRootNode?void 0:t.getRootNode();if(e.contains(t))return!0;if(n&&C(n)){let n=t;do{if(n&&e.isSameNode(n))return!0;n=n.parentNode||n.host}while(n)}return!1}(e,o)&&"body"!==R(e)&&(!n||"static"!==x(e).position))):[]}const q={getElementRects:e=>{let{reference:t,floating:n,strategy:o}=e;return{reference:_(t,N(n),o),floating:{...F(n),x:0,y:0}}},convertOffsetParentRelativeRectToViewportRelativeRect:e=>function(e){let{rect:t,offsetParent:n,strategy:o}=e;const r=T(n),s=L(n);if(n===s)return t;let i={scrollLeft:0,scrollTop:0};const l={x:0,y:0};if((r||!r&&"fixed"!==o)&&(("body"!==R(n)||k(s))&&(i=D(n)),T(n))){const e=S(n,!0);l.x=e.x+n.clientLeft,l.y=e.y+n.clientTop}return{...t,x:t.x-i.scrollLeft+l.x,y:t.y-i.scrollTop+l.y}}(e),getOffsetParent:e=>{let{element:t}=e;return N(t)},isElement:e=>O(e),getDocumentElement:e=>{let{element:t}=e;return L(t)},getClippingClientRect:e=>function(e){let{element:t,boundary:n,rootBoundary:o}=e;const r=[..."clippingParents"===n?$(t):[].concat(n),o],s=r[0],i=r.reduce(((e,n)=>{const o=W(t,n);return e.top=Math.max(o.top,e.top),e.right=Math.min(o.right,e.right),e.bottom=Math.min(o.bottom,e.bottom),e.left=Math.max(o.left,e.left),e}),W(t,s));return i.width=i.right-i.left,i.height=i.bottom-i.top,i.x=i.left,i.y=i.top,i}(e),getDimensions:e=>{let{element:t}=e;return F(t)}},B=(e,t,n)=>(async(e,t,n)=>{const{placement:o="bottom",strategy:r="absolute",middleware:s=[],platform:l}=n;let c=await l.getElementRects({reference:e,floating:t,strategy:r}),{x:a,y:u}=i({...c,placement:o}),d=o,f={};for(let n=0;n<s.length;n++){const{name:h,fn:p}=s[n],{x:m,y:g,data:y,reset:w}=await p({x:a,y:u,initialPlacement:o,placement:d,strategy:r,middlewareData:f,rects:c,platform:l,elements:{reference:e,floating:t}});a=null!=m?m:a,u=null!=g?g:u,f={...f,[h]:null!=y?y:{}},w&&("object"==typeof w&&w.placement&&(d=w.placement),c=await l.getElementRects({reference:e,floating:t,strategy:r}),({x:a,y:u}=i({...c,placement:d})),n=-1)}return{x:a,y:u,placement:d,strategy:r,middlewareData:f}})(e,t,{platform:q,...n});const H=class{constructor(e,t,n,o,r){this.query=e,this.searchedTerms=t,this.queryParts=n,this.getNextN=o,this.free=r}};var J=function(e,t,n,o){return new(n||(n=Promise))((function(r,s){function i(e){try{c(o.next(e))}catch(e){s(e)}}function l(e){try{c(o.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}c((o=o.apply(e,t||[])).next())}))};const U=class{constructor(e,t,n){this.docId=e,this.score=t,this.fieldInfos=n,this.storage=Object.create(null)}populate(e,t,n){return J(this,void 0,void 0,(function*(){const{fieldStoreBlockSize:o,numStoresPerDir:r,indexingConfig:s}=n,{numDocsPerBlock:i}=s,l=Math.floor(this.docId/o),c=Math.floor(this.docId/i),a=Math.floor(l/r),u=`${e}field_store/${a}/${l}--${c}.json`;try{const e=yield t.fetch(u);let n=this.docId%o;i<o&&(n%=i),this.storage=e[n]}catch(e){console.log(e)}}))}getSingleField(e){const t=this.fieldInfos.find((t=>t.name===e));if(!t)return"";const n=this.storage.find((e=>e[0]===t.id));return n?n[1]:""}getStorageWithFieldNames(){return this.storage.map((e=>{const t=e.map((e=>e));return t[0]=this.fieldInfos[t[0]].name,t}))}};class z{constructor(){this.linkToJsons=Object.create(null)}fetch(e){return this.linkToJsons[e]||(this.linkToJsons[e]=fetch(e).then((e=>e.json()))),this.linkToJsons[e]}}var V=function(e,t,n,o){return new(n||(n=Promise))((function(r,s){function i(e){try{c(o.next(e))}catch(e){s(e)}}function l(e){try{c(o.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}c((o=o.apply(e,t||[])).next())}))};const X=class{constructor(t){this.options=t,this.workerQueryPromises=Object.create(null),this.nextId=0,this.worker=new Worker(new URL(e.p+e.u(658),e.b));const n=new Promise((e=>{this.worker.onmessage=t=>{if(t.data.isSetupDone)e();else if(t.data.query){const{query:e,queryId:n,nextResults:o,searchedTerms:r,queryParts:s}=t.data;this.workerQueryPromises[e][n].resolve({query:e,nextResults:o,searchedTerms:r,queryParts:s})}},this.worker.onmessageerror=e=>{console.log(e)}}));this.setupPromise=this.retrieveConfig().then((()=>{t.useQueryTermProximity=t.useQueryTermProximity&&this.morselsConfig.indexingConfig.withPositions,this.worker.postMessage(this.morselsConfig)})).then((()=>this.cacheFieldStores())).then((()=>n))}cacheFieldStores(){return V(this,void 0,void 0,(function*(){if(!this.options.cacheAllFieldStores)return;this.persistentJsonCache=new z;const e=[],t=Math.ceil(this.morselsConfig.lastDocId/this.morselsConfig.fieldStoreBlockSize),{numStoresPerDir:n,indexingConfig:o}=this.morselsConfig,{numDocsPerBlock:r}=o;for(let o=0;o<t;o++){const t=Math.floor(o/n),s=Math.floor(o/r),i=`${this.options.url}field_store/${t}/${o}--${s}.json`;if(e.push([i,fetch(i).then((e=>e.json()))]),e.length>=10){const t=e.shift();this.persistentJsonCache.linkToJsons[t[0]]=yield t[1]}}const s=yield Promise.all(e.map((e=>e[1])));e.forEach(((e,t)=>{this.persistentJsonCache.linkToJsons[e[0]]=s[t]}))}))}retrieveConfig(){return V(this,void 0,void 0,(function*(){const e=yield(yield fetch(`${this.options.url}morsels_config.json`,{method:"GET",headers:{"Content-Type":"application/json"}})).json();if("0.0.6"!==e.ver)throw new Error("Morsels search version not equal to indexer version!");"cacheAllFieldStores"in this.options||(this.options.cacheAllFieldStores=!!e.cache_all_field_stores);const{field_infos:t}=e,n=[];Object.entries(t.field_infos_map).forEach((([e,t])=>{t.name=e,n.push(t)})),n.sort(((e,t)=>e.id-t.id)),this.morselsConfig={lastDocId:e.last_doc_id,indexingConfig:{loaderConfigs:e.indexing_config.loader_configs,plNamesToCache:e.indexing_config.pl_names_to_cache,numDocsPerBlock:e.indexing_config.num_docs_per_block,numPlsPerDir:e.indexing_config.num_pls_per_dir,withPositions:e.indexing_config.with_positions},langConfig:e.lang_config,fieldInfos:n,numScoredFields:t.num_scored_fields,fieldStoreBlockSize:t.field_store_block_size,numStoresPerDir:t.num_stores_per_dir,searcherOptions:this.options}}))}deleteQuery(e,t){delete this.workerQueryPromises[e][t],0===Object.keys(this.workerQueryPromises[e]).length&&delete this.workerQueryPromises[e]}getQuery(e){return V(this,void 0,void 0,(function*(){yield this.setupPromise;const t=this.nextId;this.nextId+=1,this.workerQueryPromises[e]=this.workerQueryPromises[e]||{},this.workerQueryPromises[e][t]={promise:void 0,resolve:void 0},this.workerQueryPromises[e][t].promise=new Promise((n=>{this.workerQueryPromises[e][t].resolve=n,this.worker.postMessage({query:e,queryId:t})}));const n=yield this.workerQueryPromises[e][t].promise;return new H(e,n.searchedTerms,n.queryParts,(n=>V(this,void 0,void 0,(function*(){if(!this.workerQueryPromises[e]||!this.workerQueryPromises[e][t])return[];if(yield this.workerQueryPromises[e][t].promise,this.workerQueryPromises[e][t].promise=new Promise((o=>{this.workerQueryPromises[e][t].resolve=o,this.worker.postMessage({query:e,queryId:t,isGetNextN:!0,n})})),!this.workerQueryPromises[e]||!this.workerQueryPromises[e][t])return[];const o=(yield this.workerQueryPromises[e][t].promise).nextResults.map((([e,t])=>new U(e,t,this.morselsConfig.fieldInfos))),r=this.persistentJsonCache||new z;return yield Promise.all(o.map((e=>e.populate(this.options.url,r,this.morselsConfig)))),o}))),(()=>{this.deleteQuery(e,t),this.worker.postMessage({query:e,isFree:!0})}))}))}};const G=function(e,t,...n){const o=document.createElement(e);return Object.entries(t).forEach((([e,t])=>{o.setAttribute(e,t)})),n.forEach((e=>{if("string"==typeof e){const t=document.createElement("span");t.textContent=e,o.appendChild(t)}else o.appendChild(e)})),o};function Y(e){return e.startsWith("/")?new URL(new URL(window.location.href).origin+e):new URL(e)}var K=function(e,t,n,o){return new(n||(n=Promise))((function(r,s){function i(e){try{c(o.next(e))}catch(e){s(e)}}function l(e){try{c(o.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}c((o=o.apply(e,t||[])).next())}))};const Z=new DOMParser,ee="_relative_fp";function te(e,t,n,o,r){const{highlightRender:s,bodyOnlyRender:i,headingBodyRender:l}=r.uiOptions.resultsRenderOpts,c=Object.create(null);t.forEach(((e,t)=>{c[e.toLowerCase()]=t}));let a=0;function u(e){let o,i,l;for(const r of n){o=t.map((()=>-1e8)),i=o.map((e=>e)),l=0;let n=1e8,s=r.exec(e);if(s){for(;s;){const t=s[2].toLowerCase(),a=c[t];o[a]=s.index+s[1].length,s[1].length>0&&(r.lastIndex=o[a]);const u=o.filter((e=>e>=0)),d=Math.max(...u)-Math.min(...u),f=u.length>l;(f||d<n)&&(f&&(l=u.length),n=d,i=o.map((e=>e))),s=r.exec(e)}r.lastIndex=0;break}r.lastIndex=0}const u=i.map(((e,n)=>({pos:e,term:t[n]}))).filter((e=>e.pos>=0)).sort(((e,t)=>e.pos-t.pos)),d=[];if(!u.length||l<a)return{result:d,numberTermsMatched:l};let f=0;for(let t=0;t<u.length;t+=1){const{pos:n,term:o}=u[t],i=n+o.length;n>f+80?(d.push(G("span",{class:"morsels-ellipsis"})),d.push(e.substring(n-40,n)),d.push(s(G,r,o)),d.push(e.substring(i,i+40))):(d.pop(),d.push(e.substring(f,n)),d.push(s(G,r,o)),d.push(e.substring(i,i+40))),f=i}return d.push(G("span",{class:"morsels-ellipsis"})),{result:d,numberTermsMatched:l}}let d=-1,f={result:void 0,numberTermsMatched:0},h=[],p=-1;for(const t of e){if(p+=1,t[0].startsWith("heading"))continue;const{result:n,numberTermsMatched:s}=u(t[1]);if(0===s||s<a)continue;s>a&&(h=[],a=s);let c=p-1;for(;c>d;c-=1)if("heading"===e[c][0]){d=c,h.push({result:l(G,r,e[c][1],n,c-1>=0&&"headingLink"===e[c-1][0]&&`${o}#${e[c-1][1]}`),numberTermsMatched:s});break}!h.length&&s>f.numberTermsMatched&&(f={result:i(G,r,n),numberTermsMatched:s})}return!h.length&&f.numberTermsMatched>0&&h.push(f),h.map((e=>e.result)).slice(0,2)}function ne(e,t,n,o,r,s,i){return K(this,void 0,void 0,(function*(){const{loaderConfigs:l}=n.indexingConfig,c=e.getStorageWithFieldNames(),a=c.find((e=>e[0]===ee)),u=a&&a[1]||"",d="string"==typeof t.uiOptions.sourceFilesUrl;let f=d?`${t.uiOptions.sourceFilesUrl}${u}`:void 0;const h=c.find((e=>"title"===e[0]));let p,m=h&&h[1]||u,g=f;if(t.uiOptions.resultsRenderOpts.addSearchedTerms){const e=Y(f);e.searchParams.append(t.uiOptions.resultsRenderOpts.addSearchedTerms,s),g=e.toString()}if(o)p=te(c.filter((e=>e[0]!==ee&&"title"!==e[0])),r.searchedTerms,i,g,t);else if(a&&d)if(f.endsWith(".html")&&l.HtmlLoader){const e=yield(yield fetch(f)).text(),n=Z.parseFromString(e,"text/html"),{title:o,bodies:s}=function(e,t,n,o,r,s){const i=[];if(t.exclude_selectors)for(const n of t.exclude_selectors){const t=e.querySelectorAll(n);for(let e=0;e<t.length;e+=1)t[e].remove()}t.selectors=t.selectors||[];const l=t.selectors.map((e=>e.selector)).join(",");!function e(n,o){for(const e of t.selectors)if(n.matches(e.selector)){Object.entries(e.attr_map).forEach((([e,t])=>{n.attributes[e]&&i.push([t,n.attributes[e].value])})),o=e.field_name;break}if(n.querySelector(l))for(let t=0;t<n.childNodes.length;t+=1){const r=n.childNodes[t];r.nodeType===Node.ELEMENT_NODE?e(r,o):r.nodeType===Node.TEXT_NODE&&o&&(i.length&&i[i.length-1][0]===o?i[i.length-1][1]+=r.data:i.push([o,r.data]))}else o&&(i.length&&i[i.length-1][0]===o?i[i.length-1][1]+=n.innerText:i.push([o,n.innerText||""]))}(e.documentElement,void 0);const c=i.find((e=>"title"===e[0]));let a="";return c&&([,a]=c,c[1]=""),{title:a,bodies:te(i,n,o,r,s)}}(n,l.HtmlLoader,r.searchedTerms,i,g,t);m=o||m,p=s}else{const e=Y(f);if(e.pathname.endsWith(".json")&&l.JsonLoader){const n=yield(yield fetch(f)).json(),{title:o,bodies:s}=function(e,t,n,o,r,s){const i=[],{field_map:l,field_order:c}=t,a=Object.entries(l).find((([,e])=>"title"===e)),u=a&&a[0];for(const t of c)t!==u&&e[t]&&i.push([l[t],e[t]]);return{title:u&&e[u],bodies:te(i,n,o,r,s)}}(e.hash?n[e.hash.substring(1)]:n,l.JsonLoader,r.searchedTerms,i,g,t);m=o||m,p=s}}else p=[];return t.uiOptions.resultsRenderOpts.listItemRender(G,t,s,f,m,p,c)}))}function oe(e,t,n,o,r){const s=r.searchedTerms.map((e=>`(${function(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}(e)})`)).join("|"),i=new RegExp(`(^|\\W)(${s})(?=\\W|$)`,"gi"),l=new RegExp(`(^|\\W)(${s})`,"gi"),c=new RegExp(`()(${s})`,"gi"),a=[];"ascii"===n.langConfig.lang?a.push(i):"latin"===n.langConfig.lang?a.push(l):"chinese"===n.langConfig.lang&&a.push(c);const u=n.fieldInfos.find((e=>e.do_store&&("body"===e.name||"title"===e.name||"heading"===e.name))),d=JSON.stringify(r.searchedTerms);return Promise.all(o.map((e=>ne(e,t,n,u,r,d,a))))}function re(e,t,n,o,r,s){return K(this,void 0,void 0,(function*(){if(t!==e.currQuery)return;const i=s.uiOptions.loadingIndicatorRender(G,s);o||r.appendChild(i),e.lastElObserver&&e.lastElObserver.disconnect();const l=document.createDocumentFragment();(o?s.uiOptions.termInfoRender(G,s,t.queryParts):[]).forEach((e=>l.appendChild(e)));const c=yield t.getNextN(s.uiOptions.resultsPerPage);if(t!==e.currQuery)return;const a=yield s.uiOptions.resultsRender(G,s,n,c,t);if(t!==e.currQuery)return;a.length?a.forEach((e=>l.appendChild(e))):o&&l.appendChild(s.uiOptions.noResultsRender(G,s));const u=l.lastElementChild;o?(r.innerHTML="",r.appendChild(l)):i.replaceWith(l),a.length&&(e.lastElObserver=new IntersectionObserver(((o,i)=>K(this,void 0,void 0,(function*(){o[0].isIntersecting&&(i.unobserve(u),yield re(e,t,n,!1,r,s))}))),{rootMargin:"10px 10px 10px 10px"}),e.lastElObserver.observe(u))}))}var se;!function(e){e.Auto="auto",e.Dropdown="dropdown",e.Fullscreen="fullscreen",e.Target="target"}(se||(se={}));class ie{constructor(){this.isRunningNewQuery=!1}}var le=function(e,t,n,o){return new(n||(n=Promise))((function(r,s){function i(e){try{c(o.next(e))}catch(e){s(e)}}function l(e){try{c(o.throw(e))}catch(e){s(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,l)}c((o=o.apply(e,t||[])).next())}))};let ce=!1,ae=!1,ue=!1;function de(e){return e.mode===se.Auto&&!ce||e.mode===se.Dropdown}function fe(e,t,n,o){const{uiOptions:r}=o,s=new ie;function i(r){var i;return le(this,void 0,void 0,(function*(){try{null===(i=s.currQuery)||void 0===i||i.free(),s.currQuery=yield n.getQuery(r),yield re(s,s.currQuery,n.morselsConfig,!0,t,o),e.scrollTo({top:0}),t.scrollTo({top:0})}catch(e){throw console.error(e),t.innerHTML='<div class="morsels-error"></div>',e}finally{if(s.nextQuery){const e=s.nextQuery;s.nextQuery=void 0,yield e()}else s.isRunningNewQuery=!1}}))}let l=-1,c=!0;return n=>{const a=r.preprocessQuery(n.target.value);if(clearTimeout(l),a.length)l=setTimeout((()=>{c&&(t.innerHTML="",t.appendChild(r.loadingIndicatorRender(G,o)),de(r)&&r.showDropdown(e,t,o)),s.isRunningNewQuery?s.nextQuery=()=>i(a):(s.isRunningNewQuery=!0,i(a)),c=!1}),r.inputDebounce);else{const n=()=>{r.mode===se.Target?t.innerHTML="":de(r)?r.hideDropdown(e,t,o):(t.innerHTML="",t.appendChild(r.fsBlankRender(G,o))),s.isRunningNewQuery=!1,c=!0};s.isRunningNewQuery?s.nextQuery=n:n()}}}const he=function(e){const t=e.isMobileDevice||(()=>window.matchMedia("only screen and (max-width: 1024px)").matches);ce=t(),function(e){e.searcherOptions=e.searcherOptions||{},"numberOfExpandedTerms"in e.searcherOptions||(e.searcherOptions.numberOfExpandedTerms=3),"useQueryTermProximity"in e.searcherOptions||(e.searcherOptions.useQueryTermProximity=!ce),"useWand"in e.searcherOptions||(e.searcherOptions.useWand=20),"resultLimit"in e.searcherOptions||(e.searcherOptions.resultLimit=null),e.uiOptions=e.uiOptions||{};const{uiOptions:t}=e;if(t.mode=t.mode||se.Auto,t.mode===se.Target&&("string"==typeof t.target&&(t.target=document.getElementById(t.target)),!t.target))throw new Error("'target' mode specified but no valid target option specified");if("input"in t&&"string"!=typeof t.input||(t.input=document.getElementById(t.input||"morsels-search")),[se.Dropdown,se.Target].includes(t.mode)&&!t.input)throw new Error("'dropdown' or 'target' mode specified but no input element found");"inputDebounce"in t||(t.inputDebounce=100),t.preprocessQuery||(t.preprocessQuery=e=>e),"string"==typeof t.fullscreenContainer&&(t.fullscreenContainer=document.getElementById(t.fullscreenContainer)),"dropdownAlignment"in t||(t.dropdownAlignment="bottom-end"),t.fullscreenContainer||(t.fullscreenContainer=document.getElementsByTagName("body")[0]),"resultsPerPage"in t||(t.resultsPerPage=8);const n=t.showDropdown||((e,n)=>{n.childElementCount&&(n.style.display="block",n.previousSibling.style.display="block",B(e,n,{placement:t.dropdownAlignment,middleware:[y(8),g({padding:10,mainAxis:!1}),w({apply({width:e,height:t}){Object.assign(n.style,{maxWidth:`min(${e}px, var(--morsels-dropdown-max-width))`,maxHeight:`min(${t}px, var(--morsels-dropdown-max-height))`})},padding:10})]}).then((({x:e,y:t})=>{Object.assign(n.style,{left:`${e}px`,top:`${t}px`})})))});t.showDropdown=(...e)=>{n(...e),ae=!0};const o=t.hideDropdown||((e,t)=>{t.style.display="none",t.previousSibling.style.display="none"});t.hideDropdown=(...e)=>{o(...e),ae=!1};const r=t.showFullscreen||((e,t,n)=>{n.appendChild(e);const o=e.querySelector("input.morsels-fs-input");o&&o.focus()});t.showFullscreen=(...e)=>{r(...e),ue=!0};const s=t.hideFullscreen||(e=>{e.remove()});t.hideFullscreen=(...e)=>{s(...e),ue=!1},t.dropdownRootRender=t.dropdownRootRender||((e,n,o)=>{const r=e("div",{class:"morsels-root"},o);r.appendChild(e("div",{class:`morsels-input-dropdown-separator ${t.dropdownAlignment}`,style:"display: none;"}));const s=e("ul",{class:"morsels-list",style:"display: none;"});return r.appendChild(s),{dropdownRoot:r,dropdownListContainer:s}}),t.fsRootRender=t.fsRootRender||((e,n,o)=>{const r=e("div",{class:"morsels-root morsels-fs-root"});r.onclick=e=>e.stopPropagation();const s=e("div",{class:"morsels-fs-backdrop"},r),i=e("input",{class:"morsels-fs-input",type:"text",placeholder:"Search..."}),l=e("button",{class:"morsels-input-close-fs"});l.onclick=o,r.appendChild(e("div",{class:"morsels-fs-input-button-wrapper"},i,l));const c=e("ul",{class:"morsels-list"});return r.appendChild(c),s.onclick=()=>t.hideFullscreen(s,c,r,n),s.addEventListener("keyup",(e=>{"Escape"===e.code&&(e.stopPropagation(),t.hideFullscreen(s,c,r,n))})),{root:s,listContainer:c,input:i}}),t.noResultsRender=t.noResultsRender||(e=>e("div",{class:"morsels-no-results"})),t.fsBlankRender=t.fsBlankRender||(e=>e("div",{class:"morsels-fs-blank"})),t.loadingIndicatorRender=t.loadingIndicatorRender||(e=>e("span",{class:"morsels-loading-indicator"})),t.termInfoRender=t.termInfoRender||(()=>[]),t.resultsRender=t.resultsRender||oe,t.resultsRenderOpts=t.resultsRenderOpts||{},t.resultsRenderOpts.listItemRender=t.resultsRenderOpts.listItemRender||((t,n,o,r,s,i)=>{const l=t("a",{class:"morsels-link"},t("div",{class:"morsels-title"},s),...i);if(r){let t=r;if(n.uiOptions.resultsRenderOpts.addSearchedTerms){const n=Y(r);n.searchParams.append(e.uiOptions.resultsRenderOpts.addSearchedTerms,o),t=n.toString()}l.setAttribute("href",t)}return t("li",{class:"morsels-list-item"},l)}),t.resultsRenderOpts.headingBodyRender=t.resultsRenderOpts.headingBodyRender||((e,t,n,o,r)=>{const s=e("a",{class:"morsels-heading-body"},e("div",{class:"morsels-heading"},n),e("div",{class:"morsels-bodies"},e("div",{class:"morsels-body"},...o)));return r&&s.setAttribute("href",r),s}),t.resultsRenderOpts.bodyOnlyRender=t.resultsRenderOpts.bodyOnlyRender||((e,t,n)=>e("div",{class:"morsels-body"},...n)),t.resultsRenderOpts.highlightRender=t.resultsRenderOpts.highlightRender||((e,t,n)=>e("span",{class:"morsels-highlight"},n)),e.otherOptions=e.otherOptions||{}}(e);const{uiOptions:n}=e,o=new X(e.searcherOptions),{root:r,listContainer:s,input:i}=n.fsRootRender(G,e,(()=>n.hideFullscreen(r,s,n.fullscreenContainer,e)));let l;i.addEventListener("input",fe(r,s,o,e)),s.appendChild(n.fsBlankRender(G,e));const{input:c}=n;if(c&&n.mode!==se.Target){const i=c.parentElement;c.remove();const{dropdownRoot:a,dropdownListContainer:u}=n.dropdownRootRender(G,e,c);function d(){n.hideDropdown(a,l,e),document.activeElement===c&&n.showDropdown(a,l,e)}let f;l=u,i.appendChild(a),c.addEventListener("input",fe(a,l,o,e)),window.addEventListener("resize",(()=>{clearTimeout(f),f=setTimeout((()=>{n.mode!==se.Dropdown?(ce=t(),ce?n.hideDropdown(a,l,e):(n.hideFullscreen(r,s,n.fullscreenContainer,e),d())):d()}),10)})),c.addEventListener("blur",(()=>{de(n)&&setTimeout((()=>{let t=document.activeElement;for(;t;)if(t=t.parentElement,t===a)return void c.focus();n.hideDropdown(a,l,e)}),100)})),c.addEventListener("focus",(()=>{de(n)?n.showDropdown(a,l,e):n.showFullscreen(r,s,n.fullscreenContainer,e)}))}else c&&n.mode===se.Fullscreen?c.addEventListener("focus",(()=>{n.showFullscreen(r,s,n.fullscreenContainer,e)})):c&&n.mode===se.Target&&c.addEventListener("input",fe(n.target,n.target,o,e));const a=n.loadingIndicatorRender(G,e);return document.addEventListener("keydown",(e=>{if(!["ArrowDown","ArrowUp","Enter"].includes(e.key))return;let t,o=e=>{t.scrollTo({top:e.offsetTop-t.offsetTop-30})};if(de(n)){if(!ae)return;t=l}else if(n.mode===se.Target)t=n.target,o=e=>{e.scrollIntoView({block:"center"})};else{if(!ue)return;t=s}if("ArrowDown"===e.key){const e=t.querySelector(".focus");e?e.nextElementSibling&&!a.isEqualNode(e.nextElementSibling)&&(e.classList.remove("focus"),e.nextElementSibling.classList.add("focus"),o(e.nextElementSibling)):t.firstElementChild.classList.add("focus")}else if("ArrowUp"===e.key){const e=t.querySelector(".focus");e&&e.previousElementSibling&&(e.classList.remove("focus"),e.previousElementSibling.classList.add("focus"),o(e.previousElementSibling))}else if("Enter"===e.key){const e=t.querySelector(".focus");if(e){const t=e.querySelector("a[href]");t&&(window.location.href=t.getAttribute("href"))}}})),{showFullscreen:()=>{n.showFullscreen(r,s,n.fullscreenContainer,e)},hideFullscreen:()=>{n.hideFullscreen(r,s,n.fullscreenContainer,e)}}};return t=t.default})()}));