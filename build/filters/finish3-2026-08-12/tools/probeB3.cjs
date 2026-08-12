// probeB3.cjs — Lead Technician + Service Advisor groups, plus the customer/asset sub-checks
// that MY OWN tick detector had made vacuous in probeB2.
//
// C29575 C29576 C29577 C29578 C29579 C29580  |  C29582 C29583 C29584 C29585 C29586 C29587
// re-driven: C29568(ticks) C29569 C29570 C29571 C29574 C29590 C29591 C29592 C29594 C29565
//
// A customer/technician is chosen from one ACTUALLY PRESENT IN THE TABLE, so "the table now
// shows only that one" is falsifiable. probeB2 picked the first three alphabetically, all of
// which have no work orders -- the empty state it produced looked like a filter failure.

const { makeHarness, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const S = (p, n = 2200) => p.waitForTimeout(n);

/** Read a column's values from the visible table by header name. */
async function column(page, header) {
  return page.evaluate((h) => {
    const heads = Array.from(document.querySelectorAll('thead th'))
      .map(t => (t.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim());
    const i = heads.indexOf(h);
    if (i < 0) return { headerFound: false, heads };
    const out = {};
    document.querySelectorAll('tbody tr').forEach(tr => {
      const td = tr.querySelectorAll('td');
      if (td.length <= i) return;
      const v = (td[i].innerText || '').split('\n')[0].trim();
      if (v) out[v] = (out[v] || 0) + 1;
    });
    return { headerFound: true, index: i, values: out };
  }, header);
}

/** Type into the dropdown's own search box. */
async function typeInMenu(page, text) {
  const r = await page.evaluate((t) => {
    const m = document.querySelector('.q-menu'); if (!m) return { ok: false, why: 'no menu' };
    const i = m.querySelector('input:not(.hidden)'); if (!i) return { ok: false, why: 'no input' };
    i.focus(); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true }));
    return { ok: true, value: i.value, placeholder: i.getAttribute('placeholder'),
             focusedByDefault: false };
  }, text);
  await page.waitForTimeout(2500);
  return r;
}

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeB3', R); };
  try {
    await L.goWO(H.page, '?tab=all');
    await L.clearAll(H.page);
    await L.goWO(H.page, '?tab=all');

    const unfiltered = await L.serverCount(H.page, []);
    const techCol = await column(H.page, 'Lead Technician');
    const advCol = await column(H.page, 'Service Advisor');
    const custCol = await column(H.page, 'Customer');
    R.table_baseline = { unfilteredTotal: unfiltered.total, capped: unfiltered.capped,
      leadTechs: techCol.values, advisors: advCol.values, customers: custCol.values };
    L.save(OUT, 'probeB3', R);

    // ============================================================ LEAD TECHNICIAN
    // C29575 — anatomy
    let o = await L.openChip(H.page, 'filter_chip_tech_assigned_id');
    const anat = await H.page.evaluate(() => {
      const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
      const i = m.querySelector('input:not(.hidden)');
      return { menu: true, hasClearSelection: /Clear Selection/i.test(m.innerText || ''),
        search: i ? { placeholder: i.getAttribute('placeholder'), autoFocused: document.activeElement === i } : null,
        scrollable: !!Array.from(m.querySelectorAll('*')).find(e => e.scrollHeight > e.clientHeight + 8) };
    });
    put('29575', { opened: o.found, optionCount: o.options.length,
      firstFive: o.options.slice(0, 5).map(x => x.text), anatomy: anat });
    await L.shot(H.page, OUT, 'c29575-tech-menu');

    // C29576 — typing narrows
    const techNames = o.options.map(x => x.text);
    const aTech = techNames.find(n => /\w{4,}/.test(n)) || techNames[0] || '';
    const fragT = aTech.split(' ')[0].slice(0, 4);
    const tt = await typeInMenu(H.page, fragT);
    const narrowedT = await H.page.$$eval(L.OPT, e => e.map(x => (x.innerText || '').trim()));
    await typeInMenu(H.page, '');
    const restoredT = await H.page.$$eval(L.OPT, e => e.length);
    put('29576', { fullCount: techNames.length, fragment: fragT, typed: tt,
      narrowedCount: narrowedT.length, narrowedSample: narrowedT.slice(0, 5),
      allMatch: narrowedT.every(n => n.toLowerCase().includes(fragT.toLowerCase())),
      restoredCount: restoredT, could_fail: tt.ok && techNames.length > 1 });

    // C29577 — pick a technician WHO IS IN THE TABLE, so the assertion can fail
    const tableTech = Object.keys(techCol.values || {}).find(n => n && !/^Unassigned$/i.test(n));
    const optT = o.options.find(x => x.text === tableTech) ||
                 o.options.find(x => tableTech && x.text.includes(tableTech.split(' ')[0]));
    let pickedT = { clicked: false };
    if (optT) { pickedT = await L.pickOption(H.page, optT.id); }
    await S(H.page, 3000);
    const tickedT = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2600);
    const techAfter = await column(H.page, 'Lead Technician');
    put('29577', { chosenFromTable: tableTech, optionMatched: optT ? optT.text : null,
      picked: pickedT.clicked, tickedInList: tickedT, url: H.page.url(),
      leadTechColumnAfter: techAfter.values,
      onlyChosenPresent: optT ? Object.keys(techAfter.values || {}).every(k => k === optT.text) : null,
      could_fail: pickedT.clicked && !!tableTech });
    await L.shot(H.page, OUT, 'c29577-tech-filtered');

    // C29579 — outside click closes, selection kept
    o = await L.openChip(H.page, 'filter_chip_tech_assigned_id');
    const uT = H.page.url();
    await H.page.mouse.click(700, 85); await S(H.page);
    put('29579', { urlBefore: uT, urlAfter: H.page.url(),
      navigatedAway: uT.split('?')[0] !== H.page.url().split('?')[0],
      dropdownClosed: !(await H.page.$('.q-menu')),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_tech_assigned_id"]')).innerText });

    // C29578 — Clear Selection clears the technician filter only (add a 2nd filter first)
    let oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const yesOpt = oa.options.find(x => /^Yes$/i.test(x.text));
    if (yesOpt) await L.pickOption(H.page, yesOpt.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlBothT = H.page.url();
    o = await L.openChip(H.page, 'filter_chip_tech_assigned_id');
    const tbT = await L.tickedCount(H.page);
    const csT = await L.clearSelection(H.page);
    const taT = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page);
    put('29578', { urlWithBoth: urlBothT, tickedBefore: tbT, clicked: csT, tickedAfter: taT,
      urlAfter: H.page.url(), assetSurvived: /vehicleHere/.test(H.page.url()),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_tech_assigned_id"]')).innerText,
      could_fail: tbT.length > 0 });

    // C29580 — a technician who leads no work orders
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_tech_assigned_id');
    const inTable = new Set(Object.keys(techCol.values || {}));
    const leadsNone = o.options.find(x => x.text && !inTable.has(x.text));
    let droveNone = { note: 'no technician outside the visible table could be identified' };
    if (leadsNone) {
      const pk = await L.pickOption(H.page, leadsNone.id);
      await L.closeMenu(H.page); await S(H.page, 3000);
      const cnt = await L.serverCount(H.page, [{ field: 'tech_assigned_id', value: leadsNone.id.replace('filter_option_tech_assigned_id_', '') }]);
      droveNone = { technician: leadsNone.text, picked: pk.clicked, url: H.page.url(),
        serverTotalForThatTech: cnt.total, rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3) };
      await L.shot(H.page, OUT, 'c29580-tech-no-wos');
    }
    put('29580', droveNone);

    // ============================================================ SERVICE ADVISOR
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_service_advisor_id');
    const anatA = await H.page.evaluate(() => {
      const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
      const i = m.querySelector('input:not(.hidden)');
      return { menu: true, hasClearSelection: /Clear Selection/i.test(m.innerText || ''),
        search: i ? { placeholder: i.getAttribute('placeholder'), autoFocused: document.activeElement === i } : null };
    });
    put('29582', { opened: o.found, optionCount: o.options.length,
      firstFive: o.options.slice(0, 5).map(x => x.text), anatomy: anatA });

    const advNames = o.options.map(x => x.text);
    const fragA = (advNames.find(n => /\w{4,}/.test(n)) || '').split(' ')[0].slice(0, 4);
    const ta2 = await typeInMenu(H.page, fragA);
    const narrowedA = await H.page.$$eval(L.OPT, e => e.map(x => (x.innerText || '').trim()));
    await typeInMenu(H.page, '');
    put('29583', { fullCount: advNames.length, fragment: fragA, typed: ta2,
      narrowedCount: narrowedA.length, narrowedSample: narrowedA.slice(0, 5),
      allMatch: narrowedA.every(n => n.toLowerCase().includes(fragA.toLowerCase())),
      restoredCount: await H.page.$$eval(L.OPT, e => e.length),
      could_fail: ta2.ok && advNames.length > 1 });

    // C29584 — pick an advisor present in the table
    const tableAdv = Object.keys(advCol.values || {}).find(n => n && !/^(Unassigned|—|-)$/i.test(n));
    const optA = o.options.find(x => x.text === tableAdv) ||
                 o.options.find(x => tableAdv && x.text.includes(tableAdv.split(' ')[0]));
    let pickedA = { clicked: false };
    if (optA) pickedA = await L.pickOption(H.page, optA.id);
    await S(H.page, 3000);
    const tickedA = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2600);
    const advAfter = await column(H.page, 'Service Advisor');
    put('29584', { chosenFromTable: tableAdv, optionMatched: optA ? optA.text : null,
      picked: pickedA.clicked, tickedInList: tickedA, url: H.page.url(),
      advisorColumnAfter: advAfter.values,
      onlyChosenPresent: optA ? Object.keys(advAfter.values || {}).every(k => k === optA.text) : null,
      could_fail: pickedA.clicked && !!tableAdv });
    await L.shot(H.page, OUT, 'c29584-advisor-filtered');

    // C29586 — outside click
    o = await L.openChip(H.page, 'filter_chip_service_advisor_id');
    const uA = H.page.url();
    await H.page.mouse.click(700, 85); await S(H.page);
    put('29586', { urlBefore: uA, urlAfter: H.page.url(),
      navigatedAway: uA.split('?')[0] !== H.page.url().split('?')[0],
      dropdownClosed: !(await H.page.$('.q-menu')),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_service_advisor_id"]')).innerText });

    // C29585 — Clear Selection, advisor only
    oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const y3 = oa.options.find(x => /^Yes$/i.test(x.text));
    if (y3) await L.pickOption(H.page, y3.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlBothA = H.page.url();
    o = await L.openChip(H.page, 'filter_chip_service_advisor_id');
    const tbA = await L.tickedCount(H.page);
    const csA = await L.clearSelection(H.page);
    const taA = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page);
    put('29585', { urlWithBoth: urlBothA, tickedBefore: tbA, clicked: csA, tickedAfter: taA,
      urlAfter: H.page.url(), assetSurvived: /vehicleHere/.test(H.page.url()),
      could_fail: tbA.length > 0 });

    // C29587 — an advisor with no assigned work orders
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_service_advisor_id');
    const advInTable = new Set(Object.keys(advCol.values || {}));
    const advNone = o.options.find(x => x.text && !advInTable.has(x.text));
    let droveA = { note: 'no advisor outside the visible table could be identified' };
    if (advNone) {
      const pk = await L.pickOption(H.page, advNone.id);
      await L.closeMenu(H.page); await S(H.page, 3000);
      const cnt = await L.serverCount(H.page, [{ field: 'service_advisor_id', value: advNone.id.replace('filter_option_service_advisor_id_', '') }]);
      droveA = { advisor: advNone.text, picked: pk.clicked, url: H.page.url(),
        serverTotalForThatAdvisor: cnt.total, rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }) };
      await L.shot(H.page, OUT, 'c29587-advisor-no-wos');
    }
    put('29587', droveA);

    // ============================================================ CUSTOMER re-drives
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_company_id');
    // pick TWO customers that are actually in the table
    const tableCusts = Object.keys(custCol.values || {}).filter(Boolean).slice(0, 2);
    const picks = [];
    for (const name of tableCusts) {
      await typeInMenu(H.page, name.slice(0, 12));
      const opts = await H.page.$$eval(L.OPT, e => e.map(x => ({ id: x.getAttribute('data-test-id'), t: (x.innerText || '').trim() })));
      const hit = opts.find(x => x.t === name) || opts[0];
      if (hit) { const r = await L.pickOption(H.page, hit.id); picks.push({ name, matched: hit.t, clicked: r.clicked }); }
    }
    await typeInMenu(H.page, '');
    await S(H.page, 2000);
    const tickedC = await L.tickedCount(H.page);
    const tagsC = await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => ({ text: (c.innerText || '').replace(/\s+/g, ' ').trim(),
        hasRemove: !!c.querySelector('.q-chip__icon--remove,[class*="remove"]'),
        textOverflow: getComputedStyle(c.querySelector('.q-chip__content') || c).textOverflow })) : null; });
    await L.closeMenu(H.page); await S(H.page, 2600);
    const custAfter = await column(H.page, 'Customer');
    put('29568-ticks', { picks, tickedInList: tickedC, tags: tagsC, could_fail: picks.length > 0 });
    put('29570', { picks, url: H.page.url(),
      urlCompanyIds: await H.page.evaluate(() => new URL(location.href).searchParams.getAll('company_id')),
      customerColumnAfter: custAfter.values,
      onlySelectedPresent: Object.keys(custAfter.values || {}).every(k => tableCusts.includes(k)),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_company_id"]')).innerText,
      could_fail: picks.some(p => p.clicked) });
    await L.shot(H.page, OUT, 'c29570-two-real-customers');

    // C29569 — remove one tag, with a working ticked detector this time
    o = await L.openChip(H.page, 'filter_chip_company_id');
    const tickedBeforeRm = await L.tickedCount(H.page);
    const rm = await H.page.evaluate(() => {
      const m = document.querySelector('.q-menu'); if (!m) return { ok: false };
      const chip = m.querySelector('.q-chip'); if (!chip) return { ok: false };
      const lbl = (chip.innerText || '').trim();
      const x = chip.querySelector('.q-chip__icon--remove,[class*="remove"]');
      if (!x) return { ok: false, lbl, noRemove: true };
      x.click(); return { ok: true, lbl };
    });
    await S(H.page, 2800);
    const tickedAfterRm = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page, 2400);
    put('29569', { tickedBefore: tickedBeforeRm, removed: rm, tickedAfter: tickedAfterRm,
      url: H.page.url(), customerColumnAfter: (await column(H.page, 'Customer')).values,
      could_fail: rm.ok && tickedBeforeRm.length >= 2 });

    // C29571 re-drive with the working detector
    oa = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const y4 = oa.options.find(x => /^Yes$/i.test(x.text));
    if (y4) await L.pickOption(H.page, y4.id);
    await L.closeMenu(H.page); await S(H.page);
    const urlBothC = H.page.url();
    o = await L.openChip(H.page, 'filter_chip_company_id');
    const tbC = await L.tickedCount(H.page);
    const csC = await L.clearSelection(H.page);
    const taC = await L.tickedCount(H.page);
    const tagsAfterC = await H.page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-chip')).length : null; });
    await L.closeMenu(H.page); await S(H.page);
    put('29571', { urlWithBoth: urlBothC, tickedBefore: tbC, clicked: csC, tickedAfter: taC,
      tagsAfterCount: tagsAfterC, urlAfter: H.page.url(),
      assetSurvived: /vehicleHere/.test(H.page.url()), could_fail: tbC.length > 0 });

    // C29574 — a customer with NO work orders is still listed and yields the empty state
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    o = await L.openChip(H.page, 'filter_chip_company_id');
    const inTableC = new Set(Object.keys(custCol.values || {}));
    const noWo = o.options.find(x => x.text && !inTableC.has(x.text));
    let drove574 = { note: 'could not identify a customer with no work orders' };
    if (noWo) {
      const cid = noWo.id.replace('filter_option_company_id_', '');
      const cnt = await L.serverCount(H.page, [{ field: 'company_id', value: cid }]);
      const pk = await L.pickOption(H.page, noWo.id);
      await L.closeMenu(H.page); await S(H.page, 3000);
      drove574 = { customer: noWo.text, listedInFilter: true, serverTotalForCustomer: cnt.total,
        picked: pk.clicked, url: H.page.url(), rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3),
        could_fail: pk.clicked && cnt.total === 0 };
      await L.shot(H.page, OUT, 'c29574-customer-no-wos');
    }
    put('29574', drove574);

    // ============================================================ ASSET re-drives (ticks)
    await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
    const onSite = await L.serverCount(H.page, [{ field: 'vehicleHere', value: '1' }]);
    const offSite = await L.serverCount(H.page, [{ field: 'vehicleHere', value: '0' }]);
    o = await L.openChip(H.page, 'filter_chip_vehicleHere');
    const pY = await L.pickOption(H.page, o.options.find(x => /^Yes$/i.test(x.text)).id);
    await S(H.page);
    const tY = await L.tickedCount(H.page);
    const onSiteCol = await column(H.page, 'On Site');
    put('29590', { picked: pY.clicked, tickedNow: tY, url: H.page.url(),
      totalUnfiltered: unfiltered.total, totalOnSite: onSite.total, totalOffSite: offSite.total,
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: pY.clicked && onSite.total !== null && onSite.total !== unfiltered.total });
    const pN = await L.pickOption(H.page, o.options.find(x => /^No$/i.test(x.text)).id);
    await S(H.page);
    const tN = await L.tickedCount(H.page);
    put('29591', { tickedWithYes: tY, pickedNo: pN.clicked, tickedAfterNo: tN,
      exactlyOneTicked: tN.length === 1, yesDeselected: !tN.includes(tY[0]),
      url: H.page.url(), urlValues: await H.page.evaluate(() => new URL(location.href).searchParams.getAll('vehicleHere')),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: tY.length === 1 && pN.clicked });
    const tb4 = await L.tickedCount(H.page);
    const cs4 = await L.clearSelection(H.page);
    const ta4 = await L.tickedCount(H.page);
    await L.closeMenu(H.page); await S(H.page);
    put('29592', { tickedBefore: tb4, clicked: cs4, tickedAfter: ta4, url: H.page.url(),
      chip: (await L.label(H.page, '[data-test-id="filter_chip_vehicleHere"]')).innerText,
      could_fail: tb4.length > 0 });
    put('29594', { totalOnSite: onSite.total, totalOffSite: offSite.total,
      established: false,
      note: 'both Yes and No return work orders on this data, so this filter alone cannot produce the empty state; a tester can reach it by combining Asset on Site with a Status that has none of them' });

    // C29565 — status totals with a working counter
    const st = {};
    for (const s of ['estimate', 'approved', 'in_progress', 'review', 'complete', 'invoiced', 'paid', 'declined', 'imported']) {
      st[s] = (await L.serverCount(H.page, [{ field: 'status', value: s }])).total;
    }
    const zero = Object.entries(st).find(([, v]) => v === 0);
    let drove565 = { note: 'no single status has zero work orders on this branch' };
    if (zero) {
      await L.clearAll(H.page); await L.goWO(H.page, '?tab=all');
      const oz = await L.openChip(H.page, 'filter_chip_status');
      const pz = await L.pickOption(H.page, `filter_option_status_${zero[0]}`);
      await L.closeMenu(H.page); await S(H.page, 3000);
      drove565 = { status: zero[0], picked: pz.clicked, url: H.page.url(), rows: await L.rows(H.page),
        emptyText: await H.page.evaluate(() => { const m = document.body.innerText.match(/No work orders[^\n]*/); return m ? m[0] : null; }),
        realConsoleErrors: H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 3) };
      await L.shot(H.page, OUT, 'c29565-empty-state-real');
    }
    put('29565', { serverTotalsByStatus: st, drove: drove565 });

    await L.clearAll(H.page);
    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 600); }
  L.save(OUT, 'probeB3', R);
  console.log('ERR:', R.error, '| bridge:', R.bridge_errors, '| blocks:', Object.keys(R.cases).length);
  await H.browser.close();
})();
