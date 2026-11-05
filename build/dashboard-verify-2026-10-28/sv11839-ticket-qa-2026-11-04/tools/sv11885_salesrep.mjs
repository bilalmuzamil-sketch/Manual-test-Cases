// sv11885_salesrep.mjs — ON SCREEN: customer "+ZZAUTOTEST QA11839 Plus" → edit (edit_note) → Sales Representative = "-ZZAUTOTEST QA11839 Tech" → Save.
// Staging Heavy Duty - 9919, TZ=America/Edmonton. SECRET-FREE.
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11885'; const CUS = '49b8d427-2ee7-4c4c-b38b-f92967395380';
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/customers' });
const posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('/api/customers')) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} posts.push({ status: r.status(), url: r.url().replace(/^.*\/api/, '/api'), sent_keys: Object.keys(JSON.parse(r.request().postData() || '{}')), sent_rep: (() => { try { const j = JSON.parse(r.request().postData()); return { id: j.sales_rep_id, first: j.sales_rep_first_name, last: j.sales_rep_last_name }; } catch { return null; } })(), body: b }); } });
await page.goto(`${APP}/customers/${CUS}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
const P = { app_version, rule99_start: rule99 };
await page.locator('button').filter({ has: page.locator('i', { hasText: 'edit_note' }) }).first().click(); await sleep(3000);
const dlg = page.locator('.q-dialog').last();
P.rep_before = await dlg.locator('[data-test-id="select_customer_sales_rep"]').innerText().catch(() => null);
await dlg.locator('[data-test-id="select_customer_sales_rep"]').click(); await sleep(1000);
await page.keyboard.type('ZZAUTOTEST', { delay: 40 }); await sleep(2500);
P.options = (await page.locator('.q-menu').last().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 15);
const opt = page.locator('.q-menu .q-item').filter({ hasText: '-ZZAUTOTEST QA11839 Tech' }).first();
P.offered = await opt.count() > 0;
if (P.offered) {
  await opt.click(); await sleep(1500); await page.keyboard.press('Escape').catch(() => {}); await sleep(300);
  P.rep_chosen = await dlg.locator('[data-test-id="select_customer_sales_rep"]').innerText().catch(() => null);
  P.pic_dialog = await shot(page, T, 'sr-1-customer-dialog-sales-rep');
  await dlg.locator('button').filter({ hasText: /^\s*Save\s*$/ }).first().click(); await sleep(5000);
  P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []);
  P.pic_after = await shot(page, T, 'sr-2-customer-after-save');
}
P.posts = posts; P.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-sales-rep.json`, JSON.stringify({ ticket: T, ...P }, null, 1));
console.log(JSON.stringify({ before: P.rep_before, offered: P.offered, options: P.options, chosen: P.rep_chosen, toasts: P.toasts, posts: posts.map(p => [p.status, p.url, p.sent_rep, p.body.slice(0, 120)]), r99: P.rule99_end.all_match }).slice(0, 2500));
await browser.close();
