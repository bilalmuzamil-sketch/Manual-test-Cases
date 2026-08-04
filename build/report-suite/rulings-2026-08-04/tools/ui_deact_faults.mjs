// ui_deact_faults.mjs — the two fault paths of Story 13, driven with Playwright request
// interception. The cases themselves say "force the request to fail (go offline just before
// submitting)" / "cut the network exactly when toggling active off", so injecting the failure at the
// network layer IS the method the case prescribes - it is simply done deterministically instead of by
// yanking a cable. Every verdict here is labelled FAULT-INJECTED in the findings.
//
//   precheck : abort GET .../sales-rep-assignments  -> S13-N4 / C30260
//   submit   : make POST /api/iam/change-status fail -> S13-N5 / C30259
// Usage: node ui_deact_faults.mjs <lastName> <precheck|submit>
import fs from 'fs';
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../viu-2026-08-03/tools/qa8582.mjs';

const who = process.argv[2] || 'RepB';
const mode = process.argv[3] || 'precheck';
const OUT = `/tmp/report-suite-viu/fault-${who}-${mode}`;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const calls = [];
page.on('response', async r => {
  const u = r.url(); if (!u.includes('/api/')) return;
  let b = null; try { b = (await r.text()).slice(0, 300); } catch {}
  calls.push({ status: r.status(), method: r.request().method(),
               url: u.replace(/^https:\/\/[^/]+/, ''), body: b });
});

// ---- the injected fault ----
if (mode === 'precheck') {
  await page.route('**/sales-rep-assignments', route => route.abort('failed'));
  console.log('FAULT INJECTED: GET .../sales-rep-assignments will be aborted');
} else {
  await page.route('**/api/iam/change-status', route => route.fulfill({
    status: 500, contentType: 'application/json',
    body: JSON.stringify({ errors: [{ error: "An error occurred. We're sorry for this inconvenience, please try again a bit later later." },
                                    { requestId: 'ZZAUTOTEST-FAULT-INJECTED-0001' }] }) }));
  console.log('FAULT INJECTED: POST /api/iam/change-status will return HTTP 500');
}

const click = async (loc, why) => {
  const bb = await loc.boundingBox().catch(() => null);
  if (!bb) { console.log('  !! cannot click:', why); return false; }
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); return true;
};
const repDlg = () => page.evaluate(() => {
  const d = [...document.querySelectorAll('.q-dialog')].find(x => /Deactivate sales rep/.test(x.innerText));
  if (!d) return null;
  return { text: d.innerText.replace(/\s+/g, ' ').trim(),
           paragraphs: [...d.querySelectorAll('p')].map(p => p.innerText.trim()),
           hasInput: !!d.querySelector('[data-test-id="input_confirm_yes"]'),
           buttons: [...d.querySelectorAll('button')].map(b => ({ t: b.innerText.trim(), dis: b.disabled })) };
});

await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);
await page.locator('.q-field input').first().fill('ZZAUTOTEST');
await page.waitForTimeout(3500);
const row = page.locator('tr', { hasText: who }).first();
if (!(await row.count())) { console.log('ROW NOT FOUND', who); await browser.close(); process.exit(3); }
await click(row.locator('button').last(), 'row edit');
await page.waitForTimeout(5000);

const statusBefore = await page.evaluate(() => {
  const d = [...document.querySelectorAll('.q-dialog')].find(x => /Edit Staff Member/.test(x.innerText));
  const b = d && [...d.querySelectorAll('button')].find(x => /ctivate Account/i.test(x.innerText));
  return b ? b.innerText.trim() : null;
});
console.log('status button BEFORE:', statusBefore);

const n0 = calls.length;
await click(page.locator('[data-test-id="button_change_account_status"]').first(), 'Deactivate Account');
await page.waitForTimeout(5000);
console.log('calls after clicking the status button:');
for (const c of calls.slice(n0)) console.log('  ', c.status, c.method, c.url, '->', (c.body || '').slice(0, 130));

const d1 = await repDlg();
console.log('\nREP DIALOG:', JSON.stringify(d1, null, 1));
const allDlg = await page.evaluate(() => [...document.querySelectorAll('.q-dialog')].map(d => ({
  txt: d.innerText.replace(/\s+/g, ' ').trim().slice(0, 260),
  spinner: !!d.querySelector('.q-spinner'),
  loadingId: !!d.querySelector('[data-test-id="loading_sales_rep_assignments"]'),
  visible: d.offsetParent !== null })));
console.log('ALL DIALOGS ON SCREEN:', JSON.stringify(allDlg, null, 1));
await page.screenshot({ path: `${OUT}/01-dialog.png`, fullPage: true });

if (mode === 'precheck') {
  console.log('\n=== S13-N4 (C30260) ===');
  console.log('  dialog opened despite the failed pre-check:', !!d1);
  console.log('  type-to-confirm gate still present:', d1 ? d1.hasInput : false);
  console.log('  body paragraph(s):', JSON.stringify(d1 ? d1.paragraphs : null));
  const wrote = calls.slice(n0).filter(c => c.method === 'POST' && c.url.includes('change-status'));
  console.log('  silent deactivation happened:', wrote.length > 0);
}

if (mode === 'submit') {
  console.log('\n=== S13-N5 (C30259) ===');
  await page.locator('[data-test-id="input_confirm_yes"] input').first().fill('YES');
  await page.waitForTimeout(600);
  const n1 = calls.length;
  await click(page.locator('[data-test-id="button_confirm_deactivate_sales_rep"]').first(), 'Deactivate');
  await page.waitForTimeout(7000);
  for (const c of calls.slice(n1)) console.log('  ', c.status, c.method, c.url, '->', (c.body || '').slice(0, 160));
  const toasts = await page.evaluate(() => [...document.querySelectorAll('.q-notification')]
    .map(n => ({ text: n.innerText.replace(/\s+/g, ' ').trim(),
                 cls: String(n.className).slice(0, 90) })));
  console.log('  TOASTS:', JSON.stringify(toasts, null, 1));
  console.log('  rep dialog still open:', !!(await repDlg()));
  await page.screenshot({ path: `${OUT}/02-toast.png`, fullPage: true });
  // the input must clear on a fresh open
  await click(page.locator('[data-test-id="button_cancel_deactivate_sales_rep"]').first(), 'Cancel');
  await page.waitForTimeout(1500);
  await click(page.locator('[data-test-id="button_change_account_status"]').first(), 'reopen');
  await page.waitForTimeout(4000);
  const v = await page.locator('[data-test-id="input_confirm_yes"] input').first().inputValue().catch(() => null);
  console.log('  confirmation input on fresh reopen:', JSON.stringify(v));
}

fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
console.log('\nevidence ->', OUT);
await browser.close();
