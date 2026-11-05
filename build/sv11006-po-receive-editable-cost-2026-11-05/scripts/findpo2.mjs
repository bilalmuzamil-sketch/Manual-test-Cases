import {sess} from './common.mjs'; import fs from 'fs';
const F=`/tmp/sv11006/seed-branch-${process.argv[2]}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const o=(await s.api('/api/inventory/orders/'+S.po)).json?.data?.order; console.log('po',o.order_number,'wo',o.work_order_id,'items',o.items.length);
for(const p of S.parts){ const it=o.items.find(i=>JSON.stringify(i).includes(p.pr)); if(it) p.order={orderId:o.id,orderItemId:it.order_item_id}; console.log(p.k,!!it, it?JSON.stringify({wo:it.work_order_id||it.workOrderId,num:it.work_order_number}).slice(0,150):''); }
fs.writeFileSync(F,JSON.stringify(S,null,1)); await s.close(); process.exit(0);
