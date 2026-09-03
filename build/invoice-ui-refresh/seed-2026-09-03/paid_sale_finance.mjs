// The paid part sale carries a "Finance" tab. That is where an invoice - and any credit against it -
// would live. Read it, hover every control, and record what the return/credit route actually is.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const SALE='2fa6c0dc-10a6-4334-8d63-fa4425239556';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(10000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
for (const tab of ['Finance','Statistics']) {
  const t=page.locator(`.q-tab:has-text("${tab}"), [role="tab"]:has-text("${tab}")`).first();
  if (!(await t.count())) { console.log('no tab', tab); continue; }
  const b4=calls.length; await t.click(); await page.waitForTimeout(7000);
  const info = await page.evaluate(L=>{ const lab=eval(L);
    const main=document.querySelector('.q-page')||document.body;
    return { text: lab(main).slice(0,700),
             buttons:[...new Set([...main.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<40))],
             heads:[...main.querySelectorAll('table thead')].map(t=>[...t.querySelectorAll('th')].map(lab)),
             rows:[...main.querySelectorAll('table tbody tr')].slice(0,5).map(tr=>[...tr.cells].map(lab)) };}, lab);
  console.log(`=== ${tab} ===`); console.log(JSON.stringify(info).slice(0,1800));
  console.log('calls:', JSON.stringify([...new Set(calls.slice(b4))].slice(0,8)));
  await page.screenshot({path:`${OUT}/paid-sale-${tab}.png`, fullPage:true});
}
await browser.close();
