// seed_sbr_invoices.mjs — create REAL invoiced work orders, each credited to a DIFFERENT Sales Rep,
// plus deliberately unassigned ones, so the Sales By Representative report has a multi-rep dataset
// (Rule 14: seed the state, never report "blocked" for missing data).
//
// Why this is needed: SBR spec S19-R6 snapshots the WO's Sales Rep onto the invoice AT INVOICE
// CREATION, and S19-N2 says changing a WO's rep afterwards does NOT alter existing invoices. So the
// only way to create a new rep row is to make a NEW work order, set its rep, and invoice it.
//
// Proven live 2026-08-04 (all secret-free, cookies from /tmp at runtime):
//   customers        : GET  /api/customers?limit=…            -> {data:{collection:[{id,name,…}]}}
//   vehicles         : GET  /api/vehicles?company_id={id}
//   create WO        : POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true} -> 201
//   canned lines     : GET  /api/canned-jobs  (or /api/canned-lines)
//   add a WO line    : POST /api/work-orders/lines/create {canned_line_id, work_order_id, status:'authorized'}
//   assign rep       : POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id} -> 201
//   invoice the WO   : POST /api/invoices/create {work_order_id}
//   delete a WO      : POST /api/work-orders/delete {work_order_id}
//
// Everything created is tagged ZZAUTOTEST in its description where a text field exists, and every
// created id is written to /tmp so --cleanup removes exactly what this script made.
//
// Usage:
//   node seed_sbr_invoices.mjs --probe             discover + print the building blocks only
//   node seed_sbr_invoices.mjs --apply [n]         create n (default 5) invoiced WOs across reps
//   node seed_sbr_invoices.mjs --cleanup           delete every WO this script created
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const LEDGER = '/tmp/report-suite-viu/seed-sbr-invoices-ledger.json';
const mode = process.argv.find(a => a.startsWith('--')) || '--probe';
const count = parseInt(process.argv[process.argv.indexOf('--apply') + 1] || '5', 10) || 5;
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const { sessCookie } = await login('admin');
const L = (...a) => console.log(...a);

const readLedger = () => (fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : []);
const writeLedger = l => fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1));

if (mode === '--cleanup') {
  const led = readLedger();
  L('cleaning up', led.length, 'seeded work orders');
  for (const e of led) {
    const r = await api(sessCookie, 'POST', '/api/work-orders/delete', { work_order_id: e.work_order_id });
    const chk = await api(sessCookie, 'GET', '/api/work-orders/view/' + e.work_order_id);
    L('DELETE', e.wo_number || e.work_order_id, '->', r.status,
      r.status >= 400 ? JSON.stringify(r.body).slice(0, 200) : '', '| re-GET', chk.status,
      chk.status === 404 ? 'GONE' : 'STILL PRESENT');
  }
  process.exit(0);
}

// ---- building blocks ----
const cust = await api(sessCookie, 'GET', '/api/customers?limit=40');
const customers = cust.body?.data?.collection || cust.body?.data || [];
L('customers:', customers.length, '| first:', JSON.stringify(customers[0] || {}).slice(0, 200));

const repsR = await api(sessCookie, 'GET', '/api/sales-reps');
const reps = repsR.body.data.collection || [];
L('sales reps:', reps.map(r => r.name).join(' | '));

let canned = [];
for (const p of ['/api/work-orders/canned-lines']) {
  const r = await api(sessCookie, 'GET', p);
  if (r.status === 200) {
    const c = r.body?.data?.collection || r.body?.data || [];
    if (Array.isArray(c) && c.length) { canned = c; L('canned lines from', p, ':', c.length,
      '| first:', JSON.stringify(c[0]).slice(0, 240)); break; }
  } else L('canned probe', p, '->', r.status);
}

if (mode === '--probe') {
  // learn the WO-create contract from a deliberately empty body
  const e = await api(sessCookie, 'POST', '/api/work-orders/create', {});
  L('WO create with {} ->', e.status, JSON.stringify(e.body).slice(0, 400));
  const i = await api(sessCookie, 'POST', '/api/invoices/create', {});
  L('invoice create with {} ->', i.status, JSON.stringify(i.body).slice(0, 300));
  process.exit(0);
}

// ---- apply ----
const ledger = readLedger();
let made = 0;
for (let k = 0; k < customers.length && made < count; k++) {
  const c = customers[k];
  const vehR = await api(sessCookie, 'GET', `/api/vehicles?company_id=${c.id}`);
  const vehicles = vehR.body?.data?.collection || vehR.body?.data || [];
  if (!vehicles.length) continue;

  const rep = made < count - 2 ? reps[made % reps.length] : null;  // last two intentionally unassigned
  const woR = await api(sessCookie, 'POST', '/api/work-orders/create', {
    company_id: c.id, vehicle_id: vehicles[0].id, workplace_id: WP_HD,
    start_date: '2026-07-15', is_vehicle_here: true,
    description: 'ZZAUTOTEST SBR VIU seed',
  });
  if (woR.status >= 400) { L('WO create failed for', c.name, woR.status, JSON.stringify(woR.body).slice(0, 220)); continue; }
  const woId = woR.body?.data?.id || woR.body?.data?.work_order_id || woR.body?.data?.work_order?.id;
  if (!woId) { L('WO created but id not found in', JSON.stringify(woR.body).slice(0, 250)); continue; }

  const entry = { work_order_id: woId, customer: c.name, rep: rep ? rep.name : '(unassigned)',
    created: new Date().toISOString() };

  if (canned.length) {
    const lr = await api(sessCookie, 'POST', '/api/work-orders/lines/create',
      { canned_line_id: canned[made % canned.length].id, work_order_id: woId, status: 'authorized' });
    entry.lineStatus = lr.status;
    if (lr.status >= 400) entry.lineError = JSON.stringify(lr.body).slice(0, 200);
  }
  if (rep) {
    const rr = await api(sessCookie, 'POST', '/api/work-orders/change-sales-rep',
      { work_order_id: woId, sales_rep_id: rep.id });
    entry.repStatus = rr.status;
  }
  const inv = await api(sessCookie, 'POST', '/api/invoices/create', { work_order_id: woId });
  entry.invoiceStatus = inv.status;
  entry.invoiceBody = JSON.stringify(inv.body).slice(0, 250);
  const view = await api(sessCookie, 'GET', '/api/work-orders/view/' + woId);
  entry.wo_number = view.body?.data?.work_order?.work_order_number || null;
  entry.finalStatus = view.body?.data?.work_order?.status || null;
  entry.finalRep = view.body?.data?.work_order?.sales_rep_name || null;

  ledger.push(entry); writeLedger(ledger);
  L('MADE', entry.wo_number || woId, '| cust', c.name, '| rep', entry.rep,
    '| line', entry.lineStatus, '| invoice', entry.invoiceStatus, '| status', entry.finalStatus,
    entry.lineError ? '| LINE ERR ' + entry.lineError : '');
  made++;
}
L('\nseeded', made, 'work orders; ledger at', LEDGER);
