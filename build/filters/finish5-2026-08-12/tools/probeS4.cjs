// probeS4 — the two HELD cases whose stated hold reason looks WIDER than the thing that
// actually blocks them (Standing Rule 68: a blocker blocks only what it actually blocks).
//
//  C38880 "Each page and tab remembers its own filters separately" — held, by its own
//         marker, "for the QA lead's ruling only".  Its step 4 needs a REPORT WITH TABS that
//         carries a filter bar.  probeR3 found one: Technician Efficiency, tabs
//         [Invoiced|Completed], 1 chip.  Drive steps 1-4 and see whether they run.
//  C38901 "Each Report tab and each Parts view keeps its own separate search" — held because
//         "the report pages have no page search box yet".  TRUE of 8 of 10 report views, but
//         probeR3 found IBS Batches has BOTH tabs [Ready To Send|Sent|Payments] AND a page
//         search.  Drive its step 4 there.
//
// Every read below records the state BEFORE and AFTER, so "nothing happened" and "I never
// clicked anything" are distinguishable.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').replace(/\s*keyboard_arrow_down$/, '').trim() })));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);
const tabs = p => p.$$eval('[role="tab"], .q-tab', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').trim(),
  textTransform: getComputedStyle(e).textTransform,
  active: /q-tab--active|active/.test(e.className) })).filter(t => !/^(report_nav|parts_nav)/.test(t.id || '')));

(async () => {
  const R = { probe: 'S4', at: new Date().toISOString(), build: 'v3.7-20e801b' };
  const h = await makeHarness('admin'); const P = h.page;
  const go = async (p, w = 10000) => { await P.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 });
                                      await P.waitForTimeout(w); await L.ensureBarOpen(P); };

  // ============ C38880 ============
  {
    const c = { steps: [] };
    // 1. Parts view (Inventory): apply a filter
    await go('/parts/inventory');
    const before = { url: P.url(), chips: await chipInfo(P), rows: await rows(P) };
    const o = await L.openChip(P, 'filter_chip_supply');
    const pick = o.options.find(x => /under-supplied/i.test(x.text)) || o.options[1];
    await L.pickOption(P, pick.id); await P.waitForTimeout(3800); await L.closeMenu(P); await P.waitForTimeout(2200);
    c.steps.push({ n: 1, text: 'On one Parts view (Inventory) apply a filter',
      before, picked: pick && pick.text, after: { url: P.url(), chips: await chipInfo(P), rows: await rows(P) },
      applied: P.url() !== before.url });

    // 2. a different Parts view
    await go('/parts/orders');
    c.steps.push({ n: 2, text: 'Switch to a different Parts view (Purchase Orders)',
      url: P.url(), chips: await chipInfo(P), rows: await rows(P) });

    // 3. return
    await go('/parts/inventory');
    c.steps.push({ n: 3, text: 'Return to the first Parts view',
      url: P.url(), chips: await chipInfo(P), rows: await rows(P) });

    // 4. a report WITH TABS that has a filter bar
    await go('/reports/technician-efficiency');
    const t0 = await tabs(P);
    const s4 = { text: 'On a report with tabs, apply a filter on one tab, switch, switch back',
      reportUsed: '/reports/technician-efficiency', tabs: t0, chipsOnArrival: await chipInfo(P),
      rowsOnArrival: await rows(P), urlOnArrival: P.url() };
    const ch = (await chipInfo(P))[0];
    if (ch) {
      const oo = await L.openChip(P, ch.id);
      s4.chipOpened = oo.found; s4.optionCount = oo.options.length;
      const pk = oo.options.find(x => !/^all$/i.test(x.text)) || oo.options[0];
      s4.picked = pk && pk.text;
      if (pk) { await L.pickOption(P, pk.id); await P.waitForTimeout(3600); }
      await L.closeMenu(P); await P.waitForTimeout(2200);
      s4.afterFilterOnTabA = { url: P.url(), chips: await chipInfo(P), rows: await rows(P), tabs: await tabs(P) };
    }
    const other = (await tabs(P)).find(t => !t.active);
    if (other && other.id) { await L.clickSel(P, `[data-test-id="${other.id}"]`); }
    else if (other) { await P.evaluate(txt => { const e = [...document.querySelectorAll('[role="tab"], .q-tab')]
      .find(x => (x.innerText || '').trim() === txt); if (e) e.click(); }, other.domText); }
    await P.waitForTimeout(7000); await L.ensureBarOpen(P);
    s4.switchedTo = other && other.domText;
    s4.onOtherTab = { url: P.url(), chips: await chipInfo(P), rows: await rows(P), tabs: await tabs(P) };
    const back = (await tabs(P)).find(t => t.domText === (t0.find(x => x.active) || t0[0]).domText);
    if (back && back.id) await L.clickSel(P, `[data-test-id="${back.id}"]`);
    else if (back) await P.evaluate(txt => { const e = [...document.querySelectorAll('[role="tab"], .q-tab')]
      .find(x => (x.innerText || '').trim() === txt); if (e) e.click(); }, back.domText);
    await P.waitForTimeout(7000); await L.ensureBarOpen(P);
    s4.backOnFirstTab = { url: P.url(), chips: await chipInfo(P), rows: await rows(P), tabs: await tabs(P) };
    s4.executable = !!(t0.length >= 2 && s4.chipsOnArrival.length >= 1 && s4.chipOpened);
    c.steps.push({ n: 4, ...s4 });
    R.c38880 = c;
    console.log('C38880 step4:', JSON.stringify({ tabs: t0.map(t => t.domText), chips: s4.chipsOnArrival.map(x => x.domText),
      picked: s4.picked, switchedTo: s4.switchedTo, executable: s4.executable,
      chipOnOther: s4.onOtherTab.chips.map(x => x.domText), chipBack: s4.backOnFirstTab.chips.map(x => x.domText) }));
  }

  // ============ C38901 step 4 on IBS Batches ============
  {
    const c = {};
    await go('/reports/batch-transactions');
    c.landedOn = P.url(); c.tabs = await tabs(P); c.chips = await chipInfo(P);
    c.pageSearchPresent = !!(await P.$('[data-test-id="page_search_toggle"]'));
    c.rowsOnArrival = await rows(P);
    if (c.pageSearchPresent) {
      const s = await L.search(P, 'a');
      c.searchOnTabA = { drove: s, url: P.url(), rows: await rows(P),
        boxValue: await P.evaluate(() => { const e = document.querySelector('input[type="search"], [data-test-id*="search"] input');
          return e ? e.value : null; }) };
      const other = c.tabs.find(t => !t.active);
      if (other && other.id) await L.clickSel(P, `[data-test-id="${other.id}"]`);
      else if (other) await P.evaluate(txt => { const e = [...document.querySelectorAll('[role="tab"], .q-tab')]
        .find(x => (x.innerText || '').trim() === txt); if (e) e.click(); }, other.domText);
      await P.waitForTimeout(7000);
      c.switchedTo = other && other.domText;
      c.onOtherTab = { url: P.url(), rows: await rows(P),
        pageSearchPresent: !!(await P.$('[data-test-id="page_search_toggle"]')),
        boxValue: await P.evaluate(() => { const e = document.querySelector('input[type="search"], [data-test-id*="search"] input');
          return e ? e.value : null; }) };
      c.executable = !!(c.tabs.length >= 2 && c.pageSearchPresent);
    }
    R.c38901_ibs = c;
    console.log('C38901 IBS:', JSON.stringify({ tabs: c.tabs.map(t => t.domText), search: c.pageSearchPresent,
      onA: c.searchOnTabA && { url: c.searchOnTabA.url.replace(APP, ''), rows: c.searchOnTabA.rows, box: c.searchOnTabA.boxValue },
      switchedTo: c.switchedTo, onOther: c.onOtherTab, executable: c.executable }));
  }

  R.bridgeErrors = h.bridgeErrors.length;
  R.api4xx = h.apiLog.filter(a => a.s >= 400).slice(0, 8);
  await h.browser.close();
  fs.writeFileSync(`${OUT}/probeS4.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS4.json');
})();
