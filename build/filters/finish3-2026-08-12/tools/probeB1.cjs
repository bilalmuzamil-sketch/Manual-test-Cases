// probeB1.cjs — the Status-chip and chip-display group, walked step by step.
// C29557 C29558 C29560 C29561 C29562 C29563 C29564 C29565 C29595 C29596 C29597 C29598 C29599
//
// SAFE OUTSIDE-CLICK: (700, 85) is empty tab-row space. Rows begin at y≈247 and a click at
// (700,400) opens a work order — that mistake cost the previous pass a whole finding.
// Every block asserts the URL did not change, so "the dropdown closed" cannot be confused
// with "we navigated away".

const { makeHarness, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');

const S = (p) => p.waitForTimeout(2200);

(async () => {
  const H = await makeHarness('admin');
  const R = { build_read_at: new Date().toISOString(), cases: {} };
  try {
    // Clean slate: no filters, bar expanded.
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    // ---------------------------------------------------------------- C29557
    const geom = await H.page.evaluate(() => {
      const tab = document.querySelector('[data-test-id="tab_all"]');
      const chip = document.querySelector('[data-test-id="filter_chip_status"]');
      const tbl = document.querySelector('table') || document.querySelector('tbody');
      const r = e => e ? e.getBoundingClientRect() : null;
      const a = r(tab), b = r(chip), c = r(tbl);
      return {
        tabRowY: a && Math.round(a.y), tabRowBottom: a && Math.round(a.bottom),
        barY: b && Math.round(b.y), tableY: c && Math.round(c.y),
        barIsBelowTabs: !!(a && b) && b.y >= a.bottom,
        barIsAboveTable: !!(b && c) && b.y < c.y,
        chipsVisible: !!b
      };
    });
    const pref0 = await L.pref(H.page);
    R.cases['29557'] = { geometry: geom, saved_collapsed: pref0.value?.collapsed,
      note: 'expanded state here is this account\'s saved preference; the default-for-a-new-account claim is C38876 ground' };
    await L.shot(H.page, OUT, 'c29557-bar-below-tabs');

    // ---------------------------------------------------------------- C29558
    const ch = await H.page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => {
      const icon = e.querySelector('i.q-icon, .material-icons');
      const arrow = Array.from(e.querySelectorAll('i')).map(i => (i.textContent || '').trim());
      return {
        id: e.getAttribute('data-test-id'),
        text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
        leadingIcon: icon ? (icon.textContent || '').trim() : null,
        allIcons: arrow,
        x: Math.round(e.getBoundingClientRect().x)
      };
    }).sort((a, b) => a.x - b.x));
    R.cases['29558'] = { chips: ch, count: ch.length,
      order: ch.map(c => c.text.replace(/keyboard_arrow_down/, '').trim()) };

    // ---------------------------------------------------------------- C29560
    const o = await L.openChip(H.page, 'filter_chip_status');
    const bottom = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu');
      if (!menu) return null;
      const all = Array.from(menu.querySelectorAll('div,button,span'))
        .map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      return { hasClearSelection: /Clear Selection/i.test(menu.innerText || ''), lastTexts: all.slice(-4) };
    });
    R.cases['29560'] = { opened: o.found, optionCount: o.options.length,
      optionsInOrder: o.options.map(x => x.text), anyChecked: o.options.filter(x => x.checked).length,
      clearSelection: bottom };
    await L.shot(H.page, OUT, 'c29560-status-menu');

    // ---------------------------------------------------------------- C29561
    const urlBefore = H.page.url();
    const rowsBefore = await L.rows(H.page);
    const p1 = await L.pickOption(H.page, 'filter_option_status_estimate');
    await S(H.page);
    const menuStillOpen = await H.page.$('.q-menu');
    const applyBtn = await H.page.evaluate(() => Array.from(document.querySelectorAll('button'))
      .map(b => (b.innerText || '').trim()).filter(t => /^(apply|confirm|ok|submit)$/i.test(t)));
    R.cases['29561'] = { picked: p1.clicked, urlBefore, urlAfter: H.page.url(),
      rowsBefore: rowsBefore.tbody, rowsAfter: (await L.rows(H.page)).tbody,
      dropdownStillOpenWhileTableUpdated: !!menuStillOpen, applyLikeButtons: applyBtn };

    // ---------------------------------------------------------------- C29562
    const p2 = await L.pickOption(H.page, 'filter_option_status_approved');
    await S(H.page);
    const opts2 = await H.page.$$eval(L.OPT, els => els.map(e => ({
      id: e.getAttribute('data-test-id'),
      checkIcon: !!Array.from(e.querySelectorAll('i')).find(i => /check/.test(i.textContent || ''))
    })));
    const statusesInTable = await H.page.evaluate(() => {
      const out = {};
      document.querySelectorAll('tbody tr').forEach(tr => {
        const t = (tr.innerText || '').split('\n')[0].trim();
        if (t) out[t] = (out[t] || 0) + 1;
      });
      return out;
    });
    R.cases['29562'] = { pickedSecond: p2.clicked, url: H.page.url(),
      checkedOptions: opts2.filter(x => x.checkIcon).map(x => x.id),
      rows: (await L.rows(H.page)).tbody, firstCellCounts: statusesInTable };
    await L.shot(H.page, OUT, 'c29562-two-statuses');

    // ---------------------------------------------------------------- C29595 / C29596 (chip look)
    const chipLook = await L.label(H.page, '[data-test-id="filter_chip_status"]');
    R.cases['29595'] = { chip: chipLook, twoValuesApplied: true };
    R.cases['29596'] = { chipTextWithTwoValues: chipLook.innerText, width: chipLook.w };

    // ---------------------------------------------------------------- C29597 (Clear Filters visible only when active)
    const cfWhenActive = await L.label(H.page, '[data-test-id="clear_filters"]');
    R.cases['29597'] = { withFilterActive: cfWhenActive };

    // ---------------------------------------------------------------- C29564 (outside click)
    const beforeOutside = H.page.url();
    await H.page.mouse.click(700, 85);          // empty tab-row space, NOT the table
    await S(H.page);
    const menuAfter = await H.page.$('.q-menu');
    const chipAfter = await L.label(H.page, '[data-test-id="filter_chip_status"]');
    R.cases['29564'] = { urlBefore: beforeOutside, urlAfter: H.page.url(),
      navigatedAway: beforeOutside.split('?')[0] !== H.page.url().split('?')[0],
      dropdownClosed: !menuAfter, chipStillShowsSelection: chipAfter.innerText,
      rows: (await L.rows(H.page)).tbody };
    await L.shot(H.page, OUT, 'c29564-after-outside-click');

    // ---------------------------------------------------------------- C29599 (Clear Selection clears only that filter)
    // Add a SECOND filter first, so "only that one" is falsifiable.
    const oc = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const yesOpt = oc.options.find(x => /yes/i.test(x.text));
    if (yesOpt) await L.pickOption(H.page, yesOpt.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlTwoFilters = H.page.url();
    const os = await L.openChip(H.page, 'filter_chip_status');
    const clearedOne = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu'); if (!menu) return false;
      const btn = Array.from(menu.querySelectorAll('div,button,span'))
        .find(e => /^Clear Selection$/i.test((e.innerText || '').trim()));
      if (!btn) return false; btn.click(); return true;
    });
    await S(H.page); await L.closeMenu(H.page); await S(H.page);
    R.cases['29599'] = { urlWithTwoFilters: urlTwoFilters, statusMenuOptions: os.options.length,
      clearSelectionClicked: clearedOne, urlAfter: H.page.url(),
      chips: (await L.chips(H.page)).map(c => c.text) };

    // ---------------------------------------------------------------- C29563 (Clear Selection unticks every status)
    const o3 = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_estimate');
    await L.pickOption(H.page, 'filter_option_status_approved');
    await S(H.page);
    const before563 = await H.page.$$eval(L.OPT, els => els.filter(e =>
      Array.from(e.querySelectorAll('i')).some(i => /check/.test(i.textContent || ''))).length);
    const rows563before = (await L.rows(H.page)).tbody;
    const cs = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu'); if (!menu) return false;
      const btn = Array.from(menu.querySelectorAll('div,button,span'))
        .find(e => /^Clear Selection$/i.test((e.innerText || '').trim()));
      if (!btn) return false; btn.click(); return true;
    });
    await S(H.page);
    const after563 = await H.page.$$eval(L.OPT, els => els.filter(e =>
      Array.from(e.querySelectorAll('i')).some(i => /check/.test(i.textContent || ''))).length);
    await L.closeMenu(H.page); await S(H.page);
    R.cases['29563'] = { menuOptions: o3.options.length, tickedBefore: before563, clicked: cs,
      tickedAfter: after563, rowsBefore: rows563before, rowsAfter: (await L.rows(H.page)).tbody,
      urlAfter: H.page.url(), otherFilterSurvived: /vehicleHere/.test(H.page.url()) };

    // ---------------------------------------------------------------- C29598 (Clear Filters removes every filter)
    const o4 = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_invoiced');
    await L.closeMenu(H.page); await S(H.page);
    const urlBeforeClear = H.page.url();
    const chipsBeforeClear = (await L.chips(H.page)).map(c => c.text);
    const ca = await L.clearAll(H.page);
    R.cases['29598'] = { urlBefore: urlBeforeClear, chipsBefore: chipsBeforeClear,
      clearFiltersPresent: ca.present, urlAfter: H.page.url(),
      chipsAfter: (await L.chips(H.page)).map(c => c.text),
      rowsAfter: (await L.rows(H.page)).tbody };
    // C29597 second half: the control must be ABSENT with no filter active.
    R.cases['29597'].withNoFilterActive = await L.label(H.page, '[data-test-id="clear_filters"]');
    await L.shot(H.page, OUT, 'c29598-after-clear-filters');

    // ---------------------------------------------------------------- C29565 (a status no work order has)
    const o5 = await L.openChip(H.page, 'filter_chip_status');
    const counts = {};
    for (const opt of o5.options) {
      if (!/filter_option_status_/.test(opt.id || '')) continue;
      counts[opt.id] = opt.text;
    }
    await L.closeMenu(H.page);
    // Ask the server which status genuinely has none, rather than guessing.
    const tally = await H.page.evaluate(async (api) => {
      const out = {};
      for (const s of ['estimate', 'approved', 'in_progress', 'review', 'complete', 'invoiced', 'paid', 'declined', 'imported']) {
        const r = await fetch(`${api}/api/work-orders?status[]=${s}&limit=1`, { headers: { accept: 'application/json' } });
        const j = await r.json().catch(() => null);
        out[s] = r.status === 200 ? (j?.meta?.total ?? j?.data?.length ?? 'n/a') : `HTTP ${r.status}`;
      }
      return out;
    }, 'https://sv8785api.qa.shopview.com');
    const emptyStatus = Object.entries(tally).find(([, v]) => v === 0);
    let empt = { skipped: 'no status has zero work orders' };
    if (emptyStatus) {
      const oz = await L.openChip(H.page, 'filter_chip_status');
      const pk = await L.pickOption(H.page, `filter_option_status_${emptyStatus[0]}`);
      await L.closeMenu(H.page); await S(H.page);
      empt = { status: emptyStatus[0], picked: pk.clicked, menuOptions: oz.options.length,
        url: H.page.url(), rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => {
          const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        consoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED/.test(e)).slice(0, 3) };
      await L.shot(H.page, OUT, 'c29565-empty-state');
    }
    R.cases['29565'] = { serverTallyByStatus: tally, drove: empt };

    await L.clearAll(H.page);
    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 500); }
  L.save(OUT, 'probeB1', R);
  console.log(JSON.stringify(R).slice(0, 400));
  await H.browser.close();
})();
