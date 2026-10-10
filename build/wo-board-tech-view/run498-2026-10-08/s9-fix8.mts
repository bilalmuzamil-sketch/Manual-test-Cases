/** FIX 6 (2026-10-09): readings kept as they are taken (an error no longer loses them); the board is scrolled back to
 * the test technicians before step 8 and a missing header is recorded instead of waited on; one retry for a slow page.
 * S9 follow-up 4 (2026-10-09): C97003 on a 2560px window (every column on screen) with the Tech View groups read from
 *  the virtual table; C97012 seeded Approved as the case says (a Complete card is not on the board, which is why fix 3
 *  never found it); C368146 Tech View read with the big groups COLLAPSED first (Unassigned holds 1,211 rows). */
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
  fs.writeFileSync(path.join(EV, 's9-fix7.json'), JSON.stringify(R, null, 1));
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
const allColsOld = async (pg: Page) => { const seen: string[] = []; await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(500);
  for (let i = 0; i < 40; i++) { for (const c of await colsOf(pg)) if (!seen.includes(c)) seen.push(c); const moved = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await pg.waitForTimeout(350); if (!moved) break; }
  await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(400); return seen; };
/** FIX 8: the first columns of the board, left to right (pinned ones sit right after Unassigned) */
const allCols = async (pg: Page) => { await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(600); return (await boardCols(pg)).sort((x, y) => x.left - y.left).map((c) => c.id); };
const named = (ids: string[], m: Record<string, string>) => ids.map((id) => id === 'unassigned' ? 'Unassigned' : Object.keys(m).find((k) => m[k] === id)).filter(Boolean) as string[];
const goP = async (pg: Page, d: string, q: string) => { await gotoRetry(pg, APP + '/workorders?tab=all'); await pg.waitForTimeout(4500); for (let i = 0; i < 3 && !(await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).count()); i++) { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); } await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };
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
const VW = { width: 2560, height: 1100 };
// FIX 6: a page that does not load within the limit gets one more try (12:20 the work orders page took over 90 s)
const gotoRetry = async (pg: Page, url: string) => { for (let i = 0; i < 2; i++) { try { await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); return; } catch (e) { if (i) throw e; await pg.waitForTimeout(15000); } } };
/** Tech View group ids in screen order: collapse every open group, then walk the virtual table top to bottom */
async function techGroups(pg: Page, stopAt?: string) {
  const seen: string[] = []; const ids = () => pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr')].map(e => e.getAttribute('data-test-id') || '').filter(t => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as Promise<string[]>;
  const scroller = `(() => { const c = [...document.querySelectorAll('.q-virtual-scroll, .q-table__middle, .scroll')].find(e => e.scrollHeight > e.clientHeight + 20); return c || document.scrollingElement; })()`;
  await pg.evaluate(`${scroller}.scrollTop = 0`); await pg.waitForTimeout(600);
  for (let i = 0; i < 400; i++) {
    const open = await pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr[data-collapsed="false"]')].map(e => e.getAttribute('data-test-id').replace('tech_view_group_', ''))`) as string[];
    for (const g of open) { await pg.locator(`[data-test-id="button_tech_view_group_toggle_${g}"]`).click().catch(() => {}); await pg.waitForTimeout(500); }
    for (const x of await ids()) if (!seen.includes(x)) seen.push(x);
    if (stopAt && seen.includes(stopAt)) break;
    const moved = await pg.evaluate(`(() => { const c = ${scroller}; const b = c.scrollTop; c.scrollTop += 500; return c.scrollTop !== b; })()`); await pg.waitForTimeout(300);
    if (!moved && !open.length) break;
  }
  return seen;
}
const handles = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr')].filter(e => /^tech_view_group_/.test(e.getAttribute('data-test-id') || '')).map(e => e.getAttribute('data-test-id').replace('tech_view_group_', '').slice(0, 8) + ':' + e.getAttribute('data-collapsed') + ':' + [...e.querySelectorAll('i, .q-icon')].filter(i => i.textContent.trim() === 'drag_indicator').length)`) as Promise<string[]>;
async function toGroup(pg: Page, id: string) {
  for (let i = 0; i < 200 && !(await pg.locator(`[data-test-id="tech_view_group_${id}"]`).count()); i++) { await pg.evaluate(`(() => { const c = [...document.querySelectorAll('.q-virtual-scroll, .q-table__middle, .scroll')].find(e => e.scrollHeight > e.clientHeight + 20) || document.scrollingElement; c.scrollTop += 400; })()`); await pg.waitForTimeout(250); }
  await pg.locator(`[data-test-id="tech_view_group_${id}"]`).scrollIntoViewIfNeeded().catch(() => {});
}

await run('C97003', async () => {
  const s = await mkSet('ZZAUTOTEST F3 Viewer Column Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]); const o: any = {}; R.C97003 = o;   // FIX 6: readings kept when a later step fails
  await goP(p, 'Board View', s.q); o.dispatcherStart = named((await allCols(p)), IDS);
  const viewer = await mkUser('ZZAUTOTEST', `Viewer4 ${stamp}`, VIEW_ROLE, 'viewer4'); const v = await asUser(viewer);
  try { const pg = v.page; await pg.setViewportSize(VW); await goP(pg, 'Board View', s.q);
    // FIX 8 (10 Oct): ~97 technician columns hide the test ones far right — the viewer pins Ana, Ben, Cal so they sit right after Unassigned
    { const va = api(pg); const pv = (await va.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}; o.viewerPin = (await va.put('/api/users/me/preferences/work-orders-list', { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id, CAL.staff_id] } })).status; await goP(pg, 'Board View', s.q); }
    o.step5 = named((await allCols(pg)), IDS); await shot(pg, 'C97003-v4-step5');
    // FIX: the test technicians sit far right among ~97 columns; Unassigned stays pinned on the left while the board scrolls
    await showCols(pg, ANA.staff_id); o.visibleAtDrag = named(await visibleIds(pg), IDS);
    o.step6drag = await dragHandleOn(pg, hdr(CAL.staff_id), hdr(ANA.staff_id), 6); o.step6 = named((await allCols(pg)), IDS); await shot(pg, 'C97003-v4-step6');
    await showCols(pg, ANA.staff_id).catch(() => {}); await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft -= 400`).catch(() => {}); await pg.waitForTimeout(600);
    o.step7drag = await dragHandleOn(pg, hdr(BEN.staff_id), '[data-test-id="board_column_header_unassigned"]', 4); o.step7 = named((await allCols(pg)), IDS); await shot(pg, 'C97003-v4-step7');
    o.step8handle = await pg.locator('[data-test-id="board_column_header_unassigned"]').locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).count();
    await showCols(pg, ANA.staff_id).catch(() => {});
    { const u = await pg.locator('[data-test-id="board_column_header_unassigned"]').boundingBox({ timeout: 8000 }).catch(() => null); const c = await pg.locator(hdr(CAL.staff_id)).boundingBox({ timeout: 8000 }).catch(() => null); o.step8found = { unassigned: !!u, cal: !!c };
      if (u && c) { await pg.mouse.move(u.x + 60, u.y + u.height / 2); await pg.mouse.down(); await pg.mouse.move(u.x + 80, u.y + u.height / 2, { steps: 4 }); await pg.mouse.move(c.x + c.width - 10, c.y + c.height / 2, { steps: 20 }); await pg.mouse.up(); await pg.waitForTimeout(2500); o.step8drag = 'ok'; } }
    o.step8 = named((await allCols(pg)), IDS);
    await display(pg, 'Tech View'); await pg.waitForTimeout(3000); o.techHandles = (await handles(pg)).slice(0, 8);
    o.techBefore = named((await techGroups(pg)), IDS); await shot(pg, 'C97003-v4-tech');
    await toGroup(pg, BEN.staff_id);
    o.step10drag = await dragHandleOn(pg, `[data-test-id="tech_view_group_${BEN.staff_id}"]`, '[data-test-id="tech_view_group_unassigned"]', 30);
    o.step10 = named((await techGroups(pg)), IDS); await shot(pg, 'C97003-v4-step10');
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000); await display(pg, 'Tech View'); await pg.waitForTimeout(2500); o.step11tech = named((await techGroups(pg)), IDS);
    await display(pg, 'Board View'); await pg.waitForTimeout(2500); o.step11board = named((await allCols(pg)), IDS); await shot(pg, 'C97003-v4-step11');
  } finally { await v.close(); }
  await goP(p, 'Board View', s.q); o.step12dispatcher = named((await allCols(p)), IDS); R.C97003 = o; });

await run('C97012', async () => {
  const s = await mkSet('ZZAUTOTEST F3 Stale Drop', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }]); const o: any = { seed: s.log }; R.C97012 = o;
  const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
  const orig0 = await roleRead(VIEW_ROLE); const orig = { ...orig0, fe_permissions: (orig0?.fe_permissions ?? []).filter((x: any) => x.code !== 'workOrdersCreateAndEdit' && x.name !== 'workOrdersCreateAndEdit') };   /* FIX 6: never treat a left-over Create & Edit as the role's own */ const adminRole = await roleRead(ADMIN_ROLE); const ce = (adminRole?.fe_permissions ?? []).filter((x: any) => /^workOrders(CreateAndEdit|View)$/.test(x.code));
  const put = async (ids: string[]) => say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: orig.name, description: orig.description, view_mode: orig.view_mode, template_id: orig.template_id, fe_permissions: ids, cross_toggles: orig.cross_toggles }));
  o.addCE = await put([...new Set([...(orig.fe_permissions ?? []).map((x: any) => x.id), ...ce.map((x: any) => x.id)])]);
  /* FIX 7 (2026-10-09): switching ONE session between the admin and the role-D user signed the user's browser out with live
     updates on. The dragging person is now the Tech quick-login in its OWN session, put on the check's role for the duration
     (and put back after); the admin side (invoice, role change) stays in this session. Nobody switches users mid-check. */
  const techRow: any = (await staffRows(a, 'tech@shopview.com')).find((x: any) => x.email === 'tech@shopview.com')   /* FIX 9 (2026-10-10): the name search 'Tech' does not return him; the email search does */; o.techFound = !!techRow; const techRole = techRow?.role_id;
  const techBody = (role: string) => ({ first_name: techRow.first_name, last_name: techRow.last_name, email: techRow.email, role_id: role, workplace_id: techRow.workplace_id ?? HEAVY, job_title: techRow.job_title ?? null, salary_type: null, salary: null, billable: techRow.billable ? 1 : 0, clockable: !!techRow.clockable, is_sales_rep: !!techRow.is_sales_rep });
  o.techOnRoleD = (await a.post(`/api/staff/${techRow.staff_id}/change`, techBody(VIEW_ROLE))).status;
  const { signIn } = await import('../../global-search/e2e/fixtures/auth.js'); const s2: any = await signIn('/workorders?tab=all', undefined, undefined, 'tech'); const v = { page: s2.page as Page, close: async () => { await s2.browser?.close().catch(() => {}); } };
  try { const pg = v.page; await pg.setViewportSize(VW); await goP(pg, 'Board View', s.q);
    for (let i = 0; i < 6 && !(await pg.locator(card(s, 'Alpha Co')).count()); i++) { await pg.waitForTimeout(3000); await search(pg, s.q); await toColumn(pg, ANA.staff_id).catch(() => {}); }
    o.cardsSeen = await colCards(pg, ANA.staff_id, s); o.alphaInDom = await pg.locator(card(s, 'Alpha Co')).count(); await shot(pg, 'C97012-v4-start');
    const log: string[] = [];
    o.invoice = say(await a.post('/api/invoices/create', { work_order_id: s.w['Alpha Co'].id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }));
    if (!/^2/.test(o.invoice)) { await finish(s.w['Alpha Co'].id, 'invoiced', log); o.invoiceRoute = log; }
    o.alphaStatus = (await a.get(`/api/work-orders/view/${s.w['Alpha Co'].id}`)).body?.data?.work_order?.status;
    o.step5drag = await dragOn(pg, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts').catch(() => {});
    o.step5 = { msg: await toastsOn(pg), ana: await colCards(pg, ANA.staff_id, s), ben: await colCards(pg, BEN.staff_id, s) }; await shot(pg, 'C97012-v4-step5');
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await goP(pg, 'Board View', s.q);
    o.removeCE = await put((orig.fe_permissions ?? []).map((x: any) => x.id));
    o.step8drag = await dragOn(pg, card(s, 'Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(pg, 'Keep shifts').catch(() => {});
    o.step8 = { msg: await toastsOn(pg), url: pg.url().replace(APP, ''), ana: await colCards(pg, ANA.staff_id, s), ben: await colCards(pg, BEN.staff_id, s) }; await shot(pg, 'C97012-v4-step8');
  } finally { await v.close(); o.restoreInFinally = await put((orig.fe_permissions ?? []).map((x: any) => x.id)).catch((e: any) => String(e).slice(0, 80)); o.techRoleBack = techRole ? (await a.post(`/api/staff/${techRow.staff_id}/change`, techBody(techRole))).status : 'no original role'; }   /* FIX 6: the role is put back even when a step fails */
  o.step6 = { status: (await a.get(`/api/work-orders/view/${s.w['Alpha Co'].id}`)).body?.data?.work_order?.status, lead: await leadOf(s, 'Alpha Co') }; o.step9 = await leadOf(s, 'Bravo Co');
  o.restore = await put((orig.fe_permissions ?? []).map((x: any) => x.id)); R.C97012 = o; });

await run('C368146', async () => {
  const o: any = {}; await goP(p, 'Board View', ''); const cur = await allCols(p); const rest = cur.filter((x) => x !== 'unassigned' && ![DAN.staff_id, CAL.staff_id, BEN.staff_id].includes(x));
  o.seed = say(await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [DAN.staff_id], technicianOrder: [DAN.staff_id, CAL.staff_id, BEN.staff_id, ...rest] } }));
  await goP(p, 'Board View', ''); const base = await allCols(p); o.start = { count: base.length, first4: named(base.slice(0, 4), IDS) };
  const aaron = (await person(a, 'ZZAUTOTEST Aaron', `Able ${stamp}`, { role: TECH_ROLE, email: `zz.wob.aaron4.${stamp}${D}`, clockable: true })).row;
  await goP(p, 'Board View', ''); const a1 = await allCols(p); o.afterAaron = { count: a1.length, aaronAt: a1.indexOf(aaron.staff_id), lastIndex: a1.length - 1 };
  const ezra = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: `zz.wob.ezra4.${stamp}${D}`, clockable: false })).row;
  o.ezraOn = (await person(a, 'ZZAUTOTEST Ezra', `Echo ${stamp}`, { role: TECH_ROLE, email: ezra.email, clockable: true })).log;
  await goP(p, 'Board View', ''); const a2 = await allCols(p); o.afterEzra = { count: a2.length, aaronAt: a2.indexOf(aaron.staff_id), ezraAt: a2.indexOf(ezra.staff_id), lastIndex: a2.length - 1 };
  await display(p, 'Tech View'); await p.waitForTimeout(3000); const g = await techGroups(p);
  o.tech = { count: g.length, aaronAt: g.indexOf(aaron.staff_id), ezraAt: g.indexOf(ezra.staff_id), first4: named(g.slice(0, 4), IDS), sameAsBoard: JSON.stringify(g) === JSON.stringify(a2), diffAt: g.findIndex((x, i) => x !== a2[i]) };
  await shot(p, 'C368146-v4-tech'); R.C368146 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 's9-fix7.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
