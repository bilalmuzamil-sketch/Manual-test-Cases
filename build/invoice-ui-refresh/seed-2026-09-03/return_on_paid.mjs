// The return on an APPROVED part sale produced only a vendor credit - the customer had never been
// billed, so there was nothing to credit them. Try the same on a PAID part sale (P2-97, customer Alice
// Truck & Trailer Repair), where the customer HAS paid, and see whether a customer Credit Invoice
// appears on their Invoices tab.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='2fa6c0dc-10a6-4334-8d63-fa4425239556', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(12000);
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const acct = async name => page.evaluate(async ([h,n]) => {
  const get = async u => { const r=await fetch(`https://${h}${u}`,{credentials:'include'}); return r.ok? await r.json():{__s:r.status}; };
  const cl = await get(`/api/customers?pagination[rowsPerPage]=50&pagination[page]=1&search=${encodeURIComponent(n)}`);
  const c=(cl?.data?.collection||[])[0]; if(!c) return {err:'not found'};
  const v = await get(`/api/customers/view/${c.id}?`); const co=v?.data?.company;
  const t = await get(`/api/customer-account/list-unpaid-transaction?accountId=${co.customer_account_id}&pagination[rowsPerPage]=100&openOnly=false`);
  return { name:c.name, partSaleCredits:co.part_sale_credit_count,
    rows:(t?.data?.response?.collection||[]).map(x=>`${x.invoice_number}|${x.type}|${x.amount}|${x.status_label}`) };
}, [APIH, name]);
log('customer BEFORE:', JSON.stringify(await acct('Alice Truck')));
const rows = await page.evaluate(L=>{ const lab=eval(L);
  return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    const ctl=[...tr.querySelectorAll('button,.q-btn')]; ctl.forEach((b,j)=>b.setAttribute('data-qa-ctl',`${i}:${j}`));
    const cells=[...tr.cells].map(lab);
    return {i, controls:ctl.length, hasReply: ctl.some(b=>/reply/.test(b.textContent||'')), cells: cells.slice(1,3).concat(cells.slice(-4))}; }); }, lab);
rows.forEach(r=>console.log(`  row ${String(r.i).padStart(2)} ctl=${r.controls} return=${r.hasReply} ${JSON.stringify(r.cells).slice(0,150)}`));
const t = rows.find(r=>r.hasReply);
if (!t) { log('no row on this PAID sale offers a Return arrow'); await browser.close(); process.exit(3); }
log('returning row', t.i);
await page.evaluate(i=>{ const tr=document.querySelector(`[data-qa-row="${i}"]`);
  const b=[...tr.querySelectorAll('button,.q-btn')].find(x=>/reply/.test(x.textContent||'')); b.setAttribute('data-qa-go','1'); }, t.i);
await page.locator('[data-qa-go="1"]').first().click(); await page.waitForTimeout(5000);
const d = await page.evaluate(L=>{ const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog')].pop(); if(!x) return null;
  return { whole: lab(x).slice(0,300), inputs:[...x.querySelectorAll('input,textarea')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
    let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const q=lab(p); if(q.length>=3&&q.length<=90){ctx=q;break;}}
    return {k,value:i.value,ctx};}) }; }, lab);
console.log('dialog:', JSON.stringify(d));
if (d) {
  const r=d.inputs.find(i=>/reason/i.test(i.ctx)); if(r){const e=page.locator(`[data-qa-in="${r.k}"]`); await e.click(); await e.fill('ZZAUTOTEST customer part return for C44967/C44968');}
  const b4=calls.length;
  await page.locator('.q-dialog button:has-text("Save & Close")').first().click(); await page.waitForTimeout(8000);
  log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
}
log('customer AFTER:', JSON.stringify(await acct('Alice Truck')));
await page.screenshot({path:`${OUT}/return-on-paid.png`, fullPage:true});
await browser.close();
