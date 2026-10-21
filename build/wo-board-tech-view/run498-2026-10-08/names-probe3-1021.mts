/** names-probe3-1021.mts — 21 Oct 2026, READ ONLY: for Esther Howard and Ralph Edwards (C581895's technicians when C581895_SAME_NAMES=1), the
 *  staff record name (/api/technicians) next to the login name (/api/staff, what Settings > Staff shows), joined on user_id. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV } from './wob.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const tr = await a.get('/api/technicians?limit=1000&per_page=1000'); o.techCount = (tr.body?.data?.collection ?? []).length; o.meta = JSON.stringify(tr.body?.data ?? {}).replace(/"collection":\[.*\]/, '').slice(0, 300);
const techs = ((await a.get('/api/technicians?limit=1000&per_page=1000')).body?.data?.collection ?? []) as any[];
for (const q of ['Esther', 'Ralph']) {
  const st = ((await a.get(`/api/staff?limit=50&search=${q}`)).body?.data?.collection ?? []) as any[];
  o[q] = st.map((s: any) => { const t = techs.find((x: any) => x.user_id === s.id); return { login: `${s.first_name} ${s.last_name}`, email: String(s.email).replace(/^(.{6}).*@/, '$1…@'), active: s.is_active, staffRecord: t ? t.name : '(not in technicians list)' }; });
}
fs.writeFileSync(path.join(EV, 'names-probe3-1021.json'), JSON.stringify(o, null, 1)); console.log('NAMES3', JSON.stringify(o)); await done(browser);
