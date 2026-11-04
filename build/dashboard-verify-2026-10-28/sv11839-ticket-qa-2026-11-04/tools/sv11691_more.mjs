// sv11691_more.mjs — SV-11691 other invoices: customer Invoices tab (Open only) + Balance header vs A/R Aging Summary.
// Usage: TZ=<zone> node sv11691_more.mjs <HD|LB> <customerId> <customerName> <invoiceNo,...> [arDetailGroupRegex]. SECRET-FREE.
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const [L, CUS, NAME, INV, GRP] = process.argv.slice(2); const loc = LOC[L]; const T = 'SV-11691'; const invs = INV.split(',');
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/dashboard' });
const P = { app_version, location: loc.name, customer: NAME, invoices: invs, rule99_start: rule99 };
const slug = NAME.replace(/[^A-Za-z]+/g, '-').toLowerCase().slice(0, 30);
await page.goto(`${APP}/customers/${CUS}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
await page.locator('.q-tab').filter({ hasText: /^Invoices/ }).first().click(); await sleep(7000);
const toggle = page.locator('.q-toggle').filter({ hasText: /Open only/i }).first(); P.open_only = await toggle.getAttribute('aria-checked').catch(() => null);
const rows = (await page.locator('tbody tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
P.rows = rows.filter(r => invs.some(i => r.includes(i))); P.all_rows_count = rows.length;
P.balance = (await page.locator('main').innerText()).split('\n').filter(l => /^Balance/i.test(l.trim())).slice(0, 2);
P.disabled = await page.locator('tbody tr').evaluateAll((trs, invs) => trs.filter(tr => invs.some(i => tr.innerText.includes(i))).map(tr => tr.querySelector('.q-checkbox')?.getAttribute('aria-disabled')), invs);
P.pic_invoices = await shot(page, T, `6-${slug}-invoices-open-only`, { fullPage: true });
await page.goto(APP + '/reports/ar-aging-summary', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
P.ar_summary = (await page.locator('tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim()).filter(r => r.startsWith(NAME));
const r2 = page.locator('tr').filter({ hasText: NAME }).first(); if (await r2.count()) { await r2.scrollIntoViewIfNeeded(); await sleep(800); }
P.pic_ar = await shot(page, T, `7-${slug}-ar-aging-summary`);
if (GRP) {
  await page.goto(APP + '/reports/ar-aging-detail', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
  for (const g of GRP.split('|')) { await page.getByText(new RegExp(g)).first().click().catch(() => {}); await sleep(4000); }
  const all = (await page.locator('tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
  P.ar_detail_zz = all.filter(r => /ZZAUTOTEST/.test(r)); P.ar_detail_groups = all.filter(r => /days past due|Current \(/.test(r));
  const z = page.locator('tr').filter({ hasText: 'ZZAUTOTEST QA11839 Credit' }).first(); if (await z.count()) { await z.scrollIntoViewIfNeeded(); await sleep(800); }
  P.pic_ar_detail = await shot(page, T, '8-ar-aging-detail-zzautotest-credit');
}
P.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-${slug}.json`, JSON.stringify({ ticket: T, ...P }, null, 1));
console.log(JSON.stringify({ open: P.open_only, rows: P.rows, bal: P.balance, dis: P.disabled, ar: P.ar_summary, zz: P.ar_detail_zz, groups: P.ar_detail_groups, r99: P.rule99_end.all_match }).slice(0, 3000));
await browser.close();
