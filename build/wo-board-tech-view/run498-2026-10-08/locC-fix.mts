/** locC-fix.mts — 20 Oct 2026: C682436 needs {Location-C} "ZZAUTOTEST Location Empty" with NO technicians and NO work orders. The 20 Oct
 *  prep showed "No work orders yet" there (the state for a location WITH technicians), so: switch the runner to it on screen, read the
 *  lead-technician candidates and work orders there, take each candidate's enrolment at that location away (every department), read back,
 *  switch back to Heavy Duty. Output EV/locC-fix.json. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates } from './data.mts';
import { EV, t, switchLocUI } from './wob.mts';
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; const a = api(p); const o: any = {};
const wps = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/workplaces')).body?.data); const C = wps.find((x: any) => x.name === 'ZZAUTOTEST Location Empty');
if (!C) throw new Error('no Location C');
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.switched = await switchLocUI(p, C.name);
o.before = await candidates(a); o.wos = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/work-orders?limit=5')).body?.data).length;
const depts = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/departments')).body?.data);
o.removed = [] as any[];
for (const c of o.before) for (const d of depts.length ? depts : [{ id: null }]) { const r = await a.post('/api/staff/enrollment/remove', { staffId: c.id, workplaceId: C.id, departmentId: d.id }); if (r.status < 300) o.removed.push(`${c.name} / ${d.name ?? d.label ?? '-'}`); }
o.after = await candidates(a);
o.back = await switchLocUI(p, 'Staging Heavy Duty - 9919');
fs.writeFileSync(path.join(EV, 'locC-fix.json'), JSON.stringify(o, null, 1)); console.log(t(), 'locC-fix', JSON.stringify(o).slice(0, 2000));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
