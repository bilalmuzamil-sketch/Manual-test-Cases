// Area 3.2 — Technician Utilization / Sales By Customer report: a Location choice made earlier on the report vs the tile's link.
import { boot, LOC, tile, shot, save, sleep, reportState, waitIdle, gotoDash, setRange, openReport, APP, finish } from './hb.mjs';
const loc = LOC.HD; const K = process.argv[2] || 'techUtilizationKpi'; const route = K === 'techUtilizationKpi' ? '/reports/technician-utilization' : '/reports/sales-by-customer';
const { browser, ctx, page, rule99, app_version } = await boot(loc); const ev = { app_version, K };
// 1. user opens the report from the Reports menu and picks a different location
await page.goto(APP + route, { waitUntil: 'domcontentloaded' }); await waitIdle(page);
ev.report_initial = await reportState(page);
const chip = page.locator('[data-test-id^="filter_chip_"]', { hasText: 'Location' }).first(); await chip.click(); await sleep(1200);
const menu = page.locator('.q-menu').last(); ev.menu_items = (await menu.innerText()).split('\n').filter(Boolean).slice(0, 20);
await shot(page, 'area3-locmem', `${K}-1-location-menu`);
await menu.getByText('Staging Lethbridge - 4310', { exact: true }).first().click(); await sleep(800);
await menu.getByText('Staging Heavy Duty - 9919', { exact: true }).first().click().catch(() => {}); await sleep(800);
await page.keyboard.press('Escape'); await waitIdle(page);
ev.report_after_pick = await reportState(page); await shot(page, 'area3-locmem', `${K}-2-report-lethbridge`);
// 2. user goes to the Dashboard (nav) on Heavy Duty and follows the tile link
await page.locator('[data-test-id="button_desktop_nav_link"]', { hasText: 'Dashboard' }).first().click();
await page.waitForSelector(`[data-test-id="hero_value_${K}"]`, { timeout: 90000 }); await sleep(5000);
await setRange(page, K, 'Last Quarter'); ev.tile = await tile(page, K);
await shot(page, 'area3-locmem', `${K}-3-dashboard-tile`);
const { p, newTab } = await openReport(ctx, page, K); ev.newTab = newTab;
ev.report_from_tile = await reportState(p); await shot(p, 'area3-locmem', `${K}-4-report-from-tile`);
// 3. restore: put the report's location back to Heavy Duty (remembered state left as found)
await page.goto(APP + route, { waitUntil: 'domcontentloaded' }); await waitIdle(page);
ev.report_reopen_menu = await reportState(page);
ev.rule99 = await finish(page, loc, rule99); save('area3-locmem', K, ev);
console.log(JSON.stringify({ menu: ev.menu_items, after: ev.report_after_pick.chips.map(c => c.text), tile: ev.tile, fromTile: ev.report_from_tile.url, fromTileChips: ev.report_from_tile.chips.map(c => c.text), fromTileSum: ev.report_from_tile.summaryRows, reopen: ev.report_reopen_menu.chips.map(c => c.text), r99: ev.rule99.all_match }));
await browser.close();
