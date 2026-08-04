// repro_invoice_500.mjs — establish the REAL reproduction condition for SV-8821
// ("Creating an invoice from a completed work order fails with a server error").
//
// WHY THIS EXISTS: the QA lead could not reproduce it with the canned line HE used, and ruled that
// a reproduction must NAME the exact canned line. The original evidence
// (batch-sbc-sbr/tools/seed_invoiced_wo.mjs) filtered canned lines to `c.fixed_price && HD`, i.e.
// it only ever used the 11 "Fixed labour" canned lines out of 79 — and never said so.
//
// THIS SCRIPT drives the SAME chain across canned lines of EVERY pricing shape and records, per
// attempt: canned line id + exact name + pricing shape, the WO id/number, every step's HTTP status,
// the invoice call's status, its x-request-id, and its response body.
//
// Rule 14: seed everything. Rule 5/6: ZZAUTOTEST + full cleanup. Rule 12: only observed facts.
//
// Usage:
//   node repro_invoice_500.mjs --matrix          drive the full pricing-shape matrix
//   node repro_invoice_500.mjs --one <cannedId>  drive a single named canned line
//   node repro_invoice_500.mjs --cleanup         delete every WO this script created
import fs from 'fs';
import { login, api, BASE } from '../../../viu-2026-08-03/tools/qa8582.mjs';

const LEDGER = '/tmp/sv8821/repro-ledger.json';
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const TZ = 'America/Edmonton';
fs.mkdirSync('/tmp/sv8821', { recursive: true });
const readL = () => (fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : []);
const writeL = l => fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1));
const L = (...a) => console.log(...a);

const { sessCookie, status: lst } = await login('admin');
if (lst !== 200) { console.error('LOGIN FAILED', lst); process.exit(2); }

// api() drops headers, and the request id is the single most useful thing for a developer,
// so this variant keeps them.
async function apiH(method, path, body) {
  const opts = { method, redirect: 'manual',
    headers: { Cookie: sessCookie, Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
      Origin: 'https://sv8582.qa.shopview.com', Referer: 'https://sv8582.qa.shopview.com/' } };
  if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
  const r = await fetch(BASE + path, opts);
  const t = await r.text();
  let j = null; try { j = JSON.parse(t); } catch {}
  const h = {};
  for (const k of ['x-request-id', 'x-debug-token', 'x-debug-token-link']) if (r.headers.get(k)) h[k] = r.headers.get(k);
  return { status: r.status, body: j ?? t.slice(0, 2000), headers: h };
}

const mode = process.argv[2] || '--matrix';

/* ----------------------------------- CLEANUP ----------------------------------- */
if (mode === '--cleanup') {
  await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: TZ });
  const ids = [...new Set(readL().map(e => e.woId).filter(Boolean))];
  L('cleaning', ids.length, 'work orders created by this script');
  // ⚠️ a MISSING work order answers 400 {"workOrderId":"Not found"} on this build, NOT 404.
  const absent = r => r.status === 404 || (r.status === 400 && /not found/i.test(JSON.stringify(r.body)));
  let gone = 0; const stuck = [];
  for (const woId of ids) {
    if (absent(await api(sessCookie, 'GET', '/api/work-orders/view/' + woId))) { gone++; continue; }
    // an invoiced/completed WO cannot be deleted — drop it back to Estimate first
    await api(sessCookie, 'POST', '/api/work-orders/change-status', { id: woId, status: 'estimate' });
    let r = await api(sessCookie, 'POST', '/api/work-orders/delete', { work_order_id: woId });
    if (r.status >= 400) {
      const lines = (await api(sessCookie, 'GET', `/api/work-orders/lines/${woId}`)).body?.data?.collection || [];
      for (const ln of lines) {
        await api(sessCookie, 'POST', '/api/work-orders/lines/change-status', { line_id: ln.line_id, status: 'authorized' });
        await api(sessCookie, 'POST', '/api/work-orders/lines/delete', { line_id: ln.line_id, work_order_id: woId });
      }
      r = await api(sessCookie, 'POST', '/api/work-orders/delete', { work_order_id: woId });
    }
    if (absent(await api(sessCookie, 'GET', '/api/work-orders/view/' + woId))) gone++;
    else stuck.push({ woId, why: JSON.stringify(r.body).slice(0, 160) });
  }
  L('\nDELETED/absent:', gone, '/', ids.length, '| still present:', stuck.length);
  stuck.forEach(s => L('   STUCK', s.woId, s.why));
  process.exit(stuck.length ? 4 : 0);
}

/* ------------------------------- SETUP / PICKERS -------------------------------- */
await apiH('POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: TZ });
const canned = (await apiH('GET', '/api/work-orders/canned-lines')).body?.data?.collection || [];
const customers = (await apiH('GET', '/api/customers?limit=80')).body?.data?.collection || [];
L('canned lines:', canned.length, '| customers:', customers.length);

// the four pricing shapes the data actually contains
const shape = c => c.fixed_price ? 'FIXED LABOUR (fixed_price set)'
  : (c.fixed_line_total !== null && c.fixed_line_total !== undefined) ? 'FIXED LINE TOTAL (fixed_line_total set)'
  : c.labour_rate ? 'HOURLY LABOUR RATE (labour_rate set)' : 'NO PRICE SOURCE';

// The matrix: cover every pricing shape, both with and without catalogue parts, plus the
// zero-value and zero-time edge cases, plus every distinct labour-rate type.
const MATRIX = [
  'ce1f2549-24a9-485c-a849-267f8918d66e', // HD CVIP air brake trailer single/tandem   FIXED LABOUR, 0 parts   <-- one the batch used
  '3a212080-8c00-4981-a46d-de91db43f3e7', // HD Wheels off air brake trailer tri-axle  FIXED LABOUR, 0 parts   <-- the batch's most-used
  'c08b8759-97dc-40c5-9cab-fef38fe117a1', // Service - Perform Annual Inspection       FIXED LABOUR, 0 parts   <-- the batch used
  'e55c893f-8253-4aa9-8901-7282c804d056', // CVIP Driving Force                        FIXED LINE TOTAL 300
  '5fd21946-4da4-43b6-9331-cf7df66c3032', // Wheels off Driving Force                  FIXED LINE TOTAL 100
  'ee1d7466-8798-40ec-b785-3c5c7f33159e', // HD - Quality Control Check Over           FIXED LINE TOTAL 0 (zero value)
  '53b26ca7-92ca-4def-bfd0-7f5649a775ca', // Champ X Service air filter                HOURLY, 0 parts, HD Fleet Rate
  '0f9a7759-1982-4855-96d5-4a4cf1773a23', // Service - Transmission service (Automatic) HOURLY, 2 parts
  '2623d064-20b9-460c-9c59-ec00552e30ce', // Champ X Service oil and fuel              HOURLY, 5 parts (most parts)
  '5506a77e-31e7-48b6-9171-dc904919f028', // Service - Perform LOF and inspection      HOURLY, 5 parts
  'c84bd165-2687-4c13-8e34-06d2d773045a', // Service - Adjust brakes                   HOURLY, 0 parts, HD Door Rate
  '3b52c4f5-f9e3-47bd-b205-7efa2e03c98a', // Service - PDI                             HOURLY, 0 parts, CP RAIL FLEET RATE
  'da0a0c9f-57ee-45f6-901c-aeea01e21665', // Service - Perform winterization inspection HOURLY, 0 parts, Two Small Men rate
  '68d59b05-ac52-4081-a193-1c0ab1fbda1d', // HD Misc Buffer                            HOURLY, 0 parts, est=0 tech=0 (zero time)
  'c83f70f6-fb1d-4b47-958e-4c98978d47f0', // Sublet - Tow                              HOURLY, 1 part, est=0 tech=0 (sublet)
  '9deb042f-a103-4ca8-a6c0-9b2925125114', // Replace - Tie rod                         HOURLY, 1 part
];

const targets = mode === '--one' ? [process.argv[3]] : MATRIX;

/* --------------------------------- THE DRIVE ----------------------------------- */
// One work order per canned line, driven identically, so the ONLY variable is the canned line.
const ledger = readL();
const results = [];
let ci = 30;   // start well clear of the customers earlier passes used

for (const cid of targets) {
  const cl = canned.find(c => c.id === cid);
  if (!cl) { L('!! canned line not found', cid); continue; }
  const name = cl.canned_line_name.trim();

  // find a customer that actually has a vehicle
  let cust = null, veh = null;
  for (let k = 0; k < customers.length && !veh; k++) {
    const c = customers[(ci + k) % customers.length];
    const v = (await apiH('GET', `/api/vehicles?company_id=${c.id}`)).body?.data?.collection || [];
    if (v.length) { cust = c; veh = v[0]; ci = (ci + k + 1) % customers.length; }
  }
  if (!veh) { L('!! no customer with a vehicle left'); break; }

  const rec = { cannedLineId: cid, cannedLine: name, pricing: shape(cl),
    fixed_price: cl.fixed_price, fixed_line_total: cl.fixed_line_total,
    labour_rate: cl.labour_rate, labour_type: cl.labour_type_name, parts: cl.total_parts,
    customer: cust.name, when: new Date().toISOString() };

  const wo = await apiH('POST', '/api/work-orders/create', { company_id: cust.id, vehicle_id: veh.id,
    workplace_id: WP_HD, start_date: '2026-07-20', is_vehicle_here: true });
  rec.woCreate = wo.status;
  rec.woId = wo.body?.data?.work_order_id || wo.body?.data?.id;   // ⚠️ work_order_id, NOT id
  if (!rec.woId) { rec.fail = 'WO create: ' + JSON.stringify(wo.body).slice(0, 200); results.push(rec); L('FAIL', name, rec.fail); continue; }
  ledger.push({ woId: rec.woId, cannedLine: name, stage: 'created' }); writeL(ledger);

  const ln = await apiH('POST', `/api/work-orders/${rec.woId}/lines/create-from-canned-line`,
    { canned_line_id: cid, status: 'authorized' });
  rec.lineCreate = ln.status; rec.lineId = ln.body?.data?.line_id;
  if (!rec.lineId) { rec.fail = 'line create: ' + JSON.stringify(ln.body).slice(0, 200); results.push(rec); L('FAIL', name, rec.fail); continue; }

  rec.mileage = (await apiH('POST', '/api/work-orders/change-mileage',
    { work_order_id: rec.woId, mileage: '123456' })).status;                 // MUST be a string
  rec.techStory = (await apiH('POST', '/api/work-orders/lines/change-story',
    { line_id: rec.lineId, tech_story: 'ZZAUTOTEST SV-8821 repro', work_order_id: rec.woId })).status;
  const lc = await apiH('POST', '/api/work-orders/lines/change-status', { line_id: rec.lineId, status: 'complete' });
  rec.lineComplete = lc.status;
  if (lc.status >= 400) rec.lineCompleteErr = JSON.stringify(lc.body).slice(0, 200);
  const wc = await apiH('POST', '/api/work-orders/change-status', { id: rec.woId, status: 'complete' });
  rec.woComplete = wc.status;
  if (wc.status >= 400) rec.woCompleteErr = JSON.stringify(wc.body).slice(0, 200);

  // read back the money the line actually carries — the likeliest discriminator
  const view = (await apiH('GET', '/api/work-orders/view/' + rec.woId)).body?.data?.work_order;
  rec.woNumber = view?.work_order_number; rec.woStatus = view?.status;
  rec.woTotal = view?.total_price ?? view?.totalPrice;
  const lines = (await apiH('GET', `/api/work-orders/lines/${rec.woId}`)).body?.data?.collection || [];
  rec.lineMoney = lines.map(l => ({ status: l.status, labor: l.labor_price ?? l.labour_price,
    parts: l.parts_price, total: l.total_price ?? l.line_total }));

  /* -------- THE CALL UNDER TEST -------- */
  const inv = await apiH('POST', '/api/invoices/create', { work_order_id: rec.woId });
  rec.invoiceStatus = inv.status;
  rec.invoiceRequestId = inv.headers['x-request-id'] || null;
  rec.invoiceBody = typeof inv.body === 'string' ? inv.body.slice(0, 600) : JSON.stringify(inv.body).slice(0, 600);

  results.push(rec); ledger.push(rec); writeL(ledger);
  L(`${rec.invoiceStatus === 500 ? '500 ✗' : rec.invoiceStatus < 300 ? '2xx ✓' : rec.invoiceStatus + ' ?'}`,
    '|', rec.woNumber, '|', name.padEnd(46).slice(0, 46), '|', rec.pricing.padEnd(34),
    '| parts', rec.parts, '| lineC', rec.lineComplete, 'woC', rec.woComplete,
    '| reqid', rec.invoiceRequestId || '-',
    rec.invoiceStatus >= 400 ? '\n      body: ' + rec.invoiceBody : '');
}

fs.writeFileSync('/tmp/sv8821/repro-results.json', JSON.stringify(results, null, 1));
L('\n===== SUMMARY =====');
const by = {};
for (const r of results) {
  const k = r.pricing + '  ' + (r.parts ? 'with parts' : 'no parts');
  (by[k] = by[k] || []).push(`${r.invoiceStatus}`);
}
for (const [k, v] of Object.entries(by)) L(' ', k.padEnd(52), '->', v.join(', '));
L('\nresults: /tmp/sv8821/repro-results.json | ledger:', LEDGER);
