// C45183 needs a credit that is PARTLY APPLIED and PARTLY REFUNDED. CM-4197 is already partly applied
// ($1,260 of $2,000 consumed, $740 open); cash out only PART of what is left.
// Route: the credit row's Action column -> the icon whose hover tooltip reads "Cash Out".
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const CUST='0a0bf0f3-88ac-45ce-8c87-8e59d27f56ec', ACC='87c00389-d87f-4851-9465-98c617f09371';
const NUM = process.env.NUM || 'CM8218-4197', AMT = process.env.AMT || '300';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const state = async () => page.evaluate(async ([h,acc])=>{ const r=await fetch(`https://${h}/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=200&openOnly=false`,{credentials:'include'});
  const j=await r.json(); return (j?.data?.response?.collection||[]).filter(x=>x.type!=='invoice').map(x=>`${x.invoice_number}|amt ${x.amount}|bal ${x.balance}|${x.status_label}`); }, [APIH, ACC]);
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
log('BEFORE:', JSON.stringify(await state()));
const n = await page.evaluate((num)=>{ let c=0;
  for (const tr of document.querySelectorAll('table tbody tr')) if ((tr.textContent||'').includes(num)) {
    const cell=tr.cells[tr.cells.length-1];
    [...cell.querySelectorAll('button, .q-btn')].forEach((b,i)=>{ b.setAttribute('data-qa-act',String(i)); c++; }); }
  return c; }, NUM);
log('action buttons on', NUM, '=', n);
let idx=null;
for (let i=0;i<n;i++){ const el=page.locator(`[data-qa-act="${i}"]`).first();
  await el.hover().catch(()=>{}); await page.waitForTimeout(1000);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  console.log(`  [${i}] tooltip ${JSON.stringify(tip)}`);
  if (tip.some(t=>/cash out/i.test(t)) && idx===null) idx=i; }
if (idx===null) { log('no Cash Out control found'); await browser.close(); process.exit(2); }
await page.locator(`[data-qa-act="${idx}"]`).first().click(); await page.waitForTimeout(5000);
const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop();
  const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return { title:lab(x).slice(0,200), inputs:[...x.querySelectorAll('input')].map((i,k)=>{ i.setAttribute('data-qa-in',String(k));
    let p=i.parentElement,ctx=''; for(let dd=0;dd<7&&p;dd++,p=p.parentElement){const t=lab(p); if(t.length>=4&&t.length<=90){ctx=t;break;}}
    return {k, value:i.value, ctx};}) }; });
console.log('CASH OUT DIALOG:', JSON.stringify(d));
const amt = d.inputs.find(i=>/amount/i.test(i.ctx));
const el = page.locator(`[data-qa-in="${amt.k}"]`); await el.click(); await el.fill(''); await el.type(AMT,{delay:60}); await el.press('Tab'); await page.waitForTimeout(1500);
const pm = d.inputs.find(i=>/payment method/i.test(i.ctx));
if (pm) { await page.locator(`[data-qa-in="${pm.k}"]`).click(); await page.waitForTimeout(1500);
  await page.locator('.q-menu .q-item').first().click(); await page.waitForTimeout(1500); }
const ta=page.locator('.q-dialog textarea').first(); if (await ta.count()) await ta.fill('ZZAUTOTEST partial cash out for C45183');
const b4=calls.length;
const btn=page.locator('.q-dialog button:has-text("Cash Out")').last();
log('Cash Out disabled?', await btn.isDisabled().catch(()=>true));
await btn.click(); await page.waitForTimeout(8000);
log('fired:', JSON.stringify([...new Set(calls.slice(b4))]));
log('AFTER:', JSON.stringify(await state()));
await browser.close();
