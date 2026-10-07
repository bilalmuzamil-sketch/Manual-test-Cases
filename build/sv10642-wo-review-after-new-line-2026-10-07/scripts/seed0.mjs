import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]; const C=JSON.parse(fs.readFileSync('cust.json')); const s=await ob();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json.data.work_order_id; await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
console.log('wo',wo,(await s.api('/api/work-orders/view/'+wo)).json.data?.work_order?.status??(await s.api('/api/work-orders/view/'+wo)).json.data?.status);
fs.writeFileSync(`wo-${label}.json`,JSON.stringify({wo,lines:[]})); await s.close();
