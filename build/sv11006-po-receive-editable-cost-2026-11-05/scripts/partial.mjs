// usage: node partial.mjs <tag> -> PO receive screen: part A qty received 1 (of 2), part B unticked; receive
import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess(); const p=s.page; const po=S.parts[0].order.orderId; const A=S.parts[0].order.orderItemId, B=S.parts[1].order.orderItemId;
await s.go('/order/'+po+'?receive=1'); await p.waitForTimeout(4500);
const q=p.locator(`[data-test-id="input_qty_${A}"]`); await q.fill(''); await q.type('1'); await p.waitForTimeout(500);
const cb=p.locator(`[data-test-id="checkbox_item_${B}"]`); console.log('cbB',await cb.count()); if(await cb.count()){ await cb.click(); await p.waitForTimeout(500);} 
await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZ'+process.argv[2]+'p'); const n=s.writes.length; await p.screenshot({path:'../ev/branch-partial-d6-1.png'});
await p.locator(`[data-test-id="button_receive_po_${po}"]`).click(); await p.waitForTimeout(5000);
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,500)))); await s.close(); process.exit(0);
