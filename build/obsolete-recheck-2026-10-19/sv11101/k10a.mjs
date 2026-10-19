// C96929 retest set-up: two fresh technicians (no work, nobody reordered), probe "create with lead"
import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin'}); const P=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}); const out={};
let r=await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles'); const tech=(r.json?.data?.collection||r.json?.data).find(x=>x.name==='Technician');
r=await s.api('/api/departments'); const svc=r.json.data.collection.find(d=>d.name==='Service');
for(const [fn,ln] of [['Nora','Sort QA1019'],['Owen','Created QA1019']]){
  const body={email:`zz.${fn.toLowerCase()}.${Date.now()%100000}@staging.shopview.local`,first_name:fn,last_name:ln,role_id:tech.id,departments:[svc.id],workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a'};
  r=await P('/api/iam/create',body); const st=((await s.api('/api/staff?pagination[rowsPerPage]=50&search='+encodeURIComponent(ln))).json?.data?.collection||[])[0];
  out[fn]={create:r.status,user_id:st?.id,staff_id:st?.staff_id,clockable:st?.clockable,active:st?.is_active,role:st?.role_label};
}
// probe: can a work order be created with its lead?
const C={Z:['7750703f-f960-4350-b74b-e76e6b7e2c81','d1f52ba5-027a-48e3-926c-419db4259576']};
for(const key of ['tech_assigned_id','lead_technician_id','technician_id','techAssignedId']){
  const b={company_id:C.Z[0],vehicle_id:C.Z[1],workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true,[key]:out.Owen.user_id};
  r=await P('/api/work-orders/create',b); const id=r.json?.data?.work_order_id; let lead=null,n=null; if(id){ const w=(await s.api('/api/work-orders/view/'+id)).json.data; const W=w.work_order||w; lead=W.techAssignedLastName||JSON.stringify(W).match(/"tech[A-Za-z]*":"[^"]*"/g)?.slice(0,3); n=W.number; }
  out['probe_'+key]={st:r.status,n,lead,err:r.status>=300?JSON.stringify(r.json).slice(0,200):undefined};
  if(lead&&String(lead).includes('Created')) break;
}
fs.writeFileSync('/tmp/qa11310/ex26/k10a.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1)); await s.close();
