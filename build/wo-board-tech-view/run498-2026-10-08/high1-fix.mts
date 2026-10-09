/** High-risk regression, first half (2026-10-09): the work order page's Lead Technician (C368165-C368168), lines and their
 *  technicians (C368172-C368174, C368176, C368177), the Schedule (C368178, C368179, C368190, C368192), the customer and
 *  asset Work Orders tabs (C368180-C368189), Create Work Order (C368202) and the List's Parts/Returns (C368213).
 *  Screen routes from probe-ui.json: select_lead_technician (status card), button_new_line / select_line_roster_add_technician
 *  / input_time_estimate / button_save_close (line window), line_labor_name_<id> (Labor row), button_work_order_nav_bar_menu
 *  (three-dots: Timesheets, Audit Log), schedule lanes [data-staff-id], sidebar_work_order_card, input_sidebar_search. */
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
  fs.writeFileSync(path.join(EV, 'high1-fix.json'), JSON.stringify(R, null, 1));
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

await run('C368166', async () => { const w = await one('ZZAUTOTEST WO Page Lead Change', ES); const o: any = {};
  await page(w.id); o.before = await leadText(); o.picked = await pickLeadOnPage2(/Ralph Edwards/); o.after = await leadText(); o.toasts = await toastsOn(p); await shot(p, 'C368166-after');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.afterReload = await leadText(); o.apiLead = await leadName(w.id); R.C368166 = o; });
await run('C368167', async () => { const w = await one('ZZAUTOTEST WO Page Refused Lead', ES); const o: any = {};
  await page(w.id); o.before = await leadText(); const log: any[] = []; await finish(w.id, 'invoiced', log); o.status = (await view(w.id)).status;
  o.picked = await pickLeadOnPage2(/Ralph Edwards/); o.toasts = await toastsOn(p); o.fieldNow = await leadText(); await shot(p, 'C368167-message');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.afterReload = (await leadText()) || (await p.evaluate(`(document.body.innerText.match(/Lead technician\\s*\\n\\s*([^\\n]+)/i) || [])[1] || null`)); o.apiLead = await leadName(w.id); R.C368167 = o; });
await run('C368168', async () => { const w = await one('ZZAUTOTEST WO Page Lines Follow', ES, 2); const o: any = {};
  await page(w.id); await p.getByText(lineName(2), { exact: false }).first().click(); await p.waitForTimeout(2500); let d = dlg(); o.removed = await rosterRemove(d, ES.staff_id); o.added = await rosterAdd(d, p, /Dana Ortiz/); o.roster = await roster(d); o.saved = await save(d);
  o.before = Object.values(await lineTechs(w.id)); await page(w.id); o.picked = await pickLeadOnPage2(/Ralph Edwards/); o.shiftQuestion = await p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count();
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); const lt = await lineTechs(w.id); o.after = w.ls.map((l: string) => lt[l]); o.labor = await laborRows(); await shot(p, 'C368168-lines'); R.C368168 = o; });
await run('C368172', async () => { const w = await one('ZZAUTOTEST New Line Tech', ES, 1); const o: any = {};
  await page(w.id); await p.locator('[data-test-id="button_new_line"]').click(); await p.waitForTimeout(2500); const d = dlg();
  await d.locator('[data-test-id="select_line_canned_line"]').click(); await p.keyboard.type('ZZAUTOTEST Oil change zq', { delay: 30 }); for (let i = 0; i < 6 && !(await p.locator('.q-menu').filter({ hasText: /No results/i }).count()); i++) await p.waitForTimeout(700); o.noResults = await p.locator('.q-menu').filter({ hasText: /No results/i }).count(); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  await d.locator('[data-test-id="input_time_estimate"]').fill('1'); o.rosterBefore = await roster(d); o.removed = await rosterRemove(d, ES.staff_id); o.added = await rosterAdd(d, p, /Dana Ortiz/); o.roster = await roster(d); await shot(p, 'C368172-form'); o.toasts = await save(d);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.labor = await laborRows(); o.techs = Object.values(await lineTechs(w.id)); o.lineNames = await p.evaluate(`[...document.querySelectorAll('[data-test-id="line_title"]')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 50))`); R.C368172 = o; R.w172 = w; });
await run('C368173', async () => { const w = R.w172; const o: any = {}; if (!w) { R.C368173 = { err: 'needs C368172' }; return; }
  await page(w.id); await p.getByText('ZZAUTOTEST Oil change', { exact: false }).first().click(); await p.waitForTimeout(2500); const d = dlg(); o.rosterBefore = await roster(d); o.removed = await rosterRemove(d, DO.staff_id); o.added = await rosterAdd(d, p, /Ralph Edwards/); o.roster = await roster(d); o.toasts = await save(d);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.labor = await laborRows(); o.techs = Object.values(await lineTechs(w.id)); R.C368173 = o; });
await run('C368174', async () => { const w = await one('ZZAUTOTEST Lines Tab Assign', ES, 2); const o: any = { attempts: [] };
  for (const l of w.ls) { await page(w.id); await p.locator(`[data-test-id="line_number_${l}"]`).click(); await p.waitForTimeout(1000); const a1: any = { menu: (await p.locator('.q-menu .q-item').allInnerTexts()).slice(0, 12) };
    const ed = p.locator('.q-menu .q-item').filter({ hasText: /Edit labor/i }).first(); if (await ed.count()) { await ed.click(); await p.waitForTimeout(2000); const d = dlg(); a1.fields = await d.evaluate((e: any) => [...e.querySelectorAll('.q-field__label')].map((x: any) => x.innerText)).catch(() => []);
      const tf = d.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Technician/ }) }).first(); await tf.click(); await p.waitForTimeout(800); a1.picked = await pickFromList(p, /Ralph Edwards/); await shot(p, `C368174-editlabor-${o.attempts.length + 1}`);
      await d.locator('button').filter({ hasText: /Save & Close|^\s*Save\s*$/ }).last().click(); await p.waitForTimeout(3000); a1.toasts = await toastsOn(p); } else await p.keyboard.press('Escape');
    o.attempts.push(a1); }
  await page(w.id); o.labor = await laborRows(); o.techs = Object.values(await lineTechs(w.id)); R.C368174 = o; });
await run('C368177', async () => { const w = await one('ZZAUTOTEST Move Labor', null, 2); const o: any = {}; const v = await asUser(ES);
  try { const pg = v.page; await page(w.id, 'lines', pg); const start = pg.locator(`[data-test-id="button_clock_toggle_task_${w.ls[0]}"], button:has-text("Start")`).first(); o.start = await start.count(); await start.click(); await pg.waitForTimeout(65000);
    await pg.locator('button').filter({ hasText: /^\s*Stop\s*$/ }).first().click(); await pg.waitForTimeout(2000); const d = dlg(pg); o.stopDialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
    await d.locator('textarea').first().fill('ZZAUTOTEST worked on it'); await pg.waitForTimeout(500); o.stopButtons = (await d.locator('button').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()); await shot(pg, 'C368177-stop');
    await d.locator('button').filter({ hasText: /^\s*(Stop|Stop Working|Save|Clock Out|Submit)\s*$/i }).last().click(); await pg.waitForTimeout(3000); o.stopToasts = await toastsOn(pg);
  } finally { await v.close(); }
  await page(w.id); await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click(); await p.waitForTimeout(3500);
  const row = p.locator('tr').filter({ hasText: /Esther/ }).first(); o.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' '); o.rowButtons = await row.evaluate((r: any) => [...r.querySelectorAll('button')].map((b: any) => (b.getAttribute('data-test-id') || '') + '|' + (b.getAttribute('aria-label') || '') + '|' + b.innerText.trim())).catch(() => []);
  const pen = row.locator('button').last(); await pen.click().catch(() => {}); await p.waitForTimeout(2000); const e = dlg(); o.editTitle = (await e.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot(p, 'C368177-edit');
  const lf = e.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /^Line/ }) }).first(); if (await lf.count()) { await lf.click(); await p.waitForTimeout(800); o.lineOptions = (await p.locator('.q-menu .q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ')).slice(0, 6); await p.locator('.q-menu .q-item').filter({ hasText: /^\s*2\b/ }).first().click().catch(async () => { await p.locator('.q-menu .q-item').nth(1).click(); }); await p.waitForTimeout(700);
    await e.locator('button').filter({ hasText: /^\s*Save\s*$/ }).last().click(); await p.waitForTimeout(3000); o.toasts = await toastsOn(p); }
  await page(w.id); o.labor = await laborRows(); o.techs = w.ls.map((l: string) => l.slice(0, 8)); R.C368177 = o; });

// Schedule: rows load as the calendar scrolls, so scroll until the technician's row exists
async function laneOf(staff: string) { for (let i = 0; i < 60; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; }
async function schedDrop(w: any, staff: string, hourLabel: RegExp, choose: string | null) { const o: any = {};
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(3000); o.range = await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null);
  await p.locator('[data-test-id="input_sidebar_search"]').fill(w.number); await p.waitForTimeout(3000); const cardL = p.locator('[data-test-id="sidebar_work_order_card"]').filter({ hasText: w.number }).first(); o.card = await cardL.count();
  o.laneFound = await laneOf(staff); const lane = p.locator(`[data-staff-id="${staff}"]`).first(); await lane.scrollIntoViewIfNeeded().catch(() => {}); o.lane = await lane.count();
  const hdr = p.locator('[data-test-id="text_schedule_resource_header"], .schedule-time-label, th, div').filter({ hasText: hourLabel }).last(); const hb = await hdr.boundingBox().catch(() => null); const lb = await lane.boundingBox(); const cb = await cardL.boundingBox();
  o.boxes = { hdr: hb && Math.round(hb.x), lane: lb && Math.round(lb.y) };
  if (cb && lb && hb) { await p.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await p.mouse.down(); await p.mouse.move(cb.x + 40, cb.y + 20, { steps: 5 }); await p.mouse.move(hb.x + 6, lb.y + lb.height / 2, { steps: 20 }); await p.mouse.up(); await p.waitForTimeout(2500); }
  const d = dlg(); o.dialog = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  if (choose) { await d.getByText(/Choose lines/i).first().click().catch(() => {}); await p.waitForTimeout(800); await d.locator('.q-checkbox, .q-item').filter({ hasText: new RegExp(choose.slice(0, 18), 'i') }).first().click().catch(() => {}); await p.waitForTimeout(600); }
  for (let i = 0; i < 12; i++) { const hrs = await d.evaluate((e) => (e.innerText.match(/(\d+(?:\.\d+)?)\s*h\b/) || [])[1] ?? null).catch(() => null); o.hours = hrs; if (hrs === '2') break; const btn = d.locator('button').filter({ hasText: Number(hrs) > 2 ? /^\s*(remove|−|-)\s*$/ : /^\s*(add|\+)\s*$/ }).first(); if (!(await btn.count())) break; await btn.click(); await p.waitForTimeout(300); }
  await shot(p, `sched-${w.number}-dialog`); const create = d.locator('button').filter({ hasText: /Create/ }).last(); o.createLabel = await create.innerText().catch(() => null); await create.click().catch(() => {}); await p.waitForTimeout(3000); o.toasts = await toastsOn(p);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(3000);
  o.shifts = await p.locator(`[data-staff-id="${staff}"] [data-test-id="schedule_shift_block"], [data-staff-id="${staff}"] .schedule-shift`).allInnerTexts().then((x) => x.map((y) => y.replace(/\s+/g, ' ')).filter((y) => y.includes(w.number.split('-').pop()!))).catch(() => []);
  await shot(p, `sched-${w.number}-after`); return o; }

const progressOf = async (q: string, number: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await display(p, 'List'); await search(p, q); await p.waitForTimeout(2500); return p.evaluate(`([...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes('${number}'))?.innerText.match(/\\d+%|\\d+\\s*of\\s*\\d+/) || [null])[0]`); };
async function tabSet(name: string) { const c = await customer(a, `${name} ${RUNNO}`, 'TRK-201'); const v2 = await vehicle(a, c, 'TRK-202'); const out: any = { c, w: {} };
  for (const [k, veh, lines] of [['A', c.vehicle_id, 1], ['B', c.vehicle_id, 2], ['C', c.vehicle_id, 1], ['D', v2, 1]] as const) { const id = await workOrder(a, { ...c, vehicle_id: veh as string }, 'estimate', null); const ls = []; for (let i = 0; i < (lines as number); i++) ls.push(await mkLine(id, i + 1)); await a.post('/api/work-orders/change-status', { id, status: 'approved' }); if (k === 'A' || k === 'B') await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: ANA.staff_id }); out.w[k] = { id, ls }; }
  const b = out.w.B; for (const q of ((await linesRaw(b.id))[0]?.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {});
  await a.post('/api/work-orders/lines/change-story', { line_id: b.ls[0], tech_story: 'Done', work_order_id: b.id }); out.bLine = say(await a.post('/api/work-orders/lines/change-status', { line_id: b.ls[0], status: 'complete', workOrderId: b.id }));
  for (const w of await workOrders(a, `${name} ${RUNNO}`)) for (const k of Object.keys(out.w)) if (out.w[k].id === w.id) out.w[k].number = w.number;
  out.name = `${name} ${RUNNO}`; return out; }
const tableNums = () => p.evaluate(`[...document.querySelectorAll('[data-test-id="table_customer_work_orders"] tbody tr, tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean)`) as Promise<string[]>;
async function customerTab(set: any) { await p.goto(`${APP}/customers/${set.c.company_id}/work-orders`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); return { tab: await p.locator('[data-test-id="tab_work-orders"]').innerText().catch(() => null), bottom: await p.locator('.q-table__bottom').innerText().catch(() => null) }; }
async function assetTab(set: any) { await p.goto(`${APP}/customers/${set.c.company_id}/vehicles`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await p.locator('tbody tr').filter({ hasText: 'TRK-201' }).first().click(); await p.waitForTimeout(5000);
  const url = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'); const tabs = await p.evaluate(`[...document.querySelectorAll('.q-tab, [role=tab]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`);
  const t = p.locator('.q-tab, [role=tab]').filter({ hasText: /Work Orders/ }).first(); if (await t.count()) { await t.click(); await p.waitForTimeout(4000); }
  return { url, tabs, tab: await t.innerText().catch(() => null), bottom: await p.locator('.q-table__bottom').innerText().catch(() => null) }; }
const sortBy = async (head: RegExp) => { const h = p.locator('thead th').filter({ hasText: head }).first(); await h.click(); await p.waitForTimeout(2500); const a1 = await tableNums(); await h.click(); await p.waitForTimeout(2500); return [a1, await tableNums()]; };
const onSiteToggle = async (number: string) => { const row = p.locator('tbody tr').filter({ hasText: number }).first(); const pin = row.locator('[data-test-id*="vehicle_here"], button:has(i:text-matches("place|location_on|pin"))').first(); const n = await pin.count(); if (n) { await pin.click(); await p.waitForTimeout(2500); } return n; };


await run('C368178', async () => { const w = await one('ZZAUTOTEST Sched Entire', ES, 2); R.C368178 = { wo: w.number, ...(await schedDrop(w, ES.staff_id, /^\s*9\s*(AM|am|:00)/, null)) }; });
await run('C368179', async () => { const w = await one('ZZAUTOTEST Sched Lines', ES, 2); R.C368179 = { wo: w.number, line1: lineName(1), ...(await schedDrop(w, ES.staff_id, /^\s*1\s*(PM|pm)|^\s*13(:00)?\s*$/, lineName(1))) }; });
await run('C368192', async () => { const w = await one('ZZAUTOTEST Sched Phone', null, 2); const o: any = { setup: await schedDrop(w, JW.staff_id, /^\s*10\s*(AM|am|:00)/, lineName(1)) }; R.w190 = w;
  await page(w.id); o.desktopLabor = await laborRows(); await p.setViewportSize({ width: 390, height: 844 }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const exp = p.locator(`[data-test-id="button_line_expand_${w.ls[0]}"]`); o.expand = await exp.count(); await exp.click().catch(() => {}); await p.waitForTimeout(1500);
  o.card = (await p.locator(`[data-test-id="line_number_${w.ls[0]}"]`).locator('xpath=ancestor::*[contains(@class,"q-card")][1]').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); o.needsTechs = /Needs techs/i.test(o.card); await shot(p, 'C368192-phone');
  await p.setViewportSize({ width: 1600, height: 1000 }); R.C368192 = o; });
await run('C368190', async () => { const w = R.w190; const o: any = {}; if (!w) { R.C368190 = { err: 'needs C368192 setup' }; return; }
  await page(w.id); o.step1 = await laborRows(); await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.locator('[data-test-id="button_schedule_next"]').click(); await p.waitForTimeout(3000); await laneOf(JW.staff_id);
  const sh = p.locator(`[data-staff-id="${JW.staff_id}"] [data-test-id="schedule_shift_block"]`).filter({ hasText: w.number.split('-').pop()! }).first(); o.shift = await sh.count(); await sh.click().catch(() => {}); await p.waitForTimeout(1500);
  const del = p.locator('button[aria-label*="Delete" i], button:has(i:text-is("delete")), button:has(i:text-is("delete_outline"))').first(); o.del = await del.count(); await shot(p, 'C368190-details'); await del.click().catch(() => {}); await p.waitForTimeout(2500); o.question = await p.locator('.q-dialog').filter({ hasText: /delete|remove/i }).count(); o.toasts = await toastsOn(p);
  await page(w.id); o.step3 = await laborRows(); o.techs = await lineTechs(w.id); R.C368190 = o; });
const here = async (q: string, id: string) => ((await workOrders(a, q)).find((x: any) => x.id === id) as any)?.vehicleHere;
await run('C368188', async () => { const set = await tabSet('ZZAUTOTEST Asset Tab Toggle Lead'); const o: any = {}; await assetTab(set); const w = set.w.A; o.before = await here(set.name, w.id);
  o.pin = await onSiteToggle(w.number); o.toasts = await toastsOn(p); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.after = await here(set.name, w.id); const v = await view(w.id); o.lead = JSON.stringify(v).includes(ANA.staff_id) ? 'Ana' : 'not Ana'; await shot(p, 'C368188-after'); R.C368188 = o; });
await run('C368189', async () => { const set = await tabSet('ZZAUTOTEST Asset Tab Old Page'); const o: any = {}; await assetTab(set); const w = set.w.A; o.before = await here(set.name, w.id);
  o.leadChange = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: BEN.staff_id }));
  o.pin = await onSiteToggle(w.number); o.toasts = await toastsOn(p); o.after = await here(set.name, w.id); const v = await view(w.id); o.lead = JSON.stringify(v).includes(BEN.staff_id) ? 'Ben' : JSON.stringify(v).includes(ANA.staff_id) ? 'Ana' : '?'; R.C368189 = o; });
await run('C368202', async () => { const c = await customer(a, `ZZAUTOTEST New WO Listed ${RUNNO}`, 'NWL-1'); const o: any = {};
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await p.getByRole('button', { name: /Create Work Order/i }).first().click(); await p.waitForTimeout(2500); const d = dlg();
  const cf = d.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Customer/ }) }).first(); await cf.click(); await p.keyboard.type(`New WO Listed ${RUNNO}`, { delay: 40 }); await p.waitForTimeout(2500); await p.locator('.q-menu .q-item').filter({ hasText: /New WO Listed/ }).first().click().catch(() => {}); await p.waitForTimeout(1500);
  const af = d.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Asset/ }) }).first(); if (await af.count()) { await af.click(); await p.waitForTimeout(1500); await p.locator('.q-menu .q-item').first().click().catch(() => {}); await p.waitForTimeout(800); }
  await d.locator('button').filter({ hasText: /^\s*Save\s*$|Create/ }).last().click(); await p.waitForTimeout(4000); const conf = p.locator('.q-dialog button').filter({ hasText: /^\s*Create\s*$/ }); if (await conf.count()) { await conf.first().click(); await p.waitForTimeout(3000); }
  o.number = await p.locator('[data-test-id="text_wo_number"]').innerText().catch(() => null);
  for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.locator('.q-dialog [data-test-id="button_close_dialog"]').last().click().catch(async () => { await p.keyboard.press('Escape'); }); await p.waitForTimeout(1200); } o.dialogsLeft = await p.locator('.q-dialog').count();
  await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /Work Orders/ }).first().click({ force: true }); await p.waitForTimeout(4000); o.reloaded = false; await tab(p, 'All'); await display(p, 'List'); await search(p, `New WO Listed ${RUNNO}`); await p.waitForTimeout(3000);
  o.listed = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean)`); o.found = o.number ? o.listed.includes(o.number.trim()) : null; await shot(p, 'C368202-list'); R.C368202 = o; });

await run('C368191', async () => { const o: any = {}; const w = await one('ZZAUTOTEST Deleted Labor', null, 2);
  const gone = (await person(a, 'ZZAUTOTEST Gone', `Tech ${RUNNO}`, { role: (await roleIds(a))['Technician'], email: `zz.wob.gone.${RUNNO}@staging.shopview.local`, clockable: true })).row; o.goneDeletable = gone.deletable;
  const v = await asUser(gone);
  try { const pg = v.page; await page(w.id, 'lines', pg); const tg = pg.locator(`[data-test-id="button_clock_toggle_task_${w.ls[0]}"]`).first(); o.start = await tg.count(); await tg.click(); await pg.waitForTimeout(65000);
    await pg.locator(`[data-test-id="button_clock_toggle_task_${w.ls[0]}"], button:has-text("Stop")`).first().click(); await pg.waitForTimeout(2000); const d = dlg(pg); o.stopButtons = (await d.locator('button').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
    await d.locator('textarea').first().fill('ZZAUTOTEST labor before deletion').catch(() => {}); await d.locator('button').filter({ hasText: /^\s*(Stop|Stop Working|Save|Clock Out|Submit)\s*$/i }).last().click().catch(() => {}); await pg.waitForTimeout(3000); await shot(pg, 'C368191-stopped');
  } finally { await v.close(); }
  await page(w.id); o.laborBefore = await laborRows();
  o.del = await p.evaluate(async ([api, id]) => { const r = await fetch(`${api}/api/staff/${id}`, { method: 'DELETE', credentials: 'include' }); return `${r.status} ${(await r.text()).slice(0, 120)}`; }, [(await import('./profile.mts')).API, gone.staff_id]);
  o.stillListed = (await staffRows(a, `zz.wob.gone.${RUNNO}`)).length;
  await page(w.id); o.laborAfterDelete = await laborRows();
  o.shift = await schedDrop(w, JW.staff_id, /^\s*11\s*(AM|am|:00)/, lineName(1));
  await page(w.id); o.laborAfterShift = await laborRows(); await shot(p, 'C368191-lines'); R.C368191 = o; });
await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'high1-fix.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
