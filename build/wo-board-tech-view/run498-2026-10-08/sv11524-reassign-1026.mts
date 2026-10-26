/** sv11524-reassign-1026.mts — 26 Oct 2026, QA branch sv11524 (SV-11524 fix check, Chris Ward 20 Oct: one-click assign, no Unassigned in the dialog, the design toast wording; test cases C682422–C682428 stay with it). Helper preamble copied from retest-locks2.mts (lines 5-127). Each case seeds its own ZZAUTOTEST technicians and customers and walks its steps on screen as the runner admin; readings + pictures EV/C6824xx-v-*.png; Undo/shift/invoice states read back from the API. Records only.
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
  o.lock = await lockOf(p, hostSel); if (o.lock.lock) { o.lockAttrs = await p.evaluate(`(() => { const e = document.querySelector('[data-zz-lock="1"]'); const a = (x) => x ? { title: x.getAttribute('title'), aria: x.getAttribute('aria-label'), desc: x.getAttribute('aria-describedby'), role: x.getAttribute('role'), html: x.outerHTML.slice(0, 300) } : null; return { self: a(e), parent: a(e && e.parentElement) }; })()`); const lb = await p.locator('[data-zz-lock="1"]').first().boundingBox(); if (lb) { await p.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2, { steps: 5 }); } await p.waitForTimeout(1500); o.lockTip = await tip(); await shotC(`${tag}-lock-tip`); await p.evaluate(`document.querySelectorAll('[data-zz-lock]').forEach(e => e.removeAttribute('data-zz-lock'))`); }
  await host.hover(); await host.locator('[data-test-id="button_work_order_more_actions"]').click({ timeout: 8000 }).catch((e) => { o.menuButton = String(e).slice(0, 80); }); await p.waitForTimeout(900); o.items = await menuItems(p);
  for (const [k, re] of [['reassign', /lead technician/i], ['unassign', /^Unassign/i]] as [string, RegExp][]) { const it = p.locator('.q-menu .q-item').filter({ hasText: re }).first(); if (await it.count()) { await it.hover().catch(() => {}); o[k + 'Tip'] = await tip(); await shotC(`${tag}-${k}-tip`); } }
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); return o; }
const leadName = async (id: string) => { const w = (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order; return w ? `${w.tech_assigned_first_name ?? w.techAssignedFirstName ?? ''} ${w.tech_assigned_last_name ?? w.techAssignedLastName ?? ''}`.trim() || (w.tech_assigned_id ?? 'none') : 'n/a'; };


// ---------- 26 Oct additions ----------
const TOAST_RE = /S\d+-\d+ assigned to|moved to Unassigned|lead technician set|Assignment undone|Lead technician (updated|removed)|Couldn.t undo|Failed to update/i;
const toastRead = (pg: Page = p) => pg.evaluate(`(() => { const re = ${TOAST_RE}; const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const hits = [...document.querySelectorAll('body *')].filter(e => vis(e) && re.test(e.innerText || '') && (e.innerText || '').length < 220 && !/keyboard_arrow|Assigned to me/.test(e.innerText || ''));
  // the outermost small box that still holds only the message (toast container)
  const boxes = hits.filter(e => !hits.some(o => o !== e && o.contains(e) === false && e.contains(o) === false ? false : false)).filter(e => e.getBoundingClientRect().width < 700);
  const top = boxes.filter(e => !boxes.some(o => o !== e && o.contains(e))); return top.map(e => { const r = e.getBoundingClientRect(); const btns = [...e.querySelectorAll('button')].map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim());
    return { text: e.innerText.replace(/\\s+/g, ' ').trim(), buttons: btns, box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], bg: getComputedStyle(e).backgroundColor }; }); })()`) as Promise<any[]>;
const waitToast = async (pg: Page = p, ms = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const r = await toastRead(pg); if (r.length) return { afterMs: Date.now() - t0, toasts: r }; await pg.waitForTimeout(150); } return { afterMs: null, toasts: [] }; };
const watchGone = async (pg: Page = p, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (!(await toastRead(pg)).length) return Date.now() - t0; await pg.waitForTimeout(150); } return null; };
const clickUndo = async (pg: Page = p) => { const b = pg.locator('button').filter({ hasText: /^\s*Undo\s*$/ }).last(); if (!(await b.count())) return false; await b.click(); return true; };
async function dragTo(fromSel: string, toSel: string, tag: string, pg: Page = p) { await pg.locator(fromSel).first().scrollIntoViewIfNeeded().catch(() => {}); const a1 = await pg.locator(fromSel).first().boundingBox(); const b1 = await pg.locator(toSel).first().boundingBox();
  if (!a1 || !b1) return { drag: 'missing ' + (!a1 ? 'from' : 'to') }; const gx = a1.x + a1.width * 0.45; await pg.mouse.move(gx, a1.y + a1.height / 2); await pg.mouse.down(); await pg.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 });
  await pg.mouse.move(b1.x + b1.width / 2, b1.y + Math.min(60, b1.height / 2), { steps: 20 }); await pg.waitForTimeout(600); await pg.mouse.up(); return { drag: 'done' }; }
const leadDialog = async () => p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!d) return null;
  const items = [...d.querySelectorAll('.q-item')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim());
  const buttons = [...d.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0).map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim());
  const inp = d.querySelector('input'); const title = (d.querySelector('[class*=title], .text-h6, h2, h3') || {}).innerText;
  return { title: (title || '').replace(/\\s+/g, ' ').trim(), search: inp ? (inp.getAttribute('placeholder') || inp.getAttribute('aria-label')) : null, items: items.slice(0, 40), nItems: items.length, buttons, hasUnassignedRow: items.some(t => /^Unassigned\\b/i.test(t)) }; })()`);
const openLeadAction = async (hostSel: string) => { const items = await menuOf(hostSel); const it = p.locator('.q-menu .q-item').filter({ hasText: /lead technician/i }).first(); const label = (await it.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); if (await it.count()) { await it.click(); await p.waitForTimeout(1500); } return { menu: items, clicked: label }; };
const pickInDialog = async (re: RegExp) => { const d = p.locator('.q-dialog').last(); const it = d.locator('.q-item').filter({ hasText: re }).first(); if (!(await it.count())) { const inp = d.locator('input').first(); if (await inp.count()) { await inp.fill(String(re.source).replace(/\\/g, '')); await p.waitForTimeout(1200); } } await d.locator('.q-item').filter({ hasText: re }).first().click(); };
const dialogsOpen = () => p.locator('.q-dialog').filter({ hasText: /lead technician/i }).count();
const name = (x: any) => `${x.first_name} ${x.last_name}`;
const colOf = async (set: any, co: string) => (await boardCols(p)).find((c) => c.cards.includes(set.w[co].number))?.name ?? null;
const grpOf = async (set: any, co: string) => (await groups(p)).find((g: any) => (g.rows ?? []).includes(set.w[co].number))?.name ?? null;
R.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);

await run('C682422', async (o) => {
  const A1 = await T('C682422', 'Ana'); const set = await mkSet('ZZAUTOTEST C682422 Assign Wording', [{ co: 'NoLead', lead: null }, { co: 'Led', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id]); await go('Board View', set.q);
  o.s1 = await menuOf(card(set, 'NoLead')); const it = p.locator('.q-menu .q-item').filter({ hasText: /lead technician/i }).first(); await it.click(); await p.waitForTimeout(1500);
  o.s2 = await leadDialog(); await shotC('C682422-v-s2-assign-dialog'); await cancelDialog(); o.s3 = { dialogs: await dialogsOpen(), col: await colOf(set, 'NoLead') };
  o.s4 = await menuOf(card(set, 'Led')); await shotC('C682422-v-s4-menu-led'); await p.locator('.q-menu .q-item').filter({ hasText: /lead technician/i }).first().click(); await p.waitForTimeout(1500);
  o.s5 = await leadDialog(); await cancelDialog(); o.s6 = { dialogs: await dialogsOpen(), col: await colOf(set, 'Led') };
  await go('Tech View', set.q); o.s7 = { noLead: await grpOf(set, 'NoLead'), led: await grpOf(set, 'Led') };
  o.s8 = await menuOf(row(set, 'NoLead')); await shotC('C682422-v-s8-tech-menu'); await p.locator('.q-menu .q-item').filter({ hasText: /lead technician/i }).first().click(); await p.waitForTimeout(1500);
  o.s9 = await leadDialog(); await cancelDialog(); o.s10 = { dialogs: await dialogsOpen(), grp: await grpOf(set, 'NoLead') };
});

await run('C682423', async (o) => {
  const A1 = await T('C682423', 'Ana'), B1 = await T('C682423', 'Ben'); const set = await mkSet('ZZAUTOTEST C682423 One Click', [{ co: 'One', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  const x = await openLeadAction(card(set, 'One')); o.s1 = x.menu; o.s2 = x.clicked; o.s3_4 = await leadDialog(); await shotC('C682423-v-s3-dialog');
  await pickInDialog(/C682423 Ana/); await p.waitForTimeout(1500); o.s5 = { dialogs: await dialogsOpen(), col: await colOf(set, 'One'), toasts: await toastRead() };
  const y = await openLeadAction(card(set, 'One')); o.s6 = y.menu; o.s7 = y.clicked; await pickInDialog(/C682423 Ben/);
  o.s8 = { toast: await waitToast() }; await p.waitForTimeout(1200); o.s8.dialogsAfter1s = await dialogsOpen(); await shotC('C682423-v-s8-after-click'); await p.waitForTimeout(1500); o.s8.col = await colOf(set, 'One'); o.s8.lead = await leadName(set.w.One.id);
});

await run('C682424', async (o) => {
  const A1 = await T('C682424', 'Ana'), B1 = await T('C682424', 'Ben'); const set = await mkSet('ZZAUTOTEST C682424 Toast Words', [{ co: 'W1', lead: null }, { co: 'W2', lead: A1 }, { co: 'W3', lead: A1 }, { co: 'W4', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  await dragTo(card(set, 'W1'), `[data-test-id="board_column_${A1.staff_id}"]`, 'C682424-v-s1'); o.s1_2 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C682424-v-s2-toast-board-drag'); await p.waitForTimeout(800); o.s1_2.col = await colOf(set, 'W1');
  await watchGone(p, 9000);
  o.s3 = await menuOf(card(set, 'W2')); await p.locator('.q-menu .q-item').filter({ hasText: /^Unassign/ }).first().click(); o.s4_5 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C682424-v-s5-toast-unassign'); await p.waitForTimeout(800); o.s4_5.col = await colOf(set, 'W2');
  await watchGone(p, 9000);
  await go('Tech View', set.q); o.s6 = await grpOf(set, 'W3'); const x = await openLeadAction(row(set, 'W3')); o.s7_8 = x; await pickInDialog(/C682424 Ben/); o.s9_10 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C682424-v-s10-toast-tech-dialog'); await p.waitForTimeout(800); o.s9_10.grp = await grpOf(set, 'W3');
  await watchGone(p, 9000);
  await dragTo(row(set, 'W4'), `[data-test-id="tech_view_group_${B1.staff_id}"]`, 'C682424-v-s11'); o.s11_12 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C682424-v-s12-toast-tech-drag'); await p.waitForTimeout(800); o.s11_12.grp = await grpOf(set, 'W4');
});

await run('C682425', async (o) => {
  const A1 = await T('C682425', 'Ana'), B1 = await T('C682425', 'Ben'); const set = await mkSet('ZZAUTOTEST C682425 Toast Time', [{ co: 'W1', lead: A1 }, { co: 'W2', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); const t1 = Date.now(); await shiftPrompt(p, 'Keep shifts'); await p.mouse.move(800, 700);
  o.s1 = await waitToast(); o.s2_goneAfterMs = await watchGone(p, 15000); o.s2_sinceRelease = Date.now() - t1;
  await dragTo(card(set, 'W2'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); await shiftPrompt(p, 'Keep shifts'); o.s3 = await waitToast();
  if (o.s3.toasts[0]) { const b = o.s3.toasts[0].box; await p.mouse.move(b[0] + b[2] / 2, b[1] + b[3] / 2); await p.waitForTimeout(15000); o.s4_stillThere = (await toastRead()).length > 0; await shotC('C682425-v-s4-hovered-15s'); await p.mouse.move(800, 700); o.s5_goneAfterLeave = await watchGone(p, 12000); }
  await dragTo(card(set, 'W1'), `[data-test-id="board_column_${A1.staff_id}"]`, 'x'); await shiftPrompt(p, 'Keep shifts'); o.s6 = await waitToast(); o.s6.col = await colOf(set, 'W1');
  o.s7_clicked = await clickUndo(); const t7 = Date.now(); await p.mouse.move(800, 700); o.s7 = await waitToast(p, 3000); await shotC('C682425-v-s7-undone'); o.s8_goneAfterMs = await watchGone(p, 10000); o.s8_sinceUndo = Date.now() - t7;
  await p.waitForTimeout(1500); o.s7.col = await colOf(set, 'W1'); o.s7.lead = await leadName(set.w.W1.id);
});

await run('C682426', async (o) => {
  const A1 = await T('C682426', 'Ana'), B1 = await T('C682426', 'Ben'); const set = await mkSet('ZZAUTOTEST C682426 Undo Place', [{ co: 'W1', lead: A1 }, { co: 'W2', lead: A1 }, { co: 'W3', lead: A1 }, { co: 'W4', lead: null }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q); o.before = await col(A1.staff_id, set);
  await dragTo(card(set, 'W2'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); o.s1 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() };
  o.s2_clicked = await clickUndo(); o.s2 = await waitToast(p, 3000); const pr = await shiftPrompt(p, null); o.s2.shiftQuestion = pr; await p.waitForTimeout(2000); await shotC('C682426-v-s3-after-undo'); o.s3 = await col(A1.staff_id, set);
  await watchGone(p, 6000);
  await dragTo(card(set, 'W4'), `[data-test-id="board_column_${A1.staff_id}"]`, 'x'); o.s4 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() };
  o.s5_clicked = await clickUndo(); o.s5 = await waitToast(p, 3000); await p.waitForTimeout(2000); o.s5.col = await colOf(set, 'W4');
  o.s6_lead = await leadName(set.w.W2.id);
  await p.goto(APP + `/workorders/${set.w.W2.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const more = p.locator('button').filter({ has: p.locator('i:text-is("more_vert")') }).last(); await more.click().catch(() => {}); await p.waitForTimeout(1000);
  await p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first().click().catch(() => {}); await p.waitForTimeout(3000);
  o.s7_8 = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').slice(0, 900) : null; })()`); await shotC('C682426-v-s8-audit-log'); await p.keyboard.press('Escape');
});

await run('C682427', async (o) => {
  const A1 = await T('C682427', 'Ana'), B1 = await T('C682427', 'Ben'); const set = await mkSet('ZZAUTOTEST C682427 Undo Shifts', [{ co: 'W1', lead: A1 }]); o.data = set.w;
  const { mkShift, shiftsOn, localTime } = await import('./shifts.mts');
  const now = new Date(); const startH = Math.max(0, Number(localTime(now).slice(0, 2)) - 1); const st = `${String(startH).padStart(2, '0')}:00`;
  try { o.shiftA = await mkShift(a, set.w.W1.id, A1.staff_id, 0, st, 300); o.shiftB = await mkShift(a, set.w.W1.id, A1.staff_id, 1, '08:00', 240); } catch (e: any) { o.shiftErr = String(e.message).slice(0, 200); }
  const names = { [A1.staff_id]: 'Ana', [B1.staff_id]: 'Ben' }; o.shiftsBefore = await shiftsOn(a, set.w.W1.id, names);
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); await p.waitForTimeout(900);
  o.s1 = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => /scheduled shifts/i.test(e.innerText)).pop(); return d ? { text: d.innerText.replace(/\\s+/g, ' ').slice(0, 300), buttons: [...d.querySelectorAll('button')].map(b => b.innerText.trim()) } : null; })()`);
  await shotC('C682427-v-s1-shift-question'); await shiftPrompt(p, 'Clear shifts'); o.s2 = await waitToast(); o.shiftsAfterClear = await shiftsOn(a, set.w.W1.id, names);
  o.s3_clicked = await clickUndo(); o.s3 = await waitToast(p, 3000); o.s3.shiftQuestion = await shiftPrompt(p, null); await p.waitForTimeout(2500); o.s3.col = await colOf(set, 'W1');
  o.shiftsAfterUndo = await shiftsOn(a, set.w.W1.id, names); await shotC('C682427-v-s3-after-undo');
});

await run('C682428', async (o) => {
  const A1 = await T('C682428', 'Ana'), B1 = await T('C682428', 'Ben'); const set = await mkSet('ZZAUTOTEST C682428 Undo Invoiced', [{ co: 'W1', lead: A1, status: 'complete' }]); o.data = set.w; o.log = set.log;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q);
  await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); await shiftPrompt(p, 'Keep shifts'); o.s1 = await waitToast(); const t1 = Date.now();
  const inv = await a.post('/api/invoices/create', { work_order_id: set.w.W1.id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
  o.s2 = { invoice: say(inv), status: (await a.get(`/api/work-orders/view/${set.w.W1.id}`)).body?.data?.work_order?.status, ms: Date.now() - t1 };
  o.s3_clicked = await clickUndo(); o.s3_ms = Date.now() - t1; o.s3 = await waitToast(p, 3000); await shotC('C682428-v-s3-after-undo'); await p.waitForTimeout(1500);
  await go('Board View', set.q); o.s5 = { col: await colOf(set, 'W1'), lead: await leadName(set.w.W1.id) }; await shotC('C682428-v-s5-after-refresh');
});

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'sv11524-reassign-1026.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
