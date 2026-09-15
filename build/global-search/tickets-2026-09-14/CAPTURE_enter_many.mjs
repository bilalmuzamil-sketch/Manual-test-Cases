// The QA lead says Enter now opens the correct record in V2. My run says it opens a record further
// down the list. Both can be true if it depends on the QUERY -- so instead of contradicting him,
// this characterises WHEN it goes wrong.
//
// For each query: what is the top row, which row does the panel highlight on its own, and where does
// Enter actually land. No arrow keys, nothing clicked.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';

const DIR = '/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const QUERIES = (process.env.QUERIES ||
  'Bridgeport|S9160-17613|ZZAUTOTEST|Kestrel|ZZT-4471|9160-254').split('|');
const R = { at: new Date().toISOString(), queries: {} };
const save = () => fs.writeFileSync(`${DIR}/ENTER-MANY.json`, JSON.stringify(R, null, 2));
const L = (...a) => console.log(...a);

const { browser, page } = await boot('sv9160', '/workorders', 'admin');
await page.waitForTimeout(5000);

const readModal = async () => page.evaluate(() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const d = [...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  if (!d) return null;
  const tabs = {};
  d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e => {
    const t = (e.innerText || '').match(/\((\d+)\)/);
    tabs[e.getAttribute('data-test-id').replace('search_modal_tab_', '')] = t ? +t[1] : null;
  });
  const rows = [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map((e, i) => ({
    i,
    type: e.getAttribute('data-test-id').replace('search_result_row_', '').replace(/_\d+$/, ''),
    text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 62),
    active: /q-manual-focusable--focused|q-item--active|active|selected|highlight/i
              .test((e.className || '').toString())
            || e.getAttribute('aria-selected') === 'true',
  }));
  return { tabs, rows };
});

for (const Q of QUERIES) {
  await page.goto('https://sv9160.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3500);
  await page.evaluate(() => { const b = document.querySelector('[data-test-id="global_search_trigger"]'); b && b.click(); });
  await page.waitForSelector('[data-test-id="search_modal_input"]', { state: 'visible', timeout: 20000 }).catch(() => {});
  await page.fill('[data-test-id="search_modal_input"]', '').catch(() => {});
  await page.type('[data-test-id="search_modal_input"]', Q, { delay: 35 });

  // settle on the per-type counts, never on the total alone
  let last = null, st = 0, m = null;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(800);
    m = await readModal();
    if (!m) continue;
    const sig = JSON.stringify(m);
    const tc = Object.entries(m.tabs).filter(([k]) => !['strip', 'all'].includes(k)).map(([, v]) => v);
    if (sig === last && tc.some(v => v !== null)) { if (++st >= 3) break; } else st = 0;
    last = sig;
  }
  const top = (m && m.rows[0]) || null;
  const hl = (m && m.rows.find(r => r.active)) || null;

  const before = new URL(page.url()).pathname;
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5500);
  const after = new URL(page.url()).pathname;

  const rec = {
    rows: m ? m.rows.length : 0,
    topRow: top && { i: top.i, type: top.type, text: top.text },
    highlightedRow: hl && { i: hl.i, type: hl.type, text: hl.text },
    highlightIsTop: !!(hl && top && hl.i === top.i),
    noHighlightAtAll: !hl,
    urlBefore: before, urlAfter: after, navigated: before !== after,
    openedType: /\/customers\//.test(after) ? 'a customer'
              : /\/work-?orders?\/(view|[0-9a-f-]{8})/.test(after) ? 'a job'
              : /\/parts\/part-sale\//.test(after) ? 'a part sale'
              : /\/parts\//.test(after) ? 'a part'
              : /\/vendors?\//.test(after) ? 'a supplier'
              : after,
  };
  rec.enterMatchedTop = !!(rec.navigated && top && (
    (top.type === 'work_orders' && /work-?order/.test(after) && !/\/customers\//.test(after)) ||
    (top.type === 'customers' && /\/customers\//.test(after)) ||
    (top.type === 'assets' && /\/vehicles?\/|\/assets?\//.test(after)) ||
    (top.type === 'part_sales' && /part-sale/.test(after)) ||
    (top.type === 'vendors' && /vendor/.test(after))
  ));
  R.queries[Q] = rec;
  L(`"${Q}" rows=${rec.rows} top=${top && top.type} highlighted=${hl ? hl.type + ' #' + hl.i : 'NONE'}`
    + ` | Enter -> ${rec.openedType} | matched top: ${rec.enterMatchedTop}`);
  save();
}

const fails = Object.entries(R.queries).filter(([, r]) => r.navigated && !r.enterMatchedTop);
R.summary = {
  tried: QUERIES.length,
  openedSomethingOtherThanTheTopResult: fails.map(([q]) => q),
  openedTheTopResult: Object.entries(R.queries).filter(([, r]) => r.enterMatchedTop).map(([q]) => q),
  didNotNavigate: Object.entries(R.queries).filter(([, r]) => !r.navigated).map(([q]) => q),
};
save();
L('\nSUMMARY', JSON.stringify(R.summary, null, 2));
await browser.close();
