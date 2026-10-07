import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); let all=[];
for(let pg=1;pg<=8;pg++){ const r=await s.api(`/api/inventory/parts?limit=100&page=${pg}`); const c=r.json?.data?.collection||[]; all=all.concat(c); if(c.length<100)break; }
console.log('parts',all.length,'workplaces',j([...new Set(all.map(p=>p.workplace_id))]));
console.log('binLocations sample',j(all[0].binLocations,400));
const hd=all.filter(p=>p.workplace_id==='b3c8c820-f815-4cf1-8938-10956c5ee71a'&&!p.is_core&&!p.core_part_id&&(p.binLocations||[]).length===1&&!p.is_fixed_price);
const q={zero:hd.filter(p=>p.quantity==0).length,neg:hd.filter(p=>p.quantity<0).length,pos:hd.filter(p=>p.quantity>0).length}; console.log('HD single-bin',hd.length,j(q));
fs.writeFileSync('inv.json',JSON.stringify(all));
await s.close();
