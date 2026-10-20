/** four-aa-1020.mts — 20 Oct 2026: the four tests the QA lead added (C368159, C368169, C368171, C368173), by their steps as rewritten
 *  ~19 Oct (technicians named "AA ZZAUTOTEST <case> Ana/Ben/Dee" so they sit in the first ~100 of the work order page's lists, SV-11429).
 *  Helpers: c6824-held.mts lines 8-108; selectors from editwo-fix.mts / high1-fix5.mts (proven). Pictures EV/<id>-aa-*.png. Records only. */
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
import { ensureEligible } from './staff.mts';
import { pickLeadOnPage } from './wob.mts';
const sh = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const AA = async (cid: string, first: string) => { const r = (await person(a, `AA ZZAUTOTEST ${cid}`, first, { role: TECH_ROLE, email: `zz.wob.aa.${cid.toLowerCase()}.${first.toLowerCase()}${D}`, clockable: true })).row; await ensureEligible(a, r, first).catch(() => {}); return r; };
const nm = (cid: string, first: string) => `AA ZZAUTOTEST ${cid} ${first}`;
const wpage = async (id: string, pg: Page = p) => { await pg.goto(`${APP}/workorders/${id}/lines`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(7000); };
const leadField = (pg: Page) => pg.locator('[data-test-id="select_lead_technician"]').first();
const leadText = async (pg: Page = p) => ((await leadField(pg).innerText().catch(() => '')) || '').replace(/\s+/g, ' ').replace('arrow_drop_down', '').trim();
const msgs = (pg: Page = p) => toasts(pg);
const laborRows = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('[data-test-id^="line_labor_name_"]')].map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const apiLead = async (id: string) => { const w = (await a.get(`/api/work-orders/view/${id}`)).body?.data?.work_order; return w ? `${w.tech_assigned_first_name ?? ''} ${w.tech_assigned_last_name ?? ''}`.trim() || null : null; };
const lineTechs = async (id: string) => (await linesRaw(id)).map((l: any) => ({ line: l.line_name, techs: (l.assigned_techs ?? []).map((x: any) => `${x.first_name ?? x.firstName ?? ''} ${x.last_name ?? x.lastName ?? ''}`.trim()) }));
const pickTyped = async (pg: Page, field: any, name: string) => { await field.click().catch(() => {}); await pg.waitForTimeout(1000); const inp = field.locator('input').first();
  if (await inp.count()) { await inp.fill(name).catch(() => {}); } else await pg.keyboard.type(name, { delay: 40 }); await pg.waitForTimeout(2500);
  const offered = (await pg.locator('.q-menu .q-item').allInnerTexts().catch(() => [] as string[])).map((x) => x.replace(/\s+/g, ' ').trim()).slice(0, 8);
  const opt = pg.locator('.q-menu .q-item').filter({ hasText: name }).first(); const ok = (await opt.count()) > 0; if (ok) { await opt.click(); await pg.waitForTimeout(3000); } else await pg.keyboard.press('Escape').catch(() => {}); return { ok, offered }; };
const auditText = async () => { await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000); await p.locator('.q-menu .q-item').filter({ hasText: /Audit Log/i }).first().click(); await p.waitForTimeout(3500);
  return { title: (await p.locator('.q-dialog').last().locator('.q-card__section, .text-h6').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 60), text: (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ') }; };
const closeDlg = async () => { for (let i = 0; i < 3 && await p.locator('.q-dialog').count(); i++) { await p.locator('.q-dialog [data-test-id="button_close_dialog"], .q-dialog button:has(i:text-is("close"))').last().click({ timeout: 3000 }).catch(async () => { await p.keyboard.press('Escape'); }); await p.waitForTimeout(800); } };

// C368159 — browser 1 (List, stale) toggles On Site after browser 2 changed the lead on the work order page
await run('C368159', async (o) => {
  const A1 = await AA('C368159', 'Ana'), B1 = await AA('C368159', 'Ben');
  const set = await mkSet('ZZAUTOTEST F3 Stale On Site', [{ co: 'Site Co', lead: A1 }]); const W = set.w['Site Co']; o.wo = W.number;
  const here = async () => (await a.get(`/api/work-orders/view/${W.id}`)).body?.data?.work_order?.is_vehicle_here;
  await go('List', set.q); o.s1_2 = { lead: await apiLead(W.id), here: await here(), listRow: (await p.locator('tbody tr').filter({ hasText: W.number }).first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160) }; await sh(p, 'C368159-aa-s2-list');
  const pg = await p.context().newPage(); await wpage(W.id, pg); o.s3 = { lead: await leadText(pg) };
  o.s4 = await pickTyped(pg, leadField(pg), nm('C368159', 'Ben')); o.s4.leadNow = await leadText(pg); o.s4.msgs = await msgs(pg); await sh(pg, 'C368159-aa-s4-browser2-lead');
  const row = p.locator('tbody tr').filter({ hasText: W.number }).first(); const tg = row.locator('[data-test-id*="vehicle_here"], [data-test-id*="on_site"], .q-toggle').first();
  o.s5 = { toggle: await tg.count(), before: await here() }; if (o.s5.toggle) { await tg.click(); await p.waitForTimeout(3000); } o.s5.after = await here(); o.s5.msgs = await msgs(p); await sh(p, 'C368159-aa-s5-browser1-onsite');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, set.q); o.s6 = { here: await here() };
  await wpage(W.id); o.s7 = { leadOnPage: await leadText(), leadApi: await apiLead(W.id) }; await sh(p, 'C368159-aa-s7-lead');
  await pg.close().catch(() => {});
});

// C368169 — the status card saves a new lead and a new mileage together
await run('C368169', async (o) => {
  const A1 = await AA('C368169', 'Ana'), B1 = await AA('C368169', 'Ben');
  const set = await mkSet('ZZAUTOTEST Edit WO Lead Mileage', [{ co: 'One', lead: A1 }]); const W = set.w.One; o.wo = W.number;
  o.setupMileage = (await a.post('/api/work-orders/change-mileage', { work_order_id: W.id, mileage: '120000' })).status;
  await wpage(W.id); o.s3 = { lead: await leadText(), mileage: await p.locator('[data-test-id="input_vehicle_mileage"]').first().inputValue().catch(() => null) }; await sh(p, 'C368169-aa-s3');
  o.s4 = await pickTyped(p, leadField(p), nm('C368169', 'Ben')); o.s4.leadNow = await leadText(); o.s4.msgs = await msgs();
  const mi = p.locator('[data-test-id="input_vehicle_mileage"]').first(); await mi.click(); await mi.fill('120500'); o.s5 = { shows: await mi.inputValue().catch(() => null) };
  await p.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {}); await p.waitForTimeout(2500); o.s6 = { msgs: await msgs(), errors: await p.locator('.q-field--error, .text-negative').count() }; await sh(p, 'C368169-aa-s6');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.s7 = { lead: await leadText(), mileage: await mi.inputValue().catch(() => null), leadApi: await apiLead(W.id) }; await sh(p, 'C368169-aa-s7-after-reload');
});

// C368171 — a lead change on the work order page adds exactly one "Lead tech changed" entry
await run('C368171', async (o) => {
  const A1 = await AA('C368171', 'Ana'), B1 = await AA('C368171', 'Ben');
  const set = await mkSet('ZZAUTOTEST Edit WO Audit', [{ co: 'One', lead: A1 }]); const W = set.w.One; o.wo = W.number; await mkLine(W.id, 2);
  for (const l of await linesRaw(W.id)) if (!/approved|authorized/i.test(l.status ?? '')) await a.post('/api/work-orders/lines/change-status', { line_id: l.line_id, status: 'authorized', workOrderId: W.id });
  await wpage(W.id); o.s3 = { labor: await laborRows(), lines: await lineTechs(W.id) }; await sh(p, 'C368171-aa-s3');
  const t0 = await auditText(); o.s4 = { title: t0.title }; o.s5 = { count: (t0.text.match(/Lead tech changed/gi) || []).length, time: new Date().toISOString().slice(11, 19) }; await sh(p, 'C368171-aa-s4-log-before'); await closeDlg(); o.s6 = { dialogs: await p.locator('.q-dialog').count() };
  o.s7 = await pickTyped(p, leadField(p), nm('C368171', 'Ben')); o.s7.leadNow = await leadText(); await p.waitForTimeout(2000);
  const t1 = await auditText(); o.s8 = { title: t1.title }; o.s9 = { count: (t1.text.match(/Lead tech changed/gi) || []).length, newest: (t1.text.match(/Lead tech changed[^]{0,220}/i) || [null])[0], lineEntries: (t1.text.match(/(Line|Labor)[^.]{0,40}(technician|tech) (changed|assigned)/gi) || []).slice(0, 5) }; await sh(p, 'C368171-aa-s9-log-after'); await closeDlg();
  o.after = { labor: await laborRows(), lines: await lineTechs(W.id) };
});

// C368173 — Edit Line: remove the line's technician, add another, save
await run('C368173', async (o) => {
  const A1 = await AA('C368173', 'Ana'), B1 = await AA('C368173', 'Ben'), D1 = await AA('C368173', 'Dee');
  const set = await mkSet('ZZAUTOTEST Edit Line Tech', [{ co: 'One', lead: A1 }]); const W = set.w.One; o.wo = W.number; const L = (await linesRaw(W.id))[0];
  o.setupLineTech = say(await a.post('/api/work-orders/lines/assign-technician', { line_id: L.line_id, workOrderId: W.id, staff_id: D1.staff_id }));
  o.setupOnlyDee = await lineTechs(W.id);
  await wpage(W.id); o.s4 = { labor: await laborRows() }; await sh(p, 'C368173-aa-s4');
  await p.getByText(L.line_name, { exact: false }).first().click(); await p.waitForTimeout(2500); const d = p.locator('.q-dialog').last(); o.s5 = { open: await d.isVisible().catch(() => false), roster: await d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.trim())).catch(() => null) };
  for (const x of [A1, B1]) { const b = d.locator(`[data-test-id="button_line_roster_remove_${x.staff_id}"]`); if (await b.count()) { o['setupRemoved_' + x.staff_id.slice(0, 4)] = true; await b.click(); await p.waitForTimeout(500); } }
  const rm = d.locator(`[data-test-id="button_line_roster_remove_${D1.staff_id}"]`); o.s6 = { button: await rm.count() }; if (o.s6.button) { await rm.click(); await p.waitForTimeout(600); }
  o.s6.roster = await d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.trim())).catch(() => null);
  o.s7 = await pickTyped(p, d.locator('[data-test-id="select_line_roster_add_technician"]'), nm('C368173', 'Ben')); o.s7.roster = await d.evaluate((e: any) => [...e.querySelectorAll('[data-test-id^="line_roster_technician_"]')].map((x: any) => x.innerText.trim())).catch(() => null); await sh(p, 'C368173-aa-s7-form');
  await d.locator('[data-test-id="button_save_close"], button:has-text("Save & Close")').first().click().catch(() => {}); await p.waitForTimeout(3500); o.s8 = { msgs: await msgs(), dialogOpen: await p.locator('.q-dialog').count() };
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o.s10 = { labor: await laborRows(), lines: await lineTechs(W.id) }; await sh(p, 'C368173-aa-s10-after-reload');
});

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'four-aa-1020.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
