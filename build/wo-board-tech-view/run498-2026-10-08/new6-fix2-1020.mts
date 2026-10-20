/** new6-1020.mts — 20 Oct 2026: run 498's six not-yet-judged tests by their current steps (case text read live 20 Oct, run-1020/CASES.txt):
 *  C682421 first Tab off-screen (S2-16688), C682436 no-technician / empty location states, C682437 header released over a row,
 *  C682438 focused avatar name, C682445 two people reorder one column, C682446 timesheet entry moved to another line.
 *  Helpers: c6824-held.mts lines 8-108 (runner, data, pins). Every reading is from the screen; pictures EV/<id>-n-*.png. Records only. */
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
const sh = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `${n}.png`) }).catch(() => {});
const focusInfo = (pg: Page) => pg.evaluate(`(() => { const e = document.activeElement; if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
  const card = e.closest('[data-test-id^="board_card_"]'); const row = e.closest('tr[data-test-id^="tech_view_row_"]');
  return { id: e.getAttribute('data-test-id') || e.tagName, aria: e.getAttribute('aria-label'), text: (e.innerText || '').replace(/\\s+/g, ' ').slice(0, 80), card: card ? (card.innerText.match(/S\\d+-\\d+/) || [null])[0] : null, row: row ? (row.innerText.match(/S\\d+-\\d+/) || [null])[0] : null,
    ring: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' || /rgb/.test(cs.boxShadow), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; })()`) as Promise<any>;
const tips = (pg: Page) => pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;


// 20 Oct 2026 (first run): C682436 left the runner at "ZZAUTOTEST Location Empty" (the on-screen switch back did not take), so the
// next four tests ran in the wrong location. Every block now starts here: switch on screen, read the header back, fall back to the API.
const toHeavy = async () => { let h = await switchLocUI(p, 'Staging Heavy Duty - 9919').catch(() => '');
  if (!/Heavy Duty/.test(String(h))) { await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' }); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
    h = (await p.locator('[data-test-id="profile_menu_button"]').innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); }
  if (!/Heavy Duty/.test(String(h))) throw new Error('could not get back to Staging Heavy Duty: header reads ' + h); return h; };

// ───── C682421: first Tab lands on S2-16688, the whole row / card seen
await run('C682421', async (o) => { o.location = await toHeavy();
  await p.setViewportSize({ width: 1440, height: 900 }); const N = 'S2-16688';
  await p.goto(APP + '/workorders?tab=all&search=' + N, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.s1 = { search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) };
  await display(p, 'Tech View'); await p.waitForTimeout(2500);
  const tog = p.locator('[data-test-id^="button_tech_view_expand_all"], [data-test-id="button_tech_view_toggle_all"], th .q-icon, [aria-label*="xpand all"]').first();
  await tog.hover().catch(() => {}); await p.waitForTimeout(700); o.s3_tip = await tips(p); if (o.s3_tip.some((x: string) => /Expand all/i.test(x))) { await tog.click().catch(() => {}); await p.waitForTimeout(1500); }
  await expandSmallGroups(p);
  o.s4 = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id="tech_view_group_unassigned"]'); const row = [...document.querySelectorAll('tr[data-test-id^="tech_view_row_"]')].find(r => r.innerText.includes(${JSON.stringify(N)}));
    const rb = row ? row.getBoundingClientRect() : null; return { unassigned: g ? g.innerText.replace(/\\s+/g, ' ').slice(0, 80) : null, rowOnScreen: rb ? (rb.top < innerHeight && rb.bottom > 0) : null, rowTop: rb ? Math.round(rb.top) : null }; })()`);
  await sh(p, 'C682421-n-s4');
  await p.locator('[data-test-id="page_search_input"]').click(); const stops: any[] = [];
  for (let i = 0; i < 20; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(450); const f = await focusInfo(p); stops.push(f.id + (f.row ? ' ' + f.row : '')); if (f.row || /tech_view_group|tech_view_row/.test(f.id)) break; }
  await p.waitForTimeout(1200); o.s5 = { stops, focus: await focusInfo(p) };
  o.s5.cover = await p.evaluate(`(() => { const e = document.activeElement; const row = e && e.closest('tr'); if (!row) return null; const r = row.getBoundingClientRect();
    const xs = [r.left + 40, r.left + r.width / 2]; const samples = []; for (const y of [r.top + 2, r.top + r.height / 2, r.bottom - 2]) for (const x of xs) { const h = document.elementFromPoint(x, y); samples.push(!!(h && (row === h || row.contains(h)))); }
    const sticky = [...document.querySelectorAll('tr, th, div')].filter(x => getComputedStyle(x).position === 'sticky').map(x => x.getBoundingClientRect()).filter(b => b.bottom > r.top && b.top < r.bottom && b.height < 120);
    const coverBottom = Math.max(0, ...sticky.map(b => b.bottom)); const visible = Math.max(0, r.bottom - Math.max(r.top, coverBottom, 0));
    return { rowTop: Math.round(r.top), rowBottom: Math.round(r.bottom), rowHeight: Math.round(r.height), coveredBy: sticky.length, coverBottom: Math.round(coverBottom), visiblePx: Math.round(visible), pointsOnRow: samples }; })()`);
  await sh(p, 'C682421-n-s5');
  await display(p, 'Board View'); await p.waitForTimeout(2500); await p.locator('[data-test-id="page_search_input"]').click(); const bs: any[] = [];
  for (let i = 0; i < 20; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(450); const f = await focusInfo(p); bs.push(f.id + (f.card ? ' ' + f.card : '')); if (f.card || /board_column_header/.test(f.id)) break; }
  await p.waitForTimeout(1500); const f7 = await focusInfo(p); o.s7 = { stops: bs, focus: f7, fullyOnScreen: f7?.box ? (f7.box[0] >= 0 && f7.box[1] >= 0 && f7.box[0] + f7.box[2] <= 1440 && f7.box[1] + f7.box[3] <= 900) : null };
  await sh(p, 'C682421-n-s7'); await search(p, ''); await p.setViewportSize({ width: 1600, height: 1000 });
});

// ───── C682436: no technicians / nothing here yet
await run('C682436', async (o) => {
  const wpList = async () => { const d = (await a.get('/api/workplaces')).body?.data; return (Array.isArray(d) ? d : d?.collection ?? []) as any[]; };
  const wps = await wpList(); const B = wps.find((x) => x.name === 'ZZAUTOTEST F2 No Tech Shop'); const C = wps.find((x) => x.name === 'ZZAUTOTEST Location Empty');
  o.locations = { B: !!B, C: !!C }; if (!B || !C) throw new Error('location missing: run c6824-held ONLY=C682436 first');
  const page = async (tag: string) => { const text = await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ').slice(0, 900)`) as string;
    const buttons = await p.evaluate(`[...document.querySelectorAll('main button, .q-page button')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) as string[];
    await sh(p, `C682436-n-${tag}`); return { text, buttons }; };
  o.s1 = await switchLocUI(p, B.name); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All');
  await display(p, 'Tech View'); await p.waitForTimeout(2500); o.s2 = await page('s2-techview-locB');
  await display(p, 'Board View'); await p.waitForTimeout(2500); o.s3 = await page('s3-board-locB');
  const add = p.locator('main button, .q-page button').filter({ hasText: /^\s*Add Technician\s*$/ }).first();
  o.s4 = { button: await add.count() }; if (o.s4.button) { await add.click(); await p.waitForTimeout(4000); o.s4.url = p.url().replace(APP, ''); await sh(p, 'C682436-n-s4-after-click'); }
  o.s5 = await switchLocUI(p, C.name); await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All');
  await display(p, 'Board View'); await p.waitForTimeout(2500); o.s6 = await page('s6-board-locC');
  await display(p, 'Tech View'); await p.waitForTimeout(2500); o.s7 = await page('s7-techview-locC');
  // User-B: Work orders View only, enrolled at Location-B, no Settings → App
  const VIEW_ROLE = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get(`/api/organizations/${(await import('./profile.mts')).ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data).find((r: any) => /^ZZAUTOTEST WO View Only$/.test(r.label ?? r.name ?? ''))?.id;
  const u = (await person(a, 'ZZAUTOTEST C682436', 'Viewer', { role: VIEW_ROLE, email: `zz.wob.c682436.viewer${D}`, clockable: false })).row;
  o.userB = { made: !!u, role: !!VIEW_ROLE }; if (u) { const dl = ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/departments')).body?.data); const svc = dl.find((d: any) => (d.name ?? d.label) === 'Service') ?? dl[0]; o.userB.enrol = say(await a.post('/api/staff/enrollment/create', { staffId: u.staff_id, workplaceId: B.id, departmentId: svc?.id })); }
  o.back = await toHeavy();
  if (u) { const V = await viewAs(browser, p, a, u.id, (RUN as any).id, (RUN as any).toRunner); o.s8 = { perms: V.perms };
    try { const vp = V.page; await vp.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await vp.waitForTimeout(5000); o.s9 = await switchLocUI(vp, B.name);
      await vp.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await vp.waitForTimeout(5000); await tab(vp, 'All'); await display(vp, 'Board View'); await vp.waitForTimeout(2500);
      o.s10 = { text: await vp.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ').slice(0, 700)`), buttons: await vp.evaluate(`[...document.querySelectorAll('main button, .q-page button')].filter(b => b.getBoundingClientRect().width > 0).map(b => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`) };
      await sh(vp, 'C682436-n-s10-userB-board'); } finally { await V.close().catch(() => {}); } }
});

// ───── C682437: a technician header released over a row opens no work order
await run('C682437', async (o) => { o.location = await toHeavy();
  const A1 = await T('C682437', 'Ana'), B1 = await T('C682437', 'Ben');
  // fix (20 Oct): Technician-C's group was not drawn (it sorts among ~280 unpinned groups); an "AA" name puts it first after the pinned ones
  const C1 = (await person(a, 'AA ZZAUTOTEST C682437', 'Cy', { role: TECH_ROLE, email: `zz.wob.aa.c682437.cy${D}`, clockable: true })).row;
  const set = await mkSet('ZZAUTOTEST C682437 Header Drag', [{ co: 'One', lead: A1 }, { co: 'Two', lead: B1 }, { co: 'Three', lead: C1 }]); o.data = Object.fromEntries(Object.entries(set.w).map(([k, v]) => [k, v.number]));
  await pins([A1.staff_id, B1.staff_id]); await go('Tech View', set.q);
  const hdr = (id: string) => `[data-test-id="tech_view_group_${id}"]`;
  const dropHeaderOnRow = async (hid: string, rowSel: string, tag: string) => { const h = await p.locator(hdr(hid)).first().boundingBox(); const r = await p.locator(rowSel).first().boundingBox(); if (!h || !r) return { missing: !h ? 'header' : 'row' };
    const u0 = p.url(); await p.mouse.move(h.x + 300, h.y + h.height / 2); await p.mouse.down(); await p.mouse.move(h.x + 300, h.y + h.height / 2 - 8, { steps: 4 }); await p.mouse.move(r.x + 400, r.y + r.height / 2, { steps: 20 }); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(3000);
    await sh(p, `C682437-n-${tag}`); return { urlBefore: u0.replace(APP, ''), urlAfter: p.url().replace(APP, ''), opened: /\/workorders\/[0-9a-f-]{36}/.test(p.url()), dialogs: await p.locator('.q-dialog').count(), pinned: ((await prefGet()).pinnedTechnicianIds ?? []).map((x: string) => x === A1.staff_id ? 'Ana' : x === B1.staff_id ? 'Ben' : x === C1.staff_id ? 'Cy' : 'other') }; };
  o.s1_2 = await dropHeaderOnRow(B1.staff_id, row(set, 'One'), 's2-ben-over-row1'); if (o.s1_2.opened) await go('Tech View', set.q);
  o.s3_4 = await dropHeaderOnRow(C1.staff_id, row(set, 'Two'), 's4-cy-over-row2'); if (o.s3_4.opened) await go('Tech View', set.q);
  await p.locator(row(set, 'Three')).first().click().catch(() => {}); await p.waitForTimeout(4000); o.s5 = { url: p.url().replace(APP, ''), opened: p.url().includes(set.w.Three.id) }; await sh(p, 'C682437-n-s5');
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

// ───── C682438: a focused avatar on a Board card shows the technician's name
await run('C682438', async (o) => { o.location = await toHeavy();
  const A1 = await T('C682438', 'Ana'), B1 = await T('C682438', 'Ben');
  const set = await mkSet('ZZAUTOTEST C682438 Avatar Keys', [{ co: 'One', lead: A1 }]); o.wo = set.w.One.number;
  const l = (await linesRaw(set.w.One.id))[0]; o.lineTech = l ? say(await a.put(`/api/work-orders/lines/${l.line_id}/technicians`, { staffIds: [B1.staff_id] })) : 'no line';
  // fix 2 (20 Oct 06:15): with one line the card showed only the lead's name and no avatars; a second approved line that follows the lead gives the card both people (as on S2-37552)
  await mkLine(set.w.One.id, 2); o.lines = (await linesRaw(set.w.One.id)).map((x: any) => `${x.line_name}=${x.status}`);
  // fix (20 Oct): the precondition needs "Line technicians" on in Board View's Fields to display (it read technician:false)
  { const pv0 = await prefGet(); const key = pv0.boardFields ? 'boardFields' : 'fields'; o.fieldsBefore = pv0[key] ?? null; await a.put(PREF, { value: { ...pv0, [key]: { ...(pv0[key] ?? {}), technician: true } } }); }
  await pins([A1.staff_id, B1.staff_id]); const pv = await prefGet(); o.fields = pv.boardFields ?? pv.fields ?? null;
  await go('Board View', set.q); await p.mouse.move(5, 880);
  await p.locator('[data-test-id="page_search_input"]').click(); o.s1 = await focusInfo(p); const st: any[] = [];
  for (let i = 0; i < 20; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(400); const f = await focusInfo(p); st.push(f.id + (f.card ? ' ' + f.card : '')); if (f.card) break; }
  o.s2 = { stops: st, focus: await focusInfo(p) };
  for (let i = 0; i < 4 && (await focusInfo(p)).card !== set.w.One.number; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(350); }
  o.s3 = await focusInfo(p); const av: any[] = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); await p.waitForTimeout(900); const f = await focusInfo(p); const tp = await tips(p); av.push({ focus: f, tooltips: tp }); await sh(p, `C682438-n-tab${i + 1}`); if (!f.card) break; }
  o.s4_5 = av;
  // positive control: the same avatars on mouse hover
  const avs = p.locator(`${card(set, 'One')} .q-avatar, ${card(set, 'One')} [class*=avatar]`); o.hover = [];
  for (let i = 0; i < Math.min(await avs.count(), 4); i++) { await avs.nth(i).hover().catch(() => {}); await p.waitForTimeout(900); o.hover.push(await tips(p)); }
  await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

// ───── C682445: two people reorder one column at once
await run('C682445', async (o) => { o.location = await toHeavy();
  const A1 = await T('C682445', 'Ana');
  const set = await mkSet('ZZAUTOTEST C682445 Two People', [{ co: 'Alpha', lead: A1 }, { co: 'Bravo', lead: A1 }, { co: 'Charlie', lead: A1 }]);
  await pins([A1.staff_id]);
  const st = await p.context().storageState(); const ctx2 = await browser.newContext({ storageState: st, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true }); const p2 = await ctx2.newPage();
  await go('Board View', set.q); await go('Board View', set.q, p2);
  const colOf = async (pg: Page) => pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${A1.staff_id}"]'); return c ? [...c.querySelectorAll('[data-test-id="board_card_number"]')].map(e => e.textContent.trim()) : []; })()`) as Promise<string[]>;
  const s1 = await colOf(p); o.order0 = s1; o.wo = { w1: s1[0], w2: s1[1], w3: s1[2] }; o.s2 = await colOf(p2);
  const toTop = async (pg: Page, num: string) => { const c = pg.locator(`[data-test-id^="board_card_"]`).filter({ hasText: num }).first(); const b = await c.boundingBox(); const first = await pg.locator(`[data-test-id="board_column_${A1.staff_id}"] [data-test-id^="board_card_"]`).first().boundingBox(); if (!b || !first) return 'missing';
    await pg.mouse.move(b.x + b.width / 2, b.y + 20); await pg.mouse.down(); await pg.mouse.move(b.x + b.width / 2, b.y + 30, { steps: 4 }); await pg.mouse.move(first.x + first.width / 2, first.y + 8, { steps: 20 }); await pg.waitForTimeout(600); await pg.mouse.up(); await pg.waitForTimeout(2500); return 'moved'; };
  o.s3 = { move: await toTop(p, o.wo.w3), order: await colOf(p), messages: await toasts(p) }; await sh(p, 'C682445-n-s3-browser1');
  o.s4 = { move: await toTop(p2, o.wo.w2), order: await colOf(p2), messages2: await toasts(p2), messages1: await toasts(p) }; await sh(p2, 'C682445-n-s4-browser2');
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await search(p, set.q); o.s5 = { order: await colOf(p), messages: await toasts(p) }; await sh(p, 'C682445-n-s5-browser1-refresh');
  await p2.reload({ waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(5000); await search(p2, set.q); o.s6 = { order: await colOf(p2), messages: await toasts(p2) }; await sh(p2, 'C682445-n-s6-browser2-refresh');
  await display(p, 'Tech View'); await p.waitForTimeout(2500); o.s7 = (await groups(p)).find((g: any) => g.id === A1.staff_id)?.rows ?? null; await sh(p, 'C682445-n-s7-techview');
  await ctx2.close().catch(() => {}); await pins(ORIGINAL.pinnedTechnicianIds ?? []);
});

// ───── C682446: moving a timesheet entry to another line takes you off the old line
await run('C682446', async (o) => { o.location = await toHeavy();
  const A1 = await T('C682446', 'Ana');
  const set = await mkSet('ZZAUTOTEST C682446 Timesheet Move', [{ co: 'One', lead: A1 }]); const wo = set.w.One.id; o.wo = set.w.One.number;
  await mkLine(wo, 2); await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
  const ls = await linesRaw(wo); o.lines = ls.map((l: any) => ({ name: l.line_name, status: l.status }));
  for (const l of ls) o['assign_' + l.line_name] = say(await a.post('/api/work-orders/lines/assign-technician', { line_id: l.line_id, workOrderId: wo, staff_id: A1.staff_id }));
  const labor = async (tag: string) => { await p.goto(APP + `/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await sh(p, `C682446-n-${tag}`);
    return Promise.all((await linesRaw(wo)).map(async (l: any) => ({ line: l.line_name, techs: (l.assigned_techs ?? []).map((x: any) => `${x.first_name ?? x.firstName ?? ''} ${x.last_name ?? x.lastName ?? ''}`.trim()), logged: (l.logged_techs ?? []).map((x: any) => JSON.stringify(x).slice(0, 160)), tech_times: (l.tech_times ?? []).length }))); };
  o.before = await labor('s0-lines');
  // step 1-3 on screen: Start under Line-1's Labor, ~1 minute, Stop, Clock Out with Line Completed? off
  const l1 = ls[0]; const btns = await p.evaluate(`[...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.getAttribute('data-test-id') || '') + ':' + b.innerText.replace(/\\s+/g, ' ').trim()).filter(x => /start|clock|stop/i.test(x))`); o.buttonsSeen = btns;
  const start = p.locator('button').filter({ hasText: /^\s*Start\s*$/ }).first(); o.s1 = { start: await start.count() };
  if (o.s1.start) { await start.click(); await p.waitForTimeout(3000); await sh(p, 'C682446-n-s1-started'); await p.waitForTimeout(62000);
    const stop = p.locator('button').filter({ hasText: /^\s*Stop\s*$/ }).first(); o.s2 = { stop: await stop.count() }; if (o.s2.stop) { await stop.click(); await p.waitForTimeout(2500); }
    o.s3 = { dialog: await dialogRead() }; await sh(p, 'C682446-n-s3-clockout-dialog');
    const co = p.locator('.q-dialog button').filter({ hasText: /Clock Out/i }).first(); if (await co.count()) { await co.click(); await p.waitForTimeout(3000); o.s3.clockedOut = true; } }
  o.after3 = await labor('s3-lines');
  // steps 4-9: Timesheets, open the entry, change Line, Save — the dialog is read and dumped so its fields are known
  const openTs = async () => { await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click().catch(() => {}); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({ hasText: /Timesheets/ }).first().click().catch(() => {}); await p.waitForTimeout(4000);
    const rows = (await p.locator('tbody tr').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 160)); await p.locator('tbody tr').last().click().catch(() => {}); await p.waitForTimeout(2500); return { rows, dialog: await dialogRead() }; };
  const setLine = async (name: string, tag: string) => { const d = p.locator('.q-dialog').last(); const f = d.locator('.q-field').filter({ hasText: /^\s*Line/ }).first(); await f.click().catch(() => {}); await p.waitForTimeout(1000);
    const opt = p.locator('.q-menu .q-item').filter({ hasText: name }).first(); const had = await opt.count(); if (had) await opt.click(); await p.waitForTimeout(800); await sh(p, `C682446-n-${tag}`);
    const save = d.locator('button').filter({ hasText: /^\s*Save\s*$/ }).first(); if (await save.count()) await save.click(); await p.waitForTimeout(3000); return { option: had, messages: await toasts(p) }; };
  o.s4 = await openTs(); o.s5 = await setLine(ls[1].line_name, 's5-line2'); o.s6 = await labor('s6-lines');
  o.s7 = await openTs(); o.s8 = await setLine(ls[0].line_name, 's8-line1'); o.s9 = await labor('s9-lines');
});

await a.put(PREF, { value: ORIGINAL }).catch(() => {});
fs.writeFileSync(path.join(EV, 'new6-fix2-1020.json'), JSON.stringify(R, null, 1));
try { await (RUN as any).close?.(); } catch { /* */ }
await done(browser);
