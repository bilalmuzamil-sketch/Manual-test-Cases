// observe_deactivation.mjs — produce and observe the SBR "deactivate a sales rep with customer
// assignments" flow (Story 13) for real.
//
// The dialog keys off CUSTOMER assignments, not invoices — so it can be produced WITHOUT the broken
// invoice-creation path: assign a seeded rep to a customer, then deactivate that staff member in
// staff administration and watch what happens. Everything is snapshotted and restored.
//
// Proven live 2026-08-04:
//   customer record carries sales_rep_id  : GET  /api/customers/view/{id}?
//   update a customer                     : POST /api/customers/change {id, name, ...}
// SECRET-FREE. Usage:
//   node observe_deactivation.mjs --assign     assign a seeded rep to two customers
//   node observe_deactivation.mjs --observe    drive staff admin and capture the dialog
//   node observe_deactivation.mjs --restore    put the customers' original reps back
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl } from './reportlib.mjs';

const SNAP = '/tmp/report-suite-viu/deact-customers-snapshot.json';
const OUT = new URL('../evidence/deactivation/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const mode = process.argv.find(a => a.startsWith('--')) || '--assign';
const L = (...a) => console.log(...a);
const { sessCookie } = await login('admin');

const view = async id => (await api(sessCookie, 'GET', `/api/customers/view/${id}?`)).body?.data;

async function setRep(cust, repId) {
  // echo the record back with sales_rep_id changed; id + name are the required parameters
  const body = { id: cust.id, name: cust.name, sales_rep_id: repId,
    address_1: cust.address_1, address_2: cust.address_2, city: cust.city,
    state_or_province: cust.state_or_province, postal_code: cust.postal_code,
    email: cust.email, phone: cust.phone };
  return api(sessCookie, 'POST', '/api/customers/change', body);
}

if (mode === '--assign') {
  const reps = (await api(sessCookie, 'GET', '/api/sales-reps')).body.data.collection || [];
  const target = reps.find(r => r.name === 'Timothy Ortiz') || reps[0];
  L('target rep:', JSON.stringify(target));
  const customers = (await api(sessCookie, 'GET', '/api/customers?limit=4')).body.data.collection || [];
  const snap = [];
  for (const c of customers.slice(0, 2)) {
    const v = await view(c.id);
    snap.push({ id: c.id, name: c.name, original_sales_rep_id: v?.sales_rep_id ?? null });
    const r = await setRep({ ...c, ...v }, target.id);
    const after = await view(c.id);
    L('ASSIGN', c.name, '->', r.status, '| now rep id', after?.sales_rep_id,
      after?.sales_rep_id === target.id ? 'MATCH' : '*** did not take ***');
  }
  fs.writeFileSync(SNAP, JSON.stringify({ rep: target, customers: snap }, null, 1));
  L('snapshot ->', SNAP);
  process.exit(0);
}

if (mode === '--restore') {
  const s = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  for (const c of s.customers) {
    const v = await view(c.id);
    const r = await setRep({ id: c.id, name: c.name, ...v }, c.original_sales_rep_id);
    const after = await view(c.id);
    L('RESTORE', c.name, '->', r.status, '| now', after?.sales_rep_id,
      (after?.sales_rep_id ?? null) === (c.original_sales_rep_id ?? null) ? 'MATCH' : '*** MISMATCH ***');
  }
  process.exit(0);
}

// ---------------- --observe : drive staff administration ----------------
const s = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
const rec = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433', rep: s.rep };
const { browser, page } = await boot('admin');
const reqs = [];
page.on('request', r => { if (r.url().includes('/api/') && r.method() !== 'GET' && !r.url().includes('envelope')) reqs.push({ m: r.method(), u: r.url().replace(/^https:\/\/[^/]+/, ''), b: (r.postData() || '').slice(0, 400) }); });
page.on('response', r => { if (!r.url().includes('/api/')) return; const e = reqs.find(x => x.u === r.url().replace(/^https:\/\/[^/]+/, '') && x.s === undefined); if (e) e.s = r.status(); });

for (const route of ['/administration/staff', '/administration/users', '/administration/team']) {
  await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(9000);
  const txt = await page.locator('body').innerText().catch(() => '');
  if (/staff|team|users/i.test(txt) && !/not found|404/i.test(txt.slice(0, 300))) { rec.staffRoute = route; break; }
}
L('staff route:', rec.staffRoute, '| url', page.url());
await page.screenshot({ path: OUT + 'staff-list.png', fullPage: true });

// find the seeded rep's row and open it
const nameParts = s.rep.name.split(/\s+/).filter(Boolean);
const row = page.locator('tbody tr, .q-item').filter({ hasText: new RegExp(nameParts.join('.*'), 'i') }).first();
rec.rowFound = await row.count();
L('row for', s.rep.name, ':', rec.rowFound);
if (rec.rowFound) {
  await clickEl(page, row, 6000);
  await page.screenshot({ path: OUT + 'staff-detail.png', fullPage: true });
  rec.detailText = (await page.locator('body').innerText().catch(() => '')).slice(0, 4000);
  rec.toggles = await page.evaluate(() => Array.from(document.querySelectorAll('.q-toggle, .q-checkbox'))
    .filter(t => t.getClientRects().length)
    .map(t => ({ text: (t.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      checked: t.getAttribute('aria-checked') ?? (t.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') ? 'true' : 'false'),
      testId: t.getAttribute('data-test-id') })));
  L('TOGGLES:', JSON.stringify(rec.toggles, null, 1).slice(0, 1200));

  // the ACTIVE toggle is the deactivation trigger
  const act = page.locator('.q-toggle').filter({ hasText: /^Active$/i }).first();
  const target = (await act.count()) ? act
    : page.locator('.q-toggle').filter({ hasText: /active/i }).first();
  rec.activeToggleFound = await target.count();
  if (rec.activeToggleFound) {
    const before = reqs.length;
    await clickEl(page, target, 5000);
    rec.dialog = await page.evaluate(() => {
      const d = Array.from(document.querySelectorAll('.q-dialog')).filter(e => e.getClientRects().length)[0];
      if (!d) return null;
      const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
      return { text: txt(d).slice(0, 1500),
        buttons: Array.from(d.querySelectorAll('.q-btn')).map(b => txt(b)).filter(Boolean),
        inputs: Array.from(d.querySelectorAll('input')).map(i => ({ ph: i.getAttribute('placeholder'), aria: i.getAttribute('aria-label'), autofocus: i === document.activeElement })) };
    });
    rec.dialogRequests = reqs.slice(before);
    L('DIALOG:', JSON.stringify(rec.dialog, null, 1).slice(0, 1600));
    L('REQUESTS during toggle:'); rec.dialogRequests.forEach(r => L('  ', r.s, r.m, r.u.slice(0, 110), '|', r.b.slice(0, 260)));
    await page.screenshot({ path: OUT + 'deactivate-dialog.png', fullPage: true });
    // ALWAYS cancel — never actually deactivate
    const cancel = page.locator('.q-dialog .q-btn').filter({ hasText: /^(Cancel|Close)$/i }).first();
    if (await cancel.count()) { await clickEl(page, cancel, 3000); L('cancelled the dialog'); }
    else { await page.keyboard.press('Escape'); L('pressed Escape'); }
    rec.afterCancel = await page.evaluate(() => !!Array.from(document.querySelectorAll('.q-dialog')).filter(e => e.getClientRects().length)[0]);
    L('dialog still open after cancel/escape?', rec.afterCancel);
  }
}
rec.allRequests = reqs;
fs.writeFileSync(OUT + 'deactivation.json', JSON.stringify(rec, null, 1));
L('wrote', OUT + 'deactivation.json');
await browser.close();
