/** 16 Oct 2026: follows the cases as rewritten on 16 Oct to PRD v61 (one Tab stop per view, arrow keys move inside it) - C97021, C368150,
 * C368151, C368152, C97020 and C97022 are re-written below ("16 Oct 2026: follows the case as rewritten"); the older helpers stay for reference.
 * FIX 4 (2026-10-09): C368151 also looks for the group's arrow button by Tab and tries Space / Left / Right on the row;
 * C368152 Tabs to the first person in the reassign list and arrows down to the right Ben Bravo (matched by staff record).
 * FIX 3 (2026-10-09): focus on the page body reads as 'body' (C368152 crashed); the arrow walk goes to the leftmost
 * column first (Golf Co sits in Unassigned); the Tech View collapse counts visible rows; the view-only user's menu item
 * is pressed to see whether the reassign window opens, and the user's role is read back. Run with WOB_LIVE=1 — the main
 * page now receives live updates too (session.mts), so a card leaving the filtered board needs no reload.
 * Keyboard checks, second attempt (2026-10-09): C97021, C368150, C368151, C368152, C97020, C97022.
 *  probe-kbd.json showed how the build does it: Tab stops on ONE card per board (roving focus, tabindex 0 on the first
 *  card) and the ARROW KEYS move card to card and column to column (ArrowUp reaches the column header); in Tech View Tab
 *  stops on the first group header only and rows carry no tabindex. So every check here places focus with Tab and then
 *  moves with the arrows, recording each stop (test-id + whether a focus outline is drawn). */
import { ME_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups, woPageLead, findRow } from './wob.mts';
import { startState } from './fixup-1017.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
p.setDefaultTimeout(30_000);
const a = api(p);
await startState(p, a, 'kbd-fix4');   // L0415, fix-up 2
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
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 'kbd-fix4.json'), JSON.stringify(R, null, 1));
}
const IDS = { Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id, Dan: DAN.staff_id };


const me = (await candidates(a)).find((x) => x.name === ME_NAME)!;
const ORG = (await import('./profile.mts')).ORG;
const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) /* 15 Oct 2026: staging answers a plain list (L0339) */;
const RI = await roleIds(a);
const roleId = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
const ADMIN_ROLE = roleId(/^admin(istrator)?$/i);
const VIEW_ROLE = roleId(/^ZZAUTOTEST WO View Only$/) ?? (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0]?.role_id;
const stamp = Date.now() % 1000000;
const mkUser = async (first: string, last: string, role: string, tag: string) => (await person(a, first, last, { role, email: `zz.wob.${tag}.${stamp}${D}`, clockable: false })).row;
const asUser = async (u: any) => viewAs(browser, p, a, u.id, me.id, RUN.toRunner);
const colsOf = async (pg: Page) => { const save = (p as any); return pg.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(h => h.getAttribute('data-test-id').replace('board_column_header_', ''))`) as Promise<string[]>; };
const allCols = async (pg: Page) => { const seen: string[] = []; await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await pg.waitForTimeout(500);
  for (let i = 0; i < 200; i++) { for (const c of await colsOf(pg)) if (!seen.includes(c)) seen.push(c); const moved = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await pg.waitForTimeout(350); if (!moved) break; }
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


const focusInfo = (pg: Page = p) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body', raw: 'body' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  return { tid: (e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || '', text: (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), outline: !!visible }; })()`) as Promise<any>;
async function tabTo(pg: Page, want: (f: any) => boolean, max = 120, key = 'Tab') { const seen: string[] = [];
  for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(120); const f = await focusInfo(pg); seen.push(f.tid); if (want(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await pg.keyboard.press('Escape'); await pg.locator('[data-test-id="page_search_toggle"]').click({ force: true }); } await box.click(); await pg.waitForTimeout(300); };


const nm = (s: any) => (raw: string) => { const id = raw.replace(/^(board_card_|tech_view_row_|board_column_header_|tech_view_group_)/, ''); const k = Object.keys(s.w).find((x) => s.w[x].id === id) ?? Object.keys(IDS).find((x) => (IDS as any)[x] === id); return k ? raw.replace(id, k) : raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); };
/** from the first card, walk the board with the arrows: down each column, then right to the next one */
async function walkBoard(pg: Page, s: any) { const N = nm(s); const seen: string[] = []; const t0 = await tabTo(pg, (f) => /^board_card_/.test(f.raw)); if (!t0.found) return { found: false, seen };
  let f = t0.f; seen.push(N(f.raw) + (f.outline ? '*' : ''));
  for (let c = 0; c < 8; c++) { for (let d = 0; d < 8; d++) { await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(200); const g = await focusInfo(pg); if (g.raw === f.raw) break; f = g; seen.push(N(f.raw) + (f.outline ? '*' : '')); }
    await pg.keyboard.press('ArrowUp'); await pg.waitForTimeout(150); for (let u = 0; u < 8; u++) { const g = await focusInfo(pg); if (/^board_column_header_/.test(g.raw)) { seen.push(N(g.raw) + (g.outline ? '*' : '')); await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(150); break; } await pg.keyboard.press('ArrowUp'); await pg.waitForTimeout(150); }
    await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(250); const r = await focusInfo(pg); if (r.raw === f.raw || !/^board_/.test(r.raw)) break; f = r; seen.push(N(f.raw) + (f.outline ? '*' : '')); }
  return { found: true, seen: [...new Set(seen)] }; }
/** FIX 2026-10-09: the board's single Tab stop is the roving item, which is a column HEADER when the first column has no
 *  matching card (the earlier version waited for a card and tabbed out to the top menu). Enter at a card or header, then
 *  per column: up to the header, down every card, then right to the next column. */
async function arrowToCard(pg: Page, target: string) { const t0 = await tabTo(pg, (f) => /^board_(card|column_header)_/.test(f.raw)); if (!t0.found) return false; let f = t0.f;
  const press = async (k: string) => { await pg.keyboard.press(k); await pg.waitForTimeout(200); return focusInfo(pg); };
  for (let l = 0; l < 16; l++) { if (f.raw === target) return true; const g = await press('ArrowLeft'); if (g.raw === f.raw || !/^board_/.test(g.raw)) break; f = g; }
  for (let c = 0; c < 16; c++) {
    if (f.raw === target) return true;
    for (let u = 0; u < 12; u++) { const g = await press('ArrowUp'); if (g.raw === f.raw || !/^board_/.test(g.raw)) break; f = g; if (f.raw === target) return true; }
    for (let d = 0; d < 12; d++) { const g = await press('ArrowDown'); if (g.raw === f.raw || !/^board_/.test(g.raw)) break; f = g; if (f.raw === target) return true; }
    const r = await press('ArrowRight'); if (r.raw === f.raw || !/^board_/.test(r.raw)) return false; f = r; }
  return f.raw === target; }
/** Tech View: Tab to the roving item (a group or a row), then ArrowDown until the wanted row */
async function arrowToRow(pg: Page, target: string) { const t0 = await tabTo(pg, (f) => /^tech_view_(row|group)_/.test(f.raw)); if (!t0.found) return false; let f = t0.f;
  for (let i = 0; i < 30; i++) { if (f.raw === target) return true; await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(200); const g = await focusInfo(pg); if (g.raw === f.raw) return false; f = g; }
  return f.raw === target; }
const statusOnly = async (label: string | null) => { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); if (label) await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(label, 'i') }).first().click(); else await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500); };


// ───── 16 Oct 2026 (build v26.40.18-7d85b7d, RETEST-PLAN-2026-10-16): the six keyboard cases were rewritten on 15 Oct (Chris Ward's
// answers). The blocks below follow the CURRENT steps. Focus is placed with Tab first; only when Tab alone does not reach the wanted
// card is the board's own arrow-key movement used, and the reading says so ("reachedBy"). Every key press is followed by a reading of
// what has focus (test-id, words, and whether a focus outline/ring is drawn).
const fx = (pg: Page) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { raw: 'body', label: null, text: '' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  return { raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName, label: e.getAttribute('aria-label'), cls: String(e.className || '').slice(0, 80), text: (e.innerText || '').replace(/\\s+/g, ' ').slice(0, 40),
    outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor : null, shadow: cs.boxShadow !== 'none' ? cs.boxShadow.slice(0, 60) : null, focusVisible: e.matches(':focus-visible') }; })()`) as Promise<any>;
const clean = (x: string) => String(x).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>');
/** press `key` until `ok(focus)` (max presses); returns the stops */
async function keyUntil(pg: Page, ok: (f: any) => boolean | Promise<boolean>, max = 60, key = 'Tab', N: (r: string) => string = clean) {
  const seen: string[] = []; for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(150); const f = await fx(pg); seen.push(N(f.raw) + (f.label ? `(${f.label})` : '') + (f.outline || f.shadow ? '*' : '')); if (await ok(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
/** a card focused: Tab first, then the board's arrows */
async function cardFocus(pg: Page, target: string) { await clickSearch(pg); const t1 = await keyUntil(pg, (f) => f.raw === target, 40);
  if (t1.found) return { reachedBy: 'Tab', presses: t1.presses, tabStops: t1.seen }; await clickSearch(pg); const ok = await arrowToCard(pg, target);
  return { reachedBy: ok ? 'Tab to the board, then arrow keys (Tab alone did not reach it)' : 'not reached', tabStops: t1.seen }; }
const menuOpen = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).length`) as Promise<number>;
const menuItems = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim() + (e.classList.contains('disabled') || e.classList.contains('q-item--disabled') || e.getAttribute('aria-disabled') === 'true' ? ' [disabled]' : ''))`) as Promise<string[]>;
/** answer a "Clear … scheduled shifts?" question by keyboard: Tab to Keep shifts, Enter */
async function keepShiftsKbd(pg: Page) { await pg.waitForTimeout(900); const d = pg.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last(); if (!(await d.count())) return null;
  const text = (await d.innerText()).replace(/\s+/g, ' '); const k = await keyUntil(pg, (f) => /keep shifts/i.test(f.text), 8); if (k.found) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(2000); } return { text, keepByKeyboard: k.found }; }
const colOf = async (pg: Page, woId: string) => pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${woId}"]'); const col = c && c.closest('[data-test-id^="board_column_"]'); return col ? col.getAttribute('data-test-id').replace(/^board_column_/, '') : (c ? 'card, no column' : 'card not on the board'); })()`) as Promise<string>;

// ───── 16 Oct 2026: follows the cases as rewritten on 16 Oct to PRD v61 (one Tab stop per view, the arrow keys move inside it). The PRD's
// keyboard rules are taken ONLY from the cases' own quoted source lines (Confluence not fetched): S11-R1 "Each view is a single Tab stop.
// Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a
// group or column header while a work order is shown ...)"; S11-R3 "Inside a view the arrow keys move focus: Up and Down move between rows
// and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board
// View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the
// view. Tab never stops on every row."; S11-R9 "Reassigning by keyboard goes through the more-actions menu ... There is no keyboard drag".
// Rules for every reading below: after EVERY key the identity of document.activeElement is recorded (its own data-test-id, the nearest
// card / column / row / group it sits in, its words, aria-label, and whether a focus ring is drawn); typing records what the field holds
// after typing (L0387); Tech View rows lower down are brought on screen with findRow (L0402); every negative reading has a positive
// control in the same run (Rule 104: e.g. "focus leaves the board" is only read after the same Tab DID land on the board).
const kz = (pg: Page, N: (r: string) => string = clean) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { raw: 'body', where: 'page', text: '', ring: false };
  const up = (re) => { for (let x = e; x; x = x.parentElement) { const t = x.getAttribute && x.getAttribute('data-test-id'); if (t && re.test(t)) return t; } return null; };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  const card = up(/^board_card_[0-9a-f-]{36}$/), col = up(/^board_column_([0-9a-f-]{36}|unassigned)$/), head = up(/^board_column_header_/), row = up(/^tech_view_row_/), grp = up(/^tech_view_group_([0-9a-f-]{36}|unassigned)$/);
  const where = e.closest('.q-dialog') ? 'dialog' : e.closest('.q-menu') ? 'menu' : (card || col || head || e.closest('[data-test-id="board_view_scroller"]')) ? 'board' : (row || grp || e.closest('.q-table__middle')) ? 'table' : 'page';
  return { raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName, own: e.getAttribute('data-test-id'), tag: e.tagName, label: e.getAttribute('aria-label'), title: e.getAttribute('title'),
    cls: String(e.className || '').slice(0, 80), text: (e.innerText || e.value || '').replace(/\\s+/g, ' ').trim().slice(0, 50), ring: !!ring, where, card, column: col ? col.replace('board_column_', '') : (head ? head.replace('board_column_header_', '') : null), header: head, row, group: grp }; })()`)
  .then((f: any) => ({ ...f, raw: N(f.raw), card: f.card ? N(f.card) : null, column: f.column ? N(f.column) : null, header: f.header ? N(f.header) : null, row: f.row ? N(f.row) : null, group: f.group ? N(f.group) : null }));
const kshort = (f: any) => `${f.raw}${f.card && f.card !== f.raw ? ' in ' + f.card : ''}${f.row && f.row !== f.raw ? ' in ' + f.row : ''}${f.ring ? ' (ring)' : ''} [${f.where}]`;
/** press one key and read what has focus */
const kp = async (pg: Page, k: string, N: (r: string) => string = clean) => { await pg.keyboard.press(k); await pg.waitForTimeout(250); return { key: k, ...(await kz(pg, N)) }; };
/** step "Click once in the Search box": the box is clicked, then focus is read, and whether anything in the board/table has focus or a ring */
async function kSearch(pg: Page, N: (r: string) => string = clean) { await clickSearch(pg); await pg.waitForTimeout(300);
  return { focus: await kz(pg, N), inSearch: await pg.evaluate(`(() => { const e = document.activeElement; return !!e && (e.getAttribute('data-test-id') === 'page_search_input' || !!e.closest('[data-test-id="page_search_input"]')); })()`),
    searchHolds: await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null),
    ringsInViews: await pg.evaluate(`[...document.querySelectorAll('[data-test-id="board_view_scroller"] *, .q-table__middle *')].filter(e => e.matches(':focus, :focus-visible, :focus-within')).length`) }; }
/** "Press Tab until something on the board / in the table shows a focus ring": every stop on the way is kept */
async function kTabIn(pg: Page, area: 'board' | 'table', N: (r: string) => string = clean, max = 40) { const stops: string[] = [];
  for (let i = 0; i < max; i++) { const f = await kp(pg, 'Tab', N); stops.push(kshort(f)); if (f.where === area) return { landed: f, presses: i + 1, stops, headerOnTheWay: stops.some((x) => /column_header|tech_view_group_/.test(x)) }; }
  return { landed: null, presses: max, stops, headerOnTheWay: stops.some((x) => /column_header|tech_view_group_/.test(x)) }; }
const same = (f: any, g: any) => f.raw === g.raw && f.card === g.card && f.row === g.row && f.group === g.group;
/** "Use the arrow keys to move the focus ring to ...": from where focus is NOW, arrows only; each key recorded. Board: down/up the column,
 *  then right (and back left) column by column. Table: down, then up. Stops when focus would leave the view. */
async function kArrowsTo(pg: Page, ok: (f: any) => boolean, mode: 'board' | 'table', N: (r: string) => string = clean, tableOrder: string[] = ['ArrowDown', 'ArrowUp']) {
  const keys: string[] = []; let f = await kz(pg, N); if (ok(f)) return { reached: true, keys, focus: f };
  const press = async (k: string) => { const g = await kp(pg, k, N); keys.push(`${k} -> ${kshort(g)}`); return g; };
  const scan = async (dirs: string[], n = 30) => { for (const k of dirs) for (let i = 0; i < n; i++) { const g = await press(k); if (ok(g)) { f = g; return true; } if (same(g, f) || g.where !== mode) break; f = g; } return false; };
  if (mode === 'table') { const r = await scan(tableOrder); return { reached: r, keys, focus: f }; }
  if (await scan(['ArrowDown', 'ArrowUp'], 12)) return { reached: true, keys, focus: f };
  for (const dir of ['ArrowRight', 'ArrowLeft']) for (let c = 0; c < 16; c++) { const g = await press(dir); if (ok(g)) return { reached: true, keys, focus: g }; if (same(g, f) || g.where !== 'board') break; f = g; if (await scan(['ArrowDown', 'ArrowUp'], 12)) return { reached: true, keys, focus: f }; }
  return { reached: false, keys, focus: f }; }
/** a pinned / filtered start: pins as asked, no saved collapsed groups, no filters (put back from ORIGINAL at the end of the file) */
const kPrefs = async (ids: string[]) => { const v: any = {}; for (const [k, x] of Object.entries(await prefGet())) if (!/collaps/i.test(k)) v[k] = x; v.pinnedTechnicianIds = ids; v.filters = {}; return (await a.put(PREF, { value: v })).status; };
const kAssigned = (pg: Page) => pg.locator('[data-test-id="filter_chip_assigned_to_me"]').first().evaluate((e) => e.getAttribute('aria-pressed') ?? (/(selected|active|bg-primary|text-primary)/.test(e.className) ? 'true' : 'false')).catch(() => null);
/** the starting screen of every keyboard case: All tab, the display, the customer in Search, Assigned to me off; read back */
async function kStart(pg: Page, d: string, q: string) { await goP(pg, d, q); if ((await kAssigned(pg)) === 'true') { await pg.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await pg.waitForTimeout(2000); }
  return { tab: await pg.evaluate(`(document.querySelector('.q-tab--active, [role=tab][aria-selected=true]') || {}).innerText?.trim() || null`), search: await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), assignedToMe: await kAssigned(pg), width: await pg.evaluate('innerWidth') }; }
const kMore = (pg: Page, woId: string) => pg.locator(`[data-test-id="board_card_${woId}"] [data-test-id="button_work_order_more_actions"]`).first().evaluate((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && r.width > 0; }).catch(() => false);
/** with the menu open: arrow down to the item whose words match, then Enter; returns the stops and what the item said */
async function kMenuChoose(pg: Page, re: RegExp) { const k = await keyUntil(pg, (f) => re.test(f.text), 10, 'ArrowDown'); const focus = await fx(pg); if (k.found) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(1500); } return { found: k.found, stops: k.seen, itemFocused: focus.text }; }
/** in the open Reassign dialog: to the search box, type, read what the box holds, arrows (then Tab) to the person, Enter, Confirm, Keep shifts */
async function kDialogPick(pg: Page, typed: string, staffId: string, who: string) { const o: any = {};
  o.focusOnOpen = clean((await fx(pg)).raw); o.focusInSearch = await pg.evaluate(`!!(document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.closest('.q-dialog'))`);
  if (!o.focusInSearch) { const k = await keyUntil(pg, (f) => /INPUT/.test(f.raw) || /search/i.test(f.raw), 6); o.tabToSearch = k.seen; }
  await pg.keyboard.type(typed, { delay: 60 }); await pg.waitForTimeout(1800);
  o.boxHolds = await pg.locator('.q-dialog input').first().inputValue().catch(() => null); // L0387: what the field holds after typing
  o.rows = await pg.evaluate(`[...document.querySelectorAll('.q-dialog [data-test-id^="option_lead_technician_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 40))`);
  o.rowIsTarget = (await pg.evaluate(`[...document.querySelectorAll('.q-dialog [data-test-id^="option_lead_technician_"]')].map(e => e.getAttribute('data-test-id'))`) as string[]).map((x) => x === `option_lead_technician_${staffId}` ? who : clean(x));
  const want = `option_lead_technician_${staffId}`;
  let k = await keyUntil(pg, (f) => f.raw === want, 8, 'ArrowDown'); o.route = 'arrow keys from the search box';
  if (!k.found) { const t1 = await keyUntil(pg, (f) => /^option_lead_technician_/.test(f.raw), 4, 'Tab'); k = await keyUntil(pg, (f) => f.raw === want, 8, 'ArrowDown'); o.route = `Tab to the list (${t1.seen.join(' > ')}), then arrow keys`; if (!k.found && t1.found && t1.f?.raw === want) k = t1; }
  o.reachedPerson = k.found; o.stops = k.seen;
  if (k.found) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200);
    if (await pg.locator('.q-dialog').filter({ hasNotText: /scheduled shifts/i }).count()) { const cf = await keyUntil(pg, (f) => /confirm/i.test(f.raw), 8); o.confirm = cf.found ? 'Confirm reached by Tab, Enter pressed' : 'no Confirm button reached'; if (cf.found) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200); } }
    o.shifts = await keepShiftsKbd(pg); await pg.waitForTimeout(600); o.messages = await toastsOn(pg); }
  o.dialogsLeft = await pg.locator('.q-dialog').count(); return o; }
const lineTech = async (wo: string, staffId: string) => { const l = (await linesRaw(wo))[0]; return l ? say(await a.put(`/api/work-orders/lines/${l.line_id}/technicians`, { staffIds: [staffId] })) : 'no line'; };
const techChip = (pg: Page) => pg.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();

await run('C97021', async () => {
  // 16 Oct 2026: follows the case as rewritten (PRD v61: one Tab stop per view, then Right/Down arrows; Tab from a card goes to its own
  // More actions and Tab again leaves the board; in Tech View Tab lands on the first ROW and Down reaches the next group header).
  // Work-order-1..4 = Alpha Co, Bravo Co (Technician-A = Ana), Charlie Co (Technician-B = Ben), Golf Co (no lead). Pins: A then B.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reach', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const N = nm(s);
  const o: any = (R.C97021 = { names: 'Work-order-1 Alpha Co, Work-order-2 Bravo Co, Work-order-3 Charlie Co, Work-order-4 Golf Co; Technician-A Ana, Technician-B Ben', prefs: await kPrefs([ANA.staff_id, BEN.staff_id]) });
  o.start = await kStart(p, 'Board View', s.q); o.start.columns = (await boardCols(p)).slice(0, 4).map((c) => `${N(c.id)}(${c.count}) [${c.cards.map(nameOf(s)).join(', ')}]`);
  o.s1 = await kSearch(p, N); await shot(p, 'C97021-s1-search');
  o.s2 = await kTabIn(p, 'board', N); o.s2.isWorkOrder4Card = o.s2.landed?.card === 'board_card_Golf Co' && o.s2.landed?.column === 'unassigned'; await p.mouse.move(1, 1); await shot(p, 'C97021-s2-first-tab-stop');
  o.s3 = await kp(p, 'ArrowRight', N); o.s3.inTechnicianAColumn = o.s3.column === 'Ana'; await shot(p, 'C97021-s3-arrow-right');
  o.s4 = await kp(p, 'ArrowDown', N); o.s4.cardOfTechnicianA = o.s4.column === 'Ana' && !!o.s4.card && o.s4.card !== o.s3.card; await shot(p, 'C97021-s4-arrow-down');
  o.s5 = await kp(p, 'Tab', N); o.s5.ownMoreActions = /more_actions/.test(o.s5.raw) && o.s5.card === o.s4.card; await shot(p, 'C97021-s5-tab-more-actions');
  o.s6 = await kp(p, 'Tab', N); o.s6.leftBoard = o.s6.where !== 'board'; o.s6.positiveControl = 'step 2 shows Tab landing ON the board in this run'; await shot(p, 'C97021-s6-tab-leaves');
  await display(p, 'Tech View'); await p.waitForTimeout(2000);
  o.s7 = { groupsInOrder: (await groups(p)).slice(0, 4).map((g) => ({ group: N(g.id), name: g.name, count: g.count, collapsed: g.collapsed, rows: g.rows.map(nameOf(s)) })) }; await shot(p, 'C97021-s7-tech-view');
  o.s8 = await kSearch(p, N); await shot(p, 'C97021-s8-search');
  o.s9 = await kTabIn(p, 'table', N); o.s9.isWorkOrder4Row = o.s9.landed?.row === 'tech_view_row_Golf Co' && !/tech_view_group_/.test(o.s9.landed?.raw ?? ''); await p.mouse.move(1, 1); await shot(p, 'C97021-s9-first-tab-stop');
  o.s10 = await kp(p, 'ArrowDown', N); o.s10.isTechnicianAHeader = o.s10.group === 'tech_view_group_Ana' && !o.s10.row; await shot(p, 'C97021-s10-arrow-down');
});

await run('C368150', async () => {
  // 16 Oct 2026: follows the case as rewritten (Space and Shift+each arrow are pressed BEFORE Enter - plain arrows now move focus by design,
  // so they are not "drag" keys any more; Back is the browser Back button, page.goBack()). Work-order-1 = Alpha Co (Technician-A = Ana).
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Enter Opens', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const id = s.w['Alpha Co'].id; const N = nm(s);
  const o: any = (R.C368150 = { prefs: await kPrefs([ANA.staff_id, BEN.staff_id]) });
  const isWo = () => /\/workorders\/[0-9a-f-]{36}/.test(p.url()); const u = () => clean(p.url().replace(APP, ''));
  const place = async () => { const c = await colCards(p, ANA.staff_id, s); return { column: (await colOf(p, id)).replace(ANA.staff_id, 'Technician-A').replace(BEN.staff_id, 'Technician-B'), indexInA: c.indexOf('Alpha Co'), technicianAColumn: c }; };
  o.start = await kStart(p, 'Board View', s.q);
  o.s1 = await kSearch(p, N); await shot(p, 'C368150-s1-search');
  o.s2 = await kTabIn(p, 'board', N); await p.mouse.move(1, 1); await shot(p, 'C368150-s2-tab-card');
  o.s3 = await kArrowsTo(p, (f) => f.card === 'board_card_Alpha Co' && f.raw === 'board_card_Alpha Co', 'board', N); await shot(p, 'C368150-s3-arrows-wo1');
  o.s4 = { before: await place(), keys: {} as any };
  for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { const f = await kp(p, k, N); await p.waitForTimeout(700);
    o.s4.keys[k] = { focus: kshort(f), page: isWo() ? `work order opened ${u()}` : 'board', ...(isWo() ? {} : await place()), updatedMessage: (await toastsOn(p)).filter((x) => /lead technician/i.test(x)) };
    if (isWo()) { await p.goBack(); await p.waitForTimeout(3500); o.s4.keys[k].wentBack = true; } }
  o.s4.after = { ...(await place()), lead: await leadOf(s, 'Alpha Co'), messagesNow: await toastsOn(p) }; await shot(p, 'C368150-s4-after-keys');
  o.s5 = { focusBeforeEnter: kshort(await kz(p, N)) }; await p.keyboard.press('Enter'); await p.waitForTimeout(3500); o.s5.url = u(); o.s5.openedWorkOrder1 = p.url().includes(id); await shot(p, 'C368150-s5-after-enter');
  await p.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4000);
  o.s6 = { url: u(), display: await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`), cardOnBoard: await p.locator(`[data-test-id="board_card_${id}"]`).count(), boardCounts: Object.fromEntries((await boardCols(p)).filter((c) => c.count > 0).map((c) => [N(c.id), c.count])) };
  await shot(p, 'C368150-s6-after-back');
  await display(p, 'Tech View'); await p.waitForTimeout(2000);
  const gs = await groups(p); o.s7 = { groupCounts: Object.fromEntries(gs.filter((g) => g.count > 0).map((g) => [N(g.id), g.count])) }; o.s7.sameAsBoard = JSON.stringify(Object.entries(o.s7.groupCounts).sort()) === JSON.stringify(Object.entries(o.s6.boardCounts).sort()); await shot(p, 'C368150-s7-tech-view');
  o.s8 = await kSearch(p, N); await shot(p, 'C368150-s8-search');
  o.s9 = await kTabIn(p, 'table', N); o.s9.onARow = !!o.s9.landed?.row && !/tech_view_group_/.test(o.s9.landed?.raw ?? ''); await p.mouse.move(1, 1); await shot(p, 'C368150-s9-tab-row');
  o.s10 = await kArrowsTo(p, (f) => f.row === 'tech_view_row_Alpha Co', 'table', N); await shot(p, 'C368150-s10-arrows-row');
  o.s11 = { focusBeforeEnter: kshort(await kz(p, N)) }; await p.keyboard.press('Enter'); await p.waitForTimeout(3500); o.s11.url = u(); o.s11.openedWorkOrder1 = p.url().includes(id); await shot(p, 'C368150-s11-after-enter');
  await p.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4000);
  o.s12 = { url: u(), display: await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`) }; await shot(p, 'C368150-s12-after-back');
  o.s13 = { group: await findRow(p, id, ANA.staff_id) }; const rb = await p.locator(`[data-test-id="tech_view_row_${id}"]`).first().boundingBox();
  if (rb) { const x = rb.x + Math.min(rb.width * 0.35, 420), y = rb.y + rb.height / 2; await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(3500); Object.assign(o.s13, { at: [Math.round(x), Math.round(y)], url: u(), openedWorkOrder1: p.url().includes(id) }); await shot(p, 'C368150-s13-after-click'); } else o.s13.click = 'row not on screen';
});

await run('C368151', async () => {
  // 16 Oct 2026: follows the case as rewritten (headers are reached with the arrow keys - ArrowUp from a card / Shift+Tab back to the row
  // then ArrowUp to the group - and then Tab to the pin / collapse arrow / avatar; Column Selection and Status by keyboard). Precondition:
  // ONE Approved work order (Alpha Co) led by Technician-A (Ana), A NOT pinned, A on one of its lines so Assigned Techs shows an avatar;
  // in Tech View A's group expanded and Assigned Techs on (set by mouse, which the case allows for set-up).
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls One', [{ co: 'Alpha Co', lead: ANA }]); const id = s.w['Alpha Co'].id; const N = nm(s);
  const o: any = (R.C368151 = { prefs: await kPrefs([BEN.staff_id]), lineTechnician: await lineTech(id, ANA.staff_id) });
  const isPinned = async () => ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id);
  const pinBtn = () => p.locator(`[data-test-id="button_board_pin_${ANA.staff_id}"]`).first().getAttribute('aria-pressed').catch(() => null);
  o.pinnedAtStart = await isPinned(); o.start = await kStart(p, 'Board View', s.q); await toColumn(p, ANA.staff_id).catch(() => {});
  // step 1: the card by keyboard (Search > Tab > arrows), ring, and More actions shows without hovering
  await clickSearch(p); o.s1 = { tab: await kTabIn(p, 'board', N) }; o.s1.arrows = await kArrowsTo(p, (f) => f.raw === 'board_card_Alpha Co', 'board', N);
  await p.mouse.move(1, 1); await p.waitForTimeout(600); o.s1.focus = await kz(p, N); o.s1.moreActionsWithoutHover = await kMore(p, id); await shot(p, 'C368151-s1-card-focus');
  // step 2: Tab to More actions; Enter, Escape; Space, Escape - focus read after each
  o.s2 = { tab: await kp(p, 'Tab', N) }; await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s2.enter = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368151-s2-menu-enter');
  o.s2.escape1 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) };
  await p.keyboard.press('Space'); await p.waitForTimeout(1000); o.s2.space = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368151-s2-menu-space');
  o.s2.escape2 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) }; await shot(p, 'C368151-s2-after-escape');
  // step 3: arrow keys to A's column header (Shift+Tab back to the card first, then ArrowUp), Tab to its pin, Enter
  o.s3 = { back: kshort(await kp(p, 'Shift+Tab', N)) }; o.s3.toHeader = await kArrowsTo(p, (f) => /^board_column_header_Ana$/.test(f.raw) || (f.header === 'board_column_header_Ana' && !/pin/i.test(f.raw)), 'board', N);
  const tp = await keyUntil(p, (f) => f.raw === `button_board_pin_${ANA.staff_id}`, 6, 'Tab', N); o.s3.tabToPin = { found: tp.found, stops: tp.seen };
  if (tp.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1800); o.s3.afterEnter = { pinnedSaved: await isPinned(), pinPressed: await pinBtn(), focus: kshort(await kz(p, N)) }; }
  await shot(p, 'C368151-s3-after-enter-pin');
  // step 4: focus kept on the pin, Space
  o.s4 = { focusBefore: kshort(await kz(p, N)) }; await p.keyboard.press('Space'); await p.waitForTimeout(1800); o.s4.pinnedSaved = await isPinned(); o.s4.pinPressed = await pinBtn(); o.s4.focusAfter = kshort(await kz(p, N)); await shot(p, 'C368151-s4-after-space');
  if (await isPinned()) { await pins([BEN.staff_id]); o.unpinnedByScript = true; }
  // step 5: Tech View (mouse), set-up by mouse: Assigned Techs on and A's group expanded; then keyboard to A's group header, Tab to its arrow, Enter
  await display(p, 'Tech View'); await p.waitForTimeout(2500);
  await p.locator('[data-test-id="button_tech_view_column_selection"]').click().catch(() => {}); await p.waitForTimeout(1200);
  { // 22 Oct 2026 (production): the menu item was not found by its text; use the switch's own id (the toggle_tech_view_column_* convention)
    const at = p.locator('[data-test-id="toggle_tech_view_column_assigned_techs"]').first(); const sw = at.locator('[role=switch], [role=checkbox], [aria-checked]').first();
    o.assignedTechsWasOn = (await sw.getAttribute('aria-checked').catch(() => null)) ?? (await at.getAttribute('aria-checked').catch(() => null)); o.assignedTechsToggle = await at.count();
    if (o.assignedTechsToggle && o.assignedTechsWasOn !== 'true') { await at.click(); await p.waitForTimeout(1500); o.assignedTechsNow = (await sw.getAttribute('aria-checked').catch(() => null)) ?? (await at.getAttribute('aria-checked').catch(() => null)); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  o.rowGroup = await findRow(p, id, ANA.staff_id); // L0402: A's group may sit lower down
  const collapsed = () => p.evaluate(`(document.querySelector('[data-test-id="tech_view_group_${ANA.staff_id}"]') || { getAttribute: () => 'no group' }).getAttribute('data-collapsed')`) as Promise<string | null>;
  const rowsIn = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(e => e.getAttribute('data-group-key') === ${JSON.stringify(ANA.staff_id)} && e.getBoundingClientRect().height > 0).length`) as Promise<number>;
  await clickSearch(p); o.s5 = { tab: await kTabIn(p, 'table', N) }; o.s5.toHeader = await kArrowsTo(p, (f) => f.group === 'tech_view_group_Ana' && !f.row, 'table', N, ['ArrowUp', 'ArrowDown']);   // 22 Oct 2026: the header is above the row - Up first, as the step says
  const tg = await keyUntil(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`, 6, 'Tab', N); o.s5.tabToArrow = { found: tg.found, stops: tg.seen };
  if (tg.found) { o.s5.before = { collapsed: await collapsed(), rows: await rowsIn() }; await p.keyboard.press('Enter'); await p.waitForTimeout(1600); o.s5.after = { collapsed: await collapsed(), rows: await rowsIn(), focus: kshort(await kz(p, N)) }; }
  await shot(p, 'C368151-s5-after-enter-collapse');
  // step 6: focus kept on the arrow, Space
  o.s6 = { focusBefore: kshort(await kz(p, N)) }; await p.keyboard.press('Space'); await p.waitForTimeout(1600); o.s6.collapsed = await collapsed(); o.s6.rows = await rowsIn(); o.s6.focusAfter = kshort(await kz(p, N)); await shot(p, 'C368151-s6-after-space');
  // step 7: arrows to the row (Shift+Tab back to the header, then ArrowDown), Tab to an Assigned Techs avatar, read the name it shows
  o.s7 = { back: kshort(await kp(p, 'Shift+Tab', N)) }; o.s7.toRow = await kArrowsTo(p, (f) => f.row === 'tech_view_row_Alpha Co' && f.raw === 'tech_view_row_Alpha Co', 'table', N);
  const assignedCol = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).findIndex(h => /^Assigned Techs/i.test(h))`) as number; o.s7.assignedTechsColumnIndex = assignedCol;
  const inAssigned = `(function () { var e = document.activeElement; var r = e && e.closest('[data-test-id="tech_view_row_${id}"]'); var td = e && e.closest('td'); return !!r && !!td && [...td.parentElement.children].indexOf(td) === ${assignedCol}; })()`;
  const inRow = `!!(document.activeElement && document.activeElement.closest('[data-test-id="tech_view_row_${id}"]'))`;
  const av = await keyUntil(p, async (f) => ((await p.evaluate(inAssigned)) as boolean) || (/avatar/i.test(f.raw + ' ' + f.cls + ' ' + (f.label ?? '')) && (await p.evaluate(inRow)) as boolean), 30, 'Tab', N); o.s7.tabToAvatar = { found: av.found, stops: av.seen };
  await p.mouse.move(1, 1); await p.waitForTimeout(1200);
  o.s7.focus = await kz(p, N); o.s7.nameShown = { tooltips: await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`), label: o.s7.focus.label, title: o.s7.focus.title, text: o.s7.focus.text, expected: 'ZZAUTOTEST Ana Alpha' };
  await shot(p, 'C368151-s7-avatar-focus');
  // step 8: Column Selection by keyboard: focus it, Enter, Tab into the options, Escape (focus must come back to it)
  let cs = await keyUntil(p, (f) => f.raw === 'button_tech_view_column_selection', 40, 'Shift+Tab', N); o.s8 = { reach: { by: 'Shift+Tab', found: cs.found, stops: cs.seen.slice(-10) } };
  if (!cs.found) { cs = await keyUntil(p, (f) => f.raw === 'button_tech_view_column_selection', 60, 'Tab', N); o.s8.reach = { by: 'Tab', found: cs.found, stops: cs.seen.slice(-10) }; }
  if (cs.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.s8.menuOpenAfterEnter = await menuOpen(p); const fIn = await kp(p, 'Tab', N); o.s8.afterTab = { ...fIn, insideMenu: await p.evaluate(`!!(document.activeElement && document.activeElement.closest('.q-menu'))`) }; await shot(p, 'C368151-s8-column-selection-open');
    const fe = await kp(p, 'Escape', N); await p.waitForTimeout(700); o.s8.afterEscape = { menusOpen: await menuOpen(p), focus: kshort(fe), backOnColumnSelection: (await kz(p, N)).raw === 'button_tech_view_column_selection' }; await shot(p, 'C368151-s8-after-escape'); }
  // step 9: Status by keyboard: focus the chip, Enter, arrows to Approved, Enter (Space if Enter did not tick it), Escape; then its x, Enter
  // FIX-UP 2 (17 Oct 2026): on 16 Oct Tab started from the top menu and, once the Status options were open, 15 ArrowDown presses read
  // document.activeElement as an anonymous DIV every time — the options list moves a HIGHLIGHT (q-manual-focusable--focused /
  // aria-activedescendant), not the browser focus — so "Approved" was never recognised and nothing was ticked. Now: focus starts in the
  // page body (a click on a neutral spot in the board area, then blur), Tab moves to the Status chip, and inside the open options each
  // key (ArrowDown, then Tab if ArrowDown highlights nothing) is followed by a reading of BOTH document.activeElement and the highlighted
  // option; the "Approved" option counts as reached when either names it. Every key's reading is logged in s9.keys.
  const neutralSpot = async () => { for (const [x, y] of [[800, 600], [1200, 700], [400, 800], [1590, 990]] as const) { const ok = await p.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); return !!e && !e.closest('button, a, input, textarea, [role=button], .q-btn, .q-field, [data-test-id^="board_card_"], [data-test-id^="tech_view_row_"], [data-test-id^="board_column_header"], [data-test-id^="tech_view_group_"], .q-menu'); })()`).catch(() => false); if (ok) return { x, y }; } return null; };
  const ns = await neutralSpot(); o.s9pre = { neutral: ns }; if (ns) await p.mouse.click(ns.x, ns.y).catch(() => {}); await p.evaluate(`(() => { const e = document.activeElement; if (e && e !== document.body && e.blur) e.blur(); })()`).catch(() => {}); await p.mouse.move(1, 1);
  o.s9pre.activeAfterClear = (await kz(p, N)).raw;
  let sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 30, 'Tab', N); o.s9 = { reach: { by: 'Tab from the page body', found: sc.found, stops: sc.seen } };
  if (!sc.found) { sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 60, 'Shift+Tab', N); o.s9.reach = { by: 'Shift+Tab', found: sc.found, stops: sc.seen }; }
  const chipText = () => p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  o.s9.chipAtStart = await chipText();
  const optState = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const ae = document.activeElement;
    const clean = (x) => String(x || '').replace(/\\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check)\\s+/i, '').trim();
    const hi = m ? [...m.querySelectorAll('.q-item, [role=option], [role=checkbox]')].find(e => e.classList.contains('q-manual-focusable--focused') || e.classList.contains('q-item--focused') || e === ae || e.contains(ae) && ae !== m) : null;
    const ad = ae && ae.getAttribute('aria-activedescendant'); const adEl = ad ? document.getElementById(ad) : null;
    return { active: ae ? (ae.getAttribute('data-test-id') || ae.tagName) + ' ' + clean(ae.innerText || ae.getAttribute('aria-label')).slice(0, 30) : 'none', inMenu: !!(ae && m && m.contains(ae)), highlighted: hi ? clean(hi.innerText).slice(0, 30) : (adEl ? clean(adEl.innerText).slice(0, 30) : null), ticked: m ? [...m.querySelectorAll('.q-item, [role=option], [role=checkbox]')].filter(e => e.querySelector('.q-checkbox__inner--truthy, [aria-checked=true]') || e.getAttribute('aria-checked') === 'true').map(e => clean(e.innerText).slice(0, 20)) : [] }; })()`).catch(() => null) as Promise<any>;
  if (sc.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s9.optionsOpen = await menuOpen(p); o.s9.keys = [{ key: 'Enter (open)', ...(await optState()) }];
    let reached = false;
    for (const key of ['ArrowDown', 'Tab']) { for (let i = 0; i < 12 && !reached; i++) { await p.keyboard.press(key); await p.waitForTimeout(300); const st = await optState(); o.s9.keys.push({ key, ...st }); if (/^Approved$/i.test(String(st?.highlighted)) || /\bApproved$/i.test(String(st?.active))) reached = true; if (!st?.highlighted && !st?.inMenu && key === 'ArrowDown' && i >= 3) break; } if (reached) break; }
    o.s9.toApproved = { found: reached, by: o.s9.keys[o.s9.keys.length - 1]?.key };
    if (reached) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s9.afterEnter = { chip: await chipText(), ...(await optState()) }; if (!(o.s9.afterEnter.ticked ?? []).some((x: string) => /Approved/i.test(x))) { await p.keyboard.press('Space'); await p.waitForTimeout(1500); o.s9.afterSpace = { chip: await chipText(), ...(await optState()) }; } }
    o.s9.chipAfterEnter = await chipText();
    await shot(p, 'C368151-s9-approved-ticked'); const ce = await kp(p, 'Escape', N); await p.waitForTimeout(700); o.s9.closed = { menusOpen: await menuOpen(p), focus: kshort(ce), chip: await chipText() }; }
  const xs = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c && (/remove|clear|cancel|close/i.test((e.getAttribute('aria-label') || '') + ' ' + e.className + ' ' + (e.textContent || ''))); })()`) as Promise<boolean>, 6, 'Tab', N);
  o.s9.toX = { by: 'Tab', found: xs.found, stops: xs.seen };
  if (!xs.found) { const xb = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c; })()`) as Promise<boolean>, 30, 'Shift+Tab', N); o.s9.toX = { by: 'Shift+Tab (Tab did not reach it)', found: xb.found, stops: xb.seen.slice(-10) }; }
  if (o.s9.toX.found) { o.s9.xFocus = await kz(p, N); await p.keyboard.press('Enter'); await p.waitForTimeout(1800); }
  o.s9.chipAfterX = await chipText(); await p.keyboard.press('Escape').catch(() => {}); await shot(p, 'C368151-s9-after-x');
  // step 10: the Board View switcher by keyboard, Enter
  let bv = await keyUntil(p, (f) => f.label === 'Board View', 40, 'Shift+Tab', N); o.s10 = { reach: { by: 'Shift+Tab', found: bv.found, stops: bv.seen.slice(-8) } };
  if (!bv.found) { bv = await keyUntil(p, (f) => f.label === 'Board View', 60, 'Tab', N); o.s10.reach = { by: 'Tab', found: bv.found, stops: bv.seen.slice(-8) }; }
  if (bv.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(2500); }
  o.s10.active = await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`); await shot(p, 'C368151-s10-after-enter');
  await statusOnly(null).catch(() => {});
});

await run('C368152', async () => {
  // 16 Oct 2026: follows the case as rewritten (Work-order-2 is now led by Technician-B and is the one Unassigned; the menu items are read
  // on Work-order-1; the old "no key moves Work-order-2" step is gone). WO-1 Alpha Co (A = Ana), WO-2 Bravo Co (B = Ben), WO-3 Golf Co (none).
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reassign', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const id = s.w['Alpha Co'].id, id2 = s.w['Bravo Co'].id; const N = nm(s);
  const o: any = (R.C368152 = { prefs: await kPrefs([ANA.staff_id, BEN.staff_id]) });
  const colName = async (w: string) => (await colOf(p, w)).replace(BEN.staff_id, 'Technician-B').replace(ANA.staff_id, 'Technician-A');
  o.start = { ...(await kStart(p, 'Board View', s.q)), wo1Column: await colName(id), wo2Column: await colName(id2) };
  o.s1 = await kSearch(p, N); await shot(p, 'C368152-s1-search');
  o.s2 = await kTabIn(p, 'board', N); await p.mouse.move(1, 1); await shot(p, 'C368152-s2-tab-card');
  o.s3 = await kArrowsTo(p, (f) => f.raw === 'board_card_Alpha Co', 'board', N); await shot(p, 'C368152-s3-arrows-wo1');
  o.s4 = await kp(p, 'Tab', N); await p.mouse.move(1, 1); await p.waitForTimeout(500); o.s4.onOwnMoreActions = /more_actions/.test(o.s4.raw) && o.s4.card === 'board_card_Alpha Co'; o.s4.moreShows = await kMore(p, id); await shot(p, 'C368152-s4-more-actions');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s5 = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368152-s5-menu');
  o.s6 = await kMenuChoose(p, /Reassign lead technician/i); o.s6.dialog = await p.locator('.q-dialog').count(); o.s6.title = await p.locator('.q-dialog').first().innerText().then((x) => x.replace(/\s+/g, ' ').slice(0, 80)).catch(() => null); await shot(p, 'C368152-s6-dialog');
  if (o.s6.dialog) { const d = await kDialogPick(p, 'ZZAUTOTEST Be', BEN.staff_id, 'Technician-B (Ben Bravo, this run)');
    o.s7 = { typed: 'ZZAUTOTEST Be', boxHolds: d.boxHolds, rows: d.rows, rowIds: d.rowIsTarget }; o.s8 = { route: d.route, reachedPerson: d.reachedPerson, stops: d.stops, confirm: d.confirm, shifts: d.shifts, messages: d.messages, dialogsLeft: d.dialogsLeft };
    await p.waitForTimeout(1500); o.s8.wo1Column = await colName(id); o.s8.lead = await leadOf(s, 'Alpha Co'); await shot(p, 'C368152-s8-after-reassign'); }
  // step 9: arrows from wherever focus is now to Work-order-2's card (the focus before the first arrow is kept: it says whether focus stayed on the board)
  o.s9 = { focusBefore: kshort(await kz(p, N)) }; Object.assign(o.s9, await kArrowsTo(p, (f) => f.raw === 'board_card_Bravo Co', 'board', N));
  if (!o.s9.reached) { o.s9.note = 'arrows alone did not reach Work-order-2 from where focus was; re-entered by Search > Tab, then arrows (recorded separately)'; await clickSearch(p); o.s9.reentry = await kTabIn(p, 'board', N); o.s9.reentryArrows = await kArrowsTo(p, (f) => f.raw === 'board_card_Bravo Co', 'board', N); }
  await p.mouse.move(1, 1); await shot(p, 'C368152-s9-arrows-wo2');
  o.s10 = await kp(p, 'Tab', N); o.s10.onOwnMoreActions = /more_actions/.test(o.s10.raw) && o.s10.card === 'board_card_Bravo Co'; await shot(p, 'C368152-s10-more-actions');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s11 = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368152-s11-menu');
  o.s12 = await kMenuChoose(p, /^Unassign/i); o.s12.shifts = await keepShiftsKbd(p); o.s12.messages = await toastsOn(p); await p.waitForTimeout(1500); o.s12.wo2Column = await colName(id2); o.s12.lead = await leadOf(s, 'Bravo Co'); await shot(p, 'C368152-s12-after-unassign');
});

await run('C97020', async () => {
  // 16 Oct 2026: follows the case as rewritten (PRD v61: the card is reached by Search > Tab > arrow keys; Tab to More actions; Space and
  // Shift+each arrow only - plain arrows now move focus by design; a reading at each of the 16 steps). WO-1 Alpha Co (Approved), WO-2 Bravo Co
  // (Invoiced), both led by Technician-A (Ana), pinned for both users. Steps 1-6 as the view-only User-B, steps 7-16 as the Admin runner.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Limits', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }]); const N = nm(s); const id1 = s.w['Alpha Co'].id, id2 = s.w['Bravo Co'].id;
  const o: any = (R.C97020 = { statuses: (await workOrders(a, s.q)).map((w: any) => `${nameOf(s)(w.number)} ${w.status}`) });
  // 15 Oct 2026 (kept): the view-only role must be Work orders > View only before the viewer part (C97012 may have left Create & Edit on)
  { const rr = (await a.get(`/api/roles/${VIEW_ROLE}`)).body?.data; const code = (x: any) => String(x?.code ?? x?.name ?? x);
    const extra = ((rr?.fe_permissions ?? []) as any[]).filter((x) => /^workOrders/.test(code(x)) && !/^workOrdersView$/.test(code(x)));
    if (extra.length) o.roleFixedAtStart = say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: rr.name, description: rr.description, view_mode: rr.view_mode, template_id: rr.template_id, fe_permissions: ((rr.fe_permissions ?? []) as any[]).filter((x) => !extra.includes(x)).map((x) => x.id), cross_toggles: rr.cross_toggles }));
    o.roleWorkOrderPermsBeforeViewer = (((await a.get(`/api/roles/${VIEW_ROLE}`)).body?.data?.fe_permissions ?? []) as any[]).map(code).filter((c) => /^workOrders/.test(c)); }
  const place = async (pg: Page, w: string) => (await colOf(pg, w)).replace(ANA.staff_id, 'Technician-A').replace(BEN.staff_id, 'Technician-B');
  const viewer = await mkUser('ZZAUTOTEST', `KbdViewer ${stamp}`, VIEW_ROLE, 'kbdviewer'); const v = await asUser(viewer);
  try { const pg = v.page; o.viewerPins = (await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id], filters: {} } }).catch(() => ({ status: 0 }))).status;
    o.viewerStart = await kStart(pg, 'Board View', s.q);
    { const st: any = await api(pg).get('/api/switch-user').catch(() => null); const perms = (st?.body?.data?.role?.fePermissions ?? []).map((x: any) => x.name); o.viewerRole = { name: st?.body?.data?.role?.name ?? null, count: perms.length, workOrderPerms: perms.filter((n: string) => /^wo|work/i.test(n)) }; }
    o.s1 = await kSearch(pg, N); await shot(pg, 'C97020-s1-viewer-search');
    o.s2 = await kTabIn(pg, 'board', N); await pg.mouse.move(1, 1); await shot(pg, 'C97020-s2-viewer-tab');
    o.s3 = await kArrowsTo(pg, (f) => f.raw === 'board_card_Alpha Co', 'board', N); await shot(pg, 'C97020-s3-viewer-arrows');
    o.s4 = await kp(pg, 'Tab', N); o.s4.cardHasMoreActions = await pg.locator(`[data-test-id="board_card_${id1}"] [data-test-id="button_work_order_more_actions"]`).count(); o.s4.onMoreActions = /more_actions/.test(o.s4.raw) && o.s4.card === 'board_card_Alpha Co'; o.s4.leftBoard = o.s4.where !== 'board'; await shot(pg, 'C97020-s4-viewer-tab');
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200);
    o.s5 = { menusOpen: await menuOpen(pg), items: await menuItems(pg), dialogs: await pg.locator('.q-dialog').count(), url: clean(pg.url().replace(APP, '')) }; await shot(pg, 'C97020-s5-viewer-enter');
    if (o.s5.menusOpen && (o.s5.items as string[]).some((x) => /Reassign lead technician/i.test(x))) { const c = await kMenuChoose(pg, /Reassign lead technician/i); o.s5.choose = { ...c, dialogAfter: await pg.locator('.q-dialog').count(), messages: await toastsOn(pg) }; await shot(pg, 'C97020-s5-viewer-item-enter'); }
    for (let i = 0; i < 3 && ((await pg.locator('.q-dialog, .q-menu').count()) > 0); i++) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); }
    if (/\/workorders\/[0-9a-f-]{36}/.test(pg.url())) { o.s5.openedAPage = clean(pg.url().replace(APP, '')); await pg.goBack(); await pg.waitForTimeout(3500); }
    o.s6 = { focusBefore: kshort(await kz(pg, N)), before: await place(pg, id1), keys: {} as any };
    for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { const f = await kp(pg, k, N); await pg.waitForTimeout(700); o.s6.keys[k] = { focus: kshort(f), wo1: await place(pg, id1), opened: /\/workorders\/[0-9a-f-]{36}/.test(pg.url()), menusOrDialogs: await pg.locator('.q-dialog, .q-menu').count() }; if (o.s6.keys[k].opened) { await pg.goBack(); await pg.waitForTimeout(3500); } }
    // extra reading (not a case step): the same keys with focus placed ON Work-order-1's card, so "no key moves it" is read with the card focused
    await clickSearch(pg); await kTabIn(pg, 'board', N); const onCard = await kArrowsTo(pg, (f) => f.raw === 'board_card_Alpha Co', 'board', N); o.s6.extraOnCard = { reached: onCard.reached, keys: {} as any };
    if (onCard.reached) for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { const f = await kp(pg, k, N); await pg.waitForTimeout(700); o.s6.extraOnCard.keys[k] = { focus: kshort(f), wo1: await place(pg, id1) }; if (/\/workorders\/[0-9a-f-]{36}/.test(pg.url())) { await pg.goBack(); await pg.waitForTimeout(3500); } }
    o.s6.after = { wo1: await place(pg, id1), lead: await leadOf(s, 'Alpha Co') }; await shot(pg, 'C97020-s6-viewer-after-keys');
  } finally { await v.close(); }
  // steps 7-16: the Admin (runner)
  o.adminStart = await kStart(p, 'Board View', s.q);
  o.s7 = await kSearch(p, N); await shot(p, 'C97020-s7-admin-search');
  o.s8 = await kTabIn(p, 'board', N); await p.mouse.move(1, 1); await shot(p, 'C97020-s8-admin-tab');
  o.s9 = await kArrowsTo(p, (f) => f.raw === 'board_card_Bravo Co', 'board', N); await shot(p, 'C97020-s9-admin-arrows');
  o.s10 = await kp(p, 'Tab', N); await p.mouse.move(1, 1); await p.waitForTimeout(500); o.s10.onOwnMoreActions = /more_actions/.test(o.s10.raw) && o.s10.card === 'board_card_Bravo Co'; o.s10.moreShows = await kMore(p, id2); await shot(p, 'C97020-s10-admin-more');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s11 = { menusOpen: await menuOpen(p), items: await menuItems(p) };
  o.s11.reassignItemText = await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => /Reassign lead technician/i.test(e.innerText)).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => null);
  o.s11.noteExpected = 'The lead technician can’t be changed once a work order is Invoiced or Paid.'; await shot(p, 'C97020-s11-menu');
  const r12 = await keyUntil(p, (f) => /Reassign lead technician/i.test(f.text), 10, 'ArrowDown', N); await p.waitForTimeout(900);
  o.s12 = { reachedItem: r12.found, stops: r12.seen, tooltipsOnFocus: await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) };
  o.s11.noteShown = [...((o.s11.reassignItemText ?? []) as string[]), ...(o.s12.tooltipsOnFocus as string[])].some((x) => x.includes('can’t be changed once a work order is Invoiced or Paid') || x.includes("can't be changed once a work order is Invoiced or Paid"));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s12.dialogs = await p.locator('.q-dialog').count(); o.s12.messages = await toastsOn(p); await shot(p, 'C97020-s12-after-enter');
  if (o.s12.dialogs) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
  o.s13 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) }; await shot(p, 'C97020-s13-after-escape');
  o.s14 = { before: await place(p, id2), keys: {} as any };
  for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { const f = await kp(p, k, N); await p.waitForTimeout(700); o.s14.keys[k] = { focus: kshort(f), wo2: await place(p, id2), menusOrDialogs: await p.locator('.q-dialog, .q-menu').count(), opened: /\/workorders\/[0-9a-f-]{36}/.test(p.url()) };
    if (o.s14.keys[k].menusOrDialogs) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); } if (o.s14.keys[k].opened) { await p.goBack(); await p.waitForTimeout(3500); } }
  o.s14.lead = await leadOf(s, 'Bravo Co'); await shot(p, 'C97020-s14-after-keys');
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4500); if (!(await p.locator(`[data-test-id="board_card_${id2}"]`).count())) await ensure(`[data-test-id="board_card_${id2}"]`, s.q);
  o.s15 = { wo2: await place(p, id2), searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) }; await shot(p, 'C97020-s15-after-refresh');
  const cb = await p.locator(`[data-test-id="board_card_${id2}"] [data-test-id="board_card_number"]`).first().boundingBox().catch(() => null);
  if (cb) { await p.mouse.click(cb.x + Math.min(cb.width / 2, 30), cb.y + cb.height / 2); await p.waitForTimeout(4000); }
  o.s16 = { url: clean(p.url().replace(APP, '')), openedWorkOrder2: p.url().includes(id2) }; await shot(p, 'C97020-s16-wo-page');
  o.s16.leadOnPage = await woPageLead(p, APP, id2); o.s16.leadOnRecord = await leadOf(s, 'Bravo Co'); o.s16.expectedLead = 'ZZAUTOTEST Ana Alpha';
  o.runnerRole = 'Admin (ZZ WOB Runner, runner.mts)';
});

await run('C97022', async () => {
  // 16 Oct 2026: follows the case as rewritten (7 steps; NEW step 7: keyboard navigation continues from the header without losing focus).
  // Two Approved work orders (Alpha Co, Bravo Co) led by Technician-A (Ana). Steps 1-3 need nothing more. Steps 4-7 need the Technician
  // filter: when the board offers it they are run (focus after each reassign, then one more key from A's header - ArrowDown and Tab - read
  // for a visible, not-lost focus); when it does not, the filter bar is read (the other filters are the positive control) and steps 4-7
  // stay Blocked by SV-11326 (read its status live before reporting, Rule 112).
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Focus Kept', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }]); const N = nm(s);
  const o: any = (R.C97022 = { prefs: await kPrefs([ANA.staff_id, BEN.staff_id]) });
  o.start = await kStart(p, 'Board View', s.q); o.anaColumn = await colCards(p, ANA.staff_id, s); const firstCo = o.anaColumn[0] ?? 'Alpha Co'; const firstId = s.w[firstCo].id;
  // step 1: keyboard to the first card in A's column, ring; Tab to its More actions, ring
  await clickSearch(p); o.s1 = { tab: await kTabIn(p, 'board', N) }; o.s1.arrows = await kArrowsTo(p, (f) => f.raw === `board_card_${firstCo}`, 'board', N); o.s1.cardFocus = await kz(p, N);
  o.s1.more = await kp(p, 'Tab', N); o.s1.onOwnMore = /more_actions/.test(o.s1.more.raw) && o.s1.more.card === `board_card_${firstCo}`; await p.mouse.move(1, 1); await shot(p, 'C97022-s1-more-focus');
  // step 2: Enter, Escape: menu closed, focus back on the same More actions
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s2 = { menusOpen: await menuOpen(p) }; const e2 = await kp(p, 'Escape', N); await p.waitForTimeout(600);
  o.s2.afterEscape = { menusOpen: await menuOpen(p), focus: kshort(e2), backOnOpener: /more_actions/.test(e2.raw) && e2.card === `board_card_${firstCo}`, ring: e2.ring }; await shot(p, 'C97022-s2-after-escape');
  // step 3: menu again, Reassign by arrows + Enter, Escape the dialog: no reassignment, focus back on the opener
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s3 = await kMenuChoose(p, /Reassign lead technician/i); o.s3.dialog = await p.locator('.q-dialog').count(); await shot(p, 'C97022-s3-dialog');
  const e3 = await kp(p, 'Escape', N); await p.waitForTimeout(900); o.s3.afterEscape = { dialogs: await p.locator('.q-dialog').count(), focus: kshort(e3), backOnOpener: /more_actions/.test(e3.raw) && e3.card === `board_card_${firstCo}`, ring: e3.ring, lead: await leadOf(s, firstCo) }; await shot(p, 'C97022-s3-after-escape');
  // step 4: Technician = A (mouse allowed for applying the filter)
  o.s4 = { filterChips: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) };
  o.s4.technicianFilter = await techChip(p).count(); await shot(p, 'C97022-s4-filter-bar');
  if (!o.s4.technicianFilter) { o.s4.blocked = 'no Technician filter on this board (SV-11326); the other filter chips above are the positive control that the bar was read'; return; }
  await techChip(p).click(); await p.waitForTimeout(1200);
  { let it = p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /ZZAUTOTEST Ana Alpha/ }).first();
    for (let i = 0; i < 80 && !(await it.count()); i++) { const mv = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false); await p.waitForTimeout(250); if (!mv) break; it = p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: /ZZAUTOTEST Ana Alpha/ }).first(); }
    o.s4.optionFound = await it.count(); if (o.s4.optionFound) { await it.click(); await p.waitForTimeout(1500); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  o.s4.chip = await techChip(p).innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  o.s4.columns = (await boardCols(p)).map((c) => `${N(c.id)}(${c.count}) [${c.cards.map(nameOf(s)).join(', ')}]`);
  await clickSearch(p); o.s4.tab = await kTabIn(p, 'board', N); o.s4.arrows = await kArrowsTo(p, (f) => f.column === 'Ana' && /^board_card_/.test(f.raw), 'board', N); o.s4.focus = await kz(p, N); await p.mouse.move(1, 1); await shot(p, 'C97022-s4-first-card');
  const reassignFocused = async (tag: string) => { const r: any = { card: (await kz(p, N)).card }; r.more = kshort(await kp(p, 'Tab', N)); await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
    r.choose = await kMenuChoose(p, /Reassign lead technician/i); if (await p.locator('.q-dialog').count()) r.dialog = await kDialogPick(p, 'ZZAUTOTEST Be', BEN.staff_id, 'Technician-B (Ben Bravo, this run)');
    await p.waitForTimeout(2500); r.focusAfter = await kz(p, N); r.columns = (await boardCols(p)).map((c) => `${N(c.id)}(${c.count}) [${c.cards.map(nameOf(s)).join(', ')}]`); await shot(p, `C97022-${tag}`); return r; };
  // step 5: reassign the focused card to B: it leaves, focus moves to the next card in A's column, visible
  o.s5 = await reassignFocused('s5-after-first-reassign'); o.s5.focusOnNextCardInA = o.s5.focusAfter.column === 'Ana' && /^board_card_/.test(o.s5.focusAfter.raw) && o.s5.focusAfter.raw !== o.s5.card; o.s5.ring = o.s5.focusAfter.ring;
  // step 6: reassign the remaining card: focus moves to A's column header, visible
  if (/^board_card_/.test(o.s5.focusAfter.raw)) { o.s6 = await reassignFocused('s6-after-second-reassign'); o.s6.focusOnAHeader = /^board_column_header_Ana$/.test(o.s6.focusAfter.raw) || (o.s6.focusAfter.header === 'board_column_header_Ana'); o.s6.ring = o.s6.focusAfter.ring; }
  else o.s6 = { skipped: 'focus was not on a card after step 5, so the remaining card was not reassigned by keyboard', focusAfterStep5: kshort(o.s5.focusAfter) };
  // step 7: one more key from the header - ArrowDown, then Tab - focus visible, not lost (not the page body) and not trapped
  o.s7 = { arrowDown: await kp(p, 'ArrowDown', N) }; o.s7.tab = await kp(p, 'Tab', N); o.s7.shiftTab = await kp(p, 'Shift+Tab', N);
  o.s7.notLost = ![o.s7.arrowDown, o.s7.tab, o.s7.shiftTab].some((f: any) => f.raw === 'body'); o.s7.notTrapped = o.s7.tab.raw !== o.s7.arrowDown.raw || o.s7.tab.where !== o.s7.arrowDown.where; await shot(p, 'C97022-s7-after-keys');
  o.leads = { [firstCo]: await leadOf(s, firstCo), other: await leadOf(s, firstCo === 'Alpha Co' ? 'Bravo Co' : 'Alpha Co') };
  await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await p.waitForTimeout(1200);
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'kbd-fix4.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
