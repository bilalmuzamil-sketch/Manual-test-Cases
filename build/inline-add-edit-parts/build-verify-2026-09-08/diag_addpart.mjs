import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders")').first().click().catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('.q-tab:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{}); await page.waitForTimeout(7000);
await page.evaluate(L=>{const lab=eval(L); const tb=document.querySelector('table'); const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c)); const li=head.findIndex(h=>/^Lines/.test(h));
  for(const tr of tb.querySelectorAll('tbody tr')){const c=[...tr.cells].map(lab); if(c.join('').trim().length<3)continue; if(parseInt(c[li])>0){tr.setAttribute('data-qa-open','1');break;}}}, lab);
await page.locator('[data-qa-open="1"] td').nth(1).click(); await page.waitForTimeout(11000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
// dump inputs BEFORE
const inputsBefore = await page.evaluate(()=>[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>i.placeholder||i.type).length);
log('visible inputs before Add Part:', inputsBefore);
// click ONLY the first Add Part
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b)b.setAttribute('data-qa-add1','1');}, lab);
await page.locator('[data-qa-add1="1"]').click(); 
for (const w of [2000,3000,4000]) { await page.waitForTimeout(w);
  const st = await page.evaluate(()=>({ inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>i.placeholder||i.type),
    dialog:!!document.querySelector('.q-dialog'), dialogTitle:document.querySelector('.q-dialog')?(document.querySelector('.q-dialog').textContent||'').replace(/\s+/g,' ').slice(0,80):null }));
  console.log('after Add Part (+'+w+'ms):', JSON.stringify(st).slice(0,400)); }
await page.screenshot({path:`${OUT}/diag-addpart.png`, fullPage:true});
await browser.close();
