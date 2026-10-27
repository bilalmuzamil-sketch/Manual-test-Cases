import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
let r=await s.api('/api/departments'); const deps=r.json.data.collection; const d0=deps.find(d=>d.enable_time_clock)||deps[0]; console.log('dept',d0.name,d0.id);
r=await s.api('/api/technician-tasks/my-current-task'); console.log('current',JSON.stringify(r.json).slice(0,200));
r=await s.J('/api/technician-tasks/department-clock-in',{department_id:d0.id}); s.L('clock-in',r); const tid=r.json?.data?.technician_task_id;
await s.page.waitForTimeout(65000);
r=await s.J('/api/technician-tasks/department-clock-out',{task_id:tid,description:'ZZAUTOTEST SV-11565 entry'}); s.L('clock-out',r);
fs.writeFileSync('../data/entry.json',JSON.stringify({dept:d0,tid},null,1));
await s.browser.close(); process.exit(0);
