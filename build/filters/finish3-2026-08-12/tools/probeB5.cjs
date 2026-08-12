// probeB5.cjs — the intersection cases and everything probeB3/B4 left vacuous.
//
// C29600 C29632 C29631(customer half) C29569 C29587 C29590 C29591 C29592 C29568(long name) C29615
//
// The work-order record carries `companyName` and NO customer id, so a customer is mapped
// name -> id through the filter option's own data-test-id. probeB4's `w.company?.id` was
// always undefined, which silently emptied its whole intersection block.

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
    return { http: r.status, count: w.length,
      numbers: w.map(x => x.number).filter(Boolean).sort(),
      companies: [...new Set(w.map(x => x.companyName).filter(Boolean))].sort() };
  }, { api: API, fs: filters });
}

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeB5', R); };
  try {
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    // Find a customer with work orders in TWO different statuses -> exact, checkable sets.
    const declined = await q(H.page, [{ field: 'status', value: 'declined' }]);
    const complete = await q(H.page, [{ field: 'status', value: 'complete' }]);
    const invoiced = await q(H.page, [{ field: 'status', value: 'invoiced' }]);
    R.small_sets = { declined: declined.count, complete: complete.count, invoiced: invoiced.count,
      declinedCompanies: declined.companies, completeCompanies: complete.companies };
    L.save(OUT, 'probeB5', R);

    // Map company NAME -> filter option id (the record has no customer id at all).
    const oc = await L.openChip(H.page, 'filter_chip_company_id');
    const nameToId = {};
    for (const nm of [...declined.companies, ...complete.companies]) {
      await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
        const i = m && m.querySelector('input:not(.hidden)');
        if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, nm.slice(0, 14));
      await S(H.page, 1600);
      const hit = await H.page.$$eval(L.OPT, (els, want) => {
        const e = els.find(x => (x.innerText || '').trim() === want);
        return e ? e.getAttribute('data-test-id') : null;
      }, nm);
      if (hit) nameToId[nm] = hit.replace('filter_option_company_id_', '');
    }
    await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      const i = m && m.querySelector('input:not(.hidden)'); if (i) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
    await L.closeMenu(H.page); await S(H.page);
    R.name_to_id_resolved = Object.keys(nameToId).length;
    L.save(OUT, 'probeB5', R);

    // A customer appearing in BOTH sets is what makes the intersection falsifiable.
    const inBoth = declined.companies.find(c => complete.companies.includes(c));
    const target = inBoth || declined.companies[0];
    const targetId = nameToId[target];

    let combo = { note: 'no customer id could be resolved', target, targetId };
    if (targetId) {
      const custAll = await q(H.page, [{ field: 'company_id', value: targetId }]);
      const custDecl = await q(H.page, [{ field: 'status', value: 'declined' }, { field: 'company_id', value: targetId }]);
      const custComp = await q(H.page, [{ field: 'status', value: 'complete' }, { field: 'company_id', value: targetId }]);
      const custBoth = await q(H.page, [{ field: 'status', value: 'declined' },
        { field: 'status', value: 'complete' }, { field: 'company_id', value: targetId }]);
      const otherCust = declined.companies.find(c => c !== target && nameToId[c]);
      combo = {
        customer: target, customerId: targetId, customerIsInBothStatusSets: !!inBoth,
        customerAllStatuses: { count: custAll.count, numbers: custAll.numbers.slice(0, 12) },
        declinedForCustomer: custDecl, completeForCustomer: custComp, bothStatusesForCustomer: custBoth,
        // C29600: one status AND one customer = the intersection, strictly narrower than either alone
        intersectionNarrowerThanStatusAlone: custDecl.count < declined.count,
        intersectionNarrowerThanCustomerAlone: custDecl.count <= custAll.count,
        intersectionIsSubsetOfBoth: custDecl.numbers.every(n => declined.numbers.includes(n))
          && custDecl.numbers.every(n => custAll.numbers.includes(n)),
        onlyThatCustomerInResult: custDecl.companies.length === 1 && custDecl.companies[0] === target,
        // C29632: two statuses combine as either-or, the customer still restricts
        eitherOrHolds: custBoth.count === custDecl.count + custComp.count,
        otherCustomerExcluded: otherCust ? !custBoth.companies.includes(otherCust) : null,
        otherCustomerName: otherCust
      };
    }
    put('29600', combo);
    put('29632', combo);

    // C29631 — drive BOTH filters in the UI and read what the page sent
    if (targetId) {
      await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
      const mark = H.apiLog.length;
      let o = await L.openChip(H.page, 'filter_chip_status');
      await L.pickOption(H.page, 'filter_option_status_declined');
      await L.closeMenu(H.page); await S(H.page);
      const oc2 = await L.openChip(H.page, 'filter_chip_company_id');
      await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
        const i = m && m.querySelector('input:not(.hidden)');
        if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, target.slice(0, 14));
      await S(H.page, 1800);
      const pk = await L.pickOption(H.page, `filter_option_company_id_${targetId}`);
      await L.closeMenu(H.page); await S(H.page, 3200);
      const sent = H.apiLog.slice(mark).filter(a => /\/api\/work-orders\?/.test(a.u));
      const last = sent.length ? decodeURIComponent(sent[sent.length - 1].u) : null;
      put('29631', { requests: sent.length, lastStatus: sent.length ? sent[sent.length - 1].s : null,
        lastRequestDecoded: last,
        carriesStatusValue: last ? /\[field\]=status/.test(last) && /\[value\]=declined/.test(last) : null,
        carriesCustomerId: last ? last.includes(targetId) : null,
        bothInOneRequest: last ? (/\[field\]=status/.test(last) && last.includes('company_id')) : null,
        pickedCustomer: pk.clicked, url: H.page.url(),
        customerColumnInTable: await H.page.evaluate(() => {
          const out = {}; document.querySelectorAll('tbody tr').forEach(tr => {
            const td = tr.querySelectorAll('td'); if (td.length < 5) return;
            const v = (td[4].innerText || '').trim(); if (v) out[v] = (out[v] || 0) + 1; }); return out; }),
        could_fail: sent.length > 0 && pk.clicked });
      await L.shot(H.page, OUT, 'c29631-both-filters');
    }

    // C29569 — remove ONE customer tag (timing fixed: tags live in the menu's input area)
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    let o = await L.openChip(H.page, 'filter_chip_company_id');
    const two = [];
    for (const nm of declined.companies.slice(0, 2)) {
      if (!nameToId[nm]) continue;
      await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
        const i = m && m.querySelector('input:not(.hidden)');
        if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, nm.slice(0, 14));
      await S(H.page, 1600);
      const r = await L.pickOption(H.page, `filter_option_company_id_${nameToId[nm]}`);
      two.push({ nm, clicked: r.clicked });
    }
    await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      const i = m && m.querySelector('input:not(.hidden)'); if (i) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
    await S(H.page, 2400);
    const tagsBefore = await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').replace(/\s+/g, ' ').trim()) : []; });
    const tickedBefore = await L.tickedCount(H.page);
    const urlBefore = H.page.url();
    const rm = await H.page.evaluate(() => {
      const m = document.querySelector('.q-menu'); if (!m) return { ok: false, why: 'no menu' };
      const chips = Array.from(m.querySelectorAll('.q-chip'));
      if (!chips.length) return { ok: false, why: 'no tags in menu' };
      const label = (chips[0].innerText || '').replace(/\s+/g, ' ').trim();
      const x = chips[0].querySelector('.q-chip__icon--remove,[class*="remove"]');
      if (!x) return { ok: false, why: 'no remove icon', label };
      x.click(); return { ok: true, label };
    });
    await S(H.page, 3000);
    const tagsAfter = await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').replace(/\s+/g, ' ').trim()) : []; });
    const tickedAfter = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2400);
    put('29569', { selected: two, tagsBefore, tickedBefore, removed: rm, tagsAfter, tickedAfter,
      urlBefore, urlAfter: H.page.url(),
      oneFewerTag: tagsBefore.length - tagsAfter.length === 1,
      oneFewerTick: tickedBefore.length - tickedAfter.length === 1,
      customerColumn: await H.page.evaluate(() => {
        const out = {}; document.querySelectorAll('tbody tr').forEach(tr => {
          const td = tr.querySelectorAll('td'); if (td.length < 5) return;
          const v = (td[4].innerText || '').trim(); if (v) out[v] = (out[v] || 0) + 1; }); return out; }),
      could_fail: rm.ok === true && tagsBefore.length >= 2 });
    await L.shot(H.page, OUT, 'c29569-tag-removed');

    // C29568 expectation 3 — a LONG customer name on a tag
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_company_id');
    const longest = o.options.reduce((a, b) => (b.text.length > (a?.text.length || 0) ? b : a), null);
    let longTag = { note: 'no option found' };
    if (longest) {
      await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
        const i = m && m.querySelector('input:not(.hidden)');
        if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, longest.text.slice(0, 14));
      await S(H.page, 1600);
      const pk = await L.pickOption(H.page, longest.id);
      await S(H.page, 2000);
      longTag = await H.page.evaluate((full) => {
        const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
        const c = m.querySelector('.q-chip'); if (!c) return { menu: true, tag: false };
        const content = c.querySelector('.q-chip__content') || c;
        const cs = getComputedStyle(content);
        return { menu: true, tag: true, fullName: full,
          renderedText: (c.innerText || '').replace(/\s+/g, ' ').replace(/ cancel$/, '').trim(),
          textOverflow: cs.textOverflow, overflow: cs.overflow, whiteSpace: cs.whiteSpace,
          maxWidth: cs.maxWidth,
          isTruncatedVisually: content.scrollWidth > content.clientWidth + 1,
          scrollWidth: content.scrollWidth, clientWidth: content.clientWidth };
      }, longest.text);
      longTag.pickedOk = pk.clicked;
      longTag.nameLength = longest.text.length;
      await L.shot(H.page, OUT, 'c29568-long-name-tag');
    }
    await L.closeMenu(H.page);
    put('29568-longname', longTag);

    // C29587 — an advisor with genuinely ZERO work orders, found by counting not by guessing
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_service_advisor_id');
    const advIds = o.options.slice(0, 14).map(x => ({ t: x.text, id: x.id.replace('filter_option_service_advisor_id_', '') }));
    let zeroAdv = null;
    const advCounts = [];
    for (const a of advIds) {
      const c = await q(H.page, [{ field: 'service_advisor_id', value: a.id }]);
      advCounts.push({ advisor: a.t, count: c.count });
      if (c.count === 0) { zeroAdv = a; break; }
    }
    let drove587 = { advisorsCounted: advCounts, note: 'no advisor among those checked has zero work orders' };
    if (zeroAdv) {
      const pk = await L.pickOption(H.page, `filter_option_service_advisor_id_${zeroAdv.id}`);
      await L.closeMenu(H.page); await S(H.page, 3200);
      drove587 = { advisorsCounted: advCounts, advisor: zeroAdv.t, serverCount: 0, picked: pk.clicked,
        url: H.page.url(), rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3),
        could_fail: pk.clicked };
      await L.shot(H.page, OUT, 'c29587-advisor-zero');
    }
    put('29587', drove587);

    // C29590 / C29591 / C29592 — asset filter, inside the 7-work-order declined set so the
    // numbers are exact (the raw totals are capped at 1000 and prove nothing).
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    const dOn = await q(H.page, [{ field: 'status', value: 'declined' }, { field: 'vehicleHere', value: '1' }]);
    const dOff = await q(H.page, [{ field: 'status', value: 'declined' }, { field: 'vehicleHere', value: '0' }]);
    o = await L.openChip(H.page, 'filter_chip_status');
    await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page); await S(H.page, 2600);
    const rowsDeclined = await L.rows(H.page);
    let oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const yesId = oa.options.find(x => /^Yes$/i.test(x.text)).id;
    const pY = await L.pickOption(H.page, yesId);
    await S(H.page, 2600);
    const tickY = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2600);
    const rowsYes = await L.rows(H.page);
    put('29590', { declinedTotal: declined.count, declinedOnSite: dOn.count, declinedOffSite: dOff.count,
      partitionExact: dOn.count + dOff.count === declined.count,
      disjoint: !dOn.numbers.some(n => dOff.numbers.includes(n)),
      pickedYes: pY.clicked, tickedAfterYes: tickY, url: H.page.url(),
      visibleRowsDeclinedOnly: rowsDeclined.tbody, visibleRowsDeclinedPlusOnSite: rowsYes.tbody,
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: pY.clicked && declined.count > 0 });

    // single-select: choose No, Yes must drop
    oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const tickBeforeNo = await L.tickedCount(H.page);
    const noId = oa.options.find(x => /^No$/i.test(x.text)).id;
    const pN = await L.pickOption(H.page, noId);
    await S(H.page, 2600);
    const tickAfterNo = await L.tickedCount(H.page);
    const urlVals = await H.page.evaluate(() => new URL(location.href).searchParams.getAll('vehicleHere'));
    await L.closeMenu(H.page); await S(H.page, 2600);
    put('29591', { tickedWithYes: tickBeforeNo, pickedNo: pN.clicked, tickedAfterNo: tickAfterNo,
      exactlyOneTicked: tickAfterNo.length === 1, yesWasDeselected: !tickAfterNo.includes(yesId),
      urlVehicleHereValues: urlVals, url: H.page.url(),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      visibleRows: (await L.rows(H.page)).tbody, expectedOffSite: dOff.count,
      could_fail: tickBeforeNo.length === 1 && pN.clicked });

    // Clear Selection removes the asset filter only
    oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const tb = await L.tickedCount(H.page);
    const cs = await L.clearSelection(H.page);
    const ta = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2600);
    put('29592', { tickedBefore: tb, clearSelectionClicked: cs, tickedAfter: ta, url: H.page.url(),
      statusFilterSurvived: /status=declined/.test(H.page.url()),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: tb.length > 0 });

    R.bridge_errors = H.bridgeErrors.length;
    await L.clearAll(H.page);
  } catch (e) { R.error = String(e).slice(0, 700); }
  L.save(OUT, 'probeB5', R);
  console.log('ERR:', R.error, '| bridge:', R.bridge_errors, '| blocks:', Object.keys(R.cases).length);
  await H.browser.close();
})();
