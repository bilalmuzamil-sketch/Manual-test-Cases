// ui_deactivate_rep.mjs — drive the staff-administration sales-rep DEACTIVATION flow live and
// capture the dialog's REAL on-screen text, the pre-check call, the type-YES gate behaviour and the
// dismissal paths. This is the live half of Ruling 1 for SBR-DEACT-02..09 + SBR-API-06.
//
// Usage: node ui_deactivate_rep.mjs "<staff last name>"      e.g. "RepB"
//        node ui_deactivate_rep.mjs "RepB" --confirm         also completes the deactivation
import fs from 'fs';
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../viu-2026-08-03/tools/qa8582.mjs';

const who = process.argv[2] || 'RepB';
const doConfirm = process.argv.includes('--confirm');
const OUT = `/tmp/report-suite-viu/deact-${who}`;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const calls = [];
page.on('response', async r => {
  const u = r.url();
  if (!u.includes('/api/')) return;
  let b = null; try { b = (await r.text()).slice(0, 400); } catch {}
  calls.push({ status: r.status(), method: r.request().method(), url: u.replace(/^https:\/\/[^/]+/, ''), body: b });
});
const click = async (loc, why) => {
  const bb = await loc.boundingBox().catch(() => null);
  if (!bb) { console.log('  !! cannot click:', why); return false; }
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  return true;
};
const dlg = () => page.locator(".q-dialog:visible").last();
const dlgText = async () => (await dlg().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();

await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);
console.log('url:', page.url());

// search for the staff member
const search = page.locator('input[type="search"], input[aria-label*="Search"], .q-field input').first();
if (await search.count()) { await search.fill('ZZAUTOTEST'); await page.waitForTimeout(3500); }
await page.screenshot({ path: `${OUT}/01-staff-list.png`, fullPage: true });

const row = page.locator('tr', { hasText: who }).first();
if (!(await row.count())) {
  console.log('ROW NOT FOUND for', who);
  console.log('BODY:', (await page.locator('body').innerText()).replace(/\n+/g, ' | ').slice(0, 2500));
  await browser.close(); process.exit(3);
}
console.log('ROW:', (await row.innerText()).replace(/\s+/g, ' ').trim());

// There is NO active toggle in the staff list row on this build. The active-status control is a
// BUTTON labelled "Deactivate account" inside the staff EDIT dialog (StaffDialog,
// data-test-id-suffix="change_account_status"). Open the row's edit dialog first.
// the row carries an explicit edit icon-button (renders as the text "edit_note")
let opened = false;
for (const sel of ['button:has-text("edit_note")', '[data-test-id*="edit"]', 'button .q-icon', 'button', 'i.q-icon']) {
  const b = row.locator(sel).last();
  if (await b.count()) { opened = await click(b, 'row edit via ' + sel); if (opened) break; }
}
console.log('opening staff edit dialog ->', opened);
await page.waitForTimeout(5000);
await page.screenshot({ path: `${OUT}/01b-staff-dialog.png`, fullPage: true });
const sd = page.locator('.q-dialog:visible').first();
console.log('staff dialog open:', (await sd.count()) > 0);
const sdBtns = await page.evaluate(() => [...document.querySelectorAll('.q-dialog button')]
  .map(b => ({ text: b.innerText.trim(), aria: b.getAttribute('aria-label'),
               testid: b.getAttribute('data-test-id') || b.getAttribute('data-test-id-suffix') })));
console.log('staff dialog buttons:', JSON.stringify(sdBtns));
// read the sales-rep toggle state shown in the dialog
const repToggle = await page.evaluate(() => {
  const d = document.querySelector('.q-dialog'); if (!d) return null;
  const els = [...d.querySelectorAll('[role="switch"], .q-toggle')];
  return els.map(e => ({ label: (e.innerText || e.getAttribute('aria-label') || '').trim(),
                         checked: e.getAttribute('aria-checked') }));
});
console.log('toggles inside staff dialog:', JSON.stringify(repToggle));

const preCount = calls.length;
const deact = page.locator('.q-dialog button').filter({ hasText: /Deactivate account/i }).first();
console.log('clicking "Deactivate account" ->', await click(deact, 'Deactivate account'));
await page.waitForTimeout(4500);

const precheck = calls.slice(preCount).filter(c => c.url.includes('sales-rep-assignments'));
console.log('\n=== PRE-CHECK CALLS ===');
for (const c of precheck) console.log(' ', c.status, c.method, c.url, '->', c.body);
const writes = calls.slice(preCount).filter(c => c.method !== 'GET');
console.log('=== NON-GET CALLS in the same window (should be NONE before confirm) ===');
for (const c of writes) console.log(' ', c.status, c.method, c.url, '->', (c.body || '').slice(0, 160));

await page.screenshot({ path: `${OUT}/02-dialog.png`, fullPage: true });
const open = await dlg().count();
console.log('\nDIALOG OPEN:', open > 0);
if (!open) {
  console.log('NO DIALOG APPEARED.');
  fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
  await browser.close(); process.exit(0);
}
console.log('DIALOG TEXT (verbatim):\n---8<---\n' + (await dlgText()) + '\n---8<---');
// the exact title element + body paragraph + input label + buttons
const parts = await page.evaluate(() => {
  const ds = [...document.querySelectorAll('.q-dialog')];
  const d = ds[ds.length - 1];
  if (!d) return null;
  const t = q => [...d.querySelectorAll(q)].map(e => e.innerText.trim()).filter(Boolean);
  return {
    headings: t('.text-h6, .q-card__section--vert:first-child, [class*="title"]'),
    paragraphs: t('p'),
    labels: t('label, .q-field__label'),
    buttons: [...d.querySelectorAll('button')].map(b => ({
      text: b.innerText.trim(), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true',
      title: b.getAttribute('title'), aria: b.getAttribute('aria-label') })),
    testids: [...d.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')),
  };
});
console.log('\nDIALOG PARTS:', JSON.stringify(parts, null, 1));

// ---- the type-YES gate: try each variant and read the Deactivate button's disabled state ----
const input = dlg().locator('input').first();
const btnState = async () => await page.evaluate(() => {
  const ds = [...document.querySelectorAll('.q-dialog')];
  const dd = ds[ds.length - 1];
  const b = [...dd.querySelectorAll('button')].find(x => /^Deactivate$/i.test(x.innerText.trim()));
  return b ? { text: b.innerText.trim(), disabled: b.disabled || b.getAttribute('aria-disabled') === 'true', title: b.getAttribute('title') } : null;
});
console.log('\n=== TYPE-YES GATE ===');
console.log('  (empty)          ->', JSON.stringify(await btnState()));
for (const v of ['no', 'yes', 'Yes', 'YES', '  YES  ', 'YeS']) {
  await input.fill(v); await page.waitForTimeout(700);
  console.log(`  ${JSON.stringify(v).padEnd(16)} ->`, JSON.stringify(await btnState()));
}
// autofocus check
const focused = await page.evaluate(() => {
  const a = document.activeElement;
  return a ? { tag: a.tagName, testid: a.getAttribute('data-test-id-suffix') || a.getAttribute('data-test-id'), type: a.getAttribute('type') } : null;
});
console.log('  activeElement:', JSON.stringify(focused));
await page.screenshot({ path: `${OUT}/03-yes-typed.png`, fullPage: true });

// ---- dismissal paths: Escape, outside click, then Cancel ----
console.log('\n=== DISMISSAL ===');
await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
console.log('  after Escape, dialog open:', (await dlg().count()) > 0);
await page.mouse.click(8, 8); await page.waitForTimeout(1200);
console.log('  after outside click, dialog open:', (await dlg().count()) > 0);

if (doConfirm) {
  await input.fill('YES'); await page.waitForTimeout(600);
  const b = page.locator('.q-dialog button').filter({ hasText: /^Deactivate$/ }).first();
  const n0 = calls.length;
  console.log('  clicking Deactivate ->', await click(b, 'Deactivate'));
  await page.waitForTimeout(6000);
  console.log('  CONFIRM-PHASE CALLS:');
  for (const c of calls.slice(n0).filter(c => c.method !== 'GET')) console.log('   ', c.status, c.method, c.url, '->', (c.body || '').slice(0, 200));
  console.log('  dialog open after confirm:', (await dlg().count()) > 0);
  await page.screenshot({ path: `${OUT}/04-after-confirm.png`, fullPage: true });
} else {
  const cancel = page.locator('.q-dialog button').filter({ hasText: /^Cancel$/ }).first();
  if (await cancel.count()) { console.log('  clicking Cancel ->', await click(cancel, 'Cancel')); await page.waitForTimeout(2500); }
  console.log('  after Cancel, dialog open:', (await dlg().count()) > 0);
  await page.screenshot({ path: `${OUT}/04-after-cancel.png`, fullPage: true });
}

fs.writeFileSync(`${OUT}/calls.json`, JSON.stringify(calls, null, 1));
fs.writeFileSync(`${OUT}/dialog-parts.json`, JSON.stringify(parts, null, 1));
console.log('\nevidence ->', OUT);
await browser.close();
