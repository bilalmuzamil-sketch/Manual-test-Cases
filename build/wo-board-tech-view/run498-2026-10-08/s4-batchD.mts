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
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000)); // 15 Oct 2026: room for the set-up read-back
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
  // 15 Oct 2026 (staging second pass): the set-up was incomplete — "invoiced" cannot be reached by change-status (that work order
  // stayed Approved), the line-only work order was never made (the 8 already existed, so the seeding block was skipped), and
  // there was no work order at a second location. Repaired here, every time, and read back:
  //  (a) Invoiced = lines completed (story + complete), work order In Progress > Review > Complete, then POST /api/invoices/create
  //      (the analytics-batch.mts recipe); made on the spare Approved one, or a new one if there is no spare;
  //  (b) one Approved work order led by Esther Howard with Nina Newtech as the technician on its line;
  //  (c) Nina enrolled at Staging Lethbridge - 4310 (Service) and one Approved work order there led by her (data made through the
  //      server-side location, then back to Heavy Duty);
  //  (d) Nina leads nothing else at Heavy Duty (any other work order she leads loses its lead).
  const fix: string[] = []; const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
  const canned0 = (await a.get('/api/work-orders/canned-lines')).body?.data; const cls = (Array.isArray(canned0) ? canned0 : canned0?.collection ?? []);
  const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
  const ninaWos = async () => (await workOrders(a, n)).filter((w: any) => w.techAssignedId === NN.staff_id);
  const byStatus = async () => { const m: Record<string, any[]> = {}; for (const w of await ninaWos()) (m[w.status] ??= []).push(w); return m; };
  let bs = await byStatus();
  if (!bs.invoiced?.length) {
    let wo = (bs.approved ?? []).length > 1 ? bs.approved[bs.approved.length - 1].id : null;
    if (!wo) { const c = await customer(a, n, 'ZZF4OC'); wo = await workOrder(a, c, 'approved', NN.staff_id); fix.push('new work order for Invoiced'); }
    if (!(await linesRaw(wo)).length) fix.push('line ' + say(await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: cls[1 % cls.length].id, status: 'authorized' })));
    fix.push('mileage ' + say(await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' })));
    for (const l of await linesRaw(wo)) {
      for (const q of (l.part_requests ?? l.partRequests ?? []) as any[]) fix.push('remove part request ' + say(await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {})));
      fix.push('story ' + say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: wo })));
      fix.push('line complete ' + say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: wo })));
    }
    for (const st of ['in_progress', 'ready_for_review', 'complete']) fix.push(`wo ${st} ` + say(await a.post('/api/work-orders/change-status', { id: wo, work_order: wo, status: st })));
    fix.push('invoice ' + say(await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) })));
    fix.push('status now ' + (await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order?.status);
    bs = await byStatus();
  }
  // 15 Oct 2026 (wave 12, fourth pass): the line-only work order was one left from an earlier pass and its line's technician was never
  // read back. Now a NEW one every run (its own customer, so it is not mixed with the count set): Approved, led by Esther Howard, one
  // ready-made line given to Nina Newtech; the line's technician is then read back two ways (the line itself and the work order's
  // line-technicians list) before the count is read.
  const lineTechs = async (wo: string) => (await linesRaw(wo)).map((l: any) => (l.technicians ?? l.techs ?? []).map((x: any) => `${x.first_name ?? x.firstName ?? ''} ${x.last_name ?? x.lastName ?? ''}`.trim() || x.staff_id || x.id).join('+') || JSON.stringify(Object.keys(l)).slice(0, 80));
  const lnName = `ZZAUTOTEST F1 Open Count Line Only ${Date.now() % 100000}`;
  const lc = await customer(a, lnName, 'ZZF4LO'); const lineOnlyId = await workOrder(a, lc, 'approved', ES.staff_id);
  const lr0 = await a.post(`/api/work-orders/${lineOnlyId}/lines/create-from-canned-line`, { canned_line_id: cls[0].id, status: 'authorized' });
  const lid0 = lr0.body?.data?.line_id ?? lr0.body?.data?.id ?? lr0.body?.line_id;
  fix.push('line-only (new): line ' + say(lr0) + ' technicians ' + (lid0 ? say(await a.put(`/api/work-orders/lines/${lid0}/technicians`, { staffIds: [NN.staff_id] })) : 'no line id'));
  const lineOnlyWo = (await workOrders(a, lnName)).find((w: any) => w.id === lineOnlyId);
  const lineOnlyReadBack = { lines: await lineTechs(lineOnlyId), lineTechnicians: (((await a.get(`/api/work-orders/${lineOnlyId}/line-technicians`)).body?.data?.lineTechnicians ?? []) as any[]).map((x: any) => `${(x.technicians ?? []).map((t2: any) => `${t2.firstName ?? ''} ${t2.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`), lead: lineOnlyWo ? `${lineOnlyWo.techAssignedFirstName ?? '-'} ${lineOnlyWo.techAssignedLastName ?? ''}`.trim() : null, number: lineOnlyWo?.number };
  const wpl = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/workplaces')).body?.data);
  const LETH = (await import('./staff.mts')).LETH, HEAVY = (await import('./staff.mts')).HEAVY;
  const leth = wpl.find((w: any) => w.id === LETH), heavy = wpl.find((w: any) => w.id === HEAVY);
  const deps = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = deps.find((d: any) => (d.name ?? d.label) === 'Service');
  fix.push('enrol Nina at Lethbridge ' + say(await a.post('/api/staff/enrollment/create', { staffId: NN.staff_id, workplaceId: LETH, departmentId: svc?.id })));
  let loc2: any = null;
  try {
    await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: leth?.timezone ?? 'America/Edmonton' });
    let w2 = (await workOrders(a, n + ' L2'))[0];
    if (!w2) { const c2 = await customer(a, n + ' L2', 'ZZF4OL'); await workOrder(a, c2, 'approved', NN.staff_id); w2 = (await workOrders(a, n + ' L2'))[0]; }
    loc2 = { at: leth?.name, wo: w2 ? `${w2.number} ${w2.status} lead=${w2.techAssignedFirstName ?? '-'} ${w2.techAssignedLastName ?? ''}` : 'not made', ninaOfferedThere: (await candidates(a)).some((x) => x.id === NN.staff_id) };
  } catch (e: any) { loc2 = { error: String(e?.message || e).slice(0, 160) }; }
  finally { await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: heavy?.timezone ?? (process.env.WOB_LOC_TZ || 'America/Edmonton') }); }
  for (let pg = 1; pg < 20; pg++) { const r = await a.get(`/api/work-orders?pagination[page]=${pg}&pagination[rowsPerPage]=200&filters[0][field]=tech_assigned_id&filters[0][value]=${NN.staff_id}`); const ws2 = r.body?.data?.work_orders ?? [];
    for (const w of ws2) if (w.techAssignedId === NN.staff_id && !String(w.companyName ?? '').startsWith(n)) fix.push(`${w.number} (${w.companyName}) loses Nina as lead ` + say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: null })));
    if (ws2.length < 200) break; }
  wos = await ninaWos();
  R.C96974 = { made, fix, ninaLeads: wos.map((w: any) => `${w.number} ${w.status}`), ninaLeadsByStatus: Object.fromEntries(Object.entries(await byStatus()).map(([k, v]) => [k, v.length])),
    lineOnly: lineOnlyWo ? { wo: `${lineOnlyWo.number} ${lineOnlyWo.status} lead=${lineOnlyWo.techAssignedFirstName} ${lineOnlyWo.techAssignedLastName}`, lineTechnicians: await lineTechs(lineOnlyWo.id), readBack: lineOnlyReadBack } : 'not made', secondLocation: loc2 };
  const esWo = (await workOrders(a, n)).find((w: any) => w.techAssignedId === ES.staff_id);
  for (const tb of ['Work Orders', 'All']) {
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, tb); await display(p, 'Board View'); await search(p, n); await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"]').scrollLeft = 0`);
    const o = await openReassign(p, esWo.id); await o.item.click(); await p.waitForTimeout(1200);
    R.C96974['count_' + tb] = await p.locator(`[data-test-id="text_lead_technician_open_count_${NN.staff_id}"]`).innerText().catch(() => null);
    // 15 Oct 2026 (wave 17): the picture showed the top of the list (the A names), not Nina Newtech's row: bring her row into the
    // middle of the dialog's list before the picture, so "4 open" is on it.
    await p.locator(`[data-test-id="text_lead_technician_open_count_${NN.staff_id}"]`).evaluate((e) => e.scrollIntoView({ block: 'center' })).catch(() => {}); await p.waitForTimeout(700);
    await shot(p, `C96974-dialog-${tb.replace(' ', '')}`); // 15 Oct 2026: the dialog with the count, for the result's picture
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
