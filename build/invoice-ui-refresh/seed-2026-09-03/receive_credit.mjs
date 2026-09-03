// Tick the returned row, click "Receive Credit" for real, and follow what it produces - the Credits
// tab on this screen, and the customer's own Invoices tab (Bloomingdale Diesel Repair owns P8218-162).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/parts/returns', 'admin');
await page.waitForTimeout(10000);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.evaluate(()=>{ [...document.querySelectorAll('table tbody tr')].forEach((tr,i)=>tr.setAttribute('data-qa-row',String(i))); });
const idx = await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/ZZAUTOTEST return fo/.test(tr.textContent||'')) return tr.getAttribute('data-qa-row'); return null; });
log('our row:', idx);
await page.locator(`[data-qa-row="${idx}"] .q-checkbox`).first().click({force:true}); await page.waitForTimeout(2500);
const btn = page.locator('.q-btn:has-text("Receive Credit")').first();
log('Receive Credit visible?', await btn.count(), 'enabled?', !(await btn.isDisabled().catch(()=>true)));
const b4=calls.length;
await btn.click({force:true}); await page.waitForTimeout(7000);
log('url:', page.url());
log('calls:', JSON.stringify([...new Set(calls.slice(b4))]));
const d = await page.evaluate(L=>{ const lab=eval(L);
  const xs=[...document.querySelectorAll('.q-dialog,[role="dialog"]')];
  const x=xs[xs.length-1]; if(!x) return {dialogs:xs.length, note:[...document.querySelectorAll('.q-notification')].map(lab)};
  return { dialogs:xs.length, whole: lab(x).slice(0,700),
    inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
      let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const t=lab(p); if(t.length>=4&&t.length<=90){ctx=t;break;}}
      return {k, value:i.value, ctx};}),
    buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
    table: (()=>{const tb=x.querySelector('table'); return tb? {h:[...tb.querySelectorAll('thead th')].map(lab),
      r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(lab))}:null;})() };}, lab);
console.log('AFTER Receive Credit:', JSON.stringify(d,null,1).slice(0,2200));
await page.screenshot({path:`${OUT}/receive-credit-2.png`, fullPage:true});
fs.writeFileSync(`${OUT}/receive-credit.json`, JSON.stringify(d,null,1));
await browser.close();
