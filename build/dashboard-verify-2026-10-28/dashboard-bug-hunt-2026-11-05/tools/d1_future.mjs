// D1 reproduction — a custom range that ends after today: does the Dashboard chart stop at today (S4-R11c, S7-E1, S11-R8)?
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, openReport, reportState, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, ctx, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports');
const A = Number(process.argv[2] || 3), B = Number(process.argv[3] || 20); const ev = { app_version, browser_local_now: await page.evaluate(() => new Date().toString()), picked: [A, B], tiles: {} };
await gotoDash(page);
for (const k of ['revenueKpi', 'techUtilizationKpi']) {
  const n0 = net.length; await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(1000);
  const cal = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_calendar"]`);
  await cal.locator('button').filter({ hasText: new RegExp(`^${A}$`) }).first().click(); await sleep(400);
  await cal.locator('button').filter({ hasText: new RegExp(`^${B}$`) }).first().click(); await sleep(600);
  const ind = (await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_range_indicator"]`).innerText()).trim();
  await shot(page, 'D1-future-custom-range', `${k}-1-picker`);
  await page.locator(`[data-test-id="button_hero_range_${k}_apply"]`).click(); await sleep(5000);
  const resp = net.slice(n0).map(r => ({ url: r.url, data: r.body?.data }));
  await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(6000);
  await shot(page, 'D1-future-custom-range', `${k}-2-tile-and-expanded`);
  const { p } = await openReport(ctx, page, k); const rs = await reportState(p);
  await shot(p, 'D1-future-custom-range', `${k}-3-report-from-tile-link`);
  ev.tiles[k] = { range_indicator: ind, tile: await tile(page, k), responses: resp, report: { url: rs.url, chips: rs.chips.map(c => c.text), summary: rs.summaryRows } };
  console.log(k, ind, JSON.stringify(ev.tiles[k].tile), rs.url, JSON.stringify(resp.map(r => ({ from: r.data?.from, to: r.data?.to, group: r.data?.group, spark: (r.data?.revenueKpi || r.data?.techUtilizationKpi)?.sparkline?.length }))));
  await p.close(); await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(1500);
}
ev.rule99 = await finish(page, loc, rule99); save('D1-future-custom-range', 'evidence', ev); console.log(app_version, 'rule99', ev.rule99.all_match, ev.browser_local_now);
await browser.close();
