// usage: node recv.mjs <tag> <qtyA> <qtyB> [costA] [costB] [invoiceSuffix] -> Parts > Purchase Orders > row Receive; set qty (+cost); receive. Prints what the screen showed and what it sent.
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const [TAG,qA,qB,cA,cB,suf]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,'utf8'));
const po=S.parts[0].order.orderId; const items=S.parts.map(x=>x.order.orderItemId);
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-recv-${TAG}${suf||''}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/order/'+po+'?receive=1'); await p.waitForTimeout(4000);
const snap=async()=>p.evaluate(ids=>ids.map(id=>{ const tr=document.querySelector(`[data-test-id="icon_edit_part_number_${id}"]`)?.closest('tr'); const c=document.querySelector(`[data-test-id="input_cost_${id}"]`);
  return {id:id.slice(0,8),costInput:c?c.value:null,tds:tr?[...tr.querySelectorAll('td')].map(t=>t.innerText.trim().replace(/\s+/g,' ')):null,qty:document.querySelector(`[data-test-id="input_qty_${id}"]`)?.value}; }),items);
R.before=await snap(); await p.screenshot({path:OUT+'/1-before.png'});
for(const [id,q,c] of [[items[0],qA,cA],[items[1],qB,cB]]){ if(q){ const i=p.locator(`[data-test-id="input_qty_${id}"]`); await i.fill(''); await i.type(q); }
  if(c){ const i=p.locator(`[data-test-id="input_cost_${id}"]`); if(await i.count()){ await i.fill(''); await i.type(c,{delay:50}); } else R['noCostInput_'+id.slice(0,8)]=true; } await p.waitForTimeout(500); }
await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZ'+TAG+(suf||'')); R.typed=await snap(); await p.screenshot({path:OUT+'/2-typed.png'});
const n=s.writes.length; await p.locator(`[data-test-id="button_receive_po_${po}"]`).click(); await p.waitForTimeout(5000);
R.sent=s.writes.slice(n); R.urlAfter=p.url().replace(/^https:\/\/[^/]+/,''); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' ')));
await p.screenshot({path:OUT+'/3-after.png'}); console.log(JSON.stringify(R,null,1).slice(0,3500)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
