// Read every tile on This Week and Last Week (location's own day), plus the Revenue tile's linked Sales report for each. Rule 99 recorded. Env: OUT, LOCK, TAG.
import fs from 'fs';
import { boot, LOC, gotoDash, tile, sleep, setRange, finish, TILES, openReport, reportState } from './hb.mjs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true }); const TAG = process.env.TAG || 'presets';
const loc = LOC[process.env.LOCK || 'TL']; const { browser, ctx, page, rule99, app_version } = await boot(loc, { viewport: { width: 1920, height: 1080 } });
const ev = { app_version, utc_now: new Date().toISOString(), browser_local_now: await page.evaluate(() => new Date().toString()), r: {}, rev_report: {} };
await gotoDash(page);
for (const preset of ['This Week', 'Last Week']) {
  for (const k of TILES) { await setRange(page, k, preset); ev.r[`${preset}:${k}`] = await tile(page, k); }
  await page.screenshot({ path: `${OUT}/${TAG}-${preset.replace(' ', '')}.png`, clip: { x: 0, y: 60, width: 1920, height: 600 } });
  const reqs = []; const h = r => { const u = decodeURIComponent(r.url()); if (/sv11839api.*\/api\/reporting\/sales/.test(u)) reqs.push(u.replace(/^.*\/api/, '/api')); };
  ctx.on('request', h); const { p } = await openReport(ctx, page, 'revenueKpi'); await sleep(1500); ctx.off('request', h);
  const rs = await reportState(p); const rows = await p.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(x => /17606|CM-4199|Totals/.test(x)));
  await p.screenshot({ path: `${OUT}/${TAG}-${preset.replace(' ', '')}-sales-report.png`, fullPage: true });
  ev.rev_report[preset] = { url: rs.url, chips: rs.chips.map(c => c.text), summary: rs.summaryRows, rows_of_interest: rows, requests: reqs.slice(0, 3) }; await p.close();
  console.log(preset, JSON.stringify(Object.fromEntries(TILES.map(k => [k, [ev.r[`${preset}:${k}`].value, ev.r[`${preset}:${k}`].meta, ev.r[`${preset}:${k}`].chip]]))));
  console.log('  Sales report:', JSON.stringify(ev.rev_report[preset]).slice(0, 600));
}
ev.rule99 = await finish(page, loc, rule99); fs.writeFileSync(`${OUT}/${TAG}.json`, JSON.stringify(ev, null, 1));
console.log(app_version, ev.utc_now, ev.browser_local_now, 'rule99', ev.rule99.all_match, JSON.stringify(ev.rule99.offsets)); await browser.close();
