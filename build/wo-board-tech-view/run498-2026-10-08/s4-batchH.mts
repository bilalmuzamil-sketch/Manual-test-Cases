/** S4 batch H (2026-10-09): C96966 again with the shift itself read back after each Schedule edit (batch F could not
 *  prove the resize/reassign landed), and C96958 again with a line on the work order (the work order page's lead box
 *  did not appear for a work order with no lines). */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { viewAs } from './viewas.mts';
import { staffRows, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: { id: RUN.id.slice(0, 8), perms: RUN.perms, who: RUN.who, log: RUN.log } };
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
  let s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: userId }); } if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  try { return await f(); } finally { await RUN.toRunner(); }
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
  fs.writeFileSync(path.join(EV, 's4-batchH.json'), JSON.stringify(R, null, 1));
}

await run('C96966', async () => {
  const n = `ZZAUTOTEST F1 Status And Time Kept ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4ST');
  const wo = await workOrder(a, c, 'estimate', null); const l = await mkLine(wo, 1);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const tk = await taskOf(wo, l, ES.staff_id); const clock: any = {};
  await asTech(ES.id, async () => {
    clock.in1 = (await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: l, work_order_id: wo, refresh_lines: true })).status;
    await p.waitForTimeout(65_000);
    const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; clock.out1 = (await a.post('/api/technician-tasks/check-out', { task_id: cur?.technician_task?.id })).status;
    clock.in2 = (await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: l, work_order_id: wo, refresh_lines: true })).status;
    clock.running = await myTask();
  });
  await a.post('/api/work-orders/change-status', { id: wo, status: 'in_progress' });
  const num = (await workOrders(a, n))[0].number;
  const numbers = (o: any) => Object.fromEntries(Object.entries(o ?? {}).filter(([k, v]) => /hour|actual|duration|time_spent|labor_time|total_time/i.test(k) && (typeof v === 'number' || (typeof v === 'string' && /^[\d.:]+$/.test(v)))));
  R.C96966keys = { line: Object.keys((await linesRaw(wo)).find((x: any) => x.line_id === l) ?? {}).join(','), wo: Object.keys((await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order ?? {}).join(',') };
  const state = async () => { const w = (await workOrders(a, n))[0]; const ln = (await linesRaw(wo)).find((x: any) => x.line_id === l);
    const v = (await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order;
    return { status: w?.status, lead: w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none', line: numbers(ln), wo: numbers(v), tasks: (ln?.tasks ?? []).map((x: any) => numbers(x)) }; };
  R.C96966 = { wo: num, clock, before: await state() };
  const sh = await mkShift(a, wo, ES.staff_id, 1, '08:00', 240, []);
  const nm2 = { [ES.staff_id]: 'Esther Howard', [RE.staff_id]: 'Ralph Edwards', [DO.staff_id]: 'Dana Ortiz' };
  const nmOf = (id: any) => nm2[id] ?? (id ? String(id).slice(0, 8) : 'nobody');
  const board = async () => { const from = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
    let f: any = null; const walk = (x: any) => { if (!x || typeof x !== 'object' || f) return; if (Array.isArray(x)) return x.forEach(walk); if (x.id === sh && x.startsAt) { f = x; return; } Object.values(x).forEach(walk); };
    walk((await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body); return f; };
  const shiftNow = async () => { const s = await board(); return s ? `${nmOf(s.staffId)} ${s.startsAt} -> ${s.endsAt} (${s.durationMinutes} min)` : 'not found'; };
  R.C96966.shiftMade = await shiftNow(); R.C96966.shiftKeys = Object.keys((await board()) ?? {}).join(',');
  const s0 = await board(); const start = new Date(new Date(s0.startsAt).getTime() + 5 * 3600000);
  R.C96966.move = (await a.patch(`/api/schedule/shifts/${sh}`, { startsAt: start.toISOString(), isAllDay: false, reassign: false, changeNote: false, scope: 'shift' })).status;
  R.C96966.afterMove = { shift: await shiftNow(), ...(await state()) };
  let rs = await a.patch(`/api/schedule/shifts/${sh}`, { endsAt: new Date(start.getTime() + 3 * 3600000).toISOString(), isAllDay: false, reassign: false, changeNote: false, scope: 'shift' });
  R.C96966.resize = rs.status; R.C96966.afterResizeTry1 = await shiftNow();
  if (!/180 min/.test(R.C96966.afterResizeTry1)) { const r2 = await a.patch(`/api/schedule/shifts/${sh}`, { startsAt: start.toISOString(), durationMinutes: 180, isAllDay: false, reassign: false, changeNote: false, scope: 'shift' }); R.C96966.resize2 = `${r2.status} ${JSON.stringify(r2.body).slice(0, 160)}`; }
  R.C96966.afterResize = { shift: await shiftNow(), ...(await state()) };
  const ra = await a.patch(`/api/schedule/shifts/${sh}`, { staffId: DO.staff_id, startsAt: start.toISOString(), isAllDay: false, reassign: true, changeNote: false, scope: 'shift' });
  R.C96966.reassign = `${ra.status} ${JSON.stringify(ra.body).slice(0, 220)}`;
  R.C96966.afterReassign = { shift: await shiftNow(), ...(await state()) };
  await bv(n); await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120);
  R.C96966.prompt = await shiftPrompt(p, 'Clear shifts'); await p.waitForTimeout(1500); R.C96966.message = await toasts(p);
  R.C96966.afterLeadChange = { shift: await shiftNow(), ...(await state()) };
  R.C96966.clockStillRunning = await asTech(ES.id, myTask);
  R.C96966.stopClock = await asTech(ES.id, async () => { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; return cur?.technician_task?.id ? (await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id })).status : 'no clock running'; });
});

await run('C96958', async () => {
  const n = `ZZAUTOTEST F1 Lead Notifications ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4LN');
  const wo = await workOrder(a, c, 'estimate', null); await mkLine(wo, 1);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  const num = (await workOrders(a, n))[0].number;
  const people: Record<string, any> = { 'Esther Howard': ES, 'Ralph Edwards': RE, 'Dana Ortiz': DO };
  const read = async (who: string) => {
    const v = await viewAs(browser, p, a, people[who].id, me.id, RUN.toRunner); const got: string[] = [];
    v.page.on('response', (r) => { if (/note|notif|mention/i.test(r.url()) && r.request().method() === 'GET') got.push(`${r.status()} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)}`); });
    try { await v.page.goto(`${APP}/notifications`, { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(6000);
      const tg = v.page.locator('[data-test-id="toggle_unread_only"]'); if (await tg.count() && (await tg.getAttribute('aria-checked')) === 'true') { await tg.click(); await v.page.waitForTimeout(3500); }
      const items = await v.page.evaluate(`[...document.querySelectorAll('.note-item')].map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 160))`) as string[];
      const empty = await v.page.getByText('There are no notifications').count();
      const bell = await v.page.evaluate(`(() => { const b = [...document.querySelectorAll('header .q-badge, .q-header .q-badge')].map(x => x.innerText.trim()); return b; })()`);
      return { count: items.length, mentionsWo: items.filter((x) => x.includes(num) || /lead tech/i.test(x)), top: items.slice(0, 2), empty: !!empty, bell, calls: [...new Set(got)].slice(0, 3) };
    } finally { await v.close(); }
  };
  R.C96958 = { wo: num, base: { 'Esther Howard': await read('Esther Howard'), 'Ralph Edwards': await read('Ralph Edwards'), 'Dana Ortiz': await read('Dana Ortiz') } };
  // step 1: the work order page, Esther -> Ralph
  { const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
    await pg.waitForTimeout(3000); await shot(pg, 'C96958-wo-page');
    await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000); await pg.keyboard.type('Ralph'); await pg.waitForTimeout(1200);
    await pg.locator('.q-menu .q-item').filter({ hasText: 'Ralph Edwards' }).first().click(); await pg.waitForTimeout(3000); await pg.close(); }
  R.C96958.leadAfterWoPage = (await workOrders(a, n))[0]?.techAssignedFirstName;
  await p.waitForTimeout(20_000);
  R.C96958.afterWoPage = { 'Esther Howard': await read('Esther Howard'), 'Ralph Edwards': await read('Ralph Edwards') };
  // board drag Ralph -> Dana
  await bv(n); await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${DO.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96958.boardMessage = await toasts(p); R.C96958.leadAfterBoard = (await workOrders(a, n))[0]?.techAssignedFirstName;
  await p.waitForTimeout(20_000);
  R.C96958.afterBoard = { 'Ralph Edwards': await read('Ralph Edwards'), 'Dana Ortiz': await read('Dana Ortiz') };
  // Tech View reassign Dana -> Esther
  await bv(n, 'Tech View'); await expandSmallGroups(p);
  const o = await openReassign(p, wo, 'tech'); await o.item.click(); await p.waitForTimeout(1200);
  await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96958.techMessage = await toasts(p); R.C96958.leadAfterTech = (await workOrders(a, n))[0]?.techAssignedFirstName;
  await p.waitForTimeout(20_000);
  R.C96958.afterTech = { 'Dana Ortiz': await read('Dana Ortiz'), 'Esther Howard': await read('Esther Howard') };
});

await RUN.end();
fs.writeFileSync(path.join(EV, 's4-batchH.json'), JSON.stringify(R, null, 1));
await done(browser);
