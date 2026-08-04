// seed_invoiced_wo.mjs — create a FULLY INVOICED work order credited to a chosen Sales Rep, end to
// end through the API. This is what makes multiple rep rows exist in Sales By Representative
// (SBR S19-R6 snapshots the rep onto the invoice at invoice creation, so a new invoice is the only
// way to create a new rep row). Rule 14: seed the state, never report "blocked".
//
// THE WORKING CHAIN (all proven live 2026-08-04 on sv8582 / build v3.4.1-0ed4433):
//   1. create WO   POST /api/work-orders/create
//                    {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true} -> 201
//   2. add a line   POST /api/work-orders/{woId}/lines/create-from-canned-line
//                    {canned_line_id, status:'authorized'} -> 201 {line_id}
//                    ⚠️ the generic POST /api/work-orders/lines/create returns HTTP 500 on this
//                       branch once validation passes — use the create-from-canned-line route.
//   3. mileage      POST /api/work-orders/change-mileage {work_order_id, mileage:'123456'} -> 201
//                    ⚠️ mileage MUST be a STRING; a number returns HTTP 500.
//   3b. tech story  POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id} -> 201
//                    ⚠️ /api/work-orders/lines/change returns HTTP 500 on this branch.
//   4. complete line POST /api/work-orders/lines/change-status {line_id, status:'complete'}
//                    (400 "Line can not be completed without a tech story" until step 3 is done)
//   5. complete WO  POST /api/work-orders/change-status {id, status:'complete'}  -> 201
//                    ⚠️ the field is `id`, NOT `work_order_id`.
//   6. assign rep   POST /api/work-orders/change-sales-rep {work_order_id, sales_rep_id} -> 201
//   7. invoice      POST /api/invoices/create {work_order_id}
//                    (400 "not complete" before 5; 400 "must have at least one completed line"
//                     before 4)
//   ⚠️ Every write is scoped to the SESSION's active workplace: change-sales-rep returns 201 but
//      SILENTLY NO-OPS for a work order in another workplace. Switch first with
//      POST /api/iam/change-location {workplace_id, workplace_timezone}.
//
// All created work orders are logged to /tmp so --cleanup deletes exactly what this made.
// Usage:
//   node seed_invoiced_wo.mjs --apply <n>     create n invoiced WOs, cycling the sales reps
//   node seed_invoiced_wo.mjs --cleanup
import fs from 'fs';
import { login, api } from '../../tools/qa8582.mjs';

const LEDGER = '/tmp/report-suite-viu/seed-invoiced-wo-ledger.json';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const mode = process.argv.find(a => a.startsWith('--')) || '--apply';
const n = parseInt(process.argv[process.argv.indexOf('--apply') + 1] || '4', 10) || 4;
const { sessCookie } = await login('admin');
const L = (...a) => console.log(...a);
const readL = () => (fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : []);
const writeL = l => fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1));

if (mode === '--cleanup') {
  const led = readL();
  L('deleting', led.length, 'seeded work orders');
  for (const e of led) {
    const r = await api(sessCookie, 'POST', '/api/work-orders/delete', { work_order_id: e.woId });
    const chk = await api(sessCookie, 'GET', '/api/work-orders/view/' + e.woId);
    L('DELETE', e.woNumber || e.woId, '->', r.status, '| re-GET', chk.status,
      chk.status === 404 ? 'GONE' : 'STILL PRESENT ' + JSON.stringify(r.body).slice(0, 160));
  }
  process.exit(0);
}

await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });
const reps = (await api(sessCookie, 'GET', '/api/sales-reps')).body.data.collection || [];
const canned = (await api(sessCookie, 'GET', '/api/work-orders/canned-lines')).body.data.collection || [];
const cannedPriced = canned.filter(c => c.fixed_price && c.workplace_id === WP_HD);
const customers = (await api(sessCookie, 'GET', '/api/customers?limit=60')).body.data.collection || [];
L('reps', reps.length, '| priced canned lines', cannedPriced.length, '| customers', customers.length);

const ledger = readL();
let made = 0;
for (let k = 20; k < customers.length && made < n; k++) {
  const c = customers[k];
  const veh = (await api(sessCookie, 'GET', `/api/vehicles?company_id=${c.id}`)).body?.data?.collection || [];
  if (!veh.length) continue;
  const rep = reps[k % reps.length];
  const cl = cannedPriced[k % cannedPriced.length];

  const wo = await api(sessCookie, 'POST', '/api/work-orders/create', {
    company_id: c.id, vehicle_id: veh[0].id, workplace_id: WP_HD,
    start_date: '2026-07-20', is_vehicle_here: true });
  // the create response returns `work_order_id` (NOT `id`) — getting this wrong silently
  // creates stray work orders, so record every id the moment it exists.
  const woId = wo.body?.data?.work_order_id || wo.body?.data?.id;
  if (!woId) { L('WO create failed', c.name, wo.status, JSON.stringify(wo.body).slice(0, 180)); continue; }
  ledger.push({ woId, customer: c.name, stage: 'created' }); writeL(ledger);

  const ln = await api(sessCookie, 'POST', `/api/work-orders/${woId}/lines/create-from-canned-line`,
    { canned_line_id: cl.id, status: 'authorized' });
  const lineId = ln.body?.data?.line_id;
  const step = { woId, customer: c.name, rep: rep.name, cannedLine: cl.canned_line_name.trim(),
    lineStatus: ln.status, lineId };
  if (!lineId) { L('line failed', c.name, ln.status, JSON.stringify(ln.body).slice(0, 180)); continue; }

  // mileage — a line cannot be completed without the work order's mileage.
  // ⚠️ `mileage` MUST be sent as a STRING; a number returns HTTP 500.
  const mil = await api(sessCookie, 'POST', '/api/work-orders/change-mileage',
    { work_order_id: woId, mileage: '123456' });
  step.mileageStatus = mil.status;

  // tech story — a line cannot be completed without one.
  // The endpoint is /lines/change-story (NOT /lines/change, which returns HTTP 500 here).
  const st = await api(sessCookie, 'POST', '/api/work-orders/lines/change-story',
    { line_id: lineId, tech_story: 'ZZAUTOTEST VIU seed story', work_order_id: woId });
  step.techStoryStatus = st.status;

  const comp = await api(sessCookie, 'POST', '/api/work-orders/lines/change-status',
    { line_id: lineId, status: 'complete' });
  step.lineCompleteStatus = comp.status;
  step.lineCompleteErr = comp.status >= 400 ? JSON.stringify(comp.body).slice(0, 180) : null;

  const wos = await api(sessCookie, 'POST', '/api/work-orders/change-status', { id: woId, status: 'complete' });
  step.woCompleteStatus = wos.status;

  const rr = await api(sessCookie, 'POST', '/api/work-orders/change-sales-rep',
    { work_order_id: woId, sales_rep_id: rep.id });
  step.repStatus = rr.status;

  const inv = await api(sessCookie, 'POST', '/api/invoices/create', { work_order_id: woId });
  step.invoiceStatus = inv.status;
  step.invoiceErr = inv.status >= 400 ? JSON.stringify(inv.body).slice(0, 200) : null;

  const view = (await api(sessCookie, 'GET', '/api/work-orders/view/' + woId)).body?.data?.work_order;
  step.woNumber = view?.work_order_number; step.finalStatus = view?.status; step.finalRep = view?.sales_rep_name;

  ledger.push(step); writeL(ledger);
  L('WO', step.woNumber, '|', c.name, '| rep', rep.name, '| line', step.lineStatus,
    '| story', step.techStoryStatus, '| lineComplete', step.lineCompleteStatus,
    '| woComplete', step.woCompleteStatus, '| invoice', step.invoiceStatus,
    '| final', step.finalStatus, '/', step.finalRep,
    step.lineCompleteErr ? '\n    lineErr: ' + step.lineCompleteErr : '',
    step.invoiceErr ? '\n    invErr: ' + step.invoiceErr : '');
  if (step.invoiceStatus < 300) made++;
}
L('\ninvoiced work orders created:', made, '| ledger', LEDGER);
