// usage: node seed.mjs <label>  -> creates a WO with 2 completed lines, prints id + status
import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]||'A'; const C=JSON.parse(fs.readFileSync('cust.json')); const np=JSON.parse(fs.readFileSync('np.json'));
const s=await ob();
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const cr=await s.api('/api/work-orders/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})});
console.log('create',cr.status,j(cr.json,200)); const wo=cr.json?.data?.work_order_id||cr.json?.work_order_id;
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
console.log('mileage',(await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'})).status);
const lines=[];
for(const cl of [np[1],np[3]]){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:cl.id,status:'authorized'}); console.log('line',r.status,j(r.json,120)); lines.push(r.json?.data?.line_id||r.json?.line_id); }
for(const l of lines.slice(0,Number(process.argv[3]??2))){ console.log('story',(await P('/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST SV-10642 work done',work_order_id:wo})).status);
  const r=await P('/api/work-orders/lines/change-status',{line_id:l,status:'complete',workOrderId:wo}); console.log('complete',r.status,j(r.json,150)); }
for(const p of ['/api/work-orders/view/'+wo,'/api/work-orders/'+wo]){ const r=await s.api(p); console.log(p,r.status,j(r.json?.data?.work_order?.status??r.json?.data?.status??r.json,200)); }
fs.writeFileSync(`wo-${label}.json`,JSON.stringify({wo,lines}));
await s.close();
