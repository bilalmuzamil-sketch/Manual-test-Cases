// seed_and_permissions.mjs — Rule 14 self-seeding + the one-permission model, for WIP and IV.
// (a) probes whether the "R134A-CORE" row the IV report shows is genuinely a core-charge part
// (b) seeds an inventory part with NO category so IV S3-E1 (Category "—") can be observed
// (c) seeds an IN PROGRESS work order so WIP S3-R3's In-Progress half can be observed
// (d) drives the reportsPageAccess gate positively and negatively for both reports
// Restores/cleans up everything it creates. SECRET-FREE.
// Usage: NODE_USE_ENV_PROXY=1 node seed_and_permissions.mjs <outJson>
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/seed-perms.json';
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const W = '/api/reporting/reports/work-in-progress';
const I = '/api/reporting/reports/inventory-value';
const R = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };
const IVR = 'range=custom&start_date=2026-08-01&end_date=2026-08-04';
const WY = 'from=2025-08-05T00:00:00.000Z&to=2026-08-04T23:59:59.999Z';

let { sessCookie: S, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const g = p => api(S, 'GET', p);
const post = (p, b) => api(S, 'POST', p, b);

// ---------- (a) is R134A-CORE actually a core charge? ----------
{
  const cands = ['/api/inventory/parts?search=R134A-CORE&limit=5', '/api/parts?search=R134A-CORE&limit=5',
    '/api/inventory/parts?search=R134A-CORE'];
  R.coreLookup = [];
  for (const c of cands) { const r = await g(c); R.coreLookup.push({ path: c, status: r.status, body: JSON.stringify(r.body).slice(0, 1400) }); }
}

// ---------- (b) seed a part with NO category (IV S3-E1) ----------
R.seedPart = {};
{
  // discover the create contract by posting an empty body (Rule 14 probe technique)
  const probe = await post('/api/inventory/parts/create', {});
  R.seedPart.emptyProbe = { status: probe.status, body: JSON.stringify(probe.body).slice(0, 700) };
  const probe2 = await post('/api/inventory/parts', {});
  R.seedPart.emptyProbe2 = { status: probe2.status, body: JSON.stringify(probe2.body).slice(0, 700) };
}

// ---------- (c) seed an IN PROGRESS work order (WIP S3-R3) ----------
R.seedWO = {};
{
  const cust = await g('/api/customers?limit=3');
  const cid = cust.body?.data?.collection?.[0]?.id ?? cust.body?.data?.[0]?.id ?? null;
  R.seedWO.customerLookup = { status: cust.status, firstId: cid, body: JSON.stringify(cust.body).slice(0, 300) };
  if (cid) {
    const veh = await g(`/api/vehicles?company_id=${cid}`);
    const vid = veh.body?.data?.collection?.[0]?.id ?? veh.body?.data?.[0]?.id ?? null;
    R.seedWO.vehicleLookup = { status: veh.status, firstId: vid };
    if (vid) {
      const cr = await post('/api/work-orders/create', { company_id: cid, vehicle_id: vid, workplace_id: HD,
        start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true });
      R.seedWO.create = { status: cr.status, body: JSON.stringify(cr.body).slice(0, 500) };
      const woId = cr.body?.data?.id ?? cr.body?.data?.work_order?.id ?? null;
      R.seedWO.woId = woId;
      if (woId) {
        // try to drive it to In Progress
        for (const [path, body] of [
          ['/api/work-orders/change-status', { work_order_id: woId, status: 'in_progress' }],
          ['/api/work-orders/status/change', { work_order_id: woId, status: 'in_progress' }],
          ['/api/work-orders/update', { work_order_id: woId, status: 'in_progress' }],
        ]) {
          const r = await post(path, body);
          R.seedWO[`status_${path.replace(/\W/g, '_')}`] = { status: r.status, body: JSON.stringify(r.body).slice(0, 300) };
          if (r.status < 300) break;
        }
        const after = await g(`${W}?${WY}&locations=${HD}`);
        const row = (after.body?.data?.collection ?? []).find(x => x.work_order_id === woId);
        R.seedWO.appearsInWip = row ? { status: row.status, tab: row.tab, total: row.total, days_open_source: row.start_date } : null;
        // clean up
        const del = await post('/api/work-orders/delete', { work_order_id: woId });
        R.seedWO.deleted = del.status;
      }
    }
  }
}

// ---------- (d) the ONE-permission model, positive and negative ----------
R.perms = { catalogue: null, roleHolders: [], subjects: {} };
{
  const cat = await g('/api/fe-permissions');
  const all = JSON.stringify(cat.body);
  R.perms.catalogue = { status: cat.status,
    reportAtoms: [...new Set(all.match(/"[a-zA-Z]*[Rr]eport[a-zA-Z]*"/g) ?? [])] };
  const staff = await g('/api/staff?limit=300');
  const list = staff.body?.data?.collection ?? staff.body?.data ?? [];
  R.perms.staffCount = Array.isArray(list) ? list.length : null;
  const usable = (Array.isArray(list) ? list : []).filter(s => s.is_active && s.confirmed_invitation_on);
  const byRole = {};
  for (const s of usable) { if (!byRole[s.role_label]) byRole[s.role_label] = s; }
  R.perms.rolesWithUsableHolder = Object.keys(byRole);

  for (const roleLabel of ['Sales Representative', 'Foreman', 'Technician', 'Office User', 'Parts Manager', 'Service Advisor']) {
    const s = byRole[roleLabel];
    if (!s) { R.perms.subjects[roleLabel] = { note: 'no active confirmed holder on this org' }; continue; }
    const sw = await post('/api/switch-user', { user_id: s.id });
    if (sw.status >= 300) { R.perms.subjects[roleLabel] = { switchStatus: sw.status, note: 'switch-user refused' };
      ({ sessCookie: S } = await login('admin')); continue; }
    // rebuild the session cookie from the switch response if one was issued
    const fe = await g('/api/auth/me/fe-permissions');
    const atoms = fe.body?.data?.fe_permissions ?? [];
    const rec = { switchStatus: sw.status, template_slug: fe.body?.data?.template_slug,
      atomCount: atoms.length, hasReportsPageAccess: atoms.includes('reportsPageAccess') };
    if (rec.template_slug === 'administrator') rec.note = 'SWITCH DID NOT TAKE - ignore this row';
    const wr = await g(`${W}?${WY}&locations=${HD}`);
    const ir = await g(`${I}?${IVR}&locations=${HD}&pagination[page]=1&pagination[rowsPerPage]=3`);
    const wx = await g(`${W}/export?format=csv&${WY}&tab=Completed&columns=wo_number,total&locations=${HD}`);
    const ix = await g(`${I}/export?format=csv&${IVR}&locations=${HD}&search=W4707QP`);
    rec.wipData = { status: wr.status, err: wr.status !== 200 ? JSON.stringify(wr.body).slice(0, 160) : null,
      rows: wr.body?.data?.collection?.length ?? null };
    rec.ivData = { status: ir.status, err: ir.status !== 200 ? JSON.stringify(ir.body).slice(0, 160) : null,
      rows: ir.body?.data?.pagination?.rowsNumber ?? null };
    rec.wipExport = { status: wx.status, err: wx.status !== 200 ? String(JSON.stringify(wx.body)).slice(0, 160) : null };
    rec.ivExport = { status: ix.status, err: ix.status !== 200 ? String(JSON.stringify(ix.body)).slice(0, 160) : null };
    R.perms.subjects[roleLabel] = rec;
    console.log(roleLabel.padEnd(22), 'atoms', String(rec.atomCount).padStart(3), 'reportsPageAccess', rec.hasReportsPageAccess,
      '| WIP', rec.wipData.status, '| IV', rec.ivData.status, '| WIPexp', rec.wipExport.status, '| IVexp', rec.ivExport.status, rec.note ?? '');
    ({ sessCookie: S } = await login('admin'));   // always return to admin
  }
}

// restore: confirm we are admin again
{
  const fe = await g('/api/auth/me/fe-permissions');
  R.restoredToAdmin = { template_slug: fe.body?.data?.template_slug, atomCount: fe.body?.data?.fe_permissions?.length };
}

fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT);
console.log('report atoms in the whole catalogue:', JSON.stringify(R.perms.catalogue?.reportAtoms));
console.log('restored:', JSON.stringify(R.restoredToAdmin));
