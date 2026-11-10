import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const u of ['/api/departments','/api/organizations/departments','/api/departments/list','/api/technician-tasks/departments']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,250)); }
await s.close(); process.exit(0);
