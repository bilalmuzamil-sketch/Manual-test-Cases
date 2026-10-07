import {open} from './qa.mjs'; import fs from 'fs';
export const C={sv_sso_session:fs.readFileSync('/tmp/qa10642/sso','utf8'),PHPSESSID:fs.readFileSync('/tmp/qa10642/php','utf8'),cf_clearance:fs.readFileSync('/tmp/qa10642/cf','utf8')};
export const ob=(o={})=>open(Object.assign({env:'branch',ticket:'10642',dir:'/tmp/qa10642',cookies:C,quick:'admin'},o));
export const j=(x,n=300)=>String(JSON.stringify(x)).slice(0,n);
export const PW=()=>fs.readFileSync('/tmp/qa9667/prod/pw.txt','utf8').match(/'([^']*)'/)[1];
export const op=(o={})=>open(Object.assign({env:'prod',dir:'/tmp/qa10642',user:'bilal.muzamil@shopview.com',pw:PW()},o));
