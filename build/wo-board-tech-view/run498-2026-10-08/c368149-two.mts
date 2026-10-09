/** S9 follow-up (2026-10-09): C97003 with a positive control (the dispatcher does the same column drag first), C97010
 *  (where is an inactive technician's column), C97012 (find the cards before dragging), C368146 (with the dispatcher's
 *  own technician order set first, as the case says), C368149 (second page opened reliably). */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: RUN.id.slice(0, 8) };
const PREF = '/api/users/me/preferences/work-orders-list';
const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const ORIGINAL = await prefGet();
const pins = async (ids: string[]) => { await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: ids } }); };
const RUNNO = String(Date.now() % 100000);
const D = '@staging.shopview.local';
const TECH_ROLE = (await roleIds(a))['Technician'];
const tech = async (first: string, last: string, tag: string) => (await person(a, `ZZAUTOTEST ${first}`, last, { role: TECH_ROLE, email: `zz.wob.${tag}${D}`, clockable: true })).row;
const ANA = await tech('Ana', 'Alpha', 'ana.alpha'), BEN = await tech('Ben', 'Bravo', 'ben.bravo'), CAL = await tech('Cal', 'Charlie', 'cal.charlie'), DAN = await tech('Dan', 'Delta', 'dan.delta');
R.techs = { ana: !!ANA?.staff_id, ben: !!BEN?.staff_id, cal: !!CAL?.staff_id, dan: !!DAN?.staff_id };
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
/** take a work order with one line to Complete, then (optionally) invoice it and mark it paid; every answer logged */
async function ensure(sel: string, n: string, pg: Page = p) {
  for (let i = 0; i < 8; i++) { if (await pg.locator(sel).count()) return true; await pg.waitForTimeout(5000); await search(pg, n); }
  return false;
}
async function finish(wo: string, to: 'complete' | 'invoiced' | 'paid', log: any[]) {
  const ls = await linesRaw(wo); if (!ls.length) ls.push({ line_id: await mkLine(wo, 1) });
  log.push(`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' }))}`);
  for (const l of await linesRaw(wo)) {
    // a canned line brings vendor part requests, and the work order refuses Complete until they are received:
    // cancel them (playbook §Y: POST /api/work-orders/part/remove-request/{requestId})
    const reqs = (l.part_requests ?? l.partRequests ?? []) as any[];
    if (!R.lineKeys) R.lineKeys = Object.keys(l).join(',');
    for (const q of reqs) log.push(`remove part request ${say(await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {}))}`);
    if ((l.parts ?? []).length) log.push(`line still holds ${(l.parts ?? []).length} picked part(s)`);
    log.push(`story ${say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: wo }))}`);
    log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: wo }))}`);
  }
  log.push(`lines now ${(await linesRaw(wo)).map((x: any) => x.status ?? x.line_status).join(',')}`);
  for (const s of ['in_progress', 'ready_for_review', 'complete']) log.push(`wo ${s} ${say(await a.post('/api/work-orders/change-status', { id: wo, work_order: wo, status: s }))}`);
  if (to === 'complete') return;
  log.push(`invoice ${say(await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }))}`);
  if (to === 'paid') log.push(`paid ${say(await a.post('/api/work-orders/change-status', { id: wo, work_order: wo, status: 'paid' }))}`);
  log.push(`status now ${(await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order?.status}`);
}

type Spec = { co: string; lead: any | null; status?: string };
/** one customer per work order: "<prefix> <co>"; returns {co: {id, number}} and the search text */
async function mkSet(prefix: string, specs: Spec[]) {
  const q = `${prefix} ${RUNNO}`; const out: Record<string, { id: string; number: string }> = {}; const log: string[] = [];
  for (const s of specs) {
    const c = await customer(a, `${q} ${s.co}`, 'ZZF9');
    const w = await workOrder(a, c, 'estimate', null); await mkLine(w, 1);
    await a.post('/api/work-orders/change-status', { id: w, status: 'approved' });
    if (s.lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: s.lead.staff_id });
    const st = s.status ?? 'approved';
    if (st === 'in_progress') await a.post('/api/work-orders/change-status', { id: w, status: 'in_progress' });
    else if (st === 'declined') log.push(`declined ${say(await a.post('/api/work-orders/change-status', { id: w, status: 'declined' }))}`);
    else if (['complete', 'invoiced', 'paid'].includes(st)) await finish(w, st as any, log);
    out[s.co] = { id: w, number: '' };
  }
  for (const w of await workOrders(a, q)) for (const k of Object.keys(out)) if (out[k].id === w.id) out[k].number = w.number;
  return { q, w: out, log };
}
const nameOf = (set: any) => (num: string) => Object.keys(set.w).find((k) => set.w[k].number === num) ?? num;
const go = async (d: string, q: string, pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };
const col = async (id: string, set: any) => ((await boardCols(p)).find((c) => c.id === id)?.cards ?? []).map(nameOf(set));
const cnt = async (id: string) => (await boardCols(p)).find((c) => c.id === id)?.count;
const grp = async (id: string, set: any) => ((await groups(p)).find((g) => g.id === id)?.rows ?? []).map(nameOf(set));
const card = (set: any, co: string) => `[data-test-id="board_card_${set.w[co].id}"]`;
const row = (set: any, co: string) => `[data-test-id="tech_view_row_${set.w[co].id}"]`;
const leadOf = async (set: any, co: string) => { const w = (await workOrders(a, set.q)).find((x: any) => x.id === set.w[co].id); return w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none'; };
const below = async (sel: string) => { const b = await p.locator(sel).boundingBox(); return b ? Math.round(b.height - 4) : 40; };
/** drag a whole column/group by its six-dot handle to just before another column/group */
async function dragHandle(fromHeader: string, toHeader: string) {
  const h = p.locator(fromHeader).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).first();
  const hb = await h.boundingBox(); const tb = await p.locator(toHeader).boundingBox();
  if (!hb || !tb) return `no handle/target (${!!hb}/${!!tb})`;
  await p.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await p.mouse.down(); await p.mouse.move(hb.x + 12, hb.y + 4, { steps: 4 });
  await p.mouse.move(tb.x + 6, tb.y + tb.height / 2, { steps: 20 }); await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(2500); return 'ok';
}
const order = (cols: any[], ids: Record<string, string>) => cols.map((c) => Object.keys(ids).find((k) => ids[k] === c.id) ?? (c.id === 'unassigned' ? 'Unassigned' : null)).filter(Boolean);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 'c368149-two.json'), JSON.stringify(R, null, 1));
}
const IDS = { Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id, Dan: DAN.staff_id };


const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const ORG = (await import('./profile.mts')).ORG;
const rolesL: any[] = ((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data?.collection ?? []);
const RI = await roleIds(a);
const roleId = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
const ADMIN_ROLE = roleId(/^admin(istrator)?$/i);
const VIEW_ROLE = roleId(/^ZZAUTOTEST WO View Only$/) ?? (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0]?.role_id;
const stamp = Date.now() % 1000000;
const mkUser = async (first: string, last: string, role: string, tag: string) => (await person(a, first, last, { role, email: `zz.wob.${tag}.${stamp}${D}`, clockable: false })).row;
const asUser = async (u: any) => viewAs(browser, p, a, u.id, me.id, RUN.toRunner);
const colsOf = async (pg: Page) => { const save = (p as any); return pg.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(h => h.getAttribute('data-test-id').replace('board_column_header_', ''))`) as Promise<string[]>; };
const allCols = async (pg: Page) => { const seen: string[] = []; await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(500);
  for (let i = 0; i < 40; i++) { for (const c of await colsOf(pg)) if (!seen.includes(c)) seen.push(c); const moved = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await pg.waitForTimeout(350); if (!moved) break; }
  await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(400); return seen; };
const named = (ids: string[], m: Record<string, string>) => ids.map((id) => id === 'unassigned' ? 'Unassigned' : Object.keys(m).find((k) => m[k] === id)).filter(Boolean) as string[];
const goP = async (pg: Page, d: string, q: string) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); for (let i = 0; i < 3 && !(await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).count()); i++) { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); } await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };
const colCards = async (pg: Page, id: string, set: any) => ((await pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${id}"]'); return c ? [...c.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : []; })()`)) as string[]).map(nameOf(set));
const groupRows = async (pg: Page, id: string, set: any) => { const gs = await pg.evaluate(`(() => { const out = {}; let cur = null; for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) { const tid = tr.getAttribute('data-test-id') || ''; if (tid.startsWith('tech_view_group_')) { cur = tid.replace('tech_view_group_', ''); out[cur] = []; continue; } const m = tr.innerText.match(/S\\d+-\\d+/); if (cur && m) out[cur].push(m[0]); } return out; })()`) as Record<string, string[]>; return (gs[id] ?? []).map(nameOf(set)); };
async function dragHandleOn(pg: Page, fromHeader: string, toHeader: string, dx = 6) {
  const h = pg.locator(fromHeader).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).first();
  const hb = await h.boundingBox().catch(() => null); const tb = await pg.locator(toHeader).boundingBox().catch(() => null);
  if (!hb || !tb) return `no handle/target (${!!hb}/${!!tb})`;
  await pg.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await pg.mouse.down(); await pg.mouse.move(hb.x + 12, hb.y + 4, { steps: 4 });
  await pg.mouse.move(tb.x + dx, tb.y + tb.height / 2, { steps: 20 }); await pg.waitForTimeout(400); await pg.mouse.up(); await pg.waitForTimeout(2500); return 'ok';
}
async function dragOn(pg: Page, from: string, to: string, dy = 4) {
  await pg.locator(from).first().scrollIntoViewIfNeeded().catch(() => {}); const f = await pg.locator(from).first().boundingBox(), b = await pg.locator(to).first().boundingBox(); if (!f || !b) return 'missing';
  const gx = f.x + f.width * 0.45; await pg.mouse.move(gx, f.y + f.height / 2); await pg.mouse.down(); await pg.mouse.move(gx, f.y + f.height / 2 + 8, { steps: 4 });
  await pg.mouse.move(b.x + b.width / 2, b.y + dy, { steps: 20 }); await pg.waitForTimeout(400); await pg.mouse.up(); await pg.waitForTimeout(3000); return 'ok';
}
const toastsOn = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim())`) as Promise<string[]>;
const prefFor = async () => (await a.get(PREF)).body?.data?.value ?? {};


const hdr = (id: string) => `[data-test-id="board_column_header_${id}"]`;
const showCols = async (pg: Page, first: string) => { await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(400);
  for (let i = 0; i < 400 && !(await pg.locator(hdr(first)).count()); i++) { const mv = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await pg.waitForTimeout(300); if (!mv) break; }
  await pg.evaluate(`document.querySelector('[data-test-id="board_column_${first}"]')?.scrollIntoView({ inline: 'start' })`); await pg.waitForTimeout(800); };
const visibleIds = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(h => { const r = h.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }).map(h => h.getAttribute('data-test-id').replace('board_column_header_', ''))`) as Promise<string[]>;

await run('C97003', async () => {
  const s = await mkSet('ZZAUTOTEST F3 Viewer Column Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]); const o: any = {};
  // positive control: the dispatcher, no pins, drags Cal's column before Ana's in the same layout
  await pins([]); await a.put(PREF, { value: { ...(await prefFor()), technicianOrder: [] } }); await goP(p, 'Board View', s.q);
  await showCols(p, ANA.staff_id); o.controlVisible = named(await visibleIds(p), IDS);
  o.controlDrag = await dragHandleOn(p, hdr(CAL.staff_id), hdr(ANA.staff_id)); o.control = named(await allCols(p), IDS); await shot(p, 'C97003-control');
  const viewer = await mkUser('ZZAUTOTEST', `Viewer2 ${stamp}`, VIEW_ROLE, 'viewer2'); const v = await asUser(viewer);
  try { const pg = v.page; await goP(pg, 'Board View', s.q); o.step5 = named(await allCols(pg), IDS);
    await showCols(pg, ANA.staff_id); o.viewerVisible = named(await visibleIds(pg), IDS); o.handleOnCal = await pg.locator(hdr(CAL.staff_id)).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).count();
    o.step6drag = await dragHandleOn(pg, hdr(CAL.staff_id), hdr(ANA.staff_id)); await shot(pg, 'C97003-viewer-after-drag'); o.step6 = named(await allCols(pg), IDS);
    o.viewerSavedOrder = ((await prefFor()).technicianOrder ?? []).length;
    // step 7: Ben before Unassigned; step 8: Unassigned has no handle
    await showCols(pg, BEN.staff_id); o.unassignedVisible = await pg.locator(hdr('unassigned')).isVisible().catch(() => false);
    o.step7drag = await dragHandleOn(pg, hdr(BEN.staff_id), hdr('unassigned'), 2); o.step7 = named(await allCols(pg), IDS).slice(0, 5);
    o.step8unassignedHandle = await pg.locator(hdr('unassigned')).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).count();
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await goP(pg, 'Board View', s.q); o.step11 = named(await allCols(pg), IDS);
  } finally { await v.close(); }
  await goP(p, 'Board View', s.q); o.step12dispatcher = named(await allCols(p), IDS);
  R.C97003 = o;
});

await run('C97010', async () => {
  const dan = (await person(a, 'ZZAUTOTEST F3 Dan', 'Delta', { role: TECH_ROLE, email: `zz.wob.f3dan2.${stamp}${D}`, clockable: true })).row;
  await pins([ANA.staff_id, BEN.staff_id, dan.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Inactive Drop', [{ co: 'Alpha Co', lead: ANA }, { co: 'Delta Co', lead: { staff_id: dan.staff_id } }]); const o: any = {};
  await goP(p, 'Board View', s.q); o.beforeDeactivate = (await boardCols(p)).find((c) => c.id === dan.staff_id) ?? 'not drawn';
  o.deactivate = say(await a.post('/api/iam/change-status', { id: dan.id })); o.active = (await staffRows(a, dan.email)).find((x) => x.email === dan.email)?.is_active;
  await goP(p, 'Board View', s.q); const all = await allCols(p); o.danInBoard = all.includes(dan.staff_id); o.pinsNow = (await prefFor()).pinnedTechnicianIds?.length;
  o.danCol = (await boardCols(p)).find((c) => c.id === dan.staff_id) ?? 'not drawn'; await shot(p, 'C97010-after-deactivate');
  await display(p, 'Tech View'); await p.waitForTimeout(2500); o.danGroup = await p.locator(`[data-test-id="tech_view_group_${dan.staff_id}"]`).count();
  o.danGroupText = await p.locator(`[data-test-id="tech_view_group_${dan.staff_id}"]`).innerText().catch(() => null);
  if (o.danInBoard) { await goP(p, 'Board View', s.q); await showCols(p, ANA.staff_id); o.visible = named(await visibleIds(p), { ...IDS, Dan: dan.staff_id });
    o.dragToDan = await dragOn(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${dan.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
    o.step5 = { lead: await leadOf(s, 'Alpha Co'), msg: await toastsOn(p), danCount: (await boardCols(p)).find((c) => c.id === dan.staff_id)?.count }; }
  // the failed save goes back (server refuses the save; real offline triggers the branch's sleeping page)
  await goP(p, 'Board View', s.q); const refuse = async (r: any) => { if (r.request().method() !== 'GET') await r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"ZZ forced failure"}]}' }); else await r.continue(); };
  await p.route(/board-move|change-lead-technician/, refuse); await dragOn(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  o.step7 = { msg: await toastsOn(p), ana: await colCards(p, ANA.staff_id, s) }; await shot(p, 'C97010-alert'); await p.waitForTimeout(10000); o.step8stillThere = (await toastsOn(p)).length > 0;
  await p.unroute(/board-move|change-lead-technician/, refuse); await goP(p, 'Board View', s.q); o.step9 = { ana: await colCards(p, ANA.staff_id, s), lead: await leadOf(s, 'Alpha Co') };
  R.C97010 = o;
});

await run('C97012', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Stale Drop', [{ co: 'Alpha Co', lead: ANA, status: 'complete' }, { co: 'Bravo Co', lead: ANA }]); const o: any = {};
  const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
  const orig = await roleRead(VIEW_ROLE); fs.writeFileSync(path.join(EV, 'S9-role-viewonly-before.json'), JSON.stringify(orig, null, 1));
  const adminRole = await roleRead(ADMIN_ROLE); const ce = (adminRole?.fe_permissions ?? []).filter((x: any) => /^workOrders(CreateAndEdit|View)$/.test(x.code));
  const put = async (ids: string[]) => say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: orig.name, description: orig.description, view_mode: orig.view_mode, template_id: orig.template_id, fe_permissions: ids, cross_toggles: orig.cross_toggles }));
  o.addCE = await put([...new Set([...(orig.fe_permissions ?? []).map((x: any) => x.id), ...ce.map((x: any) => x.id)])]);
  const userD = await mkUser('ZZAUTOTEST', `RoleD2 ${stamp}`, VIEW_ROLE, 'roled2'); const v = await asUser(userD);
  try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } });
    await goP(pg, 'Board View', s.q); for (let i = 0; i < 6 && !(await pg.locator(card(s, 'Alpha Co')).count()); i++) { await pg.waitForTimeout(4000); await search(pg, s.q); }
    o.cardsSeen = await colCards(pg, ANA.staff_id, s); o.userDPerms = v.perms; await shot(pg, 'C97012-userD-board');
    await RUN.toRunner(); o.invoice = say(await a.post('/api/invoices/create', { work_order_id: s.w['Alpha Co'].id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }));
    await a.post('/api/switch-user', { user_id: userD.id });
    o.step5drag = await dragOn(pg, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts');
    o.step5 = { msg: await toastsOn(pg), ana: await colCards(pg, ANA.staff_id, s) }; await shot(pg, 'C97012-step5');
    await RUN.toRunner(); o.removeCE = await put((orig.fe_permissions ?? []).map((x: any) => x.id)); await a.post('/api/switch-user', { user_id: userD.id });
    o.step8drag = await dragOn(pg, card(s, 'Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts');
    o.step8 = { msg: await toastsOn(pg), url: pg.url().replace(APP, ''), ana: await colCards(pg, ANA.staff_id, s) }; await shot(pg, 'C97012-step8');
  } finally { await v.close(); }
  o.step6 = { status: (await workOrders(a, s.q)).find((w: any) => w.id === s.w['Alpha Co'].id)?.status, lead: await leadOf(s, 'Alpha Co') }; o.step9 = await leadOf(s, 'Bravo Co');
  o.restore = await put((orig.fe_permissions ?? []).map((x: any) => x.id)); const back = await roleRead(VIEW_ROLE);
  o.restoredExactly = JSON.stringify((back?.fe_permissions ?? []).map((x: any) => x.id).sort()) === JSON.stringify((orig.fe_permissions ?? []).map((x: any) => x.id).sort());
  R.C97012 = o;
});

await run('C368146', async () => {
  const o: any = {}; await pins([DAN.staff_id]); await a.put(PREF, { value: { ...(await prefFor()), technicianOrder: [] } });
  await goP(p, 'Board View', ''); await showCols(p, BEN.staff_id);
  o.orderDrag = await dragHandleOn(p, hdr(CAL.staff_id), hdr(BEN.staff_id)); const base = await allCols(p);
  o.start = { count: base.length, calBeforeBen: base.indexOf(CAL.staff_id) < base.indexOf(BEN.staff_id), danPinnedFirst: base[1] === DAN.staff_id, last: base[base.length - 1] === CAL.staff_id || base[base.length - 1] === BEN.staff_id ? 'Cal/Ben last' : 'others after' };
  const aaron = (await person(a, 'ZZAUTOTEST Aaron', `Able ${stamp}`, { role: TECH_ROLE, email: `zz.wob.aaron2.${stamp}${D}`, clockable: true })).row;
  await goP(p, 'Board View', ''); const a1 = await allCols(p); o.afterAaron = { count: a1.length, aaronAt: a1.indexOf(aaron.staff_id), lastIndex: a1.length - 1, calBeforeBen: a1.indexOf(CAL.staff_id) < a1.indexOf(BEN.staff_id), savedOrderLen: ((await prefFor()).technicianOrder ?? []).length };
  const ezra = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: `zz.wob.ezra2.${stamp}${D}`, clockable: false })).row;
  o.ezraOn = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: ezra.email, clockable: true })).log;
  await goP(p, 'Board View', ''); const a2 = await allCols(p); o.afterEzra = { count: a2.length, aaronAt: a2.indexOf(aaron.staff_id), ezraAt: a2.indexOf(ezra.staff_id), lastIndex: a2.length - 1 };
  await shot(p, 'C368146-board-end');
  R.C368146 = o;
});

await run('C368149', async () => {
  // TWO REAL SESSIONS (2026-10-09): the old version switched ONE server session between two users; with live updates on,
  // the app then signed the second browser out ("Session expired") and the check hung. Browser 1 = ZZ WOB Runner (this
  // session), browser 2 = Admin ShopView in its own, separate quick-login session. Both are dispatchers (Create & Edit).
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Later Drop Wins', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }]); const o: any = {}; R.C368149 = o;
  const { signIn } = await import('../../global-search/e2e/fixtures/auth.js'); const s2: any = await signIn('/workorders?tab=all'); const pg2: Page = s2.page;
  try {
    await RUN.toRunner(); await goP(p, 'Board View', s.q); o.session1AliveAfterSecondLogin = !/\/login/.test(p.url());
    await goP(pg2, 'Board View', s.q);
    /* FIX (2026-10-09): Ana is not pinned for browser 2's user, so her column sits far right among ~200 — scroll to it */
    const showAna = async () => { for (let k = 0; k < 3 && !(await colCards(pg2, ANA.staff_id, s)).length; k++) { await toColumn(pg2, ANA.staff_id).catch(() => {}); await pg2.waitForTimeout(1500); } };
    await showAna();
    o.b1start = await colCards(p, ANA.staff_id, s); o.b2start = await colCards(pg2, ANA.staff_id, s);
    const top1 = o.b1start[0]; await dragOn(p, card(s, 'Charlie Co'), card(s, top1), 4); await p.waitForTimeout(2000); o.b1after = await colCards(p, ANA.staff_id, s); o.b1msg = await toastsOn(p);
    await showAna(); o.b2beforeDrop = await colCards(pg2, ANA.staff_id, s); if (!o.b2start.length) o.b2start = o.b2beforeDrop; if (!o.b2start.length) throw new Error('browser 2 never showed Ana\'s column');
    const top2 = o.b2start[0]; await dragOn(pg2, card(s, 'Bravo Co'), card(s, top2), 4); await pg2.waitForTimeout(2000); o.b2drop = { order: await colCards(pg2, ANA.staff_id, s), msg: await toastsOn(pg2) }; await shot(pg2, 'C368149-two-b2');
    const seen: string[] = []; for (let i = 0; i < 12; i++) { for (const m of await toastsOn(p)) if (!seen.includes(m)) seen.push(m); await p.waitForTimeout(500); } o.b1warning = seen; await shot(p, 'C368149-two-b1-watch');
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await goP(p, 'Board View', s.q); o.b1afterRefresh = await colCards(p, ANA.staff_id, s);
    await pg2.reload({ waitUntil: 'domcontentloaded' }); await pg2.waitForTimeout(6000); await goP(pg2, 'Board View', s.q); await showAna(); o.b2afterRefresh = await colCards(pg2, ANA.staff_id, s); await shot(pg2, 'C368149-two-b2-refreshed');
  } finally { await s2.browser?.close().catch(() => {}); }
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'c368149-two.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
