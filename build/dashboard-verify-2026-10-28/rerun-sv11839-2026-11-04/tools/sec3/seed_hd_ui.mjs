// Seed, on screen (4 Nov 2026, staging, ZZAUTOTEST), at Staging Heavy Duty - 9919 in Asia/Karachi (Rule 99 via f3boot):
// Timesheet Activities -> New (Admin Shopview on the seeded line, start now-20 min, end now-5 min); add + pick the seeded
// stocked part; Complete the line; Finance -> Create Invoice. Ids from /tmp/cln/s3/seed.json. SECRET-FREE.
// Usage: TZ=Asia/Karachi node seed_hd_ui.mjs
import fs from 'fs';
import { f3boot, assertLoc } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/f3boot.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/s3/seed.json')); const OUT = '/tmp/cln/s3/ui'; fs.mkdirSync(OUT, { recursive: true });
const APP = 'https://app.staging.shopview.com';
const { browser, page, WP, TZ, LNAME } = await f3boot('hd');
if (process.env.TZ !== TZ) { console.error('run with TZ=' + TZ); process.exit(2); }
const meta = { rule99: { location: LNAME, workplace_id: WP, location_tz: TZ, process_TZ: process.env.TZ, browser_zone: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
  app_timezone_key: await page.evaluate(() => localStorage.getItem('timezone')), app_location_key: await page.evaluate(() => localStorage.getItem('location')) }, started_utc: new Date().toISOString(), steps: [] };
const posts = []; page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('/api/') && !/sentry|notifications/.test(r.url())) posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
let n = 0; const shot = async name => { n++; await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` }); meta.steps.push({ n, name, at_utc: new Date().toISOString() }); console.log(n, name); };
const dlgText = async () => (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600);
const fmt = d => d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/,(?= \d{2}:)/, '');
try {
  // 1. Timesheet Activities -> New
  await page.goto(APP + '/reports/punch-clock-activities', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  meta.loc_start = await assertLoc(page, LNAME, WP);
  await page.locator('[data-test-id="button_new_timesheet"]').click(); await page.waitForTimeout(3500);
  const dlg = page.locator('.q-dialog').last();
  const pick = async (tid, typed, label) => { const sel = dlg.locator(`[data-test-id="${tid}"]`).first(); await sel.click(); await page.waitForTimeout(1500);
    const inp = sel.locator('input').first(); if (typed && await inp.count() && (await inp.getAttribute('readonly')) === null) { await inp.fill(typed); await page.waitForTimeout(3500); }
    await page.locator('.q-menu .q-item').filter({ hasText: label }).first().click(); await page.waitForTimeout(2000); };
  await pick('select_timesheet_staff', 'Admin Shopview', 'Admin Shopview');
  await pick('select_timesheet_work_order', S.display, S.display);
  await pick('select_timesheet_line', null, 'Battery service');
  const st = new Date(Date.now() - 20 * 60000); st.setSeconds(0, 0); const en = new Date(Date.now() - 5 * 60000); en.setSeconds(0, 0);
  meta.ts_start = fmt(st); meta.ts_end = fmt(en);
  const setDT = async (tid, v) => { const i = dlg.locator(`[data-test-id="${tid}"] input, input[data-test-id="${tid}"]`).first(); await i.click(); await i.fill(''); await i.type(v, { delay: 30 }); await page.keyboard.press('Tab'); await page.waitForTimeout(1000); return i.inputValue().catch(() => null); };
  meta.start_set = await setDT('input_timesheet_start_date', meta.ts_start); meta.end_set = await setDT('input_timesheet_end_date', meta.ts_end);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(300);
  meta.ts_dialog = await dlgText(); await shot('new-timesheet');
  await page.locator('.q-dialog').last().locator('[data-test-id="button_save_timesheet"]').click(); await page.waitForTimeout(6000);
  meta.after_ts = await dlgText();
  // 2. Work order lines: add + pick the stocked part
  await page.goto(`${APP}/workorders/${S.wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  if (await page.locator('.q-dialog').count()) { const x = page.locator('.q-dialog i').filter({ hasText: /^close$/ }); if (await x.count()) await x.first().click().catch(() => {}); await page.waitForTimeout(1000); }
  await page.locator('[data-test-id="button_add_part"]').first().click(); await page.waitForTimeout(2000);
  await page.locator('[data-test-id="select_inline_part_number"]').click(); await page.keyboard.type(S.cat.pn, { delay: 40 }); await page.waitForTimeout(4000);
  await page.locator(`[data-test-id="select_option_workorder_part_${S.inv}-inventory_part"]`).click(); await page.waitForTimeout(2500);
  await page.locator('[data-test-id="input_inline_part_quantity"]').fill('1');
  await page.locator('[data-test-id="input_inline_part_sell_price"]').fill('30');
  await page.locator('[data-test-id="button_save_inline_part"]').click(); await page.waitForTimeout(6000);
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  const prow = page.locator('tr').filter({ hasText: S.cat.pn }).first();
  await prow.locator('[data-test-id="button_part_request_action"]').first().click(); await page.waitForTimeout(4000);
  if (await page.locator('.q-dialog').count()) meta.pick_dialog = await dlgText();
  meta.part_row = (await page.locator('tr').filter({ hasText: S.cat.pn }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  await shot('part-picked');
  // 3. Complete the line
  await page.locator(`[data-test-id="button_action_complete_line_${S.line}"]`).click(); await page.waitForTimeout(4000);
  if (await page.locator('.q-dialog').count()) { meta.complete_dialog = await dlgText();
    const vin = page.locator('.q-dialog input'); if (await vin.count() && !(await vin.first().inputValue().catch(() => ''))) await vin.first().fill('ZZTESTVINS3HD00001');
    const b = page.locator('.q-dialog').last().locator('button').filter({ hasText: /Finish Work Order|Complete|Confirm|Yes/ }); if (await b.count()) await b.last().click(); await page.waitForTimeout(6000); }
  await shot('line-complete');
  // 4. Finance -> Create Invoice
  await page.goto(`${APP}/workorders/${S.wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="button_create_invoice"]', { timeout: 90000 }); await page.waitForTimeout(5000);
  await page.locator('[data-test-id="button_create_invoice"]').click(); await page.waitForTimeout(6000);
  meta.create_dialog = await dlgText();
  if (/Missing Details/.test(meta.create_dialog)) { await page.locator('.q-dialog input').first().fill('ZZTESTVINS3HD00001'); await page.locator('.q-dialog').last().locator('button').filter({ hasText: /Create Invoice/ }).click(); await page.waitForTimeout(8000); }
  meta.after_create = await dlgText(); meta.invoice_created_utc = new Date().toISOString();
  await shot('invoice-created');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  meta.loc_end = await assertLoc(page, LNAME, WP);
} catch (e) { meta.error = String(e).slice(0, 500); await shot('error').catch(() => {}); }
meta.posts = posts; meta.finished_utc = new Date().toISOString();
fs.writeFileSync(`${OUT}/seed_ui.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ ...meta, posts: posts.slice(-25) }, null, 1).slice(0, 5000));
await browser.close();
