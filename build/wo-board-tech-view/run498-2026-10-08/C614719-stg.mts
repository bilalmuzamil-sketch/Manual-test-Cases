/** C614719-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614719 "First Tab skips a collapsed or empty Unassigned to the first technician" (section 13246), steps as read live from
 *  TestRail on 16 Oct 2026. Source the case asserts: PRD Confluence 845185030 version 62, S11-R1, S2-R2, S2-R17; Chris Ward's answer 33.
 *  Data (Rule 107, ZZAUTOTEST, reused when present): technicians "ZZAUTOTEST C614719 Ana" and "ZZAUTOTEST C614719 Ben" (Technician,
 *  Time Clock on, eligible at Heavy Duty); "ZZAUTOTEST C614719 Keyboard A" with WO-1 (lead Ana) and WO-2 (lead Ben); "ZZAUTOTEST C614719
 *  Keyboard B" with WO-3 (no lead). Pins = [Ana, Ben] only and no saved collapsed groups for this run (saved choices put back at the end),
 *  so the starting screen is "every group expanded, the page freshly opened".
 *  Keyboard model (PRD v61/62, kbd-fix4.mts probe): one Tab stop per view, arrows inside. Each Tab press records document.activeElement's
 *  data-test-id and whether a focus ring is drawn (outline / box-shadow), so "lands on WO-1's row, not a header" is read, not assumed.
 *  Positive control (Rule 104): before step 1 the Search box must take the click (activeElement = page_search_input); if Tab never enters
 *  the table within 15 presses the reading is reported as "not reached", never as a product result.
 *  Output EV/C614719-stg.json, pictures C614719-stg-*.png. */
import { LOC1_NAME } from './profile.mts';
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, groups, boardCols, activeTab, searchValue, switchLocUI } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614719-stg-${n}.png`) }).catch(() => {});
const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const PREF = '/api/users/me/preferences/work-orders-list'; const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {}; const ORIGINAL = await prefGet();
const focus = () => p.evaluate(`(() => { const e = document.activeElement; if (!e) return null; const host = e.closest('[data-test-id]'); const s = getComputedStyle(e);
  return { tid: (host ? host.getAttribute('data-test-id') : e.tagName), ring: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none'), inTable: !!e.closest('table, .q-table'), inBoard: !!e.closest('[data-test-id="board_view_scroller"], .board-view__scroller') }; })()`) as Promise<any>;
const clickSearch = async () => { const b = p.locator('[data-test-id="page_search_input"]'); if (!(await b.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').click().catch(() => {}); await W(600); } await b.click(); await W(500); };
const tabUntil = async (ok: (f: any) => boolean) => { const seen: any[] = []; for (let i = 0; i < 15; i++) { await p.keyboard.press('Tab'); await W(350); const f = await focus(); seen.push(f?.tid); if (f && ok(f)) return { reached: f, presses: i + 1, seen }; } return { reached: null, seen }; };
try {
  const ANA = (await person(a, 'ZZAUTOTEST C614719', 'Ana', { role: TECH, email: `zz.wob.c614719.ana${D}`, clockable: true, workplace: HEAVY })).row;
  const BEN = (await person(a, 'ZZAUTOTEST C614719', 'Ben', { role: TECH, email: `zz.wob.c614719.ben${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = [...(await ensureEligible(a, ANA, 'Ana')), ...(await ensureEligible(a, BEN, 'Ben'))];
  const CA = 'ZZAUTOTEST C614719 Keyboard A', CB = 'ZZAUTOTEST C614719 Keyboard B', Q = 'ZZAUTOTEST C614719 Keyboard';
  if (!(await workOrders(a, CA)).length) { const c = await customer(a, CA, 'C614719-A'); await workOrder(a, c, 'approved', ANA.staff_id); await workOrder(a, c, 'approved', BEN.staff_id); }
  if (!(await workOrders(a, CB)).length) { const c = await customer(a, CB, 'C614719-B'); await workOrder(a, c, 'approved', null); }
  const wa = await workOrders(a, CA), wb = await workOrders(a, CB);
  const WO1 = wa.find((x: any) => x.techAssignedId === ANA.staff_id || x.tech_assigned_id === ANA.staff_id) ?? wa[0], WO2 = wa.find((x: any) => x !== WO1), WO3 = wb[0];
  o.data = { wo1: WO1?.number, wo2: WO2?.number, wo3: WO3?.number };
  // FIX-UP 2 (17 Oct 2026): on 16 Oct the page opened on the Estimates tab (a saved choice left by an earlier script), so the Approved work
  // orders could not show and every reading was empty. The starting screen is now SET and read back: saved tab All, no saved filters, no
  // saved collapsed groups, Technician-A then Technician-B pinned; the location in the top bar is Heavy Duty (switched through the menu if
  // not); the three work orders are Approved with their leads (put back if an earlier run moved them). START STATE found / set are logged.
  o.startFound = { tab: ORIGINAL.tab ?? null, filters: JSON.stringify(ORIGINAL.filters ?? null).slice(0, 160), collapsed: ORIGINAL.collapsedGroups ?? null, pinned: (ORIGINAL.pinnedTechnicianIds ?? []).length, location: await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null), wos: [WO1, WO2, WO3].map((w: any) => `${w?.number} ${w?.status} lead=${w?.techAssignedFirstName ?? '-'}`) };
  console.log(t(), 'START STATE found C614719', JSON.stringify(o.startFound));
  o.leadFix = []; for (const [w, lead] of [[WO1, ANA.staff_id], [WO2, BEN.staff_id], [WO3, null]] as [any, string | null][]) { if (!w) continue; if (!/^approved$/i.test(String(w.status))) o.leadFix.push(`${w.number} status ${(await a.post('/api/work-orders/change-status', { id: w.id, status: 'approved' })).status}`); if ((w.techAssignedId ?? w.tech_assigned_id ?? null) !== lead) o.leadFix.push(`${w.number} lead ${(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: lead })).status}`); }
  const clean: any = {}; for (const [k, v] of Object.entries(ORIGINAL)) if (!/collaps/i.test(k)) clean[k] = v; // no saved collapsed groups (C590131-orgb.mts)
  await a.put(PREF, { value: { ...clean, tab: 'all', filters: {}, pinnedTechnicianIds: [ANA.staff_id, BEN.staff_id] } });
  { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); const topNow = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => ''); if (!/Staging Heavy Duty/.test(topNow)) o.locationSwitch = await switchLocUI(p, LOC1_NAME); }
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Tech View'); await search(p, Q); await W(2000);
  await p.reload({ waitUntil: 'domcontentloaded' }); await W(7000); // freshly opened: nothing has had keyboard focus
  if ((await activeTab(p)) !== 'All') { o.tabClickedAgain = await activeTab(p); await tab(p, 'All').catch(() => {}); await W(2000); }
  if ((await searchValue(p)) !== Q) { await search(p, Q); await W(2000); }
  const pv = await prefGet(); o.startSet = { tab: await activeTab(p), savedTab: pv.tab ?? null, filters: JSON.stringify(pv.filters ?? null).slice(0, 120), pinned: (pv.pinnedTechnicianIds ?? []).length, search: await searchValue(p), location: await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null), leadFix: o.leadFix };
  console.log(t(), 'START STATE set C614719', JSON.stringify(o.startSet));
  o.start = (await groups(p)).map((g) => ({ name: g.name, collapsed: g.collapsed, rows: g.rows })); await shot('s0-start');
  // ---- step 1: collapse Unassigned
  await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').first().click().catch(async () => { await p.locator('[data-test-id^="button_tech_view_group_toggle_"]').first().click().catch(() => {}); }); await W(1500);
  o.s1 = (await groups(p)).map((g) => ({ name: g.name, collapsed: g.collapsed, rows: g.rows })); await shot('s1-unassigned-collapsed');
  // ---- step 2: click Search (positive control: the box takes focus)
  await clickSearch(); o.s2 = await focus(); await shot('s2-search');
  // ---- step 3: Tab until something in the table has focus
  o.s3 = await tabUntil((f) => f.inTable || /^tech_view_/.test(f.tid)); o.s3_expected = `tech_view_row_${WO1?.id}`; o.s3_isWo1Row = o.s3.reached?.tid === `tech_view_row_${WO1?.id}`; await shot('s3-first-tab');
  // ---- steps 4-5: Board View, Search = Customer-A
  await display(p, 'Board View'); await W(1500); o.s4 = (await boardCols(p)).slice(0, 4).map((c) => ({ name: c.name, cards: c.cards })); await shot('s4-board');
  await search(p, CA); await W(2000); o.s5 = (await boardCols(p)).slice(0, 4).map((c) => ({ name: c.name, cards: c.cards })); await shot('s5-board-customer-a');
  // ---- steps 6-7: click Search, Tab until something on the board has focus
  await clickSearch(); o.s6 = await focus();
  o.s7 = await tabUntil((f) => f.inBoard || /^board_/.test(f.tid)); o.s7_isWo1Card = o.s7.reached?.tid === `board_card_${WO1?.id}`; await shot('s7-first-tab-board');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.prefsBack = (await a.put(PREF, { value: ORIGINAL }).catch(() => ({ status: 0 }))).status; }
fs.writeFileSync(path.join(EV, 'C614719-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614719', JSON.stringify(o).slice(0, 2500)); await done(browser);
