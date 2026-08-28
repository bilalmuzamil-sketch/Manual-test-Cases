import { open } from '/tmp/sv8781/api.mjs';
import fs from 'node:fs';
const st = JSON.parse(fs.readFileSync('/tmp/sv8781/recheck-state.json','utf8'));
const s = await open();
for (const [label,po] of [['PO_A',st.PO_A],['PO_B',st.PO_B]]) {
  const o = await s.api('GET',`/api/inventory/orders/${po}`);
  const ds = o.json?.data?.order?.deliveries || [];
  for (const d of ds) {
    const itemSum = (d.items||[]).reduce((a,i)=>a+Number(i.total_cost||0),0);
    console.log(`${label} ${d.order_number}  invoice=${d.invoice_number}`);
    console.log(`   HEADER total_price = ${d.total_price}`);
    for (const i of (d.items||[])) console.log(`   item ${i.part_number} qty_delivered=${i.quantity_delivered} price=${i.price} total_cost=${i.total_cost}`);
    console.log(`   SUM OF ITEMS       = ${itemSum.toFixed(2)}   ${Math.abs(itemSum-Number(d.total_price))<0.005?'MATCHES':'*** MISMATCH ***'}\n`);
  }
}
await s.browser.close();
