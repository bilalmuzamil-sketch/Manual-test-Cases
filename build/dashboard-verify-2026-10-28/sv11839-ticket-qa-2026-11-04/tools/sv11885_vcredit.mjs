// sv11885_vcredit.mjs — post a manual vendor credit ON SCREEN at Test Location (TZ=Asia/Karachi), for the Vendor Credit Memo download.
// Parts → Returns → Create Credit form (/parts/create-credit). Fields filled by LABEL (two inputs on these screens share data-test-id
// "input_base"). Values: vendor "@ZZAUTOTEST QA11839 Vendor", credit memo "=ZZCM 1+1", part number "+ZZPN-885", description
// "@ZZAUTOTEST part desc", qty 1, price 10, note "-ZZAUTOTEST return note". SECRET-FREE. Usage: node sv11885_vcredit.mjs [probe|post]
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.TL; const T = 'SV-11885'; const mode = process.argv[2] || 'probe';
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/parts/returns' });
const posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('/api/') && /returns|credit|manual-return/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 400); } catch {} posts.push({ status: r.status(), url: r.url().replace(/^.*\/api/, '/api'), body: b }); } });
await page.goto(APP + '/parts/create-credit', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
const P = { app_version, rule99_start: rule99, url: page.url().replace(APP, '') };
const byId = id => page.locator(`[data-test-id="${id}"]`).first().locator('xpath=self::input | self::textarea | .//input | .//textarea').first();
const byLabel = l => page.locator('label').filter({ hasText: new RegExp(`(^|\\s)${l}\\s*$`, 'i') }).first().locator('input, textarea').first();
P.labels = await page.evaluate(() => [...document.querySelectorAll('label')].map(l => l.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40));
P.pic_form = await shot(page, T, 'vc-1-create-credit-form');
if (mode === 'post') {
  // vendor
  await page.locator('[data-test-id="select_vendor"]').first().click(); await sleep(800);
  await page.keyboard.type('ZZAUTOTEST QA11839', { delay: 40 }); await sleep(2500);
  await page.locator('.q-menu .q-item').filter({ hasText: '@ZZAUTOTEST QA11839 Vendor' }).first().click(); await sleep(1500);
  await byId('input_packaging_slip').fill('ZZ-PS-885').catch(() => {});
  await byId('input_credit_memo').fill('=ZZCM 1+1');
  // part number: typed text, committed with Enter (no catalogue part)
  const ps = page.locator('[data-test-id="create_credit_part_select"]').first(); await ps.click(); await sleep(500);
  await page.keyboard.type('+ZZPN-885', { delay: 50 }); await sleep(2000); P.part_menu = await page.locator('.q-menu').last().innerText().catch(() => null);
  await page.keyboard.press('Enter'); await sleep(1500); await page.keyboard.press('Tab'); await sleep(800);
  await byId('input_manual_credit_part_description').fill('@ZZAUTOTEST part desc').catch(e => { P.desc_err = e.message.slice(0, 120); });
  await byId('input_manual_credit_part_quantity').fill('1'); await byId('input_manual_credit_part_price').fill('10');
  await byId('input_credit_note').fill('-ZZAUTOTEST return note').catch(e => { P.note_err = e.message.slice(0, 120); });
  await sleep(1000);
  P.form_values = await page.evaluate(() => [...document.querySelectorAll('main input, main textarea')].map(i => [i.closest('label')?.innerText.replace(/\s+/g, ' ').trim().slice(0, 30), i.value]).filter(x => x[1]));
  P.pic_filled = await shot(page, T, 'vc-2-create-credit-filled', { fullPage: true });
  await page.locator('[data-test-id="button_post_credit"]').click(); await sleep(7000);
  P.after_url = page.url().replace(APP, ''); P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []);
  P.pic_after = await shot(page, T, 'vc-3-after-post-credit', { fullPage: true });
}
P.posts = posts; P.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-vendor-credit-${mode}.json`, JSON.stringify({ ticket: T, ...P }, null, 1));
console.log(JSON.stringify({ url: P.url, labels: P.labels, vals: P.form_values, menu: P.part_menu, after: P.after_url, toasts: P.toasts, posts: posts.map(p => `${p.status} ${p.url} ${p.body.slice(0, 150)}`), r99: P.rule99_end.all_match, errs: [P.desc_err, P.note_err] }).slice(0, 3500));
await browser.close();
