import {op,J,post,setLoc,TH2} from './lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('setup.json')); const C=S.pick;
const s=await op({dpr:1}); await setLoc(s);
const cr=await post(s,'/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact?.id,vehicle_id:C.vehicle.id,workplace_id:TH2.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); console.log('wo',cr.status,J(cr.json,200));
const wo=cr.json?.data?.work_order_id||cr.json?.data?.id; const can=(S.canned||[])[0];
const ln=await post(s,`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:can.id,status:'authorized'}); console.log('line',ln.status,J(ln.json,200));
const v=(await s.api('/api/work-orders/view/'+wo)).json.data.work_order; console.log('num',v.number,v.status);
fs.writeFileSync('wo1.json',JSON.stringify({wo,number:v.number,line:ln.json?.data?.line_id},null,1));
await s.close();
