import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
const c=await s.api('/api/customers?limit=30'); console.log(c.status, j(c.json,300));
const list=c.json?.data?.customers||c.json?.data?.collection||[];
for(const x of list.slice(0,30)){ const id=x.id; const v=await s.api('/api/vehicles?company_id='+id); const vs=v.json?.data?.vehicles||v.json?.data?.collection||[];
  const cv=await s.api('/api/customers/view/'+id); const ct=cv.json?.data?.company?.contacts||[];
  if(vs.length&&ct.length){ console.log('PICK',id,x.name||x.company_name,'veh',vs[0].id,j(vs[0].unit_number||vs[0].unitNumber),'contact',ct[0].id,ct[0].first_name||ct[0].firstName); fs.writeFileSync('cust.json',JSON.stringify({company_id:id,name:x.name||x.company_name,vehicle:vs[0],contact:ct[0]})); break; } }
await s.close();
