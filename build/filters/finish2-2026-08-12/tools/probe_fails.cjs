// probe_fails.cjs — walk the 5 plain-READY cases the tester marked FAILED today.
// C29601 collapse button | C29603 collapse remembered | C29614 permanent persistence
// Purpose: establish whether each failure is the BUILD or our CASE.
// Every absence claim carries a CONTROL that proves the check can see the thing
// when it is present.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const SETTLE = 9000;

async function readBar(page) {
  return page.evaluate(() => {
    const q = (s) => Array.from(document.querySelectorAll(s));
    const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const tgl = document.querySelector('[data-test-id="toggle_filter_bar"]');
    const chips = q('[data-test-id^="filter_chip_"]').filter(vis).map(e => ({
      id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim(),
      y: Math.round(e.getBoundingClientRect().top) }));
    const table = document.querySelector('table, .q-table, [role="table"]');
    const thead = document.querySelector('thead') || document.querySelector('.q-table thead');
    const rows = q('tbody tr').filter(vis).length;
    let tglInfo = null;
    if (tgl) {
      const cs = getComputedStyle(tgl); const r = tgl.getBoundingClientRect();
      tglInfo = { present: true, x: Math.round(r.left), y: Math.round(r.top),
        ariaPressed: tgl.getAttribute('aria-pressed'), cls: tgl.className,
        color: cs.color, bg: cs.backgroundColor,
        // Quasar paints state on the focus-helper child
        helper: (() => { const h = tgl.querySelector('.q-focus-helper');
          return h ? { opacity: getComputedStyle(h).opacity, bg: getComputedStyle(h).backgroundColor } : null; })(),
        innerText: tgl.innerText.replace(/\s+/g, ' ').trim(),
        icons: Array.from(tgl.querySelectorAll('i,.q-icon')).map(i => i.innerText.trim()) };
    } else { tglInfo = { present: false }; }
    // toolbar landmarks for the "left of Create Work Order" claim
    const land = {};
    for (const [k, sel] of Object.entries({
      search: '[data-test-id="page_search_toggle"]',
      create: '[data-test-id="button_create_work_order"]',
      layout: '[data-test-id="toggle_table_width"]' })) {
      const e = document.querySelector(sel);
      land[k] = e && vis(e) ? Math.round(e.getBoundingClientRect().left) : null;
    }
    // any button carrying the filter_list glyph, in case the test-id differs
    const filterGlyph = q('button').filter(b => /filter_list/.test(b.innerText)).map(b => ({
      testid: b.getAttribute('data-test-id'), x: Math.round(b.getBoundingClientRect().left),
      ariaPressed: b.getAttribute('aria-pressed'), cls: b.className }));
    return { url: location.href, toggle: tglInfo, chipCount: chips.length, chips,
      tableTop: table ? Math.round(table.getBoundingClientRect().top) : null,
      theadTop: thead ? Math.round(thead.getBoundingClientRect().top) : null,
      rows, landmarks: land, filterGlyphButtons: filterGlyph };
  });
}

(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin');
  const page = h.page;
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(SETTLE); };

  try {
    // ---------- C29601 : the toolbar filter button collapses the bar ----------
    await go('/workorders?tab=all');
    // Make sure we START expanded, whatever a previous session left behind.
    let s = await readBar(page);
    if (s.chipCount === 0 && s.toggle.present) { await page.click('[data-test-id="toggle_filter_bar"]'); await page.waitForTimeout(2500); s = await readBar(page); }
    out.checks.c29601_before = s;
    await page.screenshot({ path: `${OUT}/c29601-expanded.png` });

    if (s.toggle.present) {
      await page.click('[data-test-id="toggle_filter_bar"]');
      await page.waitForTimeout(2500);
      const after = await readBar(page);
      out.checks.c29601_after = after;
      await page.screenshot({ path: `${OUT}/c29601-collapsed.png` });
      out.checks.c29601_verdict = {
        bar_hidden: after.chipCount === 0,
        chips_before: s.chipCount, chips_after: after.chipCount,
        table_moved_up: (s.theadTop !== null && after.theadTop !== null) ? (s.theadTop - after.theadTop) : null,
        button_left_of_create: (s.toggle.x !== null && s.landmarks.create !== null) ? s.toggle.x < s.landmarks.create : null,
        pressed_look_changed: JSON.stringify(s.toggle.helper) !== JSON.stringify(after.toggle.helper)
          || s.toggle.cls !== after.toggle.cls || s.toggle.color !== after.toggle.color
          || s.toggle.ariaPressed !== after.toggle.ariaPressed,
        before_look: { cls: s.toggle.cls, color: s.toggle.color, aria: s.toggle.ariaPressed, helper: s.toggle.helper },
        after_look: { cls: after.toggle.cls, color: after.toggle.color, aria: after.toggle.ariaPressed, helper: after.toggle.helper }
      };
      // ---------- C29603 : is the COLLAPSED state remembered on return ----------
      // leave it collapsed, go to Customers, come back
      await go('/customers'); const cust = await readBar(page);
      await go('/workorders?tab=all');
      const back1 = await readBar(page);
      out.checks.c29603_return_while_collapsed = { customers_chipCount: cust.chipCount, back: back1 };
      await page.screenshot({ path: `${OUT}/c29603-return-collapsed.png` });

      // now EXPAND, leave, come back
      if (back1.toggle.present) {
        await page.click('[data-test-id="toggle_filter_bar"]'); await page.waitForTimeout(2500);
        const exp = await readBar(page);
        await go('/customers'); await go('/workorders?tab=all');
        const back2 = await readBar(page);
        out.checks.c29603_return_while_expanded = { after_expand_chips: exp.chipCount, back: back2 };
        await page.screenshot({ path: `${OUT}/c29603-return-expanded.png` });
        out.checks.c29603_verdict = {
          collapsed_survived_return: back1.chipCount === 0,
          expanded_survived_return: back2.chipCount > 0,
          note: 'case scope is the Work Orders page only; steps name Customers / a work order as the away page'
        };
      }
    }

    // ---------- C29614 : filters remembered permanently ----------
    // Apply a filter by URL, confirm it sticks, then open a WHOLLY NEW CONTEXT
    // (same account, fresh browser storage) = the "closed the browser" step.
    await go('/workorders?tab=all&status=approved');
    await page.waitForTimeout(2000);
    const applied = await readBar(page);
    out.checks.c29614_applied = { url: applied.url, chips: applied.chips, rows: applied.rows };
    // step 1-2: move around the app and return WITHOUT the query string
    await go('/customers'); await go('/parts/inventory'); await go('/workorders');
    const afterNav = await readBar(page);
    out.checks.c29614_after_nav = { url: afterNav.url, chips: afterNav.chips, rows: afterNav.rows };
    await page.screenshot({ path: `${OUT}/c29614-after-nav.png` });
    // read the saved preference straight from the API as corroboration
    out.checks.c29614_pref = await page.evaluate(async () => {
      const r = await fetch('https://sv8785api.qa.shopview.com/api/users/me/preferences/work-orders-list', { credentials: 'include' });
      const t = await r.text();
      return { status: r.status, body: t.slice(0, 1500) };
    });
  } catch (e) { out.error = String(e).slice(0, 500); }

  out.api_4xx5xx = h.apiLog.filter(a => a.s >= 400);
  out.bridge_errors = h.bridgeErrors.length;
  out.finished_utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/fails-desktop.json`, JSON.stringify(out, null, 2));
  console.log(JSON.stringify({
    c29601: out.checks.c29601_verdict, c29603: out.checks.c29603_verdict,
    c29614_applied: out.checks.c29614_applied && out.checks.c29614_applied.chips,
    c29614_afternav_url: out.checks.c29614_after_nav && out.checks.c29614_after_nav.url,
    c29614_afternav_chips: out.checks.c29614_after_nav && out.checks.c29614_after_nav.chips,
    bridge: out.bridge_errors, err: out.error }, null, 2));
  await h.browser.close();
})();
