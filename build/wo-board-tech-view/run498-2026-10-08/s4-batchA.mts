/**
 * S4 Reassign / unassign the lead, batch A (2026-10-08): C96956 dialog list + reassign + unassign + cancel,
 * C96957 messages, C96959 header counts, C96969 same lead, C96973 outside the filter, C96974 open count,
 * C368163 dialog search, C96967 view-only cannot move or reassign, C96970 no drop on inactive / not-eligible.
 * Tech-A = Esther Howard, Tech-B = Ralph Edwards, Tech-C = Jenny Wilson (ZZ test people) unless a case needs others.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, pickLead, read, woPageLead, findRow } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

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
const me = techs.find((x) => x.name === 'Admin ShopView')!;
const bv = async (pg: Page, n: string, d = 'Board View') => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); };
const leadOf = async (n: string) => (await workOrders(a, n)).map((w: any) => `${w.number} lead=${w.techAssignedFirstName ? w.techAssignedFirstName + ' ' + w.techAssignedLastName : 'none'}`);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000)); // 15 Oct 2026: 2000 cut readings short
  fs.writeFileSync(path.join(EV, 's4-batchA.json'), JSON.stringify(R, null, 1));
}
const dialogNames = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="option_lead_technician_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;

await run('C96956', async () => {
  const n = 'ZZAUTOTEST F1 Reassign List';
  const [w] = await seedCase(a, n, 'ZZF4RL', [{ lead: ES.staff_id }]);
  await bv(p, n); await toColumn(p, ES.staff_id);
  const o = await openReassign(p, w.id); R.C96956 = { menuDisabled: o.disabled }; await o.item.click(); await p.waitForTimeout(1500);
  const names = await dialogNames(p);
  const has = (x: string) => names.some((y) => y.includes(x));
  R.C96956.list = { count: names.length, unassigned: has('Unassigned'), esther: has('Esther Howard'), ralph: has('Ralph Edwards'), jenny: has('Jenny Wilson'), oliveOffice: has('Olive Office'), timClockuser: has('Tim Clockuser'), inaInactive: has('Ina Active'), nickNoclock: has('Nick Noclock'), ellaElsewhere: has('Ella Elsewhere') };
  await shot(p, 'C96956-dialog');
  R.C96956.toRalph = { prompt: await pickLead(p, RE.staff_id), toast: await toasts(p), lead: await leadOf(n) };
  await toColumn(p, RE.staff_id); R.C96956.inRalphColumn = (await boardCols(p)).find((c) => c.id === RE.staff_id)?.cards.includes(w.number);
  await shot(p, 'C96956-board-in-ralph'); R.C96956.woPageLeadAfterRalph = await woPageLead(p, APP, w.id); // 15 Oct 2026
  const o2 = await openReassign(p, w.id); await o2.item.click(); await p.waitForTimeout(1200);
  R.C96956.toUnassigned = { prompt: await pickLead(p, 'unassigned'), toast: await toasts(p), lead: await leadOf(n) };
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  R.C96956.inUnassigned = (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number);
  const o3 = await openReassign(p, w.id); await o3.item.click(); await p.waitForTimeout(1200); await pickLead(p, JW.staff_id, 'cancel'); await p.waitForTimeout(1500);
  R.C96956.afterCancel = { lead: await leadOf(n), stillUnassigned: (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number) };
  // 15 Oct 2026 (staging second pass): the work order page's Lead Technician read empty (that test-id is not on staging) and
  // the Tech View repeat only opened the menu. Now the page is read by woPageLead (wob.mts), and steps 3-13 are repeated in
  // Tech View with the row's More actions: back to Esther Howard first (step 3 starts in [Tech-A]'s group), then Ralph Edwards,
  // then Unassigned, then Jenny Wilson + Cancel; the row is found on screen (findRow) before each action.
  R.C96956.woPageLead = await woPageLead(p, APP, w.id);
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.staff_id });
  await bv(p, n, 'Tech View');
  const T: any = { startGroup: await findRow(p, w.id) };
  // 15 Oct 2026 (wave 12, fourth pass): after the move to Ralph Edwards the row was not found again (his group can open collapsed, and
  // findRow only opens the group it is told). rowFind tries as it is, then each group the row can be in (Ralph, Esther, Jenny,
  // Unassigned), opening it; failing that it reloads Tech View with the search and tries again. Used before EVERY Tech View step.
  const rowFind = async () => { for (let pass = 0; pass < 2; pass++) { for (const g of [undefined, RE.staff_id, ES.staff_id, JW.staff_id, 'unassigned']) { await findRow(p, w.id, g).catch(() => null); if (await p.locator(`[data-test-id="tech_view_row_${w.id}"]`).count()) return `${pass ? 'after reload, ' : ''}${g ?? 'as it was'}`; } await bv(p, n, 'Tech View'); } return 'NOT FOUND'; };
  T.finds = [];
  const rowMenu = async (grp?: string) => { T.finds.push(await rowFind()); await findRow(p, w.id, grp).catch(() => null); const o = await openReassign(p, w.id, 'tech'); if (T.menuDisabled === undefined) { T.menuDisabled = o.disabled; T.menu = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' '))`); } await o.item.click(); await p.waitForTimeout(1500); };
  await rowMenu(); T.dialogCount = (await dialogNames(p)).length; await shot(p, 'C96956-tech-dialog');
  T.toRalph = { prompt: await pickLead(p, RE.staff_id), toast: await toasts(p), lead: await leadOf(n) };
  T.findAfterRalph = await rowFind(); T.groupAfterRalph = await findRow(p, w.id); await shot(p, 'C96956-tech-in-ralph'); T.woPageLeadAfterRalph = await woPageLead(p, APP, w.id);
  await rowMenu(); T.toUnassigned = { prompt: await pickLead(p, 'unassigned'), toast: await toasts(p), lead: await leadOf(n) };
  T.findAfterUnassigned = await rowFind(); T.groupAfterUnassigned = await findRow(p, w.id, 'unassigned'); await shot(p, 'C96956-tech-in-unassigned');
  await rowMenu('unassigned'); await pickLead(p, JW.staff_id, 'cancel'); await p.waitForTimeout(1500);
  T.afterCancel = { lead: await leadOf(n), find: await rowFind(), group: await findRow(p, w.id, 'unassigned') }; await shot(p, 'C96956-tech-after-cancel');
  T.woPageLead = await woPageLead(p, APP, w.id);
  R.C96956.techView = T; R.C96956.techRowMenu = T.menu;
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
  const pinned0: string[] = ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click(); await p.waitForTimeout(1200); }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  const w1 = wos.find((w: any) => w.techAssignedId === ES.staff_id)!;
  await drag(p, `[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p);
  const hc = async () => { const cs = await boardCols(p); const f = (id: string) => cs.find((c) => c.id === id)?.count; return { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; };
  R.C96959.afterDrag = await hc(); await shot(p, 'C96959-after-drag');
  const o = await openReassign(p, w1.id); await o.item.click(); await p.waitForTimeout(1200); await pickLead(p, 'unassigned');
  R.C96959.afterDialog = await hc(); await shot(p, 'C96959-after-dialog');
  await display(p, 'Tech View'); const g = await groups(p); const f = (id: string) => g.find((x) => x.id === id)?.count;
  R.C96959.tech = { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; await shot(p, 'C96959-tech'); await display(p, 'Board View');
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1000); }
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
  const n = 'ZZAUTOTEST F1 Outside Filter';
  const [w] = await seedCase(a, n, 'ZZF4OF', [{ lead: me.id }]);
  await a.post('/api/work-orders/change-service-advisor', { work_order_id: w.id, service_advisor_id: RE.staff_id });
  await bv(p, ''); await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(2500); await search(p, n);
  R.C96973 = { columns: (await boardCols(p)).map((c) => `${c.name}(${c.count})`) };
  await toColumn(p, me.id);
  const o = await openReassign(p, w.id); await o.item.click(); await p.waitForTimeout(1200);
  const names = await dialogNames(p); R.C96973.dialogOffersRalph = names.some((x) => x.includes('Ralph Edwards')); R.C96973.dialogOffersJenny = names.some((x) => x.includes('Jenny Wilson'));
  await pickLead(p, RE.staff_id); await p.waitForTimeout(2000);
  R.C96973.after = { columns: (await boardCols(p)).map((c) => `${c.name}(${c.count}) [${c.cards.join(' ')}]`), lead: await leadOf(n), message: await toasts(p) };
  await shot(p, 'C96973-after');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').click(); await p.waitForTimeout(1500);
});

await run('C368163', async () => {
  const n = 'ZZAUTOTEST F1 Dialog Search';
  const [w] = await seedCase(a, n, 'ZZF4DS', [{ lead: ES.staff_id }]);
  const once = async (pg: Page, where: 'board' | 'tech') => {
    const o = await openReassign(pg, w.id, where); await o.item.click(); await pg.waitForTimeout(1200);
    const dlg = pg.locator('.q-dialog').last(); const box = pg.locator('[data-test-id="input_reassign_lead_search"]');
    const r: any = { top: (await dlg.innerText()).split('\n').slice(0, 3).join(' | '), current: (await pg.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).innerText()).replace(/\s+/g, ' '), full: (await dialogNames(pg)).length, placeholder: await box.getAttribute('placeholder') };
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
