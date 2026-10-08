/**
 * S4 shifts and the "Clear …'s scheduled shifts?" question (2026-10-08): C368134 wording, C368135 cancel / X / Escape /
 * outside click, C368136 where it shows, C154889 on removal, C368133 only for unfinished whole-work-order shifts,
 * C96965 what Clear removes, C154888 ended / future / running, C154890 a failed save does nothing half.
 * Tech-A Esther Howard, Tech-B Ralph Edwards, Tech-C Dana Ortiz. For the drags, Tech-A and Tech-B are pinned so their
 * columns stand side by side; the admin's own pins are put back at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, toggleGroup, openReassign, toasts, shiftPrompt } from './wob.mts';
import { staffRows, person } from './staff.mts';
import { mkShift, shiftsOn, localTime } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
await person(a, 'Dana', 'Ortiz', { role: ES.role_id, email: `zz.wob.dana.ortiz${D}`, clockable: true });
const DO = await sid('dana.ortiz');
const names: Record<string, string> = { [ES.staff_id]: 'Esther', [RE.staff_id]: 'Ralph', [DO?.staff_id]: 'Dana' };
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const ADMIN_PINS = ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'];
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const bv = async (n: string, d = 'Board View') => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, d); if (n) await search(p, n); await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await p.waitForTimeout(600); };
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
async function fresh(n: string, unit: string, k = 1) { const ws = await workOrders(a, n); if (ws.length >= k) return ws; const c = await customer(a, n, unit); for (let i = ws.length; i < k; i++) await workOrder(a, c, 'approved', ES.staff_id); return workOrders(a, n); }
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2200));
  fs.writeFileSync(path.join(EV, 's4-batchC.json'), JSON.stringify(R, null, 1));
}
const dragTo = async (woId: string, target: string, where: 'board' | 'tech' = 'board') => where === 'board'
  ? drag(p, `[data-test-id="board_card_${woId}"]`, `[data-test-id="board_column_${target}"]`, 120)
  : drag(p, `[data-test-id="tech_view_row_${woId}"]`, `[data-test-id="tech_view_group_${target}"]`, 10);
const promptLoc = () => p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
const setLeadApi = (woId: string, s: string | null) => a.post('/api/work-orders/change-lead-technician', { work_order_id: woId, tech_assigned_id: s });

await run('C368134', async () => {
  const n = 'ZZAUTOTEST F1 Prompt Wording';
  const [w] = await fresh(n, 'ZZF4PW'); await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  await bv(n); await dragTo(w.id, RE.staff_id); await p.waitForTimeout(1000);
  const d = promptLoc();
  R.C368134 = { opened: await d.count(),
    title: await d.locator('[data-test-id="text_dialog_title"]').evaluate((e) => e.textContent?.trim()).catch(() => null),
    text: (await d.innerText().catch(() => '')).replace(/\s+/g, ' '),
    buttons: await d.evaluate((e) => [...e.querySelectorAll('button')].map((b) => ({ shown: (b as HTMLElement).innerText.trim(), text: b.textContent?.trim(), cssTransform: getComputedStyle(b).textTransform }))).catch(() => null) };
  await shot(p, 'C368134-prompt');
  await shiftPrompt(p, 'Keep shifts'); R.C368134.after = { lead: await lead(n), shifts: await shiftsOn(a, w.id, names), message: await toasts(p) };
});

await run('C368135', async () => {
  const n = 'ZZAUTOTEST F1 Prompt Cancel';
  const [w] = await fresh(n, 'ZZF4PC'); await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  R.C368135 = {};
  for (const where of ['board', 'tech'] as const) {
    await bv(n, where === 'board' ? 'Board View' : 'Tech View');
    const res: any = {};
    for (const how of ['Cancel', 'X', 'Escape', 'outside']) {
      await dragTo(w.id, RE.staff_id, where); await p.waitForTimeout(1000);
      const d = promptLoc(); const opened = await d.count();
      if (how === 'Cancel') await d.locator('[data-test-id="button_clear_shifts_cancel"]').click().catch(() => {});
      if (how === 'X') await d.locator('[data-test-id="button_close_clear_shifts"]').click().catch(() => {});
      if (how === 'Escape') await p.keyboard.press('Escape');
      if (how === 'outside') await p.mouse.click(30, 980);
      await p.waitForTimeout(1500);
      const home = where === 'board' ? (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards.includes(w.number) : (await groups(p)).find((g) => g.id === ES.staff_id)?.rows.includes(w.number);
      res[how] = { opened, promptStillOpen: await promptLoc().count(), cardBackWithEsther: home, message: await toasts(p), lead: (await lead(n))[w.number] };
      if (await promptLoc().count()) await promptLoc().locator('[data-test-id="button_clear_shifts_cancel"]').click().catch(() => {});
    }
    const o = await openReassign(p, w.id, where); await o.item.click(); await p.waitForTimeout(1200);
    await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await p.waitForTimeout(1200);
    const opened = await promptLoc().count(); await promptLoc().locator('[data-test-id="button_clear_shifts_cancel"]').click().catch(() => {}); await p.waitForTimeout(1200);
    res.dialogPath = { opened, backInReassignDialog: await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').isVisible().catch(() => false),
      ralphStillChosen: await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).evaluate((e) => e.getAttribute('aria-selected') ?? e.getAttribute('aria-checked') ?? (e.className.match(/active|selected/)?.[0] ?? (e.querySelector('.q-icon')?.textContent?.includes('check') ? 'check' : null))).catch(() => null) };
    await shot(p, `C368135-${where}-dialog-after-cancel`);
    await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click().catch(() => {}); await p.waitForTimeout(1000);
    res.final = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names) };
    R.C368135[where] = res;
  }
});

await run('C368136', async () => {
  const n = 'ZZAUTOTEST F1 Prompt Where';
  const [w] = await fresh(n, 'ZZF4PH'); await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  R.C368136 = {};
  for (const where of ['board', 'tech'] as const) {
    await bv(n, where === 'board' ? 'Board View' : 'Tech View');
    await dragTo(w.id, RE.staff_id, where); const p1 = await shiftPrompt(p, 'Keep shifts');
    await dragTo(w.id, ES.staff_id, where); await shiftPrompt(p, 'Keep shifts');
    const o = await openReassign(p, w.id, where); await o.item.click(); await p.waitForTimeout(1200);
    await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click();
    const p2 = await shiftPrompt(p, 'Keep shifts');
    await setLeadApi(w.id, ES.staff_id);
    R.C368136[where] = { dragPrompt: !!p1, dialogPrompt: !!p2, lead: (await lead(n))[w.number] };
  }
  // the work order page: change the lead with its own Lead Technician box
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000);
  await pg.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click().catch(async () => { await pg.keyboard.type('Ralph'); await pg.waitForTimeout(800); await pg.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click(); });
  await pg.waitForTimeout(2000);
  R.C368136.woPage = { prompt: await pg.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count(), lead: (await lead(n))[w.number] }; await shot(pg, 'C368136-wo-page'); await pg.close();
  await bv(n, 'List');
  R.C368136.listRowMenu = await p.evaluate(`[...document.querySelectorAll('[data-test-id="button_work_order_more_actions"]')].length`);
  R.C368136.shifts = await shiftsOn(a, w.id, names);
  await setLeadApi(w.id, ES.staff_id);
});

await run('C154889', async () => {
  const n = 'ZZAUTOTEST F1 Remove Lead Prompt';
  const ws = await fresh(n, 'ZZF4RP', 2); for (const w of ws) { await setLeadApi(w.id, ES.staff_id); if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240); }
  await bv(n);
  await dragTo(ws[0].id, 'unassigned'); await p.waitForTimeout(1000);
  const d1 = promptLoc(); const t1 = { opened: await d1.count(), title: await d1.locator('[data-test-id="text_dialog_title"]').textContent().catch(() => null), buttons: await d1.locator('button').allTextContents().catch(() => []) };
  await shiftPrompt(p, 'Keep shifts');
  const o = await openReassign(p, ws[1].id); await o.item.click(); await p.waitForTimeout(1200);
  await p.locator('[data-test-id="option_lead_technician_unassigned"]').click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await p.waitForTimeout(1000);
  const d2 = promptLoc(); const t2 = { opened: await d2.count(), title: await d2.locator('[data-test-id="text_dialog_title"]').textContent().catch(() => null) };
  await shiftPrompt(p, 'Keep shifts');
  R.C154889 = { drag: t1, dialog: t2, leads: await lead(n), shifts: Object.fromEntries(await Promise.all(ws.map(async (w: any) => [w.number, await shiftsOn(a, w.id, names)]))) };
});

await run('C368133', async () => {
  const n = 'ZZAUTOTEST F1 Prompt Only Unfinished';
  const ws = await fresh(n, 'ZZF4PU', 6);
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0];
  const other = (await fresh('ZZAUTOTEST F1 Prompt Only Unfinished Other', 'ZZF4PX', 1))[0];
  const L = ['A', 'B', 'C', 'D', 'E', 'F']; const byL: Record<string, any> = {};
  for (const [i, w] of ws.slice(0, 6).entries()) { byL[L[i]] = w; await setLeadApi(w.id, ES.staff_id); }
  if (!(await shiftsOn(a, byL.A.id, names)).length) {
    await mkShift(a, byL.A.id, ES.staff_id, 1, '08:00', 240);
    const lr = await a.post(`/api/work-orders/${byL.C.id}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' });
    const lid = lr.body?.data?.line_id ?? lr.body?.data?.id; await mkShift(a, byL.C.id, ES.staff_id, 1, '08:00', 240, lid ? [lid] : []);
    await mkShift(a, byL.D.id, ES.staff_id, -1, '08:00', 240);
    await mkShift(a, byL.E.id, DO.staff_id, 1, '08:00', 240);
    await setLeadApi(other.id, ES.staff_id); await mkShift(a, other.id, ES.staff_id, 1, '13:00', 120);
  }
  R.C368133 = { setup: Object.fromEntries(await Promise.all(L.map(async (k) => [k, `${byL[k].number}: ${(await shiftsOn(a, byL[k].id, names)).join('; ') || 'no shifts'}`]))) };
  await bv(n);
  for (const k of L) { await dragTo(byL[k].id, RE.staff_id); await p.waitForTimeout(800); const opened = await promptLoc().count(); if (opened) await shiftPrompt(p, 'Keep shifts'); R.C368133[k] = { prompt: opened > 0, message: await toasts(p), lead: (await lead(n))[byL[k].number] }; }
  for (const k of L) await setLeadApi(byL[k].id, ES.staff_id);
});

await run('C96965', async () => {
  const n = 'ZZAUTOTEST F1 Clear Shifts Scope';
  const ws = await fresh(n, 'ZZF4CS', 3);
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0];
  const [w1, w2, w3] = ws;
  for (const w of ws) await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w1.id, names)).length) {
    for (const w of [w1, w2]) { const lr = await a.post(`/api/work-orders/${w.id}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' }); const lid = lr.body?.data?.line_id ?? lr.body?.data?.id;
      await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240); await mkShift(a, w.id, ES.staff_id, 1, '13:00', 120, lid ? [lid] : []); }
    await mkShift(a, w1.id, DO.staff_id, 1, '08:00', 120);
    await mkShift(a, w3.id, ES.staff_id, 2, '08:00', 240);
  }
  R.C96965 = { before: { [w1.number]: await shiftsOn(a, w1.id, names), [w2.number]: await shiftsOn(a, w2.id, names), [w3.number]: await shiftsOn(a, w3.id, names) } };
  await bv(n);
  await dragTo(w1.id, RE.staff_id); await p.waitForTimeout(900); R.C96965.prompt1 = (await promptLoc().innerText().catch(() => '')).replace(/\s+/g, ' '); await shiftPrompt(p, 'Clear shifts');
  await dragTo(w2.id, RE.staff_id); await p.waitForTimeout(900); R.C96965.prompt2 = !!(await promptLoc().count()); await shiftPrompt(p, 'Keep shifts');
  R.C96965.after = { leads: await lead(n), [w1.number]: await shiftsOn(a, w1.id, names), [w2.number]: await shiftsOn(a, w2.id, names), [w3.number]: await shiftsOn(a, w3.id, names) };
});

await run('C154888', async () => {
  const n = 'ZZAUTOTEST F1 Shift Trim';
  const [w] = await fresh(n, 'ZZF4ST'); await setLeadApi(w.id, ES.staff_id);
  const now = new Date(); const startRun = localTime(new Date(now.getTime() - 3600000));
  if (!(await shiftsOn(a, w.id, names)).length) { await mkShift(a, w.id, ES.staff_id, -1, '08:00', 240); await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240); }
  const cur = await shiftsOn(a, w.id, names); if (!cur.some((x) => x.includes('today'))) await mkShift(a, w.id, ES.staff_id, 0, startRun, 180);
  R.C154888 = { before: await shiftsOn(a, w.id, names) };
  await bv(n); const at = localTime(new Date());
  await dragTo(w.id, RE.staff_id); await p.waitForTimeout(900); R.C154888.prompt = !!(await promptLoc().count()); await shiftPrompt(p, 'Clear shifts');
  R.C154888.changedAt = at; R.C154888.after = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names) };
});

await run('C154890', async () => {
  const n = 'ZZAUTOTEST F1 Clear Fails';
  const [w] = await fresh(n, 'ZZF4CF'); await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  await bv(n); await dragTo(w.id, RE.staff_id); await p.waitForTimeout(900);
  R.C154890 = { prompt: !!(await promptLoc().count()) };
  // "network off" stand-in (the QA branch's sleep guard takes the page away on a dropped request): the server refuses every save
  const calls: string[] = []; const fail = (r: any) => { if (r.request().method() !== 'GET') { calls.push(r.request().method() + ' ' + r.request().url().replace(/^https:\/\/[^/]+/, '')); return r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"zz test: save refused"}]}' }); } return r.continue(); };
  await p.route('**/api/work-orders/**', fail); await p.route('**/api/schedule/**', fail);
  await shiftPrompt(p, 'Clear shifts'); await p.waitForTimeout(2500);
  R.C154890.refusedCalls = calls; R.C154890.message = await toasts(p); await shot(p, 'C154890-after-failed-save');
  R.C154890.cardBack = (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards.includes(w.number);
  await p.unroute('**/api/work-orders/**', fail); await p.unroute('**/api/schedule/**', fail);
  R.C154890.after = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names) };
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: ADMIN_PINS } });
fs.writeFileSync(path.join(EV, 's4-batchC.json'), JSON.stringify(R, null, 1));
await done(browser);
