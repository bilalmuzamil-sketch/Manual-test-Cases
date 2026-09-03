// Apply a credit through the New Payment dialog and record exactly which control did it.
// Evidence from apply3: input idx7 (value "0.00") sits beside the "$ Amount to credit:" label;
// idx6 is the invoice row's own Payment box. Confirm that by reading the WIDER text around each,
// then apply, then read the credit back from the API to see its state change.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const AMOUNT = process.env.CREDIT_AMOUNT || '400';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});

const creds = async () => {
  const j = await page.evaluate(async (h)=>{ const r=await fetch(`https://${h}/api/credit-memos?pagination[page]=1&pagination[rowsPerPage]=50&customer_id=${'4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4'}`,{credentials:'include'}); return r.ok? await r.json():{err:r.status}; }, APIH);
  const rows = j?.response?.collection || j?.collection || [];
  return rows.map(c=>({n:c.number||c.credit_memo_number, total:c.total??c.amount, applied:c.applied_amount, remaining:c.remaining_amount, status:c.status?.name||c.status}));
};
log('credits BEFORE:', JSON.stringify(await creds()));

await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.evaluate(()=>{ for (const tr of document.querySelectorAll('table tbody tr'))
  if (/S3-14144/.test(tr.textContent||'')) { const cb=tr.querySelector('input[type="checkbox"], .q-checkbox'); if (cb) cb.setAttribute('data-qa-pick','1'); } });
await page.locator('[data-qa-pick="1"]').first().click(); await page.waitForTimeout(2500);
await page.locator('button:has-text("New Payment")').first().click({timeout:25000});
await page.waitForTimeout(5000);

// WIDER context so the label owning each box is unambiguous
const wide = await page.evaluate(() => {
  const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return [...x.querySelectorAll('input')].map((i,idx)=>{ i.setAttribute('data-qa-in',String(idx));
    let p=i.parentElement, ctx='';
    for (let d=0; d<7 && p; d++, p=p.parentElement) { const t=lab(p); if (t.length>=6 && t.length<=90) { ctx=t; break; } }
    return {idx, value:i.value, ctx, inRow: !!i.closest('tbody tr')};
  });
});
console.log('inputs (wide context):'); console.log(JSON.stringify(wide));

const target = wide.find(w => /amount to credit/i.test(w.ctx)) || wide.filter(w=>!w.inRow && w.value==='0.00').pop();
if (!target) { console.log('NO "Amount to credit" box found — stopping without a write.'); await browser.close(); process.exit(1); }
log(`"Amount to credit" = input idx ${target.idx} (ctx: ${target.ctx})`);

const box = page.locator(`[data-qa-in="${target.idx}"]`);
await box.click(); await box.fill(''); await box.type(AMOUNT, {delay:60});
await box.press('Tab'); await page.waitForTimeout(2500);
await page.screenshot({path:`${OUT}/apply4-filled.png`});
const after = await page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-qa-in]')].map(i=>i.value));
log('input values after typing:', JSON.stringify(after));

const btn = page.locator('.q-dialog button:has-text("Make payment")').first();
let disabled = await btn.isDisabled().catch(()=>true);
if (disabled) {
  log('Make payment still disabled — selecting a payment method');
  await page.locator('[data-qa-in="1"]').click(); await page.waitForTimeout(1500);
  const opt = page.locator('.q-menu .q-item', {hasText:'Applied credit'}).first();
  if (await opt.count()) await opt.click(); else await page.locator('.q-menu .q-item').first().click();
  await page.waitForTimeout(1500);
  disabled = await btn.isDisabled().catch(()=>true);
}
log('Make payment disabled?', disabled);
const b4=calls.length;
if (!disabled) { await btn.click(); await page.waitForTimeout(8000); }
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
await page.screenshot({path:`${OUT}/apply4-after.png`});
await page.waitForTimeout(2000);
log('credits AFTER:', JSON.stringify(await creds()));
fs.writeFileSync(`${OUT}/apply4-state.json`, JSON.stringify({wide, target, calls},null,1));
await browser.close();
