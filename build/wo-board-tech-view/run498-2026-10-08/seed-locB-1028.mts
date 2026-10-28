/** seed-locB-1028.mts — 28 Oct 2026 (Rule 107, SV-11555 / C682436 set-up): at "ZZAUTOTEST F2 No Tech Shop" make two Approved work orders
 *  with no lead (customer "ZZAUTOTEST F2 No Tech Shop Co"), then read the lead-technician candidates there (must be none) and the
 *  work orders by tab; then go back to Staging Heavy Duty. Output EV/seed-locB-1028.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, customer, workOrder, workOrders, candidates } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const wps = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/workplaces')).body?.data) as any[];
const B = wps.find((w) => w.name === 'ZZAUTOTEST F2 No Tech Shop'); const C = wps.find((w) => w.name === 'ZZAUTOTEST Location Empty');
o.ids = { B: B?.id, C: C?.id };
for (const [k, w] of [['C', C], ['B', B]] as any) {
  o[k] = { change: (await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: 'Asia/Karachi' })).status };
  if (k === 'B') { const have = await workOrders(a, 'ZZAUTOTEST F2 No Tech Shop Co'); if (have.length < 2) { const c = await customer(a, 'ZZAUTOTEST F2 No Tech Shop Co', 'ZZNT1'); for (let i = have.length; i < 2; i++) await workOrder(a, c, 'approved', null); }
    o.B.wos = (await workOrders(a, 'ZZAUTOTEST F2 No Tech Shop Co')).map((x: any) => `${x.number} ${x.status}`); }
  o[k].technicians = await candidates(a);
}
o.back = (await a.post('/api/iam/change-location', { workplace_id: process.env.WOB_LOC1, workplace_timezone: 'Asia/Karachi' })).status;
fs.writeFileSync(path.join(EV, 'seed-locB-1028.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o)); await done(browser);
