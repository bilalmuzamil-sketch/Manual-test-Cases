// Complete the Cash Out on CM-4192 -> Refunded (C45182). The dialog is
//   "Cash Out Credit"  Date | $Amount (pre-filled) | Payment method | Reason | Cancel / Cash Out
// and the previous attempt's click timed out because "Payment method" is REQUIRED - the Cash Out
// button stays disabled until one is chosen. Pick it from the dropdown's own options, never typed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
const n = await page.evaluate(() => { const t=document.querySelector('table'); if(!t) return 0;
  for (const tr of t.querySelectorAll('tbody tr')) {
    if (!(tr.textContent||'').includes('4192')) continue;
    const c=[...tr.cells[tr.cells.length-1].querySelectorAll('button,[role="button"],.q-btn')];
    c.forEach((e,i)=>e.setAttribute('data-qa-r',String(i))); return c.length; }
  return 0; });
log('controls on the CM-4192 row:', n);
let target=null;
for (let i=0;i<n;i++){
  await page.locator(`[data-qa-r="${i}"]`).first().hover().catch(()=>{}); await page.waitForTimeout(800);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role="tooltip"]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
  if (tip.some(t=>/cash out/i.test(t))) { target=i; break; }
}
if (target===null) { log('no Cash Out control'); await browser.close(); process.exit(2); }
await page.locator(`[data-qa-r="${target}"]`).first().click();
await page.waitForTimeout(3500);

// Payment method: open the dropdown and take a real option
const pm = page.locator('.q-dialog .q-field').filter({ hasText: 'Payment method' }).first();
if (await pm.count()) {
  await pm.click(); await page.waitForTimeout(2000);
  const opts = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>{
    const c=e.cloneNode(true); c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();}).filter(Boolean));
  log('payment methods offered:', JSON.stringify(opts));
  if (opts.length) { await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1500);
    log('chose:', JSON.stringify(opts[0])); }
}
const ta = page.locator('.q-dialog textarea').first();
if (await ta.count()) await ta.fill('ZZAUTOTEST cash out to make CM-4192 Refunded for C45182');
await page.waitForTimeout(1000);
const btn = page.locator('.q-dialog button', { hasText: 'Cash Out' }).last();
log('Cash Out button disabled?', await btn.isDisabled().catch(()=>'n/a'));
const before=calls.length;
await btn.click({ timeout: 25000 }).catch(e=>log('click:',String(e).split('\n')[0]));
await page.waitForTimeout(8000);
log('fired:', JSON.stringify([...new Set(calls.slice(before))]));
const err = await page.evaluate(()=>[...document.querySelectorAll('.q-field--error, .text-negative, [role="alert"]')].map(e=>(e.textContent||'').trim()).filter(Boolean).slice(0,4));
if (err.length) log('validation shown:', JSON.stringify(err));
await page.screenshot({path:'build/invoice-ui-refresh/seed-2026-09-03/cashout.png'});
await browser.close();
