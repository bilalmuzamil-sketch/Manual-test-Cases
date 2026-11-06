// Area 8 set-up ON SCREEN, step 2: Authorize the part sale and Pick its part (the normal user flow), then record its state.
import fs from 'fs';
import { boot, LOC, shot, save, sleep, waitIdle, APP, finish } from './hb.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')); const ps = S.HUNT8.PS.wo;
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc, { dest: '/workorders' }); const ev = { app_version, ps, posts: [] };
page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('sv11839api') && !/sentry|notif|collect|recent-entities/.test(r.url())) ev.posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
try {
  await page.goto(`${APP}/parts/part-sale/${ps}/part-requests`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await waitIdle(page, 8000);
  await page.getByRole('button', { name: 'Authorize' }).first().click(); await sleep(4000);
  if (await page.locator('.q-dialog').count()) { ev.auth_dialog = (await page.locator('.q-dialog').last().innerText()).replace(/\s+/g, ' ').slice(0, 300); await page.locator('.q-dialog').last().getByRole('button').filter({ hasText: /Authorize|Confirm|Yes|Save/ }).last().click().catch(() => {}); await sleep(4000); }
  await shot(page, 'area8-money', 'ps-4-authorized');
  const act = page.locator('[data-test-id="button_part_request_action"]').first(); ev.action_label = (await act.innerText().catch(() => '')).trim();
  await act.click(); await sleep(5000);
  if (await page.locator('.q-dialog').count()) { ev.pick_dialog = (await page.locator('.q-dialog').last().innerText()).replace(/\s+/g, ' ').slice(0, 300); }
  await shot(page, 'area8-money', 'ps-5-after-action');
  ev.parts_text = (await page.locator('table').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
} catch (e) { ev.error = String(e).slice(0, 300); await shot(page, 'area8-money', 'ps-error2').catch(() => {}); }
ev.rule99 = await finish(page, loc, rule99); save('area8-money', 'partsale-setup2', ev); console.log(JSON.stringify({ auth: ev.auth_dialog, act: ev.action_label, pick: ev.pick_dialog, parts: ev.parts_text, err: ev.error, posts: ev.posts }).slice(0, 1800));
await browser.close();
