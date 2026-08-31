// Find the credit memo APPLY / REFUND / VOID routes by reading the credit row's actions.
// The QA lead's source note: the row lives on Customers -> customer -> Invoices tab, and its
// right-hand action cell holds the print icon AND "Cash Out". Cash Out is the refund-shaped action.
// Read-only: opens menus/dialogs to READ them and Escapes. Nothing is committed (core 7.5); every
// non-GET call is printed.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const CUST = '97734382-36a3-4f04-9226-a97bd662ec24';
const CM = '83baae01-89bb-4b42-b27f-2a7968fbf932';
const log = (...a) => console.log(...a);
const nonGet = [];
const { browser, page } = await boot(`/customers/${CUST}/invoices`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,220); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });

await page.waitForTimeout(5000);
const txt = await page.evaluate(() => document.body.innerText || '');
log('Invoices tab shows CM-100:', /CM-100/.test(txt));
await page.screenshot({ path: `${EV}/credit-row-invoices-tab.png`, fullPage: true }).catch(() => {});

// the print control the source note names, keyed by the credit memo id
const printId = `button_print_credit_memo_${CM}`;
const hasPrint = await page.locator(`[data-test-id="${printId}"]`).count();
log(`print control ${printId}: ${hasPrint ? 'PRESENT' : 'absent'}`);

// every action-ish control on the row's cell
const acts = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e => e.getAttribute('data-test-id'))
  .filter(i => /credit|cash|refund|void|apply|print|action|menu/i.test(i)));
log('credit/action test-ids on this tab:');
[...new Set(acts)].forEach(i => log('   ', i));

// open the "Cash Out" control to READ what it offers
for (const sel of ['[data-test-id*="cash_out" i]', '[data-test-id*="cashout" i]']) {
  const l = page.locator(sel).first();
  if (await l.count()) {
    log(`\nopening ${sel} to read it`);
    const b4 = nonGet.length;
    await l.click({ timeout: 10000, force: true }).catch(e => log('  click failed:', String(e).slice(0,80)));
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${EV}/credit-cash-out-dialog.png`, fullPage: true }).catch(() => {});
    const dlg = await page.evaluate(() => {
      const d = document.querySelector('.q-dialog');
      if (!d) return null;
      return { text: (d.innerText||'').slice(0,700),
               controls: [...d.querySelectorAll('button,input,label,[data-test-id]')]
                 .map(e=>({t:(e.innerText||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ').slice(0,40),
                           id:e.getAttribute('data-test-id')||''})).filter(x=>x.t||x.id) };
    });
    if (dlg) { log('  dialog text:', JSON.stringify(dlg.text.slice(0,300)));
               log('  dialog controls:'); dlg.controls.slice(0,22).forEach(c=>log(`     ${JSON.stringify(c.t).padEnd(34)} ${c.id}`)); }
    else log('  no dialog appeared');
    log(`  non-GET calls from opening it: ${nonGet.length-b4}`);
    await page.keyboard.press('Escape');
    break;
  }
}
fs.writeFileSync(`${DIR}/credit-actions.json`, JSON.stringify({ hasPrint: !!hasPrint, actionIds: [...new Set(acts)], nonGet }, null, 1));
log(`\nNON-GET CALLS THIS RUN (expect 0): ${nonGet.length}`);
nonGet.forEach(c => log('   ', c));
await browser.close();
