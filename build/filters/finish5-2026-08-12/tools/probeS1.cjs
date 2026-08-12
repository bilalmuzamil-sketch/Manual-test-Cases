// probeS1 — the gaps probeR3 left, each with a control that proves the check can fail.
//
//  (A) C43562 step 4 — shared URL in a fresh window.  probeR3's run of this was INVALID:
//      its pick never reached the address bar, so the "shared" link carried no filter and
//      the check could not fail.  Here the source URL is ASSERTED to carry the filter and
//      to have changed the row count BEFORE anything is shared, and a CONTROL opens the
//      bare URL in the same fresh-window way to prove the detector distinguishes them.
//  (B) C38905 — is there a "Part Type" button on Parts Returns at all?  Enumerate every
//      chip on both tabs with its id and its on-screen label (computed style, not
//      textContent), rather than looking for a name we expect.
//  (C) C38909 step 3 — is there a "My Timesheets" report in the Reports nav?
//  (D) C38909 step 6 — does the Sales Tax report carry "Collected" / "All Tax Rates" tabs?
//  (E) C38911 — what buttons does A/R Aging Detail actually carry, and can Notes' Mention
//      take two ticks?
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => {
  const cs = getComputedStyle(e);
  return { id: e.getAttribute('data-test-id'),
           domText: (e.innerText || '').replace(/\s+/g, ' ').trim(),
           textTransform: cs.textTransform, disabled: e.hasAttribute('disabled') };
}));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);

(async () => {
  const R = { probe: 'S1', at: new Date().toISOString(), build: 'v3.7-20e801b' };

  // ================= (A) C43562 step 4 =================
  {
    const a = {};
    const h = await makeHarness('admin'); const P = h.page;
    await P.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(12000); await L.ensureBarOpen(P);
    a.beforeUrl = P.url(); a.beforeRows = await rows(P);

    const o = await L.openChip(P, 'filter_chip_category');
    a.optionsSeen = o.options.length;
    const pick = o.options.find(x => /brake/i.test(x.text)) || o.options[1];
    a.picked = pick && pick.text;
    if (pick) { await L.pickOption(P, pick.id); await P.waitForTimeout(4000); }
    await L.closeMenu(P); await P.waitForTimeout(2500);

    a.sourceUrl = P.url(); a.sourceRows = await rows(P); a.sourceChips = await chipInfo(P);
    // THE GUARD: refuse to draw any conclusion unless the source page is genuinely filtered.
    a.sourceIsGenuinelyFiltered = /[?&]category=/.test(a.sourceUrl) && a.sourceRows !== a.beforeRows;
    await h.browser.close();

    if (a.sourceIsGenuinelyFiltered) {
      // the shared link, in a genuinely separate browser process
      const h2 = await makeHarness('admin'); const P2 = h2.page;
      await P2.goto(a.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await P2.waitForTimeout(13000); await L.ensureBarOpen(P2);
      a.shared = { landedOn: P2.url(), rows: await rows(P2), chips: await chipInfo(P2) };
      await h2.browser.close();

      // CONTROL: the same fresh-window route on the BARE url must NOT show the filter.
      const h3 = await makeHarness('admin'); const P3 = h3.page;
      await P3.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await P3.waitForTimeout(13000); await L.ensureBarOpen(P3);
      a.control_bare = { landedOn: P3.url(), rows: await rows(P3), chips: await chipInfo(P3) };
      await h3.browser.close();

      const sharedCat = a.shared.chips.find(c => c.id === 'filter_chip_category');
      const bareCat = a.control_bare.chips.find(c => c.id === 'filter_chip_category');
      a.sharedShowsValue = !!sharedCat && /:/.test(sharedCat.domText);
      a.controlShowsValue = !!bareCat && /:/.test(bareCat.domText);
      a.detectorCanFail = a.sharedShowsValue !== a.controlShowsValue;
    } else {
      a.note = 'source page was NOT filtered — no conclusion drawn (probeR3 failed exactly here)';
    }
    R.c43562_step4 = a;
    console.log('(A) step4:', JSON.stringify({ src: a.sourceUrl, srcRows: a.sourceRows,
      guard: a.sourceIsGenuinelyFiltered, sharedRows: a.shared && a.shared.rows,
      sharedShows: a.sharedShowsValue, controlShows: a.controlShowsValue,
      canFail: a.detectorCanFail }));
  }

  // ================= (B)–(E) =================
  {
    const h = await makeHarness('admin'); const P = h.page;
    const go = async (p, w = 10000) => { await P.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 });
                                        await P.waitForTimeout(w); await L.ensureBarOpen(P); };
    const innerTabs = () => P.$$eval('[role="tab"], .q-tab', els => els.map(e => ({
      id: e.getAttribute('data-test-id'),
      domText: (e.innerText || '').replace(/\s+/g, ' ').trim(),
      textTransform: getComputedStyle(e).textTransform
    })).filter(t => !/^(report_nav|parts_nav)/.test(t.id || '')));

    // (B) Parts Returns — both tabs, every chip named
    await go('/parts/returns');
    const b = { returnsTabs: await innerTabs(), returnsChips: await chipInfo(P), returnsRows: await rows(P) };
    // open every chip and record its option list, so "Core / Non Core" can be found or ruled out
    b.returnsChipContents = [];
    for (const c of b.returnsChips) {
      const o = await L.openChip(P, c.id);
      b.returnsChipContents.push({ id: c.id, label: c.domText, opened: o.found,
        optionCount: o.options.length, options: o.options.slice(0, 12).map(x => x.text) });
      await L.closeMenu(P); await P.waitForTimeout(700);
    }
    const credits = b.returnsTabs.find(t => /credit/i.test(t.domText));
    if (credits && credits.id) { await L.clickSel(P, `[data-test-id="${credits.id}"]`); await P.waitForTimeout(6000); await L.ensureBarOpen(P);
      b.creditsChips = await chipInfo(P); b.creditsRows = await rows(P); }
    R.c38905_returns = b;
    console.log('(B) Returns chips:', JSON.stringify(b.returnsChips.map(c => c.domText)));
    console.log('    contents     :', JSON.stringify(b.returnsChipContents.map(c => [c.label, c.options])));

    // (C) the whole Reports nav, verbatim
    await go('/reports');
    R.reportsNav = await P.$$eval('[data-test-id^="report_nav_"]', els => els.map(e => ({
      id: e.getAttribute('data-test-id'),
      domText: (e.innerText || '').replace(/\s+/g, ' ').trim(),
      href: e.getAttribute('href') })));
    R.myTimesheetsPresent = R.reportsNav.some(n => /my timesheet/i.test(n.domText));
    console.log('(C) reports nav:', JSON.stringify(R.reportsNav.map(n => n.domText)));
    console.log('    "My Timesheets" present:', R.myTimesheetsPresent);

    // (D) Sales Tax report tabs
    await go('/reports/sales-tax');
    R.salesTax = { landedOn: P.url(), chips: await chipInfo(P), innerTabs: await innerTabs(),
                   rows: await rows(P),
                   bodyHasCollected: await P.evaluate(() => /collected/i.test(document.body.innerText)),
                   bodyHasAllTaxRates: await P.evaluate(() => /all tax rates/i.test(document.body.innerText)) };
    console.log('(D) sales tax:', JSON.stringify(R.salesTax.innerTabs), 'chips',
      JSON.stringify(R.salesTax.chips.map(c => c.domText)), 'collectedWord', R.salesTax.bodyHasCollected,
      'allTaxRatesWord', R.salesTax.bodyHasAllTaxRates);

    // (E) A/R Aging Detail + Notes Mention two ticks
    await go('/reports/ar-aging-detail');
    const e1 = { landedOn: P.url(), chips: await chipInfo(P), rows: await rows(P) };
    e1.chipContents = [];
    for (const c of e1.chips) {
      const o = await L.openChip(P, c.id);
      e1.chipContents.push({ id: c.id, label: c.domText, optionCount: o.options.length,
        options: o.options.slice(0, 10).map(x => x.text) });
      await L.closeMenu(P); await P.waitForTimeout(700);
    }
    R.c38911_arAging = e1;
    console.log('(E1) AR Aging chips:', JSON.stringify(e1.chips.map(c => c.domText)));

    await go('/reports/notes-report');
    const e2 = { landedOn: P.url(), chips: await chipInfo(P), startRows: await rows(P) };
    const mid = e2.chips.find(c => /mention/i.test(c.id) || /mention/i.test(c.domText));
    if (mid) {
      const o = await L.openChip(P, mid.id);
      e2.mention = { optionCount: o.options.length, sample: o.options.slice(0, 5).map(x => x.text),
                     checkedBefore: o.options.filter(x => x.checked).map(x => x.text) };
      const t1 = o.options[0], t2 = o.options[1];
      const reread = () => P.$$eval(L.OPT, els => els.map(e => ({
        id: e.getAttribute('data-test-id'),
        text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
        checked: e.getAttribute('aria-checked') === 'true'
          || !!e.querySelector('.q-checkbox__inner--truthy') })));
      await L.pickOption(P, t1.id); await P.waitForTimeout(2600);
      const mid1 = await reread();
      await L.pickOption(P, t2.id); await P.waitForTimeout(2600);
      const mid2 = await reread();
      e2.afterFirstTick = { checked: mid1.filter(x => x.checked).map(x => x.text), url: P.url() };
      e2.afterSecondTick = { checked: mid2.filter(x => x.checked).map(x => x.text), url: P.url() };
      await L.closeMenu(P); await P.waitForTimeout(2500);
      e2.chipsAfter = await chipInfo(P); e2.rowsAfter = await rows(P);
      e2.twoTicksHeld = e2.afterSecondTick.checked.length >= 2;
    }
    R.c38911_notes = e2;
    console.log('(E2) Notes mention:', JSON.stringify({ opts: e2.mention && e2.mention.optionCount,
      after1: e2.afterFirstTick, after2: e2.afterSecondTick, twoTicks: e2.twoTicksHeld }));

    R.bridgeErrors = h.bridgeErrors.length;
    R.api4xx = h.apiLog.filter(a => a.s >= 400).slice(0, 8);
    await h.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeS1.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS1.json');
})();
