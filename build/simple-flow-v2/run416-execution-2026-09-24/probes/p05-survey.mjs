import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
const g = async (p) => { const r = await ctx.request.get(`https://${APIH}${p}`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true }); const txt = await r.text(); let j=null; try{j=JSON.parse(txt);}catch{} return {s:r.status(), j, txt}; };
const wo = await g('/api/work-orders?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0');
const arr = wo.j?.data?.work_orders || [];
console.log('work-orders:', arr.length, '| pagination', JSON.stringify(wo.j?.data?.pagination));
console.log('row0 keys:', Object.keys(arr[0]||{}).join(','));
fs.writeFileSync(`${EV}/wo-list.json`, JSON.stringify(arr,null,1));
const byStatus={};
for (const w of arr) { const s=w.status?.label||w.status?.value||w.status||'?'; byStatus[s]=(byStatus[s]||0)+1; }
console.log('by status:', JSON.stringify(byStatus));
for (const w of arr.slice(0,30)) console.log(' ', (w.number||w.work_order_number||w.woNumber||''), '|', (w.status?.label||w.status), '| lines', w.linesCount??w.lines_count, '|', String(w.customer?.name||w.customerName||'').slice(0,24), '| id', w.id);
await browser.close();
