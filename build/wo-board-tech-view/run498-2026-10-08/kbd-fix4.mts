/** FIX 4 (2026-10-09): C368151 also looks for the group's arrow button by Tab and tries Space / Left / Right on the row;
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
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups, woPageLead } from './wob.mts';
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
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 'kbd-fix4.json'), JSON.stringify(R, null, 1));
}
const IDS = { Ana: ANA.staff_id, Ben: BEN.staff_id, Cal: CAL.staff_id, Dan: DAN.staff_id };


const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
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

await run('C97021', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  // 16 Oct 2026: Tab ONLY now (S11-R3: Tab and Shift+Tab move through cards, rows and headers in on-screen order, with a focus ring)
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reach', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const o: any = {}; const N = nm(s);
  await goP(p, 'Board View', s.q); o.boardCards = (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_card_"]')].map(e => e.getAttribute('data-test-id')).filter(t => /^board_card_[0-9a-f-]{36}$/.test(t))`) as string[]).map(N);
  o.boardColumns = (await colsOf(p)).length; await clickSearch(p);
  const first = await keyUntil(p, (f) => /^board_card_/.test(f.raw), 40, 'Tab', N); o.s5_firstCard = { found: first.found, presses: first.presses, focus: first.f ? { ...first.f, raw: N(first.f.raw) } : null };
  await shot(p, 'C97021-s5-board-first-card-focus');
  o.s6_tabStops = (await keyUntil(p, () => false, 25, 'Tab', N)).seen; await shot(p, 'C97021-s6-board-after-tabs');
  o.s7_shiftTabStops = (await keyUntil(p, () => false, 12, 'Shift+Tab', N)).seen;
  o.s6_cardsReachedByTab = o.boardCards.filter((c: string) => [first.f?.raw ? N(first.f.raw) : '', ...o.s6_tabStops, ...o.s7_shiftTabStops].some((x: string) => x.startsWith(c)));
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p).catch(() => {});
  o.techRows = (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].map(e => e.getAttribute('data-test-id'))`) as string[]).map(N);
  await clickSearch(p); const fr = await keyUntil(p, (f) => /^tech_view_(row|group)_/.test(f.raw), 40, 'Tab', N);
  o.s9_first = { found: fr.found, presses: fr.presses, focus: fr.f ? { ...fr.f, raw: N(fr.f.raw) } : null }; await shot(p, 'C97021-s9-tech-first-focus');
  o.s10_tabStops = (await keyUntil(p, () => false, 25, 'Tab', N)).seen; await shot(p, 'C97021-s10-tech-after-tabs');
  o.s10_rowsReachedByTab = o.techRows.filter((r: string) => [fr.f?.raw ? N(fr.f.raw) : '', ...o.s10_tabStops].some((x: string) => x.startsWith(r)));
  R.C97021 = o; });

await run('C368150', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  // 16 Oct 2026: steps as rewritten — Enter opens; Alt+Left back; Space/arrows/Shift+arrows move nothing and no "Lead technician updated"
  // message; Enter on the Tech View row; NEW step 13: one plain mouse click on the row opens the work order.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Enter Opens', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const id = s.w['Alpha Co'].id; const o: any = {};
  const isWo = () => /\/workorders\/[0-9a-f-]{36}/.test(p.url()); const u = () => clean(p.url().replace(APP, ''));
  await goP(p, 'Board View', s.q); o.s5 = await cardFocus(p, `board_card_${id}`); await shot(p, 'C368150-s5-card-focus');
  await p.keyboard.press('Enter'); await p.waitForTimeout(3500); o.s6_enter = { url: u(), openedAlpha: p.url().includes(id) }; await shot(p, 'C368150-s6-after-enter');
  await p.keyboard.press('Alt+ArrowLeft'); await p.waitForTimeout(4000); o.s7_back = u();
  if (isWo()) { await p.goBack().catch(() => {}); await p.waitForTimeout(3500); o.s7_backNeededGoBack = true; }
  if (!/workorders/.test(p.url()) || !(await p.locator(`[data-test-id="board_card_${id}"]`).count())) await goP(p, 'Board View', s.q);
  o.s8 = await cardFocus(p, `board_card_${id}`); const before = await colCards(p, ANA.staff_id, s); o.s9_keys = {};
  for (const k of ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) {
    await p.keyboard.press(k); await p.waitForTimeout(900); const tt = await toastsOn(p);
    o.s9_keys[k] = { page: isWo() ? 'work order opened' : 'board', alphaColumn: N2(await colOf(p, id)), focus: clean((await fx(p)).raw), message: tt.filter((x) => /lead technician/i.test(x)) };
    if (isWo()) { await p.goBack(); await p.waitForTimeout(3500); }
    if (!/^board_card_/.test((await fx(p)).raw) || (await fx(p)).raw !== `board_card_${id}`) { await cardFocus(p, `board_card_${id}`); } }
  o.s9_after = { anaColumn: await colCards(p, ANA.staff_id, s), before, lead: await leadOf(s, 'Alpha Co'), messagesNow: await toastsOn(p) }; await shot(p, 'C368150-s9-after-keys');
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p).catch(() => {}); await clickSearch(p);
  const tr = await keyUntil(p, (f) => f.raw === `tech_view_row_${id}`, 40); o.s11_reachedBy = tr.found ? 'Tab' : ((await (async () => { await clickSearch(p); return arrowToRow(p, `tech_view_row_${id}`); })()) ? 'Tab to the table, then arrow keys' : 'not reached'); o.s11_tabStops = tr.seen;
  if (o.s11_reachedBy !== 'not reached') { await p.keyboard.press('Enter'); await p.waitForTimeout(3500); o.s11_enter = { url: u(), openedAlpha: p.url().includes(id) }; await shot(p, 'C368150-s11-after-enter'); }
  await p.keyboard.press('Alt+ArrowLeft'); await p.waitForTimeout(4000); o.s12_back = u(); if (isWo()) { await p.goBack().catch(() => {}); await p.waitForTimeout(3500); }
  if (!(await p.locator(`[data-test-id="tech_view_row_${id}"]`).count())) { await goP(p, 'Tech View', s.q); }
  const rb = await p.locator(`[data-test-id="tech_view_row_${id}"]`).first().boundingBox();
  if (rb) { const x = rb.x + Math.min(rb.width * 0.35, 420), y = rb.y + rb.height / 2; await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(3500); o.s13_click = { at: [Math.round(x), Math.round(y)], url: u(), openedAlpha: p.url().includes(id) }; await shot(p, 'C368150-s13-after-click'); } else o.s13_click = 'row not on screen';
  R.C368150 = o; function N2(x: string) { return x === ANA.staff_id ? 'Technician-A' : x === BEN.staff_id ? 'Technician-B' : x; } });

await run('C368151', async () => { await pins([BEN.staff_id]);
  // 16 Oct 2026: steps 5-18 as rewritten (Enter OR Space opens the card menu; Space unpins; Space expands; avatar name on focus; Column
  // Selection by keyboard with focus returned; the Status chip's x by Enter; the display switcher by Enter). Technician-A NOT pinned at start.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const id = s.w['Alpha Co'].id; const o: any = {};
  const isPinned = async () => ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id);
  o.pinnedAtStart = await isPinned();
  await goP(p, 'Board View', s.q); await toColumn(p, ANA.staff_id).catch(() => {});
  o.s5 = { ...(await cardFocus(p, `board_card_${id}`)), focus: await fx(p), moreVisibleOnFocus: await p.locator(`[data-test-id="board_card_${id}"] [data-test-id="button_work_order_more_actions"]`).isVisible().catch(() => false) };
  await p.mouse.move(1, 1); await shot(p, 'C368151-s5-card-focus');
  const tm = await keyUntil(p, (f) => /more_actions/.test(f.raw), 6); o.s6 = { tabStops: tm.seen, onMore: tm.found };
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s6.menuOpen = await menuOpen(p); o.s6.items = await menuItems(p); await shot(p, 'C368151-s6-menu-enter');
  await p.keyboard.press('Escape'); await p.waitForTimeout(800); o.s7 = { menuOpen: await menuOpen(p), focus: clean((await fx(p)).raw), focusFull: await fx(p) };
  await p.keyboard.press('Space'); await p.waitForTimeout(1000); o.s8 = { menuOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368151-s8-menu-space');
  await p.keyboard.press('Escape'); await p.waitForTimeout(800); o.s9 = { menuOpen: await menuOpen(p), focus: clean((await fx(p)).raw) };
  const pinSel = (f: any) => /pin/i.test(f.raw + ' ' + (f.label ?? '')) && f.raw.includes(ANA.staff_id.slice(0, 8)) || new RegExp('board_column_header_' + ANA.staff_id).test(f.raw) && /pin/i.test(f.label ?? f.cls ?? '');
  let tp = await keyUntil(p, pinSel, 40); o.s10_reach = { by: 'Tab', stops: tp.seen.slice(-12) };
  if (!tp.found) { tp = await keyUntil(p, pinSel, 40, 'Shift+Tab'); o.s10_reach = { by: 'Shift+Tab', stops: tp.seen.slice(-12) }; }
  if (!tp.found) { await cardFocus(p, `board_card_${id}`); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(300); tp = await keyUntil(p, pinSel, 6); o.s10_reach = { by: 'arrow up to the column header, then Tab (Tab alone did not reach it)', stops: tp.seen }; }
  o.s10_found = tp.found; o.s10_focus = tp.f ?? null;
  if (tp.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1800); o.s10_afterEnter = { pinnedSaved: await isPinned(), button: await fx(p) }; await shot(p, 'C368151-s10-after-enter-pin');
    if (!/pin/i.test((await fx(p)).raw + ((await fx(p)).label ?? ''))) { o.s11_focusLost = clean((await fx(p)).raw); }
    await p.keyboard.press('Space'); await p.waitForTimeout(1800); o.s11_afterSpace = { pinnedSaved: await isPinned(), button: await fx(p) }; await shot(p, 'C368151-s11-after-space'); }
  if (await isPinned()) { await pins([BEN.staff_id]); o.unpinnedByScript = true; }
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p).catch(() => {}); await clickSearch(p);
  const collapsed = () => p.evaluate(`(document.querySelector('[data-test-id="tech_view_group_${ANA.staff_id}"]') || { getAttribute: () => 'no group' }).getAttribute('data-collapsed')`) as Promise<string | null>;
  const vis = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(e => e.getBoundingClientRect().height > 0).length`) as Promise<number>;
  const tg = await keyUntil(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`, 40); o.s13_reach = { found: tg.found, stops: tg.seen.slice(-10) };
  if (tg.found) { const r0 = await vis(), c0 = await collapsed(); await p.keyboard.press('Enter'); await p.waitForTimeout(1600); o.s13 = { before: { rows: r0, collapsed: c0 }, after: { rows: await vis(), collapsed: await collapsed() }, focus: clean((await fx(p)).raw) }; await shot(p, 'C368151-s13-after-enter');
    if ((await fx(p)).raw !== `button_tech_view_group_toggle_${ANA.staff_id}`) { const back = await keyUntil(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`, 6, 'Shift+Tab'); o.s14_refocus = back.found; }
    await p.keyboard.press('Space'); await p.waitForTimeout(1600); o.s14 = { rows: await vis(), collapsed: await collapsed() }; await shot(p, 'C368151-s14-after-space'); }
  const inAlpha = `(function () { var e = document.activeElement; return !!(e && e.closest('[data-test-id="tech_view_row_${id}"]')); })()`;
  const av = await keyUntil(p, async (f) => (await p.evaluate(inAlpha)) && /avatar/i.test(f.raw + ' ' + f.cls + ' ' + (f.label ?? '')), 30); o.s15_reach = { found: av.found, stops: av.seen.slice(-14) };
  await p.mouse.move(1, 1); await p.waitForTimeout(1200); o.s15_tooltips = await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`); o.s15_focus = await fx(p); await shot(p, 'C368151-s15-avatar-focus');
  const cs = await keyUntil(p, (f) => f.raw === 'button_tech_view_column_selection', 40, 'Shift+Tab'); o.s16_reach = { found: cs.found, stops: cs.seen.slice(-8) };
  if (cs.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200); const m1 = await menuOpen(p); await p.keyboard.press('Tab'); await p.waitForTimeout(400); const fIn = await fx(p);
    const inMenu = await p.evaluate(`!!(document.activeElement && document.activeElement.closest('.q-menu'))`); await shot(p, 'C368151-s16-column-selection-open');
    await p.keyboard.press('Escape'); await p.waitForTimeout(900); o.s16 = { menuOpenAfterEnter: m1, afterTab: { ...fIn, raw: clean(fIn.raw), insideMenu: inMenu }, menuOpenAfterEscape: await menuOpen(p), focusAfterEscape: clean((await fx(p)).raw) }; await shot(p, 'C368151-s16-after-escape'); }
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /^\s*Approved\s*$/i }).first().click().catch(() => {}); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  o.s17_chipBefore = await p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  const xs = await keyUntil(p, async (f) => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c && (/remove|clear|cancel|close/i.test((e.getAttribute('aria-label') || '') + ' ' + e.className + ' ' + (e.textContent || ''))); })()`) as Promise<boolean>, 30); o.s17_reach = { found: xs.found, stops: xs.seen.slice(-10) };
  if (!xs.found) { const xs2 = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c; })()`) as Promise<boolean>, 30, 'Shift+Tab'); o.s17_reachBack = { found: xs2.found, stops: xs2.seen.slice(-10), focus: xs2.f ?? null }; }
  await p.keyboard.press('Enter'); await p.waitForTimeout(1800); o.s17_chipAfter = await p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null); await p.keyboard.press('Escape').catch(() => {}); await shot(p, 'C368151-s17-after-enter-x');
  const bv = await keyUntil(p, (f) => f.label === 'Board View', 40, 'Shift+Tab'); o.s18_reach = { found: bv.found, stops: bv.seen.slice(-8) };
  if (!bv.found) { const bv2 = await keyUntil(p, (f) => f.label === 'Board View', 60, 'Tab'); o.s18_reachForward = { found: bv2.found }; }
  await p.keyboard.press('Enter'); await p.waitForTimeout(2500); o.s18_active = await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`); await shot(p, 'C368151-s18-after-enter');
  await statusOnly(null).catch(() => {}); R.C368151 = o; });

await run('C368152', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  // 16 Oct 2026: reassign through More actions AND the dialog's search box (Technician-B's first letters); NEW steps 9-11: More actions
  // on Work-order-3 (led by Technician-B), read every item, Unassign by Enter if offered; step 12: no key reorders Work-order-2.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reassign', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const id = s.w['Alpha Co'].id, c3 = s.w['Charlie Co'].id; const o: any = {};
  await goP(p, 'Board View', s.q); o.s5 = await cardFocus(p, `board_card_${id}`); const tm = await keyUntil(p, (f) => /more_actions/.test(f.raw), 6); o.s5.onMore = tm.found;
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); const items = await menuItems(p); o.s5.items = items;
  const idx = items.findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); } o.s6_menuFocus = (await fx(p)).text; await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  o.s6_dialog = await p.locator('.q-dialog').count();
  if (o.s6_dialog) { o.s7_focusInSearch = await p.evaluate(`!!(document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.closest('.q-dialog'))`);
    if (!o.s7_focusInSearch) { const k = await keyUntil(p, (f) => /INPUT|search/i.test(f.raw), 6); o.s7_tabToSearch = k.found; }
    await p.keyboard.type('ZZAUTOTEST Be', { delay: 60 }); await p.waitForTimeout(1800);
    o.s7_rows = await p.evaluate(`[...document.querySelectorAll('.q-dialog [data-test-id^="option_lead_technician_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 40))`); await shot(p, 'C368152-s7-typed');
    const want8 = `option_lead_technician_${BEN.staff_id}`; let k8 = await keyUntil(p, (f) => f.raw === want8, 10, 'ArrowDown'); o.s8_reach = { by: 'arrow keys', found: k8.found, stops: k8.seen };
    if (!k8.found) { k8 = await keyUntil(p, (f) => f.raw === want8, 12, 'Tab'); o.s8_reach = { by: 'Tab', found: k8.found, stops: k8.seen }; }
    if (k8.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
      if (await p.locator('.q-dialog').filter({ hasNotText: /scheduled shifts/i }).count()) { const cf = await keyUntil(p, (f) => /confirm/i.test(f.raw), 8); o.s8_confirm = cf.found ? 'a Confirm button needed Enter' : 'no confirm'; if (cf.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200); } }
      o.s8_shifts = await keepShiftsKbd(p); await p.waitForTimeout(800); o.s8_messages = await toastsOn(p); }
    o.s8_dialogLeft = await p.locator('.q-dialog').count(); await p.waitForTimeout(1500); o.s8_alphaColumn = (await colOf(p, id)).replace(BEN.staff_id, 'Technician-B').replace(ANA.staff_id, 'Technician-A'); o.s8_lead = await leadOf(s, 'Alpha Co'); await shot(p, 'C368152-s8-after-reassign'); }
  await p.keyboard.press('Escape').catch(() => {});
  o.s9 = await cardFocus(p, `board_card_${c3}`); const tm9 = await keyUntil(p, (f) => /more_actions/.test(f.raw), 6); o.s9.onMore = tm9.found;
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s10_items = await menuItems(p); await shot(p, 'C368152-s10-menu-items');
  const ui = (o.s10_items as string[]).findIndex((x) => /^Unassign/i.test(x));
  if (ui >= 0) { for (let i = 0; i <= ui; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); } await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.s11_shifts = await keepShiftsKbd(p); o.s11_messages = await toastsOn(p); await p.waitForTimeout(1500); o.s11_column = (await colOf(p, c3)).replace(BEN.staff_id, 'Technician-B'); o.s11_lead = await leadOf(s, 'Charlie Co'); await shot(p, 'C368152-s11-after-unassign'); }
  else { o.s11 = 'no Unassign item in the menu'; await p.keyboard.press('Escape').catch(() => {}); }
  const before = await colCards(p, ANA.staff_id, s); o.s12 = await cardFocus(p, `board_card_${s.w['Bravo Co'].id}`); o.s12_keys = {};
  for (const k of ['Space', 'ArrowUp', 'ArrowDown', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(800); o.s12_keys[k] = (await colOf(p, s.w['Bravo Co'].id)).replace(ANA.staff_id, 'Technician-A'); if (/\/workorders\/[0-9a-f-]{36}/.test(p.url())) { o.s12_keys[k] += ' (opened the work order)'; await p.goBack(); await p.waitForTimeout(3500); } }
  o.s12_order = { before, after: await colCards(p, ANA.staff_id, s) }; await shot(p, 'C368152-s12-after-keys');
  R.C368152 = o; });

await run('C97020', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Limits', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }]); const o: any = {};
  // 15 Oct 2026 (staging second pass): the view-only role had Work orders > Create & Edit left ON by C97012 (s9-fix7), so the
  // "view-only" user could open Reassign. The role must be Work orders > View only before the viewer part: anything else in
  // Work orders (Create & Edit, Delete) is taken off here and the role is read back (role-viewonly-stg4.mts does the same at the
  // start of the fourth pass; this is the second guard). Taking a permission OFF a view-only role needs no restore.
  { const rr = (await a.get(`/api/roles/${VIEW_ROLE}`)).body?.data; const code = (x: any) => String(x?.code ?? x?.name ?? x);
    const extra = ((rr?.fe_permissions ?? []) as any[]).filter((x) => /^workOrders/.test(code(x)) && !/^workOrdersView$/.test(code(x)));
    if (extra.length) o.roleFixedAtStart = say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: rr.name, description: rr.description, view_mode: rr.view_mode, template_id: rr.template_id, fe_permissions: ((rr.fe_permissions ?? []) as any[]).filter((x) => !extra.includes(x)).map((x) => x.id), cross_toggles: rr.cross_toggles }));
    o.roleWorkOrderPermsBeforeViewer = (((await a.get(`/api/roles/${VIEW_ROLE}`)).body?.data?.fe_permissions ?? []) as any[]).map(code).filter((c) => /^workOrders/.test(c)); }
  const viewer = await mkUser('ZZAUTOTEST', `KbdViewer ${stamp}`, VIEW_ROLE, 'kbdviewer'); const v = await asUser(viewer);
  try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } }).catch(() => {}); await goP(pg, 'Board View', s.q); await toColumn(pg, ANA.staff_id).catch(() => {}); await clickSearch(pg);
    o.viewerFocused = await arrowToCard(pg, `board_card_${s.w['Alpha Co'].id}`);
    await pg.keyboard.press('Tab'); await pg.waitForTimeout(300); o.viewerTabTo = (await focusInfo(pg)).raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'); if (/more_actions/.test(o.viewerTabTo)) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(1000); o.viewerMenu = await pg.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].map(e => e.innerText.replace(/\\s+/g, ' ').trim() + (e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true' ? ' [disabled]' : ''))`); await shot(pg, 'C97020-viewer-menu');
      const vi = (o.viewerMenu as string[]).findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= vi; i++) { await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(150); } await pg.keyboard.press('Enter'); await pg.waitForTimeout(1500);
      o.viewerItemEnter = { dialog: await pg.locator('.q-dialog').count(), text: await pg.locator('.q-dialog').first().innerText().then((x) => x.replace(/\s+/g, ' ').slice(0, 200)).catch(() => null), toasts: await toastsOn(pg) }; await shot(pg, 'C97020-viewer-item-enter'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); }
    { const st: any = await api(pg).get('/api/switch-user').catch(() => null); const perms = (st?.body?.data?.role?.fePermissions ?? []).map((x: any) => x.name); o.viewerRole = { name: st?.body?.data?.role?.name ?? null, count: perms.length, workOrderPerms: perms.filter((n: string) => /^wo|work/i.test(n)) }; }
    await clickSearch(pg); await arrowToCard(pg, `board_card_${s.w['Alpha Co'].id}`);
    for (const k of ['Enter', 'Space', 'ArrowDown', 'ArrowRight', 'Shift+ArrowRight', 'Shift+ArrowDown', 'Alt+ArrowRight', 'Control+ArrowRight']) { await pg.keyboard.press(k); await pg.waitForTimeout(700); (o.viewerKeys ??= {})[k] = (await pg.locator('.q-dialog, .q-menu').count()) ? 'menu/dialog' : /\/workorders\/[0-9a-f-]{36}/.test(pg.url()) ? 'opened the work order' : 'nothing'; if (o.viewerKeys[k] !== 'nothing') { await pg.keyboard.press('Escape'); if (/\/workorders\/[0-9a-f-]{36}/.test(pg.url())) { await pg.goBack(); await pg.waitForTimeout(3500); } await clickSearch(pg); await arrowToCard(pg, `board_card_${s.w['Alpha Co'].id}`); } }
    o.viewerMoreActions = await pg.locator(`[data-test-id="board_card_${s.w['Alpha Co'].id}"] [data-test-id="button_work_order_more_actions"]`).count();
  } finally { await v.close(); }
  o.alphaAfterViewer = { lead: await leadOf(s, 'Alpha Co') };
  await goP(p, 'Board View', s.q); await clickSearch(p); o.dispFocused = await arrowToCard(p, `board_card_${s.w['Bravo Co'].id}`); await p.keyboard.press('Tab'); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
  const it = p.locator('.q-menu .q-item').filter({ hasText: /Reassign lead technician/i }).first(); o.item = { found: await it.count(), disabled: await it.evaluate((e) => e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('q-item--disabled')).catch(() => null) };
  await it.hover().catch(() => {}); await p.waitForTimeout(1200); o.tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText)`); await shot(p, 'C97020-invoiced-menu');
  const items = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); const idx = items.findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150); } await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.dialogOpened = await p.locator('.q-dialog').count(); await p.keyboard.press('Escape');
  await clickSearch(p); await arrowToCard(p, `board_card_${s.w['Bravo Co'].id}`); for (const k of ['Shift+ArrowRight', 'Alt+ArrowRight', 'Control+ArrowRight', 'Space']) { await p.keyboard.press(k); await p.waitForTimeout(700); } await p.keyboard.press('Escape');
  // 16 Oct 2026: steps 5-10 are done as the Admin user (the runner "ZZ WOB Runner" carries the Admin role); step 10 now refreshes the page
  // and opens Work-order-2 to read Lead Technician on its own page; the disabled item's note is kept word for word
  o.itemNoteFull = await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => /Reassign lead technician/i.test(e.innerText)).map(e => e.innerText.replace(/\s+/g, ' ').trim())`).catch(() => null);
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4000); o.s10_woPage = await woPageLead(p, APP, s.w['Bravo Co'].id);
  o.runnerRole = 'Admin (ZZ WOB Runner, runner.mts)';
  o.bravoLead = await leadOf(s, 'Bravo Co'); R.C97020 = o; });

await run('C97022', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  // 16 Oct 2026: steps 1-9 only (focus goes back to the More actions button after the menu and after the dialog). Steps 10-16 need the
  // Technician filter; whether Board View offers it is read here (with the other filters as the positive control) and nothing more is done.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Focus Kept', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const o: any = {}; const N = nm(s);
  await goP(p, 'Board View', s.q); o.anaColumn = await colCards(p, ANA.staff_id, s); const firstId = s.w[o.anaColumn[0]]?.id ?? s.w['Alpha Co'].id; o.s5_firstCard = o.anaColumn[0];
  o.s5 = await cardFocus(p, `board_card_${firstId}`); const tm = await keyUntil(p, (f) => /more_actions/.test(f.raw), 6); o.s6_onMore = tm.found; const moreRaw = (await fx(p)).raw;
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s6_menu = await menuOpen(p);
  await p.keyboard.press('Escape'); await p.waitForTimeout(900); o.s7 = { menuOpen: await menuOpen(p), focus: await fx(p), sameButton: (await fx(p)).raw === moreRaw && await p.evaluate(`!!(document.activeElement && document.activeElement.closest('[data-test-id="board_card_${firstId}"]'))`) }; o.s7.focus.raw = N(o.s7.focus.raw); await shot(p, 'C97022-s7-after-escape-menu');
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); const items = await menuItems(p); const idx = items.findIndex((x) => /Reassign lead technician/i.test(x));
  for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); } await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s8_dialog = await p.locator('.q-dialog').count(); await shot(p, 'C97022-s8-dialog');
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200); o.s9 = { dialogOpen: await p.locator('.q-dialog').count(), focus: await fx(p), onSameMore: await p.evaluate(`!!(document.activeElement && document.activeElement.closest('[data-test-id="board_card_${firstId}"]') && /more_actions/.test(document.activeElement.getAttribute('data-test-id') || (document.activeElement.closest('[data-test-id]') || {}).getAttribute?.('data-test-id') || ''))`), lead: await leadOf(s, o.anaColumn[0] ?? 'Alpha Co') }; o.s9.focus.raw = N(o.s9.focus.raw); await shot(p, 'C97022-s9-after-escape-dialog');
  o.s10_filterChips = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); o.s10_technicianFilter = (o.s10_filterChips as string[]).some((x) => /Technician/i.test(x));
  await shot(p, 'C97022-s10-filter-bar');
  R.C97022 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'kbd-fix4.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
