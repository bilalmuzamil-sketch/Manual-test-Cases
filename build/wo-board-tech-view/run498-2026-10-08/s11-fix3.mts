/**
 * S11 / S12 / Counts / TP (2026-10-09): keyboard (C97020, C97021, C97022, C368150, C368151, C368152), analytics blocked
 * (C97028) and untouched defaults (C368154), header counts (C97030, C97031) and the Reassign open count (C97032),
 * Imported (C154648), narrow window (C154649), unpin back in place (C368157), On Site on Invoiced (C368158) and from a
 * stale page (C368159). Runs as our own test admin (runner.mts); other people by viewAs, taken in turn.
 * Keyboard: only page.keyboard is used once focus is placed (a click in the Search box, as the cases say); every step
 * records which element holds focus (its test-id) and whether a focus outline is drawn.
 * Analytics: this harness always blocks Google Analytics / Tag Manager (session.mts NOISE), so every run is a
 * "blocked analytics" run; C97028 states it and checks the requests were indeed refused.
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
    // FIX 2026-10-09: adding an AUTHORIZED line approves an Estimate, so an Estimate gets no line here
    const w = await workOrder(a, c, 'estimate', null); if ((s.status ?? 'approved') !== 'estimate') await mkLine(w, 1);
    const st = s.status ?? 'approved';
    if (st !== 'estimate') await a.post('/api/work-orders/change-status', { id: w, status: 'approved' });
    if (s.lead) log.push(`lead ${s.co} ${say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: s.lead.staff_id }))}`);
    if (st === 'in_progress') await a.post('/api/work-orders/change-status', { id: w, status: 'in_progress' });
    else if (st === 'ready_for_review') {
      await a.post('/api/work-orders/change-mileage', { work_order_id: w, mileage: '123456' });
      for (const l of await linesRaw(w)) { for (const q of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {});
        await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: w }); await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: w }); }
      for (const x of ['in_progress', 'ready_for_review']) log.push(`${x} ${say(await a.post('/api/work-orders/change-status', { id: w, status: x }))}`); }
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
  fs.writeFileSync(path.join(EV, 's11-fix3.json'), JSON.stringify(R, null, 1));
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
  for (let i = 0; i < 400; i++) { for (const c of await colsOf(pg)) if (!seen.includes(c)) seen.push(c); const moved = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await pg.waitForTimeout(350); if (!moved) { await pg.waitForTimeout(600); for (const c of await colsOf(pg)) if (!seen.includes(c)) seen.push(c); break; } if (!moved) break; }
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


const focusInfo = (pg: Page = p) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  return { tid: (e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || '', text: (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), outline: !!visible }; })()`) as Promise<any>;
async function tabTo(pg: Page, want: (f: any) => boolean, max = 120, key = 'Tab') { const seen: string[] = [];
  for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(120); const f = await focusInfo(pg); seen.push(f.tid); if (want(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await pg.keyboard.press('Escape'); await pg.locator('[data-test-id="page_search_toggle"]').click({ force: true }); } await box.click(); await pg.waitForTimeout(300); };

const countsSet = async (prefix: string) => mkSet(prefix, [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA, status: 'estimate' }, { co: 'Delta Co', lead: BEN, status: 'in_progress' }, { co: 'Echo Co', lead: BEN, status: 'invoiced' }, { co: 'Golf Co', lead: null }, { co: 'Hotel Co', lead: null, status: 'estimate' }]);
const IDS4: Record<string, string> = { Unassigned: 'unassigned', Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id };
const boardCounts = async (set: any) => { const cs = await boardCols(p); return Object.fromEntries(Object.entries(IDS4).map(([k, id]) => { const c = cs.find((x) => x.id === id); return [k, c ? `${c.count}/${c.cards.length}` : 'not drawn']; })); };
const techCounts = async (set: any) => { const gs = await groups(p); return Object.fromEntries(Object.entries(IDS4).map(([k, id]) => { const g = gs.find((x) => x.id === id); return [k, g ? `${g.count}/${g.rows.length}` : 'not drawn']; })); };
const listCount = async () => p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).length`);
const statusOnly = async (label: string | null) => { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); if (label) await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(label, 'i') }).first().click(); else await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); await expandSmallGroups(p); };


const ticked = () => p.evaluate(`[...document.querySelectorAll('.q-menu .q-checkbox, .q-menu .q-item')].filter(e => e.querySelector('.q-checkbox__inner--truthy') || e.getAttribute('aria-checked') === 'true').map(e => e.innerText.trim()).filter(Boolean)`) as Promise<string[]>;
const listStatuses = () => p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).map(r => (r.innerText.match(/S\\d+-\\d+/) || [''])[0] + ' ' + ((r.querySelector('.q-badge, [class*="status"]') || {}).innerText || '').trim())`) as Promise<string[]>;
await run('C97030', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await countsSet('ZZAUTOTEST F3 Header Counts'); const o: any = { statuses: Object.fromEntries((await workOrders(a, s.q)).map((w: any) => [nameOf(s)(w.number), w.status])) };
  await goP(p, 'List', s.q); o.step4 = await listCount();
  await display(p, 'Tech View'); await p.waitForTimeout(2500); await expandSmallGroups(p); o.step6 = await techCounts(s); await display(p, 'Board View'); await p.waitForTimeout(2500); o.step8 = await boardCounts(s); await display(p, 'List'); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); o.tickedBefore = await ticked();
  await p.locator('.q-menu .q-checkbox').filter({ hasText: /^\s*Approved\s*$/ }).first().click().catch(async () => { await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Approved/ }).first().click(); });
  await p.waitForTimeout(1500); o.tickedAfter = await ticked(); await p.screenshot({ path: path.join(EV, 'C97030-status-menu.png') }); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  o.chip = await p.locator('[data-test-id="filter_chip_status"]').innerText().catch(() => null); o.url = p.url().replace(APP, '');
  o.step9list = await listStatuses(); await display(p, 'Board View'); await p.waitForTimeout(2500); o.step9board = await boardCounts(s); await display(p, 'Tech View'); await p.waitForTimeout(2500); await expandSmallGroups(p); o.step9tech = await techCounts(s);
  await p.screenshot({ path: path.join(EV, 'C97030-approved-only.png') });
  // step 10: clear, Estimates tab, search again
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  await tab(p, 'Estimates'); await p.waitForTimeout(2500); await search(p, s.q); await p.waitForTimeout(3000); await display(p, 'Board View'); await p.waitForTimeout(2500); o.step10board = await boardCounts(s);
  await display(p, 'Tech View'); await p.waitForTimeout(2500); await expandSmallGroups(p); o.step10tech = await techCounts(s); R.C97030 = o; });
await run('C97032', async () => {
  await pins([ANA.staff_id]);
  const cben = (await person(a, 'ZZAUTOTEST F3 Count Ben', 'Bravo', { role: TECH_ROLE, email: `zz.wob.countben.${stamp}${D}`, clockable: true })).row; const B = { staff_id: cben.staff_id };
  const s = await mkSet('ZZAUTOTEST F3 Open Count', [{ co: 'Approved Co', lead: B }, { co: 'Progress Co', lead: B, status: 'in_progress' }, { co: 'Review Co', lead: B, status: 'ready_for_review' }, { co: 'Complete Co', lead: B, status: 'complete' }, { co: 'Estimate Co', lead: B, status: 'estimate' }, { co: 'Invoiced Co', lead: B, status: 'invoiced' }, { co: 'Paid Co', lead: B, status: 'paid' }, { co: 'Declined Co', lead: B, status: 'declined' }, { co: 'Line Only Co', lead: ANA }, { co: 'Spare Co', lead: ANA }]);
  const lo = (await linesRaw(s.w['Line Only Co'].id))[0]; if (lo) await a.put(`/api/work-orders/lines/${lo.line_id}/technicians`, { staffIds: [cben.staff_id] });
  const o: any = { statuses: Object.fromEntries((await workOrders(a, s.q)).map((w: any) => [nameOf(s)(w.number), w.status])) };
  const readCount = async (from: string) => { const mm = await openReassign(p, (s.w as any)[from]?.id ?? from); await mm.item.click(); await p.waitForTimeout(1200); await p.locator('[data-test-id="input_reassign_lead_search"]').fill('Count Ben'); await p.waitForTimeout(1200);
    const c = await p.locator(`[data-test-id="text_lead_technician_open_count_${cben.staff_id}"]`).innerText().catch(() => null); await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await p.waitForTimeout(800); return c; };
  await goP(p, 'Board View', s.q); await p.waitForSelector('[data-test-id="board_view_scroller"]', { timeout: 20000 }).catch(() => {}); o.boardReady = await p.locator('[data-test-id="board_view_scroller"]').count(); o.step5 = await readCount('Spare Co');
  await statusOnly('Estimate'); const vis = Object.keys(s.w).find((k) => k === 'Estimate Co'); await toColumn(p, cben.staff_id).catch(() => {});
  o.visibleAfterFilter = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_card_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^board_card_[0-9a-f-]{36}$/.test(t)).map(t => t.replace('board_card_', ''))`); const firstVis = o.visibleAfterFilter[0]; if (firstVis) { await p.locator(`[data-test-id="board_card_${firstVis}"]`).scrollIntoViewIfNeeded().catch(() => {}); } o.step6from = Object.keys(s.w).find((k) => (s.w as any)[k].id === firstVis) ?? firstVis; o.step6 = firstVis ? await readCount(firstVis).catch((e) => `could not open: ${String(e).slice(0, 80)}`) : 'no card visible'; await shot(p, 'C97032-step6');   // FIX: 'any visible card', as the case says await statusOnly(null);
  o.approve = `line ${await mkLine(s.w['Estimate Co'].id, 1) ? 'added' : 'not added'}; status ${(await a.get(`/api/work-orders/view/${s.w['Estimate Co'].id}`)).body?.data?.work_order?.status}`;   // an authorized line approves it (the app's own rule)
  await goP(p, 'Board View', s.q); o.step7 = await readCount('Spare Co');
  R.C97032 = o;
});


async function techGroups(pg: Page) {
  const seen: string[] = []; const ids = () => pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr')].map(e => e.getAttribute('data-test-id') || '').filter(t => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as Promise<string[]>;
  const scroller = `(() => { const c = [...document.querySelectorAll('.q-virtual-scroll, .q-table__middle, .scroll')].find(e => e.scrollHeight > e.clientHeight + 20); return c || document.scrollingElement; })()`;
  await pg.evaluate(`${scroller}.scrollTop = 0`); await pg.waitForTimeout(600);
  for (let i = 0; i < 400; i++) {
    const open = await pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr[data-collapsed="false"]')].map(e => e.getAttribute('data-test-id').replace('tech_view_group_', ''))`) as string[];
    for (const g of open) { await pg.locator(`[data-test-id="button_tech_view_group_toggle_${g}"]`).click().catch(() => {}); await pg.waitForTimeout(500); }
    for (const x of await ids()) if (!seen.includes(x)) seen.push(x);
    const moved = await pg.evaluate(`(() => { const c = ${scroller}; const b = c.scrollTop; c.scrollTop += 500; return c.scrollTop !== b; })()`); await pg.waitForTimeout(300);
    if (!moved && !open.length) break;
  }
  return seen;
}
await run('C368157', async () => { await pins([]); const o: any = {};
  await goP(p, 'Board View', ''); const before = await allCols(p); o.calIndexBefore = before.indexOf(CAL.staff_id);
  await pins([CAL.staff_id]); await goP(p, 'Board View', ''); const pinned = await allCols(p); o.pinned = { calIndex: pinned.indexOf(CAL.staff_id), first3: named(pinned.slice(0, 3), IDS) };
  await pins([]); await goP(p, 'Board View', ''); const after = await allCols(p); o.unpinned = { calIndex: after.indexOf(CAL.staff_id), sameAsBefore: JSON.stringify(after) === JSON.stringify(before) };
  await display(p, 'Tech View'); await p.waitForTimeout(3000); const g = await techGroups(p);
  const nb = (arr: string[]) => { const i = arr.indexOf(CAL.staff_id); return i < 0 ? null : [arr[i - 1] ?? null, arr[i + 1] ?? null].map((x) => x && x.slice(0, 8)); };
  o.neighbours = { boardBefore: nb(before), boardAfter: nb(after), tech: nb(g) }; o.tech = { count: g.length, boardCount: after.length, calIndex: g.indexOf(CAL.staff_id), sameAsBoard: JSON.stringify(g) === JSON.stringify(after), firstDiff: g.findIndex((x, i) => x !== after[i]) };
  await p.screenshot({ path: path.join(EV, 'C368157-tech.png') }); R.C368157 = o; });
await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 's11-fix3.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
