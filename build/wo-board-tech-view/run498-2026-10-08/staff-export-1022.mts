/** staff-export-1022.mts — 22 Oct 2026, READ ONLY: the standard test people the run 498 scripts look up (zz.wob.* plus the named
 *  staging people), with role, clockable, billable, active and departments, so production can be given the same people. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const out: any[] = [];
for (const q of ['zz.wob.', 'Ayesha Khan', 'Esther Howard', 'Ralph Edwards', 'Billy Nobill', 'Ina Active', 'Olive Office', 'Nick Noclock', 'Admin ShopView']) {
  const r = await a.get(`/api/staff?limit=200&search=${encodeURIComponent(q)}`); const rows = r.body?.data?.collection ?? [];
  for (const x of rows) if (!out.find((y) => y.id === x.id)) out.push({ id: x.id, staff_id: x.staff_id, first: x.first_name, last: x.last_name, email: x.email, role: x.role_label, active: x.is_active, clockable: x.clockable, billable: x.billable, salary_type: x.salary_type, departments: x.departments ?? x.department_names ?? null, workplace: x.defaultWorkplaceName });
}
fs.writeFileSync(path.join(EV, 'staff-export-1022.json'), JSON.stringify(out, null, 1)); console.log('STAFF', out.length, JSON.stringify(out.map((x) => `${x.first} ${x.last} | ${x.email} | ${x.role} | act ${x.active} | clk ${x.clockable} | bill ${x.billable}`)).slice(0, 6000)); await done(browser);
