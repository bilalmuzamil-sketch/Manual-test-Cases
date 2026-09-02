// C44970 requires "the shop's configured disclaimer" on the Credit Invoice, and the credit note shows
// none. Two readings: the shop has no disclaimer configured, or the credit note omits it. Render the
// SAME shop's ordinary invoice: if the disclaimer appears there, the credit note is omitting it.
// This is the control that turns an observation into a verdict.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687', OUT='build/invoice-ui-refresh/credit-doc-verify-2026-09-02';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
await page.goto(`${APP}/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
// the ordinary invoice row's own print control - hover to identify it, never click by position
const marked = await page.evaluate(() => {
  const t=document.querySelector('table'); if(!t) return null;
  for (const tr of t.querySelectorAll('tbody tr')) {
    if (!/invoice/i.test(tr.textContent||'') || /credit/i.test(tr.textContent||'')) continue;
    const cell=tr.cells[tr.cells.length-1];
    const ctrls=[...cell.querySelectorAll('button, i, [role="button"], .q-btn')];
    ctrls.forEach((c,i)=>c.setAttribute('data-qa-inv',String(i)));
    return {n:ctrls.length, row:(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,90)};
  } return null;
});
console.log('invoice row:', JSON.stringify(marked));
const calls=[]; page.on('request', r=>{const u=r.url(); if(u.includes(APIH)) calls.push(`${r.method()} ${u.replace(`https://${APIH}`,'')}`);});
let tips={};
for (let i=0;i<(marked?.n||0);i++){
  await page.locator(`[data-qa-inv="${i}"]`).first().hover().catch(()=>{});
  await page.waitForTimeout(700);
  tips[i]=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role="tooltip"]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
  console.log(`   [${i}]`, JSON.stringify(tips[i]));
}
let t=null; for (const i in tips) if (tips[i].some(x=>/print/i.test(x))) t=i;
console.log('clicking', t);
const before=calls.length;
if (t!==null){ await page.locator(`[data-qa-inv="${t}"]`).first().click({timeout:20000}).catch(e=>console.log('click:',String(e).split('\n')[0]));
  await page.waitForTimeout(9000); }
const fired=[...new Set(calls.slice(before))];
console.log('fired:', JSON.stringify(fired));
// pull the pdf via whichever route it used
const url = fired.map(f=>f.split(' ')[1]).find(u=>/pdf|preview/i.test(u));
if (url) {
  const b=await page.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); if(!r.ok) return {status:r.status};
    const a=new Uint8Array(await r.arrayBuffer()); let s=''; for(const x of a) s+=String.fromCharCode(x);
    return {status:r.status, b64:btoa(s), len:a.length, type:r.headers.get('content-type')};}, `https://${APIH}${url}`);
  console.log('invoice doc ->', b.status, b.type, b.len);
  if (b.b64) { fs.writeFileSync(`${OUT}/invoice-S3-13180.${/pdf/.test(b.type||'')?'pdf':'html'}`, Buffer.from(b.b64,'base64'));
    console.log('saved'); }
} else console.log('no pdf/preview request seen');
await browser.close();
