// Area 3.5 (S11-R8 report chart ends today) + 3.6 (S11-E1 show/hide remembered per report) + 3.3 (tile tech filter -> report, record only).
import { boot, LOC, tile, shot, save, sleep, reportState, waitIdle, gotoDash, setRange, openReport, APP, finish } from './hb.mjs';
const loc = LOC[process.argv[2] || 'HD']; const preset = process.argv[3] || 'This Month';
const { browser, ctx, page, rule99, app_version } = await boot(loc); const ev = { app_version, preset, today_local: new Date().toString(), r: {} };
const labels = p => p.evaluate(() => [...document.querySelectorAll('svg text, svg tspan')].map(e => e.textContent.trim()).filter(x => /^[A-Z][a-z]{2} \d{1,2}(, \d{4})?$|^\d{1,2} [A-Z][a-z]{2}|^[A-Z][a-z]{2} \d{4}$/.test(x)));
await gotoDash(page);
for (const k of ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi']) {
  await setRange(page, k, preset);
  // dashboard expanded chart labels
  await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(6000);
  const dashLabels = [...new Set(await labels(page))];
  await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(1500);
  const { p } = await openReport(ctx, page, k);
  const rs = await reportState(p); const repLabels = [...new Set(await labels(p))];
  await shot(p, 'area3-chartend', `${k}-${preset.replace(/ /g, '')}`);
  ev.r[k] = { tile: await tile(page, k), report_url: rs.url, report_chips: rs.chips.map(c => c.text), dash_expanded_labels: dashLabels, report_chart_labels: repLabels, chartButtons: rs.chartButtons };
  console.log(k, 'dash', dashLabels.slice(-3), '| report', repLabels.slice(-3), rs.chartButtons);
  await p.close();
}
// 3.6 show/hide memory on the Sales report
let p = await ctx.newPage(); await p.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded' }); await waitIdle(p);
const btn = () => p.locator('button', { hasText: /Hide Chart|Show Chart/ }).first();
ev.s36 = { start: (await btn().innerText()).trim() };
await btn().click(); await sleep(2000); ev.s36.afterClick = (await btn().innerText()).trim();
await p.close(); p = await ctx.newPage(); await p.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded' }); await waitIdle(p);
ev.s36.newVisit = (await btn().innerText()).trim(); ev.s36.otherReport = null;
const q = await ctx.newPage(); await q.goto(APP + '/reports/technician-efficiency', { waitUntil: 'domcontentloaded' }); await waitIdle(q);
ev.s36.otherReport = (await q.locator('button', { hasText: /Hide Chart|Show Chart/ }).first().innerText()).trim(); await q.close();
await shot(p, 'area3-chartend', 'sales-after-revisit');
if (/Show Chart/.test(ev.s36.newVisit)) { await btn().click(); await sleep(1500); } ev.s36.restored = (await btn().innerText()).trim();
console.log('3.6', JSON.stringify(ev.s36));
ev.rule99 = await finish(page, loc, rule99); save('area3-chartend', `${loc.name.replace(/[^A-Za-z]+/g, '').slice(0, 12)}-${preset.replace(/ /g, '')}`, ev);
console.log(app_version, 'rule99', ev.rule99.all_match); await browser.close();
