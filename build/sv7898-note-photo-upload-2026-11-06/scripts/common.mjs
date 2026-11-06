// shared session for SV-7898. ENV=prod -> production (test org); otherwise branch sv7898 (quick admin). DEVICE=<preset> for phone emulation.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv7898/'+f,'utf8').trim();
export async function sess(o={}){ const dev=process.env.DEVICE||o.device||null; const vp=dev?{}:{vp:{width:1440,height:900}};
  if(process.env.ENV==='prod'){ const dir=o.dir||'/tmp/qa90'; fs.mkdirSync(dir,{recursive:true}); return open({env:'prod',dir,user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),dpr:2,device:dev,...vp,...o}); }
  const dir=o.dir||'/tmp/qa89'; fs.mkdirSync(dir,{recursive:true});
  return open({env:'branch',ticket:'7898',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:o.quick||'admin',dir,dpr:2,device:dev,...vp,...o}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
