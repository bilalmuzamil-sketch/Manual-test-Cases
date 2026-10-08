/**
 * S4 batch D (2026-10-08): C96974 open count, C96968 a reassign that cannot be saved, C368137 a reorder that cannot be
 * saved, C96971 later reassign wins, C368138 dropped next to a moved card, C368139 two drops at once, C154887 imported.
 * "Network off" is replaced by the server refusing the save (the QA branch's sleep guard takes the page away on a
 * dropped request — measured 2026-10-08). Two browsers = two pages of the same signed-in user.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, toggleGroup, openReassign, toasts, shiftPrompt } from './wob.mts';
import { staffRows, person } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { clearedSwitch: (await a.post('/api/exit-switch-user', {})).status };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
R.nina = (await person(a, 'Nina', 'Newtech', { role: ES.role_id, email: `zz.wob.nina.newtech${D}`, clockable: true })).log;
const NN = await sid('nina.newtech');
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id, DO.staff_id] } });
const bvOn = async (pg: Page, n: string, d = 'Board View') => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(600); };
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
const setLead = (id: string, s: string | null) => a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: s });
async function fresh(n: string, unit: string, k = 1) { const ws = await workOrders(a, n); if (ws.length >= k) return ws; const c = await customer(a, n, unit); for (let i = ws.length; i < k; i++) await workOrder(a, c, 'approved', ES.staff_id); return workOrders(a, n); }
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2200));
  fs.writeFileSync(path.join(EV, 's4-batchD.json'), JSON.stringify(R, null, 1));
}
const dragOn = async (pg: Page, woId: string, target: string, where: 'board' | 'tech' = 'board', dy?: number) => {
  if (where === 'board') return drag(pg, `[data-test-id="board_card_${woId}"]`, target.startsWith('[') ? target : `[data-test-id="board_column_${target}"]`, dy ?? 120);
  const empty = `[data-test-id="tech_view_group_empty_${target}"]`;
  return drag(pg, `[data-test-id="tech_view_row_${woId}"]`, target.startsWith('[') ? target : ((await pg.locator(empty).count()) ? empty : `[data-test-id="tech_view_group_${target}"]`), dy ?? 10);
};
const refuse = (calls: string[]) => (r: any) => { if (r.request().method() !== 'GET') { calls.push(r.request().method() + ' ' + r.request().url().replace(/^https:\/\/[^/]+/, '').replace(/\?.*/, '')); return r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"zz test: save refused"}]}' }); } return r.continue(); };

await run('C96974', async () => {
  const n = 'ZZAUTOTEST F1 Open Count';
  let wos = (await workOrders(a, n)).filter((w: any) => w.techAssignedId === NN.staff_id);
  const made: any = {};
  if (wos.length < 8) {
    const c = await customer(a, n, 'ZZF4OC');
    for (const s of ['estimate', 'approved', 'in_progress', 'ready_for_review', 'complete', 'invoiced', 'paid', 'declined']) {
      try { const id = await workOrder(a, c, s === 'estimate' ? 'estimate' : 'approved', NN.staff_id); if (!['estimate', 'approved'].includes(s)) { const r = await a.post('/api/work-orders/change-status', { id, status: s }); made[s] = `${r.status} ${r.status >= 300 ? JSON.stringify(r.body).slice(0, 100) : ''}`; } else made[s] = 'ok'; } catch (e: any) { made[s] = String(e.message).slice(0, 100); }
    }
    const lineOnly = await workOrder(a, c, 'approved', ES.staff_id);
    const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0];
    const lr = await a.post(`/api/work-orders/${lineOnly}/lines/create-from-canned-line`, { canned_line_id: cl.id, status: 'authorized' });
    const lid = lr.body?.data?.line_id ?? lr.body?.data?.id ?? lr.body?.line_id;
    made.lineOnly = lid ? (await a.put(`/api/work-orders/lines/${lid}/technicians`, { staffIds: [NN.staff_id] })).status : `line ${lr.status} ${JSON.stringify(lr.body).slice(0, 120)}`;
    wos = (await workOrders(a, n)).filter((w: any) => w.techAssignedId === NN.staff_id);
  }
  R.C96974 = { made, ninaLeads: wos.map((w: any) => `${w.number} ${w.status}`) };
  const esWo = (await workOrders(a, n)).find((w: any) => w.techAssignedId === ES.staff_id);
  for (const tb of ['Work Orders', 'All']) {
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, tb); await display(p, 'Board View'); await search(p, n); await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`);
    const o = await openReassign(p, esWo.id); await o.item.click(); await p.waitForTimeout(1200);
    R.C96974['count_' + tb] = await p.locator(`[data-test-id="text_lead_technician_open_count_${NN.staff_id}"]`).innerText().catch(() => null);
    await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click(); await p.waitForTimeout(800);
  }
  await shot(p, 'C96974-board');
});

await run('C96968', async () => {
  const n = 'ZZAUTOTEST F1 Reassign Offline';
  const [w] = await fresh(n, 'ZZF4RO'); await setLead(w.id, ES.staff_id);
  R.C96968 = {};
  for (const where of ['board', 'tech'] as const) {
    await bvOn(p, n, where === 'board' ? 'Board View' : 'Tech View');
    const calls: string[] = []; const h = refuse(calls); await p.route('**/api/work-orders/**', h);
    await dragOn(p, w.id, RE.staff_id, where); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
    const msg1 = await toasts(p);
    const home = where === 'board' ? (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards.includes(w.number) : (await groups(p)).find((g) => g.id === ES.staff_id)?.rows.includes(w.number);
    await shot(p, `C96968-${where}-alert`);
    await p.waitForTimeout(10_000); const msg10 = await toasts(p);
    await p.locator('.q-notification button').filter({ hasText: /close/i }).first().click().catch(() => {}); await p.waitForTimeout(1200);
    const afterX = await toasts(p);
    await p.unroute('**/api/work-orders/**', h);
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
    R.C96968[where] = { refused: calls, message: msg1, cardBack: home, after10s: msg10, afterX, leadAfterReload: (await lead(n))[w.number] };
  }
});

await run('C368137', async () => {
  const n = 'ZZAUTOTEST F1 Reorder Offline';
  const ws = await fresh(n, 'ZZF4RF', 3); for (const w of ws) await setLead(w.id, ES.staff_id);
  R.C368137 = {};
  for (const where of ['board', 'tech'] as const) {
    await bvOn(p, n, where === 'board' ? 'Board View' : 'Tech View');
    const order = async () => where === 'board' ? (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards ?? [] : (await groups(p)).find((g) => g.id === ES.staff_id)?.rows ?? [];
    const before = await order();
    const last = ws.find((w: any) => w.number === before[before.length - 1]), first = ws.find((w: any) => w.number === before[0]);
    const calls: string[] = []; const h = refuse(calls); await p.route('**/api/work-orders/**', h);
    if (where === 'board') await drag(p, `[data-test-id="board_card_${last.id}"]`, `[data-test-id="board_card_${first.id}"]`, 4);
    else await drag(p, `[data-test-id="tech_view_row_${last.id}"]`, `[data-test-id="tech_view_row_${first.id}"]`, 4);
    await p.waitForTimeout(1500);
    const msg = await toasts(p); const after = await order(); await shot(p, `C368137-${where}`);
    await p.unroute('**/api/work-orders/**', h);
    await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, n);
    R.C368137[where] = { before, refused: calls, message: msg, after, afterReload: await order() };
  }
});

await run('C96971', async () => {
  const n = 'ZZAUTOTEST F1 Later Reassign Wins';
  const [w] = await fresh(n, 'ZZF4LW'); await setLead(w.id, ES.staff_id);
  const p2 = await p.context().newPage();
  await bvOn(p, n); await bvOn(p2, n);
  const o1 = await openReassign(p, w.id); await o1.item.click(); await p.waitForTimeout(1000); await p.locator(`[data-test-id="option_lead_technician_${RE.staff_id}"]`).click(); await p.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p, 'Keep shifts');
  R.C96971 = { afterBrowser1: (await lead(n))[w.number] };
  const o2 = await openReassign(p2, w.id); await o2.item.click(); await p2.waitForTimeout(1000); await p2.locator(`[data-test-id="option_lead_technician_${DO.staff_id}"]`).click(); await p2.locator('[data-test-id="button_confirm_reassign_lead_technician"]').click(); await shiftPrompt(p2, 'Keep shifts');
  R.C96971.browser2Message = await toasts(p2); R.C96971.afterBrowser2 = (await lead(n))[w.number];
  await p.reload({ waitUntil: 'domcontentloaded' }); await p2.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await p2.waitForTimeout(1500);
  await search(p, n); await search(p2, n);
  const colOf = async (pg: Page) => (await boardCols(pg)).find((c) => c.cards.includes(w.number))?.name ?? null;
  R.C96971.reload = { browser1: await colOf(p), browser2: await colOf(p2) }; await p2.close();
});

await run('C368138', async () => {
  const n = 'ZZAUTOTEST F1 Moved Neighbour';
  const ws = await fresh(n, 'ZZF4MN', 3); for (const w of ws) await setLead(w.id, ES.staff_id);
  const p2 = await p.context().newPage();
  await bvOn(p, n); await bvOn(p2, n);
  const order = (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards ?? [];
  const W2 = ws.find((w: any) => w.number === order[1]), W3 = ws.find((w: any) => w.number === order[2]);
  await drag(p2, `[data-test-id="board_card_${W2.id}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p2, 'Keep shifts');
  R.C368138 = { moved: W2.number, browser2Lead: (await lead(n))[W2.number] };
  await drag(p, `[data-test-id="board_card_${W3.id}"]`, `[data-test-id="board_card_${W2.id}"]`, 4); await p.waitForTimeout(1500);
  R.C368138.browser1 = { dropped: W3.number, message: await toasts(p), esther: (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards };
  await shot(p, 'C368138-browser1');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, n);
  R.C368138.afterReload = { esther: (await boardCols(p)).find((c) => c.id === ES.staff_id)?.cards, ralph: (await boardCols(p)).find((c) => c.id === RE.staff_id)?.cards };
  await p2.close();
});

await run('C368139', async () => {
  const n = 'ZZAUTOTEST F1 Board Busy';
  const ws = await fresh(n, 'ZZF4BB', 2);
  const p2 = await p.context().newPage();
  R.C368139 = { tries: [] };
  for (let i = 0; i < 5; i++) {
    for (const w of ws) await setLead(w.id, ES.staff_id);
    await bvOn(p, n); await bvOn(p2, n);
    const prep = async (pg: Page, w: any) => { const a1 = (await pg.locator(`[data-test-id="board_card_${w.id}"]`).boundingBox())!, b1 = (await pg.locator(`[data-test-id="board_column_${RE.staff_id}"]`).boundingBox())!; await pg.mouse.move(a1.x + a1.width * 0.45, a1.y + a1.height / 2); await pg.mouse.down(); await pg.mouse.move(a1.x + a1.width * 0.45, a1.y + a1.height / 2 + 8, { steps: 4 }); await pg.mouse.move(b1.x + b1.width / 2, b1.y + 120, { steps: 15 }); };
    await prep(p, ws[0]); await prep(p2, ws[1]);
    await Promise.all([p.mouse.up(), p2.mouse.up()]); await Promise.all([shiftPrompt(p, 'Keep shifts'), shiftPrompt(p2, 'Keep shifts')]); await p.waitForTimeout(1500);
    R.C368139.tries.push({ b1: await toasts(p), b2: await toasts(p2), leads: await lead(n) });
  }
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, n);
  const cs = await boardCols(p); const all = cs.flatMap((c) => c.cards.filter((x) => ws.some((w: any) => w.number === x)).map((x) => `${x}@${c.name}`));
  R.C368139.afterReload = all; await p2.close();
});

await run('C154887', async () => {
  const imp = (await a.get('/api/work-orders-imported?pagination[rowsPerPage]=5')).body?.data;
  const list = Array.isArray(imp) ? imp : imp?.work_orders ?? imp?.collection ?? imp?.items ?? [];
  R.C154887 = { importedCount: list.length, first: list[0] ? (list[0].display_number ?? list[0].number ?? list[0].invoice_number ?? JSON.stringify(list[0]).slice(0, 120)) : null };
  for (const d of ['List', 'Board View', 'Tech View']) {
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, d);
    await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(900);
    R.C154887[d] = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=checkbox], .q-menu .q-item')].map(e => (e.getAttribute('aria-label') || e.innerText || '').trim() + (e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') ? ' (disabled)' : '')).filter(x => /import/i.test(x))`);
    await p.keyboard.press('Escape'); await shot(p, `C154887-${d.replace(' ', '')}-status`);
  }
});

await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: ['3ff0914b-49a3-4d80-b07d-92a10e1a89f8'] } });
fs.writeFileSync(path.join(EV, 's4-batchD.json'), JSON.stringify(R, null, 1));
await done(browser);
