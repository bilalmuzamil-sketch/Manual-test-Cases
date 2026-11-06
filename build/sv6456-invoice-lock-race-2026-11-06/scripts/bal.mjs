import {sess} from './common.mjs'; const s=await sess(); const A=process.env.ACC;
const r=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${A}&pagination%5BrowsPerPage%5D=1000`);
console.log(r.status,JSON.stringify(r.json).slice(0,300)); const d=r.json?.data; const rows=d?.response?.collection||[]; console.log('rows',rows.length);
for(const x of rows) console.log([x.formatted_invoice_number||x.invoice_display_number,x.type,x.status,x.amount,x.balance].join(' '));
console.log('sum amount',rows.reduce((a,x)=>a+ +x.amount,0).toFixed(2),'sum balance',rows.reduce((a,x)=>a+ +x.balance,0).toFixed(2));
await s.close(); process.exit(0);
