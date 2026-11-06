// shared session for SV-12185 (branch sv12185) / SV-12187 (branch sv12187). TICKET=12185|12187, ENV=prod -> production test org. Cookies = shared .qa.shopview.com sign-in in /tmp/sv7898.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv7898/'+f,'utf8').trim();
export async function sess(o={}){ const vp=o.vp||{width:1600,height:900}; const T=process.env.TICKET||'12214';
  if(process.env.ENV==='prod'){ const dir=o.dir||'/tmp/qa88'; fs.mkdirSync(dir,{recursive:true}); return open({env:'prod',dir,user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),dpr:o.dpr||2,vp,...o}); }
  const dir=o.dir||('/tmp/qa'+({'12214':'90'}[T]||'89')); fs.mkdirSync(dir,{recursive:true});
  return open({env:'branch',ticket:T,cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:o.quick||'admin',dpr:o.dpr||2,vp,dir,...o}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
