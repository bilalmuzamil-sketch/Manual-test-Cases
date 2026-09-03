// The part sale's line rows carry an Actions column with a "reply"-looking icon. Hover every control
// on a line to read its hover-only tooltip - that is how the credit-print route was found, and it is
// the only honest way to learn what a control does.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const SALE='90a95f29-f405-4763-834d-6e3a237f8c33';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(10000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const n = await page.evaluate(()=>{ const tr=document.querySelector('table tbody tr'); if(!tr) return 0;
  let c=0; [...tr.querySelectorAll('button, .q-btn')].forEach((b,i)=>{b.setAttribute('data-qa-act',String(i));c++;}); return c;});
console.log('controls on the first line row:', n);
for (let i=0;i<n;i++){ const el=page.locator(`[data-qa-act="${i}"]`).first();
  await el.hover().catch(()=>{}); await page.waitForTimeout(900);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  const txt=await el.evaluate(e=>(e.textContent||'').trim());
  console.log(`  [${i}] text="${txt}" tooltip=${JSON.stringify(tip)}`); }
// the kebab menu at the row head often holds the rest
const kebab = page.locator('table tbody tr .q-btn:has-text("more_vert")').first();
if (await kebab.count()) { await kebab.click(); await page.waitForTimeout(2500);
  const items = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean); }, lab);
  console.log('row kebab menu:', JSON.stringify(items)); await page.keyboard.press('Escape'); }
const top = page.locator('.q-page .q-btn:has-text("more_vert"), header .q-btn:has-text("more_vert")').first();
if (await top.count()) { await top.click(); await page.waitForTimeout(2500);
  const items = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean); }, lab);
  console.log('page-level menu:', JSON.stringify(items)); }
await page.screenshot({path:`${OUT}/part-sale-actions.png`, fullPage:true});
await browser.close();
