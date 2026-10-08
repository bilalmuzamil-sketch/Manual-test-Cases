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
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, pickLead, read } from './wob.mts';
import { staffRows, person, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local', ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const roles: any[] = ((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data?.collection ?? []);
R.nina = (await person(a, 'Nina', 'Newtech', { role: roles.find((r) => (r.label ?? r.name) === 'Technician')?.id, email: `zz.wob.nina.newtech${D}`, clockable: true })).log; console.log(t(), 'roles', roles.length, 'nina', JSON.stringify(R.nina));
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), JW = await sid('jenny.wilson'), NN = await sid('nina.newtech'), VO = await sid('viewonly'), NK = await sid('nick.noclock');
const techs = await candidates(a);
const me = techs.find((x) => x.name === 'Admin ShopView')!;
const bv = async (pg: Page, n: string, d = 'Board View') => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); };
const leadOf = async (n: string) => (await workOrders(a, n)).map((w: any) => `${w.number} lead=${w.techAssignedFirstName ? w.techAssignedFirstName + ' ' + w.techAssignedLastName : 'none'}`);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2000));
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
  const o2 = await openReassign(p, w.id); await o2.item.click(); await p.waitForTimeout(1200);
  R.C96956.toUnassigned = { prompt: await pickLead(p, 'unassigned'), toast: await toasts(p), lead: await leadOf(n) };
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  R.C96956.inUnassigned = (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number);
  const o3 = await openReassign(p, w.id); await o3.item.click(); await p.waitForTimeout(1200); await pickLead(p, JW.staff_id, 'cancel'); await p.waitForTimeout(1500);
  R.C96956.afterCancel = { lead: await leadOf(n), stillUnassigned: (await boardCols(p)).find((c) => c.id === 'unassigned')?.cards.includes(w.number) };
  const page = await (await p.context()).newPage(); await page.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
  R.C96956.woPageLead = await page.locator('[data-test-id="select_lead_technician"]').innerText().catch(() => null); await page.close();
  await bv(p, n, 'Tech View'); const un = (await groups(p)).find((g) => g.id === 'unassigned'); if (un?.collapsed) await p.locator('[data-test-id="button_tech_view_group_toggle_unassigned"]').click(); await p.waitForTimeout(1500);
  const row = p.locator(`[data-test-id="tech_view_row_${w.id}"]`);
  await row.hover(); await row.locator('[data-test-id="button_work_order_more_actions"]').click(); await p.waitForTimeout(900);
  R.C96956.techRowMenu = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' '))`); await p.keyboard.press('Escape');
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
  const m1 = await toasts(p); let gone1 = -1; for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); if (!(await toasts(p)).length) { gone1 = Math.round((Date.now() - t0) / 1000); break; } }
  R.C96957 = { drag1: { prompt: prompt1, message: m1, goneAfterSec: gone1, lead: await leadOf(n) } };
  const t1 = Date.now();
  await drag(p, `[data-test-id="board_card_${w.id}"]`, '[data-test-id="board_column_unassigned"]', 120);
  const prompt2 = await shiftPrompt(p);
  const m2 = await toasts(p); let gone2 = -1; for (let i = 0; i < 12; i++) { await p.waitForTimeout(1000); if (!(await toasts(p)).length) { gone2 = Math.round((Date.now() - t1) / 1000); break; } }
  R.C96957.drag2 = { prompt: prompt2, message: m2, goneAfterSec: gone2, lead: await leadOf(n) };
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1000); }
});

await run('C96959', async () => {
  const n = 'ZZAUTOTEST F1 Header Counts';
  const wos = await seedCase(a, n, 'ZZF4HC', [{ lead: ES.staff_id }, { lead: ES.staff_id }, { lead: ES.staff_id }, { lead: RE.staff_id }]);
  await bv(p, n);
  const counts = async () => { const all = await (await import('./wob.mts')).allBoardCols(p); const f = (id: string) => all.find((c) => c.id === id)?.count; return { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; };
  R.C96959 = { before: await counts() };
  const pinned0: string[] = ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).pinnedTechnicianIds ?? [];
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click(); await p.waitForTimeout(1200); }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`); await p.waitForTimeout(800);
  const w1 = wos.find((w: any) => w.techAssignedId === ES.staff_id)!;
  await drag(p, `[data-test-id="board_card_${w1.id}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p);
  const hc = async () => { const cs = await boardCols(p); const f = (id: string) => cs.find((c) => c.id === id)?.count; return { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; };
  R.C96959.afterDrag = await hc();
  const o = await openReassign(p, w1.id); await o.item.click(); await p.waitForTimeout(1200); await pickLead(p, 'unassigned');
  R.C96959.afterDialog = await hc();
  await display(p, 'Tech View'); const g = await groups(p); const f = (id: string) => g.find((x) => x.id === id)?.count;
  R.C96959.tech = { esther: f(ES.staff_id), ralph: f(RE.staff_id), unassigned: f('unassigned') }; await display(p, 'Board View');
  for (const x of [ES, RE]) if (!pinned0.includes(x.staff_id)) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click().catch(() => {}); await p.waitForTimeout(1000); }
});

await run('C96969', async () => {
  const n = 'ZZAUTOTEST F1 Same Lead Again';
  const [w] = await seedCase(a, n, 'ZZF4SL', [{ lead: ES.staff_id }]);
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? []);
  const linesRaw = async () => { const r = (await a.get(`/api/work-orders/lines/${w.id}`)).body?.data; return Array.isArray(r) ? r : r?.lines ?? r?.collection ?? []; };
  if (!(await linesRaw()).length) { for (const c of cl.slice(0, 2)) await a.post(`/api/work-orders/${w.id}/lines/create-from-canned-line`, { canned_line_id: c.id, status: 'authorized' }); }
  const hist = async () => ((await a.get(`/api/work-orders/${w.id}/history`)).body?.data?.history ?? []).map((h: any) => h.eventName);
  const linesTech = async () => { const lt = (await a.get(`/api/work-orders/${w.id}/line-technicians`)).body?.data; return { lines: (await linesRaw()).map((l: any) => (l.line_name ?? l.name ?? l.lineName ?? '').trim().slice(0, 30)), lineTechnicians: JSON.stringify(lt).slice(0, 400) }; };
  R.C96969 = { linesBefore: await linesTech(), historyBefore: await hist() };
  await bv(p, n); await toColumn(p, ES.staff_id);
  const o = await openReassign(p, w.id); await o.item.click(); await p.waitForTimeout(1200);
  R.C96969.confirmEnabledForCurrent = await p.locator(`[data-test-id="option_lead_technician_${ES.staff_id}"]`).click().then(async () => { await p.waitForTimeout(400); return p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').isEnabled(); });
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
    for (const q of ['Ral', 'ral', 'Olive', 'zzqx']) { await box.fill(q); await pg.waitForTimeout(900); r[q] = { names: (await dialogNames(pg)).slice(0, 6), empty: (await dlg.innerText()).replace(/\s+/g, ' ').match(/No [^.]*?(match|found)[^.]*/i)?.[0] ?? null }; }
    await box.fill(''); await pg.waitForTimeout(800); r.cleared = (await dialogNames(pg)).length;
    await pg.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await pg.waitForTimeout(1200);
    r.afterCancel = { message: await toasts(pg), lead: await leadOf(n) };
    const o2 = await openReassign(pg, w.id, where); await o2.item.click(); await pg.waitForTimeout(1000);
    r.searchOnReopen = await box.inputValue(); await pg.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await pg.waitForTimeout(800);
    return r;
  };
  await bv(p, n); await toColumn(p, ES.staff_id); R.C368163 = { board: await once(p, 'board') }; await shot(p, 'C368163-board');
  await display(p, 'Tech View'); await search(p, n); R.C368163.tech = await once(p, 'tech');
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
