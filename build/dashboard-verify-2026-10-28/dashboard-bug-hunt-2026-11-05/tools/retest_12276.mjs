// SV-12276 retest (9 Nov 2026): each tile-linked report vs its tile, on Nov 3 and Nov 2, Staging Heavy Duty - 9919 (America/Edmonton),
// in Chromium 153 whose built-in rules still put Edmonton at UTC-7 after 1 Nov (the condition that caused the bug).
// Fix under test: shopview 1a211d8 (reports send the picked day as YYYY-MM-DD; the server works out the day).
import fs from 'fs';
import { boot, LOC, gotoDash, tile, sleep, openReport, reportState, finish, TILES } from './hb.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv12276-retest-2026-11-09';
const loc = LOC.HD; const { browser, ctx, page, rule99, app_version } = await boot(loc, { viewport: { width: 1920, height: 1080 } });
const ev = { app_version, utc_now: new Date().toISOString(), browser_local_now: await page.evaluate(() => new Date().toString()), runs: {} };
await gotoDash(page);
async function pickDay(k, d) {
  const trig = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`);
  await trig.click(); await sleep(800);
  const pre = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_preset_this-month"]`);
  if (await pre.count()) { await pre.click(); await sleep(3000); await trig.click(); await sleep(800); }
  const cal = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_calendar"]`);
  const nav = await cal.innerText().catch(() => '');
  await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(300);
  await cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(500);
  await page.locator(`[data-test-id="button_hero_range_${k}_apply"]`).click(); await sleep(5000);
  return nav.replace(/\s+/g, ' ').slice(0, 60);
}
for (const k of TILES) for (const d of [3, 2]) {
  const name = `${k}-nov${d}`;
  const calHead = await pickDay(k, d);
  const t = await tile(page, k);
  const box = await page.locator(`[data-test-id="hero_tile_${k}"]`).boundingBox();
  if (box) await page.screenshot({ path: `${OUT}/${name}-1-tile.png`, clip: { x: Math.max(0, box.x - 10), y: Math.max(0, box.y - 10), width: box.width + 20, height: box.height + 20 } });
  const reqs = []; const h = r => { const u = decodeURIComponent(r.url()); if (/sv11839api.*\/api\/(reporting|report)/.test(u)) reqs.push(u.replace(/^.*\/api/, '/api').slice(0, 320)); };
  ctx.on('request', h); const { p } = await openReport(ctx, page, k); await sleep(2000); ctx.off('request', h);
  const rs = await reportState(p);
  const rows = await p.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40));
  await p.evaluate(() => { const r = [...document.querySelectorAll('tr')].find(x => /^Totals?/.test(x.innerText.trim())); r?.scrollIntoView({ block: 'center' }); });
  await sleep(1200); await p.screenshot({ path: `${OUT}/${name}-2-report.png`, fullPage: true });
  ev.runs[name] = { cal_head: calHead, tile: t, report: { url: rs.url, chips: rs.chips.map(c => c.text), summary: rs.summaryRows, noData: rs.noData, rows }, report_requests: reqs,
    browser_built_instants: reqs.filter(u => /=\d{4}-\d\d-\d\dT[\d:.]+Z/.test(u)) };
  console.log(name, '| tile', t.value, '/', t.meta, '/', t.chip, '| report', rs.url.slice(0, 80), '| summary', JSON.stringify(rs.summaryRows).slice(0, 220), '| rows', rows.length, '| instants', ev.runs[name].browser_built_instants.length, '|', reqs.find(u => !/\/dashboard\//.test(u))?.slice(0, 200));
  await p.close();
}
ev.rule99 = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/evidence.json`, JSON.stringify(ev, null, 1));
console.log(app_version, 'rule99 all_match', ev.rule99.all_match, JSON.stringify(ev.rule99.offsets));
await browser.close();
