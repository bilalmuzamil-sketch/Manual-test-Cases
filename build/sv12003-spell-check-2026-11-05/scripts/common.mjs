import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
export async function sess(opts={}){ const ENV=process.env.ENV||'branch'; const headed=!!process.env.HEADED;
  if(ENV==='prod') return open({env:'prod',dir:opts.dir||'/tmp/qa93',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,headed,...opts});
  return open({env:'branch',ticket:'12003',cookies:{sv_sso_session:rd('sv12003','sso'),PHPSESSID:rd('sv12003','phpsess'),cf_clearance:rd('sv12003','cfc')},quick:'admin',dir:opts.dir||'/tmp/qa92',vp:{width:1600,height:900},dpr:2,headed,...opts}); }
