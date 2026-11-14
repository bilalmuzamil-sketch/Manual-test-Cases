import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
export const LETH='f8a8b802-7780-4b16-bf10-343caeb616b2';
export async function sess(o={}){ fs.mkdirSync(o.dir||'/tmp/qa80',{recursive:true});
  const s=await open({env:'staging',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa80',vp:{width:1600,height:900},dpr:2,...o});
  return s; }
export const get=(s,u)=>s.page.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); let j=null,t=await r.text(); try{j=JSON.parse(t)}catch(e){} return {st:r.status,j,t:t.slice(0,300)}},s.host.api+u);
export const post=(s,u,b)=>s.page.evaluate(async([u,b])=>{const r=await fetch(u,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); return {st:r.status,t:(await r.text()).slice(0,300)}},[s.host.api+u,b]);
