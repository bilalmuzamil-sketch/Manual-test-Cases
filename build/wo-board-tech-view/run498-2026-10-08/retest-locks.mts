/** retest-locks.mts — 19 Oct 2026 (22:50 UTC): re-test of C96964, C96967, C368147 by their steps as rewritten to PRD v68 (S4-N6 lock tooltips and drag note
 *  "Invoiced · can’t be reassigned"; S4-N1 view-only drag note "You don’t have permission to assign technicians"). Helpers and runner set-up are
 *  c6824-held.mts lines 8-108. New: tooltip reads (hover, visible .q-tooltip), the lock icon on a card/row, the note read WHILE HELD over the target
 *  column/group (whole target text + any overlay), a plain release (no Escape), then column + lead read back. Records only. */
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
import { viewAs } from './viewas.mts';
const tip = async () => { await p.waitForTimeout(900); return p.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>; };
const tipOf = async (pg: Page) => { await pg.waitForTimeout(900); return pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>; };
// the lock sign on a card / row: an icon whose text or name is "lock"; marked so it can be hovered
const lockOf = (pg: Page, hostSel: string) => pg.evaluate(`(() => { const h = document.querySelector(${JSON.stringify(hostSel)}); if (!h) return { host: false }; const c = [...h.querySelectorAll('i, svg, [data-test-id*=lock], [class*=lock]')].find(e => /^lock$/.test((e.textContent || '').trim()) || /lock/.test(e.getAttribute('data-icon') || '') || /lock/.test(e.getAttribute('data-test-id') || '') || /(^|\\s)lock/.test(e.getAttribute('class') || ''));
  if (!c) return { host: true, lock: false }; c.setAttribute('data-zz-lock', '1'); const r = c.getBoundingClientRect(); return { host: true, lock: true, tag: c.tagName, cls: (c.getAttribute('class') || '').slice(0, 60), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; })()`);
const readTarget = (pg: Page, sel: string) => pg.evaluate(`(() => { const t = document.querySelector(${JSON.stringify(sel)}); const over = [...document.querySelectorAll('[class*=denied], [class*=drag-note], [class*=no-permission], [class*=locked-note]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean);
  return { targetText: t ? t.innerText.replace(/\\s+/g, ' ').trim().slice(0, 300) : null, overlays: over }; })()`);
async function holdRelease(pg: Page, fromSel: string, toSel: string, tag: string) { await pg.locator(fromSel).first().scrollIntoViewIfNeeded().catch(() => {}); const a1 = await pg.locator(fromSel).first().boundingBox(); const b1 = await pg.locator(toSel).first().boundingBox();
  if (!a1 || !b1) return { drag: 'missing ' + (!a1 ? 'card/row' : 'target') }; const gx = a1.x + a1.width * 0.45;
  await pg.mouse.move(gx, a1.y + a1.height / 2); await pg.mouse.down(); await pg.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 }); await pg.mouse.move(b1.x + b1.width / 2, b1.y + Math.min(60, b1.height / 2), { steps: 20 }); await pg.waitForTimeout(1000);
  const held = await readTarget(pg, toSel); await pg.screenshot({ path: path.join(EV, `${tag}-holding.png`) }).catch(() => {});
  await pg.mouse.up(); await pg.waitForTimeout(2500); const msgs = await pg.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`); await pg.screenshot({ path: path.join(EV, `${tag}-released.png`) }).catch(() => {});
  return { drag: 'held then released', held, messagesAfter: msgs }; }
const menuItems = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-menu .q-item')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ text: e.innerText.replace(/\\s+/g, ' ').trim(), disabled: e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled') || e.classList.contains('q-item--disabled') }))`) as Promise<any[]>;
async function lockedMenu(hostSel: string, tag: string) { const o: any = {}; const host = p.locator(hostSel).first(); await host.scrollIntoViewIfNeeded().catch(() => {}); await host.hover(); await p.waitForTimeout(500);
  o.lock = await lockOf(p, hostSel); if (o.lock.lock) { await p.locator('[data-zz-lock="1"]').first().hover().catch(() => {}); o.lockTip = await tip(); await shotC(`${tag}-lock-tip`); await p.evaluate(`document.querySelectorAll('[data-zz-lock]').forEach(e => e.removeAttribute('data-zz-lock'))`); }
  await host.hover(); await host.locator('[data-test-id="button_work_order_more_actions"]').click({ timeout: 8000 }).catch((e) => { o.menuButton = String(e).slice(0, 80); }); await p.waitForTimeout(900); o.items = await menuItems(p);
  for (const [k, re] of [['reassign', /lead technician/i], ['unassign', /^Unassign/i]] as [string, RegExp][]) { const it = p.locator('.q-menu .q-item').filter({ hasText: re }).first(); if (await it.count()) { await it.hover().catch(() => {}); o[k + 'Tip'] = await tip(); await shotC(`${tag}-${k}-tip`); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); return o; }
const leadName = async (id: string) => { const w = (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order; return w ? `${w.tech_assigned_first_name ?? w.techAssignedFirstName ?? ''} ${w.tech_assigned_last_name ?? w.techAssignedLastName ?? ''}`.trim() || (w.tech_assigned_id ?? 'none') : 'n/a'; };

await run('C96964', async (o) => {
  const A1 = await T('C96964', 'Ana'), B1 = await T('C96964', 'Ben');
  const set = await mkSet('ZZAUTOTEST F1 Locked Lead Tooltip', [{ co: 'Invoiced', lead: A1, status: 'invoiced' }, { co: 'Paid', lead: A1, status: 'paid' }]); o.data = set.w; o.log = set.log;
  await pins([A1.staff_id, B1.staff_id]);
  await go('Board View', set.q);
  for (const k of ['Invoiced', 'Paid']) { o['board' + k] = await lockedMenu(card(set, k), `C96964-r-board-${k}`);
    o['board' + k].drop = await holdRelease(p, card(set, k), `[data-test-id="board_column_${B1.staff_id}"]`, `C96964-r-board-${k}`); o['board' + k].leadAfter = await leadName(set.w[k].id);
    o['board' + k].columnAfter = (await boardCols(p)).find((c) => c.cards.includes(set.w[k].number))?.name ?? null; }
  await go('Tech View', set.q);
  for (const k of ['Invoiced', 'Paid']) { o['tech' + k] = await lockedMenu(row(set, k), `C96964-r-tech-${k}`);
    o['tech' + k].drop = await holdRelease(p, row(set, k), `[data-test-id="tech_view_group_${B1.staff_id}"]`, `C96964-r-tech-${k}`); o['tech' + k].leadAfter = await leadName(set.w[k].id); }
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

// a view-only user (Work orders: View only), switched to as the runner; the viewer's own page carries the viewer's permissions
const ORG = (await import('./profile.mts')).ORG;
const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data);
const RI = await roleIds(a);
const VIEW_ROLE = rolesL.find((r) => /^ZZAUTOTEST WO View Only$/.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => /^ZZAUTOTEST WO View Only$/.test(l))?.[1] ?? (await staffRows(a, 'zz.wob.viewonly@staging.shopview.local'))[0]?.role_id;
async function asViewer(key: string, f: (pg: Page, va: any, o: any) => Promise<void>, o: any) {
  const u = (await person(a, 'ZZAUTOTEST Vera', `Viewonly ${key}`, { role: VIEW_ROLE, email: `zz.wob.vera.${key.toLowerCase()}${D}`, clockable: false })).row; o.viewer = { made: !!u, role: !!VIEW_ROLE };
  if (!u) throw new Error('viewer not made'); const V = await viewAs(browser, p, a, u.id, ME?.id ?? '', (RUN as any).toRunner); o.viewerPerms = V.perms;
  try { await f(V.page, api(V.page), o); } finally { await V.close().catch(() => {}); }
}
const goV = async (pg: Page, d: string, q: string) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (q) await search(pg, q); if (d === 'Tech View') await expandSmallGroups(pg); };

await run('C96967', async (o) => {
  const techs = await candidates(a); const ES = techs.find((x) => x.name === 'Esther Howard'); const B1 = await T('C96967', 'Ben');
  if (!ES) throw new Error('Esther Howard not a technician here');
  const set = await mkSet('ZZAUTOTEST F1 View Only No Drag', [{ co: 'One', lead: { staff_id: ES.id } }]); o.data = set.w;
  await asViewer('C96967', async (pg, va, o) => {
    const PV = (await va.get(PREF)).body?.data?.value ?? {}; await va.put(PREF, { value: { ...PV, pinnedTechnicianIds: [ES.id, B1.staff_id] } });
    await goV(pg, 'Board View', set.q); await pg.screenshot({ path: path.join(EV, 'C96967-r-board-start.png') });
    o.s4_5 = await holdRelease(pg, card(set, 'One'), `[data-test-id="board_column_${B1.staff_id}"]`, 'C96967-r-board');
    o.s6 = await holdRelease(pg, card(set, 'One'), `[data-test-id="board_column_${ES.id}"]`, 'C96967-r-board-within');
    await pg.locator(card(set, 'One')).first().hover().catch(() => {}); await pg.waitForTimeout(600); o.s7_moreActions = await pg.locator(`${card(set, 'One')} [data-test-id="button_work_order_more_actions"]`).count();
    if (o.s7_moreActions) { await pg.locator(`${card(set, 'One')} [data-test-id="button_work_order_more_actions"]`).first().click().catch(() => {}); await pg.waitForTimeout(800); o.s7_items = await menuItems(pg); await pg.keyboard.press('Escape'); }
    await goV(pg, 'Tech View', set.q);
    o.tech = await holdRelease(pg, row(set, 'One'), `[data-test-id="tech_view_group_${B1.staff_id}"]`, 'C96967-r-tech');
    await pg.locator(row(set, 'One')).first().hover().catch(() => {}); await pg.waitForTimeout(600); o.tech_moreActions = await pg.locator(`${row(set, 'One')} [data-test-id="button_work_order_more_actions"]`).count();
    await va.put(PREF, { value: PV });
  }, o);
  o.s9_lead = await leadName(set.w.One.id);
});

await run('C368147', async (o) => {
  const A1 = await T('C368147', 'Ana'), B1 = await T('C368147', 'Ben');
  const set = await mkSet('ZZAUTOTEST F3 No Drag Permission', [{ co: 'Alpha Co', lead: A1 }, { co: 'Bravo Co', lead: A1 }]); o.data = set.w;
  await asViewer('C368147', async (pg, va, o) => {
    const PV = (await va.get(PREF)).body?.data?.value ?? {}; await va.put(PREF, { value: { ...PV, pinnedTechnicianIds: [A1.staff_id, B1.staff_id] } });
    await goV(pg, 'Board View', set.q);
    const colOrder = async () => pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${A1.staff_id}"]'); return c ? [...c.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : []; })()`);
    o.s4_order = await colOrder();
    o.s5 = await holdRelease(pg, card(set, 'Bravo Co'), card(set, 'Alpha Co'), 'C368147-r-s5'); o.s5_order = await colOrder();
    o.s6_7 = await holdRelease(pg, card(set, 'Alpha Co'), `[data-test-id="board_column_${B1.staff_id}"]`, 'C368147-r-s6'); o.s7_order = await colOrder();
    await pg.locator(card(set, 'Alpha Co')).first().hover().catch(() => {}); await pg.waitForTimeout(600); o.s8_moreActions = await pg.locator(`${card(set, 'Alpha Co')} [data-test-id="button_work_order_more_actions"]`).count();
    await goV(pg, 'Tech View', set.q);
    o.s10_11 = await holdRelease(pg, row(set, 'Alpha Co'), `[data-test-id="tech_view_group_${B1.staff_id}"]`, 'C368147-r-s10');
    await va.put(PREF, { value: PV });
  }, o);
  o.s12_lead = await leadName(set.w['Alpha Co'].id);
});

// C97020 steps 1-6: the view-only user with the keyboard only (the Admin half is kbd-r4.mts ONLY=C97020)
const focusOf = (pg: Page) => pg.evaluate(`(() => { const e = document.activeElement; if (!e) return null; const card = e.closest('[data-test-id^="board_card_"]'); const num = card ? (card.querySelector('[data-test-id="board_card_number"]') || {}).textContent : null;
  return { id: e.getAttribute('data-test-id') || e.tagName, label: e.getAttribute('aria-label'), card: num ? num.trim() : null, inMenu: !!e.closest('.q-menu') }; })()`) as Promise<any>;
await run('C97020', async (o) => {
  const A1 = await T('C97020', 'Ana'), B1 = await T('C97020', 'Ben');
  const set = await mkSet('ZZAUTOTEST F3 Keyboard Viewer', [{ co: 'Alpha Co', lead: A1 }, { co: 'Bravo Co', lead: A1, status: 'invoiced' }]); o.data = set.w;
  await asViewer('C97020', async (pg, va, o) => {
    const PV = (await va.get(PREF)).body?.data?.value ?? {}; await va.put(PREF, { value: { ...PV, pinnedTechnicianIds: [A1.staff_id, B1.staff_id] } });
    await goV(pg, 'Board View', set.q); await pg.locator('[data-test-id="page_search_input"]').first().click(); await pg.waitForTimeout(500);
    o.s1 = await focusOf(pg); const stops: any[] = [];
    for (let i = 0; i < 25; i++) { await pg.keyboard.press('Tab'); await pg.waitForTimeout(250); const f = await focusOf(pg); stops.push(f.id + (f.card ? ' ' + f.card : '')); if (f.card) break; }
    o.s2 = { stops, focus: await focusOf(pg) };
    for (let i = 0; i < 4 && (await focusOf(pg)).card !== set.w['Alpha Co'].number; i++) { await pg.keyboard.press(i < 2 ? 'ArrowDown' : 'ArrowUp'); await pg.waitForTimeout(300); }
    o.s3 = await focusOf(pg); await pg.screenshot({ path: path.join(EV, 'C97020-v-s3-card.png') });
    await pg.keyboard.press('Tab'); await pg.waitForTimeout(400); o.s4 = await focusOf(pg); o.s4.moreActionsOnCard = await pg.locator(`${card(set, 'Alpha Co')} [data-test-id="button_work_order_more_actions"]`).count();
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200); o.s5 = { menus: await pg.locator('.q-menu').count(), items: await menuItems(pg), dialogs: await pg.locator('.q-dialog').count(), focus: await focusOf(pg) }; await pg.screenshot({ path: path.join(EV, 'C97020-v-s5-enter.png') });
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
    // step 6 from the card itself
    for (let i = 0; i < 2 && (await focusOf(pg)).card !== set.w['Alpha Co'].number; i++) { await pg.keyboard.press('Shift+Tab'); await pg.waitForTimeout(300); }
    o.s6 = { from: await focusOf(pg), keys: {} };
    for (const k of ['Space', 'Shift+ArrowUp', 'Shift+ArrowDown', 'Shift+ArrowLeft', 'Shift+ArrowRight']) { await pg.keyboard.press(k); await pg.waitForTimeout(900); o.s6.keys[k] = { focus: await focusOf(pg), col: (await boardCols(pg)).find((c) => c.cards.includes(set.w['Alpha Co'].number))?.name ?? null, menus: await pg.locator('.q-menu').count(), dialogs: await pg.locator('.q-dialog').count() }; if (o.s6.keys[k].menus || o.s6.keys[k].dialogs) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); } }
    await pg.screenshot({ path: path.join(EV, 'C97020-v-s6-after-keys.png') });
    await va.put(PREF, { value: PV });
  }, o);
  o.s6_lead = await leadName(set.w['Alpha Co'].id);
});

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'retest-locks.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
