// shared session for SV-12146 / SV-11822 on branch sv11839 (ENV=prod -> production test org). Cookies are the shared .qa.shopview.com sign-in kept in /tmp/sv7898.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv11315/'+f,'utf8').trim();
export async function sess(o={}){ const vp=o.vp||{width:1600,height:900};
  if(process.env.ENV==='prod'){ const dir=o.dir||'/tmp/qa96'; fs.mkdirSync(dir,{recursive:true}); return open({env:'prod',dir,user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),dpr:o.dpr||2,vp,...o}); }
  const dir=o.dir||'/tmp/qa97'; fs.mkdirSync(dir,{recursive:true});
  return open({env:'branch',ticket:'11839',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:o.quick||'admin',dpr:o.dpr||2,vp,dir,...o}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
