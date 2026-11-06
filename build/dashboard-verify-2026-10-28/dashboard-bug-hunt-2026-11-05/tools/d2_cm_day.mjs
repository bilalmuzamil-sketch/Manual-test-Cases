// D2 — Revenue tile vs Sales report on one custom day (Nov 3) at Heavy Duty (Edmonton): credit memo CM11839-4189,
// date_created 2026-11-03 06:00:00 UTC = 23:00 Nov 2 Edmonton. S3-R1 / S3-N1: tile and report must never disagree.
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, openReport, reportState, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, ctx, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/');
const ev = { app_version, browser_local_now: await page.evaluate(() => new Date().toString()), runs: {} };
await gotoDash(page);
const k = 'revenueKpi';
for (const [a, b, name] of [[3, 3, 'nov3'], [2, 2, 'nov2']]) {
  await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(1000);
  const cal = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_calendar"]`);
  await cal.locator('button').filter({ hasText: new RegExp(`^${a}$`) }).first().click(); await sleep(400);
  await cal.locator('button').filter({ hasText: new RegExp(`^${b}$`) }).first().click(); await sleep(600);
  await page.locator(`[data-test-id="button_hero_range_${k}_apply"]`).click(); await sleep(5000);
  const t = await tile(page, k); await shot(page, 'D2-cm-day', `${name}-1-tile`, { clip: { x: 0, y: 0, width: 1920, height: 380 } });
  const n0 = net.length; const { p } = await openReport(ctx, page, k);
  const rs = await reportState(p);
  const rows = await p.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40));
  const apis = net.slice(n0).filter(r => r.url.includes('/reporting/sales')).map(r => r.url.replace(/^https:\/\/[^/]+/, ''));
  await p.evaluate(() => { const r = [...document.querySelectorAll('tr')].find(x => /^Totals/.test(x.innerText.trim())); r?.scrollIntoView({ block: 'center' }); });
  await sleep(1500); await shot(p, 'D2-cm-day', `${name}-2-report`, { fullPage: true });
  ev.runs[name] = { picked: [a, b], tile: t, report: { url: rs.url, chips: rs.chips.map(c => c.text), summary: rs.summaryRows, rows, sales_api: apis } };
  console.log(name, JSON.stringify(t), '|', rs.summaryRows, '|', rows.length, 'rows', rows.filter(x => /CM/.test(x)), apis.slice(-1));
  await p.close();
}
ev.rule99 = await finish(page, loc, rule99); save('D2-cm-day', 'evidence', ev); console.log(app_version, 'rule99', ev.rule99.all_match, ev.browser_local_now);
await browser.close();
