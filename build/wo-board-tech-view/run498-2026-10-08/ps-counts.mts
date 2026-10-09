/** PART SALES COUNTS (2026-10-09): C368217 only — setup through the case's own clicks (Authorize, Order, Receive with
 * the vendor chosen if missing, Return part); the part sale number read off its page; the list filtered by the page's
 * own Search at the right of the header (QA lead 9 Oct). Other blocks are kept from ps-photo-fix2 but not run (ONLY).
 * FIX 2026-10-09 (ps-photo-fix): run() no longer crashes on a run that stores nothing under its own id (BLUE);
 *  the photo technician is enrolled in Service so the Schedule draws a row; the Staff row is read cell by cell. Part sales (C368215, C368216, C368217) and new-photo-after-reload (C368241-C368244), 2026-10-09.
 *  Photos: two plain squares (red, blue) made for this run; uploaded through the Edit Profile screen (the person's own
 *  session via switch-user for a technician), every POST during the upload recorded so the API route can go in the
 *  playbook. Each avatar is captured as an element picture before and after, and its colour is read afterwards (PIL),
 *  so "shows the blue photo" is a measurement, not a glance. Part sales: created by API (POST /api/part-sales), parts
 *  added through the part sale screen (playbook recipe), return by API with the screen's Return menu as the fallback. */
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
  console.log(t(), id, JSON.stringify(R[id] ?? null).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 'ps-counts.json'), JSON.stringify(R, null, 1));
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
const clickSearch = async (pg: Page) => { const box = pg.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) await pg.locator('[data-test-id="page_search_toggle"]').click(); await box.click(); await pg.waitForTimeout(300); };


const RED = path.join(EV, 'zz-photo-red.png'), BLUE = path.join(EV, 'zz-photo-blue.png');
const posts: string[] = []; const rec = (pg: Page) => pg.on('request', (r) => { if (r.method() !== 'GET' && /\/api\//.test(r.url())) posts.push(`${r.method()} ${r.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>')}`); });
async function openEditProfile(pg: Page) {
  if (!pg.url().startsWith(APP)) { await pg.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); }
  await pg.locator('[data-test-id="profile_menu_button"]').click(); await pg.waitForTimeout(800);
  const item = pg.locator('.q-menu .q-item, .q-menu a').filter({ hasText: /Edit Profile/i }).first();
  if (await item.count()) { await item.click(); } else { await pg.keyboard.press('Escape'); await pg.goto(APP + '/profile', { waitUntil: 'domcontentloaded' }); }
  await pg.waitForTimeout(3500); return pg.url().replace(APP, '');
}
async function upload(pg: Page, file: string) {
  const inp = pg.locator('input[type=file]'); const n = await inp.count();
  if (!n) { const t = pg.getByText(/Click to upload a profile photo/i).first(); if (await t.count()) { const [fc] = await Promise.all([pg.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null), t.click()]); if (fc) { await fc.setFiles(file); await pg.waitForTimeout(4000); return 'filechooser'; } } return 'no file input'; }
  await inp.first().setInputFiles(file); await pg.waitForTimeout(1500);
  const save = pg.locator('.q-dialog button, button').filter({ hasText: /^(Save|Upload|Crop|Apply|Confirm)$/i }).first(); if (await save.count() && await save.isVisible()) { await save.click(); await pg.waitForTimeout(1500); }
  await pg.waitForTimeout(3000); return `input x${n}`;
}
const snap = async (pg: Page, sel: string, name: string) => { const l = pg.locator(sel).first(); for (let i = 0; i < 10 && !(await l.count()); i++) await pg.waitForTimeout(1500); if (!(await l.count())) return `no ${sel}`; await l.scrollIntoViewIfNeeded().catch(() => {});
  // FIX 2026-10-09: wait until the photo has really loaded (a capture taken before it arrives shows a blank circle)
  let img: any = null; for (let i = 0; i < 20; i++) { img = await l.evaluate((e) => { const im = (e.tagName === 'IMG' ? e : e.querySelector('img')) as HTMLImageElement | null; return im ? { complete: im.complete, w: im.naturalWidth } : null; }).catch(() => null); if (!img || (img.complete && img.w > 0)) break; await pg.waitForTimeout(750); }
  await pg.waitForTimeout(500); await l.screenshot({ path: path.join(EV, `${name}.png`) }); return { file: `${name}.png`, img, src: await l.evaluate((e) => (e.querySelector('img') as any)?.getAttribute('src')?.replace(/[?#].*/, '').slice(-60) ?? null) }; };
const HDR = '[data-test-id="profile_menu_button"] .q-avatar, [data-test-id="profile_menu_button"] img';
const imgState = (pg: Page, _sel: string) => pg.evaluate(async () => { const i = document.querySelector('[data-test-id="profile_menu_button"] img') as HTMLImageElement | null; if (!i) return 'no img';
  let fetchStatus: any = null, type: any = null; try { const r = await fetch(i.src, { credentials: 'include' }); fetchStatus = r.status; type = r.headers.get('content-type'); } catch (e) { fetchStatus = String(e).slice(0, 80); }
  return { complete: i.complete, naturalWidth: i.naturalWidth, fetchStatus, type, src: i.src.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>').slice(-70) }; });

await run('C368241', async () => { rec(p); const o: any = {};
  o.route = await openEditProfile(p); o.red = await upload(p, RED); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  o.before = await snap(p, HDR, 'C368241-avatar-before'); o.beforeImg = await imgState(p, HDR); posts.length = 0;
  await openEditProfile(p); o.blue = await upload(p, BLUE); o.uploadCalls = [...posts]; o.noReload = await snap(p, HDR, 'C368241-avatar-noreload');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); o.after = await snap(p, HDR, 'C368241-avatar-after'); o.afterImg = await imgState(p, HDR);
  await shot(p, 'C368241-page'); R.C368241 = o; });

const photoTech = async () => { const t = (await person(a, 'ZZAUTOTEST Photo', `Tech ${stamp}`, { role: TECH_ROLE, email: `zz.wob.photo.${stamp}${D}`, clockable: true })).row; return t; };
// FIX 2026-10-09: Schedule rows are drawn only for Service-department technicians: enrol the photo tech there (app route)
const enrolService = async (staffId: string) => { const deps = (await a.get('/api/departments')).body?.data; const dl = Array.isArray(deps) ? deps : deps?.collection ?? []; const svc = dl.find((d: any) => /^Service$/i.test(d.name)); return svc ? say(await a.post('/api/staff/enrollment/create', { staffId, workplaceId: HEAVY, departmentId: svc.id })) : 'no Service department'; };
async function laneOf(staff: string) { for (let i = 0; i < 60; i++) { if (await p.locator(`[data-staff-id="${staff}"]`).count()) return true; const moved = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="schedule_calendar"]'); let e = c && c.querySelector('[data-staff-id]'); while (e && !(e.scrollHeight > e.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement; const s = e || c || document.scrollingElement; const b = s.scrollTop; s.scrollTop = b + 500; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; } return (await p.locator(`[data-staff-id="${staff}"]`).count()) > 0; }
const staffRowRead = async () => ({ heads: await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`), row: await p.evaluate(`(() => { const r = [...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes('Tech ${stamp}')); return r ? { cells: [...r.cells].map(c => c.innerText.trim()), imgs: r.querySelectorAll('img, .q-avatar').length } : null; })()`) });
let PT: any = null;
const asTechUpload = async (file: string) => { const v = await asUser(PT); try { rec(v.page); posts.length = 0; await openEditProfile(v.page); const r = await upload(v.page, file); return { r, calls: [...posts] }; } finally { await v.close(); } };
const where = { C368242: { url: '/administration/staff', sel: () => `tr:has-text("Tech ${stamp}") .q-avatar, tr:has-text("Tech ${stamp}") img` },
  C368243: { url: '/schedule', sel: () => `[data-staff-id="${PT.staff_id}"] .q-avatar, [data-staff-id="${PT.staff_id}"] img` },
  C368244: { url: '/workorders?tab=all', sel: () => `[data-test-id="board_column_header_${PT.staff_id}"] .q-avatar` } } as const;
await run('C368242', async () => { PT = await photoTech(); const o: any = { tech: PT.staff_id?.slice(0, 8), service: await enrolService(PT.staff_id) }; o.red = await asTechUpload(RED); R.C368242 = o; });
const s44 = await mkSet('ZZAUTOTEST Photo Board', [{ co: 'Alpha Co', lead: { staff_id: PT?.staff_id } }]).catch((e) => ({ err: String(e) }));
for (const id of ['C368242', 'C368243', 'C368244'] as const) await run(id, async () => { const o: any = R[id] ?? {}; const w = where[id];
  if (id === 'C368244') { await pins([PT.staff_id]); await goP(p, 'Board View', (s44 as any).q ?? ''); await toColumn(p, PT.staff_id).catch(() => {}); } else { await p.goto(APP + w.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); if (id === 'C368242') { const box = p.locator('input[type=search], input[placeholder*="Search" i]').first(); if (await box.count()) { await box.fill(`Tech ${stamp}`); await p.waitForTimeout(2500); } } }
  if (id === 'C368243') o.laneBefore = await laneOf(PT.staff_id); if (id === 'C368242') o.staffBefore = await staffRowRead(); o.before = await snap(p, w.sel(), `${id}-avatar-before`); await shot(p, `${id}-before`); R[id] = o; });
await run('BLUE', async () => { R.blueUpload = await asTechUpload(BLUE); });
for (const id of ['C368242', 'C368243', 'C368244'] as const) await run(id, async () => { const o: any = R[id] ?? {}; const w = where[id];
  if (id === 'C368244') { await goP(p, 'Board View', (s44 as any).q ?? ''); await toColumn(p, PT.staff_id).catch(() => {}); } else { await p.goto(APP + w.url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); if (id === 'C368242') { const box = p.locator('input[type=search], input[placeholder*="Search" i]').first(); if (await box.count()) { await box.fill(`Tech ${stamp}`); await p.waitForTimeout(2500); } } }
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); if (id === 'C368244') { for (let i = 0; i < 15 && !(await p.locator('[data-test-id^="board_column_header_"]').count()); i++) await p.waitForTimeout(1500); await toColumn(p, PT.staff_id).catch(() => {}); }
  if (id === 'C368242') { const box = p.locator('input[type=search], input[placeholder*="Search" i]').first(); if (await box.count()) { await box.fill(`Tech ${stamp}`); await p.waitForTimeout(2500); } }
  if (id === 'C368243') o.laneAfter = await laneOf(PT.staff_id); if (id === 'C368242') o.staffAfter = await staffRowRead(); o.after = await snap(p, w.sel(), `${id}-avatar-after`); await shot(p, `${id}-after`); R[id] = o; });

// ---- part sales
const custFor = async (name: string) => { const c = await customer(a, name); return c; };
async function partSale(name: string) { const c: any = await custFor(name); const r = await a.post('/api/part-sales', { company_id: c.id ?? c.company_id });
  const id = r.body?.data?.[0]?.id ?? r.body?.data?.id; const v = (await a.get(`/api/work-orders/view/${id}`)).body?.data; return { id, number: v?.number, create: say(r), c }; }
async function addPartUI(id: string, term: string, qty = '1') { await p.goto(APP + `/parts/part-sale/${id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); } await p.locator('[data-test-id="button_add_part"]').first().click({ force: true }); await p.waitForTimeout(1500);
  const sel = p.locator('[data-test-id="select_part"]').first(); await sel.click(); await p.keyboard.type(term, { delay: 60 }); await p.waitForTimeout(2500);
  const opt = p.locator('.q-menu .q-item').first(); if (!(await opt.count())) return `no option for ${term}`; const label = (await opt.innerText()).replace(/\s+/g, ' ').slice(0, 60); await opt.click(); await p.waitForTimeout(1200);
  const q = p.locator('[data-test-id^="input_bin_quantity_"], [data-test-id="input_workorder_part_quantity"]').first(); if (await q.count()) { await q.fill(qty); }
  await p.getByRole('button', { name: /Save & Close/i }).first().click(); await p.waitForTimeout(3000); return label; }
/** The case's own Add Part: a typed description (not a stock part), Quantity 1, Category Uncategorized, any Vendor, Cost 100,
 *  Sell Price 290.91, Save & Close. Each field is found by its label; what the window offered is recorded. */
async function addPartManual(id: string, desc: string) { await p.goto(APP + `/parts/part-sale/${id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); } await p.locator('[data-test-id="button_add_part"]').first().click({ force: true }); await p.waitForTimeout(1500);
  const d = p.locator('.q-dialog').last(); const log: any = { labels: await d.locator('.q-field__label').allInnerTexts().catch(() => []) };
  /* FIX 2 (2026-10-09): every box is found by its OWN label (the Source box's value reads "Vendor" and was taken for the
     Vendor box); Part Number is a typed new number, Description is its own required box; Source stays on Vendor. */
  const field = (re: RegExp) => d.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: re }) }).first();
  const fill = async (re: RegExp, v: string) => { const fl = field(re); if (!(await fl.count())) return `no ${re.source}`; await fl.locator('input, textarea').first().fill(v); return v; };
  const pick = async (re: RegExp, text?: string) => { const fl = field(re); if (!(await fl.count())) return `no ${re.source}`; await fl.scrollIntoViewIfNeeded().catch(() => {}); await fl.click(); await p.waitForTimeout(800); if (text) await p.keyboard.type(text, { delay: 50 }); await p.waitForTimeout(1500);
    const o = p.locator('.q-menu .q-item:not(.disabled)').filter({ hasText: text ? new RegExp(text, 'i') : /./ }).first(); if (!(await o.count())) { await p.keyboard.press('Escape').catch(() => {}); return `no option ${re.source}`; } const l = (await o.innerText()).replace(/\s+/g, ' ').slice(0, 40); await o.click(); await p.waitForTimeout(800); return l; };
  { const pn = field(/^\s*Part Number/); await pn.click(); await p.keyboard.type(`ZZPN-${Date.now() % 100000}`, { delay: 40 }); await p.waitForTimeout(1500); await p.keyboard.press('Enter'); await p.waitForTimeout(1000); await d.locator('.text-h6, .q-card__section').first().click({ position: { x: 5, y: 5 } }).catch(() => {}); }
  log.desc = await fill(/^\s*Description/, desc); log.qty = await fill(/^\s*Quantity/, '1'); log.source = (await field(/^\s*Source/).innerText().catch(() => '')).replace(/\s+/g, ' ');
  log.category = await pick(/^\s*Category/, 'Uncategorized'); log.vendor = await pick(/^\s*Vendor\s*\*?\s*$/); log.cost = await fill(/^\s*Cost/, '100'); log.sell = await fill(/^\s*Sell Price/, '290.91');
  log.labelsAfter = await d.locator('.q-field__label').allInnerTexts().catch(() => []);
  await shot(p, `C368217-add-${desc.replace(/\W+/g, '')}`); await d.getByRole('button', { name: /Save & Close/i }).first().click(); await p.waitForTimeout(3000); log.open = await p.locator('.q-dialog').count(); log.toasts = await toasts(); return log; }
const partsOf = async (id: string) => { const d = (await a.get(`/api/work-orders/lines/${id}`)).body?.data; const c = Array.isArray(d) ? d : d?.collection ?? []; return c.flatMap((l: any) => [...(l.part_requests ?? []), ...(l.parts ?? [])]); };
const psRow = async (num: string) => { const r = await a.get(`/api/part-sales?search=${encodeURIComponent(num)}&limit=50`); const d = r.body?.data; const rows = d?.partSales ?? d?.collection ?? d ?? []; return (Array.isArray(rows) ? rows : []).find((x: any) => x.number === num) ?? null; };

await run('C368215', async () => { const ps = await partSale(`ZZAUTOTEST Part Sale Card ${RUNNO}`); const o: any = { number: ps.number, create: ps.create };
  o.part = await addPartUI(ps.id, 'Brake'); await p.goto(APP + `/parts/part-sale/${ps.id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.card = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id*="status_card"], [class*="status-card"], .q-card'); return c ? c.innerText.replace(/\\n+/g, ' | ').slice(0, 500) : null; })()`);
  o.errors = await toastsOn(p); await shot(p, 'C368215-part-sale'); R.ps = ps; R.C368215 = o; });
await run('C368216', async () => { const ps = R.ps ?? await partSale(`ZZAUTOTEST Part Sale Person ${RUNNO}`); const o: any = {};
  await p.goto(APP + `/parts/part-sale/${ps.id}/part-requests`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.labels = await p.evaluate(`[...document.querySelectorAll('.q-field__label, label, .text-caption, .q-item__label--caption')].map(e => e.innerText.trim()).filter(x => x && x.length < 40).slice(0, 40)`);
  o.techField = o.labels.filter((x: string) => /technician|sales rep/i.test(x)); await shot(p, 'C368216-card'); R.C368216 = o; });
await run('C368217', async () => { const ps = await partSale(`ZZAUTOTEST Part Sale Counts ${RUNNO}`); const o: any = {};
  o.p1 = await addPartManual(ps.id, 'Brake Pads'); o.p2 = await addPartManual(ps.id, 'Brake Pads');
  // FIX: the part sale's number is read off its own page (the view call returned none); the setup follows the case's own clicks
  const page = APP + `/parts/part-sale/${ps.id}/part-requests`; const st = (x: string) => { o.stages = [...(o.stages ?? []), x]; };
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const num = ps.number ?? (await p.locator('body').innerText()).match(/\bP\d+-\d+\b/)?.[0]; o.number = num;
  const btn = (re: RegExp) => p.getByRole('button', { name: re }).first(); const dlgText = () => p.locator('.q-dialog').last().innerText().then((x) => x.replace(/\s+/g, ' ').slice(0, 300)).catch(() => null);
  await btn(/^Authorize$/).click(); await p.waitForTimeout(2000); if (await p.locator('.q-dialog').count()) { st('authorize dialog: ' + (await dlgText())); await p.locator('.q-dialog').last().getByRole('button', { name: /Authorize|Confirm|Yes|OK/i }).last().click().catch(() => {}); await p.waitForTimeout(2500); }
  st('after authorize: ' + (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200)); await shot(p, 'C368217-authorized');
  await btn(/^Order$/).click(); await p.waitForTimeout(2500); if (await p.locator('.q-dialog').count()) { st('order dialog: ' + (await dlgText())); await p.locator('.q-dialog').last().getByRole('button', { name: /Order|Create|Confirm|Save/i }).last().click().catch(() => {}); await p.waitForTimeout(3000); }
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await shot(p, 'C368217-ordered');
  await btn(/^Receive$/).click(); await p.waitForTimeout(3000); st('receive window: ' + (await dlgText())); const d = p.locator('.q-dialog').last();
  // the order can come out "Vendor missing": choose the vendor before receiving (playbook)
  const vend = d.locator('[data-test-id*="vendor" i]').first(); if (await vend.count() && /Vendor missing/i.test((await dlgText()) ?? '')) { await vend.click(); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').first().click().catch(() => {}); await p.waitForTimeout(1200); st('vendor picked'); }
  const field = (re: RegExp) => d.getByLabel(re).first(); await field(/Vendor Invoice/i).fill('ZZINV-PS1').catch(() => st('no invoice field'));
  await d.getByLabel(/Part (Number|#)/i).first().fill('ZZPN-PS1').catch(() => st('no part number field')); await d.getByLabel(/Qty Received|Received/i).first().fill('1').catch(() => st('no qty field'));
  await d.locator('tbody .q-checkbox, tbody [role=checkbox]').first().click().catch(() => st('no row tick')); await p.waitForTimeout(800); await shot(p, 'C368217-receive-window');
  await d.getByRole('button', { name: /Receive Parts/i }).first().click().catch(() => st('no Receive Parts button')); await p.waitForTimeout(4000); o.receiveToasts = await toasts();
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); st('after receive: ' + (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260));
  await btn(/Return part|^Return$/).click().catch(() => st('no Return part button')); await p.waitForTimeout(2500); st('return window: ' + (await dlgText()));
  const rd = p.locator('.q-dialog').last(); await rd.getByLabel(/Return Reason|Reason/i).first().fill('ZZAUTOTEST wrong part').catch(() => st('no reason field')); await rd.getByRole('button', { name: /Save & Close/i }).first().click().catch(() => st('no Save & Close')); await p.waitForTimeout(3500); o.returnToasts = await toasts();
  await p.goto(page, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.setupCheck = { tab: await p.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*Parts/ }).first().innerText().catch(() => null), rows: (await p.locator('tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 260) }; await shot(p, 'C368217-setup-check');
  // the second location's part sale with two parts
  await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }).catch(() => {}); const ps2 = await partSale(`ZZAUTOTEST Part Sale Counts L2 ${RUNNO}`); o.l2id = ps2.id;
  o.l2parts = [await addPartManual(ps2.id, 'Brake Pads'), await addPartManual(ps2.id, 'Brake Pads')]; await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  // the list, filtered by the page's own Search (right of the header)
  await p.goto(APP + '/parts/part-sales', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.topBar = (await p.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160);
  const box = p.locator('[data-test-id="page_search_input"]'); if (!(await box.isVisible().catch(() => false))) await p.locator('[data-test-id="page_search_toggle"]').click().catch(() => st('no page search toggle'));
  await box.fill(num ?? ''); await p.waitForTimeout(4000);
  o.headers = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim())`); o.rowText = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => [...r.cells].map(c => c.innerText.trim()).join(' | ')).slice(0, 5)`);
  await shot(p, 'C368217-list'); R.C368217 = o; });

await a.put(PREF, { value: ORIGINAL }); R.restored = true;
fs.writeFileSync(path.join(EV, 'ps-counts.json'), JSON.stringify(R, null, 1));
await RUN.end();
await done(browser);
