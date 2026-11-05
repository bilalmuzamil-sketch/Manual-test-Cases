// exp.mjs — download one Reports → Export Reports file on screen. SECRET-FREE. Files to /tmp/cln/qa11839/exp5/ (business data stays out of git).
// Usage: TZ=<zone> node exp.mjs <HD|LB|TL> "<Report Name>" "<Today|This Month|…|custom:MM/DD/YYYY-MM/DD/YYYY>" <tag> [ticket-for-picture]
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const [L, name, range, tag, pic] = process.argv.slice(2); const loc = LOC[L]; const DIR = '/tmp/cln/qa11839/exp5'; fs.mkdirSync(DIR, { recursive: true });
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05';
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/reports/sales' });
const NET = []; page.on('response', async r => { if (r.url().includes('/reporting/export')) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch {} NET.push({ url: decodeURIComponent(r.url()).replace(/^.*\/api/, '/api'), status: r.status(), body: b }); } });
const E = { app_version, location: loc.name, report: name, range, rule99_start: rule99 };
await page.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(6000);
await page.getByText('Export Reports', { exact: true }).first().click(); await sleep(2500);
const dlg = page.locator('.q-dialog').last();
await dlg.locator('[data-test-id="select_report_name"]').first().click(); await sleep(900); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(900);
const custom = range.startsWith('custom:');
await dlg.locator('[data-test-id="select_date_range"]').first().click(); await sleep(900); await page.getByRole('option', { name: custom ? 'Custom' : range, exact: true }).first().click(); await sleep(900);
if (custom) { const [f, t] = range.slice(7).split('-');
  for (const [n, v] of [['export_startDate', f], ['export_endDate', t]]) { const i = dlg.locator(`input[name="${n}"]`).first(); await i.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type(v, { delay: 60 }); await page.keyboard.press('Tab'); await sleep(800); E[n] = await i.inputValue().catch(() => null); }
  await page.keyboard.press('Escape').catch(() => {}); await sleep(300); }
E.dialog = (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 300);
if (pic) E.pic = await shot(page, pic, `export-dialog-${tag}`);
const dl = page.waitForEvent('download', { timeout: 40000 }).catch(() => null);
await page.locator('.q-dialog').last().locator('button').filter({ hasText: /^\s*Export\s*$/ }).first().click(); const d = await dl; await sleep(1500);
await sleep(2500); E.notifications_after = await page.locator('.q-notification').allInnerTexts().catch(() => []); E.dialog_open_after = await page.locator('.q-dialog').count();
if (pic) E.pic_after = await shot(page, pic, `export-dialog-after-${tag}`);
if (d) { E.file = `${DIR}/${tag}.csv`; await d.saveAs(E.file); E.bytes = fs.statSync(E.file).size; }
E.at_utc = new Date().toISOString(); E.net = NET; E.rule99_end = await finish(page, loc, rule99);
if (pic) { fs.mkdirSync(`${OUT}/${pic}`, { recursive: true }); fs.writeFileSync(`${OUT}/${pic}/export-${tag}.json`, JSON.stringify(E, null, 1)); }
console.log(JSON.stringify({ notes: E.notifications_after, dlgOpen: E.dialog_open_after, net: NET.map(n => [n.status, n.url.slice(0, 220), n.body.slice(0, 150)]), tag, file: E.file, bytes: E.bytes, dialog: E.dialog, r99: E.rule99_end.all_match, v: app_version }));
await browser.close();
