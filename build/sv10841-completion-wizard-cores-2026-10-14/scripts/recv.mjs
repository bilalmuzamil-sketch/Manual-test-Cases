import {J} from './lib.mjs';
// Receive `qty` of the main part on the PO receive screen with vendor invoice `inv` (UI, AC.11 recipe).
export async function receiveUI(s,orderId,qty,inv,shot){
  const p=s.page; await s.go('/order/'+orderId); await p.waitForTimeout(3500);
  await p.locator('[data-test-id="button_receive_order"]').click(); await p.waitForTimeout(2500);
  const v=p.locator(`[data-test-id="select_assign_vendor_${orderId}"]`);
  if(await v.count()){ const txt=(await v.innerText()).trim(); if(!/\w{3,}/.test(txt.replace(/arrow_drop_down|Vendor/g,''))){ await v.click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(700);} }
  await p.locator(`[data-test-id="input_invoice_${orderId}"]`).fill(inv);
  const qtys=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_qty_"]')].map(e=>{const i=e.matches('input')?e:e.querySelector('input');return {tid:e.getAttribute('data-test-id'),dis:!!i?.disabled,val:i?.value}}));
  console.log('qty inputs',J(qtys,400));
  const main=qtys.find(q=>!q.dis); const loc=p.locator(`[data-test-id="${main.tid}"]`); const inp=(await loc.evaluate(e=>e.matches('input')))?loc:loc.locator('input');
  await inp.fill(String(qty)); await p.keyboard.press('Tab'); await p.waitForTimeout(800);
  console.log('qty after',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_qty_"]')].map(e=>{const i=e.matches('input')?e:e.querySelector('input');return [e.getAttribute('data-test-id'),i?.value,!!i?.disabled]})),300));
  if(shot) await p.screenshot({path:'ev/'+shot+'.png'});
  const n=s.writes.length; await p.locator(`[data-test-id="button_receive_po_${orderId}"]`).click(); await p.waitForTimeout(3500);
  const w=s.writes.slice(n).filter(x=>/receive|orders/.test(x)); console.log('recv writes',J(w,500)); return w;
}
