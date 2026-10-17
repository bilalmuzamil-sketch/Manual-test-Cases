/**
 * s9-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C97003 alone (ONLY=C97003), "A view-only user can reorder
 * technician columns and Unassigned stays first". Steps 6 and 10 were not done twice:
 *   step 6 — Ana's column was off screen when Cal was let go (centring Cal at scrollLeft ~59,800 pushed Ana out, L0430). Now Ana's column
 *     is put just right of the sticky Unassigned column and the window widened (2560 px up to 7680 px) until Cal's column is on screen too;
 *     both header boxes, the columns in view and what is under the drop point (before the press and while held) are logged.
 *   step 10 — Ben's group grip was never drawn: the old code walked the table to the BOTTOM first and then looked for Ben scrolling further
 *     DOWN. Now the table is scrolled from the TOP until Ben's group header is drawn; if Unassigned is not on screen at the same time the
 *     grip is held while the table scrolls up until Unassigned's header is drawn, then released on it. Group order is read WITHOUT clicks.
 * Everything else is s9-fix7.mts's proven code, copied unchanged below (lines 6-193); only the output file changed.
 * Output EV/s9-r4-<ONLY>.json; pictures EV/C97003-r4-*.png. Records only; no TestRail, no Jira.
 * ───────────────────────────── COPIED FROM s9-fix7.mts (lines 6-193, 17 Oct 2026) ─────────────────────────────
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

/** FIX-UP 2 (17 Oct 2026, C97003): on 16 Oct the view-only user's drags found no grip ("no handle/target (false/true)"): the grip was
 *  looked for as a material "drag_indicator" icon, but staging draws it as its own element (board_column_drag_handle_<id> /
 *  tech_view_group_drag_handle_<id>, L0415), and the test's columns sit far right among ~100 technicians. This brings the dragged
 *  column/group on screen first (header scrolled into view, horizontal scroller position logged with the columns in view), takes the
 *  grip by its test id (else .board-column-header__grip, else the old icon), pictures before/after, and says what was found. */
async function gripDrag(pg: Page, kind: 'board' | 'tech', id: string, toSel: string, dx: number, tag: string) {
  const o: any = {}; const head = kind === 'board' ? hdr(id) : `[data-test-id="tech_view_group_${id}"]`;
  if (kind === 'board') { for (let i = 0; i < 400 && !(await pg.locator(head).count()); i++) { const mv = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`).catch(() => false); await pg.waitForTimeout(300); if (!mv) break; } }
  else await toGroup(pg, id);
  await pg.locator(head).first().scrollIntoViewIfNeeded().catch(() => {}); await pg.evaluate(`document.querySelector(${JSON.stringify(head)})?.scrollIntoView({ block: 'center', inline: 'center' })`).catch(() => {}); await pg.waitForTimeout(800);
  o.scrollLeft = await pg.evaluate(`(document.querySelector('[data-test-id="board_view_scroller"]') || {}).scrollLeft ?? null`).catch(() => null);
  if (kind === 'board') o.inView = named(await visibleIds(pg), IDS);
  const gid = kind === 'board' ? `board_column_drag_handle_${id}` : `tech_view_group_drag_handle_${id}`;
  let grip = pg.locator(`[data-test-id="${gid}"]`).first(); o.grip = (await grip.count()) ? 'test id' : null;
  if (!o.grip) { grip = pg.locator(head).locator('.board-column-header__grip, .tech-view-group-header__grip, [class*="grip"]').first(); o.grip = (await grip.count()) ? 'grip class' : null; }
  if (!o.grip) { grip = pg.locator(head).locator('i, .q-icon').filter({ hasText: 'drag_indicator' }).first(); o.grip = (await grip.count()) ? 'drag_indicator icon' : 'NOT FOUND'; }
  await grip.scrollIntoViewIfNeeded().catch(() => {});
  const hb = await grip.boundingBox().catch(() => null); const tb = await pg.locator(toSel).first().boundingBox().catch(() => null); o.gripBox = !!hb; o.targetBox = !!tb;
  await shot(pg, `C97003-${tag}-before`);
  if (!hb || !tb) { o.drag = `not made: grip ${!!hb}, target ${!!tb}`; return o; }
  await pg.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2); await pg.mouse.down(); await pg.mouse.move(hb.x + 12, hb.y + 4, { steps: 4 });
  await pg.mouse.move(tb.x + dx, tb.y + tb.height / 2, { steps: 20 }); await pg.waitForTimeout(500); await shot(pg, `C97003-${tag}-holding`); await pg.mouse.up(); await pg.waitForTimeout(2500);
  o.drag = 'made'; await shot(pg, `C97003-${tag}-after`); return o; }

// ───────────────────────────── ROUND 4 block (17 Oct 2026) ─────────────────────────────
import { startState } from './fixup-1017.mts';
const OUT4 = path.join(EV, `s9-r4${only.length ? '-' + only.join('-') : ''}.json`);
const save4 = () => fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
await startState(p, a, 's9-r4');
const scrollerSel = '[data-test-id="board_view_scroller"]';
const boxOf = async (pg: Page, sel: string) => { const b = await pg.locator(sel).first().boundingBox({ timeout: 1500 }).catch(() => null); return b ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), r: Math.round(b.x + b.width), b: Math.round(b.y + b.height) } : null; };
/** which board column (or Tech View group row) is under a point */
const colAt = (pg: Page, x: number, y: number) => pg.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); if (!e) return 'nothing'; for (let a = e; a; a = a.parentElement) { const t = a.getAttribute && a.getAttribute('data-test-id'); if (t && /^board_column_(header_)?([0-9a-f-]{36}|unassigned)$/.test(t)) return t.replace(/^board_column_(header_)?/, ''); } return e.tagName; })()`).catch(() => 'error') as Promise<string>;
const nm1 = (id: string) => id === 'unassigned' ? 'Unassigned' : (Object.keys(IDS).find((k) => (IDS as any)[k] === id) ?? (/^[0-9a-f-]{36}$/.test(id) ? 'another technician' : id));
/** Board View: make BOTH columns render on screen — the LEFT one placed just right of the sticky Unassigned column; the window is widened
 *  (never narrowed below 2560 px) until the RIGHT one is inside it too. Returns both header boxes and what was done. */
async function bothOnScreen(pg: Page, leftId: string, rightId: string) {
  const d: any = { widths: [] as number[] };
  for (let attempt = 0; attempt < 4; attempt++) {
    await showCols(pg, leftId);
    const un = await boxOf(pg, hdr('unassigned')); const l0 = await boxOf(pg, hdr(leftId));
    if (un && l0) { await pg.evaluate(`(() => { const h = document.querySelector('${scrollerSel}'); if (h) h.scrollLeft += ${l0.x - (un.r + 24)}; })()`).catch(() => {}); await pg.waitForTimeout(900); }
    const l = await boxOf(pg, hdr(leftId)), r = await boxOf(pg, hdr(rightId)), u = await boxOf(pg, hdr('unassigned')); const vw = pg.viewportSize()?.width ?? 2560;
    d.left = l; d.right = r; d.unassigned = u; d.viewport = vw; d.scrollLeft = await pg.evaluate(`(document.querySelector('${scrollerSel}') || {}).scrollLeft ?? null`).catch(() => null);
    d.ok = !!(l && r && u && l.x >= u.r - 2 && r.r <= vw && l.r <= vw); if (d.ok) break;
    const need = r ? r.r + 200 : (l ? l.r + 2400 : vw + 1600); const w = Math.min(7680, Math.max(vw + 400, need)); if (w === vw) break;
    await pg.setViewportSize({ width: w, height: VW.height }); d.widths.push(w); await pg.waitForTimeout(1200);
  }
  d.inView = (await visibleIds(pg)).map(nm1); return d;
}
/** drag a column / group by its six-dot grip to a point; the point is checked (what is under it) before the press and while held */
async function gripTo(pg: Page, kind: 'board' | 'tech', id: string, to: { x: number; y: number }, tag: string) {
  const o: any = {}; const gid = kind === 'board' ? `board_column_drag_handle_${id}` : `tech_view_group_drag_handle_${id}`;
  const g = await boxOf(pg, `[data-test-id="${gid}"]`); o.grip = g ? 'found by test id' : 'NOT FOUND'; o.gripBox = g;
  if (kind === 'board') o.underDropBefore = nm1(await colAt(pg, to.x, to.y));
  await shot(pg, `C97003-r4-${tag}-before`);
  if (!g) { o.drag = 'not made: no grip'; return o; }
  await pg.mouse.move(g.x + g.w / 2, g.y + g.h / 2); await pg.mouse.down(); await pg.mouse.move(g.x + g.w / 2 + 12, g.y + g.h / 2 + 4, { steps: 4 });
  await pg.mouse.move(to.x, to.y, { steps: 24 }); await pg.waitForTimeout(700);
  if (kind === 'board') o.underDropHeld = nm1(await colAt(pg, to.x, to.y));
  await shot(pg, `C97003-r4-${tag}-holding`); await pg.mouse.up(); await pg.waitForTimeout(2500); o.drag = 'made'; o.messages = await toastsOn(pg); await shot(pg, `C97003-r4-${tag}-after`); return o; }
/** Tech View group ids in screen order WITHOUT clicking anything: the table walked from the top */
async function techOrder(pg: Page) {
  const seen: string[] = []; await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await pg.waitForTimeout(700);
  for (let i = 0; i < 400; i++) { for (const x of (await pg.evaluate(`[...document.querySelectorAll('.q-virtual-scroll__content > tr')].map(e => e.getAttribute('data-test-id') || '').filter(t => /^tech_view_group_([0-9a-f-]{36}|unassigned)$/.test(t)).map(t => t.replace('tech_view_group_', ''))`).catch(() => []) as string[])) if (!seen.includes(x)) seen.push(x);
    const moved = await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 600; return s.scrollTop !== b; })()`).catch(() => false); await pg.waitForTimeout(250); if (!moved) break; }
  await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await pg.waitForTimeout(500); return seen; }

await run('C97003', async () => {
  // ROUND 4 (17 Oct 2026): steps 6 and 10 were not done twice (step 6: Ana's column off screen when Cal was let go; step 10: Ben's group
  // never drawn — the old code looked for it scrolling DOWN from the bottom of the table). Now: step 6 puts Ana's column just right of the
  // sticky Unassigned column and widens the window until Cal's column is on screen too (both boxes logged, and what is under the drop point
  // before the press and while held); step 10 scrolls Tech View from the TOP until Ben's group header is drawn, and if Unassigned is not
  // drawn at the same time the grip is held while the table scrolls up until it is. The group order is read without clicking anything.
  const s = await mkSet('ZZAUTOTEST F3 Viewer Column Order', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]); const o: any = {}; R.C97003 = o;
  await goP(p, 'Board View', s.q); const dAll = await allCols(p); o.dispatcherStart = named(dAll, IDS);
  const viewer = await mkUser('ZZAUTOTEST', `Viewer5 ${stamp}`, VIEW_ROLE, 'viewer5');
  o.viewer = { name: `ZZAUTOTEST Viewer5 ${stamp}`, role: viewer?.role_label ?? null };
  console.log(t(), 'START STATE found C97003', JSON.stringify({ dispatcher: o.dispatcherStart, data: s.q, viewer: o.viewer }));
  const v = await asUser(viewer);
  try { const pg = v.page; await pg.setViewportSize(VW);
    o.viewerPrefs = await (async () => { const pv = (await a.get(PREF)).body?.data?.value ?? {}; return { pins: pv.pinnedTechnicianIds ?? [], savedOrder: (pv.technicianOrder ?? []).length }; })();
    await goP(pg, 'Board View', s.q);
    const all5 = await allCols(pg); o.step5 = named(all5, IDS); const ix = (id: string) => all5.indexOf(id);
    o.step5gaps = { anaAt: ix(ANA.staff_id), benAt: ix(BEN.staff_id), calAt: ix(CAL.staff_id), columns: all5.length, othersBetweenAnaAndCal: Math.max(0, ix(CAL.staff_id) - ix(ANA.staff_id) - 2) };
    console.log(t(), 'START STATE set C97003', JSON.stringify({ viewerPrefs: o.viewerPrefs, step5: o.step5, gaps: o.step5gaps })); await shot(pg, 'C97003-r4-step5');
    // step 6: Cal's grip onto Ana's header (left part), both on screen
    o.step6screen = await bothOnScreen(pg, ANA.staff_id, CAL.staff_id);
    if (o.step6screen.ok) { const an = o.step6screen.left; o.step6drag = await gripTo(pg, 'board', CAL.staff_id, { x: an.x + 10, y: an.y + an.h / 2 }, 'step6'); }
    else o.step6drag = 'not made: Ana and Cal could not both be put on screen';
    o.step6 = named(await allCols(pg), IDS); await shot(pg, 'C97003-r4-step6');
    console.log(t(), 'C97003 step 6', JSON.stringify({ screen: { ok: o.step6screen.ok, inView: o.step6screen.inView, widths: o.step6screen.widths }, drag: o.step6drag, order: o.step6 })); save4();
    // step 7: Ben's grip onto the Unassigned header (left part)
    const ord6 = await allCols(pg); const firstTech = ord6.find((x) => x !== 'unassigned') ?? BEN.staff_id;
    o.step7screen = await bothOnScreen(pg, firstTech === BEN.staff_id ? BEN.staff_id : firstTech, BEN.staff_id);
    { const u = o.step7screen.unassigned; if (o.step7screen.ok && u) o.step7drag = await gripTo(pg, 'board', BEN.staff_id, { x: u.x + 8, y: u.y + u.h / 2 }, 'step7'); else o.step7drag = 'not made: Ben and Unassigned not both on screen'; }
    o.step7 = named(await allCols(pg), IDS); await shot(pg, 'C97003-r4-step7');
    // step 8: Unassigned has no grip; its header pressed and moved to the right of Cal
    o.step8handle = { testId: await pg.locator('[data-test-id="board_column_drag_handle_unassigned"]').count(), gripClass: await pg.locator('[data-test-id="board_column_header_unassigned"] .board-column-header__grip').count() };
    const ord7 = await allCols(pg); const firstTech7 = ord7.find((x) => x !== 'unassigned') ?? CAL.staff_id;
    o.step8screen = await bothOnScreen(pg, firstTech7, CAL.staff_id);
    { const u = o.step8screen.unassigned, c = o.step8screen.right; if (u && c) { await pg.mouse.move(u.x + 60, u.y + u.h / 2); await pg.mouse.down(); await pg.mouse.move(u.x + 80, u.y + u.h / 2, { steps: 4 }); await pg.mouse.move(c.r - 10, c.y + c.h / 2, { steps: 20 }); await pg.waitForTimeout(500); await shot(pg, 'C97003-r4-step8-holding'); await pg.mouse.up(); await pg.waitForTimeout(2500); o.step8drag = 'made'; } else o.step8drag = `not made: unassigned ${!!u}, cal ${!!c}`; }
    o.step8 = named(await allCols(pg), IDS); save4();
    // step 10: Tech View, Ben's group header onto / above the Unassigned group
    await pg.setViewportSize(VW); await display(pg, 'Tech View'); await pg.waitForTimeout(3000);
    o.techBefore = named(await techOrder(pg), IDS); await shot(pg, 'C97003-r4-tech');
    const benHdr = `[data-test-id="tech_view_group_${BEN.staff_id}"]`, unHdr = '[data-test-id="tech_view_group_unassigned"]';
    await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await pg.waitForTimeout(600);
    let k = 0; for (; k < 300 && !(await pg.locator(benHdr).count()); k++) { const mv = await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 300; return s.scrollTop !== b; })()`).catch(() => false); await pg.waitForTimeout(250); if (!mv) break; }
    await pg.evaluate(`document.querySelector(${JSON.stringify(benHdr)})?.scrollIntoView({ block: 'center' })`).catch(() => {}); await pg.waitForTimeout(800);
    o.step10find = { scrolls: k, benDrawn: (await pg.locator(benHdr).count()) > 0, ben: await boxOf(pg, benHdr), unassigned: await boxOf(pg, unHdr), grip: await boxOf(pg, `[data-test-id="tech_view_group_drag_handle_${BEN.staff_id}"]`), viewportH: pg.viewportSize()?.height };
    const vh = pg.viewportSize()?.height ?? VW.height; const onScr = (b: any) => !!b && b.y >= 0 && b.b <= vh;
    if (o.step10find.grip) {
      if (onScr(o.step10find.unassigned)) { const u = o.step10find.unassigned; o.step10drag = await gripTo(pg, 'tech', BEN.staff_id, { x: u.x + 200, y: u.y + Math.max(3, u.h * 0.25) }, 'step10'); o.step10route = 'both on screen'; }
      else { // hold the grip and scroll the table up while held, until the Unassigned header is drawn on screen
        const g = o.step10find.grip; await shot(pg, 'C97003-r4-step10-before'); await pg.mouse.move(g.x + g.w / 2, g.y + g.h / 2); await pg.mouse.down(); await pg.mouse.move(g.x + g.w / 2 + 12, g.y + g.h / 2 - 6, { steps: 4 });
        let u: any = null; let i = 0; for (; i < 120; i++) { await pg.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop -= 300; })()`).catch(() => {}); await pg.mouse.move(g.x + g.w / 2 + 12 + (i % 2 ? 4 : -4), Math.max(5, g.y - 40), { steps: 2 }); await pg.waitForTimeout(250); u = await boxOf(pg, unHdr); if (onScr(u)) break; }
        o.step10route = `grip held, table scrolled up ${i} times`; if (u && onScr(u)) { await pg.mouse.move(u.x + 200, u.y + Math.max(3, u.h * 0.25), { steps: 20 }); await pg.waitForTimeout(700); await shot(pg, 'C97003-r4-step10-holding'); }
        await pg.mouse.up(); await pg.waitForTimeout(2500); o.step10drag = { drag: u && onScr(u) ? 'made: released on the Unassigned header' : 'released WITHOUT reaching the Unassigned header', messages: await toastsOn(pg) }; await shot(pg, 'C97003-r4-step10-after'); }
    } else o.step10drag = 'not made: Ben\'s grip not drawn';
    o.step10 = named(await techOrder(pg), IDS); await shot(pg, 'C97003-r4-step10');
    console.log(t(), 'C97003 step 10', JSON.stringify({ find: o.step10find, route: o.step10route, drag: o.step10drag, before: o.techBefore, after: o.step10 })); save4();
    // step 11: refresh, both views
    await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000); await display(pg, 'Tech View'); await pg.waitForTimeout(2500); o.step11tech = named(await techOrder(pg), IDS);
    await display(pg, 'Board View'); await pg.waitForTimeout(2500); o.step11board = named(await allCols(pg), IDS); await shot(pg, 'C97003-r4-step11');
  } finally { await v.close(); }
  // step 12: the dispatcher's own order
  await goP(p, 'Board View', s.q); o.step12dispatcher = named(await allCols(p), IDS); await shot(p, 'C97003-r4-step12-dispatcher'); R.C97003 = o; save4(); });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
save4();
await RUN.end(); await done(browser);
