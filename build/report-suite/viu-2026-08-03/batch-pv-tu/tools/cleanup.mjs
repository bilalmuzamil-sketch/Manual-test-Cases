import { login, api } from './qa8582.mjs';
import fs from 'fs';
const R={at:new Date().toISOString()};
const p=(n,r,l=300)=>{console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l)); return r;};
// 1. clock out the open task (impersonate the holder)
let t=await login('admin'); let S=t.sessCookie;
await api(S,'POST','/api/switch-user',{user_id:'2bc71c2e-b5cd-466c-afc5-0a1338802c83'});
const cur=await api(S,'GET','/api/technician-tasks/my-current-task');
const task=cur.body?.data?.technician_task;
R.openTask = task && task.id ? {id:task.id, start:task.start_date, seconds:task.seconds} : null;
if(R.openTask){ R.clockOut = p('clock-out', await api(S,'POST','/api/technician-tasks/department-clock-out',{task_id:task.id, description:'ZZAUTOTEST internal HD (closed at cleanup)'})).status;
  const after=await api(S,'GET','/api/technician-tasks/my-current-task'); R.openAfter=JSON.stringify(after.body).slice(0,120); }
// 2. delete the seeded inventory + catalogue part
t=await login('admin'); S=t.sessCookie;
const list=await api(S,'GET','/api/inventory/parts?search=ZZAUTOTEST&pagination[rowsPerPage]=20');
const parts=(list.body?.data?.collection||[]);
R.seededParts=parts.map(x=>({id:x.id,pn:x.part_number}));
for(const pt of parts){ R.delInv=p('inv delete '+pt.part_number, await api(S,'POST','/api/inventory/parts/delete',{id:pt.id, part_id:pt.id})).status; }
R.delCat=p('catalogue delete', await api(S,'POST','/api/parts-catalogue/remove-catalogue-part?id=dbc8e4da-65d7-4fdd-871d-3b744d0c8afd',{})).status;
const list2=await api(S,'GET','/api/inventory/parts?search=ZZAUTOTEST&pagination[rowsPerPage]=20');
R.seededPartsAfter=(list2.body?.data?.collection||[]).map(x=>x.part_number);
// 3. try to delete the seeded clock records
for(const path of ['/api/technician-tasks/delete','/api/technician-tasks/remove']){ R['probe'+path]=p('probe '+path, await api(S,'POST',path,{})).status; }
// 4. verify roles/labour defaults untouched
const st=await api(S,'GET','/api/staff?limit=300');
const wesley=(st.body.data.collection).find(s=>s.email==='wesley.mcclure@staging.shopview.local');
R.wesley={role:wesley.role_label, wp:wesley.workplace_id};
const lt=(await api(S,'GET','/api/labour-types?pagination[rowsPerPage]=200')).body.data.collection.filter(x=>x.is_default);
R.labourDefaults=lt.map(x=>({name:x.name,rate:x.labour_rate}));
// 5. final build marker
const html=await (await fetch('https://sv8582.qa.shopview.com/',{headers:{'User-Agent':'m'}})).text();
R.finalBuildMarker=html.match(/app-version" content="([^"]+)/)?.[1];
const h=await fetch('https://sv8582.qa.shopview.com/',{method:'HEAD',headers:{'User-Agent':'m'}});
R.finalLastModified=h.headers.get('last-modified'); R.finalEtag=h.headers.get('etag');
fs.writeFileSync('../evidence/cleanup.json',JSON.stringify(R,null,1));
console.log('\n',JSON.stringify(R,null,1));
