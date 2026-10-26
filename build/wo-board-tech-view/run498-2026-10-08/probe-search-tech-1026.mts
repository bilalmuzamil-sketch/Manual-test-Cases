/** probe-search-tech-1026.mts — 26 Oct 2026, sv11582: does the Work Orders search match a work order by its LEAD TECHNICIAN's name?
 *  (needed to build PRD v77 S11-E1's "search alone empties the view" case). Asks the list endpoint the page uses, with several terms. Read only. */
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = {};
for (const q of ['Eve E7600', 'ZZAUTOTEST Eve E7600', 'E7600', 'Eve', 'ZZAUTOTEST V77 Search Focus 7600', 'Ben Bravo']) { const r = await workOrders(a, q); o[q] = { n: r.length, leads: [...new Set(r.slice(0, 50).map((w: any) => `${w.techAssignedFirstName ?? ''} ${w.techAssignedLastName ?? ''}`.trim()))].slice(0, 5), customers: [...new Set(r.slice(0, 50).map((w: any) => w.companyName ?? w.company_name ?? ''))].slice(0, 3) }; }
console.log('SEARCH', JSON.stringify(o)); await done(browser, 0);
