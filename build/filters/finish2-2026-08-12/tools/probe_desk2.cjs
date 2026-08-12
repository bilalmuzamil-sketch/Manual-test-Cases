// probe_desk2.cjs — with the CORRECT option selector, found by dumping the menu DOM:
//   options are DIV[data-test-id^="filter_option_"]  (q-checkbox rows)
//   NOT `label`, NOT `.q-item` -- both of those find nothing and CANNOT FAIL.
// Drives: C38877 s3 | C38895 s1 (real chip click) | C38896 s3,s5 | C38893 s3-4 | C38902 s4
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const SETTLE = 9000;
const OPT = '[data-test-id^="filter_option_"]';

const READ_MENU = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim());
  const m = menus[menus.length - 1];
  if (!m) return { menu_open: false, stale: document.querySelectorAll('.q-menu').length };
  const opts = Array.from(m.querySelectorAll('[data-test-id^="filter_option_"]')).map(e => {
    const cs = getComputedStyle(e);
    const inp = e.querySelector('input');
    return { testid: e.getAttribute('data-test-id'), text: e.innerText.trim(),
      opacity: cs.opacity, pointerEvents: cs.pointerEvents,
      ariaDisabled: e.getAttribute('aria-disabled'),
      clsDisabled: /disabled/.test(e.className),
      checked: !!e.querySelector('.q-checkbox__inner--truthy') || (inp ? inp.checked : false) };
  });
  return { menu_open: true, optionCount: opts.length, options: opts,
    menuText: m.innerText.replace(/\s+/g, ' ').slice(0, 220) };
};

const READ_CHIPS = () => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => {
  const cs = getComputedStyle(e);
  return { id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 40),
    opacity: cs.opacity, disabledAttr: e.hasAttribute('disabled'),
    ariaDisabled: e.getAttribute('aria-disabled'), pointerEvents: cs.pointerEvents };
});

async function openStatusMenu(page) {
  await page.click('[data-test-id="filter_chip_status"]');
  await page.waitForFunction((sel) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim());
    const m = menus[menus.length - 1];
    return !!m && m.querySelectorAll(sel).length > 0;      // wait for REAL options
  }, OPT, { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(1200);
  return page.evaluate(READ_MENU);
}

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin'); const page = h.page;
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(SETTLE); };
  const mark = () => h.apiLog.length; const since = (n) => h.apiLog.slice(n);
  // leave no persisted search bleeding into the next block
  const clearSearch = async () => { const c = await page.$('[data-test-id="page_search_clear"]');
    if (c) { await c.click(); await page.waitForTimeout(2500); } };

  try {
    // ---------- C38877 step 3 : Imported combined with a second status ----------
    await go('/workorders?tab=all'); await clearSearch();
    // start from a clean filter state
    await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
    await page.waitForTimeout(3000);
    const menu0 = await openStatusMenu(page);
    out.checks.c38877_menu_before = menu0;                       // CONTROL: reader sees options
    if (menu0.menu_open && menu0.optionCount > 0) {
      const n = mark();
      await page.click('[data-test-id="filter_option_status_imported"]');
      await page.waitForTimeout(4000);
      out.checks.c38877_menu_after_imported = await page.evaluate(READ_MENU);
      out.checks.c38877_chips_after_imported = await page.evaluate(READ_CHIPS);
      out.checks.c38877_url_after_imported = page.url();
      await page.screenshot({ path: `${OUT}/c38877-imported-menu.png` });
      // STEP 3 PROPER: now try to add a SECOND status while Imported is on
      const second = await page.$('[data-test-id="filter_option_status_approved"]');
      if (second) {
        await second.click({ force: true }).catch(() => {});
        await page.waitForTimeout(4000);
        out.checks.c38877_after_second_click = { menu: await page.evaluate(READ_MENU),
          url: page.url(), chips: await page.evaluate(READ_CHIPS) };
        await page.screenshot({ path: `${OUT}/c38877-second-status-attempt.png` });
      }
      out.checks.c38877_api = since(n).filter(a => /work-orders|preferences/.test(a.u)).slice(0, 10);
      // ---------- C38895 step 1 : the save request on a REAL filter change ----------
      out.checks.c38895_put_on_chip_change = since(n).filter(a => /preferences/.test(a.u));
      // tidy: clear filters again
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1000);
      await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
      await page.waitForTimeout(3000);
    }

    // ---------- C38896 steps 3 and 5 ----------
    // step 3: change your OWN filter -> the control must NOT appear
    await go('/workorders'); await clearSearch();
    const m2 = await openStatusMenu(page);
    if (m2.menu_open && m2.optionCount > 0) {
      await page.click('[data-test-id="filter_option_status_approved"]');
      await page.waitForTimeout(4000);
      await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(1200);
    }
    out.checks.c38896_step3_own_filter_changed = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const byId = document.querySelector('[data-test-id="back_to_saved_filters"]');
      const byText = Array.from(document.querySelectorAll('button,a,span,div'))
        .filter(e => vis(e) && e.children.length === 0 && /back to (my )?(saved filters|view)/i.test(e.innerText))
        .map(e => e.innerText.trim());
      return { url: location.href, present: !!(byId && vis(byId)), byText,
        chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]'))
          .map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 32)) };
    });
    // step 5: on a shared link the control appears -> CLICK it, then look again
    await go('/workorders?tab=all&status=paid&vehicleHere=1');
    out.checks.c38896_step5_shared_before_click = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const b = document.querySelector('[data-test-id="back_to_saved_filters"]');
      return { url: location.href, present: !!(b && vis(b)), text: b ? b.innerText.trim() : null,
        chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]'))
          .map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 32)),
        rows: document.querySelectorAll('tbody tr').length };
    });
    if (out.checks.c38896_step5_shared_before_click.present) {
      await page.click('[data-test-id="back_to_saved_filters"]');
      await page.waitForTimeout(5000);
      out.checks.c38896_step5_after_click = await page.evaluate(() => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const b = document.querySelector('[data-test-id="back_to_saved_filters"]');
        const i = document.querySelector('[data-test-id="page_search_input"]');
        const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
        return { url: location.href, stillPresent: !!(b && vis(b)),
          chips: Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]'))
            .map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 32)),
          searchValue: inp ? inp.value : null, rows: document.querySelectorAll('tbody tr').length };
      });
      await page.screenshot({ path: `${OUT}/c38896-after-back-to-my-view.png` });
    }

    // ---------- C38893 steps 3-4 : top-nav search on Parts Inventory, then pick a result ----------
    await go('/parts/inventory');
    const beforeRows = await page.evaluate(() => document.querySelectorAll('tbody tr').length);
    const nav = await page.$('[data-test-id="select_global_search"], [data-test-id="button_open_mobile_search"], input[placeholder*="Search"]');
    let typed = false;
    if (nav) { await nav.click().catch(() => {}); await page.waitForTimeout(1200);
      await page.keyboard.type('Iibay', { delay: 90 }); typed = true; await page.waitForTimeout(5000); }
    out.checks.c38893_step3_parts = await page.evaluate((br) => ({
      url: location.href, rowsBefore: br, rowsNow: document.querySelectorAll('tbody tr').length,
      urlHasSearch: /[?&]search=/.test(location.href),
      dropdownItems: Array.from(document.querySelectorAll('.q-menu, .q-item__label'))
        .map(e => e.innerText.replace(/\s+/g, ' ').trim().slice(0, 60)).filter(Boolean).slice(0, 6)
    }), beforeRows);
    out.checks.c38893_typed = typed;
    await page.screenshot({ path: `${OUT}/c38893-parts-navsearch.png` });
    // step 4: pick a dropdown result
    const picked = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim());
      const m = menus[menus.length - 1]; if (!m) return null;
      const it = m.querySelector('.q-item'); if (!it) return null;
      const t = it.innerText.replace(/\s+/g, ' ').trim().slice(0, 60); it.click(); return t;
    });
    await page.waitForTimeout(6000);
    out.checks.c38893_step4_picked = { picked, landed: page.url() };

    // ---------- C38902 step 4 : type in the top search, then reload ----------
    await go('/workorders?tab=all'); await clearSearch();
    const nav2 = await page.$('[data-test-id="select_global_search"], input[placeholder*="Search"]');
    if (nav2) { await nav2.click().catch(() => {}); await page.waitForTimeout(1000);
      await page.keyboard.type('Iibay', { delay: 90 }); await page.waitForTimeout(4000); }
    await page.keyboard.press('Escape').catch(() => {});
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(SETTLE);
    out.checks.c38902_step4 = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      return { url: location.href, rows: document.querySelectorAll('tbody tr').length,
        pageSearchValue: inp ? inp.value : null,
        pageSearchBoxPresent: !!i,
        bodyHasError: /error|something went wrong/i.test(document.body.innerText.slice(0, 400)) };
    });
    await page.screenshot({ path: `${OUT}/c38902-after-reload.png` });
  } catch (e) { out.error = String(e).slice(0, 500); }

  out.api_4xx5xx = h.apiLog.filter(a => a.s >= 400);
  out.bridge_errors = h.bridgeErrors.length;
  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/desk-batch2.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 8000));
  console.log('BRIDGE', out.bridge_errors, 'ERR', out.error || '-');
  await h.browser.close();
})();
