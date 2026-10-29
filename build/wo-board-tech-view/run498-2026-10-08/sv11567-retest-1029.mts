/** sv11567-retest-1029.mts — 29 Oct 2026, QA lead: "Retest this based on the exact ticket description" (SV-11567, back in TESTING QA). Copy of
 *  sv11567-undo-1028.mts (ONLY=C682424..C847734 as before) plus the description's points the first pass did not cover: X-BV-SHIFT / X-TV-SHIFT —
 *  a shift UNDER WAY at the change is ended by "Clear shifts" and gets its original end time back on Undo (the 28 Oct run made its shift in the
 *  wrong zone, so it was not under way: the location's own timezone is read from /api/workplaces now); X-TV-INV — the invoiced refusal in Tech
 *  View; X-TV-TIME — 5 s / hover / Assignment undone timing in Tech View; X-TV-ORDER — Undo restores the place in the group in Tech View.
 *  Original header follows. */
/** sv11567-undo-1028.mts — 28 Oct 2026, QA branch sv11567 (SV-11567 Undo; PRD v81 S4-R16/S4-R32). Copied from sv11524-reassign-1026.mts; run with ONLY=C682424,C682425,C682426,C682427,C682428,C847734. C847734 (new 28 Oct): Undo returns each labor line to its earlier technician; an empty line stays empty; positive control = a second drag without Undo moves Line 1. Original header follows: sv11524-reassign-1026.mts — 26 Oct 2026, QA branch sv11524 (SV-11524 fix check, Chris Ward 20 Oct: one-click assign, no Unassigned in the dialog, the design toast wording; test cases C682422–C682428 stay with it). Helper preamble copied from retest-locks2.mts (lines 5-127). Each case seeds its own ZZAUTOTEST technicians and customers and walks its steps on screen as the runner admin; readings + pictures EV/C6824xx-v-*.png; Undo/shift/invoice states read back from the API. Records only.
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

// 28 Oct 2026 (C847734): line helpers copied from s4-batchE-drag-1020.mts
const lineTechs = async (wo: string, label: Record<string, string>) => Object.fromEntries(((await a.get(`/api/work-orders/${wo}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => [label[x.lineId] ?? x.lineId.slice(0, 6), `${(x.technicians ?? []).map((tt: any) => `${tt.firstName ?? ''} ${tt.lastName ?? ''}`.trim()).join(', ') || 'Unassigned'}${x.derivedFromLeadTech ? ' (follows lead)' : ''}`]));
async function completeLine(wo: string, line: string) {
  await a.post('/api/work-orders/change-mileage', { work_order_id: wo, mileage: '123456' });
  await a.post('/api/work-orders/lines/change-story', { line_id: line, tech_story: 'Done', work_order_id: wo });
  const r = await a.post('/api/work-orders/lines/change-status', { line_id: line, status: 'complete', workOrderId: wo });
  const st = (await linesRaw(wo)).find((l: any) => l.line_id === line); return `${r.status} ${st?.status ?? st?.line_status ?? '?'}`;
}
const pageLabor = async (wo: string, tag: string) => { const pg2 = await p.context().newPage(); try { await pg2.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await pg2.waitForTimeout(6000);
  if (await pg2.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg2.keyboard.press('Escape');
  await pg2.screenshot({ path: path.join(EV, `${tag}.png`) }).catch(() => {});
  return await pg2.evaluate(`[...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^Labor$/.test(e.textContent.trim())).map(e => e.parentElement?.parentElement?.innerText.replace(/\\s+/g, ' ').slice(0, 80))`).catch(() => null); } finally { await pg2.close().catch(() => {}); } };
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
  // 28 Oct: the case's precondition puts {Technician-B} on a line of {Work-order-4} (S4-R5 "lead technician set to"); the first run missed it
  const l4 = await mkLine(set.w.W4.id, 2); o.w4LineTechB = (await a.put(`/api/work-orders/lines/${l4}/technicians`, { staffIds: [B1.staff_id] })).status;
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
  // 28 Oct 2026: steps reshaped to Slavcho's automation (QA lead "follow your recommendation"): Board View drag + Undo, reload;
  // Tech View "Assign lead technician" dialog + Undo, reload; Audit Log kept as step 8.
  const A1 = await T('C682426', 'Ana'), B1 = await T('C682426', 'Ben'); const set = await mkSet('ZZAUTOTEST C682426 Undo Place', [{ co: 'W1', lead: A1 }, { co: 'W2', lead: A1 }, { co: 'W3', lead: A1 }, { co: 'W4', lead: null }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', set.q); o.before = await col(A1.staff_id, set);
  await dragTo(card(set, 'W2'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); o.s1 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C682426-v-s1-moved');
  o.s2_clicked = await clickUndo(); o.s2 = await waitToast(p, 3000); const pr = await shiftPrompt(p, null); o.s2.shiftQuestion = pr; await shotC('C682426-v-s2-undone'); await p.waitForTimeout(2000); o.s3 = await col(A1.staff_id, set);
  await watchGone(p, 6000);
  await go('Board View', set.q); o.s4_afterReload = await col(A1.staff_id, set); await shotC('C682426-v-s4-after-reload');
  await go('Tech View', set.q); o.s5_menu = await openLeadAction(row(set, 'W4')); await pickInDialog(/C682426 Ana/); o.s5 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; o.s5.group = await grpOf(set, 'W4'); await shotC('C682426-v-s5-assigned');
  o.s6_clicked = await clickUndo(); o.s6 = await waitToast(p, 3000); await shotC('C682426-v-s6-undone'); await p.waitForTimeout(2500); o.s6.group = await grpOf(set, 'W4');
  await go('Tech View', set.q); o.s7_group = await grpOf(set, 'W4'); o.s7_lead = await leadName(set.w.W4.id); await shotC('C682426-v-s7-after-reload');
  o.w2_lead = await leadName(set.w.W2.id);
  await p.goto(APP + `/workorders/${set.w.W2.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  // 28 Oct: `.last()` hit a part row's ⋮; take the ⋮ in the top bar (next to "New Line"), by position
  const mv = await p.evaluate(`(() => { const b = [...document.querySelectorAll('button')].filter(x => /more_vert/.test(x.innerText) || x.querySelector('i')?.textContent?.trim() === 'more_vert').map(x => x.getBoundingClientRect()).filter(r => r.width > 0 && r.top < 200).sort((a, b) => b.right - a.right); return b[0] ? { x: b[0].x + b[0].width / 2, y: b[0].y + b[0].height / 2 } : null; })()`) as any;
  o.s8_menuBtn = mv; if (mv) await p.mouse.click(mv.x, mv.y); await p.waitForTimeout(1000);
  await p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first().click().catch(() => {}); await p.waitForTimeout(3000);
  o.s8 = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').slice(0, 900) : null; })()`); await shotC('C682426-v-s8-audit-log'); await p.keyboard.press('Escape');
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
  // 28 Oct: watch every message for 6 s after Undo (the server's refusal comes after the click; the first run looked at +7 ms)
  o.s3_clicked = await clickUndo(); o.s3_ms = Date.now() - t1; const t3 = Date.now(); const seen: Record<string, number> = {};
  while (Date.now() - t3 < 6000) { for (const x of await toastRead(p)) { const k = x.text; if (!(k in seen)) seen[k] = Date.now() - t3; }
    for (const al of await p.evaluate(`[...document.querySelectorAll('.q-dialog, [role=alert], [role=alertdialog], .q-banner')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as string[]) if (!(al in seen)) seen[al] = Date.now() - t3;
    if (Date.now() - t3 > 1400 && !o.s3_shot1) { o.s3_shot1 = Date.now() - t3; await shotC('C682428-v-s3-after-undo-1s'); }
    if (Date.now() - t3 > 3800 && !o.s3_shot2) { o.s3_shot2 = Date.now() - t3; await shotC('C682428-v-s3-after-undo-4s'); o.s3_colNoRefresh = await colOf(set, 'W1'); }
    await p.waitForTimeout(150); }
  o.s3_messages = seen;
  await go('Board View', set.q); o.s5 = { col: await colOf(set, 'W1'), lead: await leadName(set.w.W1.id) }; await shotC('C682428-v-s5-after-refresh');
});


await run('C847734', async (o) => {
  const A1 = await T('C847734', 'Ana'), B1 = await T('C847734', 'Ben');
  const n = `ZZAUTOTEST FF Undo Lines ${RUNNO}`; const c = await customer(a, n, 'ZZUNDL'); const wo = await workOrder(a, c, 'approved', null);
  const L: Record<string, string> = {};
  const l1 = await mkLine(wo, 1); L[l1] = 'Line 1 Unassigned';
  const l2 = await mkLine(wo, 2); L[l2] = 'Line 2 Explicit'; o.l2set = (await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [B1.staff_id] })).status;
  const l3 = await mkLine(wo, 3); L[l3] = 'Line 3 Complete'; o.l3complete = await completeLine(wo, l3);
  const num = (await workOrders(a, n))[0].number; o.wo = num; o.before = await lineTechs(wo, L);
  await pins([A1.staff_id, B1.staff_id]); await go('Board View', n); // 28 Oct: Ana's column was not drawn without the pin (L0430) o.s2_inUnassigned = (await boardCols(p)).find((x) => x.id === 'unassigned')?.cards.includes(num);
  await dragTo(`[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${A1.staff_id}"]`, 'C847734-v-s3');
  o.s3 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await shotC('C847734-v-s3-moved');
  o.s4_clicked = await clickUndo(); o.s4 = await waitToast(p, 3000); await shotC('C847734-v-s4-undone'); await p.waitForTimeout(2500);
  o.s4_inUnassigned = (await boardCols(p)).find((x) => x.id === 'unassigned')?.cards.includes(num);
  o.s5 = await lineTechs(wo, L); o.s5_page = await pageLabor(wo, 'C847734-v-s5-lines-after-undo');
  await go('Board View', n);
  await dragTo(`[data-test-id="board_card_${wo}"]`, `[data-test-id="board_column_${A1.staff_id}"]`, 'C847734-v-s6');
  o.s6 = { prompt: await shiftPrompt(p, 'Keep shifts'), toast: await waitToast() }; await p.waitForTimeout(6500);
  o.s7 = await lineTechs(wo, L); o.s7_page = await pageLabor(wo, 'C847734-v-s7-lines-control');
});


// ───────── 29 Oct 2026: the ticket description, point by point, where the 28 Oct pass had gaps ─────────
const WPS = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/workplaces')).body?.data) as any[];
const LTZ = (WPS.find((w: any) => w.id === process.env.WOB_LOC1) ?? {}).timezone ?? 'America/Edmonton';
const lDate = (off = 0) => new Intl.DateTimeFormat('en-CA', { timeZone: LTZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() + off * 86400000));
const lTime = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: LTZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
const mkShift2 = async (wo: string, staff: string, day: number, start: string, minutes: number) => { const r = await a.post('/api/schedule/shifts', { workOrderId: wo, lineIds: [], staffId: staff, startDate: lDate(day), startTime: start, spreadMode: 'single', totalMinutes: minutes, perDayMinutes: minutes, isAllDay: false }); return { status: r.status, id: r.body?.data?.shifts?.[0]?.id, err: r.status >= 300 ? JSON.stringify(r.body).slice(0, 200) : undefined }; };
const shifts2 = async (wo: string, names: Record<string, string>) => { const from = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const body = (await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body; const out: any[] = []; const seen = new Set<string>();
  const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.startsAt && x.endsAt && x.workOrder?.id === wo && !seen.has(x.id)) { seen.add(x.id); out.push(x); } for (const v of Object.values(x)) walk(v); }; walk(body);
  return out.map((s) => `${names[s.staffId] ?? String(s.staffId).slice(0, 6)} ${new Intl.DateTimeFormat('en-CA', { timeZone: LTZ }).format(new Date(s.startsAt))} ${lTime(new Date(s.startsAt))}-${lTime(new Date(s.endsAt))}`).sort(); };
const shiftCase = async (o: any, key: string, view: 'Board View' | 'Tech View') => {
  const A1 = await T(key, 'Ana'), B1 = await T(key, 'Ben'); const set = await mkSet(`ZZAUTOTEST ${key} Undo Shifts`, [{ co: 'W1', lead: A1 }]); o.data = set.w; o.ltz = LTZ;
  const now = new Date(); const st = lTime(new Date(Math.floor((now.getTime() - 30 * 60000) / 900000) * 900000)); // under way: started 30–45 minutes ago on a quarter hour (the server refuses any other start), 3 hours long
  o.shiftNow = await mkShift2(set.w.W1.id, A1.staff_id, 0, st, 180); o.shiftTomorrow = await mkShift2(set.w.W1.id, A1.staff_id, 1, '08:00', 240);
  const names = { [A1.staff_id]: 'Ana', [B1.staff_id]: 'Ben' }; o.before = await shifts2(set.w.W1.id, names); o.nowLocal = `${lDate(0)} ${lTime(new Date())}`;
  await pins([A1.staff_id, B1.staff_id]); await go(view, set.q);
  if (view === 'Board View') await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x');
  else { o.menu = await openLeadAction(row(set, 'W1')); await pickInDialog(new RegExp(`${key} Ben`)); }
  await p.waitForTimeout(900); o.question = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => /scheduled shifts/i.test(e.innerText)).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').slice(0, 260) : null; })()`);
  await shotC(`${key}-question`); await shiftPrompt(p, 'Clear shifts'); o.toast = await waitToast(); o.afterClear = await shifts2(set.w.W1.id, names); o.changeLocal = lTime(new Date());
  o.undo = await clickUndo(); o.afterUndoToast = await waitToast(p, 3000); o.undoQuestion = await shiftPrompt(p, null); await p.waitForTimeout(2500);
  o.where = view === 'Board View' ? await colOf(set, 'W1') : await grpOf(set, 'W1'); o.afterUndo = await shifts2(set.w.W1.id, names); await shotC(`${key}-after-undo`);
  o.restoredExactly = JSON.stringify(o.before) === JSON.stringify(o.afterUndo);
};
await run('X-BV-SHIFT', async (o) => shiftCase(o, 'XBVSHIFT', 'Board View'));
await run('X-TV-SHIFT', async (o) => shiftCase(o, 'XTVSHIFT', 'Tech View'));
await run('X-TV-INV', async (o) => {
  const A1 = await T('XTVINV', 'Ana'), B1 = await T('XTVINV', 'Ben'); const set = await mkSet('ZZAUTOTEST XTVINV Undo Invoiced', [{ co: 'W1', lead: A1, status: 'complete' }]); o.data = set.w; o.log = set.log;
  await pins([A1.staff_id, B1.staff_id]); await go('Tech View', set.q);
  o.menu = await openLeadAction(row(set, 'W1')); await pickInDialog(/XTVINV Ben/); await shiftPrompt(p, 'Keep shifts'); o.s1 = await waitToast(); const t1 = Date.now();
  const inv = await a.post('/api/invoices/create', { work_order_id: set.w.W1.id, issue_date: new Date().toISOString().slice(0, 10), due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
  o.s2 = { invoice: say(inv), status: (await a.get(`/api/work-orders/view/${set.w.W1.id}`)).body?.data?.work_order?.status, ms: Date.now() - t1 };
  o.undo = await clickUndo(); const t3 = Date.now(); const seen: Record<string, number> = {};
  while (Date.now() - t3 < 6000) { for (const x of await toastRead(p)) if (!(x.text in seen)) seen[x.text] = Date.now() - t3;
    for (const al of await p.evaluate(`[...document.querySelectorAll('.q-dialog, [role=alert], [role=alertdialog], .q-banner, .q-notification')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as string[]) if (!(al in seen)) seen[al] = Date.now() - t3;
    if (Date.now() - t3 > 1400 && !o.shot1) { o.shot1 = true; await shotC('XTVINV-after-undo-1s'); }
    await p.waitForTimeout(150); }
  o.messages = seen; o.grpNoRefresh = await grpOf(set, 'W1'); await go('Tech View', set.q); o.grpAfterRefresh = await grpOf(set, 'W1'); o.lead = await leadName(set.w.W1.id);
});
await run('X-TV-TIME', async (o) => {
  const A1 = await T('XTVTIME', 'Ana'), B1 = await T('XTVTIME', 'Ben'); const set = await mkSet('ZZAUTOTEST XTVTIME Toast', [{ co: 'W1', lead: A1 }, { co: 'W2', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Tech View', set.q);
  await openLeadAction(row(set, 'W1')); await pickInDialog(/XTVTIME Ben/); const t1 = Date.now(); await shiftPrompt(p, 'Keep shifts'); await p.mouse.move(800, 700);
  o.s1 = await waitToast(); o.goneAfterMs = await watchGone(p, 15000); o.sinceChange = Date.now() - t1;
  await openLeadAction(row(set, 'W2')); await pickInDialog(/XTVTIME Ben/); await shiftPrompt(p, 'Keep shifts'); o.s3 = await waitToast();
  if (o.s3.toasts[0]) { const b = o.s3.toasts[0].box; await p.mouse.move(b[0] + b[2] / 2, b[1] + b[3] / 2); await p.waitForTimeout(15000); o.heldWhileHovered = (await toastRead()).length > 0; await shotC('XTVTIME-hovered-15s'); }
  o.undo = await clickUndo(); const t2 = Date.now(); await p.mouse.move(800, 700); o.undone = await waitToast(p, 3000); await shotC('XTVTIME-undone'); o.undoneGoneAfterMs = await watchGone(p, 10000); o.sinceUndo = Date.now() - t2;
  await p.waitForTimeout(1500); o.grpW2 = await grpOf(set, 'W2');
});
await run('X-TV-ORDER', async (o) => {
  const A1 = await T('XTVORD', 'Ana'), B1 = await T('XTVORD', 'Ben'); const set = await mkSet('ZZAUTOTEST XTVORD Place', [{ co: 'W1', lead: A1 }, { co: 'W2', lead: A1 }, { co: 'W3', lead: A1 }]); o.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go('Tech View', set.q); const nm = nameOf(set);
  const order = async () => ((await groups(p)).find((g: any) => /XTVORD Ana/.test(g.name ?? ''))?.rows ?? []).map(nm);
  o.before = await order(); await openLeadAction(row(set, 'W2')); await pickInDialog(/XTVORD Ben/); await shiftPrompt(p, 'Keep shifts'); o.toast = await waitToast();
  o.during = await order(); o.undo = await clickUndo(); await p.waitForTimeout(2500); o.afterUndo = await order(); await shotC('XTVORD-after-undo');
  await go('Tech View', set.q); o.afterRefresh = await order();
});


/** after Undo: every message on screen, read every 100 ms for 4 s, with its buttons — the "Assignment undone" line (S4-R32) */
const watchAfterUndo = async (tag: string) => { const t0 = Date.now(); const seen: any[] = []; let shot = false;
  while (Date.now() - t0 < 4000) { for (const x of await toastRead(p)) { const key = `${x.text}|${x.buttons.join('/')}`; if (!seen.find((s) => s.key === key)) seen.push({ key, text: x.text, buttons: x.buttons, at: Date.now() - t0 }); if (/Assignment undone/i.test(x.text) && !shot) { shot = true; await shotC(`${tag}-assignment-undone`); } }
    await p.waitForTimeout(100); } return seen; };
const auditOf = async (woId: string, tag: string) => { await p.goto(APP + `/workorders/${woId}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  if (await p.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await p.keyboard.press('Escape');
  const mv = await p.evaluate(`(() => { const b = [...document.querySelectorAll('button')].filter(x => /more_vert/.test(x.innerText) || x.querySelector('i')?.textContent?.trim() === 'more_vert').map(x => x.getBoundingClientRect()).filter(r => r.width > 0 && r.top < 200).sort((a, b) => b.right - a.right); return b[0] ? { x: b[0].x + b[0].width / 2, y: b[0].y + b[0].height / 2 } : null; })()`) as any;
  if (mv) await p.mouse.click(mv.x, mv.y); await p.waitForTimeout(1000);
  await p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first().click().catch(() => {}); await p.waitForTimeout(3000);
  const txt = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => e.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').slice(0, 900) : null; })()`); await shotC(tag); await p.keyboard.press('Escape'); return txt; };
await run('X-UNDONE', async (o) => { for (const view of ['Board View', 'Tech View'] as const) { const k = view === 'Board View' ? 'BV' : 'TV'; const r: any = (o[k] = {});
  const A1 = await T(`XUD${k}`, 'Ana'), B1 = await T(`XUD${k}`, 'Ben'); const set = await mkSet(`ZZAUTOTEST XUD${k} Undone`, [{ co: 'W1', lead: A1 }]); r.data = set.w;
  await pins([A1.staff_id, B1.staff_id]); await go(view, set.q);
  if (view === 'Board View') await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); else { await openLeadAction(row(set, 'W1')); await pickInDialog(new RegExp(`XUD${k} Ben`)); }
  await shiftPrompt(p, 'Keep shifts'); r.s1 = await waitToast(); r.undo = await clickUndo(); r.after = await watchAfterUndo(`XUD${k}`); await p.waitForTimeout(1000);
  r.where = view === 'Board View' ? await colOf(set, 'W1') : await grpOf(set, 'W1'); } });
await run('X-TV-LINES', async (o) => { // C847734 in Tech View + the audit entry of a Tech View Undo
  const A1 = await T('XTVL', 'Ana'), B1 = await T('XTVL', 'Ben');
  const n = `ZZAUTOTEST XTVL Undo Lines ${RUNNO}`; const c = await customer(a, n, 'ZZUNDL'); const wo = await workOrder(a, c, 'approved', null);
  const L: Record<string, string> = {};
  const l1 = await mkLine(wo, 1); L[l1] = 'Line 1 Unassigned';
  const l2 = await mkLine(wo, 2); L[l2] = 'Line 2 Explicit'; o.l2set = (await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [B1.staff_id] })).status;
  const l3 = await mkLine(wo, 3); L[l3] = 'Line 3 Complete'; o.l3complete = await completeLine(wo, l3);
  const num = (await workOrders(a, n))[0].number; o.wo = num; o.before = await lineTechs(wo, L);
  await pins([A1.staff_id, B1.staff_id]); await go('Tech View', n);
  o.menu = await openLeadAction(`[data-test-id="tech_view_row_${wo}"]`); await pickInDialog(/XTVL Ana/); o.prompt = await shiftPrompt(p, 'Keep shifts'); o.toast = await waitToast();
  o.afterChange = await lineTechs(wo, L); o.undo = await clickUndo(); o.afterUndoMsgs = await watchAfterUndo('XTVL'); await p.waitForTimeout(1500);
  o.group = (await groups(p)).find((g: any) => (g.rows ?? []).includes(num))?.name ?? null; o.afterUndo = await lineTechs(wo, L); o.page = await pageLabor(wo, 'XTVL-lines-after-undo');
  o.restored = JSON.stringify(o.before) === JSON.stringify(o.afterUndo); o.audit = await auditOf(wo, 'XTVL-audit-log');
});
await run('X-NETFAIL', async (o) => { // "If Undo can't be saved, nothing changes and the alert … shows" — the save itself refused (server error), not the invoiced rule
  for (const view of ['Board View', 'Tech View'] as const) { const k = view === 'Board View' ? 'BV' : 'TV'; const r: any = (o[k] = {});
    const A1 = await T(`XNF${k}`, 'Ana'), B1 = await T(`XNF${k}`, 'Ben'); const set = await mkSet(`ZZAUTOTEST XNF${k} Undo Fail`, [{ co: 'W1', lead: A1 }]); r.data = set.w;
    await pins([A1.staff_id, B1.staff_id]); await go(view, set.q);
    if (view === 'Board View') await dragTo(card(set, 'W1'), `[data-test-id="board_column_${B1.staff_id}"]`, 'x'); else { await openLeadAction(row(set, 'W1')); await pickInDialog(new RegExp(`XNF${k} Ben`)); }
    await shiftPrompt(p, 'Keep shifts'); r.s1 = await waitToast(); const hit: string[] = [];
    await p.route('**/api/**', (rt) => { const m = rt.request().method(); if (m === 'GET') return rt.continue(); hit.push(`${m} ${new URL(rt.request().url()).pathname}`); return rt.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"ZZAUTOTEST forced failure"}' }); });
    r.undo = await clickUndo(); const t0 = Date.now(); const seen: Record<string, number> = {};
    while (Date.now() - t0 < 6000) { for (const x of await toastRead(p)) if (!(x.text in seen)) seen[x.text] = Date.now() - t0;
      for (const al of await p.evaluate(`[...document.querySelectorAll('.q-dialog, [role=alert], [role=alertdialog], .q-banner, .q-notification')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as string[]) if (!(al in seen)) seen[al] = Date.now() - t0;
      if (Date.now() - t0 > 1200 && !r.shot) { r.shot = true; await shotC(`XNF${k}-alert`); } await p.waitForTimeout(150); }
    await p.unroute('**/api/**'); r.blocked = hit; r.messages = seen; r.lead = await leadName(set.w.W1.id);
    await go(view, set.q); r.whereAfterRefresh = view === 'Board View' ? await colOf(set, 'W1') : await grpOf(set, 'W1'); }
});
await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'sv11567-retest-1029.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
