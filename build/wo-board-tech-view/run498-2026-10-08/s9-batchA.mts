/**
 * S9 batch A (2026-10-09) — drag to reorder, single dispatcher: C97001, C97002, C97004, C97006, C97007 (one browser),
 * C97008, C97009, C97011, C97013, C368144, C368145, C368148. Runs as our own test admin (runner.mts).
 * Technicians made for these cases: "ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie",
 * "ZZAUTOTEST Dan Delta" (Technician role, Time Clock on, this location). Each case gets its own customers
 * "<case prefix> <run no> Alpha Co" … with one work order each, so the starting order by customer name is known and
 * nothing from an earlier run is mixed in. The runner's pins are set per case as the case asks.
 * Column drag: the six-dot handle (drag_indicator) in a column/group header.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds } from './staff.mts';

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
  fs.writeFileSync(path.join(EV, 's9-batchA.json'), JSON.stringify(R, null, 1));
}
const IDS = { Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id, Dan: DAN.staff_id };

await run('C97001', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Drag Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }, { co: 'Delta Co', lead: BEN }, { co: 'Echo Co', lead: CAL }]);
  await go('Tech View', s.q); const o: any = { anaStart: await grp(ANA.staff_id, s) };
  await drag(p, row(s, 'Charlie Co'), row(s, 'Alpha Co'), 4); await shiftPrompt(p, 'Keep shifts'); o.step5 = await grp(ANA.staff_id, s);
  await drag(p, row(s, 'Bravo Co'), row(s, 'Delta Co'), await below(row(s, 'Delta Co'))); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1000);
  o.step6 = { ana: await grp(ANA.staff_id, s), ben: await grp(BEN.staff_id, s), msg: await toasts(p) };
  await display(p, 'Board View'); await p.waitForTimeout(2000);
  await drag(p, card(s, 'Bravo Co'), card(s, 'Delta Co'), 4); await shiftPrompt(p, 'Keep shifts'); o.step8 = await col(BEN.staff_id, s);
  const anaCards = await col(ANA.staff_id, s); const last = anaCards[anaCards.length - 1];
  await drag(p, card(s, 'Echo Co'), card(s, last), await below(card(s, last))); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step9 = { ana: await col(ANA.staff_id, s), cal: await col(CAL.staff_id, s), msg: await toasts(p) }; await shot(p, 'C97001-board');
  await go('Board View', s.q); o.afterReload = { ana: await col(ANA.staff_id, s), ben: await col(BEN.staff_id, s), cal: await col(CAL.staff_id, s) };
  R.C97001 = o;
});

await run('C97002', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Drag Lead Change', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]);
  await go('Board View', s.q); const o: any = {};
  await drag(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  o.step4 = { msg: await toasts(p), ben: await col(BEN.staff_id, s) }; await p.waitForTimeout(9000); o.step4fadedAfter9s = (await toasts(p)).length === 0;
  o.step5 = await leadOf(s, 'Alpha Co');
  await drag(p, card(s, 'Alpha Co'), '[data-test-id="board_column_unassigned"]', 120); await shiftPrompt(p, 'Keep shifts');
  o.step6 = { msg: await toasts(p), un: await col('unassigned', s) }; o.step7 = await leadOf(s, 'Alpha Co');
  await go('Board View', s.q); await drag(p, card(s, 'Golf Co'), `[data-test-id="board_column_${CAL.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  o.step8 = { msg: await toasts(p), cal: await col(CAL.staff_id, s) }; o.step9 = await leadOf(s, 'Golf Co');
  await go('Tech View', s.q); const tgt = (await p.locator(`[data-test-id="tech_view_group_empty_${ANA.staff_id}"]`).count()) ? `[data-test-id="tech_view_group_empty_${ANA.staff_id}"]` : `[data-test-id="tech_view_group_${ANA.staff_id}"]`;
  await drag(p, row(s, 'Golf Co'), tgt, 10); await shiftPrompt(p, 'Keep shifts');
  o.step11 = { msg: await toasts(p), ana: await grp(ANA.staff_id, s), lead: await leadOf(s, 'Golf Co') };
  R.C97002 = o;
});

await run('C97004', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Pinned Reorder', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: BEN }, { co: 'Charlie Co', lead: BEN }, { co: 'Delta Co', lead: CAL }]);
  await go('Board View', s.q); const hdr = (id: string) => `[data-test-id="board_column_header_${id}"]`;
  const cols0 = await allBoardCols(p); const o: any = { start: order(cols0, IDS), counts: Object.fromEntries(cols0.filter((c) => Object.values(IDS).includes(c.id)).map((c) => [Object.keys(IDS).find((k) => (IDS as any)[k] === c.id), c.count])) };
  o.step5drag = await dragHandle(hdr(BEN.staff_id), hdr(ANA.staff_id)); o.step5 = order(await allBoardCols(p), IDS); await shot(p, 'C97004-step5');
  await toColumn(p, CAL.staff_id); const calHdr = await p.locator(hdr(CAL.staff_id)).boundingBox(); await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(500);
  // drag Ben beyond the pinned area: towards the first unpinned column on screen
  const firstUnpinned = (await boardCols(p)).find((c) => c.id !== 'unassigned' && c.pinned !== 'true');
  o.step6drag = firstUnpinned ? await dragHandle(hdr(BEN.staff_id), hdr(firstUnpinned.id)) : 'no unpinned column on screen';
  const cols6 = await allBoardCols(p); o.step6 = order(cols6, IDS); o.step6pinned = cols6.filter((c) => c.pinned === 'true').map((c) => Object.keys(IDS).find((k) => (IDS as any)[k] === c.id) ?? c.name);
  await display(p, 'Tech View'); await p.waitForTimeout(2000);
  const gs = await groups(p); o.step8 = gs.map((g) => Object.keys(IDS).find((k) => (IDS as any)[k] === g.id) ?? (g.id === 'unassigned' ? 'Unassigned' : null)).filter(Boolean);
  o.step8pinnedGroups = gs.filter((g) => g.pin?.pressed === 'true').map((g) => g.name);
  const tvHdr = (id: string) => `[data-test-id="tech_view_group_${id}"]`;
  const firstUnpinnedG = gs.find((g) => g.id !== 'unassigned' && g.pin?.pressed !== 'true');
  o.step8drag = firstUnpinnedG ? await dragHandle(tvHdr(ANA.staff_id), tvHdr(firstUnpinnedG.id)) : 'no unpinned group';
  const gs2 = await groups(p); o.step8after = gs2.map((g) => Object.keys(IDS).find((k) => (IDS as any)[k] === g.id) ?? (g.id === 'unassigned' ? 'Unassigned' : null)).filter(Boolean);
  await go('Board View', s.q); const cols9 = await allBoardCols(p);
  o.step9 = { counts: Object.fromEntries(cols9.filter((c) => Object.values(IDS).includes(c.id)).map((c) => [Object.keys(IDS).find((k) => (IDS as any)[k] === c.id), c.count])), bravoLead: await leadOf(s, 'Bravo Co') };
  R.C97004 = o;
});

await run('C97006', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 List Sort Kept', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }]);
  await go('List', s.q); const o: any = {};
  const sortState = () => p.evaluate(`[...document.querySelectorAll('thead th')].filter(e => /sorted|asc|desc/.test(e.className)).map(e => e.innerText.replace(/\\s+/g, ' ').trim() + ' ' + e.className.match(/(asc|desc)/)?.[0])`);
  const listRows = async () => ((await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [''])[0]).filter(Boolean)`)) as string[]).map(nameOf(s));
  const th = p.locator('thead th').filter({ hasText: 'Created On' }).first();
  for (let i = 0; i < 3; i++) { await th.click(); await p.waitForTimeout(2500); const r = await listRows(); if (r[0] === 'Charlie Co') break; }
  o.step4 = { sort: await sortState(), rows: await listRows() };
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p);
  const g = await grp(ANA.staff_id, s); if (g.length >= 2) await drag(p, row(s, g[1]), row(s, g[0]), 4); await shiftPrompt(p, 'Keep shifts'); o.techAfter = await grp(ANA.staff_id, s);
  await display(p, 'Board View'); await p.waitForTimeout(2000); const c = await col(ANA.staff_id, s); if (c.length >= 2) await drag(p, card(s, c[1]), card(s, c[0]), 4); await shiftPrompt(p, 'Keep shifts'); o.boardAfter = await col(ANA.staff_id, s);
  await display(p, 'List'); await p.waitForTimeout(2500); o.step9 = { sort: await sortState(), rows: await listRows() }; await shot(p, 'C97006-list');
  R.C97006 = o;
});

await run('C97007', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Reassign Bottom', [{ co: 'Bravo Co', lead: BEN }, { co: 'Delta Co', lead: BEN }, { co: 'Aardvark Co', lead: CAL }, { co: 'Abbey Co', lead: CAL }, { co: 'Echo Co', lead: CAL }]);
  await go('Board View', s.q); const o: any = { benStart: await col(BEN.staff_id, s) };
  const m = await openReassign(p, s.w['Aardvark Co'].id); await m.item.click(); await p.waitForTimeout(1200);
  await p.locator(`[data-test-id="option_lead_technician_${BEN.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step7 = await col(BEN.staff_id, s);
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${s.w['Abbey Co'].id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000); await pg.keyboard.type('ZZAUTOTEST Ben'); await pg.waitForTimeout(1200);
  await pg.locator('.q-menu .q-item').filter({ hasText: 'Ben Bravo' }).first().click(); await pg.waitForTimeout(3000); await pg.close();
  await go('Board View', s.q); o.step9 = await col(BEN.staff_id, s);
  await drag(p, card(s, 'Echo Co'), card(s, 'Delta Co'), 4); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  o.step10 = await col(BEN.staff_id, s); await shot(p, 'C97007-board');
  await go('Tech View', s.q); o.step11 = await grp(BEN.staff_id, s);
  R.C97007 = o;
});

await run('C97008', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Move Message', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }, { co: 'Delta Co', lead: BEN }]);
  await go('Board View', s.q); await p.evaluate(`window.__zz = 1`); const o: any = { start: { ana: await cnt(ANA.staff_id), ben: await cnt(BEN.staff_id) } };
  await drag(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts');
  o.step6 = { msg: await toasts(p), ana: await cnt(ANA.staff_id), ben: await cnt(BEN.staff_id), noReload: await p.evaluate(`window.__zz === 1`) };
  await p.waitForTimeout(10000); o.step6faded = (await toasts(p)).length === 0;
  await drag(p, card(s, 'Alpha Co'), card(s, 'Delta Co'), 4); await p.waitForTimeout(1500);
  o.step8 = { order: await col(BEN.staff_id, s), msg: await toasts(p), ana: await cnt(ANA.staff_id), ben: await cnt(BEN.staff_id), lead: await leadOf(s, 'Alpha Co') };
  R.C97008 = o;
});

await run('C97009', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Invoiced Lock', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }, { co: 'Charlie Co', lead: ANA, status: 'paid' }, { co: 'Delta Co', lead: ANA, status: 'declined' }, { co: 'Echo Co', lead: ANA, status: 'complete' }, { co: 'Golf Co', lead: null, status: 'invoiced' }]);
  const o: any = { setLog: s.log.filter((x: string) => !/^(mileage|story|line complete|remove)/.test(x)) };
  o.statuses = Object.fromEntries((await workOrders(a, s.q)).map((w: any) => [nameOf(s)(w.number), w.status]));
  await go('Board View', s.q);
  o.step4 = await p.evaluate(`[${JSON.stringify(s.w['Bravo Co'].id)}, ${JSON.stringify(s.w['Charlie Co'].id)}].map(id => { const c = document.querySelector('[data-test-id="board_card_' + id + '"]'); const l = c && c.querySelector('[data-test-id$="_lock"]'); return l ? (l.getAttribute('aria-label') || l.innerText) : null; })`);
  const anaCount0 = await cnt(ANA.staff_id);
  await drag(p, card(s, 'Bravo Co'), card(s, 'Alpha Co'), 4); await p.waitForTimeout(1200); o.step5 = { ana: await col(ANA.staff_id, s), msg: await toasts(p) };
  await go('Board View', s.q); await drag(p, card(s, 'Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step6 = { lead: await leadOf(s, 'Bravo Co'), msg: await toasts(p), anaCount: await cnt(ANA.staff_id), anaCount0 };
  await go('Board View', s.q); await drag(p, card(s, 'Charlie Co'), '[data-test-id="board_column_unassigned"]', 120); await shiftPrompt(p, 'Keep shifts'); o.step7 = { lead: await leadOf(s, 'Charlie Co'), msg: await toasts(p) };
  await go('Board View', s.q); await drag(p, card(s, 'Golf Co'), `[data-test-id="board_column_${ANA.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step8 = { lead: await leadOf(s, 'Golf Co'), msg: await toasts(p) };
  await go('Board View', s.q); await drag(p, card(s, 'Delta Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step9delta = { lead: await leadOf(s, 'Delta Co'), msg: await toasts(p) };
  await go('Board View', s.q); await drag(p, card(s, 'Echo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step9echo = { lead: await leadOf(s, 'Echo Co'), msg: await toasts(p) };
  await go('Tech View', s.q); const tgt = (await p.locator(`[data-test-id="tech_view_group_empty_${BEN.staff_id}"]`).count()) ? `[data-test-id="tech_view_group_empty_${BEN.staff_id}"]` : `[data-test-id="tech_view_group_${BEN.staff_id}"]`;
  await drag(p, row(s, 'Charlie Co'), tgt, 10); await shiftPrompt(p, 'Keep shifts'); o.step11 = { lead: await leadOf(s, 'Charlie Co'), msg: await toasts(p), ana: await grp(ANA.staff_id, s) };
  R.C97009 = o;
});

await run('C97011', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Cancelled Drag', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }]);
  await go('Board View', s.q); const o: any = { start: { ana: await col(ANA.staff_id, s), a: await cnt(ANA.staff_id), b: await cnt(BEN.staff_id) } };
  const escDrag = async (to: string, dy: number) => { const f = await p.locator(card(s, 'Bravo Co')).boundingBox(); const tb = await p.locator(to).boundingBox(); if (!f || !tb) return 'missing';
    await p.mouse.move(f.x + f.width * 0.45, f.y + f.height / 2); await p.mouse.down(); await p.mouse.move(f.x + f.width * 0.45, f.y + f.height / 2 + 8, { steps: 4 });
    await p.mouse.move(tb.x + tb.width / 2, tb.y + dy, { steps: 20 }); await p.waitForTimeout(400); await p.keyboard.press('Escape'); await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(2500);
    return { ana: await col(ANA.staff_id, s), ben: await col(BEN.staff_id, s), a: await cnt(ANA.staff_id), b: await cnt(BEN.staff_id), msg: await toasts(p) }; };
  o.escOverBen = await escDrag(`[data-test-id="board_column_${BEN.staff_id}"]`, 120);
  o.escAboveAlpha = await escDrag(card(s, 'Alpha Co'), 4);
  // drop outside any column (the page header area)
  { const f = await p.locator(card(s, 'Bravo Co')).boundingBox(); if (f) { await p.mouse.move(f.x + f.width * 0.45, f.y + f.height / 2); await p.mouse.down(); await p.mouse.move(f.x + f.width * 0.45, f.y + f.height / 2 + 8, { steps: 4 }); await p.mouse.move(700, 30, { steps: 20 }); await p.waitForTimeout(400); await p.mouse.up(); await p.waitForTimeout(2500); }
    o.dropOutside = { ana: await col(ANA.staff_id, s), a: await cnt(ANA.staff_id), b: await cnt(BEN.staff_id), msg: await toasts(p) }; }
  await go('Board View', s.q); o.afterRefresh = { ana: await col(ANA.staff_id, s), lead: await leadOf(s, 'Bravo Co') };
  R.C97011 = o;
});

await run('C97013', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Filtered Reorder', [{ co: 'Alpha Co', lead: ANA, status: 'in_progress' }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA, status: 'in_progress' }, { co: 'Delta Co', lead: ANA }]);
  const status = async (what: 'In progress' | 'clear') => { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(1000);
    if (what === 'clear') await p.locator('.q-menu').getByText('Clear selection').first().click(); else await p.locator('.q-menu .q-item').filter({ hasText: /In progress/i }).first().click();
    await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); await expandSmallGroups(p); };
  await go('Tech View', s.q); const o: any = { step4: await grp(ANA.staff_id, s) };
  await status('In progress'); o.step5 = await grp(ANA.staff_id, s);
  await drag(p, row(s, 'Charlie Co'), row(s, 'Alpha Co'), 4); await shiftPrompt(p, 'Keep shifts');
  await status('clear'); o.step7 = await grp(ANA.staff_id, s);
  // back to A, B, C, D
  for (let i = 0; i < 4; i++) { const g = await grp(ANA.staff_id, s); const want = ['Alpha Co', 'Bravo Co', 'Charlie Co', 'Delta Co']; const k = want.findIndex((x, j) => g[j] !== x); if (k < 0) break; await drag(p, row(s, want[k]), row(s, g[k]), 4); await p.waitForTimeout(1200); }
  o.step8 = await grp(ANA.staff_id, s);
  await status('In progress'); await drag(p, row(s, 'Alpha Co'), row(s, 'Charlie Co'), await below(row(s, 'Charlie Co'))); await shiftPrompt(p, 'Keep shifts');
  await status('clear'); o.step10 = await grp(ANA.staff_id, s);
  await display(p, 'Board View'); await p.waitForTimeout(2000); o.step11 = await col(ANA.staff_id, s); await shot(p, 'C97013-board');
  R.C97013 = o;
});

await run('C368144', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Unassigned Place', [{ co: 'Bravo Co', lead: null }, { co: 'Delta Co', lead: null }, { co: 'Alpha Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }]);
  await go('Board View', s.q); const o: any = { step4: await col('unassigned', s) };
  const m = await openReassign(p, s.w['Charlie Co'].id); await m.item.click(); await p.waitForTimeout(1200);
  await p.locator('[data-test-id="option_lead_technician_unassigned"]').click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1200);
  o.step5 = await toasts(p); o.step6 = await col('unassigned', s);
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${s.w['Alpha Co'].id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1200); await pg.locator('.q-menu .q-item').filter({ hasText: /Unassigned/ }).first().click(); await pg.waitForTimeout(3000); await pg.close();
  await go('Board View', s.q); o.step8 = await col('unassigned', s);
  await go('Tech View', s.q); o.step9 = await grp('unassigned', s);
  R.C368144 = o;
});

await run('C368145', async () => {
  await pins([BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Created With Lead', [{ co: 'Bravo Co', lead: BEN }, { co: 'Delta Co', lead: BEN }]);
  await go('Board View', s.q); const o: any = { step4: await col(BEN.staff_id, s) };
  await p.locator('[data-test-id="button_new_work_order"]').click(); await p.waitForTimeout(2500);
  o.newWindowLabels = await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field__label, .q-dialog label')].map(e => e.innerText.trim()).filter(Boolean)`); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  // no Lead Technician field in the window -> the case's other route: split a line of Bravo Co off into a new work order
  const bw = s.w['Bravo Co'].id; await mkLine(bw, 2); const ls = await linesRaw(bw); o.lines = ls.length;
  await p.goto(`${APP}/workorders/${bw}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await p.locator(`[data-test-id="line_checkbox_${ls[ls.length - 1].line_id}"]`).click(); await p.waitForTimeout(800);
  await p.locator('[data-test-id="button_line_bulk_action"]').click(); await p.waitForTimeout(1000); o.bulkMenu = await p.locator('.q-menu .q-item').allInnerTexts();
  await p.locator('.q-menu .q-item').filter({ hasText: /Split work order/i }).first().click(); await p.waitForTimeout(2500);
  const dlg = p.locator('.q-dialog:visible'); o.splitDialog = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot(p, 'C368145-split-dialog');
  const go2 = dlg.locator('button').filter({ hasText: /split|confirm|create|continue/i }).last(); if (await go2.count()) { await go2.click(); await p.waitForTimeout(4000); }
  o.toasts = await toasts(p); o.urlAfter = p.url().replace(APP, '');
  const all = await workOrders(a, s.q); o.all = all.map((w: any) => `${w.number} ${w.companyName ?? ''} lead=${w.techAssignedFirstName ?? 'none'}`);
  for (const w of all) if (!Object.values(s.w).some((x: any) => x.id === w.id)) s.w['Bravo Co (split)'] = { id: w.id, number: w.number };
  await go('Board View', s.q); o.step6 = await col(BEN.staff_id, s);
  R.C368145 = o;
});

await run('C368148', async () => {
  await pins([]);
  const s = await mkSet('ZZAUTOTEST F3 Hidden Tech Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: BEN }, { co: 'Charlie Co', lead: CAL }, { co: 'Delta Co', lead: DAN }]);
  // the runner is Service Advisor of every work order it creates; leave it on Alpha Co and Charlie Co only
  const other = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0];
  for (const co of ['Bravo Co', 'Delta Co']) await a.post('/api/work-orders/change-service-advisor', { work_order_id: s.w[co].id, service_advisor_id: other.staff_id });
  await go('Board View', s.q); const o: any = { start: order(await allBoardCols(p), IDS) };
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  o.assignedToMe = order(await allBoardCols(p), IDS);
  await toColumn(p, CAL.staff_id); const hdr = (id: string) => `[data-test-id="board_column_header_${id}"]`;
  o.drag = await dragHandle(hdr(CAL.staff_id), hdr(ANA.staff_id)); o.afterDrag = order(await allBoardCols(p), IDS);
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(3000);
  o.step6 = order(await allBoardCols(p), IDS); await shot(p, 'C368148-after');
  R.C368148 = o;
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 's9-batchA.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
