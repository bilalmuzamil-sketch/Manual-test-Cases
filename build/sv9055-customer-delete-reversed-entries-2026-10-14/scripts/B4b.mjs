import {ob,J} from './lib.mjs'; import {loc,reversePaymentUI} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const A=JSON.parse(fs.readFileSync('B4.json'));
await reversePaymentUI(s,A); const v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.json?.data?.work_order?.status);
await s.close();
