// Area 8 — read every tile on TODAY (calendar "Today" button) at Heavy Duty after each money step. Usage: node money_screen.mjs <label>
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, finish } from './hb.mjs';
const label = process.argv[2]; const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports');
await gotoDash(page); const ev = { app_version, label, tiles: {} };
for (const k of ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'salesByCustomer']) {
  await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(900);
  await page.locator(`[data-test-id="button_hero_range_${k}_today"]`).click(); await sleep(500);
  const ap = page.locator(`[data-test-id="button_hero_range_${k}_apply"]`); if (await ap.isVisible().catch(() => false)) await ap.click(); await sleep(4500);
  ev.tiles[k] = await tile(page, k);
}
ev.tiles.atRiskHero = await tile(page, 'atRiskHero');
ev.server = net.slice(-4).map(r => ({ url: r.url.slice(0, 160), data: r.body?.data && Object.fromEntries(Object.entries(r.body.data).filter(([k]) => /Kpi|topCustomers/.test(k)).map(([k, v]) => [k, k === 'topCustomers' ? { count: v?.count ?? v?.total ?? (v?.customers || []).length } : v])) }));
await shot(page, 'area8-money', label, { fullPage: false });
ev.rule99 = await finish(page, loc, rule99); save('area8-money', label, ev);
console.log(label, app_version, ev.rule99.all_match, JSON.stringify(Object.fromEntries(Object.entries(ev.tiles).map(([k, v]) => [k, [v.value, v.meta, v.chip?.replace(/event |expand_more/g, '')]]))));
await browser.close();
