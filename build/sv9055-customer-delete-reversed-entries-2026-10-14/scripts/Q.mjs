import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]||'A1.json')); const s=await ob(); await loc(s);
const v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo',v.status,v.json?.data?.work_order?.status);
const d=await s.api('/api/invoices/'+A.work_order_id+'/details?includeDeclined=0'); console.log('details',d.status,J(d.json?.data && Object.fromEntries(Object.entries(d.json.data).filter(([k,v])=>/pay|balance|status|total/i.test(k))),600));
await s.close();
