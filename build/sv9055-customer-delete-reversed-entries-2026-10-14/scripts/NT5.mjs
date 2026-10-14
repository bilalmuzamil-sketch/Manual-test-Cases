import {op,J} from './lib.mjs'; import fs from 'fs';
const s=await op(); const B=JSON.parse(fs.readFileSync('NT3.json')), E=JSON.parse(fs.readFileSync('NT4.json'));
for(const [k,A] of [['B',B],['E',E]]){ const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
 console.log(k,co.name,J(Object.fromEntries(Object.entries(co).filter(([x])=>/count|deletable|balance/.test(x))),300)); }
const tx=await s.api('/api/customer-account/'+B.customer_account_id+'/transactions'); console.log('B txns',tx.status,J(tx.json||tx.text,400));
const ev=await s.api('/api/work-orders/view/'+E.work_order_id); console.log('E',ev.status,J(ev.json?.data?.work_order?.formatted_number||ev.json?.data,200));
await s.close();
