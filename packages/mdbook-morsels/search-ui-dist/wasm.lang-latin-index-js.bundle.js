"use strict";(self.webpackChunkmorsels=self.webpackChunkmorsels||[]).push([[949],{777:(e,n,_)=>{_.a(e,(async e=>{_.r(n),_.d(n,{Query:()=>t.AE,Searcher:()=>t.sz,__wbg_arrayBuffer_b8937ed04beb0d36:()=>t.gV,__wbg_buffer_397eaa4d72ee94dd:()=>t.jp,__wbg_call_346669c262382ad7:()=>t.Ms,__wbg_call_888d259a5fefc347:()=>t.BT,__wbg_fetch_3a636c71a7d400b0:()=>t.ih,__wbg_fetch_cfe0d1dd786e9cd4:()=>t.eF,__wbg_globalThis_3f735a5746d41fbd:()=>t.ud,__wbg_global_1bc0b39582740e95:()=>t.PT,__wbg_instanceof_Response_e1b11afbefa5b563:()=>t.Yb,__wbg_length_1eb8fc608a0d4cdb:()=>t.A7,__wbg_new_a7ce447f15ff496f:()=>t.y4,__wbg_new_b1d61b5687f5e73a:()=>t.hq,__wbg_newnoargs_be86524d73f67598:()=>t.wg,__wbg_newwithstr_226291f201e32f74:()=>t.fc,__wbg_query_new:()=>t.ff,__wbg_resolve_d23068002f584f22:()=>t.zb,__wbg_searcher_new:()=>t.cI,__wbg_self_c6fbdfc2918d5e58:()=>t.JX,__wbg_set_969ad0a60e51d320:()=>t.YQ,__wbg_then_2fcac196782070cc:()=>t.Zp,__wbg_then_8c2d62e8ae5978f7:()=>t.v_,__wbg_window_baec038b5ab35c54:()=>t.xd,__wbindgen_cb_drop:()=>t.G6,__wbindgen_closure_wrapper1168:()=>t.gP,__wbindgen_debug_string:()=>t.fY,__wbindgen_is_undefined:()=>t.XP,__wbindgen_json_parse:()=>t.t$,__wbindgen_json_serialize:()=>t.r1,__wbindgen_memory:()=>t.oH,__wbindgen_object_clone_ref:()=>t.m_,__wbindgen_object_drop_ref:()=>t.ug,__wbindgen_throw:()=>t.Or,get_new_searcher:()=>t.qS,get_query:()=>t.R1});var t=_(686),r=e([t]);t=(r.then?await r:r)[0]}))},686:(e,n,_)=>{_.a(e,(async t=>{_.d(n,{qS:()=>x,R1:()=>j,AE:()=>A,sz:()=>O,ug:()=>P,G6:()=>S,ff:()=>$,cI:()=>Y,t$:()=>k,r1:()=>z,eF:()=>B,ih:()=>E,Yb:()=>F,gV:()=>R,fc:()=>I,wg:()=>J,BT:()=>X,m_:()=>M,Ms:()=>C,hq:()=>Q,zb:()=>D,Zp:()=>G,v_:()=>H,JX:()=>N,xd:()=>V,ud:()=>Z,PT:()=>U,XP:()=>W,jp:()=>K,y4:()=>L,YQ:()=>ee,A7:()=>ne,fY:()=>_e,Or:()=>te,oH:()=>re,gP:()=>ce});var r=_(945);e=_.hmd(e);var c=t([r]);r=(c.then?await c:c)[0];const o=new Array(32).fill(void 0);function u(e){return o[e]}o.push(void 0,null,!0,!1);let f=o.length;function i(e){const n=u(e);return function(e){e<36||(o[e]=f,f=e)}(e),n}let b=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});b.decode();let a=null;function s(){return null!==a&&a.buffer===r.memory.buffer||(a=new Uint8Array(r.memory.buffer)),a}function g(e,n){return b.decode(s().subarray(e,e+n))}function d(e){f===o.length&&o.push(o.length+1);const n=f;return f=o[n],o[n]=e,n}let w=0;let l=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const h="function"==typeof l.encodeInto?function(e,n){return l.encodeInto(e,n)}:function(e,n){const _=l.encode(e);return n.set(_),{read:e.length,written:_.length}};function y(e,n,_){if(void 0===_){const _=l.encode(e),t=n(_.length);return s().subarray(t,t+_.length).set(_),w=_.length,t}let t=e.length,r=n(t);const c=s();let o=0;for(;o<t;o++){const n=e.charCodeAt(o);if(n>127)break;c[r+o]=n}if(o!==t){0!==o&&(e=e.slice(o)),r=_(r,t,t=o+3*e.length);const n=s().subarray(r+o,r+t);o+=h(e,n).written}return w=o,r}let p=null;function m(){return null!==p&&p.buffer===r.memory.buffer||(p=new Int32Array(r.memory.buffer)),p}function v(e){const n=typeof e;if("number"==n||"boolean"==n||null==e)return`${e}`;if("string"==n)return`"${e}"`;if("symbol"==n){const n=e.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==n){const n=e.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(e)){const n=e.length;let _="[";n>0&&(_+=v(e[0]));for(let t=1;t<n;t++)_+=", "+v(e[t]);return _+="]",_}const _=/\[object ([^\]]+)\]/.exec(toString.call(e));let t;if(!(_.length>1))return toString.call(e);if(t=_[1],"Object"==t)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:t}function q(e,n,_){r._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__haf17c06ec5612784(e,n,d(_))}function x(e){return i(r.get_new_searcher(d(e)))}function j(e,n){var _=y(n,r.__wbindgen_malloc,r.__wbindgen_realloc),t=w;return i(r.get_query(e,_,t))}function T(e,n){try{return e.apply(this,n)}catch(e){r.__wbindgen_exn_store(d(e))}}class A{static __wrap(e){const n=Object.create(A.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_query_free(e)}get is_free_text_query(){return 0!==r.__wbg_get_query_is_free_text_query(this.ptr)}set is_free_text_query(e){r.__wbg_set_query_is_free_text_query(this.ptr,e)}get_next_n(e){return i(r.query_get_next_n(this.ptr,e))}get_query_parts(){return i(r.query_get_query_parts(this.ptr))}get_searched_terms(){return i(r.query_get_searched_terms(this.ptr))}}class O{static __wrap(e){const n=Object.create(O.prototype);return n.ptr=e,n}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();r.__wbg_searcher_free(e)}get_ptr(){return r.searcher_get_ptr(this.ptr)}}function P(e){i(e)}function S(e){const n=i(e).original;if(1==n.cnt--)return n.a=0,!0;return!1}function $(e){return d(A.__wrap(e))}function Y(e){return d(O.__wrap(e))}function k(e,n){return d(JSON.parse(g(e,n)))}function z(e,n){const _=u(n);var t=y(JSON.stringify(void 0===_?null:_),r.__wbindgen_malloc,r.__wbindgen_realloc),c=w;m()[e/4+1]=c,m()[e/4+0]=t}function B(e,n){return d(u(e).fetch(u(n)))}function E(e,n,_){return d(u(e).fetch(g(n,_)))}function F(e){return u(e)instanceof Response}function R(){return T((function(e){return d(u(e).arrayBuffer())}),arguments)}function I(){return T((function(e,n){return d(new Request(g(e,n)))}),arguments)}function J(e,n){return d(new Function(g(e,n)))}function X(){return T((function(e,n){return d(u(e).call(u(n)))}),arguments)}function M(e){return d(u(e))}function C(){return T((function(e,n,_){return d(u(e).call(u(n),u(_)))}),arguments)}function Q(e,n){try{var _={a:e,b:n},t=new Promise(((e,n)=>{const t=_.a;_.a=0;try{return function(e,n,_,t){r.wasm_bindgen__convert__closures__invoke2_mut__h49991b41b818dbf7(e,n,d(_),d(t))}(t,_.b,e,n)}finally{_.a=t}}));return d(t)}finally{_.a=_.b=0}}function D(e){return d(Promise.resolve(u(e)))}function G(e,n){return d(u(e).then(u(n)))}function H(e,n,_){return d(u(e).then(u(n),u(_)))}function N(){return T((function(){return d(self.self)}),arguments)}function V(){return T((function(){return d(window.window)}),arguments)}function Z(){return T((function(){return d(globalThis.globalThis)}),arguments)}function U(){return T((function(){return d(_.g.global)}),arguments)}function W(e){return void 0===u(e)}function K(e){return d(u(e).buffer)}function L(e){return d(new Uint8Array(u(e)))}function ee(e,n,_){u(e).set(u(n),_>>>0)}function ne(e){return u(e).length}function _e(e,n){var _=y(v(u(n)),r.__wbindgen_malloc,r.__wbindgen_realloc),t=w;m()[e/4+1]=t,m()[e/4+0]=_}function te(e,n){throw new Error(g(e,n))}function re(){return d(r.memory)}function ce(e,n,_){var t=function(e,n,_,t){const c={a:e,b:n,cnt:1,dtor:_},o=(...e)=>{c.cnt++;const n=c.a;c.a=0;try{return t(n,c.b,...e)}finally{0==--c.cnt?r.__wbindgen_export_2.get(c.dtor)(n,c.b):c.a=n}};return o.original=c,o}(e,n,305,q);return d(t)}}))},945:(e,n,_)=>{var t=([t])=>_.v(n,e.id,"a8586b8b397a1638f65d",{"./index_bg.js":{__wbindgen_object_drop_ref:t.ug,__wbindgen_cb_drop:t.G6,__wbg_query_new:t.ff,__wbg_searcher_new:t.cI,__wbindgen_json_parse:t.t$,__wbindgen_json_serialize:t.r1,__wbg_fetch_cfe0d1dd786e9cd4:t.eF,__wbg_fetch_3a636c71a7d400b0:t.ih,__wbg_instanceof_Response_e1b11afbefa5b563:t.Yb,__wbg_arrayBuffer_b8937ed04beb0d36:t.gV,__wbg_newwithstr_226291f201e32f74:t.fc,__wbg_newnoargs_be86524d73f67598:t.wg,__wbg_call_888d259a5fefc347:t.BT,__wbindgen_object_clone_ref:t.m_,__wbg_call_346669c262382ad7:t.Ms,__wbg_new_b1d61b5687f5e73a:t.hq,__wbg_resolve_d23068002f584f22:t.zb,__wbg_then_2fcac196782070cc:t.Zp,__wbg_then_8c2d62e8ae5978f7:t.v_,__wbg_self_c6fbdfc2918d5e58:t.JX,__wbg_window_baec038b5ab35c54:t.xd,__wbg_globalThis_3f735a5746d41fbd:t.ud,__wbg_global_1bc0b39582740e95:t.PT,__wbindgen_is_undefined:t.XP,__wbg_buffer_397eaa4d72ee94dd:t.jp,__wbg_new_a7ce447f15ff496f:t.y4,__wbg_set_969ad0a60e51d320:t.YQ,__wbg_length_1eb8fc608a0d4cdb:t.A7,__wbindgen_debug_string:t.fY,__wbindgen_throw:t.Or,__wbindgen_memory:t.oH,__wbindgen_closure_wrapper1168:t.gP}});_.a(e,(e=>{var n=e([_(686)]);return n.then?n.then(t):t(n)}),1)}}]);