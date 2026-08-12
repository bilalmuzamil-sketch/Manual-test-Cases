// probeS3 — three checks probeS2 proved IT COULD NOT FAIL, re-shaped so they can.
//
//  (A) C43562 step 4.  probeS2 got the shared link working, but its CONTROL also showed the
//      value, because Parts/Inventory ALSO saves the filter to the page preference — so the
//      run could not tell "the address carried it" from "the preference restored it".
//      Fix: share a URL naming a DIFFERENT category from the saved one.  If the fresh window
//      shows the URL's category rather than the saved one, the address carried it, and the
//      saved value is itself the control.
//  (D) C38909 step 6.  There are no "Collected"/"All Tax Rates" TABS; there is a "See All
//      Tax Rates" control.  Click it and record where it goes and what bar it carries.
//  (E) C38911 / C38910 multi-select on a Reports page.  probeS2's second tick changed
//      nothing, which is equally consistent with "single-select" and "my click missed".
//      Re-open the menu between picks and record whether it was still open, so the two are
//      distinguishable.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').replace(/\s*keyboard_arrow_down$/, '').trim() })));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);
const menuOpen = p => p.evaluate(() => !!document.querySelector('.q-menu, .q-dialog'));

(async () => {
  const R = { probe: 'S3', at: new Date().toISOString(), build: 'v3.7-20e801b' };

  // ================= (A) =================
  {
    const a = {};
    const h = await makeHarness('admin'); const P = h.page;
    await P.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(14000); await L.ensureBarOpen(P);

    const o = await L.openChip(P, 'filter_chip_category');
    const opts = o.options.filter(x => !/^all$/i.test(x.text));
    a.optionsSeen = o.options.length;
    const A = opts[0], B = opts[1];               // two DIFFERENT categories
    a.savedCategory = A && A.text; a.sharedCategory = B && B.text;

    // 1. set A through the chip, so A is what the preference holds
    await L.pickOption(P, A.id); await P.waitForTimeout(4200);
    await L.closeMenu(P); await P.waitForTimeout(2500);
    a.afterSetA = { url: P.url(), rows: await rows(P), chip: (await chipInfo(P)).find(c => c.id === 'filter_chip_category') };

    // 2. build the SHARED url by hand from B's id — the address a tester would copy after
    //    filtering by B.  (Deriving it from A's page would only re-share A.)
    const bId = B.id.replace('filter_option_category_', '');
    a.sharedUrl = `${APP}/parts/inventory?category=${bId}`;
    await h.browser.close();

    // 3. fresh window on the shared url
    const h2 = await makeHarness('admin'); const P2 = h2.page;
    await P2.goto(a.sharedUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P2.waitForTimeout(14000); await L.ensureBarOpen(P2);
    a.shared = { landedOn: P2.url(), rows: await rows(P2),
                 chip: (await chipInfo(P2)).find(c => c.id === 'filter_chip_category') };
    await h2.browser.close();

    // 4. CONTROL — fresh window, BARE url. The preference still holds A.
    const h3 = await makeHarness('admin'); const P3 = h3.page;
    await P3.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P3.waitForTimeout(14000); await L.ensureBarOpen(P3);
    a.control_bare = { landedOn: P3.url(), rows: await rows(P3),
                       chip: (await chipInfo(P3)).find(c => c.id === 'filter_chip_category') };
    await h3.browser.close();

    const st = (a.shared.chip || {}).domText || '', ct = (a.control_bare.chip || {}).domText || '';
    a.sharedShowsSharedCategory = new RegExp(a.sharedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(st);
    a.controlShowsSavedCategory = new RegExp(a.savedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(ct);
    a.detectorCanFail = st !== ct;                     // the two arms genuinely differ
    R.c43562_step4 = a;
    console.log('(A)', JSON.stringify({ saved: a.savedCategory, shared: a.sharedCategory,
      sharedChip: st, controlChip: ct, sharedRows: a.shared.rows, controlRows: a.control_bare.rows,
      canFail: a.detectorCanFail }));
  }

  // ================= (D)(E) =================
  {
    const h = await makeHarness('admin'); const P = h.page;

    // (D) the "See All Tax Rates" control
    await P.goto(APP + '/reports/sales-tax', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(11000); await L.ensureBarOpen(P);
    const d = { before: { url: P.url(), chips: await chipInfo(P), rows: await rows(P) } };
    d.controlFound = await P.evaluate(() => {
      const e = [...document.querySelectorAll('*')].find(x => !x.children.length
        && /see all tax rates/i.test(x.innerText || ''));
      if (!e) return null;
      const clickable = e.closest('button, a, [role="button"], .q-btn, .cursor-pointer') || e;
      return { text: e.innerText.trim(), tag: clickable.tagName,
               testId: clickable.getAttribute('data-test-id'),
               href: clickable.getAttribute('href') };
    });
    if (d.controlFound) {
      await P.evaluate(() => {
        const e = [...document.querySelectorAll('*')].find(x => !x.children.length
          && /see all tax rates/i.test(x.innerText || ''));
        (e.closest('button, a, [role="button"], .q-btn, .cursor-pointer') || e).click();
      });
      await P.waitForTimeout(9000); await L.ensureBarOpen(P);
      d.after = { url: P.url(), chips: await chipInfo(P), rows: await rows(P),
                  body: await P.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 260)) };
      d.wentSomewhere = d.after.url !== d.before.url;
    }
    R.salesTaxAllRates = d;
    console.log('(D)', JSON.stringify({ found: d.controlFound, from: d.before.url.replace(APP, ''),
      to: d.after && d.after.url.replace(APP, ''), chipsAfter: d.after && d.after.chips.map(c => c.domText) }));

    // (E) multi-select on a Reports page, with the menu state recorded between picks
    await P.goto(APP + '/reports/notes-report', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(11000); await L.ensureBarOpen(P);
    const e = {};
    const mid = (await chipInfo(P)).find(c => /mention/i.test(c.id + c.domText));
    // clean baseline through the control a tester uses
    await L.openChip(P, mid.id); await P.waitForTimeout(900);
    await L.clearSelection(P); await P.waitForTimeout(2600); await L.closeMenu(P); await P.waitForTimeout(1600);
    e.baseline = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mid.id) };

    const o1 = await L.openChip(P, mid.id);
    e.optionCount = o1.options.length;
    const p1 = o1.options[0], p2 = o1.options[1];
    e.p1 = p1.text; e.p2 = p2.text;
    await L.pickOption(P, p1.id); await P.waitForTimeout(3200);
    e.menuStillOpenAfterFirstPick = await menuOpen(P);
    e.afterOne = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mid.id) };

    // RE-OPEN if it closed, so the second pick is a real attempt either way
    if (!e.menuStillOpenAfterFirstPick) { const o2 = await L.openChip(P, mid.id);
      e.reopened = o2.found; e.optionsOnReopen = o2.options.length;
      e.secondIdStillPresent = o2.options.some(x => x.id === p2.id); }
    await L.pickOption(P, p2.id); await P.waitForTimeout(3200);
    e.menuStillOpenAfterSecondPick = await menuOpen(P);
    e.afterTwo = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mid.id) };
    await L.closeMenu(P); await P.waitForTimeout(2200);
    e.settled = { url: P.url(), chip: (await chipInfo(P)).find(c => c.id === mid.id), rows: await rows(P) };

    const n = u => (u.match(/mention=/g) || []).length;
    e.mentionParams = { baseline: n(e.baseline.url), one: n(e.afterOne.url), two: n(e.afterTwo.url) };
    e.firstPickChangedSomething = e.afterOne.url !== e.baseline.url
      || (e.afterOne.chip || {}).domText !== (e.baseline.chip || {}).domText;
    e.secondPickChangedSomething = e.afterTwo.url !== e.afterOne.url
      || (e.afterTwo.chip || {}).domText !== (e.afterOne.chip || {}).domText;
    e.holdsTwo = e.mentionParams.two >= 2;
    e.detectorCanFail = e.firstPickChangedSomething;   // a pick demonstrably CAN move the signal
    R.reportsMultiSelect = e;
    console.log('(E)', JSON.stringify({ p1: e.p1, p2: e.p2, menuOpenAfter1: e.menuStillOpenAfterFirstPick,
      reopened: e.reopened, secondPresent: e.secondIdStillPresent,
      one: (e.afterOne.chip || {}).domText, two: (e.afterTwo.chip || {}).domText,
      params: e.mentionParams, first: e.firstPickChangedSomething, second: e.secondPickChangedSomething,
      holdsTwo: e.holdsTwo, canFail: e.detectorCanFail }));

    R.bridgeErrors = h.bridgeErrors.length;
    await h.browser.close();
  }
  fs.writeFileSync(`${OUT}/probeS3.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS3.json');
})();
