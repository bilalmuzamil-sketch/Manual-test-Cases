/** notech-fix-1028.mts — 28 Oct 2026 (SV-11555 / C682436 set-up on a QA branch, notech-stg4 recipe): the two new locations
 *  "ZZAUTOTEST F2 No Tech Shop" and "ZZAUTOTEST Location Empty" were made by Admin ShopView, who was enrolled there and has Time Clock
 *  on, so it counts as a technician. Enrol the runner "ZZ WOB Runner" (Time Clock off) at both, then remove Admin ShopView's enrolment
 *  there with the app's own route (POST /api/staff/enrollment/remove {staffId, workplaceId, departmentId}), while the session stays at
 *  Staging Heavy Duty. Read the candidates at each location back (must be none). Output EV/notech-fix-1028.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, candidates } from './data.mts'; import { EV, t } from './wob.mts';
import { asRunner } from './runner.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { unenrol: [] as any[] };
const RUN: any = await asRunner(browser, p, a).catch((e: any) => ({ err: String(e?.message || e).slice(0, 200) })); o.runner = { staffId: RUN?.staffId, err: RUN?.err };
const L = (d: any) => (Array.isArray(d) ? d : d?.collection ?? []) as any[];
const wps = L((await a.get('/api/workplaces')).body?.data); const deps = L((await a.get('/api/departments')).body?.data); const dep = deps.find((d: any) => /service/i.test(d.name ?? d.label ?? '')) ?? deps[0];
o.deps = deps.map((d: any) => d.name ?? d.label);
const ADMIN = '7f85bc58-9ff5-4b50-b3f3-d85821069066';
for (const n of ['ZZAUTOTEST F2 No Tech Shop', 'ZZAUTOTEST Location Empty']) {
  const w = wps.find((x: any) => x.name === n); const r: any = { name: n, id: w?.id };
  if (RUN?.staffId) r.enrolRunner = (await a.post('/api/staff/enrollment/create', { staffId: RUN.staffId, workplaceId: w.id, departmentId: dep?.id })).status;
  r.remove = []; for (const d of deps) { const x = await a.post('/api/staff/enrollment/remove', { staffId: ADMIN, workplaceId: w.id, departmentId: d.id }); r.remove.push(`${d.name ?? d.label}:${x.status}`); }
  r.change = (await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: 'Asia/Karachi' })).status; r.technicians = await candidates(a);
  o[n] = r;
}
o.back = (await a.post('/api/iam/change-location', { workplace_id: process.env.WOB_LOC1, workplace_timezone: 'Asia/Karachi' })).status;
fs.writeFileSync(path.join(EV, 'notech-fix-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 2500)); await done(browser);
