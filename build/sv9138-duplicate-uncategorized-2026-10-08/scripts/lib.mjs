import {open} from './qa.mjs'; import fs from 'fs';
const r=f=>fs.readFileSync('/tmp/qa9138/'+f,'utf8').trim();
export const C={sv_sso_session:r('sso'),PHPSESSID:r('php'),cf_clearance:r('cf')};
export const ob=(o={})=>open(Object.assign({env:'branch',ticket:'9138',dir:'/tmp/qa9138',cookies:C,quick:'admin',vp:{width:1900,height:1000}},o));
export const j=(x,n=300)=>String(JSON.stringify(x)).slice(0,n);
export const PW=()=>fs.readFileSync('/tmp/qa9667/prod/pw.txt','utf8').match(/'([^']*)'/)[1];
export const op=(o={})=>open(Object.assign({env:'prod',dir:'/tmp/qa9138',user:'bilal.muzamil@shopview.com',pw:PW(),vp:{width:1900,height:1000}},o));
