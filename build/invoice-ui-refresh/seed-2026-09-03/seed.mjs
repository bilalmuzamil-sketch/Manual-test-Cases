// SEED the credit states the six remaining Credit Invoice cases need (QA lead, 2026-09-03: "Always
// seed data, never stay blocked." — Rule 14). sv8218 is a disposable QA branch (Rule 6), so every
// credit is created through the UI with ZZAUTOTEST in its Reason so it is identifiable as throwaway.
//
// The Issue Credit dialog (read 2026-09-03): Credit Date · $Amount · Outcome radio
// ("Issue Store Credit" | "Issue Refund") · Payment method · Reason · Cancel / submit.
// The credit row's Action cell offers: Print credit memo · Cash Out · Reverse.
//
// NOTE: Escape does NOT close these dialogs - click "Cancel".
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
  return { acc, rows: (t?.data?.response?.collection||[]).map(r=>({id:r.id,type:r.type,amount:r.amount,balance:r.balance,status:r.status_label||r.status,num:r.formatted_invoice_number})) };
}, { v:`https://${APIH}/api/customers/view/${CUST}`, t:`https://${APIH}/api/customer-account/list-unpaid-transaction?account_id=` });

const goInvoices = async () => { await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000); };
const closeDialog = async () => { const c=page.locator('.q-dialog button:has-text("Cancel")').first();
  if (await c.count()) await c.click().catch(()=>{}); await page.waitForTimeout(1500); };

async function issueCredit(amount, outcome, reason) {
  await goInvoices();
  await page.locator('button:has-text("Issue Credit")').first().click();
  await page.waitForTimeout(3000);
  const inputs = page.locator('.q-dialog input[type="text"]');
  await inputs.nth(1).fill(String(amount));                        // $Amount (0 = Credit Date)
  // choose the Outcome by its LABEL, never by radio index
  const radio = page.locator('.q-dialog .q-radio', { hasText: outcome }).first();
  if (await radio.count()) await radio.click(); else log(`   ! no radio labelled ${outcome}`);
  await page.waitForTimeout(1200);
  const ta = page.locator('.q-dialog textarea').first();
  if (await ta.count()) await ta.fill(reason);
  const submit = page.locator('.q-dialog button').last();
  const label = await submit.evaluate(el=>{const c=el.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());return (c.textContent||'').trim();});
  log(`   submitting via "${label}"`);
  const before = calls.length;
  await submit.click().catch(e=>log('   submit:',String(e).split('\n')[0]));
  await page.waitForTimeout(6000);
  const fired=[...new Set(calls.slice(before))];
  log('   fired:', JSON.stringify(fired));
  await closeDialog();
  return fired;
}

async function rowAction(numFragment, tooltipRe) {
  await goInvoices();
  const n = await page.evaluate(frag => { const t=document.querySelector('table'); if(!t) return 0;
    for (const tr of t.querySelectorAll('tbody tr')) {
      if (!(tr.textContent||'').includes(frag)) continue;
      const cell=tr.cells[tr.cells.length-1];
      const c=[...cell.querySelectorAll('button,[role="button"],.q-btn')];
      c.forEach((e,i)=>e.setAttribute('data-qa-r',String(i))); return c.length; }
    return 0; }, numFragment);
  if (!n) { log(`   ! no row containing ${numFragment}`); return null; }
  let target=null;
  for (let i=0;i<n;i++){
    await page.locator(`[data-qa-r="${i}"]`).first().hover().catch(()=>{});
    await page.waitForTimeout(800);
    const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role="tooltip"]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
    if (tip.some(t=>tooltipRe.test(t))) { target=i; log(`   control ${i} = ${JSON.stringify(tip)}`); break; }
  }
  if (target===null) { log(`   ! no control matching ${tooltipRe}`); return null; }
  const before=calls.length;
  await page.locator(`[data-qa-r="${target}"]`).first().click().catch(e=>log('   click:',String(e).split('\n')[0]));
  await page.waitForTimeout(3000);
  // a confirm dialog may appear - take its affirmative button (never "Cancel")
  const d = await page.evaluate(()=>{ const x=[...document.querySelectorAll('.q-dialog,[role="dialog"]')].pop(); if(!x) return null;
    const lab=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
    return { text:lab(x).slice(0,220), buttons:[...x.querySelectorAll('button,.q-btn')].map(lab).filter(Boolean) }; });
  if (d) {
    log('   dialog:', JSON.stringify(d));
    const yes = (d.buttons||[]).find(b=>!/cancel/i.test(b));
    if (yes) { await page.locator('.q-dialog button', { hasText: yes }).last().click().catch(()=>{}); await page.waitForTimeout(6000); }
  }
  const fired=[...new Set(calls.slice(before))];
  log('   fired:', JSON.stringify(fired));
  await closeDialog();
  return fired;
}

const state = { at:new Date().toISOString(), branch:'sv8218', steps:[] };
state.before = await txlist();
log('transactions before:', JSON.stringify(state.before.rows));

log('1) store credit $200 -> expect Unapplied');
state.steps.push({ step:'store credit 200', fired: await issueCredit(200,'Issue Store Credit','ZZAUTOTEST unapplied credit for C45179') });
log('2) store credit $300 -> then Reverse it -> expect Voided');
state.steps.push({ step:'store credit 300', fired: await issueCredit(300,'Issue Store Credit','ZZAUTOTEST to be voided for C45181') });
log('3) store credit $150 -> then Cash Out -> expect Refunded');
state.steps.push({ step:'store credit 150', fired: await issueCredit(150,'Issue Store Credit','ZZAUTOTEST to be refunded for C45182') });

state.after = await txlist();
log('transactions after creating:', JSON.stringify(state.after.rows));
fs.writeFileSync(`${OUT}/seed-state.json`, JSON.stringify(state,null,1));
await browser.close();
