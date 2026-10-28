// Phase-1 evidence (dashboard-affecting tickets, 29 Oct 2026). Rule 99: the browser runs in the LOCATION's own
// time zone (boot2 timezoneId), the process runs with TZ=<zone>, the session is change-location'd to the zone, and
// all three are recorded in meta.json. deviceScaleFactor 2 so boxes feed annotate_v2.py. SECRET-FREE.
// Usage: TZ=<zone> node evidence_phase1.mjs <TE28|F2|TU10>
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const MODES = {
  TE28: { wp: 'f8a8b802-7780-4b16-bf10-343caeb616b2', tz: 'America/Edmonton', loc: 'Staging Lethbridge - 4310' },
  F2: { wp: '39522bc6-abca-4f67-bd12-2840043c2d68', tz: 'America/Toronto', loc: 'DVI Test' },
  TU10: { wp: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', tz: 'Asia/Karachi', loc: 'Staging Heavy Duty - 9919' },
};
const mode = process.argv[2]; const M = MODES[mode];
const OUT = `/tmp/cln/dv/p1/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: M.wp, timezone: M.tz,
  contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: M.tz } });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), M.wp);
const meta = { mode, location: M.loc, location_tz: M.tz, process_TZ: process.env.TZ || null,
  process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.browser_now = await page.evaluate(() => new Date().toString());
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const shot = async (name, extra = {}) => { await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { ...extra, header: await txt(page.locator('header')) }; fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1)); };
const dash = async () => {
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
  meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
};
const menu = () => page.locator('.q-menu').last();
const openRange = async key => { await page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`).click(); await page.waitForTimeout(1500); return menu(); };
const preset = async (key, value) => { const m = await openRange(key); const p = m.locator(`[data-test-id="date-range-selector_hero_range_${key}_preset_${value}"]`);
  meta[`presets_${key}`] = await m.locator('[data-test-id*="_preset_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id').split('_preset_')[1]));
  await p.click(); await page.waitForTimeout(800);
  const ap = m.locator(`[data-test-id="button_hero_range_${key}_apply"]`); if (await ap.count()) await ap.click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(6000); };
const tile = async key => ({ tile: await box(page.locator(`[data-test-id="hero_tile_${key}"]`)), value: await box(page.locator(`[data-test-id="hero_value_${key}"]`)),
  meta: await box(page.locator(`[data-test-id="hero_meta_${key}"]`)), range: await box(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)),
  value_text: await txt(page.locator(`[data-test-id="hero_value_${key}"]`)), meta_text: await txt(page.locator(`[data-test-id="hero_meta_${key}"]`)),
  range_text: await txt(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)) });
const expand = async (key, rowText) => { await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click(); await page.waitForTimeout(7000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  const rows = await panel.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim())));
  const heads = await panel.locator('thead th').allInnerTexts().catch(() => []);
  const out = { heads, rows, panel: await box(panel) };
  for (const r of rowText) { const row = panel.locator('tr').filter({ hasText: r }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); out[`row_${r}`] = { box: await box(row), text: await txt(row) }; }
  return out; };

if (mode === 'TE28') {
  await dash();
  // Tile date range: custom single day, 25 Aug 2026 (the calendar opens on the current month, October)
  const m = await openRange('techEfficiencyKpi');
  meta.menu_before = (await m.innerText()).split('\n').slice(0, 12).join(' | ');
  const cal = m.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_calendar"]');
  for (let i = 0; i < 2; i++) { await cal.locator('.q-date__arrow button, .q-date__navigation button').first().click(); await page.waitForTimeout(600); }
  meta.menu_after_nav = (await m.innerText()).split('\n').slice(0, 12).join(' | ');
  const d25 = cal.locator('.q-date__calendar-item--in button').filter({ hasText: /^25$/ });
  await d25.first().click(); await page.waitForTimeout(400); await d25.first().click(); await page.waitForTimeout(800);
  meta.range_indicator = await txt(m.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_range_indicator"]'));
  await m.locator('[data-test-id="button_hero_range_techEfficiencyKpi_apply"]').click(); await page.waitForTimeout(7000);
  const te = await tile('techEfficiencyKpi');
  await shot('1-dashboard-te-tile', te);
  const ex = await expand('techEfficiencyKpi', ['Joseph Nelson']);
  await shot('2-dashboard-te-table', ex);
  // Work order S3-17383, Lines tab: line 4 "Replace cabin air filter" (30 min tech time, 30 s clocked)
  await page.goto(`${APP}/workorders/b7f8cd68-3fba-4e21-a1de-c09a4127b193/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  const ln = page.locator('main').getByText('Replace cabin air filter', { exact: false });
  await ln.first().scrollIntoViewIfNeeded().catch(() => {}); await page.evaluate(() => window.scrollBy(0, -200)); await page.waitForTimeout(1500);
  await shot('3-work-order-line-4', { line: await box(ln), main: (await txt(page.locator('main'))).slice(0, 3000) });
}
if (mode === 'F2') {
  await dash();
  await preset('techEfficiencyKpi', 'this-week');
  await preset('billingEfficiencyKpi', 'this-week');
  await shot('1-dashboard-tiles', { te: await tile('techEfficiencyKpi'), be: await tile('billingEfficiencyKpi') });
  const ex = await expand('techEfficiencyKpi', ['Esther Howard', 'Fabian Bonjean']);
  await shot('2-dashboard-te-table', ex);
}
if (mode === 'TU10') {
  await dash();   // the tile opens on This Month (default)
  const tu = await tile('techUtilizationKpi');
  await page.locator('[data-test-id="btn_toggle_details_techUtilizationKpi"]').click(); await page.waitForTimeout(7000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  const th = panel.locator('thead th').filter({ hasText: 'Total Hours' }).first();
  const first = async () => (await panel.locator('tbody tr').evaluateAll(trs => trs.map(tr => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)))[0];
  await th.click(); await page.waitForTimeout(2500); if (!/QA Technician/.test(await first() || '')) { await th.click(); await page.waitForTimeout(2500); }
  const row = panel.locator('tr').filter({ hasText: 'QA Technician' }).first();
  await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await shot('1-dashboard-tu-table', { tu: await tile('techUtilizationKpi'), tile_before: tu, th: await box(th), qa: { box: await box(row), text: await txt(row) }, first: await first(), panel: await box(panel) });
  await page.goto(APP + '/reports/technician-utilization', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  const rth = page.locator('thead th').filter({ hasText: 'Total Hours' }).first();
  const rfirst = async () => (await page.locator('tbody tr').evaluateAll(trs => trs.map(tr => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)))[0];
  await rth.click(); await page.waitForTimeout(4000); if (!/QA Technician/.test(await rfirst() || '')) { await rth.click(); await page.waitForTimeout(4000); }
  const rr = page.locator('tr').filter({ hasText: 'QA Technician' }).first();
  await rr.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await shot('2-tu-report', { qa: { box: await box(rr), text: await txt(rr) }, first: await rfirst(), th: await box(rth), date: await txt(page.locator('button, .q-btn').filter({ hasText: 'Date:' })) , dateBox: await box(page.locator('button, .q-btn').filter({ hasText: 'Date:' })) });
  // the one clock record: work order S2-38042, line "E2E test labor line"
}
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ mode, v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, shots: Object.fromEntries(Object.entries(meta.shots).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).filter(([kk]) => /text|range_text|chip|heads/.test(kk) || kk.startsWith('row_')))])) }, null, 1).slice(0, 4000));
await browser.close();
