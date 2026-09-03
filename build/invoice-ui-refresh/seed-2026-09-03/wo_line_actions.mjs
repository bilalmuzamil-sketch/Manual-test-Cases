// Last place a CUSTOMER-facing part return could live: a work order's part line. Navigate by clicking,
// not by guessing an API shape, and enumerate EVERY row's controls with their tooltips.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/work-orders', 'admin');
await page.waitForTimeout(12000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const first = await page.evaluate(()=>{ const trs=[...document.querySelectorAll('table tbody tr')].filter(t=>(t.textContent||'').trim().length>5);
  if(!trs.length) return null; trs[0].setAttribute('data-qa-open','1'); return (trs[0].textContent||'').replace(/\s+/g,' ').slice(0,120); });
console.log('opening work order:', first);
if (first) { await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(13000); }
console.log('url:', page.url());
const info = await page.evaluate(L=>{ const lab=eval(L);
  return { tabs:[...new Set([...document.querySelectorAll('.q-tab,[role="tab"]')].map(lab).filter(Boolean))],
    buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<30))],
    tableHeads:[...document.querySelectorAll('table thead')].map(t=>[...t.querySelectorAll('th')].map(lab)) };}, lab);
console.log('WO SCREEN:', JSON.stringify(info).slice(0,1200));
// enumerate every row's controls and hover them
const rows = await page.evaluate(L=>{ const lab=eval(L);
  return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    const ctl=[...tr.querySelectorAll('button,.q-btn')]; ctl.forEach((b,j)=>b.setAttribute('data-qa-ctl',`${i}:${j}`));
    return {i, n:ctl.length, cells:[...tr.cells].map(lab).slice(0,3)}; }).filter(r=>r.n>0); }, lab);
console.log('rows with controls:', rows.length);
for (const r of rows.slice(0,3)) {
  console.log(` row ${r.i} ${JSON.stringify(r.cells).slice(0,110)}`);
  for (let j=0;j<r.n;j++){ const el=page.locator(`[data-qa-ctl="${r.i}:${j}"]`).first();
    await el.hover().catch(()=>{}); await page.waitForTimeout(750);
    const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
    console.log(`    [${j}] "${await el.evaluate(e=>(e.textContent||'').trim()).catch(()=>'')}" ${JSON.stringify(tip)}`); } }
await page.screenshot({path:`${OUT}/work-order-lines.png`, fullPage:true});
await browser.close();
