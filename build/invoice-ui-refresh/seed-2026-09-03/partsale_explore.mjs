// C44967 line 2 and C44968 line 1 need a credit raised from a RETURNED PART carrying a restocking fee
// (a negative quantity and rate on the printed note). The customer record carries a
// `part_sale_credit_count`, so that flow exists. UI-FIRST: walk Parts -> Part Sales and read what is
// actually offered, hovering every row action to read its hover-only tooltip. Nothing is written yet.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts', 'admin');
await page.waitForTimeout(9000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
console.log('url now:', page.url());
const nav = await page.evaluate(L=>{ const lab=eval(L);
  return [...document.querySelectorAll('.q-tab,[role="tab"],nav a,.q-item')].map(lab).filter(t=>t&&t.length<40); }, lab);
console.log('nav/tabs:', JSON.stringify([...new Set(nav)]).slice(0,700));
const ps = page.locator('.q-tab:has-text("Part Sales"), [role="tab"]:has-text("Part Sales"), a:has-text("Part Sales")').first();
if (await ps.count()) { await ps.click(); await page.waitForTimeout(7000); }
console.log('url after Part Sales:', page.url());
const t = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table'); if(!tb) return null;
  return { h:[...tb.querySelectorAll('thead th')].map(lab),
           r:[...tb.querySelectorAll('tbody tr')].slice(0,6).map((tr,i)=>{tr.setAttribute('data-qa-row',String(i));return [...tr.cells].map(lab);}) }; }, lab);
console.log('PART SALES TABLE:', JSON.stringify(t).slice(0,1500));
const btns = await page.evaluate(L=>{ const lab=eval(L);
  return [...document.querySelectorAll('button, .q-btn')].map(lab).filter(x=>x&&x.length<30); }, lab);
console.log('buttons on this screen:', JSON.stringify([...new Set(btns)]).slice(0,600));
await page.screenshot({path:`${OUT}/part-sales.png`, fullPage:true});
fs.writeFileSync(`${OUT}/part-sales.json`, JSON.stringify({url:page.url(), nav:[...new Set(nav)], table:t, buttons:[...new Set(btns)]},null,1));
await browser.close();
