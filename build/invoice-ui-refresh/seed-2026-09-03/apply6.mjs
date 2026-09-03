// Andrews' Truck & Trailer Repair LLC - customer 4255e024..., account ebeb8706..., unpaid invoice
// S-16654 with $8,600.85 outstanding and NO credits yet. Issue a credit, then tick the credit row AND
// the invoice row together and drive New Payment. Every dialog is dumped before anything is submitted.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='4255e024-938c-4514-83d9-95f1a0a7f324', ACC='ebeb8706-3777-4984-b58f-2d906ea211c8';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const AMOUNT = process.env.AMOUNT || '600';
const APPLY  = process.env.APPLY  || '600';   // how much of it to consume
const MEMO   = process.env.MEMO   || 'ZZAUTOTEST credit for the APPLIED state (C45181)';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const state = async () => page.evaluate(async ([h,acc]) => {
  const r = await fetch(`https://${h}/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=100&openOnly=false`,{credentials:'include'});
  const j = await r.json();
  return (j?.data?.response?.collection||[]).map(x=>({n:x.invoice_number, type:x.type, amount:x.amount, balance:x.balance, status:x.status_label, origin:x.origin_invoices?.length||0}));
}, [APIH, ACC]);
log('BEFORE:', JSON.stringify(await state()));

const go = async () => { await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000); };
await go();
// 1) issue the credit
await page.locator('button:has-text("Issue Credit")').first().click(); await page.waitForTimeout(3000);
await page.locator('.q-dialog input[type="text"]').nth(1).fill(AMOUNT);
await page.locator('.q-dialog .q-radio', { hasText:'Issue Store Credit' }).first().click(); await page.waitForTimeout(1200);
const ta=page.locator('.q-dialog textarea').first(); if (await ta.count()) await ta.fill(MEMO);
let b4=calls.length; await page.locator('.q-dialog button').last().click(); await page.waitForTimeout(6000);
log('issue credit:', JSON.stringify([...new Set(calls.slice(b4))]));
const cx=page.locator('.q-dialog button:has-text("Cancel")').first(); if (await cx.count()) await cx.click().catch(()=>{});
await page.waitForTimeout(2000);

// 2) tick the credit row AND the invoice row, then New Payment
await go();
const rows = await page.evaluate((L)=>{ const lab=eval(L);
  return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    return {i, cells:[...tr.cells].map(c=>lab(c))}; }).filter(r=>r.cells.length>3); }, lab);
rows.forEach(r=>console.log('  row', r.i, JSON.stringify(r.cells)));
const credit  = rows.find(r=>/credit/i.test(r.cells[2]) && /Unapplied/i.test(r.cells[7]));
const invoice = rows.find(r=>/invoice/i.test(r.cells[2]) && /Unpaid|Partial/i.test(r.cells[7]));
if (!credit||!invoice) { log('missing a row - credit',!!credit,'invoice',!!invoice); await browser.close(); process.exit(2); }
for (const r of [credit, invoice]) { await page.locator(`[data-qa-row="${r.i}"] .q-checkbox`).first().click({force:true}); await page.waitForTimeout(1500); }
await page.locator('button:has-text("New Payment")').first().click({timeout:25000}); await page.waitForTimeout(6000);
const dump = async (tag) => { const d = await page.evaluate((L)=>{ const lab=eval(L);
    const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null; const tb=x.querySelector('table');
    return { inputs:[...x.querySelectorAll('input')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
        let p=i.parentElement,ctx=''; for(let d=0;d<7&&p;d++,p=p.parentElement){const t=lab(p); if(t.length>=5&&t.length<=90){ctx=t;break;}}
        return {k, value:i.value, ctx, inRow:!!i.closest('tbody tr')};}),
      table: tb? {h:[...tb.querySelectorAll('thead th')].map(c=>lab(c)), r:[...tb.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(c=>lab(c)))}:null,
      tail: lab(x).slice(-200) }; }, lab);
  console.log(tag, JSON.stringify(d)); return d; };
const d0 = await dump('DIALOG(open):');
const cbox = d0.inputs.find(i=>/amount to credit/i.test(i.ctx));
if (!cbox) { log('no "Amount to credit" box in this dialog'); await page.screenshot({path:`${OUT}/apply6-nobox.png`}); await browser.close(); process.exit(3); }
const box = page.locator(`[data-qa-in="${cbox.k}"]`);
await box.click(); await box.fill(''); await box.type(APPLY,{delay:60}); await box.press('Tab'); await page.waitForTimeout(2500);
// pay ONLY with the credit: zero the invoice row's own payment box if it carries one
const rowBox = d0.inputs.filter(i=>i.inRow && /^[\d,]+\.\d\d$/.test(i.value||''));
for (const rb of rowBox) { const el=page.locator(`[data-qa-in="${rb.k}"]`); await el.click(); await el.fill(''); await el.type(APPLY,{delay:40}); await el.press('Tab'); await page.waitForTimeout(1200); }
await dump('DIALOG(filled):');
await page.screenshot({path:`${OUT}/apply6-filled.png`});
const btn = page.locator('.q-dialog button:has-text("Make payment")').first();
if (await btn.isDisabled().catch(()=>true)) { log('picking a payment method');
  await page.locator('[data-qa-in="1"]').click(); await page.waitForTimeout(1500);
  const o=page.locator('.q-menu .q-item',{hasText:'Applied credit'}).first();
  if (await o.count()) await o.click(); else await page.locator('.q-menu .q-item').first().click();
  await page.waitForTimeout(1500); }
const dis = await btn.isDisabled().catch(()=>true); log('Make payment disabled?', dis);
b4=calls.length; if (!dis) { await btn.click(); await page.waitForTimeout(9000); }
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
await page.screenshot({path:`${OUT}/apply6-after.png`});
const after = await state(); log('AFTER:', JSON.stringify(after));
fs.writeFileSync(`${OUT}/apply6-state.json`, JSON.stringify({after, calls},null,1));
await browser.close();
