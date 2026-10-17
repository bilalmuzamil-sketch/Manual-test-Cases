/**
 * moved-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C368131 alone (ONLY=C368131), "Pinned technician columns after
 * deactivation or removal from this location". On 17 Oct step 3 changed Theresa's Location on the screen, she was STILL offered at Heavy
 * Duty (eligibleAfterLocationField: true), and moved-stg4.mts then removed her Heavy Duty enrolment behind the screen — a state the case's
 * step does not make. Now step 3 is done THROUGH THE SCREEN ONLY, exactly as the case words it (Settings > Staff > her edit icon >
 * Location from Heavy Duty to Lethbridge > Save & Close, staffloc.mts), then her record (Location, active) and whether she is still offered
 * as a technician at Heavy Duty are read; if changing Location alone leaves her offered, THAT is the reading — nothing is added behind the
 * screen — and steps 4-15 read what the screen shows. Everything else is moved-stg4.mts's code, copied unchanged (lines 23-244; only the
 * start tag, output file, picture prefix and step 3 changed). Output EV/moved-r4-<ONLY>.json; pictures EV/C368131-r4-*.png. Records only.
 * ───────────────────────────── COPIED FROM moved-stg4.mts (lines 23-244, 17 Oct 2026) ─────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders, type Api } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, toasts, shiftPrompt, woPageLead, findRow } from './wob.mts';
import { staffRows, person, HEAVY, LETH } from './staff.mts';
import { viewAs } from './viewas.mts';
import { setStaffLocation } from './staffloc.mts';
import { startState, setDisplay } from './fixup-1017.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const D = '@staging.shopview.local';
const ORG = (await import('./profile.mts')).ORG;
const PREF = '/api/users/me/preferences/work-orders-list';
R.clearedLeftoverSwitch = (await a.post('/api/exit-switch-user', {})).status;
// 17 Oct 2026: fix-up — log the saved display / collapsed groups / pins found BEFORE anything is set, clear the saved collapsed groups
// (C96970 drags Tech View rows) and read them back
R.startState = await startState(p, a, 'moved-r4', { clearCollapsed: true });
const rl = (await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data; const roles: any[] = Array.isArray(rl) ? rl : rl?.collection ?? [];
const TECH_ROLE = roles.find((r) => /^Technician$/i.test(r.label ?? r.name ?? ''))?.id;
if (!TECH_ROLE) throw new Error('no Technician role in this organisation');
const depsR = (await a.get('/api/departments')).body?.data; const deps: any[] = Array.isArray(depsR) ? depsR : depsR?.collection ?? [];
const SERVICE = deps.find((d) => (d.name ?? d.label) === 'Service')?.id;
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const wps = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/workplaces')).body?.data);
const LETH_NAME = wps.find((w: any) => w.id === LETH)?.name ?? 'Staging Lethbridge - 4310';
const HEAVY_NAME = wps.find((w: any) => w.id === HEAVY)?.name ?? 'Staging Heavy Duty - 9919';
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 140) : ''}`;
const row = async (email: string) => (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email.toLowerCase());
const eligible = async (staffId: string) => (await candidates(a)).some((c) => c.id === staffId);
const leads = async (n: string) => (await workOrders(a, n)).sort((x: any, y: any) => String(x.number).localeCompare(String(y.number), 'en', { numeric: true })).map((w: any) => `${w.number} lead=${w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none'}`);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-stg4-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 12000));
  fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
}
/** a technician of this case, active, enrolled at Heavy Duty (Service) with Heavy Duty in Location, and also enrolled at Lethbridge
 *  when `alsoLeth` (so the Location field can offer Lethbridge) */
async function tech(first: string, last: string, tag: string, alsoLeth = false) {
  const email = `zz.wob.${tag}${D}`;
  const { row: r0, log } = await person(a, first, last, { role: TECH_ROLE, email, clockable: true });
  if (!r0) throw new Error(`technician ${first} ${last} not made: ${log.join('; ')}`);
  const out: string[] = [...log];
  if (!r0.is_active) out.push('reactivate ' + say(await a.post('/api/iam/change-status', { id: r0.id })));
  out.push('enrol Heavy ' + say(await a.post('/api/staff/enrollment/create', { staffId: r0.staff_id, workplaceId: HEAVY, departmentId: SERVICE })));
  let r = await row(email);
  if (r.workplace_id && r.workplace_id !== HEAVY) out.push('Location back to Heavy ' + say(await a.post(`/api/staff/${r.staff_id}/change`, { first_name: r.first_name, last_name: r.last_name, email: r.email, role_id: r.role_id, workplace_id: HEAVY, job_title: r.job_title, salary_type: r.salary_type, salary: r.salary, billable: !!r.billable, clockable: true })));
  if (alsoLeth) out.push('enrol Lethbridge ' + say(await a.post('/api/staff/enrollment/create', { staffId: r0.staff_id, workplaceId: LETH, departmentId: SERVICE })));
  r = await row(email);
  return { email, id: r.id as string, staff_id: r.staff_id as string, name: `${first} ${last}`, setup: out, active: r.is_active, location: r.defaultWorkplaceName ?? r.workplace_id };
}
/** the case's customer with exactly `wanted` work orders, oldest first, each led by the given technician */
async function caseWorkOrders(n: string, unit: string, wanted: string[]) {
  let have = await workOrders(a, n);
  if (have.length < wanted.length) { const c = await customer(a, n, unit); for (let i = have.length; i < wanted.length; i++) await workOrder(a, c, 'approved', null); have = await workOrders(a, n); }
  have.sort((x: any, y: any) => String(x.number).localeCompare(String(y.number), 'en', { numeric: true }));
  const set: string[] = [];
  for (let i = 0; i < wanted.length; i++) if (have[i].techAssignedId !== wanted[i]) set.push(`${have[i].number} ` + say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: have[i].id, tech_assigned_id: wanted[i] })));
  return { wos: have.slice(0, wanted.length), set };
}
const setPrefs = async (aa: Api, pins: string[]) => { const pv = (await aa.get(PREF)).body?.data?.value ?? {}; return (await aa.put(PREF, { value: { ...pv, pinnedTechnicianIds: pins, filters: {} } })).status; };
/** move a technician off Heavy Duty the way the app does: Location field on the staff screen, then the old enrolment removed */
async function moveOff(x: { email: string; staff_id: string }) {
  const o: any = {};
  try { o.locationField = await setStaffLocation(p, x.email.split('@')[0], LETH_NAME.slice(0, 18)); } catch (e: any) { o.locationFieldError = String(e?.message || e).slice(0, 160); }
  o.locationNow = (await row(x.email))?.defaultWorkplaceName; o.eligibleAfterLocationField = await eligible(x.staff_id);
  o.unenrolHeavy = say(await a.post('/api/staff/enrollment/remove', { staffId: x.staff_id, workplaceId: HEAVY, departmentId: SERVICE }));
  o.eligibleAfterUnenrol = await eligible(x.staff_id);
  return o;
}
async function putBack(x: { email: string; id: string; staff_id: string }, deactivate = true) {
  const o: string[] = [];
  o.push('enrol Heavy ' + say(await a.post('/api/staff/enrollment/create', { staffId: x.staff_id, workplaceId: HEAVY, departmentId: SERVICE })));
  const r = await row(x.email);
  if (r && r.workplace_id !== HEAVY) o.push('Location Heavy ' + say(await a.post(`/api/staff/${r.staff_id}/change`, { first_name: r.first_name, last_name: r.last_name, email: r.email, role_id: r.role_id, workplace_id: HEAVY, job_title: r.job_title, salary_type: r.salary_type, salary: r.salary, billable: !!r.billable, clockable: true })));
  o.push('unenrol Leth ' + say(await a.post('/api/staff/enrollment/remove', { staffId: x.staff_id, workplaceId: LETH, departmentId: SERVICE })));
  if (deactivate && (await row(x.email))?.is_active) o.push('deactivate ' + say(await a.post('/api/iam/change-status', { id: x.id })));
  return o;
}
/** Settings > Staff > search the FULL email > edit > Deactivate Account > confirm (the screen route, step 2 of C368131) */
async function uiDeactivate(email: string) {
  const o: any = {};
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
  await p.locator('input[placeholder*="earch" i]:visible, input[data-test-id="page_search_input"]:visible').first().fill(email); await p.waitForTimeout(3000);
  const tr = p.locator('tr').filter({ hasText: email }); o.rowsFound = await tr.count();
  if (o.rowsFound !== 1) return { ...o, done: false };
  await tr.first().locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500);
  const btn = p.locator('button:visible').filter({ hasText: /Deactivate/i }).first(); o.button = await btn.innerText().catch(() => null);
  if (!o.button) return { ...o, done: false };
  await btn.click(); await p.waitForTimeout(1500);
  o.confirmText = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ').slice(0, 200))`);
  const conf = p.locator('.q-dialog').last().locator('button:visible').filter({ hasText: /Deactivate|Confirm|Yes|OK/i }).last();
  if (await conf.count()) { await conf.click(); await p.waitForTimeout(3000); }
  const save = p.locator('button:visible').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).last(); if (await save.count()) { await save.click().catch(() => {}); await p.waitForTimeout(2500); }
  o.toasts = await toasts(p);
  return { ...o, done: true };
}
// 17 Oct 2026: fix-up — on the main page the display is chosen AND read back (setDisplay); the view-only user's window keeps the plain click
const bv = async (pg: Page, n: string, d = 'Board View') => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); if (pg === p) await setDisplay(pg, a, d, `bv ${n}`); else await display(pg, d); if (n) await search(pg, n); };
/** the columns drawn on screen, left to right, with their full header text */
const cols = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].map(h => { const id = h.getAttribute('data-test-id').replace('board_column_header_', ''); const c = document.querySelector('[data-test-id="board_column_' + id + '"]'); const pin = document.querySelector('[data-test-id="button_board_pin_' + id + '"]');
  return { id: id.slice(0, 8), name: ((document.querySelector('[data-test-id="board_column_name_' + id + '"]') || {}).textContent || '').trim(), header: h.innerText.replace(/\\s+/g, ' ').trim(), pinned: pin ? pin.getAttribute('aria-pressed') : 'no pin control', cards: c ? [...c.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : [], empty: ((document.querySelector('[data-test-id="board_column_empty_' + id + '"]') || {}).innerText || '').replace(/\\s+/g, ' ').trim() || null, left: Math.round(h.getBoundingClientRect().left) }; })`) as Promise<any[]>;
const onScreen = (pg: Page, sel: string) => pg.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return 'not drawn'; const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.width > 0 ? 'on screen @' + Math.round(r.left) : 'off screen @' + Math.round(r.left); })()`) as Promise<string>;
/** 15 Oct 2026 (wave 11, fourth pass): no message was read after the drop on the moved technician's column — the old read came ~4 s
 *  after letting go, so a short message could have gone. Now a MutationObserver is started BEFORE the press (as stg-new5's toastWatch)
 *  and records, with the time since the press, every message (.q-notification) and every other short text that appears on the page
 *  (a refusal note drawn over the column, a tooltip, a dialog). The drag is HELD over the target for a moment so what shows while
 *  holding is read and photographed (<pic>-holding), then released; the watch keeps running for 5 s after the drop. */
const watchStart = (pg: Page) => pg.evaluate(`(() => { window.__mw = []; window.__mw0 = Date.now(); if (window.__mo) window.__mo.disconnect();
  const add = (kind, txt, el) => { const t = (txt || '').replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info|block|do_not_disturb)\\s*/, '').replace(/\\s*close$/i, '').trim(); if (!t || t.length > 200) return; if (window.__mw.some(x => x.text === t && x.kind === kind)) return; window.__mw.push({ ms: Date.now() - window.__mw0, kind, text: t, cls: String(el && el.className || '').slice(0, 60) }); };
  const grab = (muts) => { for (const e of document.querySelectorAll('.q-notification')) add('message', e.innerText, e);
    for (const m of muts || []) for (const nd of m.addedNodes || []) { if (nd.nodeType !== 1) continue; const r = nd.getBoundingClientRect ? nd.getBoundingClientRect() : null; if (!r || r.width === 0) continue; if (nd.closest && nd.closest('.q-notification')) continue;
      const txt = nd.innerText || ''; if (txt && txt.length <= 200) add(nd.closest && nd.closest('.q-tooltip') ? 'tooltip' : nd.closest && nd.closest('.q-dialog') ? 'dialog' : 'new text', txt, nd); } };
  window.__mo = new MutationObserver(grab); window.__mo.observe(document.body, { childList: true, subtree: true, characterData: true }); grab([]); })()`);
const watchRead = (pg: Page) => pg.evaluate('window.__mw || []') as Promise<{ ms: number; kind: string; text: string; cls: string }[]>;
/** 17 Oct 2026: fix-up — bring an element on screen: if it is drawn, scroll it to the middle; if not (the board draws only the columns
 *  near the screen, the Tech View table only the rows near it), step the board's sideways scroller, then the table's, from the start
 *  until it is drawn. Returns where it ended ('on screen' / 'off screen @x,y' / 'not drawn'). Every step is bounded. */
const reveal = (pg: Page, sel: string) => pg.evaluate(`(async () => { const sleep = (ms) => new Promise(r => setTimeout(r, ms)); const find = () => document.querySelector(${JSON.stringify(sel)});
  if (!find()) { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) { h.scrollLeft = 0; h.dispatchEvent(new Event('scroll')); await sleep(400); for (let i = 0; i < 400 && !find(); i++) { const b = h.scrollLeft; h.scrollLeft += 700; h.dispatchEvent(new Event('scroll')); await sleep(250); if (h.scrollLeft === b) break; } } }
  if (!find()) { const v = document.querySelector('.q-table__middle'); if (v) { v.scrollTop = 0; await sleep(400); for (let i = 0; i < 200 && !find(); i++) { const b = v.scrollTop; v.scrollTop += 400; await sleep(250); if (v.scrollTop === b) break; } } }
  const e = find(); if (!e) return 'not drawn'; e.scrollIntoView({ block: 'center', inline: 'center' }); await sleep(700);
  const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && r.width > 0 ? 'on screen' : 'off screen @' + Math.round(r.left) + ',' + Math.round(r.top); })()`).catch((e) => 'reveal failed: ' + String(e).slice(0, 60)) as Promise<string>;
let lastReach: any = null;
async function holdDrop(from: string, to: string, pic: string, dy: number) {
  // 17 Oct 2026: fix-up — on 16 Oct every drag read "from: not drawn" (the card's column was far along the ~260-column board) and the
  // drag timed out on the card. Now the card/row is brought on screen first (reveal); if the target is not on screen with it, the drag is
  // started, the target is brought on screen WHILE HOLDING (the board / table scrolled to it), its box read afresh, then the drop.
  // Where each end was is kept (lastReach -> o.reach) so a refusal is only judged when both ends were really reached.
  lastReach = { from: await reveal(p, from) }; lastReach.toBeforePress = await onScreen(p, to);
  const a1 = await p.locator(from).first().boundingBox({ timeout: 8000 }).catch(() => null); if (!a1) throw new Error(`drag: missing ${from} (${lastReach.from})`);
  const gx = a1.x + a1.width * 0.45; await watchStart(p);
  await p.mouse.move(gx, a1.y + a1.height / 2); await p.mouse.down(); await p.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 });
  if (!String(lastReach.toBeforePress).startsWith('on screen')) { await p.mouse.move(gx + 30, a1.y + a1.height / 2 + 20, { steps: 4 }); lastReach.toWhileHolding = await reveal(p, to); }
  const b1 = await p.locator(to).first().boundingBox({ timeout: 8000 }).catch(() => null);
  if (!b1) { await p.mouse.up().catch(() => {}); throw new Error(`drag: missing ${to} (${lastReach.toWhileHolding ?? lastReach.toBeforePress})`); }
  lastReach.toAtDrop = await onScreen(p, to);
  await p.mouse.move(b1.x + b1.width / 2, b1.y + dy, { steps: 20 }); await p.waitForTimeout(900);
  const holding = await watchRead(p); await shot(p, `${pic}-holding`);
  await p.mouse.up(); await p.waitForTimeout(300); await shot(p, `${pic}-just-dropped`);
  return holding;
}
/** drag, Keep shifts if asked, then read the message and the lead */
async function dropTry(from: string, to: string, n: string, pic: string, dy = 120) {
  const o: any = { from: await onScreen(p, from), to: await onScreen(p, to) };
  lastReach = null; try { o.whileHolding = await holdDrop(from, to, pic, dy); } catch (e: any) { o.dragError = String(e?.message || e).slice(0, 160); }
  o.reach = lastReach; // 17 Oct 2026: fix-up — where each end was when the card was pressed and dropped
  o.shiftPrompt = await shiftPrompt(p, 'Keep shifts'); o.message = await toasts(p); await shot(p, pic);
  await p.waitForTimeout(4000); o.watched = await watchRead(p); o.leads = await leads(n);
  return o;
}


const OUT4 = path.join(EV, `moved-r4${only.length ? '-' + only.join('-') : ''}.json`);
/** step 3 through the screen only: the Location field on her staff form, Save & Close; then her record and eligibility read */
async function moveOffScreenOnly(x: { email: string; staff_id: string }) {
  const o: any = { before: { location: (await row(x.email))?.defaultWorkplaceName, offeredAtHeavy: await eligible(x.staff_id) } };
  try { o.locationField = await setStaffLocation(p, x.email.split('@')[0], LETH_NAME.slice(0, 18)); } catch (e: any) { o.locationFieldError = String(e?.message || e).slice(0, 160); }
  await shot(p, 'C368131-r4-step3-after-save');
  const r = await row(x.email); o.after = { location: r?.defaultWorkplaceName ?? r?.workplace_id, active: r?.is_active, offeredAtHeavy: await eligible(x.staff_id) };
  o.enrolmentRemovedBehindScreen = false;
  o.reading = o.after.offeredAtHeavy ? 'Location changed on the screen, and she is STILL offered as a technician at Heavy Duty (nothing added behind the screen)' : 'Location changed on the screen and she is no longer offered at Heavy Duty';
  return o;
}

// ── C368131 ────────────────────────────────────────────────────────────
await run('C368131', async () => {
  const n = 'ZZAUTOTEST C368131 Pinned Gone';
  const o: any = {};
  const TA = await tech('Aaa ZZAUTOTEST Tara', 'Lead', 'aaa.tara.lead');                // {Technician-A} (e.g. Esther Howard)
  const TB = await tech('Aaa ZZAUTOTEST Jenny', 'Pinned', 'aaa.jenny.pinned');          // {Technician-B}: leads nothing
  const TC = await tech('Aaa ZZAUTOTEST Theresa', 'Pinned', 'aaa.theresa.pinned', true); // {Technician-C}
  o.technicians = { A: TA, B: TB, C: TC };
  const { wos, set } = await caseWorkOrders(n, 'ZZC131', [TA.staff_id, TC.staff_id]); const [w1, w2] = wos;
  o.workOrders = { set, now: await leads(n), wo1: w1.number, wo2: w2.number };
  const VO = await row(`zz.wob.viewonly${D}`); if (!VO) throw new Error('view-only user zz.wob.viewonly not found');
  const pinsBefore: string[] = ((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  o.pins = { admin: await setPrefs(a, [TB.staff_id, TC.staff_id]) };
  { const v = await viewAs(browser, p, a, VO.id, me.id); try { o.pins.viewOnly = await setPrefs(api(v.page), [TB.staff_id, TC.staff_id]); o.viewOnlyPerms = v.perms; } finally { await v.close(); } }
  // FIX-UP 2c (17 Oct 2026): on 17 Oct the admin's board showed "Brandi Smith" pinned at step 7 (a pin from outside this case), so step 7 and
  // the drags of steps 9-11 could not be read. The admin's pins are now read (START STATE found), set to exactly the case's two
  // ({Technician-B} Jenny Pinned and {Technician-C} Theresa Pinned), the page reloaded so the app holds them (a page loaded earlier saves its
  // own copy of the preference back), and read back saved AND on screen (START STATE set). Just before step 7 the saved pins are read
  // again: if something OUTSIDE the case replaced them (a person neither B nor C), they are put back and that is logged; if the product
  // itself dropped B or C (the behaviour under test), nothing is re-applied.
  const pinName = (id: string) => id === TB.staff_id ? 'Technician-B' : id === TC.staff_id ? 'Technician-C' : String(id).slice(0, 8);
  console.log(t(), 'START STATE found C368131', JSON.stringify({ adminPins: pinsBefore.map(pinName) }));
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
  o.pinsSet = { saved: (((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? []).map(pinName) };
  await bv(p, n); o.pinsSet.screen = (await cols(p)).slice(0, 4).map((c: any) => `${c.name}:${c.pinned}`); await shot(p, 'C368131-r4-start-pins');
  console.log(t(), 'START STATE set C368131', JSON.stringify(o.pinsSet));
  try {
    // steps 1-2: deactivate {Technician-B} on the staff screen
    o.step2 = await uiDeactivate(TB.email);
    if (!o.step2.done) o.step2.apiFallback = say(await a.post('/api/iam/change-status', { id: TB.id }));
    o.step2.activeNow = (await row(TB.email))?.is_active;
    // step 3: {Technician-C}'s Location from Heavy Duty to Lethbridge (and the old enrolment removed — see the top comment)
    // ROUND 4: step 3 THROUGH THE SCREEN ONLY, as the case words it (Location field, Save & Close); no enrolment removed behind the screen
    o.step3 = await moveOffScreenOnly(TC);
    console.log(t(), 'C368131 step 3 (screen only)', JSON.stringify(o.step3));
    // steps 4-7
    { const savedNow: string[] = ((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? []; o.pinsBeforeStep7 = savedNow.map(pinName);
      const outsiders = savedNow.filter((x) => x !== TB.staff_id && x !== TC.staff_id); if (outsiders.length) { o.pinsReapplied = { found: o.pinsBeforeStep7, put: await setPrefs(a, [TB.staff_id, TC.staff_id]) }; console.log(t(), 'C368131 pins changed outside the case before step 7; put back', JSON.stringify(o.pinsReapplied)); } }
    await bv(p, n); o.step7 = (await cols(p)).slice(0, 7); await shot(p, 'C368131-r4-step7-pinned');
    // step 8
    o.step8 = { columnFound: await toColumn(p, TC.staff_id) }; o.step8.column = (await cols(p)).find((c) => c.id === TC.staff_id.slice(0, 8)) ?? 'no column'; await shot(p, 'C368131-r4-step8-techC');
    await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(800);
    // step 9: WO-1 onto {Technician-B}
    o.step9 = await dropTry(`[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${TB.staff_id}"]`, n, 'C368131-r4-step9');
    // steps 10-11: WO-1 onto {Technician-C}
    o.step10 = await dropTry(`[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${TC.staff_id}"]`, n, 'C368131-r4-step11');
    // steps 12-13: WO-2 from {Technician-C} onto Unassigned
    o.step12 = await dropTry(`[data-test-id="board_card_${w2.id}"]`, '[data-test-id="board_column_unassigned"]', n, 'C368131-r4-step13');
    const all = await allBoardCols(p); o.step13 = { unassignedHoldsWo2: all.find((c) => c.id === 'unassigned')?.cards.includes(w2.number) ?? null, techCColumn: all.some((c) => c.id === TC.staff_id) ? 'still has a column' : 'no column', columnsRead: all.length };
    await (globalThis as any).__shotEach?.('C368131-board');
    // steps 14-15: the view-only user in their own window
    const v = await viewAs(browser, p, a, VO.id, me.id);
    try { await bv(v.page, ''); o.step15 = { first: (await cols(v.page)).slice(0, 6) }; const all2 = await allBoardCols(v.page); o.step15.techCColumn = all2.some((c) => c.id === TC.staff_id) ? 'has a column' : 'no column'; o.step15.techBColumn = all2.find((c) => c.id === TB.staff_id) ?? 'no column'; await shot(v.page, 'C368131-r4-step15-viewonly'); }
    finally { await v.close(); }
  } finally {
    for (const w of [w1, w2]) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: null });
    o.restore = { C: await putBack(TC), A: await putBack(TA), B: await putBack(TB) };
    o.restore.pinsAdmin = await setPrefs(a, pinsBefore);
    const v = await viewAs(browser, p, a, VO.id, me.id); try { o.restore.pinsViewOnly = await setPrefs(api(v.page), []); } finally { await v.close(); }
    o.restore.read = { A: (await row(TA.email))?.is_active, B: (await row(TB.email))?.is_active, C: (await row(TC.email))?.is_active, CLocation: (await row(TC.email))?.defaultWorkplaceName };
  }
  R.C368131 = o;
});


fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
await done(browser);
