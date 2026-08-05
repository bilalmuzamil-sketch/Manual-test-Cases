// Scenario for the HANDOFF KEY CHECK: a work order with parts on TWO lines,
// same vendor, both ordered -> then split one line and see whether the new WO's
// receive view merges the vendor's purchase orders into ONE block.
import { open } from '/tmp/sv8781/api.mjs';
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const CAT = 'b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d';
const VEND = '1e7bd0bf-e882-45fa-8c21-835e32ffa374'; // Aabridge Beverages
const s = await open();
const log = (...a) => console.log(...a);

const cust = (await s.api('GET', '/api/customers?limit=5')).json.data.collection[0];
const veh = (await s.api('GET', `/api/vehicles?company_id=${cust.id}`)).json.data.collection[0];
const wo = await s.api('POST', '/api/work-orders/create', { company_id: cust.id, vehicle_id: veh.id, workplace_id: WP, start_date: '2026-08-05', is_vehicle_here: true });
const WO = wo.json.data.work_order_id;
log('WO created:', WO, '| customer', cust.name, '| vehicle VIN', veh.vin);

const cls = (await s.api('GET', '/api/work-orders/canned-lines?limit=40')).json.data.collection;
const pick = (n) => cls.filter(c => (c.canned_line_name || '').includes('Service'))[n];
const lines = [];
for (const n of [0, 1]) {
  const cl = pick(n);
  const r = await s.api('POST', '/api/work-orders/lines/create', { work_order_id: WO, canned_line_id: cl.id, status: 'authorized' });
  log(`line ${n + 1} create -> ${r.status}  "${(cl.canned_line_name || '').trim()}"`);
}
const lr = await s.api('GET', `/api/work-orders/lines/${WO}`);
const coll = lr.json.data.collection || lr.json.data;
for (const l of coll) lines.push({ id: l.line_id, name: (l.line_name || l.description || '').trim() });
log('lines on WO:', lines.length, JSON.stringify(lines.map(l => l.name)));

// one vendor part per line, same vendor
const prs = [];
for (let i = 0; i < lines.length; i++) {
  const r = await s.api('POST', '/api/work-orders/part/make-request', {
    line: lines[i].id, work_order: WO, description: `ZZAUTOTEST L${i + 1} part`, quantity: 2,
    part_source_type: 'vendor', part_number: `ZZ-L${i + 1}`, price: 30 + i * 10, part_category_id: CAT, vendor_id: VEND,
  });
  const pr = r.json?.data?.part_request;
  prs.push({ id: r.json?.data?.id, line: lines[i].id, vendor: pr?.vendor_id, name: `ZZ-L${i + 1}` });
  log(`part for line ${i + 1} -> ${r.status} id=${r.json?.data?.id} vendor_id=${pr?.vendor_id}`);
}
// order both
for (const pr of prs) {
  const a = await s.api('POST', '/api/work-orders/part/perform-request-status-action', { part_request_id: pr.id });
  log(`order ${pr.name} -> ${a.status} status=${a.json?.data?.status} orderId=${a.json?.data?.orderId}`);
  pr.orderId = a.json?.data?.orderId;
}
log('\ndistinct purchase orders created:', [...new Set(prs.map(p => p.orderId))].length);
// PO list for this WO
const list = await s.api('GET', '/api/inventory/orders?limit=25');
for (const o of list.json.data.collection.filter(o => o.workOrderId === WO)) log(`  PO ${o.order_number} status=${o.status} vendors=${JSON.stringify(o.vendorNames)} missing=${o.vendorMissing}`);
console.log('\nSEED:', JSON.stringify({ WO, lines, prs }));
await s.browser.close();
