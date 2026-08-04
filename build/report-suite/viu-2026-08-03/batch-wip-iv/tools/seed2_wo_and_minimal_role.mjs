// seed2_wo_and_minimal_role.mjs
// (1) cleans up the stray WO left by the first seeding run (the create response returns
//     {data:{work_order_id}} - not {data:{id}} - which is why the first pass could not delete it)
// (2) seeds an IN PROGRESS work order so WIP S3-R3's In-Progress half can be observed, then deletes it
// (3) Rule 14 positive permission subject: temporarily grants the Foreman holder a role that DOES
//     hold reportsPageAccess, impersonates, observes 200 on both reports, then RESTORES the role
//     and verifies the restore.
// SECRET-FREE. Usage: NODE_USE_ENV_PROXY=1 node seed2_wo_and_minimal_role.mjs <outJson>
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/seed2.json';
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const W = '/api/reporting/reports/work-in-progress';
const I = '/api/reporting/reports/inventory-value';
const WY = 'from=2025-08-05T00:00:00.000Z&to=2026-08-04T23:59:59.999Z';
const IVR = 'range=custom&start_date=2026-08-01&end_date=2026-08-04';
const R = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

let { sessCookie: S } = await login('admin');
const g = p => api(S, 'GET', p);
const post = (p, b) => api(S, 'POST', p, b);

// ---------- (1) clean up the stray WO ----------
const STRAY = '152a0d40-4bb3-403d-88c5-f87afe604ece';
{
  const del = await post('/api/work-orders/delete', { work_order_id: STRAY });
  R.strayCleanup = { id: STRAY, deleteStatus: del.status, body: JSON.stringify(del.body).slice(0, 200) };
  const chk = await g(`${W}?${WY}&locations=${HD}`);
  R.strayCleanup.stillInWip = (chk.body?.data?.collection ?? []).some(x => x.work_order_id === STRAY);
  console.log('stray cleanup', R.strayCleanup.deleteStatus, 'stillInWip', R.strayCleanup.stillInWip);
}

// ---------- (2) seed an IN PROGRESS work order ----------
R.inProgress = {};
{
  const cust = await g('/api/customers?limit=1');
  const cid = cust.body?.data?.collection?.[0]?.id;
  const veh = await g(`/api/vehicles?company_id=${cid}`);
  const vid = veh.body?.data?.collection?.[0]?.id ?? veh.body?.data?.[0]?.id;
  const cr = await post('/api/work-orders/create', { company_id: cid, vehicle_id: vid, workplace_id: HD,
    start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true });
  const woId = cr.body?.data?.work_order_id ?? cr.body?.data?.id ?? null;
  R.inProgress.create = { status: cr.status, woId };
  if (woId) {
    // add an authorized canned line so there is approved work to value (proven recipe, playbook §N)
    const canned = await g('/api/canned-lines?limit=3');
    const cannedId = canned.body?.data?.collection?.[0]?.id ?? null;
    R.inProgress.cannedLookup = { status: canned.status, cannedId };
    if (cannedId) {
      const ln = await post('/api/work-orders/lines/create', { canned_line_id: cannedId, work_order_id: woId, status: 'authorized' });
      R.inProgress.lineCreate = { status: ln.status, body: JSON.stringify(ln.body).slice(0, 250) };
    }
    // discover the status-change contract by probing
    R.inProgress.statusProbes = [];
    for (const [path, body] of [
      ['/api/work-orders/change-status', {}],
      ['/api/work-orders/status', {}],
      ['/api/work-orders/update', {}],
      ['/api/work-orders/change', {}],
    ]) {
      const r = await post(path, body);
      R.inProgress.statusProbes.push({ path, status: r.status, body: JSON.stringify(r.body).slice(0, 400) });
    }
    const wip = await g(`${W}?${WY}&locations=${HD}`);
    const row = (wip.body?.data?.collection ?? []).find(x => x.work_order_id === woId);
    R.inProgress.wipRow = row ?? null;
    const del = await post('/api/work-orders/delete', { work_order_id: woId });
    R.inProgress.deleteStatus = del.status;
    const after = await g(`${W}?${WY}&locations=${HD}`);
    R.inProgress.goneAfterDelete = !(after.body?.data?.collection ?? []).some(x => x.work_order_id === woId);
    console.log('in-progress seed: created', woId, 'wipRow', row ? `${row.status}/${row.tab}` : 'none',
      'deleted', del.status, 'gone', R.inProgress.goneAfterDelete);
  }
}

// ---------- (3) minimal POSITIVE permission subject ----------
R.minimalRole = {};
{
  const roles = await g(`/api/organizations/${ORG}/roles`);
  const list = roles.body?.data?.collection ?? roles.body?.data ?? [];
  R.minimalRole.rolesSeen = (Array.isArray(list) ? list : []).map(x => ({ id: x.id, name: x.name ?? x.label, slug: x.template_slug ?? x.slug }));
  // pick the role with the FEWEST permissions that still holds reportsPageAccess
  const detail = [];
  for (const r of R.minimalRole.rolesSeen) {
    const d = await g(`/api/roles/${r.id}`);
    const perms = d.body?.data?.permissions ?? d.body?.data?.fe_permissions ?? [];
    const names = Array.isArray(perms) ? perms.map(p => (typeof p === 'string' ? p : (p.code ?? p.name))) : [];
    detail.push({ ...r, count: names.length, hasReports: names.includes('reportsPageAccess') });
  }
  R.minimalRole.roleDetail = detail;
  const target = detail.filter(x => x.hasReports).sort((a, b) => a.count - b.count)[0] ?? null;
  R.minimalRole.chosen = target;
  console.log('roles holding reportsPageAccess:', JSON.stringify(detail.filter(x => x.hasReports).map(x => `${x.name}(${x.count})`)));

  const staff = await g('/api/staff?limit=300');
  const all = staff.body?.data?.collection ?? [];
  const subj = all.find(s => s.is_active && s.confirmed_invitation_on && s.role_label === 'Foreman');
  R.minimalRole.subject = subj ? { email: subj.email, staff_id: subj.staff_id, id: subj.id, origRole: subj.role_id, origWp: subj.workplace_id } : null;

  if (subj && target) {
    const change = await post(`/api/staff/${subj.staff_id}/change`, {
      first_name: subj.first_name, last_name: subj.last_name, email: subj.email,
      role_id: target.id, workplace_id: subj.workplace_id,
      job_title: subj.job_title ?? '', salary_type: subj.salary_type ?? 'hourly',
      salary: subj.salary ?? 0, billable: subj.billable ?? 0, clockable: subj.clockable ?? 0 });
    R.minimalRole.grant = { status: change.status, body: JSON.stringify(change.body).slice(0, 250) };
    if (change.status < 300) {
      const sw = await post('/api/switch-user', { user_id: subj.id });
      const fe = await g('/api/auth/me/fe-permissions');
      const atoms = fe.body?.data?.fe_permissions ?? [];
      const wr = await g(`${W}?${WY}&locations=${HD}`);
      const ir = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=3`);
      const wx = await g(`${W}/export?format=csv&${WY}&tab=Completed&columns=wo_number,total&locations=${HD}`);
      const ix = await g(`${I}/export?format=csv&${IVR}&locations=${HD}&search=W4707QP`);
      R.minimalRole.observed = { switchStatus: sw.status, template_slug: fe.body?.data?.template_slug,
        atomCount: atoms.length, hasReportsPageAccess: atoms.includes('reportsPageAccess'),
        atoms, wip: wr.status, wipRows: wr.body?.data?.collection?.length ?? null,
        iv: ir.status, ivRows: ir.body?.data?.pagination?.rowsNumber ?? null,
        wipExport: wx.status, ivExport: ix.status,
        accessibleWorkplaces: (await g('/api/staff/my-workplaces')).body?.data?.map?.(x => x.name)
          ?? (await g('/api/staff/my-workplaces')).body?.data?.collection?.map?.(x => x.name) ?? null };
      console.log('POSITIVE subject:', R.minimalRole.observed.template_slug, 'atoms', R.minimalRole.observed.atomCount,
        'reportsPageAccess', R.minimalRole.observed.hasReportsPageAccess,
        '| WIP', R.minimalRole.observed.wip, '| IV', R.minimalRole.observed.iv,
        '| WIPexp', R.minimalRole.observed.wipExport, '| IVexp', R.minimalRole.observed.ivExport);
    }
    // ---- RESTORE, always, and verify ----
    ({ sessCookie: S } = await login('admin'));
    const back = await post(`/api/staff/${subj.staff_id}/change`, {
      first_name: subj.first_name, last_name: subj.last_name, email: subj.email,
      role_id: subj.role_id, workplace_id: subj.workplace_id,
      job_title: subj.job_title ?? '', salary_type: subj.salary_type ?? 'hourly',
      salary: subj.salary ?? 0, billable: subj.billable ?? 0, clockable: subj.clockable ?? 0 });
    const verify = await g('/api/staff?limit=300');
    const now = (verify.body?.data?.collection ?? []).find(s => s.staff_id === subj.staff_id);
    R.minimalRole.restore = { status: back.status, roleNow: now?.role_label, roleIdNow: now?.role_id,
      matchesOriginal: now?.role_id === subj.role_id };
    console.log('RESTORE', R.minimalRole.restore.status, 'roleNow', R.minimalRole.restore.roleNow,
      'matchesOriginal', R.minimalRole.restore.matchesOriginal);
  }
}

({ sessCookie: S } = await login('admin'));
R.finalWhoAmI = (await g('/api/auth/me/fe-permissions')).body?.data?.template_slug;
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT, '| final identity', R.finalWhoAmI);
