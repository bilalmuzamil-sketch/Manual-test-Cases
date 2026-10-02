import { test, expect } from 'playwright/test';
import { signIn, buildMarker, api, type Session } from '../fixtures/auth.js';
import { resolveTerm } from '../fixtures/anchors.js';
import { search, rowsOf, contains } from '../fixtures/search.js';

/**
 * ACCESS AND SHOP SCOPING — what a person is allowed to see, and where they are standing.
 *
 * ⚠️ THESE TESTS EDIT A ROLE. They take the Technician role apart one area at a time and put it
 * back. The baseline is captured before anything changes and restored in afterAll even on failure,
 * then READ BACK — a write that returns success is not proof it saved (see the note below).
 * Do not run this file against anything but a disposable QA branch.
 */
const TECH_ROLE = process.env.GS_TECH_ROLE || 'af8d02b5-ecd1-4205-a82f-32a4d5bb1015';
const HEAVY_DUTY = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const LETHBRIDGE = 'f8a8b802-7780-4b16-bf10-343caeb616b2';

/**
 * 🔴 THE SEEDED NAMES BELOW ARE STAGING'S. On production they exist only in part (measured
 * 2 Oct 2026), so each is resolved against the environment under test before use and the staging
 * word is kept wherever it still works — a staging run is therefore unchanged.
 */
let FIXTURE = 'ZZAUTOTEST';
let s: Session;
let baselinePerms: string[] = [];
let baselineRole: any = null;
let techStaffId = '';
let adminStaffId = '';

test.beforeAll(async () => {
  s = await signIn('/customers');
  FIXTURE = (await resolveTerm(s.page, 'ZZAUTOTEST')) ?? FIXTURE;
  console.log('build under test:', await buildMarker(s.page));
  /**
   * 🔴 THIS FILE EDITS A ROLE, AND THE ROLE IT NAMES IS STAGING'S.
   * On production that id returns nothing, `baselineRole` was undefined, and reading
   * `.fe_permissions` off it threw INSIDE beforeAll — which fails every test in the file, not just
   * the one that needed the role. Guard it: without the role there is nothing to restore and
   * nothing safe to change, so each check stands down with that reason.
   *
   * The ground these cover is also covered without mutating anything, by
   * `permissions-two-accounts.spec.ts`: it signs in as a full-access person and a lower-permission
   * person and compares the same record. That is the approach the QA lead asked for on
   * 2026-09-24, and it is why this file is not being repaired to edit roles on production.
   */
  const role = await api(s.page, 'GET', `/api/roles/${TECH_ROLE}`);
  baselineRole = (role.body as any)?.data ?? null;
  baselinePerms = Array.isArray(baselineRole?.fe_permissions)
    ? baselineRole.fe_permissions.map((p: any) => p.code).sort() : [];
  console.log(baselineRole
    ? `technician baseline: ${baselinePerms.join(',')}`
    : `the technician role ${TECH_ROLE} does not exist here — the role-editing checks will stand down`);
  const staff = ((await api(s.page, 'GET', '/api/staff?limit=250')).body as any)?.data?.collection ?? [];
  /**
   * 🔴 FIND PEOPLE BY THEIR ROLE, NEVER BY A FIRST NAME. This looked for a technician called "Brandi",
   * who exists on the old QA branch and not on staging. The id came back empty, switching to an empty
   * id is refused (400), and the session simply STAYED THE ADMIN - so on 2026-10-02 five checks
   * measured what an administrator sees and reported it as a technician seeing too much. Prefer
   * someone whose own shop is the one the data is seeded in, so a switch does not land elsewhere.
   */
  const active = staff.filter((x: any) => x.is_active);
  const pick = (ok: (x: any) => boolean) =>
    (active.find((x: any) => ok(x) && x.workplace_id === HEAVY_DUTY) ?? active.find(ok))?.id ?? '';
  techStaffId = pick((x) => x.role_id === TECH_ROLE);
  adminStaffId = pick((x) => /^admin(istrator)?$/i.test(String(x.role_label ?? '')));
  console.log(`technician to switch to: ${techStaffId || 'NONE'} · admin to switch back to: ${adminStaffId || 'NONE'}`);
  const adminRole = active.find((x: any) => x.id === adminStaffId)?.role_id;
  // The admin role holds every permission EXCEPT the technician's own view mode (it uses the full
  // view), so the list is the two roles together.
  const fromAdmin = adminRole ? ((((await api(s.page, 'GET', `/api/roles/${adminRole}`)).body as any)?.data?.fe_permissions) ?? []) : [];
  catalogue = [...fromAdmin, ...(baselineRole?.fe_permissions ?? [])]
    .map((p: any) => ({ id: p.id, code: p.code }))
    .filter((p, i, a) => a.findIndex((q) => q.id === p.id) === i);
  console.log(`permission list: ${catalogue.length} (the admin role and the technician role together)`);
});

test.afterAll(async () => {
  if (s && baselineRole) {
    await api(s.page, 'POST', '/api/switch-user', { user_id: adminStaffId });
    await s.page.waitForTimeout(1_000);
    await api(s.page, 'PUT', `/api/roles/${TECH_ROLE}`,
      { ...baselineRole, fe_permissions: baselineRole.fe_permissions.map((p: any) => p.id) });
    const back = ((await api(s.page, 'GET', `/api/roles/${TECH_ROLE}`)).body as any)?.data
      .fe_permissions.map((p: any) => p.code).sort();
    // Read it back, never assume. Restoring and hoping is how a branch gets left broken.
    console.log('restored identical to baseline:', JSON.stringify(back) === JSON.stringify(baselinePerms));
    await api(s.page, 'POST', '/api/iam/change-location', { workplace_id: HEAVY_DUTY, workplace_timezone: 'America/Edmonton' });
  }
  await s?.browser.close();
});

/**
 * 🔴 PERMISSION IDS COME FROM THE FULL LIST, NOT FROM THE ROLE BEING EDITED. This looked ids up in
 * the technician's OWN permissions, so a permission the technician does not already hold - the very
 * one C45144 and C45143 must GRANT - came back undefined and nothing was granted (staging,
 * 2026-10-02: "parts hidden with access granted" for a role that was never given parts). The admin
 * role holds every permission, so it is the catalogue.
 */
let catalogue: Array<{ id: string; code: string }> = [];
let implied: string[] = [];   // permissions the role's view mode added by itself, see asTechnicianWith
const idsOf = (codes: string[]) => {
  const ids = codes.map((c) => catalogue.find((p) => p.code === c)?.id);
  test.skip(ids.some((x) => !x), `permission(s) ${codes.filter((_c, i) => !ids[i]).join(', ')} not found in `
    + 'the full permission list, so the role cannot be built for this check');
  return ids as string[];
};
const codesOf = (ids: string[]) => ids.map((i) => catalogue.find((p) => p.id === i)?.code ?? i).sort();

/**
 * Back to the admin, in the seeding shop. 🔴 Every check that edits the role LEAVES the session as the
 * technician, so a check that needs the admin must say so: C45143's admin control and the shop test's
 * job creation both ran as the technician without it (staging, 2026-10-02).
 */
async function asAdmin() {
  await api(s.page, 'POST', '/api/switch-user', { user_id: adminStaffId });
  await s.page.waitForTimeout(800);
  await api(s.page, 'POST', '/api/iam/change-location', { workplace_id: HEAVY_DUTY, workplace_timezone: 'America/Edmonton' });
  await s.page.reload({ waitUntil: 'load' });
  await s.page.waitForTimeout(3_000);
}

async function asTechnicianWith(permissionIds: string[], toggles: Record<string, boolean> = {}) {
  test.skip(!techStaffId || !adminStaffId, 'no active technician (or no admin to switch back to) on '
    + 'this environment, so there is nobody to look through the edited role with');
  await api(s.page, 'POST', '/api/switch-user', { user_id: adminStaffId });
  await s.page.waitForTimeout(800);
  await api(s.page, 'PUT', `/api/roles/${TECH_ROLE}`, { ...baselineRole, fe_permissions: permissionIds,
    cross_toggles: { ...baselineRole.cross_toggles, ...toggles } });
  const sw = await api(s.page, 'POST', '/api/switch-user', { user_id: techStaffId });
  await s.page.waitForTimeout(1_000);
  // Parts and jobs are listed per shop, and a switch can land in the person's own shop.
  await api(s.page, 'POST', '/api/iam/change-location', { workplace_id: HEAVY_DUTY, workplace_timezone: 'America/Edmonton' });
  /**
   * 🔴 PROVE WHO WE ARE BEFORE JUDGING WHAT WE SEE (Rule 104). The permissions the session now holds
   * must be exactly the ones just written to the role. Anything else means the switch or the role
   * edit did not happen, and every count read below would describe somebody else - so the check
   * stands down with that reason instead of reporting a product fault.
   */
  const want = codesOf(permissionIds);
  const me = ((await api(s.page, 'GET', '/api/auth/me/fe-permissions')).body as any)?.data;
  const have = [...(me?.fe_permissions ?? [])].sort();
  /**
   * 🔴 STAGING ADDS ONE PERMISSION BY ITSELF (measured 2026-10-02): the role's view mode always brings
   * its own work-order view permission — woTechViewMode in tech view, woFullViewMode in full view —
   * even when the role was saved without it. So that one is accepted and NAMED in the result; any
   * other difference still means the switch or the edit failed.
   */
  const VIEW = ['woTechViewMode', 'woFullViewMode'];
  implied = have.filter((c) => !want.includes(c));
  const missingNow = want.filter((c) => !have.includes(c));
  if (implied.length) console.log(`   the session also holds ${implied.join(', ')}, added by the role's view mode`);
  test.skip(missingNow.length > 0 || implied.some((c) => !VIEW.includes(c)),
    `CONTROL FAILED: after switching to the technician (HTTP ${sw.status}) the session holds `
    + `${JSON.stringify(have)}, not the ${JSON.stringify(want)} just given to the role - so what it sees `
    + 'would not be the technician\'s view. Nothing was judged.');
  await s.page.goto('/customers', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(3_000);
}

/**
 * 🔴 THE TRAP: removing `workOrdersView` alone changes nothing. Four other permissions each grant
 * work-order visibility on their own — woPickParts, workOrderLinesCreateAndEdit, woTechViewMode
 * and scheduleView. Remove one and the test "fails" for a reason that is not the product.
 */
test('C45142 — no work-order access means no jobs in search @C45142', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
  const siblings = ['workOrdersView', 'woPickParts', 'workOrderLinesCreateAndEdit', 'woTechViewMode',
                    'scheduleView', 'woFullViewMode', 'woOrderParts', 'woReviewWorkOrders', 'workOrdersCreateAndEdit'];
  const strip = new Set(idsOf(siblings));
  await asTechnicianWith(baselineRole.fe_permissions.map((p: any) => p.id).filter((id: string) => !strip.has(id)));
  const p = await search(s.page, FIXTURE);
  // Staging cannot make a role with NO work-order permission at all - the view mode always adds its
  // own (see asTechnicianWith) - so this is the nearest such person, and the message says which.
  expect(p.counts['Work orders'] ?? 0, 'jobs are still shown to someone with no work-order access'
    + (implied.length ? ` (other than ${implied.join(', ')}, which staging adds to every role by its view mode)` : ''))
    .toBeFalsy();
});

test('C45144 — parts appear only with Catalog & Inventory access @C45144', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
  const all = baselineRole.fe_permissions.map((p: any) => p.id);
  const parts = idsOf(['catalogInventoryView'])[0];
  await asTechnicianWith(all.filter((id: string) => id !== parts));
  expect((await search(s.page, FIXTURE)).counts['Parts'] ?? 0, 'parts shown without access').toBeFalsy();
  await asTechnicianWith([...new Set([...all, parts])]);
  expect((await search(s.page, FIXTURE)).counts['Parts'] ?? 0, 'parts hidden with access granted').toBeGreaterThan(0);
});

test('C45146 — removing customer access removes customers AND vehicles @C45146', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
  const all = baselineRole.fe_permissions.map((p: any) => p.id);
  const cust = idsOf(['customersView'])[0];
  await asTechnicianWith(all.filter((id: string) => id !== cust));
  const p = await search(s.page, FIXTURE);
  expect(p.counts['Customers'] ?? 0, 'customers still shown').toBeFalsy();
  expect(p.counts['Assets'] ?? 0, 'vehicles still shown — they depend on customer access too').toBeFalsy();
});

test('C45147 — a time-clock-only person gets nothing at all @C45147', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
  await asTechnicianWith(idsOf(['timesheetsView']));
  const p = await search(s.page, FIXTURE);
  for (const [tab, v] of Object.entries(p.counts)) expect(v ?? 0, `${tab} returned results`).toBeFalsy();
});

/**
 * 🔴 THE TRAP that cost a false report: granting the part-sales permission alone shows NOTHING,
 * and that is correct. The roles screen itself refuses to grant it without See Financial Data —
 * "Part Sales requires See Financial Data. Enable it to grant this permission?" Writing the
 * permission straight to the role bypasses that guard and builds a role no person could create,
 * then judges the product by it. SV-10278 was withdrawn for exactly this.
 */
test('C45143 — a part-sales role sees part sales but not parts or suppliers @C45143', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
  // 🔴 THROUGH THE SAME SWITCH-AND-PROVE PATH AS EVERY OTHER CHECK. This one switched by hand and
  // never moved to the seeding shop, so it searched the technician's own shop and found no part
  // sales (staging, 2026-10-02). Done by hand the same role sees part sales and nothing else.
  // Positive control first: the admin must see part sales for this word, or a zero means nothing.
  await asAdmin();
  const adminView = await search(s.page, FIXTURE);
  test.skip(!(adminView.counts['Part sales'] ?? 0), `the admin sees no part sales for "${FIXTURE}" here, `
    + 'so a technician seeing none would say nothing');
  await asTechnicianWith(idsOf(['partSalesView', 'seeFinancialData']),
    { seeFinancialData: true });                                   // the guard the roles screen enforces
  const p = await search(s.page, FIXTURE);
  expect(p.counts['Part sales'] ?? 0, 'part sales hidden from a part-sales role').toBeGreaterThan(0);
  expect(p.counts['Parts'] ?? 0, 'parts shown to a part-sales-only role').toBeFalsy();
  expect(p.counts['Vendors'] ?? 0, 'suppliers shown to a part-sales-only role').toBeFalsy();
});

/**
 * SHOP SCOPING. Needs one job seeded at each shop; the test creates them if they are absent.
 * 🔴 Changing shop needs a FULL page reload afterwards — the name on screen comes from a cached
 * copy that a soft navigation does not refresh, which reads as the switch never happening.
 */
test.describe('shop scoping', () => {
  const unique = 'ZZSHOP' + Date.now().toString().slice(-5);
  let heavyJob = '', lethJob = '';

  test('C45151 · C45152 · C55684 — search is limited to the shop you are in, and follows you @C45151 @C45152 @C55684', async () => {
  test.skip(!baselineRole, 'this check edits the technician role, which does not exist on this '
    + 'environment. The same ground is covered without mutating anything by '
    + 'permissions-two-accounts.spec.ts, which compares a full-access person with a lower-permission one.');
    test.setTimeout(300_000);
    await asAdmin();
    // 🔴 SEEDED RECORDS, LOOKED UP - NEVER IDS COPIED FROM ONE BRANCH. These two ids were the QA
    // branch's; on staging both creates were refused and the check failed on "a job could not be
    // created at each shop". The vehicle is the seeded ZZLONGROW one (seed-manifest-e2e.json).
    const vrows = ((await api(s.page, 'GET', '/api/vehicles?search=ZZLRAST0000000001&limit=5')).body as any)?.data?.collection ?? [];
    const vrow = vrows.find((v: any) => v.vin === 'ZZLRAST0000000001');
    const veh = vrow?.id ?? '';
    // The vehicle list does not name its owner (companies: []), so the owner is found by its seeded
    // name. Proved on staging 2026-10-02: this pair creates a job at the seeding shop (201).
    const OWNER = 'ZZLONGROW Heavy Haulage And Trailer Repair Services Of Greater Fernvale 123786';
    const crows = ((await api(s.page, 'GET', `/api/customers?search=${encodeURIComponent(OWNER)}&limit=5`)).body as any)?.data?.collection ?? [];
    const company = crows.find((c: any) => c.name === OWNER)?.id ?? '';
    test.skip(!veh || !company, 'the seeded vehicle ZZLRAST0000000001 or its owner was not found - '
      + `run the seeding (npm run seed); vehicles found ${vrows.length}, owners found ${crows.length}`);
    for (const [wp, label] of [[HEAVY_DUTY, 'heavy'], [LETHBRIDGE, 'leth']] as const) {
      await api(s.page, 'POST', '/api/iam/change-location', { workplace_id: wp, workplace_timezone: 'America/Edmonton' });
      await s.page.waitForTimeout(1_500);
      const r = await api(s.page, 'POST', '/api/work-orders/create', {
        company_id: company, vehicle_id: veh, workplace_id: wp,
        start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true,   // required, or it is refused
      });
      const id = (r.body as any)?.data?.work_order_id;                              // 🔴 not `id`
      const v = await api(s.page, 'GET', `/api/work-orders/view/${id}`);
      const num = (v.body as any)?.data?.work_order?.number;
      if (label === 'heavy') heavyJob = num; else lethJob = num;
    }
    expect(heavyJob && lethJob, 'a job could not be created at each shop').toBeTruthy();
    await s.page.waitForTimeout(30_000);

    const readAt = async (wp: string) => {
      await api(s.page, 'POST', '/api/iam/change-location', { workplace_id: wp, workplace_timezone: 'America/Edmonton' });
      await s.page.waitForTimeout(1_500);
      await s.page.reload({ waitUntil: 'load' });          // 🔴 a soft navigation keeps the old shop
      await s.page.waitForTimeout(4_000);
      const own = await search(s.page, heavyJob.replace(/^\w-/, ''), 'Work orders');
      return rowsOf(own, 'Work orders');
    };
    const atHeavy = await readAt(HEAVY_DUTY);
    expect(contains(atHeavy, heavyJob), `the shop you are in does not show its own job ${heavyJob} `
      + `(searched "${heavyJob.replace(/^\w-/, '')}"; ${atHeavy.length} job row(s) came back: `
      + `${JSON.stringify(atHeavy.slice(0, 5).map((r) => String(r).slice(0, 40)))})`).toBe(true);
    const atLeth = await readAt(LETHBRIDGE);
    expect(contains(atLeth, heavyJob), 'the other shop\'s job is still returned after moving').toBe(false);
  });
});
