/**
 * S4 batch E (2026-10-08): which lines follow a lead change (C96960 drag, C96961 remove, C368140 assign), history
 * (C96962), status and recorded time (C96966), Invoiced/Paid locks (C96963, C96964, C96972), notifications (C96958).
 * Line states are made with the product's calls (measured by probe-lines.mts):
 *   follows the lead = a line that existed when the lead was set (derivedFromLeadTech true)
 *   no technician    = a line added after the lead was set
 *   explicit         = PUT /api/work-orders/lines/{id}/technicians {staffIds:[…]}
 *   complete         = lines/change-story + lines/change-status {status:'complete'}
 *   logged / clocked = as the technician (switch-user): technician-tasks/check-in {task_id, line_id, work_order_id}
 *                      (+ check-out {task_id} for logged); the clock left running is stopped at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt } from './wob.mts';
import { staffRows, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const nm: Record<string, string> = { [ES.staff_id]: 'Esther Howard', [RE.staff_id]: 'Ralph Edwards', [DO.staff_id]: 'Dana Ortiz' };
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id, DO.staff_id] } });
const bv = async (n: string, d = 'Board View', pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(600); };
const canned: any[] = (() => [])(); { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const lineTechs = async (wo: string, label: Record<string, string>) => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => [label[x.lineId] ?? x.lineId.slice(0, 6), `${(x.technicians ?? []).map((tt: any) => `${tt.firstName ?? ''} ${tt.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`]));
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
const taskOf = async (wo: string, line: string, staff: string) => ((await linesRaw(wo)).find((l: any) => l.line_id === line)?.tasks ?? []).find((x: any) => x.tech_assigned_id === staff)?.id;
async function asTech<T>(userId: string, f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  try { return await f(); } finally { const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); }
}
async function completeLine(wo: string, line: string) {
  await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' });
  await a.post('/api/work-orders/lines/change-story', { line_id: line, tech_story: 'Done', work_order_id: wo });
  const r = await a.post('/api/work-orders/lines/change-status', { line_id: line, status: 'complete', workOrderId: wo });
  const st = (await linesRaw(wo)).find((l: any) => l.line_id === line); return `${r.status} ${st?.status ?? st?.line_status ?? '?'}`;
}
const myTask = async () => JSON.stringify((await a.get('/api/technician-tasks/my-current-task')).body?.data ?? null).slice(0, 200);
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2400));
  fs.writeFileSync(path.join(EV, 's4-batchE.json'), JSON.stringify(R, null, 1));
}
/** a fresh work order with the six line states, led by Esther Howard; returns its id, number and line labels */
async function sixLines(n: string, unit: string) {
  const c = await customer(a, n, unit);
  const wo = await workOrder(a, c, 'estimate', null);
  const L: Record<string, string> = {};
  for (const [k, i] of [['Line 2 Implicit', 1], ['Line 4 Complete', 2], ['Line 5 Logged', 3], ['Line 6 Clocked', 4]] as [string, number][]) L[await mkLine(wo, i)] = k;
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const l3 = await mkLine(wo, 5); L[l3] = 'Line 3 Explicit'; await a.put(`/api/work-orders/lines/${l3}/technicians`, { staffIds: [DO.staff_id] });
  const l1 = await mkLine(wo, 6); L[l1] = 'Line 1 Unassigned';
  const id = (k: string) => Object.keys(L).find((x) => L[x] === k)!;
  const clock: any = { complete4: await completeLine(wo, id('Line 4 Complete')) };
  const t5 = await taskOf(wo, id('Line 5 Logged'), ES.staff_id), t6 = await taskOf(wo, id('Line 6 Clocked'), ES.staff_id);
  await asTech(ES.id, async () => {
    clock.in5 = (await a.post('/api/technician-tasks/check-in', { task_id: t5, line_id: id('Line 5 Logged'), work_order_id: wo, refresh_lines: true })).status;
    await p.waitForTimeout(65_000);
    // check-out takes the RUNNING record's id (my-current-task), not the line task id
    const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; clock.out5 = (await a.post('/api/technician-tasks/check-out', { task_id: cur?.technician_task?.id })).status;
    clock.in6 = (await a.post('/api/technician-tasks/check-in', { task_id: t6, line_id: id('Line 6 Clocked'), work_order_id: wo, refresh_lines: true })).status;
    clock.running = await myTask();
  });
  const num = (await workOrders(a, n)).find((w: any) => w.id === wo)?.number;
  return { wo, num, L, id, t6, clock };
}
const stopClock = async (_t6: string) => asTech(ES.id, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; return cur?.technician_task?.id ? (await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id })).status : 'no clock running'; });

await run('C96960', async () => {
  const s = await sixLines(`ZZAUTOTEST F1 Drag Moves Open Lines ${Date.now() % 100000}`, 'ZZF4DM');
  R.C96960 = { wo: s.num, clock: s.clock, before: await lineTechs(s.wo, s.L) };
  await bv(s.num);
  await drag(p, `[data-test-id="board_card_${s.wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  R.C96960.message = await toasts(p);
  R.C96960.after = await lineTechs(s.wo, s.L);
  R.C96960.clockStillRunning = await asTech(ES.id, myTask);
  R.C96960.stopClock = await stopClock(s.t6);
});

await run('C96961', async () => {
  const s = await sixLines(`ZZAUTOTEST F1 Remove Lead Lines ${Date.now() % 100000}`, 'ZZF4RM');
  R.C96961 = { wo: s.num, clock: s.clock, before: await lineTechs(s.wo, s.L) };
  await bv(s.num);
  const o = await openReassign(p, s.wo); await o.item.click(); await p.waitForTimeout(1200);
  await p.locator('[data-test-id="option_lead_technician_unassigned"]').click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts');
  R.C96961.message = await toasts(p);
  R.C96961.lead = (await a.get(`/api/work-orders/view/${s.wo}`)).body?.data?.work_order?.tech_assigned_id ?? 'none';
  R.C96961.inUnassigned = (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(s.num);
  R.C96961.after = await lineTechs(s.wo, s.L);
  R.C96961.clockStillRunning = await asTech(ES.id, myTask);
  R.C96961.stopClock = await stopClock(s.t6);
});

await run('C368140', async () => {
  const n = `ZZAUTOTEST F1 Assign Unassigned Lines ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4AU'); const wo = await workOrder(a, c, 'approved', null);
  const L: Record<string, string> = {};
  const l1 = await mkLine(wo, 1); L[l1] = 'Line 1 Unassigned';
  const l2 = await mkLine(wo, 2); L[l2] = 'Line 2 Explicit'; await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [DO.staff_id] });
  const l3 = await mkLine(wo, 3); L[l3] = 'Line 3 Complete'; R.C368140complete = await completeLine(wo, l3);
  const num = (await workOrders(a, n))[0].number;
  R.C368140 = { wo: num, before: await lineTechs(wo, L) };
  await bv(n); const o = await openReassign(p, wo); await o.item.click(); await p.waitForTimeout(1200);
  await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts');
  R.C368140.message = await toasts(p); R.C368140.inRalph = (await boardCols(p)).find((x) => x.id === RE.staff_id)?.cards.includes(num);
  R.C368140.after = await lineTechs(wo, L);
});

await run('C96962', async () => {
  const n = `ZZAUTOTEST F1 Lead History ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4LH'); const wo = await workOrder(a, c, 'estimate', null);
  const l1 = await mkLine(wo, 1), l2 = await mkLine(wo, 2);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const num = (await workOrders(a, n))[0].number;
  const hist = async () => ((await a.get(`/api/work-orders/${wo}/history`)).body?.data?.history ?? []);
  const fmt = (h: any) => `${h.eventName}${h.originalLeadTechName || h.newLeadTechName ? ` ${h.originalLeadTechName ?? '-'} -> ${h.newLeadTechName ?? '-'}` : ''}${h.originalLineTechName || h.newLineTechName ? ` [line ${h.lineName?.trim()}: ${h.originalLineTechName ?? '-'} -> ${h.newLineTechName ?? '-'}]` : ''} by ${h.userName} at ${h.historyDate ?? ''} ${h.historyTime ?? ''}`;
  const since = async (n0: number) => (await hist()).slice(0, (await hist()).length - n0).map(fmt);
  R.C96962 = { wo: num, keys: Object.keys((await hist())[0] ?? {}).join(',') };
  let n0 = (await hist()).length;
  await bv(n); await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96962.drag = await since(n0); n0 = (await hist()).length;
  // the Edit Line dialog, through the screen
  { const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
    await pg.getByText(canned[1].canned_line_name?.trim() ?? 'Service', { exact: false }).first().click().catch(() => {}); await pg.waitForTimeout(2000);
    const fld = pg.locator('.q-dialog .q-field').filter({ hasText: /Add technician/i }).first();
    if (await fld.count()) { await fld.click(); await pg.waitForTimeout(1200); await pg.locator('.q-menu .q-item').filter({ hasText: 'Dana Ortiz' }).first().click(); await pg.waitForTimeout(800); await pg.locator('.q-dialog').getByText('Edit Line').first().click().catch(() => {}); await pg.locator('button:visible').filter({ hasText: 'Save & Close' }).last().click(); await pg.waitForTimeout(3000); }
    else R.C96962.editLineNotOpened = true;
    await pg.close(); }
  R.C96962.lineEdit = await since(n0); n0 = (await hist()).length;
  const o = await openReassign(p, wo); await o.item.click(); await p.waitForTimeout(1200); await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96962.dialog = await since(n0); n0 = (await hist()).length;
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000); await pg.keyboard.type('Ralph'); await pg.waitForTimeout(1200); await pg.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click(); await pg.waitForTimeout(2500); await pg.close();
  R.C96962.woPage = await since(n0);
  R.C96962.whereFound = 'Work order page > the change history (GET /api/work-orders/{id}/history, the list the page shows)';
});

await run('C96963', async () => {
  const n = `ZZAUTOTEST F1 Invoiced Paid Locked ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4IP');
  const mkWo = async (leadId: string | null, finalStatus: string) => {
    const wo = await workOrder(a, c, 'approved', leadId); const l = await mkLine(wo, 1);
    if (['invoiced', 'paid', 'complete'].includes(finalStatus)) {
      await completeLine(wo, l);
      for (const s of ['in_progress', 'ready_for_review', 'complete']) await a.post('/api/work-orders/change-status', { id: wo, status: s });
      if (finalStatus !== 'complete') { const inv = await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }); R.C96963inv = (R.C96963inv ?? []).concat(`${inv.status}`); }
      if (finalStatus === 'paid') R.C96963paid = (await a.post('/api/work-orders/change-status', { id: wo, status: 'paid' })).status;
    } else if (finalStatus === 'declined') await a.post('/api/work-orders/change-status', { id: wo, status: 'declined' });
    return wo;
  };
  const W1 = await mkWo(ES.staff_id, 'approved'), W2 = await mkWo(ES.staff_id, 'invoiced'), W3 = await mkWo(ES.staff_id, 'paid'), W4 = await mkWo(null, 'invoiced'), W5 = await mkWo(ES.staff_id, 'declined'), W6 = await mkWo(ES.staff_id, 'complete');
  // [WO-4] Invoiced with no lead: its lead was removed before invoicing
  const all = await workOrders(a, n); const num = (id: string) => all.find((w: any) => w.id === id)?.number;
  R.C96963 = { set: all.map((w: any) => `${w.number} ${w.status} lead=${w.techAssignedFirstName ?? 'none'}`) };
  await bv(n);
  const col = async (id: string) => (await boardCols(p)).find((x) => x.cards.includes(num(id)!))?.name ?? null;
  const tryMove = async (id: string, target: string) => { await bv(n); await drag(p, `[data-test-id="board_card_${id}"]`, `[data-test-id="board_column_${target}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500); const m = await toasts(p); await p.waitForTimeout(800); return { column: await col(id), message: m }; };
  R.C96963.inv2ToRalph = await tryMove(W2, RE.staff_id); R.C96963.inv2ToUnassigned = await tryMove(W2, 'unassigned');
  await bv(n); await drag(p, `[data-test-id="board_card_${W2}"]`, `[data-test-id="board_card_${W1}"]`, 4); await p.waitForTimeout(1500);
  R.C96963.inv2Reorder = { order: (await boardCols(p)).find((x) => x.id === ES.staff_id)?.cards, message: await toasts(p) };
  R.C96963.paid3ToRalph = await tryMove(W3, RE.staff_id); R.C96963.paid3ToUnassigned = await tryMove(W3, 'unassigned');
  R.C96963.inv4ToEsther = await tryMove(W4, ES.staff_id);
  R.C96963.declined5ToRalph = await tryMove(W5, RE.staff_id); R.C96963.complete6ToRalph = await tryMove(W6, RE.staff_id);
  R.C96963.leads = await lead(n);
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${W2}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  R.C96963.woPageLeadControl = await pg.locator('[data-test-id="select_lead_technician"]').evaluate((e) => ({ text: (e as HTMLElement).innerText.replace(/\s+/g, ' '), disabled: e.getAttribute('aria-disabled') ?? (e.closest('.q-field--disabled, .q-field--readonly') ? 'yes' : 'no') })).catch(() => 'no Lead Technician box (shown as text)');
  await shot(pg, 'C96963-wo-page'); await pg.close();
  R.C96963.ids = { W2: num(W2), W3: num(W3), W4: num(W4), W5: num(W5), W6: num(W6) };
});

await run('C96972', async () => {
  const n = `ZZAUTOTEST F1 Invoiced Elsewhere ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4IE'); const wo = await workOrder(a, c, 'approved', ES.staff_id); const l = await mkLine(wo, 1);
  await completeLine(wo, l);
  for (const s of ['in_progress', 'ready_for_review', 'complete']) await a.post('/api/work-orders/change-status', { id: wo, status: s });
  await bv(n); R.C96972 = { cardStatus: await p.locator(`[data-test-id="board_card_${wo}"] [data-test-id="board_card_status"]`).innerText().catch(() => null) };
  const inv = await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
  R.C96972.invoiced = inv.status; R.C96972.statusNow = (await workOrders(a, n))[0]?.status;
  await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96972.message = await toasts(p); await shot(p, 'C96972-alert');
  const wnum = (await workOrders(a, n))[0].number;
  R.C96972.column = (await boardCols(p)).find((x) => x.cards.includes(wnum))?.name;
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, n);
  R.C96972.afterReload = { lead: await lead(n), column: (await boardCols(p)).find((x) => x.cards.includes(wnum))?.name };
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'] } });
fs.writeFileSync(path.join(EV, 's4-batchE.json'), JSON.stringify(R, null, 1));
await done(browser);
