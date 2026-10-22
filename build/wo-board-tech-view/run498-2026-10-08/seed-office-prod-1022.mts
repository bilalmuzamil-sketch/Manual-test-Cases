/** seed-office-prod-1022.mts — 22 Oct 2026: production has no "Office User" role (roles there: Technician, Admin, Senior Service Advisor,
 *  Time Clock User, Foreman), so seed-staff.mts could not make "Olive Office" and C368163 step 8 ("{User-B} has the Office User role and
 *  is never offered, not even by searching") had nobody to search for. Makes a custom role named exactly "Office User" through the screen
 *  (Roles & Permissions > Create Custom Role, Work orders View; API fallback), then "Olive Office" (zz.wob.olive.office) with it at the
 *  profile location, Time Clock on. NOTE for the judge: this is a CUSTOM role carrying the name, not a system Office User role; if Olive
 *  is offered, that is Unsure (environment), never a product failure. Code copied from seed-viewonly-prod-1022.mts. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
import { person, roleIds } from './staff.mts'; import { ORG } from './profile.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const W = (ms: number) => p.waitForTimeout(ms); const J = JSON.stringify;
const say = (r: any) => ({ status: r?.status, body: JSON.stringify(r?.body ?? null).slice(0, 200) });
const ADMIN_ROLE = (await roleIds(a))['Admin'];
async function ensureOfficeRoleProd() {
  const NAME = 'Office User'; const o: any = {};
  const list = async () => ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
  const find = async () => (await list()).find((r: any) => (r.label ?? r.name) === NAME)?.id ?? null;
  const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 150))`).catch(() => []);
  const fromPage = () => p.evaluate(`(() => { const all = [...document.querySelectorAll('tr, .q-item, [role="row"], .q-card')].filter(e => (e.innerText || '').includes(${J(NAME)})); all.sort((x, y) => x.innerText.length - y.innerText.length);
      for (const e of all) { const h = [e, ...e.querySelectorAll('[href], [data-test-id]')].map(x => (x.getAttribute('href') || '') + ' ' + (x.getAttribute('data-test-id') || '')).join(' '); const m = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/.exec(h); if (m) return m[1]; } return null; })()`).catch(() => null) as Promise<string | null>;
  o.listed = (await list()).length; let id: string | null = await find(); o.foundInList = !!id;
  if (!id) {
    try {
      await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await W(6000);
      o.onPageBefore = (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`).catch(() => '') as string).includes(NAME);
      if (o.onPageBefore) { id = await fromPage(); o.idFromPage = id; }
      else {
        await p.locator('button').filter({ hasText: /Create Custom Role/i }).first().click(); await W(3000);
        const skip = p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first(); if (await skip.count()) { await skip.click(); await W(5000); }
        await p.locator('[data-test-id="role_name_input"]').fill(NAME);
        await p.locator('[data-test-id="area_workorders_view"]').click(); await W(800);
        
        const resp = p.waitForResponse((r) => /\/api\/roles\/?(\?|$)/.test(r.url()) && r.request().method() === 'POST', { timeout: 15_000 }).catch(() => null);
        await p.locator('button').filter({ hasText: /^\s*Create\s*$/ }).last().click(); await W(3000);
        const conf = p.locator('.q-dialog button').filter({ hasText: /Create|Continue|Yes|Confirm/i }).last(); if (await conf.count()) { o.confirm = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await conf.click(); await W(3000); }
        const r = await resp; if (r) { o.uiPost = r.status(); const b: any = await r.json().catch(() => null); id = b?.data?.id ?? b?.id ?? null; }
        o.uiToasts = await toasts();
        if (!id) id = await find();
        if (!id) { await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await W(6000); id = await fromPage(); o.idFromPageAfter = id; }
        
      }
    } catch (e: any) { o.ui = 'screen route failed: ' + String(e?.message || e).slice(0, 200); }
  }
  if (!id) {
    const src = ADMIN_ROLE ? (await a.get(`/api/roles/${ADMIN_ROLE}`)).body?.data : null;
    const view = (src?.fe_permissions ?? []).find((x: any) => /^workOrdersView$/i.test(String(x?.code ?? x?.name ?? '')));
    if (view) { const r = await a.post('/api/roles', { name: NAME, fePermissions: [view.id], organization: ORG, viewMode: src?.view_mode ?? null, crossToggles: { ...(src?.cross_toggles ?? {}), seeFinancialData: false }, description: 'ZZAUTOTEST fixture: Office User stand-in for production (C368163 step 8)', templateId: src?.template_id ?? null });
      o.api = say(r); id = r.body?.data?.id ?? r.body?.data?.role_id ?? (await find()); }
    else o.api = 'not tried: no workOrdersView permission id on the Admin role';
  }
  o.id = id ? id.slice(0, 8) : null;
  if (id) { const codes: string[] = ((await a.get(`/api/roles/${id}`)).body?.data?.fe_permissions ?? []).map((x: any) => String(x?.code ?? x?.name ?? x));
    o.readBack = codes.filter((c) => /^(workOrder|wo[A-Z])/.test(c)); o.viewOnly = codes.includes('workOrdersView') && !codes.some((c) => /^workOrder.*(CreateAndEdit|Delete)/i.test(c)); }
  return { o, id };
}
const r = await ensureOfficeRoleProd(); console.log(t(), 'ROLE', JSON.stringify(r.o));
let staff: any = null;
if (r.id) { const pr = await person(a, 'Olive', 'Office', { role: r.id, email: 'zz.wob.olive.office@staging.shopview.local', clockable: true }); staff = { role: pr.row?.role_label, active: pr.row?.is_active, log: pr.log }; }
console.log(t(), 'OLIVE', JSON.stringify(staff));
fs.writeFileSync(path.join(EV, 'seed-office-prod-1022.json'), JSON.stringify({ role: r.o, staff }, null, 1)); await done(browser, r.id ? 0 : 1);
