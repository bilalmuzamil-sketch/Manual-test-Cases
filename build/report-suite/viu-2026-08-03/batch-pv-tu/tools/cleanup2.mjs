import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const ids=['8c31ff9e-8bff-47da-a2ce-64861b740622','2d65473e-749e-40e7-8c28-f1903fa1d73e','e154546e-a43c-4a20-9333-c40d04d57362','32da3c4f-0bc1-4945-8d61-e00ce32f0ac3'];
const R={};
for(const id of ids){
  let r=await api(S,'DELETE','/api/technician-tasks/'+id);
  if(r.status>=400) r=await api(S,'DELETE','/api/technician-tasks',{ids:[id]});
  R[id]=r.status+' '+(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,140);
  console.log(id, R[id]);
}
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const tu=(await api(S,'GET',`/api/reporting/reports/technician-utilization?range=this_month&locations=${HD},${LE}`)).body.data.collection;
R.tuThisMonthAfter=tu.map(x=>({n:x.technician_name,int:x.internal_seconds,ell:x.est_lost_labor_cents,loc:x.location}));
console.log('\nTU This Month after cleanup:',JSON.stringify(R.tuThisMonthAfter));
fs.writeFileSync('../evidence/cleanup2.json',JSON.stringify(R,null,1));
