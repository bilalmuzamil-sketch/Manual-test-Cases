import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export async function prod(dir='/tmp/qa70'){ fs.mkdirSync(dir,{recursive:true}); return await open({env:'prod',dir,user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},dpr:2}); }
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(r=>({st:r.status,j:r.json,t:(JSON.stringify(r.json||r.text)||'').slice(0,300)}));
export const arr=d=>{const x=d?.collection||d?.customers||d?.vehicles||d; return Array.isArray(x)?x:[];};
