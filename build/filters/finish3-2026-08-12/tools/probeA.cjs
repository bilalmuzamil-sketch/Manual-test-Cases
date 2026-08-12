// probeA.cjs — batch A: the actionable UNTESTED desktop cases.
//   C43560  two contexts, last save wins   (re-run: the previous attempt was VACUOUS)
//   C38897  empty state clears search and filters separately (re-confirm for the ticket)
// Every save is proven by asserting the preference's updatedAt MOVED.

const { makeHarness, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');

(async () => {
  const res = { read_at_utc: new Date().toISOString(), cases: {} };

  // ---------------------------------------------------------------- C43560
  // "Two browsers, same person." Two SEPARATE contexts, same admin cookie.
  const A = await makeHarness('admin');
  const B = await makeHarness('admin');
  const c = { steps: [], could_fail: null };
  try {
    await A.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await A.page.waitForTimeout(9000);
    await B.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await B.page.waitForTimeout(9000);

    // The bar is saved COLLAPSED. Expand it in A, or there are no chips to click.
    const tgl = await A.page.$('[data-test-id="toggle_filter_bar"]');
    if (tgl) { await tgl.click(); await A.page.waitForTimeout(2500); }
    const tglB = await B.page.$('[data-test-id="toggle_filter_bar"]');
    if (tglB) { await tglB.click(); await B.page.waitForTimeout(2500); }

    const p0 = await L.pref(A.page);
    c.steps.push({ step: 0, note: 'baseline preference', updatedAt: p0.updatedAt, filters: p0.value?.filters });

    // STEP 1 — Browser A: Status = Approved, through the CHIP (a URL-applied filter is not saved).
    const oA = await L.openChip(A.page, 'filter_chip_status');
    c.steps.push({ step: 1, opened: oA.found, optionsSeen: oA.options.length, sample: oA.options.slice(0, 3) });
    const pickA = await L.pickOption(A.page, 'filter_option_status_approved');
    await L.closeMenu(A.page);
    await A.page.waitForTimeout(3000);
    const p1 = await L.pref(A.page);
    c.steps.push({ step: 1, picked: pickA.clicked, url: A.page.url(), updatedAt: p1.updatedAt,
      moved_vs_baseline: p1.updatedAt !== p0.updatedAt, filters: p1.value?.filters });

    // STEP 2 — Browser B: Estimate instead, clearing Approved.
    const oB = await L.openChip(B.page, 'filter_chip_status');
    const pickB = await L.pickOption(B.page, 'filter_option_status_estimate');
    await L.closeMenu(B.page);
    await B.page.waitForTimeout(3000);
    const p2 = await L.pref(B.page);
    c.steps.push({ step: 2, opened: oB.found, optionsSeen: oB.options.length, picked: pickB.clicked,
      url: B.page.url(), updatedAt: p2.updatedAt, moved_vs_step1: p2.updatedAt !== p1.updatedAt,
      filters: p2.value?.filters });

    // THE GUARD: if neither save moved updatedAt, the comparison in step 3 is vacuous.
    c.could_fail = (p1.updatedAt !== p0.updatedAt) && (p2.updatedAt !== p1.updatedAt);

    // STEP 3/4 — reload A and read what came back.
    await A.page.goto('https://sv8785.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await A.page.waitForTimeout(9000);
    const chipsA = await L.chips(A.page);
    const rowsA = await L.rows(A.page);
    c.steps.push({ step: '3-4', url_after_reload: A.page.url(), chips: chipsA.map(x => x.text), rows: rowsA });
    await L.shot(A.page, OUT, 'c43560-A-after-reload');

    // STEP 5 — A adds a Customer filter too.
    const tgl2 = await A.page.$('[data-test-id="toggle_filter_bar"]');
    const barOpen = await A.page.$('[data-test-id="filter_chip_status"]');
    if (!barOpen && tgl2) { await tgl2.click(); await A.page.waitForTimeout(2500); }
    const oC = await L.openChip(A.page, 'filter_chip_company_id');
    const firstCust = oC.options.find(o => /company_id/.test(o.id || ''));
    const pickC = firstCust ? await L.pickOption(A.page, firstCust.id) : { clicked: false };
    await L.closeMenu(A.page);
    await A.page.waitForTimeout(3000);
    const p3 = await L.pref(A.page);
    c.steps.push({ step: 5, customerOptions: oC.options.length, pickedCustomer: firstCust?.text,
      picked: pickC.clicked, updatedAt: p3.updatedAt, moved: p3.updatedAt !== p2.updatedAt,
      filters: p3.value?.filters });

    // STEP 6 — reload B.
    await B.page.goto('https://sv8785.qa.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await B.page.waitForTimeout(9000);
    const chipsB = await L.chips(B.page);
    c.steps.push({ step: 6, url: B.page.url(), chips: chipsB.map(x => x.text), rows: await L.rows(B.page) });
    await L.shot(B.page, OUT, 'c43560-B-after-reload');

    c.errors_seen = [...A.consoleErrs, ...B.consoleErrs].filter(e => /error|failed/i.test(e)).slice(0, 5);
    c.bridge_errors = A.bridgeErrors.length + B.bridgeErrors.length;
  } catch (e) { c.error = String(e).slice(0, 400); }
  res.cases['43560'] = c;
  L.save(OUT, 'probeA-43560', c);
  await A.browser.close(); await B.browser.close();

  // ---------------------------------------------------------------- C38897
  const H = await makeHarness('admin');
  const d = { steps: [] };
  try {
    // Precondition: one filter active with matches. Apply through the chip.
    await H.page.goto('https://sv8785.qa.shopview.com/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await H.page.waitForTimeout(9000);
    const t = await H.page.$('[data-test-id="toggle_filter_bar"]');
    const open0 = await H.page.$('[data-test-id="filter_chip_status"]');
    if (!open0 && t) { await t.click(); await H.page.waitForTimeout(2500); }
    const o = await L.openChip(H.page, 'filter_chip_status');
    const pick = await L.pickOption(H.page, 'filter_option_status_invoiced');
    await L.closeMenu(H.page);
    await H.page.waitForTimeout(2500);
    d.steps.push({ pre: 'status=invoiced via chip', opened: o.found, options: o.options.length,
      picked: pick.clicked, url: H.page.url(), rows: await L.rows(H.page) });

    // STEP 1 — a search word matching nothing left in the list.
    const sr = await L.search(H.page, 'zzzznomatchzzz');
    d.steps.push({ step: 1, search: sr, url: H.page.url(), rows: await L.rows(H.page) });
    // GUARD: if the word never reached the field, nothing below can fail.
    d.could_fail = sr.typed === true;

    // STEP 2 — read the message and enumerate EVERY control it offers.
    const msg = await H.page.evaluate(() => {
      const cands = Array.from(document.querySelectorAll('div,section,td'))
        .filter(e => /no work orders|no results|match/i.test(e.innerText || '') && (e.innerText || '').length < 400);
      const host = cands.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length)[0];
      if (!host) return { found: false, bodyHas: /No work orders/i.test(document.body.innerText) };
      return {
        found: true,
        text: host.innerText.replace(/\s+/g, ' ').trim(),
        controls: Array.from(host.querySelectorAll('button,a,[role="button"],[data-test-id]'))
          .map(b => ({ tag: b.tagName, id: b.getAttribute('data-test-id'), text: (b.innerText || '').trim() }))
          .filter(x => x.text || x.id)
      };
    });
    d.steps.push({ step: 2, message: msg });
    await L.shot(H.page, OUT, 'c38897-empty-state');

    // THE RULE-OUT: does a clear-search control exist ANYWHERE on the page, not just in the message?
    const anywhere = await H.page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id]'))
      .map(e => e.getAttribute('data-test-id'))
      .filter(id => /clear|search/i.test(id)));
    d.steps.push({ step: '2-ruleout', clear_or_search_testids_on_page: anywhere });

    d.bridge_errors = H.bridgeErrors.length;
  } catch (e) { d.error = String(e).slice(0, 400); }
  res.cases['38897'] = d;
  L.save(OUT, 'probeA-38897', d);
  await H.browser.close();

  console.log(JSON.stringify(res, null, 1).slice(0, 6000));
})();
