// Re-check SV-10059: does the recently-viewed list come back after a search that finds nothing?
// The QA lead says it looks like it works as expected in V2.
//
// MY EARLIER READING COUNTED [data-test-id^="search_result_row_"] AND FOUND NONE. That may be the
// whole error: a recently-viewed row is not a search RESULT, so it very likely carries a different
// test id. Counting the wrong elements and reporting "nothing is listed" is the same family of
// mistake as the pointer one (L0117) -- so this dumps EVERY test id and every visible line in the
// panel instead of assuming which one to count.
//
// Pointer parked and verified before every reading.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/history-evidence`;
fs.mkdirSync(EV, { recursive: true });
const NOMATCH = process.env.NOMATCH || 'zzzqqqxxxnothing';
const R = { at: new Date().toISOString(), noMatchWord: NOMATCH, steps: {} };
const save = () => fs.writeFileSync(`${DIR}/HISTORY-CHECK.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(6000);

const park = async () => { await page.mouse.move(5, 5); await page.waitForTimeout(350);
  return page.evaluate(() => { const el = document.elementFromPoint(5, 5);
    return !!(el && el.closest && el.closest('.q-dialog')); }); };

// Read EVERYTHING the panel is showing, without deciding in advance what counts.
const dump = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return null;
  const ids = {};
  d.querySelectorAll('[data-test-id]').forEach(e => {
    if (!vis(e)) return;
    const k = e.getAttribute('data-test-id').replace(/_\d+$/, '');
    ids[k] = (ids[k] || 0) + 1;
  });
  // every clickable-looking line, whatever it is called
  const clickable = [...d.querySelectorAll('[data-test-id],li,.q-item')].filter(vis)
    .filter(e => (e.innerText || '').trim().length > 2 && e.children.length < 12)
    .map(e => ({ id: e.getAttribute('data-test-id'),
                 text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 62) }));
  return { testIdCounts: ids,
           panelText: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 400),
           lines: clickable.slice(0, 30),
           inputValue: (d.querySelector('[data-test-id="search_modal_input"]') || {}).value };
});

const openModal = async () => {
  await park();
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await park();
};
const settle = async () => {
  let last = null, st = 0, m = null;
  for (let i = 0; i < 25; i++) {
    await page.waitForTimeout(700);
    m = await dump(); if (!m) continue;
    const sig = JSON.stringify(m.testIdCounts) + m.lines.length;
    if (sig === last) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  await park();
  return await dump();
};

// ---- 1. box empty: what does the panel show when you have not typed?
await openModal();
{
  const m = await settle();
  R.steps['1_emptyBox'] = m;
  await page.screenshot({ path: `${EV}/hist-1-empty-box.png` });
  L('1 empty box | ids:', JSON.stringify(m && m.testIdCounts));
  L('   text:', (m && m.panelText || '').slice(0, 160));
  save();
}

// ---- 2. type something that matches nothing
{
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', NOMATCH, { delay: 35 });
  const m = await settle();
  R.steps['2_noMatch'] = m;
  await page.screenshot({ path: `${EV}/hist-2-no-match.png` });
  L('2 no match  | ids:', JSON.stringify(m && m.testIdCounts));
  L('   text:', (m && m.panelText || '').slice(0, 200));
  save();
}

// ---- 3. clear the box again -- does the list come back?
{
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.waitForTimeout(2500);
  const m = await settle();
  R.steps['3_clearedAgain'] = m;
  await page.screenshot({ path: `${EV}/hist-3-cleared-again.png` });
  L('3 cleared   | ids:', JSON.stringify(m && m.testIdCounts));
  save();
}

// ---- 4. the QA lead's V1 route: type a real word, press Enter, then reopen the panel
{
  await openModal();
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', 'Truck', { delay: 35 });
  await settle();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  await openModal();
  const m = await settle();
  R.steps['4_reopenedAfterOpeningARecord'] = m;
  await page.screenshot({ path: `${EV}/hist-4-reopened-after-enter.png` });
  L('4 reopened  | ids:', JSON.stringify(m && m.testIdCounts));
  L('   text:', (m && m.panelText || '').slice(0, 200));
  save();
}

// ---- 5. and now a no-match search from THAT state
{
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', NOMATCH, { delay: 35 });
  const m = await settle();
  R.steps['5_noMatchAfterHistoryExists'] = m;
  await page.screenshot({ path: `${EV}/hist-5-no-match-with-history.png` });
  L('5 no match, history known to exist | ids:', JSON.stringify(m && m.testIdCounts));
  L('   text:', (m && m.panelText || '').slice(0, 250));
  save();
}

// ---- 6. THE DECISIVE ONE: the V2 equivalent of the QA lead's V1 route. After a search that finds
// nothing, close the panel and open it again -- in V1 you click the field again and the history is
// there. If V2 does the same, the two versions behave alike and there is nothing to fix.
{
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
  await openModal();
  const m = await settle();
  R.steps['6_reopenedAfterNoMatch'] = m;
  await page.screenshot({ path: `${EV}/hist-6-reopened-after-no-match.png` });
  L('6 reopened after a no-match search | ids:', JSON.stringify(m && m.testIdCounts));
  save();
}

// count RECENT rows by their own test id, not by "lines" -- the tabs and the keyboard legend are
// lines too, and counting those is how a no-match panel looked like it still had a list in it
const recentRows = k => {
  const ids = ((R.steps[k] || {}).testIdCounts) || {};
  return Object.entries(ids)
    .filter(([n]) => n.startsWith('search_result_row_recent'))
    .reduce((a, [, n]) => a + n, 0);
};
const linesOf = k => ((R.steps[k] || {}).lines || []).length;
R.conclusion = {
  recentRows_emptyBox: recentRows('1_emptyBox'),
  recentRows_whileShowingNoResults: recentRows('2_noMatch'),
  recentRows_afterClearingTheBoxAgain: recentRows('3_clearedAgain'),
  recentRows_afterReopeningFollowingANoMatch: recentRows('6_reopenedAfterNoMatch'),
  theListIsHiddenOnlyWhileTheNoResultsMessageIsShowing:
    recentRows('2_noMatch') === 0 && recentRows('3_clearedAgain') > 0,
  reopeningBringsItBack: recentRows('6_reopenedAfterNoMatch') > 0,
};
save();
L('\nCONCLUSION', JSON.stringify(R.conclusion, null, 2));
await browser.close();
