/** org-probe2-1022.mts — 22 Oct 2026, READ ONLY: production's organisation id, read from the app's own requests while Settings pages
 *  load (any /api/organizations/<uuid>/… call), then proved with GET /api/organizations/<org>/roles. */
import { open, done, APP } from './session.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const seen = new Set<string>();
p.on('request', (r) => { const m = /\/api\/organi[sz]ations\/([0-9a-f-]{36})/.exec(r.url()); if (m) seen.add(m[1]); });
for (const r of ['/administration/roles', '/administration/staff', '/settings', '/administration/roles-permissions', '/administration']) { await p.goto(APP + r, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(5000); if (seen.size) break; }
const o: any = { found: [...seen] };
for (const id of o.found) o['roles_' + id] = (await api(p).get(`/api/organizations/${id}/roles?pagination[rowsPerPage]=5`)).status;
console.log('ORG2', JSON.stringify(o)); await done(browser);
