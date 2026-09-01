// C45177 / C45196 / C45197 — the payment reversal, using the recipe that was in the playbook all
// along (APP-ACTIONS-PLAYBOOK.md:2342):
//   UI: Customers -> customer -> Payments tab -> row delete/trash icon -> confirmation
//       ("reverse the payment for all invoices ... record preserved for audit") -> Reverse
//   API: POST /api/customer-account/reverse-customer-payment -> 201
//   Gated by invoicingPaymentsDelete. NOT on the Finance tab, and nothing says "reverse" until the
//   dialog opens -- which is why reading the Finance tab found nothing and I wrongly called it absent.
//
// This run READS the Payments tab and the confirmation dialog. It commits only with --commit.
// If the trash icon is missing, that is a PERMISSION signal (Rule 26), not evidence of absence.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const COMMIT = process.argv.includes('--commit');
const log = (...a) => console.log(...a);
const nonGet = [], out = {};
const { browser, page } = await boot(`/customers/${CUST}/payments`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,240); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });
page.on('response', r => { if (r.request().method()!=='GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url()))
  log(`   [resp] ${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/,'').slice(0,95)}`); });

// ANCHOR — do not read anything until the tab is genuinely there
const ok = await page.waitForSelector('table, [data-test-id*="payment" i]', { timeout: 45000 })
  .then(()=>true).catch(()=>false);
log(`anchor (payments table): ${ok ? 'PRESENT' : '*** NEVER APPEARED — reporting nothing ***'}`);
if (!ok) { await browser.close(); process.exit(3); }
await page.waitForTimeout(3000);
const txt = await page.evaluate(() => (document.body.innerText||'').slice(0,400));
log('page head:', JSON.stringify(txt.slice(0,180)));

const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e => e.getAttribute('data-test-id')).filter(Boolean));
out.payment_tab_ids = [...new Set(ids)].filter(i => /pay|delete|trash|remove|reverse|row|action/i.test(i));
log('payment-row ids:');
out.payment_tab_ids.slice(0,20).forEach(i => log('   ', i));
// the trash/delete control the playbook names
const del = page.locator('[data-test-id*="delete" i],[data-test-id*="trash" i],[data-test-id*="remove" i]').first();
const n = await del.count();
log(`\ndelete/trash controls on payment rows: ${n}`);
if (!n) {
  log('*** none present. Per Rule 26 that is a PERMISSION signal (invoicingPaymentsDelete), not');
  log('    evidence the action is absent. Current login is Admin, so check the role definition.');
  out.trash_present = false;
} else {
  out.trash_present = true;
  await del.click({ timeout: 10000, force: true }).catch(e => log('click failed:', String(e).slice(0,80)));
  await page.waitForTimeout(2500);
  const dlg = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog'); if (!d) return null;
    return { text: (d.innerText||'').slice(0,700),
             controls: [...d.querySelectorAll('button,[data-test-id]')]
               .map(e=>({t:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,40), id:e.getAttribute('data-test-id')||''}))
               .filter(x=>x.t||x.id) };
  });
  out.confirm_dialog = dlg;
  if (dlg) {
    log('\nconfirmation dialog:'); log('  text:', JSON.stringify(dlg.text.slice(0,340)));
    dlg.controls.slice(0,12).forEach(c=>log(`     ${JSON.stringify(c.t).padEnd(26)} ${c.id}`));
  } else log('\nno dialog appeared');
  await page.screenshot({ path: `${EV}/reverse-payment-dialog.png`, fullPage: true }).catch(()=>{});
  if (COMMIT && dlg) {
    const go = dlg.controls.find(c => /^reverse$/i.test(c.t)) || dlg.controls.find(c => c.id==='button_confirm_dialog');
    if (go) {
      log(`\ncommitting via ${JSON.stringify(go)}`);
      const l = go.id ? page.locator(`[data-test-id="${go.id}"]`).first() : page.getByRole('button',{name:go.t}).first();
      await l.click({ timeout: 12000 }).catch(()=>{});
      await page.waitForTimeout(5000);
      await page.screenshot({ path: `${EV}/reverse-payment-after.png`, fullPage: true }).catch(()=>{});
    } else log('\nno Reverse button found in the dialog — refusing to guess');
  } else if (dlg) {
    log('\n--commit NOT passed. Nothing committed.');
    await page.keyboard.press('Escape');
  }
}
fs.writeFileSync(`${DIR}/reversal-walk.json`, JSON.stringify({...out, commit: COMMIT, nonGet}, null, 1));
log(`\nNON-GET CALLS: ${nonGet.length}`);
nonGet.forEach(c=>log('   ',c));
await browser.close();
