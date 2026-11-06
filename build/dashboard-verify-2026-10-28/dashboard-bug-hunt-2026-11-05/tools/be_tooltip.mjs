// Candidate D2 check — S9-R5: Billing Efficiency chart tooltip shows the advisor's % AND ELR $. Grid-hover, keep shots where a tooltip appeared.
import { boot, LOC, gotoDash, shot, save, sleep, netlog, setRange, finish } from './hb.mjs';
const loc = LOC.HD; const preset = process.argv[2] || 'Last Quarter';
const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports'); const ev = { app_version, preset, found: [] };
await gotoDash(page); if (preset !== 'This Month') await setRange(page, 'billingEfficiencyKpi', preset);
await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(8000);
ev.data = net.map(r => r.body?.data?.invoicingEfficiencyByAdvisorSeries).filter(Boolean).at(-1);
const c = page.locator('[data-test-id="hero_detail_panel"] canvas').first(); const b = await c.boundingBox(); ev.box = b;
const clip = { x: b.x, y: b.y, width: b.width, height: b.height };
await page.mouse.move(b.x - 30, b.y - 30); await sleep(500); const base = await page.screenshot({ clip });
let n = 0;
for (let yi = 0.2; yi <= 0.85 && n < 6; yi += 0.13) for (let xi = 0.08; xi <= 0.95 && n < 6; xi += 0.07) {
  await page.mouse.move(b.x + b.width * xi, b.y + b.height * yi); await sleep(250);
  const s = await page.screenshot({ clip }); let diff = 0; for (let i = 0; i < Math.min(s.length, base.length); i += 97) if (s[i] !== base[i]) diff++;
  if (diff > 300) { n++; ev.found.push({ xi, yi, file: await shot(page, 'area5-be-tooltip', `hover-${preset.replace(/ /g, '')}-${n}`, { clip }) }); }
}
ev.rule99 = await finish(page, loc, rule99); save('area5-be-tooltip', `grid-${preset.replace(/ /g, '')}`, ev); console.log(app_version, ev.rule99.all_match, 'tooltips', ev.found.length); await browser.close();
