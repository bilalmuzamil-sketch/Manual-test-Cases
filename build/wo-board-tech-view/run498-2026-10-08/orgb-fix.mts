/** Second organisation (2026-10-09): C368175 (line technician lists offer no other-organisation staff) and C154650
 *  (Tech View / Board View show only this organisation and location). Organisation B is made through the branch's own
 *  /register page (playbook §X): its only staff member is its administrator, registered as "ZZAUTOTEST OrgB Tech".
 *  Limit (playbook §X, not a choice): nobody can sign in to B from the branch, so B cannot hold a work order; the
 *  "organisation B work order" clause of C154650 is reported as not observed. */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders, vehicle } from './data.mts';
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
  fs.writeFileSync(path.join(EV, 'orgb-fix.json'), JSON.stringify(R, null, 1));
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


const orgName = `ZZAUTOTEST F3 Scope OrgB ${RUNNO}`; const orgEmail = `zz.wob.orgb.${RUNNO}@staging.shopview.local`;
await run('REGISTER', async () => { const o: any = {}; const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: st, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });   // FIX 2026-10-09: /register is now a signed-in page (route meta public:false); a bare SSO-only session lands on Login const pg = await ctx.newPage(); o.cookieNames = st.cookies.filter((c: any) => /sso/i.test(c.name)).map((c: any) => c.name);
  try { await pg.goto(APP + '/register', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); o.url = pg.url().replace(APP, ''); o.labels = await pg.evaluate(`[...document.querySelectorAll('.q-field__label, label')].map(e => e.innerText.trim()).filter(Boolean)`);
    const fill = async (re: RegExp, v: string) => { const f = pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: re }) }).first(); if (await f.count()) { await f.locator('input').first().fill(v); return 'ok'; } return 'no field'; };
    o.fill = [await fill(/email/i, orgEmail), await fill(/first/i, 'ZZAUTOTEST'), await fill(/last/i, 'OrgB Tech'), await fill(/company/i, orgName), await fill(/start|number/i, String(5000 + Number(RUNNO) % 4000))];
    await pg.screenshot({ path: path.join(EV, 'OrgB-register.png') }); const resp = pg.waitForResponse((r) => /\/api\/register/.test(r.url()), { timeout: 20000 }).catch(() => null);
    await pg.locator('button').filter({ hasText: /Register/i }).first().click(); const r = await resp; o.register = r ? r.status() : 'no response'; await pg.waitForTimeout(4000); o.after = (await pg.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 200);
  } finally { await ctx.close(); }
  const users = (await a.get(`/api/users?search=${encodeURIComponent('OrgB Tech')}`)).body?.data; const list = Array.isArray(users) ? users : users?.collection ?? users?.users ?? [];
  o.orgsList = ((await a.get('/api/organizations')).body?.data ?? []).map((x: any) => x.name ?? x.company_name ?? x.id).slice(0, 5); o.visibleInApi = list.filter((u: any) => /OrgB Tech/.test(`${u.first_name ?? u.firstName} ${u.last_name ?? u.lastName}`)).length; o.orgs = ((await a.get('/api/organizations')).body?.data ?? []).length ?? null; R.REGISTER = o; });

const scanList = async (pg: Page) => { const seen = new Set<string>(); for (let i = 0; i < 80; i++) { for (const t of await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [])) seen.add(t.replace(/^check\s*/, '').replace(/\s+/g, ' ').trim()); const moved = await pg.evaluate(`(() => { const m = document.querySelector('.q-menu .q-virtual-scroll, .q-menu'); if (!m) return false; const b = m.scrollTop; m.scrollTop = b + 400; return m.scrollTop !== b; })()`); await pg.waitForTimeout(200); if (!moved) break; } return [...seen]; };
const optsFor = async (pg: Page, term: string) => { await pg.keyboard.type(term, { delay: 40 }); await pg.waitForTimeout(2000); return (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()); };
await run('C368175', async () => { const w = await one('ZZAUTOTEST Other Org Lists', ANA, 1); const o: any = {};
  await page(w.id); await p.locator('[data-test-id="button_new_line"]').click(); await p.waitForTimeout(2500); let d = dlg();
  await d.locator('[data-test-id="select_line_canned_line"]').click(); await p.keyboard.type('ZZAUTOTEST Typed line zq', { delay: 30 }); await p.waitForTimeout(2000); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
  await d.locator('[data-test-id="select_line_roster_add_technician"]').click().catch(() => {}); await p.waitForTimeout(700); { const all = await scanList(p); o.newLineCount = all.length; o.newLineOrgB = all.filter((x) => /OrgB/i.test(x)); o.newLineHasAna = all.some((x) => /Ana Alpha/.test(x)); } o.newLineAna = (await optsFor(p, '').catch(() => [])).length; await shot(p, 'C368175-newline');
  await p.keyboard.press('Escape'); await d.locator('[data-test-id="button_close_dialog"]').click().catch(() => {}); await p.waitForTimeout(1200);
  await p.getByText(lineName(1), { exact: false }).first().click(); await p.waitForTimeout(2500); d = dlg(); await d.locator('[data-test-id="select_line_roster_add_technician"]').click().catch(async () => { await d.locator('.q-field').filter({ hasText: /Add Technician/ }).first().click(); });
  await p.waitForTimeout(700); { const all = await scanList(p); o.editLineCount = all.length; o.editLineOrgB = all.filter((x) => /OrgB/i.test(x)); o.editLineHasAna = all.some((x) => /Ana Alpha/.test(x)); } await shot(p, 'C368175-editline'); await p.keyboard.press('Escape'); await d.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click().catch(() => {}); await p.waitForTimeout(1200);
  // positive control: the same lists DO find an organisation-A technician by part of the name
  await p.getByText(lineName(1), { exact: false }).first().click(); await p.waitForTimeout(2500); d = dlg(); await d.locator('[data-test-id="select_line_roster_add_technician"]').click().catch(() => {}); await p.waitForTimeout(700); o.controlAna = (await optsFor(p, 'ZZAUTOTEST Ana')).length; await p.keyboard.press('Escape'); await d.locator('[data-test-id="button_close_dialog"], button:has(i:text-is("close"))').first().click().catch(() => {}); await p.waitForTimeout(1000);
  // Edit labor (line menu)
  // FIX: 'the three-dots button left of the line name' is line_number_<lineId> (its menu holds Edit labor)
  await p.locator(`[data-test-id="line_number_${w.ls[0]}"]`).click().catch(() => {}); await p.waitForTimeout(1000);
  o.laborMenu = (await p.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ')); const ed = p.locator('.q-menu .q-item').filter({ hasText: /Edit labor/i }).first();
  if (await ed.count()) { await ed.click(); await p.waitForTimeout(2000); d = dlg(); const tf = d.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Technician/ }) }).first(); await tf.click(); await p.waitForTimeout(700); { const all = await scanList(p); o.editLaborCount = all.length; o.editLaborOrgB = all.filter((x) => /OrgB/i.test(x)); } await shot(p, 'C368175-editlabor'); await p.keyboard.press('Escape'); }
  o.note = "server refusal of another organisation's technician: not checked by hand"; R.C368175 = o; });

await run('C154650', async () => { const o: any = {}; await p.setViewportSize({ width: 2560, height: 1100 });
  const loc2Tech = (await person(a, 'ZZAUTOTEST F3 Scope', `Loc2 Tech ${RUNNO}`, { role: TECH_ROLE, email: `zz.wob.scope.loc2.${RUNNO}@staging.shopview.local`, clockable: true, workplace: LETH })).row;
  o.toLeth = say(await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' })); const c = await customer(a, `ZZAUTOTEST F3 Scope Loc2 Customer ${RUNNO}`, 'ZZL2');
  const w2 = await workOrder(a, c, 'estimate', null); await mkLine(w2, 1); await a.post('/api/work-orders/change-status', { id: w2, status: 'approved' }); o.lead = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w2, tech_assigned_id: loc2Tech.staff_id }));
  o.atLeth = (await workOrders(a, 'F3 Scope Loc2 Customer ' + RUNNO)).length; o.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
  const s = await mkSet('ZZAUTOTEST F3 Scope Here', [{ co: 'Alpha Co', lead: ANA }]);
  const emptyMsg = () => p.evaluate(`(document.body.innerText.match(/No work orders match[^\\n]*/) || [null])[0]`);
  for (const [term, key] of [['F3 Scope OrgB', 'orgB'], [`F3 Scope Loc2 Customer ${RUNNO}`, 'loc2'], [s.q, 'controlHere']] as const) { await goP(p, 'Tech View', term); o[`${key}Tech`] = { empty: await emptyMsg(), rows: await p.locator('[data-test-id^="tech_view_row_"]').count() };
    await expandSmallGroups(p).catch(() => {}); if (key === 'controlHere') o[`${key}Tech`].rowsAfterExpand = await p.locator('[data-test-id^="tech_view_row_"]').count();
    await display(p, 'Board View'); await p.waitForTimeout(2500); if (key === 'controlHere') await toColumn(p, ANA.staff_id).catch(() => {}); o[`${key}Board`] = { empty: await emptyMsg(), cards: await p.locator('[data-test-id^="board_card_"]').count() }; await shot(p, `C154650-${key}`); }
  await goP(p, 'Board View', s.q); await toColumn(p, ANA.staff_id).catch(() => {});
  const box = await openReassign(p, s.w['Alpha Co'].id, 'board').then(() => true).catch(() => false); o.reassignOpened = box;
  if (box) { const inp = p.locator('.q-dialog input').first(); await inp.fill('OrgB'); await p.waitForTimeout(2000); o.reassignOrgB = (await p.locator('.q-dialog').innerText()).replace(/\s+/g, ' ').slice(0, 300); await inp.fill('Loc2 Tech'); await p.waitForTimeout(2000); o.reassignLoc2 = (await p.locator('.q-dialog').innerText()).replace(/\s+/g, ' ').slice(0, 300); await inp.fill('ZZAUTOTEST Ben'); await p.waitForTimeout(2000); o.reassignControlBen = /Ben Bravo/.test(await p.locator('.q-dialog').innerText()); await shot(p, 'C154650-reassign'); await p.keyboard.press('Escape'); }
  await goP(p, 'Board View', ''); { const seen = new Set<string>(); await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`).catch(() => {}); for (let i = 0; i < 400; i++) { for (const t of await p.locator('[data-test-id^="board_column_header_"]').allInnerTexts().catch(() => [])) seen.add(t.split('\n').find((x) => x.trim().length > 2) || t); const mv = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft += 1200; return h.scrollLeft !== b; })()`).catch(() => false); await p.waitForTimeout(300); if (!mv) break; } o.columnsRead = seen.size; o.orgBColumns = [...seen].filter((x) => /OrgB/i.test(x)); o.controlColumnAna = [...seen].some((x) => /Ana Alpha/.test(x)); }
  o.notObserved = 'an organisation-B work order: nobody can sign in to the new organisation from the branch (playbook §X), so it holds none'; R.C154650 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'orgb-fix.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
