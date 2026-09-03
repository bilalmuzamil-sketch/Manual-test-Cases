// HYPOTHESIS TO TEST: the customer's Invoices tab lists invoices AND credits in ONE table
// (/api/customer-account/list-unpaid-transaction returns both). So a credit is APPLIED by ticking the
// credit row TOGETHER WITH an unpaid invoice row and then using New Payment — which is why the
// "Amount to credit" box read 0.00 when only the invoice was ticked.
// Read the table first, tick both, and dump the dialog before writing anything.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST = process.argv[2] || '4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(10000);
const rows = await page.evaluate(()=>[...document.querySelectorAll('table tbody tr')].map((tr,i)=>{
  tr.setAttribute('data-qa-row',String(i));
  return {i, cells:[...tr.cells].map(c=>(c.textContent||'').replace(/\s+/g,' ').trim())}; }).filter(r=>r.cells.length>3));
console.log('TABLE ROWS:'); rows.forEach(r=>console.log(' ', r.i, JSON.stringify(r.cells)));
const credit  = rows.find(r=>/^credit$/i.test(r.cells[2]||'') && /Unapplied/i.test(r.cells[7]||''));
const invoice = rows.find(r=>/^invoice$/i.test(r.cells[2]||'') && !/^\$0\.00$/.test((r.cells[6]||'').trim()));
if (!credit || !invoice) { console.log('need one Unapplied credit AND one invoice with a balance; have credit=',!!credit,'invoice=',!!invoice); await browser.close(); process.exit(2); }
log('ticking credit', credit.cells[3], 'and invoice', invoice.cells[3], 'balance', invoice.cells[6]);
for (const r of [credit, invoice]) {
  const cb = page.locator(`[data-qa-row="${r.i}"] .q-checkbox, [data-qa-row="${r.i}"] input[type="checkbox"]`).first();
  await cb.click({force:true}); await page.waitForTimeout(1500);
}
await page.screenshot({path:`${OUT}/apply5-ticked.png`});
await page.locator('button:has-text("New Payment")').first().click({timeout:25000}); await page.waitForTimeout(6000);
const dlg = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  const tb=x.querySelector('table');
  return { inputs:[...x.querySelectorAll('input')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
      let p=i.parentElement,ctx=''; for(let d=0;d<7&&p;d++,p=p.parentElement){const t=lab(p); if(t.length>=5&&t.length<=90){ctx=t;break;}}
      return {k, value:i.value, ctx, inRow:!!i.closest('tbody tr')};}),
    table: tb? {h:[...tb.querySelectorAll('thead th')].map(c=>lab(c)), r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(c=>lab(c)))} : null,
    tail: lab(x).slice(-220) }; });
console.log('DIALOG:', JSON.stringify(dlg,null,1).slice(0,2500));
fs.writeFileSync(`${OUT}/apply5-dialog.json`, JSON.stringify(dlg,null,1));
await page.screenshot({path:`${OUT}/apply5-dialog.png`});
await browser.close();
