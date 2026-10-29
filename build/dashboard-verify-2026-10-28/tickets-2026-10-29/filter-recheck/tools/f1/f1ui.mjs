// Worker F1 screen runs (filter recheck + Amendment 1, 29 Oct 2026). One FRESH browser context per mode; inside it:
// (ii) fresh defaults FIRST (nothing touched), then (i) the ticket's own filters, then (iii) every non-subject filter
// deselected / widest date. Requests per phase, controls per phase, storage before/after. SECRET-FREE.
// Usage: TZ=<zone> node f1ui.mjs <MODE>
import { fresh, finish, details, tile, tileRange, reportPreset } from './f1lib.mjs';
const mode = process.argv[2];
const LOCOF = { P11: 'DVI', P14: 'DVI', C1: 'DVI', A4: 'DVI', A5DVI: 'DVI', P12: 'LETH', P13: 'HD', A1: 'HD', A2: 'HD', A5HD: 'HD', P11R: 'DVI', P12R: 'LETH', P13R: 'HD', P14R: 'DVI' };
const c = await fresh(LOCOF[mode], 'ui-' + mode, { downloads: /^A5/.test(mode) });
const { page, txt, box } = c; const out = { runs: {} };
const rowOf = (rows, re) => rows.filter(r => re.test(r.join(' | '))).map(r => r.join(' | '));
const WIDEST_TILE = 'last-12-months';
const clearChips = async (except = /range|dateRange|asOf/i) => { const done = [];
  for (let k = 0; k < 8; k++) { const ids = await page.locator('[data-test-id^="filter_chip_clear_"]').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-test-id')));
    const id = ids.find(i => !except.test(i) && !done.includes(i)); if (!id) break; done.push(id);
    await page.locator(`[data-test-id="${id}"]`).first().click().catch(() => {}); await page.waitForTimeout(5000); }
  return done; };
// Widen a Location chip to EVERY location (clearing it only resets it to the active location).
const allLocations = async () => { const chip = page.locator('[data-test-id="filter_chip_locationIds"], [data-test-id="filter_chip_locations"], [data-test-id="filter_chip_location"]').first();
  if (!(await chip.count())) return 'no location chip';
  await chip.click(); await page.waitForTimeout(2500); const m = page.locator('.q-menu').last();
  const before = (await m.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 300);
  const all = m.getByText(/^\s*(Select all|All locations)\s*$/i);
  if (await all.count()) { await all.first().click(); await page.waitForTimeout(1500); } else {
    const items = m.locator('.q-item'); const n = await items.count();
    for (let i = 0; i < n; i++) { const it = items.nth(i); const cb = it.locator('[role="checkbox"], .q-checkbox').first();
      const on = await cb.getAttribute('aria-checked').catch(() => null); if (on !== 'true') { await it.click().catch(() => {}); await page.waitForTimeout(1500); } } }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000);
  return { menu_before: before, chip_after: (await chip.innerText().catch(() => '')).replace(/\s+/g, ' ').trim() }; };
async function dash(key, target, phases) {
  c.setPhase('ii-fresh-default'); await c.go('/dashboard', 4000);
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }).catch(() => {}); await page.waitForTimeout(8000);
  out.page_controls = await c.controls();
  const run = async name => { let d = await details(c, key, name === 'ii');
    if (phases.sort && !d.rows.some(r => target.test(r.join(' | ')))) { const th = page.locator('[data-test-id="hero_detail_panel"] thead th').filter({ hasText: phases.sort }).first();
      for (let k = 0; k < 2 && !d.rows.some(r => target.test(r.join(' | '))); k++) { await th.click(); await page.waitForTimeout(3000); d = await details(c, key, false); } } out.runs[name] = { tile: await tile(c, key), detail_controls: d.controls?.chips?.map(x => x.id + '=' + x.text), heads: d.controls?.heads, target: rowOf(d.rows, target), n_rows: d.rows.length }; };
  await run('ii');
  c.setPhase('i-ticket-filters'); out.runs.i_range = await tileRange(c, key, phases.i); await run('i');
  c.setPhase('iii-widest'); out.runs.iii_range = await tileRange(c, key, { preset: WIDEST_TILE }); await run('iii');
  const row = page.locator('[data-test-id="hero_detail_panel"] tr').filter({ hasText: phases.name }).first(); out.iii_row_count = await row.count(); await row.scrollIntoViewIfNeeded().catch(() => {});
  await page.evaluate(() => window.scrollBy(0, -250)); await page.waitForTimeout(1500);
  await c.shot('iii', { tile: await box(page.locator(`[data-test-id="hero_tile_${key}"]`)), value: await box(page.locator(`[data-test-id="hero_value_${key}"]`)), meta: await box(page.locator(`[data-test-id="hero_meta_${key}"]`)),
    range: await box(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)), row: await box(row), row_text: await txt(row),
    chip: await box(page.locator('[data-test-id="hero_detail_panel"] [data-test-id^="filter_chip_"]').first()) });
}
// Reports: expand a parent row (technician / rep / customer) and read its child rows
async function expandRow(re) { const r = page.locator('tbody tr').filter({ hasText: re }).first(); if (!(await r.count())) return 'parent row not found';
  const b = r.locator('[data-test-id^="toggle_row_btn_"], [data-test-id^="button_sbr_expand_rep_"], [data-test-id^="button_sbc_expand"], button').first(); await b.click().catch(() => {}); await page.waitForTimeout(8000); return 'expanded'; }
async function report(route, { i, iii, parent, child, chipName = 'filter_chip_range', presetPrefix = 'filter_preset_range_', sortHead, shotRe }) {
  c.setPhase('ii-fresh-default'); await c.go(route, 14000);
  const read = async name => { out.runs[name] = { controls: (await c.controls()).chips.filter(x => /filter_chip_|tab_|toggle_column/.test(x.id)).map(x => x.id + '=' + x.text + (x.checked ? `[${x.checked}]` : '')) };
    if (sortHead) { const th = page.locator('thead th').filter({ hasText: sortHead }).first(); const firstRow = async () => (await c.rows('tbody tr', 3)).map(r => r.join(' | ')).find(x => x.trim());
      await th.click(); await page.waitForTimeout(5000); out.runs[name].sorted_first_after_1_click = await firstRow(); }
    if (parent) out.runs[name].expand = await expandRow(parent);
    const rows = await c.rows('tbody tr', 600); out.runs[name].target = rowOf(rows, child); out.runs[name].parent_row = rowOf(rows, parent || /^$/).slice(0, 2); out.runs[name].n_rows = rows.length;
    out.runs[name].footer = await txt(page.locator('tfoot').first()); };
  await read('ii');
  c.setPhase('i-ticket-filters'); await c.go(route, 14000); out.runs.i_presets = await reportPreset(c, i); await read('i');
  c.setPhase('iii-deselected'); await c.go(route, 14000); out.runs.iii_cleared = await clearChips(); out.runs.iii_presets = await reportPreset(c, iii);
  out.runs.iii_cleared2 = await clearChips(); out.runs.iii_locations = await allLocations(); await read('iii');
  const row = page.locator('tbody tr').filter({ hasText: shotRe || child }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await page.evaluate(() => window.scrollBy(0, -200)); await page.waitForTimeout(1200);
  await c.shot('iii', { row: await box(row), row_text: await txt(row), chips: await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.filter(e => e.getBoundingClientRect().width > 0 && !/clear/.test(e.getAttribute('data-test-id'))).map(e => { const b = e.getBoundingClientRect(); return { id: e.getAttribute('data-test-id'), text: e.innerText.replace(/\s+/g, ' ').trim(), box: { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) } }; })) });
}
// WIP (Heavy Duty): customer filter + tabs + columns
async function wip({ customer, tab, wo, days, columns }) {
  const tabs = () => page.locator('[data-test-id="page_work_in_progress_report"] .q-tab');
  const pick = async name => { await page.getByText('Customer: All customers').first().click(); await page.waitForTimeout(2500); const m = page.locator('.q-menu').last(); const inp = m.locator('input').first();
    if (await inp.count()) { await inp.fill(name); await page.waitForTimeout(4000); } await m.getByText(name, { exact: true }).first().click(); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(8000); };
  const cols = async () => { const b = page.locator('[data-test-id="button_column_selection"]').first(); await b.click(); await page.waitForTimeout(2000); const m = page.locator('.q-menu').last();
    const before = await m.locator('[data-test-id^="toggle_column_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id').replace('toggle_column_', '') + '=' + e.getAttribute('aria-checked')));
    for (const k of columns || []) { const t = m.locator(`[data-test-id="toggle_column_${k}"]`); if (await t.count() && (await t.getAttribute('aria-checked')) !== 'true') { await t.click(); await page.waitForTimeout(1200); } }
    await page.keyboard.press('Escape'); await page.waitForTimeout(3000); return before; };
  const find = async () => { const tbl = page.locator('[data-test-id="table_work_in_progress_report"]'); let rows = await c.rows('[data-test-id="table_work_in_progress_report"] tbody tr', 200);
    const re = wo ? new RegExp(wo) : /\b1 days\b/; let pages = 0;
    for (; pages < 40 && !rows.some(r => re.test(r.join(' '))); pages++) { const nx = page.locator('.q-table__bottom button').filter({ hasText: /chevron_right|navigate_next/ }).first();
      if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await page.waitForTimeout(4000); rows = await c.rows('[data-test-id="table_work_in_progress_report"] tbody tr', 200); }
    const heads = (await page.locator('[data-test-id="table_work_in_progress_report"] thead th').allInnerTexts()).map(h => h.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim());
    return { heads, pages_walked: pages, hits: rowOf(rows, re), days_values: [...new Set(rows.map(r => r[heads.findIndex(h => /Days Open/.test(h))]))].slice(0, 12), bottom: await txt(page.locator('.q-table__bottom')) }; };
  const sortDays = async () => { if (!days) return; const th = page.locator('[data-test-id="table_work_in_progress_report"] thead th').filter({ hasText: 'Days Open' }).first(); await th.click(); await page.waitForTimeout(6000); };
  const perTab = async (name, tabRe) => { out.runs[name] = { controls: (await c.controls()).chips.filter(x => /filter_chip_|as_of|date/.test(x.id)).map(x => x.id + '=' + x.text + (x.value ? ` <${x.value}>` : '')), tabs: await tabs().allInnerTexts() , per_tab: {} };
    const n = await tabs().count();
    for (let i = 0; i < n; i++) { const t = (await tabs().nth(i).innerText()).replace(/\s+/g, ' ').trim(); if (tabRe && !tabRe.test(t)) continue; await tabs().nth(i).click(); await page.waitForTimeout(8000); await sortDays(); out.runs[name].per_tab[t] = await find(); } };
  c.setPhase('ii-fresh-default'); await c.go('/reports/work-in-progress', 15000);
  out.runs.ii_active_tab = (await page.locator('[data-test-id="page_work_in_progress_report"] .q-tab--active').allInnerTexts()).join('|');
  out.runs.ii_columns_default = await cols(); await perTab('ii', null);
  c.setPhase('i-ticket-filters'); await c.go('/reports/work-in-progress', 15000); await pick(customer); if (columns) await cols(); await perTab('i', new RegExp(tab, 'i'));
  c.setPhase('iii-deselected'); await c.go('/reports/work-in-progress', 15000); out.runs.iii_cleared = await clearChips(/asOf|as_of|date/i); if (columns) await cols(); await perTab('iii', null);
  // replacement picture: no customer, the tab that holds the example, sorted
  const tt = tabs().filter({ hasText: tab }).first(); await tt.click(); await page.waitForTimeout(8000); await sortDays(); await find();
  const row = page.locator('[data-test-id="table_work_in_progress_report"] tbody tr').filter({ hasText: wo ? new RegExp(wo) : /\b1 days\b/ }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await page.evaluate(() => window.scrollBy(0, -150)); await page.waitForTimeout(1200);
  const heads = (await page.locator('[data-test-id="table_work_in_progress_report"] thead th').allInnerTexts()).map(h => h.replace(/\s+/g, ' ').trim());
  const cells = []; for (let i = 0; i < await row.locator('td').count(); i++) cells.push({ h: heads[i], t: (await row.locator('td').nth(i).innerText()).trim(), box: await box(row.locator('td').nth(i)) });
  await c.shot('iii', { row: await box(row), cells, tab: await box(tt), chip: await box(page.getByText('Customer: All customers').first()), asof: await box(page.locator('[data-test-id*="as_of"], [data-test-id*="asOf"]').first()) });
}

if (mode === 'P11') await dash('techEfficiencyKpi', /Fabian Bonjean/, { name: 'Fabian Bonjean', i: { days: [25, 28] } });
if (mode === 'P12') await dash('techEfficiencyKpi', /Joseph Nelson/, { name: 'Joseph Nelson', i: { days: [25, 25], back: 2 } });
if (mode === 'P13') await dash('techUtilizationKpi', /QA Technician|0\.00 \| 0\.00 \| 0\.00/, { name: 'QA Technician', sort: 'Total Hours', i: { preset: 'this-month' } });
if (mode === 'P14') await dash('salesByCustomer', /ZZAUTOTEST Dash Q27/, { name: 'ZZAUTOTEST Dash Q27', i: { preset: 'this-week' } });
if (mode === 'P11R') await report('/reports/technician-efficiency', { i: 'this_week', iii: 'last_12_months', parent: /Fabian Bonjean/, child: /S1-38198/ });
if (mode === 'P12R') await report('/reports/technician-efficiency', { i: 'last_quarter', iii: 'last_12_months', parent: /Joseph Nelson/, child: /S3-17383/ });
if (mode === 'P13R') await report('/reports/technician-utilization', { i: 'this_month', iii: 'last_12_months', child: /QA Technician|Nebojsa/, sortHead: 'Total Hours', chipName: 'filter_chip_dateRange', presetPrefix: 'filter_preset_dateRange_' });
if (mode === 'P14R') await report('/reports/sales-by-customer', { i: 'this_week', iii: 'last_12_months', parent: /ZZAUTOTEST Dash Q27/, child: /ZZAUTOTEST Dash Q27|S1-38215/, chipName: 'filter_chip_dateRange', presetPrefix: 'filter_preset_dateRange_' });
if (mode === 'C1') await report('/reports/sales-by-representative', { i: 'this_month', iii: 'last_12_months', parent: /Viktoria Videnovic/, child: /S1-38217/, chipName: 'filter_chip_dateRange', presetPrefix: 'filter_preset_dateRange_' });
if (mode === 'A1') await wip({ customer: '4 Star Truck Repair', tab: 'Partially', days: true });
if (mode === 'A2') await wip({ customer: '4 Star Truck Repair', tab: 'Not Started', wo: 'S2-33740', columns: ['parts_earned', 'parts_remaining'] });

// ---- A4: a running timesheet made ON SCREEN (ticket's own steps, ZZAUTOTEST work order S1-38220), then Shop Efficiency ----
const P2A = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/tools/p2a/modes.mjs';
async function seRead(name, preset) {
  c.setPhase(name + '-shop-efficiency'); await c.go('/reports/shop-billing-efficiency', 12000); out.runs[name + '_se_preset'] = preset ? await reportPreset(c, preset) : 'default (untouched)';
  out.runs[name + '_se'] = { controls: (await c.controls()).chips.filter(x => /filter_chip_/.test(x.id)).map(x => x.id + '=' + x.text), heads: (await c.controls()).heads, rows: (await c.rows('tbody tr', 60)).map(r => r.join(' | ')).filter(x => x.trim()) };
  c.setPhase(name + '-timesheets'); await c.go('/reports/punch-clock-activities', 12000); if (preset) await reportPreset(c, preset);
  out.runs[name + '_ta'] = { chip: await txt(page.locator('[data-test-id="filter_chip_range"]')), running: (await c.rows('tbody tr', 200)).map(r => r.join(' | ')).filter(x => /S1-38220/.test(x) && /Active|--|^$/.test(x) || /ZZAUTOTEST F1 running/.test(x)),
    totals: (await c.rows('tbody tr', 400)).map(r => r.join(' | ')).filter(x => /Total/.test(x)), footer: await txt(page.locator('tfoot').first()), bottom: await txt(page.locator('.q-table__bottom').first()) };
}
if (mode === 'A4') {
  const M = await import(P2A);
  const fmt = d => d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/,(?= \d{2}:)/, '');
  c.setPhase('create'); await c.go('/reports/punch-clock-activities', 10000);
  const st = new Date(Date.now() - 40 * 60000); st.setSeconds(0, 0); out.start_wanted = fmt(st);
  await M.newTimesheet({ ...c, shot: async () => {} }, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: out.start_wanted, end: '', shotName: null });
  out.created_posts = c.meta.posts; out.created_at_utc = new Date().toISOString();
  await seRead('ii', null);           // fresh default (This month)
  await seRead('i', 'today');         // the ticket's Today
  await seRead('iii', 'this_year');   // widest the report offers (no Last 12 months on this report)
  c.setPhase('picture'); await c.go('/reports/shop-billing-efficiency', 12000);
  const tot = page.locator('tbody tr').filter({ hasText: 'Totals' }).first();
  await c.shot('iii-default', { totals: await box(tot), totals_text: await txt(tot), chip: await box(page.locator('[data-test-id="filter_chip_range"]')), chip_text: await txt(page.locator('[data-test-id="filter_chip_range"]')),
    clocked_head: await box(page.locator('thead th').filter({ hasText: 'Clocked' }).first()) });
  c.setPhase('picture-ta'); await c.go('/reports/punch-clock-activities', 12000);
  const rr = page.locator('tbody tr').filter({ hasText: 'S1-38220' }).first();
  await c.shot('iii-ta-default', { running: await box(rr), running_text: await txt(rr), chip: await box(page.locator('[data-test-id="filter_chip_range"]')), chip_text: await txt(page.locator('[data-test-id="filter_chip_range"]')) });
}
// ---- A5 (held draft): Export Reports -> Payroll Timesheet, three ways ----
async function payroll(name, opts, who, day) {
  const M = await import('./f1export.mjs'); c.setPhase(name); await c.go('/reports/punch-clock-activities', 10000);
  const cc = { ...c, OUT: '/tmp/cln/f1/dl', shot: async () => {} };
  let f; try { f = await M.exportPayroll(cc, opts); } catch (e) { out.runs[name] = { error: String(e).slice(0, 300), dialog: c.meta.export_dialog }; return; }
  const fs = await import('fs'); const txtf = fs.readFileSync(f, 'utf8'); const lines = txtf.trim().split('\n');
  let cur = null; const mine = []; let over = 0;
  for (const l of lines.slice(1)) { const r = l.split(','); if (r[0] && !r[0].startsWith('Total for')) cur = r[0]; if (r[1] && parseFloat(r[2]) > 24) over++; if (cur === who && (r[1] === day || r[0] === 'Total for ' + who)) mine.push(l); }
  out.runs[name] = { opts, dialog: c.meta.export_dialog, file: f.split('/').pop(), header: lines[0], rows: lines.length - 1, days_over_24_all_staff: over, target: mine };
}
if (mode === 'A5HD') {
  await payroll('ii-default', { range: null }, 'Haley Brown', '2026-09-06');
  await payroll('i-ticket', { range: 'Custom', from: '09/01/2026', to: '09/30/2026' }, 'Haley Brown', '2026-09-06');
  await payroll('iii-widest', { range: 'Custom', from: '01/01/2026', to: '10/29/2026' }, 'Haley Brown', '2026-09-06');
}
if (mode === 'A5DVI') {
  await payroll('ii-default', { range: null }, 'Admin Shopview', '2026-10-28');
  await payroll('i-ticket', { range: 'Custom', from: '10/28/2026', to: '10/28/2026' }, 'Admin Shopview', '2026-10-28');
  await payroll('iii-widest', { range: 'Custom', from: '01/01/2026', to: '10/29/2026' }, 'Admin Shopview', '2026-10-28');
}
const r = await finish(c, out);
console.log(JSON.stringify({ mode, v: r.meta.appVersion, zones: [r.meta.browser_zone, r.meta.process_zone, r.meta.app_timezone_key, r.meta.location_tz] }));
