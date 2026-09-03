// Apply $600 of available store credit to invoice S3-13180 ($1,062.26).
// If credits are consumed oldest-first this yields BOTH remaining states in one action:
//   CM-4189 ($500) fully consumed -> Applied            (C45181 half 1)
//   CM-4190 ($200) takes $100     -> Partially applied  (C45180)
// The resulting states are READ afterwards, never assumed - the consumption order is the product's.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const creditStates = () => page.evaluate(async u => {
  const c = await (await fetch(u.v,{credentials:'include',headers:{Accept:'application/json'}})).json();
  const acc = JSON.stringify(c).match(/"customer_account_id":"([^"]+)"/)?.[1];
  const t = await (await fetch(u.t+acc,{credentials:'include',headers:{Accept:'application/json'}})).json();
  return (t?.data?.response?.collection||[]).map(r=>({id:r.id,type:r.type,amount:r.amount,balance:r.balance,status:r.status_label||r.status,num:r.formatted_invoice_number}));
}, { v:`https://${APIH}/api/customers/view/${CUST}`, t:`https://${APIH}/api/customer-account/list-unpaid-transaction?account_id=` });

const out={ at:new Date().toISOString(), before: await creditStates() };
log('before:', JSON.stringify(out.before));

await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
await page.evaluate(() => { const t=document.querySelector('table');
  for (const tr of t.querySelectorAll('tbody tr')) if (/S3-13180/.test(tr.textContent||'')) {
    const cb=tr.querySelector('input[type="checkbox"], .q-checkbox'); if (cb) cb.setAttribute('data-qa-pick','1'); } });
await page.locator('[data-qa-pick="1"]').first().click();
await page.waitForTimeout(2500);
await page.locator('button:has-text("New Payment")').first().click({timeout:25000});
await page.waitForTimeout(4500);

// Payment method first (required, as on Cash Out)
const pm = page.locator('.q-dialog .q-field').filter({ hasText: 'Payment method' }).first();
if (await pm.count()) { await pm.click(); await page.waitForTimeout(1800);
  const opts=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.textContent||'').trim()).filter(Boolean));
  log('methods:', JSON.stringify(opts));
  const idx = opts.findIndex(o=>/applied credit/i.test(o));
  await page.locator('.q-menu .q-item').nth(idx>=0?idx:0).click();
  log('chose:', JSON.stringify(idx>=0?opts[idx]:opts[0]));
  await page.waitForTimeout(1800); }

// "Amount to credit" - find the field by its own label, then its input
const ac = await page.evaluate(() => {
  const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const fields=[...x.querySelectorAll('.q-field')];
  for (const f of fields) if (/Amount to credit/i.test(f.textContent||'')) {
    const i=f.querySelector('input'); if (i) { i.setAttribute('data-qa-ac','1'); return true; } }
  // fall back: the dialog text carries "Amount to credit:" next to a bare input
  const inputs=[...x.querySelectorAll('input[type="text"]')];
  for (const i of inputs) { const p=i.closest('div'); if (p && /Amount to credit/i.test(p.textContent||'')) { i.setAttribute('data-qa-ac','1'); return true; } }
  return false; });
log('found the "Amount to credit" input?', ac);
if (ac) { await page.locator('[data-qa-ac="1"]').fill('600'); await page.waitForTimeout(2500); }

const dlg = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return lab(x).slice(0,320); });
log('dialog now:', JSON.stringify(dlg));
const mk = page.locator('.q-dialog button', { hasText: 'Make payment' }).last();
log('Make payment disabled?', await mk.isDisabled().catch(()=>'n/a'));
const before=calls.length;
await mk.click({timeout:25000}).catch(e=>log('click:',String(e).split('\n')[0]));
await page.waitForTimeout(9000);
out.fired=[...new Set(calls.slice(before))];
log('fired:', JSON.stringify(out.fired));
out.after = await creditStates();
log('after :', JSON.stringify(out.after));
fs.writeFileSync(`${OUT}/apply-state.json`, JSON.stringify(out,null,1));
await page.screenshot({path:`${OUT}/after-apply.png`});
await browser.close();
