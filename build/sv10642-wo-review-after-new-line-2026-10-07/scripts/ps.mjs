import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page;
for(const u of ['/api/part-sales?limit=3','/api/work-orders?limit=3&type=part_sale','/api/work-orders/part-sales?limit=3']){const r=await s.api(u); console.log(u,r.status,j(r.json,300));}
await s.go('/parts/part-sales'); console.log('url',p.url()); await s.shot('ps-list','shots');
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].slice(0,4).map(t=>t.innerText.replace(/\s+/g,' ').slice(0,150))); console.log(j(rows,600));
await s.close();
