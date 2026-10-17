import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1000,height:700},dpr:1});
const J=(u,m,b)=>s.api(u,b?{method:m,headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}:{method:m||'GET'});
const old=JSON.parse(fs.readFileSync('/tmp/qa11310/ev10/deleted-lead-staff.json')); const ts=Date.now()%100000;
const body={...old.body,email:`zz.deleted.lead.${ts}@staging.shopview.local`,last_name:`Deleted Lead ${ts}`};
let r=await J('/api/iam/create','POST',body); console.log('create',r.status);
r=await J('/api/staff?pagination[rowsPerPage]=50&search='+encodeURIComponent(body.last_name)); const st=r.json.data.collection[0];
r=await J(`/api/staff/${st.staff_id}/change`,'POST',{first_name:st.first_name,last_name:st.last_name,email:st.email,role_id:body.role_id,workplace_id:body.workplace_id,job_title:'',salary_type:null,salary:null,billable:1,clockable:1,departments:body.departments}); console.log('change',r.status);
const out={staff:st,wos:{}};
for(const n of ['S2-35709','S2-36641']){ const w=(await J('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; r=await J(`/api/work-orders/${w.id}/board-move`,'POST',{technicianId:st.staff_id}); const w2=(await J('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; out.wos[n]={id:w.id,move:r.status,lead:w2.techAssignedId,name:w2.techAssignedFirstName+' '+w2.techAssignedLastName}; console.log(n,JSON.stringify(out.wos[n])); }
r=await J(`/api/staff/${st.staff_id}`,'DELETE'); out.del=r.status; console.log('delete',r.status);
for(const n of ['S2-35709','S2-36641']){ const w=(await J('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; console.log(n,'after delete lead',w.techAssignedId,w.techAssignedFirstName); }
fs.writeFileSync('/tmp/qa11310/ev10/deleted-lead-staff-2.json',JSON.stringify({body,...out},null,1)); await s.close();
