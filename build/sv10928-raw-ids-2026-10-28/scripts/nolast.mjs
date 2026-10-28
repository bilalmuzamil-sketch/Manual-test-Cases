// Set-up: the signed-in admin's last name is blanked, one stock count is made (queues a Journal Entry), then the name is restored.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const me=(await s.api('/api/iam/view-profile/')).json?.data; console.log('me',JSON.stringify(me).slice(0,250));
const SJ=(await s.api('/api/staff?limit=300')).json?.data; const st=(Array.isArray(SJ)?SJ:(SJ?.staff||SJ?.collection||[])).find(x=>x.email===me.email); console.log('staff row',JSON.stringify([st.staff_id,st.first_name,st.last_name,st.role_id,st.workplace_id]));
const body={first_name:st.first_name,last_name:'',email:st.email,role_id:st.role_id,workplace_id:st.workplace_id,job_title:st.job_title,salary_type:st.salary_type,salary:st.salary,billable:st.billable,clockable:st.clockable};
const c=await post(`/api/staff/${st.staff_id}/change`,body); console.log('blank last name',c.status,JSON.stringify(c.json||c.text).slice(0,250));
fs.writeFileSync('/tmp/s10928/nolast-restore.json',JSON.stringify({staff_id:st.staff_id,body:{...body,last_name:st.last_name}}));
await s.close(); process.exit(0);
