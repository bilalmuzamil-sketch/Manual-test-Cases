// THE QA LEAD'S DIAGNOSIS, TESTED AS HE STATED IT (2026-09-15):
//
//   "The problem ONLY happens when you put the keyword and then manually click the 2nd/3rd/4th on
//    the list first, and then you put the same keyword again and hit enter -- in that case hitting
//    enter will take you to the same record you had manually selected. However, if you put a NEW
//    keyword and the record appears and you immediately hit enter, you will go to the first record."
//
// This is almost certainly why my earlier run "reproduced identically twice": it was not failing
// twice, it was remembering the choice I made the first time. A repeat that reuses the same query
// is not an independent second observation when the app remembers the query.
//
// Three phases, in order, on ONE fresh session:
//   A. a word NEVER used in this session -> Enter immediately. Expect: the first record.
//   B. same word, but click the THIRD row by hand.
//   C. same word again -> Enter. Does it go back to the record from B, or to the first?
//
// Plus a control: a second never-used word after C, to show A still holds once the app is "dirty".
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/enter-evidence`;
fs.mkdirSync(EV, { recursive: true });
// Words deliberately NOT used by any earlier script in this pass, so phase A is genuinely fresh.
const FRESH = process.env.FRESH || 'Hauling';
const CLICK_INDEX = +(process.env.CLICK_INDEX || 2);
const FRESH2 = process.env.FRESH2 || 'Cascadia';
const R = { at: new Date().toISOString(), freshWord: FRESH, secondFreshWord: FRESH2, phases: {} };
const save = () => fs.writeFileSync(`${DIR}/ENTER-STICKY.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(5000);

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
      const rows = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
        i, type: e.getAttribute('data-test-id').replace('search_result_row_', '').replace(/_\d+$/, ''),
        text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 58),
        active: /q-manual-focusable--focused|q-item--active|active|selected|highlight/i
                  .test((e.className || '').toString()) || e.getAttribute('aria-selected') === 'true' }));
      return { tabs, rows };
    });
    if (!m) continue;
    const sig = JSON.stringify(m);
    const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
    if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  return m;
};
const describe = m => ({
  rows: m ? m.rows.length : 0,
  top: m && m.rows[0] ? { i: 0, type: m.rows[0].type, text: m.rows[0].text } : null,
  highlighted: m && m.rows.find(r => r.active)
    ? (r => ({ i: r.i, type: r.type, text: r.text }))(m.rows.find(r => r.active)) : null,
});

// ---------------- A: a word never used this session, Enter straight away
{
  const m = await openAndType(FRESH);
  const d = describe(m);
  const before = new URL(page.url()).pathname;
  await page.screenshot({ path: `${EV}/A-fresh-word-before-enter.png` }).catch(() => {});
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  const after = new URL(page.url()).pathname;
  R.phases.A_freshWordEnter = { ...d, urlBefore: before, urlAfter: after, navigated: before !== after,
    highlightWasTheFirstRow: !!(d.highlighted && d.highlighted.i === 0) };
  L('A  fresh word, Enter immediately:', JSON.stringify(R.phases.A_freshWordEnter).slice(0, 320));
  save();
}

// ---------------- B: same word, click the THIRD row by hand
{
  const m = await openAndType(FRESH);
  // Guard the index. Asking for the sixth row of a three-row list clicks nothing, and the run then
  // reports the whole hypothesis as unproven when in fact it was never tested.
  let idx = CLICK_INDEX;
  if (m && m.rows.length && idx >= m.rows.length) idx = m.rows.length - 1;
  const third = m && m.rows[idx];
  R.phases.B_clickedThirdRow = { indexAsked: CLICK_INDEX, indexClicked: idx,
    rowsAvailable: m ? m.rows.length : 0,
    rowClicked: third ? { i: third.i, type: third.type, text: third.text } : null };
  if (!third) R.phases.B_clickedThirdRow.why = 'no row at that position -- nothing was clicked, so C and D prove nothing';
  if (third) {
    const box = await page.evaluate(i => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
      const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      const rows = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')];
      const el = rows[i]; if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height };
    }, idx);
    if (box) {
      await page.mouse.move(box.x + box.w / 2, box.y + box.h / 2);
      await page.mouse.down(); await page.waitForTimeout(80); await page.mouse.up();
      await page.waitForTimeout(5500);
    }
    R.phases.B_clickedThirdRow.landedOn = new URL(page.url()).pathname;
  }
  L('B  clicked the third row ->', JSON.stringify(R.phases.B_clickedThirdRow).slice(0, 300));
  save();
}

// ---------------- C: the SAME word again, Enter. Back to B's record, or to the first?
{
  const m = await openAndType(FRESH);
  const d = describe(m);
  const before = new URL(page.url()).pathname;
  await page.screenshot({ path: `${EV}/C-same-word-again-before-enter.png` }).catch(() => {});
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  const after = new URL(page.url()).pathname;
  const b = R.phases.B_clickedThirdRow.landedOn;
  R.phases.C_sameWordAgainEnter = { ...d, urlBefore: before, urlAfter: after,
    navigated: before !== after,
    wentBackToTheRecordIChose: after === b,
    sameAsPhaseA: after === R.phases.A_freshWordEnter.urlAfter,
    highlightWasTheFirstRow: !!(d.highlighted && d.highlighted.i === 0) };
  await page.screenshot({ path: `${EV}/C-same-word-again-after-enter.png` }).catch(() => {});
  L('C  same word again, Enter:', JSON.stringify(R.phases.C_sameWordAgainEnter).slice(0, 360));
  save();
}

// ---------------- D: control -- a DIFFERENT never-used word, after all that
{
  const m = await openAndType(FRESH2);
  const d = describe(m);
  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  const after = new URL(page.url()).pathname;
  R.phases.D_anotherFreshWord = { ...d, urlBefore: before, urlAfter: after,
    navigated: before !== after,
    highlightWasTheFirstRow: !!(d.highlighted && d.highlighted.i === 0) };
  L('D  another fresh word:', JSON.stringify(R.phases.D_anotherFreshWord).slice(0, 320));
  save();
}

// The hypothesis the first run pointed at: it is not the RECORD that is remembered, it is the
// POSITION. Phase B clicked index N; if C and D both highlight index N -- on the same word AND on
// a different word, each time a DIFFERENT record -- then the app is re-applying a remembered
// position to whatever list is now on screen.
const hi = k => (R.phases[k] && R.phases[k].highlighted) ? R.phases[k].highlighted.i : null;
R.conclusion = {
  indexClicked: R.phases.B_clickedThirdRow.indexClicked,
  clickActuallyHappened: !!R.phases.B_clickedThirdRow.rowClicked,
  highlightIndex: { A: hi('A_freshWordEnter'), C: hi('C_sameWordAgainEnter'), D: hi('D_anotherFreshWord') },
  positionStuckOnSameWord: hi('C_sameWordAgainEnter') === R.phases.B_clickedThirdRow.indexClicked,
  positionStuckOnADifferentWord: hi('D_anotherFreshWord') === R.phases.B_clickedThirdRow.indexClicked,
  sameRecordOrJustSamePosition:
    (R.phases.C_sameWordAgainEnter.wentBackToTheRecordIChose ? 'the same RECORD' : 'the same POSITION, a different record'),
  everHighlightedTheFirstRow: [hi('A_freshWordEnter'), hi('C_sameWordAgainEnter'), hi('D_anotherFreshWord')].includes(0),
};
save();
L('\nCONCLUSION', JSON.stringify(R.conclusion, null, 2));
await browser.close();
