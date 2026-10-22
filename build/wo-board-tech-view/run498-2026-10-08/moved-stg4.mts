/**
 * moved-stg4.mts — 15 Oct 2026, fourth pass on STAGING: C368131 (pinned technician deactivated / moved to another location)
 * and C96970 (drops refused on a deactivated technician and on one moved to another location), as their CURRENT steps read.
 *
 * WHY THIS SCRIPT (second-pass faults, both the script's):
 *  - C368131 (s3-batchC.mts): the staff screen was searched for "ayesha.khan", which also matches "ayesha.khan+2026@…"
 *    ("Ayesha Tech Role"), so the WRONG person was moved; Ayesha Khan stayed here and stayed pinned; no refusal was read.
 *  - C96970 (s4-batchA.mts): the second technician was Nick Noclock (Time Clock off) instead of one moved to another location.
 *  - Both cases were rewritten to their own technicians; on staging ~119 technicians sort before/between the usual names, so a
 *    drag between two columns far apart never had both on screen.
 * WHAT IT DOES: each case gets its OWN technicians, made here (role Technician, department Service, Time Clock on, Staging Heavy
 * Duty - 9919), whose names start "Aaa ZZAUTOTEST …" so their columns/groups stand together right after Unassigned and every
 * drag happens with both ends on screen. Every person is found by their FULL unique email. "Moved to another location" is done
 * the way the app does it (playbook "Taking a technician OFF a location", D5): the Location field on the staff screen
 * (Settings > Staff > edit > Location > Save & Close, setStaffLocation) — read who counts as a technician after that alone — and
 * then the enrolment at the old location removed (POST /api/staff/enrollment/remove), read again. Deactivation in C368131 step 2
 * is done on the staff screen (edit > Deactivate Account); set-up deactivation (C96970) by the same app call
 * (POST /api/iam/change-status). Pins and "nothing filtered" are set on the saved choices (set-up). Every drag answers a
 * "Clear … scheduled shifts?" prompt with Keep shifts if one appears. Each case ends by putting its technicians back at Heavy Duty
 * and then deactivating them with no work orders left, so their columns do not stand in front of other checks; the next run
 * reactivates them.
 */
import { ME_NAME, LOC1_NAME } from './profile.mts';
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
R.startState = await startState(p, a, 'moved-stg4', { clearCollapsed: true });
const rl = (await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data; const roles: any[] = Array.isArray(rl) ? rl : rl?.collection ?? [];
const TECH_ROLE = roles.find((r) => /^Technician$/i.test(r.label ?? r.name ?? ''))?.id;
if (!TECH_ROLE) throw new Error('no Technician role in this organisation');
const depsR = (await a.get('/api/departments')).body?.data; const deps: any[] = Array.isArray(depsR) ? depsR : depsR?.collection ?? [];
const SERVICE = deps.find((d) => (d.name ?? d.label) === 'Service')?.id;
const me = (await candidates(a)).find((x) => x.name === ME_NAME)!;
const wps = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/workplaces')).body?.data);
const LETH_NAME = wps.find((w: any) => w.id === LETH)?.name ?? 'Staging Lethbridge - 4310';
const HEAVY_NAME = wps.find((w: any) => w.id === HEAVY)?.name ?? LOC1_NAME;
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 140) : ''}`;
const row = async (email: string) => (await staffRows(a, email)).find((x) => String(x.email).toLowerCase() === email.toLowerCase());
const eligible = async (staffId: string) => (await candidates(a)).some((c) => c.id === staffId);
const leads = async (n: string) => (await workOrders(a, n)).sort((x: any, y: any) => String(x.number).localeCompare(String(y.number), 'en', { numeric: true })).map((w: any) => `${w.number} lead=${w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none'}`);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-stg4-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 12000));
  fs.writeFileSync(path.join(EV, 'moved-stg4.json'), JSON.stringify(R, null, 1));
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
  await bv(p, n); o.pinsSet.screen = (await cols(p)).slice(0, 4).map((c: any) => `${c.name}:${c.pinned}`); await shot(p, 'C368131-start-pins');
  console.log(t(), 'START STATE set C368131', JSON.stringify(o.pinsSet));
  try {
    // steps 1-2: deactivate {Technician-B} on the staff screen
    o.step2 = await uiDeactivate(TB.email);
    if (!o.step2.done) o.step2.apiFallback = say(await a.post('/api/iam/change-status', { id: TB.id }));
    o.step2.activeNow = (await row(TB.email))?.is_active;
    // step 3: {Technician-C}'s Location from Heavy Duty to Lethbridge (and the old enrolment removed — see the top comment)
    o.step3 = await moveOff(TC);
    // steps 4-7
    { const savedNow: string[] = ((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? []; o.pinsBeforeStep7 = savedNow.map(pinName);
      const outsiders = savedNow.filter((x) => x !== TB.staff_id && x !== TC.staff_id); if (outsiders.length) { o.pinsReapplied = { found: o.pinsBeforeStep7, put: await setPrefs(a, [TB.staff_id, TC.staff_id]) }; console.log(t(), 'C368131 pins changed outside the case before step 7; put back', JSON.stringify(o.pinsReapplied)); } }
    await bv(p, n); o.step7 = (await cols(p)).slice(0, 7); await shot(p, 'C368131-stg4-step7-pinned');
    // step 8
    o.step8 = { columnFound: await toColumn(p, TC.staff_id) }; o.step8.column = (await cols(p)).find((c) => c.id === TC.staff_id.slice(0, 8)) ?? 'no column'; await shot(p, 'C368131-stg4-step8-techC');
    await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(800);
    // step 9: WO-1 onto {Technician-B}
    o.step9 = await dropTry(`[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${TB.staff_id}"]`, n, 'C368131-stg4-step9');
    // steps 10-11: WO-1 onto {Technician-C}
    o.step10 = await dropTry(`[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${TC.staff_id}"]`, n, 'C368131-stg4-step11');
    // steps 12-13: WO-2 from {Technician-C} onto Unassigned
    o.step12 = await dropTry(`[data-test-id="board_card_${w2.id}"]`, '[data-test-id="board_column_unassigned"]', n, 'C368131-stg4-step13');
    const all = await allBoardCols(p); o.step13 = { unassignedHoldsWo2: all.find((c) => c.id === 'unassigned')?.cards.includes(w2.number) ?? null, techCColumn: all.some((c) => c.id === TC.staff_id) ? 'still has a column' : 'no column', columnsRead: all.length };
    await (globalThis as any).__shotEach?.('C368131-board');
    // steps 14-15: the view-only user in their own window
    const v = await viewAs(browser, p, a, VO.id, me.id);
    try { await bv(v.page, ''); o.step15 = { first: (await cols(v.page)).slice(0, 6) }; const all2 = await allBoardCols(v.page); o.step15.techCColumn = all2.some((c) => c.id === TC.staff_id) ? 'has a column' : 'no column'; o.step15.techBColumn = all2.find((c) => c.id === TB.staff_id) ?? 'no column'; await shot(v.page, 'C368131-stg4-step15-viewonly'); }
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

// ── C96970 ─────────────────────────────────────────────────────────────
await run('C96970', async () => {
  const n = 'ZZAUTOTEST C96970 Refused Drops';
  const o: any = {};
  const TA = await tech('Aaa ZZAUTOTEST Ina', 'Inactive', 'aaa.ina.inactive');          // {Technician-A}: deactivated after set-up
  const TB = await tech('Aaa ZZAUTOTEST Mia', 'Holder', 'aaa.mia.holder');              // {Technician-B} (e.g. Ralph Edwards)
  const TC = await tech('Aaa ZZAUTOTEST Mona', 'Moved', 'aaa.mona.moved', true);         // {Technician-C}: moved to another location
  o.technicians = { A: TA, B: TB, C: TC };
  const { wos, set } = await caseWorkOrders(n, 'ZZC970', [TA.staff_id, TB.staff_id, TC.staff_id]); const [w1, w2, w3] = wos;
  o.workOrders = { set, wo1: w1.number, wo2: w2.number, wo3: w3.number };
  const pinsBefore: string[] = ((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  try {
    // set-up: {Technician-A} deactivated after the leads were given; {Technician-C} pinned, then moved off this location
    o.setupDeactivateA = say(await a.post('/api/iam/change-status', { id: TA.id })); o.aActive = (await row(TA.email))?.is_active;
    o.pinC = await setPrefs(a, [TC.staff_id]);
    o.moveC = await moveOff(TC); o.cStillActive = (await row(TC.email))?.is_active;
    o.leadsAtStart = await leads(n);
    // steps 1-3
    await bv(p, n); o.step3 = (await cols(p)).slice(0, 7); await shot(p, 'C96970-stg4-step3');
    // 17 Oct 2026: fix-up — step 3 reads {Technician-A}'s and {Technician-C}'s headers: each column is brought on screen and read (the
    // first seven columns alone did not hold them on 16 Oct)
    o.step3Headers = {}; for (const [k, x] of [['A', TA], ['C', TC]] as const) { const found = await toColumn(p, x.staff_id); o.step3Headers[k] = found ? (await cols(p)).find((c) => c.id === x.staff_id.slice(0, 8)) ?? 'drawn but not read' : 'no column'; await shot(p, `C96970-stg4-step3-tech${k}`); }
    await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(800);
    // steps 4-5: WO-2 onto {Technician-A}; steps 6-7: onto {Technician-C}
    o.step4 = await dropTry(`[data-test-id="board_card_${w2.id}"]`, `[data-test-id="board_column_${TA.staff_id}"]`, n, 'C96970-stg4-step5');
    o.step5 = (await cols(p)).filter((c) => c.cards.includes(w2.number)).map((c) => c.name);
    o.step6 = await dropTry(`[data-test-id="board_card_${w2.id}"]`, `[data-test-id="board_column_${TC.staff_id}"]`, n, 'C96970-stg4-step7');
    o.step7 = (await cols(p)).filter((c) => c.cards.includes(w2.number)).map((c) => c.name);
    // steps 8-9: Tech View
    await setDisplay(p, a, 'Tech View', 'C96970 step 8'); if (!(await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(p, n); // 17 Oct 2026: fix-up — read back
    const gs = await groups(p); o.step9 = gs.filter((g) => [TA.staff_id, TB.staff_id, TC.staff_id, 'unassigned'].includes(g.id)).map((g) => ({ name: g.name, count: g.count, rows: g.rows, pin: g.pin?.pressed ?? null }));
    o.step9Headers = await p.evaluate(`[${JSON.stringify(TA.staff_id)}, ${JSON.stringify(TC.staff_id)}].map(id => { const g = document.querySelector('[data-test-id="tech_view_group_' + id + '"]'); return g ? g.innerText.replace(/\\s+/g, ' ').trim() : 'not drawn'; })`);
    await shot(p, 'C96970-stg4-step9');
    // steps 10-12: the row onto {Technician-A}'s group, then onto {Technician-C}'s group
    await findRow(p, w2.id);
    const rowSel = `[data-test-id="tech_view_row_${w2.id}"]`;
    const tdrop = async (to: string, pic: string) => { const r: any = { from: await onScreen(p, rowSel), to: await onScreen(p, to) }; lastReach = null; try { r.whileHolding = await holdDrop(rowSel, to, pic, 10); } catch (e: any) { r.dragError = String(e?.message || e).slice(0, 160); } r.reach = lastReach; r.shiftPrompt = await shiftPrompt(p, 'Keep shifts'); r.message = await toasts(p); await shot(p, pic); await p.waitForTimeout(4000); r.watched = await watchRead(p); r.leads = await leads(n); r.rowGroup = await findRow(p, w2.id); return r; };
    o.step10 = await tdrop(`[data-test-id="tech_view_group_${TA.staff_id}"]`, 'C96970-stg4-step10');
    o.step11 = await tdrop(`[data-test-id="tech_view_group_${TC.staff_id}"]`, 'C96970-stg4-step11');
    o.step12 = { group: await findRow(p, w2.id), techBId: TB.staff_id };
    // step 13
    o.step13 = await woPageLead(p, APP, w2.id);
  } finally {
    for (const w of [w1, w2, w3]) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: null });
    o.restore = { C: await putBack(TC), A: await putBack(TA), B: await putBack(TB) };
    o.restore.pins = await setPrefs(a, pinsBefore);
  }
  R.C96970 = o;
});

fs.writeFileSync(path.join(EV, 'moved-stg4.json'), JSON.stringify(R, null, 1));
await done(browser);
