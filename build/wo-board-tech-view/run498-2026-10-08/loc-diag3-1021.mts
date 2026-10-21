/** loc-diag3-1021.mts — 21 Oct 2026, staging, READ ONLY: the runners' enrolments. As Admin (before switching): eligibilityOf() for the
 *  shared runner and the c21 runner; as the runner: GET /api/staff/my-workplaces. */
import { open, done } from './session.mts';
import { asRunner } from './runner.mts';
import { api } from './data.mts';
import { eligibilityOf, HEAVY } from './staff.mts';
const { browser, page: p0 } = await open('/workorders?tab=all'); const a0 = api(p0);
for (const e of ['zz.wob.runner@staging.shopview.local', 'zz.wob.runner.c21@staging.shopview.local']) console.log('ELIG', JSON.stringify(await eligibilityOf(a0, e)).slice(0, 700));
const RUN = await asRunner(browser, p0, a0); const a = api(RUN.p);
const w = await a.get('/api/staff/my-workplaces'); console.log('MYWP', w.status, JSON.stringify(w.body).slice(0, 600), 'HEAVY', String(HEAVY).slice(0, 8));
await RUN.end().catch(() => {});
await done(browser);
