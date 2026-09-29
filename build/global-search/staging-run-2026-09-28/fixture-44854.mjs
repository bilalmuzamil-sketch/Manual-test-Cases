// A discriminating fixture for C44854. The current one cannot show a demotion: the part on the work
// order already sits SECOND on a neutral page, which is where a demotion would put it anyway. So
// put the part that leads the neutral page - the Wheel Seal - onto a fresh work order instead. If
// the demotion works, it must fall below the Brake Shoe Kit when searched from that work order.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const call = (p, m = 'GET', body) => b.page.evaluate(async ([p, m, body]) => {
  const r = await fetch('https://api.staging.shopview.com' + p, { method: m, credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined });
  return { status: r.status, body: await r.json().catch(() => null) };
}, [p, m, body]);
// a fresh work order for the same customer and vehicle
const asset = (await call('/api/search?q=ZZT-4471')).body.data.groups.find(g => g.type === 'assets').items[0];
const wo = await call('/api/work-orders/create', 'POST', { is_vehicle_here: false,
  company_id: '3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7', vehicle_id: asset.id });
const woId = wo.body.data.work_order_id || wo.body.data.id;
console.log('fresh work order ->', wo.status, woId);
await call('/api/work-orders/change-status', 'POST', { id: woId, status: 'approved' });
// put the WHEEL SEAL on it - the part that leads the neutral page
const inv = (await call('/api/inventory/parts?search=ZZT-FIB-1002')).body.data.collection[0];
const cl = (await call('/api/work-orders/canned-lines')).body.data.collection[0];
const line = await call(`/api/work-orders/${woId}/lines/create-from-canned-line`, 'POST', { canned_line_id: cl.id, status: 'authorized' });
const pr = await call('/api/work-orders/part/make-request', 'POST', {
  line: line.body.data.line_id, work_order: woId, description: 'ZZAUTOTEST Fibridge Wheel Seal',
  quantity: 1, part_source_type: 'inventory', part_number: inv.part_number,
  part_category_id: inv.category, cost: 10, sell_price: inv.sell_price || 20, inventory_part_id: inv.id });
console.log('wheel seal onto it ->', pr.status);
fs.writeFileSync('/tmp/staging/wo-44854.json', JSON.stringify({ woId }, null, 1));
await b.browser.close();
