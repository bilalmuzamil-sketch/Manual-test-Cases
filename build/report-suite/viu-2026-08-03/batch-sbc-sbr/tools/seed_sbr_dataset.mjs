// seed_sbr_dataset.mjs — build a REAL multi-rep dataset for the Sales By Representative report so
// every rep-row / badge / unassigned / deactivation case can be observed live (Rule 14).
//
// Proven live 2026-08-04:
//   list assignable reps : GET  /api/sales-reps                  -> [{id (= staff_id), name}]
//   read a work order    : GET  /api/work-orders/view/{id}       -> {data:{work_order:{sales_rep_id,sales_rep_name,sales_rep_is_inactive,…}}}
//   assign / clear a rep : POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id}  -> 201
//                          (sales_rep_id: null clears it -> the invoice becomes "Unassigned")
//
// Snapshots every work order it touches to /tmp so --restore is exact.
// Usage:
//   node seed_sbr_dataset.mjs --plan             show the invoiced work orders it would use
//   node seed_sbr_dataset.mjs --apply            spread reps across them + leave one unassigned
//   node seed_sbr_dataset.mjs --restore          put every original sales_rep_id back
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const SNAP = '/tmp/report-suite-viu/seed-sbr-wo-snapshot.json';
const mode = process.argv.find(a => a.startsWith('--')) || '--plan';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const WP_LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';
const RANGE = 'range=custom&start_date=2026-06-01&end_date=2026-08-04';
const { sessCookie } = await login('admin');

async function repList() {
  const r = await api(sessCookie, 'GET', '/api/sales-reps');
  return r.body.data.collection || [];
}
async function woView(id) {
  const r = await api(sessCookie, 'GET', '/api/work-orders/view/' + id);
  return r.body?.data?.work_order || null;
}
async function setRep(woId, repId) {
  return api(sessCookie, 'POST', '/api/work-orders/change-sales-rep',
    { work_order_id: woId, sales_rep_id: repId });
}

if (mode === '--restore') {
  if (!fs.existsSync(SNAP)) { console.log('no snapshot to restore'); process.exit(0); }
  const snap = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  for (const s of snap) {
    const r = await setRep(s.work_order_id, s.original_sales_rep_id);
    const back = await woView(s.work_order_id);
    console.log('RESTORE', s.invoice_number, '->', r.status,
      '| now', back?.sales_rep_name ?? '(none)', '| wanted', s.original_sales_rep_name ?? '(none)',
      (back?.sales_rep_id ?? null) === (s.original_sales_rep_id ?? null) ? 'MATCH' : '*** MISMATCH ***');
  }
  process.exit(0);
}

// --- gather invoiced work orders from the SBC expanded tree (these are, by definition, invoiced) ---
const invoices = [];
const top = await api(sessCookie, 'GET',
  `/api/reporting/reports/sales-by-customer?${RANGE}&productType=all&locations=${WP_HD},${WP_LB}&pagination[page]=1&pagination[rowsPerPage]=12`);
for (const cust of (top.body.data.collection || [])) {
  const assets = await api(sessCookie, 'GET',
    `/api/reporting/reports/sales-by-customer/${cust.key}/assets?${RANGE}&productType=all&locations=${WP_HD},${WP_LB}`);
  for (const a of (assets.body?.data?.collection || [])) {
    const inv = await api(sessCookie, 'GET',
      `/api/reporting/reports/sales-by-customer/${cust.key}/assets/${encodeURIComponent(a.key)}/invoices?${RANGE}&productType=all&locations=${WP_HD},${WP_LB}`);
    for (const i of (inv.body?.data?.collection || [])) {
      invoices.push({ customer: cust.customer_name, invoice_number: i.invoice_number,
        work_order_id: i.work_order_id, subtotal: i.subtotal, location: i.location });
    }
    if (invoices.length >= 14) break;
  }
  if (invoices.length >= 14) break;
}
console.log('invoiced work orders found:', invoices.length);

const reps = await repList();
console.log('assignable reps:', reps.map(r => r.name).join(' | '));

// Plan: rep[i % reps.length] across most, and the LAST TWO deliberately left with NO rep so the
// "Unassigned" row has real content.
const plan = invoices.slice(0, 12).map((inv, i) => ({
  ...inv,
  target_rep: i < 10 ? reps[i % reps.length] : null,
}));
for (const p of plan) {
  console.log('  ', p.invoice_number, '| $' + (p.subtotal / 100).toFixed(2), '|', p.location,
    '-> ', p.target_rep ? p.target_rep.name : '(UNASSIGNED)');
}
if (mode === '--plan') { console.log('\nPLAN ONLY — nothing changed.'); process.exit(0); }

// --- snapshot, then apply ---
const snap = [];
for (const p of plan) {
  const cur = await woView(p.work_order_id);
  snap.push({ work_order_id: p.work_order_id, invoice_number: p.invoice_number,
    original_sales_rep_id: cur?.sales_rep_id ?? null, original_sales_rep_name: cur?.sales_rep_name ?? null });
}
fs.writeFileSync(SNAP, JSON.stringify(snap, null, 1));
console.log('\nsnapshot written to', SNAP, '(', snap.length, 'work orders )');

for (const p of plan) {
  const r = await setRep(p.work_order_id, p.target_rep ? p.target_rep.id : null);
  const after = await woView(p.work_order_id);
  console.log('SET', p.invoice_number, '->', r.status, '| now', after?.sales_rep_name ?? '(none)');
}

// --- prove it landed in the report ---
const sbr = await api(sessCookie, 'GET',
  `/api/reporting/reports/sales-by-representative?${RANGE}&productType=all&invoiceStatus=all&locations=${WP_HD},${WP_LB}&pagination[page]=1&pagination[rowsPerPage]=50`);
console.log('\nSBR rep rows now:', (sbr.body.data.collection || []).length);
for (const r of (sbr.body.data.collection || [])) {
  console.log('  ', r.rep_name, '| invoices', r.invoice_count, '| unassigned', r.is_unassigned,
    '| inactive', r.is_inactive, '| location', r.location, '| subtotal $' + (r.subtotal / 100).toFixed(2));
}
