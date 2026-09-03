// Move the seeded credits into the states the cases need, through the UI:
//   CM-4191 -> "Reverse"  -> expect Voided   (C45181 half 2)
//   CM-4192 -> "Cash Out" -> expect Refunded (C45182)
// Controls are chosen by their HOVER TOOLTIP, never by position - that Action cell holds three icons
// that look alike (Print credit memo / Cash Out / Reverse).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687';
const OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&r.request().method()!=='GET') calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'')}`);});
const txlist = () => page.evaluate(async u => {
  const c = await (await fetch(u.v,{credentials:'include',headers:{Accept:'application/json'}})).json();
  const acc = JSON.stringify(c).match(/"customer_account_id":"([^"]+)"/)?.[1];
  const t = await (await fetch(u.t+acc,{credentials:'include',headers:{Accept:'application/json'}})).json();
  return (t?.data?.response?.collection||[]).map(r=>({type:r.type,amount:r.amount,balance:r.balance,status:r.status_label||r.status,num:r.formatted_invoice_number}));
}, { v:`https://${APIH}/api/customers/view/${CUST}`, t:`https://${APIH}/api/customer-account/list-unpaid-transaction?account_id=` });

async function act(numFragment, tooltipRe, label) {
  await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  // "Open only" is ON by default and hides consumed credits - turn it off so every row is listed
  const tog = page.locator('.q-toggle').first();
  if (await tog.count()) { await tog.click().catch(()=>{}); await page.waitForTimeout(4000); }
  const n = await page.evaluate(frag => { const t=document.querySelector('table'); if(!t) return 0;
    for (const tr of t.querySelectorAll('tbody tr')) {
      // 🛑 THE NUMBER IS SPELLED DIFFERENTLY IN THREE PLACES. The API's
      // formatted_invoice_number is "CM-4191"; the table's "No." column shows the BRANCH-PREFIXED
      // "CM8218-4191"; the printed PDF shows "CM-4191" again. Matching the API's spelling against
      // the table finds nothing. So match on the NUMERIC part only.
      if (!(tr.textContent||'').includes(frag)) continue;
      const cell=tr.cells[tr.cells.length-1];
      const c=[...cell.querySelectorAll('button,[role="button"],.q-btn')];
      c.forEach((e,i)=>e.setAttribute('data-qa-r',String(i))); return c.length; }
    return 0; }, numFragment);
  if (!n) { log(`${label}: no row containing ${numFragment}`); return null; }
  let target=null, tips={};
  for (let i=0;i<n;i++){
    await page.locator(`[data-qa-r="${i}"]`).first().hover().catch(()=>{});
    await page.waitForTimeout(900);
    tips[i]=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role="tooltip"]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
    if (target===null && tips[i].some(t=>tooltipRe.test(t))) target=i;
  }
  log(`${label}: row controls ${JSON.stringify(tips)} -> clicking ${target}`);
  if (target===null) return null;
  const before=calls.length;
  await page.locator(`[data-qa-r="${target}"]`).first().click().catch(e=>log('   click:',String(e).split('\n')[0]));
  await page.waitForTimeout(3500);
  const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
    const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
    return { text:lab(x).slice(0,260), buttons:[...x.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean),
             inputs:[...x.querySelectorAll('input,textarea')].map(i=>({t:i.type||i.tagName, v:(i.value||'').slice(0,20)})) }; });
  if (d) {
    log(`   dialog: ${JSON.stringify(d)}`);
    const yes=(d.buttons||[]).find(b=>!/cancel/i.test(b) && b.length);
    if (yes) { log(`   confirming with "${yes}"`);
      await page.locator('.q-dialog button', { hasText: yes }).last().click().catch(e=>log('   confirm:',String(e).split('\n')[0]));
      await page.waitForTimeout(7000); }
  }
  const fired=[...new Set(calls.slice(before))];
  log(`   fired: ${JSON.stringify(fired)}`);
  return { tips, fired, dialog:d };
}

const out={ at:new Date().toISOString(), before: await txlist() };
log('before:', JSON.stringify(out.before));
out.reverse  = await act('4191', /reverse/i,  'CM-4191 Reverse');
out.cashout  = await act('4192', /cash out/i, 'CM-4192 Cash Out');
out.after = await txlist();
log('after :', JSON.stringify(out.after));
fs.writeFileSync(`${OUT}/transition-state.json`, JSON.stringify(out,null,1));
await browser.close();
