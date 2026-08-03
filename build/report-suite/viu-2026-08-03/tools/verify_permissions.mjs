// verify_permissions.mjs — LIVE per-role verification of the ONE-PERMISSION model
// (Chris Ward Q2=A + the QA lead's 2026-08-03 ruling "all the reports will be gated by ONE
// permission FOR NOW"), against every role on the sv8582 QA branch.
//
// Method (CLAUDE.md Rule 27, playbook §G): impersonate a real holder of each role with
// POST /api/switch-user {user_id}, read GET /api/auth/me/fe-permissions to confirm WHO we are,
// then hit each report's DATA endpoint and its EXPORT endpoint and record the status.
// Rule 12: every cell is an observed HTTP status, never inferred.
// End with a fresh admin login so the shared session is left clean.
import fs from 'fs';
import { login, api } from './qa8582.mjs';

const OUT = new URL('../evidence/permissions/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const PROBES = [
  { rep: 'SBC', data: '/api/reporting/reports/sales-by-customer?range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all',
    exp: '/api/reporting/reports/sales-by-customer/export?format=csv&range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&variant=summary' },
  { rep: 'SBR', data: '/api/reporting/reports/sales-by-representative?range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&invoiceStatus=all',
    exp: '/api/reporting/reports/sales-by-representative/export?format=csv&range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&invoiceStatus=all&variant=summary' },
  { rep: 'PV',  data: '/api/reporting/reports/parts-velocity?type=both&range=custom&start_date=2026-08-01&end_date=2026-08-03',
    exp: '/api/reporting/reports/parts-velocity/export?format=csv&type=both&range=custom&start_date=2026-08-01&end_date=2026-08-03&locations=' + HD + '&search=BRAKECLEAN' },
  { rep: 'TU',  data: '/api/reporting/reports/technician-utilization?range=custom&start_date=2026-08-01&end_date=2026-08-03',
    exp: '/api/reporting/reports/technician-utilization/export?format=csv&range=custom&start_date=2026-08-01&end_date=2026-08-03&variant=summary' },
  { rep: 'WIP', data: '/api/reporting/reports/work-in-progress?from=2026-07-01T00:00:00.000Z&to=2026-08-03T23:59:59.999Z',
    exp: '/api/reporting/reports/work-in-progress/export?format=csv&from=2026-07-01T00:00:00.000Z&to=2026-08-03T23:59:59.999Z&tab=ApprovedPartiallyCompleted&columns=wo_number,status,customer' },
  { rep: 'IV',  data: '/api/reporting/reports/inventory-value?range=custom&start_date=2026-08-01&end_date=2026-08-03',
    exp: '/api/reporting/reports/inventory-value/export?format=csv&range=custom&start_date=2026-08-01&end_date=2026-08-03&locations=' + HD + '&search=R134A' },
];

let t = await login('admin');
if (t.status !== 200) { console.error('admin login failed'); process.exit(2); }

// --- 1. enumerate every role and whether it holds reportsPageAccess ---
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const rr = await api(t.sessCookie, 'GET', `/api/organizations/${ORG}/roles`);
const roles = rr.body.data.collection || rr.body.data;
const roleInfo = [];
for (const r of roles) {
  const d = await api(t.sessCookie, 'GET', '/api/roles/' + r.id);
  const perms = (d.body.data.fe_permissions || d.body.data.fePermissions || [])
    .map(p => typeof p === 'string' ? p : (p.code || p.name));
  roleInfo.push({ id: r.id, label: r.label || r.name, atomCount: perms.length,
    hasReportsPageAccess: perms.includes('reportsPageAccess'),
    reportAtoms: perms.filter(p => /report/i.test(p)) });
}
console.log('=== ROLES (' + roleInfo.length + ') ===');
for (const r of roleInfo) console.log(' ', r.label.padEnd(24), 'atoms=' + String(r.atomCount).padStart(2),
  '| reportsPageAccess=' + (r.hasReportsPageAccess ? 'YES' : 'no '), '| report atoms:', JSON.stringify(r.reportAtoms));

// --- 2. one live holder per role ---
const st = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
const staff = st.body.data.collection || st.body.data;
const holders = {};
for (const s of staff) if (!holders[s.role_label] && s.is_active !== false) holders[s.role_label] = s;
for (const s of staff) if (!holders[s.role_label]) holders[s.role_label] = s;   // fall back to inactive

const matrix = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433',
  atomCatalogueReportAtoms: ['reportsPageAccess'], roles: roleInfo, cells: [] };

for (const r of roleInfo) {
  const h = holders[r.label];
  if (!h) { console.log('\n### ' + r.label + ' — NO HOLDER FOUND (cannot impersonate)'); matrix.cells.push({ role: r.label, error: 'no holder' }); continue; }
  // fresh admin session, then impersonate
  t = await login('admin');
  const sw = await api(t.sessCookie, 'POST', '/api/switch-user', { user_id: h.id });
  const me = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  const asAtoms = (me.body?.data?.fe_permissions) || [];
  const asSlug = me.body?.data?.template_slug;
  const row = { role: r.label, holder: h.email, switchStatus: sw.status, meStatus: me.status,
    observedTemplateSlug: asSlug, observedAtomCount: asAtoms.length,
    observedReportsPageAccess: asAtoms.includes('reportsPageAccess'), probes: [] };
  console.log(`\n### ${r.label}  (holder ${h.email}) switch=${sw.status} me=${me.status} slug=${asSlug} atoms=${asAtoms.length} reportsPageAccess=${asAtoms.includes('reportsPageAccess')}`);
  if (sw.status === 200 && me.status === 200 && asSlug) {
    for (const p of PROBES) {
      const d = await api(t.sessCookie, 'GET', p.data);
      const e = await api(t.sessCookie, 'GET', p.exp);
      const cell = { report: p.rep, dataStatus: d.status, exportStatus: e.status };
      if (d.status !== 200) cell.dataErr = JSON.stringify(d.body).slice(0, 110);
      if (e.status !== 200) cell.exportErr = JSON.stringify(e.body).slice(0, 110);
      row.probes.push(cell);
      console.log(`    ${p.rep.padEnd(4)} data=${d.status}  export=${e.status}`, cell.dataErr || '', cell.exportErr || '');
    }
  } else { row.note = 'impersonation did not take — cell NOT VERIFIED'; console.log('    impersonation did not take — NOT VERIFIED'); }
  matrix.cells.push(row);
}

// leave the shared session clean
t = await login('admin');
const back = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
console.log('\nrestored admin session:', back.status, back.body?.data?.template_slug);
fs.writeFileSync(OUT + 'permission-matrix.json', JSON.stringify(matrix, null, 2));
console.log('wrote', OUT + 'permission-matrix.json');
