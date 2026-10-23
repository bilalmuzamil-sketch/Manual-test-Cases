/** names-all-loc2-1023.mts — 23 Oct 2026 (v2: sign-in names from Settings > Staff /api/staff, since /api/iam/view-profile answers 404 for other users), PRODUCTION, READ ONLY (location switched and put back). C707077 needs a technician whose STAFF
 *  RECORD name (/api/technicians .name) differs from the SIGN-IN name (/api/iam/view-profile/<user_id>). New records keep one name (L0554),
 *  so look at EVERY location for an existing person whose names differ. Positive control: Esther Howard read both ways first. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { locations: [], diffs: [] };
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
const techsAll = async () => { const out: any[] = []; for (let pg = 1; pg < 30; pg++) { const c = list((await a.get(`/api/technicians?limit=200&per_page=200&page=${pg}`)).body); if (!c.length) break; out.push(...c); if (c.length < 200) break; } return out; };
const S = new Map<string, string>(); const staffAll = async () => { for (const q of ['pagination[rowsPerPage]=1000', 'pagination[rowsPerPage]=1000&status=inactive', 'pagination[rowsPerPage]=1000&is_active=0']) { const c = list((await a.get(`/api/staff?${q}`)).body); for (const x of c) S.set(x.id, `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim()); } };
const byName = async (x: any) => { if (S.has(x.user_id)) return; for (const w of String(x.name).split(/\s+/).filter(Boolean).slice(0, 2)) { const c = list((await a.get(`/api/staff?search=${encodeURIComponent(w)}&pagination[rowsPerPage]=200`)).body); for (const y of c) S.set(y.id, `${y.first_name ?? ''} ${y.last_name ?? ''}`.trim()); if (S.has(x.user_id)) return; } };
const login = async (uid: string) => S.get(uid) ?? null;
try {
  const wps = list((await a.get('/api/workplaces?limit=200')).body); o.workplaces = wps.map((w: any) => `${w.name} ${w.id}`);
  for (const w of wps) {
    const ch = await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: 'Asia/Karachi' });
    await staffAll(); const T = await techsAll(); let same = 0, unread = 0;
    for (const x of T) { if (!x.user_id) { unread++; continue; } await byName(x); const l = await login(x.user_id); if (l == null) { unread++; continue; }
      if (l === String(x.name).trim()) same++; else o.diffs.push({ location: w.name, workplace_id: w.id, staffRecord: x.name, signIn: l, user_id: x.user_id, tech_id: x.id, active: x.is_active ?? x.active }); }
    o.locations.push({ name: w.name, switch: ch.status, staffKnown: S.size, technicians: T.length, same, unread });
    if (!o.control) { const e = T.find((x: any) => /Carol Neal/.test(x.name)); if (e) o.control = { staffRecord: e.name, signIn: await login(e.user_id) }; }
  }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.restore = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' })).status; }
console.log(t(), 'NAMES-ALL2', JSON.stringify({ locations: o.locations, control: o.control, diffs: o.diffs.slice(0, 10), error: o.error }));
fs.writeFileSync(path.join(EV, 'names-all-loc2-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
