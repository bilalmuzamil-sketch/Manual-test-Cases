/** names-scan-1023.mts — 23 Oct 2026, PRODUCTION, READ ONLY. QA lead "Try unblocking yourself" on C707077 (a technician whose staff
 *  record name differs from their sign-in name). New records keep one name (L0554), so look for an EXISTING person whose two names
 *  already differ, at every location: sign-in name from /api/staff (all pages), staff record name from /api/technicians, joined on
 *  user_id. Positive control: the join must match most people with equal names. Writes EV/names-scan-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const all = async (u: string) => { const out: any[] = []; for (let pg = 1; pg < 40; pg++) { const r = await a.get(`${u}${u.includes('?') ? '&' : '?'}limit=200&per_page=200&page=${pg}`); const c = (r.body?.data?.collection ?? r.body?.data ?? []) as any[]; if (!Array.isArray(c) || !c.length) break; out.push(...c); if (c.length < 200) break; } return out; };
const staff = await all('/api/staff'); const techs = await all('/api/technicians');
o.staffCount = staff.length; o.techCount = techs.length;
let same = 0; const diff: any[] = [];
for (const s of staff) { const tt = techs.find((x: any) => x.user_id === s.id); if (!tt) continue; const login = `${s.first_name} ${s.last_name}`.trim();
  if (String(tt.name).trim() === login) same++; else diff.push({ login, staffRecord: tt.name, active: s.is_active, role: s.role_label, staff_id: s.staff_id, user_id: s.id }); }
o.sameNames = same; o.differentNames = diff;
console.log(t(), 'SCAN', JSON.stringify({ staff: o.staffCount, techs: o.techCount, same, diff: diff.length, first: diff.slice(0, 5) }));
fs.writeFileSync(path.join(EV, 'names-scan-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
