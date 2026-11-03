import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const rd=f=>fs.readFileSync('/tmp/sv11986/'+f,'utf8').trim();
export async function sess(env=process.env.ENV||'branch'){ return env==='prod'
 ? await open({env:'prod',dir:'/tmp/qa62',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},dpr:2})
 : await open({env:'branch',ticket:'11986',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa61',vp:{width:1440,height:900},dpr:2}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(r=>({st:r.status,j:r.json,t:(JSON.stringify(r.json||r.text)||'').slice(0,300)}));
export const arr=d=>{const x=d?.collection||d?.customers||d?.vehicles||d?.canned_lines||d; return Array.isArray(x)?x:[];};
