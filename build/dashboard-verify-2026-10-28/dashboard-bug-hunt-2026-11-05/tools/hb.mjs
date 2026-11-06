// hb.mjs — shared helpers for the 5/6 Nov Dashboard bug hunt. SECRET-FREE (cookies read by qaBoot from /tmp).
// Never quick-login / switch-user on the QA branch. Rule 99 recorded via common.mjs boot().
import fs from 'fs'; import path from 'path';
import { boot as boot0, finish, headerCheck, LOC as L0, sleep } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
export { finish, headerCheck, sleep };
export const EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/dashboard-bug-hunt-2026-11-05/evidence';
export const APP = 'https://sv11839.qa.shopview.com';
export const LOC = { ...L0, DVI: { id: '93404b24-8d43-4459-b152-513e64e2ad81', name: 'DVI Test', tz: 'Pacific/Fiji' } };
import { execFileSync } from 'child_process';
// Rule 99 (6 Nov amendment): record BOTH the browser's offset and the system/server tz-database offset for today; flag a mismatch.
export async function offsets(page, tz) {
  const browser_offset_min = await page.evaluate(() => -new Date().getTimezoneOffset());
  const sys = JSON.parse(execFileSync('python3', ['-I', '-c', `import json,datetime as d;from zoneinfo import ZoneInfo as Z;n=d.datetime.now(Z('${tz}'));print(json.dumps({'system_offset_min':int(n.utcoffset().total_seconds()//60),'system_local_now':n.isoformat()}))`]).toString());
  return { browser_offset_min, ...sys, offsets_agree: browser_offset_min === sys.system_offset_min };
}
export async function boot(loc, opts) { const r = await boot0(loc, opts); r.rule99.note = "QA lead's own cookie set: change-location also moves his browser's location on sv11839"; r.rule99.offsets = await offsets(r.page, loc.tz); if (!r.rule99.offsets.offsets_agree) r.rule99.offsets.warning = 'browser and system offsets differ: day-boundary results within 1 h of local midnight are UNSAFE'; return r; }
export function out(area) { const d = path.join(EV, area); fs.mkdirSync(d, { recursive: true }); return d; }
export async function shot(page, area, name, opts = {}) { const p = path.join(out(area), name + '.png'); await page.screenshot({ path: p, ...opts }); return path.relative(EV, p); }
export function save(area, name, obj) { fs.writeFileSync(path.join(out(area), name + '.json'), JSON.stringify(obj, null, 1)); }
export function netlog(page, filter = '/api/') { const L = []; page.on('response', async r => { const u = r.url(); if (!u.includes(filter) || !u.includes('sv11839api')) return; let body = null; try { if ((r.headers()['content-type'] || '').includes('json')) body = await r.json(); } catch {} L.push({ t: new Date().toISOString(), status: r.status(), url: decodeURIComponent(u.replace(/^.*\/api/, '/api')), body }); }); return L; }
export async function tile(page, k) { return page.evaluate(k => { const q = s => document.querySelector(`[data-test-id="${s}"]`)?.innerText?.replace(/\s+/g, ' ').trim() ?? null; return { value: q('hero_value_' + k), meta: q('hero_meta_' + k), chip: q(`date-range-selector_hero_range_${k}_trigger`), error: q('hero_error_' + k) }; }, k); }
export async function gotoDash(page) { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(5000); }
export const TILES = ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer'];
export async function reportState(page) {
  return page.evaluate(() => {
    const t = e => e?.innerText?.replace(/\s+/g, ' ').trim() ?? null;
    const chips = [...document.querySelectorAll('[data-test-id^="filter_chip_"], [data-test-id*="date-range-selector"][data-test-id$="_trigger"]')].map(e => ({ id: e.getAttribute('data-test-id'), text: t(e) }));
    const rows = [...document.querySelectorAll('tr')].filter(r => /^(Summary|Total|Totals)\b/i.test(t(r) || '')).map(t);
    const btns = [...document.querySelectorAll('button')].map(t).filter(x => /chart/i.test(x || ''));
    return { url: location.pathname + location.search, chips, summaryRows: rows.slice(0, 3), chartButtons: btns, hasChart: !!document.querySelector('canvas, svg.apexcharts-svg, [class*="chart"] svg'), noData: t(document.querySelector('.q-table__bottom--nodata')) , heading: t(document.querySelector('h1, .page-title, [data-test-id*="title"]')) };
  });
}
export async function waitIdle(page, ms = 6000) { await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(ms); }
export async function setRange(page, k, preset) {
  await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(800);
  await page.locator('.q-menu').last().getByText(preset, { exact: true }).first().click(); await sleep(4500);
}
export async function openReport(ctx, page, k) {
  const [pop] = await Promise.all([ctx.waitForEvent('page', { timeout: 30000 }).catch(() => null), page.locator(`[data-test-id="link_report_${k}"]`).click()]);
  const p = pop || page; await p.waitForLoadState('domcontentloaded'); await waitIdle(p, 8000); return { p, newTab: !!pop };
}
export async function bodyText(p, n = 3000) { return (await p.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, n); }
