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
  // ---- steps 8-13 (added to the case 20 Oct 2026; script extended 22 Oct 2026). Set-up: two more technicians, C (not pinned) and D,
  // and Customer-C (name without "Keyboard") with three Approved work orders led by C. Step 8: window 1024 px wide, Board View kept.
  const CAL = (await person(a, 'ZZAUTOTEST C614719', 'Cal', { role: TECH, email: `zz.wob.c614719.cal${D}`, clockable: true, workplace: HEAVY })).row;
  const DAN = (await person(a, 'ZZAUTOTEST C614719', 'Dan', { role: TECH, email: `zz.wob.c614719.dan${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible2 = [...(await ensureEligible(a, CAL, 'Cal')), ...(await ensureEligible(a, DAN, 'Dan'))];
  const CC = 'ZZAUTOTEST C614719 Third Customer';
  if ((await workOrders(a, CC)).length < 3) { const c = await customer(a, CC, 'C614719-C'); for (let i = (await workOrders(a, CC)).length; i < 3; i++) await workOrder(a, c, 'approved', CAL.staff_id); }
  const wc = (await workOrders(a, CC)).sort((x: any, y: any) => String(x.number).localeCompare(String(y.number), undefined, { numeric: true }));
  for (const w of wc) { if (!/^approved$/i.test(String(w.status))) await a.post('/api/work-orders/change-status', { id: w.id, status: 'approved' }); if ((w.techAssignedId ?? w.tech_assigned_id) !== CAL.staff_id) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: CAL.staff_id }); }
  const WO4 = wc[0]; o.data2 = { cal: CAL.staff_id, dan: DAN.staff_id, customerC: CC, wos: wc.map((w: any) => w.number), wo4: WO4?.number, pinned: (await prefGet()).pinnedTechnicianIds?.length };
  const vp = p.viewportSize() ?? { width: 1600, height: 1000 }; o.viewportBefore = vp;
  await p.setViewportSize({ width: 1024, height: vp.height }); await W(1500); o.s8 = { display: await p.evaluate(`!!document.querySelector('[data-test-id="board_view_scroller"]')`), width: await p.evaluate('innerWidth') }; await shot('s8-narrow-board');
  const colBox = (staff: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${staff}"]') || document.querySelector('[data-test-id^="board_column_"][data-test-id*="${staff}"]'); if (!c) return null; const r = c.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), vw: innerWidth }; })()`);
  const cardBox = (id: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${id}"]'); if (!c) return null; const r = c.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), vw: innerWidth, vh: innerHeight, fullyOn: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight }; })()`);
  const scrollX = () => p.evaluate(`(document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller') || {}).scrollLeft ?? null`);
  // step 9: Search = Customer-C, then click once in Search
  await search(p, CC); await W(2500); await clickSearch();
  o.s9 = { cols: (await boardCols(p)).filter((c) => c.cards > 0 || /Unassigned/i.test(c.name)).map((c) => ({ name: c.name, cards: c.cards })), calColumn: await colBox(CAL.staff_id), wo4Card: WO4 ? await cardBox(WO4.id) : null, scrollLeft: await scrollX(), focus: await focus() };
  await shot('s9-customer-c-board');
  // step 10: Tab until the board has focus
  o.s10 = await tabUntil((f) => f.inBoard || /^board_/.test(f.tid)); await W(800); o.s10_isWo4Card = o.s10.reached?.tid === `board_card_${WO4?.id}`;
  o.s10_wo4Card = WO4 ? await cardBox(WO4.id) : null; o.s10_scrollLeft = await scrollX(); await shot('s10-first-tab-customer-c');
  // step 11: Tech View, then a shorter window (about two and a half group headings in the table body)
  await display(p, 'Tech View'); await W(2000);
  const groupH = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id^="tech_view_group_"]'); return g ? Math.round(g.getBoundingClientRect().height) : 56; })()`) as number;
  const bodyTop = await p.evaluate(`(() => { const b = document.querySelector('.q-virtual-scroll__content, tbody'); return b ? Math.round(b.getBoundingClientRect().top) : 300; })()`) as number;
  const h = Math.max(420, Math.round(bodyTop + groupH * 2.5 + 8)); await p.setViewportSize({ width: 1024, height: h }); await W(2000);
  const groupsInView = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_"]')].filter(e => { const r = e.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight; }).map(e => ({ tid: e.getAttribute('data-test-id').replace('tech_view_group_', '').slice(0, 12), text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 40), top: Math.round(e.getBoundingClientRect().top) }))`);
  o.s11 = { height: h, groupHeight: groupH, bodyTop, inView: await groupsInView(), calGroupInView: (await groupsInView() as any[]).some((g: any) => CAL.staff_id.startsWith(g.tid)) }; await shot('s11-tech-short');
  // step 12: click once in Search (still Customer-C)
  await clickSearch(); o.s12 = { focus: await focus(), search: await searchValue(p) };
  // step 13: Tab until the table has focus; is WO-4's row fully seen, just below C's heading, not covered by it?
  o.s13 = await tabUntil((f) => f.inTable || /^tech_view_/.test(f.tid)); await W(1000); o.s13_isWo4Row = o.s13.reached?.tid === `tech_view_row_${WO4?.id}`;
  o.s13_geometry = await p.evaluate(`(() => { const row = document.querySelector('[data-test-id="tech_view_row_${WO4?.id}"]'); const head = document.querySelector('[data-test-id="tech_view_group_${CAL.staff_id}"]');
    const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) }; };
    const sc = row && row.closest('.q-virtual-scroll, .q-table__middle, .scroll'); const rb = box(row), hb = box(head), sb = box(sc);
    return { row: rb, heading: hb, scroller: sb, vh: innerHeight, rowFullyInScroller: !!(rb && sb && rb.top >= sb.top && rb.bottom <= sb.bottom && rb.bottom <= innerHeight), headingCoversRow: !!(rb && hb && hb.bottom > rb.top && hb.top < rb.bottom) }; })()`);
  await shot('s13-first-tab-tech-short');
  await p.setViewportSize(vp); await W(800);
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.prefsBack = (await a.put(PREF, { value: ORIGINAL }).catch(() => ({ status: 0 }))).status; }
fs.writeFileSync(path.join(EV, 'C614719-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614719', JSON.stringify(o).slice(0, 2500)); await done(browser);
