/**
 * S4 Reassign / unassign the lead, batch A (2026-10-08): C96956 dialog list + reassign + unassign + cancel,
 * C96957 messages, C96959 header counts, C96969 same lead, C96973 outside the filter, C96974 open count,
 * C368163 dialog search, C96967 view-only cannot move or reassign, C96970 no drop on inactive / not-eligible.
 * Tech-A = Esther Howard, Tech-B = Ralph Edwards, Tech-C = Jenny Wilson (ZZ test people) unless a case needs others.
 */
import { ME_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, pickLead, read, woPageLead, findRow } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { startState, setDisplay, prefRead, PREF } from './fixup-1017.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local', ORG = (await import('./profile.mts')).ORG;
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const roles: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) /* 15 Oct 2026: staging answers a plain list (L0339) */;
R.nina = (await person(a, 'Nina', 'Newtech', { role: roles.find((r) => (r.label ?? r.name) === 'Technician')?.id, email: `zz.wob.nina.newtech${D}`, clockable: true })).log; console.log(t(), 'roles', roles.length, 'nina', JSON.stringify(R.nina));
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), JW = await sid('jenny.wilson'), NN = await sid('nina.newtech'), VO = await sid('viewonly'), NK = await sid('nick.noclock');
const techs = await candidates(a);
const me = techs.find((x) => x.name === ME_NAME)!;
// 17 Oct 2026: fix-up — log the saved display / pins / collapsed groups found BEFORE anything is set, clear the saved collapsed groups
R.startState = await startState(p, a, 's4-batchA', { clearCollapsed: true });
const bv = async (pg: Page, n: string, d = 'Board View') => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); };
const leadOf = async (n: string) => (await workOrders(a, n)).map((w: any) => `${w.number} lead=${w.techAssignedFirstName ? w.techAssignedFirstName + ' ' + w.techAssignedLastName : 'none'}`);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000)); // 15 Oct 2026: 2000 cut readings short
  fs.writeFileSync(path.join(EV, 's4-batchA.json'), JSON.stringify(R, null, 1));
}
const dialogNames = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="option_lead_technician_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
/** 16 Oct 2026: the dialog read from the top — the search box, every row in order (avatar? photo? "N open"?), and anything in the list that
 *  is NOT a row (a group heading or divider), so "Unassigned first, one list with no grouping" can be judged */
const dialogDetail = (pg: Page) => pg.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].pop(); if (!d) return null; const inp = d.querySelector('input');
  const opts = [...d.querySelectorAll('[data-test-id^="option_lead_technician_"]')]; const list = opts[0] ? opts[0].parentElement : null;
  const others = list ? [...list.children].filter(c => !c.matches('[data-test-id^="option_lead_technician_"]') && c.getBoundingClientRect().height > 0).map(c => (c.className + ' ' + c.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 60)) : [];
  return { search: inp ? { placeholder: inp.getAttribute('placeholder'), value: inp.value } : null, rowCount: opts.length, nonRowItemsInList: others,
    rows: opts.slice(0, 80) /* 22 Oct 2026: all rows (Tech-C sat past row 12 on production) */.map(o => ({ key: o.getAttribute('data-test-id').replace('option_lead_technician_', '').replace(/^([0-9a-f]{8})[0-9a-f-]{28}$/, '$1'), text: o.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60), avatar: !!o.querySelector('.q-avatar, img'), photo: !!o.querySelector('img'), open: /\\d+ open/.test(o.innerText), bg: getComputedStyle(o).backgroundColor })) }; })()`) as Promise<any>;
const typeIn = async (pg: Page, q: string) => { const box = pg.locator('[data-test-id="input_reassign_lead_search"] input, input[data-test-id="input_reassign_lead_search"], .q-dialog input').first(); await box.fill(''); await box.type(q, { delay: 60 }); await pg.waitForTimeout(1200); };
const cancelDlg = async (pg: Page) => { const c = pg.locator('[data-test-id="button_cancel_reassign_lead_technician"]').first(); if (await c.count()) await c.click(); else await pg.locator('.q-dialog button').filter({ hasText: /^\s*Cancel\s*$/i }).first().click(); await pg.waitForTimeout(1500); };

await run('C96956', async () => {
  // 16 Oct 2026 (case rewritten 15 Oct): step 5 is read with the work order LED by Technician-A (Esther Howard) — the lead is set first,
  // since an earlier run left it in Unassigned; the dialog is read from the top (search box, first row, any grouping, avatar and
  // "N open" per row); step 12 is now "type Technician-C's first letters, then Cancel"; steps 14-17: Back, Tech View, the row in
  // Unassigned, the dialog's rows from the top, then Technician-A's row.
  const n = 'ZZAUTOTEST F1 Reassign List';
  const [w] = await seedCase(a, n, 'ZZF4RL', [{ lead: ES.staff_id }]);
  R.C96956 = { setLeadA: (await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id })).status, leadAtStart: await leadOf(n), wo: w.number };
  await bv(p, n); await toColumn(p, ES.staff_id);
  const o = await openReassign(p, w.id); R.C96956.menuDisabled = o.disabled; await o.item.click(); await p.waitForTimeout(1500);
  R.C96956.s4_dialogOpen = await p.locator('.q-dialog').count();
  const names = await dialogNames(p); const has = (x: string) => names.some((y) => y.includes(x));
  R.C96956.s5 = { detail: await dialogDetail(p), list: { count: names.length, first: names[0], unassigned: has('Unassigned'), esther: has('Esther Howard'), ralph: has('Ralph Edwards'), jenny: has('Jenny Wilson'), oliveOffice: has('Olive Office'), timClockuser: has('Tim Clockuser'), inaInactive: has('Ina Active'), nickNoclock: has('Nick Noclock'), ellaElsewhere: has('Ella Elsewhere') } };
  await shot(p, 'C96956-s5-dialog');
  R.C96956.s6_toRalph = { prompt: await pickLead(p, RE.staff_id), toast: await toasts(p), lead: await leadOf(n) };
  await toColumn(p, RE.staff_id); R.C96956.s6_inRalphColumn = (await boardCols(p)).find((c) => c.id === RE.staff_id)?.cards.includes(w.number); await shot(p, 'C96956-s6-board-in-ralph');
  const o2 = await openReassign(p, w.id); await o2.item.click(); await p.waitForTimeout(1200);
  R.C96956.s9_toUnassigned = { prompt: await pickLead(p, 'unassigned'), toast: await toasts(p), lead: await leadOf(n) };
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  R.C96956.s9_inUnassigned = (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number); await shot(p, 'C96956-s9-board-in-unassigned');
  const o3 = await openReassign(p, w.id); await o3.item.click(); await p.waitForTimeout(1200); await typeIn(p, 'Jen'); R.C96956.s12_typed = (await dialogNames(p)).slice(0, 5); await shot(p, 'C96956-s12-typed');
  await cancelDlg(p); R.C96956.s12_afterCancel = { dialog: await p.locator('.q-dialog').count(), lead: await leadOf(n), stillUnassigned: (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number), message: await toasts(p) };
  R.C96956.s13_woPageLead = await woPageLead(p, APP, w.id);
  await bv(p, n, 'Tech View'); R.C96956.s15_group = await findRow(p, w.id, 'unassigned');
  const o4 = await openReassign(p, w.id, 'tech'); await o4.item.click(); await p.waitForTimeout(1500);
  R.C96956.s16 = await dialogDetail(p); await shot(p, 'C96956-s16-tech-dialog');
  R.C96956.s17_toEsther = { prompt: await pickLead(p, ES.staff_id), toast: await toasts(p), lead: await leadOf(n) };
  R.C96956.s17_group = await findRow(p, w.id, ES.staff_id); await shot(p, 'C96956-s17-tech-in-esther');
});

await run('C96957', async () => {
  const n = 'ZZAUTOTEST F1 Lead Messages';
  const [w] = await seedCase(a, n, 'ZZF4LM', [{ lead: ES.staff_id }]);
  // pin Esther and Ralph for the moment so both columns stand side by side
  await bv(p, n);
  const pinned0: string[] = ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click(); await p.waitForTimeout(1200); }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  const t0 = Date.now();
  await drag(p, `[data-test-id="board_card_${w.id}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120);
  const prompt1 = await shiftPrompt(p);
  const m1 = await toasts(p); await shot(p, 'C96957-message-1'); let gone1 = -1; for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); if (!(await toasts(p)).length) { gone1 = Math.round((Date.now() - t0) / 1000); break; } }
  R.C96957 = { drag1: { prompt: prompt1, message: m1, goneAfterSec: gone1, lead: await leadOf(n) } };
  const t1 = Date.now();
  await drag(p, `[data-test-id="board_card_${w.id}"]`, '[data-test-id="board_column_unassigned"]', 120);
  const prompt2 = await shiftPrompt(p);
  const m2 = await toasts(p); await shot(p, 'C96957-message-2'); let gone2 = -1; for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); if (!(await toasts(p)).length) { gone2 = Math.round((Date.now() - t1) / 1000); break; } }
  R.C96957.drag2 = { prompt: prompt2, message: m2, goneAfterSec: gone2, lead: await leadOf(n) };
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1000); }
});

await run('C96959', async () => {
  const n = 'ZZAUTOTEST F1 Header Counts';
  let wos = await seedCase(a, n, 'ZZF4HC', [{ lead: ES.staff_id }, { lead: ES.staff_id }, { lead: ES.staff_id }, { lead: RE.staff_id }]);
  // 15 Oct 2026 (wave 12, fourth pass): an earlier run had left one of the four unassigned (start 2/1/1, not the case's 3/1/0). The
  // four leads are put back first — three Esther Howard, one Ralph Edwards — and read back from the records before anything is done.
  const resetLog = []; for (const [i, w] of wos.slice(0, 4).entries()) resetLog.push((await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: i < 3 ? ES.staff_id : RE.staff_id })).status);
  wos = await workOrders(a, n);
  const startLeads = { esther: wos.filter((w: any) => w.techAssignedId === ES.staff_id).length, ralph: wos.filter((w: any) => w.techAssignedId === RE.staff_id).length, unassigned: wos.filter((w: any) => !w.techAssignedId).length, total: wos.length, reset: resetLog };
  await bv(p, n);
  const counts = async () => { const all = await (await import('./wob.mts')).allBoardCols(p); const f = (id: string) => all.find((c) => c.id === id)?.count; return { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; };
  R.C96959 = { startLeadsFromRecords: startLeads, before: await counts() }; await shot(p, 'C96959-before');
  // 17 Oct 2026: fix-up — on 16 Oct the card was "not found" before the drag: the picture (C96959-error) shows neither Esther Howard nor
  // Ralph Edwards pinned, so both columns were far along the ~260-column board and not drawn. The pin buttons are TOGGLES and the saved
  // pins were read straight after C96957 had unpinned them by click (the save had not landed), so the clicks here did nothing or undid
  // themselves. Now the two are pinned through the saved choice (PUT, as s4-batchC does), the page reloaded, the pins read back from the
  // preference AND from the screen (their columns right after Unassigned), and the source column and the card are brought on screen
  // (toColumn) and checked before the drag; the target column is checked on screen too. The pins are put back at the end (PUT).
  const pinned0: string[] = ((await a.get(PREF)).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  { const pv = (await a.get(PREF)).body?.data?.value ?? {}; R.C96959.pinPut = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } })).status; }
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await setDisplay(p, a, 'Board View', 'C96959 after pinning'); await search(p, n);
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  R.C96959.pinsReadBack = { saved: (await prefRead(a)).pinned, firstColumnsOnScreen: (await boardCols(p)).slice(0, 4).map((c) => `${c.name} pinned=${c.pinned}`) };
  const w1 = wos.find((w: any) => w.techAssignedId === ES.staff_id)!;
  const onScr = (sel: string) => p.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return 'not drawn'; const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.width > 0 ? 'on screen' : 'off screen @' + Math.round(r.left); })()`) as Promise<string>;
  if ((await onScr(`[data-test-id="board_card_${w1.id}"]`)) !== 'on screen') await toColumn(p, ES.staff_id);
  R.C96959.beforeDrag = { card: await onScr(`[data-test-id="board_card_${w1.id}"]`), target: await onScr(`[data-test-id="board_column_${RE.staff_id}"]`) };
  console.log(t(), 'C96959 before drag', JSON.stringify(R.C96959.pinsReadBack), JSON.stringify(R.C96959.beforeDrag));
  await drag(p, `[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p);
  const hc = async () => { const cs = await boardCols(p); const f = (id: string) => cs.find((c) => c.id === id)?.count; return { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; };
  R.C96959.afterDrag = await hc(); await shot(p, 'C96959-after-drag');
  const o = await openReassign(p, w1.id); await o.item.click(); await p.waitForTimeout(1200); await pickLead(p, 'unassigned');
  R.C96959.afterDialog = await hc(); await shot(p, 'C96959-after-dialog');
  R.C96959.techSet = (await setDisplay(p, a, 'Tech View', 'C96959 Tech View')).ok; const g = await groups(p); const f = (id: string) => g.find((x) => x.id === id)?.count; // 17 Oct 2026: fix-up — read back
  R.C96959.tech = { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; await shot(p, 'C96959-tech'); await display(p, 'Board View');
  { const pv = (await a.get(PREF)).body?.data?.value ?? {}; R.C96959.pinsPutBack = (await a.put(PREF, { value: { ...pv, pinnedTechnicianIds: pinned0 } })).status; } // 17 Oct 2026: fix-up — pins back through the saved choice
});

await run('C96969', async () => {
  // 15 Oct 2026 (wave 12, fourth pass): Line 2 had been made BEFORE the lead was set, so it followed the lead (Esther Howard) instead of
  // reading Unassigned. On this build a line made before the lead follows the lead, and a line made AFTER the lead is set reads
  // Unassigned (case-seed.mts "Line 1 Unassigned"). So a FRESH work order each run: Line 1, approve, lead Esther Howard, THEN Line 2;
  // Line 2 is read back (must be "Unassigned", not "follows lead") before the steps.
  const n = `ZZAUTOTEST F1 Same Lead Again ${Date.now() % 100000}`;
  const c0 = await customer(a, n, 'ZZF4SL'); const wid = await workOrder(a, c0, 'estimate', null);
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? []);
  await a.post(`/api/work-orders/${wid}/lines/create-from-canned-line`, { canned_line_id: cl[0].id, status: 'authorized' });
  await a.post('/api/work-orders/change-status', { id: wid, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wid, tech_assigned_id: ES.staff_id });
  await a.post(`/api/work-orders/${wid}/lines/create-from-canned-line`, { canned_line_id: (cl[1] ?? cl[0]).id, status: 'authorized' });
  const w = (await workOrders(a, n)).find((x: any) => x.id === wid)!;
  const linesRaw = async () => { const r = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; return Array.isArray(r) ? r : r?.lines ?? r?.collection ?? []; };
  const hist = async () => ((await a.get(`/api/work-orders/${w.id}/history`)).body?.data?.history ?? []).map((h: any) => h.eventName);
  // 15 Oct 2026 (third pass): the line read was a JSON text cut at 400 characters, so Line 2 was never read — now one short
  // reading per line: its name, its technicians (or "Unassigned") and whether they follow the lead
  const linesTech = async () => { const lt = (await a.get(`/api/work-orders/${w.id}/line-technicians`)).body?.data; const lines = await linesRaw(); const nm = Object.fromEntries(lines.map((l: any) => [l.line_id, (l.line_name ?? l.name ?? l.lineName ?? '').trim().slice(0, 30)]));
    return ((lt?.lineTechnicians ?? []) as any[]).map((x: any, i: number) => `Line ${i + 1} ${nm[x.lineId] ?? x.lineId?.slice(0, 6)}: ${(x.technicians ?? []).map((t2: any) => `${t2.firstName ?? ''} ${t2.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}${x.needsTechnicians ? ' (needs technicians)' : ''}`); };
  R.C96969 = { linesBefore: await linesTech(), historyBefore: await hist() };
  await bv(p, n); await toColumn(p, ES.staff_id);
  const o = await openReassign(p, w.id); await o.item.click(); await p.waitForTimeout(1200);
  R.C96969.confirmEnabledForCurrent = await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click().then(async () => { await p.waitForTimeout(400); return p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').isEnabled(); });
  await shot(p, 'C96969-dialog-current-picked');
  if (R.C96969.confirmEnabledForCurrent) { await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p); } else await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click();
  await p.waitForTimeout(1500);
  R.C96969.message = await toasts(p); R.C96969.lead = await leadOf(n); R.C96969.linesAfter = await linesTech(); R.C96969.historyAfter = await hist();
  // positive control: a real lead change DOES add a history entry and shows a message
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: RE.staff_id });
  R.C96969.controlHistory = await hist();
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id });
});

await run('C96973', async () => {
  // 16 Oct 2026: follows the case as rewritten (Expected corrected 15 Oct to the PRD: after the reassign your column is hidden and the board
  // shows "No work orders match these filters", "Try removing a filter to widen your results." and a Clear all filters button - no longer
  // "your column count goes from 1 to 0"). Steps 1-7 each get a reading and a picture; the dialog is checked for BOTH names the Expected
  // gives (Ralph Edwards and Dana Ortiz); the work order's lead is put back to you first (an earlier run left it with Ralph Edwards, and
  // seedCase reuses the work order). Positive control (Rule 104): before the change your column IS drawn with 1 work order, and the
  // empty-state words are read with the same reader the "after" uses.
  const n = 'ZZAUTOTEST F1 Outside Filter';
  const DO = await sid('dana.ortiz');
  const [w] = await seedCase(a, n, 'ZZF4OF', [{ lead: me.id }]);
  const o: any = (R.C96973 = { setup: { lead: (await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: me.id })).status, advisor: (await a.post('/api/work-orders/change-service-advisor', { work_order_id: w.id, service_advisor_id: RE.staff_id })).status, leadNow: await leadOf(n), danaStaff: DO ? `${DO.first_name} ${DO.last_name} active=${DO.is_active}` : 'no zz.wob.dana.ortiz staff record' } });
  const empty = () => p.evaluate(`(() => { const t = (document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ');
    return { noMatchTitle: /No work orders match these filters/.test(t), hint: /Try removing a filter to widen your results\\./.test(t), clearAllButton: [...document.querySelectorAll('button, .q-btn, a')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /Clear all filters/i.test(x)),
      emptyText: (t.match(/No work orders[^.]*\\.?[^.]*\\.?/) || [null])[0] }; })()`);
  const assigned = () => p.locator('[data-test-id="filter_chip_assigned_to_me"]').first().evaluate((e) => e.getAttribute('aria-pressed') ?? (/(selected|active|bg-primary|text-primary)/.test(e.className) ? 'true' : 'false')).catch(() => null);
  // step 1: All tab, Board View, Assigned to me on
  await bv(p, ''); if ((await assigned()) !== 'true') { await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(2500); }
  o.s1 = { assignedToMe: await assigned(), activeTab: await p.evaluate(`(document.querySelector('.q-tab--active, [role=tab][aria-selected=true]') || {}).innerText?.trim() || null`) }; await shot(p, 'C96973-s1-assigned-to-me');
  // step 2: Search; the box's own value is read back after typing (L0387)
  await search(p, n); o.s2 = { searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) }; await shot(p, 'C96973-s2-search');
  // step 3: the technician columns shown (positive control for the "after": your column is drawn with 1)
  const cols0 = await boardCols(p); o.s3 = { columns: cols0.map((c) => `${c.name}(${c.count})`), yourColumn: cols0.filter((c) => c.id === me.id).map((c) => ({ count: c.count, cards: c.cards })), ralphColumnDrawn: cols0.some((c) => c.id === RE.staff_id), danaColumnDrawn: !!DO && cols0.some((c) => c.id === DO.staff_id), emptyStateBefore: await empty() };
  await shot(p, 'C96973-s3-columns');
  // step 4: hover the card, More actions, Reassign lead technician
  await toColumn(p, me.id); await p.evaluate('window.__zzNoReload = 1');
  const r = await openReassign(p, w.id); o.s4 = { itemDisabled: r.disabled }; await r.item.click(); await p.waitForTimeout(1200); o.s4.dialogOpen = await p.locator('.q-dialog').count(); await shot(p, 'C96973-s4-dialog');
  // step 5: the people the dialog lists (Ralph Edwards and Dana Ortiz although their columns are not on screen)
  const names = await dialogNames(p); o.s5 = { listed: names.length, dialogOffersRalph: names.some((x) => x.includes('Ralph Edwards')), dialogOffersDana: names.some((x) => x.includes('Dana Ortiz')), first12: names.slice(0, 12) };
  if (!o.s5.dialogOffersDana) { await typeIn(p, 'Dana'); o.s5.typedDana = { boxHolds: await p.locator('.q-dialog input').first().inputValue().catch(() => null), rows: await dialogNames(p) }; o.s5.dialogOffersDana = (o.s5.typedDana.rows as string[]).some((x) => x.includes('Dana Ortiz')); await typeIn(p, ''); }
  if (!o.s5.dialogOffersRalph) { await typeIn(p, 'Ralph'); o.s5.typedRalph = { boxHolds: await p.locator('.q-dialog input').first().inputValue().catch(() => null), rows: await dialogNames(p) }; o.s5.dialogOffersRalph = (o.s5.typedRalph.rows as string[]).some((x) => x.includes('Ralph Edwards')); }
  await shot(p, 'C96973-s5-dialog-names');
  // step 6: pick Tech-A (Ralph Edwards) and confirm, Keep shifts if asked
  o.s6 = { shiftPrompt: await pickLead(p, RE.staff_id) }; await p.waitForTimeout(2500); o.s6.messages = await toasts(p); o.s6.lead = await leadOf(n); await shot(p, 'C96973-s6-after-confirm');
  // step 7: the board and its header count, without a reload
  const cols1 = await boardCols(p);
  o.s7 = { noReload: await p.evaluate('window.__zzNoReload === 1'), columns: cols1.map((c) => `${c.name}(${c.count}) [${c.cards.join(' ')}]`), yourColumnShown: cols1.some((c) => c.id === me.id), cardStillOnBoard: await p.locator(`[data-test-id="board_card_${w.id}"]`).count(), emptyState: await empty(), assignedToMe: await assigned(), searchHolds: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) };
  await shot(p, 'C96973-s7-empty-state');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(1500);
});

await run('C368163', async () => {
  const n = 'ZZAUTOTEST F1 Dialog Search';
  const [w] = await seedCase(a, n, 'ZZF4DS', [{ lead: ES.staff_id }]);
  const lead0 = (await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id })).status; // 16 Oct 2026: led by Technician-A first
  const once = async (pg: Page, where: 'board' | 'tech') => {
    const o = await openReassign(pg, w.id, where); await o.item.click(); await pg.waitForTimeout(1200);
    const detail = await dialogDetail(pg); // 16 Oct 2026: first row and grouping judged at step 5
    const dlg = pg.locator('.q-dialog').last(); const box = pg.locator('[data-test-id="input_reassign_lead_search"]');
    const r: any = { detail, lead0, top: (await dlg.innerText()).split('\n').slice(0, 3).join(' | '), current: (await pg.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).innerText()).replace(/\s+/g, ' '), full: (await dialogNames(pg)).length, placeholder: await box.getAttribute('placeholder') };
    for (const q of ['Ral', 'ral', 'Olive', 'zzqx']) { await box.fill(q); await pg.waitForTimeout(900); r[q] = { names: (await dialogNames(pg)).slice(0, 6), empty: (await dlg.innerText()).replace(/\s+/g, ' ').match(/No [^.]*?(match|found)[^.]*/i)?.[0] ?? null }; if (q === 'Ral' || q === 'Olive') await shot(pg, `C368163-${where}-${q}`); }
    await box.fill(''); await pg.waitForTimeout(800); r.cleared = (await dialogNames(pg)).length;
    await pg.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await pg.waitForTimeout(1200);
    r.afterCancel = { message: await toasts(pg), lead: await leadOf(n) };
    const o2 = await openReassign(pg, w.id, where); await o2.item.click(); await pg.waitForTimeout(1000);
    r.searchOnReopen = await box.inputValue(); await pg.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await pg.waitForTimeout(800);
    return r;
  };
  await bv(p, n); await toColumn(p, ES.staff_id); R.C368163 = { board: await once(p, 'board') }; await shot(p, 'C368163-board');
  // 15 Oct 2026 (third pass): stopped in Tech View — the row was not drawn (Esther's group collapsed / off screen). Bring it on screen
  // first (findRow opens her group and scrolls to the row).
  await display(p, 'Tech View'); await search(p, n); R.C368163.techRowGroup = await findRow(p, w.id, ES.staff_id); R.C368163.tech = await once(p, 'tech');
});

await run('C96967', async () => {
  const n = 'ZZAUTOTEST F1 View Only No Drag';
  const wos = await seedCase(a, n, 'ZZF4VO', [{ lead: ES.staff_id }, { lead: ES.staff_id }]);
  const v = await viewAs(browser, p, a, VO.id, me.id);
  try {
    await bv(v.page, n); await toColumn(v.page, ES.staff_id);
    const w = wos[0];
    const btn = v.page.locator(`[data-test-id="board_card_${w.id}"] [data-test-id="button_work_order_more_actions"]`);
    R.C96967 = { moreActionsButton: await btn.count() };
    if (await btn.count()) { await v.page.locator(`[data-test-id="board_card_${w.id}"]`).hover(); await btn.click(); await v.page.waitForTimeout(900); R.C96967.menu = await v.page.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].map(e => e.innerText.trim() + (e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') ? ' (disabled)' : ''))`); await v.page.keyboard.press('Escape'); }
    const before = (await boardCols(v.page)).find((c) => c.id === ES.staff_id)?.cards;
    await drag(v.page, `[data-test-id="board_card_${wos[0].id}"]`, '[data-test-id="board_column_unassigned"]', 120).catch((e) => { R.C96967.dragErr = String(e.message).slice(0, 80); });
    await drag(v.page, `[data-test-id="board_card_${wos[1].id}"]`, `[data-test-id="board_card_${wos[0].id}"]`, 2).catch(() => {});
    await toColumn(v.page, ES.staff_id);
    R.C96967.after = { leads: await leadOf(n), order: (await boardCols(v.page)).find((c) => c.id === ES.staff_id)?.cards, before, message: await toasts(v.page) };
    await shot(v.page, 'C96967-viewonly');
  } finally { await v.close(); }
});

await run('C96974', async () => {
  const n = 'ZZAUTOTEST F1 Open Count';
  let wos = await workOrders(a, n);
  if (!wos.length) {
    const c = await customer(a, n, 'ZZF4OC');
    const made: any = {};
    for (const s of ['estimate', 'approved', 'in_progress', 'ready_for_review', 'complete', 'invoiced', 'paid', 'declined']) {
      try { const id = await workOrder(a, c, s === 'estimate' ? 'estimate' : 'approved', NN.staff_id); if (!['estimate', 'approved'].includes(s)) { const r = await a.post('/api/work-orders/change-status', { id, status: s }); made[s] = r.status; } else made[s] = 201; } catch (e: any) { made[s] = String(e.message).slice(0, 80); }
    }
    R.C96974made = made;
    const lineOnly = await workOrder(a, c, 'approved', ES.staff_id);
    const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0];
    const lr = await a.post(`/api/work-orders/${lineOnly}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' });
    const lid = lr.body?.data?.line_id ?? lr.body?.data?.id ?? lr.body?.line_id;
    if (lid) R.C96974lineTech = (await a.put(`/api/work-orders/lines/${lid}/technicians`, { staffIds: [NN.staff_id] })).status;
    wos = await workOrders(a, n);
  }
  R.C96974 = { statuses: wos.map((w: any) => `${w.number} ${w.status} lead=${w.techAssignedFirstName}`) };
  await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'Work Orders'); await display(p, 'Board View'); await search(p, n);
  const anyEsther = wos.find((w: any) => w.techAssignedId === ES.staff_id) ?? wos[0];
  await toColumn(p, anyEsther.techAssignedId ?? 'unassigned');
  const o = await openReassign(p, anyEsther.id); await o.item.click(); await p.waitForTimeout(1200);
  R.C96974.ninaCount = await p.locator(`[data-test-id="text_lead_technician_open_count_${NN.staff_id}"]`).innerText().catch(() => null);
  await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click();
  await tab(p, 'All'); await search(p, n); await toColumn(p, anyEsther.techAssignedId ?? 'unassigned');
  const o2 = await openReassign(p, anyEsther.id); await o2.item.click(); await p.waitForTimeout(1200);
  R.C96974.ninaCountAllTab = await p.locator(`[data-test-id="text_lead_technician_open_count_${NN.staff_id}"]`).innerText().catch(() => null);
  await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click();
  R.C96974.candidateOpen = (await candidates(a)).find((x) => x.name === 'Nina Newtech')?.open;
});

await run('C96970', async () => {
  const n = 'ZZAUTOTEST F1 Inactive Drop';
  // Tech-C "no longer able to take work here": Nick Noclock leads WO-3 while his Time Clock is on, then it is switched off
  await person(a, 'Nick', 'Noclock', { role: roles.find((r) => (r.label ?? r.name) === 'Technician')?.id, email: `zz.wob.nick.noclock${D}`, clockable: true });
  const nk = await sid('nick.noclock');
  const wos = await seedCase(a, n, 'ZZF4ID', [{ lead: ES.staff_id }, { lead: RE.staff_id }, { lead: nk.staff_id }]);
  await person(a, 'Nick', 'Noclock', { role: roles.find((r) => (r.label ?? r.name) === 'Technician')?.id, email: `zz.wob.nick.noclock${D}`, clockable: false });
  const d = await a.post('/api/iam/change-status', { id: ES.id });
  R.C96970 = { estherDeactivated: d.status, nickClockable: (await sid('nick.noclock'))?.clockable, leads: await leadOf(n) };
  try {
    const w2 = wos.find((w: any) => w.techAssignedId === RE.staff_id)!;
    const pref0 = (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
    const pins0 = pref0.pinnedTechnicianIds ?? [];
    await a.put('/api/users/me/preferences/work-orders-list', { value: { ...pref0, pinnedTechnicianIds: [RE.staff_id, ES.staff_id, nk.staff_id] } });
    R.C96970.pinnedForTheCheck = 'Ralph Edwards, Esther Howard, Nick Noclock (so the three columns stand together)';
    for (const disp of ['Board View', 'Tech View']) {
      await bv(p, n, disp);
      const R2: any = {};
      if (disp === 'Board View') {
        const cs = await (await import('./wob.mts')).allBoardCols(p);
        R2.esther = cs.find((c) => c.id === ES.staff_id); R2.nick = cs.find((c) => c.id === nk.staff_id) ?? 'no column';
        R2.estherHeader = await p.evaluate(`(document.querySelector('[data-test-id="board_column_header_${ES.staff_id}"]') || {}).innerText?.replace(/\\s+/g, ' ') || null`);
        for (const target of [ES.staff_id, nk.staff_id]) {
          await toColumn(p, target); const there = await p.locator(`[data-test-id="board_column_${target}"]`).count();
          await toColumn(p, RE.staff_id);
          if (there && await p.locator(`[data-test-id="board_column_${target}"]`).count()) await drag(p, `[data-test-id="board_card_${w2.id}"]`, `[data-test-id="board_column_${target}"]`, 120);
          else R2['dragTo_' + target.slice(0, 6)] = 'both columns not on screen together';
          await shiftPrompt(p); R2['leadAfter_' + target.slice(0, 6)] = await leadOf(n); R2['msg_' + target.slice(0, 6)] = await toasts(p);
        }
        await shot(p, 'C96970-board');
      } else {
        const g = await groups(p); R2.groups = g.filter((x) => [ES.staff_id, RE.staff_id, nk.staff_id].includes(x.id)).map((x) => `${x.name}(${x.count})`);
        const eh = p.locator(`[data-test-id="tech_view_group_${ES.staff_id}"]`);
        if (await eh.count() && await p.locator(`[data-test-id="tech_view_row_${w2.id}"]`).count()) { await drag(p, `[data-test-id="tech_view_row_${w2.id}"]`, `[data-test-id="tech_view_group_${ES.staff_id}"]`, 10); await shiftPrompt(p); R2.leadAfterTech = await leadOf(n); }
        R2.header = await p.evaluate(`(document.querySelector('[data-test-id="tech_view_group_${ES.staff_id}"]') || {}).innerText?.replace(/\\s+/g, ' ') || null`);
      }
      R.C96970[disp] = R2;
    }
  } finally {
    const pref1 = (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
    await a.put('/api/users/me/preferences/work-orders-list', { value: { ...pref1, pinnedTechnicianIds: ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'] } });
    R.C96970.restore = (await a.post('/api/iam/change-status', { id: ES.id })).status; R.C96970.estherActive = (await sid('esther.howard'))?.is_active;
  }
});

fs.writeFileSync(path.join(EV, 's4-batchA.json'), JSON.stringify(R, null, 1));
await done(browser);
