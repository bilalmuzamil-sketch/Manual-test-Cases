import {ob,j} from './lib.mjs';
const s=await ob({dpr:1});
console.log('marker',j(await s.marker()));
const ba=(await s.api('/api/accounting/bank-accounts?per_page=100')).json.bank_accounts; console.log(ba.map(b=>b.id.slice(0,8)+' '+(b.nickname||b.name)).join(' | '));
const plaid=ba.find(b=>(b.nickname||b.name)==='Plaid Checking');
const t=await s.api('/api/accounting/bank-transactions?bank_account_id='+plaid.id+'&per_page=5'); console.log(t.status, JSON.stringify(t.json).slice(0,1500));
const po=await s.api('/api/accounting/bank-transactions/party-options?search=ZZ'); console.log('party-options',po.status,JSON.stringify(po.json).slice(0,600));
const r=await s.api('/api/accounting/bank-transaction-rules'); console.log('rules',r.status,JSON.stringify(r.json).slice(0,800));
await s.close();
