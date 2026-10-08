import {ob} from './lib.mjs';
const s=await ob({dpr:1});
const rules=(await s.api('/api/accounting/bank-transaction-rules')).json.bank_transaction_rules.filter(r=>/ZZAUTOTEST SV-10902/.test(r.name));
for(const r of rules) console.log('del',r.name,(await s.api('/api/accounting/bank-transaction-rules/'+r.id,{method:'DELETE'})).status);
console.log('marker',JSON.stringify(await s.marker())); await s.close();
