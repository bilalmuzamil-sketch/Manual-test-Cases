import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=(t,f)=>fs.readFileSync(`/tmp/${t}/`+f,'utf8').trim();
// ENV=prod -> production; ORG=B -> branch with no PHPSESSID and no quick-login (then call loginB)
export async function sess(opts={}){ const ENV=process.env.ENV||'branch'; const headed=!!process.env.HEADED;
  if(ENV==='prod'){ fs.mkdirSync('/tmp/qa85',{recursive:true}); return open({env:'prod',dir:opts.dir||'/tmp/qa85',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),vp:{width:1600,height:900},dpr:2,headed,...opts}); }
  const B=process.env.ORG==='B'; const dir=B?'/tmp/qa88':'/tmp/qa87'; fs.mkdirSync(dir,{recursive:true});
  const cookies=B?{sv_sso_session:rd('sv11249','sso'),cf_clearance:rd('sv11249','cfc')}:{sv_sso_session:rd('sv11249','sso'),PHPSESSID:rd('sv11249','phpsess'),cf_clearance:rd('sv11249','cfc')};
  const s=await open({env:'branch',ticket:'11249',cookies,quick:B?'none':(process.env.QUICK||'admin'),dir:opts.dir||dir,vp:{width:1600,height:900},dpr:2,headed,...opts});
  if(B&&!opts.noLogin){ const r=await post(s,'/api/login',{username:'bilal.muzamil+sv11249b@shopview.com',password:rd('sv11249','pwB.txt')}); s.loginStatus=r.status; const c=await post(s,'/api/iam/change-location',{workplace_id:'1070345f-1057-4d3f-b21c-41cf0a72f7fb',workplace_timezone:'America/Edmonton'}); s.locStatus=c.status; }
  return s; }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
export const arr=d=>{ const x=d?.collection||d?.parts||d?.items||d?.data||d; return Array.isArray(x)?x:[]; };
