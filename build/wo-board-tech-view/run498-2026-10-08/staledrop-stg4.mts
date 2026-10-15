/**
 * staledrop-stg4.mts — 15 Oct 2026, fourth pass on STAGING: C97012 "a drop on a stale board is refused when the status or the
 * user's permission changed meanwhile", following its CURRENT steps.
 *
 * WHY THIS SCRIPT: the earlier C97012 blocks (s9-fix7.mts, s9-batchB.mts, c368149-two.mts) used the SHARED role
 * "ZZAUTOTEST WO View Only" as the case's [Role-D], switched Work orders > Create & Edit ON in it, and (s9-fix7, second pass) stopped
 * before switching it off — which spoiled C97020's view-only check (judge/wave8b.json). The case asks for [Role-D] = a custom role
 * used by THIS CASE ONLY ("ZZAUTOTEST F3 Stale Drop Dispatcher Role", Work orders View + Create & Edit). Those three blocks now refuse
 * to run; this script never touches the view-only role.
 * WHAT IT DOES (as the Time-Clock-off test admin "ZZ WOB Runner", runner.mts, standing in for the second browser's Admin):
 *  - [Role-D] made on screen if missing (Administration > Roles & Permissions > Create Custom Role > Skip > name + Work orders View
 *    and Create & Edit > Create — stg-setup.mts recipe), read back; Create & Edit added by the role's own save if the screen missed it;
 *  - [User-A] = a fresh dispatcher user on [Role-D] (Time Clock off), seen in their own window (viewAs) with Ana and Ben pinned;
 *  - work orders: Alpha Co Complete, Bravo Co Approved, both led by ZZAUTOTEST Ana Alpha (Ana and Ben made eligible first);
 *  - step 4: the Admin side makes a REAL invoice for Alpha Co (POST /api/invoices/create — the Finance > Create Invoice call);
 *    step 5-6: [User-A] drags Alpha Co to Ben without refreshing, the alert is read, then refresh and lead/status read;
 *    step 7: the Admin side takes Create & Edit off [Role-D] (role save); step 8-9: [User-A] drags Bravo Co without refreshing,
 *    message and page read (a sign-out by the app is written down), then refresh and lead read.
 *  - finally: [Role-D] put back to View + Create & Edit and read back (its own starting state for the next run).
 * One session is shared (staging allows one sign-in), so "the second browser" is the runner taking the session for a moment and
 * handing it back to [User-A]; [User-A]'s window is NOT reloaded in between (that is the "stale board").
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, toColumn, shiftPrompt } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: RUN.id.slice(0, 8) };
const D = '@staging.shopview.local';
const ORG = (await import('./profile.mts')).ORG;
const ROLE_D = 'ZZAUTOTEST F3 Stale Drop Dispatcher Role';
const PREF = '/api/users/me/preferences/work-orders-list';
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
const rolesList = async () => ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) as any[];
const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
const woCodes = (r: any) => ((r?.fe_permissions ?? []) as any[]).map((x) => String(x.code ?? x.name)).filter((c) => /^workOrders/.test(c));
const toasts = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-notification, [role=alert]')].map(e => e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim()).filter(Boolean)`) as Promise<string[]>;
const goP = async (pg: Page, q: string) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All'); await display(pg, 'Board View'); if (q) await search(pg, q); };
async function dragOn(pg: Page, from: string, to: string, dy = 120) {
  await pg.locator(from).first().scrollIntoViewIfNeeded().catch(() => {}); const f = await pg.locator(from).first().boundingBox(), b = await pg.locator(to).first().boundingBox(); if (!f || !b) return `missing ${!f ? 'card' : 'column'}`;
  const gx = f.x + f.width * 0.45; await pg.mouse.move(gx, f.y + f.height / 2); await pg.mouse.down(); await pg.mouse.move(gx, f.y + f.height / 2 + 8, { steps: 4 });
  await pg.mouse.move(b.x + b.width / 2, b.y + dy, { steps: 20 }); await pg.waitForTimeout(400); await pg.mouse.up(); await pg.waitForTimeout(3000); return 'ok';
}

if (want('C97012')) {
  const o: any = {}; R.C97012 = o;
  let roleId: string | undefined; let ceIds: string[] = []; let baseIds: string[] = []; let roleBody: any = null;
  const putRole = async (ids: string[]) => say(await a.put(`/api/roles/${roleId}`, { name: roleBody.name, description: roleBody.description, view_mode: roleBody.view_mode, template_id: roleBody.template_id, fe_permissions: ids, cross_toggles: roleBody.cross_toggles }));
  try {
    // technicians (eligible: active, Heavy Duty / Service, Time Clock on)
    const TECH = (await rolesList()).find((r) => /^Technician$/i.test(r.label ?? r.name ?? ''))?.id;
    const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = dd.find((d: any) => (d.name ?? d.label) === 'Service');
    const tech = async (first: string, last: string, tag: string) => { const r = (await person(a, `ZZAUTOTEST ${first}`, last, { role: TECH, email: `zz.wob.${tag}${D}`, clockable: true })).row; if (r && !r.is_active) await a.post('/api/iam/change-status', { id: r.id }); if (r) await a.post('/api/staff/enrollment/create', { staffId: r.staff_id, workplaceId: HEAVY, departmentId: svc?.id }); return r; };
    const ANA = await tech('Ana', 'Alpha', 'ana.alpha'), BEN = await tech('Ben', 'Bravo', 'ben.bravo');
    const cands = await candidates(a); o.techsOffered = { ana: cands.some((c) => c.id === ANA?.staff_id), ben: cands.some((c) => c.id === BEN?.staff_id) };
    // [Role-D]
    roleId = (await rolesList()).find((r) => (r.label ?? r.name) === ROLE_D)?.id;
    if (!roleId) {
      await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
      await p.locator('button').filter({ hasText: /Create Custom Role/i }).first().click(); await p.waitForTimeout(3000);
      await p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first().click().catch(() => {}); await p.waitForTimeout(5000);
      await p.locator('[data-test-id="role_name_input"]').fill(ROLE_D);
      await p.locator('[data-test-id="area_workorders_view"]').click().catch(() => {}); await p.waitForTimeout(600);
      await p.locator('[data-test-id="area_workorders_createandedit"]').click().catch(() => {}); await p.waitForTimeout(600);
      await shot(p, 'C97012-stg4-role-filled');
      await p.locator('button').filter({ hasText: /^\s*Create\s*$/ }).last().click(); await p.waitForTimeout(3000);
      const conf = p.locator('.q-dialog button').filter({ hasText: /Create|Continue|Yes|Confirm/i }).last(); if (await conf.count()) { await conf.click().catch(() => {}); await p.waitForTimeout(3000); }
      roleId = (await rolesList()).find((r) => (r.label ?? r.name) === ROLE_D)?.id; o.roleCreatedOnScreen = !!roleId;
    }
    if (!roleId) throw new Error(`[Role-D] "${ROLE_D}" could not be made`);
    roleBody = await roleRead(roleId);
    const adminRole = (await rolesList()).find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''));
    const adminPerms: any[] = (await roleRead(adminRole?.id))?.fe_permissions ?? [];
    ceIds = adminPerms.filter((x) => /^workOrdersCreateAndEdit$/.test(String(x.code ?? x.name))).map((x) => x.id);
    const viewIds = adminPerms.filter((x) => /^workOrdersView$/.test(String(x.code ?? x.name))).map((x) => x.id);
    baseIds = [...new Set([...((roleBody?.fe_permissions ?? []) as any[]).filter((x) => !/^workOrdersCreateAndEdit$/.test(String(x.code ?? x.name))).map((x) => x.id), ...viewIds])];
    if (!woCodes(roleBody).includes('workOrdersCreateAndEdit') || !woCodes(roleBody).includes('workOrdersView')) o.roleSetUp = await putRole([...baseIds, ...ceIds]);
    o.roleAtStart = woCodes(await roleRead(roleId));
    // work orders: Alpha Co Complete, Bravo Co Approved, both led by Ana
    const q = `ZZAUTOTEST F3 Stale Drop ${Date.now() % 100000}`; const w: Record<string, string> = {}; const log: string[] = [];
    const canned = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data);
    const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
    for (const co of ['Alpha Co', 'Bravo Co']) { const c = await customer(a, `${q} ${co}`, 'ZZF3SD'); const id = await workOrder(a, c, 'estimate', null);
      await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: canned[1 % canned.length].id, status: 'authorized' });
      log.push(`${co} approved ${say(await a.post('/api/work-orders/change-status', { id, status: 'approved' }))}`); log.push(`${co} lead ${say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: ANA.staff_id }))}`); w[co] = id; }
    { const id = w['Alpha Co']; log.push(`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: id, mileage: '123456' }))}`);
      for (const l of await linesRaw(id)) { for (const rq of (l.part_requests ?? l.partRequests ?? []) as any[]) log.push(`remove part request ${say(await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {}))}`);
        log.push(`story ${say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: id }))}`); log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: id }))}`); }
      for (const st of ['in_progress', 'ready_for_review', 'complete']) log.push(`wo ${st} ${say(await a.post('/api/work-orders/change-status', { id, work_order: id, status: st }))}`); }
    const statusOf = async (co: string) => (await workOrders(a, q)).find((x: any) => x.id === w[co]);
    const lead = async (co: string) => { const x = await statusOf(co); return x?.techAssignedFirstName ? `${x.techAssignedFirstName} ${x.techAssignedLastName}` : 'none'; };
    const num = async (co: string) => (await statusOf(co))?.number;
    o.setup = { log, alpha: `${await num('Alpha Co')} ${(await statusOf('Alpha Co'))?.status} lead=${await lead('Alpha Co')}`, bravo: `${await num('Bravo Co')} ${(await statusOf('Bravo Co'))?.status} lead=${await lead('Bravo Co')}` };
    // [User-A]
    const UA = (await person(a, 'ZZAUTOTEST', `Stale Dispatcher ${Date.now() % 100000}`, { role: roleId, email: `zz.wob.stale.dispatcher.${Date.now() % 100000}${D}`, clockable: false })).row;
    if (!UA) throw new Error('[User-A] not made');
    const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView');
    const v = await viewAs(browser, p, a, UA.id, me?.id ?? '', RUN.toRunner);
    const toUserA = async () => { let s = await a.post('/api/switch-user', { user_id: UA.id }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: UA.id }); } return s.status; };
    try { const pg = v.page; pg.setDefaultTimeout(30_000); o.userAPerms = v.perms;
      { const pv = (await api(pg).get(PREF)).body?.data?.value ?? {}; await api(pg).put(PREF, { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id], filters: {} } }); }
      await goP(pg, q); const cardSel = (co: string) => `[data-test-id="board_card_${w[co]}"]`; await toColumn(pg, ANA.staff_id);
      o.start = { alphaCard: await pg.locator(cardSel('Alpha Co')).count(), bravoCard: await pg.locator(cardSel('Bravo Co')).count() }; await shot(pg, 'C97012-stg4-start');
      // step 4: the Admin (second browser) invoices Alpha Co — a real invoice
      await RUN.toRunner(); o.step4 = { invoice: say(await a.post('/api/invoices/create', { work_order_id: w['Alpha Co'], issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) })), status: (await statusOf('Alpha Co'))?.status }; o.step4.backToUserA = await toUserA();
      // step 5: no refresh — drag Alpha Co to Ben
      o.step5 = { drag: await dragOn(pg, cardSel('Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`) }; o.step5.shiftPrompt = await shiftPrompt(pg, 'Keep shifts'); o.step5.alert = await toasts(pg); await shot(pg, 'C97012-stg4-step5');
      o.step5.anaCards = await pg.evaluate(`[...document.querySelectorAll('[data-test-id="board_column_${ANA.staff_id}"] [data-test-id="board_card_number"]')].map(e => e.textContent.trim())`);
      await pg.locator('.q-notification button').first().click().catch(() => {}); await pg.waitForTimeout(800);
      // step 6: refresh, read Alpha Co
      await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await goP(pg, q); await toColumn(pg, ANA.staff_id);
      o.step6 = { status: (await statusOf('Alpha Co'))?.status, lead: await lead('Alpha Co') }; await shot(pg, 'C97012-stg4-step6');
      // step 7: the Admin takes Create & Edit off [Role-D]
      await RUN.toRunner(); o.step7 = { save: await putRole(baseIds) }; o.step7.roleNow = woCodes(await roleRead(roleId)); o.step7.backToUserA = await toUserA();
      // step 8: no refresh — drag Bravo Co to Ben
      o.step8 = { drag: await dragOn(pg, cardSel('Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`) }; o.step8.shiftPrompt = await shiftPrompt(pg, 'Keep shifts'); o.step8.alert = await toasts(pg); o.step8.url = pg.url().replace(APP, ''); o.step8.signedOut = /login|sign-?in/i.test(pg.url()); await shot(pg, 'C97012-stg4-step8');
      // step 9: refresh, read Bravo Co
      await pg.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await pg.waitForTimeout(5000); o.step9 = { lead: await lead('Bravo Co'), url: pg.url().replace(APP, '') }; await shot(pg, 'C97012-stg4-step9');
      (globalThis as any).__wobPage = pg; await (globalThis as any).__shotEach?.('C97012'); (globalThis as any).__wobPage = p;
    } finally { await v.close(); }
  } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, 'C97012-stg4-error'); }
  finally {
    // [Role-D] back to its starting state (View + Create & Edit), read back — every run, even after an error
    if (roleId && roleBody) { o.roleRestore = await putRole([...baseIds, ...ceIds]).catch((e: any) => String(e).slice(0, 80)); o.roleAfterRestore = woCodes(await roleRead(roleId)); }
  }
  console.log(t(), 'C97012', JSON.stringify(o).slice(0, 10000));
}
fs.writeFileSync(path.join(EV, 'staledrop-stg4.json'), JSON.stringify(R, null, 1));
await RUN.end().catch(() => {});
await done(browser);
