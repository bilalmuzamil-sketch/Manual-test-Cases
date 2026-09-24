// Approve the line that is awaiting approval so its Quoted part becomes orderable, then order it.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { openPartsTab, readParts, actOnPart } from './lib-parts.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
await openWo(page, WO); await page.waitForTimeout(4500);
const appr = await page.evaluate(() => {
  for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) {
    const b = [...tr.querySelectorAll('button,.q-btn')].find(x => (x.innerText||'').trim() === 'Approve');
    if (b) { b.click(); return 'pressed Approve'; } }
  return 'no Approve on any line'; });
console.log(appr); await page.waitForTimeout(4000);
const d1 = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}:null; });
console.log('dialog:', JSON.stringify(d1));
if (d1) { await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Yes|Approve|Confirm|OK)$/i.test((x.innerText||'').trim())); if(b) b.click(); }); await page.waitForTimeout(6000); }
await openPartsTab(page, WO);
console.log('\nAFTER APPROVING:'); for (const p of await readParts(page)) console.log(' ', p.name, '|', JSON.stringify(p.badges), '|', JSON.stringify(p.actions));
// order whatever now offers Order
const ord = await actOnPart(page, 'fefwe', 'Order');
console.log('\n' + ord);
if (ord.startsWith('pressed')) {
  await page.waitForTimeout(4000);
  const d2 = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    return d? {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,400), buttons:[...d.querySelectorAll('button,.q-btn')].map(b=>(b.innerText||'').trim()).filter(Boolean)}:null; });
  console.log('order dialog:', JSON.stringify(d2));
  await page.screenshot({ path: `${EV}/order-dialog.png` });
  if (d2) { await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
    const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Yes|Order|Confirm|OK|Place Order)$/i.test((x.innerText||'').trim())); if(b) b.click(); }); await page.waitForTimeout(7000); }
  await openPartsTab(page, WO);
  console.log('\nAFTER ORDERING:'); for (const p of await readParts(page)) console.log(' ', p.name, '|', JSON.stringify(p.badges), '|', JSON.stringify(p.actions));
}
await page.screenshot({ path: `${EV}/after-order.png`, fullPage: true });
await browser.close();
