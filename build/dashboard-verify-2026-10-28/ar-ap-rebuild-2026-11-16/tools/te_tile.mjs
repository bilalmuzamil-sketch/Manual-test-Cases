// Item 3 (16 Nov): Dashboard Technician Efficiency tile vs the Technician Efficiency report, today's build, zones matched (Rule 99).
// F2 (28 Oct) = SV-11931 "Dashboard - Technician Efficiency counts a line the customer declined" (filed 29 Oct after Chris's answer
// to DQ-1: "(b) Only billed lines count ... Defect."). Per location: for every dashboard preset + the F2 window (25-28 Oct), read the
// tile (GET /api/dashboard/reports techEfficiencyKpi + techPerformance) and IMMEDIATELY the report for the same days
// (/api/reporting/technician-efficiency/custom + /expanded/custom per technician), then observe both on screen at Last 12 Months.
// Usage: TZ=<zone> node te_tile.mjs HD|LE|QB|DVI    Raw -> /tmp/cln/arap/te/<KEY>/ ; facts -> evidence/te-<KEY>.json. SECRET-FREE.
import fs from 'fs';
import { boot, LOC, APP, sleep, rule99, save } from '../../report-gaps-2026-11-16/tools/sboot.mjs';
const KEY = process.argv[2]; const loc = LOC[KEY]; const EV = new URL('../evidence/', import.meta.url).pathname; const RAW = `/tmp/cln/arap/te/${KEY}/`; fs.mkdirSync(RAW, { recursive: true });
const API = 'https://api.staging.shopview.com/api';
const { browser, page } = await boot(loc, { viewport: { width: 1920, height: 1080 } }); const out = { start: await rule99(page, loc), ranges: {}, screen: {} };
const get = p => page.evaluate(async ([A, p]) => { for (let i = 0; i < 3; i++) { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); if (r.status < 500) return { s: r.status, j: await r.json().catch(() => null) }; await new Promise(z => setTimeout(z, 1500)); } return { s: 599 }; }, [API, p]);
const ymd = d => d.toISOString().slice(0, 10); const D = (y, m, d) => new Date(Date.UTC(y, m, d));
const todayS = new Intl.DateTimeFormat('en-CA', { timeZone: loc.tz }).format(new Date()); const [ty, tm, td] = todayS.split('-').map(Number); const T = D(ty, tm - 1, td);
const add = (d, n) => new Date(d.getTime() + n * 86400000); const first = D(ty, tm - 1, 1); const q0 = D(ty, 3 * Math.floor((tm - 1) / 3), 1);
const lqEnd = add(q0, -1); const lq0 = D(lqEnd.getUTCFullYear(), 3 * Math.floor(lqEnd.getUTCMonth() / 3), 1); const lmEnd = add(first, -1); const wk0 = add(T, -T.getUTCDay());
const R = { last_12_months: [D(tm <= 11 ? ty - 1 : ty, (tm - 12 + 12) % 12, 1), T], this_year: [D(ty, 0, 1), T], last_year: [D(ty - 1, 0, 1), D(ty - 1, 11, 31)], this_quarter: [q0, T], last_quarter: [lq0, lqEnd],
  this_month: [first, T], last_month: [D(lmEnd.getUTCFullYear(), lmEnd.getUTCMonth(), 1), lmEnd], this_week: [wk0, T], last_week: [add(wk0, -7), add(wk0, -1)], f2_window_25_28_oct: [D(2026, 9, 25), D(2026, 9, 28)] };
// instants of the location's local midnight / 23:59:59.999 (machine rules, = the server's)
const inst = (d, end) => { const s = `${ymd(d)}T${end ? '23:59:59.999' : '00:00:00.000'}`; const guess = new Date(s + 'Z'); const off = (new Date(guess.toLocaleString('en-US', { timeZone: loc.tz })) - new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))) / 60000; return new Date(guess.getTime() - off * 60000).toISOString(); };
for (const [label, [f, t]] of Object.entries(process.env.SCREEN_ONLY ? { last_12_months: R.last_12_months } : R)) {
  const dash = await get(`/dashboard/reports?reports[]=techEfficiencyKpi&reports[]=techPerformance&from=${ymd(f)}&to=${ymd(t)}`);
  const W = `range=custom&start_date=${encodeURIComponent(inst(f, false))}&end_date=${encodeURIComponent(inst(t, true))}`;
  const te = await get(`/reporting/technician-efficiency/custom?${W}`);
  const ids = (te.j?.data?.collection || []).map(r => r.technicianId);
  const ex = ids.length ? await get(`/reporting/technician-efficiency/expanded/custom?${W}&${ids.map(i => 'staff_ids[]=' + i).join('&')}`) : { s: 200, j: { data: { collection: [] } } };
  fs.writeFileSync(`${RAW}${process.env.SCREEN_ONLY ? 'screen-' : ''}${label}.json`, JSON.stringify({ from: ymd(f), to: ymd(t), W, dash, te, ex }));
  out.ranges[label] = { from: ymd(f), to: ymd(t), dash_s: dash.s, te_s: te.s, ex_s: ex.s }; console.log(KEY, label, ymd(f), ymd(t), dash.s, te.s, ex.s);
}
// screen: Dashboard tile at Last 12 Months + View details; then the report at Last 12 Months
const dashResp = []; page.on('response', async r => { if (r.url().includes('/api/dashboard/reports')) { try { dashResp.push({ u: decodeURIComponent(r.url()).replace(/^.*\/api/, ''), j: await r.json() }); } catch {} } });
try {
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }).catch(() => {}); await sleep(7000);
  const trig = page.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_trigger"]');
  out.screen.tile_range_before = await trig.innerText().catch(() => null);
  await trig.click(); await sleep(1500);
  const pres = page.locator('[data-test-id^="date-range-selector_hero_range_techEfficiencyKpi_preset_"]'); out.screen.presets = await pres.evaluateAll(es => es.map(e => e.getAttribute('data-test-id').split('_preset_')[1]));
  await page.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_preset_last-12-months"]').click().catch(e => out.screen.preset_err = String(e).slice(0, 100)); await sleep(800);
  const ap = page.locator('.q-menu').last().getByText(/^Apply$/); if (await ap.count()) await ap.first().click(); await sleep(6000);
  out.screen.tile_range_after = await trig.innerText().catch(() => null);
  out.screen.tile_text = await page.locator('[data-test-id="hero_value_techEfficiencyKpi"]').locator('xpath=ancestor::*[contains(@class,"q-card")][1]').innerText().catch(async () => await page.locator('[data-test-id="hero_value_techEfficiencyKpi"]').innerText().catch(() => null));
  await page.locator('[data-test-id="btn_toggle_details_techEfficiencyKpi"]').click().catch(() => {}); await sleep(5000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  out.screen.detail_heads = await panel.locator('thead th').allInnerTexts().catch(() => []);
  out.screen.detail_rows = await panel.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()))).catch(() => []);
  await page.screenshot({ path: `${RAW}dashboard-te-last12.png`, fullPage: true });
  out.screen.dash_requests = dashResp.filter(x => /techEfficiency/.test(x.u)).map(x => ({ u: x.u.slice(0, 220), kpi: x.j?.data?.techEfficiencyKpi, n_perf: (x.j?.data?.techPerformance || []).length }));
  fs.writeFileSync(`${RAW}dashboard-responses.json`, JSON.stringify(dashResp));
  // report on screen
  const teResp = []; page.on('response', async r => { if (/technician-efficiency\//.test(r.url())) { try { teResp.push({ u: decodeURIComponent(r.url()).replace(/^.*\/api/, ''), j: await r.json() }); } catch {} } });
  await page.goto(APP + '/reports/technician-efficiency', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(6000);
  const rt = page.locator('[data-test-id*="date-range-selector"][data-test-id$="_trigger"]').first(); out.screen.report_range_before = await rt.innerText().catch(() => null);
  await rt.click().catch(() => {}); await sleep(1200);
  const rp = page.locator('[data-test-id*="date-range-selector"][data-test-id$="_preset_last-12-months"]').first(); await rp.click().catch(e => out.screen.report_preset_err = String(e).slice(0, 100)); await sleep(800);
  const ap2 = page.locator('.q-menu').last().getByText(/^Apply$/); if (await ap2.count()) await ap2.first().click(); await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}); await sleep(6000);
  out.screen.report_range_after = await rt.innerText().catch(() => null);
  out.screen.report_rows = await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim())).filter(r => r.length > 2)).catch(() => []);
  out.screen.report_heads = await page.locator('thead th').allInnerTexts().catch(() => []);
  await page.screenshot({ path: `${RAW}report-te-last12.png`, fullPage: true });
  out.screen.report_requests = teResp.map(x => x.u.slice(0, 240)); fs.writeFileSync(`${RAW}report-responses.json`, JSON.stringify(teResp));
} catch (e) { out.screen.error = String(e).slice(0, 300); }
out.end = await rule99(page, loc); out.today = todayS; save(EV + `te-${KEY}${process.env.SCREEN_ONLY ? '-screen' : ''}.json`, out); await browser.close();
