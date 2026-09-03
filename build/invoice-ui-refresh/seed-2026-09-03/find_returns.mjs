// Before seeding a returned-part credit, look for one that already exists: the Part Sales list has a
// "Returns" column. A credit that is already there is cheaper than one that has to be created, and it
// is the same evidence.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/part-sales', 'admin');
await page.waitForTimeout(9000);
const gets=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&/part/i.test(u)) gets.push(u.replace(`https://${APIH}`,''));});
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
console.log('calls the list makes:'); [...new Set(gets)].forEach(g=>console.log('  ', g.slice(0,180)));
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const t = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table'); if(!tb) return null;
  const h=[...tb.querySelectorAll('thead th')].map(lab);
  const ri=h.findIndex(x=>/^Returns/.test(x));
  const rows=[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab)).filter(r=>r.length>3);
  return { h, returnsIdx:ri, withReturns: rows.filter(r=>ri>=0 && r[ri] && r[ri]!=='0' && r[ri]!=='-').slice(0,10), total:rows.length }; }, lab);
console.log('PART SALES:', JSON.stringify(t).slice(0,1800));
fs.writeFileSync(`${OUT}/part-sales-returns.json`, JSON.stringify({table:t, gets:[...new Set(gets)]},null,1));
await browser.close();
