/**
 * notech-stg4.mts — 15 Oct 2026, fourth pass on STAGING: C368130 "A location with no technicians shows only Unassigned in
 * Tech View and Board View".
 *
 * WHY THIS SCRIPT: in the second pass (s2-batchB.mts) "ZZAUTOTEST F2 Empty Shop" was not a location with no technicians —
 * Admin ShopView counted as a technician there (Tech View had an Admin ShopView group, Board View an Admin ShopView column).
 * That location was created by Admin ShopView (stg-setup.mts), and the creating user is enrolled at the location they create
 * (setup.json: Admin's my-workplaces lists it straight after creation), and Admin ShopView has Time Clock on. Taking it away
 * means editing the signed-in admin's OWN staff record, which ends the shared sign-in (playbook: a Time Clock change on your own
 * record answers 401 at once) — every later script would then fail.
 * So the location is made by someone who is NOT a technician: our test admin "ZZ WOB Runner" (Admin role, Time Clock OFF,
 * runner.mts). The creator is the only person enrolled there, and with Time Clock off nobody counts as a technician.
 * Everything below is done as the runner, in the runner's own window (viewAs), the way the case's steps read:
 *   (1) Administration > Locations > New Location "ZZAUTOTEST F2 No Tech Shop" (only if missing; stg-setup.mts recipe);
 *   (2) two work orders with no lead for "ZZAUTOTEST F2 No Tech Location 2" made AT that location (data set-up by the API);
 *   (3) who the product offers as a technician there (lead-technician-candidates) — expected nobody;
 *   (4) the screen switched there ON SCREEN (profile menu > select_location, L0333), Work Orders > All > Tech View, then Board View,
 *       each read in full (groups/columns, the work order numbers in each, and the words the page shows);
 *   (5) switched back to Staging Heavy Duty - 9919.
 * Work order numbers at a new location carry that location's own prefix, so numbers are matched as LETTERS-DIGITS, never S\d+-.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, seedCase } from './data.mts';
import { EV, t, shot, display, tab, allBoardCols, switchLocUI } from './wob.mts';
import { HEAVY } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const R: Record<string, any> = {};
const LOC = 'ZZAUTOTEST F2 No Tech Shop';
const CUST = 'ZZAUTOTEST F2 No Tech Location 2';
const { browser, page: p0 } = await open('/workorders?tab=all');
const a0 = api(p0);
const wpList = async () => { const d = (await a0.get('/api/workplaces')).body?.data; return (Array.isArray(d) ? d : d?.collection ?? []) as any[]; };
const HEAVY_NAME = (await wpList()).find((w) => w.id === HEAVY)?.name ?? 'Staging Heavy Duty - 9919';
const NUM = /\b[A-Z][A-Z0-9]*-\d{3,}\b/g;

if (want('C368130')) {
  const RUN = await asRunner(browser, p0, a0); const p = RUN.p; const a = RUN.a; p.setDefaultTimeout(30_000);
  const o: any = { runner: RUN.id.slice(0, 8), location: LOC };
  try {
    // (1) the location, made by the runner on screen
    let w = (await wpList()).find((x) => x.name === LOC);
    o.locationExisted = !!w;
    if (!w) {
      await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
      await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(3000);
      const d = p.locator('.q-dialog').last();
      await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(LOC);
      const fill = async (lab: string, v: string) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
      await fill('Address 1', '2 ZZAUTOTEST Way'); await fill('City', 'Las Vegas'); { const z = d.getByLabel(/ZIP/i).first(); await z.click(); await z.fill('89135'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('7025550198', { delay: 30 }); }
      const st = d.getByLabel('State/Province').first(); await st.click(); await p.waitForTimeout(800); await p.keyboard.type('Nevada', { delay: 40 }); await p.waitForTimeout(1200);
      await p.locator('.q-menu .q-item').filter({ hasText: 'Nevada' }).first().click().catch(() => {}); await p.waitForTimeout(800);
      const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); await tz.click(); await p.waitForTimeout(800); await p.keyboard.type('Karachi', { delay: 50 }); await p.waitForTimeout(1500);
      await p.locator('.q-menu .q-item').filter({ hasText: 'Asia/Karachi' }).first().click().catch(() => {}); await p.waitForTimeout(800);
      await shot(p, 'C368130-stg4-location-filled');
      o.saveClicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
      await p.waitForTimeout(4000); o.saveToasts = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 150))`);
      w = (await wpList()).find((x) => x.name === LOC);
    }
    if (!w) throw new Error(`location "${LOC}" was not created (${JSON.stringify(o.saveToasts ?? [])})`);
    o.locationId = w.id;
    const myWp = (await a.get('/api/staff/my-workplaces')).body?.data; o.runnerWorkplaces = (Array.isArray(myWp) ? myWp : myWp?.collection ?? []).map((x: any) => x.name);
    // (2) + (3) data at that location (server-side location of the runner's session), and who counts as a technician there
    await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: w.timezone ?? 'Asia/Karachi' });
    const wos = await seedCase(a, CUST, 'ZZF2NT', [{ lead: null }, { lead: null }]);
    o.workOrders = wos.map((x: any) => `${x.number} ${x.status} lead=${x.techAssignedFirstName ?? '-'}`);
    o.techniciansThere = (await candidates(a)).map((x) => x.name);
    // FIX-UP 2 (17 Oct 2026): on 16 Oct Ayesha Khan counted as a technician here, so "no technicians" was false. The precondition is now
    // MADE TRUE every run (Rule 107; nothing is put back): every person the product offers as a technician at this location loses the
    // location — each enrolment there is removed with the app's own route (POST /api/staff/enrollment/remove {staffId, workplaceId,
    // departmentId}, department ids from the staff view, else every department tried), and a person whose Location field (home
    // location) IS this location is moved to Heavy Duty — then the list is read back and must be empty.
    console.log(t(), 'START STATE found C368130', JSON.stringify({ location: LOC, techniciansThere: o.techniciansThere }));
    o.unenrol = [];
    if (o.techniciansThere.length) {
      const deps = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data) as any[];
      for (const c of await candidates(a)) {
        const v = (await a.get(`/api/staff/${c.id}/view`)).body?.data ?? {}; const row = v.staff ?? v;
        const ens = ((v.enrollments ?? v.workplaces ?? row.enrollments ?? []) as any[]).filter((e: any) => (e.workplace_id ?? e.workplaceId ?? e.id) === w!.id || (e.workplace_name ?? e.workplaceName ?? e.name) === LOC);
        const depIds = [...new Set(ens.map((e: any) => e.department_id ?? e.departmentId).filter(Boolean))] as string[];
        for (const dep of (depIds.length ? depIds : deps.map((d: any) => d.id))) { const r = await a.post('/api/staff/enrollment/remove', { staffId: c.id, workplaceId: w!.id, departmentId: dep }); if (r.status < 300 || depIds.length) o.unenrol.push(`${c.name} ${String(dep).slice(0, 8)} ${r.status}`); }
        const sr = (await a.get(`/api/staff?limit=200&search=${encodeURIComponent(c.name)}`)).body?.data?.collection?.find((x: any) => x.staff_id === c.id);
        if (sr && sr.workplace_id === w!.id) o.unenrol.push(`${c.name} home location -> Heavy Duty ${(await a.post(`/api/staff/${sr.staff_id}/change`, { first_name: sr.first_name, last_name: sr.last_name, email: sr.email, role_id: sr.role_id, workplace_id: HEAVY, job_title: sr.job_title, salary_type: sr.salary_type, salary: sr.salary, billable: !!sr.billable, clockable: !!sr.clockable })).status}`);
      }
      o.techniciansThereAfterRemoval = (await candidates(a)).map((x) => x.name);
    } else o.techniciansThereAfterRemoval = [];
    console.log(t(), 'START STATE set C368130', JSON.stringify({ removed: o.unenrol, techniciansThere: o.techniciansThereAfterRemoval }));
    if (o.techniciansThereAfterRemoval.length) o.setupWarning = `technicians still offered at ${LOC}: ${o.techniciansThereAfterRemoval.join(', ')} — the "no technicians" reading is void`;
    await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'America/Edmonton' });
    // (4) on screen — 15 Oct 2026 (wave 11, fourth pass): the on-screen switch in the runner's viewAs window did not take (top bar stayed
    // "Staging Heavy Duty - 9919" although the runner is enrolled at the new location). That window re-writes the runner's saved user
    // (with Heavy Duty as its location) into page storage on EVERY page load (viewas.mts init script), so a switch that reloads the page
    // is undone. So the screen part runs in a CLEAN window of the same session (cookies only, no page storage, no init script — the
    // "second browser" of s7-batch): the server is told the new location first, the page is opened, the top bar read; if it is not the
    // new location, the profile menu's location list is read and the switch made there (switchLocUI); the top bar is read back and
    // nothing is read off the board unless it names the new location.
    if (!(o.runnerWorkplaces ?? []).includes(LOC)) { // the location menu lists only locations the user is enrolled at (L0345); the runner has Time Clock off, so this never makes it a technician
      const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const dep = dd.find((d: any) => (d.name ?? d.label) === 'Service') ?? dd[0];
      o.enrolRunner = (await a.post('/api/staff/enrollment/create', { staffId: RUN.staffId, workplaceId: w.id, departmentId: dep?.id })).status; }
    await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: w.timezone ?? 'Asia/Karachi' });
    const st = await p.context().storageState();
    // 15 Oct 2026 (wave 16, fifth pass): with cookies only the clean window landed on /login ("/login?redirect=/workorders?tab=all",
    // top bar null) — the app's sign-in lives in page storage too (token / user). Carry the full storage state (as c368239-step4,
    // imp-fix4 and orgb-fix do); the new window has NO init script, so the on-screen location switch below is not undone (the reason the
    // clean window exists). The stored user may still name Heavy Duty at first; switchLocUI then changes it on screen.
    o.cleanState = { cookies: st.cookies.length, origins: st.origins.length, keys: st.origins.flatMap((x: any) => (x.localStorage ?? []).map((y: any) => y.name)).slice(0, 12) };
    const ctx = await browser.newContext({ storageState: st, viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.WOB_SCALE || 1), ignoreHTTPSErrors: true });
    await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
    const pg = await ctx.newPage(); pg.setDefaultTimeout(30_000);
    try {
      await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await pg.waitForTimeout(7000);
      const hdr = () => pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
      o.cleanWindowUrl = pg.url().replace(APP, ''); o.headerOnOpen = await hdr();
      if (/\/login/.test(pg.url())) throw new Error(`the clean window opened the sign-in page (${o.cleanWindowUrl}) — not signed in, nothing read`);
      if (!(o.headerOnOpen ?? '').includes(LOC)) {
        await pg.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await pg.waitForTimeout(1200);
        await pg.locator('[data-test-id="select_location"]').click().catch(() => {}); await pg.waitForTimeout(1500);
        o.locationsOffered = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 20);
        await shot(pg, 'C368130-stg4-location-menu'); await pg.keyboard.press('Escape').catch(() => {}); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(800);
        o.header = await switchLocUI(pg, LOC);
        if (!/\/workorders/.test(pg.url())) { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await pg.waitForTimeout(6000); }
      }
      o.headerOnWorkOrders = await hdr(); o.switched = (o.headerOnWorkOrders ?? '').includes(LOC.slice(0, 20)); /* 15 Oct (wave 24): the top bar may cut a long name short */
      await shot(pg, 'C368130-stg4-top-bar');
      if (!o.switched) throw new Error(`top bar still reads "${o.headerOnWorkOrders}" — nothing read off the board`);
      o.techniciansThereAfterSwitch = (await candidates(api(pg))).map((x) => x.name);
      await tab(pg, 'All'); await display(pg, 'Tech View');
      if (await pg.locator('[data-test-id="tech_view_group_unassigned"][data-collapsed="true"]').count()) { await pg.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click().catch(() => {}); await pg.waitForTimeout(1500); }
      o.tech = await pg.evaluate(`(() => { const out = []; let cur = null; const re = ${NUM};
        for (const tr of document.querySelectorAll('.q-virtual-scroll__content > tr')) { const tid = tr.getAttribute('data-test-id') || '';
          if (tid.startsWith('tech_view_group_')) { const id = tid.replace('tech_view_group_', ''); const q = (s) => tr.querySelector('[data-test-id="' + s + id + '"]'); cur = { id, name: (q('tech_view_group_name_') || {}).textContent?.trim(), count: (q('tech_view_group_count_') || {}).textContent?.trim(), rows: [] }; out.push(cur); continue; }
          if (cur) for (const m of (tr.innerText.match(re) || [])) if (!cur.rows.includes(m)) cur.rows.push(m); }
        return out; })()`);
      o.techText = (await pg.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 900);
      await shot(pg, 'C368130-stg4-tech');
      await display(pg, 'Board View');
      const hasBoard = await pg.locator('[data-test-id="board_view_scroller"], .board-view__scroller').count();
      o.board = hasBoard ? (await allBoardCols(pg)).map((c) => ({ id: c.id, name: c.name, count: c.count, cards: c.cards, empty: c.empty })) : 'no board scroller (empty state, L0340)';
      o.boardText = (await pg.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`) as string).replace(/\s+/g, ' ').slice(0, 900);
      await shot(pg, 'C368130-stg4-board'); await pg.screenshot({ path: path.join(EV, 'C368130-end.png') }).catch(() => {});
      await display(pg, 'List');
    } finally {
      o.backOnScreen = await switchLocUI(pg, HEAVY_NAME).catch((e) => 'switch back failed ' + String(e).slice(0, 80));
      await ctx.close().catch(() => {});
    }
  } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, 'C368130-stg4-error'); }
  // (5) back to the first location, on screen and on the server
  o.back = await switchLocUI(p, HEAVY_NAME).catch((e) => 'switch back failed ' + String(e).slice(0, 80));
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'America/Edmonton' }).catch(() => {});
  await RUN.end().catch(() => {});
  R.C368130 = o;
  console.log(t(), 'C368130', JSON.stringify(o).slice(0, 12000));
}
fs.writeFileSync(path.join(EV, 'notech-stg4.json'), JSON.stringify(R, null, 1));
await done(browser);
