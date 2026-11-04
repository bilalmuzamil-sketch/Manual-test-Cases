// sv11826.mjs — SV-11826: Technician Utilization tile vs its report's Summary row, by the ticket's steps
// (tile range → tile's report link → Summary row), at Staging Heavy Duty - 9919. TZ=America/Edmonton. SECRET-FREE.
// Ranges: Last 12 Months (the ticket's own), plus Custom 32 days and Custom 366 days ending today (where the
// coordinator's API read on 4 Nov showed a 0.02–0.04 h gap).
import { boot, finish, shot, save, sleep, LOC, APP } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11826'; const k = 'techUtilizationKpi';
const { browser, page, rule99, app_version } = await boot(loc);
const dash = []; page.on('response', async r => { if (r.url().includes('/api/dashboard/reports') && r.url().includes(k)) { try { dash.push({ url: decodeURIComponent(r.url()).replace(/^.*\/api/, '/api'), body: await r.json() }); } catch {} } });
const goDash = async () => { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector(`[data-test-id="hero_value_${k}"]`, { timeout: 90000 }); await sleep(6000); };
const trig = () => page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`);
const popup = () => page.locator('.date-range-popup').last();
const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
async function gotoMonth(y, m) { const want = y * 12 + m;
  for (let i = 0; i < 48; i++) { const t = (await popup().locator('.q-date__navigation').innerText()).replace(/\s+/g, ' ');
    const cur = +(t.match(/\b(20\d\d)\b/)[1]) * 12 + M.indexOf(M.find(x => t.includes(x))); if (cur === want) return;
    await popup().locator('.q-date__navigation .q-date__arrow button').nth(cur > want ? 0 : 1).click(); await sleep(300); } }
const clickDay = async d => { await popup().locator('.q-date__calendar-item--in button').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await sleep(400); };
async function setRange(spec) {
  await trig().click(); await sleep(900);
  if (spec.preset) await popup().locator('.preset-option').filter({ hasText: spec.preset }).first().click();
  else { await gotoMonth(spec.from[0], spec.from[1]); await clickDay(spec.from[2]); await gotoMonth(spec.to[0], spec.to[1]); await clickDay(spec.to[2]); }
  await sleep(500); const pend = await popup().locator('.selected-range').innerText().catch(() => null); const rng = await popup().locator('[data-test-id$="_range_indicator"]').innerText().catch(() => null);
  if (await popup().count() && await popup().isVisible()) await popup().getByRole('button', { name: 'Apply' }).click().catch(() => {});
  await sleep(6000); return { pending_header: pend, range_indicator: rng };
}
const out = { ranges: [] };
const SETS = { today: [{ tag: 'last-12-months', preset: /last 12 months/i }, { tag: 'custom-32-days', from: [2026, 9, 4], to: [2026, 10, 4] }, { tag: 'custom-366-days', from: [2025, 10, 4], to: [2026, 10, 4] }],
  past: [{ tag: 'past-last-year', preset: /^\s*last year\s*$/i }, { tag: 'past-custom-32-days', from: [2026, 8, 1], to: [2026, 9, 2] }, { tag: 'past-custom-366-days', from: [2025, 9, 31], to: [2026, 9, 31] }] };
const SET = process.env.SET || 'today';
for (const spec of SETS[SET]) {
  await goDash(); const n0 = dash.length;
  const picker = await setRange(spec);
  const tile = { chip: (await trig().innerText()).replace(/\n/g, ' '), value: await page.locator(`[data-test-id="hero_value_${k}"]`).innerText(), meta: await page.locator(`[data-test-id="hero_meta_${k}"]`).innerText(), at_utc: new Date().toISOString() };
  const tilePic = await shot(page, T, `${spec.tag}-1-tile`, { clip: { x: 0, y: 0, width: 1600, height: 520 } });
  const srv = dash.slice(n0).map(d => ({ url: d.url, techUtilizationKpi: d.body?.data?.techUtilizationKpi }));
  const link = page.locator(`[data-test-id="link_report_${k}"]`).first();
  const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click()]);
  const t = p2 || page; const rep = [];
  t.on('response', async r => { if (/technician-utilization/.test(r.url()) && r.url().includes('/api/')) { try { rep.push({ url: decodeURIComponent(r.url()).replace(/^.*\/api/, '/api'), body: await r.json() }); } catch {} } });
  await t.waitForLoadState('domcontentloaded').catch(() => {}); await sleep(14000);
  const summary = await t.evaluate(() => [...document.querySelectorAll('tr')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(s => /^Summary/.test(s)));
  const dateLine = (await t.locator('main').innerText().catch(() => '')).split('\n').filter(l => /^Date|Date:/.test(l)).slice(0, 2);
  const repPic = await shot(t, T, `${spec.tag}-2-report-summary`, { fullPage: false });
  const repSrv = rep.filter(x => !/daily/.test(x.url)).map(x => { const d = x.body?.data || x.body || {}; return { url: x.url, summary: d.summary ?? d.totals ?? d.meta?.summary ?? null, top_keys: Object.keys(d).slice(0, 12) }; });
  out.ranges.push({ range: spec.tag, picker, tile, tile_server: srv, report: { landed: t.url().replace(APP, ''), date_line: dateLine, summary_row: summary, at_utc: new Date().toISOString(), server: repSrv }, pictures: [tilePic, repPic] });
  console.log(spec.tag, '| tile', tile.value, tile.meta, '| report', summary.join(' / '), '|', dateLine.join(' '), '| picker', JSON.stringify(picker));
  if (p2) await p2.close(); else { await page.goBack().catch(() => {}); }
}
await goDash(); const r99 = await finish(page, loc, rule99);
save(T + (SET === 'today' ? '' : '/' + SET), { ticket: T, set: SET, app_version, location: loc.name, rule99: r99, observed_at_utc: new Date().toISOString(), result: out });
console.log('RULE99', r99.all_match, app_version); await browser.close();
