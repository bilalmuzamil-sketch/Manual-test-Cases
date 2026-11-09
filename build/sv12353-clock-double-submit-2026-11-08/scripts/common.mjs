import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
export async function sess(opts={}){ const ENV=process.env.ENV||'branch';
  if(ENV==='prod') return open({env:'prod',dir:opts.dir||'/tmp/qa98',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,...opts});
  return open({env:'branch',ticket:'12353',cookies:{sv_sso_session:rd('svqa12353','sso'),PHPSESSID:rd('svqa12353','phpsess'),cf_clearance:rd('svqa12353','cfc')},quick:'admin',dir:opts.dir||'/tmp/qa99',vp:{width:1600,height:900},dpr:2,...opts}); }
