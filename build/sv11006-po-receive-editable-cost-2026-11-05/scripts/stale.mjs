// usage: node stale.mjs <tag> -> tab: open PO receive; meanwhile invoice the WO by API (= another tab); then type cost A 80 + receive in the stale tab
import {sess,post} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess(); const p=s.page; const po=S.parts[0].order.orderId; const A=S.parts[0].order.orderItemId; const OUT='../ev/branch-stale-'+process.argv[2]; fs.mkdirSync(OUT,{recursive:true});
await s.go('/order/'+po+'?receive=1'); await p.waitForTimeout(4500); console.log('A editable now',await p.locator(`[data-test-id="input_cost_${A}"]`).count()); await p.screenshot({path:OUT+'/1-open.png'});
const inv=await s.api('/api/invoices/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:S.wo})}); console.log('invoice (other tab)',inv.status);
const i=p.locator(`[data-test-id="input_cost_${A}"]`); await i.click(); await i.fill(''); await i.type('80',{delay:50}); await p.waitForTimeout(800);
await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZstale'); await p.screenshot({path:OUT+'/2-typed.png'}); const n=s.writes.length;
await p.locator(`[data-test-id="button_receive_po_${po}"]`).click(); await p.waitForTimeout(2500);
console.log('TOAST',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ')))); await p.screenshot({path:OUT+'/3-error.png'}); await p.waitForTimeout(4000);
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,160)))); console.log('A input after',await p.locator(`[data-test-id="input_cost_${A}"]`).count(),'url',p.url().replace(/^https:\/\/[^/]+/,''));
const txt=await p.evaluate(id=>{const tr=document.querySelector(`[data-test-id="icon_edit_part_number_${id}"]`)?.closest('tr')||[...document.querySelectorAll('tr')].find(t=>t.innerText.includes('part A')); return tr?tr.innerText.replace(/\s+/g,' '):null;},A); console.log('A row after',txt);
await p.screenshot({path:OUT+'/4-after.png'}); await s.close(); process.exit(0);
