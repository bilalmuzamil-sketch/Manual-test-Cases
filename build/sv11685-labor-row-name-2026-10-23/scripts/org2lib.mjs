import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export async function org2(opts={}){
  const all=JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')); const ck={}; for(const k of Object.keys(all)) if(k!=='PHPSESSID') ck[k]=all[k];
  const s=await open(Object.assign({env:'branch',ticket:'11685',cookies:ck,quick:'none',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1},opts));
  const E='bilal.muzamil+sv11685org2@shopview.com', PW=fs.readFileSync('/tmp/qa11685/org2-pw.txt','utf8').trim();
  s.J=(p,b,m='POST')=>s.api(p,{method:m,headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined});
  s.L=(tag,r)=>console.log(tag,r.status,JSON.stringify(r.json??r.text).slice(0,400));
  const r=await s.J('/api/login',{username:E,password:PW}); if(r.status!==200) throw new Error('login '+r.status);
  s.loginData=r.json.data; s.ORG='d75d2590-b5c7-439f-9f25-6876778e7560';
  return s;
}
