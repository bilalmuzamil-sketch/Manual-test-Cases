/** 12 Oct 2026 — the USER STEPS for the two weekly Google Analytics checks (C97033 field selection rate, C97034 weekly use and
 *  density spread), done on the QA branch so next week's reports hold the data. Events go through to Google (WOB_GA=1,
 *  route.continue) and are also recorded here. PHASE=day1 today; PHASE=day2 tomorrow. Users are saved to ga-week-users.json. */
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

process.env.WOB_FRESH_GA = '1';
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
  fs.writeFileSync(path.join(EV, 'analytics-batch.json'), JSON.stringify(R, null, 1));
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


const focusInfo = (pg: Page = p) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  return { tid: (e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || '', text: (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), outline: !!visible }; })()`) as Promise<any>;
async function tabTo(pg: Page, want: (f: any) => boolean, max = 120, key = 'Tab') { const seen: string[] = [];
  for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(120); const f = await focusInfo(pg); seen.push(f.tid); if (want(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await pg.keyboard.press('Escape'); await pg.locator('[data-test-id="page_search_toggle"]').click({ force: true }); } await box.click(); await pg.waitForTimeout(300); };


process.env.WOB_GA = '1';
// the runner's own context blocks analytics (viewas default); let it through there too, as probe-ga.mts does
await p.context().unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
await p.context().route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
type Ev = { en: string; ep: Record<string, string>; uid: string | null; t: number };
function tap(pg: Page) { const ev: Ev[] = [];
  const grab = (url: string, body: string | null) => { if (!/\/g\/collect|google-analytics\.com\/.*collect/.test(url)) return;
    for (const l of (body ? body.split('\n') : [''])) { const q = new URLSearchParams((url.split('?')[1] ?? '') + '&' + l); const en = q.get('en'); if (en) ev.push({ en, ep: Object.fromEntries([...q.entries()].filter(([k]) => /^(ep|epn|up|upn)\./.test(k))), uid: q.get('uid'), t: Date.now() }); } };
  // playbook: a sendBeacon body is not always exposed to a request listener, so intercept the collect route and read
  // postDataBuffer(); a post whose body cannot be read is COUNTED (unread), never reported as "no such event"
  (ev as any).unread = 0;
  pg.route(/\/g\/collect|google-analytics\.com\/.*collect/, async (route) => { const r = route.request(); const buf = r.postDataBuffer(); const body = buf ? buf.toString('utf8') : null;
    if (!body && !/[?&]en=/.test(r.url())) (ev as any).unread++; grab(r.url(), body); await route.continue().catch(() => {}); }).catch(() => {});
  return ev; }
const WO = (e: Ev) => /^work_orders_/.test(e.en);
const evs = (ev: Ev[], en: string, from = 0) => ev.slice(from).filter((e) => e.en === en);
const brief = (e: Ev) => `${e.en} ${e.ep['ep.element_location'] ?? ''} ${e.ep['ep.element_label'] ?? ''} ${e.ep['ep.setting_value'] ?? ''} ${e.ep['ep.setting_source'] ?? ''}`.trim();
const settle = (pg: Page, ms = 6000) => pg.waitForTimeout(ms);
const fresh = async (tag: string, role = ADMIN_ROLE) => mkUser('ZZAUTOTEST', `GA ${tag} ${stamp}`, role, `ga${tag.toLowerCase()}`);
const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
async function setFin(id: string, on: boolean) { const r = await roleRead(id); const w = await a.put(`/api/roles/${id}`, { name: r.name, description: r.description, view_mode: r.view_mode, template_id: r.template_id, fe_permissions: (r.fe_permissions ?? []).map((x: any) => x.id), cross_toggles: { ...(r.cross_toggles ?? {}), seeFinancialData: on } }); return `${w.status} now ${(await roleRead(id))?.cross_toggles?.seeFinancialData}`; }
const openWO = async (pg: Page) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); };
async function withUser(u: any, f: (pg: Page, ev: Ev[]) => Promise<void>) { const v = await asUser(u); const ev = tap(v.page); try { await f(v.page, ev); } finally { (R.unread ??= []).push((ev as any).unread); await v.close(); } }

const UF = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'ga-week-2026-10-12', 'ga-week-users.json'); fs.mkdirSync(path.dirname(UF), { recursive: true });
const U: any = fs.existsSync(UF) ? JSON.parse(fs.readFileSync(UF, 'utf8')) : {};
const PHASE = process.env.PHASE || '';
if (!['day1', 'day2', 'c97026', 'fs1fix'].includes(PHASE)) { console.log('PHASE must be set (day1|day2|c97026|fs1fix) — refusing to guess'); process.exit(2); }
const fieldIds = async (pg: Page) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="toggle_board_field_"]')].map(e => e.getAttribute('data-test-id').replace('toggle_board_field_', '') + '=' + (e.getAttribute('aria-checked') ?? e.querySelector('[aria-checked]')?.getAttribute('aria-checked') ?? e.className.includes('truthy')))`) as Promise<string[]>;
const fieldsMenu = async (pg: Page) => { await pg.locator('[data-test-id="button_board_fields_selection"]').click(); await pg.waitForTimeout(900); };
const toggle = async (pg: Page, re: RegExp) => { const ids = await fieldIds(pg); const k = ids.map((x) => x.split('=')[0]).find((x) => re.test(x)); if (!k) return `no field ${re}`; await pg.locator(`[data-test-id="toggle_board_field_${k}"]`).click(); await pg.waitForTimeout(1500); return k; };
const user = async (key: string, role = ADMIN_ROLE) => { if (!U[key]) { const u = await fresh(key, role); U[key] = { id: u.id, name: `ZZAUTOTEST GA ${key} ${stamp}`, email: u.email }; fs.writeFileSync(UF, JSON.stringify(U, null, 1)); } return U[key]; };
const log = (key: string, ev: any[]) => { U[key].uid = U[key].uid ?? ev.find((e) => e.uid)?.uid ?? null; (U[key].events ??= []).push(...ev.filter(WO).map((e) => `${new Date(e.t).toISOString().slice(0, 16)} ${brief(e)}`)); fs.writeFileSync(UF, JSON.stringify(U, null, 1)); };
if (PHASE === 'day1') {
  // C97033 day 1 — U1 turns VIN/Serial on, off, on
  { const u = await user('FS1'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000); await fieldsMenu(pg); R.fs1fields = await fieldIds(pg);
      R.fs1 = [await toggle(pg, /vin/i), await toggle(pg, /vin/i), await toggle(pg, /vin/i)]; await pg.keyboard.press('Escape'); await settle(pg); log('FS1', ev); }); }
  // C97034 — the whole week's use, all today (same week)
  { const u = await user('WK1'); for (let i = 0; i < 5; i++) await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000);
      if (i === 0) { await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800); await pg.locator('[data-test-id="option_density_compact"]').click(); await pg.keyboard.press('Escape'); } await settle(pg); log('WK1', ev); }); }
  { const u = await user('WK2'); for (let i = 0; i < 2; i++) await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Tech View'); await settle(pg, 4000);
      if (i === 0) { await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800); await pg.locator('[data-test-id="option_density_comfortable"]').click(); await pg.keyboard.press('Escape'); } await settle(pg); log('WK2', ev); }); }
  { const u = await user('WK3'); await withUser(u, async (pg, ev) => { await openWO(pg); await settle(pg); log('WK3', ev); }); }
  { const u = await user('WK4'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Tech View'); await settle(pg); log('WK4', ev); }); }
  // C97033 day-2 users are made today so tomorrow only acts
  await user('FS2'); await user('FS3'); await user('FS4', VIEW_ROLE);
}
if (PHASE === 'day2') {
  { const u = await user('FS2'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000); await fieldsMenu(pg); R.fs2 = await toggle(pg, /vin/i); await pg.keyboard.press('Escape'); await settle(pg); log('FS2', ev); }); }
  { const u = await user('FS3'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000); await fieldsMenu(pg); R.fs3 = await toggle(pg, /total|price/i); await pg.keyboard.press('Escape'); await settle(pg); log('FS3', ev); }); }
  // U4 has no financial data: the view-only role with "see financial data" off for the visit, then put back
  { const orig = (await roleRead(VIEW_ROLE))?.cross_toggles?.seeFinancialData; R.finOff = await setFin(VIEW_ROLE, false);
    try { const u = await user('FS4', VIEW_ROLE); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 5000); await fieldsMenu(pg); R.fs4fields = await fieldIds(pg); await pg.keyboard.press('Escape'); log('FS4', ev); }); }
    finally { R.finBack = await setFin(VIEW_ROLE, !!orig); } }
}
if (PHASE === 'fs1fix') {
  // 12 Oct 17:24 a launcher fault (PHASE dropped) re-ran day 1 and left FS1's VIN/Serial OFF; put it back ON (one toggle)
  const u = await user('FS1'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000); await fieldsMenu(pg);
    const before = (await fieldIds(pg)).find((x) => x.startsWith('vin=')); R.fs1fixBefore = before;
    if (before && !/=true/.test(before)) R.fs1fix = await toggle(pg, /vin/i);
    R.fs1fixAfter = (await fieldIds(pg)).find((x) => x.startsWith('vin=')); await pg.keyboard.press('Escape'); await settle(pg); log('FS1', ev); }); }
if (PHASE === 'c97026') {
  // C97026 steps 1-2 re-run 12 Oct 2026 with raw events kept: a brand-new user, and a dispatcher who saved a density earlier
  const raw: any = {};
  { const u = await user('NEWBIE'); await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 5000); log('NEWBIE', ev); raw.newbie = ev.filter(WO); }); }
  { const u = await user('DISP');
    await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 4000); await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800); await pg.locator('[data-test-id="option_density_comfortable"]').click(); await pg.keyboard.press('Escape'); await settle(pg); raw.dispSetup = ev.filter(WO); });
    await withUser(u, async (pg, ev) => { await openWO(pg); await display(pg, 'Board View'); await settle(pg, 5000); await shot(pg, 'C97026-dispatcher-board'); log('DISP', ev); raw.disp = ev.filter(WO); }); }
  fs.writeFileSync(path.join(path.dirname(UF), 'c97026-raw-events.json'), JSON.stringify(raw, null, 1));
  R.c97026 = { newbie: raw.newbie.map(brief), disp: raw.disp.map(brief), uids: [raw.newbie[0]?.uid, raw.disp[0]?.uid] };
}
R.users = Object.fromEntries(Object.entries(U).map(([k, v]: any) => [k, { name: v.name, uid: v.uid, events: (v.events ?? []).length }]));
fs.writeFileSync(path.join(path.dirname(UF), `ga-week-${PHASE}.json`), JSON.stringify(R, null, 1)); console.log('GAWEEK', JSON.stringify(R).slice(0, 3000));
await browser.close(); process.exit(0);
