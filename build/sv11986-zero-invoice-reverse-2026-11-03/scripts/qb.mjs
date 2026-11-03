import {sess} from './common.mjs'; const s=await sess();
for(const u of ['/api/bookkeeping/adjustment-item-mapping-status','/api/bookkeeping/products-and-services','/api/bookkeeping/integration']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,400)); }
await s.close(); process.exit(0);
