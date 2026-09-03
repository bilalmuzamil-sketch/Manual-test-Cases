// A precondition may only name a control that was WATCHED doing the thing. The credit row's third
// action reads "Reverse" on hover - check that it is what produces the Voided status before any case
// tells a tester to use it. Spare credit: CM8218-4193 ($400, Unapplied, Apollo Beach).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const CUST='4f8e5beb-78a2-44ed-9dfe-eebc1bc2e8f4', ACC='29c8073d-82c2-4fbe-9593-225f7f2e2959', NUM='CM8218-4193';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const state=async()=>page.evaluate(async ([h,a])=>{const r=await fetch(`https://${h}/api/customer-account/list-unpaid-transaction?accountId=${a}&pagination[rowsPerPage]=100&openOnly=false`,{credentials:'include'});
  const j=await r.json(); return (j?.data?.response?.collection||[]).filter(x=>x.type==='credit').map(x=>`${x.invoice_number}|bal ${x.balance}|${x.status_label}`);},[APIH,ACC]);
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
log('BEFORE:', JSON.stringify(await state()));
const n=await page.evaluate(num=>{let c=0; for(const tr of document.querySelectorAll('table tbody tr')) if((tr.textContent||'').includes(num)){
  [...tr.cells[tr.cells.length-1].querySelectorAll('button, .q-btn')].forEach((b,i)=>{b.setAttribute('data-qa-act',String(i));c++;});} return c;},NUM);
let idx=null;
for(let i=0;i<n;i++){const el=page.locator(`[data-qa-act="${i}"]`).first(); await el.hover().catch(()=>{}); await page.waitForTimeout(900);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  console.log(`  [${i}] ${JSON.stringify(tip)}`); if(idx===null && tip.some(t=>/reverse/i.test(t))) idx=i;}
if(idx===null){log('no Reverse control'); await browser.close(); process.exit(2);}
const b4=calls.length;
await page.locator(`[data-qa-act="${idx}"]`).first().click(); await page.waitForTimeout(4000);
const d=await page.evaluate(()=>{const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return {text:lab(x).slice(0,300), buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean)};});
console.log('CONFIRM DIALOG:', JSON.stringify(d));
if (d) { const go=page.locator(".q-dialog button:has-text(\"Reverse\")").last(); await go.click(); await page.waitForTimeout(7000); }
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
log('AFTER:', JSON.stringify(await state()));
await browser.close();
