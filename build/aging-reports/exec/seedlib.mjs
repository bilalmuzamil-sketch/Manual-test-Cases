// seedlib.mjs — 11 Nov 2026: seeding helpers for the aging tests on sv11315 (Rule 107; names tagged ZZ where the test allows).
// vendor(name, term) -> id · bill(vendorId, {amount, date, number}) -> {orderId, deliveryId?} via PO create + receive ·
// customerInvoice(name, {amount}) -> {customerId, woId, invoice} via customer > contact > vehicle > work order > line > complete >
// reviewed > invoice. All through the signed-in page (api.mjs). Shapes captured on screen 11 Nov (p06) or proven 10 Nov (facts only).
import { randomUUID } from 'crypto';
export const WP = { heavy: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', leth: 'f8a8b802-7780-4b16-bf10-343caeb616b2' };
export const TAX = '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', CAT = 'b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d', CANNED = '3a212080-8c00-4981-a46d-de91db43f3e7';
export const loc = (a, wp = WP.heavy) => a.post('/api/iam/change-location', { workplace_id: wp, workplace_timezone: 'America/Edmonton' });
export async function vendor(a, name, term = 'Net 30' /* the screen sends the label text: COD, Due on Receipt, Net 7 … Net 120 (p23, 11 Nov); 'NET_30' is NOT recognised and behaves as due-on-the-invoice-date */) { const r = await a.post('/api/parts-catalogue/add-vendor', { name, tax_id: TAX, country: 'CA', credit_term: term, credit_limit: 0 }); if (r.st >= 300) throw new Error('vendor ' + name + ' ' + r.st + ' ' + JSON.stringify(r.j)); return r.j.data.vendor_id; }
export async function bill(a, vendorId, { amount = 10, date = new Date().toISOString().slice(0, 10), number = 'ZZB' + (Date.now() % 1e7) } = {}) {
  const c = await a.post('/api/inventory/orders/create', { vendor_id: vendorId, note: null, items: [{ core_charge: null, core_id: null, ext_price: amount, id: randomUUID(), is_core: false, part_number: 'ZZAGING-' + (Date.now() % 1e6), price: amount, price_decimal: amount, quantity: '1', manufacturer_id: null, category: CAT, description: 'ZZAUTOTEST aging seed part', itemsPerPackage: null }] });
  if (c.st >= 300) throw new Error('po ' + c.st + ' ' + JSON.stringify(c.j)); const orderId = c.j.data.order_id;
  const d = await a.get('/api/inventory/orders/' + orderId); const items = d.j.data.order.items.map((i) => ({ ...i, quantity_received: Number(i.quantity_ordered), total: Number(i.total_cost_decimal) }));
  const acc = await a.post('/api/inventory/orders/accept', { id: orderId, invoiceNumber: number, invoiceDate: date + 'T18:00:00.000Z' /* 11:00 at the location (America/Edmonton) on that calendar day; T06:00Z is the PREVIOUS day there in winter (p12, 11 Nov) */, note: 'ZZAUTOTEST aging seed', items: JSON.stringify(items), total: amount, orderStatus: 'fulfilled', tax: 0 });
  if (acc.st >= 300) throw new Error('accept ' + acc.st + ' ' + JSON.stringify(acc.j).slice(0, 300)); return { orderId, number };
}
export async function customerInvoice(a, page, name, { wp = WP.heavy, n = 1, go } = {}) {
  const ok = (t, r) => { if (r.st >= 300) throw new Error(t + ' ' + r.st + ' ' + JSON.stringify(r.j).slice(0, 200)); return r.j; };
  const c = ok('customer', await a.post('/api/customers/create', { name })); const company_id = c.data?.company_id || c.data?.id;
  const ct = ok('contact', await a.post('/api/contacts/create', { company_id, first_name: 'ZZ', last_name: 'Aging' })); const contact_id = ct.data?.contact_id;
  const v = ok('vehicle', await a.post('/api/vehicles/create', { company_id, customer_id: contact_id, unit: 'ZZ' + (Date.now() % 1e5), vin: 'ZZVIN' + (Date.now() % 1e9) })); const vehicle_id = v.data?.vehicle_id || v.data?.id;
  const out = [];
  for (let i = 0; i < n; i++) {
    const w = ok('wo', await a.post('/api/work-orders/create', { company_id, vehicle_id, workplace_id: wp, start_date: new Date().toISOString().slice(0, 10), is_vehicle_here: true, mileage: 1000 })); const id = w.data?.work_order_id;
    ok('wo-contact', await a.post('/api/work-orders/change-contact', { work_order_id: id, vehicle_id, contact_id, update_vehicle: true }));
    ok('line', await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: CANNED, status: 'authorized' }));
    const lines = await a.get('/api/work-orders/lines/' + id); const line_id = lines.j.data.collection[0].line_id;
    ok('story', await a.post('/api/work-orders/lines/change-story', { line_id, tech_story: 'ZZAUTOTEST aging seed work done', work_order_id: id }));
    ok('complete', await a.post('/api/work-orders/lines/change-status', { line_id, work_order_id: id, status: 'complete' }));
    await go('/workorders/' + id + '/lines'); await page.waitForTimeout(2500); const mr = page.locator('[data-test-id="button_mark_reviewed"]'); if (await mr.count()) { await mr.click(); await page.waitForTimeout(2500); }
    const inv = await a.post('/api/invoices/create', { work_order_id: id }); out.push({ woId: id, invoice: inv.st, inv: JSON.stringify(inv.j).slice(0, 160) });
  }
  return { name, customerId: company_id, contact_id, vehicle_id, wos: out };
}
