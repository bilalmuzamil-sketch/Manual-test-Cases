import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
for (const p of ['/api/work-orders/canned-lines','/api/work-orders/canned-lines?workplace_id=b3c8c820-f815-4cf1-8938-10956c5ee71a','/api/canned-lines?limit=200']) { const r=await s.api(p); console.log(p,r.status,j(r.json,500)); }
await s.close();
