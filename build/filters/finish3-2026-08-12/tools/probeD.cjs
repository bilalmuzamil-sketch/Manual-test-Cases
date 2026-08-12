// probeD.cjs — the loose ends, each with a guard that makes the check able to fail.
//   C43560  two contexts, last save wins        -- the previous TWO attempts were VACUOUS
//   C38876  first visit / last-used tab         -- needs an account with no saved page state
//   C29603  collapse survives navigation        -- re-confirm (marked Failed by the tester)
//   C38897  steps 3-4, clear each on its own
//   C29614  steps 3-6, a completely fresh browser
//   C38886  the typed search is never saved
//   C38888  the search term travels in the link
//   C29616  a REMEMBERED (saved) deleted value  -- re-drive; the first attempt never
//           achieved its own precondition, so it proved nothing
//
// C38876's fresh account is made by DELETING the technician's own work-orders-list page
// preference. That is a page preference the app rewrites constantly, not a role, staff
// record or org setting -- none of which is touched anywhere in this pass.

const { makeHarness, OUT, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';
const ck = who => fs.readFileSync(`/tmp/qa-cookies/filters-${who}.txt`, 'utf8').trim();

async function prefApi(who, method = 'GET', body) {
  const r = await fetch(`${API}/api/users/me/preferences/work-orders-list`, {
    method, headers: { cookie: ck(who), accept: 'application/json', 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  let j = null; try { j = await r.json(); } catch (_) {}
  return { status: r.status, updatedAt: j?.data?.updatedAt, value: j?.data?.value };
}

(async () => {
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeD', R); };

  // ============================================================ C43560 — last save wins
  {
    const A = await makeHarness('admin');
    const B = await makeHarness('admin');
    const c = { steps: [] };
    try {
      for (const h of [A, B]) {
        await h.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(h.page, 9500);
        await L.ensureBarOpen(h.page);
      }
      await L.clearAll(A.page); await S(A.page, 2600);
      const p0 = await L.pref(A.page);
      c.steps.push({ step: 0, updatedAt: p0.updatedAt, filters: p0.value?.filters });

      // STEP 1 — A: Status = Approved, through the chip
      let o = await L.openChip(A.page, 'filter_chip_status');
      const pA = await L.pickOption(A.page, 'filter_option_status_approved');
      await L.closeMenu(A.page); await S(A.page, 3600);
      const p1 = await L.pref(A.page);
      c.steps.push({ step: 1, browser: 'A', menuOptions: o.options.length, picked: pA.clicked,
        url: A.page.url(), updatedAt: p1.updatedAt, saveObserved: p1.updatedAt !== p0.updatedAt,
        filters: p1.value?.filters });

      // STEP 2 — B: Estimate instead, clearing Approved
      o = await L.openChip(B.page, 'filter_chip_status');
      const pB1 = await L.pickOption(B.page, 'filter_option_status_estimate');
      // B must also clear Approved if B's view inherited it
      const tickedB = await L.tickedCount(B.page);
      let pB2 = null;
      if (tickedB.includes('filter_option_status_approved')) {
        pB2 = await L.pickOption(B.page, 'filter_option_status_approved');
      }
      await L.closeMenu(B.page); await S(B.page, 3600);
      const p2 = await L.pref(B.page);
      c.steps.push({ step: 2, browser: 'B', menuOptions: o.options.length, pickedEstimate: pB1.clicked,
        tickedBeforeClearing: tickedB, unclickedApproved: pB2 ? pB2.clicked : 'not needed',
        url: B.page.url(), updatedAt: p2.updatedAt, saveObserved: p2.updatedAt !== p1.updatedAt,
        filters: p2.value?.filters });

      // THE GUARD — without two observed saves the comparison below is vacuous
      c.could_fail = (p1.updatedAt !== p0.updatedAt) && (p2.updatedAt !== p1.updatedAt);

      // STEP 3/4 — reload A
      await A.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(A.page, 10000);
      await L.ensureBarOpen(A.page);
      c.steps.push({ step: '3-4', browser: 'A', url: A.page.url(),
        chips: (await L.chips(A.page)).map(x => x.text),
        showsBsChoice: /Estimate/.test((await L.chips(A.page)).find(x => x.id === 'filter_chip_status')?.text || ''),
        stillShowsOwnChoice: /Approved/.test((await L.chips(A.page)).find(x => x.id === 'filter_chip_status')?.text || ''),
        tally: await L.statusTally(A.page) });
      await L.shot(A.page, OUT, 'c43560-A-reloaded');

      // STEP 5 — A adds a Customer filter
      const oc = await L.openChip(A.page, 'filter_chip_company_id');
      const first = oc.options[0];
      const pC = first ? await L.pickOption(A.page, first.id) : { clicked: false };
      await L.closeMenu(A.page); await S(A.page, 3600);
      const p3 = await L.pref(A.page);
      c.steps.push({ step: 5, browser: 'A', customer: first?.text, picked: pC.clicked,
        updatedAt: p3.updatedAt, saveObserved: p3.updatedAt !== p2.updatedAt, filters: p3.value?.filters });

      // STEP 6 — reload B
      await B.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(B.page, 10000);
      await L.ensureBarOpen(B.page);
      const chipsB = await L.chips(B.page);
      c.steps.push({ step: 6, browser: 'B', url: B.page.url(), chips: chipsB.map(x => x.text),
        showsAsCustomer: /:/.test(chipsB.find(x => x.id === 'filter_chip_company_id')?.text || ''),
        tally: await L.statusTally(B.page) });
      await L.shot(B.page, OUT, 'c43560-B-reloaded');
      c.realConsoleErrors = [...A.consoleErrs, ...B.consoleErrs].filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 4);
      c.bridge_errors = A.bridgeErrors.length + B.bridgeErrors.length;
    } catch (e) { c.error = String(e).slice(0, 400); }
    put('43560', c);
    await A.browser.close(); await B.browser.close();
  }

  // ============================================================ C38876 — a never-used account
  {
    const d = {};
    try {
      d.technicianPrefBefore = await prefApi('tech');
      const del = await fetch(`${API}/api/users/me/preferences/work-orders-list`,
        { method: 'DELETE', headers: { cookie: ck('tech'), accept: 'application/json' } })
        .then(r => ({ status: r.status })).catch(e => ({ error: String(e).slice(0, 120) }));
      d.deleteCall = del;
      d.technicianPrefAfterDelete = await prefApi('tech');
      d.freshAccountAchieved = !d.technicianPrefAfterDelete.value
        || !Object.keys(d.technicianPrefAfterDelete.value || {}).length
        || d.technicianPrefAfterDelete.status === 404;

      const T = await makeHarness('tech');
      await T.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(T.page, 11000);
      d.firstVisit = await T.page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[data-test-id^="tab_"]')).map(t => ({
          id: t.getAttribute('data-test-id'), text: (t.innerText || '').trim(),
          active: /q-tab--active/.test(t.className) || t.getAttribute('aria-selected') === 'true',
          x: Math.round(t.getBoundingClientRect().x)
        })).sort((a, b) => a.x - b.x);
        return { url: location.href, tabsInOrder: tabs.map(t => t.text),
          selected: tabs.filter(t => t.active).map(t => t.id), tabs };
      });
      await L.shot(T.page, OUT, 'c38876-first-visit');
      // step 3 — switch to All
      const clickAll = await L.clickSel(T.page, '[data-test-id="tab_all"]');
      await S(T.page, 4000);
      const prefAfterAll = await prefApi('tech');
      d.afterSwitchingToAll = { clicked: clickAll, url: T.page.url(),
        savedTab: prefAfterAll.value?.tab, updatedAt: prefAfterAll.updatedAt,
        saveObserved: prefAfterAll.updatedAt !== d.technicianPrefAfterDelete.updatedAt };
      // step 4 — leave and come back
      await T.page.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(T.page, 6000);
      await T.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(T.page, 10000);
      d.afterRoundTrip = await T.page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[data-test-id^="tab_"]'));
        return { url: location.href,
          selected: tabs.filter(t => /q-tab--active/.test(t.className) || t.getAttribute('aria-selected') === 'true')
            .map(t => t.getAttribute('data-test-id')) };
      });
      d.could_fail = d.freshAccountAchieved === true && clickAll.clicked === true;
      d.bridge_errors = T.bridgeErrors.length;
      await L.shot(T.page, OUT, 'c38876-after-round-trip');
      await T.browser.close();
    } catch (e) { d.error = String(e).slice(0, 400); }
    put('38876', d);
  }

  // ============================================================ C29603 + C38897(3-4) + C38886 + C38888 + C29614(3-6)
  {
    const H = await makeHarness('admin');
    try {
      // ---- C29603: collapsed survives a return, expanded survives a return
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 10000);
      await L.ensureBarOpen(H.page);
      await L.clearAll(H.page); await S(H.page, 2400);
      const collapse = await L.clickSel(H.page, '[data-test-id="toggle_filter_bar"]');
      await S(H.page, 3000);
      const collapsedNow = !(await H.page.$('[data-test-id="filter_chip_status"]'));
      const prefCollapsed = await L.pref(H.page);
      await H.page.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 6000);
      await H.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 10000);
      const stillCollapsed = !(await H.page.$('[data-test-id="filter_chip_status"]'));
      // now expanded
      await L.clickSel(H.page, '[data-test-id="toggle_filter_bar"]'); await S(H.page, 3000);
      const expandedNow = !!(await H.page.$('[data-test-id="filter_chip_status"]'));
      const prefExpanded = await L.pref(H.page);
      await H.page.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 6000);
      await H.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 10000);
      const stillExpanded = !!(await H.page.$('[data-test-id="filter_chip_status"]'));
      put('29603', { collapseClicked: collapse, collapsedAfterClick: collapsedNow,
        savedCollapsedFlag: prefCollapsed.value?.collapsed,
        stillCollapsedAfterReturn: stillCollapsed,
        expandedAfterClick: expandedNow, savedExpandedFlag: prefExpanded.value?.collapsed,
        stillExpandedAfterReturn: stillExpanded,
        chipsOnReturn: (await L.chips(H.page)).length,
        bothDirectionsHold: collapsedNow && stillCollapsed && expandedNow && stillExpanded,
        could_fail: collapse.clicked === true });
      await L.shot(H.page, OUT, 'c29603-expanded-after-return');

      // ---- C38897 steps 3 and 4
      await L.ensureBarOpen(H.page);
      await L.clearAll(H.page); await S(H.page, 2400);
      let o = await L.openChip(H.page, 'filter_chip_status');
      await L.pickOption(H.page, 'filter_option_status_invoiced');
      await L.closeMenu(H.page); await S(H.page, 2600);
      const rowsFilterOnly = (await L.rows(H.page)).tbody;
      const sr = await L.search(H.page, 'zzzznomatchzzz');
      await S(H.page, 2600);
      const emptyMsg = await H.page.evaluate(() => (document.body.innerText.match(/No work orders[^\n]*/) || [null])[0]);
      const controls = await L.clearControls(H.page);
      // step 3 — clear the SEARCH only, using what the page offers
      const clearedSearch = await L.clickSel(H.page, '[data-test-id="page_search_clear"]');
      await S(H.page, 3200);
      const afterClearSearch = { url: H.page.url(), rows: (await L.rows(H.page)).tbody,
        statusChip: (await L.label(H.page, '[data-test-id="filter_chip_status"]')).innerText,
        searchStillInUrl: /search=/.test(H.page.url()) };
      // step 4 — retype, then clear the FILTERS only
      const sr2 = await L.search(H.page, 'zzzznomatchzzz');
      await S(H.page, 2600);
      const clearedFilters = await L.clickSel(H.page, '[data-test-id="empty_state_clear_filters"]');
      await S(H.page, 3400);
      const afterClearFilters = { url: H.page.url(),
        rows: (await L.rows(H.page)).tbody,
        searchBoxValue: await H.page.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        searchStillInUrl: /search=/.test(H.page.url()),
        statusChip: (await L.label(H.page, '[data-test-id="filter_chip_status"]')).innerText };
      put('38897', { rowsWithFilterOnly: rowsFilterOnly, searchTyped: sr, emptyMessage: emptyMsg,
        clearControlsOffered: controls,
        messageMentionsSearch: /search/i.test(emptyMsg || ''),
        step3_clearSearchOnly: { clicked: clearedSearch, after: afterClearSearch },
        step4_retyped: sr2, step4_clearFiltersOnly: { clicked: clearedFilters, after: afterClearFilters },
        could_fail: sr.typed === true });
      await L.shot(H.page, OUT, 'c38897-after-clear-filters-only');

      // ---- C38886 — the typed search is never saved to the account
      await L.clearAll(H.page); await S(H.page, 2400);
      const prefBeforeSearch = await L.pref(H.page);
      const s3 = await L.search(H.page, 'Iibay');
      await S(H.page, 3400);
      const prefAfterSearch = await L.pref(H.page);
      const urlWithSearch = H.page.url();
      put('38886', { searchTyped: s3, urlWithSearch,
        prefBefore: { updatedAt: prefBeforeSearch.updatedAt, hasSearchKey: 'search' in (prefBeforeSearch.value || {}) },
        prefAfter: { updatedAt: prefAfterSearch.updatedAt, hasSearchKey: 'search' in (prefAfterSearch.value || {}),
          value: prefAfterSearch.value },
        searchNeverSaved: !('search' in (prefAfterSearch.value || {})),
        could_fail: s3.typed === true });

      // ---- C38888 step 2 — open the copied address in a FRESH tab
      const fresh = await H.ctx.newPage();
      await fresh.goto(urlWithSearch, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(fresh, 10000);
      put('38888', { copiedUrl: urlWithSearch,
        freshTabUrl: fresh.url(),
        freshTabSearchBoxValue: await fresh.evaluate(() => { const h = document.querySelector('[data-test-id="page_search_input"]');
          const i = h ? (h.matches('input') ? h : h.querySelector('input')) : null; return i ? i.value : null; }),
        freshTabRows: await fresh.evaluate(() => document.querySelectorAll('tbody tr').length),
        originalTabRows: (await L.rows(H.page)).tbody,
        could_fail: true });
      await L.shot(fresh, OUT, 'c38888-fresh-tab');
      await fresh.close();
      R.bridge_errors_c = H.bridgeErrors.length;
    } catch (e) { R.error_c = String(e).slice(0, 500); }
    L.save(OUT, 'probeD', R);
    await H.browser.close();
  }

  // ============================================================ C29614 steps 3-6 — a fresh browser
  {
    const e = {};
    try {
      const A = await makeHarness('admin');
      await A.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(A.page, 10000);
      await L.ensureBarOpen(A.page);
      await L.clearAll(A.page); await S(A.page, 2400);
      const o = await L.openChip(A.page, 'filter_chip_status');
      const pk = await L.pickOption(A.page, 'filter_option_status_declined');
      await L.closeMenu(A.page); await S(A.page, 3600);
      const p = await L.pref(A.page);
      e.setInFirstBrowser = { picked: pk.clicked, chip: (await L.label(A.page, '[data-test-id="filter_chip_status"]')).innerText,
        savedFilters: p.value?.filters, updatedAt: p.updatedAt };
      await A.browser.close();          // <- the browser is genuinely CLOSED here

      const B = await makeHarness('admin');   // a brand-new browser process and context
      await B.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(B.page, 11000);
      await L.ensureBarOpen(B.page);
      e.afterCompletelyNewBrowser = { url: B.page.url(),
        chips: (await L.chips(B.page)).map(x => x.text),
        statusChip: (await L.label(B.page, '[data-test-id="filter_chip_status"]')).innerText,
        restored: /Declined/.test((await L.label(B.page, '[data-test-id="filter_chip_status"]')).innerText || ''),
        tally: await L.statusTally(B.page) };
      e.could_fail = pk.clicked === true;
      e.honest_limit = 'a different physical computer cannot be produced here; a brand-new browser process with the same sign-in is the closest legitimate proxy and is what was driven';
      await L.shot(B.page, OUT, 'c29614-fresh-browser');
      await B.browser.close();
    } catch (err) { e.error = String(err).slice(0, 400); }
    put('29614', e);
  }

  // ============================================================ C29616 — a REMEMBERED deleted value
  {
    const f = {};
    try {
      const name = 'ZZAUTOTEST Remembered Deleted Value Customer';
      const created = await fetch(`${API}/api/customers/create`, {
        method: 'POST', headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ name })
      }).then(r => r.json());
      const cid = created?.data?.company_id;
      f.seeded = { name, id: cid };
      if (cid) {
        const H = await makeHarness('admin');
        await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(H.page, 10000);
        await L.ensureBarOpen(H.page);
        await L.clearAll(H.page); await S(H.page, 2400);
        const oc = await L.openChip(H.page, 'filter_chip_company_id');
        await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
          const i = m && m.querySelector('input:not(.hidden)');
          if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 'ZZAUTOTEST Remembered');
        await S(H.page, 2000);
        const pk = await L.pickOption(H.page, `filter_option_company_id_${cid}`);
        await L.closeMenu(H.page); await S(H.page, 4000);
        const saved = await L.pref(H.page);
        f.pickedInUi = pk.clicked;
        f.savedPreference = saved.value?.filters;
        // THE PRECONDITION GUARD: the value must genuinely be REMEMBERED before deleting it
        f.preconditionAchieved = JSON.stringify(saved.value?.filters || {}).includes(cid);
        await H.browser.close();

        if (f.preconditionAchieved) {
          f.delete = await fetch(`${API}/api/customers/delete`, {
            method: 'POST', headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({ company_id: cid }), redirect: 'manual'
          }).then(r => ({ status: r.status }));
          f.reReadAfterDelete = await fetch(`${API}/api/customers/${cid}`,
            { headers: { cookie: ck('admin'), accept: 'application/json' } }).then(r => ({ status: r.status }));

          const H2 = await makeHarness('admin');
          await H2.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
          await S(H2.page, 11000);
          await L.ensureBarOpen(H2.page);
          const req = H2.apiLog.filter(a => /\/api\/work-orders\?/.test(a.u)).slice(-1)[0];
          f.arrivedPlainly = { url: H2.page.url(),
            chips: (await L.chips(H2.page)).map(x => x.text),
            customerChip: (await L.label(H2.page, '[data-test-id="filter_chip_company_id"]')).innerText,
            customerChipShowsAValue: /:/.test((await L.label(H2.page, '[data-test-id="filter_chip_company_id"]')).innerText || ''),
            rows: await L.rows(H2.page),
            lastListRequest: req ? { status: req.s, decoded: decodeURIComponent(req.u) } : null,
            deletedIdStillSent: req ? decodeURIComponent(req.u).includes(cid) : null,
            pageErrored: await H2.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
            realConsoleErrors: H2.consoleErrs.filter(x => !/ERR_FAILED|404/.test(x)).slice(0, 3) };
          f.savedPreferenceAfter = (await L.pref(H2.page)).value?.filters;
          f.could_fail = true;
          await L.shot(H2.page, OUT, 'c29616-remembered-deleted');
          await H2.browser.close();
        } else {
          f.note = 'the seeded customer never reached the saved preference, so the case precondition was not achieved and nothing is concluded';
        }
      }
    } catch (err) { f.error = String(err).slice(0, 400); }
    put('29616', f);
  }

  console.log('blocks:', Object.keys(R.cases).length, '| errors:', R.error_c);
})();
