/** Keyboard checks, second attempt (2026-10-09): C97021, C368150, C368151, C368152, C97020, C97022.
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
  fs.writeFileSync(path.join(EV, 'kbd-batch.json'), JSON.stringify(R, null, 1));
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
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await pg.keyboard.press('Escape'); await pg.locator('[data-test-id="page_search_toggle"]').click({ force: true }); } await box.click(); await pg.waitForTimeout(300); };


const nm = (s: any) => (raw: string) => { const id = raw.replace(/^(board_card_|tech_view_row_|board_column_header_|tech_view_group_)/, ''); const k = Object.keys(s.w).find((x) => s.w[x].id === id) ?? Object.keys(IDS).find((x) => (IDS as any)[x] === id); return k ? raw.replace(id, k) : raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); };
/** from the first card, walk the board with the arrows: down each column, then right to the next one */
async function walkBoard(pg: Page, s: any) { const N = nm(s); const seen: string[] = []; const t0 = await tabTo(pg, (f) => /^board_card_/.test(f.raw)); if (!t0.found) return { found: false, seen };
  let f = t0.f; seen.push(N(f.raw) + (f.outline ? '*' : ''));
  for (let c = 0; c < 8; c++) { for (let d = 0; d < 8; d++) { await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(200); const g = await focusInfo(pg); if (g.raw === f.raw) break; f = g; seen.push(N(f.raw) + (f.outline ? '*' : '')); }
    await pg.keyboard.press('ArrowUp'); await pg.waitForTimeout(150); for (let u = 0; u < 8; u++) { const g = await focusInfo(pg); if (/^board_column_header_/.test(g.raw)) { seen.push(N(g.raw) + (g.outline ? '*' : '')); await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(150); break; } await pg.keyboard.press('ArrowUp'); await pg.waitForTimeout(150); }
    await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(250); const r = await focusInfo(pg); if (r.raw === f.raw || !/^board_/.test(r.raw)) break; f = r; seen.push(N(f.raw) + (f.outline ? '*' : '')); }
  return { found: true, seen: [...new Set(seen)] }; }
async function arrowToCard(pg: Page, target: string) { const t0 = await tabTo(pg, (f) => /^board_card_/.test(f.raw)); if (!t0.found) return false; let f = t0.f;
  for (let c = 0; c < 8; c++) { for (let d = 0; d < 8; d++) { if (f.raw === target) return true; await pg.keyboard.press('ArrowDown'); await pg.waitForTimeout(200); const g = await focusInfo(pg); if (g.raw === f.raw) break; f = g; }
    if (f.raw === target) return true; await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(250); const r = await focusInfo(pg); if (r.raw === f.raw) return false; f = r; }
  return f.raw === target; }

await run('C97021', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reach', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: BEN }, { co: 'Golf Co', lead: null }]); const o: any = {};
  await goP(p, 'Board View', s.q); await clickSearch(p); o.board = await walkBoard(p, s); await shot(p, 'C97021-board-walk');
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await expandSmallGroups(p).catch(() => {}); await clickSearch(p); const N = nm(s);
  const g0 = await tabTo(p, (f) => /^tech_view_group_|^tech_view_row_/.test(f.raw)); o.techFirst = g0.found ? N(g0.f.raw) : null; const seen: string[] = []; if (g0.found) seen.push(N(g0.f.raw) + (g0.f.outline ? '*' : ''));
  for (const k of ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowRight', 'ArrowDown', 'ArrowDown']) { await p.keyboard.press(k); await p.waitForTimeout(200); const f = await focusInfo(p); seen.push(`${k}:${N(f.raw || f.tid)}${f.outline ? '*' : ''}`); }
  o.techArrows = seen; o.rowsFocusable = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(r => r.tabIndex >= 0 || r.querySelector('[tabindex="0"]')).length`); o.rows = await p.locator('[data-test-id^="tech_view_row_"]').count();
  await shot(p, 'C97021-tech-walk'); R.C97021 = o; });

await run('C368150', async () => { await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Enter Opens', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }]); const id = s.w['Alpha Co'].id; const o: any = {};
  await goP(p, 'Board View', s.q); await clickSearch(p); o.focused = await arrowToCard(p, `board_card_${id}`); const before = await colCards(p, ANA.staff_id, s);
  for (const k of ['Space', 'ArrowDown', 'ArrowUp', 'Control+ArrowDown', 'Alt+ArrowDown', 'Shift+ArrowDown', 'Shift+ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(700); (o.keys ??= {})[k] = /\/workorders\/[0-9a-f-]{36}/.test(p.url()) ? 'opened' : 'stayed'; if (o.keys[k] === 'opened') { await p.goBack(); await p.waitForTimeout(3500); } }
  o.afterKeys = { ana: await colCards(p, ANA.staff_id, s), before, lead: await leadOf(s, 'Alpha Co') };
  await goP(p, 'Board View', s.q); await clickSearch(p); o.refocused = await arrowToCard(p, `board_card_${id}`); await p.keyboard.press('Enter'); await p.waitForTimeout(3500); o.enter = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); o.enterOpenedAlpha = p.url().includes(id);
  await goP(p, 'Tech View', s.q); await clickSearch(p); const t = await tabTo(p, (f) => /^tech_view_row_/.test(f.raw)); o.techRowFocused = t.found; if (t.found) { await p.keyboard.press('Enter'); await p.waitForTimeout(3000); o.techEnter = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); }
  R.C368150 = o; });

await run('C368151', async () => { await pins([ANA.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Controls', [{ co: 'Alpha Co', lead: ANA }]); const id = s.w['Alpha Co'].id; const o: any = {};
  await goP(p, 'Board View', s.q); await clickSearch(p); o.cardFocused = await arrowToCard(p, `board_card_${id}`);
  o.moreVisibleOnFocus = await p.locator(`[data-test-id="board_card_${id}"] [data-test-id="button_work_order_more_actions"]`).isVisible().catch(() => false);
  await p.keyboard.press('Tab'); await p.waitForTimeout(300); const f1 = await focusInfo(p); o.tabFromCard = f1.raw; await p.keyboard.press('Enter'); await p.waitForTimeout(1000); o.menuByEnter = await p.locator('.q-menu').count(); o.menuItems = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); await shot(p, 'C368151-menu');
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); o.menuAfterEscape = await p.locator('.q-menu').count();
  // the pin in Ana's header: from the card, ArrowUp to the header, then Tab within it
  await clickSearch(p); await arrowToCard(p, `board_card_${id}`); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(300); o.header = (await focusInfo(p)).raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>');
  const pinSeq: string[] = []; for (let i = 0; i < 4; i++) { const f = await focusInfo(p); if (/pin/.test(f.raw)) break; await p.keyboard.press('Tab'); await p.waitForTimeout(250); pinSeq.push((await focusInfo(p)).raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>')); } o.toPin = pinSeq;
  const pinnedBefore = ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id); if (/pin/.test((await focusInfo(p)).raw)) { await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.afterEnter1 = ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.afterEnter2 = ((await prefFor()).pinnedTechnicianIds ?? []).includes(ANA.staff_id); } o.pinnedBefore = pinnedBefore;
  await display(p, 'Tech View'); await p.waitForTimeout(2000); await clickSearch(p); const tg = await tabTo(p, (f) => f.raw === `button_tech_view_group_toggle_${ANA.staff_id}`); o.toggleReached = tg.found;
  if (!tg.found) { const t0 = await tabTo(p, (f) => /^tech_view_group_|^button_tech_view_group_toggle_/.test(f.raw)); const seq: string[] = []; for (let i = 0; i < 8; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); const f = await focusInfo(p); seq.push(f.raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>')); if (f.raw === `button_tech_view_group_toggle_${ANA.staff_id}` || f.raw === `tech_view_group_${ANA.staff_id}`) { o.toggleReached = 'arrows'; break; } } o.techArrowSeq = seq; }
  if (o.toggleReached) { const rows0 = await p.locator(`[data-test-id="tech_view_group_${ANA.staff_id}"] [data-test-id^="tech_view_row_"]`).count(); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); const rows1 = await p.locator(`[data-test-id^="tech_view_row_${id}"]`).count(); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); o.collapse = { rows0, afterFirstEnter: rows1, afterSecondEnter: await p.locator(`[data-test-id^="tech_view_row_${id}"]`).count() }; }
  R.C368151 = o; });

await run('C368152', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Reassign', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA }, { co: 'Charlie Co', lead: ANA }]); const id = s.w['Alpha Co'].id; const o: any = {};
  await goP(p, 'Board View', s.q); await clickSearch(p); o.cardFocused = await arrowToCard(p, `board_card_${id}`); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.onMore = (await focusInfo(p)).raw;
  await p.keyboard.press('Enter'); await p.waitForTimeout(1000); const items = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); o.items = items.map((x) => x.replace(/\s+/g, ' '));
  const idx = items.findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(200); } o.menuFocus = (await p.evaluate(`document.activeElement && document.activeElement.innerText`)) ?? null; await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  o.dialog = await p.locator('.q-dialog').count(); if (o.dialog) { await p.keyboard.type('ZZAUTOTEST Ben', { delay: 40 }); await p.waitForTimeout(1500); const seq: string[] = []; for (let i = 0; i < 6; i++) { const t = (await p.evaluate(`(document.activeElement && document.activeElement.innerText || '').replace(/\\s+/g, ' ').slice(0, 40)`)) as string; seq.push(t); if (/Ben Bravo/.test(t)) break; await p.keyboard.press('ArrowDown'); await p.waitForTimeout(250); } o.dialogSeq = seq; await shot(p, 'C368152-dialog'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); const c2 = p.locator('.q-dialog button').filter({ hasText: /Reassign|Confirm|Save/ }).last(); if (await p.locator('.q-dialog').count()) { const f = await focusInfo(p); o.focusInDialog = f.raw; await p.keyboard.press('Enter'); await p.waitForTimeout(1500); } await shiftPrompt(p, 'Keep shifts').catch(() => {}); o.toasts = await toastsOn(p); }
  o.lead = await leadOf(s, 'Alpha Co');
  // step 6: reorder Ana's remaining cards by keyboard (Bravo first)
  await goP(p, 'Board View', s.q); await clickSearch(p); const before = await colCards(p, ANA.staff_id, s); await arrowToCard(p, `board_card_${s.w['Charlie Co'].id}`); for (const k of ['Alt+ArrowUp', 'Control+ArrowUp', 'Shift+ArrowUp', 'Space']) { await p.keyboard.press(k); await p.waitForTimeout(800); } o.reorder = { before, after: await colCards(p, ANA.staff_id, s) };
  R.C368152 = o; });

await run('C97020', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Limits', [{ co: 'Alpha Co', lead: ANA }, { co: 'Bravo Co', lead: ANA, status: 'invoiced' }]); const o: any = {};
  const viewer = await mkUser('ZZAUTOTEST', `KbdViewer ${stamp}`, VIEW_ROLE, 'kbdviewer'); const v = await asUser(viewer);
  try { const pg = v.page; await a.put(PREF, { value: { ...(await prefFor()), pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } }).catch(() => {}); await goP(pg, 'Board View', s.q); await toColumn(pg, ANA.staff_id).catch(() => {}); await clickSearch(pg);
    o.viewerFocused = await arrowToCard(pg, `board_card_${s.w['Alpha Co'].id}`);
    for (const k of ['Enter', 'Space', 'ArrowDown', 'ArrowRight', 'Shift+ArrowRight', 'Shift+ArrowDown', 'Alt+ArrowRight', 'Control+ArrowRight']) { await pg.keyboard.press(k); await pg.waitForTimeout(700); (o.viewerKeys ??= {})[k] = (await pg.locator('.q-dialog, .q-menu').count()) ? 'menu/dialog' : /\/workorders\/[0-9a-f-]{36}/.test(pg.url()) ? 'opened the work order' : 'nothing'; if (o.viewerKeys[k] !== 'nothing') { await pg.keyboard.press('Escape'); if (/\/workorders\/[0-9a-f-]{36}/.test(pg.url())) { await pg.goBack(); await pg.waitForTimeout(3500); } await clickSearch(pg); await arrowToCard(pg, `board_card_${s.w['Alpha Co'].id}`); } }
    o.viewerMoreActions = await pg.locator(`[data-test-id="board_card_${s.w['Alpha Co'].id}"] [data-test-id="button_work_order_more_actions"]`).count();
  } finally { await v.close(); }
  o.alphaAfterViewer = { lead: await leadOf(s, 'Alpha Co') };
  await goP(p, 'Board View', s.q); await clickSearch(p); o.dispFocused = await arrowToCard(p, `board_card_${s.w['Bravo Co'].id}`); await p.keyboard.press('Tab'); await p.waitForTimeout(300); await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
  const it = p.locator('.q-menu .q-item').filter({ hasText: /Reassign lead technician/i }).first(); o.item = { found: await it.count(), disabled: await it.evaluate((e) => e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('q-item--disabled')).catch(() => null) };
  await it.hover().catch(() => {}); await p.waitForTimeout(1200); o.tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText)`); await shot(p, 'C97020-invoiced-menu');
  const items = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); const idx = items.findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150); } await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.dialogOpened = await p.locator('.q-dialog').count(); await p.keyboard.press('Escape');
  await clickSearch(p); await arrowToCard(p, `board_card_${s.w['Bravo Co'].id}`); for (const k of ['Shift+ArrowRight', 'Alt+ArrowRight', 'Control+ArrowRight', 'Space']) { await p.keyboard.press(k); await p.waitForTimeout(700); } await p.keyboard.press('Escape');
  o.bravoLead = await leadOf(s, 'Bravo Co'); R.C97020 = o; });

await run('C97022', async () => { await pins([ANA.staff_id, BEN.staff_id]);
  const s = await mkSet('ZZAUTOTEST F3 Keyboard Focus Kept', [{ co: 'Alpha Co', lead: ANA }, { co: 'Golf Co', lead: null }]); const o: any = {};
  await goP(p, 'Board View', s.q); await clickSearch(p); await arrowToCard(p, `board_card_${s.w['Alpha Co'].id}`); await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
  const items = await p.locator('.q-menu .q-item').allInnerTexts().catch(() => []); const idx = items.findIndex((x) => /Reassign lead technician/i.test(x)); for (let i = 0; i <= idx; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150); } await p.keyboard.press('Enter'); await p.waitForTimeout(1500); o.dialog = await p.locator('.q-dialog').count();
  await p.keyboard.press('Escape'); await p.waitForTimeout(1000); o.step4 = await focusInfo(p);
  await statusOnly('Approved'); await clickSearch(p); o.golfFocused = await arrowToCard(p, `board_card_${s.w['Golf Co'].id}`);
  await RUN.toRunner(); await a.post('/api/work-orders/change-status', { id: s.w['Golf Co'].id, status: 'in_progress' }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.step5 = await focusInfo(p); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.step5afterTab = await focusInfo(p);
  await statusOnly(null); await clickSearch(p); await arrowToCard(p, `board_card_${s.w['Alpha Co'].id}`); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(300); o.colFocus = (await focusInfo(p)).raw.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>');
  const ben = (await staffRows(a, BEN.email ?? 'zz.wob.ben.bravo@staging.shopview.local')).find((x: any) => x.staff_id === BEN.staff_id) ?? BEN; o.deact = say(await a.post('/api/iam/change-status', { id: ben.id }));
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.step6 = await focusInfo(p); await p.keyboard.press('Tab'); await p.waitForTimeout(300); o.step6afterTab = await focusInfo(p);
  o.react = say(await a.post('/api/iam/change-status', { id: ben.id })); o.benActive = (await staffRows(a, 'zz.wob.ben.bravo@staging.shopview.local'))[0]?.is_active; R.C97022 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'kbd-batch.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
