import {op,J,post} from './lib.mjs'; import {loc,invoiced,payUI,reversePaymentUI,reverseInvoiceUI} from './seed.mjs'; import {clearWO,clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const s=await op(); await loc(s);
const A=await invoiced(s,'ZZAUTOTEST SV9055 PROD before '+Date.now()%100000); fs.writeFileSync('PRA.json',JSON.stringify(A));
await payUI(s,A,'ZZ9055-PROD');
await reversePaymentUI(s,A); await reverseInvoiceUI(s,A);
await clearWO(s,A); await clearAssetContact(s,A);
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
console.log('counts',J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable/.test(k))),300));
await s.close();
