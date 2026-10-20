/**
 * S4 shifts and the "Clear …'s scheduled shifts?" question (2026-10-08): C368134 wording, C368135 cancel / X / Escape /
 * outside click, C368136 where it shows, C154889 on removal, C368133 only for unfinished whole-work-order shifts,
 * C96965 what Clear removes, C154888 ended / future / running, C154890 a failed save does nothing half.
 * Tech-A Esther Howard, Tech-B Ralph Edwards, Tech-C Dana Ortiz. For the drags, Tech-A and Tech-B are pinned so their
 * columns stand side by side; the admin's own pins are put back at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, toggleGroup, openReassign, toasts, shiftPrompt, pickLeadTyped } from './wob.mts';
import { pickTech } from './fx6-1017.mts';
import { staffRows, person, ensureEligible } from './staff.mts';
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
R.startState = await startState(p, a, 'c690649-652', { clearCollapsed: true });
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
  fs.writeFileSync(path.join(EV, 'c690649-652-1020.json'), JSON.stringify(R, null, 1));
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
/**
 * 20 Oct 2026 — release copies C690649 (of C154889) and C690652 (of C368136), by THEIR OWN steps:
 *  - both remove the lead with the card's/row's More actions > Unassign (s4-batchC used the Reassign dialog's "Unassigned" option, which is
 *    not the copy's step);
 *  - C690652 steps 11-12 change the lead on the work order page: that list stops at ~100 names (SV-11429), so Ralph Edwards is not drawn and
 *    s4-batchC stopped there. [Tech-B] is only an example; the page's step checks ONE thing (no shift question), so the new lead is
 *    "AA ZZAUTOTEST C690652 Ben", whose name sorts into the first ~100 (L0482).
 */
const unassign = async (woId: string, where: 'board' | 'tech') => {
  const host = p.locator(where === 'board' ? `[data-test-id="board_card_${woId}"]` : `[data-test-id="tech_view_row_${woId}"]`);
  if (where === 'tech') await findRow(p, woId).catch(() => null);
  await host.hover(); await host.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(900);
  const it = p.locator('.q-menu .q-item').filter({ hasText: /^\s*Unassign\s*$/i }).first();
  const label = await it.innerText().catch(() => null); await it.click(); await p.waitForTimeout(1000); return label?.trim() ?? null;
};
const qRead = async () => { await waitPrompt(4000).catch(() => {}); const d = promptLoc(); return { opened: await d.count(),
  title: await d.locator('[data-test-id="text_dialog_title"]').first().textContent({ timeout: 2000 }).then((x) => x?.trim() ?? null).catch(() => null),
  text: await d.innerText({ timeout: 2000 }).then((x) => x.replace(/\s+/g, ' ').trim().slice(0, 400)).catch(() => null),
  buttons: await d.locator('button').allTextContents().catch(() => []) }; };
const colOfWo = async (num: string) => (await boardCols(p)).find((c) => c.cards.includes(num))?.name ?? null;
const scheduleTomorrow = async (cname: string, tag: string) => {
  await p.goto(`${APP}/schedule`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000); await p.getByRole('button', { name: /^\s*Today\s*$/ }).first().click().catch(() => {}); await p.waitForTimeout(2500);
  await p.locator('[data-test-id="button_schedule_next"]').first().click().catch(() => {}); await p.waitForTimeout(4000);
  const r = { range: await p.locator('[data-test-id="text_schedule_range"]').innerText().catch(() => null), blocks: (await p.locator('.fc-event, .fc-timeline-event').filter({ hasText: cname }).allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').slice(0, 120)) };
  { const ev = p.locator('.fc-event, .fc-timeline-event').filter({ hasText: cname }).first(); if (await ev.count()) { await ev.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(800); } } await shot(p, tag); return r; };

await run('C690649', async () => {
  const n = 'ZZAUTOTEST F1 Remove Lead Prompt'; const o: any = (R.C690649 = {});
  const ws = await fresh(n, 'ZZF4RP', 2); for (const w of ws) { await setLeadApi(w.id, ES.staff_id); if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240); }
  o.start = { leads: await lead(n), shifts: Object.fromEntries(await Promise.all(ws.map(async (w) => [w.number, await shiftsOn(a, w.id, names)]))) };
  await bv(n); o.s1 = { wo1: await colOfWo(ws[0].number), wo2: await colOfWo(ws[1].number) }; await shot(p, 'C690649-s1-board');
  await dragTo(ws[0].id, 'unassigned'); o.s4 = await qRead(); await shot(p, 'C690649-s4-drag-question');
  await shiftPrompt(p, 'Keep shifts'); o.s5 = { wo1: await colOfWo(ws[0].number), lead: (await lead(n))[ws[0].number] }; await shot(p, 'C690649-s5-after-keep');
  o.s6 = { menuItem: await unassign(ws[1].id, 'board') }; o.s7 = await qRead(); await shot(p, 'C690649-s7-unassign-question');
  await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500); o.s8 = { wo1: await colOfWo(ws[0].number), wo2: await colOfWo(ws[1].number), leads: await lead(n) }; await shot(p, 'C690649-s8-both-unassigned');
  const cname = (await a.get(`/api/work-orders/view/${ws[0].id}`)).body?.data?.work_order?.company_name ?? n;
  o.s9 = { screen: await scheduleTomorrow(cname, 'C690649-s9-schedule-tomorrow'), shifts: Object.fromEntries(await Promise.all(ws.map(async (w) => [w.number, await shiftsOn(a, w.id, names)]))) };
  for (const w of ws) await setLeadApi(w.id, ES.staff_id);
});

await run('C690652', async () => {
  const n = 'ZZAUTOTEST F1 Prompt Where'; const o: any = (R.C690652 = {});
  const [w] = await fresh(n, 'ZZF4PH');
  await setLeadApi(w.id, ES.staff_id); if (!(await shiftsOn(a, w.id, names)).length) await mkShift(a, w.id, ES.staff_id, 1, '08:00', 240);
  o.start = { lead: (await lead(n))[w.number], shifts: await shiftsOn(a, w.id, names) };
  const BEN = (await person(a, 'AA ZZAUTOTEST C690652', 'Ben', { role: ES.role_id, email: `zz.wob.aa.c690652.ben${D}`, clockable: true })).row; await ensureEligible(a, BEN, 'Ben').catch(() => {});
  const BEN_NAME = 'AA ZZAUTOTEST C690652 Ben';
  let prompts = 0;
  for (const where of ['board', 'tech'] as const) {
    const r: any = (o[where] = {});
    await bv(n, where === 'board' ? 'Board View' : 'Tech View');
    if (where === 'tech') { const un = (await groups(p)).find((g) => g.id === 'unassigned'); if (un && !un.collapsed) await toggleGroup(p, 'unassigned'); }
    r.start = where === 'board' ? await colOfWo(w.number) : (await groups(p)).find((g: any) => g.id === ES.staff_id)?.rows ?? null; await shot(p, `C690652-${where}-start`);
    await dragTo(w.id, RE.staff_id, where); r.dragQ = await qRead(); await shot(p, `C690652-${where}-drag-question`); await shiftPrompt(p, 'Keep shifts');
    r.afterDrag = (await lead(n))[w.number];
    await dragTo(w.id, ES.staff_id, where); r.backQ = (await qRead()).opened; await shiftPrompt(p, 'Keep shifts'); r.afterBack = (await lead(n))[w.number];
    r.menuItem = await unassign(w.id, where); r.unassignQ = await qRead(); await shot(p, `C690652-${where}-unassign-question`); await shiftPrompt(p, 'Keep shifts');
    r.afterUnassign = (await lead(n))[w.number]; await shot(p, `C690652-${where}-after-unassign`);
    await dragTo(w.id, ES.staff_id, where); r.fromUnassignedQ = (await qRead()).opened; await shiftPrompt(p, 'Keep shifts'); r.afterReturn = (await lead(n))[w.number];
    if (r.afterReturn !== 'Esther Howard') { await setLeadApi(w.id, ES.staff_id); r.restoredByApi = true; }
    prompts += (r.dragQ.opened ? 1 : 0) + (r.unassignQ.opened ? 1 : 0);
  }
  o.promptsDragAndUnassign = prompts;
  { const lines = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; if (!(Array.isArray(lines) ? lines : lines?.lines ?? []).length) { const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0]; await a.post(`/api/work-orders/${w.id}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' }); } }
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000);
  if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) { await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).locator('button').filter({ hasText: /^close$/ }).first().click().catch(() => pg.keyboard.press('Escape')); await pg.waitForTimeout(1200); }
  o.s11 = { lead: (await lead(n))[w.number] }; await pg.screenshot({ path: path.join(EV, 'C690652-s11-wo-page.png') }).catch(() => {});
  const sel = async () => (await pg.locator('[data-test-id="select_lead_technician"]').count()) ? pg.locator('[data-test-id="select_lead_technician"]').first() : pg.locator('.q-field').filter({ has: pg.locator('.q-field__label', { hasText: /Lead Tech/i }) }).first();
  const pk: any = await pickTech(pg, async () => { await (await sel()).click(); }, 'C690652 Lead Technician (work order page)', { prefer: [BEN_NAME], avoid: ['Esther Howard'], control: ['Esther Howard', BEN_NAME] });
  let promptSeen = 0; for (let i = 0; i < 8 && !promptSeen; i++) { promptSeen = await pg.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).count(); await pg.waitForTimeout(500); }
  o.s12 = { picked: pk?.picked ?? null, listCount: pk?.list?.count ?? null, prompt: promptSeen, toasts: await toasts(pg).catch(() => []), lead: (await lead(n))[w.number] };
  await pg.screenshot({ path: path.join(EV, 'C690652-s12-wo-page-after.png') }).catch(() => {});
  if (promptSeen) await shiftPrompt(pg, 'Keep shifts').catch(() => null);
  await pg.close();
  await bv(n, 'List'); await p.waitForTimeout(1500);
  o.s14 = { rowShows: await p.getByText(w.number).count() };
  o.s15 = { moreActionsButtons: await p.evaluate(`[...document.querySelectorAll('[data-test-id="button_work_order_more_actions"]')].length`), leadWords: await p.evaluate(`[...document.querySelectorAll('.q-menu .q-item, button')].map(e => e.innerText).filter(x => /lead tech|reassign|unassign/i.test(x)).slice(0,5)`) };
  await shot(p, 'C690652-s14-list');
  const cname = (await a.get(`/api/work-orders/view/${w.id}`)).body?.data?.work_order?.company_name ?? n;
  o.s16 = { screen: await scheduleTomorrow(cname, 'C690652-s16-schedule-tomorrow'), shifts: await shiftsOn(a, w.id, names) };
  await setLeadApi(w.id, ES.staff_id);
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: ADMIN_PINS } });
fs.writeFileSync(path.join(EV, 'c690649-652-1020.json'), JSON.stringify(R, null, 1));
await done(browser);
