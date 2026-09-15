// Evidence for C55673: type a word, press Enter without touching an arrow key, and see which
// record opens.
//
// Two screenshots, both ANNOTATED in the page before capture so the reader does not have to work
// out what they are looking at:
//   1. the results as they appear, with the TOP result and the SILENTLY HIGHLIGHTED row both marked
//   2. the page that opened after Enter, marked with what it is
//
// The annotation is drawn into the DOM (absolutely positioned boxes and labels), so it survives the
// screenshot without needing an image editor.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV = `${DIR}/enter-evidence`;
fs.mkdirSync(EV, { recursive: true });
const QUERY = 'Bridgeport';
const R = { at: new Date().toISOString(), query: QUERY };
const save = () => fs.writeFileSync(`${DIR}/ENTER-KEY-EVIDENCE.json`, JSON.stringify(R, null, 2));

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(5000);

// draw a labelled box around an element, in the page
const annotate = async (selector, label, colour, nth) => page.evaluate(([sel, text, col, n]) => {
  const els = [...document.querySelectorAll(sel)];
  const el = n === undefined ? els[0] : els[n];
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const box = document.createElement('div');
  Object.assign(box.style, { position: 'fixed', left: (r.left - 4) + 'px', top: (r.top - 4) + 'px',
    width: (r.width + 8) + 'px', height: (r.height + 8) + 'px', border: '3px solid ' + col,
    borderRadius: '6px', zIndex: 2147483647, pointerEvents: 'none', boxSizing: 'border-box' });
  const tag = document.createElement('div');
  tag.textContent = text;
  Object.assign(tag.style, { position: 'fixed', left: (r.left - 4) + 'px',
    top: Math.max(0, r.top - 30) + 'px', background: col, color: '#fff', font: '600 13px sans-serif',
    padding: '3px 8px', borderRadius: '4px', zIndex: 2147483647, pointerEvents: 'none',
    whiteSpace: 'nowrap' });
  box.className = tag.className = '__anno';
  document.body.appendChild(box); document.body.appendChild(tag);
  return true;
}, [selector, label, colour, nth]);
const clearAnnotations = () => page.evaluate(() =>
  document.querySelectorAll('.__anno').forEach(e => e.remove()));

// --- open search and type, touching no arrow key
await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 });
await page.type('[data-test-id="search_modal_input"]', QUERY, { delay: 40 });

// settle on the per-type counts, not the total
let last = null, st = 0;
for (let i = 0; i < 40; i++) {
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if (!d) return null;
    const tabs = {}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
      const t = (e.innerText || '').match(/\((\d+)\)/);
      tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null; });
    return tabs; });
  if (!m) continue;
  const sig = JSON.stringify(m);
  const tc = Object.entries(m).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
  if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
  last = sig;
}

// --- what is on screen, and what is highlighted WITHOUT any arrow key
R.rows = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if (!d) return [];
  return [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
    i, tid: e.getAttribute('data-test-id'),
    type: e.getAttribute('data-test-id').replace('search_result_row_', '').replace(/_\d+$/, ''),
    text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70),
    // every way the app could be marking a row as the active one
    ariaSelected: e.getAttribute('aria-selected'),
    className: (e.className || '').toString(),
    looksActive: /active|selected|highlight|focus/i.test((e.className || '').toString())
                 || e.getAttribute('aria-selected') === 'true' }));
});
R.topRow = R.rows[0] || null;
R.highlighted = R.rows.filter(r => r.looksActive);
console.log('rows:', R.rows.length, '| top:', R.topRow && R.topRow.text);
console.log('highlighted without any arrow key:', JSON.stringify(R.highlighted.map(r => r.text)));

// --- annotate: the top result, and whatever is actually highlighted
await annotate('[data-test-id^="search_result_row_"]', 'TOP RESULT - this is what should open', '#1565c0', 0);
if (R.highlighted.length) {
  const idx = R.rows.findIndex(r => r.looksActive);
  if (idx > 0) await annotate('[data-test-id^="search_result_row_"]',
    'HIGHLIGHTED BY THE APP - no arrow key was pressed', '#c62828', idx);
}
await page.screenshot({ path: `${EV}/1-results-before-enter.png` });
await clearAnnotations();
R.shot1 = '1-results-before-enter.png';

// --- press Enter, arrow keys untouched
const urlBefore = new URL(page.url()).pathname;
await page.keyboard.press('Enter');
await page.waitForTimeout(6000);
const urlAfter = new URL(page.url()).pathname;
R.urlBefore = urlBefore; R.urlAfter = urlAfter; R.navigated = urlBefore !== urlAfter;

// what kind of page is this, in the app's own words
R.landedOn = await page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const h = [...document.querySelectorAll('h1,h2,h3,.text-h4,.text-h5,.text-h6')].filter(vis)
    .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 4);
  return { headings: h, title: document.title };
});
console.log('after Enter:', urlBefore, '->', urlAfter, JSON.stringify(R.landedOn));

await page.evaluate(t => {
  const tag = document.createElement('div');
  tag.textContent = t;
  Object.assign(tag.style, { position: 'fixed', left: '16px', top: '80px', background: '#c62828',
    color: '#fff', font: '600 14px sans-serif', padding: '6px 12px', borderRadius: '5px',
    zIndex: 2147483647, pointerEvents: 'none', maxWidth: '70%' });
  tag.className = '__anno';
  document.body.appendChild(tag);
}, `Enter opened THIS page - not the top result`);
await page.screenshot({ path: `${EV}/2-page-after-enter.png` });
R.shot2 = '2-page-after-enter.png';

// --- second run, to show it is not a one-off
await clearAnnotations();
await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
await page.waitForTimeout(4000);
await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 });
await page.type('[data-test-id="search_modal_input"]', QUERY, { delay: 40 });
await page.waitForTimeout(6000);
const u1 = new URL(page.url()).pathname;
await page.keyboard.press('Enter');
await page.waitForTimeout(6000);
R.secondRun = { urlBefore: u1, urlAfter: new URL(page.url()).pathname };
R.sameBothTimes = R.secondRun.urlAfter === R.urlAfter;
console.log('second run:', JSON.stringify(R.secondRun), '| same both times:', R.sameBothTimes);

save();
await browser.close();
