// capture3.mjs — redo two checks that capture2 got wrong, and do them in isolation.
//
// WHAT WENT WRONG IN capture2 (skill 03 §8.0-b — the instrument, not the build):
//  * it clicked button_more_options_inline_part, which opens the FULL "New Part Request" modal, and
//    then typed and cancelled behind that modal. The "confirmation shown" it reported was just that
//    modal still open. Discard protection must be tested on a clean inline row, nothing else open.
//  * it looked for Bin Allocation on an EMPTY add row. Bins belong to a stocked catalogue part, so
//    absence before a part is chosen proves nothing. A part must be selected first.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = (n, o) => fs.writeFileSync(`${OUT}/evidence/${n}`, JSON.stringify(o, null, 1));
const WO = process.env.WO;
const { browser, page } = await boot('/workorders');
const settle = async (m = 1200) => {
  await page.waitForFunction(x => (document.body?.innerText || '').length > x, m, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);
};
const fresh = async () => {
  await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await settle();
  await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
  await page.waitForTimeout(4000);
  return page.evaluate(() => !!document.querySelector('[data-test-id="inline_part_row"]'));
};

// ---------- A. discard protection, in isolation ----------
L('=== A. unsaved-data protection, clean row, nothing else open ===');
L('  inline row open:', await fresh());
const noDialogBefore = await page.evaluate(() => !document.querySelector('.q-dialog'));
L('  POSITIVE CONTROL - no dialog on screen before we start:', noDialogBefore);
await page.evaluate(() => {
  const d = document.querySelector('[data-test-id="input_inline_part_description"]');
  if (d) { d.focus(); d.value = 'ZZAUTOTEST discard check';
           d.dispatchEvent(new Event('input', { bubbles: true })); }
});
await page.waitForTimeout(1500);
const typedValue = await page.evaluate(() =>
  document.querySelector('[data-test-id="input_inline_part_description"]')?.value);
L('  description now holds:', JSON.stringify(typedValue));
await page.evaluate(() => document.querySelector('[data-test-id="button_cancel_inline_part"]')?.click());
await page.waitForTimeout(3500);
const afterCancel = await page.evaluate(() => {
  const dlg = document.querySelector('.q-dialog');
  return { dialogShown: !!dlg,
    text: dlg ? (dlg.innerText || '').replace(/\s+/g, ' ').slice(0, 400) : '',
    buttons: dlg ? [...dlg.querySelectorAll('button')].map(b => (b.innerText || '').replace(/\s+/g,' ').trim()).filter(Boolean) : [],
    rowStillOpen: !!document.querySelector('[data-test-id="inline_part_row"]') };
});
L('  discard confirmation shown:', afterCancel.dialogShown);
L('  its text                  :', JSON.stringify(afterCancel.text));
L('  its buttons               :', JSON.stringify(afterCancel.buttons));
L('  inline row still open     :', afterCancel.rowStillOpen);
save('discard-clean.json', { noDialogBefore, typedValue, ...afterCancel });
await page.screenshot({ path: `${OUT}/evidence/discard-clean.png`, fullPage: true });

// ---------- B. Escape instead of the cancel control ----------
L('\n=== B. same thing with the Escape key ===');
L('  inline row open:', await fresh());
await page.evaluate(() => {
  const d = document.querySelector('[data-test-id="input_inline_part_description"]');
  if (d) { d.focus(); d.value = 'ZZAUTOTEST escape check';
           d.dispatchEvent(new Event('input', { bubbles: true })); }
});
await page.waitForTimeout(1200);
await page.keyboard.press('Escape');
await page.waitForTimeout(3000);
const afterEsc = await page.evaluate(() => {
  const dlg = document.querySelector('.q-dialog');
  return { dialogShown: !!dlg, text: dlg ? (dlg.innerText||'').replace(/\s+/g,' ').slice(0,300) : '',
           rowStillOpen: !!document.querySelector('[data-test-id="inline_part_row"]') };
});
L('  confirmation on Escape:', afterEsc.dialogShown, JSON.stringify(afterEsc.text));
L('  inline row still open :', afterEsc.rowStillOpen);
save('discard-escape.json', afterEsc);

// ---------- C. Bin Allocation, AFTER choosing a stocked catalogue part ----------
L('\n=== C. Bin Allocation - only meaningful once a part is chosen ===');
L('  inline row open:', await fresh());
const partPick = await page.evaluate(() => {
  const sel = document.querySelector('[data-test-id="select_inline_part_number"]');
  if (!sel) return { found: false };
  const input = sel.matches('input') ? sel : sel.querySelector('input');
  (input || sel).click();
  return { found: true };
});
await page.waitForTimeout(3000);
const options = await page.evaluate(() =>
  [...document.querySelectorAll('.q-menu .q-item')].map(e => (e.innerText||'').replace(/\s+/g,' ').trim()).slice(0, 12));
L('  part-number list opened:', partPick.found, '| first options:', JSON.stringify(options.slice(0, 6)));
if (options.length) {
  await page.evaluate(() => document.querySelector('.q-menu .q-item')?.click());
  await page.waitForTimeout(4500);
}
const bins = await page.evaluate(() => {
  const ids = [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id'));
  const t = document.body?.innerText || '';
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  return {
    binIds: [...new Set(ids)].filter(x => /bin|on.?hand|allocat|stock/i.test(x)).slice(0, 25),
    binInText: /\bbin\b/i.test(t), onHandInText: /on hand|on-hand/i.test(t),
    rowText: row ? (row.innerText||'').replace(/\s+/g,' ').slice(0, 600) : null,
    rowIds: row ? [...new Set([...row.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))] : [],
  };
});
L('  bin-ish test-ids anywhere:', JSON.stringify(bins.binIds));
L('  "bin" in page text       :', bins.binInText, '| "on hand":', bins.onHandInText);
L('  ids inside the row now   :', JSON.stringify(bins.rowIds));
L('  row text                 :', JSON.stringify(bins.rowText));
save('bins.json', { options, ...bins });
await page.screenshot({ path: `${OUT}/evidence/bins.png`, fullPage: true });
fs.appendFileSync(`${OUT}/evidence/capture.log`, '\n' + log.join('\n') + '\n');
await browser.close();
