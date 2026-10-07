// node role-swap.mjs <roleId>
import {open} from '/tmp/qa9667/qa-session-q.mjs';
import {C} from '/tmp/qa9667/lib.mjs'; import fs from 'fs';
const [ROLE]=process.argv.slice(2);
const s=await open({env:'branch',ticket:'9667',dir:'/tmp/qa9667',cookies:C,vp:{width:1600,height:1000}});
const L=(await s.api('/api/staff?limit=300&search=Tech')).json?.data?.collection||[]; const t=L.find(x=>x.id==='ba74948b-5777-4f0c-90fb-2f60d9ce8107');
if(!fs.existsSync('/tmp/qa9667/tech-orig.json')) fs.writeFileSync('/tmp/qa9667/tech-orig.json',JSON.stringify(t));
const body={first_name:t.first_name,last_name:t.last_name,email:t.email,role_id:ROLE,workplace_id:t.workplace_id,job_title:t.job_title,salary_type:t.salary_type,salary:t.salary,billable:t.billable,clockable:t.clockable};
const r=await s.api(`/api/staff/${t.staff_id}/change`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const t2=((await s.api('/api/staff?limit=300&search=Tech')).json?.data?.collection||[]).find(x=>x.id===t.id);
console.log('change',r.status,JSON.stringify(r.json).slice(0,200),'| role now',t2.role_label,t2.role_id,'| email',t.email);
await s.close();
