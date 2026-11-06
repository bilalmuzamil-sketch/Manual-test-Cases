// usage: node depts.mjs -> lists org A departments with their workplace (to find a department in the other location)
import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
for(const u of ['/api/organization/departments','/api/departments','/api/organization/department']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,600)); }
await s.close(); process.exit(0);
