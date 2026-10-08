/** S3 Board View, batch C (2026-10-08): C96950 and C368131 again, now seeing the view-only person's own screen
 *  (viewas.mts), and moving Theresa Webb off this location through her staff form's Location field. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn } from './wob.mts';
import { staffRows } from './staff.mts';
import { viewAs } from './viewas.mts';
import { setStaffLocation } from './staffloc.mts';
import type { Page } from 'playwright';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), JW = await sid('jenny.wilson'), VO = await sid('viewonly');
const TW = (await staffRows(a, 'ayesha.khan@shopview.com')).find((x) => x.email === 'ayesha.khan@shopview.com');
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
R.clearedLeftoverSwitch = (await a.post('/api/exit-switch-user', {})).status;
// a stopped earlier attempt left Jenny Wilson deactivated: put her back first
if (JW && !JW.is_active) { R.jennyRestoredAtStart = (await a.post('/api/iam/change-status', { id: JW.id })).status; }
const bv = async (pg: Page, n: string) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, 'Board View'); if (n) await search(pg, n); };
const col = async (pg: Page, id: string) => { await toColumn(pg, id); return (await boardCols(pg)).find((c) => c.id === id) ?? null; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2000));
  fs.writeFileSync(path.join(EV, 's3-batchC.json'), JSON.stringify(R, null, 1));
}
const calls: string[] = []; p.on('request', (q) => { if (q.method() !== 'GET' && /\/api\/(staff|iam)/.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 300)}`); });
async function setLocation(email: string, loc: string) {
  calls.length = 0;
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
  await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill(email); await p.waitForTimeout(3000);
  await p.locator('tr').filter({ hasText: email.split('@')[0] }).first().locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500);
  const field = p.locator('.q-dialog .q-field').filter({ hasText: /^Location/ }).first();
  await field.click(); await p.waitForTimeout(1200);
  await p.locator('.q-menu .q-item, [role=option]').filter({ hasText: loc }).first().click(); await p.waitForTimeout(800);
  // close the list by clicking the form's title — Escape would close the whole form unsaved
  await p.locator('.q-dialog').getByText('Edit Staff Member', { exact: true }).click().catch(() => {}); await p.waitForTimeout(600);
  const shown = await field.innerText().catch(() => '');
  const errs = await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field--error, .q-dialog .q-field__messages')].map(e => e.innerText.trim()).filter(Boolean)`);
  await p.locator('.q-dialog button').filter({ hasText: /Save\s*&\s*Close/ }).first().click(); await p.waitForTimeout(3000);
  const stillOpen = await p.locator('.q-dialog').count();
  const toast = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 140))`);
  if (stillOpen) { await p.keyboard.press('Escape').catch(() => {}); await p.locator('.q-dialog button').filter({ hasText: /close/i }).first().click().catch(() => {}); }
  return { shown: shown.replace(/\s+/g, ' '), errs, stillOpen, toast, calls: [...calls] };
}

await run('C96950', async () => {
  const n = 'ZZAUTOTEST F2 Empty Columns';
  await seedCase(a, n, 'ZZF3EC', [{ lead: ES.staff_id }]);
  await bv(p, n);
  R.C96950 = { admin: { jenny: (await col(p, JW.staff_id))?.empty, unassigned: (await col(p, 'unassigned'))?.empty } }; await shot(p, 'C96950-admin');
  const v = await viewAs(browser, p, a, VO.id, me.id);
  try { await bv(v.page, n); R.C96950.viewOnly = { perms: v.perms, jenny: (await col(v.page, JW.staff_id))?.empty, unassigned: (await col(v.page, 'unassigned'))?.empty }; await shot(v.page, 'C96950-viewonly'); }
  finally { await v.close(); }
});

await run('C368131', async () => {
  const n = 'ZZAUTOTEST F2 Pinned Gone';
  const [w] = await seedCase(a, n, 'ZZF3PG', [{ lead: ES.staff_id }]);
  const prefs = async (aa = a) => (await aa.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
  const pinsBefore: string[] = (await prefs()).pinnedTechnicianIds ?? [];
  const ensurePins = async (pg: Page, ids: string[], on: boolean) => { await bv(pg, n); for (const id of ids) { if (await toColumn(pg, id)) { const b = pg.locator(`[data-test-id="button_board_pin_${id}"]`); if (((await b.getAttribute('aria-pressed')) === 'true') !== on) { await b.click(); await pg.waitForTimeout(1200); } } } };
  // both people start with Jenny Wilson and Theresa Webb pinned
  for (const id of pinsBefore) if (![JW.staff_id, TW.staff_id].includes(id)) await ensurePins(p, [id], false);
  await ensurePins(p, [JW.staff_id, TW.staff_id], true);
  { const v = await viewAs(browser, p, a, VO.id, me.id); try { await ensurePins(v.page, [JW.staff_id, TW.staff_id], true); } finally { await v.close(); } }
  // step 1: deactivate Jenny Wilson; step 2: take Staging Heavy Duty off Theresa Webb (her Location field)
  R.C368131 = { jennyDeactivate: (await a.post('/api/iam/change-status', { id: JW.id })).status };
  try { R.C368131.movedOff = await setStaffLocation(p, 'ayesha.khan', 'Staging Lethbridge'); } catch (e: any) { R.C368131.moveError = String(e.message).slice(0, 160); }
  R.C368131.ayeshaEligibleHere = (await candidates(a)).some((x) => x.name === 'Ayesha Khan');
  try {
    await bv(p, n);
    const cs = await boardCols(p);
    R.C368131.admin = cs.slice(0, 4).map((c) => `${c.name} pin:${c.pinned} count:${c.count} text:${c.empty}`); await shot(p, 'C368131-admin');
    // Esther Howard's card sits far to the right; pin her for the moment so her column stands next to the pinned ones
    await toColumn(p, ES.staff_id); await p.locator(`[data-test-id="button_board_pin_${ES.staff_id}"]`).click(); await p.waitForTimeout(1500);
    await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
    R.C368131.bothOnScreen = (await p.locator(`[data-test-id="board_column_${JW.staff_id}"]`).count()) > 0 && (await p.locator(`[data-test-id="board_card_${w.id}"]`).count()) > 0;
    if (R.C368131.bothOnScreen) { await drag(p, `[data-test-id="board_card_${w.id}"]`, `[data-test-id="board_column_${JW.staff_id}"]`, 120); await shot(p, 'C368131-after-drop-try'); }
    R.C368131.afterDrop = (await workOrders(a, n)).map((x: any) => `${x.number} lead=${x.techAssignedFirstName ?? '-'} ${x.techAssignedLastName ?? ''}`);
    R.C368131.toast = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 140))`);
    await toColumn(p, ES.staff_id); await p.locator(`[data-test-id="button_board_pin_${ES.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1200);
    const v = await viewAs(browser, p, a, VO.id, me.id);
    try { await bv(v.page, n); R.C368131.viewOnly = (await boardCols(v.page)).slice(0, 4).map((c) => `${c.name} pin:${c.pinned} text:${c.empty}`); await shot(v.page, 'C368131-viewonly'); }
    finally { await v.close(); }
  } finally {
    R.C368131.restore = { jenny: (await a.post('/api/iam/change-status', { id: JW.id })).status };
    try { R.C368131.restore.ayesha = await setStaffLocation(p, 'ayesha.khan', 'Staging Heavy Duty'); } catch (e: any) { R.C368131.restore.ayeshaError = String(e.message).slice(0, 160); }
    R.C368131.restoreRead = { jennyActive: (await sid('jenny.wilson'))?.is_active, ayeshaAt: (await staffRows(a, 'ayesha.khan@shopview.com'))[0]?.defaultWorkplaceName, ayeshaEligible: (await candidates(a)).some((x) => x.name === 'Ayesha Khan') };
    await ensurePins(p, [JW.staff_id, TW.staff_id], false).catch(() => {}); await ensurePins(p, pinsBefore, true).catch(() => {});
    const v = await viewAs(browser, p, a, VO.id, me.id); try { await ensurePins(v.page, [JW.staff_id, TW.staff_id], false); } catch { /* */ } finally { await v.close(); }
  }
});

fs.writeFileSync(path.join(EV, 's3-batchC.json'), JSON.stringify(R, null, 1));
await done(browser);
