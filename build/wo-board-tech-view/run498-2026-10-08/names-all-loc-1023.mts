/** names-all-loc-1023.mts — 23 Oct 2026, PRODUCTION, READ ONLY (location switched and put back). C707077 needs a technician whose STAFF
 *  RECORD name (/api/technicians .name) differs from the SIGN-IN name (/api/iam/view-profile/<user_id>). New records keep one name (L0554),
 *  so look at EVERY location for an existing person whose names differ. Positive control: Esther Howard read both ways first. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = { locations: [], diffs: [] };
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
const techsAll = async () => { const out: any[] = []; for (let pg = 1; pg < 30; pg++) { const c = list((await a.get(`/api/technicians?limit=200&per_page=200&page=${pg}`)).body); if (!c.length) break; out.push(...c); if (c.length < 200) break; } return out; };
const login = async (uid: string) => { const u = (await a.get(`/api/iam/view-profile/${uid}`)).body?.data; const x = u?.user ?? u; return x ? `${x.first_name ?? ''} ${x.last_name ?? ''}`.trim() : null; };
try {
  const wps = list((await a.get('/api/workplaces?limit=200')).body); o.workplaces = wps.map((w: any) => `${w.name} ${w.id}`);
  for (const w of wps) {
    const ch = await a.post('/api/iam/change-location', { workplace_id: w.id, workplace_timezone: 'Asia/Karachi' });
    const T = await techsAll(); let same = 0, unread = 0;
    for (const x of T) { if (!x.user_id) { unread++; continue; } const l = await login(x.user_id); if (l == null) { unread++; continue; }
      if (l === String(x.name).trim()) same++; else o.diffs.push({ location: w.name, workplace_id: w.id, staffRecord: x.name, signIn: l, user_id: x.user_id, tech_id: x.id, active: x.is_active ?? x.active }); }
    o.locations.push({ name: w.name, switch: ch.status, technicians: T.length, same, unread });
    if (!o.control) { const e = T.find((x: any) => /Esther Howard/.test(x.name)); if (e) o.control = { staffRecord: e.name, signIn: await login(e.user_id) }; }
  }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.restore = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' })).status; }
console.log(t(), 'NAMES-ALL', JSON.stringify({ locations: o.locations, control: o.control, diffs: o.diffs.slice(0, 10), error: o.error }));
fs.writeFileSync(path.join(EV, 'names-all-loc-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
