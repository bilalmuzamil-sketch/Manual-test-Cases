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
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'imp-fix2.json'), JSON.stringify(R, null, 1)); }
const state = async () => { const r: any = await cap(20000, a.get('/api/switch-user'), 'switch-user state').catch((e) => ({ status: 0, body: String(e) })); return `${r.status} ${JSON.stringify(r.body?.data ?? r.body).slice(0, 160)}`; };
const toastsLog: string[] = []; let watching = false;
const collect = async (ms: number) => { const end = Date.now() + ms; const seen = new Set<string>(); while (Date.now() < end) { const ts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => (e.className.match(/bg-(negative|positive|warning|info|[a-z-]+)/) || ['', '?'])[1] + ': ' + e.innerText.replace(/\\s+/g, ' ').trim())`).catch(() => []) as string[]; ts.forEach((x) => seen.add(x)); await p.waitForTimeout(250); } return [...seen]; };
const topBar = () => p.evaluate(`(document.querySelector('header')?.innerText || '').replace(/\\s+/g, ' ').slice(0, 240)`).catch(() => null);
const bar = () => p.evaluate(`(() => { const b = document.querySelector('[data-test-id="button_exit_impersonation"]'); if (!b) return null; let e = b; for (let i = 0; i < 4 && e.parentElement; i++) e = e.parentElement; return e.innerText.replace(/\\s+/g, ' ').slice(0, 200); })()`).catch(() => null);
const assigned = () => p.locator('button:has-text("Assigned to me"), .q-btn:has-text("Assigned to me")').first();
async function myList(find: string) { step(`myList ${find}`);
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'List').catch(() => {});
  if ((await assigned().getAttribute('aria-pressed')) !== 'true') { await assigned().click(); await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(2000); }
  await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  // FIX 2: a technician leads more than one page of work orders, so narrow the list with its own Search before reading it
  const unfiltered = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).length`) as number;
  await search(p, find.split('-').pop()!).catch(() => {}); await p.waitForTimeout(3000);
  const rows = await p.evaluate(`[...document.querySelectorAll('tbody tr')].filter(r => r.getBoundingClientRect().height > 0).map(r => r.innerText.replace(/\\s+/g, ' ').slice(0, 90))`) as string[];
  const out = { pressed: await assigned().getAttribute('aria-pressed'), unfiltered, rows: rows.length, listsIt: rows.some((r) => r.includes('-' + find.split('-').pop() + ' ')), who: await bar(), top: await topBar(), first: rows.slice(0, 3), empty: await p.getByText(/No work orders/i).first().innerText().catch(() => null) };
  await search(p, '').catch(() => {}); return out;
}
async function wipWhile(act: () => Promise<void>, gapMs = 400) { step('wipWhile');
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: 'Reports' }).first().click(); await p.waitForTimeout(2500);
  const pending: string[] = []; const onReq = (q: any) => { if (/\/api\/(reports|schedul)/i.test(q.url())) pending.push(q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 80)); }; p.on('request', onReq);
  let used = 'Reports > Work In Progress';
  const wip = p.getByText('Work In Progress', { exact: true }).last();
  if (await wip.isVisible().catch(() => false)) await wip.click();
  else { used = 'Schedule (Reports shows "Access restricted" for this user)'; await p.locator('[data-test-id="button_desktop_nav_link"]').filter({ hasText: 'Schedule' }).first().click(); }
  await p.waitForTimeout(gapMs);
  const loading = await p.evaluate(`!!document.querySelector('.q-loading, .q-spinner, .q-inner-loading, .q-linear-progress, .q-skeleton')`).catch(() => null);
  await act(); p.off('request', onReq); return { pageUsed: used, reportRequestsBeforeSwitch: pending.slice(0, 4), spinnerShownAtSwitch: loading };
}

step('staff'); const ES = (await cap(30000, staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'), 'staff'))[0]; step('state');
R.setup = { stateStart: await state(), esther: ES ? `${ES.first_name} ${ES.last_name}` : null };
if (/"is_impersonating":true|impersonat/i.test(R.setup.stateStart) && !/false/.test(R.setup.stateStart)) R.setup.exit = (await a.post('/api/exit-switch-user', {})).status;

await run('C368238', async () => {
  const c = await customer(a, `ZZAUTOTEST Impersonate Start ${Date.now() % 100000}`, 'ZZIMP-1'); const w = await workOrder(a, c, 'approved', ES.staff_id);
  const num = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; const o: any = { wo: num };
  o.step1 = await myList(num);
  o.switch = await cap(90000, wipWhile(async () => { await p.goto(`${APP}/impersonate-user/${ES.id}`, { waitUntil: 'commit' }); }), 'start while loading'); step('collect');
  o.toasts = await collect(10_000); await p.waitForTimeout(3000); o.url = p.url().replace(APP, ''); o.bar = await bar(); o.top = await topBar(); o.state = await state(); await shot(p, 'C368238-step4');
  o.step5 = await myList(num); await shot(p, 'C368238-step5'); R.C368238 = o;
});

await run('C368239', async () => {
  const c = await customer(a, `ZZAUTOTEST Impersonate Exit ${Date.now() % 100000}`, 'ZZIMP-2'); const w = await workOrder(a, c, 'approved', ES.staff_id);
  const num = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; const o: any = { wo: num };
  if (!(await p.locator('[data-test-id="button_exit_impersonation"]').count())) { await p.goto(`${APP}/impersonate-user/${ES.id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); }
  o.step1 = await myList(num); o.step1bar = await bar();
  o.switch = await cap(90000, wipWhile(async () => { await p.locator('[data-test-id="button_exit_impersonation"]').click({ timeout: 20000 }); }), 'exit while loading'); step('collect');
  o.toasts = await collect(10_000); await p.waitForTimeout(3000); o.url = p.url().replace(APP, ''); o.bar = await bar(); o.top = await topBar(); o.state = await state(); await shot(p, 'C368239-step3');
  o.step4 = await myList(num); await shot(p, 'C368239-step4'); R.C368239 = o;
});
if (await p.locator('[data-test-id="button_exit_impersonation"]').count()) await a.post('/api/exit-switch-user', {});
fs.writeFileSync(path.join(EV, 'imp-fix2.json'), JSON.stringify(R, null, 1)); await done(browser);
