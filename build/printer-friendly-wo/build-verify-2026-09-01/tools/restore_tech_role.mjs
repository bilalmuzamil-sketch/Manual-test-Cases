// restore_tech_role.mjs — put the shared Technician role back to the state recorded BEFORE any of
// this pass's writes, and prove it.
//
// WHAT HAPPENED. The Technician role (id 2d4b8464-81a9-4c1e-96c6-a2a64f02a389) was snapshotted at
// 09:xx today, before the only probe that edits it (probe_neg.mjs, N3), as:
//     view_mode = tech
//     permissions = customersView, scheduleView, woPickParts, woTechViewMode,
//                   workOrderLinesCreateAndEdit, workOrdersView
// That probe's restore was verified identical. At 12:25 the role read back as:
//     view_mode = full
//     permissions = customersView, scheduleView, woFullViewMode,
//                   workOrderLinesCreateAndEdit, workOrdersView
// so woTechViewMode became woFullViewMode and woPickParts was dropped. No script of this pass makes
// that change. The likely cause is MINE: the R1-role-screen-labels probe opened this role's EDIT
// screen in the browser and a keyboard sweep in that run is the same sweep that accidentally clocked
// the Admin into a work order. A stray Enter on the "View mode" radio would do exactly this.
//
// So this is a repair of my own damage, not a guess about what the role "should" be: the target is a
// snapshot of the role as it actually was, taken before any write, and held at
// /tmp/inl6597/ROLE-RESTORE.json.
import { apiGet, apiCall } from './boot9315.mjs';
import fs from 'fs';
const ROLE = '2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const target = JSON.parse(fs.readFileSync('/tmp/inl6597/ROLE-RESTORE.json', 'utf8'));
const codes = o => ((o?.fe_permissions) || []).map(p => p.code || p.name).sort();

const before = await apiGet(`/api/roles/${ROLE}`);
if (before.status !== 200) { console.log('READ FAILED', before.status); process.exit(2); }
const now = before.body.data;
console.log('CURRENT :', now.view_mode, codes(now));
console.log('TARGET  :', target.view_mode, codes(target));
if (now.view_mode === target.view_mode &&
    JSON.stringify(codes(now)) === JSON.stringify(codes(target))) {
  console.log('ALREADY MATCHES — nothing to do'); process.exit(0);
}
const put = await apiCall('PUT', `/api/roles/${ROLE}`, {
  name: target.name, description: target.description, view_mode: target.view_mode,
  cross_toggles: target.cross_toggles, template_id: target.template_id,
  fe_permissions: (target.fe_permissions || []).map(p => p.id),
});
console.log('PUT     :', put.status);
const after = await apiGet(`/api/roles/${ROLE}`);
const ok = after.body?.data?.view_mode === target.view_mode &&
           JSON.stringify(codes(after.body?.data)) === JSON.stringify(codes(target));
console.log('AFTER   :', after.body?.data?.view_mode, codes(after.body?.data));
console.log(ok ? 'RESTORE VERIFIED — identical to the pre-write snapshot'
              : 'RESTORE DID NOT TAKE — DO NOT PROCEED, report it');
fs.writeFileSync('build/printer-friendly-wo/build-verify-2026-09-01/evidence/tech-role-restore.json',
  JSON.stringify({ current_before_repair: { view_mode: now.view_mode, permissions: codes(now) },
                   target: { view_mode: target.view_mode, permissions: codes(target) },
                   put_status: put.status,
                   after: { view_mode: after.body?.data?.view_mode, permissions: codes(after.body?.data) },
                   verified: ok, at: new Date().toISOString() }, null, 1));
process.exit(ok ? 0 : 1);
