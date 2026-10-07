import {op,j} from '../lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup.json')); const s=await op(); const p=s.page;
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const TH='b617914c-16e9-4485-8e8b-193cd86aa416';
console.log('loc',(await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'})).status);
const r0=await P('/api/organizations/settings/change',Object.assign({},S.settings,{requireReview:true})); console.log('setting on',r0.status,(await s.api('/api/organizations/settings')).json.data.requireReview);
const C=S.pick; const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:TH,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
console.log('create',cr.status,j(cr.json,150)); const wo=cr.json.data.work_order_id; fs.writeFileSync('prod/wo.json',JSON.stringify({wo}));
await P('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
const lines=[]; for(const c of S.canned.slice(0,2)){ const r=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'}); console.log('line',r.status,j(r.json,100)); lines.push(r.json.data.line_id); }
for(const l of lines){ await P('/api/work-orders/lines/change-story',{line_id:l,tech_story:'ZZAUTOTEST SV-10642 work done',work_order_id:wo}); const r=await P('/api/work-orders/lines/change-status',{line_id:l,status:'complete',workOrderId:wo}); console.log('complete',r.status,j(r.json,120)); }
const v=await s.api('/api/work-orders/view/'+wo); console.log('status',v.json?.data?.work_order?.status??v.json?.data?.status);
fs.writeFileSync('prod/wo.json',JSON.stringify({wo,lines}));
await s.close();
