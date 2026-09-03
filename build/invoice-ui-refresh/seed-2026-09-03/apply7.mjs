// PARTIALLY APPLIED, on an account with NO deposit on it (a deposit is listed automatically by the
// New Payment dialog and gets consumed before the credit does - that is what spoiled the last try).
// Issue a credit of CREDIT, then pay only PAY of the invoice and let the credit cover it, leaving the
// rest of the credit open. "Amount to credit" is left alone this time: setting it created a deposit.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST = process.env.CUST || '2e2be22e-3a37-4f0a-a3e2-1e3ab5d4ba4f';
const ACC  = process.env.ACC  || 'bfb84b61-6f75-49ea-a04c-27332fa4aaa0';
const CREDIT = process.env.CREDIT || '900';
const PAY    = process.env.PAY    || '300';
const MEMO   = process.env.MEMO   || 'ZZAUTOTEST credit for the PARTIALLY APPLIED state (C45180)';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const state = async () => page.evaluate(async ([h,acc]) => {
  const r=await fetch(`https://${h}/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=200&openOnly=false`,{credentials:'include'});
  const j=await r.json();
  return (j?.data?.response?.collection||[]).map(x=>`${x.invoice_number}|${x.type}|amt ${x.amount}|bal ${x.balance}|${x.status_label}`); }, [APIH, ACC]);
log('BEFORE:', JSON.stringify(await state()));
const go = async () => { await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000); };
await go();
let b4 = 0;
if (!process.env.SKIP_ISSUE) {
await page.locator('button:has-text("Issue Credit")').first().click(); await page.waitForTimeout(3000);
await page.locator('.q-dialog input[type="text"]').nth(1).fill(CREDIT);
await page.locator('.q-dialog .q-radio', { hasText:'Issue Store Credit' }).first().click(); await page.waitForTimeout(1200);
const ta=page.locator('.q-dialog textarea').first(); if (await ta.count()) await ta.fill(MEMO);
b4=calls.length; await page.locator('.q-dialog button').last().click(); await page.waitForTimeout(6000);
log('issue credit:', JSON.stringify([...new Set(calls.slice(b4))]));
const cx=page.locator('.q-dialog button:has-text("Cancel")').first(); if (await cx.count()) await cx.click().catch(()=>{});
await page.waitForTimeout(2000);
}
await go();
const rows = await page.evaluate((L)=>{ const lab=eval(L);
  return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    return {i, cells:[...tr.cells].map(c=>lab(c))}; }).filter(r=>r.cells.length>3); }, lab);
rows.forEach(r=>console.log('  row', r.i, JSON.stringify(r.cells)));
const credit  = rows.find(r=>/credit/i.test(r.cells[2]) && /Unapplied/i.test(r.cells[7]));
const invoice = rows.find(r=>/invoice/i.test(r.cells[2]) && /Unpaid|Partially paid/i.test(r.cells[7]));
if (!credit||!invoice) { log('missing a row'); await browser.close(); process.exit(2); }
for (const r of [credit, invoice]) { await page.locator(`[data-qa-row="${r.i}"] .q-checkbox`).first().click({force:true}); await page.waitForTimeout(1500); }
await page.locator('button:has-text("New Payment")').first().click({timeout:25000}); await page.waitForTimeout(6000);
const dump = async tag => { const d=await page.evaluate((L)=>{ const lab=eval(L);
    const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
    return { inputs:[...x.querySelectorAll('input')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
        let p=i.parentElement,ctx=''; for(let d=0;d<7&&p;d++,p=p.parentElement){const t=lab(p); if(t.length>=5&&t.length<=110){ctx=t;break;}}
        return {k, value:i.value, ctx, inRow:!!i.closest('tbody tr')};}), tail: lab(x).slice(-230) };}, lab);
  console.log(tag, JSON.stringify(d)); return d; };
const d0 = await dump('DIALOG(open):');
// pay only PAY of the invoice; leave "Amount to credit" untouched
const rowBox = d0.inputs.find(i=>i.inRow && /^[\d,]+\.\d\d$/.test(i.value||''));
if (rowBox) { const el=page.locator(`[data-qa-in="${rowBox.k}"]`); await el.click(); await el.fill(''); await el.type(PAY,{delay:50}); await el.press('Tab'); await page.waitForTimeout(2500); }
await dump('DIALOG(filled):');
const btn = page.locator('.q-dialog button:has-text("Make payment")').first();
if (await btn.isDisabled().catch(()=>true)) {
  const pm = d0.inputs.find(i=>/payment method/i.test(i.ctx));
  if (pm) { await page.locator(`[data-qa-in="${pm.k}"]`).click(); await page.waitForTimeout(1500);
    const o=page.locator('.q-menu .q-item',{hasText:'Applied credit'}).first();
    if (await o.count()) await o.click(); else await page.locator('.q-menu .q-item').first().click();
    await page.waitForTimeout(1500); } }
const dis=await btn.isDisabled().catch(()=>true); log('Make payment disabled?', dis);
b4=calls.length; if(!dis){ await btn.click(); await page.waitForTimeout(9000); }
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
await page.screenshot({path:`${OUT}/apply7-after.png`});
log('AFTER:', JSON.stringify(await state()));
await browser.close();
