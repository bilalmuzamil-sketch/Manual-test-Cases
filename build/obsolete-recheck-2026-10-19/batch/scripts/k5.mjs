// Seed customers named Alpha / Mid / Zeta (no ZZ prefix) + assets + work orders; free Vic Hover of the old three
import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({}); const J={method:'POST',headers:{'Content-Type':'application/json'}}; const out={cust:{},wo:{}};
const post=async(u,b)=>{ const r=await s.api(u,{...J,body:JSON.stringify(b)}); return r; };
for(const id of ['93b05166-26bf-4c67-84df-38d3a1e7d6a1','16e0979e-4e6c-4572-8d62-0158469c1a37','f33bf65a-65e6-482a-81b4-dd2bb1567f5f']){ out['free_'+id.slice(0,8)]=(await post(`/api/work-orders/${id}/board-move`,{technicianId:null})).status; }
for(const [k,name] of [['A','Alpha Freight QA1019'],['M','Mid Trucking QA1019'],['Z','Zeta Hauling QA1019']]){
 const c=await post('/api/customers/create',{name}); const cid=c.json?.data?.company_id||c.json?.data?.id||c.json?.data; 
 const ct=await post('/api/contacts/create',{company_id:cid,first_name:name.split(' ')[0]+' Contact'}); const ctid=ct.json?.data?.contact_id||ct.json?.data?.id||ct.json?.data;
 const v=await post('/api/vehicles/create',{company_id:cid,customer_id:ctid,unit:k+'-1019'}); const vid=v.json?.data?.vehicle_id||v.json?.data?.id||v.json?.data;
 out.cust[k]={name,cid,ctid,vid,st:[c.status,ct.status,v.status],raw:JSON.stringify(c.json).slice(0,120)}; }
const mk=async(k,tag)=>{ const C=out.cust[k]; const r=await post('/api/work-orders/create',{company_id:C.cid,vehicle_id:C.vid,workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true}); const id=r.json?.data?.work_order_id; const w=(await s.api('/api/work-orders/view/'+id)).json.data; out.wo[tag]={id,n:(w.work_order||w).number,st:r.status}; await new Promise(z=>setTimeout(z,2500)); };
for(const t of ['Z','A','M1','M2']) await mk(t[0],t);
fs.writeFileSync('/tmp/qa11310/ex20/k5.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,2000)); await s.close();
