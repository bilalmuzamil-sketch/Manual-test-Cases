import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
for(const p of ['/api/departments','/api/departments?limit=200','/api/department','/api/organizations/departments','/api/department-templates','/api/staff/departments','/api/time-clock/departments','/api/technician-tasks/departments']){ const r=await s.api(p); const t=JSON.stringify(r.json??r.text); console.log(p,r.status,t.length,t.slice(0,220)); }
await s.browser.close(); process.exit(0);
