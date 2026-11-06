// Area 5.4 — S9-R3 (clipped value shows its true value on hover) + S9-R5 (Billing Efficiency tooltip = % and ELR) + S9-R10 (legend hover).
import { boot, LOC, gotoDash, shot, save, sleep, netlog, setRange, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports'); const ev = { app_version, shots: [] };
await gotoDash(page);
await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(7000);
ev.be_data = net.map(r => r.body?.data?.invoicingEfficiencyByAdvisorSeries).filter(Boolean).at(-1);
let c = page.locator('[data-test-id="hero_detail_panel"] canvas').first(); let b = await c.boundingBox(); ev.be_box = b;
const clip = { x: b.x - 10, y: b.y - 10, width: b.width + 20, height: b.height + 20 };
for (const f of [0.52, 0.56, 0.6, 0.64, 0.68]) { await page.mouse.move(b.x + b.width * f, b.y + b.height * 0.06); await sleep(600); ev.shots.push(await shot(page, 'area5', `5.4-be-hover-${Math.round(f * 100)}`, { clip })); }
await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(1500);
await setRange(page, 'techEfficiencyKpi', 'Last 12 Months'); await page.locator('[data-test-id="btn_toggle_details_techEfficiencyKpi"]').click(); await sleep(8000);
ev.te_data = net.map(r => r.body?.data?.techEfficiencyByTechSeries).filter(Boolean).at(-1);
c = page.locator('[data-test-id="hero_detail_panel"] canvas').first(); b = await c.boundingBox(); ev.te_box = b;
// legend is drawn on the canvas top: sweep the first legend row
const clip2 = { x: b.x - 10, y: b.y - 10, width: b.width + 20, height: Math.min(b.height + 20, 420) };
for (const f of [0.3, 0.42]) { await page.mouse.move(b.x + b.width * f, b.y + 12); await sleep(800); ev.shots.push(await shot(page, 'area5', `5.4-te-legend-${Math.round(f * 100)}`, { clip: clip2 })); }
ev.rule99 = await finish(page, loc, rule99); save('area5', 'tooltip3-HD', ev); console.log(app_version, ev.rule99.all_match, JSON.stringify(ev.be_data).slice(0, 400)); await browser.close();
