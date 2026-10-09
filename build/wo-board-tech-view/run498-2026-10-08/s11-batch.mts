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
    const w = await workOrder(a, c, 'estimate', null); await mkLine(w, 1);
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
  fs.writeFileSync(path.join(EV, 's11-batch.json'), JSON.stringify(R, null, 1));
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


const focusInfo = (pg: Page = p) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  return { tid: (e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || '', text: (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), outline: !!visible }; })()`) as Promise<any>;
async function tabTo(pg: Page, want: (f: any) => boolean, max = 120, key = 'Tab') { const seen: string[] = [];
  for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(120); const f = await focusInfo(pg); seen.push(f.tid); if (want(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) await pg.locator('[data-test-id="page_search_toggle"]').click(); await box.click(); await pg.waitForTimeout(300); };

await run('C97021', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reach', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]);
  await goP(p, 'Board View', s.q); await clickSearch(p);
  const first = await tabTo(p, (f) => /^board_card_/.test(f.raw)); const o: any = { firstCard: { presses: first.presses, found: first.found, outline: first.f?.outline } };
  const reached = new Set<string>(); const cols = new Set<string>(); let f: any = first.f;
  for (let i = 0; i < 80; i++) { if (f && /^board_card_/.test(f.raw)) reached.add(f.raw.replace('board_card_', '')); const c = await p.evaluate(`document.activeElement?.closest('[data-test-id^="board_column_"]')?.getAttribute('data-test-id')`); if (c) cols.add(String(c)); await p.keyboard.press('Tab'); await p.waitForTimeout(100); f = await focusInfo(p); }
  o.boardReached = Object.keys(s.w).filter((k) => reached.has(s.w[k].id)); o.columnsReached = [...cols].length; await shot(p, 'C97021-board-focus');
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p); await clickSearch(p);
  const tr = await tabTo(p, (x) => /^tech_view_row_/.test(x.raw)); o.firstRow = { presses: tr.presses, found: tr.found, outline: tr.f?.outline };
  const rowsR = new Set<string>(); const groupsR = new Set<string>(); f = tr.f;
  for (let i = 0; i < 80; i++) { if (f && /^tech_view_row_/.test(f.raw)) rowsR.add(f.raw.replace('tech_view_row_', '')); if (f && /^(button_)?tech_view_group/.test(f.raw)) groupsR.add(f.raw); await p.keyboard.press('Tab'); await p.waitForTimeout(100); f = await focusInfo(p); }
  o.techReached = Object.keys(s.w).filter((k) => rowsR.has(s.w[k].id)); o.groupControlsReached = [...groupsR].map((x) => x.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>')).slice(0, 10);
  await shot(p, 'C97021-tech-focus'); R.C97021 = o;
});

await run('C368150', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Enter Opens', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }]);
  await goP(p, 'Board View', s.q); await clickSearch(p); const id = s.w['Alpha Co'].id;
  const t1 = await tabTo(p, (f) => f.raw === `board_card_${id}`); const o: any = { focused: t1.found };
  await p.keyboard.press('Enter'); await p.waitForTimeout(3000); o.enter = p.url().replace(APP, '');
  await p.keyboard.press('Alt+ArrowLeft'); await p.waitForTimeout(4000); if (!/workorders\?|workorders$/.test(p.url())) await goP(p, 'Board View', s.q);
  await search(p, s.q); await clickSearch(p); const t2 = await tabTo(p, (f) => f.raw === `board_card_${id}`); o.refocused = t2.found;
  const before = await colCards(p, ANA.staff_id, s);
  for (const k of ['Space', 'ArrowDown', 'ArrowRight', 'Control+ArrowDown', 'Alt+ArrowDown', 'Shift+ArrowDown']) { await p.keyboard.press(k); await p.waitForTimeout(600); if (!/workorders\?tab|workorders$/.test(p.url().replace(APP, '')) && !p.url().includes('tab=all')) { o[`key ${k}`] = p.url().replace(APP, ''); await p.goBack(); await p.waitForTimeout(3000); } }
  o.afterKeys = { ana: await colCards(p, ANA.staff_id, s), before, lead: await leadOf(s, 'Alpha Co') };
  await goP(p, 'Tech View', s.q); await clickSearch(p); const t3 = await tabTo(p, (f) => f.raw === `tech_view_row_${id}`); o.techFocused = t3.found;
  await p.keyboard.press('Enter'); await p.waitForTimeout(3000); o.techEnter = p.url().replace(APP, '');
  R.C368150 = o;
});

await run('C368151', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls', [{ co: 'Alpha Co', lead: ANA }]);
  await goP(p, 'Board View', s.q); await clickSearch(p); const id = s.w['Alpha Co'].id; const o: any = {};
  await tabTo(p, (f) => f.raw === `board_card_${id}`);
  o.moreActionsVisibleOnFocus = await p.locator(`[data-test-id="board_card_${id}"] [data-test-id="button_work_order_more_actions"]`).isVisible().catch(() => false);
  const ma = await tabTo(p, (f) => f.raw === 'button_work_order_more_actions' || /more_actions/.test(f.raw), 6); o.reachedMoreActions = ma.found;
  await p.keyboard.press('Enter'); await p.waitForTimeout(900); o.menuOpenedByEnter = await p.locator('.q-menu:visible').count();
  await p.keyboard.press('Escape'); await p.waitForTimeout(700); o.menuClosedByEscape = (await p.locator('.q-menu:visible').count()) === 0;
  await shot(p, 'C368151-menu');
  await pins([]); await goP(p, 'Board View', s.q); await toColumn(p, ANA.staff_id); await clickSearch(p);
  const pin = await tabTo(p, (f) => f.raw === `button_board_pin_${ANA.staff_id}`, 200); o.pinReached = pin.found;
  const pressed = () => p.locator(`[data-test-id="button_board_pin_${ANA.staff_id}"]`).getAttribute('aria-pressed').catch(() => null);
  o.pin0 = await pressed(); if (pin.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.pin1 = await pressed(); await p.locator(`[data-test-id="button_board_pin_${ANA.staff_id}"]`).focus().catch(() => {}); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.pin2 = await pressed(); }
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await clickSearch(p);
  const tg = await tabTo(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`, 200); o.toggleReached = tg.found;
  const coll = () => p.locator(`[data-test-id="tech_view_group_${ANA.staff_id}"]`).getAttribute('data-collapsed').catch(() => null);
  o.c0 = await coll(); if (tg.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.c1 = await coll(); await p.locator(`[data-test-id="button_tech_view_group_toggle_${ANA.staff_id}"]`).focus().catch(() => {}); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.c2 = await coll(); }
  R.C368151 = o;
});

await run('C368152', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reassign', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]);
  await goP(p, 'Board View', s.q); await clickSearch(p); const id = s.w['Alpha Co'].id; const o: any = {};
  await tabTo(p, (f) => f.raw === `board_card_${id}`); await tabTo(p, (f) => /more_actions/.test(f.raw), 6);
  await p.keyboard.press('Enter'); await p.waitForTimeout(900);
  for (let i = 0; i < 8; i++) { const cur = await p.evaluate(`document.activeElement?.innerText?.trim()`); if (/Reassign lead technician/.test(String(cur))) break; await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250); }
  o.menuFocus = await p.evaluate(`document.activeElement?.innerText?.trim()`); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  o.dialogOpen = await p.locator('[data-test-id="input_reassign_lead_search"]').count(); o.focusInDialog = (await focusInfo()).tid;
  if (!/input_reassign_lead_search/.test(o.focusInDialog)) await tabTo(p, (f) => /input_reassign_lead_search/.test(f.raw), 10);
  await p.keyboard.type('Ben'); await p.waitForTimeout(1500);
  const ok = await tabTo(p, (f) => f.raw === `option_lead_technician_${BEN.staff_id}`, 15); o.optionReached = ok.found;
  if (!ok.found) { for (let i = 0; i < 6; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250); if ((await focusInfo()).raw === `option_lead_technician_${BEN.staff_id}`) { o.optionReached = 'by arrows'; break; } } }
  await p.keyboard.press('Enter'); await p.waitForTimeout(800); o.afterPick = (await focusInfo()).tid;
  const conf = await tabTo(p, (f) => f.raw === 'button_confirm_reassign_lead_technician', 10); o.confirmReached = conf.found; if (conf.found) await p.keyboard.press('Enter');
  await p.waitForTimeout(1500); const sp = await shiftPrompt(p, 'Keep shifts'); o.msg = await toasts(p); o.lead = await leadOf(s, 'Alpha Co'); o.ben = await colCards(p, BEN.staff_id, s);
  // keyboard reorder attempt: Bravo first in Ana's column
  await clickSearch(p); await tabTo(p, (f) => f.raw === `board_card_${s.w['Bravo Co'].id}`);
  for (const k of ['Control+ArrowUp', 'Alt+ArrowUp', 'Shift+ArrowUp', 'Space', 'ArrowUp', 'Enter']) { const u = p.url(); await p.keyboard.press(k); await p.waitForTimeout(600); if (p.url() !== u) { await p.goBack(); await p.waitForTimeout(3000); break; } }
  o.reorderByKeyboard = await colCards(p, ANA.staff_id, s);
  R.C368152 = o;
});

await run('C97020', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Limits', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }]);
  const viewer = await mkUser('ZZAUTOTEST', `KbViewer ${stamp}`, VIEW_ROLE, 'kbviewer'); const o: any = {};
  const v = await asUser(viewer); try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } });
    await goP(pg, 'Board View', s.q); await clickSearch(pg); const id = s.w['Alpha Co'].id; o.viewerFocused = (await tabTo(pg, (f) => f.raw === `board_card_${id}`)).found;
    const keys: Record<string, string> = {};
    for (const k of ['Space', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Shift+ArrowRight', 'Shift+ArrowDown', 'Enter']) { const u = pg.url(); await pg.keyboard.press(k); await pg.waitForTimeout(700); keys[k] = pg.url() !== u ? `opened ${pg.url().replace(APP, '')}` : `${(await pg.locator('.q-menu:visible, .q-dialog:visible').count()) ? 'menu/dialog' : '-'}`; if (pg.url() !== u) { await pg.goBack(); await pg.waitForTimeout(3000); await clickSearch(pg); await tabTo(pg, (f) => f.raw === `board_card_${id}`); } }
    o.viewerKeys = keys; o.viewerMoreActions = await pg.locator(`[data-test-id="board_card_${id}"] [data-test-id="button_work_order_more_actions"]`).count();
  } finally { await v.close(); }
  o.alphaAfterViewer = { lead: await leadOf(s, 'Alpha Co') };
  await goP(p, 'Board View', s.q); await clickSearch(p); const bid = s.w['Bravo Co'].id;
  await tabTo(p, (f) => f.raw === `board_card_${bid}`); await tabTo(p, (f) => /more_actions/.test(f.raw), 6); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
  for (let i = 0; i < 8; i++) { const cur = await p.evaluate(`document.activeElement?.innerText?.trim()`); if (/Reassign lead technician/.test(String(cur))) break; await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250); }
  o.dispatcherMenuItem = await p.evaluate(`(() => { const e = document.activeElement; return { text: e?.innerText?.trim(), disabled: e?.getAttribute('aria-disabled') || (e?.classList.contains('disabled') ? 'true' : null) }; })()`);
  await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.dialogOpened = await p.locator('[data-test-id="input_reassign_lead_search"]').count();
  o.tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim())`); await p.keyboard.press('Escape');
  await clickSearch(p); await tabTo(p, (f) => f.raw === `board_card_${bid}`);
  for (const k of ['Control+ArrowRight', 'Alt+ArrowRight', 'Shift+ArrowRight', 'ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(600); }
  await goP(p, 'Board View', s.q); o.bravoLead = await leadOf(s, 'Bravo Co');
  R.C97020 = o;
});

await run('C97022', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const ben2 = (await person(a, 'ZZAUTOTEST Ben', `Bravo K${stamp}`, { role: TECH_ROLE, email: `zz.wob.kbben.${stamp}${D}`, clockable: true })).row;
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Focus Kept', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: { staff_id: ben2.staff_id } }, { co: 'Golf Co', lead: null }]);
  await pins([ANA.staff_id, ben2.staff_id]);
  await goP(p, 'Board View', s.q); await clickSearch(p); const id = s.w['Alpha Co'].id; const o: any = {};
  await tabTo(p, (f) => f.raw === `board_card_${id}`); await tabTo(p, (f) => /more_actions/.test(f.raw), 6); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
  for (let i = 0; i < 8; i++) { const cur = await p.evaluate(`document.activeElement?.innerText?.trim()`); if (/Reassign lead technician/.test(String(cur))) break; await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250); }
  await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  o.step4 = await focusInfo(); await shot(p, 'C97022-step4');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item').filter({ hasText: /^\s*Approved\s*$/ }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  await clickSearch(p); const g = await tabTo(p, (f) => f.raw === `board_card_${s.w['Golf Co'].id}`); o.golfFocused = g.found;
  o.golfToInProgress = say(await a.post('/api/work-orders/change-status', { id: s.w['Golf Co'].id, status: 'in_progress' }));
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.step5 = await focusInfo(); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.step5afterTab = await focusInfo();
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  await clickSearch(p); const bc = await tabTo(p, (f) => (f.raw || '').includes(ben2.staff_id), 200); o.benFocused = bc.found;
  o.deactivateBen = say(await a.post('/api/iam/change-status', { id: ben2.id }));
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.step6 = await focusInfo(); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.step6afterTab = await focusInfo();
  R.C97022 = o;
});

await run('C97028', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Blocked Analytics', [{ co: 'Alpha Co', lead: ANA }]);
  const blocked: string[] = []; p.on('requestfailed', (r) => { if (/google-analytics|googletagmanager|gtag|analytics/.test(r.url())) blocked.push(r.url().replace(/\?.*$/, '').slice(0, 80)); });
  await goP(p, 'Board View', s.q); const o: any = { loaded: await p.locator(`[data-test-id="board_card_${s.w['Alpha Co'].id}"]`).count() };
  const sw = async (key: string) => { await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(900); const t = p.locator(`[data-test-id="toggle_board_field_${key}"]`); const st = await t.locator('[role=switch]').getAttribute('aria-checked').catch(() => t.getAttribute('aria-checked')); if (st !== 'true') await t.click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); };
  await sw('vin'); await p.locator('[data-test-id="button_density"]').click(); await p.waitForTimeout(700); await p.locator('[data-test-id="option_density_compact"]').click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  o.step2 = { vinShown: await p.locator(`[data-test-id="board_card_${s.w['Alpha Co'].id}"] [data-test-id="board_card_field_vin"]`).count(), density: (await prefFor()).density };
  await dragOn(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step3 = { msg: await toasts(p), lead: await leadOf(s, 'Alpha Co') };
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, s.q);
  o.step4 = { display: (await prefFor()).display, vinShown: await p.locator(`[data-test-id="board_card_${s.w['Alpha Co'].id}"] [data-test-id="board_card_field_vin"]`).count(), density: (await prefFor()).density, inBen: (await colCards(p, BEN.staff_id, s)).includes('Alpha Co') };
  o.analyticsBlocked = [...new Set(blocked)].slice(0, 5); o.note = 'this harness refuses every Google Analytics / Tag Manager request';
  R.C97028 = o;
});

await run('C368154', async () => {
  const fresh = await mkUser('ZZAUTOTEST', `Fresh ${stamp}`, ADMIN_ROLE, 'fresh'); const v = await asUser(fresh); const o: any = {};
  try { const pg = v.page; o.savedBefore = (await prefFor()) ?? null; await pg.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
    o.step2active = await pg.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); return e && (e.getAttribute('aria-pressed') === 'true' || /active|selected|bg-/.test(e.className)); }) || null)`);
    await shot(pg, 'C368154-fresh-start'); await display(pg, 'Board View'); await pg.waitForTimeout(1500);
    await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800);
    o.step4 = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0 && /check/.test(e.innerText)).map(e => e.innerText.replace('check','').trim())`); await pg.keyboard.press('Escape');
    await pg.locator('[data-test-id="button_board_fields_selection"]').click(); await pg.waitForTimeout(900);
    o.step5 = await pg.evaluate(`[...document.querySelectorAll('.q-menu [data-test-id^="toggle_board_field_"]')].filter(e => (e.querySelector('[role=switch]') || e).getAttribute('aria-checked') === 'true').map(e => e.innerText.trim())`); await pg.keyboard.press('Escape');
  } finally { await v.close(); }
  R.C368154 = o;
});

const countsSet = async (prefix: string) => mkSet(prefix, [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA, status: 'estimate' }, { co: 'Delta Co', lead: BEN, status: 'in_progress' }, { co: 'Echo Co', lead: BEN, status: 'invoiced' }, { co: 'Golf Co', lead: null }, { co: 'Hotel Co', lead: null, status: 'estimate' }]);
const IDS4: Record<string, string> = { Unassigned: 'unassigned', Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id };
const boardCounts = async (set: any) => { const cs = await boardCols(p); return Object.fromEntries(Object.entries(IDS4).map(([k, id]) => { const c = cs.find((x) => x.id === id); return [k, c ? `${c.count}/${c.cards.length}` : 'not drawn']; })); };
const techCounts = async (set: any) => { const gs = await groups(p); return Object.fromEntries(Object.entries(IDS4).map(([k, id]) => { const g = gs.find((x) => x.id === id); return [k, g ? `${g.count}/${g.rows.length}` : 'not drawn']; })); };
const listCount = async () => p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).length`);
const statusOnly = async (label: string | null) => { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); if (label) await p.locator('.q-menu .q-item').filter({ hasText: new RegExp('^\\s*' + label + '\\s*$') }).first().click(); else await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); await expandSmallGroups(p); };

await run('C97030', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await countsSet('ZZAUTOTEST F3 Header Counts'); const o: any = {};
  await goP(p, 'List', s.q); o.step4 = await listCount();
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p); o.step6 = await techCounts(s);
  await display(p, 'Board View'); await p.waitForTimeout(2000); o.step8 = await boardCounts(s);
  await statusOnly('Approved'); o.step9 = { board: await boardCounts(s) }; await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p); o.step9.tech = await techCounts(s); await display(p, 'List'); await p.waitForTimeout(2000); o.step9.list = await listCount();
  await statusOnly(null); await tab(p, 'Estimates'); await display(p, 'Board View'); await p.waitForTimeout(2000); await search(p, s.q); o.step10 = { board: await boardCounts(s) };
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p); o.step10.tech = await techCounts(s);
  R.C97030 = o;
});

await run('C97031', async () => {
  await pins([ANA.staff_id, BEN.staff_id, CAL.staff_id]);
  const s = await countsSet('ZZAUTOTEST F3 Count After Move'); const o: any = {};
  await goP(p, 'Board View', s.q); o.step4 = await boardCounts(s);
  await dragOn(p, card(s, 'Alpha Co'), `[data-test-id="board_column_${CAL.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step5 = await boardCounts(s);
  const m = await openReassign(p, s.w['Bravo Co'].id); await m.item.click(); await p.waitForTimeout(1200); await p.locator('[data-test-id="option_lead_technician_unassigned"]').click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1200);
  o.step6 = await boardCounts(s);
  await dragOn(p, card(s, 'Golf Co'), card(s, 'Hotel Co'), 4); o.step7 = { counts: await boardCounts(s), un: await colCards(p, 'unassigned', s) };
  await dragOn(p, card(s, 'Echo Co'), `[data-test-id="board_column_${CAL.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); o.step8 = { counts: await boardCounts(s), echoLead: await leadOf(s, 'Echo Co') };
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p); o.step9 = await techCounts(s);
  await goP(p, 'Tech View', s.q); o.step10 = await techCounts(s);
  R.C97031 = o;
});

await run('C97032', async () => {
  await pins([ANA.staff_id]);
  const cben = (await person(a, 'ZZAUTOTEST F3 Count Ben', 'Bravo', { role: TECH_ROLE, email: `zz.wob.countben.${stamp}${D}`, clockable: true })).row; const B = { staff_id: cben.staff_id };
  const s = await mkSet('ZZAUTOTEST F3 Open Count', [{ co: 'Approved Co', lead: B }, { co: 'Progress Co', lead: B, status: 'in_progress' }, { co: 'Review Co', lead: B, status: 'ready_for_review' }, { co: 'Complete Co', lead: B, status: 'complete' }, { co: 'Estimate Co', lead: B, status: 'estimate' }, { co: 'Invoiced Co', lead: B, status: 'invoiced' }, { co: 'Paid Co', lead: B, status: 'paid' }, { co: 'Declined Co', lead: B, status: 'declined' }, { co: 'Line Only Co', lead: ANA }, { co: 'Spare Co', lead: ANA }]);
  const lo = (await linesRaw(s.w['Line Only Co'].id))[0]; if (lo) await a.put(`/api/work-orders/lines/${lo.line_id}/technicians`, { staffIds: [cben.staff_id] });
  const o: any = { statuses: Object.fromEntries((await workOrders(a, s.q)).map((w: any) => [nameOf(s)(w.number), w.status])) };
  const readCount = async (from: string) => { const mm = await openReassign(p, s.w[from].id); await mm.item.click(); await p.waitForTimeout(1200); await p.locator('[data-test-id="input_reassign_lead_search"]').fill('Count Ben'); await p.waitForTimeout(1200);
    const c = await p.locator(`[data-test-id="text_lead_technician_open_count_${cben.staff_id}"]`).innerText().catch(() => null); await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await p.waitForTimeout(800); return c; };
  await goP(p, 'Board View', s.q); o.step5 = await readCount('Spare Co');
  await statusOnly('Estimate'); const vis = Object.keys(s.w).find((k) => k === 'Estimate Co'); await toColumn(p, cben.staff_id);
  o.step6 = await readCount(vis!).catch((e) => `could not open: ${String(e).slice(0, 80)}`); await statusOnly(null);
  o.approve = say(await a.post('/api/work-orders/change-status', { id: s.w['Estimate Co'].id, status: 'approved' }));
  await goP(p, 'Board View', s.q); o.step7 = await readCount('Spare Co');
  R.C97032 = o;
});

await run('C154648', async () => {
  await goP(p, 'List', ''); const o: any = {};
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); const imp = p.locator('.q-menu .q-item').filter({ hasText: /^\s*Imported/ }).first(); o.importedOptionInList = await imp.innerText().catch(() => null);
  await imp.click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  for (const l of ['Tech View', 'Board View']) { const b = p.locator(`[aria-label="${l}"]`).first(); await b.hover(); await p.waitForTimeout(1000);
    o[l] = { disabled: await b.evaluate((e) => e.hasAttribute('disabled') || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled')), tooltip: await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`) };
    await b.click({ force: true }).catch(() => {}); await p.waitForTimeout(1500); o[l].activeAfterClick = await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); return e && (e.getAttribute('aria-pressed') === 'true' || /active|selected/.test(e.className)); }) || null)`); }
  o.listRowsWhileImported = await listCount(); await shot(p, 'C154648-list-imported');
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  for (const l of ['Tech View', 'Board View']) { await display(p, l); await p.waitForTimeout(1500); await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900);
    const it = p.locator('.q-menu .q-item').filter({ hasText: /^\s*Imported/ }).first(); o[`${l} imported option`] = { disabled: await it.evaluate((e) => e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') || e.classList.contains('q-item--disabled')).catch(() => null), text: await it.innerText().catch(() => null) };
    await it.click({ force: true }).catch(() => {}); await p.waitForTimeout(1000); o[`${l} imported option`].ticked = await it.evaluate((e) => !!e.querySelector('[aria-checked=true], .q-checkbox__inner--truthy')).catch(() => null); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
  R.C154648 = o;
});

await run('C154649', async () => {
  const o: any = {}; await goP(p, 'Board View', ''); o.saved0 = (await prefFor()).display;
  await p.setViewportSize({ width: 900, height: 900 }); await p.waitForTimeout(2500);
  const look = async () => ({ switcher: await p.locator('[aria-label="Board View"]:visible, [aria-label="Tech View"]:visible').count(), density: await p.locator('[data-test-id="button_density"]:visible').count(), fields: await p.locator('[data-test-id="button_board_fields_selection"]:visible').count(), board: await p.locator('[data-test-id^="board_column_"]:visible').count() });
  o.narrow = await look(); await shot(p, 'C154649-narrow'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.narrowAfterRefresh = await look(); o.savedNarrow = (await prefFor()).display;
  await p.setViewportSize({ width: 1600, height: 1000 }); await p.waitForTimeout(2500); o.wide = { ...(await look()), saved: (await prefFor()).display }; await shot(p, 'C154649-wide');
  R.C154649 = o;
});

await run('C368157', async () => {
  await pins([]); const o: any = {};
  await goP(p, 'Board View', ''); const before = await allCols(p); o.before = named(before, IDS).slice(0, 8); o.calIndexBefore = before.indexOf(CAL.staff_id);
  await toColumn(p, CAL.staff_id); await p.locator(`[data-test-id="button_board_pin_${CAL.staff_id}"]`).click(); await p.waitForTimeout(2000);
  const pinned = await allCols(p); o.pinned = { calIndex: pinned.indexOf(CAL.staff_id), first3: named(pinned.slice(0, 3), IDS) };
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(500); await p.locator(`[data-test-id="button_board_pin_${CAL.staff_id}"]`).click(); await p.waitForTimeout(2000);
  const after = await allCols(p); o.unpinned = { calIndex: after.indexOf(CAL.staff_id), sameAsBefore: JSON.stringify(after) === JSON.stringify(before), neighbours: named(after.slice(Math.max(0, after.indexOf(CAL.staff_id) - 2), after.indexOf(CAL.staff_id) + 3), IDS) };
  await display(p, 'Tech View'); await p.waitForTimeout(2500);
  const g = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^tech_view_group_[0-9a-f-]{36}$|^tech_view_group_unassigned$/.test(t)).map(t => t.replace('tech_view_group_', ''))`) as string[];
  o.techSameOrder = JSON.stringify(g) === JSON.stringify(after); o.techCalIndex = g.indexOf(CAL.staff_id);
  R.C368157 = o;
});

await run('C368158', async () => {
  await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Invoiced On Site', [{ co: 'Inv Co', lead: ANA, status: 'invoiced' }]); const o: any = {};
  const here = async () => (await a.get(`/api/work-orders/view/${s.w['Inv Co'].id}`)).body?.data?.work_order?.is_vehicle_here;
  o.status = (await workOrders(a, s.q))[0]?.status; o.before = await here();
  await goP(p, 'List', s.q); const tr = p.locator('tbody tr').filter({ hasText: s.w['Inv Co'].number });
  await tr.locator('[data-test-id="button_vehicle_here_toggle"]').first().click(); await p.waitForTimeout(2500); o.msg = await toasts(p);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.after = await here(); o.lead = await leadOf(s, 'Inv Co');
  R.C368158 = o;
});

await run('C368159', async () => {
  await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Stale On Site', [{ co: 'Site Co', lead: ANA }]); const o: any = {};
  const here = async () => (await a.get(`/api/work-orders/view/${s.w['Site Co'].id}`)).body?.data?.work_order?.is_vehicle_here;
  await goP(p, 'List', s.q); o.before = { here: await here(), lead: await leadOf(s, 'Site Co') };
  // browser 2: the work order page, Lead Technician -> Ben Bravo
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${s.w['Site Co'].id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  await pg.locator('[data-test-id="select_lead_technician"]').click(); await pg.waitForTimeout(1000); await pg.keyboard.type('Ben'); await pg.waitForTimeout(1200);
  await pg.locator('.q-menu .q-item').filter({ hasText: 'Ben Bravo' }).first().click(); await pg.waitForTimeout(3000); await pg.close();
  o.leadAfterB2 = await leadOf(s, 'Site Co');
  // browser 1, stale page: toggle On Site
  const tr = p.locator('tbody tr').filter({ hasText: s.w['Site Co'].number }); await tr.locator('[data-test-id="button_vehicle_here_toggle"]').first().click(); await p.waitForTimeout(2500);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  o.after = { here: await here(), lead: await leadOf(s, 'Site Co') };
  R.C368159 = o;
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 's11-batch.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
