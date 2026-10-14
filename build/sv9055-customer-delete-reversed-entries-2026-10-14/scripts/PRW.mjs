import {op,J} from './lib.mjs'; import {loc,customer,wo} from './seed.mjs'; import fs from 'fs';
const s=await op(); await loc(s); const c=await customer(s,'ZZAUTOTEST SV9055 PROD with-work-order '+Date.now()%100000); const w=await wo(s,c);
fs.writeFileSync('PRW.json',JSON.stringify({...c,work_order_id:w.work_order_id})); await s.close();
