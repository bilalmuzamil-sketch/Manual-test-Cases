/** 12 Oct 2026 — fresh data for re-running C96960, C96968 and C368136 BY THEIR OWN TEST-CASE PRECONDITIONS (QA lead: judge the
 *  cases, not the tickets attached to them). Location zone = Asia/Karachi (Rule 125). Helpers copied from s4-batchE.mts. */
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
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' });
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

const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'case-retest-2026-10-12'); fs.mkdirSync(EVD, { recursive: true });
const n = String(Date.now() % 100000); const S: any = { ES: ES.staff_id, RE: RE.staff_id, DO: DO.staff_id };
// C96960: six lines, led by Esther Howard
{ const s = await sixLines(`ZZAUTOTEST F1 Drag Moves Open Lines ${n}`, 'ZZF4DM'); S.c96960 = { id: s.wo, number: s.num, customer: `ZZAUTOTEST F1 Drag Moves Open Lines ${n}`, labels: s.L, clock: s.clock, before: await lineTechs(s.wo, s.L) }; }
// C96968: one Approved work order led by Esther Howard
{ const c = await customer(a, `ZZAUTOTEST F1 Reassign Offline ${n}`, 'ZZF4RO'); const id = await workOrder(a, c, 'approved', ES.staff_id); S.c96968 = { id, number: (await workOrders(a, `ZZAUTOTEST F1 Reassign Offline ${n}`))[0]?.number, customer: `ZZAUTOTEST F1 Reassign Offline ${n}` }; }
// C368136: one Approved work order led by Esther Howard + her whole-work-order shift tomorrow 8:00-12:00 (location's own time, now Asia/Karachi)
{ const c = await customer(a, `ZZAUTOTEST F1 Prompt Where ${n}`, 'ZZF4PW'); const id = await workOrder(a, c, 'approved', ES.staff_id); await mkShift(a, id, ES.staff_id, 1, '08:00', 240);
  S.c368136 = { id, number: (await workOrders(a, `ZZAUTOTEST F1 Prompt Where ${n}`))[0]?.number, customer: `ZZAUTOTEST F1 Prompt Where ${n}`, shifts: await shiftsOn(a, id, nm) }; }
fs.writeFileSync(path.join(EVD, 'seed.json'), JSON.stringify(S, null, 1)); console.log('CASESEED', JSON.stringify(S).slice(0, 2500));
await browser.close(); process.exit(0);
