// s9_zone_src.mjs — 12 Nov 2026, staging: where does the aging day count take its time zone from? Prints every field named like *zone* in
// the QA lead's profile, workplaces and the session's "me" answers (values only for zone fields). Read-only.
import { stgStart } from './stglib.mjs';
const s = await stgStart(new URL('./s9/', import.meta.url).pathname); const out = {};
const walk = (o, path, acc) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { const pth = path + '.' + k; if (/zone|default_workplace|current_workplace|workplace_id|location_id/i.test(k) && (typeof v !== 'object' || v === null)) acc[pth] = v; walk(v, pth, acc); } return acc; };
for (const u of ['/api/iam/view-profile/', '/api/auth/me', '/api/iam/me', '/api/staff/my-workplaces', '/api/settings/organization', '/api/organization']) { const r = await s.api(u); out[u] = r.st === 200 ? walk(r.j, '', {}) : r.st; }
console.log(JSON.stringify(out).slice(0, 3000)); await s.close(); process.exit(0);
