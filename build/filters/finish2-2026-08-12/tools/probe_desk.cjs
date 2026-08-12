// probe_desk.cjs — drive the UNDRIVEN steps of the desktop cases that are still
// Untested in run 352, i.e. the ones the tester opens tomorrow.
// C38893 s3-4 | C38895 s1 | C38896 s3,s5 | C38898 s3-5 | C38900 s4 | C38902 s4 | C38877 s3
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const SETTLE = 9000;

const TOOLBARX = () => {
  const o = {};
  for (const id of ['page_search_toggle', 'toggle_filter_bar', 'button_column_selection', 'button_new_work_order']) {
    const e = document.querySelector(`[data-test-id="${id}"]`);
    o[id] = e ? Math.round(e.getBoundingClientRect().left) : null;
  }
  return o;
};

// open a chip menu and wait until it actually HAS options; never read a stale empty one
async function openChipMenu(page, chipId) {
  await page.click(`[data-test-id="${chipId}"]`);
  await page.waitForFunction(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim().length > 0);
    if (!menus.length) return false;
    const m = menus[menus.length - 1];
    // options are checkbox LABELS, not .q-item
    return m.querySelectorAll('label, .q-checkbox, .q-item').length > 0;
  }, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1400);
  return page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim().length > 0);
    const m = menus[menus.length - 1];
    if (!m) return { menu_open: false, stale_menus: document.querySelectorAll('.q-menu').length };
    const opts = Array.from(m.querySelectorAll('label, .q-item')).map(e => ({
      text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 40),
      disabled: e.getAttribute('aria-disabled') === 'true' || /disabled/.test(e.className),
      checked: !!e.querySelector('input:checked, .q-checkbox__inner--truthy') }))
      .filter(o => o.text);
    return { menu_open: true, optionCount: opts.length, options: opts.slice(0, 16),
      menuText: m.innerText.replace(/\s+/g, ' ').slice(0, 250) };
  });
}

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin');
  const page = h.page;
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(SETTLE); };
  const mark = () => h.apiLog.length;
  const since = (n) => h.apiLog.slice(n);

  try {
    // ---------------- C38898 : the Search box, steps 3-5 ----------------
    await go('/workorders?tab=all');
    const beforeX = await page.evaluate(TOOLBARX);
    await page.click('[data-test-id="page_search_toggle"]').catch(() => {});
    await page.waitForTimeout(2000);
    out.checks.c38898_opened = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      if (!i) return { input: false };
      const inp = i.tagName === 'INPUT' ? i : i.querySelector('input');
      const r = (inp || i).getBoundingClientRect();
      const host = i.closest('.q-field') || i;
      return { input: true, width: Math.round(host.getBoundingClientRect().width),
        inputWidth: Math.round(r.width), placeholder: inp ? inp.getAttribute('placeholder') : null,
        focused: document.activeElement === inp,
        icons: Array.from(host.querySelectorAll('i,.q-icon')).map(e => e.innerText.trim()).filter(Boolean) };
    });
    const afterX = await page.evaluate(TOOLBARX);
    out.checks.c38898_toolbar_moved = { before: beforeX, after: afterX,
      column_moved: beforeX.button_column_selection !== null && afterX.button_column_selection !== null
        ? afterX.button_column_selection - beforeX.button_column_selection : null,
      create_moved: beforeX.button_new_work_order !== null && afterX.button_new_work_order !== null
        ? afterX.button_new_work_order - beforeX.button_new_work_order : null };
    // step 4 type a few letters
    await page.keyboard.type('Iib', { delay: 90 }); await page.waitForTimeout(3500);
    out.checks.c38898_typed_short = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      const host = i && (i.closest('.q-field') || i);
      return { value: inp ? inp.value : null, url: location.href,
        rows: document.querySelectorAll('tbody tr').length,
        width: host ? Math.round(host.getBoundingClientRect().width) : null,
        clearPresent: !!document.querySelector('[data-test-id="page_search_clear"]') };
    });
    // step 5 delete and type a VERY LONG sentence
    await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace');
    const LONG = 'this is a deliberately very long search sentence typed to see whether the box grows or scrolls or pushes the toolbar buttons out of place on the work orders page';
    await page.keyboard.type(LONG, { delay: 8 }); await page.waitForTimeout(3500);
    const longX = await page.evaluate(TOOLBARX);
    out.checks.c38898_typed_long = await page.evaluate((L) => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      const host = i && (i.closest('.q-field') || i);
      const r = host ? host.getBoundingClientRect() : null;
      return { valueLen: inp ? inp.value.length : null, expectedLen: L.length,
        valueMatches: inp ? inp.value === L : null,
        width: r ? Math.round(r.width) : null, left: r ? Math.round(r.left) : null,
        right: r ? Math.round(r.right) : null,
        overflowsViewport: r ? (r.left < 0 || r.right > window.innerWidth) : null,
        rows: document.querySelectorAll('tbody tr').length };
    }, LONG);
    out.checks.c38898_toolbar_after_long = { toolbar: longX,
      column_moved_vs_before: longX.button_column_selection !== null && beforeX.button_column_selection !== null
        ? longX.button_column_selection - beforeX.button_column_selection : null };
    await page.screenshot({ path: `${OUT}/c38898-long-sentence.png` });

    // ---------------- C38900 : step 4, clear from the Completed tab ----------------
    await go('/workorders?tab=all');
    await page.click('[data-test-id="page_search_toggle"]').catch(() => {});
    await page.waitForTimeout(1500);
    await page.keyboard.type('Iibay', { delay: 80 }); await page.waitForTimeout(3500);
    const allTab = await page.evaluate(() => ({ url: location.href, rows: document.querySelectorAll('tbody tr').length }));
    // move to Completed
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('[role="tab"], .q-tab')).find(e => /completed/i.test(e.innerText));
      if (t) t.click();
    });
    await page.waitForTimeout(5000);
    const completed = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      return { url: location.href, value: inp ? inp.value : null,
        rows: document.querySelectorAll('tbody tr').length,
        clearPresent: !!document.querySelector('[data-test-id="page_search_clear"]') };
    });
    const n1 = mark();
    await page.click('[data-test-id="page_search_clear"]').catch(() => {});
    await page.waitForTimeout(4000);
    const cleared = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      return { url: location.href, value: inp ? inp.value : null,
        rows: document.querySelectorAll('tbody tr').length };
    });
    // back to All
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('[role="tab"], .q-tab')).find(e => /^all$/i.test(e.innerText.trim()));
      if (t) t.click();
    });
    await page.waitForTimeout(5000);
    const backAll = await page.evaluate(() => {
      const i = document.querySelector('[data-test-id="page_search_input"]');
      const inp = i && (i.tagName === 'INPUT' ? i : i.querySelector('input'));
      return { url: location.href, value: inp ? inp.value : null,
        rows: document.querySelectorAll('tbody tr').length };
    });
    out.checks.c38900_step4 = { allTab, completed, cleared, backAll, api: since(n1).filter(a => /work-orders|preferences/.test(a.u)).slice(0, 6) };

    // ---------------- C38895 : step 1, watch the save request go out ----------------
    await go('/workorders?tab=all');
    const n2 = mark();
    await page.goto(APP + '/workorders?tab=all&status=approved', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(SETTLE);
    out.checks.c38895_step1 = {
      requests_after_filter_change: since(n2).filter(a => /preferences/.test(a.u)),
      note: 'filter applied by URL; the case says "change a filter" -- a chip click is exercised in the C38877 block below' };

    // ---------------- C38877 : step 3, combine Imported with a second status ----------------
    await go('/workorders?tab=all');
    const m1 = await openChipMenu(page, 'filter_chip_status');
    out.checks.c38877_menu_initial = m1;
    if (m1.menu_open && m1.optionCount > 0) {
      const n3 = mark();
      // tick Imported
      const ticked = await page.evaluate(() => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim());
        const m = menus[menus.length - 1]; if (!m) return false;
        const lab = Array.from(m.querySelectorAll('label, .q-item')).find(e => /imported/i.test(e.innerText));
        if (!lab) return false; lab.click(); return true;
      });
      await page.waitForTimeout(3500);
      out.checks.c38877_ticked_imported = ticked;
      out.checks.c38877_after_tick = await page.evaluate(() => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => vis(m) && m.innerText.trim());
        const m = menus[menus.length - 1];
        const opts = m ? Array.from(m.querySelectorAll('label, .q-item')).map(e => ({
          text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 30),
          disabled: e.getAttribute('aria-disabled') === 'true' || /disabled/.test(e.className)
            || (getComputedStyle(e).opacity !== '' && parseFloat(getComputedStyle(e).opacity) < 0.9),
          opacity: getComputedStyle(e).opacity,
          checked: !!e.querySelector('input:checked, .q-checkbox__inner--truthy') })).filter(o => o.text) : [];
        const chips = Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e => ({
          id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 34),
          disabled: e.hasAttribute('disabled') || e.getAttribute('aria-disabled') === 'true',
          opacity: getComputedStyle(e).opacity }));
        return { menu_still_open: !!m, options: opts.slice(0, 16), chips, url: location.href };
      });
      await page.screenshot({ path: `${OUT}/c38877-step3-imported.png` });
      out.checks.c38877_api = since(n3).filter(a => /work-orders|preferences/.test(a.u)).slice(0, 8);
    }
  } catch (e) { out.error = String(e).slice(0, 500); }

  out.api_4xx5xx = h.apiLog.filter(a => a.s >= 400);
  out.bridge_errors = h.bridgeErrors.length;
  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/desk-batch.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out.checks, null, 1).slice(0, 7500));
  console.log('BRIDGE', out.bridge_errors, 'ERR', out.error || '-');
  await h.browser.close();
})();
