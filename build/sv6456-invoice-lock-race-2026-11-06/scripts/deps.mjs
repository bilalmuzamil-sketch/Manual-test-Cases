import {sess} from './common.mjs'; const s=await sess(); const ids=process.env.WOS.split(',');
for(const id of ids){ for(const u of [`/api/deposits?work_order_id=${id}`,`/api/work-orders/${id}/deposits`]){ const r=await s.api(u); if(r.status<300){ console.log(id.slice(0,8),u.split('?')[0],JSON.stringify(r.json).slice(0,500)); break; } else console.log(id.slice(0,8),u,r.status); } }
const A=process.env.ACC; const r=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${A}&pagination%5BrowsPerPage%5D=1000`); for(const x of r.json?.data?.response?.collection||[]) console.log([x.formatted_invoice_number,x.type,x.status,x.amount,x.balance,x.work_order_id?.slice(0,8)].join(' '));
await s.close(); process.exit(0);
