import {ob,j} from './lib.mjs'; import fs from 'fs';
const C=JSON.parse(fs.readFileSync('cust.json')); const s=await ob({dpr:2}); const p=s.page;
const r=await s.api('/api/part-sales',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company_id:C.company_id})}); console.log('create',r.status,j(r.json,200));
const id=r.json?.data?.[0]?.id; fs.writeFileSync('ps.json',JSON.stringify({id}));
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(1500); console.log('url',p.url());
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(x=>!/nav|module|profile|clock|global/.test(x)));
console.log('tids',j(t,1200)); const btn=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean)); console.log('buttons',j(btn,600));
await s.shot('PS0','shots'); await s.close();
