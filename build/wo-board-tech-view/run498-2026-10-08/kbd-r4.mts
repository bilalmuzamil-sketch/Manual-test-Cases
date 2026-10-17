/**
 * kbd-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: two focused keyboard re-runs, each queued alone (ONLY=<id>).
 *   C368151 — steps 5-7 in Tech View (the case's key sequence under the PRD keyboard model: one Tab stop per view, arrows inside it,
 *     Tab to the focused item's own controls; L0403 / L0409): every key logged with what has focus; a lost focus is recorded (which key,
 *     whether the old element is still on the page) and the view re-entered by Search > Tab. Technician-A sits right after Unassigned by
 *     the runner's saved technician order (not pinned). Step 9: Home / ArrowDown inside the Status options, then focus put on the first
 *     option by the script (logged), then Tab; Approved ticked with Enter, else Space.
 *   C97020 — the Admin half (steps 7-16): Technician-A pinned for the Admin (precondition), Work-order-2's card read back on the board
 *     first (positive control), focus ON the card before More actions is opened by the keyboard; the disabled "Reassign lead technician"
 *     item's note read on keyboard highlight, and on mouse hover as the positive control.
 * The set-up and helpers are kbd-fix4.mts's proven code, copied unchanged below (lines 14-289); only the start tag and the output file
 * changed. Output EV/kbd-r4-<ONLY>.json; pictures EV/C368151-r4-*.png, EV/C97020-r4-*.png. Records only; no TestRail, no Jira.
 * ───────────────────────────── COPIED FROM kbd-fix4.mts (lines 14-289, 17 Oct 2026) ─────────────────────────────
 */
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
await startState(p, a, 'kbd-r4');   // L0415, fix-up 2
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
  fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
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
async function kArrowsTo(pg: Page, ok: (f: any) => boolean, mode: 'board' | 'table', N: (r: string) => string = clean) {
  const keys: string[] = []; let f = await kz(pg, N); if (ok(f)) return { reached: true, keys, focus: f };
  const press = async (k: string) => { const g = await kp(pg, k, N); keys.push(`${k} -> ${kshort(g)}`); return g; };
  const scan = async (dirs: string[], n = 30) => { for (const k of dirs) for (let i = 0; i < n; i++) { const g = await press(k); if (ok(g)) { f = g; return true; } if (same(g, f) || g.where !== mode) break; f = g; } return false; };
  if (mode === 'table') { const r = await scan(['ArrowDown', 'ArrowUp']); return { reached: r, keys, focus: f }; }
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


// ───────────────────────────── ROUND 4 blocks (17 Oct 2026) ─────────────────────────────
const OUT4 = path.join(EV, `kbd-r4${only.length ? '-' + only.join('-') : ''}.json`);
const save4 = () => fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
/** press one key, read focus, keep a one-line note of it (every key is logged, L0409) */
async function k4(pg: Page, keys: string[], k: string, N: (r: string) => string) { const f = await kp(pg, k, N); keys.push(`${k} -> ${kshort(f)}`); return f; }
/** focus lost? (the page body, or outside the view that was being used) */
const lost = (f: any, area: 'board' | 'table') => f.raw === 'body' || (f.where !== area && f.where !== 'menu' && f.where !== 'dialog');
/** the Status options list as the keyboard sees it: what has focus, which option is highlighted, which are ticked, and what can take focus */
const optState4 = (pg: Page) => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const ae = document.activeElement;
  const clean = (x) => String(x || '').replace(/\\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check)\\s+/i, '').trim();
  const items = m ? [...m.querySelectorAll('.q-item, [role=option], [role=checkbox]')] : [];
  const hi = items.find(e => e.classList.contains('q-manual-focusable--focused') || e.classList.contains('q-item--focused') || e === ae || (e.contains(ae) && ae !== m));
  const ad = ae && ae.getAttribute('aria-activedescendant'); const adEl = ad ? document.getElementById(ad) : null;
  return { active: ae ? ((ae.getAttribute('data-test-id') || ae.tagName) + ' ' + clean(ae.innerText || ae.getAttribute('aria-label') || ae.value).slice(0, 30)) : 'none', inMenu: !!(ae && m && m.contains(ae)),
    highlighted: hi ? clean(hi.innerText).slice(0, 30) : (adEl ? clean(adEl.innerText).slice(0, 30) : null),
    ticked: items.filter(e => e.querySelector('.q-checkbox__inner--truthy, [aria-checked=true]') || e.getAttribute('aria-checked') === 'true').map(e => clean(e.innerText).slice(0, 20)),
    focusables: m ? [...m.querySelectorAll('input, button, [tabindex], .q-item')].slice(0, 12).map(e => (e.getAttribute('data-test-id') || e.tagName) + '[' + (e.getAttribute('tabindex') ?? '-') + '] ' + clean(e.innerText || e.getAttribute('aria-label') || '').slice(0, 18)) : [] }; })()`).catch(() => null) as Promise<any>;

await run('C368151', async () => {
  // ROUND 4 (17 Oct 2026). Steps 1-4 and 8 and 10 as kbd-fix4 (seen working on 17 Oct). Two changes, both to put the case's own key
  // sequence (PRD keyboard model: one Tab stop per view, arrows inside it, Tab to the focused item's own controls) within reach:
  //  (a) Technician-A's group / column is put right after Unassigned by the runner's SAVED technician order (the user's own order, S9 —
  //      not a pin, so A stays unpinned as the precondition says); with ~280 technicians A's group was hundreds of rows down, and the
  //      keyboard walk lost the group when the table re-drew;
  //  (b) steps 5-7: after EVERY key the focused element is logged; when focus is lost (body / outside the table) the reading records the key
  //      that lost it and whether the element that had focus is still on the page, then re-enters by Search > Tab (S11-R1: Tab returns to
  //      the last-focused item) — at most twice, each recovery logged; step 9: inside the opened Status options Home and ArrowDown are
  //      tried first, then (if nothing is highlighted) focus is put on the first option by the script (logged as such), then Tab; Approved is
  //      ticked with Enter, then Space if Enter did not tick it.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls One', [{ co: 'Alpha Co', lead: ANA }]); const id = s.w['Alpha Co'].id; const N = nm(s);
  const o: any = (R.C368151 = { data: { q: s.q, wo: s.w['Alpha Co'].number, technicianA: 'ZZAUTOTEST Ana Alpha' } });
  console.log(t(), 'START STATE found C368151', JSON.stringify({ pins: (await prefFor()).pinnedTechnicianIds ?? [], savedOrderLength: ((await prefFor()).technicianOrder ?? []).length, wo: o.data.wo }));
  o.prefs = await kPrefs([]); o.lineTechnician = await lineTech(id, ANA.staff_id);
  { await goP(p, 'Board View', ''); const cur = await allCols(p); const rest = cur.filter((x) => x !== 'unassigned' && x !== ANA.staff_id);
    o.orderSeed = say(await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [], technicianOrder: [ANA.staff_id, ...rest] } })); o.columnsOnBoard = cur.length; }
  const isPinned = async () => ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id);
  const pinBtn = () => p.locator(`[data-test-id="button_board_pin_${ANA.staff_id}"]`).first().getAttribute('aria-pressed').catch(() => null);
  o.start = await kStart(p, 'Board View', s.q); o.pinnedAtStart = await isPinned(); o.firstColumns = named((await colsOf(p)).slice(0, 3), IDS);
  console.log(t(), 'START STATE set C368151', JSON.stringify({ pinnedAtStart: o.pinnedAtStart, firstColumns: o.firstColumns, orderSeed: o.orderSeed, start: o.start, lineTechnician: o.lineTechnician }));
  // step 1
  await clickSearch(p); o.s1 = { tab: await kTabIn(p, 'board', N) }; o.s1.arrows = await kArrowsTo(p, (f) => f.raw === 'board_card_Alpha Co', 'board', N);
  await p.mouse.move(1, 1); await p.waitForTimeout(600); o.s1.focus = await kz(p, N); o.s1.moreActionsWithoutHover = await kMore(p, id); await shot(p, 'C368151-r4-s1-card-focus');
  // step 2
  o.s2 = { tab: await kp(p, 'Tab', N) }; await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s2.enter = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368151-r4-s2-menu-enter');
  o.s2.escape1 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) };
  await p.keyboard.press('Space'); await p.waitForTimeout(1000); o.s2.space = { menusOpen: await menuOpen(p), items: await menuItems(p) }; await shot(p, 'C368151-r4-s2-menu-space');
  o.s2.escape2 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) };
  // steps 3-4
  o.s3 = { back: kshort(await kp(p, 'Shift+Tab', N)) }; o.s3.toHeader = await kArrowsTo(p, (f) => /^board_column_header_Ana$/.test(f.raw) || (f.header === 'board_column_header_Ana' && !/pin/i.test(f.raw)), 'board', N);
  const tp = await keyUntil(p, (f) => f.raw === `button_board_pin_${ANA.staff_id}`, 6, 'Tab', N); o.s3.tabToPin = { found: tp.found, stops: tp.seen };
  if (tp.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1800); o.s3.afterEnter = { pinnedSaved: await isPinned(), pinPressed: await pinBtn(), focus: kshort(await kz(p, N)) }; }
  await shot(p, 'C368151-r4-s3-after-enter-pin');
  o.s4 = { focusBefore: kshort(await kz(p, N)) }; await p.keyboard.press('Space'); await p.waitForTimeout(1800); o.s4.pinnedSaved = await isPinned(); o.s4.pinPressed = await pinBtn(); o.s4.focusAfter = kshort(await kz(p, N)); await shot(p, 'C368151-r4-s4-after-space');
  if (await isPinned()) { await pins([]); o.unpinnedByScript = true; }
  save4();
  // step 5: Tech View (mouse, as the case allows for set-up): Assigned Techs on, A's group open; then the keyboard
  await display(p, 'Tech View'); await p.waitForTimeout(2500);
  await p.locator('[data-test-id="button_tech_view_column_selection"]').click().catch(() => {}); await p.waitForTimeout(1200);
  { const at = p.locator('.q-menu [role=checkbox], .q-menu .q-item').filter({ hasText: /Assigned Techs/i }).first(); o.assignedTechsWasOn = await at.getAttribute('aria-checked').catch(() => null); if (o.assignedTechsWasOn === 'false') { await at.click(); await p.waitForTimeout(1500); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  const collapsed = () => p.evaluate(`(document.querySelector('[data-test-id="tech_view_group_${ANA.staff_id}"]') || { getAttribute: () => 'no group' }).getAttribute('data-collapsed')`) as Promise<string | null>;
  const rowsIn = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(e => e.getAttribute('data-group-key') === ${JSON.stringify(ANA.staff_id)} && e.getBoundingClientRect().height > 0).length`) as Promise<number>;
  if ((await collapsed()) === 'true') { await p.locator(`[data-test-id="button_tech_view_group_toggle_${ANA.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1500); o.groupOpenedByMouse = true; }
  o.s5pre = { groupsDrawn: (await groups(p)).slice(0, 4).map((g) => `${g.id === ANA.staff_id ? 'Technician-A' : g.name}${g.collapsed ? ' (collapsed)' : ''}: ${g.rows.length} rows`), aCollapsed: await collapsed(), aRows: await rowsIn() };
  await shot(p, 'C368151-r4-s5-before-keys');
  const keys5: string[] = []; o.s5 = { keys: keys5, recoveries: [] as any[] };
  const isAHeader = (f: any) => f.group === 'tech_view_group_Ana' && !f.row;
  const isARow = (f: any) => f.row === 'tech_view_row_Alpha Co';
  /** Search > Tab into the table; returns where it landed */
  const enterTable = async (why: string, keys: string[] = keys5) => { await clickSearch(p); keys.push(`(${why}) click in Search`); const ti = await kTabIn(p, 'table', N); keys.push(...ti.stops.map((x: string) => `Tab -> ${x}`)); return ti.landed; };
  /** arrows from where focus is to a target; logs every key; recovers from a lost focus by re-entering (max 2) */
  const arrowsTo = async (ok: (f: any) => boolean, label: string, keys: string[] = keys5) => {
    let f = await kz(p, N); if (ok(f)) return { reached: true, f };
    for (let i = 0; i < 24; i++) {
      const dir = f.row ? 'ArrowUp' : f.group === 'tech_view_group_unassigned' ? 'ArrowDown' : (label === 'row' ? 'ArrowDown' : 'ArrowUp');
      const prevSel = f.own ? `[data-test-id="${f.own}"]` : null;
      const g = await k4(p, keys, dir, N);
      if (ok(g)) return { reached: true, f: g };
      if (lost(g, 'table')) { const still = prevSel ? await p.locator(prevSel).count() : null; o.s5.recoveries.push({ afterKey: dir, from: kshort(f), to: kshort(g), previousElementStillOnPage: still });
        if (o.s5.recoveries.length > 2) return { reached: false, f: g }; const back = await enterTable(`focus lost after ${dir}`, keys); if (!back) return { reached: false, f: g }; f = await kz(p, N); if (ok(f)) return { reached: true, f }; continue; }
      if (same(g, f)) { const g2 = await k4(p, keys, dir === 'ArrowUp' ? 'ArrowDown' : 'ArrowUp', N); if (ok(g2)) return { reached: true, f: g2 }; f = g2; continue; }
      f = g; }
    return { reached: false, f }; };
  o.s5.landed = await enterTable('step 5'); o.s5.landedOn = o.s5.landed ? kshort(o.s5.landed) : 'Tab did not reach the table';
  const toHdr = await arrowsTo(isAHeader, 'header'); o.s5.toHeader = { reached: toHdr.reached, focus: kshort(toHdr.f) };
  const tg = await keyUntil(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`, 6, 'Tab', N); o.s5.tabToArrow = { found: tg.found, stops: tg.seen }; keys5.push(...tg.seen.map((x) => `Tab -> ${x}`));
  if (tg.found) { o.s5.before = { collapsed: await collapsed(), rows: await rowsIn() }; await p.keyboard.press('Enter'); await p.waitForTimeout(1600); o.s5.after = { collapsed: await collapsed(), rows: await rowsIn(), focus: kshort(await kz(p, N)) }; keys5.push(`Enter -> ${o.s5.after.focus}`); }
  await shot(p, 'C368151-r4-s5-after-enter-collapse');
  console.log(t(), 'C368151 step 5', JSON.stringify({ landed: o.s5.landedOn, toHeader: o.s5.toHeader, tabToArrow: o.s5.tabToArrow.found, before: o.s5.before, after: o.s5.after, recoveries: o.s5.recoveries, keys: keys5.slice(-30) }));
  // step 6: focus kept on the arrow, Space
  o.s6 = { focusBefore: kshort(await kz(p, N)) }; await p.keyboard.press('Space'); await p.waitForTimeout(1600); o.s6.collapsed = await collapsed(); o.s6.rows = await rowsIn(); o.s6.focusAfter = kshort(await kz(p, N)); await shot(p, 'C368151-r4-s6-after-space');
  save4();
  // step 7: arrow keys to the row (from the arrow button: ArrowDown first; else Shift+Tab to the header, then ArrowDown), Tab to an avatar
  const keys7: string[] = []; o.s7 = { keys: keys7 };
  let f7 = await kz(p, N);
  for (let i = 0; i < 4 && !isARow(f7) && !lost(f7, 'table'); i++) f7 = await k4(p, keys7, 'ArrowDown', N);
  o.s7.route = isARow(f7) ? 'ArrowDown from the collapse arrow' : null;
  if (!isARow(f7)) { const b = await k4(p, keys7, 'Shift+Tab', N); f7 = b; for (let i = 0; i < 4 && !isARow(f7) && !lost(f7, 'table'); i++) f7 = await k4(p, keys7, 'ArrowDown', N); if (isARow(f7)) o.s7.route = 'Shift+Tab to the header, then ArrowDown'; }
  if (!isARow(f7)) { await enterTable('step 7: re-enter', keys7); const r = await arrowsTo(isARow, 'row', keys7); f7 = r.f; if (r.reached) o.s7.route = 'Search > Tab back into the table, then arrows'; }
  o.s7.toRow = { reached: isARow(f7), focus: kshort(f7) };
  const assignedCol = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).findIndex(h => /^Assigned Techs/i.test(h))`) as number; o.s7.assignedTechsColumnIndex = assignedCol;
  const inAssigned = `(function () { var e = document.activeElement; var r = e && e.closest('[data-test-id="tech_view_row_${id}"]'); var td = e && e.closest('td'); return !!r && !!td && [...td.parentElement.children].indexOf(td) === ${assignedCol}; })()`;
  const inRow = `!!(document.activeElement && document.activeElement.closest('[data-test-id="tech_view_row_${id}"]'))`;
  if (isARow(f7)) { const av = await keyUntil(p, async (f) => ((await p.evaluate(inAssigned)) as boolean) || (/avatar/i.test(f.raw + ' ' + f.cls + ' ' + (f.label ?? '')) && (await p.evaluate(inRow)) as boolean), 30, 'Tab', N); o.s7.tabToAvatar = { found: av.found, stops: av.seen }; }
  await p.mouse.move(1, 1); await p.waitForTimeout(1200);
  o.s7.focus = await kz(p, N); o.s7.nameShown = { tooltips: await p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim())`), label: o.s7.focus.label, title: o.s7.focus.title, text: o.s7.focus.text, expected: 'ZZAUTOTEST Ana Alpha' };
  await shot(p, 'C368151-r4-s7-avatar-focus');
  console.log(t(), 'C368151 step 7', JSON.stringify({ toRow: o.s7.toRow, route: o.s7.route, tabToAvatar: o.s7.tabToAvatar?.found, nameShown: o.s7.nameShown, keys: keys7.slice(-20) }));
  save4();
  // step 8 (as kbd-fix4): Column Selection by keyboard
  let cs = await keyUntil(p, (f) => f.raw === 'button_tech_view_column_selection', 40, 'Shift+Tab', N); o.s8 = { reach: { by: 'Shift+Tab', found: cs.found, stops: cs.seen.slice(-10) } };
  if (!cs.found) { cs = await keyUntil(p, (f) => f.raw === 'button_tech_view_column_selection', 60, 'Tab', N); o.s8.reach = { by: 'Tab', found: cs.found, stops: cs.seen.slice(-10) }; }
  if (cs.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.s8.menuOpenAfterEnter = await menuOpen(p); const fIn = await kp(p, 'Tab', N); o.s8.afterTab = { ...fIn, insideMenu: await p.evaluate(`!!(document.activeElement && document.activeElement.closest('.q-menu'))`) }; await shot(p, 'C368151-r4-s8-column-selection-open');
    const fe = await kp(p, 'Escape', N); await p.waitForTimeout(700); o.s8.afterEscape = { menusOpen: await menuOpen(p), focus: kshort(fe), backOnColumnSelection: (await kz(p, N)).raw === 'button_tech_view_column_selection' }; await shot(p, 'C368151-r4-s8-after-escape'); }
  // step 9: the Status chip by keyboard; inside the options Home / ArrowDown, then focus on the first option (script, logged), then Tab
  const chipText = () => p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  let sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 30, 'Shift+Tab', N); o.s9 = { reach: { by: 'Shift+Tab', found: sc.found, stops: sc.seen.slice(-12) } };
  if (!sc.found) { sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 60, 'Tab', N); o.s9.reach = { by: 'Tab', found: sc.found, stops: sc.seen.slice(-12) }; }
  o.s9.chipAtStart = await chipText();
  if (sc.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s9.optionsOpen = await menuOpen(p); const keys9: any[] = [{ key: 'Enter (open)', ...(await optState4(p)) }]; o.s9.keys = keys9;
    const hit = (st: any) => /^Approved$/i.test(String(st?.highlighted)) || /\bApproved$/i.test(String(st?.active));
    let reached = false; const press = async (k: string) => { await p.keyboard.press(k); await p.waitForTimeout(300); const st = await optState4(p); keys9.push({ key: k, ...st }); if (hit(st)) reached = true; return st; };
    // (1) Home, then ArrowDown (the menu's own keys)
    const h = await press('Home'); for (let i = 0; i < 12 && !reached; i++) { const st = await press('ArrowDown'); if (i >= 2 && !st?.highlighted && !st?.inMenu && !h?.highlighted) break; }
    o.s9.route = reached ? 'Home / ArrowDown inside the options' : null;
    // (2) focus put on the first option by the script, then ArrowDown
    if (!reached) { const placed = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const it = m && m.querySelector('.q-item, [role=option], [role=checkbox]'); if (!it) return 'no option'; if (!it.hasAttribute('tabindex')) it.setAttribute('tabindex', '-1'); it.focus(); return document.activeElement === it ? 'focused: ' + it.innerText.replace(/\\s+/g, ' ').trim().slice(0, 20) : 'focus() did not take'; })()`).catch((e: any) => String(e));
      keys9.push({ key: 'SCRIPT focus on the first option', placed, ...(await optState4(p)) }); if (hit(keys9[keys9.length - 1])) reached = true;
      for (let i = 0; i < 12 && !reached; i++) await press('ArrowDown'); if (reached) o.s9.route = 'focus put on the first option by the script, then ArrowDown'; }
    // (3) Tab through the options
    if (!reached) { for (let i = 0; i < 12 && !reached; i++) await press('Tab'); if (reached) o.s9.route = 'Tab through the options'; }
    o.s9.toApproved = { found: reached, route: o.s9.route };
    if (reached) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s9.afterEnter = { chip: await chipText(), ...(await optState4(p)) };
      if (!(o.s9.afterEnter.ticked ?? []).some((x: string) => /Approved/i.test(x)) && !/Approved/i.test(String(o.s9.afterEnter.chip))) { await p.keyboard.press('Space'); await p.waitForTimeout(1500); o.s9.afterSpace = { chip: await chipText(), ...(await optState4(p)) }; } }
    await shot(p, 'C368151-r4-s9-approved-ticked'); const ce = await kp(p, 'Escape', N); await p.waitForTimeout(700); o.s9.closed = { menusOpen: await menuOpen(p), focus: kshort(ce), chip: await chipText() }; }
  // the chip's x by keyboard, Enter
  const xs = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c && (/remove|clear|cancel|close/i.test((e.getAttribute('aria-label') || '') + ' ' + e.className + ' ' + (e.textContent || ''))); })()`) as Promise<boolean>, 6, 'Tab', N);
  o.s9.toX = { by: 'Tab', found: xs.found, stops: xs.seen };
  if (!xs.found) { const xb = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c; })()`) as Promise<boolean>, 30, 'Shift+Tab', N); o.s9.toX = { by: 'Shift+Tab (Tab did not reach it)', found: xb.found, stops: xb.seen.slice(-10) }; }
  if (o.s9.toX.found) { o.s9.xFocus = await kz(p, N); await p.keyboard.press('Enter'); await p.waitForTimeout(1800); }
  o.s9.chipAfterX = await chipText(); await shot(p, 'C368151-r4-s9-after-x');
  console.log(t(), 'C368151 step 9', JSON.stringify({ reach: o.s9.reach?.found, toApproved: o.s9.toApproved, afterEnter: o.s9.afterEnter?.chip, afterSpace: o.s9.afterSpace?.chip, closed: o.s9.closed, toX: o.s9.toX?.found, chipAfterX: o.s9.chipAfterX, keys: (o.s9.keys ?? []).slice(0, 8) }));
  // step 10 (as kbd-fix4)
  let bv = await keyUntil(p, (f) => f.label === 'Board View', 40, 'Shift+Tab', N); o.s10 = { reach: { by: 'Shift+Tab', found: bv.found, stops: bv.seen.slice(-8) } };
  if (!bv.found) { bv = await keyUntil(p, (f) => f.label === 'Board View', 60, 'Tab', N); o.s10.reach = { by: 'Tab', found: bv.found, stops: bv.seen.slice(-8) }; }
  if (bv.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(2500); }
  o.s10.active = await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`); await shot(p, 'C368151-r4-s10-after-enter');
  await statusOnly(null).catch(() => {}); save4();
});

await run('C97020', async () => {
  // ROUND 4 (17 Oct 2026): the Admin half (steps 7-16). On 17 Oct the Admin's card was never reached: Technician-A was pinned only for the
  // viewer, so the Admin's board drew Esther Howard's column after Unassigned and Work-order-2 was not on screen. Now Technician-A is pinned
  // for the Admin (the case's precondition) and Work-order-2's card is read back on the board (positive control) before any key. Focus
  // reaches the card by the keyboard (Search > Tab > arrows); only if that fails is it put ON the card by the script (logged as such).
  // Step 11/12 read the disabled "Reassign lead technician" item's note while it is highlighted by the keyboard (item text, aria, title,
  // describedby text, visible tooltips) and, as the positive control, the same item hovered with the mouse after step 13.
  // Steps 1-6 (the view-only user) were read on 17 Oct and are not repeated here.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Limits', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }]); const N = nm(s); const id2 = s.w['Bravo Co'].id;
  const o: any = (R.C97020 = { statuses: (await workOrders(a, s.q)).map((w: any) => `${nameOf(s)(w.number)} ${w.number} ${w.status}`) });
  console.log(t(), 'START STATE found C97020', JSON.stringify({ statuses: o.statuses, pins: (await prefFor()).pinnedTechnicianIds ?? [] }));
  const place = async (pg: Page, w: string) => (await colOf(pg, w)).replace(ANA.staff_id, 'Technician-A').replace(BEN.staff_id, 'Technician-B');
  o.adminPins = await kPrefs([ANA.staff_id]); o.adminStart = await kStart(p, 'Board View', s.q);
  o.control = { wo2Column: await place(p, id2), pinnedSaved: ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id) };
  console.log(t(), 'START STATE set C97020', JSON.stringify({ adminStart: o.adminStart, control: o.control }));
  if (o.control.wo2Column !== 'Technician-A') { await shot(p, 'C97020-r4-control-failed'); throw new Error(`positive control failed: Work-order-2 card is "${o.control.wo2Column}", not in Technician-A's column`); }
  // step 7-9
  o.s7 = await kSearch(p, N); await shot(p, 'C97020-r4-s7-admin-search');
  o.s8 = await kTabIn(p, 'board', N); await p.mouse.move(1, 1); await shot(p, 'C97020-r4-s8-admin-tab');
  o.s9 = await kArrowsTo(p, (f) => f.raw === 'board_card_Bravo Co', 'board', N); o.s9.route = o.s9.reached ? 'arrow keys' : null;
  if (!o.s9.reached) { o.s9.scriptFocus = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${id2}"]'); if (!c) return 'no card'; c.focus(); return document.activeElement === c ? 'focus put on the card by the script' : 'focus() did not take'; })()`); o.s9.focusAfterScript = kshort(await kz(p, N)); o.s9.route = o.s9.scriptFocus; }
  await p.mouse.move(1, 1); await shot(p, 'C97020-r4-s9-admin-card');
  // step 10
  o.s10 = await kp(p, 'Tab', N); await p.mouse.move(1, 1); await p.waitForTimeout(500); o.s10.onOwnMoreActions = /more_actions/.test(o.s10.raw) && o.s10.card === 'board_card_Bravo Co'; o.s10.moreShows = await kMore(p, id2); await shot(p, 'C97020-r4-s10-admin-more');
  // step 11: Enter opens the menu; the disabled item read in full
  const itemRead = () => p.evaluate(`(() => { const it = [...document.querySelectorAll('.q-menu .q-item')].find(e => /Reassign lead technician/i.test(e.innerText)); if (!it) return null; const d = it.getAttribute('aria-describedby');
    return { text: it.innerText.replace(/\\s+/g, ' ').trim(), disabled: it.classList.contains('disabled') || it.classList.contains('q-item--disabled') || it.getAttribute('aria-disabled') === 'true', tabindex: it.getAttribute('tabindex'), title: it.getAttribute('title'), ariaLabel: it.getAttribute('aria-label'), describedBy: d ? (document.getElementById(d) || {}).innerText || ('id ' + d) : null,
      highlighted: it.classList.contains('q-manual-focusable--focused') || it.classList.contains('q-item--focused') || it === document.activeElement || it.contains(document.activeElement), box: (() => { const r = it.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })() }; })()`).catch(() => null) as Promise<any>;
  const tipsNow = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []) as Promise<string[]>;
  const NOTE = /can.t be changed once a work order is Invoiced or Paid/i;
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.s11 = { menusOpen: await menuOpen(p), items: await menuItems(p), item: await itemRead(), tooltips: await tipsNow(), noteExpected: 'The lead technician can’t be changed once a work order is Invoiced or Paid.' }; await shot(p, 'C97020-r4-s11-menu');
  // step 12: arrows to the item (each key read: focus, highlight, the item, tooltips), then Enter
  const keys12: any[] = []; o.s12 = { keys: keys12 };
  for (let i = 0; i < 6; i++) { const f = await kp(p, 'ArrowDown', N); await p.waitForTimeout(700); const it = await itemRead(); keys12.push({ key: 'ArrowDown', focus: kshort(f), focusText: f.text, itemHighlighted: it?.highlighted, tooltips: await tipsNow() }); if (it?.highlighted || /Reassign lead technician/i.test(f.text)) break; }
  await p.waitForTimeout(1200); o.s12.onItem = { item: await itemRead(), tooltips: await tipsNow() }; await shot(p, 'C97020-r4-s12-item-by-keyboard');
  o.s12.noteOnKeyboard = [o.s12.onItem.item?.text, o.s12.onItem.item?.title, o.s12.onItem.item?.describedBy, ...(o.s12.onItem.tooltips ?? [])].some((x: any) => NOTE.test(String(x ?? '')));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.s12.dialogs = await p.locator('.q-dialog').count(); o.s12.menusAfterEnter = await menuOpen(p); o.s12.messages = await toastsOn(p); await shot(p, 'C97020-r4-s12-after-enter');
  if (o.s12.dialogs) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); }
  // step 13
  o.s13 = { ...(await kp(p, 'Escape', N)), menusOpen: await menuOpen(p) }; o.s13.backOnMoreActions = /more_actions/.test(o.s13.raw) && o.s13.card === 'board_card_Bravo Co'; await shot(p, 'C97020-r4-s13-after-escape');
  // positive control for the note: the same menu, the item hovered with the mouse (reopened with Enter from More actions)
  { const c: any = { reopenedFrom: kshort(await kz(p, N)) }; if (!o.s13.backOnMoreActions) await p.locator(`[data-test-id="board_card_${id2}"] [data-test-id="button_work_order_more_actions"]`).first().focus().catch(() => {});
    await p.keyboard.press('Enter'); await p.waitForTimeout(1000); c.menusOpen = await menuOpen(p); const it = await itemRead();
    if (it?.box) { await p.mouse.move(it.box.x + it.box.w / 2, it.box.y + it.box.h / 2, { steps: 6 }); await p.waitForTimeout(1500); c.item = await itemRead(); c.tooltips = await tipsNow(); c.noteOnHover = [c.item?.text, ...(c.tooltips ?? [])].some((x: any) => NOTE.test(String(x ?? ''))); await shot(p, 'C97020-r4-control-item-hover'); }
    else c.item = 'item not found in the reopened menu';
    await p.mouse.move(1, 1); await p.keyboard.press('Escape'); await p.waitForTimeout(700); c.closed = (await menuOpen(p)) === 0; c.focusAfter = kshort(await kz(p, N)); o.noteControl = c; }
  console.log(t(), 'C97020 note', JSON.stringify({ route: o.s9.route, onMoreActions: o.s10.onOwnMoreActions, menu: o.s11.items, keyboard: { note: o.s12.noteOnKeyboard, item: o.s12.onItem.item, tooltips: o.s12.onItem.tooltips }, hover: { note: o.noteControl.noteOnHover, tooltips: o.noteControl.tooltips }, dialogs: o.s12.dialogs }));
  save4();
  // step 14: Space, Shift+arrows — the card must not move
  o.s14 = { focusBefore: kshort(await kz(p, N)), before: await place(p, id2), keys: {} as any };
  for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { const f = await kp(p, k, N); await p.waitForTimeout(700); o.s14.keys[k] = { focus: kshort(f), wo2: await place(p, id2), menusOrDialogs: await p.locator('.q-dialog, .q-menu').count(), opened: /\/workorders\/[0-9a-f-]{36}/.test(p.url()) };
    if (o.s14.keys[k].menusOrDialogs) { await p.keyboard.press('Escape'); await p.waitForTimeout(500); } if (o.s14.keys[k].opened) { await p.goBack(); await p.waitForTimeout(3500); } }
  o.s14.lead = await leadOf(s, 'Bravo Co'); await shot(p, 'C97020-r4-s14-after-keys');
  // step 15-16
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(4500); if (!(await p.locator(`[data-test-id="board_card_${id2}"]`).count())) await ensure(`[data-test-id="board_card_${id2}"]`, s.q);
  o.s15 = { wo2: await place(p, id2), searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) }; await shot(p, 'C97020-r4-s15-after-refresh');
  const cb = await p.locator(`[data-test-id="board_card_${id2}"] [data-test-id="board_card_number"]`).first().boundingBox().catch(() => null);
  if (cb) { await p.mouse.click(cb.x + Math.min(cb.width / 2, 30), cb.y + cb.height / 2); await p.waitForTimeout(4000); }
  o.s16 = { url: clean(p.url().replace(APP, '')), openedWorkOrder2: p.url().includes(id2) }; await shot(p, 'C97020-r4-s16-wo-page');
  o.s16.leadOnPage = await woPageLead(p, APP, id2); o.s16.leadOnRecord = await leadOf(s, 'Bravo Co'); o.s16.expectedLead = 'ZZAUTOTEST Ana Alpha';
  o.runnerRole = 'Admin (ZZ WOB Runner, runner.mts)'; save4();
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
save4();
await RUN.end(); await done(browser);
