// node seed.mjs <label>  -> WO with one approved no-parts line
import {ob,j} from './lib.mjs'; import fs from 'fs';
const label=process.argv[2]; const C=JSON.parse(fs.readFileSync('cust.json')); const s=await ob();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const cl=(await s.api('/api/work-orders/canned-lines')).json.data.collection.filter(x=>!x.total_parts&&x.workplace_id===WP&&/Battery service/i.test(x.canned_line_name))[0];
const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json.data.work_order_id; await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
const ln=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:cl.id,status:'authorized'});
const v=(await s.api('/api/work-orders/view/'+wo)).json.data; console.log('wo',wo,v.work_order?.number??v.number,v.work_order?.status??v.status,'line',ln.status,ln.json?.data?.line_id);
fs.writeFileSync(`wo-${label}.json`,JSON.stringify({wo,line:ln.json.data.line_id})); await s.close();
