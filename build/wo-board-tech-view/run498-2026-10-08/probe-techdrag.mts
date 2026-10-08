/** Tech View: dragging a row DOWN into the next group — where does the drop line land? Screens mid-drag; drop cancelled. */
import { open, done, APP } from './session.mts';
import { api, workOrders } from './data.mts';
import { staffRows } from './staff.mts';
import { t, shot, display, tab, search, groups } from './wob.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const ES = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0], RE = (await staffRows(a, 'zz.wob.ralph.edwards@staging.shopview.local'))[0];
const pref = (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...pref, pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const [w] = await workOrders(a, 'ZZAUTOTEST F1 Prompt Cancel');
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Tech View'); await search(p, 'ZZAUTOTEST F1 Prompt Cancel');
console.log(t(), JSON.stringify((await groups(p)).slice(0, 4).map((g) => `${g.name}(${g.count}) ${g.collapsed ? 'collapsed' : ''} [${g.rows}]`)));
const src = (await p.locator(`[data-test-id="tech_view_row_${w.id}"]`).boundingBox())!;
const tgtH = (await p.locator(`[data-test-id="tech_view_group_${RE.staff_id}"]`).boundingBox())!;
const tgtE = await p.locator(`[data-test-id="tech_view_group_empty_${RE.staff_id}"]`).boundingBox();
console.log(t(), 'src', JSON.stringify(src), 'header', JSON.stringify(tgtH), 'empty', JSON.stringify(tgtE));
const leadNow = async () => (await workOrders(a, 'ZZAUTOTEST F1 Prompt Cancel'))[0]?.techAssignedFirstName;
for (const [label, y] of [['header-middle', tgtH.y + tgtH.height / 2], ['empty-row-top', tgtE ? tgtE.y + 2 : tgtH.y + 50], ['header-top', tgtH.y + 4]] as [string, number][]) {
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id }); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, 'ZZAUTOTEST F1 Prompt Cancel');
  const src2 = (await p.locator(`[data-test-id="tech_view_row_${w.id}"]`).boundingBox())!;
  await p.mouse.move(src2.x + src2.width * 0.45, src2.y + src2.height / 2); await p.mouse.down(); await p.mouse.move(src2.x + src2.width * 0.45, src2.y + src2.height / 2 + 8, { steps: 4 });
  await p.mouse.move(src2.x + src2.width * 0.45, y, { steps: 25 }); await p.waitForTimeout(700); await shot(p, `probe-techdrag-${label}`);
  console.log(t(), label, 'drop-target marks', JSON.stringify(await p.evaluate(`[...document.querySelectorAll('[data-drop-target="true"], [class*=drop-target], [class*=drop-indicator], [data-dragover="true"]')].map(e => (e.getAttribute('data-test-id') || e.className).toString().slice(0, 60)).slice(0, 6)`)));
  await p.mouse.up(); await p.waitForTimeout(2500);
  const dlg = await p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count(); if (dlg) { await p.locator('[data-test-id="button_clear_shifts_keep"]').click(); await p.waitForTimeout(2000); }
  console.log(t(), label, 'prompt', dlg, 'lead now', await leadNow(), JSON.stringify(await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' '))`)));
}
await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id });
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value, pinnedTechnicianIds: ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'] } });
await done(browser);
