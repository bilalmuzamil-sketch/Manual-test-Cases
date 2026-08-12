// probeP5.cjs — finish4, 2026-08-12.
//
// (0) THE HARNESS RULE-OUT, RUN FIRST AND ON PURPOSE. probeP4 saw the saved preference NOT
//     move when a filter was applied on the phone. That is the same ground as SV-8871 /
//     SV-8905 and the same shape as finish3's SELF-INFLICTED false defect, so it is NOT
//     reported until our own state is eliminated. probeP4 left the preference PROVEN clean
//     (filters: []), so this block applies a filter from a verified-clean baseline and reads
//     the preference back. If it saves from clean, the earlier non-update was OUR leftover
//     state and there is no defect. Both outcomes are recorded.
//
// (1) C29594 — the filtered empty state. finish3 recorded "cannot be produced from this filter
//     alone on this data", which is TRUE of the filter alone; but THE CASE'S OWN PRECONDITION 3
//     sanctions the other route: "or combine with another filter so one option matches nothing".
//     Data established live: status ready_for_review holds exactly 1 work order and it is
//     ON SITE, so Review + Asset on Site = No is an EXACTLY EMPTY intersection.
//     CONTROL: Review + Asset on Site = YES must show that 1 row. Without it, "0 rows" could
//     just be a broken list.
//
// (2) C38886 steps 2 and 5 — sorting/paging with a search applied, and closing the whole
//     browser. Step 5's "close every browser tab" is driven as a genuinely NEW browser process,
//     the same proxy finish3 used for C29614 steps 3-4.

const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const PHONE = { width: 390, height: 844 };
const R = { read_at_utc: new Date().toISOString(), cases: {} };
const JOEL = 'b4f8b308-b0c5-4e5e-b734-d76175757be9';

async function readPref(page) { return L.pref(page); }

(async () => {
  // ============================================== (0) HARNESS RULE-OUT from a clean baseline
  {
    const H = await makeHarness('admin', PHONE);
    const e = { what: 'preference-save rule-out from a PROVEN-CLEAN baseline', case: 'incidental to C29626' };
    try {
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      const p0 = await readPref(H.page);
      e.prefAtStart = p0.value?.filters;
      e.prefUpdatedAtStart = p0.updatedAt;
      e.baselineIsClean = Array.isArray(e.prefAtStart) && e.prefAtStart.length === 0;

      // Apply Joel Parker from clean, through the phone sheet exactly as a tester would.
      e.sheetOpened = (await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]')).clicked;
      await S(H.page, 2800);
      await H.page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
        const r = rows.find(x => /Lead Technician/i.test((x.innerText || '').split('\n')[0] || ''));
        if (r) { const h = r.querySelector('.q-expansion-item__container > .q-item, .q-item'); if (h) h.click(); }
      });
      await S(H.page, 2200);
      e.picked = (await L.clickSel(H.page, `[data-test-id="filter_option_tech_assigned_id_${JOEL}"]`)).clicked;
      await S(H.page, 1600);
      e.applyClicked = (await L.clickSel(H.page, '[data-test-id="apply_filters"]')).clicked;
      await S(H.page, 7000);
      e.urlAfterApply = H.page.url();
      const p1 = await readPref(H.page);
      e.prefAfterApply = p1.value?.filters;
      e.prefUpdatedAtAfter = p1.updatedAt;
      e.updatedAtMoved = p1.updatedAt !== p0.updatedAt;
      e.savedTheNewFilter = JSON.stringify(p1.value?.filters || {}).includes(JOEL);
      await L.shot(H.page, OUT, 'P5-pref-ruleout');

      // Return to clean for the blocks below, and PROVE it.
      await H.page.evaluate(async (api) => {
        const g = await fetch(`${api}/api/users/me/preferences/work-orders-list`, { headers: { accept: 'application/json' } });
        const cur = (await g.json())?.data?.value || {}; cur.filters = [];
        await fetch(`${api}/api/users/me/preferences/work-orders-list`, { method: 'PUT',
          headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ value: cur }) });
      }, API);
      await S(H.page, 1500);
      e.prefRestored = (await readPref(H.page)).value?.filters;
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['pref-ruleout'] = e; L.save(OUT, 'probeP5', R);
    await H.browser.close();
  }

  // ============================================== (1) C29594 — the filtered empty state
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const page = H.page;
    const e = { case: 'C29594', route: 'precondition 3 second route: combine with another filter' };
    try {
      await L.goWO(page, '?tab=all');
      await L.clearAll(page); await S(page, 2500);

      // Establish the data from the server first, so the expectation rests on known counts.
      e.serverReviewTotal = await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }]);
      e.serverReviewOnSite = await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }, { field: 'vehicleHere', value: '1' }]);
      e.serverReviewOffSite = await L.serverCount(page, [{ field: 'status', value: 'ready_for_review' }, { field: 'vehicleHere', value: '0' }]);

      // Step 1: Status = Review, then Asset on Site = No.
      const oc = await L.openChip(page, 'filter_chip_status');
      e.statusOptions = (oc.options || []).map(o => o.id);
      e.pickedReview = (await L.pickOption(page, 'filter_option_status_ready_for_review')).clicked;
      await L.closeMenu(page); await S(page, 3500);
      e.urlAfterStatus = page.url();
      e.rowsStatusOnly = await L.rows(page);

      // CONTROL FIRST: Asset on Site = YES must show the 1 row.
      await L.openChip(page, 'filter_chip_vehicle');
      e.pickedYesControl = (await L.pickOption(page, 'filter_option_vehicleHere_1')).clicked;
      await L.closeMenu(page); await S(page, 3800);
      e.controlUrl = page.url();
      e.controlRows = await L.rows(page);
      await L.shot(page, OUT, 'P5-c29594-control-yes');

      // Now the real thing: switch to No -> the empty intersection.
      await L.openChip(page, 'filter_chip_vehicle');
      e.pickedNo = (await L.pickOption(page, 'filter_option_vehicleHere_0')).clicked;
      await L.closeMenu(page); await S(page, 4200);
      e.emptyUrl = page.url();
      e.emptyRows = await L.rows(page);
      e.emptyStateText = await page.evaluate(() =>
        (document.body.innerText.match(/No work orders[^\n]*/) || [null])[0]);
      e.chips = await L.chips(page);
      e.consoleErrors = H.consoleErrs.filter(x => !/sso\/check/.test(x)).slice(0, 6);
      e.api_4xx5xx = H.apiLog.filter(a => a.s >= 400 && !/sso\/check/.test(a.u)).slice(0, 6);
      await L.shot(page, OUT, 'P5-c29594-empty-state');

      await L.clearAll(page); await S(page, 2200);
      e.prefAfter = (await readPref(page)).value?.filters;
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['29594'] = e; L.save(OUT, 'probeP5', R);
    await H.browser.close();
  }

  // ============================================== (2) C38886 steps 2 and 5
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const page = H.page;
    const e = { case: 'C38886', steps: [2, 5] };
    const TERM = 'Aagate';
    try {
      await L.goWO(page, '?tab=all');
      await L.clearAll(page); await S(page, 2200);

      // Step 1 (re-established so step 2 has something to preserve).
      const s = await L.search(page, TERM);
      e.search = s;
      await S(page, 3500);
      e.rowsSearched = await L.rows(page);
      e.urlSearched = page.url();

      // ---- STEP 2a: sort by a column header, search must survive.
      const headers = await page.$$eval('thead th', ths => ths.map((t, i) => ({
        i, text: (t.innerText || '').replace(/\s+/g, ' ').trim(),
        clickable: !!t.querySelector('[class*="sortable"]') || /sortable/.test(t.className) })));
      e.headers = headers.map(h => h.text);
      const target = headers.find(h => /^Work Order|^WO|^Status|^Customer/i.test(h.text)) || headers[1];
      e.sortTarget = target;
      if (target) {
        await page.evaluate((i) => { const th = document.querySelectorAll('thead th')[i]; if (th) th.click(); }, target.i);
        await S(page, 4000);
      }
      e.afterSort = {
        url: page.url(),
        searchBoxValue: await page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        rows: await L.rows(page)
      };
      await L.shot(page, OUT, 'P5-c38886-after-sort');

      // ---- STEP 2b: move to the next page of results, search must survive.
      const pager = await page.evaluate(() => {
        const cands = Array.from(document.querySelectorAll('button,[data-test-id]')).map(b => ({
          id: b.getAttribute('data-test-id'), text: (b.innerText || '').replace(/\s+/g, ' ').trim(),
          aria: b.getAttribute('aria-label') }))
          .filter(x => /next|page/i.test((x.id || '') + (x.aria || '')) || /^\d+$/.test(x.text));
        return cands.slice(0, 12);
      });
      e.pagerControls = pager;
      const nextClicked = await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('button')).find(x =>
          /next/i.test(x.getAttribute('aria-label') || '') || /next/i.test(x.getAttribute('data-test-id') || ''));
        if (!b || b.disabled) return { found: !!b, disabled: b ? b.disabled : null };
        b.click(); return { found: true, clicked: true };
      });
      e.nextPage = nextClicked;
      await S(page, 4000);
      e.afterPaging = {
        url: page.url(),
        searchBoxValue: await page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        rows: await L.rows(page)
      };
      await L.shot(page, OUT, 'P5-c38886-after-paging');

      // Confirm again that the search is NOT persisted server-side (expectation 4's basis).
      const pv = await readPref(page);
      e.prefHoldsSearchKey = JSON.stringify(pv.value || {}).includes('search');
      e.prefValueFilters = pv.value?.filters;
      e.prefUpdatedAt = pv.updatedAt;
    } catch (err) { e.error = String(err).slice(0, 600); }
    e.bridge_errors = H.bridgeErrors.length;
    R.cases['38886'] = e; L.save(OUT, 'probeP5', R);
    await H.browser.close();

    // ---- STEP 5: a genuinely NEW browser process, then read the Search box.
    const H2 = await makeHarness('admin', { width: 1680, height: 1080 });
    try {
      await H2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H2.page, 11000);
      R.cases['38886'].step5_newBrowserProcess = {
        note: 'separate chromium process and profile, same account cookie',
        url: H2.page.url(),
        searchBoxValue: await H2.page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        searchInputPresentAtAll: await H2.page.evaluate(() => !!document.querySelector('[data-test-id="page_search_input"]')),
        rows: await L.rows(H2.page)
      };
      await L.shot(H2.page, OUT, 'P5-c38886-new-browser');
    } catch (err) { R.cases['38886'].step5Error = String(err).slice(0, 400); }
    L.save(OUT, 'probeP5', R);
    await H2.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP5.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 9000));
})();
