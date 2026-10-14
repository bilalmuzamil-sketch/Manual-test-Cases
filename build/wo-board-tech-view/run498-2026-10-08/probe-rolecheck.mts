/** 15 Oct 2026 — read-only check of the L0339 fix: the patched role-list reading finds "ZZAUTOTEST WO View Only" on staging,
 *  and GET /api/roles/<id> (what the scripts' roleRead uses) answers for it. */
import { open, done } from './session.mts';
import { api } from './data.mts';
import { ORG } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const v = rolesL.find((r) => /^ZZAUTOTEST WO View Only$/.test(r.label ?? r.name ?? '')); const ad = rolesL.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''));
const rr = v ? await a.get(`/api/roles/${v.id}`) : null;
console.log(JSON.stringify({ count: rolesL.length, view: v?.id, admin: ad?.id, read: rr ? { status: rr.status, keys: Object.keys(rr.body?.data ?? {}), name: rr.body?.data?.name, fe: (rr.body?.data?.fe_permissions ?? []).length, cross: rr.body?.data?.cross_toggles } : null }));
await done(browser);
