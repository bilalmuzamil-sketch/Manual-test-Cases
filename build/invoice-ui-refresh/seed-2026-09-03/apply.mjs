// The last two states: APPLIED and PARTIALLY APPLIED.
// The Cash Out dialog's payment-method list included "Applied credit", which is how a store credit is
// consumed against an invoice - so this goes through "New Payment" on the customer's Invoices tab.
//   CM-4190 ($200) applied in FULL      -> Applied            (C45181 half 1)
//   CM-4189 ($500) applied in PART $300 -> Partially applied  (C45180, open balance $200)
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(8000);
// 🛑 "New Payment" is DISABLED until an invoice row is SELECTED. The button carries
// `disabled aria-disabled="true"` and a click just times out. That is why the QA lead's screenshot
// had a row checkbox ticked. Select the unpaid invoice's row first.
const picked = await page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  for (const tr of t.querySelectorAll('tbody tr')) {
    const txt = (tr.textContent || '');
    if (!/S3-13180/.test(txt)) continue;
    const cb = tr.querySelector('input[type="checkbox"], .q-checkbox');
    if (cb) { cb.setAttribute('data-qa-pick','1'); return txt.replace(/\s+/g,' ').trim().slice(0,80); }
  }
  return null;
});
log('selecting invoice row:', JSON.stringify(picked));
if (picked) { await page.locator('[data-qa-pick="1"]').first().click().catch(e=>log('  pick:',String(e).split('\n')[0]));
  await page.waitForTimeout(2500); }
const np = page.locator('button:has-text("New Payment")').first();
log('New Payment disabled now?', await np.isDisabled().catch(()=>'n/a'));
await np.click({ timeout: 25000 }).catch(e=>log('New Payment click:', String(e).split('\n')[0]));
await page.waitForTimeout(4000);
const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return { title: lab(x).slice(0,300),
           fields:[...new Set([...x.querySelectorAll('label,.q-field__label')].map(lab).filter(Boolean))],
           buttons:[...x.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean),
           inputs:[...x.querySelectorAll('input,textarea')].map(i=>({t:i.type||i.tagName, v:(i.value||'').slice(0,24)})),
           rows:[...x.querySelectorAll('table tbody tr')].map(lab).slice(0,8) }; });
console.log('NEW PAYMENT dialog:'); console.log(JSON.stringify(d,null,1).slice(0,1600));
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/newpayment-dialog.json', JSON.stringify(d,null,1));
await page.screenshot({path:'build/invoice-ui-refresh/seed-2026-09-03/newpayment.png'});
await browser.close();
