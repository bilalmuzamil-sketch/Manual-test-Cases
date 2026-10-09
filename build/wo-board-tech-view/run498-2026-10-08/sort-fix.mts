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
import { viewAs } from './viewas.mts';
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
  fs.writeFileSync(path.join(EV, 'sort-fix.json'), JSON.stringify(R, null, 1));
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

/** make/model ids borrowed from an existing vehicle whose make and model match */
const vehiclesSeen: any[] = [];
async function makeModel(make: RegExp, model: RegExp) {
  // vehicles carry the names as vehicle_make / vehicle_model (a string or {name}) next to vehicle_maker_id / vehicle_model_id
  const nm = (x: any) => typeof x === 'string' ? x : x?.name ?? x?.title ?? '';
  const qs = [model.source.replace(/[^A-Za-z0-9 ]/g, ''), make.source.replace(/[^A-Za-z0-9 ]/g, ''), ''];
  for (const q of qs) for (let page = 1; page <= (q ? 2 : 6); page++) {
    const r = await a.get(`/api/vehicles?pagination[rowsPerPage]=200&pagination[page]=${page}${q ? '&search=' + encodeURIComponent(q) : ''}`);
    const rows = r.body?.data?.collection ?? r.body?.data?.vehicles ?? r.body?.data ?? [];
    if (!Array.isArray(rows) || !rows.length) break;
    vehiclesSeen.push(...rows.slice(0, 2).map((v: any) => `${v.year} ${nm(v.vehicle_make)} ${nm(v.vehicle_model)}`));
    const hit = rows.find((v: any) => make.test(nm(v.vehicle_make)) && model.test(nm(v.vehicle_model)) && v.vehicle_maker_id && v.vehicle_model_id);
    if (hit) return { maker: hit.vehicle_maker_id, model: hit.vehicle_model_id, from: `${hit.year ?? ''} ${nm(hit.vehicle_make)} ${nm(hit.vehicle_model)}`.trim() };
  }
  return null;
}
async function shape(c: any, vid: string, o: { unit: string; year?: number; mm?: any; vin?: string }) {
  return say(await a.post('/api/vehicles/change', { vehicle_id: vid, company_id: c.company_id, customer_id: c.contact_id, unit: o.unit, year: o.year ?? null, vehicle_maker_id: o.mm?.maker ?? null, vehicle_model_id: o.mm?.model ?? null, ...(o.vin !== undefined ? { vin: o.vin } : {}) }));
}

await run('C368196', async () => {
  const q = `ZZAUTOTEST List Sort ${RUNNO}`; const o: any = {}; const plan = [{ co: 'Alpha Co', unit: 'U-3', lines: 1, lead: ANA, mk: [/^Ford$/i, /Explorer/i] }, { co: 'Bravo Co', unit: 'U-1', lines: 3, lead: BEN, mk: [/Freightliner/i, /Cascadia|M2/i] }, { co: 'Charlie Co', unit: 'U-2', lines: 2, lead: null, mk: [/Kenworth|Peterbilt|International/i, /.+/] }] as const;
  const made: any = {};
  for (const x of plan) { const cst = await customer(a, `${q} ${x.co}`, x.unit); const w = await workOrder(a, cst, 'estimate', null); const ls: string[] = []; for (let i = 0; i < x.lines; i++) ls.push((await a.post(`/api/work-orders/${w}/lines/create-from-canned-line`, { canned_line_id: canned[(i + 1) % canned.length].id, status: 'authorized' })).body?.data?.line_id);
    await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); if (x.lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: x.lead.staff_id });
    const m = await makeModel(x.mk[0] as RegExp, x.mk[1] as RegExp); made[x.co] = { id: w, ls, c: cst, mm: m?.from ?? null, shape: m ? await shape(cst, cst.vehicle_id, { unit: x.unit, year: 2020, mm: m }) : 'no make found' }; }
  o.assets = Object.fromEntries(Object.entries(made).map(([k, v]: any) => [k, `${v.mm} ${v.shape}`]));
  // Clocked In: Ralph on Bravo's first line, Dana on Charlie's first line (each in their own session), Alpha nobody
  const RE = (await staffRows(a, 'zz.wob.ralph.edwards@staging.shopview.local'))[0]; const DO = (await staffRows(a, 'zz.wob.dana.ortiz@staging.shopview.local'))[0]; const me = (await (await import('./data.mts')).candidates(a)).find((x: any) => x.name === 'Admin ShopView')!;
  for (const [tech, co] of [[RE, 'Bravo Co'], [DO, 'Charlie Co']] as const) { if (!tech) { o[`clock ${co}`] = 'technician not found'; continue; } const v = await viewAs(browser, p, a, tech.id, me.id, RUN.toRunner);
    try { const pg = v.page; await pg.goto(`${APP}/workorders/${made[co].id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); const st = pg.locator(`[data-test-id="button_clock_toggle_task_${made[co].ls[0]}"]`).first(); o[`clock ${co}`] = await st.count(); await st.click().catch(() => {}); await pg.waitForTimeout(3000); } finally { await v.close(); } }
  await goList(p, q); const pin = p.locator('tbody tr').filter({ hasText: 'Alpha Co' }).first().locator('[data-test-id*="vehicle_here"], button:has(i:text-matches("place|location_on"))').first(); await pin.click().catch(() => {}); await p.waitForTimeout(2500);
  o.onSiteApi = Object.fromEntries((await workOrders(a, q)).map((w: any) => [w.companyName?.split(' ').slice(-2).join(' '), w.vehicleHere]));
  await goList(p, q);
  const table = () => p.evaluate(`(() => { const hs = [...document.querySelectorAll('thead th')].map(h => h.innerText.replace(/arrow_drop_(up|down)/g, '').trim()); return [...document.querySelectorAll('tbody tr')].filter(r => /S\\d+-\\d+/.test(r.innerText)).map(r => Object.fromEntries([...r.cells].map((c, i) => [hs[i], c.innerText.replace(/content_copy/g, '').trim() || ((c.querySelector('i') || {}).className || '').replace(/.*(text-[a-z-]+).*/, '$1')]))); })()`) as Promise<any[]>;
  for (const h of ['On Site', 'Asset', 'Clocked In']) { const th = p.locator('thead th').filter({ hasText: h }).first(); await th.click(); await p.waitForTimeout(2200); const r1 = await table(); await th.click(); await p.waitForTimeout(2200); const r2 = await table();
    o[h] = { first: r1.map((r) => `${r.Number} ${r[h]}`), second: r2.map((r) => `${r.Number} ${r[h]}`), distinct: new Set(r1.map((r) => r[h])).size }; }
  await shot(p, 'C368196-varied'); R.C368196 = o; });
await a.put(PREF, { value: ORIGINAL }); R.restored = true; fs.writeFileSync(path.join(EV, 'sort-fix.json'), JSON.stringify(R, null, 1)); await RUN.end(); await done(browser);
