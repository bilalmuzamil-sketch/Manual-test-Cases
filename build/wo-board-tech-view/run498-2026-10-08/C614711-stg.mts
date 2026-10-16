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
  // ---- step 6: drag WO-2 from Unassigned onto that column
  const un = cols.find((x: any) => /^unassigned$/i.test(String(x.id)) || /^Unassigned$/i.test(String(x.name)));
  if (c1) { const wo2Id = w2; await toColumn(p, un?.id ?? 'unassigned').catch(() => false);
    await drag(p, `[data-test-id="board_card_${wo2Id}"]`, `[data-test-id="board_column_${c1.id}"]`).catch((e) => { o.s6_dragError = String(e).slice(0, 120); });
    o.s6_messages = await toasts(p); o.s6_wo2LeadApi = (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id ?? null;
    o.s6_wo2Column = colOf(o.data.wo2)?.name ?? null; const after = await allBoardCols(p); o.s6_wo2ColumnAfter = after.find((x: any) => (x.cards ?? []).includes(o.data.wo2))?.name ?? null; await shot('s6-after-drop'); }
  // ---- step 7: Tech View group
  await display(p, 'Tech View'); await W(2000); const g = await groups(p); const g1 = g.find((x) => x.rows.includes(o.data.wo1));
  o.s7_group = g1 ? { name: g1.name, id: g1.id, rows: g1.rows } : null;
  if (g1) o.s7_header = await p.evaluate((id) => { const h = document.querySelector(`[data-test-id="tech_view_group_${id}"]`) as HTMLElement | null; return h ? { text: h.innerText.replace(/\s+/g, ' ').trim(), inactiveMarker: !!h.querySelector('[data-test-id*="inactive"], [class*="inactive"]') || /inactive/i.test(h.innerText), html: h.outerHTML.slice(0, 500) } : null; }, g1.id);
  await shot('s7-tech-view');
  // ---- step 8: List, WO-1's Lead Technician cell
  await display(p, 'List'); await W(2500);
  o.s8_leadCell = await p.evaluate((n) => { const heads = [...document.querySelectorAll('thead th')].map((th) => (th as HTMLElement).innerText.trim()); const i = heads.findIndex((h) => /^Lead Technician$/i.test(h));
    const tr = [...document.querySelectorAll('tbody tr')].find((r) => (r as HTMLElement).innerText.includes(n)) as HTMLTableRowElement | undefined; return { heads: heads.slice(0, 20), column: i, cell: tr && i >= 0 ? (tr.cells[i]?.innerText ?? '').trim() : null, rowFound: !!tr }; }, o.data.wo1);
  await shot('s8-list');
  // ---- steps 9-10: Board View, drag WO-1 onto Technician-B (positive control for step 6)
  await display(p, 'Board View'); o.s9_ok = true; const cols2 = await allBoardCols(p); const c1b = cols2.find((x: any) => (x.cards ?? []).includes(o.data.wo1));
  if (c1b) { await toColumn(p, c1b.id); await drag(p, `[data-test-id="board_card_${w1}"]`, `[data-test-id="board_column_${B.staff_id}"]`).catch(async () => { await toColumn(p, B.staff_id); await drag(p, `[data-test-id="board_card_${w1}"]`, `[data-test-id="board_column_${B.staff_id}"]`).catch((e) => { o.s10_dragError = String(e).slice(0, 120); }); }); }
  o.s10_messages = await toasts(p); o.s10_wo1Lead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id === B.staff_id ? 'Technician-B' : 'not Technician-B'; await shot('s10-after-drop');
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'C614711-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614711', JSON.stringify(o).slice(0, 2500)); await done(browser);
