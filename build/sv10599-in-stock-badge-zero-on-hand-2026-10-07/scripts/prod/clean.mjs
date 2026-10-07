import {op,j} from '../lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('prod/wo.json')); const parts=JSON.parse(fs.readFileSync('prod/parts.json')); const s=await op();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
for(const x of parts){ const r=await P('/api/work-orders/parts/delete',{part_id:x.id,work_order_id:W.wo}); console.log('del part',x.pn,r.status,j(r.json,120)); }
const d=await P('/api/work-orders/delete',{work_order_id:W.wo}); console.log('del wo',d.status,j(d.json,150));
const v=await s.api('/api/work-orders/view/'+W.wo); console.log('re-read wo',v.status,j(v.json,150));
for(const pn of [W.zero,W.pos]){const x=(await s.api('/api/inventory/parts?search='+encodeURIComponent(pn))).json.data.collection.find(y=>y.part_number===pn); console.log('inv',pn,x?.quantity);}
await s.close();
