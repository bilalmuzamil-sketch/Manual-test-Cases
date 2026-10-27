import {sess} from './lib.mjs';
const s=await sess();
for(const p of ['/api/users/me','/api/me','/api/user','/api/staff/me','/api/technician-tasks/list?page=1&rowsPerPage=5','/api/technician-tasks/list-overlapping?start_date=2026-10-26&end_date=2026-10-27']){const r=await s.api(p); console.log(p,r.status,JSON.stringify(r.json??r.text).slice(0,300));}
await s.browser.close(); process.exit(0);
