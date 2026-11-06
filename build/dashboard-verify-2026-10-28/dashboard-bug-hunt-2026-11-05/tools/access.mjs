// Area 4 — Story 1 access on STAGING (quick-login allowed there; never on a QA branch).
// A: Tech (Technician role, no reportsPageAccess). B: Tech temporarily on "ZZAUTOTEST No Financial Data" (has reportsPageAccess),
// then RESTORED to the role it had (read first). SECRET-FREE: cookies via staging-admin.mjs; nothing printed but statuses.
import fs from 'fs';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { out, save, sleep } from './hb.mjs';
const APP = 'https://app.staging.shopview.com'; const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; const Z = 'Asia/Karachi';
const TECH_STAFF = '6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa'; const TEMP_ROLE = '7f09dc60'; const LOG = out('area4-access') + '/role-changes.jsonl';
if (process.env.TZ !== Z) throw new Error('RULE99: run with TZ=' + Z);
const ev = { env: 'staging', app_version: null, runs: {} };
const admin = (await login('admin')).sessCookie;
const roles = (await api(admin, 'GET', '/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).body.data; const list = roles.collection || roles;
const temp = list.find(r => r.id.startsWith(TEMP_ROLE));
async function techStaff() { const r = await api(admin, 'GET', '/api/staff?search=tech%40shopview.com&limit=20'); const c = r.body?.data?.collection || []; return c.find(s => s.email === 'tech@shopview.com' && (s.staff_id === TECH_STAFF || s.id === TECH_STAFF)) || c.find(s => s.email === 'tech@shopview.com'); }
async function look(label) {
  const { browser, page, feData } = await boot2('tech', { workplaceId: HD, timezone: Z });
  await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [HD, Z]);
  const r = { label, perms_has_reportsPageAccess: (feData?.fe_permissions || []).some(p => (p.code || p.name || p) === 'reportsPageAccess') };
  await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  r.app_version = await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content); ev.app_version = r.app_version;
  r.rule99 = await page.evaluate(() => ({ browser_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, ls_timezone: localStorage.getItem('timezone'), ls_location: localStorage.getItem('location'), header: (document.querySelector('header')?.innerText || '').replace(/\s+/g, ' ').slice(0, 300) }));
  r.rule99.process_TZ = process.env.TZ;
  r.nav = await page.evaluate(() => [...document.querySelectorAll('[data-test-id="button_desktop_nav_link"]')].map(e => e.innerText.trim()));
  await page.screenshot({ path: `${out('area4-access')}/${label}-1-nav.png` });
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await sleep(9000);
  r.dashboard_typed_url_lands_on = page.url().replace(APP, ''); r.dashboard_body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300);
  r.tiles = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="hero_value_"]')].map(e => [e.getAttribute('data-test-id'), e.innerText.trim()]));
  r.tile_errors = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="hero_error_"]')].map(e => e.getAttribute('data-test-id')));
  await page.screenshot({ path: `${out('area4-access')}/${label}-2-dashboard-url.png` });
  r.api = await page.evaluate(async () => { const x = await fetch('https://api.staging.shopview.com/api/dashboard/reports?reports[]=revenueKpi&reports[]=topCustomers&from=2026-11-01&to=2026-11-06', { credentials: 'include', headers: { Accept: 'application/json' } }); const t = await x.text(); return { status: x.status, has_revenue_value: /"value"\s*:/.test(t), body_head: t.slice(0, 200) }; });
  ev.runs[label] = r; console.log(label, JSON.stringify({ hasRPA: r.perms_has_reportsPageAccess, nav: r.nav, lands: r.dashboard_typed_url_lands_on, tiles: r.tiles.length, errs: r.tile_errors.length, api: r.api.status, apiData: r.api.has_revenue_value, rule99: r.rule99.browser_tz + '/' + r.rule99.ls_timezone }));
  await browser.close();
}
if (!process.env.SKIP_A) await look('A-technician-role');
const before = await techStaff(); ev.tech_before = { id: before?.id, staff_id: before?.staff_id, role_id: before?.role_id, role_label: before?.role_label, workplace_id: before?.workplace_id };
console.log('tech staff ids', JSON.stringify(ev.tech_before)); const SID = before.staff_id || before.id;
const body = role => ({ first_name: before.first_name, last_name: before.last_name, email: before.email, workplace_id: before.workplace_id, role_id: role });
const ch = await api(admin, 'POST', `/api/staff/${SID}/change`, body(temp.id)); fs.appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), op: 'tech -> ' + temp.name, status: ch.status }) + '\n');
console.log('role change', ch.status, temp.name);
try { await look('B-reports-role-no-financial-data'); }
finally {
  const rb = await api(admin, 'POST', `/api/staff/${SID}/change`, body(before.role_id)); const after = await techStaff();
  ev.restore = { status: rb.status, role_id_now: after?.role_id, role_label_now: after?.role_label, same_as_before: after?.role_id === before.role_id };
  fs.appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), op: 'tech restored -> ' + before.role_label, status: rb.status, same: ev.restore.same_as_before }) + '\n');
  console.log('restore', JSON.stringify(ev.restore));
}
save('area4-access', 'access', ev);
