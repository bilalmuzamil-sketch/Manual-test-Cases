// A paid part sale is the furthest-along state; if a customer part return exists anywhere it is here.
// Hover every control on the page and on a line row, and read both kebab menus.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/part-sales?status=invoiced', 'admin');
await page.waitForTimeout(9000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.evaluate(()=>{ const tr=[...document.querySelectorAll('table tbody tr')].find(t=>/P2-97/.test(t.textContent||''));
  if (tr) tr.setAttribute('data-qa-open','1'); });
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(10000);
console.log('url:', page.url());
const info = await page.evaluate(L=>{ const lab=eval(L);
  return { buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<40))],
           tabs:[...new Set([...document.querySelectorAll('.q-tab,[role="tab"]')].map(lab).filter(Boolean))],
           heads:[...document.querySelectorAll('table thead')].map(t=>[...t.querySelectorAll('th')].map(lab)) };}, lab);
console.log('PAID SALE:', JSON.stringify(info).slice(0,1500));
const n = await page.evaluate(()=>{ const tr=document.querySelector('table tbody tr'); if(!tr) return 0;
  let c=0; [...tr.querySelectorAll('button,.q-btn')].forEach((b,i)=>{b.setAttribute('data-qa-act',String(i));c++;}); return c;});
console.log('controls on first line row:', n);
for (let i=0;i<n;i++){ const el=page.locator(`[data-qa-act="${i}"]`).first(); await el.hover().catch(()=>{}); await page.waitForTimeout(800);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  console.log(`  [${i}] "${await el.evaluate(e=>(e.textContent||'').trim())}" ${JSON.stringify(tip)}`); }
for (const sel of ['table tbody tr .q-btn:has-text("more_vert")', '.q-page .q-btn:has-text("more_vert")']) {
  const k=page.locator(sel).first();
  if (await k.count()) { await k.click(); await page.waitForTimeout(2500);
    console.log('menu', sel.slice(0,20), JSON.stringify(await page.evaluate(L=>{const lab=eval(L);
      return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean);}, lab)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(800); } }
await page.screenshot({path:`${OUT}/paid-part-sale.png`, fullPage:true});
await browser.close();
