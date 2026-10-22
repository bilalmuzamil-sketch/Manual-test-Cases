/** seed-carol-prod-1022.mts — 22 Oct 2026: C707077 needs Technician-A = "Carol Neal" whose STAFF RECORD reads "Carol Neal" while her
 *  SIGN-IN ACCOUNT reads "David Sparks" (on staging that person already existed, L0402). Production had nobody, so step 27 stopped
 *  ("Carol Neal not found"). Made the way the staging C581895 set-up made such a split (stg-fix-new3.mts mk()): staff "Carol Neal" with
 *  the Technician role at the profile location (Time Clock on, billable), then account access as her → POST /api/iam/change-name
 *  "David Sparks" → read the profile back → Exit (banner button, API fallback) → read her staff row back. Exit 1 when the split is not made. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
import { person, roleIds, staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const EM = 'zz.wob.carol.neal@staging.shopview.local';
try {
  let row = (await staffRows(a, EM))[0];
  if (!row) { const r = await person(a, 'Carol', 'Neal', { role: (await roleIds(a))['Technician'], email: EM, clockable: true, billable: true }); o.create = r.log; row = r.row ?? (await staffRows(a, EM))[0]; }
  if (!row) throw new Error('staff Carol Neal could not be made');
  o.before = { staff: `${row.first_name} ${row.last_name}`, user_id: row.id, staff_id: row.staff_id };
  // 22 Oct 2026: on production the /impersonate-user/<id> page did not start account access (imp-fix3); the server request the run's
  // runner uses (viewas.mts: POST /api/switch-user) does — so that, then the page is reloaded so it runs as her.
  o.switchUser = (await a.post('/api/switch-user', { user_id: row.id })).status; await p.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  o.asWho = JSON.stringify((await a.get('/api/iam/view-profile/').catch(() => ({ body: null } as any))).body?.data ?? null).slice(0, 200);
  let ch: any = await a.post('/api/iam/change-name', { first_name: 'David', last_name: 'Sparks' });
  if (ch.status >= 300) ch = await a.post('/api/iam/change-name', { firstName: 'David', lastName: 'Sparks' });
  o.changeName = `${ch.status} ${JSON.stringify(ch.body).slice(0, 160)}`;
  o.profileAfter = JSON.stringify((await a.get('/api/iam/view-profile/').catch(() => ({ body: null } as any))).body?.data ?? null).slice(0, 200);
  await p.screenshot({ path: path.join(EV, 'seed-carol-profile.png') }).catch(() => {});
  const exitBtn = p.locator('[data-test-id="button_exit_impersonation"]').first();
  if (await exitBtn.count()) { await exitBtn.click(); await p.waitForTimeout(8000); } else o.exitApi = (await a.post('/api/exit-switch-user', {})).status;
  await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  if (await p.locator('[data-test-id="button_exit_impersonation"]').count()) { o.exitApi2 = (await a.post('/api/exit-switch-user', {})).status; await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); }
  o.stillInAccountAccess = await p.locator('[data-test-id="button_exit_impersonation"]').count();
  const back = (await staffRows(a, EM))[0]; o.after = back ? { staff: `${back.first_name} ${back.last_name}`, raw: JSON.stringify(back).slice(0, 400) } : null;
  // 22 Oct 2026 (production, first run): renaming the ACCOUNT also renamed the STAFF record (staff list read "David Sparks"), unlike staging
  // (L0402). Try the other direction: set the staff record back to Carol Neal (Settings > Staff edit, behind the screen) and read BOTH
  // names again (staff list, and the account's own profile through account access). If they move together, production keeps one name.
  if (back && o.after?.staff !== 'Carol Neal') {
    const sc = await a.post(`/api/staff/${back.staff_id}/change`, { first_name: 'Carol', last_name: 'Neal', email: back.email, role_id: back.role_id, workplace_id: back.workplace_id, job_title: back.job_title, salary_type: back.salary_type, salary: back.salary, billable: !!back.billable, clockable: !!back.clockable });
    o.staffBack = `${sc.status} ${JSON.stringify(sc.body).slice(0, 160)}`;
    const b2 = (await staffRows(a, EM))[0]; o.after2 = b2 ? `${b2.first_name} ${b2.last_name}` : null;
    const sw2 = await a.post('/api/switch-user', { user_id: back.id ?? o.before?.user_id }); o.switch2 = sw2.status;
    if (sw2.status < 300) { o.profileAfter2 = JSON.stringify((await a.get('/api/iam/view-profile/').catch(() => ({ body: null } as any))).body?.data?.user ?? null).slice(0, 160); o.exit2 = (await a.post('/api/exit-switch-user', {})).status; }
    o.namesTied = o.after2 === 'Carol Neal' && !/Sparks/.test(o.profileAfter2 ?? '') ? 'yes - production keeps ONE name for staff and account' : (o.after2 === 'Carol Neal' ? 'no - staff Carol Neal, account still David Sparks' : 'staff rename refused');
  }
  const fin = (await staffRows(a, EM))[0]; o.final = fin ? `${fin.first_name} ${fin.last_name}` : null;
  o.ok = !o.stillInAccountAccess && o.final === 'Carol Neal' && (/David/.test(o.profileAfter2 ?? o.profileAfter) && /Sparks/.test(o.profileAfter2 ?? o.profileAfter));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'CAROL', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'seed-carol-prod-1022.json'), JSON.stringify(o, null, 1));
await done(browser, o.ok ? 0 : 1);
