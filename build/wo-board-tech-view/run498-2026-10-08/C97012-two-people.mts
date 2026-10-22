/** C97012 on STAGING, 16 Oct 2026 (batch 40) — TWO people in TWO separate sessions at the same time, as the case asks.
 *  One Google sign-in holds one app session (L0394), so the second person needs a second Google sign-in: the QA lead's "Analyst 1"
 *  sign-in (its own sv_sso_session, /tmp/qa-cookies/staging-analyst1.json). That account's own user cannot join company A ("There is
 *  already a user with that email."), so in a browser carrying ONLY Analyst 1's Google cookies the app's Dev Mode "Tech" quick-login
 *  is used: [User-A] = Tech ShopView (tech@shopview.com), given [Role-D] "ZZAUTOTEST F3 Stale Drop Dispatcher Role" (Work orders View +
 *  Create & Edit) by the Admin BEFORE he signs in (playbook: never swap the role of an open session). The Admin is the normal main
 *  sign-in (Admin ShopView). The quick-login replaces Analyst 1's app session; it is put back at the end through the app's own sign-in
 *  form (analyst.mts), and Tech's role goes back to Technician, [Role-D] back to View + Create & Edit — all read back.
 *  Steps exactly as the case: dispatcher on Board View (All, Search "ZZAUTOTEST F3 Stale Drop …"), Admin invoices Alpha Co, dispatcher
 *  drags Alpha Co to Ben without refreshing, alert read, refresh, lead read; Admin unticks Create & Edit on [Role-D]; dispatcher drags
 *  Bravo Co without refreshing; refresh, lead read. Every message watched from the press. json EV/C97012-2p.json, pictures C97012-2p-*. */
import { LOC1_NAME } from './profile.mts';
import fs from 'node:fs'; import path from 'node:path';
import { chromium, type Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, toColumn, shiftPrompt, switchLocUI } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts';
import { analystBrowser, ANALYST_FILE } from './analyst.mts';
const ORG = (await import('./profile.mts')).ORG; const D = '@staging.shopview.local'; const ROLE_D = 'ZZAUTOTEST F3 Stale Drop Dispatcher Role'; const TECH_ROLE_STOCK = 'af8d02b5-ecd1-4205-a82f-32a4d5bb1015';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exit: (await a.post('/api/exit-switch-user', {})).status };
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `C97012-2p-${n}.png`) }).catch(() => {});
const rolesList = async () => ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) as any[];
const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
const woCodes = (r: any) => ((r?.fe_permissions ?? []) as any[]).map((x) => String(x.code ?? x.name)).filter((c) => /^workOrders/.test(c));
const toastsOf = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-notification, [role=alert]')].map(e => e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|warning|error|info|priority_high)\\s*/, '').replace(/\\s*close$/i, '').trim()).filter(Boolean)`).catch(() => ['page did not answer']) as Promise<string[]>;
const watchStart = (pg: Page) => pg.evaluate(`(() => { window.__mw = []; window.__mw0 = Date.now(); if (window.__mo) window.__mo.disconnect(); const add = (k, x) => { const s = (x || '').replace(/\\s+/g, ' ').trim(); if (!s || s.length > 220 || window.__mw.length > 120 || window.__mw.some(y => y.text === s)) return; window.__mw.push({ ms: Date.now() - window.__mw0, kind: k, text: s }); };
  window.__mo = new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes || []) { if (n.nodeType !== 1 || n.childElementCount > 30) continue; if (n.matches && n.matches('.q-notification, [role=alert]')) add('message', n.textContent); else if (!(n.closest && n.closest('.q-notification'))) add('text', n.textContent); } });
  window.__mo.observe(document.body, { childList: true, subtree: true }); setTimeout(() => { try { window.__mo.disconnect(); } catch (e) {} }, 15000); })()`).catch(() => {});
const watchRead = (pg: Page) => pg.evaluate('(() => { try { window.__mo && window.__mo.disconnect(); } catch (e) {} return window.__mw || []; })()').catch(() => 'page gone');
async function dragOn(pg: Page, from: string, to: string, dy = 120) { await pg.locator(from).first().scrollIntoViewIfNeeded().catch(() => {}); const f = await pg.locator(from).first().boundingBox(), b = await pg.locator(to).first().boundingBox(); if (!f || !b) return `missing ${!f ? 'card' : 'column'}`;
  const gx = f.x + f.width * 0.45; await pg.mouse.move(gx, f.y + f.height / 2); await pg.mouse.down(); await pg.mouse.move(gx, f.y + f.height / 2 + 8, { steps: 4 }); await pg.mouse.move(b.x + b.width / 2, b.y + dy, { steps: 20 }); await pg.waitForTimeout(400); await pg.mouse.up(); await pg.waitForTimeout(3000); return 'ok'; }
let roleId = ''; let roleBody: any = null; let baseIds: string[] = []; let ceIds: string[] = []; let techRow: any = null; let techRoleBefore = '';
const putRole = async (ids: string[]) => say(await a.put(`/api/roles/${roleId}`, { name: roleBody.name, description: roleBody.description, view_mode: roleBody.view_mode, template_id: roleBody.template_id, fe_permissions: ids, cross_toggles: roleBody.cross_toggles }));
const techChange = async (role: string) => say(await a.post(`/api/staff/${techRow.staff_id}/change`, { first_name: techRow.first_name, last_name: techRow.last_name, email: techRow.email, role_id: role, workplace_id: HEAVY, job_title: techRow.job_title, salary_type: techRow.salary_type, salary: techRow.salary, billable: !!techRow.billable, clockable: !!techRow.clockable }));
let dBrowser: any = null;
try {
  // [Role-D] with View + Create & Edit (ids taken from the Admin role)
  roleId = (await rolesList()).find((r) => (r.label ?? r.name) === ROLE_D)?.id; if (!roleId) throw new Error('[Role-D] missing');
  roleBody = await roleRead(roleId); const adminRole = (await rolesList()).find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? '')); const adminPerms: any[] = (await roleRead(adminRole?.id))?.fe_permissions ?? [];
  ceIds = adminPerms.filter((x) => /^workOrdersCreateAndEdit$/.test(String(x.code ?? x.name))).map((x) => x.id); const viewIds = adminPerms.filter((x) => /^workOrdersView$/.test(String(x.code ?? x.name))).map((x) => x.id);
  baseIds = [...new Set([...((roleBody?.fe_permissions ?? []) as any[]).filter((x) => !/^workOrdersCreateAndEdit$/.test(String(x.code ?? x.name))).map((x) => x.id), ...viewIds])];
  o.roleSetUp = await putRole([...baseIds, ...ceIds]); o.roleAtStart = woCodes(await roleRead(roleId));
  // [User-A] = Tech ShopView on [Role-D], at Heavy Duty (before he signs in)
  techRow = (await staffRows(a, 'tech@shopview.com')).find((x) => String(x.email).toLowerCase() === 'tech@shopview.com'); if (!techRow) throw new Error('Tech ShopView not found');
  techRoleBefore = techRow.role_id; o.techRoleBefore = techRow.role_label; o.techToRoleD = await techChange(roleId);
  o.techNow = (await staffRows(a, 'tech@shopview.com')).map((x) => `${x.first_name} ${x.last_name} ${x.role_label}`);
  // technicians and work orders (as staledrop-stg4)
  const TECH = (await rolesList()).find((r) => /^Technician$/i.test(r.label ?? r.name ?? ''))?.id; const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = dd.find((d: any) => (d.name ?? d.label) === 'Service');
  const tech = async (f: string, l: string, tag: string) => { const r = (await person(a, `ZZAUTOTEST ${f}`, l, { role: TECH, email: `zz.wob.${tag}${D}`, clockable: true })).row; if (r && !r.is_active) await a.post('/api/iam/change-status', { id: r.id }); if (r) await a.post('/api/staff/enrollment/create', { staffId: r.staff_id, workplaceId: HEAVY, departmentId: svc?.id }); return r; };
  const ANA = await tech('Ana', 'Alpha', 'ana.alpha'), BEN = await tech('Ben', 'Bravo', 'ben.bravo');
  const q = `ZZAUTOTEST F3 Stale Drop ${Date.now() % 100000}`; const w: Record<string, string> = {}; const log: string[] = [];
  const canned = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data);
  const linesRaw = async (wo: string) => { const d0 = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return (Array.isArray(d0) ? d0 : d0?.collection ?? []) as any[]; };
  for (const co of ['Alpha Co', 'Bravo Co']) { const c = await customer(a, `${q} ${co}`, 'ZZF3SD'); const id = await workOrder(a, c, 'estimate', null); await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: canned[1 % canned.length].id, status: 'authorized' });
    log.push(`${co} approved ${say(await a.post('/api/work-orders/change-status', { id, status: 'approved' }))}`); log.push(`${co} lead ${say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: ANA.staff_id }))}`); w[co] = id; }
  { const id = w['Alpha Co']; log.push(`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: id, mileage: '123456' }))}`);
    for (const l of await linesRaw(id)) { for (const rq of (l.part_requests ?? []) as any[]) await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {});
      await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: id }); log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: id }))}`); } }
  const row = async (co: string) => (await workOrders(a, q)).find((x: any) => x.id === w[co]); const lead = async (co: string) => { const x = await row(co); return x?.techAssignedFirstName ? `${x.techAssignedFirstName} ${x.techAssignedLastName}` : 'none'; };
  o.setup = { log, alpha: `${(await row('Alpha Co'))?.number} ${(await row('Alpha Co'))?.status} lead=${await lead('Alpha Co')}`, bravo: `${(await row('Bravo Co'))?.number} ${(await row('Bravo Co'))?.status} lead=${await lead('Bravo Co')}` };
  // the dispatcher's own browser: ONLY Analyst 1's Google cookies (no app session), Dev Mode quick-login "Tech"
  const C = JSON.parse(fs.readFileSync(ANALYST_FILE, 'utf8')); const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
  dBrowser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const dctx = await dBrowser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await dctx.addCookies(['app.staging.shopview.com', 'api.staging.shopview.com'].flatMap((h) => ['sv_sso_session', 'cf_clearance'].filter((n) => C[n]).map((n) => ({ name: n, value: C[n], domain: h, path: '/', secure: true, sameSite: 'None' as const }))));
  await dctx.route((u: any) => /maps\.googleapis|intercom|sentry\.io|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r: any) => r.abort()).catch(() => {});
  const pg: Page = await dctx.newPage(); pg.setDefaultTimeout(30_000); const da = api(pg);
  await pg.goto(APP + '/login?redirect=/workorders', { waitUntil: 'domcontentloaded' }); const qb = pg.locator('button:has-text("Tech")').first(); for (let i = 0; i < 20 && !(await qb.count()); i++) await pg.waitForTimeout(1500);
  o.devTechButton = await qb.count(); await qb.click().catch(() => {}); await pg.waitForTimeout(9000); o.dispatcherUrl = pg.url().replace(APP, '');
  const fe = (await da.get('/api/auth/me/fe-permissions')).body?.data; o.dispatcherPerms = (Array.isArray(fe) ? fe : fe?.fe_permissions ?? []).map((x: any) => x.code ?? x.name ?? x);
  o.adminStillSignedIn = (await a.get('/api/auth/me/fe-permissions')).status;   // the two sessions are separate: the Admin's must still answer 200
  o.dispatcherTop0 = await pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ')).catch(() => null);
  if (!String(o.dispatcherTop0 ?? '').includes(LOC1_NAME)) o.dispatcherLoc = await switchLocUI(pg, LOC1_NAME);
  { const PREF = '/api/users/me/preferences/work-orders-list'; const pv = (await da.get(PREF)).body?.data?.value ?? {}; o.pinPut = (await da.put(PREF, { value: { ...pv, pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id], filters: {} } })).status; }
  await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All'); await display(pg, 'Board View'); await search(pg, q); await toColumn(pg, ANA.staff_id);
  const card = (co: string) => `[data-test-id="board_card_${w[co]}"]`;
  o.start = { top: await pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ')).catch(() => null), alpha: await pg.locator(card('Alpha Co')).count(), bravo: await pg.locator(card('Bravo Co')).count(), benColumn: await pg.locator(`[data-test-id="board_column_${BEN.staff_id}"]`).count() }; await shot(pg, 's3-dispatcher-board');
  // step 4: the Admin (other session) invoices Alpha Co — on the Admin's own screen: work order > Finance > Create Invoice is the case's
  // route; the Admin's invoice call is the same one (POST /api/invoices/create), sent from the Admin's page
  o.step4 = { invoice: say(await a.post('/api/invoices/create', { work_order_id: w['Alpha Co'], issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) })), status: (await row('Alpha Co'))?.status, dispatcherSession: (await da.get('/api/auth/me/fe-permissions')).status };
  // step 5: dispatcher, no refresh
  await watchStart(pg); o.step5 = { drag: await dragOn(pg, card('Alpha Co'), `[data-test-id="board_column_${BEN.staff_id}"]`) }; await shot(pg, 's5-just-dropped'); o.step5.prompt = await shiftPrompt(pg, 'Keep shifts'); o.step5.alert = await toastsOf(pg); await pg.waitForTimeout(2500); o.step5.watched = await watchRead(pg);
  o.step5.anaColumn = await pg.evaluate(`[...document.querySelectorAll('[data-test-id="board_column_${ANA.staff_id}"] [data-test-id="board_card_number"]')].map(e => e.textContent.trim())`).catch(() => null); await shot(pg, 's5-alert');
  await pg.locator('.q-notification button').first().click().catch(() => {});
  // step 6
  await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000); o.step6 = { status: (await row('Alpha Co'))?.status, lead: await lead('Alpha Co'), url: pg.url().replace(APP, '') }; await shot(pg, 's6-after-refresh');
  // step 7: Admin unticks Create & Edit on [Role-D] (role save), read back
  o.step7 = { save: await putRole(baseIds), roleNow: woCodes(await roleRead(roleId)) };
  // step 8: dispatcher, no refresh, drags Bravo Co
  await watchStart(pg); o.step8 = { drag: await dragOn(pg, card('Bravo Co'), `[data-test-id="board_column_${BEN.staff_id}"]`) }; await shot(pg, 's8-just-dropped'); o.step8.prompt = await shiftPrompt(pg, 'Keep shifts'); o.step8.alert = await toastsOf(pg); await pg.waitForTimeout(2500); o.step8.watched = await watchRead(pg);
  o.step8.url = pg.url().replace(APP, ''); o.step8.dispatcherSession = (await da.get('/api/auth/me/fe-permissions')).status; await shot(pg, 's8-alert');
  // step 9
  await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000); o.step9 = { lead: await lead('Bravo Co'), url: pg.url().replace(APP, '') }; await shot(pg, 's9-after-refresh');
  // control: the dispatcher's permissions as the server now reads them (fresh), and the Reassign item on a freshly loaded board
  const fe2 = (await da.get('/api/auth/me/fe-permissions')).body?.data; o.controlPermsAfter = (Array.isArray(fe2) ? fe2 : fe2?.fe_permissions ?? []).map((x: any) => x.code ?? x.name ?? x).filter((c: string) => /^workOrders/.test(c));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, 'error'); }
finally {
  if (roleId && roleBody) { o.roleRestore = await putRole([...baseIds, ...ceIds]); o.roleAfter = woCodes(await roleRead(roleId)); }
  if (techRow) { o.techRestore = await techChange(techRoleBefore || TECH_ROLE_STOCK); o.techAfter = (await staffRows(a, 'tech@shopview.com')).map((x) => x.role_label); }
  if (dBrowser) await Promise.race([dBrowser.close(), new Promise((r) => setTimeout(r, 8000))]);
  // put Analyst 1's own app session back (sign-in form), saved to its cookie file
  try { const A = await analystBrowser('/workorders'); o.analystBack = { url: A.info.url, top: A.info.top, form: A.info.formSignIn ?? null }; await A.browser.close(); } catch (e: any) { o.analystBack = String(e).slice(0, 120); }
  fs.writeFileSync(path.join(EV, 'C97012-2p.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C97012-2P', JSON.stringify(o).slice(0, 8000)); await done(browser);
}
