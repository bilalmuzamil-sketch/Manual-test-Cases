/** C614714-stg.mts — DRAFT — not yet run (prepared 16 Oct 2026 for run-full-1016.sh block F; run only with RUN_DRAFTS=1).
 *  Case C614714 "A lead whose Time Clock is turned off keeps a named column that takes no drops" (section 13238), steps as read live
 *  from TestRail on 16 Oct 2026. Source the case asserts: PRD Confluence 845185030 version 61, S3-R20d (added in version 59, Chris Ward
 *  ruling on SV-11416), S3-R20c, S4-N5.
 *  Data (Rule 107, ZZAUTOTEST, fresh each run because the test turns the person's Time Clock off): [Technician-A] "ZZAUTOTEST N1 Tim <n>"
 *  (Technician role, Time Clock on, eligible at Heavy Duty); customer "ZZAUTOTEST N1 Time Clock Off <n>" with WO-1 (Approved, lead A) and
 *  WO-2 (Approved, no lead).
 *  Steps 1-2 through the screen (Settings > Staff, the pencil, the "Time Clock" toggle off, Save & Close); fallback POST
 *  /api/staff/{id}/change with clockable false (staff.mts person() body), reported as NOT done through the screen. Read back either way.
 *  Step 8 through the work order page's Lead Technician field (pickLeadOnPage); fallback change-lead-technician with no lead, reported.
 *  Traps: a Time Clock change on the SIGNED-IN admin's own record ends the shared sign-in (notech-stg4.mts) — only Technician-A is edited;
 *  the "refused" drop in step 5 needs a positive control: the same drag onto an ordinary technician's column must be accepted (made at the
 *  end with Esther Howard, then undone) — without it the refusal is void (Rule 104). Output EV/C614714-stg.json, pictures C614714-stg-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api, customer, workOrder, workOrders, candidates } from './data.mts';
import { EV, t, display, tab, search, groups, drag, toColumn, allBoardCols, toasts, pickLeadOnPage, woPageLead, findRow } from './wob.mts';
import { pickTech } from './fx6-1017.mts';
import { person, roleIds, ensureEligible, staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status }; const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C614714-stg-${n}.png`) }).catch(() => {});
const RUNNO = String(Date.now() % 100000); const D = '@staging.shopview.local'; const TECH = (await roleIds(a))['Technician'];
try {
  const A = (await person(a, 'ZZAUTOTEST N1', `Tim ${RUNNO}`, { role: TECH, email: `zz.wob.n1.tim.${RUNNO}${D}`, clockable: true, workplace: HEAVY })).row;
  o.eligible = await ensureEligible(a, A, 'A'); o.offeredBefore = (await candidates(a)).some((x) => x.id === A.staff_id);
  const CUST = `ZZAUTOTEST N1 Time Clock Off ${RUNNO}`; const c = await customer(a, CUST, 'N1-U1');
  const w1 = await workOrder(a, c, 'approved', A.staff_id), w2 = await workOrder(a, c, 'approved', null);
  const num = async (id: string) => (await workOrders(a, CUST)).find((x: any) => x.id === id)?.number;
  o.data = { techA: `${A.first_name} ${A.last_name}`, customer: CUST, wo1: await num(w1), wo2: await num(w2) };
  // ---- steps 1-2: Settings > Staff > pencil > Time Clock off > Save & Close
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await W(7000);
  const box = p.locator('[data-test-id="page_search_input"], input[placeholder*="Search" i], input[type=search]').first();
  if (!(await box.isVisible().catch(() => false))) { await p.locator('[data-test-id="page_search_toggle"]').first().click().catch(() => {}); await W(800); }
  await box.fill(RUNNO).catch(() => {}); await W(3500);
  const row = p.locator('tbody tr').filter({ hasText: RUNNO }).first(); o.s1_rowFound = await row.count();
  if (o.s1_rowFound) { await row.hover().catch(() => {}); await row.locator('button:has(i:text-is("edit")), button:has(i:text-is("mode_edit")), [data-test-id*="edit"]').first().click().catch(async () => { await row.click().catch(() => {}); }); await W(3000); }
  const dlg = p.locator('.q-dialog:visible').last(); o.s1_opened = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot('s1-staff-record');
  // FIX-UP 2 (17 Oct 2026): on 16 Oct the "Time Clock" toggle was found and clicked and Save & Close pressed, yet the record still read
  // Time Clock ON, so the API change was used. Now the toggle is taken by its LABEL (the .q-toggle holding the words "Time Clock"), its
  // own switch state is read before and after the click (Space is tried if the click did not change it), a picture is taken before Save,
  // every message is captured while saving, the window's state after Save (still open? any field error?) is recorded, and the record is
  // read back from the server — polled for up to 10 s — before the API route is ever used.
  const togState = (tg: any) => tg.evaluate((e: any) => { const sw = e.matches('[role=switch]') ? e : e.querySelector('[role=switch], [aria-checked]'); return sw ? sw.getAttribute('aria-checked') : (e.querySelector('.q-toggle__inner--truthy') ? 'true' : 'false'); }).catch(() => null);
  const tog = dlg.locator('.q-toggle').filter({ hasText: /Time Clock/i }).first(); o.s2_toggle = await tog.count();
  if (o.s2_toggle) { o.s2_before = await togState(tog);
    if (o.s2_before !== 'false') { await tog.locator('.q-toggle__inner, .q-toggle__track').first().click().catch(async () => { await tog.click().catch(() => {}); }); await W(800); o.s2_afterClick = await togState(tog);
      if (o.s2_afterClick !== 'false') { await tog.focus().catch(() => {}); await p.keyboard.press('Space'); await W(800); o.s2_afterSpace = await togState(tog); } }
    await shot('s2-time-clock-off-before-save');
    await p.evaluate(`(() => { window.__tl = []; if (window.__to) window.__to.disconnect(); const grab = () => { for (const e of document.querySelectorAll('.q-notification')) { const t = e.innerText.replace(/\\s+/g, ' ').trim(); if (t && !window.__tl.includes(t)) window.__tl.push(t); } }; window.__to = new MutationObserver(grab); window.__to.observe(document.body, { childList: true, subtree: true, characterData: true }); })()`).catch(() => {});
    // 22 Oct 2026 (production): Save & Close left the window open with no message and the record unchanged. Record what the save SENT and
    // what came back (every non-GET call to /api/ for 6 s), so the second attempt tells a refused save from a click that never fired.
    const sent: any[] = []; const onResp = async (r: any) => { try { const q = r.request(); if (q.method() !== 'GET' && /\/api\//.test(r.url())) sent.push({ m: q.method(), u: r.url().replace(/^https?:\/\/[^/]+/, '').slice(0, 90), s: r.status(), body: (await r.text().catch(() => '')).slice(0, 300) }); } catch { /* */ } };
    p.on('response', onResp);
    await dlg.locator('button').filter({ hasText: /^\s*Save & Close\s*$/ }).last().click().catch(() => {}); await W(6000); p.off('response', onResp); o.s2_saveCalls = sent;
    o.s2_messages = [...new Set([...(await p.evaluate('window.__tl || []').catch(() => []) as string[]), ...(await toasts(p))])];
    o.s2_windowAfterSave = { open: await p.locator('.q-dialog:visible').count(), fieldErrors: await p.evaluate(`[...document.querySelectorAll('.q-dialog .q-field--error')].map(f => f.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80))`).catch(() => []) };
    for (let i = 0; i < 10; i++) { const rr = (await staffRows(a, A.email)).find((x: any) => x.staff_id === A.staff_id); if (rr && !rr.clockable) break; await W(1000); }
    o.s2_route = 'screen'; await shot('s2-after-save'); }
  let r2 = (await staffRows(a, A.email)).find((x: any) => x.staff_id === A.staff_id);
  if (!o.s2_toggle || r2?.clockable) { o.s2_route = 'screen route not found or did not save; API change used (steps 1-2 NOT done through the screen)';
    o.s2_api = (await a.post(`/api/staff/${A.staff_id}/change`, { first_name: r2.first_name, last_name: r2.last_name, email: r2.email, role_id: r2.role_id, workplace_id: r2.workplace_id ?? HEAVY, job_title: r2.job_title, salary_type: r2.salary_type, salary: r2.salary, billable: !!r2.billable, clockable: false })).status;
    r2 = (await staffRows(a, A.email)).find((x: any) => x.staff_id === A.staff_id); }
  o.s2_clockableAfter = r2?.clockable ?? null; await shot('s2-saved');
  // ---- steps 3-5: Board View, Search, WO-1's column, drop WO-2 onto it
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View'); await search(p, CUST); await W(2000);
  const cols = await allBoardCols(p); const c1 = cols.find((x: any) => (x.cards ?? []).includes(o.data.wo1));
  o.s4_column = c1 ? { id: c1.id === A.staff_id ? 'Technician-A' : c1.id, name: c1.name, cards: c1.cards } : 'WO-1 not on the board';
  if (await toColumn(p, A.staff_id)) await shot('s4-column');
  await drag(p, `[data-test-id="board_card_${w2}"]`, `[data-test-id="board_column_${A.staff_id}"]`).catch((e) => { o.s5_dragError = String(e).slice(0, 120); });
  o.s5_messages = await toasts(p); o.s5_wo2Lead = (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id ?? null;
  o.s5_columnAfter = (await allBoardCols(p)).find((x: any) => x.id === A.staff_id)?.cards ?? null; await shot('s5-after-drop');
  // ---- step 6: Tech View group — FIX-UP 2: Technician-A's group sits far down among ~100 groups; the case's search is applied and the
  // row is brought on screen with findRow (opens the group, scrolls the table), then the group holding it is read by its key and name.
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000); o.s6_rowGroupKey = await findRow(p, w1, A.staff_id).catch(() => null);
  const g = await groups(p); o.s6_group = g.filter((x) => x.rows.includes(o.data.wo1)).map((x) => ({ name: x.name, id: x.id === A.staff_id ? 'Technician-A' : x.id, rows: x.rows }));
  o.s6_groupName = await p.locator(`[data-test-id="tech_view_group_name_${o.s6_rowGroupKey || A.staff_id}"]`).innerText().catch(() => null); o.s6_groupsSeen = g.map((x) => `${x.name}(${x.count})`).slice(0, 12);
  await p.evaluate(`document.querySelector('[data-test-id="tech_view_row_${w1}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await W(600); await shot('s6-tech-view');
  // ---- steps 7-8 — FIX-UP 2: the row click on 16 Oct left the page on the list; the row's own number link (else a plain cell) is clicked
  // and the address read back; Lead Technician is then set to "Unassigned" on the work order page (the field by test id or by its label,
  // the "Unassigned" option picked from the open list and read back on screen and from the server). The API route is only a logged fallback.
  const rowL = p.locator(`[data-test-id="tech_view_row_${w1}"]`).first(); const link = p.locator(`[data-test-id="number_link_${w1}"]`).first(); o.s7_numberLink = await link.count();
  if (o.s7_numberLink) await link.click().catch(() => {}); else await rowL.locator('td').nth(3).click().catch(() => {});
  for (let i = 0; i < 10 && !p.url().includes(`/workorders/${w1}`); i++) await W(1000);
  o.s7_url = p.url().replace(APP, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '<id>'); o.s7_opened = p.url().includes(`/workorders/${w1}`); await W(4000); await shot('s7-wo-page');
  if (!o.s7_opened) { await p.goto(`${APP}/workorders/${w1}/lines`, { waitUntil: 'domcontentloaded' }); await W(7000); o.s7_note = 'the row did not open the page; opened by its address to continue (step 7 NOT seen working)'; }
  const leadF = async () => (await p.locator('[data-test-id="select_lead_technician"]').count()) ? p.locator('[data-test-id="select_lead_technician"]').first() : p.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
  o.s8_field = await (await leadF()).count(); o.s8_fieldText = ((await (await leadF()).innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
  if (o.s8_field) { const pk = await pickTech(p, async () => { await (await leadF()).click(); }, 'C614714 Lead Technician (work order page)', { prefer: ['Unassigned'], exact: true }); o.s8_pick = { picked: pk.picked, count: pk.list.count, first: pk.list.first, reason: pk.reason ?? null }; await W(2500); o.s8_messages = await toasts(p); }
  let lead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id ?? null;
  if (lead) { o.s8_route = 'screen did not clear the lead; API used (step 8 NOT done through the screen)'; o.s8_api = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: w1, tech_assigned_id: null })).status; lead = (await a.get(`/api/work-orders/view/${w1}`)).body?.data?.work_order?.tech_assigned_id ?? null; }
  else o.s8_route = 'screen';
  o.s8_leadAfter = lead; await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000); o.s8_pageReads = await woPageLead(p, APP, w1).catch(() => null); await shot('s8-lead-unassigned');
  // ---- steps 9-10: no column / group for Technician-A any more
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View');
  o.s9_columnForA = (await allBoardCols(p)).some((x: any) => x.id === A.staff_id); await shot('s9-board');
  await display(p, 'Tech View'); await W(2000); await search(p, CUST); await W(2000);   // fix-up 2: the case's search, so WO-1's group is drawn
  { const g10 = await groups(p); o.s10_groupForA = g10.some((x) => x.id === A.staff_id); o.s10_wo1Group = g10.find((x) => x.rows.includes(o.data.wo1))?.name ?? null; o.s10_groupsSeen = g10.map((x) => `${x.name}(${x.count})`).slice(0, 12); } await shot('s10-tech');
  // ---- positive control for step 5 (Rule 104): the same kind of drop onto an ordinary technician is accepted, then undone
  const es = (await candidates(a)).find((x) => x.name === 'Esther Howard');
  if (es) { await display(p, 'Board View'); await search(p, CUST); await toColumn(p, es.id); await drag(p, `[data-test-id="board_card_${w2}"]`, `[data-test-id="board_column_${es.id}"]`).catch(() => {});
    o.control = { messages: await toasts(p), accepted: (await a.get(`/api/work-orders/view/${w2}`)).body?.data?.work_order?.tech_assigned_id === es.id };
    await a.post('/api/work-orders/change-lead-technician', { work_order_id: w2, tech_assigned_id: null }); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'C614714-stg.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C614714', JSON.stringify(o).slice(0, 2500)); await done(browser);
