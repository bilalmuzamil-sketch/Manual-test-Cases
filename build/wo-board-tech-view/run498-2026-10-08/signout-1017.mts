/**
 * signout-1017.mts — 17 Oct 2026: the END-OF-RUN SIGN-OUT BATCH for run 498 (signout-1017.txt, run-signout-1017.sh, after-signout-1017.sh).
 *
 * WHY (L0425): earlier scripts replaced each case's "sign out, sign in again" step with a fresh browser carrying the saved sign-in,
 * because a real log-out ends the ONE shared staging sign-in mid-queue (L0394). A substituted step is not observed (Rule 12): the
 * cases were corrected to Blocked. This batch runs AFTER every fix-up round and does the REAL steps, one case per queue line (ONLY=…):
 *   C96989 step 3 · C97005 step 8 · C96912 steps 3-4 (+ step 5 second browser, step 7 sign in as User-B) · C96948 steps 6-7 ·
 *   C96928 steps 10-11 · C96975 steps 16-18. (signout-fix.mts ONLY=C368240 is the batch's LAST line, separately.)
 * HOW, per case, as Admin ShopView (the "you" of every case, never the runner): the case's earlier state is MADE through the screen (or
 * its saved preference, read back on screen), "before" is read, then the REAL log-out (initials > Logout, logged "SIGN-OUT done"), then the
 * real sign-in on the page the app lands on — the sign-in page's Admin quick-login, the way every run signs in (L0398) — logged
 * "SIGN-IN done", then the case's after-login expectation is read (screen + saved preference) with pictures.
 * IF SIGNING BACK IN FAILS (the log-out may end the Google sign-in itself, L0410): the script logs "SIGN-IN FAILED … sso_required" with the
 * answer of the permissions call, writes its readings and exits 9. The runner then sees the Google/sso_required line, re-checks with a
 * fresh ensure-heavy and STOPS the batch (confirm_expired) — no loop, no retries that would hide why.
 * Second browsers (C96912 step 5, C96948 step 7) are real sign-ins in a NEW browser (open(): the sign-in page's quick-login); that ends the
 * first browser's session (L0394), so the first browser signs in again on its sign-in page afterwards (logged).
 * User-B (C96912 step 7): the only other account that can sign in unattended on the shared Google sign-in is the sign-in page's "Tech"
 * quick-login (Tech ShopView). It is used, and its saved display is read FIRST: if it is not empty/List it is not a "never changed the
 * display" user and the reading says so (no substitution). If the Tech quick-login is not offered the step is logged as not runnable, with why.
 * Output: EV/signout-1017.json (merged per case), pictures EV/<case>-signout-*.png. New file only.
 */
import fs from 'node:fs'; import path from 'node:path';
import type { Page, Browser } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { api, customer, workOrder, workOrders, type Api } from './data.mts';
import { EV, t, display, tab, search, groups, toggleGroup, drag, shiftPrompt } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { screenDisplay, prefRead } from './fixup-1017.mts';
import { openRetry } from './fx6-1017.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const OUT = path.join(EV, 'signout-1017.json');
const R: Record<string, any> = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const save = () => fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
let { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
let a: Api = api(p);
const exitSwitch = (await a.post('/api/exit-switch-user', {})).status;
const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const PREF = '/api/users/me/preferences/work-orders-list';
const D = '@staging.shopview.local';
const perm = (pg: Page) => pg.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include', headers: { Accept: 'application/json' } }).then(async r => ({ status: r.status, body: (await r.text()).slice(0, 120) })).catch(e => ({ status: 0, body: String(e).slice(0, 80) }))`) as Promise<{ status: number; body: string }>;
const who = (pg: Page) => pg.evaluate(`(() => { try { const u = JSON.parse(localStorage.getItem('user') || 'null'); const d = u && (u.data || u); const x = d && (d.user || d); return x ? ((x.first_name || x.firstName || '') + ' ' + (x.last_name || x.lastName || '')).trim() || x.email || null : null; } catch (e) { return null; } })()`).catch(() => null) as Promise<string | null>;
const topBar = (pg: Page) => pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
const goWO = async (pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, pg); await tab(pg, 'All').catch(() => {}); };

/** the REAL log-out: initials (top right) > Logout */
async function signOut(pg: Page, id: string, tag: string) {
  const o: any = { before: { url: pg.url().replace(APP, '').slice(0, 80), user: await who(pg) } };
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000, pg);
  await pg.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await W(900, pg);
  const so = pg.locator('.q-menu').getByText('Logout', { exact: true }).last(); o.logoutItem = await so.count();
  if (o.logoutItem) { await so.click(); await W(6000, pg); }
  o.after = { url: pg.url().replace(APP, '').slice(0, 80), signInPage: /login|sign-?in/i.test(pg.url()), permissions: await perm(pg) }; await shot(pg, `${id}-signout-${tag}-signed-out`);
  console.log(t(), o.logoutItem ? 'SIGN-OUT done' : 'SIGN-OUT NOT DONE (no Logout item)', id, tag, JSON.stringify(o)); return o;
}
/** the REAL sign-in on the page the app shows: the sign-in page's quick-login button (Admin, or Tech for User-B) */
async function signIn(pg: Page, id: string, tag: string, label: 'Admin' | 'Tech' = 'Admin') {
  const o: any = { label };
  if (!/\/login/.test(pg.url())) { await pg.goto(APP + '/login', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000, pg); }
  const btn = pg.locator(`button:has-text("${label}")`).first();
  for (let i = 0; i < 20 && !(await btn.count()); i++) await W(1500, pg);
  o.button = await btn.count();
  o.buttonsOffered = (await pg.locator('button').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 12);
  if (o.button) { await btn.click().catch(() => {}); await W(9000, pg); }
  o.url = pg.url().slice(0, 140); o.permissions = await perm(pg); o.user = await who(pg);
  o.ok = o.permissions.status === 200 && !/\/login|accounts\.google/.test(pg.url());
  await shot(pg, `${id}-signout-${tag}-signed-in`);
  console.log(t(), o.ok ? 'SIGN-IN done' : 'SIGN-IN FAILED', id, tag, JSON.stringify(o));
  return o;
}
/** stop the batch when a sign-in does not come back: readings written, a line the runner recognises (sso_required), exit 9 */
async function stopIfFailed(id: string, si: any) {
  if (si.ok) return;
  R[id] = { ...(R[id] ?? {}), stopped: `signing back in failed: url ${si.url}, permissions ${si.permissions?.status} ${si.permissions?.body}` }; save();
  console.log(t(), `SIGN-IN FAILED — batch stops here (${id}). sso_required? permissions answered ${si.permissions?.status} ${si.permissions?.body}. If the log-out ended the Google sign-in, the QA lead must send new staging cookies; every later line of signout-1017.txt is not run.`);
  await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]); process.exit(9);
}
/** a SECOND browser that really signs in (the sign-in page's quick-login, as every run does); returns its page */
async function secondBrowser(id: string) {
  const s = await openRetry(open, '/workorders?tab=all', 1); console.log(t(), 'SIGN-IN done', id, 'second browser', JSON.stringify({ user: await who(s.page), permissions: await perm(s.page) })); return s;
}
/** after a second browser signed in, the first browser's session is over (L0394): sign it in again on its sign-in page */
async function firstAgain(id: string) { const pm = await perm(p); const o: any = { permissionsBefore: pm.status };
  if (pm.status !== 200) { await p.goto(APP + '/login', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000); const si = await signIn(p, id, 'first-browser-again'); o.signIn = si; await stopIfFailed(id, si); }
  a = api(p); return o; }
const run = async (id: string, f: (o: any) => Promise<void>) => { if (!want(id)) return; const o: any = { started: t(), exitSwitch }; R[id] = o; console.log(t(), 'CASE', id);
  try { await f(o); } catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot(p, `${id}-signout-error`); }
  o.ended = t(); console.log(t(), id, JSON.stringify(o).slice(0, 4000)); save(); };
const prefNow = async () => (await a.get(PREF)).body?.data?.value ?? {};
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x: any) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), JW = await sid('jenny.wilson');
/** Tech View / List column switches, read by label (role=switch or q-toggle, aria-checked) */
const menuBtn: Record<string, string> = { List: 'button_column_selection', 'Tech View': 'button_tech_view_column_selection' };
async function columns(d: 'List' | 'Tech View', set?: Record<string, boolean>) {
  await p.locator(`[data-test-id="${menuBtn[d]}"]`).first().click().catch(() => {}); await W(1200);
  const read = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id^="toggle_"], .q-toggle')].map(e => { const sw = e.matches('[role=switch]') ? e : e.querySelector('[role=switch],[aria-checked]'); return { label: ((e.closest('.q-item') || e).innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30), on: sw ? sw.getAttribute('aria-checked') === 'true' : !!e.querySelector('.q-toggle__inner--truthy'), tid: e.getAttribute('data-test-id') }; }).filter((v, i, arr) => v.label && arr.findIndex(u => u.label === v.label) === i); })()`).catch(() => null) as Promise<any[] | null>;
  let r = await read();
  if (set) for (const [lab, on] of Object.entries(set)) { const it = (r ?? []).find((x) => x.label.toLowerCase() === lab.toLowerCase()); if (it && it.on !== on) { const loc = it.tid ? p.locator(`.q-menu [data-test-id="${it.tid}"]`).first() : p.locator('.q-menu .q-toggle').filter({ hasText: lab }).first(); await loc.click().catch(() => {}); await W(900); r = await read(); } }
  await p.keyboard.press('Escape').catch(() => {}); await W(700);
  return (r ?? []).filter((x) => x.on).map((x) => x.label);
}
const heads = () => p.evaluate(`[...new Set([...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/arrow_drop_(up|down)/g, '').trim()).filter(Boolean))]`) as Promise<string[]>;
const densityRead = async () => { const b = p.locator('[data-test-id="button_density"]').first(); if (!(await b.count())) return { present: false };
  await b.click().catch(() => {}); await W(900);
  const opts = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ id: e.getAttribute('data-test-id').replace('option_density_', ''), selected: e.getAttribute('aria-selected') === 'true' || e.getAttribute('aria-checked') === 'true' || e.classList.contains('q-item--active') || /\\bcheck\\b/.test(e.innerText) }))`).catch(() => []) as any[];
  await p.keyboard.press('Escape').catch(() => {}); await W(600); return { present: true, options: opts, selected: opts.filter((x) => x.selected).map((x) => x.id), saved: (await prefNow()).density ?? null }; };

// ───────── C96989 step 3: density Comfortable (set in Tech View) is kept after logging out and back in
await run('C96989', async (o) => {
  await goWO(); await display(p, 'Tech View'); await W(1500);
  o.startFound = await densityRead(); console.log(t(), 'START STATE found C96989', JSON.stringify(o.startFound));
  await p.locator('[data-test-id="button_density"]').first().click().catch(() => {}); await W(900); await p.locator('[data-test-id="option_density_comfortable"]').first().click().catch(() => {}); await W(1500);
  o.step1 = await densityRead(); await display(p, 'Board View'); await W(1500); o.step2board = await densityRead(); await shot(p, 'C96989-signout-before');
  console.log(t(), 'START STATE set C96989', JSON.stringify({ techView: o.step1, boardView: o.step2board }));
  o.signOut = await signOut(p, 'C96989', 'step3'); const si = await signIn(p, 'C96989', 'step3'); o.signIn = si; await stopIfFailed('C96989', si); a = api(p);
  await goWO(); await display(p, 'Tech View'); await W(2000); o.step3afterSignIn = { display: await screenDisplay(p), density: await densityRead(), user: await who(p) }; await shot(p, 'C96989-signout-after-tech-view');
  o.keptComfortable = (o.step3afterSignIn.density.selected ?? []).includes('comfortable') || o.step3afterSignIn.density.saved === 'comfortable';
});

// ───────── C97005 step 8: the work order order (Charlie Co, Alpha Co, Bravo Co in Ana's group) after signing out and back in
await run('C97005', async (o) => {
  const TECH = (await roleIds(a))['Technician'];
  const ANA = (await person(a, 'ZZAUTOTEST Ana', 'Alpha', { role: TECH, email: `zz.wob.ana.alpha${D}`, clockable: true })).row;
  const RUNNO = String(Date.now() % 100000); const q = `ZZAUTOTEST F3 Shared Order ${RUNNO}`; const w: Record<string, string> = {};
  for (const co of ['Alpha Co', 'Bravo Co', 'Charlie Co']) { const c = await customer(a, `${q} ${co}`, 'ZZF3SO'); w[co] = await workOrder(a, c, 'approved', ANA.staff_id); }
  const pv = await prefNow(); o.pin = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id] } })).status;   // Ana's group right after Unassigned
  const order = async () => { const g = (await groups(p)).find((x) => x.id === ANA.staff_id); const nums = Object.fromEntries(await Promise.all(Object.entries(w).map(async ([co, id]) => [(await workOrders(a, `${q} ${co}`)).find((x: any) => x.id === id)?.number, co])));
    return g ? g.rows.map((n: string) => nums[n] ?? n) : null; };
  await goWO(); await display(p, 'Tech View'); await search(p, q); await W(2500); o.step3 = await order();
  console.log(t(), 'START STATE found C97005', JSON.stringify({ search: q, anaGroup: o.step3 }));
  await drag(p, `[data-test-id="tech_view_row_${w['Charlie Co']}"]`, `[data-test-id="tech_view_row_${w['Alpha Co']}"]`, 4).catch((e) => { o.dragError = String(e).slice(0, 120); }); await shiftPrompt(p, 'Keep shifts').catch(() => null); await W(2000);
  o.step4 = await order(); await shot(p, 'C97005-signout-step4');
  console.log(t(), 'START STATE set C97005', JSON.stringify({ anaGroup: o.step4 }));
  o.signOut = await signOut(p, 'C97005', 'step8'); const si = await signIn(p, 'C97005', 'step8'); o.signIn = si; await stopIfFailed('C97005', si); a = api(p);
  await goWO(); await display(p, 'Tech View'); await search(p, q); await W(2500); o.step8afterSignIn = await order(); await shot(p, 'C97005-signout-step8-after');
  o.sameOrderAfterSignIn = JSON.stringify(o.step8afterSignIn) === JSON.stringify(o.step4);
});

// ───────── C96912 steps 2-5 and 7: Board View follows the user to a new sign-in and a second browser; User-B still sees List
await run('C96912', async (o) => {
  await goWO(); o.startFound = { display: await screenDisplay(p), saved: (await prefRead(a)).display }; console.log(t(), 'START STATE found C96912', JSON.stringify(o.startFound));
  await display(p, 'Board View'); await W(2000); o.step2 = { display: await screenDisplay(p), saved: (await prefRead(a)).display }; console.log(t(), 'START STATE set C96912', JSON.stringify(o.step2)); await shot(p, 'C96912-signout-step2-board');
  o.signOut3 = await signOut(p, 'C96912', 'step3'); const si = await signIn(p, 'C96912', 'step3'); o.signIn3 = si; await stopIfFailed('C96912', si); a = api(p);
  await goWO(); await W(1500); o.step4 = { display: await screenDisplay(p), saved: (await prefRead(a)).display, user: await who(p) }; await shot(p, 'C96912-signout-step4-after-sign-in');
  // step 5: a second browser, same user, real sign-in
  { const s2 = await secondBrowser('C96912'); try { await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, s2.page); o.step5 = { display: await screenDisplay(s2.page), saved: (await prefRead(api(s2.page))).display, user: await who(s2.page) }; await shot(s2.page, 'C96912-signout-step5-second-browser'); } finally { await Promise.race([s2.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]); } }
  o.firstAgain = await firstAgain('C96912');
  o.step6 = 'not part of this batch (Change Location is not a sign-out step; read by s1-batch4a)';
  // step 7: sign out and sign in as User-B — the sign-in page's Tech quick-login (the only other unattended account), read FIRST whether it ever changed the display
  o.signOut7 = await signOut(p, 'C96912', 'step7');
  const siB = await signIn(p, 'C96912', 'step7-user-b', 'Tech'); o.signInUserB = siB;
  if (!siB.button) o.step7 = { notRunnable: `no "Tech" quick-login on the sign-in page (buttons offered: ${JSON.stringify(siB.buttonsOffered)}); a second user cannot sign in unattended on the shared Google sign-in — step 7 NOT run, nothing substituted` };
  else if (siB.ok) { const aB = api(p); const savedB = (await prefRead(aB)).display; await goWO(); await W(1500);
    o.step7 = { user: await who(p), savedDisplayBefore: savedB, neverChanged: !savedB || savedB === 'list', display: await screenDisplay(p), saved: (await prefRead(aB)).display, workOrdersShown: !/\/login|403|forbidden/i.test(p.url()) };
    if (!o.step7.neverChanged) o.step7.note = `Tech ShopView has a saved display "${savedB}": not a never-changed user, so this reading cannot judge "the second user still sees List"`;
    await shot(p, 'C96912-signout-step7-user-b');
    o.signOutB = await signOut(p, 'C96912', 'user-b-out'); }
  else o.step7 = { notRunnable: `the Tech quick-login did not sign in (permissions ${siB.permissions?.status})` };
  // back to Admin for the rest of the batch
  const siA = await signIn(p, 'C96912', 'back-to-admin'); o.signInBack = siA; await stopIfFailed('C96912', siA); a = api(p);
});

// ───────── C96948 steps 6-7: Ralph Edwards and Jenny Wilson pinned; still pinned after signing in again and in a second browser
await run('C96948', async (o) => {
  const pv = await prefNow(); o.startFound = { pinned: (pv.pinnedTechnicianIds ?? []).map((x: string) => String(x).slice(0, 8)) }; console.log(t(), 'START STATE found C96948', JSON.stringify(o.startFound));
  o.pin = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: [RE.staff_id, JW.staff_id] } })).status;
  const pinsOnScreen = async (pg: Page) => pg.evaluate(`(() => { const r = {}; for (const [k, id] of Object.entries(${JSON.stringify({ Ralph: RE.staff_id, Jenny: JW.staff_id })})) { const b = document.querySelector('[data-test-id="button_board_pin_' + id + '"]'); r[k] = b ? b.getAttribute('aria-pressed') : 'column not drawn'; } r.firstColumns = [...document.querySelectorAll('[data-test-id^="board_column_header_"]')].slice(0, 4).map(h => (h.innerText.split('\\n')[0] || '').trim()); return r; })()`).catch(() => null);
  await goWO(); await search(p, 'ZZAUTOTEST F2 Pins Follow User'); await display(p, 'Board View'); await W(2500); o.step3 = await pinsOnScreen(p); await shot(p, 'C96948-signout-step3-pinned');
  console.log(t(), 'START STATE set C96948', JSON.stringify(o.step3));
  o.signOut6 = await signOut(p, 'C96948', 'step6'); const si = await signIn(p, 'C96948', 'step6'); o.signIn6 = si; await stopIfFailed('C96948', si); a = api(p);
  await goWO(); await display(p, 'Board View'); await W(2500); o.step6 = { onScreen: await pinsOnScreen(p), saved: ((await prefNow()).pinnedTechnicianIds ?? []).map((x: string) => x === RE.staff_id ? 'Ralph' : x === JW.staff_id ? 'Jenny' : String(x).slice(0, 8)) }; await shot(p, 'C96948-signout-step6-after');
  { const s2 = await secondBrowser('C96948'); try { await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, s2.page); await display(s2.page, 'Board View'); await W(2500, s2.page);
      o.step7 = { onScreen: await pinsOnScreen(s2.page), saved: (((await api(s2.page).get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? []).map((x: string) => x === RE.staff_id ? 'Ralph' : x === JW.staff_id ? 'Jenny' : String(x).slice(0, 8)) }; await shot(s2.page, 'C96948-signout-step7-second-browser'); }
    finally { await Promise.race([s2.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]); } }
  o.firstAgain = await firstAgain('C96948');
  o.step8 = 'not part of this batch (sign in as User-B: see C96912 step 7 for whether a second user can sign in unattended)';
});

// ───────── C96928 steps 10-11: Ralph Edwards' collapsed group stays collapsed after signing out and in; the expand arrow opens it
await run('C96928', async (o) => {
  const n = 'ZZAUTOTEST F2 Collapse Memory'; let have = await workOrders(a, n);
  if (have.length < 3) { const c = await customer(a, n, 'ZZF2CM'); for (const l of [ES, RE, JW].slice(have.length)) await workOrder(a, c, 'approved', l.staff_id); have = await workOrders(a, n); }
  const want3 = [ES.staff_id, RE.staff_id, JW.staff_id]; o.leadsFixed = [];
  for (const [i, w] of have.slice(0, 3).entries()) if ((w.techAssignedId ?? null) !== want3[i]) o.leadsFixed.push(`${w.number} ${(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: want3[i] })).status}`);
  const pv = await prefNow(); o.pin = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: want3, collapsedGroups: [] } })).status;
  const state = async () => { const g = await groups(p); const pick = (id: string) => { const x = g.find((y) => y.id === id); return x ? { collapsed: x.collapsed, count: x.count, rows: x.rows.length } : 'not drawn'; }; return { Esther: pick(ES.staff_id), Ralph: pick(RE.staff_id), Jenny: pick(JW.staff_id), saved: ((await prefNow()).collapsedGroups ?? []).map((x: string) => x === RE.staff_id ? 'Ralph' : String(x).slice(0, 8)) }; };
  await goWO(); await search(p, n); await display(p, 'Tech View'); await W(2500); o.startFound = await state(); console.log(t(), 'START STATE found C96928', JSON.stringify(o.startFound));
  if ((o.startFound.Ralph as any)?.collapsed === false) await toggleGroup(p, RE.staff_id); await W(1500);
  o.step5 = await state(); console.log(t(), 'START STATE set C96928', JSON.stringify(o.step5)); await shot(p, 'C96928-signout-step5-collapsed');
  o.signOut = await signOut(p, 'C96928', 'step10'); const si = await signIn(p, 'C96928', 'step10'); o.signIn = si; await stopIfFailed('C96928', si); a = api(p);
  await goWO(); await search(p, n); await display(p, 'Tech View'); await W(2500); o.step10 = await state(); await shot(p, 'C96928-signout-step10-after');
  await p.locator(`[data-test-id="button_tech_view_group_toggle_${RE.staff_id}"]`).click().catch(() => {}); await W(1500); o.step11 = await state(); await shot(p, 'C96928-signout-step11-expanded');
});

// ───────── C96975 steps 16-18: Tech View keeps its own columns (no Service Advisor, no Assigned Techs, Progress on) and List its own
// (Service Advisor on, Progress off) after a real log-out and log-in
await run('C96975', async (o) => {
  await goWO(); await display(p, 'Tech View'); await W(1500); o.startFoundTech = await columns('Tech View'); await display(p, 'List'); await W(1500); o.startFoundList = await columns('List');
  console.log(t(), 'START STATE found C96975', JSON.stringify({ tech: o.startFoundTech, list: o.startFoundList }));
  // the state steps 1-13 leave (the s5-batchA3 run puts its saved choices back at its end, so it is made again here, through the menus)
  o.setList = await columns('List', { 'Service Advisor': true, 'Progress': false });
  await display(p, 'Tech View'); await W(1500); o.setTech = await columns('Tech View', { 'Service Advisor': false, 'Assigned Techs': false, 'Progress': true });
  o.before = { techHeads: await heads() }; await display(p, 'List'); await W(1500); o.before.listHeads = await heads(); await shot(p, 'C96975-signout-before');
  console.log(t(), 'START STATE set C96975', JSON.stringify({ tech: o.setTech, list: o.setList }));
  o.signOut = await signOut(p, 'C96975', 'step16'); const si = await signIn(p, 'C96975', 'step17'); o.signIn = si; await stopIfFailed('C96975', si); a = api(p);
  await goWO(); await display(p, 'Tech View'); await W(2000); o.step18tech = { on: await columns('Tech View'), heads: await heads() }; await shot(p, 'C96975-signout-step18-tech');
  await display(p, 'List'); await W(2000); o.step18list = { on: await columns('List'), heads: await heads() }; await shot(p, 'C96975-signout-step18-list');
  const has = (xs: string[], rx: RegExp) => (xs ?? []).some((x) => rx.test(x));
  o.check = { techNoServiceAdvisor: !has(o.step18tech.heads, /Service Advisor/i), techNoAssignedTechs: !has(o.step18tech.heads, /Assigned Techs/i), techProgress: has(o.step18tech.heads, /^Progress$/i), listServiceAdvisor: has(o.step18list.heads, /Service Advisor/i), listNoProgress: !has(o.step18list.heads, /^Progress$/i) };
});

save();
await done(browser);
