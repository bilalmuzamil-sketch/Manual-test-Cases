// probeB4.cjs — collapse/expand, tabs, empty state, URL and the API group, plus the
// sub-checks probeB3 left vacuous.
//
// C29602 C29604 C29605 C29606 C29607 C29608 C29611 C29613 C29617 C29600
// C29631 C29632 C29635  |  re-driven: C29569 C29587 C29590 C29591 C29592 C29568(long name)
//
// COUNTING: the server caps a page at 1000 rows and returns no total, so a raw count
// cannot compare "all" with "on site". Every count assertion here is made inside a SMALL
// set (status=declined, 7 work orders) where the numbers are exact and disjointness is
// checkable by work-order NUMBER, not by totals.

const { makeHarness, OUT, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const S = (p, n = 2200) => p.waitForTimeout(n);

async function q(page, filters) {
  return page.evaluate(async ({ api, fs }) => {
    const p = new URLSearchParams();
    p.set('pagination[rowsPerPage]', '3000'); p.set('pagination[page]', '1');
    fs.forEach((f, i) => { p.set(`filters[${i}][field]`, f.field); p.set(`filters[${i}][value]`, f.value); });
    p.set('search', ''); p.set('showMyWorkOrders', '0');
    const r = await fetch(`${api}/api/work-orders?${p}`, { headers: { accept: 'application/json' } });
    let j = null; try { j = await r.json(); } catch (_) {}
    const w = j?.data?.work_orders || [];
    return { http: r.status, count: w.length, numbers: w.map(x => x.number).filter(Boolean).sort(),
      query: p.toString() };
  }, { api: API, fs: filters });
}

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeB4', R); };
  try {
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    // ============================================================ C29604 — indicator only when active
    // step 1: NO filters, collapse, look at the icon
    const iconState = async () => H.page.evaluate(() => {
      const b = document.querySelector('[data-test-id="toggle_filter_bar"]');
      if (!b) return { present: false };
      const i = b.querySelector('i.q-icon');
      const cs = getComputedStyle(i || b);
      return { present: true, btnClass: b.className, iconClass: i ? i.className : null,
        color: cs.color, hasDot: !!b.querySelector('.q-badge,[class*="dot"],[class*="indicator"]'),
        ariaPressed: b.getAttribute('aria-pressed') };
    });
    const tgl = await H.page.$('[data-test-id="toggle_filter_bar"]');
    await tgl.click(); await S(H.page, 2500);
    const collapsedNoFilters = await iconState();
    const chipsGoneNoFilters = (await L.chips(H.page)).length;
    await (await H.page.$('[data-test-id="toggle_filter_bar"]')).click(); await S(H.page, 2500);
    // step 2: select a status
    let o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page);
    const urlFiltered = H.page.url();
    const tableFiltered = await L.statusTally(H.page);
    // step 3: collapse again
    await (await H.page.$('[data-test-id="toggle_filter_bar"]')).click(); await S(H.page, 2500);
    const collapsedWithFilters = await iconState();
    put('29604', { collapsedWithNoFilters: collapsedNoFilters, chipCountWhenCollapsed: chipsGoneNoFilters,
      collapsedWithAFilter: collapsedWithFilters,
      differs: JSON.stringify(collapsedNoFilters) !== JSON.stringify(collapsedWithFilters),
      could_fail: collapsedNoFilters.present && collapsedWithFilters.present });
    await L.shot(H.page, OUT, 'c29604-collapsed-with-filter');

    // ============================================================ C29605 — filtering survives collapse
    put('29605', { urlWhileCollapsed: H.page.url(), urlWhenExpanded: urlFiltered,
      tableWhenExpanded: tableFiltered, tableWhileCollapsed: await L.statusTally(H.page),
      chipsHidden: (await L.chips(H.page)).length === 0,
      rowsWhileCollapsed: (await L.rows(H.page)).tbody, could_fail: true });

    // ============================================================ C29602 — expand brings filters back
    await (await H.page.$('[data-test-id="toggle_filter_bar"]')).click(); await S(H.page, 2500);
    const backChips = await L.chips(H.page);
    put('29602', { chipsAfterExpand: backChips.map(c => ({ t: c.text, bg: c.background })),
      statusChipActive: backChips.find(c => c.id === 'filter_chip_status'),
      clearFiltersStillThere: await L.label(H.page, '[data-test-id="clear_filters"]'),
      barBelowTabs: await H.page.evaluate(() => {
        const t = document.querySelector('[data-test-id="tab_all"]');
        const c = document.querySelector('[data-test-id="filter_chip_status"]');
        return t && c ? c.getBoundingClientRect().y >= t.getBoundingClientRect().bottom : null; }),
      url: H.page.url(), could_fail: true });

    // ============================================================ C29606 / C29607 — the empty state
    // A combination with no matches: declined + a technician who leads none.
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page);
    const ot = await L.openChip(H.page, 'filter_chip_tech_assigned_id');
    const adminTech = ot.options.find(x => /Admin ShopView/i.test(x.text));
    if (adminTech) await L.pickOption(H.page, adminTech.id);
    await L.closeMenu(H.page); await S(H.page, 3200);
    const emptyBody = await H.page.evaluate(() => {
      const t = document.querySelector('tbody');
      const txt = document.body.innerText;
      const m = txt.match(/No work orders[^\n]*/);
      const host = Array.from(document.querySelectorAll('div,td')).filter(e =>
        /No work orders/i.test(e.innerText || '') && (e.innerText || '').length < 300)
        .sort((a, b) => a.innerText.length - b.innerText.length)[0];
      return { message: m ? m[0] : null,
        emptyStateBlockText: host ? host.innerText.replace(/\s+/g, ' ').trim() : null,
        controlsInBlock: host ? Array.from(host.querySelectorAll('button,a,[data-test-id]'))
          .map(b => ({ id: b.getAttribute('data-test-id'), text: (b.innerText || '').trim() })) : null,
        bodyRowCount: t ? t.querySelectorAll('tr').length : null,
        looksBroken: /error|something went wrong|failed/i.test(txt) };
    });
    put('29606', { url: H.page.url(), empty: emptyBody,
      realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3),
      could_fail: true });
    await L.shot(H.page, OUT, 'c29606-empty-state');

    // C29607 — click the clear-filters prompt INSIDE the empty state
    const escId = await H.page.evaluate(() => {
      const b = document.querySelector('[data-test-id="empty_state_clear_filters"]');
      return b ? { present: true, text: (b.innerText || '').trim() } : { present: false };
    });
    let clickedEsc = false;
    if (escId.present) {
      await (await H.page.$('[data-test-id="empty_state_clear_filters"]')).click();
      await S(H.page, 3000); clickedEsc = true;
    }
    put('29607', { emptyStateClearControl: escId, clicked: clickedEsc, urlAfter: H.page.url(),
      chipsAfter: (await L.chips(H.page)).map(c => c.text),
      rowsAfter: (await L.rows(H.page)).tbody,
      searchBoxAfter: await L.label(H.page, '[data-test-id="page_search_input"]'),
      could_fail: escId.present });

    // ============================================================ C29608 — All tab, five chips, each opens
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    await (await H.page.$('[data-test-id="tab_all"]')).click(); await S(H.page, 2600);
    const five = ['filter_chip_status', 'filter_chip_company_id', 'filter_chip_tech_assigned_id',
                  'filter_chip_service_advisor_id', 'filter_chip_vehicleHere'];
    const opens = [];
    for (const id of five) {
      const r = await L.openChip(H.page, id);
      opens.push({ chip: id, opened: r.found, options: r.options.length });
      await L.closeMenu(H.page); await S(H.page, 900);
    }
    put('29608', { tab: H.page.url(), chipsPresent: (await L.chips(H.page)).length, eachOpened: opens,
      allOpened: opens.every(x => x.opened && x.options > 0), could_fail: true });

    // ============================================================ C29611 — My Work Orders tab
    const myTab = await H.page.$('[data-test-id="tab_my_work_orders"]');
    let my = { tabFound: !!myTab };
    if (myTab) {
      await myTab.click(); await S(H.page, 3200);
      my.url = H.page.url();
      my.chipCount = (await L.chips(H.page)).length;
      my.chips = (await L.chips(H.page)).map(c => c.text);
      my.rowsBefore = (await L.rows(H.page)).tbody;
      my.tallyBefore = await L.statusTally(H.page);
      const firstStatus = Object.keys(my.tallyBefore).find(k => /^[A-Z]/.test(k));
      const oS = await L.openChip(H.page, 'filter_chip_status');
      const optId = `filter_option_status_${(firstStatus || 'estimate').toLowerCase().replace(/ /g, '_')}`;
      const pk = await L.pickOption(H.page, optId);
      await L.closeMenu(H.page); await S(H.page, 3000);
      my.statusPicked = { wanted: firstStatus, optionId: optId, clicked: pk.clicked, menuOptions: oS.options.length };
      my.url2 = H.page.url();
      my.tallyAfter = await L.statusTally(H.page);
      my.scopeParamKept = /showMyWorkOrders|my/i.test(H.page.url()) || my.url2.includes('tab=my');
      my.could_fail = pk.clicked;
      await L.shot(H.page, OUT, 'c29611-my-work-orders');
    }
    put('29611', my);

    // ============================================================ C29617 — URL reflects filters
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    const urlClean = H.page.url();
    o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page);
    const oc = await L.openChip(H.page, 'filter_chip_company_id');
    const firstC = oc.options[0];
    if (firstC) await L.pickOption(H.page, firstC.id);
    await L.closeMenu(H.page); await S(H.page, 2600);
    const urlWith = H.page.url();
    const cleared = await L.clearAll(H.page);
    put('29617', { urlBefore: urlClean, urlWithFilters: urlWith,
      hasStatus: /status=/.test(urlWith), hasCustomer: /company_id=/.test(urlWith),
      clearFiltersUsed: cleared.present, urlAfterClear: H.page.url(),
      filterPartRemoved: !/status=|company_id=/.test(H.page.url()), could_fail: true });

    // ============================================================ C29600 / C29631 / C29632 / C29635
    // Small, exact sets: declined (7) intersected with a real customer of one of them.
    const declined = await q(H.page, [{ field: 'status', value: 'declined' }]);
    const approved = await q(H.page, [{ field: 'status', value: 'approved' }]);
    // find a customer that has BOTH a declined and an approved work order
    const custOf = await H.page.evaluate(async ({ api }) => {
      const get = async (st) => {
        const p = new URLSearchParams({ 'pagination[rowsPerPage]': '3000', 'pagination[page]': '1',
          'filters[0][field]': 'status', 'filters[0][value]': st, search: '', showMyWorkOrders: '0' });
        const r = await fetch(`${api}/api/work-orders?${p}`, { headers: { accept: 'application/json' } });
        const j = await r.json();
        return (j?.data?.work_orders || []).map(w => ({ n: w.number, c: w.company?.id || w.company_id, cn: w.company?.name }));
      };
      const d = await get('declined'), a = await get('approved');
      const dm = new Map(d.map(x => [x.c, x]));
      const both = a.find(x => dm.has(x.c));
      return both ? { companyId: both.c, companyName: both.cn } : { none: true, declinedSample: d.slice(0, 3) };
    }, { api: API });
    let combo = { custOf };
    if (custOf.companyId) {
      const dOnly = await q(H.page, [{ field: 'status', value: 'declined' }, { field: 'company_id', value: custOf.companyId }]);
      const aOnly = await q(H.page, [{ field: 'status', value: 'approved' }, { field: 'company_id', value: custOf.companyId }]);
      const bothStatuses = await q(H.page, [{ field: 'status', value: 'declined' },
        { field: 'status', value: 'approved' }, { field: 'company_id', value: custOf.companyId }]);
      const custAll = await q(H.page, [{ field: 'company_id', value: custOf.companyId }]);
      combo = { custOf, declinedTotal: declined.count, approvedTotal: approved.count,
        customerDeclined: dOnly, customerApproved: aOnly, customerBothStatuses: bothStatuses,
        customerAll: custAll,
        intersectionHolds: bothStatuses.count === dOnly.count + aOnly.count,
        subsetOfCustomer: bothStatuses.numbers.every(n => custAll.numbers.includes(n)),
        narrowerThanStatusAlone: bothStatuses.count < declined.count + approved.count };
    }
    put('29632', combo);
    put('29600', { ...combo, note: 'intersection of one status with one customer' });

    // C29631 — drive it in the UI and read the request the page actually sent
    await L.goWO(H.page, '?tab=all'); await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    const before = H.apiLog.length;
    o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page);
    const oc2 = await L.openChip(H.page, 'filter_chip_company_id');
    if (custOf.companyId) {
      const hit = oc2.options.find(x => x.id.endsWith(custOf.companyId));
      if (hit) await L.pickOption(H.page, hit.id);
    }
    await L.closeMenu(H.page); await S(H.page, 3000);
    const sent = H.apiLog.slice(before).filter(a => /\/api\/work-orders\?/.test(a.u));
    const last = sent[sent.length - 1];
    put('29631', { requestsAfterFilterChange: sent.length,
      lastRequest: last ? { method: last.m, status: last.s, decoded: decodeURIComponent(last.u) } : null,
      carriesStatus: last ? /field%5D=status|field]=status/.test(decodeURIComponent(last.u)) : null,
      carriesCustomer: last ? decodeURIComponent(last.u).includes(custOf.companyId || 'company_id') : null,
      http200: last ? last.s === 200 : null,
      tableTally: await L.statusTally(H.page), url: H.page.url(), could_fail: sent.length > 0 });

    // C29635 — a combination matching nothing, at the API and on the page
    const nothing = await q(H.page, [{ field: 'status', value: 'declined' },
      { field: 'tech_assigned_id', value: 'ccbacb31-53f3-488e-9a7e-28f781761e62' }]);
    put('29635', { request: nothing.query, http: nothing.http, count: nothing.count,
      isEmptyNotError: nothing.http === 200 && nothing.count === 0,
      pageEmptyStateSeenEarlier: R.cases['29606']?.empty?.message, could_fail: true });

    // ============================================================ C29613 — round trip
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page);
    const oc3 = await L.openChip(H.page, 'filter_chip_company_id');
    if (custOf.companyId) { const h = oc3.options.find(x => x.id.endsWith(custOf.companyId)); if (h) await L.pickOption(H.page, h.id); }
    await L.closeMenu(H.page); await S(H.page, 2600);
    const beforeTrip = { url: H.page.url(), chips: (await L.chips(H.page)).map(c => c.text), expanded: true };
    const firstRow = await H.page.$('tbody tr:nth-child(2) td:nth-child(4)');
    let opened = null;
    if (firstRow) { await firstRow.click(); await S(H.page, 5000); opened = H.page.url(); }
    await H.page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await S(H.page, 6000);
    const afterTrip = { url: H.page.url(), chips: (await L.chips(H.page)).map(c => c.text),
      barExpanded: !!(await H.page.$('[data-test-id="filter_chip_status"]')) };
    // now collapsed round trip
    const tgl2 = await H.page.$('[data-test-id="toggle_filter_bar"]');
    if (tgl2) { await tgl2.click(); await S(H.page, 2500); }
    const collapsedBefore = !(await H.page.$('[data-test-id="filter_chip_status"]'));
    await H.page.goto('https://sv8785.qa.shopview.com/customers', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 6000);
    await H.page.goto('https://sv8785.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 8000);
    const afterCollapsedTrip = { url: H.page.url(),
      barStillCollapsed: !(await H.page.$('[data-test-id="filter_chip_status"]')),
      savedPref: (await L.pref(H.page)).value };
    put('29613', { beforeTrip, openedWorkOrder: opened, afterTrip,
      collapsedBeforeLeaving: collapsedBefore, afterCollapsedTrip,
      could_fail: !!opened || collapsedBefore });
    await L.shot(H.page, OUT, 'c29613-after-round-trip');

    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 700); }
  L.save(OUT, 'probeB4', R);
  console.log('ERR:', R.error, '| bridge:', R.bridge_errors, '| blocks:', Object.keys(R.cases).length);
  await H.browser.close();
})();
