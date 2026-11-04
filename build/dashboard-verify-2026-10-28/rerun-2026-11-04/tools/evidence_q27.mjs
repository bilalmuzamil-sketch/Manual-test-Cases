// Q27 evidence (DVI Test, America/Toronto — Rule 99: browser timezoneId + process TZ + session zone, all recorded).
// Work order S1-38215 (customer "ZZAUTOTEST Dash Q27", seeded by seed_q27.py): one 60-min line, one 30-min clock
// (Esther Howard, 7:07–7:37 PM), invoiced. Steps on SCREEN: (1) Dashboard Sales by Customer tile, This Week,
// View details -> the customer's Labor Delta; (2) Reports > Timesheet Activities -> Edit timesheet on that clock ->
// Start 6:37 PM -> Save; (3) work order Stats tab; (4) Dashboard again. SECRET-FREE. Out: /tmp/cln/q27/ev/.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com', WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto';
const S = JSON.parse(fs.readFileSync('/tmp/cln/q27/seed.json'));
const OUT = '/tmp/cln/q27/ev'; fs.mkdirSync(OUT, { recursive: true });
const phase = process.argv[2] || 'all';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ,
  contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ } });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const metaF = `${OUT}/meta.json`;
const meta = fs.existsSync(metaF) ? JSON.parse(fs.readFileSync(metaF)) : { shots: {} };
Object.assign(meta, { location: 'DVI Test', location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone });
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const save = () => fs.writeFileSync(metaF, JSON.stringify(meta, null, 1));
const shot = async (name, extra = {}) => { await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { at_utc: new Date().toISOString(), ...extra }; save(); console.log(name, JSON.stringify(extra).slice(0, 600)); };
const sbc = async name => {
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
  meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  const key = 'salesByCustomer';
  await page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`).click(); await page.waitForTimeout(1500);
  await page.locator(`[data-test-id="date-range-selector_hero_range_${key}_preset_this-week"]`).click(); await page.waitForTimeout(800);
  const ap = page.locator(`[data-test-id="button_hero_range_${key}_apply"]`); if (await ap.count()) await ap.click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(6000);
  await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click(); await page.waitForTimeout(7000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  const row = panel.locator('tr').filter({ hasText: 'ZZAUTOTEST Dash Q27' }).first();
  await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await shot(name, { heads: await panel.locator('thead th').allInnerTexts().catch(() => []), row: { box: await box(row), text: await txt(row) },
    tile: await box(page.locator(`[data-test-id="hero_tile_${key}"]`)), range: await txt(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)), panel: await box(panel) });
};
const stats = async name => {
  await page.goto(`${APP}/workorders/${S.wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
  await page.getByText('Stats', { exact: true }).first().click(); await page.waitForTimeout(7000);
  await shot(name, { main: (await txt(page.locator('main'))).slice(0, 1500), url: page.url() });
};
if (phase === 'statsb') await stats('2-stats-before');
if (phase === 'all' || phase === 'before') { await sbc('1-dashboard-sbc-before'); await stats('2-stats-before'); }
if (phase === 'all' || phase === 'edit') {
  await page.goto(APP + '/reports/punch-clock-activities', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  const row = page.locator('tr').filter({ hasText: 'S1-38215' }).first();
  await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await row.hover().catch(() => {}); await page.waitForTimeout(600);
  await shot('3-timesheet-row', { row: { box: await box(row), text: await txt(row) }, date: await txt(page.locator('button, .q-btn').filter({ hasText: 'Date:' })) });
  await row.locator('[data-test-id*="edit_timesheet"]').first().click(); await page.waitForTimeout(4000);
  const dlg = page.locator('.q-dialog').last();
  const start = dlg.locator('[data-test-id*="input_timesheet_start_date"] input, input[data-test-id*="input_timesheet_start_date"]').first();
  meta.dialog_before = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600);
  meta.start_before = await start.inputValue().catch(() => null); save();
  const want = (meta.start_before || '').replace(/07:07 PM/, '06:37 PM');
  await start.click(); await start.fill(''); await start.type(want, { delay: 40 }); await page.keyboard.press('Tab'); await page.waitForTimeout(1200);
  meta.start_after = await start.inputValue().catch(() => null);
  await shot('4-edit-dialog', { dialog: await box(dlg), startBox: await box(start), start: meta.start_after, text: (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600) });
  const posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('technician-tasks')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')}`); });
  await dlg.locator('[data-test-id="button_save_timesheet"]').click(); await page.waitForTimeout(5000);
  if (await page.locator('.q-dialog').count()) meta.after_save_dialog = (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  meta.posts = posts;
  await page.waitForTimeout(3000);
  const row2 = page.locator('tr').filter({ hasText: 'S1-38215' }).first();
  await shot('5-timesheet-row-after', { row: { box: await box(row2), text: await txt(row2) } });
}
if (phase === 'all' || phase === 'after') { await stats('6-stats-after'); await sbc('7-dashboard-sbc-after'); }
save();
console.log(JSON.stringify({ v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, start_before: meta.start_before, start_after: meta.start_after, posts: meta.posts, after_save_dialog: meta.after_save_dialog }));
await browser.close();
