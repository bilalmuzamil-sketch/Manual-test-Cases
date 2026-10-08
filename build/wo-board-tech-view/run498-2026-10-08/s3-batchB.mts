/** S3 Board View, batch B (2026-10-08): C96943 card required fields (real TRK-118 unit), C96950 / C368131 empty texts for
 *  a reassigning user vs a view-only user, C154886 / C368132 dropping on empty columns. Everything changed is put back. */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder, vehicle } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn } from './wob.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), JW = await sid('jenny.wilson'), TW = await sid('theresa.webb'), VO = await sid('viewonly');
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const bv = async (n: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Board View'); if (n) await search(p, n); };
const col = async (id: string) => { await toColumn(p, id); return (await boardCols(p)).find((c) => c.id === id) ?? null; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 1800));
  fs.writeFileSync(path.join(EV, 's3-batchB.json'), JSON.stringify(R, null, 1));
}
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
async function asVO<T>(f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: VO.id }); if (s.status >= 300) throw new Error(`switch ${s.status} ${JSON.stringify(s.body).slice(0, 160)}`);
  await p.waitForTimeout(800); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  try { return await f(); } finally { const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); await p.waitForTimeout(800); }
}
// the view-only role really is view-only (read from the role itself)
const voRole = (await a.get(`/api/roles/${VO.role_id}`)).body?.data;
R.viewOnlyRole = { label: VO.role_label, perms: (voRole?.fe_permissions ?? []).map((x: any) => x.code) };
console.log(t(), 'view-only role', JSON.stringify(R.viewOnlyRole));

await run('C96943', async () => {
  const n = 'ZZAUTOTEST F2 Card Required Fields';
  let wos = (await workOrders(a, n)).filter((w: any) => w.unit === 'TRK-118' || w.vehicleModelName !== 'Transit');
  const c = await customer(a, n, 'TRK-118');
  const vT = await vehicle(a, c, 'TRK-118'), v0 = await vehicle(a, c, '');
  const w1 = await workOrder(a, { ...c, vehicle_id: vT }, 'approved', ES.staff_id), w2 = await workOrder(a, { ...c, vehicle_id: v0 }, 'approved', ES.staff_id);
  wos = (await workOrders(a, n)).filter((w: any) => w.id === w1 || w.id === w2);
  R.C96943 = { wos: wos.map((w: any) => `${w.number} unit=${w.unit ?? '(none)'}`) };
  await bv(n);
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(900);
  const items = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=switch], .q-menu [role=checkbox]')].map(e => ({ label: e.getAttribute('aria-label'), on: e.getAttribute('aria-checked') }))`) as any[];
  R.C96943.pickerLabels = items.map((x) => x.label);
  for (const it of items) if (it.on === 'true') { await p.locator(`.q-menu [aria-label="${it.label}"]`).first().click(); await p.waitForTimeout(400); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500); await toColumn(p, ES.staff_id);
  R.C96943.cards = await p.evaluate(`${JSON.stringify(wos.map((w: any) => w.id))}.map(id => { const c = document.querySelector('[data-test-id="board_card_' + id + '"]'); return c ? { text: c.innerText.replace(/\\s+/g, ' ').trim(), unit: (c.querySelector('[data-test-id="board_card_unit"]') || {}).textContent?.trim() ?? null, status: (c.querySelector('[data-test-id="board_card_status"]') || {}).textContent?.trim() ?? null, number: (c.querySelector('[data-test-id="board_card_number"]') || {}).textContent?.trim() ?? null } : null; })`);
  await shot(p, 'C96943-cards-minimal');
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(800);
  for (const it of items) if (it.on === 'true') { const e = p.locator(`.q-menu [aria-label="${it.label}"]`).first(); if ((await e.getAttribute('aria-checked')) !== 'true') { await e.click(); await p.waitForTimeout(300); } }
  await p.keyboard.press('Escape');
});

await run('C96950', async () => {
  const n = 'ZZAUTOTEST F2 Empty Columns';
  await seedCase(a, n, 'ZZF3EC', [{ lead: ES.staff_id }]);
  await bv(n);
  R.C96950 = { admin: { jenny: (await col(JW.staff_id))?.empty, unassigned: (await col('unassigned'))?.empty } }; await shot(p, 'C96950-admin');
  R.C96950.viewOnly = await asVO(async () => { await bv(n); const o = { jenny: (await col(JW.staff_id))?.empty, unassigned: (await col('unassigned'))?.empty }; await shot(p, 'C96950-viewonly'); return o; });
});

await run('C154886', async () => {
  const n = 'ZZAUTOTEST F2 Board Empty Unassigned';
  const wos = await seedCase(a, n, 'ZZF3EU', [{ lead: ES.staff_id }, { lead: ES.staff_id }]);
  await bv(n);
  const first = (await boardCols(p))[0];
  R.C154886 = { firstColumn: first?.name, unassigned: await col('unassigned'), esther: (await col(ES.staff_id))?.count };
  const w2 = wos[wos.length - 1];
  await toColumn(p, ES.staff_id);
  await drag(p, `[data-test-id="board_card_${w2.id}"]`, '[data-test-id="board_column_unassigned"]', 120);
  R.C154886.moved = w2.number; R.C154886.after = { unassigned: (await col('unassigned'))?.cards, esther: (await col(ES.staff_id))?.count };
  R.C154886.toast = await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`); await shot(p, 'C154886-after-drop');
});

await run('C368132', async () => {
  const n = 'ZZAUTOTEST F2 Empty Tech Column';
  const wos = await seedCase(a, n, 'ZZF3ET', [{ lead: ES.staff_id }, { lead: ES.staff_id }]);
  await bv(n);
  const j = await col(JW.staff_id);
  R.C368132 = { jenny: j && { count: j.count, empty: j.empty } };
  R.C368132.hideControls = await p.evaluate(`[...document.querySelectorAll('button, [role=menuitem], [role=switch], label')].map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(x => /hide|empty|show only/i.test(x))`);
  await p.locator(`[data-test-id="button_board_fields_selection"]`).click(); await p.waitForTimeout(800);
  R.C368132.fieldsMenuMentionsEmpty = /empty|hide/i.test(await p.evaluate(`(document.querySelector('.q-menu') || {}).innerText || ''`) as string); await p.keyboard.press('Escape');
  const w2 = wos[wos.length - 1]; await toColumn(p, JW.staff_id);
  const espot = await p.locator(`[data-test-id="board_column_${ES.staff_id}"]`).count();
  if (!espot) { await toColumn(p, ES.staff_id); }
  // both columns on screen: Esther Howard and Jenny Wilson sit near each other alphabetically
  await drag(p, `[data-test-id="board_card_${w2.id}"]`, `[data-test-id="board_column_${JW.staff_id}"]`, 120);
  R.C368132.after = { jenny: (await col(JW.staff_id))?.count, esther: (await col(ES.staff_id))?.count };
  await shot(p, 'C368132-after-drop');
});

await run('C368131', async () => {
  const n = 'ZZAUTOTEST F2 Pinned Gone';
  const [w] = await seedCase(a, n, 'ZZF3PG', [{ lead: ES.staff_id }]);
  const pinsBefore: string[] = (await prefs()).pinnedTechnicianIds ?? [];
  await bv(n);
  const setPins = async (ids: string[]) => { for (const id of (await prefs()).pinnedTechnicianIds ?? []) { if (await toColumn(p, id)) { await p.locator(`[data-test-id="button_board_pin_${id}"]`).click(); await p.waitForTimeout(1000); } } for (const id of ids) { await toColumn(p, id); await p.locator(`[data-test-id="button_board_pin_${id}"]`).click(); await p.waitForTimeout(1200); } };
  await setPins([JW.staff_id, TW.staff_id]);
  await asVO(async () => { await bv(n); for (const id of [JW.staff_id, TW.staff_id]) { await toColumn(p, id); const b = p.locator(`[data-test-id="button_board_pin_${id}"]`); if ((await b.getAttribute('aria-pressed')) !== 'true') { await b.click(); await p.waitForTimeout(1000); } } });
  // step 1 and 2: Jenny Wilson deactivated, Theresa Webb moved off this location
  const d1 = await a.post('/api/iam/change-status', { id: JW.id });
  const tw = await sid('theresa.webb');
  const d2 = await a.post(`/api/staff/${tw.staff_id}/change`, { first_name: tw.first_name, last_name: tw.last_name, email: tw.email, role_id: tw.role_id, workplace_id: LETH, job_title: tw.job_title, salary_type: tw.salary_type, salary: tw.salary, billable: tw.billable, clockable: tw.clockable });
  R.C368131 = { jennyDeactivated: d1.status, theresaMoved: d2.status, theresaNow: (await sid('theresa.webb'))?.defaultWorkplaceName };
  try {
    await bv(n);
    const cs = await boardCols(p);
    R.C368131.admin = { first: cs.slice(0, 4).map((c) => `${c.name} pin:${c.pinned} empty:${c.empty}`), jenny: cs.find((c) => c.id === JW.staff_id) ?? null, theresa: cs.find((c) => c.id === TW.staff_id) ?? null };
    await shot(p, 'C368131-admin');
    await toColumn(p, ES.staff_id);
    if (await p.locator(`[data-test-id="board_column_${JW.staff_id}"]`).count()) {
      await drag(p, `[data-test-id="board_card_${w.id}"]`, `[data-test-id="board_column_${JW.staff_id}"]`, 120);
    } else { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await drag(p, `[data-test-id="board_card_${w.id}"]`, `[data-test-id="board_column_${JW.staff_id}"]`, 120).catch((e) => { R.C368131.dragNote = String(e.message).slice(0, 80); }); }
    R.C368131.afterDrag = { lead: (await workOrders(a, n)).map((x: any) => `${x.number} lead=${x.techAssignedFirstName ?? '-'} ${x.techAssignedLastName ?? ''}`), toast: await p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 120))`) };
    R.C368131.viewOnly = await asVO(async () => { await bv(n); const cs2 = await boardCols(p); await shot(p, 'C368131-viewonly'); return cs2.slice(0, 4).map((c) => `${c.name} pin:${c.pinned} empty:${c.empty}`); });
  } finally {
    const r1 = await a.post('/api/iam/change-status', { id: JW.id });
    const tw2 = await sid('theresa.webb');
    const r2 = await a.post(`/api/staff/${tw2.staff_id}/change`, { first_name: tw2.first_name, last_name: tw2.last_name, email: tw2.email, role_id: tw2.role_id, workplace_id: HEAVY, job_title: tw2.job_title, salary_type: tw2.salary_type, salary: tw2.salary, billable: tw2.billable, clockable: tw2.clockable });
    R.C368131.restore = { jenny: r1.status, jennyActive: (await sid('jenny.wilson'))?.is_active, theresa: r2.status, theresaAt: (await sid('theresa.webb'))?.defaultWorkplaceName };
    await bv(''); await setPins(pinsBefore).catch(() => {});
    await asVO(async () => { await bv(''); for (const id of [JW.staff_id, TW.staff_id]) { if (await toColumn(p, id)) { const b = p.locator(`[data-test-id="button_board_pin_${id}"]`); if ((await b.getAttribute('aria-pressed')) === 'true') { await b.click(); await p.waitForTimeout(1000); } } } }).catch(() => {});
  }
});

fs.writeFileSync(path.join(EV, 's3-batchB.json'), JSON.stringify(R, null, 1));
await done(browser);
