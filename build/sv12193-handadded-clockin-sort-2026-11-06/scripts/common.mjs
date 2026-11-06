import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
export async function sess(opts={}){ const ENV=process.env.ENV||'branch';
  if(ENV==='prod') return open({env:'prod',dir:opts.dir||'/tmp/qa91',user:process.env.MAIN?'bilal.muzamil@shopview.com':'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync(process.env.MAIN?'/tmp/sv-prod-pw.txt':'/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,...opts});
  if(ENV==='staging') return open({env:'staging',dir:opts.dir||'/tmp/qa93',cookies:{sv_sso_session:rd('staging','sso'),PHPSESSID:rd('staging','phpsess'),cf_clearance:rd('staging','cfc')},quick:'admin',vp:{width:1600,height:900},dpr:2,...opts});
  return open({env:'branch',ticket:'12193',cookies:{sv_sso_session:rd('sv12193','sso'),PHPSESSID:rd('sv12193','phpsess'),cf_clearance:rd('sv12193','cfc')},quick:'admin',dir:opts.dir||'/tmp/qa90',vp:{width:1600,height:900},dpr:2,...opts}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
export const arr=d=>{ const x=d?.collection||d?.work_orders||d?.items||d; return Array.isArray(x)?x:[]; };
