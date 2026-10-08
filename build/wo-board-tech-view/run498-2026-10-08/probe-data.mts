/** Prove the data helper on one throwaway customer, and list the eligible technicians. */
import { open, done } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
const { browser, page } = await open('/workorders');
const a = api(page);
const techs = await candidates(a);
console.log('eligible technicians:', techs.length, techs.slice(0, 12).map((x) => x.name).join(' | '));
const c = await customer(a, 'ZZAUTOTEST WOB Probe', 'ZZP-1');
console.log('customer', JSON.stringify(c));
const id = await workOrder(a, c, 'approved', techs[0]?.id ?? null);
const mine = await workOrders(a, c.company_id);
console.log('made', id, '| that customer now has', mine.length, 'work orders:', JSON.stringify(mine.slice(0, 3).map((w: any) => ({ n: w.number, s: w.status, lead: w.tech_assigned ?? w.lead_technician ?? w.techAssigned }))).slice(0, 600));
await done(browser);
