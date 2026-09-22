import { test, expect } from 'playwright/test';
import { signIn, buildMarker, api, type Session } from '../fixtures/auth.js';
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

let s: Session;
let baselinePerms: string[] = [];
let baselineRole: any = null;
let techStaffId = '';
let adminStaffId = '';

test.beforeAll(async () => {
  s = await signIn('/customers');
  console.log('build under test:', await buildMarker(s.page));
  const role = await api(s.page, 'GET', `/api/roles/${TECH_ROLE}`);
  baselineRole = (role.body as any)?.data;
  baselinePerms = baselineRole.fe_permissions.map((p: any) => p.code).sort();
  console.log('technician baseline:', baselinePerms.join(','));
  const staff = ((await api(s.page, 'GET', '/api/staff?limit=250')).body as any)?.data?.collection ?? [];
  techStaffId = staff.find((x: any) => x.is_active && /Brandi/i.test(x.first_name ?? ''))?.id ?? '';
  adminStaffId = staff.find((x: any) => x.is_active && /admin/i.test((x.role_label ?? '') + (x.first_name ?? '')))?.id ?? '';
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

const idsOf = (codes: string[]) =>
  baselineRole.fe_permissions.filter((p: any) => codes.includes(p.code)).map((p: any) => p.id);

async function asTechnicianWith(permissionIds: string[]) {
  await api(s.page, 'POST', '/api/switch-user', { user_id: adminStaffId });
  await s.page.waitForTimeout(800);
  await api(s.page, 'PUT', `/api/roles/${TECH_ROLE}`, { ...baselineRole, fe_permissions: permissionIds });
  await api(s.page, 'POST', '/api/switch-user', { user_id: techStaffId });
  await s.page.waitForTimeout(1_000);
  await s.page.goto('/customers', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(3_000);
}

/**
 * 🔴 THE TRAP: removing `workOrdersView` alone changes nothing. Four other permissions each grant
 * work-order visibility on their own — woPickParts, workOrderLinesCreateAndEdit, woTechViewMode
 * and scheduleView. Remove one and the test "fails" for a reason that is not the product.
 */
test('C45142 — no work-order access means no jobs in search', async () => {
  const siblings = ['workOrdersView', 'woPickParts', 'workOrderLinesCreateAndEdit', 'woTechViewMode',
                    'scheduleView', 'woFullViewMode', 'woOrderParts', 'woReviewWorkOrders', 'workOrdersCreateAndEdit'];
  const strip = new Set(idsOf(siblings));
  await asTechnicianWith(baselineRole.fe_permissions.map((p: any) => p.id).filter((id: string) => !strip.has(id)));
  const p = await search(s.page, 'ZZAUTOTEST');
  expect(p.counts['Work orders'] ?? 0, 'jobs are still shown to someone with no work-order access').toBeFalsy();
});

test('C45144 — parts appear only with Catalog & Inventory access', async () => {
  const all = baselineRole.fe_permissions.map((p: any) => p.id);
  const parts = idsOf(['catalogInventoryView'])[0];
  await asTechnicianWith(all.filter((id: string) => id !== parts));
  expect((await search(s.page, 'ZZAUTOTEST')).counts['Parts'] ?? 0, 'parts shown without access').toBeFalsy();
  await asTechnicianWith([...new Set([...all, parts])]);
  expect((await search(s.page, 'ZZAUTOTEST')).counts['Parts'] ?? 0, 'parts hidden with access granted').toBeGreaterThan(0);
});

test('C45146 — removing customer access removes customers AND vehicles', async () => {
  const all = baselineRole.fe_permissions.map((p: any) => p.id);
  const cust = idsOf(['customersView'])[0];
  await asTechnicianWith(all.filter((id: string) => id !== cust));
  const p = await search(s.page, 'ZZAUTOTEST');
  expect(p.counts['Customers'] ?? 0, 'customers still shown').toBeFalsy();
  expect(p.counts['Assets'] ?? 0, 'vehicles still shown — they depend on customer access too').toBeFalsy();
});

test('C45147 — a time-clock-only person gets nothing at all', async () => {
  await asTechnicianWith(idsOf(['timesheetsView']));
  const p = await search(s.page, 'ZZAUTOTEST');
  for (const [tab, v] of Object.entries(p.counts)) expect(v ?? 0, `${tab} returned results`).toBeFalsy();
});

/**
 * 🔴 THE TRAP that cost a false report: granting the part-sales permission alone shows NOTHING,
 * and that is correct. The roles screen itself refuses to grant it without See Financial Data —
 * "Part Sales requires See Financial Data. Enable it to grant this permission?" Writing the
 * permission straight to the role bypasses that guard and builds a role no person could create,
 * then judges the product by it. SV-10278 was withdrawn for exactly this.
 */
test('C45143 — a part-sales role sees part sales but not parts or suppliers', async () => {
  await api(s.page, 'POST', '/api/switch-user', { user_id: adminStaffId });
  await s.page.waitForTimeout(800);
  await api(s.page, 'PUT', `/api/roles/${TECH_ROLE}`, {
    ...baselineRole,
    fe_permissions: idsOf(['partSalesView']),
    cross_toggles: { ...baselineRole.cross_toggles, seeFinancialData: true },  // the guard the screen enforces
  });
  await api(s.page, 'POST', '/api/switch-user', { user_id: techStaffId });
  await s.page.waitForTimeout(1_000);
  await s.page.goto('/customers', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(3_000);
  const p = await search(s.page, 'ZZAUTOTEST');
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

  test('C45151 · C45152 · C55684 — search is limited to the shop you are in, and follows you', async () => {
    test.setTimeout(300_000);
    const veh = '14a069cd-4846-4a57-835a-05f4b32649a8';
    const company = 'e049c07d-9b16-4f95-9e01-71da22e1104a';
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
    expect(contains(atHeavy, heavyJob), 'the shop you are in does not show its own job').toBe(true);
    const atLeth = await readAt(LETHBRIDGE);
    expect(contains(atLeth, heavyJob), 'the other shop\'s job is still returned after moving').toBe(false);
  });
});
