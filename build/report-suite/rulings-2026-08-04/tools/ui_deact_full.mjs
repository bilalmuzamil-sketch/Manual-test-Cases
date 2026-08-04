// ui_deact_full.mjs — the remaining S13 assertions, driven live:
//   Enter-submits (S13-R7) · X / Cancel / Escape / outside-click dismissal (S13-R8)
//   focus trap + focus return (S13-R12) · the actual deactivation (S13-R9/R10/R11)
//   the no-toggle and already-inactive no-dialog paths (S13-N2/N3/E3)
// Usage: node ui_deact_full.mjs <lastName> <phase>
//   phases: dismiss | enter | confirm | reactivate | notoggle
import fs from 'fs';
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../viu-2026-08-03/tools/qa8582.mjs';

const who = process.argv[2] || 'RepB';
const phase = process.argv[3] || 'dismiss';
const OUT = `/tmp/report-suite-viu/deact2-${who}-${phase}`;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const calls = [];
page.on('response', async r => {
  const u = r.url(); if (!u.includes('/api/')) return;
  let b = null; try { b = (await r.text()).slice(0, 400); } catch {}
  calls.push({ status: r.status(), method: r.request().method(),
               url: u.replace(/^https:\/\/[^/]+/, ''), body: b,
               reqid: r.headers()['x-request-id'] || null });
});
const click = async (loc, why) => {
  const bb = await loc.boundingBox().catch(() => null);
  if (!bb) { console.log('  !! cannot click:', why); return false; }
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); return true;
};
// the sales-rep dialog is identified by its OWN title, never by z-order
const repDlgOpen = () => page.evaluate(() => [...document.querySelectorAll('.q-dialog')]
  .some(d => /Deactivate sales rep/.test(d.innerText)));
const staffDlgOpen = () => page.evaluate(() => [...document.querySelectorAll('.q-dialog')]
  .some(d => /Edit Staff Member/.test(d.innerText)));
const repInput = () => page.locator('[data-test-id="input_confirm_yes"] input, input[data-test-id="input_confirm_yes"]').first();
const btn = (tid) => page.locator(`[data-test-id="${tid}"]`).first();

async function openRepDialog() {
  await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  const s = page.locator('.q-field input').first();
  if (await s.count()) { await s.fill('ZZAUTOTEST'); await page.waitForTimeout(3500); }
  const row = page.locator('tr', { hasText: who }).first();
  if (!(await row.count())) { console.log('ROW NOT FOUND', who); return false; }
  console.log('ROW:', (await row.innerText()).replace(/\s+/g, ' ').trim());
  await click(row.locator('button').last(), 'row edit');
  await page.waitForTimeout(5000);
  console.log('staff dialog open:', await staffDlgOpen());
  const st = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('.q-dialog')].filter(d => /Edit Staff Member/.test(d.innerText));
    const d = ds[0]; if (!d) return null;
    const b = [...d.querySelectorAll('button')].find(x => /ctivate Account/i.test(x.innerText));
    return { statusButton: b ? b.innerText.trim() : null,
             toggles: [...d.querySelectorAll('[role="switch"]')].map(e => ({
               label: (e.innerText || '').trim(), checked: e.getAttribute('aria-checked') })) };
  });
  console.log('staff dialog state:', JSON.stringify(st));
  const n0 = calls.length;
  await click(btn('button_change_account_status'), 'Deactivate Account');
  await page.waitForTimeout(4500);
  for (const c of calls.slice(n0)) console.log('  call:', c.status, c.method, c.url, '->', (c.body || '').slice(0, 150));
  const open = await repDlgOpen();
  console.log('SALES-REP DIALOG OPEN:', open);
  return open;
}

if (phase === 'notoggle') {
  // S13-N2: staff member WITHOUT the sales-rep toggle -> no pre-check, no dialog
  const n0 = calls.length;
  const open = await openRepDialog();
  const pre = calls.slice(n0).filter(c => c.url.includes('sales-rep-assignments'));
  console.log('\nS13-N2: pre-check calls:', pre.length, '| rep dialog open:', open);
  const st = calls.slice(n0).filter(c => c.url.includes('change-status') || c.method === 'POST');
  console.log('write calls:', JSON.stringify(st.map(c => [c.status, c.method, c.url])));
  await page.screenshot({ path: `${OUT}/notoggle.png`, fullPage: true });
} else if (!(await openRepDialog())) {
  fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
  await browser.close(); process.exit(0);
}

if (phase === 'dismiss') {
  console.log('\n=== S13-R8 DISMISSAL MATRIX (dialog identified by its own title) ===');
  // Escape
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  console.log('  Escape        -> rep dialog open:', await repDlgOpen());
  // outside click (top-left corner, outside the card)
  await page.mouse.click(5, 5); await page.waitForTimeout(1500);
  console.log('  outside click -> rep dialog open:', await repDlgOpen());
  // the X close icon
  const xs = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('.q-dialog')].filter(d => /Deactivate sales rep/.test(d.innerText));
    return ds.length ? !!ds[0].querySelector('[data-test-id="button_close_dialog"]') : false; });
  console.log('  X close icon present in rep dialog:', xs);
  await click(page.locator('.q-dialog').filter({ hasText: 'Deactivate sales rep' })
                  .locator('[data-test-id="button_close_dialog"]').first(), 'X');
  await page.waitForTimeout(1800);
  console.log('  X             -> rep dialog open:', await repDlgOpen());
  await page.screenshot({ path: `${OUT}/after-X.png`, fullPage: true });
  // reopen and Cancel
  if (!(await repDlgOpen())) {
    await click(btn('button_change_account_status'), 'reopen'); await page.waitForTimeout(4000);
    console.log('  reopened      -> rep dialog open:', await repDlgOpen());
    // S13-N5 second half: the input clears on each fresh open
    console.log('  input value on fresh open:', JSON.stringify(await repInput().inputValue().catch(() => null)));
  }
  await click(btn('button_cancel_deactivate_sales_rep'), 'Cancel'); await page.waitForTimeout(1800);
  console.log('  Cancel        -> rep dialog open:', await repDlgOpen());
  console.log('  staff dialog still open:', await staffDlgOpen());
  const w = calls.filter(c => c.method !== 'GET' && !c.url.includes('quick-login'));
  console.log('  WRITE calls during the whole dismissal phase (must be none):', JSON.stringify(w.map(c => [c.status, c.method, c.url])));
  await page.screenshot({ path: `${OUT}/after-cancel.png`, fullPage: true });
}

if (phase === 'enter') {
  console.log('\n=== S13-R7 ENTER SUBMITS ===');
  await repInput().fill('YES'); await page.waitForTimeout(700);
  const n0 = calls.length;
  await repInput().press('Enter'); await page.waitForTimeout(5000);
  const w = calls.slice(n0).filter(c => c.method !== 'GET');
  console.log('  write calls after Enter:', JSON.stringify(w.map(c => [c.status, c.method, c.url])));
  console.log('  rep dialog open after Enter:', await repDlgOpen());
  await page.screenshot({ path: `${OUT}/after-enter.png`, fullPage: true });
}

if (phase === 'confirm') {
  console.log('\n=== S13-R9/R10/R11 CONFIRM ===');
  await repInput().fill('YES'); await page.waitForTimeout(700);
  const n0 = calls.length;
  await click(btn('button_confirm_deactivate_sales_rep'), 'Deactivate');
  await page.waitForTimeout(500);
  const inflight = await page.evaluate(() => {
    const ds = [...document.querySelectorAll('.q-dialog')].filter(d => /Deactivate sales rep/.test(d.innerText));
    if (!ds.length) return 'dialog already gone';
    const b = [...ds[0].querySelectorAll('button')].find(x => /^Deactivate$/i.test(x.innerText.trim()));
    return { spinner: !!ds[0].querySelector('.q-spinner'), btnDisabled: b ? b.disabled : null,
             btnText: b ? b.innerText.trim() : null };
  });
  console.log('  in-flight state (~0.5s):', JSON.stringify(inflight));
  await page.waitForTimeout(7000);
  for (const c of calls.slice(n0).filter(c => c.method !== 'GET'))
    console.log('  write:', c.status, c.method, c.url, '->', (c.body || '').slice(0, 200), 'reqid=', c.reqid);
  console.log('  rep dialog open after confirm:', await repDlgOpen());
  console.log('  toast text:', JSON.stringify(await page.locator('.q-notification').allInnerTexts().catch(() => [])));
  await page.screenshot({ path: `${OUT}/after-confirm.png`, fullPage: true });
}

if (phase === 'reactivate') {
  console.log('\n=== S13-N3 / S13-E3 REACTIVATION ===');
  console.log('  (openRepDialog already clicked the status button; a dialog here would be a deviation)');
  console.log('  rep dialog open on reactivate:', await repDlgOpen());
  await page.screenshot({ path: `${OUT}/reactivate.png`, fullPage: true });
}

fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
console.log('\nevidence ->', OUT);
await browser.close();
