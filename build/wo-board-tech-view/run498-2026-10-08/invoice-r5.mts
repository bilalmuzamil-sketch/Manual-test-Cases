/**
 * invoice-r5.mts — 17 Oct 2026, ROUND 5 of the run 498 fix-ups on STAGING: C368167 alone (ONLY=C368167), "A refused lead change on the work
 * order page shows an error, keeps the old lead". On 17 Oct Create Invoice was pressed in tab 2 yet the server still read Complete with no
 * invoice id. FIRST a positive control: a brand-new plain ZZAUTOTEST work order (one line, Complete, customer credit limit raised) gets
 * Finance > Create Invoice THROUGH THE SCREEN; the server's status / invoice id (2 s, 5 s, 10 s after, after the payment window's X, after a
 * reload), the page's badges and every request the page sent (with its answer) are logged. If the control invoices, the case runs with that
 * route; if not, it is recorded plainly (possible product finding) and no lead is changed. Set-up and helpers are high1-fix.mts's code,
 * copied unchanged (lines 7-214; only the start tag and output file changed). Output EV/invoice-r5-<ONLY>.json; pictures C368167-r5-*.png.
 * ───────────────────────────── COPIED FROM high1-fix.mts (lines 7-214, 17 Oct 2026) ─────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders, vehicle } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';
import { pickTech } from './fx6-1017.mts';
import { startState } from './fixup-1017.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
p.setDefaultTimeout(30_000);
const a = api(p);
await startState(p, a, 'invoice-r5');   // L0415, fix-up 2: saved Work Orders choices found before anything is set
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


const focusInfo = (pg: Page = p) => pg.evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body) return { tid: 'body' };
  const host = e.closest('[data-test-id]'); const cs = getComputedStyle(e);
  const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none') || e.matches(':focus-visible');
  return { tid: (e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || e.tagName).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'), raw: e.getAttribute('data-test-id') || (host && host.getAttribute('data-test-id')) || '', text: (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').slice(0, 40), outline: !!visible }; })()`) as Promise<any>;
async function tabTo(pg: Page, want: (f: any) => boolean, max = 120, key = 'Tab') { const seen: string[] = [];
  for (let i = 0; i < max; i++) { await pg.keyboard.press(key); await pg.waitForTimeout(120); const f = await focusInfo(pg); seen.push(f.tid); if (want(f)) return { found: true, presses: i + 1, f, seen }; }
  return { found: false, presses: max, seen }; }
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) { await pg.keyboard.press('Escape'); await pg.locator('[data-test-id="page_search_toggle"]').click({ force: true }); } await box.click(); await pg.waitForTimeout(300); };


const ES = await tech('Esther', 'Howard', 'esther.howard'), RE = await tech('Ralph', 'Edwards', 'ralph.edwards'), DO = await tech('Dana', 'Ortiz', 'dana.ortiz'), JW = await tech('Jenny', 'Wilson', 'jenny.wilson');
const NAMES: Record<string, string> = { [ES.staff_id]: 'Esther', [RE.staff_id]: 'Ralph', [DO.staff_id]: 'Dana', [JW.staff_id]: 'Jenny' };
const page = async (id: string, tabName = 'lines', pg: Page = p) => { await pg.goto(`${APP}/workorders/${id}/${tabName}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); };
const view = async (id: string) => (await a.get(`/api/work-orders/view/${id}`)).body?.data ?? {};
const leadName = async (id: string) => { const v = await view(id); const j = JSON.stringify(v); return Object.keys(NAMES).find((k) => j.includes(`"${k}"`)) ? NAMES[Object.keys(NAMES).find((k) => j.includes(`"${k}"`))!] : (v.tech_assigned_id ?? v.techAssignedId ?? null); };
const lineTechs = async (wo: string) => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any, i: number) => [x.lineId, (x.technicians ?? []).map((tt: any) => `${tt.firstName} ${tt.lastName}`.replace('ZZAUTOTEST ', '')).join(', ') || 'Unassigned']));
const laborRows = (pg: Page = p) => pg.evaluate(`Object.fromEntries([...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => [e.getAttribute('data-test-id').replace('line_labor_name_', '').slice(0, 8), e.innerText.replace(/\\s+/g, ' ').trim()]))`);
const leadField = (pg: Page = p) => pg.locator('[data-test-id="select_lead_technician"]').first();
const leadText = async (pg: Page = p) => (await leadField(pg).innerText().catch(() => '')).replace(/\s+/g, ' ').replace('arrow_drop_down', '').trim();
async function pickLeadOnPage(name: string, pg: Page = p) { await leadField(pg).click(); await pg.waitForTimeout(800); await pg.keyboard.type(name, { delay: 40 }); await pg.waitForTimeout(1500); const opt = pg.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(name, 'i') }).first(); const n = await opt.count(); if (n) await opt.click(); await pg.waitForTimeout(2500); return n; }
const one = async (name: string, lead: any, lines = 1, unit = 'TRK-201') => { const c = await customer(a, `${name} ${RUNNO}`, unit); const id = await workOrder(a, c, 'estimate', null); const ls: string[] = []; for (let i = 0; i < lines; i++) ls.push(await mkLine(id, i + 1));
  await a.post('/api/work-orders/change-status', { id, status: 'approved' }); if (lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: lead.staff_id });
  const number = (await workOrders(a, `${name} ${RUNNO}`)).find((w: any) => w.id === id)?.number; return { c, id, ls, number, q: `${name} ${RUNNO}` }; };
const dlg = (pg: Page = p) => pg.locator('.q-dialog').last();
async function editLine(lineName: string, remove: string | null, add: string | null, pg: Page = p) { await pg.getByText(lineName, { exact: false }).first().click(); await pg.waitForTimeout(2500); const d = dlg(pg); const o: any = { open: await d.isVisible().catch(() => false) };
  if (remove) { const chip = d.locator('.q-chip').filter({ hasText: new RegExp(remove, 'i') }).first(); o.chip = await chip.count(); await chip.locator('.q-chip__icon--remove, i:text-is("cancel"), i:text-is("close")').first().click().catch(() => {}); await pg.waitForTimeout(600); }
  if (add) { await d.locator('[data-test-id="select_line_roster_add_technician"]').click().catch(async () => { await d.locator('.q-field').filter({ hasText: /Add Technician/ }).first().click(); }); await pg.waitForTimeout(700); await pg.keyboard.type(add, { delay: 40 }); await pg.waitForTimeout(1500); const opt = pg.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(add, 'i') }).first(); o.opt = await opt.count(); await opt.click().catch(() => {}); await pg.waitForTimeout(700); await d.locator('[data-test-id="dialog_title"], .text-h6').first().click().catch(() => {}); }
  await d.locator('[data-test-id="button_save_close"], button:has-text("Save & Close")').first().click(); await pg.waitForTimeout(3500); o.toasts = await toastsOn(pg); return o; }
const lineName = (i: number) => String(canned[i % canned.length].canned_line_name ?? canned[i % canned.length].name ?? '').trim();


// Schedule rows are drawn for technicians in the Service department (case preconditions): enrol Esther and Jenny there,
// with the app's own route (StaffDialog > EnrollmentsDialog: POST /api/staff/enrollment/create {staffId, workplaceId, departmentId})
{ const deps = (await a.get('/api/departments')).body?.data; const dl = Array.isArray(deps) ? deps : deps?.collection ?? []; const svc = dl.find((d: any) => /^Service$/i.test(d.name));
  R.enrol = { service: !!svc }; if (svc) for (const [k, t2] of [['Esther', ES], ['Jenny', JW], ['Ralph', RE], ['Dana', DO]] as const) R.enrol[k] = say(await a.post('/api/staff/enrollment/create', { staffId: t2.staff_id, workplaceId: HEAVY, departmentId: svc.id })); }
// ---- fixed helpers (probe-lines.json, 2026-10-09): the Lead / technician lists are VIRTUAL — scroll them to reach a name;
// the roster's remove button is button_line_roster_remove_<staffId>; a typed description is kept with Enter once the
// list reads "No results"; the line menu opens from line_number_<id> and holds "Edit labor".
async function pickFromList(pg: Page, name: RegExp) { for (let i = 0; i < 60; i++) { const o = pg.locator('.q-menu .q-item').filter({ hasText: name }).first(); if (await o.count()) { await o.scrollIntoViewIfNeeded().catch(() => {}); await o.click(); await pg.waitForTimeout(1500); return true; }
    const moved = await pg.evaluate(`(() => { const m = document.querySelector('.q-menu .q-virtual-scroll, .q-menu'); if (!m) return false; const b = m.scrollTop; m.scrollTop = b + 350; return m.scrollTop !== b; })()`); await pg.waitForTimeout(250); if (!moved && i > 2) break; } return false; }
async function pickLeadOnPage2(name: RegExp, pg: Page = p) { await leadField(pg).click(); await pg.waitForTimeout(1000); const ok = await pickFromList(pg, name); if (!ok) await pg.keyboard.press('Escape'); await pg.waitForTimeout(2000); return ok; }
async function rosterAdd(d: any, pg: Page, name: RegExp) { await d.locator('[data-test-id="select_line_roster_add_technician"]').click(); await pg.waitForTimeout(800); return pickFromList(pg, name); }
async function rosterRemove(d: any, staffId: string) { const b = d.locator(`[data-test-id="button_line_roster_remove_${staffId}"]`); const n = await b.count(); if (n) { await b.click(); await p.waitForTimeout(600); } return n; }
const save = async (d: any, pg: Page = p) => { await d.locator('[data-test-id="button_save_close"], button:has-text("Save & Close")').first().click(); await pg.waitForTimeout(3500); return toastsOn(pg); };
const roster = (d: any) => d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.trim()));

// ───────── FIX-UP 2 (17 Oct 2026, C368166-C368168). The 16 Oct full run could not pick Ralph Edwards in the work order page's
// Lead Technician list: KNOWN PRODUCT FAULT SV-11393 — the list stops at about 100 names (62 drawn on the work order page, ending
// at the Q names), so Ralph is never offered. These three cases say "Names are examples" (the expected results only CALL [Tech-B]
// "Ralph Edwards"), so [Tech-B] is the first of Ralph Edwards / Jenny Wilson (our Service technician at Heavy Duty, Time Clock on)
// / any other offered lead that the list DOES offer; every reading logs the list (count, first, last, whether Ralph is offered —
// "LIST …") and which name was used ("PICK …"), and the pick is read back from the server (apiLead). Customer names follow the
// cases. "START STATE found …" logs the work order as set up, before the step that is judged.
const CANDS = (await candidates(a)).map((c) => c.name).filter((n) => n && !/^(Admin ShopView|ZZ WOB Runner)$/.test(n));
const TECHB = ['Ralph Edwards', 'Jenny Wilson', ...CANDS.filter((n) => !/^(Ralph Edwards|Jenny Wilson)$/.test(n))];
const leadSel = async (pg: Page = p) => (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]').first() : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
const pickB = async (id: string, avoid: string[], pg: Page = p) => pickTech(pg, async () => { await (await leadSel(pg)).click(); }, `${id} Lead Technician (work order page)`, { prefer: TECHB, avoid, control: ['Esther Howard', 'Dana Ortiz'] });
const NAMEOF: Record<string, string> = { Esther: 'Esther Howard', Ralph: 'Ralph Edwards', Dana: 'Dana Ortiz', Jenny: 'Jenny Wilson' };
const apiLeadName = async (id: string) => { const n = await leadName(id); return NAMEOF[String(n)] ?? n; };
const statusOf = async (id: string) => { const v = await view(id); return v?.work_order?.status ?? v?.status ?? null; };
const watchToasts = (pg: Page = p) => pg.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`).catch(() => {});
const seenToasts = (pg: Page = p) => pg.evaluate('window.__tl || []').catch(() => []) as Promise<string[]>;


// ───────────────────────────── ROUND 5 block (17 Oct 2026) ─────────────────────────────
const OUT5 = path.join(EV, `invoice-r5${only.length ? '-' + only.join('-') : ''}.json`);
/** every non-GET request the page sends to the work order / invoice / payment endpoints, with the answer's status and the start of its body */
function netLog(pg: Page) { const out: string[] = []; const on = async (r: any) => { const q = r.request(); if (q.method() === 'GET' || !/\/api\/(invoices|work-orders|payments|customer-payments|finance)/.test(r.url())) return; let body = ''; try { body = (await r.text()).slice(0, 160); } catch { /* */ } out.push(`${q.method()} ${r.url().replace(/^https:\/\/[^/]+/, '')} ${(q.postData() || '').slice(0, 160)} -> ${r.status()} ${body}`); };
  pg.on('response', on); return { out, stop: () => pg.off('response', on) }; }
const invState = async (id: string) => { const v = await view(id); const wo = v?.work_order ?? v ?? {}; return { status: wo.status ?? null, invoice_id: wo.invoice_id ?? null, invoice_status: wo.invoice_status ?? null, is_invoice_created: wo.is_invoice_created ?? null }; };
const windowsOn = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-dialog')].filter(d => { const r = d.getBoundingClientRect(); return r.width > 0 && getComputedStyle(d).visibility !== 'hidden'; }).map(d => ({ text: d.innerText.replace(/\\s+/g, ' ').slice(0, 220), buttons: [...d.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim()).filter(Boolean) }))`).catch(() => []) as Promise<any[]>;
const pageBits = (pg: Page) => pg.evaluate(`({ badges: [...document.querySelectorAll('.q-badge, .q-chip')].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().top < 260).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean).slice(0, 8), createInvoiceOffered: [...document.querySelectorAll('button')].filter(b => /^\\s*Create Invoice\\s*$/i.test(b.innerText) && b.getBoundingClientRect().width > 0).length, invoiceNumbers: (document.body.innerText.match(/INV-?[0-9-]+/g) || []).slice(0, 4) })`).catch(() => null);
/** Finance > Create Invoice through the screen on a work order page, everything around it logged; returns the readings */
async function createInvoiceOnScreen(pg: Page, id: string, tag: string) {
  const o: any = { before: await invState(id) }; const net = netLog(pg);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Finance\s*$/ }).first().click().catch(() => {}); await pg.waitForTimeout(3500);
  const ci = pg.locator('button').filter({ hasText: /^\s*Create Invoice\s*$/i }).first(); o.button = await ci.count(); o.disabled = o.button ? await ci.isDisabled().catch(() => null) : null;
  o.pageBefore = await pageBits(pg); await pg.screenshot({ path: path.join(EV, `C368167-r5-${tag}-finance-before.png`) }).catch(() => {});
  if (o.button && !o.disabled) {
    o.click = await ci.click({ timeout: 10_000 }).then(() => 'clicked').catch((e: any) => 'click failed: ' + String(e?.message || e).split('\n')[0].slice(0, 100));
    for (const s of [2, 5, 10]) { await pg.waitForTimeout(s === 2 ? 2000 : s === 5 ? 3000 : 5000); o[`server${s}s`] = await invState(id); }
    o.windows = await windowsOn(pg); o.messages = await toastsOn(pg); await pg.screenshot({ path: path.join(EV, `C368167-r5-${tag}-after-create.png`) }).catch(() => {});
    const pay = pg.locator('.q-dialog').filter({ hasText: /Payment/i }).last();
    if (await pay.count()) { o.paymentWindow = (await pay.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160); await pay.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click({ timeout: 5000 }).then(() => { o.paymentClosed = 'X'; }).catch(async () => { await pg.keyboard.press('Escape'); o.paymentClosed = 'Escape'; }); await pg.waitForTimeout(2500); o.windowsAfterClose = await windowsOn(pg); }
    o.serverAfterClose = await invState(id);
  }
  await pg.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await pg.waitForTimeout(6000); await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Finance\s*$/ }).first().click().catch(() => {}); await pg.waitForTimeout(3000);
  o.pageAfterReload = await pageBits(pg); o.serverAfterReload = await invState(id); await pg.screenshot({ path: path.join(EV, `C368167-r5-${tag}-after-reload.png`) }).catch(() => {});
  net.stop(); o.requests = net.out; o.invoiced = /^invoiced$/i.test(String(o.serverAfterReload.status)) || !!o.serverAfterReload.invoice_id;
  return o; }
const raiseCredit = async (companyId: string) => { const cv = (await a.get(`/api/customers/view/${companyId}`)).body?.data; const co = cv?.company ?? cv ?? {}; const before = co.credit_limit ?? null;
  const s = say(await a.post('/api/customers/change', { ...co, company_id: companyId, id: companyId, credit_limit: 9999999 })); const cv2 = (await a.get(`/api/customers/view/${companyId}`)).body?.data; return { before, save: s, after: (cv2?.company ?? cv2 ?? {}).credit_limit ?? null }; };

/** LIVE FIX 17 Oct: Finance > Create Invoice through the screen, the New Customer Payment window LEFT OPEN (closing it with its X calls
 *  /api/invoices/remove-customer-transaction and puts the work order back to Complete — seen on the control at 09:32); the server is
 *  polled every 2 s (max 30 s) until it reads Invoiced. Returns the readings; the page is left as it is. */
async function invoiceKeepOpen(pg: Page, id: string, tag: string) {
  const o: any = { before: await invState(id) }; const net = netLog(pg);
  await pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Finance\s*$/ }).first().click().catch(() => {}); await pg.waitForTimeout(3500);
  const ci = pg.locator('button').filter({ hasText: /^\s*Create Invoice\s*$/i }).first(); o.button = await ci.count(); o.disabled = o.button ? await ci.isDisabled().catch(() => null) : null;
  if (!o.button || o.disabled) { net.stop(); o.requests = net.out; o.invoiced = false; return o; }
  o.click = await ci.click({ timeout: 10_000 }).then(() => 'clicked').catch((e: any) => 'click failed: ' + String(e?.message || e).split('\n')[0].slice(0, 100));
  o.polls = []; for (let i = 0; i < 15; i++) { await pg.waitForTimeout(2000); const s = await invState(id); o.polls.push(`${(i + 1) * 2}s ${s.status}${s.invoice_id ? ' inv' : ''}`); if (/^invoiced$/i.test(String(s.status)) && s.invoice_id) { o.invoicedAfter = `${(i + 1) * 2} s`; break; } }
  o.server = await invState(id); o.windows = await windowsOn(pg); o.paymentWindowLeftOpen = o.windows.some((w: any) => /Payment/i.test(w.text));
  await pg.screenshot({ path: path.join(EV, `C368167-r5-${tag}-invoiced-window-open.png`) }).catch(() => {});
  net.stop(); o.requests = net.out; o.invoiced = /^invoiced$/i.test(String(o.server.status)) && !!o.server.invoice_id; return o; }

await run('C368167', async () => {
  // LIVE FIX 17 Oct (staging free): the case's own route ("close the New Customer Payment window with its X") puts the work order back to
  // Complete on staging (remove-customer-transaction), so the Invoiced state is built as SET-UP the other way the app offers: Create Invoice in
  // tab 2 with the payment window LEFT OPEN — the server reads Invoiced — and tab 1 (stale, not reloaded) then tries the lead change through
  // the screen. Positive control first: the same route on a new plain work order must read Invoiced. Route used is logged (stateRoute).
  const o: any = { stateRoute: 'Create Invoice in tab 2, New Customer Payment window left open (not closed with X, not paid)' }; R.C368167 = o;
  const ctl = await one('ZZAUTOTEST Invoice Control', ES); o.control = { wo: ctl.number, credit: await raiseCredit(ctl.c.company_id) };
  { const log: any[] = []; await finish(ctl.id, 'complete', log); o.control.statusBefore = await statusOf(ctl.id); }
  console.log(t(), 'START STATE found C368167 (control work order)', JSON.stringify({ wo: ctl.number, status: o.control.statusBefore }));
  const pc = await p.context().newPage(); pc.setDefaultTimeout(20_000);
  try { await page(ctl.id, 'lines', pc); o.control.invoice = await invoiceKeepOpen(pc, ctl.id, 'control'); } finally { await pc.close().catch(() => {}); }
  o.control.serverAfterTabClosed = await invState(ctl.id);
  console.log(t(), 'C368167 control (payment window left open)', JSON.stringify({ invoiced: o.control.invoice.invoiced, after: o.control.invoice.invoicedAfter, polls: o.control.invoice.polls, afterTabClosed: o.control.serverAfterTabClosed }));
  fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
  if (!o.control.invoice.invoiced) { o.result = 'the control did not read Invoiced with the payment window left open: the case was NOT run and no lead was changed'; return; }
  const w = await one('ZZAUTOTEST Refused Lead Change', ES); o.wo = w.number; o.credit = await raiseCredit(w.c.company_id);
  { const log: any[] = []; await finish(w.id, 'complete', log); o.setup = log; }
  console.log(t(), 'START STATE set C368167', JSON.stringify({ wo: w.number, status: await statusOf(w.id), lead: await apiLeadName(w.id) }));
  // step 1: tab 1 opens the work order and is left open
  await page(w.id); o.before = await leadText(); await shot(p, 'C368167-r5-tab1-start');
  // step 2 (set-up route above): tab 2 Create Invoice, payment window left open; the server must read Invoiced before tab 1 acts
  const t2 = await p.context().newPage(); t2.setDefaultTimeout(20_000);
  await page(w.id, 'lines', t2); o.tab2 = await invoiceKeepOpen(t2, w.id, 'case-tab2');
  o.serverRightBeforeChange = await invState(w.id);
  if (!o.tab2.invoiced) { o.result = 'the case\'s work order did not read Invoiced: lead NOT changed'; await t2.close().catch(() => {}); return; }
  // steps 3-5: tab 1, NOT reloaded
  await p.bringToFront(); await p.waitForTimeout(800); const ls = await leadSel();
  o.step3 = { disabled: await ls.evaluate((e: any) => e.classList.contains('q-field--disabled') || e.getAttribute('aria-disabled') === 'true' || !!e.querySelector('.q-field--disabled, [aria-disabled="true"]')).catch(() => null), field: (await ls.innerText().catch(() => '')).replace(/\s+/g, ' ').trim() };
  if (o.step3.disabled) o.step3.note = 'page refreshed itself (the field was already disabled at step 3)';
  else { const net = netLog(p); await watchToasts(); o.techB = await pickB('C368167', ['Esther Howard']); o.used = o.techB.picked; await p.waitForTimeout(2500);
    o.toasts = [...new Set([...(await seenToasts()), ...(await toastsOn(p))])]; o.fieldNow = await leadText(); net.stop(); o.changeRequests = net.out; await shot(p, 'C368167-r5-message'); }
  o.serverRightAfterChange = await invState(w.id); o.apiLeadAfterChange = await apiLeadName(w.id);
  // step 6: reload tab 1
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.afterReload = (await leadText()) || (await p.evaluate(`(document.body.innerText.match(/Lead technician\\s*\\n\\s*([^\\n]+)/i) || [])[1] || null`)); o.apiLead = await apiLeadName(w.id); o.pageAfterReload = await pageBits(p); await shot(p, 'C368167-r5-after-reload');
  await t2.close().catch(() => {}); o.serverAfterTab2Closed = await invState(w.id);
  console.log(t(), 'C368167 case', JSON.stringify({ stateRoute: o.stateRoute, before: o.serverRightBeforeChange, step3: o.step3, used: o.used, toasts: o.toasts, fieldNow: o.fieldNow, afterChange: o.serverRightAfterChange, apiLeadAfterChange: o.apiLeadAfterChange, afterReload: o.afterReload, apiLead: o.apiLead, afterTab2Closed: o.serverAfterTab2Closed }));
});

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(OUT5, JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
