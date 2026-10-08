/**
 * S1 batch 4a (2026-10-08): C96919 extra (saved display unreadable), C96910 a user who never chose sees List,
 * C96912 the choice follows the user (new sign-in, second browser, other location; not other users),
 * C96923 changing location. [User-B] is a fresh ZZAUTOTEST staff member, reached by switching user inside
 * the admin session (staging's quick sign-in has only the admin account); always switched back.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { signIn } from '../../global-search/e2e/fixtures/auth.js';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, active, tab, activeTab } from './wob.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
let { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
let a = api(p);
const R: Record<string, any> = {};
const HEAVY = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const techs = await candidates(a);
const tA = techs.find((x) => x.name === 'Ayesha Khan')!;
const adminStaff = techs.find((x) => x.name === 'Admin ShopView')!.id;
const wpsRaw = (await a.get('/api/staff/my-workplaces')).body?.data;
const wps: any[] = Array.isArray(wpsRaw) ? wpsRaw : wpsRaw?.collection ?? [];
const loc2 = wps.find((w) => w.id !== HEAVY && /lethbridge/i.test(w.name)) ?? wps.find((w) => w.id !== HEAVY);
R.workplaces = wps.map((w) => `${w.name} ${w.id} ${w.timezone ?? w.workplace_timezone ?? ''}`);
console.log(t(), 'workplaces', JSON.stringify(R.workplaces), '| Loc-2', loc2?.name);
const tz = (w: any) => w?.timezone ?? w?.workplace_timezone ?? 'America/Edmonton';
const toLoc = (w: any) => a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: tz(w) });
const pref = async (pg = p) => { const r = await api(pg).get('/api/users/me/preferences/work-orders-list'); const v = r.body?.data?.value ?? r.body?.value ?? null; return { status: r.status, keys: v ? Object.keys(v) : null, display: v ? (v.display ?? null) : null, filters: v ? JSON.stringify(v.filters) : null }; };
const go = async (pg = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2500));
}
R.prefShape = await pref();
console.log(t(), 'my preference', JSON.stringify(R.prefShape));

// ── C96919 extra: the saved setting cannot be read ──────────────────────
await run('C96919', async () => {
  await go(); await display(p, 'Board View'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96919 = { control: await active(p) };
  const fail = (r: any) => (r.request().method() === 'GET' ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"zz test: unreadable"}]}' }) : r.continue());
  await p.route('**/api/users/me/preferences/work-orders-list', fail);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R.C96919.whenUnreadable = await active(p); R.C96919.url = p.url().replace(APP, ''); await shot(p, 'C96919-unreadable');
  R.C96919.messages = await p.evaluate(`[...document.querySelectorAll('.q-notification,[role=alert]')].map(e => e.innerText.trim()).filter(Boolean)`);
  await p.unroute('**/api/users/me/preferences/work-orders-list', fail);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C96919.afterRestore = await active(p);
});

// ── User-B: a fresh staff member who has never opened Work Orders ────────
const EMAIL = 'zzautotest.wob.userb.1008@staging.shopview.local';
async function findStaff(email: string) { const r = await a.get('/api/staff?search=' + encodeURIComponent(email)); const rows = r.body?.data?.collection ?? r.body?.data ?? []; return (rows as any[]).find((x) => String(x.email).toLowerCase() === email); }
let userB = await findStaff(EMAIL);
if (!userB && (want('C96910') || want('C96912'))) {
  const roles = (await a.get('/api/iam/list-roles')).body?.data?.collection ?? [];
  const role = roles.find((r: any) => /^service advisor$/i.test(r.label ?? r.name)) ?? roles.find((r: any) => /^admin$/i.test(r.label ?? r.name));
  const deps = (await a.get('/api/departments')).body?.data; const dl = Array.isArray(deps) ? deps : deps?.collection ?? [];
  const c = await a.post('/api/iam/create', { email: EMAIL, first_name: 'ZZAUTOTEST', last_name: 'WOB User B', role_id: role?.id, departments: dl.slice(0, 1).map((d: any) => d.id), workplace_id: HEAVY });
  R.userBCreate = { role: role?.label ?? role?.name, status: c.status, body: JSON.stringify(c.body).slice(0, 200) };
  userB = await findStaff(EMAIL);
}
R.userB = userB ? { id: userB.id ?? userB.staff_id, role: userB.role_label, active: userB.is_active, workplace: userB.defaultWorkplaceName } : null;
console.log(t(), 'User-B', JSON.stringify(R.userB), JSON.stringify(R.userBCreate ?? ''));
async function asUserB<T>(f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: userB.id ?? userB.staff_id });
  if (s.status >= 300) throw new Error(`switch to User-B: ${s.status} ${JSON.stringify(s.body).slice(0, 200)}`);
  await p.waitForTimeout(800); await toLoc({ id: HEAVY, timezone: 'America/Edmonton' });
  try { return await f(); } finally {
    const e = await a.post('/api/exit-switch-user', {});
    if (e.status >= 300) await a.post('/api/switch-user', { user_id: adminStaff });
    await p.waitForTimeout(800); await toLoc({ id: HEAVY, timezone: 'America/Edmonton' });
  }
}

// ── C96910 never chosen → List ──────────────────────────────────────────
await run('C96910', async () => {
  const name = 'ZZAUTOTEST F1 Default List';
  if (!(await workOrders(a, name)).length) await workOrder(a, await customer(a, name, 'ZZDL-1'), 'approved', tA.id);
  R.C96910 = await asUserB(async () => {
    const o: any = { who: await api(p).get('/api/auth/me/fe-permissions').then((r) => (r.body?.data?.fe_permissions ?? []).length), prefBefore: await pref() };
    await go(); o.first = await active(p); o.firstUrl = p.url().replace(APP, ''); await shot(p, 'C96910-userB-first');
    o.layout = await p.evaluate(`({ techGroups: document.querySelectorAll('[data-test-id^="tech_view_group_"]').length, boardColumns: document.querySelectorAll('[data-test-id^="board_column_"]').length, tableRows: document.querySelectorAll('table tbody tr').length })`);
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.afterRefresh = await active(p); await shot(p, 'C96910-userB-refresh');
    o.prefAfter = await pref();
    return o;
  });
});

// ── C96912 the choice follows the user ──────────────────────────────────
await run('C96912', async () => {
  const name = 'ZZAUTOTEST F1 Display Follows User';
  if (!(await workOrders(a, name)).length) await workOrder(a, await customer(a, name, 'ZZDF-1'), 'approved', tA.id);
  const puts: string[] = [];
  const watch = (pg: Page, who: string) => pg.on('request', (q) => { if (q.method() === 'PUT' && /work-orders-list/.test(q.url())) { const m = (q.postData() || '').match(/"display":"([a-z_]+)"/); puts.push(`${t()} ${who} display=${m ? m[1] : '?'}`); } });
  watch(p, 'browser1');
  await go(); R.C96912 = { prefAtStart: await pref(), pageAtStart: await active(p) };
  await display(p, 'Board View'); R.C96912.chosen = await active(p); await p.waitForTimeout(2000); R.C96912.prefAfterChoice = await pref();
  // a brand-new sign-in in a separate browser = "sign out, sign in again" and "the second browser"
  const s2 = await signIn('/customers');
  watch(s2.page, 'browser2');
  R.C96912.prefSeenBy2 = await pref(s2.page);
  await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await s2.page.waitForTimeout(5000);
  R.C96912.newSignIn = await active(s2.page); await shot(s2.page, 'C96912-new-signin');
  // other location, in that browser
  const a2 = api(s2.page);
  R.C96912.locSteps = await changeLocationUI(loc2.name, s2.page);
  if (!/workorders/.test(s2.page.url())) { await s2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await s2.page.waitForTimeout(5000); }
  R.C96912.loc2 = { url: s2.page.url().replace(APP, ''), location: await s2.page.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`), display: await active(s2.page) }; await shot(s2.page, 'C96912-loc2');
  await changeLocationUI('Staging Heavy Duty', s2.page).catch(() => a2.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
  // the first browser: is it still signed in, and what does it show now?
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000);
  R.C96912.firstBrowser = { url: p.url().replace(APP, ''), display: await active(p) };
  if (/login/.test(p.url())) { await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 5000))]); browser = s2.browser; p = s2.page; a = api(p); R.C96912.note = 'the new sign-in ended the first browser session'; }
  R.C96912.puts = puts;
  R.C96912.userB = await asUserB(async () => { await go(); const d = await active(p); await shot(p, 'C96912-userB'); return { display: d, pref: await pref() }; });
  await go(); await display(p, 'List');
});

// ── C96923 changing location ────────────────────────────────────────────
// Read off the build (2026-10-08): your initials open a menu whose "Change Location:" row is a button carrying
// the CURRENT location's name; clicking it lists the locations; picking one switches.
async function changeLocationUI(target: string, pg: Page = p) {
  const steps: string[] = [];
  const where = () => pg.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) as Promise<string | null>;
  for (let attempt = 1; attempt <= 3; attempt++) {
    if ((await where())?.startsWith(target)) { steps.push(`at ${target} (attempt ${attempt})`); break; }
    await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(500);
    if (attempt === 3) { await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); steps.push('reloaded before attempt 3'); }
    await pg.locator('header').getByText(/^[A-Z]{2}$/).last().click().catch(() => {}); await pg.waitForTimeout(1500);
    const cur = pg.locator('.q-menu').getByText(/ - \d{3,5}$/).first();
    if (!(await cur.isVisible().catch(() => false))) { steps.push(`menu did not open (attempt ${attempt})`); continue; }
    steps.push(`attempt ${attempt}: top bar ${await where()} | menu button ${await cur.innerText()}`);
    await cur.click(); await pg.waitForTimeout(1500);
    // the list of locations is its own menu (it holds every location, e.g. "ZZAUTOTEST Empty Shop"); the orange
    // button in the first menu can show a DIFFERENT name from the top bar, so it is never matched as an option
    const opt = pg.locator('.q-menu').filter({ hasText: 'ZZAUTOTEST Empty Shop' }).locator('.q-item').filter({ hasText: target });
    steps.push(`attempt ${attempt}: options for ${target} = ${await opt.count()}`);
    await opt.first().click().catch((e) => steps.push('pick failed ' + String(e.message).slice(0, 60)));
    await pg.waitForTimeout(6000); await shot(pg, `loc-${target.slice(9, 18).trim()}-attempt${attempt}`);
  }
  steps.push('now: ' + (await where()));
  await pg.keyboard.press('Escape').catch(() => {});
  return steps;
}
const assigned = () => p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
const state = async () => ({ url: p.url().replace(APP, ''), tab: await activeTab(p).catch(() => null), display: await active(p).catch(() => null), assignedToMe: await assigned().getAttribute('aria-pressed').catch(() => 'not on page'), location: await p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) });
await run('C96923', async () => {
  const name = 'ZZAUTOTEST F1 Location Reset';
  if (!(await workOrders(a, name)).length) await workOrder(a, await customer(a, name, 'ZZLR-1'), 'approved', tA.id);
  // [Loc-2] needs a work order of its own
  await toLoc(loc2);
  if (!(await workOrders(a, name + ' 2')).length) { try { await workOrder(a, await customer(a, name + ' 2', 'ZZLR-2'), 'approved', null); } catch (e: any) { R.C96923loc2seed = String(e.message).slice(0, 200); } }
  await toLoc({ id: HEAVY, timezone: 'America/Edmonton' });
  R.C96923 = { loc2: loc2?.name };
  await go(); R.C96923.start = await changeLocationUI('Staging Heavy Duty - 9919'); await go();
  // today's List behaviour first (the note the case compares with)
  await go(); await display(p, 'List'); if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(2000); }
  R.C96923.listBefore = await state();
  R.C96923.listSteps = await changeLocationUI(loc2.name); R.C96923.listAfter = await state(); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C96923.listAfterRefresh = await state(); await shot(p, 'C96923-list-after-change');
  // start the Board View half from a location the menu will switch away from
  await go();
  // Board View → Loc-2
  await display(p, 'Board View'); if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(2000); }
  R.C96923.boardBefore = await state();
  R.C96923.boardSteps = await changeLocationUI('ZZAUTOTEST Empty Shop'); R.C96923.boardAfter = await state(); R.C96923.boardPref = await pref(); await shot(p, 'C96923-board-after-change');
  // Tech View → back to the first location
  if (!/workorders/.test(p.url())) await go();
  await display(p, 'Tech View'); if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForTimeout(2000); }
  R.C96923.techBefore = await state();
  // the menu ignores a pick of the location its orange button shows (Heavy Duty, even while the top bar reads
  // Lethbridge), so the second change goes to the third location instead of back
  R.C96923.techSteps = await changeLocationUI(loc2.name); R.C96923.techAfter = await state(); R.C96923.techPref = await pref(); await shot(p, 'C96923-tech-after-change');
  if (!/workorders/.test(p.url())) await go();
  if ((await assigned().getAttribute('aria-pressed')) === 'true') await assigned().click();
  await display(p, 'List');
});

await toLoc({ id: HEAVY, timezone: 'America/Edmonton' }).catch(() => {});
fs.writeFileSync(path.join(EV, 's1-batch4a.json'), JSON.stringify(R, null, 1));
await done(browser);
