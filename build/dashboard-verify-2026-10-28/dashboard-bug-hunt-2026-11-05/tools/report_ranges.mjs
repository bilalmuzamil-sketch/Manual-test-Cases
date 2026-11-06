// Part 4 — which tile-linked reports build their day range in the BROWSER (start_date=...T...Z) vs send plain dates.
// Opens each tile's report link on a Custom single day and on Last Quarter, and logs every reporting/dashboard request.
import { boot, LOC, gotoDash, save, sleep, setRange, openReport, finish, TILES } from './hb.mjs';
const loc = LOC.HD; const { browser, ctx, page, rule99, app_version } = await boot(loc); const ev = { app_version, r: {} };
await gotoDash(page);
for (const [mode, prep] of [['last-quarter', async k => setRange(page, k, 'Last Quarter')], ['custom-day-4', async k => { await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(800); const cal = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_calendar"]`); if (k === 'salesByCustomer') { await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_preset_this-month"]`).click(); await sleep(3000); await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(800); } await cal.locator('button').filter({ hasText: /^4$/ }).first().click(); await sleep(250); await cal.locator('button').filter({ hasText: /^4$/ }).first().click(); await sleep(300); await page.locator(`[data-test-id="button_hero_range_${k}_apply"]`).click(); await sleep(3500); }]]) {
  for (const k of TILES) {
    await prep(k);
    const reqs = []; const h = r => { const u = decodeURIComponent(r.url()); if (/sv11839api.*\/api\/(reporting|dashboard|report)/.test(u)) reqs.push(u.replace(/^.*\/api/, '/api').slice(0, 300)); };
    ctx.on('request', h); const { p } = await openReport(ctx, page, k); await sleep(2000); ctx.off('request', h);
    const browserInstants = reqs.filter(u => /(start_date|end_date|from|to|startDate|endDate)=\d{4}-\d\d-\d\dT[\d:.]+Z/.test(u));
    ev.r[`${mode}:${k}`] = { report: p.url().replace(/^https:\/\/[^/]+/, ''), requests: reqs, uses_browser_built_instants: browserInstants.length > 0, examples: browserInstants.slice(0, 2) };
    console.log(mode, k, p.url().replace(/^https:\/\/[^/]+/, '').slice(0, 90), '| browser instants:', browserInstants.length > 0, browserInstants[0]?.slice(0, 200) || reqs.filter(u => !u.includes('/dashboard/'))[0]?.slice(0, 200));
    await p.close();
  }
}
ev.rule99 = await finish(page, loc, rule99); save('part4-report-ranges', 'report-ranges', ev); console.log(app_version, ev.rule99.all_match, JSON.stringify(ev.rule99.offsets)); await browser.close();
