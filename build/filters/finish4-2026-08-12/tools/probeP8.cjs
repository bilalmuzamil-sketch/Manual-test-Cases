// probeP8.cjs — finish4, 2026-08-12. C38886 step 2b, settled properly.
//
// diagScroll established the table is a QUASAR VIRTUAL SCROLL that RECYCLES rows, so the
// constant DOM row count of 33 means recycling — NOT that more results are unavailable, and
// NOT that pagination is missing something. There is no next-page control and no "load more";
// advancing through results is done by scrolling the .q-table__middle.q-virtual-scroll
// container.
//
// What this proves, so a step correction rests on a measurement rather than a guess:
//   * with a search applied, scrolling the virtual container CHANGES which work orders are
//     visible (the result set genuinely advances), and
//   * the search text and the narrowed result set SURVIVE that scrolling.
// The control that makes it able to fail: if scrolling did nothing, the visible numbers would
// be identical before and after, and the assertion would collapse.

const { makeHarness, APP, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);

const visibleNumbers = (page) => page.evaluate(() =>
  Array.from(document.querySelectorAll('tbody tr')).map(tr => {
    const td = tr.querySelectorAll('td');
    return td.length > 3 ? (td[3].innerText || '').trim() : null;
  }).filter(x => x && /^S2-/.test(x)));

(async () => {
  const H = await makeHarness('admin', { width: 1680, height: 1080 });
  const page = H.page;
  const out = { case: 'C38886', step: '2b', read_at_utc: new Date().toISOString() };
  try {
    await L.goWO(page, '?tab=all');
    await L.clearAll(page); await S(page, 2200);

    out.search = await L.search(page, 'Aagate');
    await S(page, 4000);
    out.searchedUrl = page.url();
    out.numbersAtTop = await visibleNumbers(page);
    out.rowCountAtTop = out.numbersAtTop.length;

    out.container = await page.evaluate(() => {
      const c = document.querySelector('.q-table__middle.q-virtual-scroll');
      return c ? { found: true, scrollTop: c.scrollTop, scrollHeight: c.scrollHeight, clientHeight: c.clientHeight } : { found: false };
    });

    // Scroll the VIRTUAL CONTAINER (not the window) to its end.
    await page.evaluate(() => {
      const c = document.querySelector('.q-table__middle.q-virtual-scroll');
      if (c) c.scrollTop = c.scrollHeight;
    });
    await S(page, 3500);
    out.numbersAfterScroll = await visibleNumbers(page);
    out.containerAfter = await page.evaluate(() => {
      const c = document.querySelector('.q-table__middle.q-virtual-scroll');
      return c ? { scrollTop: Math.round(c.scrollTop), scrollHeight: c.scrollHeight } : null;
    });
    out.searchBoxAfterScroll = await page.evaluate(() => {
      const h = document.querySelector('[data-test-id="page_search_input"]');
      const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; });

    const a = new Set(out.numbersAtTop), b = new Set(out.numbersAfterScroll);
    out.newNumbersRevealed = [...b].filter(x => !a.has(x));
    out.scrollAdvancedTheResults = out.newNumbersRevealed.length > 0;
    out.searchSurvivedScrolling = out.searchBoxAfterScroll === 'Aagate' && /search=Aagate/.test(page.url());
    // Every visible row must still match the search term (the list stayed narrowed).
    out.allVisibleStillMatchSearch = await page.evaluate(() =>
      Array.from(document.querySelectorAll('tbody tr')).map(tr => {
        const td = tr.querySelectorAll('td');
        return td.length > 4 ? (td[4].innerText || '').trim() : '';
      }).filter(Boolean).every(c => /Aagate/i.test(c)));
    out.customerColumnSample = await page.evaluate(() =>
      Array.from(document.querySelectorAll('tbody tr')).slice(0, 5).map(tr => {
        const td = tr.querySelectorAll('td'); return td.length > 4 ? (td[4].innerText || '').trim() : null; }));
    await L.shot(page, OUT, 'P8-c38886-scrolled-with-search');
  } catch (e) { out.error = String(e).slice(0, 500); }
  out.bridge_errors = H.bridgeErrors.length;
  fs.writeFileSync(`${OUT}/probeP8.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 4000));
  await H.browser.close();
})();
