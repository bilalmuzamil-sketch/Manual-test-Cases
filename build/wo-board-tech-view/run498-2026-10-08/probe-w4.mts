/** C96963 last piece (2026-10-09): the unassigned Invoiced work order S10043-18001 can be reordered INSIDE Unassigned.
 *  Batch G dragged it onto a card it already sat above (no change possible), so here it is dragged BELOW the other
 *  unassigned card of the same customer, in Board View and in Tech View, and the order is read after a reload. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toasts, expandSmallGroups } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p);
const R: any = {};
const w4 = (await workOrders(a, 'S10043-18001'))[0];
const v = (await a.get(`/api/work-orders/view/${w4.id}`)).body?.data?.work_order ?? {};
const n = w4.companyName ?? w4.company_name ?? v.company_name ?? v.company?.name;
R.w4 = { number: w4.number, status: w4.status, lead: w4.techAssignedFirstName ?? 'none', customer: n };
let others = (await workOrders(a, n)).filter((x: any) => !x.techAssignedFirstName && x.id !== w4.id && x.status === 'approved');
if (!others.length) { await workOrder(a, { company_id: v.company_id, vehicle_id: v.vehicle_id, contact_id: v.contact_id ?? v.customer_id }, 'approved', null); others = (await workOrders(a, n)).filter((x: any) => !x.techAssignedFirstName && x.id !== w4.id && x.status === 'approved'); }
const other = others[0]; R.other = other?.number;
const go = async (d: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await display(p, d); await search(p, n); if (d === 'Tech View') await expandSmallGroups(p); };
const ordBoard = async () => (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards ?? [];
const ordTech = async () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [''])[0])`) as Promise<string[]>;
for (const d of ['Board View', 'Tech View']) {
  const tv = d === 'Tech View', ord = tv ? ordTech : ordBoard;
  const host = (id: string) => tv ? `[data-test-id="tech_view_row_${id}"]` : `[data-test-id="board_card_${id}"]`;
  await go(d); const before = await ord();
  // put [WO-4] after the other card: drop near the bottom edge of the other card / row
  const box = await p.locator(host(other.id)).boundingBox();
  await drag(p, host(w4.id), host(other.id), box ? Math.round(box.height - 4) : 40); await p.waitForTimeout(1500);
  const msg = await toasts(p); const now = await ord(); await shot(p, `C96963-W4-${tv ? 'TV' : 'BV'}-reorder`);
  await go(d); R[d] = { before, right_after: now, afterReload: await ord(), message: msg, lead: ((await workOrders(a, n)).find((x: any) => x.id === w4.id))?.techAssignedFirstName ?? 'none' };
}
console.log(t(), JSON.stringify(R, null, 1).slice(0, 3000));
fs.writeFileSync(path.join(EV, 'C96963-w4.json'), JSON.stringify(R, null, 1));
await RUN.end(); await done(browser);
