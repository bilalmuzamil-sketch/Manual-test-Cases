// The last piece. The hover test showed:
//   1. fresh word, pointer parked          -> row 1 selected          (the QA lead's point 3)
//   2. hover row 9, move the mouse AWAY    -> row 9 STAYS selected    (his point 2, core mechanism)
//   3. same word after a full page reload  -> back to row 1
//
// Step 3 is the odd one, and it is probably my own doing: my helper navigates the whole page before
// each search, which a person never does. He reopens the panel on the SAME page -- and the written
// requirement says reopening restores the query and the result list, so the selection may well ride
// along with it.
//
// So this does it the way a person does: Escape, reopen with Ctrl+K on the same page, type the same
// word, and read the selection with the pointer parked.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/enter-evidence`;
fs.mkdirSync(EV, { recursive: true });
const W = process.env.W || 'Truck';
const HOVER_ROW = +(process.env.HOVER_ROW || 8);
const R = { at: new Date().toISOString(), word: W, hoveredRowNumber: HOVER_ROW + 1, steps: {} };
const save = () => fs.writeFileSync(`${DIR}/ENTER-HOVER-REOPEN.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(6000);

const park = async () => {
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    const el = document.elementFromPoint(5, 5);
    return { overARow: !!(el && el.closest && el.closest('[data-test-id^="search_result_row_"]')) };
  });
};
const read = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return null;
  const rows = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
    i, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 56),
    focused: /q-manual-focusable--focused/i.test((e.className || '').toString())
             || e.getAttribute('aria-selected') === 'true' }));
  const f = rows.find(r => r.focused);
  return { rows: rows.length, focusedRow: f ? f.i + 1 : null, focusedText: f ? f.text : null,
           firstRowText: rows[0] && rows[0].text,
           queryInBox: (document.querySelector('[data-test-id="search_modal_input"]') || {}).value };
});
const typeInto = async q => {
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', q, { delay: 35 });
  let last = null, st = 0, m = null;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(800);
    m = await read(); if (!m) continue;
    const sig = m.rows + '|' + m.firstRowText;
    if (sig === last && m.rows > 0) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  await park(); await page.waitForTimeout(500);
  return await read();
};
// draw a labelled box round a row, in the page, so the screenshots explain themselves
const box = async (i, label, colour) => page.evaluate(([idx, text, col]) => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return false;
  const el = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')][idx];
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const b = document.createElement('div');
  Object.assign(b.style, { position: 'fixed', left: (r.left - 4) + 'px', top: (r.top - 3) + 'px',
    width: (r.width + 8) + 'px', height: (r.height + 6) + 'px', border: '3px solid ' + col,
    borderRadius: '6px', zIndex: 2147483647, pointerEvents: 'none', boxSizing: 'border-box' });
  const t = document.createElement('div');
  t.textContent = text;
  Object.assign(t.style, { position: 'fixed', left: Math.max(4, r.left - 4) + 'px',
    top: Math.max(0, r.top - 25) + 'px', background: col, color: '#fff',
    font: '600 13px sans-serif', padding: '3px 9px', borderRadius: '4px',
    zIndex: 2147483647, pointerEvents: 'none', whiteSpace: 'nowrap' });
  b.className = t.className = '__anno';
  document.body.appendChild(b); document.body.appendChild(t);
  return true;
}, [i, label, colour]);
const clearAnno = () => page.evaluate(() => document.querySelectorAll('.__anno').forEach(e => e.remove()));

const openModal = async () => {
  await park();
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
};

// ---- 1. open once, search, hover the ninth row, move the pointer away. NO click, NO page reload.
await openModal();
{
  const m = await typeInto(W);
  R.steps['1_afterTyping'] = { focusedRow: m.focusedRow, rows: m.rows, firstRowText: m.firstRowText };
  L('1 after typing (pointer parked): row', m.focusedRow, 'of', m.rows);
  await box(0, 'Row 1 - selected on its own. Enter opens this. Correct.', '#2e7d32');
  await page.screenshot({ path: `${EV}/S1-typed-row-one-selected.png` });
  await clearAnno();

  const b = await page.evaluate(i => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const el = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')][i];
    if (!el) return null; const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, Math.min(HOVER_ROW, m.rows - 1));
  if (b) {
    await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2);
    await page.waitForTimeout(1200);
    R.steps['2_whileHovering'] = await read();
    await page.mouse.move(b.x + b.w + 260, b.y - 40);      // out to the side, over no other row
    await page.waitForTimeout(600);
    await park();
    R.steps['3_afterPointerLeft'] = await read();
    L('2 while hovering: row', R.steps['2_whileHovering'].focusedRow);
    L('3 pointer moved away: row', R.steps['3_afterPointerLeft'].focusedRow);
    await box(0, 'Row 1 - the top result, no longer the one Enter will open', '#1565c0');
    await box(Math.min(HOVER_ROW, m.rows - 1),
      'Row 9 - the mouse only PASSED OVER this, never clicked. The pointer has since left the list.',
      '#c62828');
    await page.screenshot({ path: `${EV}/S2-hovered-then-pointer-away.png` });
    await clearAnno();
    await page.screenshot({ path: `${EV}/R1-hovered-then-pointer-away.png` });
  }
  save();
}

// ---- 4. close the panel and REOPEN IT ON THE SAME PAGE, the way a person does. Same word.
{
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
  await openModal();
  const restored = await read();
  R.steps['4_onReopen_beforeTyping'] = restored;
  L('4 reopened, before typing: query in box', JSON.stringify(restored && restored.queryInBox),
    '| row', restored && restored.focusedRow);
  const m = await typeInto(W);
  R.steps['5_sameWordAgain'] = { ...m,
    theHoveredRowIsSelectedAgain: m.focusedRow === HOVER_ROW + 1,
    theFirstRowIsSelected: m.focusedRow === 1 };
  await box(0, 'Row 1 - the top result', '#1565c0');
  if (m.focusedRow) await box(m.focusedRow - 1,
    `Row ${m.focusedRow} - STILL selected after closing and reopening the search. Enter opens this.`,
    '#c62828');
  await page.screenshot({ path: `${EV}/S3-still-selected-after-reopen.png` });
  await clearAnno();
  await page.screenshot({ path: `${EV}/R2-same-word-after-reopen.png` });
  L('5 same word again (no reload):', JSON.stringify(R.steps['5_sameWordAgain']).slice(0, 300));
  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  R.steps['5_sameWordAgain'].enterOpened = new URL(page.url()).pathname;
  R.steps['5_sameWordAgain'].enterNavigated = before !== new URL(page.url()).pathname;
  L('   Enter ->', R.steps['5_sameWordAgain'].enterOpened);
  save();
}

R.conclusion = {
  typingSelectsTheFirstRow: R.steps['1_afterTyping'].focusedRow === 1,
  hoveringMovesTheSelection: !!(R.steps['2_whileHovering'] && R.steps['2_whileHovering'].focusedRow === HOVER_ROW + 1),
  itStaysAfterThePointerLeaves: !!(R.steps['3_afterPointerLeft'] && R.steps['3_afterPointerLeft'].focusedRow === HOVER_ROW + 1),
  itSurvivesClosingAndReopening: !!(R.steps['5_sameWordAgain'] && R.steps['5_sameWordAgain'].theHoveredRowIsSelectedAgain),
};
save();
L('\nCONCLUSION', JSON.stringify(R.conclusion, null, 2));
await browser.close();
