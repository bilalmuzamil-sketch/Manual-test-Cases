// usage: node assign.mjs <roleName> -> assigns that role to tech@shopview.com (records the previous role in /tmp/sv11006/tech-prev-role.txt)
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f'; const L=(await s.api(`/api/organizations/${ORG}/roles`)).json?.data; const R=Array.isArray(L)?L:L.collection; const role=R.find(r=>r.name===process.argv[2]);
const SL=(await s.api('/api/staff?pagination[page]=1&pagination[rowsPerPage]=500&limit=500')).json.data.collection; const t=SL.find(x=>x.email==='tech@shopview.com'); console.log('tech now',t.role_label,t.staff_id);
if(!fs.existsSync('/tmp/sv11006/tech-prev-role.txt')) fs.writeFileSync('/tmp/sv11006/tech-prev-role.txt',t.role_label);
const r=await post(s,`/api/staff/${t.staff_id}/change`,{first_name:t.first_name,last_name:t.last_name,email:t.email,role_id:role.id,workplace_id:t.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a',job_title:t.job_title,salary:t.salary,salary_type:t.salary_type,billable:t.billable,clockable:t.clockable});
console.log('change',r.status,JSON.stringify(r.json).slice(0,200)); const t2=(await s.api('/api/staff?pagination[page]=1&pagination[rowsPerPage]=500&limit=500')).json.data.collection.find(x=>x.email==='tech@shopview.com'); console.log('tech after',t2.role_label);
await s.close(); process.exit(0);
