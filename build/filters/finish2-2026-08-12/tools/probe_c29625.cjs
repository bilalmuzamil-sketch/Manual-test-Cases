// probe_c29625.cjs — REDO. The first attempt read [data-test-id^="filter_option_"]
// across the WHOLE sheet card; Quasar keeps every collapsed accordion's content
// mounted, so it picked up the STATUS options and ticked "Estimate"/"Approved".
// That result was void and is reported as such. Here the reader is scoped to the
// Customer section element itself.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin', { width: 390, height: 844 });
  const page = h.page;
  try {
    await page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(9000);
    await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
    await page.waitForTimeout(3000);
    await page.click('[data-test-id="filter_chip_all_filters"]');
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const s = document.querySelector('[data-test-id="filter_section_company_id"]'); if (s) s.click(); });
    await page.waitForTimeout(3000);

    const SEC = () => {
      const sec = document.querySelector('[data-test-id="filter_section_company_id"]');
      if (!sec) return { section: false };
      // the expansion CONTENT lives in the section's own subtree
      const opts = Array.from(sec.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => ({
        testid: e.getAttribute('data-test-id'), text: e.innerText.trim().slice(0, 40),
        checked: !!e.querySelector('.q-checkbox__inner--truthy') }));
      const inp = Array.from(sec.querySelectorAll('input')).filter(i => i.type !== 'checkbox')
        .map(i => ({ placeholder: i.getAttribute('placeholder'), value: i.value }));
      // tags: chips inside the section input area
      const tags = Array.from(sec.querySelectorAll('.q-chip')).map(e => ({
        text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 30),
        hasRemove: !!e.querySelector('.q-chip__icon--remove, [aria-label*="remove" i]') }));
      return { section: true, textInputs: inp, optionCount: opts.length,
        options: opts.slice(0, 10), checked: opts.filter(o => o.checked).map(o => o.text),
        tags, secText: sec.innerText.replace(/\s+/g, ' ').slice(0, 200) };
    };
    out.checks.after_expand = await page.evaluate(SEC);
    // step 1: type in the section's own Search field
    const typed = await page.evaluate(() => {
      const sec = document.querySelector('[data-test-id="filter_section_company_id"]');
      const i = sec && Array.from(sec.querySelectorAll('input')).find(x => x.type !== 'checkbox');
      if (!i) return false; i.focus(); return true;
    });
    if (typed) { await page.keyboard.type('Iibay', { delay: 110 }); await page.waitForTimeout(3500); }
    out.checks.step1_typed = typed;
    out.checks.step1_after_search = await page.evaluate(SEC);
    await page.screenshot({ path: `${OUT}/c29625-customer-expanded.png` });
    // step 2: pick the first customer, then a second
    const p1 = await page.evaluate(() => {
      const sec = document.querySelector('[data-test-id="filter_section_company_id"]');
      const o = sec && sec.querySelector('[data-test-id^="filter_option_"]');
      if (!o) return null; const t = o.innerText.trim().slice(0, 40); o.click(); return t; });
    await page.waitForTimeout(3500);
    out.checks.after_first = { picked: p1, url: page.url(),
      sheetOpen: await page.evaluate(() => !!document.querySelector('.mobile-all-filters-sheet')),
      sec: await page.evaluate(SEC) };
    const p2 = await page.evaluate(() => {
      const sec = document.querySelector('[data-test-id="filter_section_company_id"]');
      if (!sec) return null;
      const os = Array.from(sec.querySelectorAll('[data-test-id^="filter_option_"]'));
      const o = os.find(e => !e.querySelector('.q-checkbox__inner--truthy'));
      if (!o) return null; const t = o.innerText.trim().slice(0, 40); o.click(); return t; });
    await page.waitForTimeout(3500);
    out.checks.after_second = { picked: p2, url: page.url(),
      sheetOpen: await page.evaluate(() => !!document.querySelector('.mobile-all-filters-sheet')),
      sec: await page.evaluate(SEC) };
    await page.screenshot({ path: `${OUT}/c29625-two-customers.png` });
    // step 4: remove one tag, then Apply
    out.checks.after_remove = await page.evaluate(() => {
      const sec = document.querySelector('[data-test-id="filter_section_company_id"]');
      if (!sec) return null;
      const chip = sec.querySelector('.q-chip');
      const rm = chip && chip.querySelector('.q-chip__icon--remove');
      if (!rm) return { removeControlFound: false, chips: Array.from(sec.querySelectorAll('.q-chip')).map(e => e.innerText.trim().slice(0, 26)) };
      rm.click(); return { removeControlFound: true };
    });
    await page.waitForTimeout(2500);
    out.checks.after_remove_state = await page.evaluate(SEC);
    const ap = await page.evaluate(() => { const a = document.querySelector('[data-test-id="apply_filters"]'); if (!a) return false; a.click(); return true; });
    await page.waitForTimeout(5000);
    out.checks.after_apply = { clicked: ap, url: page.url(),
      sheetClosed: await page.evaluate(() => !document.querySelector('.mobile-all-filters-sheet')),
      chips: await page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => e.innerText.replace(/\s+/g,' ').trim().slice(0,34))) };
    await page.screenshot({ path: `${OUT}/c29625-after-apply.png` });
  } catch (e) { out.error = String(e).slice(0, 400); }
  out.bridge_errors = h.bridgeErrors.length;
  fs.writeFileSync(`${OUT}/c29625.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 5000));
  console.log('BRIDGE', out.bridge_errors, 'ERR', out.error || '-');
  await h.browser.close();
})();
