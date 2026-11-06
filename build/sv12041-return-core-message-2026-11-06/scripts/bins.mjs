import {sess,post,arr} from './common.mjs';
const s=await sess(); await s.go('/parts/inventory'); await s.page.waitForTimeout(3000);
for(const u of ['/api/inventory/bin-locations?limit=50','/api/bin-locations?limit=50','/api/inventory/bins?limit=50']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,300)); }
await s.close(); process.exit(0);
