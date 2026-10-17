/** C614711-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C614711 alone ("Work orders of a deleted lead sit under
 *  Deleted technician, which takes no drops"). Steps 6 and 7 were not done twice: the "Deleted technician" column is the LAST of ~280 Board
 *  View columns and Tech View draws only the groups near the screen (L0430). Steps 1-5 (set-up, delete through Settings > Staff, Board View,
 *  Search, the column header) are C614711-stg.mts's proven code, copied unchanged (lines 16-65; only the picture prefix changed). New:
 *  step 6 scrolls the board to its END, where the target column and the sticky Unassigned column (holding WO-2) are both on screen, and
 *  logs both boxes and what is under the drop point before the press and while held (else the card is pressed at the start and the board
 *  jumped to the end while held); step 7 scrolls Tech View to its bottom until the "Deleted technician" group is drawn; step 10 (the
 *  positive control: a drag OUT of the column must be accepted) does the reverse to Technician-B's pinned column at the start.
 *  Output EV/C614711-r4.json, pictures EV/C614711-r4-*.png. Records only; the case's three outcomes decide; no TestRail, no Jira.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP, API } from './session.mts'; import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, display, tab, search, groups, drag, toColumn, allBoardCols, toasts } from './wob.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614711-r4-${n}.png`) }).catch(() => {});
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
  // ───────────────────────────── ROUND 4 (17 Oct 2026): steps 6, 7 and 10 ─────────────────────────────
  // Board View draws only the columns near the screen and "Deleted technician" is the LAST of ~280 columns (L0430): it is reached by
  // scrolling the board to its END (not by walking a held card). Unassigned stays on the left while the board scrolls, so at the end both
  // the source card (Unassigned) and the target column are on screen; both boxes and what is under the drop point are logged before the
  // press and while held. If the card is not on screen at the end, the card is pressed at the start and the board jumped to its end while
  // held. Step 10 does the reverse (Technician-B is pinned, so his column is at the start). Tech View: the table scrolled to its bottom
  // until the "Deleted technician" group is drawn.
  const SC = '[data-test-id="board_view_scroller"], .board-view__scroller';
  const vbox = async (sel: string) => { const b = await p.locator(sel).first().boundingBox({ timeout: 1500 }).catch(() => null); const vw = p.viewportSize()?.width ?? 1600, vh = p.viewportSize()?.height ?? 900;
    return b && b.x + b.width > 20 && b.x < vw - 20 && b.y + b.height > 20 && b.y < vh - 20 ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } : null; };
  const colAt = (x: number, y: number) => p.evaluate(`(() => { const e = document.elementFromPoint(${x}, ${y}); if (!e) return 'nothing'; for (let a = e; a; a = a.parentElement) { const t = a.getAttribute && a.getAttribute('data-test-id'); if (t && /^board_column_(header_)?([0-9a-f-]{36}|unassigned|[A-Za-z0-9_-]+)$/.test(t) && !/^board_column_(name|count|empty|drag_handle)_/.test(t)) return t.replace(/^board_column_(header_)?/, ''); } return e.tagName; })()`).catch(() => 'error') as Promise<string>;
  const jump = async (to: 'start' | 'end') => { for (let i = 0; i < 4; i++) { const moved = await p.evaluate(`(() => { const h = document.querySelector('${SC}'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft = ${to === 'end' ? 'h.scrollWidth' : '0'}; return h.scrollLeft !== b; })()`).catch(() => false); await W(900); if (!moved) break; } };
  const colsInView = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_header_"]')].filter(h => { const r = h.getBoundingClientRect(); return r.right > 0 && r.left < innerWidth; }).map(h => (h.innerText.split('\\n').filter(Boolean).slice(0, 2).join(' ') || h.getAttribute('data-test-id')).trim().slice(0, 30))`).catch(() => []) as Promise<string[]>;
  /** drag a card onto a column; `end` = where the TARGET column is (the board is scrolled there first) */
  async function dragTo(cardSel: string, colId: string, end: 'start' | 'end', tag: string) { const d: any = { tag };
    const colSel = `[data-test-id="board_column_${colId}"]`;
    await jump(end); d.atTarget = { inView: await colsInView(), card: await vbox(cardSel), column: await vbox(colSel), header: await vbox(`[data-test-id="board_column_header_${colId}"]`) };
    let fb = d.atTarget.card, tb = d.atTarget.column; d.route = 'both on screen with the board at its ' + end;
    if (!fb || !tb) { // the card is pressed where it is, then the board jumped while held
      await jump(end === 'end' ? 'start' : 'end'); fb = await vbox(cardSel); d.route = `card pressed with the board at its ${end === 'end' ? 'start' : 'end'}, then the board jumped to its ${end} while held`;
      if (!fb) { d.result = 'card not on screen at either end'; await shot(`${tag}-no-card`); return d; }
      await shot(`${tag}-before`); await p.mouse.move(fb.x + fb.w * 0.45, fb.y + fb.h / 2); await p.mouse.down(); await p.mouse.move(fb.x + fb.w * 0.45, fb.y + fb.h / 2 + 8, { steps: 4 });
      await p.evaluate(`(() => { const h = document.querySelector('${SC}'); if (h) h.scrollLeft = ${end === 'end' ? 'h.scrollWidth' : '0'}; })()`).catch(() => {}); await W(1200); await p.mouse.move(fb.x + fb.w * 0.45 + 6, fb.y + fb.h / 2 + 10, { steps: 3 }); await W(600);
      tb = await vbox(colSel); d.heldAtTarget = { inView: await colsInView(), column: tb };
      if (!tb) { await p.mouse.up(); await W(2000); d.result = 'released WITHOUT reaching the target column'; await shot(`${tag}-after`); return d; }
    } else { await shot(`${tag}-before`); await p.mouse.move(fb.x + fb.w * 0.45, fb.y + fb.h / 2); await p.mouse.down(); await p.mouse.move(fb.x + fb.w * 0.45, fb.y + fb.h / 2 + 8, { steps: 4 }); }
    const hb = await vbox(`[data-test-id="board_column_header_${colId}"]`); const tx = tb.x + tb.w / 2, ty = (hb ? hb.y + hb.h : tb.y) + 90;
    d.dropAt = { x: Math.round(tx), y: Math.round(ty) }; d.underDropBeforeRelease = await colAt(tx, ty);
    await p.mouse.move(tx, ty, { steps: 22 }); await W(800); d.underDropHeld = await colAt(tx, ty); await shot(`${tag}-holding`);
    await p.mouse.up(); await W(3000); d.result = 'released on the target column'; d.messages = await toasts(p); await shot(`${tag}-after`); return d; }
  const pinsNow = ((await a.get(PREFU)).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  console.log(t(), 'START STATE set C614711', JSON.stringify({ pins: pinsNow.map((x: string) => x === B.staff_id ? 'Technician-B' : x), deletedLead: o.data.techA, wo1: o.data.wo1, wo2: o.data.wo2, wo1Column: o.s5_column?.name ?? null, columns: cols.length }));
  // ---- step 6: WO-2 from Unassigned onto the "Deleted technician" column (the case expects the drop refused)
  if (c1) { await search(p, CUST); await W(1500);
    const ix = (id: string) => cols.findIndex((x: any) => x.id === id); o.s6_order = { deleted: ix(c1.id), of: cols.length };
    o.s6 = await dragTo(`[data-test-id="board_card_${w2}"]`, c1.id, 'end', 's6');
    o.s6_wo2LeadApi = (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id ?? null;
    await jump('start'); o.s6_wo2InUnassigned = (await p.locator(`[data-test-id="board_column_unassigned"] [data-test-id="board_card_${w2}"]`).count()) > 0;
    await jump('end'); o.s6_deletedColumnCards = await p.evaluate(`[...(document.querySelector('[data-test-id="board_column_${c1.id}"]') || document.createElement('div')).querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim())`).catch(() => null); await shot('s6-end-of-board');
    console.log(t(), 'C614711 step 6', JSON.stringify({ drag: o.s6, wo2Lead: o.s6_wo2LeadApi, wo2InUnassigned: o.s6_wo2InUnassigned, deletedColumnCards: o.s6_deletedColumnCards })); }
  else o.s6 = 'not made: the column holding WO-1 was not found in step 5';
  fs.writeFileSync(path.join(EV, 'C614711-r4.json'), JSON.stringify(o, null, 1));
  // ---- step 7: Tech View — the group headed "Deleted technician" (the table scrolled to its bottom until it is drawn)
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000);
  let gd: any = null; const seenNames: string[] = []; let k = 0;
  for (; k < 40 && !gd; k++) { const gs = await groups(p); for (const g of gs) if (!seenNames.includes(g.name)) seenNames.push(g.name);
    gd = gs.find((x) => /Deleted technician/i.test(String(x.name))) ?? gs.find((x) => x.rows.includes(o.data.wo1)) ?? null; if (gd) break;
    const moved = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop = s.scrollHeight; return s.scrollTop !== b; })()`).catch(() => false); await W(900); if (!moved && k > 2) { const gs2 = await groups(p); gd = gs2.find((x) => /Deleted technician/i.test(String(x.name))) ?? gs2.find((x) => x.rows.includes(o.data.wo1)) ?? null; break; } }
  o.s7_find = { scrolls: k, groupNamesSeenLast: seenNames.slice(-6), groupsSeen: seenNames.length };
  if (gd?.collapsed) { await p.locator(`[data-test-id="button_tech_view_group_toggle_${gd.id}"]`).click().catch(() => {}); await W(1500); gd = (await groups(p)).find((x) => x.id === gd.id) ?? gd; o.s7_expandedByScript = true; }
  o.s7_group = gd ? { name: gd.name, id: gd.id, rows: gd.rows, holdsWo1: gd.rows.includes(o.data.wo1) } : null;
  if (gd) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${gd.id}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await W(600);
    o.s7_header = await p.evaluate((id) => { const h = document.querySelector(`[data-test-id="tech_view_group_${id}"]`) as HTMLElement | null; return h ? { text: h.innerText.replace(/\s+/g, ' ').trim(), inactiveMarker: !!h.querySelector('[data-test-id*="inactive"], [class*="inactive"]') || /inactive/i.test(h.innerText), grip: !!h.querySelector('[data-test-id^="tech_view_group_drag_handle_"]'), html: h.outerHTML.slice(0, 500) } : null; }, gd.id); }
  console.log(t(), 'C614711 step 7', JSON.stringify({ find: o.s7_find, group: o.s7_group, header: o.s7_header ? { text: o.s7_header.text, inactiveMarker: o.s7_header.inactiveMarker, grip: o.s7_header.grip } : null }));
  await shot('s7-tech-view');
  // ---- step 8: List, WO-1's Lead Technician cell (unchanged)
  await display(p, 'List'); await W(2500); await search(p, CUST); await W(1500);
  o.s8_leadCell = await p.evaluate((n) => { const heads = [...document.querySelectorAll('thead th')].map((th) => (th as HTMLElement).innerText.replace(/arrow_drop_(up|down)/g, '').trim()); const i = heads.findIndex((h) => /^Lead Technician$/i.test(h));
    const tr = [...document.querySelectorAll('tbody tr')].find((r) => (r as HTMLElement).innerText.includes(n)) as HTMLTableRowElement | undefined; return { heads: heads.slice(0, 20), column: i, cell: tr && i >= 0 ? (tr.cells[i]?.innerText ?? '').trim() : null, rowFound: !!tr }; }, o.data.wo1);
  await shot('s8-list');
  // ---- steps 9-10: Board View, WO-1 dragged out of "Deleted technician" onto Technician-B (pinned: his column is at the start)
  await display(p, 'Board View'); o.s9_ok = true; await search(p, CUST); await W(1500);
  if (c1) o.s10 = await dragTo(`[data-test-id="board_card_${w1}"]`, B.staff_id, 'start', 's10');
  o.s10_messages = o.s10?.messages ?? await toasts(p); o.s10_wo1Lead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id === B.staff_id ? 'Technician-B' : 'not Technician-B';
  console.log(t(), 'C614711 step 10', JSON.stringify({ drag: o.s10 ?? null, lead: o.s10_wo1Lead, messages: o.s10_messages }));
  o.pinsBack = (await a.put(PREFU, { value: { ...((await a.get(PREFU)).body?.data?.value ?? {}), pinnedTechnicianIds: o.pinsAtStart } })).status;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'C614711-r4.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614711', JSON.stringify(o).slice(0, 2500)); await done(browser);
