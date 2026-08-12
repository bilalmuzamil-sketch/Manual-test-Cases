// probe_batch7.cjs — converts partials to fully walked: C38877 step 3, C38884 steps 3-4,
// C38900 step 4, C43563 steps 2-7; and walks two never-walked cases, C38886 and C43560.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 1500)); };
const BOX = '[data-test-id="page_search_input"]';

// the menu reader that actually works: last VISIBLE menu, options are labels not q-items
const MENU = () => {
  const ms = [...document.querySelectorAll('.q-menu, .q-dialog__inner')].filter(m => m.getBoundingClientRect().width > 0);
  const m = ms[ms.length - 1];
  if (!m) return { found: false };
  return { found: true, options: [...m.querySelectorAll('label, .q-item, [role=option]')]
    .map(i => ({ t: (i.innerText || '').trim().slice(0, 40),
                 dis: i.hasAttribute('disabled') || i.getAttribute('aria-disabled') === 'true' || getComputedStyle(i).pointerEvents === 'none' || i.classList.contains('disabled'),
                 op: getComputedStyle(i).opacity,
                 chk: (() => { const c = i.querySelector('input[type=checkbox]'); return c ? c.checked : null; })() }))
    .filter(o => o.t) };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(8000); };
  const rows = () => p.locator('tbody tr').count();
  const chip = t => p.evaluate(t => { const e = document.querySelector(`[data-test-id="${t}"]`); return e ? (e.innerText || '').trim().replace(/\n/g, ' ') : null; }, t);

  // ===== C38877 step 3 : try to combine Imported with another status =====
  await go('/workorders?tab=all&status=imported');
  const impChip = await chip('filter_chip_status');
  await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 }); await p.waitForTimeout(2800);
  const menuWithImported = await p.evaluate(MENU);
  const tryApproved = await p.evaluate(() => {
    const ms = [...document.querySelectorAll('.q-menu,.q-dialog__inner')].filter(m => m.getBoundingClientRect().width > 0);
    const m = ms[ms.length - 1]; if (!m) return { err: 'no menu' };
    const el = [...m.querySelectorAll('label,.q-item')].find(e => /^approved$/i.test((e.innerText || '').trim()));
    if (!el) return { err: 'no Approved option', saw: [...m.querySelectorAll('label,.q-item')].map(e => (e.innerText || '').trim()).filter(Boolean) };
    const dis = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || getComputedStyle(el).pointerEvents === 'none';
    el.click(); return { clicked: true, was_disabled: dis, opacity: getComputedStyle(el).opacity };
  });
  await p.waitForTimeout(4000);
  const menuAfterBoth = await p.evaluate(MENU);
  await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  put('C38877 step 3 (combine)', { chip_with_imported: impChip,
    menu_readable: menuWithImported.found,
    options_while_imported_on: menuWithImported.options,
    approved_attempt: tryApproved,
    options_after_attempt: menuAfterBoth.options,
    url_after: p.url(), chip_after: await chip('filter_chip_status'), rows_after: await rows() });

  // ===== C38884 steps 3-4 : clear ONLY the search, then clear ONLY the filter =====
  await go('/workorders?tab=all&status=approved');
  const s1 = { url: p.url(), rows: await rows(), chip: await chip('filter_chip_status') };
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1400);
  await p.locator(BOX).fill('a'); await p.waitForTimeout(4000);
  const s2 = { url: p.url(), rows: await rows(), chip: await chip('filter_chip_status') };
  await p.locator('[data-test-id="page_search_clear"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(3500);
  const s3 = { url: p.url(), rows: await rows(), chip: await chip('filter_chip_status'),
               note: 'cleared ONLY the search - the filter should survive' };
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.locator(BOX).fill('a').catch(() => {}); await p.waitForTimeout(3500);
  const cfCount = await p.locator('[data-test-id="clear_filters"]').count();
  if (cfCount) { await p.locator('[data-test-id="clear_filters"]').first().click().catch(() => {}); }
  await p.waitForTimeout(4000);
  const s4 = { url: p.url(), rows: await rows(), chip: await chip('filter_chip_status'),
               search_value: await p.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]'); return i ? i.value : null; }),
               note: 'cleared ONLY the filters - the typed word should survive' };
  put('C38884 steps 1-4 + C38900 step 4', { filter_only: s1, filter_plus_search: s2, after_clearing_search_only: s3, after_clearing_filters_only: s4 });

  // ===== C38886 : the typed search stays in THIS tab only =====
  await go('/workorders?tab=all');
  await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1200);
  await p.locator(BOX).fill('Iibay'); await p.waitForTimeout(4000);
  const tabA = { url: p.url(), rows: await rows() };
  const p2 = await h.ctx.newPage();                       // SECOND TAB, same identity, same context
  await p2.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p2.waitForTimeout(9000);
  const tabB = await p2.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]');
    const t = document.querySelector('[data-test-id="page_search_toggle"]');
    return { url: location.href, search_box_present: !!i, search_value: i ? i.value : null,
             toggle_collapsed: !!t && !i, rows: document.querySelectorAll('tbody tr').length }; });
  // step 3: go elsewhere in tab A and come back
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {}); await p.waitForTimeout(5000);
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(8000);
  const tabAReturn = await p.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]');
    return { url: location.href, search_value: i ? i.value : null, rows: document.querySelectorAll('tbody tr').length }; });
  await p2.close();
  put('C38886 second tab + return', { tab_A_with_search: tabA, tab_B_fresh: tabB, tab_A_after_leaving_and_returning: tabAReturn });

  // ===== C43560 : two browsers, same person, last save wins =====
  const hB = await makeHarness('admin');                  // separate context = separate browser
  const pB = hB.page;
  await go('/workorders?tab=all');
  await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 }); await p.waitForTimeout(2500);
  const setA = await p.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')].filter(m => m.getBoundingClientRect().width > 0);
    const m = ms[ms.length - 1]; const el = [...m.querySelectorAll('label,.q-item')].find(e => /^approved$/i.test((e.innerText || '').trim()));
    if (el) { el.click(); return true; } return false; });
  await p.waitForTimeout(4000); await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
  const aState = { url: p.url(), chip: await chip('filter_chip_status') };
  await pB.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 }); await pB.waitForTimeout(9000);
  await pB.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 }); await pB.waitForTimeout(2500);
  const setB = await pB.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')].filter(m => m.getBoundingClientRect().width > 0);
    const m = ms[ms.length - 1];
    const clear = [...m.querySelectorAll('label,.q-item')].find(e => /clear selection/i.test((e.innerText || '').trim()));
    if (clear) clear.click();
    return true; });
  await pB.waitForTimeout(2500);
  await pB.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 }).catch(() => {}); await pB.waitForTimeout(2000);
  await pB.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')].filter(m => m.getBoundingClientRect().width > 0);
    const m = ms[ms.length - 1]; const el = [...m.querySelectorAll('label,.q-item')].find(e => /^estimate$/i.test((e.innerText || '').trim()));
    if (el) el.click(); });
  await pB.waitForTimeout(4500); await pB.keyboard.press('Escape'); await pB.waitForTimeout(3000);
  const bState = { url: pB.url(), chip: await pB.evaluate(() => (document.querySelector('[data-test-id="filter_chip_status"]').innerText || '').trim().replace(/\n/g, ' ')) };
  // reload A
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000);
  const aAfterReload = { url: p.url(), chip: await chip('filter_chip_status'), rows: await rows() };
  put('C43560 two browsers, last save wins', { A_set_approved: setA, A_state: aState, B_set_estimate: setB, B_state: bState, A_after_reload: aAfterReload });
  await hB.browser.close();

  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/steps-batch7.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length);
  await h.browser.close();
})();
