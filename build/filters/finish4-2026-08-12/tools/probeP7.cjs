// probeP7.cjs — finish4, 2026-08-12.
//
// (1) C29594 with the CORRECT chip id. probeP5 used `filter_chip_vehicle`; the real id is
//     `filter_chip_vehicleHere` (established by diagAsset), so nothing was ever clicked and the
//     "empty state not produced" reading was OUR selector, not the product.
//     Route: the case's own precondition 3 — "combine with another filter so one option matches
//     nothing". Live data: status ready_for_review = 1 work order, and it is ON SITE, so
//     Review + Asset on Site = No is an exactly-empty intersection.
//     CONTROL: Review + Asset on Site = YES must show that 1 row, in the same run.
//
// (2) C38886 step 2, properly. probeP5 asserted "the search survived a sort" WITHOUT proving a
//     sort happened, and found no pager at all. Here the row order is captured before and after,
//     and pagination is hunted EXHAUSTIVELY (scroll to the very bottom, .q-table__bottom, a
//     rows-per-page selector, aria-labels) so that "there is no pager" is a measurement rather
//     than a failure to look.
//
// (3) C38886 step 5 refinement: in a fresh browser process, OPEN the search toggle and confirm
//     the box is EMPTY, rather than inferring it from the collapsed control being absent.

const { makeHarness, APP, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);
const R = { read_at_utc: new Date().toISOString(), cases: {} };

const numbers = (page, n = 8) => page.evaluate((k) => Array.from(document.querySelectorAll('tbody tr'))
  .slice(0, k).map(tr => { const td = tr.querySelectorAll('td');
    return td.length > 3 ? (td[3].innerText || '').trim().slice(0, 20) : null; }).filter(Boolean), n);

(async () => {
  // ==================================================== (1) C29594
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const page = H.page;
    const e = { case: 'C29594', route: "precondition 3, second route: combine with another filter",
                chipIdUsed: 'filter_chip_vehicleHere' };
    try {
      await L.goWO(page, '?tab=all');
      await L.clearAll(page); await S(page, 2500);

      e.server = {
        reviewTotal: (await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }])).total,
        reviewOnSite: (await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }, { field: 'vehicleHere', value: '1' }])).total,
        reviewOffSite: (await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }, { field: 'vehicleHere', value: '0' }])).total
      };

      // Status = Review
      await L.openChip(page, 'filter_chip_status');
      e.pickedReview = (await L.pickOption(page, 'filter_option_status_ready_for_review')).clicked;
      await L.closeMenu(page); await S(page, 4000);
      e.urlStatusOnly = page.url();
      e.numbersStatusOnly = await numbers(page);

      // CONTROL: Asset on Site = Yes must show the single row.
      const oc1 = await L.openChip(page, 'filter_chip_vehicleHere');
      e.assetChipFound = oc1.found;
      e.assetOptionIds = (oc1.options || []).map(o => o.id);
      e.pickedYes = (await L.pickOption(page, 'filter_option_vehicleHere_1')).clicked;
      await L.closeMenu(page); await S(page, 4200);
      e.control = { url: page.url(), rows: await L.rows(page), numbers: await numbers(page),
        emptyText: await page.evaluate(() => (document.body.innerText.match(/No work orders[^\n]*/) || [null])[0]) };
      await L.shot(page, OUT, 'P7-c29594-control-yes');

      // THE CASE: switch to No -> exactly-empty intersection.
      await L.openChip(page, 'filter_chip_vehicleHere');
      e.pickedNo = (await L.pickOption(page, 'filter_option_vehicleHere_0')).clicked;
      await L.closeMenu(page); await S(page, 4500);
      e.empty = { url: page.url(), rows: await L.rows(page), numbers: await numbers(page),
        emptyText: await page.evaluate(() => (document.body.innerText.match(/No work orders[^\n]*/) || [null])[0]),
        chips: (await L.chips(page)).map(c => c.text) };
      e.consoleErrors = H.consoleErrs.filter(x => !/sso\/check|ERR_FAILED/.test(x)).slice(0, 6);
      e.api_4xx5xx = H.apiLog.filter(a => a.s >= 400 && !/sso\/check/.test(a.u)).slice(0, 6);
      await L.shot(page, OUT, 'P7-c29594-empty-state');

      await L.clearAll(page); await S(page, 2200);
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['29594'] = e; L.save(OUT, 'probeP7', R);
    await H.browser.close();
  }

  // ==================================================== (2) C38886 step 2
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const page = H.page;
    const e = { case: 'C38886', step: 2 };
    const TERM = 'Aagate';
    try {
      await L.goWO(page, '?tab=all');
      await L.clearAll(page); await S(page, 2200);
      e.search = await L.search(page, TERM);
      await S(page, 3500);
      e.searchedUrl = page.url();
      e.searchedRows = await L.rows(page);
      e.numbersBeforeSort = await numbers(page);
      e.customerColumnBefore = await page.evaluate(() => Array.from(document.querySelectorAll('tbody tr'))
        .slice(0, 6).map(tr => { const td = tr.querySelectorAll('td'); return td.length > 4 ? (td[4].innerText || '').trim() : null; }));

      // ---- 2a: sort by the Number column and PROVE the order moved while the search survived.
      await page.evaluate(() => { const th = document.querySelectorAll('thead th')[3]; if (th) th.click(); });
      await S(page, 4500);
      e.afterSort = {
        url: page.url(),
        searchBoxValue: await page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        rows: await L.rows(page), numbers: await numbers(page)
      };
      e.sortActuallyChangedOrder = JSON.stringify(e.numbersBeforeSort) !== JSON.stringify(e.afterSort.numbers);
      e.searchSurvivedSort = e.afterSort.searchBoxValue === TERM && /search=/.test(e.afterSort.url);
      await L.shot(page, OUT, 'P7-c38886-sorted');

      // ---- 2b: hunt pagination EXHAUSTIVELY so "absent" is a measurement.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await S(page, 2500);
      e.paginationHunt = await page.evaluate(() => {
        const q = (s) => Array.from(document.querySelectorAll(s));
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const desc = (e) => ({ id: e.getAttribute('data-test-id'), tag: e.tagName,
          cls: (e.className || '').toString().slice(0, 60),
          text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          aria: e.getAttribute('aria-label') });
        return {
          qTableBottom: q('.q-table__bottom').map(desc),
          qPagination: q('.q-pagination, .q-table__bottom-item, [class*="pagination"]').map(desc),
          rowsPerPageText: /rows per page|records per page|per page/i.test(document.body.innerText),
          totalRowsRendered: q('tbody tr').length,
          scrolledTo: Math.round(window.scrollY),
          docHeight: document.body.scrollHeight,
          ariaNextish: q('[aria-label]').filter(e => /next|previous|page/i.test(e.getAttribute('aria-label') || '')).map(desc),
          iconNextish: q('i,button').filter(e => vis(e) && /chevron_right|arrow_forward|keyboard_arrow_right|last_page|next_page/.test((e.innerText || ''))).map(desc),
          testIdsMentioningPage: q('[data-test-id]').map(e => e.getAttribute('data-test-id'))
            .filter(id => /page|pagin|next|prev/i.test(id || '')),
          bodyTail: document.body.innerText.slice(-260)
        };
      });
      await L.shot(page, OUT, 'P7-c38886-bottom');

      // If the list lazy-loads instead of paging, scrolling should ADD rows. Test that too,
      // so "no pager" is accompanied by what the build does INSTEAD.
      const before = e.paginationHunt.totalRowsRendered;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await S(page, 3500);
      e.lazyLoadCheck = { rowsBefore: before,
        rowsAfterSecondScroll: await page.evaluate(() => document.querySelectorAll('tbody tr').length),
        searchStillApplied: await page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }) };
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['38886'] = e; L.save(OUT, 'probeP7', R);
    await H.browser.close();
  }

  // ==================================================== (3) C38886 step 5 refinement
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const e = { case: 'C38886', step: 5, note: 'fresh chromium process and profile, same account' };
    try {
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      e.url = H.page.url();
      e.urlCarriesSearch = /search=/.test(H.page.url());
      e.inputPresentBeforeToggle = await H.page.evaluate(() => !!document.querySelector('[data-test-id="page_search_input"]'));
      // OPEN the search box and read it, rather than inferring emptiness from its absence.
      const t = await L.clickSel(H.page, '[data-test-id="page_search_toggle"]');
      e.toggleClicked = t.clicked;
      await S(H.page, 2200);
      e.searchBoxValueAfterOpening = await H.page.evaluate(() => {
        const h = document.querySelector('[data-test-id="page_search_input"]');
        const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null;
        return i ? { value: i.value, placeholder: i.getAttribute('placeholder') } : null; });
      e.rows = await L.rows(H.page);
      await L.shot(H.page, OUT, 'P7-c38886-fresh-browser-search-open');
    } catch (err) { e.error = String(err).slice(0, 500); }
    R.cases['38886-step5'] = e; L.save(OUT, 'probeP7', R);
    await H.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP7.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 9000));
})();
