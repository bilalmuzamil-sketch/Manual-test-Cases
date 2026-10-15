/**
 * tech-filter-stg6.mts — 15 Oct 2026, SIXTH pass on STAGING: the four NEW cases of run 498 section 13236 "S1 — Switch between display
 * options", created by the QA lead 14 Oct 21:59 (case text read LIVE from TestRail 15 Oct 05:35 UTC):
 *   C581915 Tech View and Board View offer a Technician filter that List does not
 *   C581916 Choosing technicians hides every other group and column, pinned ones too
 *   C581917 The Technician filter combines with other filters and Clear all filters
 *   C581918 List ignores the Technician choice and Tech View brings it back
 * Table-driven: one run(id) block per case following its CURRENT steps as the test admin "ZZ WOB Runner" (runner.mts) at Staging
 * Heavy Duty - 9919, a picture at every step the Expected judges (WOB_SCALE=2), raw readings only — no verdicts, no TestRail.
 * Data per case is made fresh per run (new customer "<case's customer> <run no.>"):
 *   C581915: "ZZAUTOTEST NT1 Ana Carter" (A), "ZZAUTOTEST NT1 Ana Brooks" (B, made after A), "ZZAUTOTEST NT1 Ben Adams" (C, made after
 *            B) — first names "ZZAUTOTEST NT1 Ana" / "… Ben", so first-name-then-last-name order is B, A, C while C has the earliest
 *            last name and B was added after A; one Approved work order led by A.
 *   C581916: Esther Howard (A), Ralph Edwards (B), Dana Ortiz (C) — WO-1..3 led by A, B, C; WO-4 no lead; WO-5 led by C with its line
 *            given to A; C pinned for the runner.
 *   C581917: Esther (A) and Ralph (B); WO-1 A / WO-2 B for Customer-A, WO-3 A for Customer-B; the runner made them, which makes the
 *            runner their Service Advisor (L0341), so the Service Advisor is changed to Esther Howard: none is "assigned to you".
 *   C581918: Esther (A) and Ralph (B); Customer-A with exactly three Approved work orders: A, B, no lead.
 * The Technician filter is the filter chip whose words read "Technician"; options are picked from the LAST open list, scrolling it
 * until the name is drawn. "Click outside the list" is done by clicking the page's empty top-left area and, if the list is still open,
 * Escape (the reading says which). Each case starts with no filters, density Regular, Assigned to me off, empty Search; the runner's
 * preference is put back at the end.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, groups, allBoardCols, listAllOptions } from './wob.mts';
import { person, roleIds, staffRows, ensureEligible } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const OUT = path.join(EV, 'tech-filter-stg6.json');
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p; p.setDefaultTimeout(15_000);
const a = api(p);
const R: Record<string, any> = { runner: RUN.id.slice(0, 8), started: new Date().toISOString() };
const PREF = '/api/users/me/preferences/work-orders-list';
const ORIGINAL = (await a.get(PREF)).body?.data?.value ?? {};
const RUNNO = String(Date.now() % 100000);
const D = '@staging.shopview.local';
const TECH_ROLE = (await roleIds(a))['Technician'];
const W = (ms: number) => p.waitForTimeout(ms);
const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body?.message ?? r.body?.errors ?? r.body).slice(0, 140) : ''}`;
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const GREASE = canned.find((x: any) => /Full grease service/i.test(String(x.canned_line_name ?? x.name ?? ''))) ?? canned[1] ?? canned[0];

// ── people and data ──
const byEmail = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => String(x.email).toLowerCase() === `zz.wob.${e}${D}`);
async function tech(first: string, last: string, tag: string) { const r = (await person(a, first, last, { role: TECH_ROLE, email: `zz.wob.${tag}${D}`, clockable: true })).row; if (!r) throw new Error(`technician ${first} ${last} not made`); await ensureEligible(a, r, `${first} ${last}`); return { ...r, name: `${first} ${last}`.trim() }; }
async function known(tag: string, name: string) { const r = await byEmail(tag); if (!r) throw new Error(`${name} not found (${tag})`); const fx = await ensureEligible(a, r, name); return { ...r, name, fixes: fx }; }
async function mkWO(c: any, lead: string | null, opts: { lineTech?: string } = {}) {
  const id = await workOrder(a, c, 'estimate', null); const log: string[] = [];
  const ln = (await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: GREASE.id, status: 'authorized' })).body?.data?.line_id;
  const d = (await a.get(`/api/work-orders/lines/${id}`)).body?.data; for (const l of (Array.isArray(d) ? d : d?.collection ?? [])) for (const rq of (l.part_requests ?? [])) await a.post(`/api/work-orders/part/remove-request/${rq.id ?? rq.part_request_id}`, {});
  log.push(`approve ${say(await a.post('/api/work-orders/change-status', { id, status: 'approved' }))}`);
  if (lead) log.push(`lead ${say(await a.post('/api/work-orders/change-lead-technician', { work_order_id: id, tech_assigned_id: lead }))}`);
  if (opts.lineTech && ln) log.push(`line tech ${say(await a.put(`/api/work-orders/lines/${ln}/technicians`, { staffIds: [opts.lineTech] }))}`);
  const w = (await workOrders(a, c.name)).find((x: any) => x.id === id);
  return { id, number: w?.number ?? '?', log: log.filter((x) => / [45]\d\d/.test(x)) };
}
async function cust(base: string) { const name = `${base} ${RUNNO}`; return { ...(await customer(a, name, 'ZZNT')), name }; }

// ── page helpers ──
async function prep(pins: string[] = []) {
  const pv = (await a.get(PREF)).body?.data?.value ?? {}; const v: any = {}; for (const [k, x] of Object.entries(pv)) if (!/^(technicianOrder)$|collaps/i.test(k)) v[k] = x;
  Object.assign(v, { filters: {}, density: 'regular', pinnedTechnicianIds: pins }); const st = (await a.put(PREF, { value: v })).status;
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4500); await tab(p, 'All').catch(() => {});
  const am = p.locator('[data-test-id="filter_chip_assigned_to_me"]').first(); let amOn = null;
  if (await am.count()) { amOn = await am.evaluate((e) => e.getAttribute('aria-pressed') === 'true' || /selected|active|bg-primary/.test(String(e.className))).catch(() => null); if (amOn) { await am.click().catch(() => {}); await W(1500); } }
  return { pref: st, assignedToMeWasOn: amOn };
}
const chips = () => p.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter((e, i, all) => e.getBoundingClientRect().width > 0 && !all.some(o => o !== e && o.contains(e))).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left).map(e => (e.getAttribute('data-test-id') || '').replace('filter_chip_', '') + ': ' + e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60))`) as Promise<string[]>;
const techChip = () => p.locator('[data-test-id^="filter_chip_"]').filter({ hasText: /Technician/ }).first();
const techChipText = async () => (await techChip().count()) ? (await techChip().innerText().catch(() => '')).replace(/\s+/g, ' ').trim() : 'no Technician filter';
async function openTech() { const c = techChip(); if (!(await c.count())) return false; await c.click(); await W(1200); return (await p.locator('.q-menu').count()) > 0; }
/** tick (or untick) one option of the open list by its words, scrolling the LAST open list until it is drawn */
async function toggleOption(name: RegExp) {
  for (let i = 0; i < 120; i++) { const it = p.locator('.q-menu').last().locator('.q-item, .q-checkbox').filter({ hasText: name }).first(); if (await it.count()) { await it.scrollIntoViewIfNeeded().catch(() => {}); await it.click(); await W(1200); return { done: true, scrolls: i }; }
    const mv = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (!s) return false; const b = s.scrollTop; s.scrollTop += 250; return s.scrollTop !== b; })()`).catch(() => false); await W(250); if (!mv && i > 2) break; }
  return { done: false };
}
const ticked = () => p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null; return [...m.querySelectorAll('.q-item, .q-checkbox')].filter(e => e.querySelector('[aria-checked="true"], .q-checkbox__inner--truthy') || e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-selected') === 'true').map(e => e.innerText.replace(/\\s+/g, ' ').trim()); })()`) as Promise<string[] | null>;
// 15 Oct 2026 (wave 23, sixth pass): the fixed point (40, 140) landed on "Create Work Order" once the search text widened the toolbar and
// the button wrapped to a second row, so a New Work Order window opened and every later click timed out behind it. Now the click goes to
// the first candidate point whose element is NOT a button, link, field, tab, header cell or card (checked with elementFromPoint), and a
// window that opened anyway is closed and recorded.
async function clickOutside() {
  const pt = await p.evaluate(`(() => { const bad = 'button, a, input, textarea, [role=button], [role=tab], th, .q-btn, .q-field, .q-tab, [data-test-id^="board_card_"], [data-test-id^="tech_view_row_"], .q-menu';
    for (const [x, y] of [[1100, 95], [900, 95], [700, 95], [1400, 230], [40, 230], [800, 600]]) { const e = document.elementFromPoint(x, y); if (e && !e.closest(bad)) return [x, y]; } return null; })()`).catch(() => null) as number[] | null;
  if (pt) await p.mouse.click(pt[0], pt[1]); else await p.keyboard.press('Escape'); await W(900);
  let how = pt ? `clicked outside at ${pt[0]},${pt[1]}` : 'Escape (no safe empty spot found)';
  if (await p.locator('.q-menu').count()) { await p.keyboard.press('Escape'); await W(700); how += ', then Escape (list was still open)'; }
  if (await p.locator('.q-dialog').count()) { await p.keyboard.press('Escape'); await W(700); how += ', a window had opened and was closed'; }
  return how; }
const emptyState = () => p.evaluate(`(() => { const t = (document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' '); const m = t.match(/No work orders match[^.]*\\.?[^.]*\\.?/); return { message: m ? m[0].slice(0, 160) : null, hint: /Try removing a filter to widen your results\\./.test(t), clearAll: [...document.querySelectorAll('button, .q-btn')].some(b => /Clear all filters/i.test(b.innerText)) }; })()`);
const listRows = () => p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/\\bS\\d+-\\d+\\b/) || [])[0]).filter(Boolean)`) as Promise<string[]>;
/** every Tech View group header in screen order (the table is walked top to bottom; the virtual list draws only what is on screen) */
async function allGroupNames() { const seen: string[] = []; await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`); await W(500);
  for (let i = 0; i < 150; i++) { for (const n of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_name_"]')].map(e => e.textContent.trim())`)) as string[]) if (!seen.includes(n)) seen.push(n);
    const mv = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (!s) return false; const b = s.scrollTop; s.scrollTop += 600; return s.scrollTop !== b; })()`); await W(300); if (!mv) break; }
  await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); if (s) s.scrollTop = 0; })()`); return seen; }
const label = (m: Record<string, string>) => (n: string) => m[n] ?? n;
async function run(id: string, f: (o: any) => Promise<void>) {
  if (!want(id)) return; const o: any = (R[id] = { started: t() });
  try { await f(o); } catch (e: any) { o.error = String(e?.message || e).slice(0, 400); await shot(p, `${id}-error`); }
  try { await p.keyboard.press('Escape').catch(() => {}); await (globalThis as any).__shotEach?.(id); } catch { /* */ }
  o.ended = t(); console.log(t(), id, JSON.stringify(o).slice(0, 3000)); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
}

await run('C581915', async (o) => {
  const A = await tech('ZZAUTOTEST NT1 Ana', 'Carter', 'nt1.ana.carter'), B = await tech('ZZAUTOTEST NT1 Ana', 'Brooks', 'nt1.ana.brooks'), C = await tech('ZZAUTOTEST NT1 Ben', 'Adams', 'nt1.ben.adams');
  o.people = { A: A.name, B: B.name, C: C.name, createdOrder: [A, B, C].map((x: any) => `${x.name} ${x.created_at ?? x.createdAt ?? x.created ?? ''}`) };
  const c = await cust('ZZAUTOTEST NT1 Technician Filter List'); o.wo1 = await mkWO(c, A.staff_id);
  o.prep = await prep(); await display(p, 'Tech View');
  const groupsAll = await allGroupNames(); o.s3_groups = { count: groupsAll.length, first: groupsAll.slice(0, 12), positions: Object.fromEntries([A, B, C].map((x: any) => [x.name, groupsAll.indexOf(x.name)])) }; await shot(p, 'C581915-s3-tech-groups');
  o.s4_filterBar = await chips(); await shot(p, 'C581915-s4-filter-bar');
  o.s5_opened = await openTech(); const opts = await listAllOptions(p); await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].pop(); const s = m && ([m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4) || m); if (s) s.scrollTop = 0; })()`).catch(() => {}); await W(400);
  o.s6_options = { count: opts.length, first: opts.slice(0, 8), positions: Object.fromEntries([A, B, C].map((x: any) => [x.name, opts.findIndex((y) => y.includes(x.name))])), notInGroups: opts.filter((x) => x !== 'Unassigned' && !groupsAll.some((g) => x.includes(g))).slice(0, 10), groupsNotInOptions: groupsAll.filter((g) => g !== 'Unassigned' && !opts.some((x) => x.includes(g))).slice(0, 10) };
  await shot(p, 'C581915-s6-technician-list');
  o.s7_tickA = await toggleOption(new RegExp(A.name)); if (!(await p.locator('.q-menu').count())) { o.s8_reopened = await openTech(); }
  o.s8_tickB = await toggleOption(new RegExp(B.name)); o.s9_tickedInList = await ticked(); await shot(p, 'C581915-s9-two-ticked');
  o.s9_close = await clickOutside(); o.s9_chip = await techChipText(); await shot(p, 'C581915-s9-chip');
  await display(p, 'Board View'); o.s11_filterBar = await chips(); await shot(p, 'C581915-s11-board-filter-bar');
  await openTech(); const bopts = await listAllOptions(p); o.s12_boardOptions = { count: bopts.length, sameAsTechView: JSON.stringify(bopts) === JSON.stringify(opts), first: bopts.slice(0, 8) }; await shot(p, 'C581915-s12-board-technician-list'); await clickOutside();
  await display(p, 'List'); o.s14_listFilterBar = await chips(); await shot(p, 'C581915-s14-list-filter-bar');
});

await run('C581916', async (o) => {
  const A = await known('esther.howard', 'Esther Howard'), B = await known('ralph.edwards', 'Ralph Edwards'), C = await known('dana.ortiz', 'Dana Ortiz');
  const c = await cust('ZZAUTOTEST NT2 Technician Filter Groups');
  const w1 = await mkWO(c, A.staff_id), w2 = await mkWO(c, B.staff_id), w3 = await mkWO(c, C.staff_id), w4 = await mkWO(c, null), w5 = await mkWO(c, C.staff_id, { lineTech: A.staff_id });
  const nm = label({ [w1.number]: 'WO-1', [w2.number]: 'WO-2', [w3.number]: 'WO-3', [w4.number]: 'WO-4', [w5.number]: 'WO-5' }); o.wos = [w1, w2, w3, w4, w5].map((w) => `${nm(w.number)} ${w.number}${w.log.length ? ' ' + w.log.join(';') : ''}`);
  o.prep = await prep([C.staff_id]); await display(p, 'Tech View'); await search(p, c.name);
  await openTech(); o.s5 = await toggleOption(/^\s*Unassigned\s*$/); if (!(await p.locator('.q-menu').count())) await openTech(); o.s6 = await toggleOption(/Esther Howard/); o.tickedInList = await ticked();
  o.s7_close = await clickOutside(); o.chip = await techChipText();
  const gs = await groups(p); o.s8_groups = gs.map((g) => `${g.name} (${g.count}): ${g.rows.map(nm).join(', ')}`); await shot(p, 'C581916-s8-tech');
  await display(p, 'Board View'); const cols = await allBoardCols(p); o.s10_columns = cols.map((x) => `${x.name}${x.pinned === 'true' ? ' [pinned]' : ''} (${x.count}): ${x.cards.map(nm).join(', ')}`); await shot(p, 'C581916-s10-board');
  await openTech(); for (const re of [/^\s*Unassigned\s*$/, /Esther Howard/]) await toggleOption(re); o.s11_tickedAfterClear = await ticked(); await clickOutside(); o.s11_chip = await techChipText();
  const cols2 = await allBoardCols(p); o.s12_columns = { count: cols2.length, first: cols2.slice(0, 6).map((x) => `${x.name}${x.pinned === 'true' ? ' [pinned]' : ''}`), danaPinned: cols2.find((x) => x.id === C.staff_id)?.pinned ?? 'no column' }; await shot(p, 'C581916-s12-board-cleared');
});

await run('C581917', async (o) => {
  const A = await known('esther.howard', 'Esther Howard'), B = await known('ralph.edwards', 'Ralph Edwards');
  const cA = await cust('ZZAUTOTEST NT3 Technician Filter Mix'), cB = await cust('ZZAUTOTEST NT3 Other Customer');
  const w1 = await mkWO(cA, A.staff_id), w2 = await mkWO(cA, B.staff_id), w3 = await mkWO(cB, A.staff_id);
  for (const w of [w1, w2, w3]) o[`advisor ${w.number}`] = say(await a.post('/api/work-orders/change-service-advisor', { work_order_id: w.id, service_advisor_id: A.staff_id }));
  const nm = label({ [w1.number]: 'WO-1', [w2.number]: 'WO-2', [w3.number]: 'WO-3' });
  o.prep = await prep(); await display(p, 'Tech View'); await search(p, cA.name);
  await openTech(); o.s4 = await toggleOption(/Esther Howard/); o.s5_close = await clickOutside();
  const rowsNow = async () => (await groups(p)).filter((g) => g.rows.length).map((g) => `${g.name}: ${g.rows.map(nm).join(', ')}`);
  o.s6 = { chip: await techChipText(), groups: await rowsNow() }; await shot(p, 'C581917-s6');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').first().click(); await W(2500); o.s8 = { empty: await emptyState(), groups: await rowsNow() }; await shot(p, 'C581917-s8-assigned-to-me');
  await p.locator('[data-test-id="filter_chip_assigned_to_me"]').first().click(); await W(2500); o.s10 = { groups: await rowsNow() }; await shot(p, 'C581917-s10');
  await p.locator('[data-test-id="filter_chip_status"]').first().click(); await W(1000); const paid = p.locator('[data-test-id="filter_option_status_paid"]').first();
  if (await paid.count()) await paid.click(); else await toggleOption(/^\s*Paid\s*$/); await W(1000); o.s12_close = await clickOutside();
  o.s13 = { empty: await emptyState(), chips: await chips() }; await shot(p, 'C581917-s13-paid');
  const clr = p.locator('button, .q-btn').filter({ hasText: /Clear all filters/i }).first(); o.s14_clearButton = await clr.count(); if (o.s14_clearButton) { await clr.click(); await W(2500); }
  o.s15 = { technicianChip: await techChipText(), chips: await chips(), search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null), groups: await rowsNow() };
  if (!o.s15.search) { await search(p, cA.name); o.s15.groupsWithSearchRetyped = await rowsNow(); }
  await shot(p, 'C581917-s15-after-clear');
});

await run('C581918', async (o) => {
  const A = await known('esther.howard', 'Esther Howard'), B = await known('ralph.edwards', 'Ralph Edwards');
  const c = await cust('ZZAUTOTEST NT4 Technician Filter Memory');
  const w1 = await mkWO(c, A.staff_id), w2 = await mkWO(c, B.staff_id), w3 = await mkWO(c, null);
  const nm = label({ [w1.number]: 'WO-1', [w2.number]: 'WO-2', [w3.number]: 'WO-3' });
  o.prep = await prep(); await display(p, 'Tech View'); await search(p, c.name);
  await openTech(); o.s4 = await toggleOption(/Esther Howard/); o.s5_close = await clickOutside();
  const rowsNow = async () => (await groups(p)).filter((g) => g.rows.length).map((g) => `${g.name}: ${g.rows.map(nm).join(', ')}`);
  o.s6 = { chip: await techChipText(), groups: await rowsNow() }; await shot(p, 'C581918-s6');
  await display(p, 'List'); o.s8 = { rows: (await listRows()).map(nm), chips: await chips(), search: await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => null) }; await shot(p, 'C581918-s8-list');
  await display(p, 'Tech View'); o.s10 = { chip: await techChipText(), groups: await rowsNow() }; await shot(p, 'C581918-s10-tech-again');
  await p.locator('[data-test-id="filter_chip_vehicleHere"]').first().click(); await W(900);
  const no = p.locator('[data-test-id="filter_option_vehicleHere_0"]').first(); if (await no.count()) await no.click(); else await toggleOption(/^\s*No\s*$/); await W(1000);
  o.s12_close = await clickOutside(); o.s12_chips = await chips(); await shot(p, 'C581918-s12-asset-on-site-no');
  await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000);
  o.s14 = { technicianChip: await techChipText(), assetOnSiteChip: await p.locator('[data-test-id="filter_chip_vehicleHere"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null), chips: await chips(), display: await p.evaluate(`(['List','Tech View','Board View'].find(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return b && b.getAttribute('aria-pressed') === 'true'; }) || null)`), savedFilters: JSON.stringify(((await a.get(PREF)).body?.data?.value ?? {}).filters ?? null).slice(0, 300) };
  await shot(p, 'C581918-s14-after-reload');
});

R.restorePref = (await a.put(PREF, { value: ORIGINAL })).status; R.ended = new Date().toISOString(); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
await RUN.end().catch(() => {});
await done(browser);
