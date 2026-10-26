import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const pr=(await s.api('/api/work-orders/48ba5757-175a-4701-8c4a-810791ac2ede/parts/list-requests-by-line?search=')).json; const col=pr.data.collection;
const r0=(col[0].part_requests||col[0].parts||col[0].requests||[])[0]; console.log('line',col[0].id,'part keys',Object.keys(r0||{}).join(',').slice(0,700));
fs.writeFileSync('/tmp/qa11631/w/p2109.json',JSON.stringify(pr,null,1));
for(const u of ['/api/inventory/categories','/api/parts-catalogue/categories','/api/part-categories','/api/vendors?rowsPerPage=500','/api/vendors']){ const r=await s.api(u); const D=r.json?.data; const L=Array.isArray(D)?D:(D&&Object.values(D).find(v=>Array.isArray(v)))||[]; console.log(u,r.status,L.length, L.map(x=>x.name||x.title).filter(Boolean).sort((a,b)=>b.length-a.length).slice(0,3).join(' | '), L[0]?Object.keys(L[0]).slice(0,6).join(','):''); }
process.exit(0);
