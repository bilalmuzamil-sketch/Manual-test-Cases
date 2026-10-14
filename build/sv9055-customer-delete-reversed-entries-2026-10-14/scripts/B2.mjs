import {ob,J} from './lib.mjs'; import {loc,invoiced,payUI} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
const A=await invoiced(s,'ZZAUTOTEST SV9055 B2 paid '+Date.now()%100000);
await payUI(s,A,'ZZ9055-B2'); fs.writeFileSync('B2.json',JSON.stringify(A));
const v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.json?.data?.work_order?.status);
await s.close();
