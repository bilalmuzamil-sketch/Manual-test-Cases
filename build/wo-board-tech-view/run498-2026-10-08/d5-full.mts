/** C368131 run in full (9 Oct 2026, after the D5 withdrawal): Jenny Wilson deactivated; Ayesha Khan really taken off
 *  Staging Heavy Duty - 9919 (main location moved to Lethbridge — the app refuses to remove the main location's
 *  enrolment — then the Heavy Duty enrolment removed). Judged for the admin AND the view-only person, on screen.
 *  Expected (case C368131): Jenny's pinned column stays, "No work orders", no drop; Ayesha is not pinned, shows as an
 *  ordinary column holding WO-2 with no pin icon; after WO-2 goes to Unassigned she has no column at all; the view-only
 *  person sees "No work orders" for Jenny and no Ayesha column. Everything put back in `finally`. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders } from './data.mts';
import { EV, t, display, tab, search, drag, boardCols, toColumn } from './wob.mts';
import { staffRows, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { setStaffLocation } from './staffloc.mts';
import type { Page } from 'playwright';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
const a = api(p); const R: any = {};
const say = (r: any) => `${r.status} ${JSON.stringify(r.body ?? '').slice(0, 140)}`;
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), JW = await sid('jenny.wilson'), VO = await sid('viewonly');
const AYr = (await staffRows(a, 'ayesha.khan@shopview.com')).find((x) => x.email === 'ayesha.khan@shopview.com'); const AY = AYr.staff_id;
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
R.clearedSwitch = (await a.post('/api/exit-switch-user', {})).status;
if (JW && !JW.is_active) R.jennyWasInactive = (await a.post('/api/iam/change-status', { id: JW.id })).status;
const n = 'ZZAUTOTEST F2 Pinned Gone 2';
await seedCase(a, n, 'ZZF3P2', [{ lead: ES.staff_id }, { lead: AY }]);
// FIX (9 Oct 17:20): seedCase's return order is not the plan order — pick each work order by its lead
const seededRows = await workOrders(a, n);
const w1 = seededRows.find((x: any) => x.techAssignedFirstName === 'Esther')!;   // WO-1, Esther Howard's
const w2 = seededRows.find((x: any) => x.techAssignedFirstName === 'Ayesha')!;   // WO-2, Ayesha Khan's
R.seeded = (await workOrders(a, n)).map((x: any) => `${x.number} lead=${x.techAssignedFirstName ?? '-'} ${x.techAssignedLastName ?? ''}`);
const view = async (pg: Page) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, 'Board View'); await search(pg, n); await pg.waitForTimeout(1500); };
const pinState = async (pg: Page, id: string, on: boolean) => { if (await toColumn(pg, id)) { const b = pg.locator(`[data-test-id="button_board_pin_${id}"]`); if (((await b.getAttribute('aria-pressed')) === 'true') !== on) { await b.click(); await pg.waitForTimeout(1200); } } };
const colOf = async (pg: Page, id: string) => { const drawn = await toColumn(pg, id); const c = (await boardCols(pg)).find((x) => x.id === id); return c ? { drawn, name: c.name, pinned: c.pinned, pinIcon: c.pinned !== null, count: c.count, cards: c.cards, text: c.empty } : { drawn, column: 'none' }; };
const first4 = async (pg: Page) => { await pg.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await pg.waitForTimeout(600); return (await boardCols(pg)).slice(0, 4).map((c) => `${c.name}${c.pinned === 'true' ? ' (pinned)' : ''}`); };
const prefs = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const pinsBefore: string[] = (await prefs()).pinnedTechnicianIds ?? [];
let voPinsBefore: string[] = [];
const hd = ((await a.get(`/api/staff/${AY}/view`)).body?.data?.collection?.departments ?? []).find((d: any) => d.workplace_id === HEAVY);
try {
  // both people pin Jenny Wilson and Ayesha Khan first (positive control: both columns drawn and pinned)
  await view(p); await pinState(p, JW.staff_id, true); await pinState(p, AY, true);
  R.controlAdmin = { first4: await first4(p), jenny: await colOf(p, JW.staff_id), ayesha: await colOf(p, AY) }; await shot(p, 'C368131-full-0-control');
  { const v = await viewAs(browser, p, a, VO.id, me.id); try { await view(v.page); voPinsBefore = (await api(v.page).get('/api/users/me/preferences/work-orders-list')).body?.data?.value?.pinnedTechnicianIds ?? []; await pinState(v.page, JW.staff_id, true); await pinState(v.page, AY, true); R.controlViewOnly = { jenny: await colOf(v.page, JW.staff_id), ayesha: await colOf(v.page, AY) }; } finally { await v.close(); } }
  // step 1-2: deactivate Jenny; take Ayesha off this location
  R.jennyOff = (await a.post('/api/iam/change-status', { id: JW.id })).status;
  R.ayeshaMain = (await setStaffLocation(p, 'ayesha.khan', 'Staging Lethbridge')).shown;
  R.ayeshaUnenrol = say(await a.post('/api/staff/enrollment/remove', { staffId: AY, workplaceId: HEAVY, departmentId: hd.id }));
  R.readBack = { jennyActive: (await sid('jenny.wilson'))?.is_active, ayeshaEnrolled: ((await a.get(`/api/staff/${AY}/view`)).body?.data?.collection?.departments ?? []).map((d: any) => d.workplace) };
  // step 3-6
  await view(p);
  R.step6 = { adminPinsNow: ((await prefs()).pinnedTechnicianIds ?? []).map((x: string) => x === JW.staff_id ? 'Jenny' : x === AY ? 'Ayesha' : 'other'), first4: await first4(p), jenny: await colOf(p, JW.staff_id), ayesha: await colOf(p, AY), ayeshaOfferedAsLead: (await candidates(a)).some((x) => x.name === 'Ayesha Khan') };
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000); await view(p); R.step6.jennyAgain = await colOf(p, JW.staff_id); R.step6.first4Again = await first4(p);
  await toColumn(p, JW.staff_id); await shot(p, 'C368131-full-1-step6-jenny'); await toColumn(p, AY); await shot(p, 'C368131-full-1-step6-ayesha');
  // step 7: try to drop WO-1 on Jenny's column (bring WO-1's column next to it by pinning Esther for the moment)
  await pinState(p, ES.staff_id, true); await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(800);
  if ((await p.locator(`[data-test-id="board_card_${w1.id}"]`).count()) && (await p.locator(`[data-test-id="board_column_${JW.staff_id}"]`).count())) await drag(p, `[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${JW.staff_id}"]`, 120);
  await p.waitForTimeout(2000); R.step7 = (await workOrders(a, n)).find((x: any) => x.id === w1.id); R.step7 = `${R.step7?.number} lead=${R.step7?.techAssignedFirstName ?? '-'} ${R.step7?.techAssignedLastName ?? ''}`;
  await pinState(p, ES.staff_id, false);
  // step 8-9: move WO-2 from Ayesha's column to Unassigned
  await view(p); await toColumn(p, AY);
  if (await p.locator(`[data-test-id="board_card_${w2.id}"]`).count()) { await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(500); await toColumn(p, AY); await drag(p, `[data-test-id="board_card_${w2.id}"]`, `[data-test-id="board_column_unassigned"]`, 60); await p.waitForTimeout(3000); }
  const w2now = (await workOrders(a, n)).find((x: any) => x.id === w2.id); R.step9 = { wo2: `${w2now?.number} lead=${w2now?.techAssignedFirstName ?? '-'} ${w2now?.techAssignedLastName ?? ''}` };
  await view(p); R.step9.ayesha = await colOf(p, AY); R.step9.ayeshaAgain = (await (async () => { await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000); await view(p); return colOf(p, AY); })());
  await shot(p, 'C368131-full-2-step9');
  // step 10-11: view-only person
  const v = await viewAs(browser, p, a, VO.id, me.id);
  try { await view(v.page); R.step11 = { perms: v.perms, jenny: await colOf(v.page, JW.staff_id), ayesha: await colOf(v.page, AY) }; await toColumn(v.page, JW.staff_id); await shot(v.page, 'C368131-full-3-viewonly'); } finally { await v.close(); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 400); await shot(p, 'C368131-full-error'); }
finally {
  const jw = await sid('jenny.wilson'); if (jw && !jw.is_active) R.restoreJenny = (await a.post('/api/iam/change-status', { id: JW.id })).status;
  R.restoreEnrol = say(await a.post('/api/staff/enrollment/create', { staffId: AY, workplaceId: HEAVY, departmentId: hd.id }));
  try { R.restoreMain = (await setStaffLocation(p, 'ayesha.khan', 'Staging Heavy Duty')).shown; } catch (e: any) { R.restoreMainError = String(e.message).slice(0, 160); }
  await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefs()), pinnedTechnicianIds: pinsBefore } });
  try { const v = await viewAs(browser, p, a, VO.id, me.id); try { await view(v.page); await pinState(v.page, JW.staff_id, voPinsBefore.includes(JW.staff_id)); await pinState(v.page, AY, voPinsBefore.includes(AY)); } finally { await v.close(); } } catch (e: any) { R.voPinRestoreError = String(e.message).slice(0, 120); }
  R.restoredRead = { jennyActive: (await sid('jenny.wilson'))?.is_active, ayeshaMain: (await staffRows(a, 'ayesha.khan@shopview.com'))[0]?.defaultWorkplaceName, ayeshaEnrolled: ((await a.get(`/api/staff/${AY}/view`)).body?.data?.collection?.departments ?? []).map((d: any) => d.workplace), adminPins: JSON.stringify((await prefs()).pinnedTechnicianIds ?? []) === JSON.stringify(pinsBefore), exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
  fs.writeFileSync(path.join(EV, 'C368131-full.json'), JSON.stringify(R, null, 1));
  console.log(t(), JSON.stringify(R, null, 1)); await done(browser);
}
