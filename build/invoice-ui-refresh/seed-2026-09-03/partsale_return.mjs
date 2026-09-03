// Open an approved part sale and look for the RETURN control; also look at the Parts > Returns screen.
// Read-only pass: hover everything, click only to open, write nothing.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/part-sales?status=approved', 'admin');
await page.waitForTimeout(9000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const gets=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)) gets.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const opened = await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/P8218-162/.test(tr.textContent||'')) { tr.setAttribute('data-qa-open','1'); return true; } return false; });
console.log('found the part sale row:', opened);
if (opened) { await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(9000); }
console.log('url:', page.url());
const info = await page.evaluate(L=>{ const lab=eval(L);
  return { buttons:[...new Set([...document.querySelectorAll('button, .q-btn')].map(lab).filter(x=>x&&x.length<40))],
           headings:[...document.querySelectorAll('h1,h2,h3,.text-h6,.q-toolbar__title')].map(lab).filter(Boolean).slice(0,10),
           tableHeads:[...document.querySelectorAll('table thead')].map(t=>[...t.querySelectorAll('th')].map(lab)) }; }, lab);
console.log('PART SALE PAGE:', JSON.stringify(info).slice(0,1600));
await page.screenshot({path:`${OUT}/part-sale-162.png`, fullPage:true});
// and the Returns screen
await page.goto(`${APP}/parts/returns`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
const ret = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table');
  return { url:location.href, buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<30))],
           head: tb? [...tb.querySelectorAll('thead th')].map(lab):null,
           rows: tb? [...tb.querySelectorAll('tbody tr')].slice(0,4).map(tr=>[...tr.cells].map(lab)):null }; }, lab);
console.log('RETURNS SCREEN:', JSON.stringify(ret).slice(0,1400));
await page.screenshot({path:`${OUT}/parts-returns.png`, fullPage:true});
fs.writeFileSync(`${OUT}/part-return-explore.json`, JSON.stringify({partSale:info, returns:ret, gets:[...new Set(gets)].slice(-25)},null,1));
await browser.close();
