import {op,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import {clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const s=await op(); await loc(s); const A=JSON.parse(fs.readFileSync('PRA.json'));
const u=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${A.customer_account_id}&pagination%5BrowsPerPage%5D=100&openOnly=false`); console.log('txns',J((u.json?.data?.response?.collection||[]).map(x=>[x.type,x.invoice_display_number,x.amount,x.balance,x.status]),400));
const r=await post(s,'/api/invoices/reverse-invoice',{id:A.invoice_id}); console.log('revinv',r.status,J(r.json,200));
const u2=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${A.customer_account_id}&pagination%5BrowsPerPage%5D=100&openOnly=false`); console.log('txns after',J((u2.json?.data?.response?.collection||[]).map(x=>[x.type,x.invoice_display_number,x.amount,x.balance,x.status]),400));
await clearAssetContact(s,A);
const co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company; console.log('counts',J(Object.fromEntries(Object.entries(co).filter(([k])=>/count|deletable/.test(k))),300));
await s.close();
