/** Remaining regression checks (2026-10-09): Edit Work Order (C368169-C368171), List paging (C368197), filters kept
 *  after a reload on Purchase Orders / Vendors / Vendor Invoices (C368218, C368219, C368223), pins per location
 *  (C368156), impersonation started/ended while a page loads (C368238, C368239), and an ended session (C368240, LAST:
 *  it signs the shared session out; the next batch signs in again through quick-login).
 *  Discovery first wherever no route is recorded yet: the work order page's buttons and menus, the edit window's
 *  field labels, and the Staff screen's account-access control are written to the json so they can go in the playbook. */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds, HEAVY, LETH } from './staff.mts';
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
  fs.writeFileSync(path.join(EV, 'rest-batch.json'), JSON.stringify(R, null, 1));
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


const lab = (pg: Page, sel: string) => pg.evaluate(`[...document.querySelectorAll('${sel}')].filter(e => e.offsetParent).map(e => (e.getAttribute('data-test-id') || '') + '=' + (e.innerText || e.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 50)).slice(0, 60)`);
const dlgFields = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-dialog .q-field')].map(f => ({ label: (f.querySelector('.q-field__label') || {}).innerText || '', tid: (f.querySelector('[data-test-id]') || {}).getAttribute?.('data-test-id') || '', value: (f.querySelector('input') || {}).value || (f.querySelector('.q-field__native') || {}).innerText || '' }))`);
const view = async (id: string) => (await a.get(`/api/work-orders/view/${id}`)).body?.data ?? {};
async function openEdit(id: string) {
  await p.goto(APP + `/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const cands = [p.getByRole('button', { name: /Edit Work Order/i }), p.locator('[data-test-id*="edit_work_order"], [data-test-id*="edit_workorder"], [data-test-id*="button_edit"]'), p.getByText(/^Edit Work Order$/)];
  for (const c of cands) if (await c.first().count() && await c.first().isVisible().catch(() => false)) { await c.first().click(); await p.waitForTimeout(2500); if (await p.locator('.q-dialog').count()) return 'button'; }
  // the page's three-dots menu
  const dots = p.locator('button:has(i:text-is("more_vert")), button:has(i:text-is("more_horiz"))');
  for (let i = 0; i < Math.min(await dots.count(), 4); i++) { await dots.nth(i).click().catch(() => {}); await p.waitForTimeout(800); const it = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Edit/i }).first(); if (await it.count()) { await it.click(); await p.waitForTimeout(2500); return `menu ${i}`; } await p.keyboard.press('Escape'); }
  // the header customer/asset block opens the edit window in some builds
  return 'not found';
}
const fieldByLabel = (re: RegExp) => p.locator('.q-dialog .q-field').filter({ has: p.locator('.q-field__label', { hasText: re }) }).first();
async function setLead(name: string) { const f = fieldByLabel(/Lead Tech/i); if (!(await f.count())) return 'no Lead field'; await f.click(); await p.waitForTimeout(600); await p.keyboard.type(name, { delay: 50 }); await p.waitForTimeout(1500); const o = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: new RegExp(name, 'i') }).first(); if (!(await o.count())) return 'no option'; await o.click(); await p.waitForTimeout(600); return 'set'; }
async function setText(re: RegExp, v: string) { const f = fieldByLabel(re); if (!(await f.count())) return `no ${re}`; const i = f.locator('input').first(); await i.fill(v); return 'set'; }
const saveDlg = async () => { const b = p.locator('.q-dialog button').filter({ hasText: /^\s*Save/i }).first(); if (!(await b.count())) return 'no Save'; await b.click(); await p.waitForTimeout(3000); return { toasts: await toastsOn(p), open: await p.locator('.q-dialog').count() }; };
const ES = await tech('Esther', 'Howard', 'esther.howard'), RE = await tech('Ralph', 'Edwards', 'ralph.edwards');
const one = async (name: string) => { const s = await mkSet(name, [{ co: 'Alpha Co', lead: ES }]); const id = s.w['Alpha Co'].id;
  await a.post('/api/work-orders/change-mileage', { work_order_id: id, mileage: '120000' }); return { s, id }; };

await run('C368169', async () => { const { id } = await one('ZZAUTOTEST Edit WO Lead Mileage'); const o: any = {};
  o.pageButtons = await lab(p, 'button, [role=tab]'); o.open = await openEdit(id); o.fields = await dlgFields(p); await shot(p, 'C368169-edit-window');
  if (o.open !== 'not found') { o.lead = await setLead('ZZAUTOTEST Ralph'); o.mileage = await setText(/Mileage/i, '120500'); o.save = await saveDlg(); }
  const v = await view(id); o.after = { lead: v.tech_assigned?.name ?? v.techAssigned?.name ?? v.tech_assigned_id ?? null, leadIsRalph: JSON.stringify(v).includes(RE.staff_id), mileage: v.mileage ?? v.vehicle_mileage };
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await shot(p, 'C368169-after'); R.C368169 = o; });

await run('C368171', async () => { const { id } = await one('ZZAUTOTEST Edit WO Audit'); const o: any = {};
  const hist = async () => { const r = await a.get(`/api/work-orders/${id}/history`); const d = r.body?.data; const rows = Array.isArray(d) ? d : d?.collection ?? []; return rows; };
  const h0 = await hist(); o.before = h0.length; o.leadEntries0 = h0.filter((x: any) => /lead/i.test(JSON.stringify(x))).length;
  o.open = await openEdit(id); if (o.open !== 'not found') { o.lead = await setLead('ZZAUTOTEST Ralph'); o.save = await saveDlg(); }
  const h1 = await hist(); o.after = h1.length; o.newest = h1.slice(0, 4).map((x: any) => JSON.stringify(x).replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').slice(0, 300)); o.leadEntries1 = h1.filter((x: any) => /lead/i.test(JSON.stringify(x))).length;
  // the screen's Audit Log, as the case reads it
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); const dots = p.locator('button:has(i:text-is("more_vert"))');
  for (let i = 0; i < Math.min(await dots.count(), 4); i++) { await dots.nth(i).click().catch(() => {}); await p.waitForTimeout(800); const it = p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Audit Log/i }).first(); if (await it.count()) { await it.click(); await p.waitForTimeout(3000); o.auditText = (await p.locator('.q-dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500); await shot(p, 'C368171-audit'); break; } await p.keyboard.press('Escape'); }
  R.C368171 = o; });

await run('C368170', async () => { const { s, id } = await one('ZZAUTOTEST Edit WO Refused'); const o: any = {};
  o.open = await openEdit(id); if (o.open === 'not found') { R.C368170 = o; return; }
  // tab 2 (another page of the same session): take the work order to Invoiced
  const log: any[] = []; await finish(id, 'invoiced', log); o.invoiced = log.slice(-3); o.statusNow = (await view(id)).status;
  o.lead = await setLead('ZZAUTOTEST Ralph'); o.mileage = await setText(/Mileage/i, '120500'); o.hours = await setText(/Engine Hours/i, '3470'); o.po = await setText(/PO/i, 'PO-200');
  o.save = await saveDlg(); await shot(p, 'C368170-message');
  const v = await view(id); o.after = { leadIsEsther: JSON.stringify(v).includes(ES.staff_id), leadIsRalph: JSON.stringify(v).includes(RE.staff_id), mileage: v.mileage, hours: v.engine_hours ?? v.hours, po: v.po_number ?? v.customer_po ?? v.purchase_order_number };
  R.C368170 = o; });

await run('C368197', async () => { const specs = Array.from({ length: 12 }, (_, i) => ({ co: `Co ${String(i + 1).padStart(2, '0')}`, lead: null }));
  const s = await mkSet('ZZAUTOTEST List Paging', specs); const o: any = { made: Object.values(s.w).filter((x) => x.number).length };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await display(p, 'List'); await search(p, s.q); await p.waitForTimeout(2500);
  const nums = () => p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean)`) as Promise<string[]>;
  const rpp = p.locator('.q-table__bottom .q-select').first(); o.rppFound = await rpp.count();
  if (o.rppFound) { await rpp.click(); await p.waitForTimeout(800); o.choices = await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].map(e => e.innerText.trim())`); await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(2500); }
  o.bottom = await p.locator('.q-table__bottom').innerText().catch(() => null); o.page1 = await nums();
  const next = p.locator('.q-table__bottom button:has(i:text-is("chevron_right")), .q-table__bottom [aria-label*="Next" i]').first(); o.nextFound = await next.count();
  if (o.nextFound) { await next.click(); await p.waitForTimeout(2500); } o.page2 = await nums(); await shot(p, 'C368197-page2');
  const all = Object.values(s.w).map((x) => x.number); const seen = [...o.page1, ...o.page2];
  o.check = { total: all.length, shown: seen.length, dup: seen.filter((x, i) => seen.indexOf(x) !== i), missing: all.filter((x) => !seen.includes(x)) };
  R.C368197 = o; });

const filterKept = async (id: string, route: string, chip: RegExp) => { const o: any = { route };
  await p.goto(APP + route, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const rows = () => p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 60)).slice(0, 15)`) as Promise<string[]>;
  o.chips = await lab(p, '[data-test-id^="filter_chip_"]'); const c = p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: chip }).first();
  if (!(await c.count())) { const b = p.locator('button').filter({ hasText: chip }).first(); if (!(await b.count())) { o.err = 'no filter control'; await shot(p, `${id}-no-filter`); return o; } await b.click(); } else await c.click();
  await p.waitForTimeout(1200); const opt = p.locator('.q-menu .q-item').first(); o.value = (await opt.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await opt.click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
  o.chipBefore = await (c.count().then((n) => n ? c.innerText() : '')).catch(() => ''); o.rowsBefore = await rows(); o.urlBefore = p.url().replace(APP, '');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.chipAfter = await p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: chip }).first().innerText().catch(() => ''); o.rowsAfter = await rows(); o.urlAfter = p.url().replace(APP, ''); o.toasts = await toastsOn(p);
  o.same = JSON.stringify(o.rowsBefore) === JSON.stringify(o.rowsAfter); await shot(p, `${id}-after-reload`); return o; };
await run('C368218', async () => { R.C368218 = await filterKept('C368218', '/parts/orders', /Vendor/i); });
await run('C368219', async () => { R.C368219 = await filterKept('C368219', '/parts/vendors', /State|Province/i); });
await run('C368223', async () => { R.C368223 = await filterKept('C368223', '/parts/deliveries', /Vendor/i); });

await run('C368156', async () => { const o: any = {};
  const at2 = async (f: string, l: string) => (await person(a, `ZZAUTOTEST ${f}`, l, { role: TECH_ROLE, email: `zz.wob.${f.toLowerCase()}.loc2${D}`, clockable: true, workplace: LETH })).row;
  const XIA = await at2('Xia', 'Xray'), YAN = await at2('Yan', 'Yankee'), ZOE = await at2('Zoe', 'Zulu'); const s = await mkSet('ZZAUTOTEST Pins Per Location', [{ co: 'Alpha Co', lead: ANA }]);
  await pins([]); await goP(p, 'Board View', ''); for (const x of [ANA, BEN, CAL]) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1200); }
  o.heavyPins = named((await prefFor()).pinnedTechnicianIds ?? [], IDS); await toColumn(p, DAN.staff_id); const d4 = p.locator(`[data-test-id="button_board_pin_${DAN.staff_id}"]`);
  o.fourth = { disabled: await d4.isDisabled().catch(() => null), cls: await d4.getAttribute('class').catch(() => null) }; await d4.hover().catch(() => {}); await p.waitForTimeout(1200); o.fourth.tip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText).join(' | ')`);
  await shot(p, 'C368156-heavy-cap');
  await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }); await goP(p, 'Board View', ''); o.loc2pinnedCols = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="button_board_pin_"] i')].filter(i => /push_pin/.test(i.innerText) && i.closest('button').className.includes('text-primary')).length`);
  o.loc2Cols = named((await allCols(p)).slice(0, 6), { ...IDS, Xia: XIA.staff_id, Yan: YAN.staff_id, Zoe: ZOE.staff_id });
  for (const x of [XIA, YAN, ZOE]) { await toColumn(p, x.staff_id).catch(() => {}); const b = p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`); o[`pin ${x.first_name ?? x.staff_id.slice(0, 4)}`] = (await b.count()) ? { disabled: await b.isDisabled() } : 'no column'; if (await b.count()) { await b.click().catch(() => {}); await p.waitForTimeout(1200); } }
  o.loc2Pref = await prefFor(); o.loc2Toasts = await toastsOn(p); await shot(p, 'C368156-loc2');
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }); await goP(p, 'Board View', ''); o.heavyAfter = named((await allCols(p)).slice(0, 5), IDS); o.heavyPref = await prefFor();
  R.C368156 = o; });

async function staffAccess(name: string) { await p.goto(APP + '/settings/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const box = p.locator('input[type=search], input[placeholder*="Search" i]').first(); if (await box.count()) { await box.fill(name); await p.waitForTimeout(2500); }
  const row = p.locator('tbody tr').filter({ hasText: name }).first(); if (!(await row.count())) return { err: 'row not found' };
  const inRow = await row.evaluate((r) => [...r.querySelectorAll('button, a, i')].map((e: any) => (e.getAttribute('data-test-id') || '') + '=' + (e.innerText || e.getAttribute('aria-label') || '').trim()).slice(0, 12));
  return { row, inRow }; }
await run('C368238', async () => { const s = await mkSet('ZZAUTOTEST Impersonate', [{ co: 'Alpha Co', lead: ES }]); const o: any = { wo: s.w['Alpha Co'].number };
  const st: any = await staffAccess('ZZAUTOTEST Esther'); o.rowControls = st.inRow ?? st.err; if (st.row) { await st.row.click(); await p.waitForTimeout(3000); o.detailUrl = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/, '<id>'); o.detailButtons = await lab(p, 'button'); }
  const acc = p.locator('button, .q-item').filter({ hasText: /Account Access|Impersonat|Log in as|Sign in as/i }).first(); o.accessFound = await acc.count();
  if (o.accessFound) { const nav = p.goto(APP + '/reports/work-in-progress', { waitUntil: 'commit' }).catch(() => {}); await p.waitForTimeout(300);
    await p.goBack().catch(() => {}); await p.waitForTimeout(300); await acc.click().catch((e) => { o.clickErr = String(e).slice(0, 120); }); await p.waitForTimeout(800); const conf = p.locator('.q-dialog button').filter({ hasText: /Confirm|Yes|Continue|Access/i }).first(); if (await conf.count()) await conf.click(); await nav; await p.waitForTimeout(6000);
    o.bar = await p.evaluate(`document.body.innerText.match(/Account Access Mode[^\\n]*/)?.[0] ?? null`); o.who = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => null); o.toasts = await toastsOn(p);
    await p.goto(APP + '/workorders?tab=all&assignedToMe=1', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.list = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean).slice(0, 20)`); o.hasWo = o.list.includes(o.wo); await shot(p, 'C368238-as-esther');
    // C368239: exit while a page loads
    const nav2 = p.goto(APP + '/reports/work-in-progress', { waitUntil: 'commit' }).catch(() => {}); await p.waitForTimeout(400); const exit = p.locator('button, a').filter({ hasText: /^\s*Exit\s*$/i }).first(); R.C368239 = { exitFound: await exit.count() };
    if (await exit.count()) await exit.click().catch(() => {}); await nav2; await p.waitForTimeout(6000);
    R.C368239.toasts = await toastsOn(p); R.C368239.who = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => null); R.C368239.bar = await p.evaluate(`document.body.innerText.includes('Account Access Mode')`);
    await p.goto(APP + '/workorders?tab=all&assignedToMe=1', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C368239.list = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [])[0]).filter(Boolean).slice(0, 20)`); R.C368239.hasWo = R.C368239.list.includes(o.wo); await shot(p, 'C368239-back');
    await RUN.toRunner().catch(() => {}); }
  R.C368238 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true; fs.writeFileSync(path.join(EV, 'rest-batch.json'), JSON.stringify(R, null, 1));
await run('C368240', async () => { const o: any = {}; await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  const t2 = await p.context().newPage(); await t2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await t2.waitForTimeout(4000);
  await t2.locator('[data-test-id="profile_menu_button"]').click(); await t2.waitForTimeout(800); o.menu = await t2.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].map(e => e.innerText.trim())`);
  const so = t2.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Sign Out|Log ?out/i }).first(); o.signOut = await so.count(); if (o.signOut) { await so.click(); await t2.waitForTimeout(4000); } o.tab2 = t2.url().replace(APP, '');
  await p.bringToFront(); const nav = p.locator('a, .q-tab, button').filter({ hasText: /^\s*Reports\s*$/ }).first(); if (await nav.count()) { await nav.click(); await p.waitForTimeout(1200); const iv = p.locator('.q-menu .q-item, a').filter({ hasText: /Inventory Value/i }).first(); if (await iv.count()) await iv.click(); else await p.goto(APP + '/reports/inventory-value'); } else await p.goto(APP + '/reports/inventory-value');
  await p.waitForTimeout(6000); o.tab1 = p.url().replace(APP, ''); o.toasts = await toastsOn(p); o.rows = await p.evaluate(`document.querySelectorAll('tbody tr').length`); o.signInShown = await p.evaluate(`/sign in|log in|password/i.test(document.body.innerText)`); await shot(p, 'C368240-tab1');
  R.C368240 = o; fs.writeFileSync(path.join(EV, 'rest-batch.json'), JSON.stringify(R, null, 1)); });
await done(browser);
