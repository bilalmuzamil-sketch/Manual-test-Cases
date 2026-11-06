import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess(); const TAG=process.env.TAG||process.env.ENV;
const q=process.env.Q||'range=last_month';
const r=await s.api('/api/reporting/export/customer_payment?report=customer_payment&'+q); const st=r.status; const body=r.text??JSON.stringify(r.json); console.log('status',st,'bytes',body.length); fs.writeFileSync(`../ev/${TAG}-export-${q.replace(/[^a-z0-9]+/gi,'_').slice(0,60)}.csv`,body);
console.log(body.split('\n').slice(0,3).join('\n').slice(0,600)); await s.close(); process.exit(0);
