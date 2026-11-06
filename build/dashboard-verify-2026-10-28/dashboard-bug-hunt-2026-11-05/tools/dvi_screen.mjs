// Area 2 / 5.3 — DVI Test (Pacific/Fiji). Reads tiles for each requested range: Today, Yesterday-like single days, This Week, This Month.
// Usage: TZ=Pacific/Fiji node dvi_screen.mjs <label> <day,day,...>   (days of the CURRENT calendar month, picked as single-day custom ranges)
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, setRange, finish, TILES } from './hb.mjs';
const label = process.argv[2]; const days = (process.argv[3] || '').split(',').filter(Boolean).map(Number);
const loc = LOC.DVI; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports');
const ev = { app_version, label, browser_now: await page.evaluate(() => new Date().toString()), utc_now: new Date().toISOString(), reads: [] };
await gotoDash(page);
const K = ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer'];
const readAll = async name => { const r = { name, tiles: {} }; for (const k of K) r.tiles[k] = await tile(page, k); r.empty = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="hero_sparkline_empty_"]')].map(e => e.getAttribute('data-test-id'))); r.req = net.slice(-5).map(x => x.url.match(/from=[^&]+&to=[^&]+/)?.[0]); ev.reads.push(r); console.log(name, JSON.stringify(Object.fromEntries(Object.entries(r.tiles).map(([k, v]) => [k, [v.value, v.meta]]))), r.req.at(-1)); };
await readAll('default (This Month / L12M)'); await shot(page, 'area2-daybound', `${label}-default`, { fullPage: true });
// expanded empty-state check on Billing Efficiency (5.3)
await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(5000);
ev.be_expanded_text = await page.evaluate(() => document.querySelector('[data-test-id="hero_detail_panel"]')?.innerText?.replace(/\s+/g, ' ').slice(0, 300)); await shot(page, 'area2-daybound', `${label}-be-expanded`);
await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(1200);
for (const d of days) {
  for (const k of K) { await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(800);
    const cal = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_calendar"]`);
    await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(250); await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(300);
    await page.locator(`[data-test-id="button_hero_range_${k}_apply"]`).click(); await sleep(3500); }
  await readAll(`day ${d}`); await shot(page, 'area2-daybound', `${label}-day${d}`);
}
for (const p of ['This Week', 'This Month']) { for (const k of K) await setRange(page, k, p); await readAll(p); }
await shot(page, 'area2-daybound', `${label}-thismonth`);
ev.rule99 = await finish(page, loc, rule99); save('area2-daybound', `dvi-${label}`, ev); console.log(app_version, 'rule99', ev.rule99.all_match, ev.browser_now, ev.be_expanded_text?.slice(0, 120));
await browser.close();
