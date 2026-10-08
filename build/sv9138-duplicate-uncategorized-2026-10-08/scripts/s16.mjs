import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page;
const all=JSON.parse(fs.readFileSync('/tmp/qa9138/all-flags.json')); const cur=JSON.parse(fs.readFileSync('/tmp/qa9138/org-flags-before.json')).data.features.map(x=>x.featureFlagId);
const oa=all.find(x=>x.name==='openapi').id; const ids=[...new Set([...cur,oa])];
const r=await s.api('/api/organization/feature-flags',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({organization_id:'d55bc308-e61a-438d-b5f1-c7a73c89d49f',feature_flag_ids:ids})}); console.log('set',r.status,j(r.json,200));
await s.go('/administration'); await p.waitForTimeout(1500);
const links=await p.evaluate(()=>[...document.querySelectorAll('a')].map(a=>a.innerText.trim()+' => '+a.getAttribute('href')).filter(x=>/api/i.test(x)));
console.log(links); const h=(links[0]||'').split(' => ')[1];
if(h){ await s.go(h); await p.waitForTimeout(2000); console.log((await p.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).slice(0,800));
 console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-page [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
 await p.screenshot({path:'/tmp/qa9138/openapi-page.png'}); }
await s.close();
