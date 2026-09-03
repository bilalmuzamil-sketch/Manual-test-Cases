// Click the "Return" arrow on a Received part row and read the dialog it opens - specifically whether
// a RESTOCKING FEE can be entered there, which is what C44968 needs.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='90a95f29-f405-4763-834d-6e3a237f8c33', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(11000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const pick = await page.evaluate(()=>{ const trs=[...document.querySelectorAll('table tbody tr')];
  for (const tr of trs) { if (/Received/i.test(tr.textContent||'')) {
    const b=[...tr.querySelectorAll('button,.q-btn')].find(x=>/reply/.test(x.textContent||''));
    if (b) { b.setAttribute('data-qa-return','1'); return (tr.textContent||'').replace(/\s+/g,' ').slice(0,140); } } }
  return null; });
console.log('returning this row:', pick);
const before=calls.length;
await page.locator('[data-qa-return="1"]').first().click(); await page.waitForTimeout(6000);
console.log('calls fired by the click:', JSON.stringify([...new Set(calls.slice(before))]));
console.log('dialogs in the DOM:', await page.evaluate(()=>document.querySelectorAll('.q-dialog,[role="dialog"]').length));
console.log('url now:', page.url());
console.log('any menu?', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.textContent||'').trim()))));
console.log('page notifications:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>(e.textContent||'').trim()))));
await page.screenshot({path:'build/invoice-ui-refresh/seed-2026-09-03/after-return-click.png', fullPage:true});
const d = await page.evaluate(L=>{ const lab=eval(L);
  const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
  return { whole: lab(x).slice(0,600),
    inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
      let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const t=lab(p); if(t.length>=4&&t.length<=90){ctx=t;break;}}
      return {k, tag:i.tagName, value:i.value, ctx};}),
    buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
    selects:[...x.querySelectorAll('.q-select')].map(lab) }; }, lab);
console.log('RETURN DIALOG:'); console.log(JSON.stringify(d,null,1).slice(0,2200));
fs.writeFileSync(`${OUT}/return-dialog.json`, JSON.stringify(d,null,1));
await page.screenshot({path:`${OUT}/return-dialog.png`});
await browser.close();
