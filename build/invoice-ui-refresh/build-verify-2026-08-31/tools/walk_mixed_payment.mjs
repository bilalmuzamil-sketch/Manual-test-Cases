// C45196 — pay one invoice with part CASH and part CUSTOMER CREDIT, then read the masthead.
// The API route 500s, which the playbook already predicts (:2339 "process via the UI when the API
// 500s"), so this drives the UI: WO Finance -> New Payment -> method -> amount -> Make Payment.
// Target: S2-15468, Balance $2,557.70 after the C45177 reversal. Positively identified.
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const ev = JSON.parse(fs.readFileSync(`${DIR}/c45177-evidence.json`, 'utf8'));
const WO = ev.target.wo_id, WONUM = ev.target.wo;
const COMMIT = process.argv.includes('--commit');
const log = (...a) => console.log(...a);
const nonGet = [], out = {};
const { browser, page } = await boot(`/workorders/${WO}/lines`);
page.on('request', r => { if (r.method() !== 'GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url())) {
  let b=''; try { b=(r.postData()||'').slice(0,260); } catch(_){}
  nonGet.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/,'')} BODY=${b}`); } });
page.on('response', r => { if (r.request().method()!=='GET' && /\/api\//.test(r.url()) && !/envelope/.test(r.url()))
  log(`   [resp] ${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/,'').slice(0,90)}`); });

const ok = await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 45000 }).then(()=>true).catch(()=>false);
log(`anchor link_finance_tab: ${ok ? 'PRESENT' : '*** NEVER APPEARED ***'}`);
if (!ok) { await browser.close(); process.exit(3); }
await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 12000 }).catch(()=>{});
await page.waitForSelector('[data-test-id="button_print_invoice"]', { timeout: 40000 }).catch(()=>{});
await page.waitForTimeout(3000);
log(`on ${WONUM} finance tab`);

const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e=>e.getAttribute('data-test-id')).filter(i=>/payment|deposit|credit|new/i.test(i)));
out.finance_ids = [...new Set(ids)];
log('payment controls here:'); out.finance_ids.forEach(i=>log('   ',i));

const np = page.locator('[data-test-id*="new_payment" i],[data-test-id*="add_payment" i]').first();
if (!(await np.count())) { log('\nno New Payment control on this tab'); }
else {
  const urlBefore = page.url();
  await np.click({ timeout: 12000, force: true }).catch(e=>log('click failed:',String(e).slice(0,70)));
  await page.waitForTimeout(4000);
  log(`  url before: ${urlBefore.replace(APP,'')}`);
  log(`  url after : ${page.url().replace(APP,'')}`);
  // it may NAVIGATE rather than open a dialog -- read whatever is now on screen
  const now = await page.evaluate(() => ({
    text: (document.body.innerText||'').slice(0,900),
    dialogs: document.querySelectorAll('.q-dialog').length,
    ids: [...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
          .filter(i=>/payment|method|amount|submit|confirm|make/i.test(i)),
  }));
  log(`  .q-dialog count: ${now.dialogs}`);
  log(`  payment-ish ids now: ${[...new Set(now.ids)].slice(0,16).join(', ')}`);
  log(`  screen text: ${JSON.stringify(now.text.slice(0,420))}`);
  out.after_click = now;
  const dlg = await page.evaluate(() => {
    const d=document.querySelector('.q-dialog'); if(!d) return null;
    return { text:(d.innerText||'').slice(0,700),
             controls:[...d.querySelectorAll('button,input,label,[data-test-id]')]
               .map(e=>({t:(e.innerText||e.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ').slice(0,40),
                         id:e.getAttribute('data-test-id')||''})).filter(x=>x.t||x.id) };
  });
  out.new_payment_dialog = dlg;
  if (dlg) {
    log('\nNew Payment dialog:'); log('  text:', JSON.stringify(dlg.text.slice(0,320)));
    dlg.controls.slice(0,26).forEach(c=>log(`     ${JSON.stringify(c.t).padEnd(30)} ${c.id}`));
  } else log('\nno dialog appeared');
  await page.screenshot({ path: `${EV}/new-payment-dialog.png`, fullPage: true }).catch(()=>{});
  if (!COMMIT) { log('\n--commit NOT passed. Nothing committed.'); await page.keyboard.press('Escape'); }
}
fs.writeFileSync(`${DIR}/mixed-payment-walk.json`, JSON.stringify({...out, commit:COMMIT, nonGet}, null, 1));
log(`\nNON-GET CALLS: ${nonGet.length}`); nonGet.forEach(c=>log('   ',c));
await browser.close();
