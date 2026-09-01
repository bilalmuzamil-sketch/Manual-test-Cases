// capture_surface.mjs — walk the whole Inline Add and Edit Parts surface on sv9315 and dump what is
// actually there, so the 119 cases can be judged against observation rather than assumption.
//
// The suite splits into seven areas: the Add Part button and Edit control, Tech View inline add,
// Tech View inline edit, Full View inline add, Full View edit, unsaved-data protection, and bin
// allocation. This captures the raw surface for each; verdicts come afterwards, per case.
//
// Every read waits for a real anchor first (skill 03 §8.0-b): a premature read reports every field
// absent on a page that plainly has them.
import { boot, APP } from './boot9315.mjs';
import fs from 'fs';
const OUT = 'build/inline-add-edit-parts/build-verify-2026-09-01';
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const log = []; const L = (...a) => { const s = a.map(String).join(' '); console.log(s); log.push(s); };
const save = (n, o) => fs.writeFileSync(`${OUT}/evidence/${n}`, JSON.stringify(o, null, 1));

const WO = process.env.WO, NUM = process.env.NUM;
const { browser, page } = await boot('/workorders');

const settle = async (min = 1200) => {
  await page.waitForFunction(m => (document.body?.innerText || '').length > m, min, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);
};
const tid = () => page.evaluate(() => [...document.querySelectorAll('[data-test-id]')]
  .map(e => e.getAttribute('data-test-id')));

await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await settle();
L(`work order ${NUM} lines tab: ${page.url()}`);

// ---------- 1. the Parts section and the Add Part button, per line ----------
const structure = await page.evaluate(() => {
  const addBtns = [...document.querySelectorAll('[data-test-id="button_add_part"]')];
  const editBtns = [...document.querySelectorAll('[data-test-id="button_edit_part"]')];
  const partRows = [...document.querySelectorAll('[data-test-id^="part_number_"]')];
  const label = (e) => (e.innerText || '').replace(/\s+/g, ' ').trim();
  return {
    addPartButtons: addBtns.length,
    addPartLabels: [...new Set(addBtns.map(label))],
    addPartVisible: addBtns.map(b => !!(b.offsetWidth || b.offsetHeight)),
    editControls: editBtns.length,
    editLabels: [...new Set(editBtns.map(label))],
    partRows: partRows.length,
    // column headers inside the parts area
    headers: [...new Set([...document.querySelectorAll('th, .q-table th, [class*="header"]')]
      .map(label).filter(x => x && x.length < 30))].slice(0, 30),
  };
});
L('\n--- Parts section structure ---');
L('  Add Part buttons      :', structure.addPartButtons, JSON.stringify(structure.addPartLabels));
L('  all visible           :', JSON.stringify(structure.addPartVisible));
L('  Edit controls         :', structure.editControls, JSON.stringify(structure.editLabels));
L('  existing part rows    :', structure.partRows);
L('  headers seen          :', JSON.stringify(structure.headers));
save('structure.json', structure);
await page.screenshot({ path: `${OUT}/evidence/lines-tab.png`, fullPage: true });

// ---------- 2. open the inline ADD row ----------
const beforeIds = await tid();
const opened = await page.evaluate(() => {
  const b = document.querySelector('[data-test-id="button_add_part"]');
  if (!b) return false; b.click(); return true;
});
L(`\n--- inline ADD row (Add Part clicked: ${opened}) ---`);
await page.waitForTimeout(4000);
const addRow = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input, .q-field, .q-select, textarea')];
  const seen = [];
  for (const e of inputs) {
    const lab = e.closest('.q-field')?.querySelector('.q-field__label')?.textContent?.trim()
             || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '';
    const t = e.closest('[data-test-id]')?.getAttribute('data-test-id')
           || e.getAttribute('data-test-id') || '';
    if (lab || t) seen.push({ label: lab, testId: t, tag: e.tagName.toLowerCase() });
  }
  return {
    fields: seen.filter(f => f.label || /part|qty|quantity|price|bin|desc|number/i.test(f.testId)),
    bodyDelta: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 900),
    hasSave: !!document.querySelector('[data-test-id*="save"],[data-test-id*="confirm"]'),
    closeControls: [...document.querySelectorAll('[data-test-id*="close"],[data-test-id*="cancel"],[aria-label*="lose"]')]
      .map(e => e.getAttribute('data-test-id') || e.getAttribute('aria-label')),
  };
});
const afterIds = await tid();
const newIds = afterIds.filter(x => !beforeIds.includes(x));
L('  NEW test-ids appearing:', JSON.stringify([...new Set(newIds)].slice(0, 30)));
L('  fields on the row     :', JSON.stringify(addRow.fields.slice(0, 20)));
L('  save control present  :', addRow.hasSave, '| close controls:', JSON.stringify(addRow.closeControls.slice(0, 6)));
save('add-row.json', { newIds: [...new Set(newIds)], ...addRow });
await page.screenshot({ path: `${OUT}/evidence/add-row.png`, fullPage: true });

fs.writeFileSync(`${OUT}/evidence/capture.log`, log.join('\n') + '\n');
await browser.close();
