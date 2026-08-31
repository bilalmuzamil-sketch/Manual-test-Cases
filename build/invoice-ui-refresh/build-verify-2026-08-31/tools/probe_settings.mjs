// The invoice settings dialog, WITH A CONTROL THAT MUST FIRE.
//
// The first attempt reported all nine labels "absent" -- including 'Labor rate' and
// 'Summarize labor total', which an EARLIER run had already captured from this very dialog. That
// is proof the dialog never opened, not proof the labels are missing. A probe whose negatives
// include a known-present string has not fired, and its negatives must be discarded.
//
// So this run REFUSES to report anything unless it first sees a POSITIVE control inside the open
// dialog. Only then are the remaining absences meaningful (Rule 12: absent must be OBSERVED).
import { boot, APP } from './boot8218.mjs';
import fs from 'fs';
const DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31';
const EV = `${DIR}/evidence`; fs.mkdirSync(EV, { recursive: true });
const WO = JSON.parse(fs.readFileSync('/tmp/wo.json', 'utf8'));
const log = (...a) => console.log(...a);
const CONTROL = 'Labor rate';          // proven present in this dialog on an earlier run

const { browser, page } = await boot(`/workorders/${WO.id}/lines`);
await page.waitForSelector('[data-test-id="link_finance_tab"]', { timeout: 30000 }).catch(() => {});
await page.locator('[data-test-id="link_finance_tab"]').first().click({ timeout: 10000 }).catch(() => {});
await page.waitForTimeout(4000);

const st = page.locator('[data-test-id="button_invoice_settings"]').first();
log('settings button present:', await st.count());
await st.click({ timeout: 10000 }).catch(e => log('click failed:', String(e).slice(0, 90)));
// wait for the dialog to actually contain the control, rather than waiting a fixed time
let ok = false;
for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => document.body.innerText || '');
  if (t.includes(CONTROL)) { ok = true; break; }
}
log(`positive control ${JSON.stringify(CONTROL)} visible: ${ok}`);
if (!ok) {
  log('*** the dialog did not open. REPORTING NOTHING -- every "absent" from this run would be an artefact.');
  await page.screenshot({ path: `${EV}/settings-failed-to-open.png`, fullPage: true }).catch(() => {});
  await browser.close(); process.exit(3);
}

// scroll whatever actually scrolls, then read the whole dialog
await page.evaluate(async () => {
  const cands = [...document.querySelectorAll('.q-dialog *')].filter(e => e.scrollHeight > e.clientHeight + 20);
  for (const c of cands) for (let i = 0; i < 10; i++) { c.scrollTop = c.scrollHeight; await new Promise(r => setTimeout(r, 200)); }
});
await page.waitForTimeout(1000);
const text = await page.evaluate(() => {
  const d = [...document.querySelectorAll('.q-dialog')].filter(x => (x.innerText || '').includes('Labor rate'))[0]
         || document.querySelector('.q-dialog') || document.body;
  return d.innerText || '';
});
const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id*="setting" i],[data-test-id^="toggle_"]')]
  .map(e => e.getAttribute('data-test-id')).filter(Boolean));
fs.writeFileSync(`${DIR}/surface-invoice-settings-full.txt`, text);
await page.screenshot({ path: `${EV}/invoice-settings-full.png`, fullPage: true }).catch(() => {});
log(`\ndialog text: ${text.length} chars   setting test-ids: ${[...new Set(ids)].length}`);
[...new Set(ids)].forEach(i => log('   ', i));
log('\n--- LABEL CHECK (the control fired, so these negatives are real) ---');
for (const l of ['Labor rate', 'Labor hours', 'Labor price', 'Summarize labor total',
                 'Summarize parts total', 'Part number', 'Part description',
                 'Show declined work', 'Show %', 'declined', 'percent']) {
  log(`   ${l.padEnd(24)} ${text.toLowerCase().includes(l.toLowerCase()) ? 'FOUND' : 'absent'}`);
}
log('\n--- the dialog in full, as the tester sees it ---');
log(text.slice(0, 1600));
await page.keyboard.press('Escape');
await browser.close();
