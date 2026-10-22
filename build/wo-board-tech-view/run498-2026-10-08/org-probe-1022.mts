/** org-probe-1022.mts — 22 Oct 2026, READ ONLY: find the signed-in user's organisation id on an environment where discover-profile.mts
 *  found none (production): tries the endpoints that carry it and prints which answered. */
import { open, done } from './session.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const find = (x: any): string | null => { const s = JSON.stringify(x ?? {}); const m = /"organi[sz]ation_?[iI]d"\s*:\s*"([0-9a-f-]{36})"/.exec(s); return m ? m[1] : null; };
for (const u of ['/api/auth/me', '/api/iam/me', '/api/users/me', '/api/auth/me/fe-permissions', '/api/staff?limit=1', '/api/staff/my-workplaces', '/api/work-orders?pagination[rowsPerPage]=1', '/api/organizations/current', '/api/organization']) {
  const r = await a.get(u); o[u] = { status: r.status, org: find(r.body) }; }
const raw = await p.evaluate(`JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k => [k, (localStorage.getItem(k) || '').slice(0, 4000)])))`).catch(() => '{}'); o.orgMentions = [...String(raw).matchAll(/organi[sz]ation[^,]{0,120}/gi)].map((m) => m[0]).slice(0, 8);
const ls = await p.evaluate(`JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])))`).catch(() => '{}');
o.localStorage = find(JSON.parse(ls as string)); console.log('ORG', JSON.stringify(o)); await done(browser);
