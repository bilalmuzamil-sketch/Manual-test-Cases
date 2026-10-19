/** c96929-live.mts — 19 Oct 2026, LIVE re-test of C96929 ("Before anyone reorders them, a group's work orders follow List's default sort").
 *  Set-up (Rule 107): a technician made for this run only ("ZZAUTOTEST C96929 Kit <n>", leads nothing else); three customers sharing the
 *  start "ZZAUTOTEST F2 Sort <n>" (Alpha Freight = A, Mid Trucking = B, Zeta Hauling = C); four Approved work orders created in the case's
 *  order WO-1 (C), WO-2 (A), WO-3 (B), WO-4 (B) with NO lead; then the lead given AFTER creation, one at a time, in a deliberate order that
 *  is NOT List's A–Z order: WO-1 (C), WO-3 (B), WO-4 (B), WO-2 (A) — each time logged. The live PRD v64 S2-R6 / S9-R14 says a work order
 *  that gets a lead after it was created goes to the bottom of that technician's work, so by the PRD the group follows the order the leads
 *  were given; the case (written to v54) expects List's order. Both are recorded side by side.
 *  User-B: a fresh Admin-role user made now ("ZZAUTOTEST C96929 Sort Viewer <n>") who never saved a sort — opened with switch-user in its
 *  own window (a real sign-in needs the invitation e-mail password, L0441), its saved preference read first (must be empty); the
 *  technician pinned for that user so the column / group is on screen (pins do not order work inside a group).
 *  Readings: List order (step 4), Tech View order in the technician's group (step 6), Board View order in the column (step 8), each with a
 *  picture at 2x (run with QA_DPR=2 WOB_SCALE=2) and the box around the four rows/cards (for annotation). Output EV/c96929-live.json. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, customer, workOrder, workOrders } from './data.mts';
import { EV, t, tab, display, search, groups, boardCols, toColumn, findRow } from './wob.mts';
import { person, roleIds, ensureEligible, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { prefRead } from './fixup-1017.mts';
const { browser, page: p0 } = await open('/workorders?tab=all'); p0.setDefaultTimeout(30_000); const a0 = api(p0);
const o: any = { exitSwitch: (await a0.post('/api/exit-switch-user', {})).status, build: null };
const RUN = String(Date.now() % 100000); const Q = `ZZAUTOTEST F2 Sort ${RUN}`; const D = '@staging.shopview.local';
const W = (ms: number, pg: Page = p0) => pg.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list';
try {
  const ORG0 = (await import('./profile.mts')).ORG;
  const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a0.get(`/api/organizations/${ORG0}/roles?pagination[rowsPerPage]=1000`)).body?.data);
  const RI = await roleIds(a0); const rid = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
  const ADMIN = rid(/^admin(istrator)?$/i), TECH = rid(/^Technician$/i);
  const T = (await person(a0, 'ZZAUTOTEST C96929', `Kit ${RUN}`, { role: TECH, email: `zz.wob.c96929.kit.${RUN}${D}`, clockable: true, workplace: HEAVY })).row;
  o.techEligible = await ensureEligible(a0, T, 'Technician-A');
  const cA = await customer(a0, `${Q} Alpha Freight`, 'C929A'), cB = await customer(a0, `${Q} Mid Trucking`, 'C929B'), cC = await customer(a0, `${Q} Zeta Hauling`, 'C929C');
  // created in the case's order, no lead
  const ids: Record<string, string> = {}; const created: string[] = [];
  for (const [k, c] of [['WO-1', cC], ['WO-2', cA], ['WO-3', cB], ['WO-4', cB]] as const) { ids[k] = await workOrder(a0, c, 'approved', null); created.push(`${k} ${new Date().toISOString()}`); await W(1500); }
  const all = await workOrders(a0, Q); const num = (id: string) => all.find((w: any) => w.id === id)?.number;
  const NAME: Record<string, string> = {}; for (const k of Object.keys(ids)) NAME[num(ids[k])] = `${k} (${k === 'WO-1' ? 'C Zeta' : k === 'WO-2' ? 'A Alpha' : 'B Mid'})`;
  o.workOrders = Object.fromEntries(Object.entries(ids).map(([k, id]) => [k, num(id)])); o.created = created;
  // the leads given AFTER creation, deliberately not A–Z: WO-1 (C), WO-3 (B), WO-4 (B), WO-2 (A)
  o.leadsGiven = [];
  for (const k of ['WO-1', 'WO-3', 'WO-4', 'WO-2']) { const r = await a0.post('/api/work-orders/change-lead-technician', { work_order_id: ids[k], tech_assigned_id: T.staff_id }); o.leadsGiven.push(`${k} ${o.workOrders[k]} at ${new Date().toISOString()} -> ${r.status}`); await W(2500); }
  const back = await workOrders(a0, Q); o.serverLeads = back.map((w: any) => `${NAME[w.number] ?? w.number} ${w.number} lead=${w.techAssignedFirstName ? `${w.techAssignedFirstName} ${w.techAssignedLastName}` : 'none'} start=${w.startDate ?? w.start_date ?? '?'}`);
  console.log(t(), 'START STATE set C96929', JSON.stringify({ search: Q, technician: `ZZAUTOTEST C96929 Kit ${RUN}`, workOrders: o.workOrders, leadsGiven: o.leadsGiven, server: o.serverLeads }));
  // User-B: a fresh Admin user, never saved a sort
  const UB = (await person(a0, 'ZZAUTOTEST C96929', `Sort Viewer ${RUN}`, { role: ADMIN, email: `zz.wob.c96929.viewer.${RUN}${D}`, clockable: false })).row;
  const me = (await candidates(a0)).find((x) => x.name === 'Admin ShopView');
  const v = await viewAs(browser, p0, a0, UB.id, me?.id ?? '', async () => { await a0.post('/api/exit-switch-user', {}); }); const pg = v.page; pg.setDefaultTimeout(30_000); const a = api(pg);
  try {
    await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' });
    o.userB = { name: `ZZAUTOTEST C96929 Sort Viewer ${RUN}`, savedBefore: (await a.get(PREF)).body?.data?.value ?? null };
    console.log(t(), 'START STATE found C96929 User-B', JSON.stringify(o.userB));
    o.userB.pin = (await a.put(PREF, { value: { pinnedTechnicianIds: [T.staff_id] } })).status;
    const order = (nums: string[]) => nums.map((n) => NAME[n] ?? n);
    const shot2 = (n: string) => pg.screenshot({ path: path.join(EV, `C96929-live-${n}.png`) }).catch(() => {});
    const unionBox = (sel: string) => pg.evaluate(`(() => { const els = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => e.getBoundingClientRect().width > 0); if (!els.length) return null; const r = els.map(e => e.getBoundingClientRect()); const x = Math.min(...r.map(b => b.left)), y = Math.min(...r.map(b => b.top)), R = Math.max(...r.map(b => b.right)), B = Math.max(...r.map(b => b.bottom)); return { x: Math.round(x), y: Math.round(y), w: Math.round(R - x), h: Math.round(B - y), dpr: devicePixelRatio }; })()`).catch(() => null);
    const markRows = (nums: string[], rowSel: string) => pg.evaluate(`(() => { document.querySelectorAll('[data-zz-o]').forEach(e => e.removeAttribute('data-zz-o')); const nums = ${JSON.stringify(nums)}; for (const r of document.querySelectorAll(${JSON.stringify(rowSel)})) { const m = (r.innerText.match(/S\\d+-\\d+/) || [])[0]; if (m && nums.includes(m)) r.setAttribute('data-zz-o', '1'); } })()`).catch(() => {});
    const ours = Object.keys(NAME);
    // steps 2-4: List
    await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, pg); await tab(pg, 'All').catch(() => {}); await display(pg, 'List'); await search(pg, Q); await W(3000, pg);
    o.s4_list = order(await pg.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => (r.innerText.match(/S\\d+-\\d+/) || [null])[0]).filter(Boolean)`) as string[]);
    o.s4_sort = await pg.locator('[data-test-id="button_sort"], [aria-label*="Sort" i]').first().innerText().catch(() => null);
    await markRows(ours, 'tbody tr'); o.s4_box = await unionBox('[data-zz-o="1"]'); await shot2('s4-list');
    // steps 5-6: Tech View
    await display(pg, 'Tech View'); await W(3000, pg); if ((await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => '')) !== Q) { await search(pg, Q); await W(2500, pg); }
    await findRow(pg, ids['WO-1'], T.staff_id).catch(() => null);
    o.s6_tech = order(((await groups(pg)).find((g) => g.id === T.staff_id)?.rows ?? []));
    await markRows(ours, '[data-test-id^="tech_view_row_"]'); o.s6_box = await unionBox('[data-zz-o="1"]'); await shot2('s6-tech');
    // steps 7-8: Board View
    await display(pg, 'Board View'); await W(3000, pg); if ((await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => '')) !== Q) { await search(pg, Q); await W(2500, pg); }
    await toColumn(pg, T.staff_id).catch(() => null);
    o.s8_board = order(((await boardCols(pg)).find((c) => c.id === T.staff_id)?.cards ?? []));
    o.s8_box = await unionBox(`[data-test-id="board_column_${T.staff_id}"]`); await shot2('s8-board');
    o.userB.savedAfter = (await prefRead(a))?.display ?? null;
  } finally { await v.close(); }
  o.compare = { leadsGivenOrder: ['WO-1 (C Zeta)', 'WO-3 (B Mid)', 'WO-4 (B Mid)', 'WO-2 (A Alpha)'], list: o.s4_list, techView: o.s6_tech, boardView: o.s8_board,
    techFollowsList: JSON.stringify(o.s6_tech) === JSON.stringify(o.s4_list), techFollowsLeadOrder: JSON.stringify(o.s6_tech) === JSON.stringify(['WO-1 (C Zeta)', 'WO-3 (B Mid)', 'WO-4 (B Mid)', 'WO-2 (A Alpha)']), boardSameAsTech: JSON.stringify(o.s8_board) === JSON.stringify(o.s6_tech) };
  console.log(t(), 'C96929 orders', JSON.stringify(o.compare));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
await a0.post('/api/exit-switch-user', {}).catch(() => {});
fs.writeFileSync(path.join(EV, 'c96929-live.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C96929', JSON.stringify(o).slice(0, 2500)); await done(browser);
