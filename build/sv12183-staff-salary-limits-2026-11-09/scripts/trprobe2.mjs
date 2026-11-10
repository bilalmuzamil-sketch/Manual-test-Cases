import {sess,j} from './common.mjs';
const s=await sess();
for(const u of ['/api/iam/view-profile/','/api/auth/me','/api/work-orders/list?pagination[rowsPerPage]=5','/api/work-orders?limit=5']){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,500)); }
await s.close(); process.exit(0);
