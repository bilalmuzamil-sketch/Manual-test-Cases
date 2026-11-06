// Area 3.1/3.5/3.6 — each tile's report link on a data-bearing preset: same preset, same figure, chart ends today.
import { boot, LOC, tile, shot, save, sleep, reportState, waitIdle, gotoDash, setRange, openReport, bodyText, TILES, finish } from './hb.mjs';
const loc = LOC[process.argv[2] || 'HD']; const preset = process.argv[3] || 'Last Quarter';
const { browser, ctx, page, rule99, app_version } = await boot(loc);
await gotoDash(page); const res = {};
for (const k of TILES) {
  await setRange(page, k, preset); const t = await tile(page, k);
  const { p, newTab } = await openReport(ctx, page, k);
  const rs = await reportState(p); const txt = await bodyText(p, 2500);
  await shot(p, 'area3-drill', `${loc.name.replace(/[^A-Za-z]+/g, '').slice(0, 12)}-${k}-${preset.replace(/ /g, '')}`);
  res[k] = { tile: t, newTab, report: rs, reportText: txt };
  if (p !== page) await p.close();
  console.log(k, JSON.stringify(t), '->', rs.url, JSON.stringify(rs.chips.map(c => c.text)), JSON.stringify(rs.summaryRows).slice(0, 300));
}
const r99 = await finish(page, loc, rule99);
save('area3-drill', `${loc.name.replace(/[^A-Za-z]+/g, '').slice(0, 12)}-${preset.replace(/ /g, '')}`, { app_version, rule99: r99, preset, res });
console.log(app_version, 'rule99', r99.all_match); await browser.close();
