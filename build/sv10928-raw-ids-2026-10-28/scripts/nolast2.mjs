// Set-up for "Journal Entry with no user": pick an active+confirmed staff, blank their last name, impersonate them, make one stock count,
// come back, restore the name. Prints the unexported Journal Entries before/after.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const mode=process.argv[3]||'null';
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28')});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const SJ=(await s.api('/api/staff?limit=300')).json?.data; const a=SJ?.collection||[];
const st=a.find(x=>x.email==='tech@shopview.com')||a.find(x=>x.is_active&&x.confirmed_invitation_on&&!/admin/i.test(x.role_label));
console.log('staff',JSON.stringify([st.id,st.staff_id,st.email,st.first_name,st.last_name,st.role_label]));
const base={first_name:st.first_name,last_name:st.last_name,email:st.email,role_id:st.role_id,workplace_id:st.workplace_id,job_title:st.job_title,salary_type:st.salary_type,salary:st.salary,billable:st.billable,clockable:st.clockable,departments:(st.departments||[]).map(d=>d.id||d)};
fs.writeFileSync(`/tmp/s10928/nolast-restore-${env}.json`,JSON.stringify({staff_id:st.staff_id,body:base}));
const ln=mode==='null'?null:mode==='empty'?'':' ';
const c=await post(`/api/staff/${st.staff_id}/change`,{...base,last_name:ln}); console.log('blank last name ->',JSON.stringify(ln),c.status,JSON.stringify(c.json||c.text).slice(0,250));
const chk=((await s.api('/api/staff?limit=300')).json?.data?.collection||[]).find(x=>x.staff_id===st.staff_id); console.log('now',JSON.stringify([chk.first_name,chk.last_name]));
await s.close(); process.exit(0);
