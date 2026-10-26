import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const p=s.page; const seen=[];
p.on('response',async r=>{const u=r.url(); if(/api\//.test(u)&&r.request().method()==='GET'){try{const t=await r.text(); if(/21498\.07|21,498\.07/.test(t)) seen.push(u.replace(/https:\/\/[^/]+/,'')+' -> '+(t.match(/.{0,80}21,?498\.07.{0,40}/)||[''])[0]);}catch{}}});
await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(7000);
console.log(seen.join('\n')||'none'); process.exit(0);
