/** C614711-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614711 "Work orders of a deleted lead sit under Deleted technician, which takes no drops" (section 13238), steps as read live
 *  from TestRail on 16 Oct 2026. Source the case asserts: PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030,
 *  version 61, S3-R20e (added in version 59, Chris Ward ruling on SV-11416), S4-N5, S3-N4, S2-N3.
 *  Known problem in the case: SV-11416 (open) — today step 5 reads "Unknown Technician" with a generic person icon, no inactive marker and
 *  a drag grip. The script records what it sees; the case's three outcomes decide the verdict (never a new ticket from this script).
 *  Data (Rule 107, tagged ZZAUTOTEST, made fresh each run because the test deletes the person): [Technician-A] "ZZAUTOTEST C614711 Dana <n>"
 *  with no labor anywhere (a person with logged labor cannot be deleted: "Staff is being used elsewhere.", C368191-b40.json); [Technician-B]
 *  "ZZAUTOTEST C614711 Eli" (reused); customer "ZZAUTOTEST C614711 Deleted Lead <n>" with WO-1 (Approved, lead A) and WO-2 (Approved, no lead).
 *  Steps 1-2 through the screen (Settings > Staff, the row's pencil, Delete, confirm); if the screen route is not found the delete is made
 *  with DELETE /api/staff/{id} (C368191-routes.mts) and the result says steps 1-2 were NOT done through the screen.
 *  Traps: the deleted lead's column has no staff id we know, so it is found by the card it holds (WO-1), never by name; a drag from
 *  off-screen does nothing and reads like a refusal (drag() scrolls first, L0350); "refused" needs a positive control — step 10's drag of
 *  the same card to Technician-B must be accepted ("Lead technician updated"), or the step-6 refusal is void.
 *  Output: EV/C614711-stg.json, pictures EV/C614711-stg-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP, API } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, groups, drag, toColumn, allBoardCols, toasts } from './wob.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614711-stg-${n}.png`) }).catch(() => {});
const RUNNO = String(Date.now() % 100000); const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 140) : ''}`;
try {
  // ---- set-up (the case's "Setup file" part)
  const A = (await person(a, 'ZZAUTOTEST C614711', `Dana ${RUNNO}`, { role: TECH, email: `zz.wob.c614711.dana.${RUNNO}${D}`, clockable: true, workplace: HEAVY })).row;
  const B = (await person(a, 'ZZAUTOTEST C614711', 'Eli', { role: TECH, email: `zz.wob.c614711.eli${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = [...(await ensureEligible(a, A, 'A')), ...(await ensureEligible(a, B, 'B'))];
  const CUST = `ZZAUTOTEST C614711 Deleted Lead ${RUNNO}`; const c = await customer(a, CUST, 'C614711');
  const w1 = await workOrder(a, c, 'approved', A.staff_id), w2 = await workOrder(a, c, 'approved', null);
  const num = async (id: string) => (await workOrders(a, CUST)).find((x: any) => x.id === id)?.number;
  o.data = { techA: `${A.first_name} ${A.last_name}`, techB: `${B.first_name} ${B.last_name}`, customer: CUST, wo1: await num(w1), wo2: await num(w2) };
  // ---- step 1: Settings > Staff, the pencil on Technician-A
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await W(7000);
  const box = p.locator('[data-test-id="page_search_input"], input[placeholder*="Search" i], input[type=search]').first();
  if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').first().click().catch(async () => { await p.getByText(/^\s*Search\s*$/).first().click().catch(() => {}); }); await W(800); }
  await box.fill(RUNNO).catch(() => {}); await W(3500);
  const row = p.locator('tbody tr').filter({ hasText: RUNNO }).first(); o.s1_rowFound = await row.count();
  const pen = row.locator('button:has(i:text-is("edit")), button:has(i:text-is("mode_edit")), [data-test-id*="edit"]').first();
  if (o.s1_rowFound) { await row.hover().catch(() => {}); await pen.click().catch(async () => { await row.click().catch(() => {}); }); await W(3000); }
  const dlg = p.locator('.q-dialog:visible').last(); o.s1_opened = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot('s1-staff-record');
  // ---- step 2: Delete and confirm (screen); fallback DELETE /api/staff/{id}
  const del = p.locator('.q-dialog:visible button, main button').filter({ hasText: /^\s*Delete\s*$/i }).first(); o.s2_deleteButton = await del.count();
  if (o.s2_deleteButton) { await del.click().catch(() => {}); await W(1500); const conf = p.locator('.q-dialog:visible').last().locator('button').filter({ hasText: /Delete|Yes|Confirm|OK/i }).last(); o.s2_confirmText = (await p.locator('.q-dialog:visible').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await conf.click().catch(() => {}); await W(3000); o.s2_messages = await toasts(p); o.s2_route = 'screen'; }
  if (!o.s2_deleteButton || (await staffRows(a, A.email)).length) {
    o.s2_route = o.s2_deleteButton ? 'screen did not delete; API DELETE used' : 'no Delete button found; API DELETE used (steps 1-2 NOT done through the screen)';
    o.s2_api = await p.evaluate(async ([api0, id]) => { const r = await fetch(`${api0}/api/staff/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } }); return `${r.status} ${(await r.text()).slice(0, 120)}`; }, [API, A.staff_id]);
  }
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await W(6000); await box.fill(RUNNO).catch(() => {}); await W(3500);
  o.s2_stillListedScreen = await p.locator('tbody tr').filter({ hasText: RUNNO }).count(); o.s2_stillListedApi = (await staffRows(a, A.email)).length; await shot('s2-staff-after-delete');
  // fix-up 2 (17 Oct 2026): Technician-B pinned BEFORE Board View opens, so his column is drawn next to Unassigned (put back at the end)
  const PREFU = '/api/users/me/preferences/work-orders-list'; const pv0 = (await a.get(PREFU)).body?.data?.value ?? {}; o.pinsAtStart = pv0.pinnedTechnicianIds ?? [];
  o.pinB = (await a.put(PREFU, { value: { ...pv0, pinnedTechnicianIds: [B.staff_id] } })).status;
  console.log(t(), 'START STATE found C614711', JSON.stringify({ data: o.data, pinsAtStart: o.pinsAtStart, deleted: { route: o.s2_route ?? 'screen', stillListedApi: o.s2_stillListedApi } }));
  // ---- steps 3-5: Board View, Search, the header of WO-1's column
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); o.s3_ok = true;
  await search(p, CUST); await W(2000);
  const cols = await allBoardCols(p); const colOf = (n: string) => cols.find((x: any) => (x.cards ?? []).includes(n));
  o.s4_cards = { wo1: !!colOf(o.data.wo1), wo2: !!colOf(o.data.wo2) };
  const c1 = colOf(o.data.wo1); o.s5_column = c1 ? { id: c1.id, name: c1.name, cards: c1.cards } : null;
  if (c1) { await toColumn(p, c1.id); o.s5_header = await p.evaluate((id) => { const h = document.querySelector(`[data-test-id="board_column_header_${id}"]`) as HTMLElement | null; if (!h) return null;
      const icons = [...h.querySelectorAll('i, .q-icon, svg')].map((e) => (e.textContent || e.getAttribute('data-test-id') || e.getAttribute('class') || '').trim().slice(0, 40));
      return { text: h.innerText.replace(/\s+/g, ' ').trim(), icons, grip: !!h.querySelector('[data-test-id*="drag"], [data-test-id*="grip"], .drag-handle') || icons.some((x) => /drag_indicator|grip/i.test(x)), inactiveMarker: !!h.querySelector('[data-test-id*="inactive"], [class*="inactive"]') || /inactive/i.test(h.innerText), html: h.outerHTML.slice(0, 600) }; }, c1.id);
    await shot('s5-column-header'); }
  // ---- FIX-UP 2 (17 Oct 2026): on 16 Oct steps 6, 7 and 10 timed out finding the drop column / the card. Board View draws only the
  // columns near the screen: the old step 6 scrolled to Unassigned (scrollLeft 0), which un-drew the "Deleted technician" column it then
  // dropped on; step 10 had the same problem with Technician-B's column. Now every drag goes through dragAcross(): the case's search is
  // re-applied, the SOURCE column is brought on screen, both ends are looked for, and if the target is not drawn the card is held and
  // walked toward it (the board scrolled step by step while held) until the target is drawn and on screen; positions and the columns in
  // view are logged. Technician-B is pinned for the run (so his column sits next to Unassigned) and put back after. Tech View's group is
  // found by its header TEXT ("Deleted technician") with every group name logged.
  const colsInView = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(h => { const r = h.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; }).map(h => (h.innerText.split('\\n')[0] || h.getAttribute('data-test-id')).trim().slice(0, 30))`).catch(() => []) as Promise<string[]>;
  const scrollerLeft = () => p.evaluate(`(document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller') || {}).scrollLeft ?? null`).catch(() => null);
  const boxIn = async (sel: string) => { const b = await p.locator(sel).first().boundingBox({ timeout: 1500 }).catch(() => null); const vw = p.viewportSize()?.width ?? 1600; return b && b.x + b.width > 40 && b.x < vw - 40 ? b : null; };
  const un = cols.find((x: any) => /^unassigned$/i.test(String(x.id)) || /^Unassigned$/i.test(String(x.name)));
  async function dragAcross(fromSel: string, fromCol: string, toSel: string, tag: string, dir: number) { const d: any = { tag, dir };
    await toColumn(p, fromCol).catch(() => false); await p.locator(fromSel).first().scrollIntoViewIfNeeded().catch(() => {}); await W(600);
    d.start = { scrollLeft: await scrollerLeft(), inView: await colsInView(), from: !!(await boxIn(fromSel)), to: !!(await boxIn(toSel)) };
    const fb = await boxIn(fromSel); if (!fb) { d.result = 'card not on screen'; return d; }
    await shot(`${tag}-before`);
    await p.mouse.move(fb.x + fb.width * 0.45, fb.y + fb.height / 2); await p.mouse.down(); await p.mouse.move(fb.x + fb.width * 0.45, fb.y + fb.height / 2 + 8, { steps: 4 });
    let tb = await boxIn(toSel); d.walk = 0;
    for (let i = 0; i < 80 && !tb; i++) { d.walk = i + 1; await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft += ${dir >= 0 ? 400 : -400}; })()`).catch(() => {}); await p.mouse.move(fb.x + fb.width * 0.45 + (i % 2 ? 6 : -6), fb.y + fb.height / 2 + 8, { steps: 2 }); await W(350); tb = await boxIn(toSel);
      if (!tb && i === 40) { await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = 0; })()`).catch(() => {}); await W(400); tb = await boxIn(toSel); } }
    d.targetFound = !!tb; d.held = { scrollLeft: await scrollerLeft(), inView: await colsInView() };
    if (tb) { await p.mouse.move(tb.x + tb.width / 2, tb.y + Math.min(160, tb.height / 2), { steps: 20 }); await W(500); await shot(`${tag}-holding`); }
    await p.mouse.up(); await W(3000); d.result = tb ? 'dropped on the target' : 'released without finding the target'; await shot(`${tag}-after`); return d; }
  // ---- step 6: drag WO-2 from Unassigned onto the "Deleted technician" column (refused?)
  if (c1) { await search(p, CUST); await W(1500); const dropSel = `[data-test-id="board_column_${c1.id}"]`;
    const ix = (id: string) => cols.findIndex((x: any) => x.id === id); o.s6_order = { unassigned: ix(un?.id ?? 'unassigned'), deleted: ix(c1.id), of: cols.length };
    o.s6 = await dragAcross(`[data-test-id="board_card_${w2}"]`, un?.id ?? 'unassigned', dropSel, 's6', ix(c1.id) >= ix(un?.id ?? 'unassigned') ? 1 : -1);
    o.s6_messages = await toasts(p); o.s6_wo2LeadApi = (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id ?? null;
    const after = await allBoardCols(p); o.s6_wo2ColumnAfter = after.find((x: any) => (x.cards ?? []).includes(o.data.wo2))?.name ?? null; o.s6_columnsFound = after.filter((x: any) => (x.cards ?? []).length || /deleted|unassigned/i.test(x.id)).map((x: any) => `${x.name ?? x.id}:${(x.cards ?? []).join('+')}`);
    console.log(t(), 'C614711 step 6', JSON.stringify({ drag: o.s6, wo2Column: o.s6_wo2ColumnAfter, lead: o.s6_wo2LeadApi })); }
  // ---- step 7: Tech View — the group headed "Deleted technician"
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000);
  const gAll = await groups(p); o.s7_groupsFound = gAll.map((x) => `${x.name}(${x.count})${x.collapsed ? ' collapsed' : ''}: ${x.rows.join(' ')}`);
  let gd = gAll.find((x) => /Deleted technician/i.test(String(x.name))) ?? gAll.find((x) => x.rows.includes(o.data.wo1));
  if (gd?.collapsed) { await p.locator(`[data-test-id="button_tech_view_group_toggle_${gd.id}"]`).click().catch(() => {}); await W(1500); gd = (await groups(p)).find((x) => x.id === gd!.id) ?? gd; o.s7_expandedByScript = true; }
  o.s7_group = gd ? { name: gd.name, id: gd.id, rows: gd.rows, holdsWo1: gd.rows.includes(o.data.wo1) } : null;
  if (gd) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${gd.id}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await W(600);
    o.s7_header = await p.evaluate((id) => { const h = document.querySelector(`[data-test-id="tech_view_group_${id}"]`) as HTMLElement | null; return h ? { text: h.innerText.replace(/\s+/g, ' ').trim(), inactiveMarker: !!h.querySelector('[data-test-id*="inactive"], [class*="inactive"]') || /inactive/i.test(h.innerText), grip: !!h.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'), html: h.outerHTML.slice(0, 500) } : null; }, gd.id); }
  console.log(t(), 'C614711 step 7', JSON.stringify({ groups: o.s7_groupsFound, group: o.s7_group }));
  await shot('s7-tech-view');
  // ---- step 8: List, WO-1's Lead Technician cell
  await display(p, 'List'); await W(2500); await search(p, CUST); await W(1500);
  o.s8_leadCell = await p.evaluate((n) => { const heads = [...document.querySelectorAll('thead th')].map((th) => (th as HTMLElement).innerText.replace(/arrow_drop_(up|down)/g, '').trim()); const i = heads.findIndex((h) => /^Lead Technician$/i.test(h));
    const tr = [...document.querySelectorAll('tbody tr')].find((r) => (r as HTMLElement).innerText.includes(n)) as HTMLTableRowElement | undefined; return { heads: heads.slice(0, 20), column: i, cell: tr && i >= 0 ? (tr.cells[i]?.innerText ?? '').trim() : null, rowFound: !!tr }; }, o.data.wo1);
  await shot('s8-list');
  // ---- steps 9-10: Board View, drag WO-1 onto Technician-B (positive control for step 6)
  await display(p, 'Board View'); o.s9_ok = true; await search(p, CUST); await W(1500);
  const cols2 = await allBoardCols(p); const c1b = cols2.find((x: any) => (x.cards ?? []).includes(o.data.wo1)); o.s10_from = c1b ? `${c1b.name ?? c1b.id}` : null;
  const ix2 = (id: string) => cols2.findIndex((x: any) => x.id === id); o.s10_order = { from: c1b ? ix2(c1b.id) : null, technicianB: ix2(B.staff_id), of: cols2.length };
  if (c1b) o.s10 = await dragAcross(`[data-test-id="board_card_${w1}"]`, c1b.id, `[data-test-id="board_column_${B.staff_id}"]`, 's10', ix2(B.staff_id) >= ix2(c1b.id) ? 1 : -1);
  o.s10_messages = await toasts(p); o.s10_wo1Lead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id === B.staff_id ? 'Technician-B' : 'not Technician-B';
  console.log(t(), 'C614711 step 10', JSON.stringify({ drag: o.s10 ?? null, from: o.s10_from, lead: o.s10_wo1Lead, messages: o.s10_messages }));
  o.pinsBack = (await a.put(PREFU, { value: { ...((await a.get(PREFU)).body?.data?.value ?? {}), pinnedTechnicianIds: o.pinsAtStart } })).status;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'C614711-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614711', JSON.stringify(o).slice(0, 2500)); await done(browser);
