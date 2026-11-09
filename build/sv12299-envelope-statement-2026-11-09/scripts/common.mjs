import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export const SF='/tmp/qa12299/seed.json';
export const load=()=>{try{return JSON.parse(fs.readFileSync(SF,'utf8'))}catch{return {}}};
export const save=S=>fs.writeFileSync(SF,JSON.stringify(S,null,1));
export const j=x=>(JSON.stringify(x)||'').slice(0,400);
export async function sess(o={}){return open({env:'prod',dir:'/tmp/qa12299',vp:{width:1600,height:900},dpr:2,user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),...o});}
export const mkpost=s=>async(u,b,quiet)=>{const r=await s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});if(!quiet)console.log('POST',u,r.status,j(r.json));return r;};
