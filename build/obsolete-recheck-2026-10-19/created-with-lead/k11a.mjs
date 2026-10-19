import {session} from './rec.mjs';
const s=await session({quick:'admin'});
const st=((await s.api('/api/staff?pagination[rowsPerPage]=50&search=Created%20QA1019')).json.data.collection||[])[0];
const b={first_name:st.first_name,last_name:st.last_name,email:st.email,role_id:st.role_id||st.roleId,workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',job_title:st.job_title,salary_type:st.salary_type,salary:st.salary,billable:!!st.billable,clockable:true,is_sales_rep:!!st.is_sales_rep};
if(!b.role_id){ const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json.data; b.role_id=(roles.collection||roles).find(x=>x.name==='Technician').id; }
const r=await s.api(`/api/staff/${st.staff_id}/change`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const a=((await s.api('/api/staff?pagination[rowsPerPage]=50&search=Created%20QA1019')).json.data.collection||[])[0];
console.log(r.status,JSON.stringify(r.json).slice(0,200),'clockable now',a.clockable,a.role_label); await s.close();
