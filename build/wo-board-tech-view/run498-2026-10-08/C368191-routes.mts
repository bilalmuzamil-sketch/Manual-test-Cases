/** C368191 on STAGING, 16 Oct 2026 (batch 40) — every route to "a line whose labor belongs to a since-deleted staff member", then the
 *  case's own steps on that line if one route gets there. Read from the app's code (v26.40.19): the ONLY delete is
 *  DELETE /api/staff/{id} (Settings > Staff, "removeStaff"); there is no account (iam) delete and no timesheet delete; deactivation is
 *  iam/change-status. Each answer is recorded word for word:
 *   R0 control: a new, never-used person is deleted (proves the delete call itself works);
 *   R1 person A only made Line 1's technician (no time logged) -> delete; Line 1's Labor row read on screen before and after;
 *   R2 person B clocks in and out on Line 2 from B's own window (labor recorded) -> delete;
 *   R3 B deactivated -> delete;  R4 B taken off Heavy Duty / Service (enrolment removed) -> delete;  R5 B's role changed -> delete.
 *  If a Labor row reads "Deleted user": steps 1-5 on that line (Line 1's Estimated Time 2h; Schedule, next working day, Esther Howard's row,
 *  drop on the 9 AM line, Choose lines > that line only, 2h, Create; the shift read; the Labor row read again).
 *  json EV/C368191-b40.json, pictures C368191-b40-*. */
import { ME_NAME } from './profile.mts';
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { api, customer, workOrder, workOrders, candidates } from './data.mts';
import { EV, t, toasts } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p); const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);
const o: any = { exit: (await a.post('/api/exit-switch-user', {})).status }; const RUNNO = String(Date.now() % 100000);
const shot = (n: string, pg: Page = p) => pg.screenshot({ path: path.join(EV, `C368191-b40-${n}.png`) }).catch(() => {});
const say = (r: any) => `${r.status} ${JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body ?? '').slice(0, 160)}`;
const del = async (staffId: string) => p.evaluate(async ([api0, id]) => { const r = await fetch(`${api0}/api/staff/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status} ${(await r.text()).slice(0, 160)}`; }, [API, staffId]);
const RI = await roleIds(a); const TECH = RI['Technician']; const D = '@staging.shopview.local';
const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = dd.find((d: any) => (d.name ?? d.label) === 'Service') ?? dd[0];
const mk = async (first: string, tag: string) => { const r = (await person(a, `ZZAUTOTEST ${first}`, `Tech ${RUNNO}`, { role: TECH, email: `zz.wob.${tag}.${RUNNO}${D}`, clockable: true })).row; if (r) await a.post('/api/staff/enrollment/create', { staffId: r.staff_id, workplaceId: HEAVY, departmentId: svc?.id }); return r; };
const rowOf = async (r: any) => (await staffRows(a, r.email)).find((x) => x.staff_id === r.staff_id);
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const lineName = (i: number) => String(canned[i % canned.length].canned_line_name ?? canned[i % canned.length].name ?? '').trim();
const laborRows = () => p.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => [e.getAttribute('data-test-id').replace('line_labor_name_', '').slice(0, 8), e.innerText.replace(/\\s+/g, ' ').trim()]))`) as Promise<Record<string, string>>;
const woPage = async (id: string) => { await p.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); };
try {
  // R0 control
  const N0 = await mk('Never Used', 'neverused'); o.R0 = { deletable: N0?.deletable ?? null, delete: N0 ? await del(N0.staff_id) : 'not made' }; o.R0.stillListed = N0 ? (await staffRows(a, N0.email)).length : null;
  // the work order: two Authorized lines, Approved
  const c = await customer(a, `ZZAUTOTEST Deleted Labor ${RUNNO}`, 'TRK-191'); const wo = await workOrder(a, c, 'estimate', null); const ls: string[] = [];
  for (const i of [1, 2]) ls.push((await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i].id, status: 'authorized' })).body?.data?.line_id);
  o.approve = (await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' })).status; o.wo = (await workOrders(a, `ZZAUTOTEST Deleted Labor ${RUNNO}`)).find((x: any) => x.id === wo)?.number;
  // R1: person A only as Line 1's technician
  const GA = await mk('Gone A', 'gonea'); o.R1 = { lineTech: say(await a.put(`/api/work-orders/lines/${ls[0]}/technicians`, { staffIds: [GA.staff_id] })) };
  await woPage(wo); o.R1.laborBefore = await laborRows(); o.R1.deletable = (await rowOf(GA))?.deletable ?? null; await shot('R1-before');
  o.R1.delete = await del(GA.staff_id); await woPage(wo); o.R1.laborAfter = await laborRows(); o.R1.stillListed = (await staffRows(a, GA.email)).length; await shot('R1-after');
  // R2: person B logs labor on Line 2 from B's own window (Start, ~65 s, Stop > Clock Out)
  const GB = await mk('Gone B', 'goneb'); o.R2 = { lineTech: say(await a.put(`/api/work-orders/lines/${ls[1]}/technicians`, { staffIds: [GB.staff_id] })) };
  const me = (await candidates(a)).find((x) => x.name === ME_NAME);
  const v = await viewAs(browser, p, a, GB.id, me?.id ?? ''); try { const pg = v.page; await pg.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000, pg);
    const tg = pg.locator(`[data-test-id="button_clock_toggle_task_${ls[1]}"]`).first(); o.R2.startFound = await tg.count(); if (!o.R2.startFound) { o.R2.toggles = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="button_clock_toggle_task_"]')].map(e => e.getAttribute('data-test-id').slice(-12))`); }
    const t2 = o.R2.startFound ? tg : pg.locator('[data-test-id^="button_clock_toggle_task_"]').last(); await t2.click({ force: true }).catch(() => {}); await W(2500, pg);
    const ds = pg.locator('.q-dialog:visible').last(); if (await ds.count()) { o.R2.startDialog = (await ds.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160); await ds.locator('button').filter({ hasText: /Start|Clock In|Confirm/i }).last().click().catch(() => {}); await W(2000, pg); }
    o.R2.running = ((await api(pg).get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.label) ?? 'no clock running'; await shot('R2-clocked-in', pg); await W(65_000, pg);
    await t2.click({ force: true }).catch(() => {}); await W(2500, pg); const dc = pg.locator('.q-dialog:visible').last(); await dc.locator('textarea').first().fill('ZZAUTOTEST labor before deletion').catch(() => {}); await dc.locator('button').filter({ hasText: /Clock Out/i }).last().click().catch(() => {}); await W(3000, pg);
    o.R2.after = ((await api(pg).get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.label) ?? 'no clock running'; } finally { await v.close(); }
  await woPage(wo); o.R2.labor = await laborRows(); o.R2.deletable = (await rowOf(GB))?.deletable ?? null; await shot('R2-labor');
  o.R2.delete = await del(GB.staff_id);
  o.R3 = { deactivate: say(await a.post('/api/iam/change-status', { id: GB.id })), active: (await rowOf(GB))?.is_active ?? null }; o.R3.delete = await del(GB.staff_id);
  o.R4 = { unenrol: say(await a.post('/api/staff/enrollment/remove', { staffId: GB.staff_id, workplaceId: HEAVY, departmentId: svc?.id })) }; o.R4.delete = await del(GB.staff_id);
  { const r = await rowOf(GB); const other = Object.entries(RI).find(([l]) => /Office User/i.test(l))?.[1] ?? Object.entries(RI).find(([l]) => !/Technician|Admin/i.test(l))?.[1];
    o.R5 = { roleTo: Object.entries(RI).find(([, id]) => id === other)?.[0] ?? null, change: r ? say(await a.post(`/api/staff/${GB.staff_id}/change`, { first_name: r.first_name, last_name: r.last_name, email: r.email, role_id: other, workplace_id: HEAVY, job_title: r.job_title, salary_type: r.salary_type, salary: r.salary, billable: !!r.billable, clockable: false })) : 'row not found' }; o.R5.delete = await del(GB.staff_id); }
  o.stillListedB = (await staffRows(a, GB.email)).length;
  await woPage(wo); o.laborEnd = await laborRows(); await shot('labor-end');
  // the Settings > Staff screen's own answer for B (the delete control on screen), as a person would try it
  await p.goto(`${APP}/administration/staff`, { waitUntil: 'domcontentloaded' }); await W(6000); const sb = p.locator('input[type=search], input[placeholder*="Search" i]').first(); if (!(await sb.isVisible().catch(() => false))) await p.getByText(/^\s*Search\s*$/).first().click().catch(() => {}); await W(600);
  await p.locator('input[type=search], input[placeholder*="Search" i]').first().fill(`Gone B Tech ${RUNNO}`).catch(() => {}); await W(3000); const row = p.locator('tbody tr').filter({ hasText: `Tech ${RUNNO}` }).first();
  o.staffScreen = { row: (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160), controls: await row.evaluate((r) => [...r.querySelectorAll('button, i')].map((e: any) => (e.getAttribute('data-test-id') || '') + '=' + (e.innerText || e.getAttribute('aria-label') || '').trim()).slice(0, 12)).catch(() => null) };
  const delBtn = row.locator('button, i').filter({ hasText: /delete/i }).first(); o.staffScreen.deleteControl = await delBtn.count();
  if (o.staffScreen.deleteControl) { await delBtn.click().catch(() => {}); await W(1500); const cf = p.locator('.q-dialog:visible').last(); o.staffScreen.question = (await cf.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await cf.locator('button').filter({ hasText: /Delete|Yes|Confirm|Remove/i }).last().click().catch(() => {}); await W(2500); o.staffScreen.answer = await toasts(p); }
  await shot('staff-screen');
  o.deletedUserLine = Object.entries({ ...(o.R1.laborAfter ?? {}), ...(o.laborEnd ?? {}) }).filter(([, v]) => /Deleted user/i.test(String(v))).map(([k]) => k);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
finally { fs.writeFileSync(path.join(EV, 'C368191-b40.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C368191', JSON.stringify(o).slice(0, 6000)); await done(browser); }
