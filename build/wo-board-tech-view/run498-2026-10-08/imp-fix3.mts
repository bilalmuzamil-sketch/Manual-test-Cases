/** FIX 2 (2026-10-09): the list is narrowed with its own Search to the case's number (a technician leads more than a page
 * of work orders); C368239 is run twice so a red message on exit is seen on two attempts.
 *
 * FIX (2026-10-09): the list shows S10043-18522 while the API number is S-18522 (match the digits); the list settles
 * after "Assigned to me"; the top bar is recorded at every list read; a Technician gets "Access restricted" on Reports,
 * so the exit-while-loading check falls back to Schedule and records the page used.
 * IMPERSONATION (2026-10-09): C368238 (start while a page loads) and C368239 (exit while a page loads), run as
 * Admin ShopView itself (an account already in account-access mode cannot start another: the impersonate page returns
 * early when isImpersonating). Route found in the app code (evidence/code-search-2026-10-09.md): the page
 * /impersonate-user/<user_id> starts account access for that staff member's USER id; the orange bar's Exit is
 * [data-test-id="button_exit_impersonation"]. Toasts are collected for 10 s after each switch; a red one is a failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab, search } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const R: any = {};
const step = (m: string) => console.log(t(), 'step', m);
const cap = <T,>(ms: number, pr: Promise<T>, what: string) => Promise.race([pr, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timed out: ${what}`)), ms))]);
const ONLYS = (process.env.ONLY || '').split(',').filter(Boolean);
async function run(id: string, f: () => Promise<void>) { if (ONLYS.length && !ONLYS.includes(id)) return; step(id); try { await cap(600000, f(), id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 300) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000)); fs.writeFileSync(path.join(EV, 'imp-fix3.json'), JSON.stringify(R, null, 1)); }
const state = async () => { const r: any = await cap(20000, a.get('/api/switch-user'), 'switch-user state').catch((e) => ({ status: 0, body: String(e) })); return `${r.status} ${JSON.stringify(r.body?.data ?? r.body).slice(0, 160)}`; };
const toastsLog: string[] = []; let watching = false;
const collect = async (ms: number) => { const end = Date.now() + ms; const seen = new Set<string>(); while (Date.now() < end) { const ts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => (e.className.match(/bg-(negative|positive|warning|info|[a-z-]+)/) || ['', '?'])[1] + ': ' + e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []) as string[]; ts.forEach((x) => seen.add(x)); await p.waitForTimeout(250); } return [...seen]; };
const topBar = () => p.evaluate(`(document.querySelector('header')?.innerText || '').replace(/\\s+/g, ' ').slice(0, 240)`).catch(() => null);
const bar = () => p.evaluate(`(() => { const b = document.querySelector('[data-test-id="button_exit_impersonation"]'); if (!b) return null; let e = b; for (let i = 0; i < 4 && e.parentElement; i++) e = e.parentElement; return e.innerText.replace(/\\s+/g, ' ').slice(0, 200); })()`).catch(() => null);
const assigned = () => p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
async function myList(find: string, shotName?: string) { step(`myList ${find}`);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'List').catch(() => {});
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(2000); }
  await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  // FIX 2: a technician leads more than one page of work orders, so narrow the list with its own Search before reading it
  const unfiltered = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).length`) as number;
  await search(p, find.split('-').pop()!).catch(() => {}); await p.waitForTimeout(3000);
  const rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 90))`) as string[];
  const out = { pressed: await assigned().getAttribute('aria-pressed'), unfiltered, rows: rows.length, listsIt: rows.some((r) => r.includes('-' + find.split('-').pop() + ' ')), who: await bar(), top: await topBar(), first: rows.slice(0, 3), empty: await p.getByText(/No work orders/i).first().innerText().catch(() => null) };
  // 15 Oct 2026 (wave 18): the step pictures were taken AFTER the search was cleared, so they showed the whole Assigned to me list,
  // not the searched work order (or the empty result). The picture is now taken with the search still in the box.
  if (shotName) await shot(p, shotName).catch(() => {});
  await search(p, '').catch(() => {}); return out;
}
/** 15 Oct 2026 (staging third pass): (1) the switch was made before the report had started loading (no report request yet) —
 *  now the switch is made the moment the report's first data request has been SENT and before its answer arrives; whether the
 *  answer had already come is recorded; (2) the Reports link was looked for only as button_desktop_nav_link, which the
 *  technician's top menu does not have — now the top menu is searched by its own word "Reports" (any link/button/menu item in the
 *  header, then inside the "ShopHub" menu); only if no such word exists is the report opened by its address, and that is
 *  recorded (with any "Access restricted" text). */
async function openReports() {
  const vis = async (l: any) => (await l.count()) && await l.first().isVisible().catch(() => false);
  const cands = [p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: /^\s*Reports\s*$/ }), p.locator('header a, header button, header .q-item, nav a, nav .q-item').filter({ hasText: /^\s*Reports\s*$/ })];
  for (const [i, l] of cands.entries()) if (await vis(l)) { await l.first().click(); await p.waitForTimeout(2500); return i === 0 ? 'top menu link' : 'top menu word "Reports"'; }
  const hub = p.locator('header').getByText(/^\s*ShopHub\s*$/).first(); if (await hub.count()) { await hub.click().catch(() => {}); await p.waitForTimeout(1000); const it = p.locator('.q-menu .q-item, .q-menu a').filter({ hasText: /^\s*Reports\s*$/ }).first(); if (await it.count()) { await it.click(); await p.waitForTimeout(2500); return 'ShopHub menu > Reports'; } await p.keyboard.press('Escape').catch(() => {}); }
  return null; }
async function wipWhile(act: () => Promise<void>) { step('wipWhile');
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  const menu = await p.evaluate(`[...document.querySelectorAll('header a, header button, [data-test-id="button_desktop_nav_link"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(x => x && x.length < 30)`).catch(() => []);
  const route = await openReports();
  const sent: string[] = []; const answered: string[] = [];
  const isReport = (u: string) => /\/api\/[^?]*(report|work-in-progress|wip)/i.test(u);
  const onReq = (q: any) => { if (isReport(q.url())) sent.push(q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 90)); }; const onRes = (r: any) => { if (isReport(r.url())) answered.push(`${r.status()} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 60)}`); };
  p.on('request', onReq); p.on('response', onRes);
  let used = route ? `Reports (${route}) > Work In Progress` : 'Work In Progress by its address (no "Reports" in this user\'s top menu)';
  const firstReq = p.waitForRequest((q) => isReport(q.url()), { timeout: 15000 }).catch(() => null);
  if (route) { const wip = p.getByText('Work In Progress', { exact: true }).last(); if (await wip.isVisible().catch(() => false)) await wip.click(); else await p.goto(APP + '/reports/work-in-progress', { waitUntil: 'commit' }); }
  else await p.goto(APP + '/reports/work-in-progress', { waitUntil: 'commit' });
  const got = await firstReq; const atSwitch = { requestSent: !!got, answeredBeforeSwitch: answered.length, restricted: await p.getByText(/Access restricted/i).count().catch(() => 0) };
  await act(); await p.waitForTimeout(500); p.off('request', onReq); p.off('response', onRes);
  return { menu, pageUsed: used, atSwitch, reportRequests: sent.slice(0, 4), answers: answered.slice(0, 4) };
}

step('staff'); const ES = (await cap(30000, staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'), 'staff'))[0]; step('state');
R.setup = { stateStart: await state(), esther: ES ? `${ES.first_name} ${ES.last_name}` : null };
if (/"is_impersonating":true|impersonat/i.test(R.setup.stateStart) && !/false/.test(R.setup.stateStart)) R.setup.exit = (await a.post('/api/exit-switch-user', {})).status;

await run('C368238', async () => {
  const c = await customer(a, `ZZAUTOTEST Impersonate Start ${Date.now() % 100000}`, 'ZZIMP-1'); const w = await workOrder(a, c, 'approved', ES.staff_id);
  const num = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; const o: any = { wo: num };
  // 15 Oct 2026: whoever creates a work order becomes its Service Advisor, and Assigned to me lists those too — so before the switch
  // the admin already "had" it. The Service Advisor is set to Esther Howard (the lead), so you are neither its lead nor its advisor.
  o.advisor = (await a.post('/api/work-orders/change-service-advisor', { work_order_id: w, service_advisor_id: ES.staff_id })).status;
  o.step1 = await myList(num);
  o.switch = await cap(90000, wipWhile(async () => { await p.goto(`${APP}/impersonate-user/${ES.id}`, { waitUntil: 'commit' }); }), 'start while loading'); step('collect');
  /* FIX 3: every step after the switch has its own limit; a stuck step is recorded, not waited on for 10 minutes */
  o.toasts = await cap(30000, collect(10_000), 'collect').catch((e: any) => [`stuck: ${String(e).slice(0, 60)}`]); step('read'); await p.waitForTimeout(3000); o.url = p.url().replace(APP, ''); o.bar = await cap(10000, bar(), 'bar').catch(() => 'stuck'); o.top = await cap(10000, topBar(), 'top').catch(() => 'stuck'); o.state = await state(); step('shot'); await cap(20000, shot(p, 'C368238-step4'), 'shot').catch(() => {});
  o.step5 = await myList(num, 'C368238-step5-searched'); await shot(p, 'C368238-step5'); R.C368238 = o;
});

await run('C368239', async () => {
  const c = await customer(a, `ZZAUTOTEST Impersonate Exit ${Date.now() % 100000}`, 'ZZIMP-2'); const w = await workOrder(a, c, 'approved', ES.staff_id);
  const num = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; const o: any = { wo: num };
  o.advisor = (await a.post('/api/work-orders/change-service-advisor', { work_order_id: w, service_advisor_id: ES.staff_id })).status; // 15 Oct 2026: as C368238
  if (!(await p.locator('[data-test-id="button_exit_impersonation"]').count())) { await p.goto(`${APP}/impersonate-user/${ES.id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
  o.step1 = await myList(num); o.step1bar = await bar();
  o.switch = await cap(90000, wipWhile(async () => { await p.locator('[data-test-id="button_exit_impersonation"]').click({ timeout: 20000 }); }), 'exit while loading'); step('collect');
  o.toasts = await cap(30000, collect(10_000), 'collect').catch((e: any) => [`stuck: ${String(e).slice(0, 60)}`]); step('read'); await p.waitForTimeout(3000); o.url = p.url().replace(APP, ''); o.bar = await cap(10000, bar(), 'bar').catch(() => 'stuck'); o.top = await cap(10000, topBar(), 'top').catch(() => 'stuck'); o.state = await state(); step('shot'); await cap(20000, shot(p, 'C368239-step3'), 'shot').catch(() => {});
  o.step4 = await myList(num, 'C368239-step4-searched'); await shot(p, 'C368239-step4'); R.C368239 = o;
});
if (await p.locator('[data-test-id="button_exit_impersonation"]').count()) await a.post('/api/exit-switch-user', {});
fs.writeFileSync(path.join(EV, 'imp-fix3.json'), JSON.stringify(R, null, 1)); await done(browser);
