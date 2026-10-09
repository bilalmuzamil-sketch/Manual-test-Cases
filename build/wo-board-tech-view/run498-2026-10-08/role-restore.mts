/** RESTORE (2026-10-09): the refused-drop check (C97012) adds Work orders > Create & Edit to 'ZZAUTOTEST WO View Only' for a
 * moment and takes it off at the end; its 12:20 run stopped part-way, so the role was left WITH Create & Edit and the
 * view-only user could open Reassign lead technician. Take Create & Edit off again and read the role back. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
import { roleIds, staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const R: any = {};
R.exitSwitch = (await a.post('/api/exit-switch-user', {}).catch(() => ({ status: 0 }))).status;
// FIX: the role list endpoint did not include it; find the role the way the other scripts do (from the staff list)
const ids = await roleIds(a); const rid = ids['ZZAUTOTEST WO View Only'] ?? (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0]?.role_id; R.roleFound = !!rid;
if (!rid) throw new Error('role not found'); const role = { id: rid };
const cur = (await a.get(`/api/roles/${role.id}`)).body?.data; const perms = cur?.fe_permissions ?? [];
R.before = { count: perms.length, createEdit: perms.some((x: any) => x.code === 'workOrdersCreateAndEdit' || x.name === 'workOrdersCreateAndEdit') };
const keep = perms.filter((x: any) => !(x.code === 'workOrdersCreateAndEdit' || x.name === 'workOrdersCreateAndEdit')).map((x: any) => x.id);
const r = await a.put(`/api/roles/${role.id}`, { name: cur.name, description: cur.description, view_mode: cur.view_mode, template_id: cur.template_id, fe_permissions: keep, cross_toggles: cur.cross_toggles }); R.put = r.status;
const after = ((await a.get(`/api/roles/${role.id}`)).body?.data?.fe_permissions ?? []); R.after = { count: after.length, createEdit: after.some((x: any) => x.code === 'workOrdersCreateAndEdit' || x.name === 'workOrdersCreateAndEdit'), workOrders: after.map((x: any) => x.code ?? x.name).filter((c: string) => /^wo|^workOrder/i.test(c)) };
console.log(t(), 'ROLE', JSON.stringify(R)); fs.writeFileSync(path.join(EV, 'role-restore.json'), JSON.stringify(R, null, 1)); await done(browser);
