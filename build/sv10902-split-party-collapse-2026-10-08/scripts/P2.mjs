import {op} from './lib.mjs';
const s=await op({dpr:1});
const po=await s.api('/api/accounting/bank-transactions/party-options'); console.log(JSON.stringify(po.json).slice(0,700));
const c=await s.api('/api/accounting/customers?per_page=5'); console.log('customers',c.status,JSON.stringify(c.json).slice(0,500));
await s.close();
