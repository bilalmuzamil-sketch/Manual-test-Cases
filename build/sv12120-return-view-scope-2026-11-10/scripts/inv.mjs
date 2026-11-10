import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const H={'content-type':'application/json'}; const out={};
await s.api('/api/iam/change-location',{method:'POST',headers:H,body:JSON.stringify({workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'})});
for(const u of ['/api/invoices?limit=3','/api/invoices/list?limit=3','/api/customers/invoices?limit=3']){ const r=await s.api(u); out[u]=[r.status,JSON.stringify(r.json).slice(0,300)]; }
fs.writeFileSync('../ev/inv-probe.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1));
await s.api('/api/iam/change-location',{method:'POST',headers:H,body:JSON.stringify({workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'})});
await s.close(); process.exit(0);
