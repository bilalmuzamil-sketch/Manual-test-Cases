// Annotated evidence for the corrected Enter finding.
//
// TWO separate things were measured, and the screenshots show both:
//   1. On a long result list, the row the panel highlights by itself is the EIGHTH, not the first.
//      (Measured: lists of 2, 3, 6 and 8 rows start on the first row; lists of 13, 22 and 41 rows
//      start on the eighth.)
//   2. Once you click a row yourself, THAT POSITION sticks -- and is re-applied to later searches,
//      including a different word, where it now points at a completely different record.
//
// Boxes and labels are drawn into the page before each screenshot, so the reader is not left to
// work out which row is which.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/enter-evidence`;
fs.mkdirSync(EV, { recursive: true });
const W1 = process.env.W1 || 'Truck';
const W2 = process.env.W2 || 'Repair';
const PICK = +(process.env.PICK || 4);          // zero-based: the fifth row
const R = { at: new Date().toISOString(), word1: W1, word2: W2, pickedRowNumber: PICK + 1 };
const save = () => fs.writeFileSync(`${DIR}/ENTER-ANNOTATED.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(5000);

const box = async (i, label, colour) => page.evaluate(([idx, text, col]) => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return false;
  const rows = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')];
  const el = rows[idx]; if (!el) return false;
  const r = el.getBoundingClientRect();
  const b = document.createElement('div');
  Object.assign(b.style, { position: 'fixed', left: (r.left - 4) + 'px', top: (r.top - 3) + 'px',
    width: (r.width + 8) + 'px', height: (r.height + 6) + 'px', border: '3px solid ' + col,
    borderRadius: '6px', zIndex: 2147483647, pointerEvents: 'none', boxSizing: 'border-box' });
  const t = document.createElement('div');
  t.textContent = text;
  Object.assign(t.style, { position: 'fixed', left: Math.max(4, r.left - 4) + 'px',
    top: Math.max(0, r.top - 26) + 'px', background: col, color: '#fff',
    font: '600 13px sans-serif', padding: '3px 9px', borderRadius: '4px',
    zIndex: 2147483647, pointerEvents: 'none', whiteSpace: 'nowrap' });
  b.className = t.className = '__anno';
  document.body.appendChild(b); document.body.appendChild(t);
  return true;
}, [i, label, colour]);
const clearAnno = () => page.evaluate(() => document.querySelectorAll('.__anno').forEach(e => e.remove()));

const openAndType = async q => {
  await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', q, { delay: 35 });
  let last = null, st = 0, m = null;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(800);
    m = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      if (!d) return null;
      const tabs = {};
      d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
        const t = (e.innerText || '').match(/\((\d+)\)/);
        tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null; });
      return { tabs, rows: [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
        i, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 58),
        active: /q-manual-focusable--focused|q-item--active|active|selected|highlight/i
                  .test((e.className || '').toString()) || e.getAttribute('aria-selected') === 'true' })) };
    });
    if (!m) continue;
    const sig = JSON.stringify(m);
    const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
    if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  return m;
};
const activeIdx = m => { const a = m && m.rows.find(r => r.active); return a ? a.i : null; };

// ---- shot 1: a long list, before anything is clicked -- the highlight is not the first row
{
  const m = await openAndType(W1);
  const a = activeIdx(m);
  R.beforeAnyClick = { rows: m.rows.length, highlighted: a,
    topRowText: m.rows[0] && m.rows[0].text, highlightedText: a != null && m.rows[a].text };
  await box(0, 'Row 1 - the top result, what Enter should open', '#1565c0');
  if (a != null && a !== 0) await box(a, `Row ${a + 1} - highlighted by the app, nothing pressed`, '#c62828');
  await page.screenshot({ path: `${EV}/N1-highlight-is-not-the-first-row.png` });
  await clearAnno();
  L('1 before any click: rows', m.rows.length, 'highlighted row', a != null ? a + 1 : 'none');
  save();
}

// ---- shot 2: click the fifth row by hand
{
  const m = await openAndType(W1);
  R.picked = { rowNumber: PICK + 1, text: m.rows[PICK] && m.rows[PICK].text };
  await box(PICK, `Row ${PICK + 1} - clicking this one by hand`, '#2e7d32');
  await page.screenshot({ path: `${EV}/N2-clicking-the-fifth-row.png` });
  await clearAnno();
  const b = await page.evaluate(i => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const el = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')][i];
    if (!el) return null; el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, PICK);
  if (b) { await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2);
    await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
    await page.waitForTimeout(5500); }
  R.picked.landedOn = new URL(page.url()).pathname;
  L('2 clicked row', PICK + 1, '->', R.picked.landedOn);
  save();
}

// ---- shot 3: the SAME word again -- same position, different record
{
  const m = await openAndType(W1);
  const a = activeIdx(m);
  R.sameWordAgain = { rows: m.rows.length, highlighted: a,
    highlightedText: a != null && m.rows[a].text,
    sameRowNumberAsPicked: a === PICK,
    sameRecordAsPicked: !!(a != null && R.picked.text && m.rows[a].text === R.picked.text) };
  await box(0, 'Row 1 - still the top result', '#1565c0');
  if (a != null) await box(a, `Row ${a + 1} - still highlighted, but a DIFFERENT record now`, '#c62828');
  await page.screenshot({ path: `${EV}/N3-same-position-different-record.png` });
  await clearAnno();
  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  R.sameWordAgain.enterOpened = new URL(page.url()).pathname;
  R.sameWordAgain.enterWentBackToWhatIPicked = R.sameWordAgain.enterOpened === R.picked.landedOn;
  L('3 same word again: highlighted row', a != null ? a + 1 : 'none',
    '| same record as picked:', R.sameWordAgain.sameRecordAsPicked,
    '| Enter ->', R.sameWordAgain.enterOpened);
  save();
}

// ---- shot 4: a DIFFERENT word -- the position follows
{
  const m = await openAndType(W2);
  const a = activeIdx(m);
  R.differentWord = { word: W2, rows: m.rows.length, highlighted: a,
    highlightedText: a != null && m.rows[a].text, sameRowNumberAsPicked: a === PICK };
  await box(0, 'Row 1 - the top result for a completely different word', '#1565c0');
  if (a != null) await box(a, `Row ${a + 1} - the position followed across searches`, '#c62828');
  await page.screenshot({ path: `${EV}/N4-position-follows-a-different-word.png` });
  await clearAnno();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  R.differentWord.enterOpened = new URL(page.url()).pathname;
  L('4 different word:', W2, '| highlighted row', a != null ? a + 1 : 'none',
    '| Enter ->', R.differentWord.enterOpened);
  save();
}

R.conclusion = {
  theHighlightStartsOnTheEighthRowOfALongList: R.beforeAnyClick.highlighted,
  clickingARowMakesThatPositionStick: R.sameWordAgain.sameRowNumberAsPicked,
  thePositionFollowsToADifferentSearch: R.differentWord.sameRowNumberAsPicked,
  itIsThePositionNotTheRecord: R.sameWordAgain.sameRowNumberAsPicked && !R.sameWordAgain.sameRecordAsPicked,
};
save();
L('\nCONCLUSION', JSON.stringify(R.conclusion, null, 2));
await browser.close();
