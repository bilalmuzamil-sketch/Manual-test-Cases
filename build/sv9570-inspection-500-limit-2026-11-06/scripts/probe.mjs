import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
for(const u of ['/api/companies?limit=5','/api/customers?limit=5','/api/vehicles?limit=5','/api/companies/list?limit=5']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,250)); } await s.close(); process.exit(0);
