// s1_tz.mjs — 12 Nov 2026: read each staging location's time zone (GET only) to test whether the 18 A/R bucket moves are the PRD's
// plain-date rule (S1-R5a) applied in the location's own time zone, where the old report counted in UTC.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const s = await stgStart(new URL('./s1/', import.meta.url).pathname); const r = await s.api('/api/staff/my-workplaces');
const L = (r.j?.data?.collection || r.j?.data || []).map((w) => ({ id: w.id, name: w.name, tz: w.timezone || w.time_zone || w.workplace_timezone }));
fs.writeFileSync(new URL('./s1/locations-tz.json', import.meta.url).pathname, JSON.stringify(L, null, 1)); console.log(JSON.stringify(L).slice(0, 2000)); if (!L.length) console.log(JSON.stringify(r.j).slice(0, 800)); await s.close(); process.exit(0);
