import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
for(const p of ['/api/departments','/api/departments/create','/api/department/create']){ s.L('POST '+p,await s.J(p,{})); }
s.L('change empty',await s.J('/api/technician-tasks/change',{}));
await s.browser.close(); process.exit(0);
