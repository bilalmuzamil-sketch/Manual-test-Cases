// Area 2 part 2 — after Fiji midnight: Revenue tile on a single day -> its Sales report (new tab): which invoices and which date each row shows.
import { boot, LOC, gotoDash, tile, shot, save, sleep, openReport, reportState, finish } from './hb.mjs';
const days = (process.argv[2] || '6,7').split(',').map(Number); const loc = LOC[process.argv[3] || 'DVI'];
const { browser, ctx, page, rule99, app_version } = await boot(loc); const ev = { app_version, utc_now: new Date().toISOString(), browser_now: await page.evaluate(() => new Date().toString()), r: {} };
await gotoDash(page);
for (const d of days) {
  await page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_trigger"]').click(); await sleep(800);
  const cal = page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_calendar"]');
  await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(250); await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(300);
  await page.locator('[data-test-id="button_hero_range_revenueKpi_apply"]').click(); await sleep(4000);
  const t = await tile(page, 'revenueKpi'); await shot(page, process.argv[4] || 'area2-daybound', `${process.argv[5] || 'p2'}-tile-day${d}`);
  const { p } = await openReport(ctx, page, 'revenueKpi'); const rs = await reportState(p);
  const rows = await p.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => [...r.querySelectorAll('td')].map(td => td.innerText.trim()).slice(0, 3)).filter(r => r.length > 1));
  await shot(p, process.argv[4] || 'area2-daybound', `${process.argv[5] || 'p2'}-sales-report-day${d}`); await p.close();
  ev.r[d] = { tile: t, report_url: rs.url, report_chips: rs.chips.map(c => c.text), rows, totals: rs.summaryRows };
  console.log('day', d, JSON.stringify(t), rs.url, JSON.stringify(rows), JSON.stringify(rs.summaryRows));
}
ev.rule99 = await finish(page, loc, rule99); save(process.argv[4] || 'area2-daybound', process.argv[5] || 'dvi-p2-drill', ev); console.log(app_version, ev.rule99.all_match, ev.browser_now); await browser.close();
