/** staff-ui-1023.mts — 23 Oct 2026, PRODUCTION. C707077 unblock: walk Settings > Staff on SCREEN. (1) list the page's buttons and the
 *  requests it makes; (2) open the add-staff dialog and read its fields; (3) open Carol Neal's edit dialog and read its fields (is there a
 *  per-location / multi-location choice?). Nothing is saved. Every API request (method, url, body) is logged to EV/staff-ui-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/settings/staff'); const o: any = { req: [] };
p.on('request', (r) => { if (/\/api\//.test(r.url()) && !/view-avatar|fe-permissions/.test(r.url())) o.req.push(`${r.method()} ${r.url().replace(/^https?:\/\/[^/]+/, '')} ${(r.postData() || '').slice(0, 300)}`); });
const fields = () => p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog, [role=dialog]')].pop() || document.body;
  return { text: d.innerText.slice(0, 1500), labels: [...d.querySelectorAll('label, .q-field__label, [aria-label], [data-test-id]')].map(e => (e.getAttribute('data-test-id') || '') + ' | ' + (e.getAttribute('aria-label') || '') + ' | ' + (e.innerText || '').trim().slice(0, 60)).slice(0, 80) }; })()`);
try {
  await p.waitForTimeout(6000); o.url = p.url(); await shot(p, 'staff-ui-1023-page');
  o.buttons = await p.evaluate(`[...document.querySelectorAll('button, .q-btn, a.q-btn')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.getAttribute('data-test-id') || '') + ' | ' + b.innerText.trim().slice(0, 40))`);
  const add = p.locator('button, .q-btn').filter({ hasText: /^\s*(\+\s*)?(Add|New|Invite)/i }).first();
  if (await add.count()) { await add.click(); await p.waitForTimeout(3000); o.addDialog = await fields(); await shot(p, 'staff-ui-1023-add'); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); }
  const srch = p.locator('input[type=search], input[placeholder*="earch"]').first();
  if (await srch.count()) { await srch.fill('Carol Neal'); await p.waitForTimeout(3000); }
  const row = p.locator('tr, .q-item').filter({ hasText: 'Carol Neal' }).first(); o.rowText = await row.innerText().catch(() => null);
  await row.click().catch(() => {}); await p.waitForTimeout(3000); o.afterRowUrl = p.url(); o.edit = await fields(); await shot(p, 'staff-ui-1023-carol');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'staff-ui-1023.json'), JSON.stringify(o, null, 1)); console.log(t(), 'STAFFUI', JSON.stringify(o).slice(0, 9000)); await done(browser);
