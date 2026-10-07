// usage: node adj.mjs <label> <order: rev|fwd>
import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]; const order=process.argv[3]||'rev'; const W=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const add=async(kind,name,amount,scope,targetId)=>{ const r=await P('/api/work-orders/adjustments/add',{workOrderId:W.wo,kind,name,calculationType:'flat',amount,scope,targetId,taxable:false}); console.log('add',kind,name,amount,scope,r.status,j(r.json,140)); return r.status; };
const [l1,l2,l3]=W.lines; const pa=W.parts[0].id, pb=W.parts[1].id;
const steps = order==='rev' ? [
 ['fee','Shop fee',15,'labor_line',l1],['fee','Diagnostic fee',25,'labor_line',l1],['fee','Shop fee',15,'labor_line',l2],['fee','Shop fee',15,'labor_line',l3],
 ['discount','Core discount',5,'part_line',pa],['fee','Environmental fee',3,'part_line',pa],['fee','Environmental fee',3,'part_line',pb],
 ['discount','Fleet discount',10,'whole_wo',null]] : [
 ['fee','Diagnostic fee',25,'labor_line',l1],['fee','Shop fee',15,'labor_line',l1],['fee','Shop fee',15,'labor_line',l2],['fee','Shop fee',15,'labor_line',l3],
 ['fee','Environmental fee',3,'part_line',pa],['fee','Environmental fee',3,'part_line',pb],['discount','Core discount',5,'part_line',pa],
 ['discount','Fleet discount',10,'whole_wo',null]];
for(const st of steps){ const c=await add(...st); if(c>=400) break; await s.page.waitForTimeout(1200); }
const v=await s.api('/api/work-orders/view/'+W.wo); console.log('summary',j(v.json?.data?.work_order?.adjustmentsSummary,600));
await s.close();
