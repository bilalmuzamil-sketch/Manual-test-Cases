/** probe-leads-1026.mts — read the lead technician name of every work order matching a search (ARGS via LEADQ). Read only. */
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
for (const q of (process.env.ONLY || '').split('|')) { const r = await workOrders(a, q); console.log('LEADS', q, JSON.stringify(r.map((w: any) => [w.number, `${w.techAssignedFirstName ?? ''} ${w.techAssignedLastName ?? ''}`.trim()]))); }
await done(browser, 0);
