import {ob,J,post} from './lib.mjs';
const s=await ob();
const r=await s.api('/api/work-orders/canned-lines?limit=200'); const L=r.json.data.collection;
const z=L.filter(x=>x.total_parts===0&&x.workplace_id==='b3c8c820-f815-4cf1-8938-10956c5ee71a').slice(0,6).map(x=>[x.id,x.canned_line_name,x.fixed_price,x.fixed_line_total,x.time_estimate]);
console.log(L.length,J(z,900));
await s.close();
