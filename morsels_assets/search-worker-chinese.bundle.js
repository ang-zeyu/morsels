(()=>{var e,n,t,r,o,_={899:(e,n,t)=>{t.p=__morsWrkrUrl.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/")},312:(e,n,t)=>{"use strict";t.a(e,(async e=>{t.d(n,{get_new_searcher:()=>r.qS,get_query:()=>r.R1});var r=t(440),o=e([r]);r=(o.then?await o:o)[0]}))},440:(e,n,t)=>{"use strict";t.a(e,(async r=>{t.d(n,{qS:()=>A,R1:()=>I,ug:()=>$,G6:()=>N,uv:()=>P,rp:()=>M,cb:()=>E,cI:()=>F,ry:()=>W,m_:()=>G,ff:()=>C,sv:()=>R,XP:()=>U,NA:()=>z,Gt:()=>D,fs:()=>H,Gn:()=>L,j2:()=>X,FP:()=>K,vz:()=>V,Rb:()=>Y,o$:()=>Z,_3:()=>J,Wl:()=>ee,Ge:()=>ne,OF:()=>te,xB:()=>re,KQ:()=>oe,vm:()=>_e,TL:()=>ie,Oo:()=>ce,oH:()=>ue,EF:()=>se,Ip:()=>fe,$q:()=>ae,qt:()=>be,j1:()=>le,cN:()=>de,vC:()=>ge,h4:()=>we,GW:()=>he,pT:()=>ye,lC:()=>pe,M1:()=>me,d8:()=>ve,ID:()=>xe,Zn:()=>je,fg:()=>qe,zr:()=>Oe,HT:()=>Ae,fW:()=>Ie,td:()=>Se,$0:()=>ke,oo:()=>Be,Ns:()=>Te,_8:()=>Qe,Si:()=>$e,i9:()=>Ne,I7:()=>Pe,_9:()=>Me,Cp:()=>Ee,zL:()=>Fe,fY:()=>We,Or:()=>Ge,pi:()=>Ce,My:()=>Re,jV:()=>Ue,Xc:()=>ze});var o=t(926);e=t.hmd(e);var _=r([o]);o=(_.then?await _:_)[0];const i=new Array(32).fill(void 0);function c(e){return i[e]}i.push(void 0,null,!0,!1);let u=i.length;function s(e){const n=c(e);return function(e){e<36||(i[e]=u,u=e)}(e),n}function f(e){u===i.length&&i.push(i.length+1);const n=u;return u=i[n],i[n]=e,n}let a=0,b=null;function l(){return null!==b&&b.buffer===o.memory.buffer||(b=new Uint8Array(o.memory.buffer)),b}let d=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const g="function"==typeof d.encodeInto?function(e,n){return d.encodeInto(e,n)}:function(e,n){const t=d.encode(e);return n.set(t),{read:e.length,written:t.length}};function w(e,n,t){if(void 0===t){const t=d.encode(e),r=n(t.length);return l().subarray(r,r+t.length).set(t),a=t.length,r}let r=e.length,o=n(r);const _=l();let i=0;for(;i<r;i++){const n=e.charCodeAt(i);if(n>127)break;_[o+i]=n}if(i!==r){0!==i&&(e=e.slice(i)),o=t(o,r,r=i+3*e.length);const n=l().subarray(o+i,o+r);i+=g(e,n).written}return a=i,o}function h(e){return null==e}let y=null;function p(){return null!==y&&y.buffer===o.memory.buffer||(y=new Int32Array(o.memory.buffer)),y}let m=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function v(e,n){return m.decode(l().subarray(e,e+n))}m.decode();let x=null;function j(e){const n=typeof e;if("number"==n||"boolean"==n||null==e)return`${e}`;if("string"==n)return`"${e}"`;if("symbol"==n){const n=e.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==n){const n=e.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(e)){const n=e.length;let t="[";n>0&&(t+=j(e[0]));for(let r=1;r<n;r++)t+=", "+j(e[r]);return t+="]",t}const t=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(!(t.length>1))return toString.call(e);if(r=t[1],"Object"==r)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:r}function q(e,n,t){o._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc8f8971ae91b6dd4(e,n,f(t))}function O(e,n){try{return e.apply(this,n)}catch(e){o.__wbindgen_exn_store(f(e))}}function A(e,n,t){return s(o.get_new_searcher(f(e),f(n),f(t)))}function I(e,n){const t=w(n,o.__wbindgen_malloc,o.__wbindgen_realloc),r=a;return s(o.get_query(e,t,r))}const S=new Uint32Array(2),k=new BigUint64Array(S.buffer),B=new BigInt64Array(S.buffer);class T{static __wrap(e){const n=Object.create(T.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();o.__wbg_query_free(e)}get_next_n(e){return s(o.query_get_next_n(this.ptr,e))}get_query_parts(){return s(o.query_get_query_parts(this.ptr))}get_searched_terms(){return s(o.query_get_searched_terms(this.ptr))}}class Q{static __wrap(e){const n=Object.create(Q.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();o.__wbg_searcher_free(e)}get_ptr(){return o.searcher_get_ptr(this.ptr)}}function $(e){s(e)}function N(e){const n=s(e).original;return 1==n.cnt--&&(n.a=0,!0)}function P(e,n){return f(new Error(v(e,n)))}function M(e,n){return f(c(e)[n>>>0])}function E(e){return f(new Uint8Array(c(e)))}function F(e){return f(Q.__wrap(e))}function W(){return O((function(e,n,t){return f(c(e).call(c(n),c(t)))}),arguments)}function G(e){return f(c(e))}function C(e){return f(T.__wrap(e))}function R(){return O((function(e){return f(c(e).caches)}),arguments)}function U(e){return void 0===c(e)}function z(e,n,t){return f(c(e).open(v(n,t)))}function D(e){return c(e)instanceof Cache}function H(e,n,t){return f(c(e).match(v(n,t)))}function L(e){return c(e)instanceof Response}function X(e,n,t){return f(c(e).fetch(v(n,t)))}function K(){return O((function(e){return f(c(e).arrayBuffer())}),arguments)}function V(){return f(Symbol.iterator)}function Y(){return O((function(e,n){return f(Reflect.get(c(e),c(n)))}),arguments)}function Z(e){return"function"==typeof c(e)}function J(){return O((function(e,n){return f(c(e).call(c(n)))}),arguments)}function ee(e){const n=c(e);return"object"==typeof n&&null!==n}function ne(e){return f(c(e).next)}function te(){return O((function(){return f(self.self)}),arguments)}function re(){return O((function(){return f(window.window)}),arguments)}function oe(){return O((function(){return f(globalThis.globalThis)}),arguments)}function _e(){return O((function(){return f(t.g.global)}),arguments)}function ie(e,n){return f(new Function(v(e,n)))}function ce(e){return c(e).length}function ue(){return f(o.memory)}function se(e){return f(c(e).buffer)}function fe(e,n,t){c(e).set(c(n),t>>>0)}function ae(){return O((function(e,n){return Reflect.has(c(e),c(n))}),arguments)}function be(e,n){const t=c(n),r="string"==typeof t?t:void 0;var _=h(r)?0:w(r,o.__wbindgen_malloc,o.__wbindgen_realloc),i=a;p()[e/4+1]=i,p()[e/4+0]=_}function le(){return f(new Array)}function de(){return f(new Object)}function ge(e,n,t){c(e)[s(n)]=s(t)}function we(e,n){return f(v(e,n))}function he(e,n,t){c(e)[n>>>0]=s(t)}function ye(e){return f(e)}function pe(e,n){return f(c(e)[s(n)])}function me(e,n){const t=c(n),r="number"==typeof t?t:void 0;(null!==x&&x.buffer===o.memory.buffer||(x=new Float64Array(o.memory.buffer)),x)[e/8+1]=h(r)?0:r,p()[e/4+0]=!h(r)}function ve(e,n){try{var t={a:e,b:n};const r=new Promise(((e,n)=>{const r=t.a;t.a=0;try{return function(e,n,t,r){o.wasm_bindgen__convert__closures__invoke2_mut__h7c952de93a393bd4(e,n,f(t),f(r))}(r,t.b,e,n)}finally{t.a=r}}));return f(r)}finally{t.a=t.b=0}}function xe(){return O((function(e){return f(c(e).next())}),arguments)}function je(e){return c(e).done}function qe(e){return f(c(e).value)}function Oe(e){return null===c(e)}function Ae(e){const n=c(e);return"boolean"==typeof n?n?1:0:2}function Ie(e){return"bigint"==typeof c(e)}function Se(e,n){const t=BigInt(c(n));B[0]=t;const r=S[0],o=S[1];p()[e/4+1]=o,p()[e/4+0]=r}function ke(e,n){S[0]=e,S[1]=n;const t=B[0];return f(BigInt(t))}function Be(e,n){return Object.is(c(e),c(n))}function Te(e){return Number.isSafeInteger(c(e))}function Qe(e){return Array.isArray(c(e))}function $e(e,n){const t=BigInt(c(n));k[0]=t;const r=S[0],o=S[1];p()[e/4+1]=o,p()[e/4+0]=r}function Ne(e,n){S[0]=e,S[1]=n;const t=k[0];return f(BigInt(t))}function Pe(e){return c(e).length}function Me(e){return f(Object.entries(c(e)))}function Ee(e){return c(e)instanceof Uint8Array}function Fe(e){return c(e)instanceof ArrayBuffer}function We(e,n){const t=w(j(c(n)),o.__wbindgen_malloc,o.__wbindgen_realloc),r=a;p()[e/4+1]=r,p()[e/4+0]=t}function Ge(e,n){throw new Error(v(e,n))}function Ce(e,n,t){return f(c(e).then(c(n),c(t)))}function Re(e){return f(Promise.resolve(c(e)))}function Ue(e,n){return f(c(e).then(c(n)))}function ze(e,n,t){const r=function(e,n,t,r){const _={a:e,b:n,cnt:1,dtor:42},i=(...e)=>{_.cnt++;const n=_.a;_.a=0;try{return r(n,_.b,...e)}finally{0==--_.cnt?o.__wbindgen_export_2.get(_.dtor)(n,_.b):_.a=n}};return i.original=_,i}(e,n,0,q);return f(r)}}))},926:(e,n,t)=>{"use strict";var r=([r])=>t.v(n,e.id,"b27be480e22878468db2",{"./index_bg.js":{__wbindgen_object_drop_ref:r.ug,__wbindgen_cb_drop:r.G6,__wbg_new_3047bf4b4f02b802:r.uv,__wbg_get_590a2cd912f2ae46:r.rp,__wbg_new_cc9018bd6f283b6f:r.cb,__wbg_searcher_new:r.cI,__wbg_call_3ed288a247f13ea5:r.ry,__wbindgen_object_clone_ref:r.m_,__wbg_query_new:r.ff,__wbg_caches_3efbf43695d369e8:r.sv,__wbindgen_is_undefined:r.XP,__wbg_open_52c5eb54032958d7:r.NA,__wbg_instanceof_Cache_47b072f80dd516f7:r.Gt,__wbg_match_739a4765298f04bf:r.fs,__wbg_instanceof_Response_ccfeb62399355bcd:r.Gn,__wbg_fetch_8df5fcf7dd9fd853:r.j2,__wbg_arrayBuffer_5a99283a3954c850:r.FP,__wbg_iterator_4832ef1f15b0382b:r.vz,__wbg_get_a9cab131e3152c49:r.Rb,__wbindgen_is_function:r.o$,__wbg_call_ae78342adc33730a:r._3,__wbindgen_is_object:r.Wl,__wbg_next_cabb70b365520721:r.Ge,__wbg_self_99737b4dcdf6f0d8:r.OF,__wbg_window_9b61fbbf3564c4fb:r.xB,__wbg_globalThis_8e275ef40caea3a3:r.KQ,__wbg_global_5de1e0f82bddcd27:r.vm,__wbg_newnoargs_e23b458e372830de:r.TL,__wbg_length_0acb1cf9bbaf8519:r.Oo,__wbindgen_memory:r.oH,__wbg_buffer_7af23f65f6c64548:r.EF,__wbg_set_f25e869e4565d2a2:r.Ip,__wbg_has_ce995ec88636803d:r.$q,__wbindgen_string_get:r.qt,__wbg_new_94fb1279cf6afea5:r.j1,__wbg_new_36359baae5a47e27:r.cN,__wbg_set_e93b31d47b90bff6:r.vC,__wbindgen_string_new:r.h4,__wbg_set_561aac756158708c:r.GW,__wbindgen_number_new:r.pT,__wbg_get_093fe3cdafaf8976:r.lC,__wbindgen_number_get:r.M1,__wbg_new_37705eed627d5ed9:r.d8,__wbg_next_bf3d83fc18df496e:r.ID,__wbg_done_040f966faa9a72b3:r.Zn,__wbg_value_419afbd9b9574c4c:r.fg,__wbindgen_is_null:r.zr,__wbindgen_boolean_get:r.HT,__wbindgen_is_bigint:r.fW,__wbg_BigInt_4365947136b5327c:r.td,__wbg_BigInt_73b2c10d8e6eb5a5:r.$0,__wbg_is_40969b082b54c84d:r.oo,__wbg_isSafeInteger_c87467ed96815119:r.Ns,__wbg_isArray_6721f2e508996340:r._8,__wbg_BigInt_6b6f34a01a71ad51:r.Si,__wbg_BigInt_1a499fbb5f402f4c:r.i9,__wbg_length_2cd798326f2cc4c1:r.I7,__wbg_entries_aaf7a1fbe90f014a:r._9,__wbg_instanceof_Uint8Array_edb92795fc0c63b4:r.Cp,__wbg_instanceof_ArrayBuffer_b81b40c2ae0ab898:r.zL,__wbindgen_debug_string:r.fY,__wbindgen_throw:r.Or,__wbg_then_842e65b843962f56:r.pi,__wbg_resolve_a9a87bdd64e9e62c:r.My,__wbg_then_ce526c837d07b68f:r.jV,__wbindgen_closure_wrapper1361:r.Xc}});t.a(e,(e=>{var n=e([t(440)]);return n.then?n.then(r):r(n)}),1)}},i={};function c(e){var n=i[e];if(void 0!==n)return n.exports;var t=i[e]={id:e,loaded:!1,exports:{}};return _[e](t,t.exports,c),t.loaded=!0,t.exports}e="function"==typeof Symbol?Symbol("webpack then"):"__webpack_then__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t=e=>{e&&(e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},r=e=>!--e.r&&e(),o=(e,n)=>e?e.push(n):r(n),c.a=(_,i,c)=>{var u,s,f,a=c&&[],b=_.exports,l=!0,d=!1,g=(n,t,r)=>{d||(d=!0,t.r+=n.length,n.map(((n,o)=>n[e](t,r))),d=!1)},w=new Promise(((e,n)=>{f=n,s=()=>(e(b),t(a),a=0)}));w[n]=b,w[e]=(e,n)=>{if(l)return r(e);u&&g(u,e,n),o(a,e),w.catch(n)},_.exports=w,i((_=>{if(!_)return s();var i,c;u=(_=>_.map((_=>{if(null!==_&&"object"==typeof _){if(_[e])return _;if(_.then){var i=[];_.then((e=>{c[n]=e,t(i),i=0}));var c={};return c[e]=(e,n)=>(o(i,e),_.catch(n)),c}}var u={};return u[e]=e=>r(e),u[n]=_,u})))(_);var f=new Promise(((e,t)=>{(i=()=>e(c=u.map((e=>e[n])))).r=0,g(u,i,t)}));return i.r?f:c})).then(s,f),l=!1},c.d=(e,n)=>{for(var t in n)c.o(n,t)&&!c.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},c.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),c.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),c.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),c.v=(e,n,t,r)=>{var o=fetch(c.p+""+t+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((n=>Object.assign(e,n.instance.exports))):o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((n=>Object.assign(e,n.instance.exports)))},c.p="/",(()=>{"use strict";c(899);class e{constructor(e,n,t){this.searchedTerms=e,this.queryParts=n,this.query=t}getNextN(e){return this.query.get_next_n(e)}free(){this.query.free()}}var n=function(e,n,t,r){return new(t||(t=Promise))((function(o,_){function i(e){try{u(r.next(e))}catch(e){_(e)}}function c(e){try{u(r.throw(e))}catch(e){_(e)}}function u(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}u((r=r.apply(e,n||[])).next())}))};class t{constructor(e){this.config=e,this.workerQueries=Object.create(null)}processQuery(t,r){return n(this,void 0,void 0,(function*(){const n=yield this.wasmModule.get_query(this.wasmSearcher.get_ptr(),t);return this.workerQueries[t]=this.workerQueries[t]||{},this.workerQueries[t][r]=new e(n.get_searched_terms(),n.get_query_parts(),n),this.workerQueries[t][r]}))}getQueryNextN(e,n,t){return this.workerQueries[e][n].getNextN(t)}freeQuery(e,n){this.workerQueries[e][n]&&this.workerQueries[e][n].free(),delete this.workerQueries[e][n],0===Object.keys(this.workerQueries[e]).length&&delete this.workerQueries[e]}setupWasm(e,t){return n(this,void 0,void 0,(function*(){const[n,r]=e;this.wasmModule=yield t,this.wasmSearcher=yield this.wasmModule.get_new_searcher(this.config,n,r)}))}static setup(e,r){return n(this,void 0,void 0,(function*(){const n=new t(e),o=e.searcherOptions.url,_=`${o}bitmap_docinfo_dicttable.json`,i=`${o}dictionary_string.json`;let c;try{c=yield caches.open(`morsels:${o}`)}catch(e){}const u=yield Promise.all([(c?c.match(_).then((e=>!e&&c.add(_))).then((()=>c.match(_))):fetch(_)).then((e=>e.arrayBuffer())),(c?c.match(i).then((e=>!e&&c.add(i))).then((()=>c.match(i))):fetch(i)).then((e=>e.arrayBuffer()))]);return yield n.setupWasm(u,r),n}))}}!function(e){let n;onmessage=function(r){return o=this,_=void 0,c=function*(){if(r.data.searcherOptions)n=yield t.setup(r.data,e),postMessage({isSetupDone:!0});else if(r.data.query){const{query:e,queryId:t,n:o,isFree:_,isGetNextN:i}=r.data;if(_)n.freeQuery(e,t);else if(i){const r=n.getQueryNextN(e,t,o);postMessage({query:e,queryId:t,nextResults:r})}else{const r=yield n.processQuery(e,t);postMessage({query:e,queryId:t,searchedTerms:r.searchedTerms,queryParts:r.queryParts})}}},new((i=void 0)||(i=Promise))((function(e,n){function t(e){try{u(c.next(e))}catch(e){n(e)}}function r(e){try{u(c.throw(e))}catch(e){n(e)}}function u(n){var o;n.done?e(n.value):(o=n.value,o instanceof i?o:new i((function(e){e(o)}))).then(t,r)}u((c=c.apply(o,_||[])).next())}));var o,_,i,c},postMessage("")}(Promise.resolve().then(c.bind(c,312)))})()})();