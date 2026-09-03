// Seed the credit C44967 line 2 and C44968 line 1 need: a returned PART with a RESTOCKING FEE.
// Route (found by following the bundle to InvoiceActionBar / IssueCreditMemoDialog, then clicking):
//   Parts > Part Sales > a PAID sale > the "Finance" tab > the toolbar's three-dot menu > "Issue Credit"
// That dialog - unlike the account-level one on the customer's Invoices tab - carries a
// "Parts to return" table: Part Number | Description | Sell Price | Qty Available For Credit |
// Qty To Credit | Restocking Fee | Total.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='2fa6c0dc-10a6-4334-8d63-fa4425239556', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const PART='310206332', QTY='2', FEE='10.00';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(12000);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const acct = async () => page.evaluate(async h => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__s:r.status}; };
  const cl = await get('/api/customers?pagination[rowsPerPage]=50&pagination[page]=1&search=Alice%20Truck');
  const c=(cl?.data?.collection||[])[0]; const v=await get(`/api/customers/view/${c.id}?`); const co=v?.data?.company;
  const t=await get(`/api/customer-account/list-unpaid-transaction?accountId=${co.customer_account_id}&pagination[rowsPerPage]=100&openOnly=false`);
  return { cust:c.id, acc:co.customer_account_id, partSaleCredits:co.part_sale_credit_count,
           rows:(t?.data?.response?.collection||[]).map(x=>`${x.invoice_number}|${x.type}|${x.amount}|${x.status_label}`) };
}, APIH);
log('BEFORE:', JSON.stringify(await acct()));

await page.locator('.q-tab:has-text("Finance")').first().click(); await page.waitForTimeout(9000);
const kebabs = page.locator('.q-btn:has-text("more_vert")');
for (let i=0;i<await kebabs.count();i++){
  await kebabs.nth(i).click({force:true}).catch(()=>{}); await page.waitForTimeout(2200);
  const items = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-menu .q-item')].map((e,k)=>{e.setAttribute('data-qa-mi',String(k));return lab(e);}).filter(Boolean); }, lab);
  const ic = items.findIndex(t=>/issue credit/i.test(t));
  if (ic>=0) { await page.locator(`[data-qa-mi="${ic}"]`).first().click(); await page.waitForTimeout(7000); break; }
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
}
// index the dialog's inputs, then keep ONLY the chosen part ticked
const map = await page.evaluate(([L,part])=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog')].pop();
  const ins=[...x.querySelectorAll('input,textarea')]; ins.forEach((i,k)=>i.setAttribute('data-qa-in',String(k)));
  const rows=[...x.querySelectorAll('tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    return {i, text:lab(tr).slice(0,60), ins:[...tr.querySelectorAll('input')].map(e=>+e.getAttribute('data-qa-in')),
            checked:[...tr.querySelectorAll('input[type=checkbox]')].map(e=>e.checked)}; });
  return { rows, target: rows.find(r=>r.text.includes(part))||null }; }, [lab, PART]);
console.log('dialog rows:'); map.rows.forEach(r=>console.log('  ', r.i, JSON.stringify(r.ins), r.text));
if (!map.target) { log('target part not in the dialog'); await browser.close(); process.exit(2); }
// untick every row except the target
for (const r of map.rows) {
  if (!r.ins.length || r.i===map.target.i) continue;
  const cb = page.locator(`[data-qa-row="${r.i}"] .q-checkbox`).first();
  if (await cb.count()) { const on = await page.evaluate(i=>{const tr=document.querySelector(`[data-qa-row="${i}"]`);
      const c=tr.querySelector('input[type=checkbox]'); return c? c.checked:false;}, r.i);
    if (on) { await cb.click({force:true}); await page.waitForTimeout(350); } }
}
const [cbIdx, qtyIdx, feeIdx] = map.target.ins;
log('target row inputs -> checkbox', cbIdx, 'qty', qtyIdx, 'fee', feeIdx);
const setv = async (k,v) => { const e=page.locator(`[data-qa-in="${k}"]`); await e.click(); await e.fill(''); await e.type(v,{delay:60}); await e.press('Tab'); await page.waitForTimeout(1200); };
await setv(qtyIdx, QTY); await setv(feeIdx, FEE);
await page.locator('.q-dialog .q-radio', { hasText:'Issue Store Credit' }).first().click(); await page.waitForTimeout(1500);
const reason = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog')].pop();
  const ta=x.querySelector('textarea'); if(ta){ta.setAttribute('data-qa-reason','1'); return true;} return false; });
if (reason) await page.locator('[data-qa-reason="1"]').fill('ZZAUTOTEST returned part with a restocking fee, for C44967 and C44968');
await page.waitForTimeout(1000);
const state = await page.evaluate(L=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog')].pop();
  return { tail: lab(x).slice(-320), buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean) };}, lab);
console.log('dialog before submit:', JSON.stringify(state));
await page.screenshot({path:`${OUT}/part-credit-filled.png`, fullPage:true});
const b4=calls.length;
await page.locator('.q-dialog button:has-text("Issue Credit")').last().click({timeout:20000});
await page.waitForTimeout(9000);
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
log('AFTER:', JSON.stringify(await acct()));
await page.screenshot({path:`${OUT}/part-credit-after.png`, fullPage:true});
await browser.close();
