// Does the Receive button need only a COST, or a sell price too? The QA lead says sell may stay
// 0.00; a note in our own playbook says sell must be above zero. One of them is out of date.
// Fill the invoice number and a cost, leave every sell at 0, and read the button.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG32.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const ORDER='b2a707a6-559f-4c99-a03c-ffebf9c7d9ee';
const s = await boot2('admin', {route:`/order/${ORDER}?receive=1&returnTo=WorkOrder&returnId=${WO}`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
await settle(page,{label:'receive'});
await page.waitForTimeout(3000);
const btn = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^receive$/i.test(t(e)));
  return b?{text:t(b), disabled:b.disabled}:null;}, VIS);
const fill=async(tid,val)=>{ const el=await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:6000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(val,{delay:60}); await page.keyboard.press('Tab');
  await page.waitForTimeout(1200); return true; };

R.start = await btn();
R.ids = await page.evaluate(()=>({
  cost:[...document.querySelectorAll('[data-test-id^=input_cost_]')].map(e=>e.getAttribute('data-test-id')),
  sell:[...document.querySelectorAll('[data-test-id^=input_sell_]')].map(e=>e.getAttribute('data-test-id')),
  qty:[...document.querySelectorAll('[data-test-id^=input_qty_]')].map(e=>e.getAttribute('data-test-id')),
  invoice:[...document.querySelectorAll('[data-test-id^=input_invoice_]')].map(e=>e.getAttribute('data-test-id'))}));
log('button at the start: %s | %d cost boxes, %d sell boxes', JSON.stringify(R.start),
  R.ids.cost.length, R.ids.sell.length);

// invoice number
for (const t of R.ids.invoice) await fill(t, 'ZZAUTOTEST-INV-001');
R.afterInvoice = await btn();
// a cost on every line, sell left at 0
for (const t of R.ids.cost) await fill(t, '12.50');
await page.waitForTimeout(2500);
R.afterCostOnly = await btn();
R.sellValues = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=input_sell_]')].map(e=>e.value));
log('after the invoice number: %s', JSON.stringify(R.afterInvoice));
log('after a cost on every line, sell still %s: BUTTON = %s',
  JSON.stringify(R.sellValues), JSON.stringify(R.afterCostOnly));
await page.screenshot({path:`${DIR}/evidence/BIG32-costonly.png`, fullPage:true}).catch(()=>{});
save();

// and with a sell price too, as the control
if (R.afterCostOnly && R.afterCostOnly.disabled){
  for (const t of R.ids.sell) await fill(t, '25.00');
  await page.waitForTimeout(2500);
  R.afterSellToo = await btn();
  log('CONTROL — with a sell price as well: BUTTON = %s', JSON.stringify(R.afterSellToo));
  await page.screenshot({path:`${DIR}/evidence/BIG32-withsell.png`, fullPage:true}).catch(()=>{});
}
save();
log('done — nothing was received; the button was only read, never pressed');
await s.browser.close();
process.exit(0);
