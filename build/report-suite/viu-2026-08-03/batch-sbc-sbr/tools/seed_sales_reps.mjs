// seed_sales_reps.mjs — make extra Sales Reps exist so the Sales By Representative report has
// MORE THAN ONE rep row, an inactive rep, and unassigned invoices (Rule 14: seed, never block).
//
// Mechanism proven live 2026-08-04: a staff member becomes selectable as a Sales Rep when
// `is_sales_rep: true` is set through `POST /api/staff/{staff_id}/change`; `GET /api/sales-reps`
// then lists them. Every original payload is snapshotted to /tmp so `--restore` puts it all back.
//
// Usage:
//   node seed_sales_reps.mjs --plan            list candidates, write the snapshot, change nothing
//   node seed_sales_reps.mjs --apply N         flag the first N active candidates as sales reps
//   node seed_sales_reps.mjs --restore         restore every snapshotted staff record
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const SNAP = '/tmp/report-suite-viu/seed-salesreps-snapshot.json';
const mode = process.argv.find(a => a.startsWith('--')) || '--plan';
const n = parseInt(process.argv[process.argv.indexOf('--apply') + 1] || '3', 10);
const { sessCookie } = await login('admin');

// The staff-change endpoint needs the whole record echoed back or it clobbers fields.
function changeBody(s, over = {}) {
  return {
    first_name: s.first_name, last_name: s.last_name, email: s.email,
    role_id: s.role_id, workplace_id: s.workplace_id,
    job_title: s.job_title, salary_type: s.salary_type, salary: s.salary,
    billable: s.billable, clockable: s.clockable,
    is_sales_rep: s.is_sales_rep, departments: (s.departments || []).map(d => d.id || d),
    ...over,
  };
}

const st = await api(sessCookie, 'GET', '/api/staff?limit=300');
const staff = st.body.data.collection || [];
const before = await api(sessCookie, 'GET', '/api/sales-reps');
console.log('sales-reps BEFORE:', JSON.stringify(before.body.data.collection));

if (mode === '--restore') {
  if (!fs.existsSync(SNAP)) { console.log('no snapshot to restore'); process.exit(0); }
  const snap = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  for (const s of snap) {
    const r = await api(sessCookie, 'POST', `/api/staff/${s.staff_id}/change`, changeBody(s));
    console.log('RESTORE', s.first_name, s.last_name, '->', r.status,
      r.status >= 400 ? JSON.stringify(r.body).slice(0, 200) : '');
  }
  const after = await api(sessCookie, 'GET', '/api/sales-reps');
  console.log('sales-reps AFTER RESTORE:', JSON.stringify(after.body.data.collection));
  process.exit(0);
}

// Candidates: active, confirmed, not already a rep, AND already carrying a workplace_id —
// the change endpoint rejects a null workplace_id ("Missing required parameter"), and inventing
// one would alter a record we then could not restore faithfully.
const cands = staff.filter(s => s.is_active && s.confirmed_invitation_on && !s.is_sales_rep && s.workplace_id);
console.log('active confirmed candidates:', cands.length);
cands.slice(0, 8).forEach(s => console.log('  ', s.first_name, s.last_name, '|', s.role_label,
  '| staff_id', s.staff_id, '| wp', s.defaultWorkplaceName));

if (mode === '--plan') { console.log('\nPLAN ONLY — nothing changed.'); process.exit(0); }

const picked = cands.slice(0, n);
fs.writeFileSync(SNAP, JSON.stringify(picked, null, 1));
console.log('\nsnapshot written to', SNAP, '(', picked.length, 'records )');
for (const s of picked) {
  const r = await api(sessCookie, 'POST', `/api/staff/${s.staff_id}/change`, changeBody(s, { is_sales_rep: true }));
  console.log('FLAG', s.first_name, s.last_name, '->', r.status,
    r.status >= 400 ? JSON.stringify(r.body).slice(0, 250) : '');
}
const after = await api(sessCookie, 'GET', '/api/sales-reps');
console.log('sales-reps AFTER:', JSON.stringify(after.body.data.collection));
