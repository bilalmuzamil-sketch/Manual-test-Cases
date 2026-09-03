// A part sale probably has to be invoiced before a part can be returned for credit. Read the status
// filter's own options, then open a sale in the furthest-along status and hover its controls.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/part-sales', 'admin');
await page.waitForTimeout(9000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
// the page-level menu carries "Set status" - read its submenu for the vocabulary
const kebabs = await page.locator('.q-btn:has-text("more_vert")').count();
console.log('more_vert buttons on the list screen:', kebabs);
// read the status filter chips / select
const filters = await page.evaluate(L=>{ const lab=eval(L);
  return [...new Set([...document.querySelectorAll('.q-chip,.q-select,.q-field')].map(lab).filter(x=>x&&x.length<80))]; }, lab);
console.log('filters on the list:', JSON.stringify(filters).slice(0,600));
// try each status in the URL and count rows
for (const st of ['estimate','approved','invoiced','completed','closed','paid','declined']) {
  await page.goto(`${APP}/parts/part-sales?status=${st}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
  const r = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table'); if(!tb) return null;
    const h=[...tb.querySelectorAll('thead th')].map(lab); const ri=h.findIndex(x=>/^Returns/.test(x));
    const rows=[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab)).filter(x=>x.length>3);
    return { n:rows.length, sample:rows.slice(0,3).map(x=>[x[0],x[1],x[2],x[8],x[ri]]) }; }, lab);
  console.log(`status=${st.padEnd(10)} rows=${r? r.n : 'n/a'} ${r? JSON.stringify(r.sample):''}`.slice(0,300));
}
await browser.close();
