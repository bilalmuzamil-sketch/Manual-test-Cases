// Step 2 (fresh defaults): open ONE screen in a brand-new browser context and record every control's default, the
// URL, local storage before/after, and the requests the page sent. Usage: TZ=<zone> node f1inv.mjs <LOC> <route> <label>
import { fresh, finish, details } from './f1lib.mjs';
const [locKey, route, label] = process.argv.slice(2);
const c = await fresh(locKey, label);
c.setPhase('fresh-default');
await c.go(route, route === '/dashboard' ? 4000 : 14000);
const out = {};
if (route === '/dashboard') {
  await c.page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }).catch(() => {}); await c.page.waitForTimeout(8000);
  out.tiles = await c.page.locator('[data-test-id^="date-range-selector_hero_range_"][data-test-id$="_trigger"]').evaluateAll(es => es.map(e => [e.getAttribute('data-test-id').replace('date-range-selector_hero_range_', '').replace('_trigger', ''), e.innerText.replace(/\s+/g, ' ').trim()]));
  out.page_controls = await c.controls();
  for (const k of ['techEfficiencyKpi', 'techUtilizationKpi', 'topCustomers', 'invoicesKpi']) {
    const b = c.page.locator(`[data-test-id="btn_toggle_details_${k}"]`);
    if (!(await b.count())) { out['details_' + k] = 'no View details button'; continue; }
    c.setPhase('details-' + k); const d = await details(c, k); out['details_' + k] = { controls: d.controls, first_rows: d.rows.slice(0, 3), n_rows: d.rows.length };
    await c.page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click().catch(() => {}); await c.page.waitForTimeout(2000);
  }
} else {
  out.controls = await c.controls();
  const chip = c.page.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]').first();
  if (await chip.count()) { await chip.click(); await c.page.waitForTimeout(1500);
    out.range_menu = (await c.page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 500);
    await c.page.keyboard.press('Escape'); await c.page.waitForTimeout(1000); }
  out.first_rows = (await c.rows('tbody tr', 3));
}
const r = await finish(c, out);
console.log(JSON.stringify({ label, v: r.meta.appVersion, zones: [r.meta.browser_zone, r.meta.process_zone, r.meta.app_timezone_key], url: r.meta.url_at_end,
  ls_end: Object.keys(r.meta.storage_at_end || {}), out: JSON.stringify(out).slice(0, 2500), reqs: r.requests.map(x => x.phase + ' ' + x.status + ' ' + x.url.slice(0, 230)).slice(0, 14) }, null, 1));
