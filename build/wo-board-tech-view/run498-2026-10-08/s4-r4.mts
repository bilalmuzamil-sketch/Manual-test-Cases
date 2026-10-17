/**
 * s4-r4.mts — 17 Oct 2026, ROUND 4 of the run 498 fix-ups on STAGING: C368136 alone (ONLY=C368136), "The clear-shifts question shows on
 * Board and Tech View only". On 17 Oct step 7 (Tech View) stopped waiting 30 s for Ralph Edwards' group, which the table had not drawn
 * (L0430), so steps 7-10 were not read. Tech View drags now go through techDrag(): the case's search kept, the table walked from the TOP
 * until the target group is drawn, the row and the target on screen together, else the row held while the table scrolls to the target;
 * every position logged. Steps 8-10 as s4-batchC. The set-up and helpers are s4-batchC.mts's code, copied unchanged (lines 8-62; only the
 * start tag and the output file changed). Output EV/s4-r4-<ONLY>.json; pictures EV/C368136-r4-*.png. Records only.
 * ───────────────────────────── COPIED FROM s4-batchC.mts (lines 8-62, 17 Oct 2026) ─────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, toggleGroup, openReassign, toasts, shiftPrompt, pickLeadTyped } from './wob.mts';
import { pickTech } from './fx6-1017.mts';
import { staffRows, person } from './staff.mts';
import { mkShift, shiftsOn, localTime } from './shifts.mts';
import { findRow } from './wob.mts';
import { startState, setDisplay, collapsedOnScreen, expandAll } from './fixup-1017.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
await person(a, 'Dana', 'Ortiz', { role: ES.role_id, email: `zz.wob.dana.ortiz${D}`, clockable: true });
const DO = await sid('dana.ortiz');
const names: Record<string, string> = { [ES.staff_id]: 'Esther', [RE.staff_id]: 'Ralph', [DO?.staff_id]: 'Dana' };
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
const ADMIN_PINS = ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'];
// 17 Oct 2026: fix-up — log the saved display / collapsed groups / pins found BEFORE anything is set (16 Oct: every Tech View group
// was collapsed, so no row could be dragged), clear the saved collapsed groups and read them back
R.startState = await startState(p, a, 's4-r4', { clearCollapsed: true });
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
// 17 Oct 2026: fix-up — the display is chosen AND read back (setDisplay); in Tech View the groups are read (how many, which collapsed)
// and every collapsed group is expanded, then read again — a positive control: "none collapsed" only counts with groups > 0
const bv = async (n: string, d = 'Board View') => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await tab(p, 'All'); await setDisplay(p, a, d, `bv ${n}`); if (n) await search(p, n); await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await p.waitForTimeout(600);
  if (d === 'Tech View') { const g0 = await collapsedOnScreen(p); const g1 = g0.collapsed.length ? await expandAll(p) : g0; console.log(t(), 'Tech View groups', n, JSON.stringify({ found: g0, after: g1 })); } };
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
async function fresh(n: string, unit: string, k = 1) { const ws = await workOrders(a, n); if (ws.length >= k) return ws; const c = await customer(a, n, unit); for (let i = ws.length; i < k; i++) await workOrder(a, c, 'approved', ES.staff_id); return workOrders(a, n); }
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2200));
  fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
}
const dragTo = async (woId: string, target: string, where: 'board' | 'tech' = 'board') => {
  if (where === 'board') return drag(p, `[data-test-id="board_card_${woId}"]`, `[data-test-id="board_column_${target}"]`, 120);
  // Tech View: drop on the target group's "No work orders" row when it has one, else on its header
  const empty = `[data-test-id="tech_view_group_empty_${target}"]`;
  // 17 Oct 2026: fix-up — the table draws only the rows near the screen: bring the row on screen first (findRow, as moved-stg4 does)
  const inGroup = await findRow(p, woId); if (!(await p.locator(`[data-test-id="tech_view_row_${woId}"]`).count())) console.log(t(), 'Tech View row not drawn before the drag', woId.slice(0, 8), 'group', inGroup, JSON.stringify(await collapsedOnScreen(p)));
  return drag(p, `[data-test-id="tech_view_row_${woId}"]`, (await p.locator(empty).count()) ? empty : `[data-test-id="tech_view_group_${target}"]`, 10);
};
async function waitPrompt(ms = 4000) { for (let i = 0; i < ms / 250; i++) { if (await promptLoc().count()) return true; await p.waitForTimeout(250); } return false; }
const promptLoc = () => p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last();
const setLeadApi = (woId: string, s: string | null) => a.post('/api/work-orders/change-lead-technician', { work_order_id: woId, tech_assigned_id: s });


// ───────────────────────────── ROUND 4 block (17 Oct 2026) ─────────────────────────────
const OUT4 = path.join(EV, `s4-r4${only.length ? '-' + only.join('-') : ''}.json`);
const vis = async (sel: string) => { const b = await p.locator(sel).first().boundingBox({ timeout: 1500 }).catch(() => null); const vh = p.viewportSize()?.height ?? 900; return b && b.y >= 0 && b.y + b.height <= vh && b.width > 0 ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } : null; };
const TV = '.q-table__middle';
/** Tech View drag of a row onto another technician's group (L0430: the table draws only the groups near the screen). The case's search is
 *  already applied; the table is walked from the TOP until the target group is drawn (positions logged); if the row is drawn and on screen
 *  with it, the drop is plain; otherwise the row is pressed where it is and the table scrolled toward the target WHILE HELD until the target
 *  is drawn on screen, then released on its "No work orders" line (else its header). */
async function techDrag(woId: string, target: string, tag: string) {
  const d: any = { tag }; const rowSel = `[data-test-id="tech_view_row_${woId}"]`, grpSel = `[data-test-id="tech_view_group_${target}"]`, emptySel = `[data-test-id="tech_view_group_empty_${target}"]`;
  await p.evaluate(`(() => { const s = document.querySelector('${TV}'); if (s) s.scrollTop = 0; })()`).catch(() => {}); await p.waitForTimeout(600);
  let k = 0; for (; k < 200 && !(await p.locator(grpSel).count()); k++) { const mv = await p.evaluate(`(() => { const s = document.querySelector('${TV}'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 300; return s.scrollTop !== b; })()`).catch(() => false); await p.waitForTimeout(250); if (!mv) break; }
  d.targetDrawnAfterScrolls = (await p.locator(grpSel).count()) ? k : `not drawn after ${k} scrolls`;
  d.groupsDrawn = (await groups(p)).map((g) => `${names[g.id] ?? (g.id === 'unassigned' ? 'Unassigned' : g.name)}${g.collapsed ? ' (collapsed)' : ''}: ${g.rows.length}`).slice(0, 8);
  await p.evaluate(`document.querySelector(${JSON.stringify(grpSel)})?.scrollIntoView({ block: 'center' })`).catch(() => {}); await p.waitForTimeout(700);
  let from = await vis(rowSel), to = (await vis(emptySel)) ?? (await vis(grpSel)); d.atStart = { row: from, target: to };
  if (!from) { // bring the row on screen, then the target while held
    await p.evaluate(`document.querySelector(${JSON.stringify(rowSel)})?.scrollIntoView({ block: 'center' })`).catch(() => {}); await p.waitForTimeout(600); from = await vis(rowSel);
    if (!from) { await findRow(p, woId).catch(() => null); from = await vis(rowSel); }
    to = (await vis(emptySel)) ?? (await vis(grpSel)); }
  if (!from) { d.result = 'row not on screen'; await shot(p, `C368136-r4-${tag}-no-row`); return d; }
  await shot(p, `C368136-r4-${tag}-before`);
  const gx = from.x + from.w * 0.45; await p.mouse.move(gx, from.y + from.h / 2); await p.mouse.down(); await p.mouse.move(gx, from.y + from.h / 2 + 8, { steps: 4 });
  if (!to) { const rowTop = await p.evaluate(`(() => { const r = document.querySelector(${JSON.stringify(rowSel)}); const g = document.querySelector(${JSON.stringify(grpSel)}); if (!g) return 'target not drawn'; return r && g ? (g.getBoundingClientRect().top < r.getBoundingClientRect().top ? 'up' : 'down') : 'up'; })()`).catch(() => 'up');
    const dir = rowTop === 'down' ? 1 : -1; d.heldScroll = { dir: dir > 0 ? 'down' : 'up' }; let i = 0;
    for (; i < 120 && !to; i++) { await p.evaluate(`(() => { const s = document.querySelector('${TV}'); if (s) s.scrollTop += ${dir * 300}; })()`).catch(() => {}); await p.mouse.move(gx + (i % 2 ? 4 : -4), from.y + from.h / 2 + 10, { steps: 2 }); await p.waitForTimeout(250); to = (await vis(emptySel)) ?? (await vis(grpSel)); }
    d.heldScroll.steps = i; }
  if (!to) { await p.mouse.up(); await p.waitForTimeout(1500); d.result = 'released WITHOUT reaching the target group'; await shot(p, `C368136-r4-${tag}-after`); return d; }
  await p.mouse.move(to.x + to.w / 2, to.y + Math.min(10, to.h / 2), { steps: 20 }); await p.waitForTimeout(700); await shot(p, `C368136-r4-${tag}-holding`);
  await p.mouse.up(); await p.waitForTimeout(2500); d.result = 'released on the target group'; return d; }

await run('C368136', async () => {
  // ROUND 4 (17 Oct 2026): on 17 Oct the Board View half ran (prompt on the drag and on the dialog) and step 7 (Tech View) stopped waiting
  // 30 s for Ralph Edwards' group, which the table had not drawn (L0430). Now Tech View drags go through techDrag() (search kept, the
  // table walked from the top until the target group is drawn, the row and the target both on screen, or the row held while the table
  // scrolls to the target). The Tech View row's More actions is opened with the row brought on screen first. Steps 8-10 as s4-batchC.
  const n = 'ZZAUTOTEST F1 Prompt Where';
  const [w] = await fresh(n, 'ZZF4PH');
  const found136 = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names), pins: ((await prefGet()).pinnedTechnicianIds ?? []).map((x: string) => names[x] ?? x.slice(0, 8)) }; console.log(t(), 'START STATE found C368136', JSON.stringify(found136));
  await setLeadApi(w.id, ES.staff_id);
  if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
  const set136 = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names), pins: ((await prefGet()).pinnedTechnicianIds ?? []).map((x: string) => names[x] ?? x.slice(0, 8)) }; console.log(t(), 'START STATE set C368136', JSON.stringify(set136));
  R.C368136 = { startFound: found136, startSet: set136 };
  for (const where of ['board', 'tech'] as const) {
    await bv(n, where === 'board' ? 'Board View' : 'Tech View'); const r: any = (R.C368136[where] = {});
    if (where === 'tech') { await p.setViewportSize({ width: 1600, height: 1400 }); await p.waitForTimeout(800); const un = (await groups(p)).find((g) => g.id === 'unassigned'); if (un && !un.collapsed) await toggleGroup(p, 'unassigned'); r.searchHolds = await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null); }
    if (where === 'board') await dragTo(w.id, RE.staff_id, where); else r.drag1 = await techDrag(w.id, RE.staff_id, 'tech-to-B');
    r.dragPrompt = !!(await shiftPrompt(p, 'Keep shifts')); r.leadAfterDrag = (await lead(n))[w.number];
    if (where === 'board') await dragTo(w.id, ES.staff_id, where); else r.drag2 = await techDrag(w.id, ES.staff_id, 'tech-back-to-A');
    r.backPrompt = !!(await shiftPrompt(p, 'Keep shifts')); r.leadAfterBack = (await lead(n))[w.number];
    if (r.leadAfterBack !== 'Esther Howard') { await setLeadApi(w.id, ES.staff_id); r.leadPutBackForTheDialogStep = (await lead(n))[w.number]; await bv(n, where === 'board' ? 'Board View' : 'Tech View'); }
    if (where === 'tech') { await findRow(p, w.id).catch(() => null); await p.evaluate(`document.querySelector('[data-test-id="tech_view_row_${w.id}"]')?.scrollIntoView({ block: 'center' })`).catch(() => {}); await p.waitForTimeout(700); }
    const o = await openReassign(p, w.id, where); await o.item.click(); await p.waitForTimeout(1200);
    await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click();
    r.dialogPrompt = !!(await shiftPrompt(p, 'Keep shifts')); r.leadAfterDialog = (await lead(n))[w.number]; await shot(p, `C368136-r4-${where}-after-dialog`);
    // "Move it back to [Tech-A] the same way": through the dialog again
    { const o2 = await openReassign(p, w.id, where).catch(() => null); if (o2) { await o2.item.click(); await p.waitForTimeout(1200); await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click().catch(() => {}); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click().catch(() => {}); r.dialogBackPrompt = !!(await shiftPrompt(p, 'Keep shifts')); } }
    r.lead = (await lead(n))[w.number]; if (r.lead !== 'Esther Howard') { await setLeadApi(w.id, ES.staff_id); r.leadPutBack = true; }
    console.log(t(), `C368136 ${where}`, JSON.stringify(r));
    fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
  }
  await p.setViewportSize({ width: 1600, height: 900 });
  // step 8: the work order page (as s4-batchC)
  { const lines = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; if (!(Array.isArray(lines) ? lines : lines?.lines ?? []).length) { const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0]; await a.post(`/api/work-orders/${w.id}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' }); } }
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) { await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).locator('button').filter({ hasText: /^close$/ }).first().click().catch(() => pg.keyboard.press('Escape')); await pg.waitForTimeout(1200); }
  const sel = async () => (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]').first() : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
  const typed = await pickLeadTyped(pg, ['Ralph Edwards'], 'Ralph Edwards').catch(() => ({ picked: false }));
  let used: string | null = (typed as any).picked ? 'Ralph Edwards' : null; let pk: any = null;
  if (!used) { await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(600); pk = await pickTech(pg, async () => { await (await sel()).click(); }, 'C368136 Lead Technician (work order page)', { prefer: ['Ralph Edwards', 'Jenny Wilson', 'Dana Ortiz'], avoid: ['Esther Howard'], control: ['Esther Howard', 'Dana Ortiz'] }); used = pk.picked; }
  let promptSeen = 0; for (let i = 0; i < 8 && !promptSeen; i++) { promptSeen = await pg.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count(); await pg.waitForTimeout(500); }
  R.C368136.woPage = { used, typedPick: (typed as any).picked ?? false, substitute: pk?.substitute ?? null, list: pk ? { count: pk.list.count, first: pk.list.first, last: pk.list.last } : null, prompt: promptSeen, toasts: await toasts(pg).catch(() => []), lead: (await lead(n))[w.number] }; await shot(pg, 'C368136-r4-wo-page');
  if (promptSeen) await shiftPrompt(pg, 'Keep shifts').catch(() => null);
  await pg.close();
  // step 9: List
  await bv(n, 'List');
  R.C368136.listRowMenu = await p.evaluate(`[...document.querySelectorAll('[data-test-id="button_work_order_more_actions"]')].length`);
  R.C368136.listLeadControls = await p.evaluate(`[...document.querySelectorAll('tbody tr')].slice(0, 3).map(r => [...r.querySelectorAll('button, [role=button], .q-field, select')].map(e => (e.getAttribute('data-test-id') || e.getAttribute('aria-label') || e.tagName)).slice(0, 8))`).catch(() => null);
  await shot(p, 'C368136-r4-list');
  // step 10: the Schedule for tomorrow (as s4-batchC)
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2500);
  await p.locator('[data-test-id="button_schedule_next"]').first().click().catch(() => {}); await p.waitForTimeout(4000);
  const cname = (await a.get(`/api/work-orders/view/${w.id}`)).body?.data?.work_order?.company_name ?? n;
  R.C368136.schedule = { range: await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null), blocks: (await p.locator('.fc-event, .fc-timeline-event').filter({ hasText: cname }).allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').slice(0, 120)) };
  { const ev = p.locator('.fc-event, .fc-timeline-event').filter({ hasText: cname }).first(); if (await ev.count()) { await ev.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(800); } } await shot(p, 'C368136-r4-schedule-tomorrow');
  R.C368136.shifts = await shiftsOn(a, w.id, names);
  await setLeadApi(w.id, ES.staff_id);
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: ADMIN_PINS } });
fs.writeFileSync(OUT4, JSON.stringify(R, null, 1));
await done(browser);
