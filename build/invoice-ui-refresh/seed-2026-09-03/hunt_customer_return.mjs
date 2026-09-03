// Two remaining places a CUSTOMER-facing part return could live:
//   (1) the kebab menu on a paid part sale's part row
//   (2) a work order's part line (the epic is about work orders and their invoices)
// Enumerate EVERY row - the first tbody row is a spacer and enumerating only it is what hid the
// Return arrow from the last pass.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/part-sale/2fa6c0dc-10a6-4334-8d63-fa4425239556/part-requests', 'admin');
await page.waitForTimeout(12000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
// (1) the kebab on a paid sale's row
await page.evaluate(()=>{ const trs=[...document.querySelectorAll('table tbody tr')].filter(t=>(t.textContent||'').trim().length>5);
  const b=[...trs[0].querySelectorAll('button,.q-btn')].pop(); if(b) b.setAttribute('data-qa-kebab','1'); });
if (await page.locator('[data-qa-kebab="1"]').count()) {
  try { await page.locator('[data-qa-kebab="1"]').first().hover({timeout:5000}); } catch {}
  try { await page.locator('[data-qa-kebab="1"]').first().click({force:true, timeout:15000}); } catch(e) { console.log('kebab click failed:', e.message.split('\n')[0]); }
  await page.waitForTimeout(2500);
  console.log('PAID part-sale row menu:', JSON.stringify(await page.evaluate(L=>{const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean);}, lab)));
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
// (2) a work order with parts
const wo = await page.evaluate(async h => { const r=await fetch(`https://${h}/api/work-orders?pagination[rowsPerPage]=25&pagination[page]=1`,{credentials:'include'});
  const j=await r.json().catch(()=>null); const c=j?.data?.collection||j?.data||[];
  return Array.isArray(c)? c.slice(0,6).map(x=>({id:x.id, num:x.number||x.wo_number, status:x.status?.name||x.status})) : {shape:Object.keys(j||{})}; }, APIH);
console.log('work orders:', JSON.stringify(wo).slice(0,600));
if (Array.isArray(wo) && wo[0]) {
  await page.goto(`${APP}/work-orders/${wo[0].id}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
  console.log('WO url:', page.url());
  const info = await page.evaluate(L=>{ const lab=eval(L);
    return { tabs:[...new Set([...document.querySelectorAll('.q-tab,[role="tab"]')].map(lab).filter(Boolean))],
             buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<30))] }; }, lab);
  console.log('WO screen:', JSON.stringify(info).slice(0,900));
  await page.screenshot({path:`${OUT}/work-order.png`, fullPage:true});
}
await browser.close();
