/** RENAME PROBE (2026-10-09). Tech View groups old work orders under the staff member's CURRENT name, while the List's Lead
 * Technician column shows the name the work order STORED (S2-4132: staff record "Dylan Rush", column "Daniel Montoya").
 * Is that left-over branch data, or does the List keep a stale name after any rename? Make a technician, give them a work
 * order, rename them (the same call the Edit Staff Member screen makes), then read the List column, the Tech View group
 * and the work order page after a reload. Name put back afterwards. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab, search, groups } from './wob.mts';
import { person, roleIds, staffRows, HEAVY } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all'); const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const R: any = {};
const stamp = Date.now() % 100000; const ids = await roleIds(a); const tech = ids['Technician'];
const made = await person(a, 'ZZAUTOTEST', `RenameBefore ${stamp}`, { role: tech, email: `zz.wob.rename.${stamp}@staging.shopview.local`, clockable: true }); const st: any = made.row; R.staff = { name: `${st.first_name} ${st.last_name}`, staff_id: st.staff_id };
const c = await customer(a, `ZZAUTOTEST Rename Lead ${stamp}`, 'ZZRN-1'); const w = await workOrder(a, c, 'approved', st.staff_id); const num = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order?.number; R.wo = num;
const read = async (tag: string) => { const o: any = {};
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'List'); await search(p, `ZZAUTOTEST Rename Lead ${stamp}`); await p.waitForTimeout(3000);
  const heads = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.replace(/arrow_drop_(up|down)/, '').trim())`) as string[]; const li = heads.indexOf('Lead Technician');
  o.listColumn = await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.cells[${li}]?.innerText.trim()).filter(Boolean)`); await shot(p, `rename-${tag}-list`);
  await display(p, 'Tech View'); await p.waitForTimeout(3000); o.techGroups = ((await groups(p)) as any[]).filter((g) => g.rows?.length).map((g) => `${g.name ?? g.id}: ${g.rows.length}`); await shot(p, `rename-${tag}-tech`);
  await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.woPage = (await p.locator('body').innerText()).replace(/\s+/g, ' ').match(/Lead [Tt]echnician\s+([^\n]{0,40}?)\s+(Service|Sales)/)?.[1] ?? null; await shot(p, `rename-${tag}-wo`);
  const v = (await a.get(`/api/work-orders/view/${w}`)).body?.data?.work_order ?? {}; o.storedName = `${v.technician_first_name ?? ''} ${v.technician_last_name ?? ''}`.trim(); return o; };
R.before = await read('before');
const body = (first: string, last: string) => ({ first_name: first, last_name: last, email: st.email, role_id: tech, workplace_id: HEAVY, job_title: null, salary_type: null, salary: null, billable: 1, clockable: true, is_sales_rep: false });
R.rename = (await a.post(`/api/staff/${st.staff_id}/change`, body('ZZAUTOTEST', `RenameAfter ${stamp}`))).status; R.staffNow = (await staffRows(a, `RenameAfter ${stamp}`)).map((x: any) => `${x.first_name} ${x.last_name}`);
R.after = await read('after');
R.putBack = (await a.post(`/api/staff/${st.staff_id}/change`, body('ZZAUTOTEST', `RenameBefore ${stamp}`))).status;
console.log(t(), 'RENAME', JSON.stringify(R).slice(0, 3000)); fs.writeFileSync(path.join(EV, 'rename-probe.json'), JSON.stringify(R, null, 1)); await RUN.end(); await done(browser);
