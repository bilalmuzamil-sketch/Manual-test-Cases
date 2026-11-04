// sv11885_export.mjs — download every report in Reports → Export Reports for a range, at Staging Heavy Duty - 9919 (TZ=America/Edmonton).
// Files go to /tmp/cln/qa11839/exports/<tag>/ (business data stays out of git); a per-file summary is written by sv11885_scan.py.
// SECRET-FREE. Usage: node sv11885_export.mjs <tag> [range label, default "This Month"]
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.HD; const tag = process.argv[2] || 'run'; const RANGE = process.argv[3] || 'This Month'; const T = 'SV-11885';
const DIR = `/tmp/cln/qa11839/exports/${tag}`; fs.mkdirSync(DIR, { recursive: true });
const { browser, page, rule99, app_version } = await boot(loc);
const REPORTS = ['Customer Contact', 'Customer Invoice', 'Customer Payment', 'Customer Credit Memo', 'Vendor Contact', 'Vendor Bill', 'Vendor Bill Payment', 'Vendor Credit Memo', 'Payroll Timesheet', 'Journal Entry', 'Sales Representative Assignments'];
const out = { app_version, range: RANGE, rule99_start: rule99, files: [] };
await page.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
for (const name of REPORTS) {
  try {
    await page.goto(APP + '/reports/sales', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(7000);   // fresh page per download (the link is not clickable again after a download)
    await page.getByText('Export Reports', { exact: true }).first().click(); await sleep(2500);
    const dlg = page.locator('.q-dialog').last();
    await dlg.locator('[data-test-id="select_report_name"]').first().click(); await sleep(1000); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(1000);
    const rangeSel = dlg.locator('[data-test-id="select_date_range"]');
    if (await rangeSel.count() && await rangeSel.first().isVisible()) { await rangeSel.first().click(); await sleep(1000); await page.getByRole('option', { name: RANGE, exact: true }).first().click(); await sleep(1000); }
    const dtext = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 300);
    if (name === 'Customer Contact') out.pic_dialog = await shot(page, T, `0-export-dialog-${tag}`);
    const btn = dlg.locator('button').filter({ hasText: /^\s*Export\s*$/ }).first();
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), btn.click()]);
    const f = `${DIR}/${name.replace(/\s+/g, '_')}__${dl.suggestedFilename()}`; await dl.saveAs(f);
    out.files.push({ report: name, dialog: dtext, file: f, suggested: dl.suggestedFilename(), bytes: fs.statSync(f).size });
    console.log(name, '->', dl.suggestedFilename(), fs.statSync(f).size);
  } catch (e) { out.files.push({ report: name, error: e.message.slice(0, 200) }); console.log(name, 'ERROR', e.message.slice(0, 120)); await page.keyboard.press('Escape').catch(() => {}); }
  await sleep(1500); if (await page.locator('.q-dialog').count()) { await page.keyboard.press('Escape').catch(() => {}); await sleep(800); }
}
out.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${DIR}/_downloads.json`, JSON.stringify(out, null, 1));
console.log('RULE99', out.rule99_end.all_match); await browser.close();
