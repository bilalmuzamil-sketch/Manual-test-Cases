// Applied / Partially applied, done properly on a customer that still HAS an unpaid invoice.
// Apollo Beach Truck & Equipment Repair — invoice S3-14144, balance $1,491.58.
// Step 1 issue a $400 store credit. Step 2 open New Payment and DUMP every input with the text around
// it, so the "Amount to credit" box is targeted by evidence rather than by a guessed selector.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const go = async () => { await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000); };

// 1) a $400 store credit
await go();
await page.locator('button:has-text("Issue Credit")').first().click(); await page.waitForTimeout(3000);
await page.locator('.q-dialog input[type="text"]').nth(1).fill('400');
await page.locator('.q-dialog .q-radio', { hasText: 'Issue Store Credit' }).first().click();
await page.waitForTimeout(1200);
const ta=page.locator('.q-dialog textarea').first(); if (await ta.count()) await ta.fill('ZZAUTOTEST credit to be APPLIED for C45181');
let before=calls.length;
await page.locator('.q-dialog button').last().click(); await page.waitForTimeout(6000);
log('issue credit fired:', JSON.stringify([...new Set(calls.slice(before))]));
const cx=page.locator('.q-dialog button:has-text("Cancel")').first(); if (await cx.count()) await cx.click().catch(()=>{});
await page.waitForTimeout(2000);

// 2) select the invoice row, open New Payment, and MAP the dialog
await go();
await page.evaluate(()=>{ const t=document.querySelector('table');
  for (const tr of t.querySelectorAll('tbody tr')) if (/S3-14144/.test(tr.textContent||'')) {
    const cb=tr.querySelector('input[type="checkbox"], .q-checkbox'); if (cb) cb.setAttribute('data-qa-pick','1'); } });
await page.locator('[data-qa-pick="1"]').first().click(); await page.waitForTimeout(2500);
await page.locator('button:has-text("New Payment")').first().click({timeout:25000});
await page.waitForTimeout(5000);
const map = await page.evaluate(() => {
  const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return [...x.querySelectorAll('input, textarea')].map((i,idx)=>{
    i.setAttribute('data-qa-in', String(idx));
    let ctx=''; let p=i.parentElement;
    for (let d=0; d<4 && p; d++, p=p.parentElement) { const t=lab(p); if (t.length>ctx.length && t.length<160) ctx=t; }
    return { idx, type:i.type||i.tagName, value:(i.value||'').slice(0,20), placeholder:i.placeholder||null, context:ctx };
  });
});
console.log('EVERY input in the New Payment dialog, with the text around it:');
console.log(JSON.stringify(map,null,1).slice(0,2600));
fs.writeFileSync(`${OUT}/newpayment-inputs.json`, JSON.stringify(map,null,1));
await page.screenshot({path:`${OUT}/newpayment-apollo.png`});
await browser.close();
