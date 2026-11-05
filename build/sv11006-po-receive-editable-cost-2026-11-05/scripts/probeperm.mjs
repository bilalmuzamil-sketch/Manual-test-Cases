import {sess,post} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
for(const [m,u,b] of [['POST','/api/fe-permissions',{}],['POST','/api/fe-permissions/create',{}],['POST','/api/permissions/sync',{}]]){ const r=await s.api(u,{method:m,headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log(m,u,r.status,JSON.stringify(r.json).slice(0,160)); }
await s.close(); process.exit(0);
