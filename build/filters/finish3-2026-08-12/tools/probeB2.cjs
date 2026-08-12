// probeB2.cjs — (a) the B1 sub-checks that were broken by MY OWN detectors, re-driven with
// aria-checked and the server's own total; (b) the Customer group; (c) the Asset on Site group.
//
// C29561 C29562 C29563 C29565 C29558(icon)  |  C29566 C29567 C29568 C29569 C29570 C29571
// C29572 C29573  |  C29589 C29590 C29591 C29592 C29593 C29594
//
// Row counts come from serverCount() -- the visible table is capped at 30 rows, so
// "33 before and 33 after" told the earlier run nothing at all.

const { makeHarness, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const S = (p, n = 2200) => p.waitForTimeout(n);

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeB2', R); };  // written AS each block finishes
  try {
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    // ============================================================ C29558 — the Status chip's icon
    put('29558-icon', await H.page.evaluate(() => {
      const c = document.querySelector('[data-test-id="filter_chip_status"]');
      const i = c && c.querySelector('i.q-icon');
      if (!i) return { iconElementPresent: false };
      const cs = getComputedStyle(i);
      const r = i.getBoundingClientRect();
      return { iconElementPresent: true, ligatureText: (i.textContent || '').trim(),
        classes: i.className, fontFamily: cs.fontFamily,
        hasSvgChild: !!i.querySelector('svg'), hasImgChild: !!i.querySelector('img'),
        backgroundImage: cs.backgroundImage, maskImage: cs.maskImage || cs.webkitMaskImage,
        width: Math.round(r.width), height: Math.round(r.height), visible: r.width > 0 && r.height > 0 };
    }));

    // ============================================================ C29561 — one status, immediate
    const base = await L.serverCount(H.page, []);
    let o = await L.openChip(H.page, 'filter_chip_status');
    const pick1 = await L.pickOption(H.page, 'filter_option_status_estimate');
    await S(H.page);
    const t1 = await L.tickedCount(H.page);
    const est = await L.serverCount(H.page, [{ field: 'status', value: 'estimate' }]);
    const menuOpen = !!(await H.page.$('.q-menu'));
    const applyish = await H.page.evaluate(() => Array.from(document.querySelectorAll('button'))
      .map(b => (b.innerText || '').trim()).filter(t => /^(apply|confirm|ok|submit|done)$/i.test(t)));
    put('29561', { opened: o.found, options: o.options.length, picked: pick1.clicked,
      tickedNow: t1, url: H.page.url(), dropdownStillOpen: menuOpen, applyLikeButtons: applyish,
      totalUnfiltered: base.total, totalEstimate: est.total,
      tableStatusTally: await L.statusTally(H.page),
      could_fail: pick1.clicked && t1.length === 1 && base.total !== null });

    // ============================================================ C29562 — several statuses = OR
    const pick2 = await L.pickOption(H.page, 'filter_option_status_approved');
    await S(H.page);
    const t2 = await L.tickedCount(H.page);
    const both = await L.serverCount(H.page, [{ field: 'status', value: 'estimate' }, { field: 'status', value: 'approved' }]);
    const appr = await L.serverCount(H.page, [{ field: 'status', value: 'approved' }]);
    await L.closeMenu(H.page); await S(H.page);
    put('29562', { pickedSecond: pick2.clicked, tickedNow: t2, url: H.page.url(),
      totalEstimate: est.total, totalApproved: appr.total, totalEither: both.total,
      unionHolds: (est.total !== null && appr.total !== null && both.total !== null)
        ? (both.total === est.total + appr.total) : null,
      tableStatusTally: await L.statusTally(H.page),
      could_fail: t2.length === 2 });
    await L.shot(H.page, OUT, 'c29562-two-statuses-fixed');

    // ============================================================ C29563 — Clear Selection unticks all
    // A second filter is set first so "only that filter" is falsifiable.
    let oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const yes = oa.options.find(x => /^Yes$/i.test(x.text));
    if (yes) await L.pickOption(H.page, yes.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlTwo = H.page.url();
    o = await L.openChip(H.page, 'filter_chip_status');
    const tBefore = await L.tickedCount(H.page);
    const csOk = await L.clearSelection(H.page);
    const tAfter = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page);
    put('29563', { urlWithBothFilters: urlTwo, statusMenuOptions: o.options.length,
      tickedBefore: tBefore, clearSelectionClicked: csOk, tickedAfter: tAfter,
      urlAfter: H.page.url(), otherFilterSurvived: /vehicleHere/.test(H.page.url()),
      totalAfter: (await L.serverCount(H.page, [{ field: 'vehicleHere', value: '1' }])).total,
      could_fail: tBefore.length > 0 });

    // ============================================================ C29565 — a status no work order has
    const tally = {};
    for (const s of ['estimate', 'approved', 'in_progress', 'review', 'complete', 'invoiced', 'paid', 'declined', 'imported']) {
      tally[s] = (await L.serverCount(H.page, [{ field: 'status', value: s }])).total;
    }
    const zero = Object.entries(tally).find(([, v]) => v === 0);
    let drove = { note: 'no status currently has zero work orders on this branch' };
    if (zero) {
      await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
      const oz = await L.openChip(H.page, 'filter_chip_status');
      const pz = await L.pickOption(H.page, `filter_option_status_${zero[0]}`);
      await L.closeMenu(H.page); await S(H.page, 3000);
      drove = { status: zero[0], picked: pz.clicked, options: oz.options.length, url: H.page.url(),
        rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED/.test(e)).slice(0, 3) };
      await L.shot(H.page, OUT, 'c29565-empty-state-fixed');
    }
    put('29565', { serverTotalsByStatus: tally, drove });

    // ============================================================ CUSTOMER GROUP
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');

    // C29566 — panel anatomy
    const oc = await L.openChip(H.page, 'filter_chip_company_id');
    const anatomy = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu'); if (!menu) return { menu: false };
      const inp = menu.querySelector('input:not(.hidden)');
      const scroll = Array.from(menu.querySelectorAll('*')).find(e => e.scrollHeight > e.clientHeight + 8);
      return { menu: true,
        searchInput: inp ? { placeholder: inp.getAttribute('placeholder'), focused: document.activeElement === inp,
                             y: Math.round(inp.getBoundingClientRect().y) } : null,
        hasClearSelection: /Clear Selection/i.test(menu.innerText || ''),
        scrollableListPresent: !!scroll,
        firstOptionY: (() => { const f = menu.querySelector('[data-test-id^="filter_option_"]');
          return f ? Math.round(f.getBoundingClientRect().y) : null; })() };
    });
    put('29566', { opened: oc.found, optionCount: oc.options.length, anatomy });
    await L.shot(H.page, OUT, 'c29566-customer-menu');

    // C29567 — typing narrows; deleting restores
    const someName = (oc.options[2] || oc.options[0] || {}).text || '';
    const frag = someName.slice(0, 4);
    const typed = await H.page.evaluate(async (f) => {
      const menu = document.querySelector('.q-menu'); if (!menu) return { ok: false };
      const inp = menu.querySelector('input:not(.hidden)'); if (!inp) return { ok: false };
      inp.focus(); inp.value = f;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return { ok: true, value: inp.value };
    }, frag);
    await S(H.page, 2500);
    const narrowed = await H.page.$$eval(L.OPT, e => e.map(x => (x.innerText || '').trim()));
    const cleared = await H.page.evaluate(async () => {
      const menu = document.querySelector('.q-menu'); const inp = menu && menu.querySelector('input:not(.hidden)');
      if (!inp) return false; inp.value = ''; inp.dispatchEvent(new Event('input', { bubbles: true })); return true;
    });
    await S(H.page, 2500);
    const restored = await H.page.$$eval(L.OPT, e => e.length);
    put('29567', { fullListCount: oc.options.length, typedFragment: frag, typedOk: typed,
      narrowedCount: narrowed.length, narrowedSample: narrowed.slice(0, 5),
      allNarrowedMatch: narrowed.every(n => n.toLowerCase().includes(frag.toLowerCase())),
      clearedOk: cleared, restoredCount: restored,
      could_fail: typed.ok && oc.options.length > 0 });

    // C29573 — a search matching nothing
    await H.page.evaluate(() => { const m = document.querySelector('.q-menu'); const i = m && m.querySelector('input:not(.hidden)');
      if (i) { i.value = 'zzzqqq'; i.dispatchEvent(new Event('input', { bubbles: true })); } });
    await S(H.page, 2500);
    put('29573', { optionsShown: await H.page.$$eval(L.OPT, e => e.length),
      menuText: await H.page.evaluate(() => { const m = document.querySelector('.q-menu'); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null; }),
      realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED/.test(e)).slice(0, 3) });
    await L.shot(H.page, OUT, 'c29573-no-match');
    await H.page.evaluate(() => { const m = document.querySelector('.q-menu'); const i = m && m.querySelector('input:not(.hidden)');
      if (i) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
    await S(H.page, 2500);

    // C29568 — three selected: tags at the top, ticks in the list
    const list = await H.page.$$eval(L.OPT, e => e.map(x => ({ id: x.getAttribute('data-test-id'), t: (x.innerText || '').trim() })));
    const three = list.slice(0, 3);
    for (const c of three) { await L.pickOption(H.page, c.id); await S(H.page, 1400); }
    const tagState = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu'); if (!menu) return { menu: false };
      const tags = Array.from(menu.querySelectorAll('.q-chip')).map(c => ({
        text: (c.innerText || '').replace(/\s+/g, ' ').trim(),
        hasRemove: !!c.querySelector('.q-chip__icon--remove, [class*="remove"]'),
        overflow: getComputedStyle(c.querySelector('.q-chip__content') || c).textOverflow
      }));
      return { menu: true, tags };
    });
    const ticked3 = await L.tickedCount(H.page);
    put('29568', { pickedIds: three.map(t => t.id), pickedNames: three.map(t => t.t),
      tags: tagState, tickedInList: ticked3, could_fail: three.length === 3 });
    await L.shot(H.page, OUT, 'c29568-three-customers');

    // C29570 — the table holds only those customers
    const custVals = await H.page.evaluate(() => {
      const u = new URL(location.href); return u.searchParams.getAll('company_id'); });
    put('29570', { urlCompanyIds: custVals, chipText: (await L.label(H.page, '[data-test-id="filter_chip_company_id"]')).innerText,
      customerColumnValues: await H.page.evaluate(() => {
        const out = {}; document.querySelectorAll('tbody tr').forEach(tr => {
          const td = tr.querySelectorAll('td'); if (td.length < 5) return;
          const c = (td[4].innerText || '').trim(); if (c) out[c] = (out[c] || 0) + 1; }); return out; }),
      selectedNames: three.map(t => t.t) });

    // C29569 — remove ONE tag
    const beforeRemove = await L.tickedCount(H.page);
    const removed = await H.page.evaluate(() => {
      const menu = document.querySelector('.q-menu'); if (!menu) return { ok: false };
      const chip = menu.querySelector('.q-chip'); if (!chip) return { ok: false };
      const label = (chip.innerText || '').trim();
      const x = chip.querySelector('.q-chip__icon--remove, [class*="remove"]');
      if (!x) return { ok: false, label, noRemoveIcon: true };
      x.click(); return { ok: true, label };
    });
    await S(H.page, 2600);
    put('29569', { tickedBefore: beforeRemove, removed,
      tickedAfter: await L.tickedCount(H.page),
      tagsAfter: await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
        return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').trim()) : null; }),
      url: H.page.url(), could_fail: removed.ok === true && beforeRemove.length >= 2 });

    // C29572 — outside click closes, selection survives
    const urlPre = H.page.url();
    await H.page.mouse.click(700, 85);
    await S(H.page);
    put('29572', { urlBefore: urlPre, urlAfter: H.page.url(),
      navigatedAway: urlPre.split('?')[0] !== H.page.url().split('?')[0],
      dropdownClosed: !(await H.page.$('.q-menu')),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_company_id"]')).innerText,
      urlStillHasCustomers: new URL(H.page.url()).searchParams.getAll('company_id').length });

    // C29571 — Clear Selection in Customer clears only Customer
    let ov = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const y2 = ov.options.find(x => /^Yes$/i.test(x.text));
    if (y2) await L.pickOption(H.page, y2.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlBoth = H.page.url();
    const oc2 = await L.openChip(H.page, 'filter_chip_company_id');
    const tb = await L.tickedCount(H.page);
    const cs2 = await L.clearSelection(H.page);
    await S(H.page);
    const ta = await L.tickedCount(H.page);
    const tagsAfter = await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').trim()) : null; });
    await L.closeMenu(H.page); await S(H.page);
    put('29571', { urlWithBoth: urlBoth, menuOptions: oc2.options.length, tickedBefore: tb,
      clicked: cs2, tickedAfter: ta, tagsAfter, urlAfter: H.page.url(),
      assetFilterSurvived: /vehicleHere/.test(H.page.url()),
      could_fail: tb.length > 0 });

    // ============================================================ ASSET ON SITE GROUP
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');

    // C29589 — exactly Yes and No + Clear Selection, and it is a dropdown not a toggle
    const oav = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const shape = await H.page.evaluate(() => {
      const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
      return { menu: true, hasClearSelection: /Clear Selection/i.test(m.innerText || ''),
        isToggleControl: !!m.querySelector('.q-toggle'),
        text: (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120) };
    });
    put('29589', { opened: oav.found, options: oav.options.map(o => o.text), count: oav.options.length, shape });
    await L.shot(H.page, OUT, 'c29589-asset-menu');

    // C29590 — Yes shows only on-site
    const py = await L.pickOption(H.page, oav.options.find(o => /^Yes$/i.test(o.text)).id);
    await S(H.page);
    const yesTotal = await L.serverCount(H.page, [{ field: 'vehicleHere', value: '1' }]);
    put('29590', { picked: py.clicked, url: H.page.url(), totalUnfiltered: base.total,
      totalOnSite: yesTotal.total, chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: py.clicked && yesTotal.total !== null });

    // C29591 — single-select: choosing No replaces Yes
    const oav2 = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const tickedYes = await L.tickedCount(H.page);
    const pn = await L.pickOption(H.page, oav2.options.find(o => /^No$/i.test(o.text)).id);
    await S(H.page);
    const tickedNo = await L.tickedCount(H.page);
    const noTotal = await L.serverCount(H.page, [{ field: 'vehicleHere', value: '0' }]);
    put('29591', { tickedWithYes: tickedYes, pickedNo: pn.clicked, tickedAfterNo: tickedNo,
      exactlyOneSelected: tickedNo.length === 1, url: H.page.url(),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      totalNotOnSite: noTotal.total, totalOnSite: yesTotal.total,
      could_fail: tickedYes.length === 1 && pn.clicked });

    // C29593 — outside click closes
    const u3 = H.page.url();
    await H.page.mouse.click(700, 85); await S(H.page);
    put('29593', { urlBefore: u3, urlAfter: H.page.url(), dropdownClosed: !(await H.page.$('.q-menu')),
      navigatedAway: u3.split('?')[0] !== H.page.url().split('?')[0],
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText });

    // C29592 — Clear Selection removes the Asset filter
    const oav3 = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const tb3 = await L.tickedCount(H.page);
    const cs3 = await L.clearSelection(H.page);
    const ta3 = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page);
    put('29592', { tickedBefore: tb3, clicked: cs3, tickedAfter: ta3, url: H.page.url(),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: tb3.length > 0 });

    // C29594 — an Asset choice matching nothing
    put('29594', { totalOnSite: yesTotal.total, totalNotOnSite: noTotal.total,
      note: 'neither branch is empty on this data, so the empty state cannot be produced from this filter alone',
      established: false });

    R.bridge_errors = H.bridgeErrors.length;
    await L.clearAll(H.page);
  } catch (e) { R.error = String(e).slice(0, 600); }
  L.save(OUT, 'probeB2', R);
  console.log('ERR:', R.error, '| bridge:', R.bridge_errors, '| cases:', Object.keys(R.cases).length);
  await H.browser.close();
})();
