/** parked-prod-1102.mts — 2 Nov 2026, PRODUCTION v26.43.5 (app.shopview.com, a dummy environment: Rule 107). QA lead 2 Nov: "smartly check all
 *  the test cases of Work Order board and Tech view … specially those which were blocked/retest or failed against the tickets which were
 *  being fixed, and … update the test cases … make sure that the tests remain runnable". The 24 parked tests whose tickets (SV-11524,
 *  SV-11545, SV-11567, SV-11902, SV-11582, SV-11416 …) are now Done, each walked by its CURRENT TestRail steps (read live 2 Nov,
 *  update-pass-2026-11-02/parked-live-2026-11-02.json) with fresh ZZAUTOTEST data per test. The old scripts died on the removed
 *  "Reassign" confirm button and the removed "Unassigned" dialog row (SV-11524 shipped: clicking a technician applies the change).
 *  Toasts are read with the generic reader (the design's toast is not a .q-notification). Example names in the cases ("Esther Howard",
 *  "Ralph Edwards") are placeholders here: each test's own ZZAUTOTEST technicians stand in for them, and the wording is judged with that name.
 *  Helper preamble = sv11902-declined-1029.mts lines 18-213 (unchanged). Records only; judging is done afterwards against the Expected text.
 *  Output EV/parked-prod-1102.json + EV/<Cid>-*.png. ONLY=<Cid,…> limits the run. */
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
const RUN = await asRunner(browser, p0, api(p0)); let p = RUN.p; // 2 Nov: `let` so C96973 can look through another person's page
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


const tips = () => p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const status = async (id: string) => (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order?.status;
const lineSet = async (wo: string, l: string, st: string) => say(await a.post('/api/work-orders/lines/change-status', { line_id: l, status: st, workOrderId: wo }));
/** a Declined work order: its only line declined (PRD v82 S4-N2: Declined only while every line is declined); read back */
async function declineAll(wo: string, log: any[]) {
  for (const l of await linesRaw(wo)) log.push(`line declined ${await lineSet(wo, l.line_id, 'authorization_declined')}`);
  if ((await status(wo)) !== 'declined') log.push(`wo declined ${say(await a.post('/api/work-orders/change-status', { id: wo, status: 'declined' }))}`);
  log.push(`status now ${await status(wo)}`);
}
/** hold a drag over the target, read what the page says there (the S4-N6 note), picture it, then drop */
async function dragHold(fromSel: string, toSel: string, tag: string) {
  await p.locator(fromSel).first().scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(300);
  const a1 = await p.locator(fromSel).first().boundingBox(), b1 = await p.locator(toSel).first().boundingBox(); if (!a1 || !b1) return { drag: 'missing ' + (!a1 ? 'from' : 'to') };
  const before = await p.evaluate(`document.body.innerText`) as string;
  const gx = a1.x + a1.width * 0.45; await p.mouse.move(gx, a1.y + a1.height / 2); await p.mouse.down(); await p.mouse.move(gx, a1.y + a1.height / 2 + 8, { steps: 4 });
  await p.mouse.move(b1.x + b1.width / 2, b1.y + Math.min(60, b1.height / 2), { steps: 20 }); await p.waitForTimeout(900);
  const during = await p.evaluate(`document.body.innerText`) as string; await shotC(`${tag}-over-target`);
  const newText = during.split('\n').map((s) => s.trim()).filter((s) => s && !before.includes(s)).slice(0, 8);
  const noteEls = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /can.t be reassigned/i.test(e.textContent) && e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); return { text: e.textContent.trim(), x: Math.round(r.x), y: Math.round(r.y) }; })`);
  await p.mouse.up(); await p.waitForTimeout(2500); return { drag: 'done', newText, noteEls };
}
const T2 = async (key: string) => ({ A: await T(key, 'Ana'), B: await T(key, 'Ben') });
/** set: D1 Declined (A) · D2 Declined unassigned · D3 Approved (A) · D4 Complete (A) · D5 Approved (A) with one approved + one declined line ·
 *  D6 Declined (A), later given a new line · D7 Approved (A) for Undo */
async function mk1902(key: string, A: any) {
  const set = await mkSet(`ZZAUTOTEST ${key} Declined`, [{ co: 'D1', lead: A }, { co: 'D2', lead: null }, { co: 'D3', lead: A }, { co: 'D4', lead: A, status: 'complete' }, { co: 'D5', lead: A }, { co: 'D6', lead: A }, { co: 'D7', lead: A }]);
  const log: any[] = set.log;
  for (const k of ['D1', 'D2', 'D6']) { log.push(k); await declineAll(set.w[k].id, log); }
  const l2 = await mkLine(set.w.D5.id, 2); log.push(`D5 second line declined ${await lineSet(set.w.D5.id, l2, 'authorization_declined')}`);
  const st: any = {}; for (const k of Object.keys(set.w)) st[k] = await status(set.w[k].id); return { set, st, log };
}

// ───────────────────────── 2 Nov 2026 additions ─────────────────────────
import { findRow, woPageLead, pickLeadTyped } from './wob.mts';
import { LETH, ensureEligible } from './staff.mts';
import { RUNNER_EMAIL } from './runner.mts';
const ROLES = await roleIds(a);
{ const { ORG } = await import('./profile.mts'); const orgRoles = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) as any[];
  for (const r of orgRoles) { const l = r.label ?? r.name; if (l && !ROLES[l]) ROLES[l] = r.id; } R.roleLabels = Object.keys(ROLES); }
const WPS = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/workplaces')).body?.data) as any[];
const LTZ = (WPS.find((w: any) => w.id === HEAVY) ?? {}).timezone ?? process.env.WOB_LOC_TZ ?? 'Asia/Karachi'; R.locationTimezone = LTZ;
const lDate = (off = 0) => new Intl.DateTimeFormat('en-CA', { timeZone: LTZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Date.now() + off * 86400000));
const lTime = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: LTZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
const mkShift2 = async (wo: string, staff: string, day: number, start: string, minutes: number, lineIds: string[] = []) => { const r = await a.post('/api/schedule/shifts', { workOrderId: wo, lineIds, staffId: staff, startDate: lDate(day), startTime: start, spreadMode: 'single', totalMinutes: minutes, perDayMinutes: minutes, isAllDay: false }); return `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 160) : ''}`; };
const shifts2 = async (wo: string, names: Record<string, string>) => { const from = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z', to = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const body = (await a.get(`/api/schedule/board?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)).body; const out: any[] = []; const seen = new Set<string>();
  const walk = (x: any) => { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(walk); if (x.startsAt && x.endsAt && x.workOrder?.id === wo && !seen.has(x.id)) { seen.add(x.id); out.push(x); } for (const v of Object.values(x)) walk(v); }; walk(body);
  return out.map((s) => `${names[s.staffId] ?? String(s.staffId).slice(0, 6)} ${new Intl.DateTimeFormat('en-CA', { timeZone: LTZ }).format(new Date(s.startsAt))} ${lTime(new Date(s.startsAt))}-${lTime(new Date(s.endsAt))} ${(s.lines?.length || s.lineIds?.length) ? 'lines' : 'whole'}`).sort(); };
const mkLineS = async (wo: string, i: number, status: string) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status })).body?.data?.line_id as string;
const firstLine = async (wo: string) => (await linesRaw(wo))[0]?.line_id as string;
const BV = (id: string) => `[data-test-id="board_column_${id}"]`, TV = (id: string) => `[data-test-id="tech_view_group_${id}"]`;
const nmT = (x: any) => `${x.first_name} ${x.last_name}`;
/** the "Clear …'s scheduled shifts?" question: wait up to 1.6 s for it, read title/text/buttons */
const PROMPT_SRC = `(() => { const d = [...document.querySelectorAll('.q-dialog')].filter(e => /scheduled shifts/i.test(e.innerText) && e.getBoundingClientRect().width > 0).pop(); if (!d) return null;
    const t = d.querySelector('.text-h6, [class*=title], h1, h2, h3'); return { title: t ? t.innerText.replace(/\\s+/g, ' ').trim() : null, text: d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 600), buttons: [...d.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.innerText || b.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim()) }; })()`;
// 2 Nov: the first read caught the question mid fade-in (no buttons drawn yet, C154889) — once seen, wait 900 ms and read again
const promptRead = async () => { for (let i = 0; i < 8; i++) { const r = await p.evaluate(PROMPT_SRC); if (r) { await p.waitForTimeout(900); return ((await p.evaluate(PROMPT_SRC)) ?? r) as any; } await p.waitForTimeout(200); } return null; };
const answer = async (how: 'Keep shifts' | 'Clear shifts' | 'Cancel' | 'X' | 'Escape') => { const d = p.locator('.q-dialog').filter({ hasText: /scheduled shifts/i }).last(); if (!(await d.count())) return 'no question';
  if (how === 'Escape') await p.keyboard.press('Escape');
  else if (how === 'X') { const x = d.locator('button[aria-label*="lose" i], button:has(i:text-is("close")), .q-btn:has-text("close")').first(); if (await x.count()) await x.click(); else return 'no X button'; }
  else await d.locator('button').filter({ hasText: new RegExp('^\\s*' + how + '\\s*$', 'i') }).first().click();
  await p.waitForTimeout(1800); return `${how}; question still open: ${await d.count()}`; };
/** after a drop / pick / Unassign: read the question (answer it), the message, and how long the message stays */
async function after(tag: string, how: 'Keep shifts' | 'Clear shifts' | 'Cancel' | 'X' | 'Escape' = 'Keep shifts', timing = false) {
  const t0 = Date.now(); await p.mouse.move(3, 3); const q = await promptRead(); let answered = null; if (q) { await shotC(`${tag}-question`); answered = await answer(how); }
  const w = await waitToast(p, 4000); if (w.toasts.length) await shotC(`${tag}-message`);
  const o: any = { question: q, answered, message: w.toasts.map((x: any) => ({ text: x.text, buttons: x.buttons, bg: x.bg, box: x.box })), messageAfterMs: w.afterMs === null ? null : Date.now() - t0 };
  if (timing && w.toasts.length) { const g = await watchGone(p, 12000); o.messageGoneAfterMs = g === null ? 'still open after 12 s' : Date.now() - t0; }
  return o; }
/** watch the bottom of the page for any lead-change message for ms (positive control: the same reader sees the real ones) */
const noMessage = async (ms = 10000) => { const t0 = Date.now(); const seen: string[] = []; while (Date.now() - t0 < ms) { for (const x of await toastRead(p)) if (!seen.includes(x.text)) seen.push(x.text); await p.waitForTimeout(250); } return seen; };
const pinIds = async (xs: any[]) => { await pins(xs.map((x) => x.staff_id)); };
const hist = async (wo: string) => ((await a.get(`/api/work-orders/${wo}/history`)).body?.data?.history ?? []).map((h: any) => h.eventName);
const unassignVia = async (hostSel: string) => { const items = await menuOf(hostSel); const it = p.locator('.q-menu .q-item').filter({ hasText: /^\s*Unassign/ }).first(); if (!(await it.count())) { await p.keyboard.press('Escape'); return { menu: items, clicked: false }; } await it.click(); return { menu: items, clicked: true }; };
const dlgCancel = async () => { const d = p.locator('.q-dialog').filter({ hasText: /lead technician/i }).last(); const c = d.locator('button').filter({ hasText: /^\s*Cancel\s*$/i }).first(); if (await c.count()) await c.click(); else await p.keyboard.press('Escape'); await p.waitForTimeout(900); return dialogsOpen(); };
const dlgType = async (txt: string) => { const inp = p.locator('.q-dialog').last().locator('input').first(); if (await inp.count()) { await inp.fill(txt); await p.waitForTimeout(1500); } return leadDialog(); };
const tvRow = async (set: any, co: string, grpId?: string) => { await findRow(p, set.w[co].id, grpId); return row(set, co); };
const orderBV = async (set: any, id: string) => ((await boardCols(p)).find((c) => c.id === id)?.cards ?? []).map(nameOf(set));
const orderTV = async (set: any, id: string) => ((await groups(p)).find((g: any) => g.id === id)?.rows ?? []).map(nameOf(set));
const save = () => fs.writeFileSync(path.join(EV, 'parked-prod-1102.json'), JSON.stringify(R, null, 1));
R.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
R.start = new Date().toISOString(); console.log(t(), 'START', JSON.stringify({ build: R.build, ltz: LTZ, runner: R.runner }));

// ═════ C96956 — the dialog lists only eligible technicians, no Unassigned ═════
await run('C96956', async (o) => { const K = 'P2C96956';
  const A = await T(K, 'Ana'), B = await T(K, 'Ben'), C = await T(K, 'Cal'); const DI = await T(K, 'Ivan');
  const OFF = (await person(a, `ZZAUTOTEST ${K} Owen`, 'Office', { role: ROLES['Office User'] ?? Object.entries(ROLES).find(([l]) => /office user/i.test(l))?.[1] ?? TECH_ROLE, email: `zz.wob.p2c96956.owen2${D}`, clockable: true })).row;
  const LE = (await person(a, `ZZAUTOTEST ${K} Lena`, 'Otherloc', { role: TECH_ROLE, email: `zz.wob.p2c96956.lena${D}`, clockable: true, workplace: LETH })).row;
  if (DI?.is_active) o.deactivateIvan = (await a.post('/api/iam/change-status', { id: DI.id })).status;
  o.setup = { officeRole: Object.keys(ROLES).filter((l) => /office/i.test(l)), owenRole: OFF?.role_label, lenaWorkplace: LE?.workplace_id === LETH ? 'other location only' : LE?.workplace_id, ivanActive: (await staffRows(a, `zz.wob.${K.toLowerCase()}.ivan${D}`))[0]?.is_active };
  const s = await mkSet(`ZZAUTOTEST ${K} List`, [{ co: 'W1', lead: A }]); o.wo = s.w.W1.number; await pinIds([A, B, C]); await go('Board View', s.q);
  const m = await openLeadAction(card(s, 'W1')); o.s3_menu = m.menu.map((x: any) => x.text); o.s4_clicked = m.clicked; const full = await leadDialog(); o.s4_title = full?.title; o.s5_full = { search: full?.search, nItems: full?.nItems, hasUnassignedRow: full?.hasUnassignedRow, buttons: full?.buttons, first5: full?.items.slice(0, 5) }; await shotC('C96956-s5-dialog');
  const f = await dlgType(K); o.s5_filtered = f?.items; o.s5_optionIds = await p.evaluate(`[...document.querySelectorAll('[data-test-id^="option_lead_technician_"]')].filter(e => /${K}/.test(e.innerText)).map(e => e.getAttribute('data-test-id').replace('option_lead_technician_', '').slice(0, 8) + ' ' + e.innerText.replace(/\\s+/g, ' ').trim())`);
  const OLD = (await staffRows(a, `zz.wob.p2c96956.owen${D}`)).find((x: any) => x.email === `zz.wob.p2c96956.owen${D}`); o.owens = { officeUser: `${OFF?.staff_id?.slice(0, 8)} ${OFF?.role_label} clock ${OFF?.clockable}`, technicianNamedOwen: OLD ? `${OLD.staff_id?.slice(0, 8)} ${OLD.role_label} active ${OLD.is_active}` : 'none' }; await shotC('C96956-s5-dialog-filtered'); await dlgType('');
  await pickInDialog(new RegExp(`${K} Ben`)); o.s6 = await after('C96956-s6', 'Keep shifts'); o.s6.dialogsLeft = await dialogsOpen(); o.s6.column = await colOf(s, 'W1');
  const u = await unassignVia(card(s, 'W1')); o.s8_menu = u.menu.map((x: any) => x.text); o.s9 = await after('C96956-s9'); o.s9.column = await colOf(s, 'W1');
  const m2 = await openLeadAction(card(s, 'W1')); o.s11_menu = m2.menu.map((x: any) => x.text); o.s11_title = (await leadDialog())?.title; await shotC('C96956-s11-assign-dialog');
  o.s12_typed = (await dlgType(`ZZAUTOTEST ${K} Cal`))?.items; await shotC('C96956-s12-typed'); o.s12_dialogsAfterCancel = await dlgCancel(); o.s12_messages = await noMessage(3000); o.s12_column = await colOf(s, 'W1');
  o.s13_lead = await leadName(s.w.W1.id); o.s13_page = await woPageLead(p, APP, s.w.W1.id);
  await go('Tech View', s.q); await tvRow(s, 'W1', 'unassigned'); o.s15_group = await grpOf(s, 'W1');
  const m3 = await openLeadAction(row(s, 'W1')); o.s15_menu = m3.menu.map((x: any) => x.text); const d3 = await leadDialog(); o.s16 = { title: d3?.title, nItems: d3?.nItems, hasUnassignedRow: d3?.hasUnassignedRow, buttons: d3?.buttons }; o.s16_filtered = (await dlgType(K))?.items; await shotC('C96956-s16-tech-dialog'); await dlgType('');
  await pickInDialog(new RegExp(`${K} Ana`)); o.s17 = await after('C96956-s17'); o.s17.dialogsLeft = await dialogsOpen(); await tvRow(s, 'W1', A.staff_id); o.s17.group = await grpOf(s, 'W1'); await shotC('C96956-s17-tech-in-ana');
  o.names = { A: nmT(A), B: nmT(B), C: nmT(C), Owen: nmT(OFF), Ivan: nmT(DI), Lena: nmT(LE) };
});
save();

// ═════ C96957 — lead change messages name the work order and close on their own ═════
await run('C96957', async (o) => { const K = 'P2C96957'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Lead Messages`, [{ co: 'W1', lead: A }]); o.wo = s.w.W1.number; o.names = { A: nmT(A), B: nmT(B) }; await pinIds([A, B]); await go('Board View', s.q);
  await dragTo(card(s, 'W1'), BV(B.staff_id), 'x'); o.s3_5 = await after('C96957-s5', 'Keep shifts', true); o.s3_5.column = await colOf(s, 'W1');
  await dragTo(card(s, 'W1'), BV('unassigned'), 'x'); o.s7_9 = await after('C96957-s9', 'Keep shifts', true); o.s7_9.column = await colOf(s, 'W1');
});
save();

// ═════ C96969 — choosing the current lead again changes nothing ═════
await run('C96969', async (o) => { const K = 'P2C96969'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Same Lead Again`, [{ co: 'W1', lead: A }]); const w = s.w.W1.id; const L: Record<string, string> = { [await firstLine(w)]: 'Line 1' };
  L[await mkLine(w, 2)] = 'Line 2'; o.wo = s.w.W1.number; o.names = { A: nmT(A) };
  o.before = { lead: await leadName(w), lines: await lineTechs(w, L), history: await hist(w) }; await pinIds([A, B]); await go('Board View', s.q);
  const m = await openLeadAction(card(s, 'W1')); o.s3_menu = m.menu.map((x: any) => x.text); const d = await leadDialog(); o.s3_currentRow = (d?.items ?? []).filter((x: string) => x.includes(`${K} Ana`)); await shotC('C96969-s3-dialog');
  await pickInDialog(new RegExp(`${K} Ana`)); await p.mouse.move(3, 3); o.s4_dialogsLeft = await dialogsOpen(); await p.waitForTimeout(1500); o.s4_dialogsAfter1500 = await dialogsOpen(); o.s4_question = await promptRead(); o.s5_messages = await noMessage(10000); await shotC('C96969-s5-no-message');
  o.after = { lead: await leadName(w), lines: await lineTechs(w, L), history: await hist(w), page: await pageLabor(w, 'C96969-s6-lines') };
});
save();

// ═════ C96973 — Reassign can pick a technician outside the filter, the card then leaves ═════
// 2 Nov: changing the SIGNED-IN runner's own staff record ends the whole session (401 session_expired for every later call, first run 17:03).
// So "you" here is a separate Admin who is also an eligible technician, looked through with viewAs; the runner is never edited.
await run('C96973', async (o) => { const K = 'P2C96973'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const ADMIN = ROLES['Admin'] ?? Object.entries(ROLES).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];
  const me = (await person(a, `ZZAUTOTEST ${K} Me`, 'Admintech', { role: ADMIN, email: `zz.wob.p2c96973.me${D}`, clockable: true })).row; o.eligibleMe = await ensureEligible(a, me, 'you');
  const s = await mkSet(`ZZAUTOTEST ${K} Outside Filter`, [{ co: 'W1', lead: me }]); const w = s.w.W1.id; o.wo = s.w.W1.number; o.you = nmT(me);
  o.setup = { advisor: say(await a.post('/api/work-orders/change-service-advisor', { work_order_id: w, service_advisor_id: A.staff_id })), lead: await leadName(w) };
  const keep = p; const v = await viewAs(browser, p, a, me.id, '', RUN.toRunner); p = v.page; p.setDefaultTimeout(30_000);
  try { await pins([]); await go('Board View', ''); const chip = p.locator('[data-test-id="filter_chip_assigned_to_me"]').first(); const on = () => chip.evaluate((e) => e.getAttribute('aria-pressed') ?? (/(selected|active|bg-primary|text-primary)/.test(e.className) ? 'true' : 'false')).catch(() => null);
    if ((await on()) !== 'true') { await chip.click(); await p.waitForTimeout(2500); } o.s1 = await on(); await search(p, s.q); await p.evaluate('window.__zzNoReload = 1');
    o.s3 = (await boardCols(p)).map((c) => `${c.name}(${c.count})`); await shotC('C96973-s3-columns');
    await openLeadAction(card(s, 'W1')); const d = await leadDialog(); o.s4_title = d?.title; o.s5 = { buttons: d?.buttons, filtered: (await dlgType(K))?.items }; await shotC('C96973-s5-dialog');
    await pickInDialog(new RegExp(`${K} Ana`)); o.s6 = await after('C96973-s6'); await p.waitForTimeout(1500); o.s6.dialogsLeft = await dialogsOpen(); await p.waitForTimeout(1000);
    const txt = await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ')`) as string;
    o.s7 = { noReload: await p.evaluate('window.__zzNoReload === 1'), columns: (await boardCols(p)).map((c) => `${c.name}(${c.count})`), cardOnBoard: await p.locator(card(s, 'W1')).count(), noMatch: /No work orders match these filters/.test(txt), hint: /Try removing a filter to widen your results\./.test(txt),
      clearAll: await p.locator('button, .q-btn').filter({ hasText: /Clear all filters/i }).count(), lead: await leadName(w) }; await shotC('C96973-s7-empty-state');
    if ((await on()) === 'true') { await chip.click(); await p.waitForTimeout(1500); }
  } finally { p = keep; await v.close(); }
});
save();

// ═════ C154889 — removing the lead asks the same clear-shifts question ═════
await run('C154889', async (o) => { const K = 'P2C154889'; const A = await T(K, 'Ana');
  const s = await mkSet(`ZZAUTOTEST ${K} Remove Lead Prompt`, [{ co: 'W1', lead: A }, { co: 'W2', lead: A }]); o.names = { A: nmT(A) }; o.wo = [s.w.W1.number, s.w.W2.number];
  const nm = { [A.staff_id]: 'A' }; o.shifts = [await mkShift2(s.w.W1.id, A.staff_id, 1, '08:00', 240), await mkShift2(s.w.W2.id, A.staff_id, 1, '08:00', 240)]; o.before = [await shifts2(s.w.W1.id, nm), await shifts2(s.w.W2.id, nm)];
  await pinIds([A]); await go('Board View', s.q);
  await dragTo(card(s, 'W1'), BV('unassigned'), 'x'); o.s3_4 = await after('C154889-s4', 'Keep shifts'); o.s3_4.column = await colOf(s, 'W1');
  const u = await unassignVia(card(s, 'W2')); o.s5_menu = u.menu.map((x: any) => x.text); o.s5_6 = await after('C154889-s6', 'Keep shifts'); o.s5_6.column = await colOf(s, 'W2');
  o.after = [await shifts2(s.w.W1.id, nm), await shifts2(s.w.W2.id, nm)];
});
save();

// ═════ C368133 — the clear-shifts question only for the old lead's unfinished shifts ═════
await run('C368133', async (o) => { const K = 'P2C368133'; const A = await T(K, 'Ana'), B = await T(K, 'Ben'), C = await T(K, 'Cal');
  const s = await mkSet(`ZZAUTOTEST ${K} Prompt Only Unfinished`, [1, 2, 3, 4, 5, 6].map((i) => ({ co: `W${i}`, lead: A })).concat([{ co: 'W7', lead: B }]));
  const L1: Record<string, string> = {}; for (const k of Object.keys(s.w)) { L1[k] = await firstLine(s.w[k].id); await mkLine(s.w[k].id, 2); }
  const nm = { [A.staff_id]: 'A', [B.staff_id]: 'B', [C.staff_id]: 'C' };
  o.shifts = { W1: await mkShift2(s.w.W1.id, A.staff_id, 1, '08:00', 240), W3: await mkShift2(s.w.W3.id, A.staff_id, 1, '08:00', 240, [L1.W3]), W4: await mkShift2(s.w.W4.id, A.staff_id, -1, '08:00', 240), W5: await mkShift2(s.w.W5.id, C.staff_id, 1, '08:00', 240), W7: await mkShift2(s.w.W7.id, A.staff_id, 1, '13:00', 120) };
  o.setup = {}; for (const k of Object.keys(s.w)) o.setup[`${k} ${s.w[k].number}`] = await shifts2(s.w[k].id, nm);
  await pinIds([A, B]); await go('Board View', s.q);
  for (const k of ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']) { await dragTo(card(s, k), BV(B.staff_id), 'x'); o[k] = await after(`C368133-${k}`, 'Keep shifts'); o[k].column = await colOf(s, k); }
  o.questionsFor = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].filter((k) => o[k].question);
});
save();

// ═════ C368135 — Cancel / X / Escape on the question call the change off ═════
await run('C368135', async (o) => { const K = 'P2C368135'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Prompt Cancel`, [{ co: 'W1', lead: A }]); const w = s.w.W1.id; const nm = { [A.staff_id]: 'A', [B.staff_id]: 'B' };
  o.shift = await mkShift2(w, A.staff_id, 1, '08:00', 240); o.before = await shifts2(w, nm); await pinIds([A, B]);
  for (const view of ['Board View', 'Tech View'] as const) { const k = view === 'Board View' ? 'BV' : 'TV'; await go(view, s.q); const host = async () => (view === 'Board View' ? card(s, 'W1') : await tvRow(s, 'W1', A.staff_id)); const tgt = view === 'Board View' ? BV(B.staff_id) : TV(B.staff_id);
    const where = async () => (view === 'Board View' ? colOf(s, 'W1') : (await tvRow(s, 'W1'), grpOf(s, 'W1')));
    for (const how of ['Cancel', 'X', 'Escape'] as const) { await dragTo(await host(), tgt, 'x'); o[`${k}-${how}`] = await after(`C368135-${k}-${how}`, how); await p.waitForTimeout(1200); o[`${k}-${how}`].where = await where(); o[`${k}-${how}`].lead = await leadName(w); }
    await openLeadAction(await host()); await pickInDialog(new RegExp(`${K} Ben`)); o[`${k}-dialog`] = await after(`C368135-${k}-dialog`, 'Cancel'); o[`${k}-dialog`].leadDialogStillOpen = await dialogsOpen(); o[`${k}-dialog`].dialog = await leadDialog(); await shotC(`C368135-${k}-s8-after-cancel`);
    o[`${k}-dialog`].afterDialogCancel = await dlgCancel(); o[`${k}-dialog`].where = await where(); o[`${k}-dialog`].lead = await leadName(w); }
  o.end = { lead: await leadName(w), shifts: await shifts2(w, nm), page: await woPageLead(p, APP, w) };
  o.outsideClick = 'not run (the case says an outside click leaves the question open; covered by its note only)';
});
save();

// ═════ C368136 — the question shows on Board and Tech View only ═════
await run('C368136', async (o) => { const K = 'P2C368136'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Prompt Where`, [{ co: 'W1', lead: A }]); const w = s.w.W1.id; const nm = { [A.staff_id]: 'A', [B.staff_id]: 'B' };
  o.shift = await mkShift2(w, A.staff_id, 1, '08:00', 240); o.before = await shifts2(w, nm); await pinIds([A, B]);
  for (const view of ['Board View', 'Tech View'] as const) { const k = view === 'Board View' ? 'BV' : 'TV'; await go(view, s.q); const host = async (g?: string) => (view === 'Board View' ? card(s, 'W1') : await tvRow(s, 'W1', g)); const tgt = (id: string) => (view === 'Board View' ? BV(id) : TV(id));
    await dragTo(await host(A.staff_id), tgt(B.staff_id), 'x'); o[`${k}-drag`] = await after(`C368136-${k}-drag`);
    await dragTo(await host(B.staff_id), tgt(A.staff_id), 'x'); o[`${k}-dragBack`] = await after(`C368136-${k}-dragBack`);
    await openLeadAction(await host(A.staff_id)); await pickInDialog(new RegExp(`${K} Ben`)); o[`${k}-dialog`] = await after(`C368136-${k}-dialog`);
    await openLeadAction(await host(B.staff_id)); await pickInDialog(new RegExp(`${K} Ana`)); o[`${k}-dialogBack`] = await after(`C368136-${k}-dialogBack`);
    await unassignVia(await host(A.staff_id)); o[`${k}-unassign`] = await after(`C368136-${k}-unassign`);
    await dragTo(await host('unassigned'), tgt(A.staff_id), 'x'); o[`${k}-fromUnassigned`] = await after(`C368136-${k}-fromUnassigned`); o[`${k}-lead`] = await leadName(w); }
  o.questionCount = Object.keys(o).filter((x) => /^(BV|TV)-/.test(x) && o[x]?.question).length; o.questionAt = Object.keys(o).filter((x) => /^(BV|TV)-/.test(x) && o[x]?.question);
  const pg = await p.context().newPage(); try { await pg.goto(`${APP}/workorders/${w}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg.keyboard.press('Escape');
    o.s10 = await pickLeadTyped(pg, [nmT(B), 'Ben Ben', `${K} Ben`], nmT(B));
    if (!o.s10.picked) { // 2 Nov: the page's list did not narrow to the new test technician (it shows the first 30 matches); any OTHER technician proves the point "no question on the work order page"
      const sel = pg.locator('[data-test-id="select_lead_technician"]'); await sel.click().catch(() => {}); await pg.waitForTimeout(1500);
      const opt = pg.locator('.q-menu .q-item').filter({ hasNotText: new RegExp(`${K} Ana|Unassigned`) }).first(); o.s10.fallbackName = (await opt.innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/^check /, '').trim();
      if (await opt.count()) { await opt.click(); await pg.waitForTimeout(3000); o.s10.picked = true; o.s10.pickedFallback = true; } } await pg.waitForTimeout(1500); o.s10.question = await pg.evaluate(`[...document.querySelectorAll('.q-dialog')].filter(e => /scheduled shifts/i.test(e.innerText)).length`); await pg.screenshot({ path: path.join(EV, 'C368136-s10-page.png') }).catch(() => {}); o.s10.lead = await leadName(w);
  } finally { await pg.close().catch(() => {}); }
  await go('List', s.q); const lr = p.locator(`[data-test-id="list_row_${w}"], tr:has-text("${s.w.W1.number}")`).first(); o.s11 = { rowFound: await lr.count() };
  if (o.s11.rowFound) { await lr.hover().catch(() => {}); const mb = lr.locator('[data-test-id="button_work_order_more_actions"], button:has(i:text-is("more_vert")), button:has(i:text-is("more_horiz"))').first(); o.s11.moreButton = await mb.count(); if (o.s11.moreButton) { await mb.click().catch(() => {}); await p.waitForTimeout(900); o.s11.menu = (await menuItems(p)).map((x: any) => x.text); await shotC('C368136-s11-list-menu'); await p.keyboard.press('Escape'); } else await shotC('C368136-s11-list-row'); }
  o.s12 = await shifts2(w, nm);
});
save();

// ═════ C368140 — assigning a lead to unassigned work moves only open unassigned lines ═════
await run('C368140', async (o) => { const K = 'P2C368140'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Assign Unassigned Lines`, [{ co: 'W1', lead: null }]); const w = s.w.W1.id; const L: Record<string, string> = { [await firstLine(w)]: 'Line 1' };
  const l2 = await mkLine(w, 2); L[l2] = 'Line 2'; o.explicit = (await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [B.staff_id] })).status; const l3 = await mkLine(w, 3); L[l3] = 'Line 3'; o.complete3 = await completeLine(w, l3);
  o.before = await lineTechs(w, L); o.status = await status(w); o.names = { A: nmT(A), B: nmT(B) }; await pinIds([A, B]); await go('Board View', s.q);
  const m = await openLeadAction(card(s, 'W1')); o.s3_menu = m.menu.map((x: any) => x.text); o.s3_title = (await leadDialog())?.title;
  await pickInDialog(new RegExp(`${K} Ana`)); o.s4 = await after('C368140-s4'); o.s4.column = await colOf(s, 'W1');
  o.s5 = await lineTechs(w, L); o.s5_page = await pageLabor(w, 'C368140-s5-lines');
});
save();

// ═════ C581891 — a line with only a Schedule shift technician follows the new lead ═════
await run('C581891', async (o) => { const K = 'P2C581891'; const A = await T(K, 'Ana'), B = await T(K, 'Ben'), C = await T(K, 'Cal'), Dd = await T(K, 'Dan');
  const s = await mkSet(`ZZAUTOTEST ${K} Shift Line Follows`, [{ co: 'W1', lead: A }]); const w = s.w.W1.id; const l1 = await firstLine(w); const l2 = await mkLine(w, 2); const L = { [l1]: 'Line 1', [l2]: 'Line 2' };
  o.explicit2 = (await a.put(`/api/work-orders/lines/${l2}/technicians`, { staffIds: [C.staff_id] })).status; o.shiftB = await mkShift2(w, B.staff_id, 1, '09:00', 120, [l1]);
  o.before = await lineTechs(w, L); o.names = { A: nmT(A), B: nmT(B), C: nmT(C), D: nmT(Dd) }; await pinIds([A, Dd]); await go('Board View', s.q);
  await openLeadAction(card(s, 'W1')); await pickInDialog(new RegExp(`${K} Dan`)); o.s4 = await after('C581891-s4'); o.s4.column = await colOf(s, 'W1');
  o.s7_12 = await lineTechs(w, L); o.page = await pageLabor(w, 'C581891-s7-lines');
  // steps 8-13: Edit Line on each line, read its Technicians field (the roster chips), close without saving (2 Nov: the first run read only the Labor row)
  const ln = ((await linesRaw(w)) as any[]).map((x) => ({ id: x.line_id, name: x.title ?? x.name ?? x.description ?? '' }));
  const pg = await p.context().newPage(); try { for (const [i, l] of ln.entries()) { await pg.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6500);
      if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg.keyboard.press('Escape');
      const nm = (await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="line_name"], .line-name, td, div')].filter(e => e.children.length === 0 && e.getBoundingClientRect().width > 0 && /\\S/.test(e.innerText || '')).map(e => e.innerText.trim())`) as string[]);
      const lineNames = (await pg.locator('text=/^Line 1$|^New York State Inspection$|^Service - /').allInnerTexts().catch(() => [])) as string[];
      const target = pg.getByText(lineNames[i] ?? (i === 0 ? 'Line 1' : 'New York State Inspection'), { exact: true }).first(); await target.click().catch(() => {}); await pg.waitForTimeout(2500);
      const d = pg.locator('.q-dialog').filter({ hasText: 'Edit Line' }).last();
      o[`s${9 + i * 3}_editLine${i + 1}`] = { name: lineNames[i] ?? null, dialog: await d.count(), technicians: await d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.replace(/\s+/g, ' ').trim())).catch(() => null),
        field: await d.evaluate((e: any) => { const f = [...e.querySelectorAll('.q-field')].find((x: any) => /Technician/i.test(x.innerText)); return f ? f.innerText.replace(/\s+/g, ' ').trim().slice(0, 200) : null; }).catch(() => null) };
      await pg.screenshot({ path: path.join(EV, `C581891-s${9 + i * 3}-edit-line-${i + 1}.png`) }).catch(() => {});
      const c = d.locator('button').filter({ hasText: /^\s*Cancel\s*$/ }).first(); if (await c.count()) await c.click(); else await pg.keyboard.press('Escape'); await pg.waitForTimeout(1200); }
  } finally { await pg.close().catch(() => {}); }
});
save();

// ═════ C581892 — the question ignores lines that are not approved or are declined ═════
await run('C581892', async (o) => { const K = 'P2C581892'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Approved Lines`, [{ co: 'W1', lead: A }, { co: 'W2', lead: A }, { co: 'W3', lead: A }]); const nm = { [A.staff_id]: 'A', [B.staff_id]: 'B' };
  const L1 = await firstLine(s.w.W1.id), L3 = await firstLine(s.w.W2.id), L5 = await firstLine(s.w.W3.id);
  const L2 = await mkLineS(s.w.W1.id, 2, 'authorization_required'), L4 = await mkLineS(s.w.W2.id, 2, 'authorization_declined'), L6 = await mkLineS(s.w.W3.id, 3, 'authorized');
  o.lines = { W1: (await linesRaw(s.w.W1.id)).map((x: any) => x.status ?? x.line_status), W2: (await linesRaw(s.w.W2.id)).map((x: any) => x.status ?? x.line_status), W3: (await linesRaw(s.w.W3.id)).map((x: any) => x.status ?? x.line_status) };
  o.shifts = [await mkShift2(s.w.W1.id, A.staff_id, 1, '08:00', 120, [L1]), await mkShift2(s.w.W2.id, A.staff_id, 1, '10:00', 120, [L3]), await mkShift2(s.w.W3.id, A.staff_id, 1, '13:00', 120, [L5, L6])];
  o.before = { W1: await shifts2(s.w.W1.id, nm), W2: await shifts2(s.w.W2.id, nm), W3: await shifts2(s.w.W3.id, nm), statuses: [await status(s.w.W1.id), await status(s.w.W2.id), await status(s.w.W3.id)], unused: [L2, L4].length };
  await pinIds([A, B]); await go('Board View', s.q);
  for (const k of ['W1', 'W2', 'W3']) { await dragTo(card(s, k), BV(B.staff_id), 'x'); o[k] = await after(`C581892-${k}`, 'Keep shifts'); o[k].column = await colOf(s, k); }
  o.after = { W1: await shifts2(s.w.W1.id, nm), W2: await shifts2(s.w.W2.id, nm), W3: await shifts2(s.w.W3.id, nm) };
});
save();

// ═════ C581893 — an Entire work order shift stops counting once a new line is approved ═════
await run('C581893', async (o) => { const K = 'P2C581893'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Line Added`, [{ co: 'W1', lead: A }, { co: 'W2', lead: A }]); const nm = { [A.staff_id]: 'A', [B.staff_id]: 'B' };
  await mkLine(s.w.W1.id, 2); await mkLine(s.w.W2.id, 2);
  // 2 Nov (L0346): the Schedule's "Entire work order" drop records every line approved AT THAT MOMENT; `lineIds: []` is a different shift
  const approvedIds = async (wo: string) => ((await linesRaw(wo)) as any[]).filter((l) => (l.status ?? l.line_status) === 'authorized').map((l) => l.line_id);
  o.shiftLines = { W1: (await approvedIds(s.w.W1.id)).length, W2: (await approvedIds(s.w.W2.id)).length };
  o.shifts = [await mkShift2(s.w.W1.id, A.staff_id, 1, '08:00', 240, await approvedIds(s.w.W1.id)), await mkShift2(s.w.W2.id, A.staff_id, 1, '13:00', 240, await approvedIds(s.w.W2.id))];
  await p.waitForTimeout(Number(process.env.L5_GAP_MS || 1500)); o.L5gapMs = Number(process.env.L5_GAP_MS || 1500); o.L5 = await mkLineS(s.w.W1.id, 3, 'authorized') ? 'added approved' : 'failed'; o.L6 = await mkLineS(s.w.W2.id, 3, 'authorization_required') ? 'added not approved' : 'failed';
  o.lines = { W1: (await linesRaw(s.w.W1.id)).map((x: any) => x.status ?? x.line_status), W2: (await linesRaw(s.w.W2.id)).map((x: any) => x.status ?? x.line_status) }; o.before = { W1: await shifts2(s.w.W1.id, nm), W2: await shifts2(s.w.W2.id, nm) };
  await pinIds([A, B]); await go('Board View', s.q);
  for (const k of ['W1', 'W2']) { await dragTo(card(s, k), BV(B.staff_id), 'x'); o[k] = await after(`C581893-${k}`, 'Keep shifts'); o[k].column = await colOf(s, k); }
});
save();

// ═════ C96963 + C690642 (same steps) — the lead of a Declined, Invoiced or Paid work order cannot be changed ═════
const lockInfo = async (hostSel: string, tag: string) => { const host = p.locator(hostSel).first(); await host.scrollIntoViewIfNeeded().catch(() => {}); await host.hover().catch(() => {}); await p.waitForTimeout(400);
  const lk = host.locator('[data-test-id="board_card_lock"], [data-test-id="tech_view_row_lock"]').first(); const o: any = { lock: await lk.count() };
  if (o.lock) { o.aria = await lk.getAttribute('aria-label').catch(() => null); await lk.hover().catch(() => {}); await p.waitForTimeout(1200); o.tooltip = await tips(); await shotC(`${tag}-lock-tooltip`); }
  await p.mouse.move(3, 3); await p.waitForTimeout(300); return o; };
await run('C690642', async (o) => { const K = 'P2C690642'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Invoiced Paid Locked`, [{ co: 'W1', lead: A }, { co: 'W2', lead: A, status: 'invoiced' }, { co: 'W3', lead: A, status: 'paid' }, { co: 'W4', lead: null, status: 'invoiced' }, { co: 'W5', lead: A }, { co: 'W6', lead: A, status: 'complete' }]);
  await declineAll(s.w.W5.id, s.log); o.statuses = {}; for (const k of Object.keys(s.w)) o.statuses[`${k} ${s.w[k].number}`] = `${await status(s.w[k].id)} lead ${await leadName(s.w[k].id)}`; o.names = { A: nmT(A), B: nmT(B) };
  await pinIds([A, B]); await go('Board View', s.q); o.s2 = { A: await orderBV(s, A.staff_id), unassigned: await orderBV(s, 'unassigned'), B: await orderBV(s, B.staff_id) }; await shotC('C690642-s2-board');
  for (const view of ['Board View', 'Tech View'] as const) { const k = view === 'Board View' ? 'BV' : 'TV'; if (view === 'Tech View') { await go('Tech View', s.q); o.TV_start = { A: await orderTV(s, A.staff_id), unassigned: await orderTV(s, 'unassigned'), B: await orderTV(s, B.staff_id) }; await shotC('C690642-TV-start'); }
    const h = async (co: string, g?: string) => (view === 'Board View' ? card(s, co) : await tvRow(s, co, g)); const tg = (id: string) => (view === 'Board View' ? BV(id) : TV(id)); const ord = (id: string) => (view === 'Board View' ? orderBV(s, id) : orderTV(s, id));
    const wh = async (co: string) => (view === 'Board View' ? colOf(s, co) : (await tvRow(s, co), grpOf(s, co)));
    for (const co of ['W2', 'W3']) {
      o[`${k}-${co}-toB`] = await dragHold(await h(co, A.staff_id), tg(B.staff_id), `C690642-${k}-${co}-toB`); o[`${k}-${co}-toB`].after = await after(`C690642-${k}-${co}-toB`); o[`${k}-${co}-toB`].where = await wh(co);
      o[`${k}-${co}-toU`] = await dragHold(await h(co, A.staff_id), tg('unassigned'), `C690642-${k}-${co}-toU`); o[`${k}-${co}-toU`].after = await after(`C690642-${k}-${co}-toU`); o[`${k}-${co}-toU`].where = await wh(co);
      const before = await ord(A.staff_id); await drag(p, await h(co, A.staff_id), await h('W1', A.staff_id), 4); await p.mouse.move(3, 3); o[`${k}-${co}-reorder`] = { before, after: await ord(A.staff_id), message: await noMessage(2500) }; await shotC(`C690642-${k}-${co}-reorder`);
      o[`${k}-${co}-lead`] = await leadName(s.w[co].id); }
    o[`${k}-W4-toA`] = await dragHold(await h('W4', 'unassigned'), tg(A.staff_id), `C690642-${k}-W4-toA`); o[`${k}-W4-toA`].where = await wh('W4'); o[`${k}-W4-unassignedCards`] = (await ord('unassigned')).length;
    o[`${k}-W5-toB`] = await dragHold(await h('W5', A.staff_id), tg(B.staff_id), `C690642-${k}-W5-toB`); o[`${k}-W5-toB`].after = await after(`C690642-${k}-W5-toB`); o[`${k}-W5-toB`].where = await wh('W5'); o[`${k}-W5-lead`] = await leadName(s.w.W5.id);
    if (view === 'Board View') { await dragTo(await h('W6'), tg(B.staff_id), 'x'); o['BV-W6-toB'] = await after('C690642-BV-W6-toB'); o['BV-W6-toB'].where = await wh('W6'); }
    else { await dragTo(await h('W6', B.staff_id), tg(A.staff_id), 'x'); o['TV-W6-backToA'] = await after('C690642-TV-W6-backToA'); o['TV-W6-backToA'].where = await wh('W6'); }
    if (view === 'Board View') { const pg = await p.context().newPage(); try { await pg.goto(`${APP}/workorders/${s.w.W2.id}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg.keyboard.press('Escape');
        await pg.screenshot({ path: path.join(EV, 'C690642-s13-page.png') }).catch(() => {}); o.s14 = await pickLeadTyped(pg, [nmT(B)], nmT(B)); await pg.screenshot({ path: path.join(EV, 'C690642-s14-try.png') }).catch(() => {}); o.s14.leadAfter = await leadName(s.w.W2.id);
        o.s14.fieldState = await pg.evaluate(`(() => { const f = [...document.querySelectorAll('.q-field')].find(x => /Lead Tech/i.test(x.innerText)); return f ? { cls: f.className.slice(0, 160), text: f.innerText.replace(/\\s+/g, ' ').slice(0, 80) } : null; })()`);
      } finally { await pg.close().catch(() => {}); } } }
  o.server = { W2: say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: s.w.W2.id, tech_assigned_id: B.staff_id })), W5: say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: s.w.W5.id, tech_assigned_id: B.staff_id })) };
  // the case as written has ONE card in Unassigned, so "reorder W4 inside Unassigned" has nothing to move against: a second Unassigned card is added here to judge it
  const s2 = await mkSet(`ZZAUTOTEST ${K}B Unassigned Reorder`, [{ co: 'W4', lead: null, status: 'invoiced' }, { co: 'W8', lead: null }]); await go('Board View', s2.q); const b4 = await orderBV(s2, 'unassigned');
  const top = b4[0] === 'W4' ? 'W8' : 'W8'; await drag(p, card(s2, 'W4'), card(s2, top), b4[0] === 'W4' ? 70 : 4); await p.mouse.move(3, 3); const a4 = await orderBV(s2, 'unassigned'); await shotC('C690642-W4-reorder-in-unassigned');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, s2.q); o.W4reorder = { before: b4, after: a4, afterReload: await orderBV(s2, 'unassigned'), message: await noMessage(1500) };
});
save();

// ═════ C690642R — only "an Invoiced work order with no lead can be reordered inside Unassigned" (2 Nov: the first drop landed on the place it already had)
await run('C690642R', async (o) => { const K = 'P2C690642R';
  const s = await mkSet(`ZZAUTOTEST ${K} Unassigned Reorder`, [{ co: 'W4', lead: null, status: 'invoiced' }, { co: 'W8', lead: null }, { co: 'W9', lead: null }]); o.statuses = { W4: await status(s.w.W4.id), W8: await status(s.w.W8.id), W9: await status(s.w.W9.id) };
  await go('Board View', s.q); o.start = await orderBV(s, 'unassigned'); await shotC('C690642R-0-start');
  const below = async (mover: string, target: string, tag: string) => { const b = await p.locator(card(s, target)).boundingBox(); await drag(p, card(s, mover), card(s, target), b ? Math.round(b.height - 6) : 150); await p.mouse.move(3, 3); await p.waitForTimeout(1500); await shotC(tag); return orderBV(s, 'unassigned'); };
  const above = async (mover: string, target: string, tag: string) => { await drag(p, card(s, mover), card(s, target), 4); await p.mouse.move(3, 3); await p.waitForTimeout(1500); await shotC(tag); return orderBV(s, 'unassigned'); };
  // positive control: an Approved card (W9) is moved to the top of Unassigned
  const top0 = o.start[0]; o.control = { moved: 'W9', above: top0, before: o.start, after: top0 === 'W9' ? o.start : await above('W9', top0, 'C690642R-1-control') };
  // the check: the Invoiced card W4 is moved to a NEW place inside Unassigned (to the bottom if it is not last, else to the top)
  const cur = await orderBV(s, 'unassigned'); const last = cur[cur.length - 1]; o.check = { before: cur };
  o.check.after = last !== 'W4' ? await below('W4', last, 'C690642R-2-invoiced-moved') : await above('W4', cur[0], 'C690642R-2-invoiced-moved');
  o.check.messages = await noMessage(2000); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); await search(p, s.q); o.check.afterReload = await orderBV(s, 'unassigned'); o.check.lead = await leadName(s.w.W4.id);
});
save();

// ═════ C97002 — dragging to another technician changes the lead, Unassigned clears it ═════
await run('C97002', async (o) => { const K = 'P2C97002'; const A = await T(K, 'Ana'), B = await T(K, 'Ben'), C = await T(K, 'Cal');
  const s = await mkSet(`ZZAUTOTEST ${K} Drag Lead Change`, [{ co: 'Alpha Co', lead: A }, { co: 'Golf Co', lead: null }]); o.names = { A: nmT(A), B: nmT(B), C: nmT(C) }; o.wo = { alpha: s.w['Alpha Co'].number, golf: s.w['Golf Co'].number };
  await pinIds([A, B, C]); await go('Board View', s.q);
  await dragTo(card(s, 'Alpha Co'), BV(B.staff_id), 'x'); o.s4 = await after('C97002-s4', 'Keep shifts', true); o.s4.column = await colOf(s, 'Alpha Co'); o.s5 = await leadName(s.w['Alpha Co'].id); o.s5_page = await woPageLead(p, APP, s.w['Alpha Co'].id);
  await dragTo(card(s, 'Alpha Co'), BV('unassigned'), 'x'); o.s6 = await after('C97002-s6'); o.s6.column = await colOf(s, 'Alpha Co'); o.s7 = await leadName(s.w['Alpha Co'].id);
  await dragTo(card(s, 'Golf Co'), BV(C.staff_id), 'x'); o.s8 = await after('C97002-s8'); o.s8.column = await colOf(s, 'Golf Co'); o.s9 = await leadName(s.w['Golf Co'].id);
  await go('Tech View', s.q); await dragTo(await tvRow(s, 'Golf Co', C.staff_id), TV(A.staff_id), 'x'); o.s11 = await after('C97002-s11'); await tvRow(s, 'Golf Co'); o.s11.group = await grpOf(s, 'Golf Co'); o.s11.lead = await leadName(s.w['Golf Co'].id);
});
save();

// ═════ C97007 — a work order given a new lead from Reassign or its page goes to the bottom ═════
await run('C97007', async (o) => { const K = 'P2C97007'; const A = await T(K, 'Ana'), C = await T(K, 'Cal');
  // 2 Nov: the work order page's Lead Technician list shows the first 30 names only, so Technician-B gets a name that sorts near the top
  const B = (await person(a, 'AAZZ P2C97007', 'Ben', { role: TECH_ROLE, email: `zz.wob.p2c97007.aazzben${D}`, clockable: true })).row; o.techB = nmT(B);
  const s = await mkSet(`ZZAUTOTEST ${K} Reassign Bottom`, [{ co: 'Aardvark Co', lead: C }, { co: 'Abbey Co', lead: C }, { co: 'Bravo Co', lead: B }, { co: 'Delta Co', lead: B }, { co: 'Echo Co', lead: C }]);
  const W: Record<string, string> = { W1: 'Aardvark Co', W2: 'Abbey Co', W3: 'Bravo Co', W4: 'Delta Co', W5: 'Echo Co' }; const nmW = (xs: string[]) => xs.map((x) => Object.keys(W).find((k) => W[k] === x) ?? x);
  await pinIds([B, C]); await go('Board View', s.q); o.start = nmW(await orderBV(s, B.staff_id));
  await openLeadAction(card(s, W.W1)); await pickInDialog(/AAZZ P2C97007 Ben/); o.s6 = await after('C97007-s6'); await p.waitForTimeout(1500); o.s7 = nmW(await orderBV(s, B.staff_id)); await shotC('C97007-s7-order');
  const pg = await p.context().newPage(); try { await pg.goto(`${APP}/workorders/${s.w[W.W2].id}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg.keyboard.press('Escape');
    o.s8 = await pickLeadTyped(pg, [nmT(B), 'AAZZ'], nmT(B)); o.s8.lead = await leadName(s.w[W.W2].id); } finally { await pg.close().catch(() => {}); }
  await go('Board View', s.q); o.s9 = nmW(await orderBV(s, B.staff_id)); await shotC('C97007-s9-order');
  await drag(p, card(s, W.W5), card(s, W.W4), 4); o.s10_message = await after('C97007-s10'); await p.waitForTimeout(1500); o.s10 = nmW(await orderBV(s, B.staff_id)); await shotC('C97007-s10-order');
  await display(p, 'Tech View'); await expandSmallGroups(p); await findRow(p, s.w[W.W1].id); o.s11 = nmW(await orderTV(s, B.staff_id)); await shotC('C97007-s11-tech');
  const d2 = (await person(a, 'ZZ WOB', 'Dispatcher Two P2', { role: ROLES['Admin'] ?? Object.entries(ROLES).find(([l]) => /^admin/i.test(l))?.[1], email: `zz.wob.dispatcher2.p2${D}`, clockable: false })).row;
  const v = await viewAs(browser, p, a, d2.id, '', RUN.toRunner); try { const q = v.page; o.userBPins = (await a.put(PREF, { value: { ...((await a.get(PREF)).body?.data?.value ?? {}), pinnedTechnicianIds: [B.staff_id, C.staff_id] } })).status; // 2 Nov: User-B's own pins, so Technician-B's column is drawn await go('Tech View', s.q, q); await findRow(q, s.w[W.W1].id);
    o.s12_tech = nmW(((await groups(q)).find((g: any) => g.id === B.staff_id)?.rows ?? []).map(nameOf(s))); await q.screenshot({ path: path.join(EV, 'C97007-s12-userB-tech.png') }).catch(() => {});
    await display(q, 'Board View'); o.s12_board = nmW(((await boardCols(q)).find((c) => c.id === B.staff_id)?.cards ?? []).map(nameOf(s))); await q.screenshot({ path: path.join(EV, 'C97007-s12-userB-board.png') }).catch(() => {}); o.userB = nmT(d2);
  } finally { await v.close(); }
});
save();

// ═════ C97008 — moving to another technician shows the message, reordering shows none ═════
await run('C97008', async (o) => { const K = 'P2C97008'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Move Message`, [{ co: 'Alpha Co', lead: A }, { co: 'Bravo Co', lead: A }, { co: 'Charlie Co', lead: A }, { co: 'Delta Co', lead: B }]); o.names = { A: nmT(A), B: nmT(B) }; o.wo = s.w['Alpha Co'].number;
  await pinIds([A, B]); await go('Board View', s.q); o.s4 = { A: await cnt(A.staff_id), B: await cnt(B.staff_id) };
  // 2 Nov: drop BELOW Delta Co (empty space under the last card, as a tester does), so the step-7 reorder is a real move
  { await p.locator(card(s, 'Alpha Co')).scrollIntoViewIfNeeded().catch(() => {}); const f1 = await p.locator(card(s, 'Alpha Co')).boundingBox(), t1 = await p.locator(card(s, 'Delta Co')).boundingBox();
    if (f1 && t1) { const gx = f1.x + f1.width * 0.45; await p.mouse.move(gx, f1.y + f1.height / 2); await p.mouse.down(); await p.mouse.move(gx, f1.y + f1.height / 2 + 8, { steps: 4 }); await p.mouse.move(t1.x + t1.width / 2, t1.y + t1.height + 30, { steps: 20 }); await p.waitForTimeout(600); await p.mouse.up(); } }
  o.s6 = await after('C97008-s6', 'Keep shifts', true); o.s6.counts = { A: await cnt(A.staff_id), B: await cnt(B.staff_id) }; o.s6.orderB = await orderBV(s, B.staff_id);
  await drag(p, card(s, 'Alpha Co'), card(s, 'Delta Co'), 4); await p.mouse.move(3, 3); o.s8 = { messages: await noMessage(4000), orderB: await orderBV(s, B.staff_id), counts: { A: await cnt(A.staff_id), B: await cnt(B.staff_id) }, lead: await leadName(s.w['Alpha Co'].id) }; await shotC('C97008-s8-reorder');
});
save();

// ═════ C97009 + C690647 (same steps) — Declined, Invoiced and Paid only reorder within their technician ═════
await run('C97009', async (o) => { const K = 'P2C97009'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Invoiced Lock`, [{ co: 'W1', lead: A }, { co: 'W2', lead: A, status: 'invoiced' }, { co: 'W3', lead: A, status: 'paid' }, { co: 'W4', lead: A }, { co: 'W5', lead: A, status: 'complete' }, { co: 'W6', lead: null, status: 'invoiced' }]);
  await declineAll(s.w.W4.id, s.log); o.statuses = {}; for (const k of Object.keys(s.w)) o.statuses[`${k} ${s.w[k].number}`] = `${await status(s.w[k].id)} lead ${await leadName(s.w[k].id)}`; o.names = { A: nmT(A), B: nmT(B) };
  await pinIds([A, B]); await go('Board View', s.q); o.s3 = { A: await orderBV(s, A.staff_id), unassigned: await orderBV(s, 'unassigned') }; await shotC('C97009-s3-board');
  o.s4 = { W1_control: await lockInfo(card(s, 'W1'), 'C97009-s4-W1'), W2: await lockInfo(card(s, 'W2'), 'C97009-s4-W2'), W3: await lockInfo(card(s, 'W3'), 'C97009-s4-W3'), W4: await lockInfo(card(s, 'W4'), 'C97009-s4-W4') };
  const b5 = await orderBV(s, A.staff_id); await drag(p, card(s, 'W2'), card(s, 'W1'), 4); await p.mouse.move(3, 3); o.s5 = { before: b5, after: await orderBV(s, A.staff_id), messages: await noMessage(2500) }; await shotC('C97009-s5-reorder');
  o.s6 = await dragHold(card(s, 'W2'), BV(B.staff_id), 'C97009-s6'); o.s6.after = await after('C97009-s6'); o.s6.where = await colOf(s, 'W2'); o.s6.countA = await cnt(A.staff_id);
  o.s7 = await dragHold(card(s, 'W3'), BV('unassigned'), 'C97009-s7'); o.s7.after = await after('C97009-s7'); o.s7.where = await colOf(s, 'W3'); o.s7.countA = await cnt(A.staff_id);
  o.s8 = await dragHold(card(s, 'W6'), BV(A.staff_id), 'C97009-s8'); o.s8.where = await colOf(s, 'W6');
  o.s9a = await dragHold(card(s, 'W4'), BV(B.staff_id), 'C97009-s9a'); o.s9a.after = await after('C97009-s9a'); o.s9a.where = await colOf(s, 'W4');
  await dragTo(card(s, 'W5'), BV(B.staff_id), 'x'); o.s9b = await after('C97009-s9b'); o.s9b.where = await colOf(s, 'W5');
  await go('Tech View', s.q); await tvRow(s, 'W3', A.staff_id); o.s10 = await grpOf(s, 'W3'); await shotC('C97009-s10-tech');
  o.s11 = await dragHold(await tvRow(s, 'W3', A.staff_id), TV(B.staff_id), 'C97009-s11'); o.s11.after = await after('C97009-s11'); await tvRow(s, 'W3'); o.s11.where = await grpOf(s, 'W3');
  o.tvLocks = { W3: await lockInfo(await tvRow(s, 'W3'), 'C97009-tv-W3') };
});
save();

// ═════ C368144 — removing the lead puts the work order in its normal place in Unassigned ═════
await run('C368144', async (o) => { const K = 'P2C368144'; const A = await T(K, 'Ana');
  const s = await mkSet(`ZZAUTOTEST ${K} Unassigned Place`, [{ co: 'Alpha Co', lead: A }, { co: 'Bravo Co', lead: null }, { co: 'Charlie Co', lead: A }, { co: 'Delta Co', lead: null }]);
  const W: Record<string, string> = { W1: 'Alpha Co', W2: 'Bravo Co', W3: 'Charlie Co', W4: 'Delta Co' }; const nmW = (xs: string[]) => xs.map((x) => Object.keys(W).find((k) => W[k] === x) ?? x);
  await pinIds([A]); await go('Board View', s.q); o.s4 = nmW(await orderBV(s, 'unassigned'));
  await unassignVia(card(s, W.W3)); o.s6 = await after('C368144-s6'); await p.waitForTimeout(1500); o.s7 = nmW(await orderBV(s, 'unassigned')); await shotC('C368144-s7-order');
  const pg = await p.context().newPage(); try { await pg.goto(`${APP}/workorders/${s.w[W.W1].id}`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); if (await pg.locator('.q-dialog').filter({ hasText: 'New Line' }).count()) await pg.keyboard.press('Escape');
    // 2 Nov: open the Lead Technician list (its test id) and pick "Unassigned" — the first run's label-based locator timed out
    const sel = pg.locator('[data-test-id="select_lead_technician"]'); o.s8 = { field: await sel.count() }; await sel.click().catch(() => {}); await pg.waitForTimeout(1500);
    const un = pg.locator('.q-menu .q-item').filter({ hasText: /^\s*(check\s*)?Unassigned\s*$/ }).first(); o.s8.unassignedOption = await un.count();
    o.s8.firstOptions = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).slice(0, 4).map((x) => x.replace(/\s+/g, ' ').trim());
    if (o.s8.unassignedOption) { await un.click(); o.s8.how = 'picked Unassigned in the Lead Technician list'; } else { await pg.keyboard.press('Escape'); o.s8.how = 'no Unassigned option'; }
    await pg.waitForTimeout(2500); await pg.screenshot({ path: path.join(EV, 'C368144-s8-page.png') }).catch(() => {}); o.s8.lead = await leadName(s.w[W.W1].id); } finally { await pg.close().catch(() => {}); }
  await go('Board View', s.q); o.s9 = nmW(await orderBV(s, 'unassigned')); await shotC('C368144-s9-order');
  await display(p, 'Tech View'); await expandSmallGroups(p); await findRow(p, s.w[W.W1].id, 'unassigned'); o.s10 = nmW(await orderTV(s, 'unassigned')); await shotC('C368144-s10-tech');
});
save();

// ═════ C97028 — blocked analytics never stops the page, settings or reassignment ═════
await run('C97028', async (o) => { const K = 'P2C97028'; const A = await T(K, 'Ana'), B = await T(K, 'Ben');
  const s = await mkSet(`ZZAUTOTEST ${K} Blocked Analytics`, [{ co: 'Alpha Co', lead: A }]); o.names = { B: nmT(B) }; o.wo = s.w['Alpha Co'].number;
  const failed: string[] = []; p.on('requestfailed', (r) => { if (/google-analytics|googletagmanager|gtag|analytics|segment|mixpanel|posthog/i.test(r.url())) failed.push(r.url().replace(/\?.*$/, '').slice(0, 90)); });
  const pv = await prefGet(); await a.put(PREF, { value: { ...pv, boardCardSize: 'detailed' } });
  await pinIds([A, B]); await go('Board View', s.q); o.s1 = { cardShown: await p.locator(card(s, 'Alpha Co')).count() };
  await p.locator('[data-test-id="button_board_fields_selection"]').click(); await p.waitForTimeout(900); const tv = p.locator('[data-test-id="toggle_board_field_vin"]'); const st = await tv.locator('[role=switch]').getAttribute('aria-checked').catch(() => tv.getAttribute('aria-checked')); o.s2_vinBefore = st; if (st !== 'true') await tv.click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  // 2 Nov: Board View has no density control since SV-11581 — "Card size" (Compact / Detailed) took its place; the toolbar names are read for the case edit
  o.toolbarNames = {}; for (const tid of ['button_board_fields_selection', 'button_card_size']) { const l = p.locator(`[data-test-id="${tid}"]`).first(); o.toolbarNames[tid] = { aria: await l.getAttribute('aria-label').catch(() => null) }; await l.hover().catch(() => {}); await p.waitForTimeout(900); o.toolbarNames[tid].tooltip = await tips(); }
  await p.locator('[data-test-id="button_card_size"]').click(); await p.waitForTimeout(800); o.cardSizeOptions = await menuItems(p); await p.locator('.q-menu .q-item').filter({ hasText: /^\s*Compact\s*$/ }).first().click(); await p.waitForTimeout(1200); await p.keyboard.press('Escape');
  o.s2 = { vinOnCard: await p.locator(`${card(s, 'Alpha Co')} [data-test-id="board_card_field_vin"]`).count(), cardSize: (await prefGet()).boardCardSize }; await shotC('C97028-s2-fields');
  await dragTo(card(s, 'Alpha Co'), BV(B.staff_id), 'x'); o.s3 = await after('C97028-s3'); o.s3.where = await colOf(s, 'Alpha Co');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, s.q); const pf = await prefGet();
  o.s4 = { display: pf.display, cardSize: pf.boardCardSize, vinOnCard: await p.locator(`${card(s, 'Alpha Co')} [data-test-id="board_card_field_vin"]`).count(), where: await colOf(s, 'Alpha Co'), lead: await leadName(s.w['Alpha Co'].id) }; await shotC('C97028-s4-after-refresh');
  o.analyticsRefused = [...new Set(failed)].slice(0, 6); o.blockerNote = process.env.WOB_GA ? 'WOB_GA set: analytics NOT blocked by the harness' : 'the harness refuses googletagmanager / google-analytics requests in this browser (viewas.mts route), as a tracker blocker does';
});
save();

// ═════ C590130 — the lead change message is the design's white message with Undo ═════
await run('C590130', async (o) => { const K = 'P2C590130'; const A = await T(K, 'Dee');
  const name = `ZZAUTOTEST ${K} Toast ${RUNNO}`; const c = await customer(a, name, 'ZZF9'); const w = await workOrder(a, c, 'estimate', null); const wo = (await workOrders(a, name)).find((x: any) => x.id === w);
  o.wo = { number: wo?.number, status: wo?.status, lead: await leadName(w), lines: (await linesRaw(w)).map((x: any) => x.status ?? x.line_status) }; o.names = { A: nmT(A) };
  const set = { q: name, w: { W1: { id: w, number: wo?.number } } }; await p.setViewportSize({ width: 1440, height: 900 }); await pinIds([A]);
  const pv = await prefGet(); await a.put(PREF, { value: { ...pv, density: 'comfortable', filters: {} } });
  await go('Board View', name); o.searchNote = 'the customer name is typed in Search so the card is on screen (production has many unassigned cards); nothing else differs from the steps';
  await dragTo(card(set, 'W1'), BV(A.staff_id), 'x'); const t0 = Date.now(); await p.mouse.move(2, 2); const w1 = await waitToast(p, 4000); await shotC('C590130-s3-message');
  o.s3 = { afterMs: w1.afterMs, toasts: w1.toasts, style: await p.evaluate(`(() => { const re = /assigned to|lead technician set to|moved to Unassigned/; const el = [...document.querySelectorAll('body *')].filter(e => re.test(e.innerText || '') && (e.innerText || '').length < 200 && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().width < 700).pop(); if (!el) return null;
      let box = el; for (let i = 0; i < 6 && box && getComputedStyle(box).backgroundColor === 'rgba(0, 0, 0, 0)'; i++) box = box.parentElement; const cs = getComputedStyle(box); const icon = [...box.querySelectorAll('i, svg')].map(i => ({ text: (i.textContent || '').trim(), color: getComputedStyle(i).color, cls: (i.getAttribute('class') || '').slice(0, 60) }));
      return { bg: cs.backgroundColor, radius: cs.borderRadius, shadow: cs.boxShadow.slice(0, 80), color: cs.color, classes: (box.className || '').toString().slice(0, 120), isQNotification: !!box.closest('.q-notification'), icons: icon.slice(0, 4) }; })()`) };
  const g = await watchGone(p, 12000); o.s4 = { goneAfterMsSinceDrop: g === null ? 'still open after 12 s' : Date.now() - t0 }; o.lead = await leadName(w); o.column = await colOf(set, 'W1');
  await p.setViewportSize({ width: 1600, height: 1000 });
});
save();

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
R.end = new Date().toISOString(); save();
try { await (RUN as any).end?.(); } catch { /* */ }
await done(browser);
