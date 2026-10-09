/**
 * High-risk regression, second half (2026-10-09): the List — tab clears search (C368193), a column stays after reload
 * (C368194), a new user's default columns (C368195), header sorting (C368196), Invoiced sort (C368198), fast tab switching
 * (C368199), the row's On Site toggle (C368200), Back after a status change (C368201), links (C368203, C368204, C368205),
 * no financial data (C368206), view-only (C368207, C368208), phone width (C368209, C368210, C368211), another location
 * (C368212), Back / Forward (C368214). Runs as our own test admin (runner.mts); other people by viewAs.
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
  fs.writeFileSync(path.join(EV, 'high2-batch.json'), JSON.stringify(R, null, 1));
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



const LETH = 'f8a8b802-7780-4b16-bf10-343caeb616b2';
const rowsList = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [''])[0]).filter(Boolean)`) as Promise<string[]>;
const statusesList = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).map(r => r.querySelector('td:nth-child(2)')?.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const listHeads = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace('arrow_drop_up','').trim()).filter(Boolean)`) as Promise<string[]>;
const colMenu = async (pg: Page = p) => { await pg.locator('[data-test-id="button_column_selection"]').click(); await pg.waitForTimeout(1000);
  const r = await pg.evaluate(`[...document.querySelectorAll('.q-menu [data-test-id^="toggle_column_"]')].map(e => [e.getAttribute('data-test-id').replace('toggle_column_', ''), (e.querySelector('[role=switch]') || e).getAttribute('aria-checked')])`) as [string, string][]; await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); return r; };
const searchBox = (pg: Page = p) => pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null);
const goList = async (pg: Page, q = '', t = 'All') => { await pg.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, t); await display(pg, 'List'); if (q) await search(pg, q); };
const activeTabName = () => p.evaluate(`(() => { const e = document.querySelector('.q-tab--active, [role=tab][aria-selected=true]'); return e ? e.innerText.trim() : null; })()`);
const assignedOn = () => p.locator('[data-test-id="filter_chip_assigned_to_me"]').evaluate((e) => e.getAttribute('aria-pressed') ?? (/(selected|active|bg-primary|text-primary)/.test(e.className) ? 'true' : 'false')).catch(() => null);
const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;

await run('C368193', async () => { await goList(p, 'ZZAUTOTEST Tab Clears Search'); const o: any = { before: await searchBox() }; await tab(p, 'Estimates'); await p.waitForTimeout(2500); o.after = await searchBox(); o.rows = (await rowsList()).length; o.statuses = [...new Set(await statusesList())].slice(0, 5); R.C368193 = o; });

await run('C368194', async () => { await goList(p); const o: any = { before: (await colMenu()).find((x) => x[0] === 'daysOpen') };
  await p.locator('[data-test-id="button_column_selection"]').click(); await p.waitForTimeout(800); const t = p.locator('[data-test-id="toggle_column_daysOpen"]');
  if ((await t.locator('[role=switch]').getAttribute('aria-checked').catch(() => null)) !== 'true') await t.click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  o.step4 = (await listHeads()).some((h) => /days open/i.test(h)); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  o.step5 = (await listHeads()).some((h) => /days open/i.test(h)); o.heads = await listHeads(); R.C368194 = o; });

await run('C368195', async () => { const u = await mkUser('ZZAUTOTEST', `ListNew ${stamp}`, ADMIN_ROLE, 'listnew'); const v = await asUser(u); const o: any = {};
  try { o.saved = await prefFor(); await goList(v.page); o.heads = await listHeads(v.page); o.menu = await colMenu(v.page); } finally { await v.close(); } R.C368195 = o; });

await run('C368196', async () => {
  // three work orders that DIFFER in every column a person can set: unit, number of lines (so Lines and Total Price),
  // status, lead, and On Site (one turned on from the List); each header is then judged on the cell values themselves
  const q = `ZZAUTOTEST List Sort ${RUNNO}`; const plan = [{ co: 'Alpha Co', unit: 'U-3', lines: 1, lead: ANA, st: 'approved' }, { co: 'Bravo Co', unit: 'U-1', lines: 3, lead: BEN, st: 'in_progress' }, { co: 'Charlie Co', unit: 'U-2', lines: 2, lead: null, st: 'estimate' }];
  for (const x of plan) { const c = await customer(a, `${q} ${x.co}`, x.unit); const w = await workOrder(a, c, 'estimate', null); for (let i = 0; i < x.lines; i++) await mkLine(w, i + 1);
    if (x.st !== 'estimate') await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); if (x.lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: x.lead.staff_id }); if (x.st === 'in_progress') await a.post('/api/work-orders/change-status', { id: w, status: 'in_progress' }); }
  await goList(p, q); const o: any = { heads: {} };
  const first = p.locator('tbody tr').filter({ hasText: 'Alpha Co' }).first(); await first.locator('[data-test-id*="vehicle_here"], button:has(i:text-matches("place|location_on"))').first().click().catch(() => {}); await p.waitForTimeout(2000);
  const table = () => p.evaluate(`(() => { const hs = [...document.querySelectorAll('thead th')].map(h => h.innerText.replace(/arrow_drop_(up|down)/g, '').trim()); return [...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).map(r => Object.fromEntries([...r.cells].map((c, i) => [hs[i], (c.querySelector('i') && !c.innerText.replace(/location_on|content_copy/g, '').trim() ? (c.querySelector('i').className.match(/text-[a-z-]+/) || [''])[0] : c.innerText.replace(/location_on|content_copy/g, '').trim())]))); })()`) as Promise<any[]>;
  for (const h of await listHeads()) { const th = p.locator('thead th').filter({ hasText: h }).first(); if (!(await th.locator('i, .q-icon').filter({ hasText: /arrow/ }).count())) { o.heads[h] = 'not sortable'; continue; }
    await th.click(); await p.waitForTimeout(2200); const r1 = await table(); await th.click(); await p.waitForTimeout(2200); const r2 = await table();
    const v1 = r1.map((r) => r[h]), v2 = r2.map((r) => r[h]); o.heads[h] = { first: v1, second: v2, numbers1: r1.map((r) => r.Number), distinct: new Set(v1).size, reversed: JSON.stringify(r1.map((r) => r.Number)) === JSON.stringify(r2.map((r) => r.Number).reverse()) }; }
  await shot(p, 'C368196-list'); R.C368196 = o; });

await run('C368198', async () => {
  const s = await mkSet('ZZAUTOTEST Invoice Order', [{ co: 'X Co', lead: ANA, status: 'invoiced' }]); await p.waitForTimeout(65_000);
  const s2 = await mkSet('ZZAUTOTEST Invoice Order', [{ co: 'Y Co', lead: ANA, status: 'invoiced' }]);
  await goList(p); await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Invoiced/ }).first().click(); await p.waitForTimeout(1500); await p.keyboard.press('Escape');
  await p.locator('[data-test-id="button_column_selection"]').click(); await p.waitForTimeout(800); const t = p.locator('[data-test-id="toggle_column_invoicedDate"]'); if ((await t.locator('[role=switch]').getAttribute('aria-checked').catch(() => null)) !== 'true') await t.click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  await search(p, 'ZZAUTOTEST Invoice Order'); const r = await rowsList();
  R.C368198 = { x: s.w['X Co'].number, y: s2.w['Y Co'].number, rows: r, yAboveX: r.indexOf(s2.w['Y Co'].number) >= 0 && r.indexOf(s2.w['Y Co'].number) < r.indexOf(s.w['X Co'].number), heads: await listHeads() };
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900); await p.locator('.q-menu').getByText('Clear selection').first().click(); await p.keyboard.press('Escape'); });

await run('C368199', async () => { await goList(p); const errs: string[] = []; p.on('response', (r) => { if (r.status() >= 400 && /api\/work-orders/.test(r.url())) errs.push(`${r.status()}`); });
  for (const t2 of ['Estimates', 'Completed', 'Work Orders', 'Completed']) { await p.locator('.q-tab, [role=tab]').filter({ hasText: new RegExp('^\\s*' + t2 + '\\s*$') }).first().click(); await p.waitForTimeout(150); }
  await p.waitForTimeout(6000); R.C368199 = { active: await activeTabName(), statuses: [...new Set(await statusesList())], toasts: await toasts(p), apiErrors: errs.slice(0, 5) }; await shot(p, 'C368199'); });

await run('C368200', async () => { const s = await mkSet('ZZAUTOTEST Row Toggle', [{ co: 'One Co', lead: ANA }]); await goList(p, s.q);
  const here = async () => (await a.get(`/api/work-orders/view/${s.w['One Co'].id}`)).body?.data?.work_order?.is_vehicle_here;
  const o: any = { before: await here() }; const tr = p.locator('tbody tr').filter({ hasText: s.w['One Co'].number });
  await tr.locator('[data-test-id="button_vehicle_here_toggle"]').first().click(); await p.waitForTimeout(2500); o.url = p.url().replace(APP, ''); o.after = await here(); R.C368200 = o; });

await run('C368201', async () => { const s = await mkSet('ZZAUTOTEST Back Status', [{ co: 'One Co', lead: ANA }]); await goList(p, s.q); const num = s.w['One Co'].number; const o: any = {};
  await p.locator('tbody tr').filter({ hasText: num }).locator('td').nth(2).click(); await p.waitForTimeout(5000); o.opened = p.url().replace(APP, '');
  // to Review the way the page does it: complete the line (tech story + mileage), the work order goes to review
  const w = s.w['One Co'].id; await a.post('/api/work-orders/change-mileage', { work_order_id: w, mileage: '123456' });
  for (const l of await linesRaw(w)) { for (const q of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {}); await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: w }); }
  const l = (await linesRaw(w))[0]; await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator(`[data-test-id="button_action_complete_line_${l.line_id}"]`).click(); await p.waitForTimeout(2500); const dlg = p.locator('.q-dialog:visible');
  o.dialog = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
  for (let i = 0; i < 3 && await dlg.count(); i++) { const b = dlg.locator('button').filter({ hasText: /Complete (All )?Line|Complete Line|Confirm/i }).last(); if (await b.count()) { await b.click(); await p.waitForTimeout(2500); } else break; }
  o.toasts = await toasts(p); o.status = (await workOrders(a, s.q))[0]?.status;
  await p.goBack(); await p.waitForTimeout(3500); o.backUrl = p.url().replace(APP, ''); o.rowStatus = await p.locator('tbody tr').filter({ hasText: num }).locator('td').nth(1).innerText().catch(() => null); await shot(p, 'C368201-back');
  R.C368201 = o; });

await run('C368203', async () => { await goList(p); await p.goto(APP + '/workorders?tab=estimate&assigned_to_me=1', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C368203 = { tab: await activeTabName(), assigned: await assignedOn(), url: p.url().replace(APP, '') }; await shot(p, 'C368203'); });
await run('C368204', async () => { await goList(p); const saved = { tab: await activeTabName(), assigned: await assignedOn() };
  await p.goto(APP + '/workorders?tab=estimate&assigned_to_me=1', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: 'Work Orders' }).first().click(); await p.waitForTimeout(4000);
  R.C368204 = { saved, afterTopMenu: { tab: await activeTabName(), assigned: await assignedOn(), url: p.url().replace(APP, '') } };
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); R.C368204.plainAddress = { tab: await activeTabName(), assigned: await assignedOn() }; });
await run('C368205', async () => { await goList(p); await p.waitForTimeout(1500); const n0 = (await rowsList()).length; const tot0 = await p.locator('.q-table__bottom').innerText().catch(() => null);
  await p.goto(APP + '/workorders?vehicleHere=2', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const o: any = { rowsBefore: n0, rowsAfter: (await rowsList()).length, bottomBefore: tot0, bottomAfter: await p.locator('.q-table__bottom').innerText().catch(() => null), toasts: await toasts(p) };
  await p.locator('[data-test-id="filter_chip_vehicleHere"]').click(); await p.waitForTimeout(900); o.chip = await p.locator('[data-test-id="filter_chip_vehicleHere"]').innerText().catch(() => null); o.filter = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' ').trim()).join(' || ')`); o.checked = await p.evaluate(`[...document.querySelectorAll('.q-menu [aria-checked="true"], .q-menu .q-radio__inner--truthy, .q-menu .q-checkbox__inner--truthy')].length`); await shot(p, 'C368205-filter'); await p.keyboard.press('Escape'); R.C368205 = o; });

await run('C368206', async () => { const orig = await roleRead(VIEW_ROLE); const set = async (on: boolean) => say(await a.put(`/api/roles/${VIEW_ROLE}`, { name: orig.name, description: orig.description, view_mode: orig.view_mode, template_id: orig.template_id, fe_permissions: (orig.fe_permissions ?? []).map((x: any) => x.id), cross_toggles: { ...(orig.cross_toggles ?? {}), seeFinancialData: on } }));
  const o: any = { off: await set(false) }; const u = await mkUser('ZZAUTOTEST', `NoFin ${stamp}`, VIEW_ROLE, 'nofin'); const v = await asUser(u);
  try { await goList(v.page); o.heads = await listHeads(v.page); o.menu = (await colMenu(v.page)).map((x) => x[0]); await v.page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`); await v.page.waitForTimeout(1000);
    o.bottom = await v.page.locator('.q-table__bottom').innerText().catch(() => null); o.dollars = ((await v.page.locator('main, .q-page').first().innerText()).match(/\$\s?[\d,]+\.\d\d/g) ?? []).slice(0, 5); await shot(v.page, 'C368206'); } finally { await v.close(); }
  o.restore = await set(!!orig?.cross_toggles?.seeFinancialData); R.C368206 = o; });

await run('C368207', async () => { const u = await mkUser('ZZAUTOTEST', `VO ${stamp}`, VIEW_ROLE, 'vo'); const v = await asUser(u); const o: any = {};
  try { await goList(v.page); o.createButton = await v.page.locator('[data-test-id="button_new_work_order"]:visible').count(); o.perms = v.perms; } finally { await v.close(); } R.C368207 = o; });

await run('C368208', async () => { const s = await mkSet('ZZAUTOTEST View Only Toggle', [{ co: 'One Co', lead: ANA }]); const here = async () => (await a.get(`/api/work-orders/view/${s.w['One Co'].id}`)).body?.data?.work_order?.is_vehicle_here;
  const u = await mkUser('ZZAUTOTEST', `VOT ${stamp}`, VIEW_ROLE, 'vot'); const o: any = {}; const v = await asUser(u);
  try { await goList(v.page, s.q); const tr = v.page.locator('tbody tr').filter({ hasText: s.w['One Co'].number }); const tg = tr.locator('[data-test-id="button_vehicle_here_toggle"]').first();
    o.disabled = await tg.evaluate((e) => (e as any).disabled || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled')).catch(() => 'no toggle'); await RUN.toRunner(); o.before = await here(); await a.post('/api/switch-user', { user_id: u.id });
    await tg.click({ force: true }).catch(() => {}); await v.page.waitForTimeout(2500); await v.page.reload({ waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(4000); } finally { await v.close(); }
  o.after = await here(); R.C368208 = o; });

// phone width
const phone = async () => { await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(1500); };
const desk = async () => { await p.setViewportSize({ width: 1600, height: 1000 }); await p.waitForTimeout(1500); };
const cardNums = () => p.evaluate(`[...new Set((document.querySelector('main, .q-page') || document.body).innerText.match(/S\\d+-\\d+/g) || [])]`) as Promise<string[]>;
await run('C368209', async () => { await phone(); await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); const o: any = {};
  const sb = p.locator('[aria-label="Sort work orders"]').first(); o.sortButton = await sb.count(); if (o.sortButton) { await sb.click(); await p.waitForTimeout(900); o.options = await p.locator('.q-menu .q-item').allInnerTexts(); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /Customer A-Z/i }).first().click().catch(() => {}); await p.waitForTimeout(2500); }
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); if (o.sortButton) { await sb.click(); await p.waitForTimeout(900); o.ticked = await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => /check/.test(e.innerText) || e.classList.contains('q-item--active')).map(e => e.innerText.replace('check','').trim())`); await p.keyboard.press('Escape'); }
  o.customers = await p.evaluate(`[...document.querySelectorAll('.q-card, [data-test-id*="card"]')].map(c => c.innerText.split('\\n').find(l => /[A-Za-z]{3}/.test(l) && !/^S\\d/.test(l)) || '').filter(Boolean).slice(0, 8)`); await shot(p, 'C368209-phone'); await desk(); R.C368209 = o; });
await run('C368210', async () => { await phone(); await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await p.waitForTimeout(2500);
  const o: any = { before: (await cardNums()).length }; for (let i = 0; i < 6; i++) { await p.evaluate(`(() => { const s = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).pop(); (s || document.scrollingElement).scrollTop = 1e9; window.scrollTo(0, 1e9); })()`); await p.waitForTimeout(1500); }
  const after = await cardNums(); o.after = after.length; o.unique = new Set(after).size === after.length; await desk(); R.C368210 = o; });
await run('C368211', async () => { await phone(); await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await search(p, 'zz-no-such-work-order');
  const o: any = { message: (await p.locator('main, .q-page').first().innerText()).split('\n').filter((l) => /match|no work orders/i.test(l)).slice(0, 3), clearFilters: await p.getByText('Clear filters').count() };
  await shot(p, 'C368211-phone'); const x = p.locator('[aria-label="Clear search"], [data-test-id="page_search_input"] ~ * i').filter({ hasText: /cancel|close|clear/ }).first(); if (await x.count()) { await x.click(); await p.waitForTimeout(2500); } o.afterClear = (await cardNums()).length; await desk(); R.C368211 = o; });

await run('C368212', async () => { const o: any = {}; o.toLeth = say(await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }));
  const s = await mkSet('ZZAUTOTEST Loc2 Customer', [{ co: 'WO', lead: null }]).catch((e) => { o.createError = String(e).slice(0, 160); return null as any; });
  o.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
  if (s) { const num = s.w['WO'].number; o.num = num; await goList(p, 'Loc2'); o.heavyLoc2 = (await rowsList()).includes(num); await search(p, num); o.heavyByNumber = (await rowsList()).includes(num);
    await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }); await goList(p, 'Loc2'); o.lethLoc2 = (await rowsList()).includes(num); o.lethTopBar = await p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`);
    await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }); }
  R.C368212 = o; });

await run('C368214', async () => { const s = await mkSet('ZZAUTOTEST Back Forward', [{ co: 'One Co', lead: ANA }]); const num = s.w['One Co'].number; const o: any = {};
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'Work Orders'); await display(p, 'List'); o.statusButton = await p.locator('[data-test-id="filter_chip_status"]:visible').count();
  if (o.statusButton) { await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu .q-item, .q-menu .q-checkbox').filter({ hasText: /^\s*Approved\s*$/ }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); }
  await search(p, s.q); const st = async () => ({ tab: await activeTabName(), search: await searchBox(), rows: await rowsList(), url: p.url().replace(APP, '') });
  o.step3 = await st(); await p.locator('tbody tr').filter({ hasText: num }).locator('td').nth(2).click(); await p.waitForTimeout(4500); o.opened = p.url().replace(APP, '');
  await p.goBack(); await p.waitForTimeout(4000); o.step5 = await st(); await p.goForward(); await p.waitForTimeout(4000); o.step6 = p.url().replace(APP, ''); await p.goBack(); await p.waitForTimeout(4000); o.step7 = await st(); R.C368214 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'high2-batch.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
