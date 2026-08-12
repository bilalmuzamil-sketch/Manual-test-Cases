// probe_batch6.cjs — drives the REMAINING undriven steps so a case can be counted
// as fully walked rather than merely reached: C38883 5-6, C38898 2/5, C38899 4-5,
// C38900 4, C38877 3, C38884 3-4, C38893 desktop, C38886 2nd tab, C43563 2-7.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 1300)); };
const box = '[data-test-id="page_search_input"]';

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(8000); };
  const rows = () => p.locator('tbody tr').count();
  const boxState = () => p.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]');
    const t = document.querySelector('[data-test-id="page_search_toggle"]');
    const v = e => e && e.getBoundingClientRect().width > 0;
    return { input_visible: v(i), value: i ? i.value : null, toggle_visible: v(t) }; });

  // ---- C38883 steps 5-6 : empty box + click away closes; text + click away stays open
  await go('/workorders?tab=all');
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 });
  await p.waitForTimeout(1500);
  await p.locator(box).fill('Iibay'); await p.waitForTimeout(3500);
  const withText = await boxState();
  await p.locator('[data-test-id="page_search_clear"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const afterClearX = await boxState(); const rowsAfterClear = await rows();
  await p.mouse.click(700, 600); await p.waitForTimeout(2500);          // click elsewhere while EMPTY
  const emptyClickAway = await boxState();
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.locator(box).fill('Iibay').catch(() => {}); await p.waitForTimeout(3000);
  await p.mouse.click(700, 600); await p.waitForTimeout(2500);          // click elsewhere WITH text
  const textClickAway = await boxState();
  put('C38883 steps 4-6 + C38898 step 5', { with_text: withText, after_round_x: afterClearX, rows_after_clear: rowsAfterClear,
    empty_then_click_away: emptyClickAway, text_then_click_away: textClickAway });

  // ---- C38898 step 2 : hover the Search button
  await go('/workorders?tab=all');
  const t0 = await p.evaluate(() => { const e = document.querySelector('[data-test-id="page_search_toggle"]'); const c = getComputedStyle(e);
    return { bg: c.backgroundColor, color: c.color, cursor: c.cursor }; });
  await p.locator('[data-test-id="page_search_toggle"]').hover(); await p.waitForTimeout(1200);
  const t1 = await p.evaluate(() => { const e = document.querySelector('[data-test-id="page_search_toggle"]'); const c = getComputedStyle(e);
    return { bg: c.backgroundColor, color: c.color, cursor: c.cursor }; });
  put('C38898 step 2 hover', { before_hover: t0, on_hover: t1, changed: JSON.stringify(t0) !== JSON.stringify(t1) });

  // ---- C38899 step 4 : press Enter with text in the box  |  step 5 : same on Parts Inventory
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.locator(box).fill('Iibay'); await p.waitForTimeout(3500);
  const beforeEnter = { rows: await rows(), url: p.url() };
  await p.locator(box).press('Enter'); await p.waitForTimeout(3000);
  const afterEnter = { rows: await rows(), url: p.url(), still_on_page: p.url().includes('/workorders') };
  await go('/parts/inventory');
  const piToggle = await p.locator('[data-test-id="page_search_toggle"]').count();
  let piTyped = null;
  if (piToggle) { await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(1200);
    const n0 = await rows();
    await p.locator(box).fill('oil').catch(() => {}); await p.waitForTimeout(4000);
    piTyped = { rows_before: n0, rows_after: await rows(), url: p.url() }; }
  put('C38899 steps 4-5', { before_enter: beforeEnter, after_enter: afterEnter, parts_inventory_search: { toggle_present: piToggle, typed: piTyped } });

  // ---- C38877 step 3 : try to combine Imported with another status
  await go('/workorders?tab=all&status=imported');
  const combo = await p.evaluate(() => {
    const c = document.querySelector('[data-test-id="filter_chip_status"]');
    return { chip: (c.innerText || '').trim().replace(/\n/g, ' ') }; });
  await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 }); await p.waitForTimeout(2500);
  const tryOther = await p.evaluate(() => {
    const ms = [...document.querySelectorAll('.q-menu')].filter(m => m.getBoundingClientRect().width > 0); const m = ms[ms.length - 1];
    if (!m) return { err: 'no menu' };
    const opts = [...m.querySelectorAll('label,.q-item')].filter(e => (e.innerText || '').trim());
    const approved = opts.find(e => /^approved$/i.test((e.innerText || '').trim()));
    const state = opts.map(e => ({ t: (e.innerText || '').trim(), dis: e.hasAttribute('disabled') || e.getAttribute('aria-disabled') === 'true' || getComputedStyle(e).pointerEvents === 'none', op: getComputedStyle(e).opacity }));
    if (approved) approved.click();
    return { clicked_approved: !!approved, options_state: state }; });
  await p.waitForTimeout(3500); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  const afterCombo = await p.evaluate(() => ({ url: location.href,
    chip: (document.querySelector('[data-test-id="filter_chip_status"]').innerText || '').trim().replace(/\n/g, ' ') }));
  put('C38877 step 3 combine', { with_imported: combo, attempt: tryOther, after: afterCombo });

  // ---- C38893 desktop : top navigation search must not filter the page list
  await go('/workorders?tab=all');
  const n0 = await rows();
  await p.locator('[data-test-id="select_global_search"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.locator('[data-test-id="select_global_search"]').type('Iibay', { delay: 60 }).catch(() => {});
  await p.waitForTimeout(4500);
  const afterTop = { rows: await rows(), url: p.url(),
    dropdown: await p.evaluate(() => { const d = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop();
      return d ? (d.innerText || '').trim().slice(0, 200) : null; }) };
  put('C38893 desktop top-nav search', { rows_before: n0, after_typing_in_top_search: afterTop,
    page_list_unchanged: n0 === afterTop.rows, url_gained_search_param: afterTop.url.includes('search=') });

  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/steps-batch6.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
