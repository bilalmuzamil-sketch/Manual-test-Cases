// probeS2 — four things probeS1 could not settle, each re-shaped so it CAN fail, and each
// with our own harness ruled out first.
//
//  (A) C43562 step 4.  probeS1's guard refused to conclude because the category pick never
//      reached the URL — twice now.  probeQ6 DID make the same pick land (?category=…, 6
//      rows), so the difference is ours, not the build's.  Here the pick is verified after
//      every attempt and retried on a second chip if the first will not take.
//  (C) "My Timesheets" is absent from the Reports NAV — but a nav omission is not a route
//      omission.  Navigate the plausible routes directly and read what comes back.
//  (D) The Sales Tax page has no inner tabs, yet its body contains the words "collected"
//      and "all tax rates".  Find WHERE those words are before calling anything absent.
//  (E) Notes' Mention: probeS1's "checked" read is KNOWN-UNRELIABLE on Reports pages
//      (probeQ6 proved report options carry no checkbox markup), and its URL already held a
//      mention from an earlier probe.  Clear first, then tick two DIFFERENT values and read
//      the CHIP TEXT and the URL — the two signals a tester actually has.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').replace(/\s*keyboard_arrow_down$/, '').trim(),
  textTransform: getComputedStyle(e).textTransform })));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);

(async () => {
  const R = { probe: 'S2', at: new Date().toISOString(), build: 'v3.7-20e801b' };

  // ================= (A) =================
  {
    const a = { attempts: [] };
    const h = await makeHarness('admin'); const P = h.page;
    await P.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(14000); await L.ensureBarOpen(P);
    a.beforeUrl = P.url(); a.beforeRows = await rows(P); a.beforeChips = await chipInfo(P);

    for (const chipId of ['filter_chip_category', 'filter_chip_supply', 'filter_chip_gridLocation']) {
      if (a.sourceIsGenuinelyFiltered) break;
      const o = await L.openChip(P, chipId);
      const cand = o.options.filter(x => !/^all$/i.test(x.text));
      const pick = cand[1] || cand[0];
      const rec = { chipId, opened: o.found, optionsSeen: o.options.length, picked: pick && pick.text };
      if (pick) {
        await L.pickOption(P, pick.id); await P.waitForTimeout(4500);
        rec.urlWhileOpen = P.url();
        await L.closeMenu(P); await P.waitForTimeout(3000);
      }
      rec.urlAfter = P.url(); rec.rowsAfter = await rows(P); rec.chipsAfter = await chipInfo(P);
      rec.landed = rec.urlAfter !== a.beforeUrl && rec.rowsAfter !== a.beforeRows;
      a.attempts.push(rec);
      if (rec.landed) { a.sourceIsGenuinelyFiltered = true; a.sourceUrl = rec.urlAfter;
                        a.sourceRows = rec.rowsAfter; a.sourceChips = rec.chipsAfter;
                        a.viaChip = chipId; a.picked = rec.picked; }
    }
    await h.browser.close();

    if (a.sourceIsGenuinelyFiltered) {
      const h2 = await makeHarness('admin'); const P2 = h2.page;
      await P2.goto(a.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await P2.waitForTimeout(14000); await L.ensureBarOpen(P2);
      a.shared = { landedOn: P2.url(), rows: await rows(P2), chips: await chipInfo(P2) };
      await h2.browser.close();

      const h3 = await makeHarness('admin'); const P3 = h3.page;
      await P3.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await P3.waitForTimeout(14000); await L.ensureBarOpen(P3);
      a.control_bare = { landedOn: P3.url(), rows: await rows(P3), chips: await chipInfo(P3) };
      await h3.browser.close();

      const g = (set) => (set.find(c => c.id === a.viaChip) || {}).domText || '';
      a.sharedChipText = g(a.shared.chips); a.controlChipText = g(a.control_bare.chips);
      a.sharedShowsValue = /:/.test(a.sharedChipText);
      a.controlShowsValue = /:/.test(a.controlChipText);
      a.detectorCanFail = a.sharedShowsValue !== a.controlShowsValue;
      a.rowsMatchSource = a.shared.rows === a.sourceRows;
    }
    R.c43562_step4 = a;
    console.log('(A)', JSON.stringify({ via: a.viaChip, src: a.sourceUrl, srcRows: a.sourceRows,
      sharedRows: a.shared && a.shared.rows, sharedChip: a.sharedChipText,
      controlChip: a.controlChipText, canFail: a.detectorCanFail }));
  }

  // ================= (C)(D)(E) =================
  {
    const h = await makeHarness('admin'); const P = h.page;
    const probeRoute = async (p) => {
      await P.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await P.waitForTimeout(9000);
      return { asked: p, landedOn: P.url(),
        h1: await P.evaluate(() => { const e = document.querySelector('h1,h2,.text-h5,.text-h6');
                                     return e ? e.innerText.trim().slice(0, 80) : null; }),
        bodyFirst: await P.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 220)) };
    };
    R.myTimesheetsRoutes = [];
    for (const p of ['/reports/my-timesheets', '/reports/my-timesheet', '/reports/timesheets',
                     '/reports/punch-clock', '/my-timesheets'])
      R.myTimesheetsRoutes.push(await probeRoute(p));
    console.log('(C)', JSON.stringify(R.myTimesheetsRoutes.map(r => [r.asked, r.landedOn.replace(APP, ''), r.h1])));

    // (D) where do the words live on Sales Tax?
    await P.goto(APP + '/reports/sales-tax', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(11000); await L.ensureBarOpen(P);
    R.salesTaxWords = await P.evaluate(() => {
      const out = [];
      document.querySelectorAll('*').forEach(e => {
        if (e.children.length) return;
        const t = (e.innerText || '').trim();
        if (/^(collected|all tax rates)$/i.test(t) || /all tax rates/i.test(t))
          out.push({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 70),
                     text: t.slice(0, 60), role: e.getAttribute('role'),
                     testId: e.getAttribute('data-test-id'),
                     parentTestId: e.parentElement && e.parentElement.getAttribute('data-test-id') });
      });
      return out.slice(0, 20);
    });
    R.salesTaxChips = await chipInfo(P);
    R.salesTaxNavLabel = await P.evaluate(() => {
      const e = document.querySelector('[data-test-id="report_nav_sales_tax_report"]');
      return e ? { domText: e.innerText.replace(/\s+/g, ' ').trim(),
                   textTransform: getComputedStyle(e).textTransform } : null; });
    console.log('(D) words:', JSON.stringify(R.salesTaxWords));

    // (E) A/R Aging Detail — is a Location button merely scope-dependent?
    R.workplaces = await P.evaluate(async (api) => {
      const r = await fetch(api + '/api/staff/my-workplaces', { headers: { accept: 'application/json' } });
      const j = await r.json().catch(() => null);
      const arr = (j && (j.data || j)) || [];
      return { http: r.status, count: Array.isArray(arr) ? arr.length : null,
               names: Array.isArray(arr) ? arr.map(w => w.name || w.title || w.id).slice(0, 6) : null };
    }, 'https://sv8785api.qa.shopview.com');
    console.log('(E0) workplaces:', JSON.stringify(R.workplaces));

    // (E) Notes: CLEAR first, then two DIFFERENT mentions; read chip text + URL
    await P.goto(APP + '/reports/notes-report', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(11000); await L.ensureBarOpen(P);
    const e = { arrivedUrl: P.url(), arrivedChips: await chipInfo(P) };
    const mchip = (await chipInfo(P)).find(c => /mention/i.test(c.id + c.domText));
    const achip = (await chipInfo(P)).find(c => /author/i.test(c.id + c.domText));
    // clear both through their own Clear Selection so the baseline is honest
    for (const c of [mchip, achip].filter(Boolean)) {
      await L.openChip(P, c.id); await P.waitForTimeout(900);
      await L.clearSelection(P); await P.waitForTimeout(2600); await L.closeMenu(P); await P.waitForTimeout(1500);
    }
    e.afterClear = { chips: await chipInfo(P), url: P.url(), rows: await rows(P) };
    if (mchip) {
      const o = await L.openChip(P, mchip.id);
      e.optionCount = o.options.length;
      const p1 = o.options[0], p2 = o.options[1];
      e.pick1 = p1 && p1.text; e.pick2 = p2 && p2.text;
      await L.pickOption(P, p1.id); await P.waitForTimeout(3000);
      e.afterOne = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mchip.id) };
      await L.pickOption(P, p2.id); await P.waitForTimeout(3000);
      e.afterTwo = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mchip.id) };
      await L.closeMenu(P); await P.waitForTimeout(2500);
      e.settled = { url: P.url(), chips: await chipInfo(P), rows: await rows(P) };
      const n = (u) => (u.match(/mention=/g) || []).length;
      e.mentionParamsAfterOne = n(e.afterOne.url);
      e.mentionParamsAfterTwo = n(e.afterTwo.url);
      e.twoTicksHeld = e.mentionParamsAfterTwo >= 2 || /,\s*\+\d/.test((e.afterTwo.chip || {}).domText || '');
      e.detectorCanFail = e.mentionParamsAfterOne !== e.mentionParamsAfterTwo
                       || ((e.afterOne.chip || {}).domText !== (e.afterTwo.chip || {}).domText);
    }
    R.c38911_notes = e;
    console.log('(E) notes:', JSON.stringify({ clearTo: e.afterClear.url.replace(APP, ''),
      p1: e.pick1, p2: e.pick2, one: e.afterOne && e.afterOne.chip && e.afterOne.chip.domText,
      two: e.afterTwo && e.afterTwo.chip && e.afterTwo.chip.domText,
      urlOne: e.afterOne && e.afterOne.url.replace(APP, ''), urlTwo: e.afterTwo && e.afterTwo.url.replace(APP, ''),
      held: e.twoTicksHeld, canFail: e.detectorCanFail }));

    R.bridgeErrors = h.bridgeErrors.length;
    R.api4xx = h.apiLog.filter(a => a.s >= 400).slice(0, 8);
    await h.browser.close();
  }
  fs.writeFileSync(`${OUT}/probeS2.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS2.json');
})();
