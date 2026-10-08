/**
 * Test data for the WO Board cases, made through the product's own endpoints (2026-10-08).
 * Recipes: playbook (customers/contacts/vehicles/work orders, change-status {id, status:'approved'});
 * lead technician: POST /api/work-orders/change-lead-technician {work_order_id, tech_assigned_id|null}
 * and the picker's own list GET /api/work-orders/lead-technician-candidates (product code @ 7a95011).
 * Every call is bounded so a dropped connection cannot hang a run.
 */
import type { Page } from 'playwright';
import { API } from './session.mts';

export type Api = { get: (u: string) => Promise<any>; post: (u: string, b: unknown) => Promise<any> };
export function api(page: Page): Api {
  const call = (method: string, u: string, b?: unknown) => Promise.race([
    page.evaluate(`fetch('${API}' + ${JSON.stringify(u)}, { method: '${method}', credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      ${b === undefined ? '' : `, body: ${JSON.stringify(JSON.stringify(b))}`} })
      .then(async r => ({ status: r.status, body: await r.json().catch(() => null) }))`),
    new Promise((res) => setTimeout(() => res({ status: 0, body: 'timeout' }), 45_000)),
  ]);
  return { get: (u) => call('GET', u), post: (u, b) => call('POST', u, b) };
}
const rows = (r: any) => r?.body?.data?.collection ?? r?.body?.data ?? [];

export async function candidates(a: Api): Promise<{ id: string; name: string; open: number }[]> {
  // answered as {data: {technicians: [{staffId, userId, firstName, lastName, openCount}]}} (measured 2026-10-08)
  const r = await a.get('/api/work-orders/lead-technician-candidates');
  return ((r?.body?.data?.technicians ?? []) as any[])
    .map((x) => ({ id: x.staffId, name: `${x.firstName ?? ''} ${x.lastName ?? ''}`.trim(), open: x.openCount }));
}

/** a customer by exact name (created if absent), with one contact and one vehicle */
export async function customer(a: Api, name: string, unit = 'ZZ-1') {
  // 🔴 2026-10-08: GET /api/contacts?company_id= and /api/vehicles?company_id= IGNORE the filter and return the
  // branch's first rows, so "reuse its vehicle" handed EVERY customer the same Ford Transit (no unit). A customer
  // made here now gets its own contact and its own vehicle with the unit asked for.
  let c = (rows(await a.get(`/api/customers?pagination[rowsPerPage]=200&search=${encodeURIComponent(name)}`)) as any[])
    .find((x) => x.name === name);
  let fresh = false;
  if (!c) {
    const r = await a.post('/api/customers/create', { name });
    if (r.status >= 300) throw new Error(`customer ${name}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
    c = { id: r.body?.data?.company_id ?? r.body?.data?.id ?? r.body?.company_id }; fresh = true;
  }
  const company_id = c.id;
  let contact = fresh ? null : (rows(await a.get(`/api/contacts?company_id=${company_id}`)) as any[]).find((x) => x.company_id === company_id || x.companyId === company_id);
  if (!contact) {
    const r = await a.post('/api/contacts/create', { company_id, first_name: 'ZZAUTOTEST', last_name: 'Contact', email: `zz${Date.now()}@staging.shopview.local` });
    contact = { id: r.body?.data?.contact_id ?? r.body?.contact_id };
  }
  let veh = fresh ? null : (rows(await a.get(`/api/vehicles?company_id=${company_id}`)) as any[]).find((x) => x.company_id === company_id || x.companyId === company_id);
  if (!veh) {
    const r = await a.post('/api/vehicles/create', { company_id, customer_id: contact.id, year: 2021, unit, vin: `ZZWOB${Date.now()}`.slice(0, 17) });
    veh = { id: r.body?.data?.vehicle_id ?? r.body?.data?.id ?? r.body?.vehicle_id };
  }
  return { company_id, contact_id: contact.id, vehicle_id: veh.id };
}

/** the work orders a page search for `q` finds (the list answers {data:{work_orders:[...]}}; a
 *  filters[company_id] query without the [N][field]/[N][value] shape silently returns nothing) */
export async function workOrders(a: Api, q: string): Promise<any[]> {
  const r = await a.get(`/api/work-orders?pagination[rowsPerPage]=200&search=${encodeURIComponent(q)}`);
  return r?.body?.data?.work_orders ?? [];
}

/** one more asset for the customer, with its own unit number */
export async function vehicle(a: Api, c: { company_id: string; contact_id: string }, unit: string) {
  const r = await a.post('/api/vehicles/create', { company_id: c.company_id, customer_id: c.contact_id, year: 2021, unit, vin: `ZZW${unit}${Date.now()}`.replace(/[^A-Z0-9]/gi, '').slice(0, 17).toUpperCase() });
  if (r.status >= 300) throw new Error(`vehicle ${unit}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
  return (r.body?.data?.vehicle_id ?? r.body?.data?.id ?? r.body?.vehicle_id) as string;
}

/** a new work order for that customer, moved to `status`, led by `lead` (staff id) or none */
export async function workOrder(a: Api, c: { company_id: string; vehicle_id: string }, status = 'approved', lead: string | null = null, here = false) {
  const r = await a.post('/api/work-orders/create', { is_vehicle_here: here, company_id: c.company_id, vehicle_id: c.vehicle_id });
  if (r.status >= 300) throw new Error(`work order: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
  const id = r.body?.data?.work_order_id ?? r.body?.data?.id ?? r.body?.work_order_id;
  if (status !== 'estimate') {
    const s = await a.post('/api/work-orders/change-status', { id, status });
    if (s.status >= 300) throw new Error(`status ${status}: ${s.status} ${JSON.stringify(s.body).slice(0, 200)}`);
  }
  if (lead) {
    const l = await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: lead });
    if (l.status >= 300) throw new Error(`lead: ${l.status} ${JSON.stringify(l.body).slice(0, 200)}`);
  }
  return id as string;
}

/** this case's customer with exactly the work orders it needs (made once; found by the customer name after that) */
export async function seedCase(a: Api, name: string, unit: string, plan: { lead: string | null; status?: string; here?: boolean }[]) {
  let have = await workOrders(a, name);
  if (!have.length) { const c = await customer(a, name, unit); for (const w of plan) await workOrder(a, c, w.status ?? 'approved', w.lead, !!w.here); have = await workOrders(a, name); }
  return have;
}
