(()=>{var t,n,e,r,i,o={899:(t,n,e)=>{e.p=__morsWrkrUrl.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/")},519:(t,n,e)=>{"use strict";e.a(t,(async t=>{e.d(n,{get_new_searcher:()=>r.qS,get_query:()=>r.R1});var r=e(417),i=t([r]);r=(i.then?await i:i)[0]}))},417:(t,n,e)=>{"use strict";e.a(t,(async r=>{e.d(n,{qS:()=>A,R1:()=>P,ug:()=>N,G6:()=>E,XP:()=>I,cI:()=>T,ff:()=>F,QC:()=>k,TR:()=>R,$r:()=>W,g8:()=>G,Ry:()=>J,jI:()=>Q,Mt:()=>C,xe:()=>D,Rh:()=>B,uV:()=>H,fY:()=>V,Or:()=>X,oH:()=>Y,J6:()=>z});var i=e(685),o=e(739);t=e.hmd(t);var c=r([o]);o=(c.then?await c:c)[0];const s=new Array(32).fill(void 0);function u(t){return s[t]}s.push(void 0,null,!0,!1);let f=s.length;function a(t){const n=u(t);return function(t){t<36||(s[t]=f,f=t)}(t),n}function _(t){const n=typeof t;if("number"==n||"boolean"==n||null==t)return`${t}`;if("string"==n)return`"${t}"`;if("symbol"==n){const n=t.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==n){const n=t.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(t)){const n=t.length;let e="[";n>0&&(e+=_(t[0]));for(let r=1;r<n;r++)e+=", "+_(t[r]);return e+="]",e}const e=/\[object ([^\]]+)\]/.exec(toString.call(t));let r;if(!(e.length>1))return toString.call(t);if(r=e[1],"Object"==r)try{return"Object("+JSON.stringify(t)+")"}catch(t){return"Object"}return t instanceof Error?`${t.name}: ${t.message}\n${t.stack}`:r}let l,y=0;function b(){return 0===l.byteLength&&(l=new Uint8Array(o.memory.buffer)),l}let d=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const w="function"==typeof d.encodeInto?function(t,n){return d.encodeInto(t,n)}:function(t,n){const e=d.encode(t);return n.set(e),{read:t.length,written:e.length}};function h(t,n,e){if(void 0===e){const e=d.encode(t),r=n(e.length);return b().subarray(r,r+e.length).set(e),y=e.length,r}let r=t.length,i=n(r);const o=b();let c=0;for(;c<r;c++){const n=t.charCodeAt(c);if(n>127)break;o[i+c]=n}if(c!==r){0!==c&&(t=t.slice(c)),i=e(i,r,r=c+3*t.length);const n=b().subarray(i+c,i+r);c+=w(t,n).written}return y=c,i}let g;function m(){return 0===g.byteLength&&(g=new Int32Array(o.memory.buffer)),g}let p,v=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function j(t,n){return v.decode(b().subarray(t,t+n))}function x(t){f===s.length&&s.push(s.length+1);const n=f;return f=s[n],s[n]=t,n}function O(t,n,e){o._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha59af21a78a54efa(t,n,x(e))}function S(t,n){return(0===p.byteLength&&(p=new Uint32Array(o.memory.buffer)),p).subarray(t/4,t/4+n)}function $(t){return null==t}function A(t,n,e,r,i,c,s,u,f,_,l,b,d,w){const g=h(i,o.__wbindgen_malloc,o.__wbindgen_realloc),m=y;var p=$(s)?0:h(s,o.__wbindgen_malloc,o.__wbindgen_realloc),v=y;const j=h(l,o.__wbindgen_malloc,o.__wbindgen_realloc),O=y;return a(o.get_new_searcher(x(t),x(n),e,r,g,m,x(c),p,v,!$(u),$(u)?0:u,x(f),_,j,O,b,d,!$(w),$(w)?0:w))}function P(t,n){const e=h(n,o.__wbindgen_malloc,o.__wbindgen_realloc),r=y;return a(o.get_query(t,e,r))}function q(t,n){try{return t.apply(this,n)}catch(t){o.__wbindgen_exn_store(x(t))}}v.decode();class U{static __wrap(t){const n=Object.create(U.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();o.__wbg_query_free(t)}get_next_n(t){try{const i=o.__wbindgen_add_to_stack_pointer(-16);o.query_get_next_n(i,this.ptr,t);var n=m()[i/4+0],e=m()[i/4+1],r=S(n,e).slice();return o.__wbindgen_free(n,4*e),r}finally{o.__wbindgen_add_to_stack_pointer(16)}}get_query_parts(){try{const e=o.__wbindgen_add_to_stack_pointer(-16);o.query_get_query_parts(e,this.ptr);var t=m()[e/4+0],n=m()[e/4+1];return j(t,n)}finally{o.__wbindgen_add_to_stack_pointer(16),o.__wbindgen_free(t,n)}}get_searched_terms(){try{const e=o.__wbindgen_add_to_stack_pointer(-16);o.query_get_searched_terms(e,this.ptr);var t=m()[e/4+0],n=m()[e/4+1];return j(t,n)}finally{o.__wbindgen_add_to_stack_pointer(16),o.__wbindgen_free(t,n)}}}class M{static __wrap(t){const n=Object.create(M.prototype);return n.ptr=t,n}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();o.__wbg_searcher_free(t)}get_ptr(){return o.searcher_get_ptr(this.ptr)}}function N(t){a(t)}function E(t){const n=a(t).original;if(1==n.cnt--)return n.a=0,!0;return!1}function I(t){return void 0===u(t)}function T(t){return x(M.__wrap(t))}function F(t){return x(U.__wrap(t))}function k(t,n,e,r){return x((0,i.T)(t>>>0,n>>>0,j(e,r)))}function R(){return q((function(t,n,e){return x(u(t).call(u(n),u(e)))}),arguments)}function W(t){return x(u(t).buffer)}function G(t,n){try{var e={a:t,b:n};const r=new Promise(((t,n)=>{const r=e.a;e.a=0;try{return function(t,n,e,r){o.wasm_bindgen__convert__closures__invoke2_mut__h6466cb65a74ced92(t,n,x(e),x(r))}(r,e.b,t,n)}finally{e.a=r}}));return x(r)}finally{e.a=e.b=0}}function J(t){return x(Promise.resolve(u(t)))}function Q(t,n){return x(u(t).then(u(n)))}function C(t,n,e){return x(u(t).then(u(n),u(e)))}function D(t){return x(new Uint8Array(u(t)))}function B(t,n,e){u(t).set(u(n),e>>>0)}function H(t){return u(t).length}function V(t,n){const e=h(_(u(n)),o.__wbindgen_malloc,o.__wbindgen_realloc),r=y;m()[t/4+1]=r,m()[t/4+0]=e}function X(t,n){throw new Error(j(t,n))}function Y(){return x(o.memory)}function z(t,n,e){const r=function(t,n,e,r){const i={a:t,b:n,cnt:1,dtor:e},c=(...t)=>{i.cnt++;const n=i.a;i.a=0;try{return r(n,i.b,...t)}finally{0==--i.cnt?o.__wbindgen_export_2.get(i.dtor)(n,i.b):i.a=n}};return c.original=i,c}(t,n,24,O);return x(r)}g=new Int32Array(o.memory.buffer),p=new Uint32Array(o.memory.buffer),l=new Uint8Array(o.memory.buffer)}))},685:(t,n,e)=>{"use strict";async function r(t,n,e){const r=`${e}pl_${Math.floor(t/n)}/pl_${t}.json`,i=`morsels:${e}`;function o(t){return fetch(t).then((t=>t.arrayBuffer()))}try{const t=await caches.open(i),n=await t.match(r);return n?await n.arrayBuffer():await o(r)}catch{return o(r)}}e.d(n,{T:()=>r})},739:(t,n,e)=>{"use strict";var r=([r])=>e.v(n,t.id,"5a29eaecad86497bbca9",{"./index_bg.js":{__wbindgen_object_drop_ref:r.ug,__wbindgen_cb_drop:r.G6,__wbindgen_is_undefined:r.XP,__wbg_searcher_new:r.cI,__wbg_query_new:r.ff,__wbg_fetchPl_fa41dc3145bc2038:r.QC,__wbg_call_9855a4612eb496cb:r.TR,__wbg_buffer_de1150f91b23aa89:r.$r,__wbg_new_78403b138428b684:r.g8,__wbg_resolve_f269ce174f88b294:r.Ry,__wbg_then_1c698eedca15eed6:r.jI,__wbg_then_4debc41d4fc92ce5:r.Mt,__wbg_new_97cf52648830a70d:r.xe,__wbg_set_a0172b213e2469e9:r.Rh,__wbg_length_e09c0b925ab8de5d:r.uV,__wbindgen_debug_string:r.fY,__wbindgen_throw:r.Or,__wbindgen_memory:r.oH,__wbindgen_closure_wrapper102:r.J6}});e.a(t,(t=>{var n=t([e(417)]);return n.then?n.then(r):r(n)}),1)}},c={};function s(t){var n=c[t];if(void 0!==n)return n.exports;var e=c[t]={id:t,loaded:!1,exports:{}};return o[t](e,e.exports,s),e.loaded=!0,e.exports}t="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",e=t=>{t&&(t.forEach((t=>t.r--)),t.forEach((t=>t.r--?t.r++:t())))},r=t=>!--t.r&&t(),i=(t,n)=>t?t.push(n):r(n),s.a=(o,c,s)=>{var u,f,a,_=s&&[],l=o.exports,y=!0,b=!1,d=(n,e,r)=>{b||(b=!0,e.r+=n.length,n.map(((n,i)=>n[t](e,r))),b=!1)},w=new Promise(((t,n)=>{a=n,f=()=>(t(l),e(_),_=0)}));w[n]=l,w[t]=(t,n)=>{if(y)return r(t);u&&d(u,t,n),i(_,t),w.catch(n)},o.exports=w,c((o=>{if(!o)return f();var c,s;u=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[t])return o;if(o.then){var c=[];o.then((t=>{s[n]=t,e(c),c=0}));var s={};return s[t]=(t,n)=>(i(c,t),o.catch(n)),s}}var u={};return u[t]=t=>r(t),u[n]=o,u})))(o);var a=new Promise(((t,e)=>{(c=()=>t(s=u.map((t=>t[n])))).r=0,d(u,c,e)}));return c.r?a:s})).then(f,a),y=!1},s.d=(t,n)=>{for(var e in n)s.o(n,e)&&!s.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},s.hmd=t=>((t=Object.create(t)).children||(t.children=[]),Object.defineProperty(t,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+t.id)}}),t),s.o=(t,n)=>Object.prototype.hasOwnProperty.call(t,n),s.v=(t,n,e,r)=>{var i=fetch(s.p+""+e+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(i,r).then((n=>Object.assign(t,n.instance.exports))):i.then((t=>t.arrayBuffer())).then((t=>WebAssembly.instantiate(t,r))).then((n=>Object.assign(t,n.instance.exports)))},s.p="/",(()=>{"use strict";s(899);class t{constructor(t,n,e){this.t=t,this.i=n,this.u=e}_(t){return Array.from(this.u.get_next_n(t))}l(){this.u.free()}}var n=function(t,n,e,r){return new(e||(e=Promise))((function(i,o){function c(t){try{u(r.next(t))}catch(t){o(t)}}function s(t){try{u(r.throw(t))}catch(t){o(t)}}function u(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(c,s)}u((r=r.apply(t,n||[])).next())}))};class e{constructor(t){this.h=t,this.g=Object.create(null)}m(e,r){return n(this,void 0,void 0,(function*(){const n=yield this.j.get_query(this.O.get_ptr(),e);return this.g[e]=this.g[e]||{},this.g[e][r]=new t(JSON.parse(n.get_searched_terms()),JSON.parse(n.get_query_parts()),n),this.g[e][r]}))}S(t,n,e){return this.g[t][n]._(e)}$(t,n){this.g[t][n]&&this.g[t][n].l(),delete this.g[t][n],0===Object.keys(this.g[t]).length&&delete this.g[t]}A(t,e){return n(this,void 0,void 0,(function*(){const[n,r]=t;this.j=yield e;const{indexingConfig:i,langConfig:{lang:o,options:c},fieldInfos:s,numScoredFields:u,searcherOptions:f}=this.h,a=new TextEncoder;let _;const l=c.stop_words;if(l){const t=l.map((t=>a.encode(t))).filter((t=>t.length<255)),n=t.length+t.reduce(((t,n)=>t+n.length),0);_=new Uint8Array(n);let e=0;t.forEach((t=>{_[e++]=t.length,_.set(t,e),e+=t.length}))}const y=s.map((t=>a.encode(t.name))),b=y.reduce(((t,n)=>t+n.length),0),d=new Uint8Array(13*y.length+b),w=new Float32Array(3);let h=0;s.forEach(((t,n)=>{const e=y[n].length;d[h++]=e,d.set(y[n],h),h+=e,w[0]=t.weight,w[1]=t.k,w[2]=t.b,d.set(new Uint8Array(w.buffer),h),h+=12})),this.O=yield this.j.get_new_searcher(n,r,i.numPlsPerDir,i.withPositions,o,_,c.stemmer,c.max_term_len,d,u,f.url,f.numberOfExpandedTerms,f.useQueryTermProximity,f.resultLimit)}))}static P(t,r){return n(this,void 0,void 0,(function*(){const n=new e(t),i=t.searcherOptions.url,o=`${i}bitmap_docinfo_dicttable.json`,c=`${i}dictionary_string.json`;let s;try{s=yield caches.open(`morsels:${i}`)}catch(t){}const u=yield Promise.all([(s?s.match(o).then((t=>!t&&s.add(o))).then((()=>s.match(o))):fetch(o)).then((t=>t.arrayBuffer())),(s?s.match(c).then((t=>!t&&s.add(c))).then((()=>s.match(c))):fetch(c)).then((t=>t.arrayBuffer()))]);return yield n.A(u,r),n}))}}var r=function(t,n,e,r){return new(e||(e=Promise))((function(i,o){function c(t){try{u(r.next(t))}catch(t){o(t)}}function s(t){try{u(r.throw(t))}catch(t){o(t)}}function u(t){var n;t.done?i(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(c,s)}u((r=r.apply(t,n||[])).next())}))};!function(t){let n;onmessage=function(i){return r(this,void 0,void 0,(function*(){if(i.data.searcherOptions)n=yield e.P(i.data,t),postMessage({isSetupDone:!0});else if(i.data.query){const{query:t,queryId:e,n:r,isFree:o,isGetNextN:c}=i.data;if(o)n.$(t,e);else if(c){const i=n.S(t,e,r);postMessage({query:t,queryId:e,nextResults:i})}else{const r=yield n.m(t,e);postMessage({query:t,queryId:e,searchedTerms:r.t,queryParts:r.i})}}}))},postMessage("")}(Promise.resolve().then(s.bind(s,519)))})()})();