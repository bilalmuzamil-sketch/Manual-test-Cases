// usage: ORG=B node seedB.mjs -> org B: contact + vehicle + work order on its location; prints ids; then probes lines/create with a few bodies
import {sess,post} from './common.mjs'; const s=await sess(); console.log('login',s.loginStatus,'loc',s.locStatus);
const C='37c2a6c3-0e62-432a-b7d4-f93336355cf3', W='1070345f-1057-4d3f-b21c-41cf0a72f7fb';
const ct=await post(s,'/api/contacts/create',{company_id:C,first_name:'ZZB',last_name:'Contact',email:'zzb11249@example.com'}); console.log('contact',ct.status,JSON.stringify(ct.json).slice(0,200));
const cid=ct.json?.data?.contact_id||ct.json?.data?.id; const v=await post(s,'/api/vehicles/create',{company_id:C,customer_id:cid,unit:'B-UNIT-1'}); console.log('vehicle',v.status,JSON.stringify(v.json).slice(0,200));
const vid=v.json?.data?.vehicle_id||v.json?.data?.id; const wo=await post(s,'/api/work-orders/create',{company_id:C,customer_id:cid,vehicle_id:vid,workplace_id:W,start_date:'2026-11-06',is_vehicle_here:true}); console.log('wo',wo.status,JSON.stringify(wo.json).slice(0,200));
const wid=wo.json?.data?.work_order_id||wo.json?.data?.id;
for(const b of [{work_order_id:wid},{work_order_id:wid,title:'ZZB line',status:'authorized'}]){ const r=await post(s,'/api/work-orders/lines/create',b); console.log('line',r.status,JSON.stringify(r.json).slice(0,300)); }
await s.close(); process.exit(0);
