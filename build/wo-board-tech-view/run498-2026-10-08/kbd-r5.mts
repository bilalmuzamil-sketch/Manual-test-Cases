/**
 * kbd-r5.mts — 17 Oct 2026, ROUND 5: C368151 step 9 ONLY (ONLY=C368151), the Status filter by KEYBOARD ONLY — no focus ever placed by the
 * script (round 4 put focus on the first option itself, which a case step may not do, L0432). After set-up (kbd-r4's: the case's work order,
 * Tech View, the case's search), the Status chip is reached with Tab from the Search box, Enter opens it, and then Tab x6, Shift+Tab,
 * ArrowDown x5, ArrowUp, Home, End, Space, typing "A" are tried in that order with document.activeElement, aria-activedescendant and any
 * highlighted option read after EVERY key; when Approved is focused / highlighted, Enter (then Space) ticks it, Escape closes, and focus is
 * read. Plain results: keyboardReachedOption, keyboardReachedApproved, approvedTickedByKeyboard. Set-up and helpers are kbd-r4.mts's code
 * (lines 15-292, itself kbd-fix4.mts's), copied unchanged; only the start tag changed. Output EV/kbd-r5-<ONLY>.json; pictures C368151-r5-s9-*.png.
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
await startState(p, a, 'kbd-r5');   // L0415, fix-up 2
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
  fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
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

// ───────────────────────────── ROUND 5 block (17 Oct 2026): C368151 step 9 ONLY, keyboard only ─────────────────────────────
const OUT5 = path.join(EV, `kbd-r5${only.length ? '-' + only.join('-') : ''}.json`);
/** the open Status options as the keyboard sees them: what has focus, aria-activedescendant, the highlighted option, the ticked ones */
const st5 = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const ae = document.activeElement;
  const clean = (x) => String(x || '').replace(/\\s+/g, ' ').replace(/^(check_box_outline_blank|check_box|check)\\s+/i, '').trim();
  const opt = (e) => e && e.closest && e.closest('[data-test-id^="filter_option_status_"]');
  const items = m ? [...m.querySelectorAll('[data-test-id^="filter_option_status_"], .q-item, [role=option], [role=checkbox]')] : [];
  const hi = items.find(e => e.classList.contains('q-manual-focusable--focused') || e.classList.contains('q-item--focused') || e.classList.contains('q-item--active'));
  const ad = ae && ae.getAttribute('aria-activedescendant'); const adEl = ad ? document.getElementById(ad) : null; const fo = opt(ae);
  return { active: ae ? ((ae.getAttribute('data-test-id') || ae.tagName) + ' ' + clean(ae.innerText || ae.getAttribute('aria-label') || ae.value).slice(0, 30)) : 'none', focusedOption: fo ? fo.getAttribute('data-test-id').replace('filter_option_status_', '') : null,
    activedescendant: ad ? (adEl ? clean(adEl.innerText).slice(0, 30) : 'id ' + ad) : null, highlighted: hi ? clean(hi.innerText).slice(0, 30) : null, menuOpen: !!m, inMenu: !!(ae && m && m.contains(ae)),
    ticked: items.filter(e => e.querySelector('.q-checkbox__inner--truthy, [aria-checked=true]') || e.getAttribute('aria-checked') === 'true').map(e => clean(e.innerText).slice(0, 20)) }; })()`).catch(() => null) as Promise<any>;
const isApproved = (s: any) => s?.focusedOption === 'approved' || /^Approved$/i.test(String(s?.highlighted)) || /^Approved$/i.test(String(s?.activedescendant));
const somethingHighlighted = (s: any) => !!(s?.focusedOption || s?.highlighted || s?.activedescendant);

await run('C368151', async () => {
  // ROUND 5 (17 Oct 2026): ONLY step 9 ("Using the keyboard, open Status, select Approved, and close the options. Focus the Status chip's
  // x and press Enter"). In round 4 Home and 13 ArrowDown highlighted nothing and the script then put focus on the first option itself —
  // not allowed for a case step (L0432). Here the KEYBOARD ONLY is used after set-up: the Status chip reached with Tab / Shift+Tab from the
  // Search box, Enter to open, then in this order — Tab x6, Shift+Tab, ArrowDown x5, ArrowUp, Home, End, Space, typing "A" — with what has
  // focus, aria-activedescendant and any highlighted option read after EVERY key; it stops when Approved is focused / highlighted, then
  // Enter (Space if Enter did not tick) and the tick + chip read; Escape and where focus returns. The script NEVER places focus.
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls One', [{ co: 'Alpha Co', lead: ANA }]); const N = nm(s);
  const o: any = (R.C368151 = { data: { q: s.q, wo: s.w['Alpha Co'].number }, scriptFocusPlacement: 'never' });
  console.log(t(), 'START STATE found C368151 step 9', JSON.stringify({ filters: (await prefFor()).filters ?? null }));
  o.prefs = await kPrefs([]); o.start = await kStart(p, 'Tech View', s.q);
  const chipText = () => p.locator('[data-test-id="filter_chip_status"]').first().innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  o.chipAtStart = await chipText();
  console.log(t(), 'START STATE set C368151 step 9', JSON.stringify({ start: o.start, chip: o.chipAtStart }));
  // the Status chip by keyboard (Search box clicked for set-up, then Tab; Shift+Tab if Tab does not reach it)
  await clickSearch(p); let sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 12, 'Tab', N); o.reach = { by: 'Tab from the Search box', found: sc.found, stops: sc.seen };
  if (!sc.found) { sc = await keyUntil(p, (f) => f.raw === 'filter_chip_status', 40, 'Shift+Tab', N); o.reach = { by: 'Shift+Tab', found: sc.found, stops: sc.seen.slice(-12) }; }
  if (!sc.found) { o.keyboardReachedOption = false; o.approvedTickedByKeyboard = false; o.note = 'the Status chip was not reached by the keyboard'; await shot(p, 'C368151-r5-s9-chip-not-reached'); return; }
  await p.keyboard.press('Enter'); await p.waitForTimeout(1200); const keys: any[] = [{ key: 'Enter (open)', ...(await st5()) }]; o.keys = keys; await shot(p, 'C368151-r5-s9-open');
  const seq = ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Space', 'a'];
  let reached = isApproved(keys[0]); let firstHighlightPic = somethingHighlighted(keys[0]);
  for (const k of seq) { if (reached) break; if (k === 'a') await p.keyboard.type('A'); else await p.keyboard.press(k); await p.waitForTimeout(400);
    const s1 = await st5(); keys.push({ key: k === 'a' ? 'typed "A"' : k, ...s1 });
    if (!firstHighlightPic && somethingHighlighted(s1)) { firstHighlightPic = true; await shot(p, 'C368151-r5-s9-first-highlight'); o.firstHighlightAfter = k; }
    if (!s1?.menuOpen) { o.menuClosedBy = k; break; }
    if (isApproved(s1)) { reached = true; o.reachedBy = k; } }
  o.keyboardReachedOption = keys.some((x) => !!x.focusedOption || !!x.highlighted || !!x.activedescendant);
  o.keyboardReachedApproved = reached;
  if (reached) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.afterEnter = { chip: await chipText(), ...(await st5()) };
    if (!(o.afterEnter.ticked ?? []).some((x: string) => /Approved/i.test(x)) && !/Approved/i.test(String(o.afterEnter.chip))) { await p.keyboard.press('Space'); await p.waitForTimeout(1500); o.afterSpace = { chip: await chipText(), ...(await st5()) }; }
    await shot(p, 'C368151-r5-s9-after-tick'); }
  o.approvedTickedByKeyboard = reached && [o.afterEnter, o.afterSpace].some((x: any) => x && ((x.ticked ?? []).some((y: string) => /Approved/i.test(y)) || /Approved/i.test(String(x.chip))));
  // close the options with Escape; where does focus go?
  const ce = await kp(p, 'Escape', N); await p.waitForTimeout(700); o.afterEscape = { focus: kshort(ce), backOnChip: ce.raw === 'filter_chip_status', menusOpen: await menuOpen(p), chip: await chipText() }; await shot(p, 'C368151-r5-s9-after-escape');
  // the chip's x by keyboard, Enter (only if Approved was ticked)
  if (o.approvedTickedByKeyboard) { const xs = await keyUntil(p, async () => p.evaluate(`(function () { var e = document.activeElement; var c = e && e.closest('[data-test-id="filter_chip_status"]'); return !!c && e !== c; })()`) as Promise<boolean>, 6, 'Tab', N); o.toX = { found: xs.found, stops: xs.seen };
    if (xs.found) { o.xFocus = kshort(await kz(p, N)); await p.keyboard.press('Enter'); await p.waitForTimeout(1800); } o.chipAfterX = await chipText(); await shot(p, 'C368151-r5-s9-after-x'); }
  console.log(t(), 'C368151 step 9 keyboard only', JSON.stringify({ keyboardReachedOption: o.keyboardReachedOption, keyboardReachedApproved: o.keyboardReachedApproved, approvedTickedByKeyboard: o.approvedTickedByKeyboard, reachedBy: o.reachedBy ?? null, afterEscape: o.afterEscape, toX: o.toX?.found ?? null, chipAfterX: o.chipAfterX ?? null, keys: keys.map((x) => `${x.key} -> ${x.active} | opt=${x.focusedOption} hi=${x.highlighted} ad=${x.activedescendant}`) }));
  await statusOnly(null).catch(() => {}); fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
