import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const wo=fs.readFileSync('/tmp/qa11685/w/seed-wo.txt','utf8').trim();
const pr=(await s.api(`/api/work-orders/${wo}/parts/list-requests-by-line?search=`)).json; fs.writeFileSync('/tmp/qa11685/w/parts.json',JSON.stringify(pr,null,1));
const ids=[]; const walk=o=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id&&('part_number' in o||'partNumber' in o||'status' in o&&'quantity' in o)) ids.push([o.id,o.status,o.description||o.part_number]); Object.values(o).forEach(walk);} }; walk(pr.data);
console.log(JSON.stringify(ids));
for(const [id] of ids){ const r=await s.api(`/api/work-orders/part/remove-request/${id}`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'}); console.log('remove',id,r.status,JSON.stringify(r.json||r.text).slice(0,150)); }
process.exit(0);
