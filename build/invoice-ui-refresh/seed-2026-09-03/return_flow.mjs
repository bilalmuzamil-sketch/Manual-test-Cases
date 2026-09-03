// Walk the whole chain the QA lead described:
//   part sale -> a "Received" row's Return arrow -> "Add new part return request" (Return reason,
//   Quantity, Save & Close) -> Parts > Returns -> tick the row -> "Receive Credit"
// and find out what it produces, and where a RESTOCKING FEE can be entered (C44968 needs one).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='90a95f29-f405-4763-834d-6e3a237f8c33', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(11000);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const dump = async tag => { const d=await page.evaluate(L=>{ const lab=eval(L);
    const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
    return { whole: lab(x).slice(0,500),
      inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
        let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const t=lab(p); if(t.length>=4&&t.length<=90){ctx=t;break;}}
        return {k, value:i.value, ctx};}),
      buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
      table: (()=>{const tb=x.querySelector('table'); return tb? {h:[...tb.querySelectorAll('thead th')].map(lab),
        r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab))}:null;})() };}, lab);
  console.log(tag, JSON.stringify(d)); return d; };

// 1) fire the Return arrow on a Received row
await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/Received/i.test(tr.textContent||'')) { const b=[...tr.querySelectorAll('button,.q-btn')].find(x=>/reply/.test(x.textContent||''));
    if (b) { b.setAttribute('data-qa-return','1'); return; } } });
await page.locator('[data-qa-return="1"]').first().click(); await page.waitForTimeout(5000);
const d1 = await dump('RETURN REQUEST DIALOG:');
const reason = d1.inputs.find(i=>/reason/i.test(i.ctx)), qty = d1.inputs.find(i=>/quantity/i.test(i.ctx));
if (reason) { const e=page.locator(`[data-qa-in="${reason.k}"]`); await e.click(); await e.fill('ZZAUTOTEST return for C44967 and C44968'); }
if (qty) { const e=page.locator(`[data-qa-in="${qty.k}"]`); await e.click(); await e.fill('1'); }
await page.waitForTimeout(1200);
let b4=calls.length;
await page.locator('.q-dialog button:has-text("Save & Close")').first().click(); await page.waitForTimeout(7000);
log('save fired:', JSON.stringify([...new Set(calls.slice(b4))]));

// 2) Parts > Returns - both tabs
await page.goto(`${APP}/parts/returns`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const scr = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table');
  return { tabs:[...document.querySelectorAll('.q-tab,[role="tab"]')].map(lab).filter(Boolean),
    buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<30))],
    head: tb? [...tb.querySelectorAll('thead th')].map(lab):null,
    rows: tb? [...tb.querySelectorAll('tbody tr')].map((tr,i)=>{tr.setAttribute('data-qa-row',String(i));
      return [...tr.cells].map(lab);}):null }; }, lab);
console.log('RETURNS SCREEN:', JSON.stringify(scr).slice(0,1600));

// 3) tick our row and read what appears
const idx = await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/P8218-162/.test(tr.textContent||'') && /Returned/i.test(tr.textContent||'')) return tr.getAttribute('data-qa-row');
  return null; });
log('our returned row index:', idx);
if (idx!==null) {
  await page.locator(`[data-qa-row="${idx}"] .q-checkbox, [data-qa-row="${idx}"] input[type=checkbox]`).first().click({force:true});
  await page.waitForTimeout(3000);
  const after = await page.evaluate(L=>{ const lab=eval(L);
    return [...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<30))]; }, lab);
  console.log('buttons after ticking:', JSON.stringify(after));
  const rc = page.locator('button:has-text("Receive Credit"), .q-btn:has-text("Receive Credit")').first();
  if (await rc.count()) { b4=calls.length; await rc.click(); await page.waitForTimeout(6000);
    await dump('RECEIVE CREDIT DIALOG:');
    console.log('calls:', JSON.stringify([...new Set(calls.slice(b4))])); }
}
await page.screenshot({path:`${OUT}/receive-credit.png`, fullPage:true});
await browser.close();
