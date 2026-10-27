import {sess} from './lib.mjs';
const s=await sess();
for(const p of ['/api/technician-tasks/create','/api/technician-tasks/add','/api/technician-tasks/department-clock-in']){s.L(p,await s.J(p,{}));}
s.L('depts',await s.api('/api/departments'));
await s.browser.close(); process.exit(0);
