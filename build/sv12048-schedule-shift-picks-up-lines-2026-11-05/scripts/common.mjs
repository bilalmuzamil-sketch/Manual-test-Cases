import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
export async function sess(opts={}){ const ENV=process.env.ENV||'branch';
  if(ENV==='prod') return open({env:'prod',dir:opts.dir||'/tmp/qa96',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,...opts});
  return open({env:'branch',ticket:process.env.TK||'12048',cookies:{sv_sso_session:rd('sv'+(process.env.TK||'12048'),'sso'),PHPSESSID:rd('sv'+(process.env.TK||'12048'),'phpsess'),cf_clearance:rd('sv'+(process.env.TK||'12048'),'cfc')},quick:process.env.QUICK||'admin',dir:opts.dir||(process.env.TK?'/tmp/qa97':'/tmp/qa98'),vp:{width:1600,height:900},dpr:2,...opts}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
export const arr=d=>{ const x=d?.collection||d?.parts||d?.items||d?.vendors||d?.categories||d; return Array.isArray(x)?x:[]; };
