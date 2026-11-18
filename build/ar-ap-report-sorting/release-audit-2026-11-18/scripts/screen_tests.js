// Release audit 18 Nov: screen re-test of C1145247, C1145248 (SV-12722) and C1145253 (SV-12764) on staging, 1440 px,
// following each case's own steps. Read-only browser (logout blocked by env.js). Pictures + measurements to ../screen/.
const path = require('path'); const fs = require('fs');
const T = path.resolve(__dirname, '../../v1-regression/staging-run-2026-11-12/tech-tools');
const lib = require(T + '/lib.js'); const OUT = path.resolve(__dirname, '../screen'); fs.mkdirSync(OUT, { recursive: true });
const R = {}; const snap = async (page, n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); return n + '.png'; };
// geometry of one option row in the open menu: does its label stay inside the row, and is the next row's tick box clear?
async function rowGeom(page, kind, nameStart) {
  return page.evaluate(([kind, nameStart]) => {
    const opts = [...document.querySelectorAll(`.q-menu [data-test-id^="filter_option_${kind}_"]`)];
    const i = opts.findIndex((o) => { const t = o.innerText.replace(/\s+/g, ''); const n = nameStart.replace(/\s+/g, ''); return n.length > 60 && !nameStart.includes(' ') ? t === n : t.startsWith(n.slice(0, 30)); });
    if (i < 0) return { found: false, count: opts.length };
    const row = opts[i], next = opts[i + 1] || opts[i - 1]; const rr = row.getBoundingClientRect(); if (!next) return { found: true, count: opts.length, noNeighbour: true };
    const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT); let tb = null;
    while (walker.nextNode()) { const n = walker.currentNode; if (!n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) tb = tb ? { l: Math.min(tb.l, r.left), t: Math.min(tb.t, r.top), r: Math.max(tb.r, r.right), b: Math.max(tb.b, r.bottom) } : { l: r.left, t: r.top, r: r.right, b: r.bottom }; }
    const nb = next.querySelector('.q-checkbox, [role="checkbox"]') || next; const nr = nb.getBoundingClientRect();
    const hit = document.elementFromPoint(nr.left + nr.width / 2, nr.top + nr.height / 2); const hitRow = hit && hit.closest(`[data-test-id^="filter_option_${kind}_"]`);
    return { found: true, rowRect: [rr.left, rr.top, rr.right, rr.bottom].map(Math.round), textRect: tb && [tb.l, tb.t, tb.r, tb.b].map(Math.round),
      textInsideRow: !!tb && tb.b <= rr.bottom + 1 && tb.r <= rr.right + 1 && tb.t >= rr.top - 1,
      nextTickBoxClear: hitRow === next, nextRowText: next.innerText.replace(/\s+/g, ' ').trim().slice(0, 50), lines: tb ? Math.round((tb.b - tb.t) / 18) : 0 };
  }, [kind, nameStart]);
}
async function menuTest(page, key, kind, A, B, plural) {
  const r = { steps: {} }; await lib.settle(page, 2500);
  await page.click(`[data-test-id="filter_chip_${kind}"]`); await lib.sleep(900);
  r.steps[1] = { menuText: (await page.locator('.q-menu').last().innerText()).split('\n').slice(0, 4), pic: await snap(page, `${key}-1-menu`) };
  const search = page.locator(`[data-test-id="filter_search_${kind}"] input, input[data-test-id="filter_search_${kind}"]`).first();
  if (await search.count()) { await search.fill('ZZAUTOTESTA'); await lib.settle(page, 1800); }
  for (let k = 0; k < 6 && !(await page.locator(`.q-menu [data-test-id^="filter_option_${kind}_"]`, { hasText: A.slice(0, 25) }).count()); k++) { await page.locator('.q-menu .q-virtual-scroll, .q-menu .q-list, .q-menu').last().evaluate((e) => { e.scrollTop += 600; }); await lib.sleep(600); }
  await page.locator(`.q-menu [data-test-id^="filter_option_${kind}_"]`, { hasText: A.slice(0, 25) }).first().scrollIntoViewIfNeeded().catch(() => {});
  r.steps[2] = { ...(await rowGeom(page, kind, A)), pic: await snap(page, `${key}-2-row-A`) };
  const allA = page.locator(`.q-menu [data-test-id^="filter_option_${kind}_"]`); const tA = await allA.allInnerTexts();
  const iA = tA.findIndex((t) => t.replace(/\s+/g, '') === A); r.steps[3] = { indexOfA: iA };
  await allA.nth(iA).click(); await lib.sleep(800); r.steps[3] = { ...r.steps[3], chip: await lib.chip(page, kind), pic: await snap(page, `${key}-3-ticked-A`) };
  // the neighbour is clicked by POSITION (its name can share A's first characters)
  const all = page.locator(`.q-menu [data-test-id^="filter_option_${kind}_"]`); const texts = await all.allInnerTexts();
  const ia = texts.findIndex((t) => t.replace(/\s+/g, '') === A);
  const ib = ia + 1 < texts.length ? ia + 1 : ia - 1; r.steps[4] = { clicked: texts[ib] && texts[ib].trim().slice(0, 45) };
  if (ib >= 0) { await all.nth(ib).click(); await lib.sleep(900); }
  r.steps[4] = { ...r.steps[4], chip: await lib.chip(page, kind), expected: `${plural}`, pic: await snap(page, `${key}-4-ticked-two`) };
  if (await search.count()) { await search.fill('ZZAUTOTEST Special'); await lib.settle(page, 1800); }
  r.steps[5] = { ...(await rowGeom(page, kind, B.slice(0, 25))), pic: await snap(page, `${key}-5-row-B`) };
  await page.keyboard.press('Escape'); return r;
}
(async () => {
  const { browser, page, app } = await lib.open('staging', { width: 1440 });
  R.build = null;
  // C1145247 — A/R Summary, Customer menu
  await page.goto(`${app}/reports/ar-aging-summary`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3000);
  R.build = await page.locator('meta[name="app-version"]').getAttribute('content');
  R.C1145247 = await menuTest(page, 'C1145247', 'customerIds', "ZZAUTOTESTAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghij", 'ZZAUTOTEST Special & "Quoted" \'Single\' <Less> Greater> Customer One', 'Customer: 2 customers');
  // C1145248 — A/P Detail, Vendor menu
  await page.goto(`${app}/reports/ap-aging-detail`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3000);
  R.C1145248 = await menuTest(page, 'C1145248', 'vendorIds', "ZZAUTOTESTAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghij", 'ZZAUTOTEST Special & "Quoted" \'Single\' <Less> Greater> Vendor One', 'Vendor: 2 vendors');
  // C1145253 — A/R Collection, only customer A, group collapsed
  await page.goto(`${app}/reports/ar-aging-collection?customerIds=5b5c3981-61e4-41d8-b248-2b2608419af4`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 4000);
  const lay = () => page.evaluate(() => {
    const t = document.querySelector('.q-table__middle') || document.querySelector('table').parentElement; const vw = document.documentElement.clientWidth;
    const ths = [...document.querySelectorAll('thead th')].map((th) => { const r = th.getBoundingClientRect(); const s = getComputedStyle(th); return { text: th.innerText.replace(/\s+/g, ' ').trim(), left: Math.round(r.left), right: Math.round(r.right), h: Math.round(r.height), visible: r.right <= Math.min(vw, t.getBoundingClientRect().right) + 1 && r.left >= t.getBoundingClientRect().left - 1 }; }).filter((x) => x.text);
    const trs = [...document.querySelectorAll('tr')]; const tot = trs.find((tr) => /^Totals/.test(tr.innerText.trim()));
    const grp = trs.find((tr) => tr.innerText.includes('ZZAUTOTESTAbcdefghij'));
    return { sidewaysScroll: t.scrollWidth > t.clientWidth + 1, scrollWidth: t.scrollWidth, clientWidth: t.clientWidth, headings: ths,
      headingHeights: [...new Set(ths.map((h) => h.h))], totalsRow: tot ? tot.innerText.replace(/\s+/g, ' ').trim() : null,
      groupRowHeight: grp ? Math.round(grp.getBoundingClientRect().height) : null, rows: trs.length };
  });
  R.C1145253 = { chip: await lib.chip(page, 'customerIds'), step1: await lay(), pic1: await snap(page, 'C1145253-1-collapsed') };
  const tg = page.locator('button[data-test-id^="button_aging_"][data-test-id*="_toggle_"]').first(); if (await tg.count()) { await tg.click(); await lib.settle(page, 2000); }
  R.C1145253.step2 = await lay(); R.C1145253.pic2 = await snap(page, 'C1145253-2-expanded');
  R.utc = new Date().toISOString(); fs.writeFileSync(`${OUT}/screen-results.json`, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1)); await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
