import {ob,J} from './lib.mjs'; import {loc,invoiced,payUI,reversePaymentUI,reverseInvoiceUI} from './seed.mjs'; import {clearWO,clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
const A=await invoiced(s,'ZZAUTOTEST SV9055 ready-to-delete '+Date.now()%100000); fs.writeFileSync('RDY.json',JSON.stringify(A));
await payUI(s,A,'ZZ9055-RDY'); await reversePaymentUI(s,A); await reverseInvoiceUI(s,A);
const v=await s.api('/api/work-orders/view/'+A.work_order_id); console.log('wo status',v.json?.data?.work_order?.status, 'deletable',v.json?.data?.work_order?.deletable);
await clearWO(s,A); await clearAssetContact(s,A);
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
console.log('READY',co.name,J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable/.test(k))),300));
await s.close();
