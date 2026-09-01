// observe_authorizer_flow.mjs — C44923 (a newly ticked "Approves Work" contact becomes selectable
// immediately) and C45191 (a user without work-order edit sees the Authorizer as read-only).
//
// C44923 is specifically about NOT refreshing the work order, so the work order page is opened in
// one tab and left alone; the contact is edited in a SECOND tab; then the first tab's Authorizer
// list is opened without any reload. A reload would test nothing.
import { boot, APP, apiGet, apiPost, sess } from './boot8218.mjs';
import fs from 'fs';
const OUT = 'build/invoice-ui-refresh/build-verify-2026-08-31/remaining-6-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const WO = process.env.WO, CID = process.env.CID, CONTACT = process.env.CONTACT, NAME = process.env.NAME;
const log = [];
const L = (...a) => { const s = a.join(' '); console.log(s); log.push(s); };

const settle = async (page, min = 1200) => {
  await page.waitForFunction((m) => (document.body?.innerText || '').length > m, min, { timeout: 60000 })
    .catch(() => {});
  await page.waitForTimeout(3000);
};

// open the Authorizer select and list its options, without reloading the page
async function authorizerOptions(page) {
  const sel = await page.evaluateHandle(() =>
    [...document.querySelectorAll('.q-select')]
      .find(e => /authoriz/i.test(e.querySelector('.q-field__label')?.textContent || '')) || null);
  const el = sel.asElement();
  if (!el) return { opened: false, options: [] };
  await el.click().catch(() => {});
  await page.waitForTimeout(2500);
  const options = await page.evaluate(() =>
    [...document.querySelectorAll('.q-menu .q-item, .q-menu [role="option"]')]
      .map(e => e.textContent.trim()).filter(Boolean));
  await page.keyboard.press('Escape').catch(() => {});
  return { opened: true, options };
}

const { browser, ctx, page } = await boot('/workorders');

// ---------- C44923 ----------
await page.goto(`${APP}/workorders/${WO}`, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await settle(page);
const before = await authorizerOptions(page);
L('C44923 BEFORE  opened:', before.opened, '| options:', JSON.stringify(before.options));
L('C44923 target contact:', NAME, CONTACT, '| already listed:', before.options.some(o => o.includes(NAME)));

// tick "Approves Work" in a SECOND tab; the work-order tab is never touched
const tab2 = await ctx.newPage();
await tab2.goto(`${APP}/customers/${CID}/contacts`, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await settle(tab2);
L('C44923 contacts tab landed:', tab2.url());
const tick = await tab2.evaluate((name) => {
  const rows = [...document.querySelectorAll('tr')];
  const row = rows.find(r => (r.innerText || '').includes(name));
  if (!row) return { found: false, rowCount: rows.length,
                     sample: rows.slice(0, 6).map(r => (r.innerText || '').replace(/\s+/g, ' ').slice(0, 70)) };
  row.click();
  return { found: true, text: (row.innerText || '').replace(/\s+/g, ' ').slice(0, 140) };
}, NAME);
L('C44923 contact row:', JSON.stringify(tick));
await tab2.waitForTimeout(3500);
const dlg = await tab2.evaluate(() => {
  const cb = document.querySelector('[data-test-id="input_checkbox_is_authorizer"]')
          || [...document.querySelectorAll('.q-checkbox')].find(e => /approves work/i.test(e.textContent || ''));
  if (!cb) return { checkboxFound: false, dialogText: (document.body?.innerText || '').slice(-600) };
  const aria = cb.getAttribute('aria-checked') || cb.querySelector('[aria-checked]')?.getAttribute('aria-checked');
  cb.click();
  return { checkboxFound: true, wasChecked: aria };
});
L('C44923 "Approves Work" control:', JSON.stringify(dlg).slice(0, 400));
if (dlg.checkboxFound) {
  await tab2.waitForTimeout(1200);
  const saved = await tab2.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(e => /^\s*(save|update)\b/i.test(e.innerText || ''));
    if (!b) return false; b.click(); return true;
  });
  L('C44923 save clicked:', saved);
  await tab2.waitForTimeout(4000);
}
// confirm the flag really changed, from the record rather than from the screen
const chk = await apiGet(`/api/customers/view/${CID}`);
const cons = chk.body?.data?.contacts || chk.body?.data?.company?.contacts || [];
const target = cons.find(c => c.id === CONTACT);
L('C44923 is_authorizer on the record now:', target ? target.is_authorizer : 'CONTACT NOT FOUND');

// back to the untouched work-order tab - no reload, no re-save
await page.bringToFront();
await page.waitForTimeout(2500);
const after = await authorizerOptions(page);
L('C44923 AFTER (no refresh) options:', JSON.stringify(after.options));
L('C44923 RESULT: newly enabled contact selectable without refresh =',
  after.options.some(o => o.includes(NAME)));
await page.screenshot({ path: `${OUT}/evidence/c44923-authorizer-list.png` });

fs.writeFileSync(`${OUT}/evidence/c44923.json`,
  JSON.stringify({ before, tick, dlg, after, recordFlag: target?.is_authorizer }, null, 1));
fs.writeFileSync(`${OUT}/evidence/c44923.log`, log.join('\n') + '\n');
await browser.close();
