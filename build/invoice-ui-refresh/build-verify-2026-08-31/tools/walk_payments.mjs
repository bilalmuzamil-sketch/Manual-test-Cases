// The payment APPLY / REVERSE surface, for C45177, C45196 and C45197.
// Not on the work-order finance tab (established with anchors: only item_label_Payments there).
// The customer Invoices tab has a bulk-action shape -- checkbox_select_all_transactions,
// checkbox_transaction_<id>, button_action -- which is the likely apply-payment path.
// Read-only: selects a row and OPENS the action menu to READ it, then Escapes. Nothing committed.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const log = (...a) => console.log(...a);
const out = {}, nonGet = [];
const { browser, page } = await boot(`/customers/${CUST}/invoices`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,240); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });

// ANCHOR: the tab is only really loaded once a transaction checkbox exists
const ok = await page.waitForSelector('[data-test-id^="checkbox_transaction_"]', { timeout: 45000 })
  .then(() => true).catch(() => false);
log(`anchor checkbox_transaction_*: ${ok ? 'PRESENT' : '*** NEVER APPEARED — reporting nothing ***'}`);
if (!ok) { await browser.close(); process.exit(3); }
await page.waitForTimeout(2000);

const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e => e.getAttribute('data-test-id')).filter(Boolean));
out.tab_ids = [...new Set(ids)].filter(i => /transaction|action|pay|cash|credit|print|delete/i.test(i));
log('action-ish ids on the Invoices tab:');
out.tab_ids.forEach(i => log('   ', i));

// select the FIRST transaction row, then read what button_action offers
const cb = page.locator('[data-test-id^="checkbox_transaction_"]').first();
await cb.click({ timeout: 10000, force: true }).catch(e => log('checkbox click failed:', String(e).slice(0,70)));
await page.waitForTimeout(1200);
const act = page.locator('[data-test-id="button_action"]').first();
if (await act.count()) {
  await act.click({ timeout: 10000, force: true }).catch(() => {});
  await page.waitForTimeout(2000);
  const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item,[role=menuitem]')]
    .map(e => ({ t: (e.innerText||'').trim().replace(/\s+/g,' '), id: e.getAttribute('data-test-id')||'' })).filter(x=>x.t));
  out.action_menu = items;
  log('\nbutton_action menu (one transaction selected):');
  items.forEach(i => log(`   ${JSON.stringify(i.t).padEnd(34)} ${i.id}`));
  await page.screenshot({ path: `${EV}/payment-action-menu.png`, fullPage: true }).catch(() => {});
  // open the payment-shaped item to READ its dialog
  const pick = items.find(i => /pay|apply|receive/i.test(i.t + i.id));
  if (pick) {
    log(`\nopening ${JSON.stringify(pick.t)} to read the dialog`);
    await page.locator(`[data-test-id="${pick.id}"]`).first().click({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const dlg = await page.evaluate(() => {
      const d = document.querySelector('.q-dialog'); if (!d) return null;
      return { text: (d.innerText||'').slice(0,600),
               controls: [...d.querySelectorAll('button,input,label,[data-test-id]')]
                 .map(e=>({t:(e.innerText||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ').slice(0,38),
                           id:e.getAttribute('data-test-id')||''})).filter(x=>x.t||x.id) };
    });
    out.payment_dialog = dlg;
    if (dlg) { log('  dialog text:', JSON.stringify(dlg.text.slice(0,320)));
               log('  controls:'); dlg.controls.slice(0,24).forEach(c=>log(`     ${JSON.stringify(c.t).padEnd(32)} ${c.id}`)); }
    else log('  no dialog appeared');
    await page.screenshot({ path: `${EV}/payment-dialog.png`, fullPage: true }).catch(() => {});
    await page.keyboard.press('Escape');
  }
} else log('\nbutton_action not present');
fs.writeFileSync(`${DIR}/payment-surface.json`, JSON.stringify({ ...out, nonGet }, null, 1));
log(`\nNON-GET CALLS THIS RUN (expect 0): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
