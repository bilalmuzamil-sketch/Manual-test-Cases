/**
 * S4 batch G (2026-10-09): re-run of C96963 / C96972 / C96964 with real Invoiced and Paid work orders.
 * Batch E's set-up never reached Complete (so no invoice was made) and its later drags started from cards below the
 * bottom of the window (fixed in wob.mts drag). Here every set-up call is logged with its answer, every drag is
 * photographed before and after, and a Declined/Complete card is the positive control that a drag works at all.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups } from './wob.mts';
import { viewAs } from './viewas.mts';
import { staffRows, HEAVY } from './staff.mts';
import { mkShift, shiftsOn } from './shifts.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: { id: RUN.id.slice(0, 8), perms: RUN.perms, who: RUN.who, log: RUN.log } };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards'), DO = await sid('dana.ortiz');
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const nm: Record<string, string> = { [ES.staff_id]: 'Esther Howard', [RE.staff_id]: 'Ralph Edwards', [DO.staff_id]: 'Dana Ortiz' };
const prefGet = async () => (await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {};
await a.put('/api/users/me/preferences/work-orders-list', { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id, DO.staff_id] } });
const bv = async (n: string, d = 'Board View', pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (h) h.scrollLeft = 0; })()`); await pg.waitForTimeout(600); };
const canned: any[] = (() => [])(); { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const lineTechs = async (wo: string, label: Record<string, string>) => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => [label[x.lineId] ?? x.lineId.slice(0, 6), `${(x.technicians ?? []).map((tt: any) => `${tt.firstName ?? ''} ${tt.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`]));
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
const taskOf = async (wo: string, line: string, staff: string) => ((await linesRaw(wo)).find((l: any) => l.line_id === line)?.tasks ?? []).find((x: any) => x.tech_assigned_id === staff)?.id;
async function asTech<T>(userId: string, f: () => Promise<T>): Promise<T> {
  let s = await a.post('/api/switch-user', { user_id: userId }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: userId }); } if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  try { return await f(); } finally { await RUN.toRunner(); }
}
async function completeLine(wo: string, line: string) {
  await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' });
  await a.post('/api/work-orders/lines/change-story', { line_id: line, tech_story: 'Done', work_order_id: wo });
  const r = await a.post('/api/work-orders/lines/change-status', { line_id: line, status: 'complete', workOrderId: wo });
  const st = (await linesRaw(wo)).find((l: any) => l.line_id === line); return `${r.status} ${st?.status ?? st?.line_status ?? '?'}`;
}
const myTask = async () => JSON.stringify((await a.get('/api/technician-tasks/my-current-task')).body?.data ?? null).slice(0, 200);
const lead = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none']));
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2400));
  fs.writeFileSync(path.join(EV, 's4-batchG.json'), JSON.stringify(R, null, 1));
}


const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
/** take a work order with one line to Complete, then (optionally) invoice it and mark it paid; every answer logged */
async function ensure(sel: string, n: string, pg: Page = p) {
  for (let i = 0; i < 8; i++) { if (await pg.locator(sel).count()) return true; await pg.waitForTimeout(5000); await search(pg, n); }
  return false;
}
async function finish(wo: string, to: 'complete' | 'invoiced' | 'paid', log: any[]) {
  const ls = await linesRaw(wo); if (!ls.length) ls.push({ line_id: await mkLine(wo, 1) });
  log.push(`mileage ${say(await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' }))}`);
  for (const l of await linesRaw(wo)) {
    // a canned line brings vendor part requests, and the work order refuses Complete until they are received:
    // cancel them (playbook §Y: POST /api/work-orders/part/remove-request/{requestId})
    const reqs = (l.part_requests ?? l.partRequests ?? []) as any[];
    if (!R.lineKeys) R.lineKeys = Object.keys(l).join(',');
    for (const q of reqs) log.push(`remove part request ${say(await a.post(`/api/work-orders/part/remove-request/${q.id ?? q.part_request_id}`, {}))}`);
    if ((l.parts ?? []).length) log.push(`line still holds ${(l.parts ?? []).length} picked part(s)`);
    log.push(`story ${say(await a.post('/api/work-orders/lines/change-story', { line_id: l.line_id, tech_story: 'Done', work_order_id: wo }))}`);
    log.push(`line complete ${say(await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'complete', workOrderId: wo }))}`);
  }
  log.push(`lines now ${(await linesRaw(wo)).map((x: any) => x.status ?? x.line_status).join(',')}`);
  for (const s of ['in_progress', 'ready_for_review', 'complete']) log.push(`wo ${s} ${say(await a.post('/api/work-orders/change-status', { id: wo, work_order: wo, status: s }))}`);
  if (to === 'complete') return;
  log.push(`invoice ${say(await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }))}`);
  if (to === 'paid') log.push(`paid ${say(await a.post('/api/work-orders/change-status', { id: wo, work_order: wo, status: 'paid' }))}`);
}
const statusOf = async (n: string) => Object.fromEntries((await workOrders(a, n)).map((w: any) => [w.number, `${w.status} lead=${w.techAssignedFirstName ? w.techAssignedFirstName + ' ' + w.techAssignedLastName : 'none'}`]));

await run('C96963', async () => {
  const n = `ZZAUTOTEST F1 Invoiced Paid Locked ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4IP'); const log: any[] = [];
  const mk = async (lead: string | null, to: string) => {
    const wo = await workOrder(a, c, 'estimate', null); await mkLine(wo, 1);
    await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
    if (lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: lead });
    if (to === 'declined') log.push(`declined ${say(await a.post('/api/work-orders/change-status', { id: wo, status: 'declined' }))}`);
    else if (to !== 'approved') await finish(wo, to as any, log);
    return wo;
  };
  const W1 = await mk(ES.staff_id, 'approved'), W2 = await mk(ES.staff_id, 'invoiced'), W3 = await mk(ES.staff_id, 'paid');
  const W4 = await mk(null, 'invoiced'), W5 = await mk(ES.staff_id, 'declined'), W6 = await mk(ES.staff_id, 'complete');
  const all = await workOrders(a, n); const num = (id: string) => all.find((w: any) => w.id === id)?.number;
  R.C96963 = { log, set: await statusOf(n), ids: { W1: num(W1), W2: num(W2), W3: num(W3), W4: num(W4), W5: num(W5), W6: num(W6) } };
  const out: any = {};
  for (const view of ['Board View', 'Tech View']) {
    const tv = view === 'Tech View';
    const host = (id: string) => tv ? `[data-test-id="tech_view_row_${id}"]` : `[data-test-id="board_card_${id}"]`;
    const target = (staff: string) => tv ? `[data-test-id="tech_view_group_${staff}"]` : `[data-test-id="board_column_${staff}"]`;
    const where = async (id: string) => { const w = (await workOrders(a, n)).find((x: any) => x.id === id); return w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'Unassigned'; };
    const order = async (staff: string) => tv ? p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].map(r => r.getAttribute('data-test-id').slice(14))`) as Promise<string[]> : ((await boardCols(p)).find((x) => x.id === staff)?.cards ?? []);
    const go = async () => { await bv(n, view); if (tv) await expandSmallGroups(p); };
    const tryMove = async (label: string, id: string, staff: string, dy = 120) => {
      await go(); if (!(await ensure(host(id), n))) return { lead: await where(id), message: [], prompt: null, notOnPage: true }; await shot(p, `C96963-${tv ? 'TV' : 'BV'}-${label}-before`);
      const empty = `[data-test-id="tech_view_group_empty_${staff}"]`;
      await drag(p, host(id), tv && await p.locator(empty).count() ? empty : target(staff), tv ? 10 : dy); const prompt = await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1200);
      const m = await toasts(p); await shot(p, `C96963-${tv ? 'TV' : 'BV'}-${label}-after`);
      return { lead: await where(id), message: m, prompt: prompt ? 'asked' : null };
    };
    const o: any = {};
    o.declinedToRalph = await tryMove('W5-declined', W5, RE.staff_id);   // positive control first
    o.completeToRalph = await tryMove('W6-complete', W6, RE.staff_id);
    o.invToRalph = await tryMove('W2-inv-Ralph', W2, RE.staff_id); o.invToUnassigned = await tryMove('W2-inv-Unassigned', W2, 'unassigned');
    o.paidToRalph = await tryMove('W3-paid-Ralph', W3, RE.staff_id); o.paidToUnassigned = await tryMove('W3-paid-Unassigned', W3, 'unassigned');
    o.inv4ToEsther = await tryMove('W4-inv-Esther', W4, ES.staff_id);
    // reorder inside Esther's column/group: Invoiced above the Approved one, then Paid above the Approved one
    for (const [lab, id] of [['W2-inv-reorder', W2], ['W3-paid-reorder', W3]] as [string, string][]) {
      await go(); await ensure(host(id), n); await ensure(host(W1), n); const before = await order(ES.staff_id);
      await drag(p, host(id), host(W1), 4); await p.waitForTimeout(1200); const m = await toasts(p);
      await shot(p, `C96963-${tv ? 'TV' : 'BV'}-${lab}`); await go();
      o[lab] = { before: before.map((x: string) => num(x) ?? x), afterReload: (await order(ES.staff_id)).map((x: string) => num(x) ?? x), lead: await where(id), message: m };
    }
    // W4 reorder inside Unassigned (needs a second unassigned card of this customer: put W1 there first)
    if (!tv) { await a.post('/api/work-orders/change-lead-technician', { work_order_id: W1, tech_assigned_id: null }); await go();
      const before = await order('unassigned'); await drag(p, host(W4), host(W1), 4); await p.waitForTimeout(1200); const m = await toasts(p); await go();
      o.W4reorderUnassigned = { before: before.map((x: string) => num(x) ?? x), after: (await order('unassigned')).map((x: string) => num(x) ?? x), lead: await where(W4), message: m };
      await a.post('/api/work-orders/change-lead-technician', { work_order_id: W1, tech_assigned_id: ES.staff_id }); }
    // in Tech View, bring W5 and W6 back to Esther (the case's last step)
    if (tv) { o.declinedBack = await tryMove('W5-back', W5, ES.staff_id); o.completeBack = await tryMove('W6-back', W6, ES.staff_id); }
    else { await a.post('/api/work-orders/change-lead-technician', { work_order_id: W5, tech_assigned_id: ES.staff_id }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: W6, tech_assigned_id: ES.staff_id }); }
    out[view] = o;
  }
  R.C96963.views = out;
  const pg = await p.context().newPage(); await pg.goto(`${APP}/workorders/${W2}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  const sel = pg.locator('[data-test-id="select_lead_technician"]');
  R.C96963.woPage = { present: await sel.count(), disabled: await sel.evaluate((e) => !!(e.closest('.q-field--disabled, .q-field--readonly') || e.getAttribute('aria-disabled') === 'true' || e.querySelector('input[disabled], input[readonly]'))).catch(() => 'n/a'), text: await sel.innerText().catch(() => null) };
  if (R.C96963.woPage.present) { await sel.click({ force: true }).catch(() => {}); await pg.waitForTimeout(1200); R.C96963.woPage.menuOpened = await pg.locator('.q-menu .q-item').count(); await pg.keyboard.press('Escape'); }
  await shot(pg, 'C96963-wo-page'); await pg.close();
  R.C96963.serverRefusal = say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: W2, tech_assigned_id: RE.staff_id }));
  R.C96963.final = await statusOf(n);
});

await run('C96972', async () => {
  const n = `ZZAUTOTEST F1 Invoiced Elsewhere ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4IE'); const log: any[] = [];
  const wo = await workOrder(a, c, 'estimate', null); await mkLine(wo, 1);
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  await finish(wo, 'complete', log);
  await bv(n); await ensure(`[data-test-id="board_card_${wo}"]`, n); R.C96972 = { log, cardStatus: await p.locator(`[data-test-id="board_card_${wo}"] [data-test-id="board_card_status"]`).innerText().catch(() => null) };
  // "browser 2": invoice it now, behind this board's back
  const inv = await a.post('/api/invoices/create', { work_order_id: wo, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
  R.C96972.invoiced = say(inv); R.C96972.statusNow = (await workOrders(a, n))[0]?.status;
  R.C96972.cardStatusStill = await p.locator(`[data-test-id="board_card_${wo}"] [data-test-id="board_card_status"]`).innerText().catch(() => null);
  await drag(p, `[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${RE.staff_id}"]`, 120); await shiftPrompt(p, 'Keep shifts'); await p.waitForTimeout(1500);
  R.C96972.message = await toasts(p); await shot(p, 'C96972-alert');
  const wnum = (await workOrders(a, n))[0].number;
  R.C96972.column = (await boardCols(p)).find((x) => x.cards.includes(wnum))?.name;
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, n);
  R.C96972.afterReload = { lead: (await statusOf(n)), column: (await boardCols(p)).find((x) => x.cards.includes(wnum))?.name };
});

const tooltip = async (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;

await run('C96964', async () => {
  const n = `ZZAUTOTEST F1 Locked Lead Tooltip ${Date.now() % 100000}`;
  const c = await customer(a, n, 'ZZF4LT');
  const W1 = await workOrder(a, c, 'estimate', null), W2 = await workOrder(a, c, 'estimate', null);
  for (const w of [W1, W2]) { await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: ES.staff_id }); }
  const log: any[] = []; await finish(W1, 'invoiced', log); await finish(W2, 'paid', log); R.C96964 = { log };
  const all = await workOrders(a, n); R.C96964.set = all.map((w: any) => `${w.number} ${w.status} lead=${w.techAssignedFirstName ?? 'none'}`);
  for (const view of ['Board View', 'Tech View']) {
    await bv(n, view); if (view === 'Tech View') await expandSmallGroups(p);
    await ensure(view === 'Board View' ? `[data-test-id="board_card_${W1}"]` : `[data-test-id="tech_view_row_${W1}"]`, n);
    for (const [k, w] of [['WO-1 Invoiced', W1], ['WO-2 Paid', W2]] as [string, string][]) {
      const host = p.locator(view === 'Board View' ? `[data-test-id="board_card_${w}"]` : `[data-test-id="tech_view_row_${w}"]`);
      const o: any = {};
      o.icons = await host.evaluate((e) => [...e.querySelectorAll('i, svg, [data-test-id*="lock"]')].map((i) => `${(i.textContent || '').trim()}|${i.getAttribute('data-test-id') || ''}|${i.getAttribute('aria-label') || ''}`).filter((x) => x !== '||')).catch((er) => `not found: ${String(er).slice(0, 80)}`);
      const lock = host.locator('[data-test-id$="_lock"]').first();   // board_card_lock / tech_view_row_lock (aria-label = its tooltip)
      if (await lock.count()) { await lock.hover(); await p.waitForTimeout(1200); o.lockTooltip = await tooltip(); await shot(p, `C96964-${view.replace(' ', '')}-${k.slice(0, 4)}-lock`); }
      else o.lockTooltip = 'no lock icon in the card/row';
      await p.mouse.move(5, 5); await p.waitForTimeout(400);
      const m = await openReassign(p, w, view === 'Board View' ? 'board' : 'tech');
      o.menuItem = { disabled: m.disabled, text: await m.item.innerText().catch(() => null) };
      await m.item.hover({ force: true }).catch(() => {}); await p.waitForTimeout(1300); o.menuTooltip = await tooltip();
      await shot(p, `C96964-${view.replace(' ', '')}-${k.slice(0, 4)}-menu`);
      await p.keyboard.press('Escape'); await p.waitForTimeout(500);
      R.C96964[`${view} ${k}`] = o;
    }
  }
});

await RUN.end();
fs.writeFileSync(path.join(EV, 's4-batchG.json'), JSON.stringify(R, null, 1));
await done(browser);
