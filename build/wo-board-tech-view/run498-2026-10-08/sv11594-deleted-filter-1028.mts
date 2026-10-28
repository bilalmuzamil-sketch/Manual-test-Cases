/** sv11594-deleted-filter-1028.mts — 28 Oct 2026, QA branch sv11594 (SV-11594: the Technician filter lists "Deleted technician").
 *  Source: PRD 845185030 v81, S1-R15 ("Last comes “Deleted technician” (S3-R20e), with the same grey “Inactive” label, while that column
 *  exists (SV-11594, a fast follow).") and S3-R20e. Test case: the new SV-11594 case in the Fast-follow section (87347).
 *  Set-up (Rule 107, ZZAUTOTEST, fresh each run because the test deletes a person; copied from C614711-stg.mts): Technician-A
 *  "ZZAUTOTEST SV11594 Dana <n>" (no labor, so deletable) leads WO-1; Technician-B "ZZAUTOTEST SV11594 Eli" leads WO-2; then A is
 *  deleted (DELETE /api/staff/{id}; the case's set-up does it through Settings > Staff — said so in the result).
 *  Reads: the Technician list's LAST options (menu scrolled to its end), "Deleted" typed in "Search technician" (positive control: Eli
 *  typed is offered), ticking it in Tech View and Board View (only that group/column shown, WO-1 in it), combined with Search, and at
 *  location 2 (no deleted-lead work orders expected) "Deleted" typed. Traps: the list is long (300+ at Heavy Duty) — read the END by
 *  scrolling the menu, never the first screen; Board View draws only nearby columns (L0430) — with one technician chosen there is one
 *  column, so read all drawn columns. Output EV/sv11594-deleted-filter-1028.json + pictures EV/SV11594-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, API } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, groups, allBoardCols } from './wob.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { at: new Date().toISOString(), exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `SV11594-${n}.png`) }).catch(() => {});
const save = () => fs.writeFileSync(path.join(EV, 'sv11594-deleted-filter-1028.json'), JSON.stringify(o, null, 1));
const RUNNO = String(Date.now() % 100000); const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const LOC2 = process.env.WOB_LOC2 || '';
o.version = await p.evaluate(`(document.querySelector('meta[name="app-version"]')||{}).content || (document.body.innerText.match(/v26\\.[0-9.]+-[0-9a-f]+/)||[])[0] || null`);
const chip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const menu = () => p.locator('.q-menu').last();
const openList = async () => { if (!(await p.locator('.q-menu').count())) { await chip().click(); await W(1500); } };
const items = async () => (await menu().locator('.q-item').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
const typeIn = async (s: string) => { const box = menu().locator('input').last(); await box.waitFor({ timeout: 8000 }); await box.fill(s); await W(1500); return items(); };
const listEnd = async () => { await menu().evaluate((m) => { const s = [...m.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 4) || m; s.scrollTop = s.scrollHeight; }); await W(1200);
  await menu().evaluate((m) => { const s = [...m.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 4) || m; s.scrollTop = s.scrollHeight; }); await W(1200); return (await items()).slice(-5); };
const close = async () => { await p.keyboard.press('Escape'); await W(800); };
const toWO = async (d: string) => { await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, d); await W(2500); };
try {
  const A = (await person(a, 'ZZAUTOTEST SV11594', `Dana ${RUNNO}`, { role: TECH, email: `zz.wob.sv11594.dana.${RUNNO}${D}`, clockable: true, workplace: HEAVY })).row;
  const B = (await person(a, 'ZZAUTOTEST SV11594', 'Eli', { role: TECH, email: `zz.wob.sv11594.eli${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = [...(await ensureEligible(a, A, 'A')), ...(await ensureEligible(a, B, 'B'))];
  const CUST = `ZZAUTOTEST SV11594 Deleted Lead ${RUNNO}`; const c = await customer(a, CUST, 'SV11594');
  const w1 = await workOrder(a, c, 'approved', A.staff_id), w2 = await workOrder(a, c, 'approved', B.staff_id);
  const num = async (id: string) => (await workOrders(a, CUST)).find((x: any) => x.id === id)?.number;
  o.data = { techA: `${A.first_name} ${A.last_name}`, techB: `${B.first_name} ${B.last_name}`, customer: CUST, wo1: await num(w1), wo2: await num(w2) };
  o.deleteA = await p.evaluate(async ([api0, id]) => { const r = await fetch(`${api0}/api/staff/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status} ${(await r.text()).slice(0, 120)}`; }, [API, A.staff_id]);
  o.deleteA_readBack_stillListed = (await staffRows(a, A.email)).length; o.deleteRoute = 'API DELETE /api/staff/{id} (the case does it in Settings > Staff)';
  console.log(t(), 'SETUP', JSON.stringify(o.data), o.deleteA, 'still listed', o.deleteA_readBack_stillListed); save();
  // ---- Tech View: the list's end, "Deleted" typed, positive control
  await toWO('Tech View'); await openList(); await W(800);
  o.tv_first = (await items()).slice(0, 3); o.tv_last = await listEnd(); await shot('tv-list-end');
  o.tv_typedDeleted = await typeIn('Deleted'); await shot('tv-typed-deleted');
  o.tv_typedEli_control = await typeIn('SV11594 Eli'); await typeIn('');
  // ---- tick it: only the Deleted technician group shows, WO-1 in it
  await typeIn('Deleted'); const opt = menu().locator('.q-item').filter({ hasText: /Deleted technician/ }).first(); o.tv_optionFound = await opt.count();
  if (o.tv_optionFound) { await opt.click(); await W(1500); } await close(); await W(2000);
  o.tv_groupsShown = (await groups(p)).map((g: any) => g.name ?? g); await shot('tv-ticked-deleted');
  await search(p, CUST); await W(2500); o.tv_withSearch = (await groups(p)).map((g: any) => ({ name: g.name ?? g, rows: g.rows ?? g.cards ?? null })); await shot('tv-ticked-plus-search');
  // ---- Board View keeps the choice: only that column, WO-1 in it
  await display(p, 'Board View'); await W(3000);
  o.bv_columns = (await allBoardCols(p)).map((x: any) => ({ name: x.name, cards: x.cards })); await shot('bv-ticked-plus-search');
  // ---- clear the choice and search
  await openList(); const clr = menu().getByText(/Clear selection/i).first(); o.clearFound = await clr.count(); if (o.clearFound) { await clr.click(); await W(1000); } await close();
  await search(p, ''); await W(1500);
  // ---- location 2: not listed where no such work orders exist
  if (LOC2) {
    o.loc2_change = (await a.post('/api/iam/change-location', { workplace_id: LOC2, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' })).status;
    await toWO('Tech View'); await openList(); o.loc2_first = (await items()).slice(0, 3); o.loc2_last = await listEnd();
    o.loc2_typedDeleted = await typeIn('Deleted'); await shot('loc2-typed-deleted'); await typeIn(''); await close();
    o.loc2_groupNames = (await groups(p)).map((g: any) => g.name ?? g).filter((n: string) => /Deleted technician/i.test(n));
    o.loc1_back = (await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' })).status;
  } else o.loc2 = 'WOB_LOC2 not set';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot('error'); }
save(); console.log(t(), JSON.stringify(o).slice(0, 6000));
await done(browser);
