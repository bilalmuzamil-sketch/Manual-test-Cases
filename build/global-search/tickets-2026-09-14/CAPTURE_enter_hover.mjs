// THE QA LEAD'S THIRD ACCOUNT, 2026-09-15, tested as stated -- and testing MY OWN INSTRUMENT with it.
//
//   1. same keyword, having clicked the 8th before -> the 8th is selected again
//   2. same keyword, NOT clicked -- only MOUSED OVER the 9th and then moved the mouse away
//      -> use the same keyword again -> the 9th is auto-selected
//   3. a NEW keyword with no hovering at all -> the FIRST stays selected
//
// WHY THIS MATTERS FOR MY EARLIER RUNS. Every previous script clicked a row with page.mouse and then
// LEFT THE POINTER SITTING THERE. The modal reopens in the same screen position, so the pointer is
// still hovering whatever now occupies that spot. "The position stuck" may be nothing more than my
// own cursor parked on row 5. That would make the current SV-10061 wrong for the second time, from
// the same family of mistake: the instrument changing what it measures.
//
// So: the pointer is PARKED in a corner, away from the modal, before every single reading, and the
// parking is verified by reading the hovered element back from the page.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/enter-evidence`;
fs.mkdirSync(EV, { recursive: true });
const W1 = process.env.W1 || 'Truck';
const W2 = process.env.W2 || 'Trailer';
const HOVER_ROW = +(process.env.HOVER_ROW || 8);   // zero-based: the ninth row
const R = { at: new Date().toISOString(), word1: W1, word2: W2, hoveredRowNumber: HOVER_ROW + 1, steps: {} };
const save = () => fs.writeFileSync(`${DIR}/ENTER-HOVER.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(5000);

// Park the pointer far from the modal and CHECK it is not over a result row.
const park = async () => {
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    const el = document.elementFromPoint(5, 5);
    const row = el && el.closest && el.closest('[data-test-id^="search_result_row_"]');
    return { overARow: !!row, tag: el ? el.tagName.toLowerCase() : null };
  });
};

const read = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return null;
  const tabs = {};
  d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
    const t = (e.innerText || '').match(/\((\d+)\)/);
    tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null; });
  return { tabs, rows: [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
    i, text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 56),
    cls: (e.className || '').toString().slice(0, 90),
    // separated deliberately: a HOVER class and a KEYBOARD-FOCUS class are different things, and
    // lumping them together is what made "highlighted" ambiguous in every earlier run
    focused: /q-manual-focusable--focused/i.test((e.className || '').toString())
             || e.getAttribute('aria-selected') === 'true',
    activeish: /q-item--active|\bactive\b|\bselected\b|highlight/i.test((e.className || '').toString()),
    hovered: /hover/i.test((e.className || '').toString()) })) };
});

const openAndType = async q => {
  await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3200);
  await park();
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', q, { delay: 35 });
  let last = null, st = 0, m = null;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(800);
    m = await read();
    if (!m) continue;
    const sig = JSON.stringify(m.tabs) + m.rows.length;
    const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
    if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  await park();                       // read with the pointer away, always
  await page.waitForTimeout(600);
  return await read();
};
const marks = m => {
  if (!m) return null;
  const f = m.rows.find(r => r.focused), a = m.rows.find(r => r.activeish), h = m.rows.find(r => r.hovered);
  return { rows: m.rows.length,
    focusedRow: f ? f.i + 1 : null, focusedText: f ? f.text : null,
    activeishRow: a ? a.i + 1 : null, hoveredRow: h ? h.i + 1 : null };
};

// ---------- STEP 1: a fresh word, nothing hovered, nothing clicked
{
  const m = await openAndType(W1);
  R.steps['1_freshWord_noHover'] = { ...marks(m), parked: await park(),
    firstRowText: m && m.rows[0] && m.rows[0].text };
  await page.screenshot({ path: `${EV}/H1-fresh-word-pointer-parked.png` });
  L('1 fresh word, pointer parked:', JSON.stringify(R.steps['1_freshWord_noHover']));
  save();
}

// ---------- STEP 2: same word. HOVER the ninth row, then move the pointer away. No click.
{
  const m = await openAndType(W1);
  const target = m && m.rows[Math.min(HOVER_ROW, m.rows.length - 1)];
  R.steps['2_hoverThenLeave'] = { rowsAvailable: m ? m.rows.length : 0,
    rowHovered: target ? { n: target.i + 1, text: target.text } : null };
  if (target) {
    const b = await page.evaluate(i => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      const el = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')][i];
      if (!el) return null;
      const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
    }, target.i);
    if (b) {
      await page.mouse.move(b.x + b.w / 2, b.y + b.h / 2);   // hover only -- NO click
      await page.waitForTimeout(1200);
      R.steps['2_hoverThenLeave'].whileHovering = marks(await read());
      // leave the list the way a person would: straight out to the side, touching no other row
      await page.mouse.move(b.x + b.w + 240, b.y);
      await page.waitForTimeout(500);
      await park();
      R.steps['2_hoverThenLeave'].afterLeaving = marks(await read());
      R.steps['2_hoverThenLeave'].parked = await park();
    }
  }
  await page.screenshot({ path: `${EV}/H2-hovered-then-left.png` });
  L('2 hovered row', HOVER_ROW + 1, 'then left:', JSON.stringify(R.steps['2_hoverThenLeave']).slice(0, 400));
  save();
}

// ---------- STEP 3: the SAME word again, pointer parked the whole time. Is the hovered row selected?
{
  const m = await openAndType(W1);
  const mk = marks(m);
  R.steps['3_sameWordAfterHover'] = { ...mk, parked: await park(),
    theHoveredRowIsSelectedAgain: mk && mk.focusedRow === HOVER_ROW + 1 };
  await page.screenshot({ path: `${EV}/H3-same-word-after-hover.png` });
  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  R.steps['3_sameWordAfterHover'].enterOpened = new URL(page.url()).pathname;
  R.steps['3_sameWordAfterHover'].enterNavigated = before !== new URL(page.url()).pathname;
  L('3 same word after hover:', JSON.stringify(R.steps['3_sameWordAfterHover']).slice(0, 400));
  save();
}

// ---------- STEP 4: a NEW word, no hovering at all. Does the first row stay selected?
{
  const m = await openAndType(W2);
  const mk = marks(m);
  R.steps['4_newWord_noHover'] = { ...mk, parked: await park(),
    theFirstRowIsSelected: mk && mk.focusedRow === 1,
    firstRowText: m && m.rows[0] && m.rows[0].text };
  await page.screenshot({ path: `${EV}/H4-new-word-no-hover.png` });
  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  R.steps['4_newWord_noHover'].enterOpened = new URL(page.url()).pathname;
  L('4 new word, no hover:', JSON.stringify(R.steps['4_newWord_noHover']).slice(0, 400));
  save();
}

R.conclusion = {
  freshWordWithNoHover_selectedRow: R.steps['1_freshWord_noHover'].focusedRow,
  hoverAloneLeavesItSelected: !!R.steps['3_sameWordAfterHover'].theHoveredRowIsSelectedAgain,
  newWordWithNoHover_firstRowSelected: !!R.steps['4_newWord_noHover'].theFirstRowIsSelected,
  note: 'If step 1 shows row 1 selected, then my earlier "the highlight starts on the eighth row" '
      + 'was my own pointer parked over the list, not the product.',
};
save();
L('\nCONCLUSION', JSON.stringify(R.conclusion, null, 2));
await browser.close();
