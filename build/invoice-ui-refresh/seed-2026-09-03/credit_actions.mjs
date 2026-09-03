// UI-FIRST: hover every icon in the credit row's Action column to read its hover-only Quasar tooltip,
// then open the one that is not print/delete and map the dialog. This is how a credit gets APPLIED.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/CM8218-4193/.test(tr.textContent||'')) { const c=tr.cells[tr.cells.length-1];
    [...c.querySelectorAll('button, .q-btn, i')].forEach((b,i)=>b.setAttribute('data-qa-act',String(i))); } });
const n = await page.locator('[data-qa-act]').count();
console.log('action controls in the credit row:', n);
for (let i=0;i<n;i++){
  const el = page.locator(`[data-qa-act="${i}"]`).first();
  await el.hover().catch(()=>{}); await page.waitForTimeout(1200);
  const tip = await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  const txt = await el.evaluate(e=>(e.textContent||'').trim());
  console.log(`  [${i}] text="${txt}" tooltip=${JSON.stringify(tip)}`);
}
// open the "payments" one (the applier) and map its dialog
const idx = await page.evaluate(()=>{ const es=[...document.querySelectorAll('[data-qa-act]')];
  const m=es.find(e=>/payment/i.test(e.textContent||'')); return m? m.getAttribute('data-qa-act'):null; });
if (idx!==null){ const b4=calls.length;
  await page.locator(`[data-qa-act="${idx}"]`).first().click(); await page.waitForTimeout(6000);
  console.log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
  const dlg = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
    const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
    const tb=x.querySelector('table');
    return { title: lab(x).slice(0,300),
      buttons:[...x.querySelectorAll('button')].map(b=>lab(b)).filter(Boolean),
      inputs:[...x.querySelectorAll('input')].map((i,k)=>{i.setAttribute('data-qa-in',String(k));
        let p=i.parentElement,ctx=''; for(let d=0;d<7&&p;d++,p=p.parentElement){const t=lab(p); if(t.length>=5&&t.length<=90){ctx=t;break;}}
        return {k, value:i.value, ctx};}),
      table: tb? {h:[...tb.querySelectorAll('thead th')].map(c=>lab(c)), r:[...tb.querySelectorAll('tbody tr')].slice(0,8).map(tr=>[...tr.cells].map(c=>lab(c)))} : null }; });
  console.log('DIALOG:', JSON.stringify(dlg,null,1).slice(0,3000));
  fs.writeFileSync(`${OUT}/credit-payments-dialog.json`, JSON.stringify(dlg,null,1));
  await page.screenshot({path:`${OUT}/credit-payments-dialog.png`});
}
await browser.close();
