// sv12199.mjs — SV-12199 on screen at Staging Heavy Duty - 9919 (TZ=America/Edmonton): WO Finance (Terms COD) → customer edit → Credit Terms Net 30 → Save
// → WO Finance again. The export is read by exp.mjs. SECRET-FREE.
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05'; const T = 'SV-12199';
const R = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')).T12199;
const { browser, page, rule99, app_version } = await boot(LOC.HD, { dest: '/workorders' });
const posts = []; page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('/api/customers')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '/api')} credit_term=${(() => { try { return JSON.parse(r.request().postData()).credit_term; } catch { return '?'; } })()}`); });
const P = { app_version, rule99_start: rule99, wo: R.display };
const finance = async label => { await page.goto(`${APP}/workorders/${R.wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
  const t = (await page.locator('.q-page').first().innerText()).replace(/\s+/g, ' '); P[`finance_${label}`] = { terms: (t.match(/Terms\s+(\S+(?: \d+)?)/) || [])[1], invoice_date: (t.match(/Invoice date:\s*([A-Z][a-z]{2} \d+, \d{4})/) || [])[1], due_date: (t.match(/Due date:\s*([A-Z][a-z]{2} \d+, \d{4})/) || [])[1] };
  P[`pic_finance_${label}`] = await shot(page, T, `${label === 'before' ? '1' : '3'}-work-order-finance-${label}`); };
await finance('before');
await page.goto(`${APP}/customers/${R.company_id}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
await page.locator('button').filter({ has: page.locator('i', { hasText: 'edit_note' }) }).first().click(); await sleep(3000);
const dlg = page.locator('.q-dialog').last(); P.term_before = await dlg.locator('[data-test-id="select_customer_credit_term"]').innerText().catch(() => null);
await dlg.locator('[data-test-id="select_customer_credit_term"]').click(); await sleep(1000);
await page.locator('.q-menu .q-item').filter({ hasText: /^\s*Net 30\s*$/ }).first().click(); await sleep(1000);
P.term_chosen = await dlg.locator('[data-test-id="select_customer_credit_term"]').innerText().catch(() => null);
P.pic_dialog = await shot(page, T, '2-customer-credit-terms-net30');
await dlg.locator('button').filter({ hasText: /^\s*Save\s*$/ }).first().click(); await sleep(6000);
P.toasts = await page.locator('.q-notification').allInnerTexts().catch(() => []);
await finance('after');
P.posts = posts; P.rule99_end = await finish(page, LOC.HD, rule99);
fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(`${OUT}/${T}/screen-steps.json`, JSON.stringify(P, null, 1));
console.log(JSON.stringify({ before: P.finance_before, term_before: P.term_before, chosen: P.term_chosen, posts, after: P.finance_after, r99: P.rule99_end.all_match, v: app_version }));
await browser.close();
