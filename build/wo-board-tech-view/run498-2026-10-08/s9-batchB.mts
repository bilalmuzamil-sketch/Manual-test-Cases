/**
 * S9 batch B (2026-10-09) — drag to reorder, more than one person: C97003 (view-only user reorders technician columns),
 * C97005 (work order order shared at the location; technician order per user), C97007 (second dispatcher sees the
 * same order), C97010 (inactive technician refuses a drop; a failed save goes back), C97012 (status / permission
 * changed after the board loaded), C368146 (a new technician joins after the existing unpinned ones), C368147
 * (view-only user cannot drag), C368149 (two dispatchers reorder the same technician; the later drop wins).
 * One session, people taken in turn with switch-user: a second person's page is opened as that person (viewAs) and
 * left open without refreshing while the first person acts, then that person acts in turn — as two people would.
 * The view-only role is "ZZAUTOTEST WO View Only"; [Role-D] is the same role with Work orders > Create & Edit added
 * for C97012 and taken away again (saved first, put back and read back at the end).
 */
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
  fs.writeFileSync(path.join(EV, 's9-batchB.json'), JSON.stringify(R, null, 1));
}
const IDS = { Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id, Dan: DAN.staff_id };


const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
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
const goP = async (pg: Page, d: string, q: string) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };
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

await run('C97003', async () => {
  const s = await mkSet('ZZAUTOTEST F3 Viewer Column Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]);
  await pins([]); const dispatcherBefore = named(await allCols(p).catch(async () => { await goP(p, 'Board View', s.q); return allCols(p); }), IDS);
  await goP(p, 'Board View', s.q); const disp0 = named(await allCols(p), IDS);
  const viewer = await mkUser('ZZAUTOTEST', `Viewer ${stamp}`, VIEW_ROLE, 'viewer'); const v = await asUser(viewer); const o: any = { dispatcherStart: disp0 };
  try { const pg = v.page; o.viewerPerms = v.perms; await (async () => { await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [] } }); })();
    await goP(pg, 'Board View', s.q); o.step5 = named(await allCols(pg), IDS);
    const hdr = (id: string) => `[data-test-id="board_column_header_${id}"]`;
    // bring Ana, Ben, Cal next to each other on screen: they are consecutive (ZZAUTOTEST … names sort together)
    await pg.evaluate(`document.querySelector('[data-test-id="board_column_${ANA.staff_id}"]')?.scrollIntoView({ inline: 'start' })`); await pg.waitForTimeout(800);
    for (let i = 0; i < 30 && !(await pg.locator(hdr(ANA.staff_id)).count()); i++) { await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft += 600`); await pg.waitForTimeout(300); }
    await pg.evaluate(`document.querySelector('[data-test-id="board_column_${ANA.staff_id}"]')?.scrollIntoView({ inline: 'start' })`); await pg.waitForTimeout(800);
    o.step6drag = await dragHandleOn(pg, hdr(CAL.staff_id), hdr(ANA.staff_id)); o.step6 = named(await allCols(pg), IDS); await shot(pg, 'C97003-viewer-step6');
    await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(500);
    // step 7: Ben before Unassigned — bring Ben near the start by scrolling, then drag towards the Unassigned header
    await pg.evaluate(`document.querySelector('[data-test-id="board_column_${BEN.staff_id}"]')?.scrollIntoView({ inline: 'end' })`); await pg.waitForTimeout(600);
    o.step7drag = await dragHandleOn(pg, hdr(BEN.staff_id), hdr('unassigned'), 2); o.step7 = named(await allCols(pg), IDS);
    o.step8unassignedHandle = await pg.locator(hdr('unassigned')).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).count();
    await display(pg, 'Tech View'); await pg.waitForTimeout(2000);
    const gids = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^tech_view_group_[0-9a-f-]{36}$|^tech_view_group_unassigned$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as string[];
    o.step10first = gids[0];
    o.step10drag = await dragHandleOn(pg, `[data-test-id="tech_view_group_${BEN.staff_id}"]`, '[data-test-id="tech_view_group_unassigned"]', 2);
    const g2 = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^tech_view_group_[0-9a-f-]{36}$|^tech_view_group_unassigned$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as string[];
    o.step10 = { first: g2[0], order: named(g2, IDS) };
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await goP(pg, 'Board View', s.q); o.step11board = named(await allCols(pg), IDS);
    o.viewerSaved = (await prefFor()).technicianOrder ? 'technician order saved for the viewer' : 'nothing saved';
  } finally { await v.close(); }
  await goP(p, 'Board View', s.q); o.step12dispatcher = named(await allCols(p), IDS);
  R.C97003 = o;
});

await run('C97005', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Shared Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }]);
  const d2 = await mkUser('ZZ WOB', `Dispatcher ${stamp}`, ADMIN_ROLE, 'dispatcher2');
  await goP(p, 'Tech View', s.q); const o: any = { step3: await groupRows(p, ANA.staff_id, s) };
  await dragOn(p, row(s, 'Charlie Co'), row(s, 'Alpha Co'), 4); await shiftPrompt(p, 'Keep shifts'); o.step4 = await groupRows(p, ANA.staff_id, s);
  await display(p, 'Board View'); await p.waitForTimeout(2000); o.step6 = await colCards(p, ANA.staff_id, s);
  const v = await asUser(d2); try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } });
    await goP(pg, 'Tech View', s.q); o.step7tech = await groupRows(pg, ANA.staff_id, s);
    await display(pg, 'Board View'); await pg.waitForTimeout(2000); o.step7board = await colCards(pg, ANA.staff_id, s);
    o.step9techOrder = named(await allCols(pg), IDS).filter((x) => x === 'Ana' || x === 'Ben'); } finally { await v.close(); }
  await goP(p, 'Board View', s.q); o.step8 = await colCards(p, ANA.staff_id, s);
  R.C97005 = o;
});

await run('C97007', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Reassign Bottom', [{ co: 'Bravo Co', lead: BEN }, { co: 'Delta Co', lead: BEN }, { co: 'Aardvark Co', lead: CAL }, { co: 'Abbey Co', lead: CAL }, { co: 'Echo Co', lead: CAL }]);
  await goP(p, 'Board View', s.q); const o: any = { start: await colCards(p, BEN.staff_id, s) };
  const m = await openReassign(p, s.w['Aardvark Co'].id); await m.item.click(); await p.waitForTimeout(1200);
  await p.locator(`[data-test-id="option_lead_technician_${BEN.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step7 = await colCards(p, BEN.staff_id, s);
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${s.w['Abbey Co'].id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000); await pg.keyboard.type('ZZAUTOTEST Ben'); await pg.waitForTimeout(1200);
  await pg.locator('.q-menu .q-item').filter({ hasText: 'Ben Bravo' }).first().click(); await pg.waitForTimeout(3000); await pg.close();
  await goP(p, 'Board View', s.q); o.step9 = await colCards(p, BEN.staff_id, s);
  await dragOn(p, card(s, 'Echo Co'), card(s, 'Delta Co'), 4); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500); o.step10 = await colCards(p, BEN.staff_id, s);
  await goP(p, 'Tech View', s.q); o.step11 = await groupRows(p, BEN.staff_id, s);
  const d2 = await mkUser('ZZ WOB', `Dispatcher ${stamp}b`, ADMIN_ROLE, 'dispatcher2b'); const v = await asUser(d2);
  try { await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [BEN.staff_id] } });
    await goP(v.page, 'Board View', s.q); o.step12board = await colCards(v.page, BEN.staff_id, s); await display(v.page, 'Tech View'); await v.page.waitForTimeout(2000); await expandSmallGroups(v.page); o.step12tech = await groupRows(v.page, BEN.staff_id, s); } finally { await v.close(); }
  R.C97007 = o;
});

await run('C97010', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const dan = (await person(a, 'ZZAUTOTEST F3 Dan', 'Delta', { role: TECH_ROLE, email: `zz.wob.f3dan.${stamp}${D}`, clockable: true })).row;
  const s = await mkSet('ZZAUTOTEST F3 Inactive Drop', [{ co: 'Alpha Co', lead: ANA }, { co: 'Delta Co', lead: { staff_id: dan.staff_id } }]);
  const o: any = { deactivate: say(await a.post('/api/iam/change-status', { id: dan.id })) };
  o.danActive = (await staffRows(a, dan.email)).find((x) => x.email === dan.email)?.is_active;
  await goP(p, 'Board View', s.q); await toColumn(p, dan.staff_id);
  o.danColumn = (await boardCols(p)).find((c) => c.id === dan.staff_id); await shot(p, 'C97010-dan');
  await toColumn(p, dan.staff_id); const danCol = `[data-test-id="board_column_${dan.staff_id}"]`;
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(500);
  // Ana is pinned (near the start); Dan's column is further right: drag Alpha towards Dan's column once both are drawn
  await p.evaluate(`document.querySelector('${danCol}')?.scrollIntoView({ inline: 'end' })`); await p.waitForTimeout(700);
  o.step5drag = await dragOn(p, card(s, 'Alpha Co'), danCol, 120); await shiftPrompt(p, 'Keep shifts');
  o.step5 = { lead: await leadOf(s, 'Alpha Co'), msg: await toastsOn(p), danCount: (await boardCols(p)).find((c) => c.id === dan.staff_id)?.count };
  // network failure: the save of the move is refused by the server (real offline triggers this branch's sleep page)
  await goP(p, 'Board View', s.q);
  const refuse = async (r: any) => { if (r.request().method() !== 'GET') await r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"ZZ forced failure"}]}' }); else await r.continue(); };
  await p.route(/board-move|change-lead-technician/, refuse);
  await dragOn(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  o.step7 = { msg: await toastsOn(p), ana: await colCards(p, ANA.staff_id, s) }; await shot(p, 'C97010-alert'); await p.waitForTimeout(10000); o.step8stillThere = (await toastsOn(p)).length > 0;
  await p.unroute(/board-move|change-lead-technician/, refuse);
  await goP(p, 'Board View', s.q); o.step9 = { ana: await colCards(p, ANA.staff_id, s), lead: await leadOf(s, 'Alpha Co') };
  R.C97010 = o;
});

await run('C97012', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Stale Drop', [{ co: 'Alpha Co', lead: ANA, status: 'complete' }, { co: 'Bravo Co', lead: ANA }]);
  const o: any = {};
  // [Role-D]: the view-only role with Work orders > Create & Edit added (saved first; put back at the end)
  const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
  const orig = await roleRead(VIEW_ROLE); fs.writeFileSync(path.join(EV, 'S9-role-viewonly-before.json'), JSON.stringify(orig, null, 1));
  const adminRole = await roleRead(ADMIN_ROLE); const ce = (adminRole?.fe_permissions ?? []).filter((x: any) => /^workOrders(CreateAndEdit|View)$/.test(x.code));
  const put = async (ids: string[]) => say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: orig.name, description: orig.description, view_mode: orig.view_mode, template_id: orig.template_id, fe_permissions: ids, cross_toggles: orig.cross_toggles }));
  o.addCE = await put([...new Set([...(orig.fe_permissions ?? []).map((x: any) => x.id), ...ce.map((x: any) => x.id)])]);
  o.roleNow = (await roleRead(VIEW_ROLE))?.fe_permissions?.map((x: any) => x.code).filter((c: string) => /workOrders/.test(c));
  const userD = await mkUser('ZZAUTOTEST', `RoleD ${stamp}`, VIEW_ROLE, 'roled');
  const v = await asUser(userD); try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } });
    await goP(pg, 'Board View', s.q); o.userDPerms = v.perms;
    // "second browser (Admin)": invoice Alpha Co now, behind this board's back
    await RUN.toRunner(); o.invoice = say(await a.post('/api/invoices/create', { work_order_id: s.w['Alpha Co'].id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }));
    await a.post('/api/switch-user', { user_id: userD.id });
    await dragOn(pg, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts');
    o.step5 = { msg: await toastsOn(pg), ana: await colCards(pg, ANA.staff_id, s) }; await shot(pg, 'C97012-step5');
    // admin takes Create & Edit away from [Role-D]
    await RUN.toRunner(); o.removeCE = await put((orig.fe_permissions ?? []).map((x: any) => x.id)); o.roleAfter = (await roleRead(VIEW_ROLE))?.fe_permissions?.map((x: any) => x.code).filter((c: string) => /workOrders/.test(c));
    await a.post('/api/switch-user', { user_id: userD.id });
    await dragOn(pg, card(s, 'Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts');
    o.step8 = { msg: await toastsOn(pg), url: pg.url().replace(APP, '') }; await shot(pg, 'C97012-step8');
  } finally { await v.close(); }
  o.step6 = { status: (await workOrders(a, s.q)).find((w: any) => w.id === s.w['Alpha Co'].id)?.status, lead: await leadOf(s, 'Alpha Co') };
  o.step9 = await leadOf(s, 'Bravo Co');
  o.restore = await put((orig.fe_permissions ?? []).map((x: any) => x.id));
  const back = await roleRead(VIEW_ROLE); o.restoredExactly = JSON.stringify((back?.fe_permissions ?? []).map((x: any) => x.id).sort()) === JSON.stringify((orig.fe_permissions ?? []).map((x: any) => x.id).sort());
  R.C97012 = o;
});

await run('C368146', async () => {
  const o: any = {};
  const ezra = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: `zz.wob.ezra.${stamp}${D}`, clockable: false })).row;
  await pins([DAN.staff_id]);
  await goP(p, 'Board View', ''); const before = await allCols(p); o.before = { count: before.length, last3: named(before.slice(-3), IDS), danFirst: before[1] === DAN.staff_id };
  const aaron = (await person(a, 'ZZAUTOTEST Aaron', `Able ${stamp}`, { role: TECH_ROLE, email: `zz.wob.aaron.${stamp}${D}`, clockable: true })).row;
  await goP(p, 'Board View', ''); const after1 = await allCols(p); o.afterAaron = { count: after1.length, aaronAt: after1.indexOf(aaron.staff_id), lastIndex: after1.length - 1, before: before.length };
  o.ezraOn = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: ezra.email, clockable: true })).log;
  await goP(p, 'Board View', ''); const after2 = await allCols(p); o.afterEzra = { count: after2.length, aaronAt: after2.indexOf(aaron.staff_id), ezraAt: after2.indexOf(ezra.staff_id), lastIndex: after2.length - 1 };
  await display(p, 'Tech View'); await p.waitForTimeout(2500);
  const g = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^tech_view_group_[0-9a-f-]{36}$|^tech_view_group_unassigned$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as string[];
  o.techView = { count: g.length, aaronAt: g.indexOf(aaron.staff_id), ezraAt: g.indexOf(ezra.staff_id), sameAsBoard: JSON.stringify(g) === JSON.stringify(after2) };
  R.C368146 = o;
});

await run('C368147', async () => {
  const s = await mkSet('ZZAUTOTEST F3 No Drag Permission', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }]);
  const viewer = await mkUser('ZZAUTOTEST', `NoDrag ${stamp}`, VIEW_ROLE, 'nodrag'); const v = await asUser(viewer); const o: any = {};
  try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } }); o.perms = v.perms;
    await goP(pg, 'Board View', s.q); o.start = await colCards(pg, ANA.staff_id, s);
    await dragOn(pg, card(s, 'Bravo Co'), card(s, 'Alpha Co'), 4); o.step5 = { ana: await colCards(pg, ANA.staff_id, s), msg: await toastsOn(pg) };
    await dragOn(pg, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); o.step6 = { ana: await colCards(pg, ANA.staff_id, s), ben: await colCards(pg, BEN.staff_id, s), msg: await toastsOn(pg) };
    await pg.locator(card(s, 'Alpha Co')).hover(); await pg.waitForTimeout(800); o.step7moreActions = await pg.locator(`${card(s, 'Alpha Co')} [data-test-id="button_work_order_more_actions"]`).count();
    if (o.step7moreActions) { await pg.locator(`${card(s, 'Alpha Co')} [data-test-id="button_work_order_more_actions"]`).click(); await pg.waitForTimeout(800); o.step7menu = await pg.locator('.q-menu .q-item').allInnerTexts(); await pg.keyboard.press('Escape'); }
    await display(pg, 'Tech View'); await pg.waitForTimeout(2000); await expandSmallGroups(pg);
    await dragOn(pg, row(s, 'Bravo Co'), row(s, 'Alpha Co'), 4); o.step9 = await groupRows(pg, ANA.staff_id, s);
    await shot(pg, 'C368147-viewer');
  } finally { await v.close(); }
  o.step10 = { lead: await leadOf(s, 'Alpha Co') };
  R.C368147 = o;
});

await run('C368149', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Later Drop Wins', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }]);
  const d2 = await mkUser('ZZ WOB', `Dispatcher ${stamp}c`, ADMIN_ROLE, 'dispatcher2c'); const o: any = {};
  const v = await asUser(d2); const pg2 = v.page;
  try { await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id] } }); await goP(pg2, 'Board View', s.q); o.b2start = await colCards(pg2, ANA.staff_id, s);
    await RUN.toRunner(); await goP(p, 'Board View', s.q); o.b1start = await colCards(p, ANA.staff_id, s);
    const top1 = (await colCards(p, ANA.staff_id, s))[0]; await dragOn(p, card(s, 'Charlie Co'), card(s, top1), 4); await p.waitForTimeout(1500); o.b1after = await colCards(p, ANA.staff_id, s);
    await a.post('/api/switch-user', { user_id: d2.id });
    const top2 = (await colCards(pg2, ANA.staff_id, s))[0]; await dragOn(pg2, card(s, 'Bravo Co'), card(s, top2), 4); await pg2.waitForTimeout(1500);
    o.b2drop = { order: await colCards(pg2, ANA.staff_id, s), msg: await toastsOn(pg2) }; await shot(pg2, 'C368149-b2');
    await RUN.toRunner(); await p.waitForTimeout(3000); o.b1warning = await toastsOn(p);
    await goP(p, 'Board View', s.q); o.b1afterRefresh = await colCards(p, ANA.staff_id, s);
    await a.post('/api/switch-user', { user_id: d2.id }); await goP(pg2, 'Board View', s.q); o.b2afterRefresh = await colCards(pg2, ANA.staff_id, s);
  } finally { await v.close(); }
  R.C368149 = o;
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 's9-batchB.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
