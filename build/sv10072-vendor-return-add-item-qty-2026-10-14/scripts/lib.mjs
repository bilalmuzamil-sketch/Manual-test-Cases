import {open} from './qa.mjs'; import fs from 'fs';
export const C=JSON.parse(fs.readFileSync('/tmp/qa10072/cookies.json'));
export const os=(o={})=>open(Object.assign({env:'staging',dir:'/tmp/qa10072',cookies:C,quick:'admin',vp:{width:1600,height:1000},dpr:2},o));
export const op=(o={})=>open(Object.assign({env:'prod',dir:'/tmp/qa10072',user:'bilal.muzamil@shopview.com',vp:{width:1600,height:1000},dpr:2},o));
export const J=(x,n=400)=>String(JSON.stringify(x)).slice(0,n);
export const post=(s,u,b,h={})=>s.api(u,{method:'POST',headers:Object.assign({'content-type':'application/json'},h),body:JSON.stringify(b)});
