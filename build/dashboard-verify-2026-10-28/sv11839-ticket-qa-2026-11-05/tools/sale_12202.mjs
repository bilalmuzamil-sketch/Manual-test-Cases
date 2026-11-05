// sale_12202.mjs — SV-12202 set-up ON SCREEN at Staging Heavy Duty - 9919 (TZ=America/Edmonton): add the stocked part to the work order line
// and Pick it (Work order → Lines → Add Part → part number → inventory option → qty 1 → save → part action = Pick). Adapted from
// rerun-sv11839-2026-11-04/tools/sec3/seed_hd_ui.mjs (proven on staging). SECRET-FREE.
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05';
const R = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')).PV12202;
const { browser, page, rule99, app_version } = await boot(LOC.HD, { dest: '/workorders' });
const posts = []; page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('/api/') && !/sentry|notifications|collect/.test(r.url())) posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
const P = { app_version, rule99_start: rule99 };
try {
  await page.goto(`${APP}/workorders/${R.wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
  if (await page.locator('.q-dialog').count()) { const x = page.locator('.q-dialog i').filter({ hasText: /^close$/ }); if (await x.count()) await x.first().click().catch(() => {}); await sleep(1000); }
  await page.locator('[data-test-id="button_add_part"]').first().click(); await sleep(2000);
  await page.locator('[data-test-id="select_inline_part_number"]').click(); await page.keyboard.type(R.cat.pn, { delay: 40 }); await sleep(4000);
  await page.locator(`[data-test-id="select_option_workorder_part_${R.inv}-inventory_part"]`).click(); await sleep(2500);
  await page.locator('[data-test-id="input_inline_part_quantity"]').fill('1');
  await page.locator('[data-test-id="input_inline_part_sell_price"]').fill('30');
  await page.locator('[data-test-id="button_save_inline_part"]').click(); await sleep(6000);
  await page.keyboard.press('Escape'); await sleep(800);
  const prow = page.locator('tr').filter({ hasText: R.cat.pn }).first();
  await prow.locator('[data-test-id="button_part_request_action"]').first().click(); await sleep(5000);
  P.pick_dialog = await page.locator('.q-dialog').count() ? (await page.locator('.q-dialog').last().innerText()).replace(/\s+/g, ' ').slice(0, 300) : null;
  P.part_row = (await page.locator('tr').filter({ hasText: R.cat.pn }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  P.pic = await shot(page, 'SV-12202', 'setup-1-part-picked'); P.picked_utc = new Date().toISOString();
} catch (e) { P.error = String(e).slice(0, 400); await shot(page, 'SV-12202', 'setup-error').catch(() => {}); }
P.posts = posts; P.rule99_end = await finish(page, LOC.HD, rule99);
fs.mkdirSync(`${OUT}/SV-12202`, { recursive: true }); fs.writeFileSync(`${OUT}/SV-12202/setup-sale.json`, JSON.stringify(P, null, 1));
console.log(JSON.stringify({ row: P.part_row, pick: P.pick_dialog, err: P.error, posts: posts.slice(-8), r99: P.rule99_end.all_match }).slice(0, 2000));
await browser.close();
