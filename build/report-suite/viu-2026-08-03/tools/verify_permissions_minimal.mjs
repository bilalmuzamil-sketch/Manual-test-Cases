// verify_permissions_minimal.mjs — the decisive POSITIVE half of the one-permission proof.
// Self-seeds (Rule 14) a throwaway custom role holding ONLY `reportsPageAccess`, assigns it to an
// ACTIVE staff member, impersonates them, probes all six reports' data + export endpoints, then
// RESTORES the staff member's original role and DELETES the throwaway role.
//
// This is what settles C30327 / C30391 / the whole one-permission question: does ONE ordinary
// reports access, with no other report-ish permission whatsoever, open every report and its export?
import fs from 'fs';
import { login, api } from './qa8582.mjs';

const OUT = new URL('../evidence/permissions/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const ROLE_NAME = 'ZZAUTOTEST Reports Only';

const PROBES = [
  ['SBC', '/api/reporting/reports/sales-by-customer?range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all',
    '/api/reporting/reports/sales-by-customer/export?format=csv&range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&variant=summary'],
  ['SBR', '/api/reporting/reports/sales-by-representative?range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&invoiceStatus=all',
    '/api/reporting/reports/sales-by-representative/export?format=csv&range=custom&start_date=2026-07-01&end_date=2026-08-03&productType=all&invoiceStatus=all&variant=summary'],
  ['PV', '/api/reporting/reports/parts-velocity?type=both&range=custom&start_date=2026-08-01&end_date=2026-08-03',
    '/api/reporting/reports/parts-velocity/export?format=csv&type=both&range=custom&start_date=2026-08-01&end_date=2026-08-03&locations=' + HD + '&search=BRAKECLEAN'],
  ['TU', '/api/reporting/reports/technician-utilization?range=custom&start_date=2026-08-01&end_date=2026-08-03',
    '/api/reporting/reports/technician-utilization/export?format=csv&range=custom&start_date=2026-08-01&end_date=2026-08-03&variant=summary'],
  ['WIP', '/api/reporting/reports/work-in-progress?from=2026-07-01T00:00:00.000Z&to=2026-08-03T23:59:59.999Z',
    '/api/reporting/reports/work-in-progress/export?format=csv&from=2026-07-01T00:00:00.000Z&to=2026-08-03T23:59:59.999Z&tab=ApprovedPartiallyCompleted&columns=wo_number,status,customer'],
  ['IV', '/api/reporting/reports/inventory-value?range=custom&start_date=2026-08-01&end_date=2026-08-03',
    '/api/reporting/reports/inventory-value/export?format=csv&range=custom&start_date=2026-08-01&end_date=2026-08-03&locations=' + HD + '&search=R134A'],
];

const log = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433', steps: [], cells: [] };
const step = (s, v) => { log.steps.push({ s, v }); console.log('*', s, typeof v === 'object' ? JSON.stringify(v).slice(0, 220) : (v ?? '')); };

let t = await login('admin');
if (t.status !== 200) { console.error('admin login failed'); process.exit(2); }

// ---- pick an ACTIVE staff member we can impersonate (switch-user 403s on inactive users) ----
const st = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
const staff = (st.body.data.collection || st.body.data);
const active = staff.filter(s => s.is_active === true && s.confirmed_invitation_on);
step('active staff available', active.length);

// probe which active users switch-user actually accepts, and remember their real role
let subject = null;
for (const s of active.slice(0, 12)) {
  t = await login('admin');
  const sw = await api(t.sessCookie, 'POST', '/api/switch-user', { user_id: s.id });
  const me = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  if (sw.status === 200 && me.body?.data?.template_slug && me.body.data.template_slug !== 'administrator') {
    subject = s; step('impersonable subject found', { email: s.email, role: s.role_label, slug: me.body.data.template_slug }); break;
  }
  if (sw.status === 200 && s.role_label === 'Admin') continue;   // administrator slug tells us nothing
}
t = await login('admin');
if (!subject) {
  // fall back: any active non-admin whose switch-user returned 200 at all
  for (const s of active) {
    t = await login('admin');
    const sw = await api(t.sessCookie, 'POST', '/api/switch-user', { user_id: s.id });
    if (sw.status === 200 && s.role_label !== 'Admin') { subject = s; step('fallback subject', { email: s.email, role: s.role_label }); break; }
  }
  t = await login('admin');
}
if (!subject) { step('NO IMPERSONABLE NON-ADMIN SUBJECT — cannot run the positive proof', null); fs.writeFileSync(OUT + 'minimal-role-proof.json', JSON.stringify(log, null, 2)); process.exit(0); }

const originalRoleId = subject.role_id, originalRoleLabel = subject.role_label;
log.subject = { email: subject.email, staff_id: subject.staff_id, user_id: subject.id, originalRoleId, originalRoleLabel };

// ---- create the throwaway role with ONLY reportsPageAccess ----
let roleId = null;
try {
  const mk = await api(t.sessCookie, 'POST', `/api/organizations/${ORG}/roles`,
    { label: ROLE_NAME, name: ROLE_NAME, fe_permissions: ['reportsPageAccess'] });
  step('create role', { status: mk.status, body: JSON.stringify(mk.body).slice(0, 300) });
  roleId = mk.body?.data?.id || mk.body?.data?.role?.id || null;
  if (!roleId) {   // find it by listing
    const rr = await api(t.sessCookie, 'GET', `/api/organizations/${ORG}/roles`);
    const found = (rr.body.data.collection || rr.body.data).find(r => (r.label || r.name) === ROLE_NAME);
    roleId = found?.id || null;
  }
  step('roleId', roleId);
  if (roleId) {
    const rd = await api(t.sessCookie, 'GET', '/api/roles/' + roleId);
    const atoms = (rd.body.data.fe_permissions || rd.body.data.fePermissions || []).map(p => typeof p === 'string' ? p : (p.code || p.name));
    log.throwawayRoleAtoms = atoms;
    step('throwaway role atoms (must be exactly [reportsPageAccess])', atoms);
  }
} catch (e) { step('create role threw', String(e).slice(0, 200)); }

if (roleId) {
  // ---- assign it to the subject ----
  const asg = await api(t.sessCookie, 'POST', `/api/staff/${subject.staff_id}/change`, {
    first_name: subject.first_name, last_name: subject.last_name, email: subject.email,
    role_id: roleId, workplace_id: subject.workplace_id || HD,
    job_title: subject.job_title, salary_type: subject.salary_type, salary: subject.salary,
    billable: subject.billable, clockable: subject.clockable });
  step('assign throwaway role', { status: asg.status, body: JSON.stringify(asg.body).slice(0, 200) });

  // ---- impersonate and probe ----
  t = await login('admin');
  const sw = await api(t.sessCookie, 'POST', '/api/switch-user', { user_id: subject.id });
  const me = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  const atoms = me.body?.data?.fe_permissions || [];
  log.observedAsSubject = { switchStatus: sw.status, meStatus: me.status, slug: me.body?.data?.template_slug, atoms };
  step('impersonated — observed atoms', atoms);
  if (sw.status === 200 && atoms.length && atoms.length <= 3 && atoms.includes('reportsPageAccess')) {
    for (const [rep, dq, eq] of PROBES) {
      const d = await api(t.sessCookie, 'GET', dq);
      const e = await api(t.sessCookie, 'GET', eq);
      const cell = { report: rep, dataStatus: d.status, exportStatus: e.status };
      if (d.status !== 200) cell.dataErr = JSON.stringify(d.body).slice(0, 120);
      if (e.status !== 200) cell.exportErr = JSON.stringify(e.body).slice(0, 120);
      log.cells.push(cell);
      console.log(`   ${rep.padEnd(4)} data=${d.status} export=${e.status}`, cell.dataErr || '', cell.exportErr || '');
    }
  } else step('atoms not as expected — POSITIVE PROOF NOT VERIFIED', atoms);

  // ---- RESTORE (always) ----
  t = await login('admin');
  const res = await api(t.sessCookie, 'POST', `/api/staff/${subject.staff_id}/change`, {
    first_name: subject.first_name, last_name: subject.last_name, email: subject.email,
    role_id: originalRoleId, workplace_id: subject.workplace_id || HD,
    job_title: subject.job_title, salary_type: subject.salary_type, salary: subject.salary,
    billable: subject.billable, clockable: subject.clockable });
  step('RESTORE original role ' + originalRoleLabel, res.status);
  const del = await api(t.sessCookie, 'DELETE', `/api/roles/${roleId}`);
  step('DELETE throwaway role', del.status);
  const verify = await api(t.sessCookie, 'GET', '/api/staff?limit=300');
  const back = (verify.body.data.collection || verify.body.data).find(s => s.staff_id === subject.staff_id);
  step('VERIFY restored role_label', back?.role_label);
  const rlist = await api(t.sessCookie, 'GET', `/api/organizations/${ORG}/roles`);
  step('VERIFY throwaway role gone', !(rlist.body.data.collection || rlist.body.data).some(r => (r.label || r.name) === ROLE_NAME));
}

t = await login('admin');
step('final admin session', (await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions')).body?.data?.template_slug);
fs.writeFileSync(OUT + 'minimal-role-proof.json', JSON.stringify(log, null, 2));
console.log('wrote', OUT + 'minimal-role-proof.json');
