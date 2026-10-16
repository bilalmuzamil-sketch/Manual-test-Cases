/** 16 Oct 2026 (batch 40), C97012 set-up probe: can the Analyst 1 account (a separate Google sign-in, so a separate app session) be the
 *  case's dispatcher [User-A] in company A? As the Admin (main sign-in): find or add the staff member with that email at Staging Heavy
 *  Duty on [Role-D] "ZZAUTOTEST F3 Stale Drop Dispatcher Role" (View + Create & Edit). Then, in the Analyst's own browser: which
 *  companies / locations it can reach now (organisation switcher, Change Location list), every answer recorded. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts'; import { analystBrowser, ANALYST_FILE } from './analyst.mts';
const ORG = (await import('./profile.mts')).ORG; const EMAIL = JSON.parse(fs.readFileSync(ANALYST_FILE, 'utf8')).user as string;
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = { exit: (await a.post('/api/exit-switch-user', {})).status };
const roles = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) as any[];
const RD = roles.find((r) => (r.label ?? r.name) === 'ZZAUTOTEST F3 Stale Drop Dispatcher Role'); o.roleD = !!RD;
const rr = (await a.get(`/api/roles/${RD.id}`)).body?.data; o.roleDperms = (rr?.fe_permissions ?? []).map((x: any) => x.code ?? x.name);
o.existing = (await staffRows(a, EMAIL)).map((x) => `${x.first_name} ${x.last_name} ${x.role_label} active=${x.is_active}`);
const r = await person(a, 'Analyst', '1', { role: RD.id, email: EMAIL, clockable: false }); o.create = r.log; o.row = r.row ? `${r.row.first_name} ${r.row.last_name} ${r.row.role_label} ${String(r.row.staff_id).slice(0, 8)}` : null;
fs.writeFileSync(path.join(EV, "C97012-analyst-join.json"), JSON.stringify(o, null, 1)); console.log(t(), "JOIN-ADMIN", JSON.stringify(o).slice(0, 2000));
const A = await analystBrowser("/workorders?tab=all"); const q: any = { info: A.info };
q.orgs = ((await A.api.get("/api/staff/my-workplaces")).body?.data?.collection ?? []).map((w: any) => w.name); q.profile = ((await A.api.get("/api/iam/view-profile/")).body?.data?.user?.enrollments ?? []).map((e: any) => JSON.stringify(e).slice(0, 160));
await A.page.locator("[data-test-id=\"profile_menu_button\"]").click().catch(() => {}); await A.page.waitForTimeout(1200); await A.page.locator("[data-test-id=\"select_location\"]").click().catch(() => {}); await A.page.waitForTimeout(1500);
q.locMenu = (await A.page.locator(".q-menu .q-item").allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, " ").trim()).slice(-8); await A.page.screenshot({ path: path.join(EV, "C97012-analyst-join.png") });
console.log(t(), "JOIN-ANALYST", JSON.stringify(q).slice(0, 3000)); await A.browser.close(); await done(browser);
