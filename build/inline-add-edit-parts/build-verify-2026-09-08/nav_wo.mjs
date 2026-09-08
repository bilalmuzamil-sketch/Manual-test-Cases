import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv9315', '/', 'admin');
await page.waitForTimeout(8000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&/work-order/i.test(u)) calls.push(`${r.status()} ${u.replace(`https://${APIH}`,'').slice(0,90)}`);});
// click the top-nav "Work Orders"
await page.locator('a:has-text("Work Orders"), button:has-text("Work Orders"), .q-item:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(10000);
console.log('url after nav click:', page.url());
const s=await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table');
  return { rows: tb? tb.querySelectorAll('tbody tr').length:0,
    head: tb? [...tb.querySelectorAll('thead th')].map(lab):null,
    first: tb? [...(tb.querySelector('tbody tr')?.cells||[])].map(lab):null,
    filters:[...new Set([...document.querySelectorAll('.q-tab,[role=tab],.q-chip,.q-toggle')].map(lab).filter(x=>x&&x.length<30))].slice(0,12) };}, lab);
console.log(JSON.stringify(s,null,1).slice(0,1400));
console.log('WO calls:', JSON.stringify([...new Set(calls)].slice(0,6)));
// grab a WO number+link from the first data row
const wo = await page.evaluate(()=>{ const tr=document.querySelector('table tbody tr'); if(!tr) return null;
  const a=tr.querySelector('a[href]'); return { text:(tr.textContent||'').replace(/\s+/g,' ').slice(0,80), href:a?a.getAttribute('href'):null }; });
console.log('first WO:', JSON.stringify(wo));
fs.writeFileSync('build/inline-add-edit-parts/build-verify-2026-09-08/wo-nav.json', JSON.stringify({url:page.url(),s,wo},null,1));
await page.screenshot({path:'build/inline-add-edit-parts/build-verify-2026-09-08/wo-nav.png', fullPage:true});
await browser.close();
