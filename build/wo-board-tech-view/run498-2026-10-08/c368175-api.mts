/** 15 Oct 2026, READ ONLY — C368175 step 4 (Edit Line > Add Technician). The screen list stops at about 100 names (SV-11393), so
 *  it cannot show whether company B's technician would be offered further down. This reads the WHOLE list the window asks the server
 *  for (GET /api/work-orders/<id>/line-technicians, the call the window makes, seen in orgb-fix3's log) and the lead candidates, and
 *  looks for company B's ids (orgb-seed-stg.json) and the name "OrgB". Positive control: our own "Ralph Edwards" and "ZZAUTOTEST Ana
 *  Alpha" must be in the same answer, and the answer must be longer than the ~100 the screen shows. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const B = JSON.parse(fs.readFileSync(path.join(EV, 'orgb-seed-stg.json'), 'utf8')); const o: any = { orgBIds: (B.ids ?? []).length };
const w = (await workOrders(a, 'ZZAUTOTEST Other Org Lists'))[0]; o.wo = w?.number;
const r = await a.get(`/api/work-orders/${w.id}/line-technicians`); const body = JSON.stringify(r.body ?? ''); o.status = r.status;
const d = r.body?.data; const list = (Array.isArray(d) ? d : d?.technicians ?? d?.collection ?? d?.staff ?? []) as any[];
const nm = (x: any) => `${x.firstName ?? x.first_name ?? ''} ${x.lastName ?? x.last_name ?? ''}`.trim();
o.count = list.length; o.keys = Object.keys(list[0] ?? {}).slice(0, 12); o.names = list.map(nm); o.lastNames = o.names.slice(-5);
o.orgBByName = o.names.filter((n: string) => /OrgB/i.test(n)); o.orgBById = (B.ids ?? []).filter((id: string) => body.includes(id)).length;
o.controlRalph = o.names.some((n: string) => /Ralph Edwards/.test(n)); o.controlAna = o.names.some((n: string) => /Ana Alpha/.test(n));
const c = ((await a.get('/api/work-orders/lead-technician-candidates')).body?.data?.technicians ?? []) as any[]; o.leadCount = c.length; o.leadOrgB = c.filter((x) => /OrgB/i.test(nm(x)) || (B.ids ?? []).includes(x.staffId)).length;
// the lists' own source (L0388: the page sends GET /api/technicians and /api/technicians?clockableOnly=1): read every page
for (const q of ['/api/technicians', '/api/technicians?clockableOnly=1']) { const all: any[] = []; let page = 1, info: any = null;
  for (; page <= 20; page++) { const rr = await a.get(`${q}${q.includes('?') ? '&' : '?'}page=${page}&pagination[page]=${page}&pagination[rowsPerPage]=100`); const dd = rr.body?.data; const arr = (Array.isArray(dd) ? dd : dd?.technicians ?? dd?.collection ?? []) as any[];
    info = { status: rr.status, pag: JSON.stringify(rr.body?.pagination ?? dd?.pagination ?? rr.body?.meta ?? null).slice(0, 160) }; const before = all.length; for (const x of arr) if (!all.some((y) => (y.id ?? y.staffId) === (x.id ?? x.staffId))) all.push(x); if (all.length === before) break; }
  const names = all.map(nm); const bodyAll = JSON.stringify(all);
  o[q] = { count: all.length, pages: page, info, last: names.slice(-3), orgBByName: names.filter((n) => /OrgB/i.test(n)), orgBById: (B.ids ?? []).filter((id: string) => bodyAll.includes(id)).length, controlRalph: names.some((n) => /Ralph Edwards/.test(n)), controlAna: names.some((n) => /Ana Alpha/.test(n)), controlZ: names.filter((n) => /^Z/i.test(n)).length }; }
delete o.names; fs.writeFileSync(path.join(EV, 'c368175-api.json'), JSON.stringify(o, null, 1)); console.log(t(), 'API', JSON.stringify(o).slice(0, 1200)); await done(browser);
