/**
 * role-viewonly-stg4.mts — 15 Oct 2026, runs at the START of the fourth pass on STAGING (before any view-only case).
 * WHY: s9-fix7.mts (C97012) switched Work orders > Create & Edit ON in the role "ZZAUTOTEST WO View Only" and stopped before
 * switching it off, so C97020's "view-only" user could open Reassign lead technician (judge/wave8b.json). This puts the role back
 * to Work orders > View only — every work-orders permission other than View taken off (Create & Edit, Delete) — and reads it back
 * (GET /api/roles/<id>). The role is found in the organisation's role list, which on staging is a PLAIN list (L0339); the known
 * staging id is the fallback. Exit 0 only when the read-back shows View on and Create & Edit off.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const R: any = {};
R.exitSwitch = (await a.post('/api/exit-switch-user', {}).catch(() => ({ status: 0 }))).status;
const ORG = (await import('./profile.mts')).ORG;
const rl = (await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data; const roles: any[] = Array.isArray(rl) ? rl : rl?.collection ?? [];
const rid = roles.find((r) => (r.label ?? r.name) === 'ZZAUTOTEST WO View Only')?.id ?? '8e20d1b6-83e5-4996-8d2b-54d2cd0c4e32';
R.role = rid;
const code = (x: any) => String(x?.code ?? x?.name ?? x);
const isWo = (c: string) => /^workOrders/i.test(c);
const cur = (await a.get(`/api/roles/${rid}`)).body?.data; const perms: any[] = cur?.fe_permissions ?? [];
R.before = perms.map(code).filter(isWo);
const keep = perms.filter((x) => !isWo(code(x)) || /^workOrdersView$/i.test(code(x))).map((x) => x.id);
let ok = false;
if (R.before.some((c: string) => !/^workOrdersView$/i.test(c))) {
  const r = await a.put(`/api/roles/${rid}`, { name: cur.name, description: cur.description, view_mode: cur.view_mode, template_id: cur.template_id, fe_permissions: keep, cross_toggles: cur.cross_toggles });
  R.put = r.status;
} else R.put = 'nothing to change';
const after = ((await a.get(`/api/roles/${rid}`)).body?.data?.fe_permissions ?? []).map(code);
R.after = after.filter(isWo); ok = R.after.includes('workOrdersView') && !R.after.some((c: string) => /CreateAndEdit|Delete/i.test(c));
R.viewOnly = ok;
console.log(t(), 'ROLE-VIEW-ONLY', JSON.stringify(R)); fs.writeFileSync(path.join(EV, 'role-viewonly-stg4.json'), JSON.stringify(R, null, 1));
await done(browser, ok ? 0 : 4);
