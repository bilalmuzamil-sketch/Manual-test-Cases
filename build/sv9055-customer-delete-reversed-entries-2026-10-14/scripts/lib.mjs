import {open} from './qa.mjs'; import fs from 'fs';
export const C=JSON.parse(fs.readFileSync('/tmp/qa9055/cookies.json'));
export const ob=(o={})=>open(Object.assign({env:'branch',ticket:'9055',dir:'/tmp/qa9055',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2},o));
export const op=(o={})=>open(Object.assign({env:'prod',dir:'/tmp/qa9055',user:'bilal.muzamil@shopview.com',vp:{width:1600,height:1000},dpr:2},o));
export const J=(x,n=400)=>String(JSON.stringify(x)).slice(0,n);
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
