// sv11829.mjs — SV-11829: expanded Billing Efficiency chart/table when its load fails. Heavy Duty, TZ=America/Edmonton. SECRET-FREE.
// Failure is produced the way the ticket did it: the browser blocks the /api/dashboard/reports request that carries
// billingEfficiencyKpi (Playwright page.route → abort), AFTER the dashboard has loaded This Month normally.
import { boot, finish, shot, save, sleep, LOC, APP } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11829'; const k = 'billingEfficiencyKpi';
const { browser, page, rule99, app_version } = await boot(loc);
const log = []; page.on('requestfailed', r => { if (r.url().includes('/api/dashboard/reports')) log.push({ failed: decodeURIComponent(r.url()).replace(/^.*\/api/, '/api'), why: r.failure()?.errorText }); });
let toasts = []; page.on('console', m => { if (m.type() === 'error') log.push({ console_error: m.text().slice(0, 200) }); });
await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector(`[data-test-id="hero_value_${k}"]`, { timeout: 90000 }); await sleep(6000);
const trig = () => page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`);
const popup = () => page.locator('.date-range-popup').last();
const panel = () => page.locator('[data-test-id="hero_detail_panel"]').first();
const state = async () => ({
  tile_chip: (await trig().innerText().catch(() => '')).replace(/\n/g, ' '), tile_value: await page.locator(`[data-test-id="hero_value_${k}"]`).innerText().catch(() => null),
  tile_error: await page.locator(`[data-test-id="hero_error_${k}"]`).innerText().catch(() => null),
  panel_text: (await panel().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600),
  panel_has_chart: await panel().locator('canvas, svg.apexcharts-svg').count(), panel_table_rows: await panel().locator('tbody tr').count(),
  panel_couldnt_load: (await panel().innerText().catch(() => '')).match(/Couldn.?t load[^\n]*/gi), panel_no_data: /No data for selected date range/i.test(await panel().innerText().catch(() => '')),
  other_tiles_errors: await page.locator('[data-test-id^="hero_error_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id'))),
  toasts: await page.locator('.q-notification').allInnerTexts().catch(() => []) });
const pick = async label => { await trig().click(); await sleep(900); await popup().locator('.preset-option').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`, 'i') }).first().click(); await sleep(400); if (await popup().isVisible().catch(() => false)) await popup().getByRole('button', { name: 'Apply' }).click().catch(() => {}); await sleep(6000); };
const out = {};
await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(6000);
out.before_block_this_month = await state(); out.pic0 = await shot(page, T, '0-expanded-this-month-loaded', { fullPage: true });
await page.route(u => u.href.includes('/api/dashboard/reports') && u.href.includes(k), r => r.abort('failed'));
out.blocking = 'page.route abort of /api/dashboard/reports requests whose address contains billingEfficiencyKpi';
await pick('Last Month'); out.caseA_last_month = await state(); out.picA = await shot(page, T, 'A-last-month-request-blocked', { fullPage: true });
await pick('This Month'); out.caseB_back_to_this_month = await state(); out.picB = await shot(page, T, 'B-this-month-request-blocked', { fullPage: true });
await page.unroute(u => true).catch(() => {}); await page.unrouteAll?.().catch(() => {});
out.request_log = log;
// element boxes for annotation (CSS px)
out.boxes = { panel: await panel().boundingBox().catch(() => null), tile: await page.locator(`[data-test-id="hero_tile_${k}"]`).boundingBox().catch(() => null) };
await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await sleep(6000);
const r99 = await finish(page, loc, rule99);
save(T, { ticket: T, app_version, location: loc.name, rule99: r99, observed_at_utc: new Date().toISOString(), result: out });
for (const c of ['before_block_this_month', 'caseA_last_month', 'caseB_back_to_this_month']) { const s = out[c]; console.log(c, JSON.stringify({ chip: s.tile_chip, val: s.tile_value, err: s.tile_error, chart: s.panel_has_chart, rows: s.panel_table_rows, couldnt: s.panel_couldnt_load, nodata: s.panel_no_data, others: s.other_tiles_errors, toasts: s.toasts })); }
console.log('failed requests', log.filter(l => l.failed).length, 'RULE99', r99.all_match);
await browser.close();
