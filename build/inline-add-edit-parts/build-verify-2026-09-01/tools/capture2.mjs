// capture2.mjs — field ORDER on the inline row, the "more options" panel (where Bin Allocation
// should live), the Edit control's behaviour, and the unsaved-data confirmation.
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
await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle();

// open the add row
await page.evaluate(() => document.querySelector('[data-test-id="button_add_part"]')?.click());
await page.waitForTimeout(4000);

// ---------- field order, read in DOM order inside the inline row ----------
const order = await page.evaluate(() => {
  const row = document.querySelector('[data-test-id="inline_part_row"]');
  if (!row) return { found: false };
  const wanted = ['input_inline_part_description','select_inline_part_number','input_inline_part_quantity',
                  'select_inline_part_category','input_inline_part_cost','input_inline_part_sell_price'];
  const all = [...row.querySelectorAll('[data-test-id]')];
  const seq = all.map(e => e.getAttribute('data-test-id')).filter(t => wanted.includes(t));
  const labels = [...row.querySelectorAll('.q-field__label')].map(e => e.textContent.trim());
  const legend = row.querySelector('[data-test-id="inline_part_row_legend"]')?.innerText?.replace(/\s+/g,' ').trim();
  return { found: true, sequence: [...new Set(seq)], labelsInOrder: labels, legend,
           rowText: (row.innerText || '').replace(/\s+/g,' ').slice(0, 500) };
});
L('--- inline row field order ---');
L('  test-id sequence :', JSON.stringify(order.sequence));
L('  labels in order  :', JSON.stringify(order.labelsInOrder));
L('  legend           :', JSON.stringify(order.legend));
save('field-order.json', order);
await page.screenshot({ path: `${OUT}/evidence/field-order.png`, fullPage: true });

// ---------- more options (bins?) ----------
const more = await page.evaluate(() => {
  const b = document.querySelector('[data-test-id="button_more_options_inline_part"]');
  if (!b) return { found: false };
  b.click(); return { found: true };
});
await page.waitForTimeout(3500);
const morePanel = await page.evaluate(() => {
  const ids = [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id'));
  const t = document.body?.innerText || '';
  return {
    binIds: [...new Set(ids)].filter(x => /bin|stock|on.?hand|allocat|warehouse/i.test(x)).slice(0, 25),
    binWords: /\bbin\b/i.test(t), onHand: /on hand|on-hand/i.test(t), defaultWord: /\bdefault\b/i.test(t),
    newIds: [...new Set(ids)].filter(x => /inline_part/i.test(x)).slice(0, 30),
    text: t.replace(/\s+/g,' ').slice(0, 800),
  };
});
L('\n--- more options panel (Bin Allocation lives here?) ---');
L('  clicked          :', more.found);
L('  bin-ish test-ids :', JSON.stringify(morePanel.binIds));
L('  "bin" in text    :', morePanel.binWords, '| "on hand":', morePanel.onHand, '| "Default":', morePanel.defaultWord);
L('  inline_part ids  :', JSON.stringify(morePanel.newIds));
save('more-options.json', morePanel);
await page.screenshot({ path: `${OUT}/evidence/more-options.png`, fullPage: true });

// ---------- unsaved-data protection: type something, then cancel ----------
const typed = await page.evaluate(() => {
  const d = document.querySelector('[data-test-id="input_inline_part_description"]');
  if (!d) return false;
  d.focus(); d.value = 'ZZAUTOTEST discard check';
  d.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
});
await page.waitForTimeout(1500);
await page.evaluate(() => document.querySelector('[data-test-id="button_cancel_inline_part"]')?.click());
await page.waitForTimeout(3000);
const confirm = await page.evaluate(() => {
  const dlg = document.querySelector('.q-dialog');
  return { dialogShown: !!dlg,
           text: dlg ? (dlg.innerText || '').replace(/\s+/g,' ').slice(0, 400) : '',
           buttons: dlg ? [...dlg.querySelectorAll('button')].map(b => (b.innerText||'').trim()).filter(Boolean) : [] };
});
L('\n--- unsaved-data protection (typed then cancelled) ---');
L('  typed into description:', typed);
L('  confirmation shown    :', confirm.dialogShown);
L('  dialog text           :', JSON.stringify(confirm.text));
L('  dialog buttons        :', JSON.stringify(confirm.buttons));
save('discard-confirm.json', confirm);
await page.screenshot({ path: `${OUT}/evidence/discard-confirm.png`, fullPage: true });
fs.appendFileSync(`${OUT}/evidence/capture.log`, '\n' + log.join('\n') + '\n');
await browser.close();
