// probe_mob.cjs — phone 390x844.
// C29625 (EXPECT-FAIL marked PASSED by the tester -> Rule 61 outcome check)
// C43563 s2-7 | C29628 s3 | C29622 drag handle, measured against the SHEET CARD
//          (.mobile-all-filters-sheet), not the full-screen .q-dialog wrapper.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const SETTLE = 9000;

const SHEET = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet, [data-test-id="mobile_all_filters_sheet"]')).filter(vis).pop();
  if (!card) return { card: false, dialogs: document.querySelectorAll('.q-dialog').length };
  const R = card.getBoundingClientRect();
  const band = Array.from(card.querySelectorAll('*')).filter(e => {
    const r = e.getBoundingClientRect();
    return r.height > 0 && r.width > 0 && (r.top - R.top) >= -2 && (r.top - R.top) <= 40;
  }).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return { tag: e.tagName, cls: (e.className || '').toString().slice(0, 60),
      testid: e.getAttribute('data-test-id'), text: e.children.length === 0 ? e.innerText.trim().slice(0, 24) : '',
      w: Math.round(r.width), h: Math.round(r.height), fromTop: Math.round(r.top - R.top),
      leftInCard: Math.round(r.left - R.left), bg: cs.backgroundColor, radius: cs.borderRadius }; });
  const titleEl = Array.from(card.querySelectorAll('*')).find(e => e.children.length === 0 && /^all filters/i.test(e.innerText.trim()));
  let title = null;
  if (titleEl) { const r = titleEl.getBoundingClientRect(); const cs = getComputedStyle(titleEl);
    title = { text: titleEl.innerText.trim(), textAlign: cs.textAlign,
      leftGap: Math.round(r.left - R.left), rightGap: Math.round(R.right - r.right),
      centreOffset: Math.round(((r.left + r.right) / 2) - ((R.left + R.right) / 2)) }; }
  return { card: true, rect: { top: Math.round(R.top), bottom: Math.round(R.bottom),
      left: Math.round(R.left), right: Math.round(R.right), h: Math.round(R.height) },
    band, title,
    sections: Array.from(card.querySelectorAll('[data-test-id^="filter_section_"]')).map(e => ({
      testid: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 46),
      glyphs: Array.from(e.querySelectorAll('i,.q-icon')).map(i => i.innerText.trim()).filter(Boolean).slice(0, 4) })),
    apply: (() => { const a = card.querySelector('[data-test-id="apply_filters"]');
      if (!a) return null; const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
      return { text: a.innerText.trim(), bg: cs.backgroundColor, top: Math.round(r.top),
        bottomGapInCard: Math.round(R.bottom - r.bottom) }; })() };
};

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin', { width: 390, height: 844 });
  const page = h.page;
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(SETTLE); };
  const mark = () => h.apiLog.length; const since = (n) => h.apiLog.slice(n);
  const openAllFilters = async () => {
    await page.click('[data-test-id="filter_chip_all_filters"]');
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.mobile-all-filters-sheet, [data-test-id="mobile_all_filters_sheet"]'))
      .some(d => d.getBoundingClientRect().height > 0), { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2200);
  };

  try {
    // ---- C29622 : the sheet card, measured properly ----
    await go('/workorders?tab=all');
    // start clean
    await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
    await page.waitForTimeout(3000);
    await openAllFilters();
    out.checks.c29622_sheet_card = await page.evaluate(SHEET);
    await page.screenshot({ path: `${OUT}/c29622-sheet-card.png` });

    // ---- C29625 : All Filters -> Customer accordion -> search, multi-select, tags ----
    const n0 = mark();
    const expanded = await page.evaluate(() => {
      const s = document.querySelector('[data-test-id="filter_section_company_id"]');
      if (!s) return false; s.click(); return true;
    });
    await page.waitForTimeout(2500);
    out.checks.c29625_expanded = expanded;
    out.checks.c29625_after_expand = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      if (!card) return null;
      const inputs = Array.from(card.querySelectorAll('input')).map(i => ({
        placeholder: i.getAttribute('placeholder'), type: i.type, testid: i.getAttribute('data-test-id') }));
      const opts = Array.from(card.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => ({
        testid: e.getAttribute('data-test-id'), text: e.innerText.trim().slice(0, 34),
        checked: !!e.querySelector('.q-checkbox__inner--truthy') }));
      return { inputs, optionCount: opts.length, firstOptions: opts.slice(0, 6),
        cardText: card.innerText.replace(/\s+/g, ' ').slice(0, 260) };
    });
    // step 1: type in the Search field inside the accordion
    const searchTyped = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      const i = card && Array.from(card.querySelectorAll('input')).find(x => /search/i.test(x.getAttribute('placeholder') || ''));
      if (!i) return false; i.focus(); return true;
    });
    if (searchTyped) { await page.keyboard.type('Iibay', { delay: 110 }); await page.waitForTimeout(3000); }
    out.checks.c29625_step1_typed = searchTyped;
    out.checks.c29625_step1_list = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      if (!card) return null;
      const opts = Array.from(card.querySelectorAll('[data-test-id^="filter_option_"]'));
      return { optionCount: opts.length, options: opts.map(e => e.innerText.trim().slice(0, 34)).slice(0, 8) };
    });
    await page.screenshot({ path: `${OUT}/c29625-customer-search.png` });
    // step 2: select TWO customers -- the crux of the expect-fail note
    const firstPick = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      const o = card && card.querySelector('[data-test-id^="filter_option_"]');
      if (!o) return null; const t = o.innerText.trim().slice(0, 40); o.click(); return t;
    });
    await page.waitForTimeout(3500);
    out.checks.c29625_after_first_pick = await page.evaluate((picked) => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      return { picked, sheetStillOpen: !!card, url: location.href,
        optionCount: card ? card.querySelectorAll('[data-test-id^="filter_option_"]').length : 0,
        checked: card ? Array.from(card.querySelectorAll('[data-test-id^="filter_option_"]'))
          .filter(e => e.querySelector('.q-checkbox__inner--truthy')).map(e => e.innerText.trim().slice(0, 30)) : [],
        cardText: card ? card.innerText.replace(/\s+/g, ' ').slice(0, 240) : null };
    }, firstPick);
    await page.screenshot({ path: `${OUT}/c29625-after-first-pick.png` });
    // if the sheet survived, try a SECOND customer -- that is what the note says is impossible
    if (out.checks.c29625_after_first_pick.sheetStillOpen) {
      const secondPick = await page.evaluate(() => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
        const os = card ? Array.from(card.querySelectorAll('[data-test-id^="filter_option_"]')) : [];
        const o = os.find(e => !e.querySelector('.q-checkbox__inner--truthy'));
        if (!o) return null; const t = o.innerText.trim().slice(0, 40); o.click(); return t;
      });
      await page.waitForTimeout(3500);
      out.checks.c29625_after_second_pick = await page.evaluate((picked) => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
        return { picked, sheetStillOpen: !!card, url: location.href,
          checked: card ? Array.from(card.querySelectorAll('[data-test-id^="filter_option_"]'))
            .filter(e => e.querySelector('.q-checkbox__inner--truthy')).map(e => e.innerText.trim().slice(0, 30)) : [],
          cardText: card ? card.innerText.replace(/\s+/g, ' ').slice(0, 260) : null };
      }, secondPick);
      await page.screenshot({ path: `${OUT}/c29625-after-second-pick.png` });
    }
    out.checks.c29625_api = since(n0).filter(a => /work-orders|preferences/.test(a.u)).slice(0, 8);

    // ---- C43563 : tick Imported INSIDE the sheet and apply ----
    await go('/workorders?tab=all');
    await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
    await page.waitForTimeout(2500);
    await openAllFilters();
    await page.evaluate(() => { const s = document.querySelector('[data-test-id="filter_section_status"]'); if (s) s.click(); });
    await page.waitForTimeout(2200);
    const n1 = mark();
    const tickedImp = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      const o = card && card.querySelector('[data-test-id="filter_option_status_imported"]');
      if (!o) return false; o.click(); return true;
    });
    await page.waitForTimeout(3000);
    out.checks.c43563_ticked_imported = tickedImp;
    out.checks.c43563_after_tick = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      if (!card) return { sheet: false, url: location.href };
      const secs = Array.from(card.querySelectorAll('[data-test-id^="filter_section_"]')).map(e => {
        const cs = getComputedStyle(e);
        return { testid: e.getAttribute('data-test-id'), opacity: cs.opacity,
          ariaDisabled: e.getAttribute('aria-disabled'), disabledAttr: e.hasAttribute('disabled'),
          cls: (e.className || '').toString().slice(0, 70) }; });
      return { sheet: true, url: location.href, sections: secs,
        cardText: card.innerText.replace(/\s+/g, ' ').slice(0, 240) };
    });
    await page.screenshot({ path: `${OUT}/c43563-imported-in-sheet.png` });
    // apply
    const applied = await page.evaluate(() => { const a = document.querySelector('[data-test-id="apply_filters"]');
      if (!a) return false; a.click(); return true; });
    await page.waitForTimeout(5000);
    out.checks.c43563_after_apply = await page.evaluate((ok) => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const card = Array.from(document.querySelectorAll('.mobile-all-filters-sheet')).filter(vis).pop();
      return { clicked: ok, sheetClosed: !card, url: location.href,
        chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => ({
          id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 32),
          opacity: getComputedStyle(e).opacity, disabledAttr: e.hasAttribute('disabled') })) };
    }, applied);
    out.checks.c43563_api = since(n1).filter(a => /work-orders/.test(a.u)).slice(0, 5);
    await page.screenshot({ path: `${OUT}/c43563-after-apply.png` });

    // ---- C29628 step 3 : use Clear Filters on the phone ----
    await go('/workorders?tab=all&status=approved');
    const before = await page.evaluate(() => ({
      url: location.href,
      chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 30)),
      cards: document.querySelectorAll('.q-card, [data-test-id^="work_order_row"], tbody tr').length }));
    const clicked = await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]');
      if (!b) return false; b.click(); return true; });
    await page.waitForTimeout(5000);
    out.checks.c29628_step3 = { before, clicked, after: await page.evaluate(() => ({
      url: location.href,
      chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 30)),
      cards: document.querySelectorAll('.q-card, [data-test-id^="work_order_row"], tbody tr').length,
      clearStillPresent: !!document.querySelector('[data-test-id="clear_filters"]') })) };
    await page.screenshot({ path: `${OUT}/c29628-after-clear.png` });
  } catch (e) { out.error = String(e).slice(0, 500); }

  out.api_4xx5xx = h.apiLog.filter(a => a.s >= 400);
  out.bridge_errors = h.bridgeErrors.length;
  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/mob-batch.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 8000));
  console.log('BRIDGE', out.bridge_errors, 'ERR', out.error || '-');
  await h.browser.close();
})();
