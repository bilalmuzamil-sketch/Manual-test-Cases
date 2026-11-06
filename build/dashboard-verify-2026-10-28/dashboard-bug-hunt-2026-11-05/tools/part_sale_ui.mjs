// Area 8 set-up ON SCREEN: add the stocked part ZZAUTOTEST-PV12202-11050521 (qty 1, $30) to part sale P11839-248 at Heavy Duty (playbook "Part Sales").
import fs from 'fs';
import { boot, LOC, shot, save, sleep, waitIdle, APP, finish } from './hb.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')); const ps = S.HUNT8.PS.wo; const pn = S.PV12202.cat.pn;
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc, { dest: '/workorders' }); const ev = { app_version, ps, posts: [] };
page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('sv11839api') && !/sentry|notif|collect/.test(r.url())) ev.posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
try {
  await page.goto(`${APP}/parts/part-sale/${ps}/part-requests`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await waitIdle(page, 8000);
  await shot(page, 'area8-money', 'ps-1-open');
  await page.locator('[data-test-id="button_add_part"]').first().click({ timeout: 8000 }).catch(() => {}); await sleep(2000);
  if (!(await page.locator('.q-dialog').count())) await page.getByRole('button', { name: 'Add Part' }).last().click({ force: true });
  await sleep(1500); ev.dialog_ids = await page.evaluate(() => [...document.querySelectorAll('.q-dialog [data-test-id]')].map(e => e.getAttribute('data-test-id')));
  const sel = page.locator('[data-test-id="select_part"]').first(); await sel.click(); await page.keyboard.type(pn, { delay: 40 }); await sleep(4000);
  ev.options = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  await page.locator('.q-menu .q-item').first().click(); await sleep(2500);
  await shot(page, 'area8-money', 'ps-2-dialog');
  await page.locator('[data-test-id="input_workorder_part_sell_price"]').fill('30').catch(() => {});
  ev.dialog_after = (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
  const qty = page.locator('[data-test-id^="input_bin_quantity_"], [data-test-id="input_workorder_part_quantity"]').first(); if (await qty.count()) await qty.fill('1');
  
  const saveBtn = page.locator('[data-test-id="button_workorder_part_save"]').first(); ev.save_label = await saveBtn.innerText().catch(() => null); await saveBtn.click(); await sleep(6000);
  await page.keyboard.press('Escape'); await sleep(800);
  ev.rows = (await page.locator('tr').filter({ hasText: pn }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  await shot(page, 'area8-money', 'ps-3-part-added');
} catch (e) { ev.error = String(e).slice(0, 400); await shot(page, 'area8-money', 'ps-error').catch(() => {}); }
ev.rule99 = await finish(page, loc, rule99); save('area8-money', 'partsale-setup', ev); console.log(JSON.stringify({ ids: ev.dialog_ids, after: ev.dialog_after, opts: ev.options, row: ev.rows, err: ev.error, posts: ev.posts.slice(-6), save: ev.save_label }).slice(0, 1500));
await browser.close();
