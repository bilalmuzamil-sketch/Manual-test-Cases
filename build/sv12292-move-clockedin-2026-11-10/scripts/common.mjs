import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
export async function sess(opts={}){ const ENV=process.env.ENV||'branch';
  if(ENV==='prod') return open({env:'prod',dir:opts.dir||'/tmp/qa97',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,...opts});
  return open({env:'branch',ticket:'12292',cookies:{sv_sso_session:rd('svqa12267','sso'),PHPSESSID:rd('svqa12267','phpsess'),cf_clearance:rd('svqa12267','cfc')},quick:'admin',dir:opts.dir||'/tmp/qa96',vp:{width:1600,height:900},dpr:2,...opts}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
export const arr=d=>{ const x=d?.collection||d?.work_orders||d?.items||d; return Array.isArray(x)?x:[]; };
