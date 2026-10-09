/**
 * C368191 data hunt (2026-10-09): the app refuses to delete a staff member who has labor ("Staff is being used
 * elsewhere"), even after clock-out, so the case's state cannot be made on this branch. Look for it in the branch's
 * existing data instead: a work order line whose labor technician no longer exists (the screen then reads
 * "Deleted user" — c_helpers: first_name 'Unassigned', no last name, !tech_exists). Read-only; admin session.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { EV, t, shot } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const R: any = { scanned: 0, hits: [] as any[] };
for (let page = 1; page <= 15 && R.hits.length < 3; page++) {
  const r = await a.get(`/api/work-orders?pagination[page]=${page}&pagination[rowsPerPage]=100&pagination[sortBy]=createdAt&pagination[descending]=false`);
  const wos: any[] = r.body?.data?.work_orders ?? []; if (!wos.length) break;
  for (const w of wos) { R.scanned++; const lr = await a.get(`/api/work-orders/lines/${w.id}`).catch(() => null); const j = JSON.stringify(lr?.body?.data ?? '');
    if (/"tech_exists":\s*false/.test(j)) { R.hits.push({ id: w.id, number: w.number, status: w.status }); if (R.hits.length >= 3) break; } }
  console.log(t(), 'page', page, 'scanned', R.scanned, 'hits', R.hits.length);
}
for (const h of R.hits.slice(0, 2)) { await p.goto(`${APP}/workorders/${h.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  h.labor = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); h.deletedUser = (h.labor as string[]).some((x) => /Deleted user/i.test(x)); await shot(p, `C368191-found-${h.number}`); }
console.log(t(), 'C368191hunt', JSON.stringify(R).slice(0, 2000)); fs.writeFileSync(path.join(EV, 'deleted-search.json'), JSON.stringify(R, null, 1)); await done(browser);
