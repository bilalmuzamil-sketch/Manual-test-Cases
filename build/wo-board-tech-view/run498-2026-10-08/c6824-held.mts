/** c6824-held.mts — 19 Oct 2026. PREPARATION for the eight held "Design- … (design's version)" cases C682429–C682436 (section 13204 >
 *  Design — how it looks, section 73780). They are HELD until Chris Ward rules on rows D01–D16 of "WO Board and Tech View Feature Squad –
 *  Questions on design differences – for Chris Ward (19 Oct 2026)"; "Do not run it while it is held". So NOTHING is posted to TestRail:
 *  this script seeds each case's data (ZZAUTOTEST, Rule 107) and walks each case's steps on STAGING as the dedicated runner admin
 *  (asRunner, so the shared Admin's saved view is not touched, L0463), recording what the build shows TODAY at every step + pictures.
 *  When Chris rules: design ⇒ the case is released and this script is the run; PRD ⇒ the case is removed. ONLY=C682429,… picks cases.
 *  Output EV/c6824-held.json; pictures EV/C6824xx-held-*.png. Records only; the runner's pins/density are put back. */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, drag, boardCols, allBoardCols, toColumn, groups, openReassign, toasts, shiftPrompt, expandSmallGroups, switchLocUI } from './wob.mts';
import { staffRows, person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: RUN.id.slice(0, 8) };
const PREF = '/api/users/me/preferences/work-orders-list';
const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const ORIGINAL = await prefGet();
const pins = async (ids: string[]) => { await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: ids } }); };
const RUNNO = String(Date.now() % 100000);
const D = '@staging.shopview.local';
const TECH_ROLE = (await roleIds(a))['Technician'];
const tech = async (first: string, last: string, tag: string) => (await person(a, `ZZAUTOTEST ${first}`, last, { role: TECH_ROLE, email: `zz.wob.${tag}${D}`, clockable: true })).row;
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
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
  log.push(`status now ${(await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order?.status}`);
}

type Spec = { co: string; lead: any | null; status?: string };
/** one customer per work order: "<prefix> <co>"; returns {co: {id, number}} and the search text */
async function mkSet(prefix: string, specs: Spec[]) {
  const q = `${prefix} ${RUNNO}`; const out: Record<string, { id: string; number: string }> = {}; const log: string[] = [];
  for (const s of specs) {
    const c = await customer(a, `${q} ${s.co}`, 'ZZF9');
    const w = await workOrder(a, c, 'estimate', null); await mkLine(w, 1);
    await a.post('/api/work-orders/change-status', { id: w, status: 'approved' });
    if (s.lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: s.lead.staff_id });
    const st = s.status ?? 'approved';
    if (st === 'in_progress') await a.post('/api/work-orders/change-status', { id: w, status: 'in_progress' });
    else if (st === 'declined') log.push(`declined ${say(await a.post('/api/work-orders/change-status', { id: w, status: 'declined' }))}`);
    else if (['complete', 'invoiced', 'paid'].includes(st)) await finish(w, st as any, log);
    out[s.co] = { id: w, number: '' };
  }
  for (const w of await workOrders(a, q)) for (const k of Object.keys(out)) if (out[k].id === w.id) out[k].number = w.number;
  return { q, w: out, log };
}
const nameOf = (set: any) => (num: string) => Object.keys(set.w).find((k) => set.w[k].number === num) ?? num;
const go = async (d: string, q: string, pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };
const col = async (id: string, set: any) => ((await boardCols(p)).find((c) => c.id === id)?.cards ?? []).map(nameOf(set));
const cnt = async (id: string) => (await boardCols(p)).find((c) => c.id === id)?.count;
const grp = async (id: string, set: any) => ((await groups(p)).find((g) => g.id === id)?.rows ?? []).map(nameOf(set));
const card = (set: any, co: string) => `[data-test-id="board_card_${set.w[co].id}"]`;
const row = (set: any, co: string) => `[data-test-id="tech_view_row_${set.w[co].id}"]`;
const leadOf = async (set: any, co: string) => { const w = (await workOrders(a, set.q)).find((x: any) => x.id === set.w[co].id); return w?.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none'; };
const below = async (sel: string) => { const b = await p.locator(sel).boundingBox(); return b ? Math.round(b.height - 4) : 40; };
const shotC = (n: string) => p.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const menuOf = async (sel: string) => { const host = p.locator(sel).first(); await host.scrollIntoViewIfNeeded().catch(() => {}); await host.hover().catch(() => {}); await p.waitForTimeout(400);
  await host.locator('[data-test-id="button_work_order_more_actions"]').click({ timeout: 8000 }).catch(() => {}); await p.waitForTimeout(900);
  return p.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ text: e.innerText.replace(/\\s+/g, ' ').trim(), disabled: e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') || e.classList.contains('q-item--disabled') }))`) as Promise<any[]>; };
const leadItem = () => p.locator('.q-menu .q-item').filter({ hasText: /lead|tech/i }).first();
const dialogRead = () => p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!d) return null; const inp = d.querySelector('input');
  const title = (d.querySelector('.q-card__section, h1, h2, h3, .text-h6, [class*=title]') || {}).innerText; return { title: (title || '').replace(/\\s+/g, ' ').trim().slice(0, 80), placeholder: inp ? (inp.getAttribute('placeholder') || inp.getAttribute('aria-label')) : null, text: d.innerText.replace(/\\s+/g, ' ').slice(0, 600) }; })()`) as Promise<any>;
const cancelDialog = async () => { await p.locator('[data-test-id="button_cancel_reassign_lead_technician"]').click({ timeout: 4000 }).catch(async () => { await p.keyboard.press('Escape').catch(() => {}); }); await p.waitForTimeout(800); };
const denied = () => p.evaluate(`[...document.querySelectorAll('[class*=denied], [class*=drag-note], .board-drag-overlay')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as Promise<string[]>;
async function holdOver(cardSel: string, toSel: string) { await p.locator(cardSel).first().scrollIntoViewIfNeeded().catch(() => {}); const a1 = await p.locator(cardSel).first().boundingBox(); const b1 = await p.locator(toSel).first().boundingBox(); if (!a1 || !b1) return { drag: 'missing ' + (!a1 ? 'card' : 'target') };
  const gx = a1.x + a1.width * 0.45; await p.mouse.move(gx, a1.y + a1.height / 2); await p.mouse.down(); await p.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 }); await p.mouse.move(b1.x + b1.width / 2, b1.y + 60, { steps: 20 }); await p.waitForTimeout(900);
  const notes = await denied(); return { drag: 'held', notes, release: async () => { await p.keyboard.press('Escape'); await p.mouse.up(); await p.waitForTimeout(1500); } }; }
const toastWatch = async (ms = 12000) => { const t0 = Date.now(); const seen: any[] = []; let last: string[] = []; let goneAt: number | null = null; let bar = false;
  while (Date.now() - t0 < ms) { const now = await toasts(p); bar = bar || await p.evaluate(`!!document.querySelector('.q-notification .q-linear-progress, .q-notification [class*=progress], .q-notification__progress')`) as boolean;
    if (now.join('|') !== last.join('|')) { seen.push({ ms: Date.now() - t0, texts: now }); last = now; } if (seen.length && !now.length && goneAt === null) { goneAt = Date.now() - t0; break; } await p.waitForTimeout(200); }
  return { seen, goneAfterMs: goneAt, progressBar: bar }; };
async function run(id: string, f: (o: any) => Promise<void>) { if (!want(id)) return; const o: any = {}; R[id] = o; try { await f(o); } catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shotC(`${id}-held-error`); } console.log(t(), id, JSON.stringify(o).slice(0, 3000)); }
const T = async (key: string, first: string) => tech(`${key} ${first}`, first === 'Ana' ? 'Alpha' : first, `${key.toLowerCase()}.${first.toLowerCase()}`);

await run('C682429', async (o) => {
  const A1 = await T('C682429', 'Ana'); const set = await mkSet('ZZAUTOTEST C682429 Design Labels', [{ co: 'NoLead', lead: null }, { co: 'Led', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id]); await go('Board View', set.q); // 19 Oct fix: ZZAUTOTEST columns sort last and are not drawn at the left; pinned they sit after Unassigned
  o.s1 = await menuOf(card(set, 'NoLead')); await shotC('C682429-held-s1-menu-nolead');
  await leadItem().click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(1200); o.s2 = await dialogRead(); await shotC('C682429-held-s2-dialog-nolead'); await cancelDialog();
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(500);
  o.s4 = await menuOf(card(set, 'Led')); await shotC('C682429-held-s4-menu-led');
  await leadItem().click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(1200); o.s5 = await dialogRead(); await shotC('C682429-held-s5-dialog-led'); await cancelDialog();
});

await run('C682430', async (o) => {
  const A1 = await T('C682430', 'Ana'), B1 = await T('C682430', 'Ben');
  const set = await mkSet('ZZAUTOTEST C682430 Design Messages', [{ co: 'One', lead: A1 }, { co: 'Two', lead: A1 }, { co: 'Three', lead: A1 }]); o.data = set.w;
  // Two: Ben on one of its lines (line_tech_assigned_id), read back
  const l2 = (await linesRaw(set.w.Two.id))[0]; if (l2) { const r = await a.post('/api/work-orders/lines/change', { ...l2, line_id: l2.line_id, work_order_id: set.w.Two.id, lineName: l2.line_name ?? l2.name ?? 'Line', line_tech_assigned_id: B1.staff_id }); /* 19 Oct: the short body was refused ("Labor or fixed prices must be set") */ o.crewSet = say(r); o.crewNow = JSON.stringify((await linesRaw(set.w.Two.id))[0]?.line_tech_assigned_id ?? null); }
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  const benCol = `[data-test-id="board_column_${B1.staff_id}"]`;
  await drag(p, card(set, 'One'), '[data-test-id="board_column_unassigned"]'); o.s1 = { toasts: await toasts(p), prompt: await shiftPrompt(p) }; await shotC('C682430-held-s1');
  await drag(p, card(set, 'Two'), benCol); o.s2 = { toasts: await toasts(p), prompt: await shiftPrompt(p) }; await shotC('C682430-held-s2');
  await drag(p, card(set, 'Three'), benCol); o.s3 = { toasts: await toasts(p), undo: await p.locator('.q-notification button').filter({ hasText: /undo/i }).count() }; await shotC('C682430-held-s3');
  await p.locator('.q-notification button').filter({ hasText: /undo/i }).first().click({ timeout: 4000 }).catch(() => {}); await p.waitForTimeout(1500);
  o.s4 = { toasts: await toasts(p), leadThree: await leadOf(set, 'Three') }; await shotC('C682430-held-s4');
  await p.waitForTimeout(9000); await p.mouse.move(5, 5);
  // 19 Oct: today's build has no Undo, so Three is still with Ben; to time a message, drop it on the OTHER column (Ana's) — any lead change shows one
  const target5 = /Ben/.test(await leadOf(set, 'Three')) ? `[data-test-id="board_column_${A1.staff_id}"]` : benCol; o.s5target = target5.includes(A1.staff_id) ? 'Ana (Three was still with Ben: no Undo)' : 'Ben';
  const a1 = await p.locator(card(set, 'Three')).first().boundingBox(); const b1 = await p.locator(target5).first().boundingBox();
  if (a1 && b1) { const gx = a1.x + a1.width * 0.45; await p.mouse.move(gx, a1.y + a1.height / 2); await p.mouse.down(); await p.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 }); await p.mouse.move(b1.x + b1.width / 2, b1.y + 4, { steps: 20 }); await p.waitForTimeout(300); await p.mouse.up(); await p.mouse.move(5, 5);
    await shiftPrompt(p); o.s5_6 = await toastWatch(15000); }
  await shotC('C682430-held-s6'); await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

await run('C682431', async (o) => {
  const A1 = await T('C682431', 'Ana'), B1 = await T('C682431', 'Ben');
  const set = await mkSet('ZZAUTOTEST C682431 Design Locks', [{ co: 'Invoiced', lead: A1, status: 'invoiced' }, { co: 'Declined', lead: A1, status: 'declined' }, { co: 'Approved', lead: A1 }]); o.data = set.w; o.log = set.log;
  o.importedNote = 'no imported work order can be made by the app or API here (imported work orders come from a data import); the build follows the PRD: Imported opens in List only';
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  o.cardsShown = Object.fromEntries(await Promise.all(Object.keys(set.w).map(async (k) => [k, await p.locator(card(set, k)).count()])));
  o.s1 = await menuOf(card(set, 'Invoiced')); await shotC('C682431-held-s1-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  const benCol = `[data-test-id="board_column_${B1.staff_id}"]`;
  for (const k of ['Invoiced', 'Declined']) {
    const h = await holdOver(card(set, k), benCol); await shotC(`C682431-held-${k}-holding`); o[k] = { notes: (h as any).notes, drag: h.drag }; if ((h as any).release) await (h as any).release(); o[k].leadAfter = await leadOf(set, k); }
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

await run('C682432', async (o) => {
  const six = [await T('C682432', 'Ana'), await T('C682432', 'Ben'), await T('C682432', 'Cal'), await T('C682432', 'Dee'), await T('C682432', 'Eve'), await T('C682432', 'Fay')];
  await pins([]); await go('Board View', ''); o.steps = [];
  for (const [i, x] of six.entries()) { await toColumn(p, x.staff_id); await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).click({ timeout: 6000 }).catch((e) => o.steps.push({ i, clickError: String(e).slice(0, 80) })); await p.waitForTimeout(1500);
    o.steps.push({ pin: i + 1, toasts: await toasts(p), pinned: ((await prefGet()).pinnedTechnicianIds ?? []).length, disabled: await p.locator(`[data-test-id="button_board_pin_${x.staff_id}"]`).first().evaluate((e) => (e as any).disabled || e.getAttribute('aria-disabled')).catch(() => null) });
    if (i === 3 || i === 4 || i === 5) await shotC(`C682432-held-pin${i + 1}`); }
  await p.evaluate(`document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller').scrollLeft = 0`); await p.waitForTimeout(800);
  await p.locator(`[data-test-id="button_board_pin_${six[0].staff_id}"]`).first().click({ timeout: 6000 }).catch(() => {}); await p.waitForTimeout(1500); o.unpinA = { toasts: await toasts(p), pinned: ((await prefGet()).pinnedTechnicianIds ?? []).length }; await shotC('C682432-held-unpin');
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

await run('C682433', async (o) => {
  await go('Tech View', ''); await p.locator('[data-test-id="button_density"]').click().catch(() => {}); await p.waitForTimeout(900);
  o.s1_2 = await p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); await shotC('C682433-held-tech-density'); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  await display(p, 'Board View'); await p.waitForTimeout(1500);
  o.s5 = await p.evaluate(`[...document.querySelectorAll('button, [role=button]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.top < 200; }).map(e => (e.getAttribute('data-test-id') || '') + ' | ' + (e.getAttribute('aria-label') || e.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 40))`);
  await p.locator('[data-test-id="button_density"]').click().catch(() => {}); await p.waitForTimeout(900);
  o.s6_7 = await p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); await shotC('C682433-held-board-density'); await p.keyboard.press('Escape');
});

await run('C682434', async (o) => {
  const A1 = await T('C682434', 'Ana'), B1 = await T('C682434', 'Ben'); const set = await mkSet('ZZAUTOTEST C682434 Design Empty', [{ co: 'One', lead: B1 }]); o.data = set.w;
  await pins([A1.staff_id]); await go('Tech View', set.q);
  o.s2 = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id="tech_view_group_${A1.staff_id}"]'); if (!g) return 'Ana group not drawn'; let n = g.nextElementSibling; const texts = []; for (let i = 0; i < 2 && n; i++) { texts.push(n.innerText.replace(/\\s+/g, ' ').trim()); n = n.nextElementSibling; } return { header: g.innerText.replace(/\\s+/g, ' ').trim(), next: texts }; })()`); await shotC('C682434-held-empty-group');
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

await run('C682435', async (o) => {
  const A1 = await T('C682435', 'Ana'); const set = await mkSet('ZZAUTOTEST C682435 Design Count', [{ co: 'Approved', lead: A1 }, { co: 'Estimate', lead: A1, status: 'estimate' }, { co: 'Declined', lead: A1, status: 'declined' }]); o.data = set.w; o.log = set.log;
  await pins([A1.staff_id]); await go('Tech View', '');
  await p.locator(`[data-test-id="button_tech_view_group_toggle_${A1.staff_id}"]`).click({ timeout: 6000 }).catch(() => {}); await p.waitForTimeout(1200);
  await search(p, set.w.Approved.number); await p.waitForTimeout(2500);
  o.s3 = await p.evaluate(`(() => { const rows = [...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].filter(r => /^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id')) && r.getAttribute('data-group-key') === ${JSON.stringify(A1.staff_id)}); const g = document.querySelector('[data-test-id="tech_view_group_${A1.staff_id}"]'); return { rowsShownInAnaGroup: rows.length, header: g ? g.innerText.replace(/\\s+/g, ' ').trim() : null }; })()`); await shotC('C682435-held-s3');
  await search(p, ''); await display(p, 'Board View'); await p.waitForTimeout(2500); await toColumn(p, A1.staff_id).catch(() => {});
  o.s4 = (await boardCols(p)).find((c) => c.id === A1.staff_id) ?? null;
  o.s5 = await menuOf(card(set, 'Approved')); await leadItem().click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(1500);
  o.s7 = await p.evaluate(`(() => { const o = document.querySelector('[data-test-id="option_lead_technician_${A1.staff_id}"]'); return o ? o.innerText.replace(/\\s+/g, ' ').trim() : 'option not found'; })()`); await shotC('C682435-held-dialog'); await cancelDialog();
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

await run('C682436', async (o) => {
  // Location-B (work orders, no technicians): ZZAUTOTEST F2 No Tech Shop (notech-stg4.mts). Location-C (neither): ZZAUTOTEST Location Empty,
  // made here by the runner on screen with notech-stg4's recipe (the creator is enrolled but has Time Clock off, so it has no technician).
  const wpList = async () => { const d = (await a.get('/api/workplaces')).body?.data; return (Array.isArray(d) ? d : d?.collection ?? []) as any[]; };
  const mk = async (LOC: string) => { let w = (await wpList()).find((x) => x.name === LOC); if (w) return { w, made: false };
    await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
    await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(3000);
    const d = p.locator('.q-dialog').last();
    await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(LOC);
    const fill = async (lab: string, v: string) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
    await fill('Address 1', '3 ZZAUTOTEST Way'); await fill('City', 'Las Vegas'); { const z = d.getByLabel(/ZIP/i).first(); await z.click(); await z.fill('89135'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('7025550199', { delay: 30 }); }
    const st = d.getByLabel('State/Province').first(); await st.click(); await p.waitForTimeout(800); await p.keyboard.type('Nevada', { delay: 40 }); await p.waitForTimeout(1200);
    await p.locator('.q-menu .q-item').filter({ hasText: 'Nevada' }).first().click().catch(() => {}); await p.waitForTimeout(800);
    const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); await tz.click(); await p.waitForTimeout(800); await p.keyboard.type('Karachi', { delay: 50 }); await p.waitForTimeout(1500);
    await p.locator('.q-menu .q-item').filter({ hasText: 'Asia/Karachi' }).first().click().catch(() => {}); await p.waitForTimeout(800);
    await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (b) { b.scrollIntoView(); b.click(); } })()`); await p.waitForTimeout(4000);
    w = (await wpList()).find((x) => x.name === LOC); return { w, made: true }; };
  const view = async (w: any, tag: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await switchLocUI(p, w.name); await p.waitForTimeout(3000); /* 19 Oct: the API change-location did not change the page; the on-screen switch does */
    const header = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => ''); await tab(p, 'All'); await display(p, 'Board View').catch(() => {}); await p.waitForTimeout(2500);
    const text = await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ').slice(0, 700)`); await shotC(`C682436-held-${tag}`); return { header: header.replace(/\s+/g, ' ').trim(), text }; };
  const B = await mk('ZZAUTOTEST F2 No Tech Shop'); const C = await mk('ZZAUTOTEST Location Empty');
  o.locationB = { made: B.made, found: !!B.w }; o.locationC = { made: C.made, found: !!C.w };
  if (B.w) o.s1_3 = await view(B.w, 'loc-b-no-techs');
  if (C.w) { o.s4_6 = await view(C.w, 'loc-c-empty'); }
  o.back = await switchLocUI(p, 'Staging Heavy Duty - 9919');
  if (!/Heavy Duty/.test(o.back)) { await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' }); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.backAfterApi = await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => ''); }
});

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'c6824-held.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
