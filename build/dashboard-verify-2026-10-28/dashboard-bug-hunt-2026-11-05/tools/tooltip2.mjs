// Area 5.4 — canvas tooltips: hover a known bar/point and photograph the tooltip (Chart draws tooltips on the canvas).
import { boot, LOC, gotoDash, shot, save, sleep, netlog, setRange, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const ev = { app_version, hovers: [] };
await gotoDash(page);
await setRange(page, 'revenueKpi', 'Last Quarter'); await page.locator('[data-test-id="btn_toggle_details_revenueKpi"]').click(); await sleep(7000);
const c = page.locator('[data-test-id="hero_detail_panel"] canvas').first(); const b = await c.boundingBox(); ev.box = b;
// find the bar for bucket 5 (2026-07-29) by scanning for the tallest bar column via pixel probing is overkill: hover a sweep and keep 3 shots
for (const f of [0.08, 0.36, 0.62]) { await page.mouse.move(b.x + b.width * f, b.y + b.height * 0.75); await sleep(700);
  const p = await shot(page, 'area5', `5.4-revenue-hover-${Math.round(f * 100)}`, { clip: { x: b.x - 20, y: b.y - 20, width: b.width + 40, height: b.height + 40 } }); ev.hovers.push({ f, p }); }
ev.rule99 = await finish(page, loc, rule99); save('area5', 'tooltip2-HD', ev); console.log(app_version, ev.rule99.all_match, JSON.stringify(b)); await browser.close();
