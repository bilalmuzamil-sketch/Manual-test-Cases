/** 16 Oct 2026 (batch 40) — the Settings > Staff screen's own delete for the C368191 person with logged labor ("ZZAUTOTEST Gone B Tech
 *  26846"), as a person would try it (picture + the answer word for word); plus, for C97012 step 9, the Admin's own screen of Bravo Co
 *  (S2-36541) showing its Lead Technician. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, toasts } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = { exit: (await a.post('/api/exit-switch-user', {})).status };
const shot = (n: string) => p.screenshot({ path: path.join(EV, n + '.png') }).catch(() => {});
await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await shot('C368191-b40-staff-0');
o.searchUi = await p.evaluate(`[...document.querySelectorAll('input')].map(i => (i.getAttribute('placeholder') || '') + '|' + (i.getAttribute('data-test-id') || '') + '|' + i.type).slice(0, 8)`);
const box = p.locator('[data-test-id="page_search_input"], input[placeholder*="Search" i], input[type=search]').first();
if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').first().click().catch(async () => { await p.getByText(/^\s*Search\s*$/).first().click().catch(() => {}); }); await p.waitForTimeout(800); }
await box.fill('26846').catch((e) => { o.fillErr = String(e).slice(0, 80); }); await p.waitForTimeout(3500);
await p.getByText(/^\s*Deactivated\s*\(/).first().click().catch(() => {}); await p.waitForTimeout(3000); /* 16 Oct second go: the search matches one name field, and this person is deactivated (R3) */
const row = p.locator('tbody tr').filter({ hasText: '26846' }).first(); o.rowFound = await row.count(); o.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
o.controls = await row.evaluate((r) => [...r.querySelectorAll('button, i, a')].map((e: any) => `${e.getAttribute('data-test-id') || ''}=${(e.innerText || e.getAttribute('aria-label') || '').trim()}${e.disabled || e.getAttribute('aria-disabled') === 'true' ? '(off)' : ''}`)).catch(() => null);
await row.hover().catch(() => {}); await p.waitForTimeout(800); await shot('C368191-b40-staff-row');
const del = row.locator('button, i').filter({ hasText: /delete/i }).first(); o.deleteControl = await del.count();
if (!o.deleteControl) { await row.click().catch(() => {}); await p.waitForTimeout(3000); o.afterRowClick = p.url().replace(APP, ''); o.dialogButtons = (await p.locator('.q-dialog:visible button, button:visible').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 30); await shot('C368191-b40-staff-edit'); 
  const d2 = p.locator('.q-dialog:visible button, button:visible').filter({ hasText: /^\s*(Delete|Remove)( Staff( Member)?)?\s*$/i }).first(); o.deleteInEdit = await d2.count();
  if (o.deleteInEdit) { await d2.click().catch(() => {}); await p.waitForTimeout(1500); const cf = p.locator('.q-dialog:visible').last(); o.question = (await cf.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await cf.locator('button').filter({ hasText: /Delete|Yes|Confirm|Remove/i }).last().click().catch(() => {}); await p.waitForTimeout(2500); o.answer = await toasts(p); await shot('C368191-b40-staff-delete-answer'); } }
else { await del.click().catch(() => {}); await p.waitForTimeout(1500); const cf = p.locator('.q-dialog:visible').last(); o.question = (await cf.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await cf.locator('button').filter({ hasText: /Delete|Yes|Confirm|Remove/i }).last().click().catch(() => {}); await p.waitForTimeout(2500); o.answer = await toasts(p); await shot('C368191-b40-staff-delete-answer'); }
// C97012 step 9 on the Admin's screen
const w = (await workOrders(a, 'ZZAUTOTEST F3 Stale Drop 67073')).map((x: any) => ({ id: x.id, n: x.number, s: x.status, lead: `${x.techAssignedFirstName ?? ''} ${x.techAssignedLastName ?? ''}`.trim() })); o.c97012 = w;
const b = w.find((x: any) => x.n === 'S2-36541'); if (b) { await p.goto(`${APP}/workorders/${b.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await shot('C97012-2p-s9-admin-bravo'); }
fs.writeFileSync(path.join(EV, 'C368191-screen.json'), JSON.stringify(o, null, 1)); console.log(t(), 'SCREEN', JSON.stringify(o).slice(0, 4000)); await done(browser);
