// probeJ.cjs — the last two reachable cases: the phone SINGLE-filter sheet.
//   C29624 Status chip's own sheet -- deferred until Apply?
//   C29625 Customer chip inside the ALL FILTERS sheet (its stated precondition), all 4 steps
const B = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12/tools/';
const { makeHarness, OUT } = require(B + 'harness.cjs');
const L = require(B + 'lib.cjs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';
const PHONE = { width: 390, height: 844 };

const sheetText = p => p.evaluate(() => {
  const c = document.querySelector('.mobile-all-filters-sheet') || document.querySelector('.q-dialog .q-card');
  if (!c) return { sheet: false };
  return { sheet: true, title: (c.innerText || '').split('\n').slice(0, 3).join(' | '),
    accordions: c.querySelectorAll('.q-expansion-item').length,
    options: Array.from(c.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => (e.innerText || '').trim()),
    hasClearSelection: /Clear Selection/i.test(c.innerText || ''),
    applyButton: (() => { const b = document.querySelector('[data-test-id="apply_filters"]');
      return b ? { present: true, text: (b.innerText || '').trim() } : { present: false }; })(),
    closeButton: !!c.querySelector('[data-test-id*="close"],button i.q-icon'),
    cardWidth: Math.round(c.getBoundingClientRect().width) };
});
const listState = p => p.evaluate(() => {
  const nums = [...new Set((document.body.innerText.match(/S2-\d{4,6}/g) || []))];
  return { url: location.href, visibleWorkOrders: nums.length, sample: nums.slice(0, 4),
    empty: /No work orders match/i.test(document.body.innerText) };
});

(async () => {
  const H = await makeHarness('admin', PHONE);
  const R = { read_at_utc: new Date().toISOString(), viewport: PHONE, cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeJ', R); };
  try {
    // ---------------------------------------------------------------- C29624
    await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 11000);
    const c = {};
    c.listBefore = await listState(H.page);
    const tap = await L.clickSel(H.page, '[data-test-id="filter_chip_status"]');
    await S(H.page, 2800);
    c.chipTapped = tap;
    c.sheet = await sheetText(H.page);
    await L.shot(H.page, OUT, 'c29624-status-own-sheet');
    // step 3 — tick one, then a second, watching the list
    const ids = await H.page.$$eval('[data-test-id^="filter_option_status_"]', e => e.map(x => x.getAttribute('data-test-id')));
    c.optionIds = ids.length;
    const t1 = await L.clickSel(H.page, '[data-test-id="filter_option_status_declined"]');
    await S(H.page, 3000);
    c.afterFirstTick = { click: t1, ...(await listState(H.page)), sheetStillOpen: (await sheetText(H.page)).sheet };
    const t2 = await L.clickSel(H.page, '[data-test-id="filter_option_status_complete"]');
    await S(H.page, 3000);
    c.afterSecondTick = { click: t2, ...(await listState(H.page)), sheetStillOpen: (await sheetText(H.page)).sheet };
    c.deferredWhileTicking = c.listBefore.url === c.afterFirstTick.url;
    // step 4 — Apply
    const ap = await L.clickSel(H.page, '[data-test-id="apply_filters"]');
    await S(H.page, 4000);
    c.afterApply = { click: ap, ...(await listState(H.page)),
      sheetStillOpen: (await sheetText(H.page)).sheet,
      statusChip: (await L.label(H.page, '[data-test-id="filter_chip_status"]')).innerText };
    c.could_fail = tap.clicked === true && t1.clicked === true;
    put('29624', c);
    await L.shot(H.page, OUT, 'c29624-after-apply');

    // ---------------------------------------------------------------- C29625 (ALL FILTERS sheet, as its precondition says)
    await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 10000);
    const d = {};
    await L.clickSel(H.page, '[data-test-id="filter_chip_all_filters"]');
    await S(H.page, 2800);
    // expand Customer
    const exp = await H.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
      const r = rows.find(x => /^Customer/i.test((x.innerText || '').split('\n')[0] || ''));
      if (!r) return { ok: false };
      (r.querySelector('.q-item') || r).click(); return { ok: true };
    });
    await S(H.page, 2200);
    d.customerExpanded = exp;
    // step 1 — type
    const typed = await H.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
      const r = rows.find(x => /^Customer/i.test((x.innerText || '').split('\n')[0] || ''));
      const i = r && r.querySelector('input:not(.hidden)');
      if (!i) return { ok: false };
      i.focus(); i.value = 'Aa'; i.dispatchEvent(new Event('input', { bubbles: true }));
      return { ok: true, placeholder: i.getAttribute('placeholder') };
    });
    await S(H.page, 2500);
    const scoped = () => H.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
      const r = rows.find(x => /^Customer/i.test((x.innerText || '').split('\n')[0] || ''));
      if (!r) return { section: false };
      const opts = Array.from(r.querySelectorAll('[data-test-id^="filter_option_company_id_"]'));
      return { section: true, count: opts.length,
        names: opts.map(e => (e.innerText || '').trim()).slice(0, 6),
        ids: opts.map(e => e.getAttribute('data-test-id')).slice(0, 6),
        ticked: opts.filter(e => e.getAttribute('aria-checked') === 'true' || e.querySelector('.q-item__section--side i')).map(e => (e.innerText || '').trim()),
        tags: Array.from(r.querySelectorAll('.q-chip')).map(x => ({ t: (x.innerText || '').replace(/\s+/g, ' ').trim(),
          hasRemove: !!x.querySelector('.q-chip__icon--remove,[class*="remove"]') })) };
    });
    d.step1_afterTyping = { typed, ...(await scoped()) };
    d.urlAfterTyping = H.page.url();
    // step 2 — select two or three
    const sc = await scoped();
    const picks = [];
    for (const id of (sc.ids || []).slice(0, 3)) {
      const r = await L.clickSel(H.page, `[data-test-id="${id}"]`);
      await S(H.page, 2200);
      picks.push({ id, click: r, urlNow: H.page.url(), sheetStillOpen: (await sheetText(H.page)).sheet });
    }
    d.step2_picks = picks;
    d.step3_state = await scoped();
    await L.shot(H.page, OUT, 'c29625-customer-multi');
    // step 4 — remove one tag then Apply
    const rm = await H.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.q-expansion-item'));
      const r = rows.find(x => /^Customer/i.test((x.innerText || '').split('\n')[0] || ''));
      const chip = r && r.querySelector('.q-chip');
      if (!chip) return { ok: false, why: 'no tag present' };
      const label = (chip.innerText || '').replace(/\s+/g, ' ').trim();
      const x = chip.querySelector('.q-chip__icon--remove,[class*="remove"]');
      if (!x) return { ok: false, why: 'no remove icon', label };
      x.click(); return { ok: true, label };
    });
    await S(H.page, 2600);
    d.step4_removeTag = rm;
    d.afterRemove = await scoped();
    const ap2 = await L.clickSel(H.page, '[data-test-id="apply_filters"]');
    await S(H.page, 4000);
    d.step4_afterApply = { click: ap2, ...(await listState(H.page)),
      sheetStillOpen: (await sheetText(H.page)).sheet,
      allFiltersChip: (await L.label(H.page, '[data-test-id="filter_chip_all_filters"]')).innerText };
    d.could_fail = typed.ok === true && picks.some(p => p.click.clicked);
    put('29625', d);
    await L.shot(H.page, OUT, 'c29625-after-apply');
    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 500); }
  L.save(OUT, 'probeJ', R);
  console.log('ERR:', R.error, '| blocks:', Object.keys(R.cases).length);
  await H.browser.close();
})();
