/** role-probe-1026.mts — 26 Oct 2026, read-only: on the current branch, list custom roles whose name says view only, and print the shape of
 *  one role (GET /api/roles/<id>) so a "ZZAUTOTEST WO View Only" role can be made with POST /api/roles. */
import { open, done } from './session.mts'; import { api } from './data.mts'; import { t } from './wob.mts'; import { ORG } from './profile.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p);
const L = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
console.log(t(), 'ROLES', L.length, JSON.stringify(L.filter((r: any) => /view|zz/i.test(r.label ?? r.name ?? '')).map((r: any) => [r.label ?? r.name, r.id, r.usersCount ?? r.users_count])).slice(0, 1500));
const tech = L.find((r: any) => /^Technician$/.test(r.label ?? r.name ?? '')) ?? L[0];
const one = (await a.get(`/api/roles/${tech.id}`)).body; console.log('SHAPE', JSON.stringify(one).slice(0, 2500));
await done(browser);
