// probe_batch3.cjs — redo of C38877 (Imported) and C38896 (Back to my view) with a
// ROBUST menu reader.  The batch2 attempt read an EMPTY stale .q-menu and so never
// ticked Imported at all; its chip readings were a harness artefact and are discarded.
//
// Fix: take the last VISIBLE, NON-EMPTY menu, and assert the menu was actually read
// before clicking anything.  Every step records whether it truly happened.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 2000)); };

// last menu that is VISIBLE and has items — not merely the last in the DOM
const MENU = () => {
  const ms = [...document.querySelectorAll('.q-menu, .q-dialog__inner')].filter(m => {
    const r = m.getBoundingClientRect(), cs = getComputedStyle(m);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
        && m.querySelectorAll('.q-item, [role=option]').length > 0;
  });
  const m = ms[ms.length - 1];
  if (!m) return { found: false, total_menus_in_dom: document.querySelectorAll('.q-menu').length };
  return { found: true, items: [...m.querySelectorAll('.q-item, [role=option]')].map(i => {
    const cs = getComputedStyle(i);
    return { t: (i.innerText || '').trim().slice(0, 60),
             disabled: i.hasAttribute('disabled') || i.getAttribute('aria-disabled') === 'true' || i.classList.contains('disabled') || cs.pointerEvents === 'none',
             opacity: cs.opacity,
             checked: !!i.querySelector('input:checked, .q-checkbox--checked, [aria-checked="true"]') };
  }) };
};
const CHIPS = () => {
  const one = t => { const e = document.querySelector(`[data-test-id="${t}"]`); if (!e) return null;
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    return { painted: (e.innerText || '').trim().replace(/\n/g, ' ').slice(0, 60),
             disabled: e.hasAttribute('disabled') || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled'),
             opacity: cs.opacity, pointer: cs.pointerEvents, visible: r.width > 0 }; };
  return { status: one('filter_chip_status'), customer: one('filter_chip_company_id'), tech: one('filter_chip_tech_assigned_id'),
           advisor: one('filter_chip_service_advisor_id'), asset: one('filter_chip_vehicleHere') };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000); };
  const openChip = async tid => {
    await p.locator(`[data-test-id="${tid}"]`).scrollIntoViewIfNeeded().catch(() => {});
    await p.locator(`[data-test-id="${tid}"]`).click({ timeout: 8000 });
    await p.waitForTimeout(2500);
    return p.evaluate(MENU);
  };

  // ================= C38877 : Imported =================
  await go('/workorders?tab=all');
  const chipsBefore = await p.evaluate(CHIPS);
  const rowsBefore = await p.locator('tbody tr').count();
  const menu1 = await openChip('filter_chip_status');
  // CONTROL: the menu must be non-empty before any conclusion is drawn
  const clicked = menu1.found ? await p.evaluate(() => {
    const ms = [...document.querySelectorAll('.q-menu, .q-dialog__inner')].filter(m => {
      const r = m.getBoundingClientRect(); return r.width > 0 && m.querySelectorAll('.q-item').length > 0; });
    const m = ms[ms.length - 1];
    const it = [...m.querySelectorAll('.q-item')].find(i => /^imported$/i.test((i.innerText || '').trim()));
    if (!it) return { ok: false, saw: [...m.querySelectorAll('.q-item')].map(i => i.innerText.trim()) };
    it.click(); return { ok: true, label: (it.innerText || '').trim() };
  }) : { ok: false, reason: 'menu never opened' };
  await p.waitForTimeout(4000);
  const menuAfter = await p.evaluate(MENU);          // other statuses now disabled?
  await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  const chipsAfter = await p.evaluate(CHIPS);
  const urlAfter = p.url();
  const rowsAfter = await p.locator('tbody tr').count();
  await p.screenshot({ path: `${OUT}/c38877-imported-ticked.png` }).catch(() => {});
  // untick
  const menu2 = await openChip('filter_chip_status');
  const unticked = menu2.found ? await p.evaluate(() => {
    const ms = [...document.querySelectorAll('.q-menu')].filter(m => m.getBoundingClientRect().width > 0 && m.querySelectorAll('.q-item').length);
    const m = ms[ms.length - 1];
    const it = [...m.querySelectorAll('.q-item')].find(i => /^imported$/i.test((i.innerText || '').trim()));
    if (it) { it.click(); return true; } return false; }) : false;
  await p.waitForTimeout(3500); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  const chipsRestored = await p.evaluate(CHIPS);
  put('C38877 Imported (robust)', {
    menu_opened_and_readable: menu1.found,
    status_options: menu1.found ? menu1.items.map(i => i.t) : menu1,
    imported_click: clicked,
    url_after: urlAfter, rows_before: rowsBefore, rows_after: rowsAfter,
    other_statuses_after_imported: menuAfter.found ? menuAfter.items.map(i => ({ t: i.t, disabled: i.disabled, opacity: i.opacity })) : menuAfter,
    chips_before: chipsBefore, chips_with_imported: chipsAfter,
    unticked_ok: unticked, chips_after_untick: chipsRestored
  });

  // ================= C38896 : is 'Back To My Saved Filters' on your OWN view? =================
  // The batch2 reading arrived at /workorders?tab=all — a URL WITH a query string, which
  // may itself be what the app treats as a shared-link visit.  Test three arrivals.
  const backState = async () => p.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const e = document.querySelector('[data-test-id="back_to_saved_filters"]');
    return { present_in_dom: !!e, visible: e ? vis(e) : false,
             painted: e ? (e.innerText || '').trim().replace(/\n/g, ' ') : null,
             opacity: e ? getComputedStyle(e).opacity : null, url: location.href };
  });
  // (a) plain /workorders, no query at all
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000);
  const arrivalPlain = await backState();
  // (b) in-app navigation: go elsewhere, then click the Work Orders nav link
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {}); await p.waitForTimeout(6000);
  await p.locator('[data-test-id="button_desktop_nav_link"]:has-text("Work Orders")').first().click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(8000);
  const arrivalInApp = await backState();
  // (c) a URL carrying an explicit filter — the shared-link shape
  await p.goto(APP + '/workorders?tab=all&status=approved', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000);
  const arrivalShared = await backState();
  await p.screenshot({ path: `${OUT}/c38896-shared-link.png` }).catch(() => {});
  put('C38896 back-to-my-view by arrival route', {
    a_plain_workorders: arrivalPlain, b_in_app_nav_click: arrivalInApp, c_url_with_filter: arrivalShared,
    NOTE: 'the control is only meaningfully ABSENT if it is present in at least one arrival - which proves the check can fail'
  });

  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/steps-batch3.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
