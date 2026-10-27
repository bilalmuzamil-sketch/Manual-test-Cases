import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
export async function sess(quick='admin',opts={}){
  const s=await open(Object.assign({env:'branch',ticket:'11565',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick,dir:'/tmp/qa21',vp:{width:1600,height:1100},dpr:1},opts));
  s.J=(p,b,m='POST')=>s.api(p,{method:m,headers:{'content-type':'application/json'},body:JSON.stringify(b)});
  s.L=(t,r)=>console.log(t,r.status,JSON.stringify(r.json??r.text).slice(0,400));
  return s;
}
