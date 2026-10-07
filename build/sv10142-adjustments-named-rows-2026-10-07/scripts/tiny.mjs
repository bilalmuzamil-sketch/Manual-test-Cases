import {ob,j} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo-E.json')); const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const p=W.parts.find(x=>x.pn==='84-2005');
const r=await P('/api/work-orders/adjustments/add',{workOrderId:W.wo,kind:'fee',name:'Tiny fee',calculationType:'pct_parts',amount:0.01,scope:'part_line',targetId:p.id,taxable:false}); console.log('tiny',r.status,j(r.json?.data,300));
const L=await s.api('/api/work-orders/lines/'+W.wo); for(const l of L.json.data.collection){ for(const a of (l.adjustments||[])) console.log('LINE',a.kind,a.name,a.calculationType,a.amount,a.calculatedAmount); for(const pr of (l.part_requests||[])) for(const a of (pr.adjustments||[])) console.log('PART',pr.part_number,a.kind,a.name,a.calculationType,a.amount,a.calculatedAmount); }
await s.close();
