/** runner-loc2-1022.mts — 22 Oct 2026: C368226 (Work In Progress) and C368231 (Sales By Representative) need the report's Location filter,
 *  which a one-location user does not get; medium-fix3 runs as the runner "ZZ WOB Runner", enrolled at the profile's first location only.
 *  Enrol the runner at the second location as well (same department as at the first, else the first department), read the enrolments back. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
import { staffRows, HEAVY, LETH } from './staff.mts'; import { RUNNER_EMAIL } from './runner.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { runner: RUNNER_EMAIL };
try {
  const r = (await staffRows(a, RUNNER_EMAIL))[0]; if (!r) throw new Error('runner not found');
  const deps = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data);
  const dep = (deps.find((d: any) => (d.name ?? d.label) === 'Service') ?? deps[0])?.id;
  const res = await a.post('/api/staff/enrollment/create', { staffId: r.staff_id, workplaceId: LETH, departmentId: dep });
  o.enrol = `${res.status} ${JSON.stringify(res.body).slice(0, 160)}`; o.heavy = HEAVY.slice(0, 8); o.leth = LETH.slice(0, 8);
  o.after = JSON.stringify((await staffRows(a, RUNNER_EMAIL))[0] ?? null).slice(0, 600);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 200); }
console.log(t(), 'RUNNER-LOC2', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'runner-loc2-1022.json'), JSON.stringify(o, null, 1)); await done(browser);
