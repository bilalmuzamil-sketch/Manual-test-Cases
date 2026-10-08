import {ob} from './lib.mjs';
const s=await ob({dpr:1});
const a=(await s.api('/api/accounting/accounts?per_page=500')).json.accounts; console.log(a.filter(x=>x.type==='expense'&&x.is_active).slice(0,8).map(x=>x.account_number+' '+x.name+' '+x.id).join('\n'));
const po=(await s.api('/api/accounting/bank-transactions/party-options')).json.party_options; console.log(po.length, po.filter(x=>x.type==='vendor').slice(0,3).map(x=>x.name+' '+x.id).join(' | '));
await s.close();
