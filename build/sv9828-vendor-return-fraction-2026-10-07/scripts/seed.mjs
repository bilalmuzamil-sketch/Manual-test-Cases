import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]; const C=JSON.parse(fs.readFileSync('cust.json')); const np=JSON.parse(fs.readFileSync('np.json'));
const s=await ob(); const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a'; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json?.data?.work_order_id; console.log('create',cr.status,wo);
await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
const cl=np.find(x=>/Battery/.test(x.canned_line_name)); const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:cl.id,status:'authorized'}); const line=r.json?.data?.line_id; console.log('line',r.status);
const v=await s.api('/api/work-orders/view/'+wo); const w=v.json?.data?.work_order; console.log('number',w?.number,w?.work_order_display_number||'');
fs.writeFileSync(`wo-${label}.json`,JSON.stringify({wo,line})); await s.close();
