/** Make the named staff the Tech View cases need, then learn the screen's Deactivate route on "Ina Active" (2026-10-08). */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { EV, t, shot } from './wob.mts';
import { roleIds, person, HEAVY, LETH } from './staff.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
const roles = await roleIds(a);
console.log(t(), 'roles here', JSON.stringify(Object.keys(roles)));
const tech = roles['Technician'];
const office = roles['Office User'] ?? roles['Office'];
const tcu = roles['Time Clock User'] ?? roles['Time Clock'];
const D = '@staging.shopview.local';
const want: [string, string, any][] = [
  ['Aaron', 'Zed', { role: tech, email: 'zz.wob.aaron.zed' + D, clockable: true }],
  ['Aaron', 'Baker', { role: tech, email: 'zz.wob.aaron.baker' + D, clockable: true }],
  ['Brenda', 'Martinez', { role: tech, email: 'zz.wob.brenda.martinez' + D, clockable: true }],
  ['Chris', 'Lee', { role: tech, email: 'zz.wob.chris.lee.1' + D, clockable: true }],
  ['Chris', 'Lee', { role: tech, email: 'zz.wob.chris.lee.2' + D, clockable: true }],
  ['Esther', 'Howard', { role: tech, email: 'zz.wob.esther.howard' + D, clockable: true }],
  ['Billy', 'Nobill', { role: tech, email: 'zz.wob.billy.nobill' + D, clockable: true, billable: false }],
  ['Ina', 'Active', { role: tech, email: 'zz.wob.ina.active' + D, clockable: true }],
  ['Nick', 'Noclock', { role: tech, email: 'zz.wob.nick.noclock' + D, clockable: false }],
  ['Olive', 'Office', { role: office, email: 'zz.wob.olive.office' + D, clockable: true }],
  ['Tim', 'Clockuser', { role: tcu, email: 'zz.wob.tim.clockuser' + D, clockable: true }],
  ['Ella', 'Elsewhere', { role: tech, email: 'zz.wob.ella.elsewhere' + D, clockable: true, workplace: LETH }],
  ['Ralph', 'Edwards', { role: tech, email: 'zz.wob.ralph.edwards' + D, clockable: true }],
  ['Maximiliana', 'Fitzgerald-Montgomery', { role: tech, email: 'zz.wob.maximiliana' + D, clockable: true }],
];
const out: any = { roles: { tech, office, tcu }, people: {} };
for (const [f, l, o] of want) {
  if (!o.role) { out.people[o.email] = 'NO ROLE FOUND'; continue; }
  const r = await person(a, f, l, o);
  out.people[o.email] = { name: `${f} ${l}`, staff_id: r.row?.staff_id, active: r.row?.is_active, role: r.row?.role_label, clockable: r.row?.clockable, billable: r.row?.billable, workplace: r.row?.defaultWorkplaceName, log: r.log };
  console.log(t(), `${f} ${l}`, JSON.stringify(out.people[o.email]));
}
const c = await candidates(a);
out.eligibleNow = c.map((x) => x.name).filter((n) => want.some(([f, l]) => `${f} ${l}` === n));
console.log(t(), 'eligible now', JSON.stringify(out.eligibleNow));
// the Deactivate route, learned on "Ina Active" through the screen
const calls: string[] = []; p.on('request', (q) => { if (q.method() !== 'GET' && /\/api\//.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 200)}`); });
await p.goto(APP + '/settings', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
out.settingsLinks = await p.evaluate(`[...document.querySelectorAll('a, .q-item')].map(e => e.innerText.trim()).filter(x => /staff|team|employee|user/i.test(x)).slice(0, 10)`);
await p.locator('a, .q-item').filter({ hasText: /^\s*Staff\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(4000);
out.staffUrl = p.url().replace(APP, '');
const box = p.locator('input[placeholder*="Search" i]').first(); if (await box.count()) { await box.fill('Ina Active'); await p.waitForTimeout(3000); }
await shot(p, 'staff-list-ina');
const rowIna = p.locator('tr, .q-item').filter({ hasText: 'Ina Active' }).first();
out.inaRowButtons = await rowIna.evaluate((e) => [...e.querySelectorAll('button, [role=button], i')].map((b) => (b.getAttribute('aria-label') || b.getAttribute('data-test-id') || b.textContent || '').trim()).filter(Boolean)).catch(() => null);
await rowIna.locator('button, [role=button]').filter({ hasText: /edit/i }).first().click().catch(async () => { await rowIna.click().catch(() => {}); });
await p.waitForTimeout(3000); await shot(p, 'staff-ina-edit');
out.editButtons = await p.evaluate(`[...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(0, 30)`);
const deact = p.locator('button').filter({ hasText: /Deactivate/i }).first();
if (await deact.count()) {
  await deact.click(); await p.waitForTimeout(1500); await shot(p, 'staff-ina-deactivate-confirm');
  out.confirmText = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ').slice(0, 300))`);
  const ok = p.locator('.q-dialog button').filter({ hasText: /Deactivate|Confirm|Yes|OK/i }).last(); if (await ok.count()) { await ok.click(); await p.waitForTimeout(3000); }
}
out.calls = calls;
out.inaAfter = (await (await import('./staff.mts')).staffRows(a, 'zz.wob.ina.active' + D)).map((x) => ({ active: x.is_active }));
console.log(t(), 'DEACTIVATE', JSON.stringify({ settingsLinks: out.settingsLinks, staffUrl: out.staffUrl, inaRowButtons: out.inaRowButtons, editButtons: out.editButtons, confirmText: out.confirmText, calls: out.calls, inaAfter: out.inaAfter }).slice(0, 3000));
fs.writeFileSync(path.join(EV, 'seed-staff.json'), JSON.stringify(out, null, 1));
await done(browser);
