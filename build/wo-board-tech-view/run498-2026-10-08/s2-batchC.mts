/**
 * S2 Tech View, batch C (2026-10-08): the cases that need named staff — C96926 name order, C96930 who gets a
 * group, C96934 deactivated lead, C96938 name on hover, C368161 initials — and second measurements of
 * C96927, C368125, C96929, C368127, C368130. Staff are made by staff.mts; deactivation goes through the
 * screen (Settings > Staff > edit > Deactivate Account) and is undone afterwards.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { api, candidates, seedCase, workOrders, customer, workOrder } from './data.mts';
import { EV, t, shot, display, tab, search, groups, toggleGroup, read, switchLocUI, toColumn } from './wob.mts';
import { viewAs } from './viewas.mts';
import { staffRows, person, HEAVY } from './staff.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p } = await open('/workorders?tab=all');
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = {};
const ORG = (await import('./profile.mts')).ORG;
const D = '@staging.shopview.local';
const techs = await candidates(a);
const by = (n: string) => techs.find((x) => x.name === n)!;
const me = by('Admin ShopView'), tA = by('Ayesha Khan');
const sid = async (email: string) => (await staffRows(a, email)).find((x) => x.email === email);
const tv = async (name: string) => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'Tech View'); if (name) await search(p, name); };
const OWN_END = new Set(['C96926', 'C96929', 'C368127', 'C96930']); // 15 Oct 2026: these take their end picture where the result shows
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); if (!OWN_END.has(id)) await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000)); // 15 Oct 2026: 2000 cut readings short
  fs.writeFileSync(path.join(EV, 's2-batchC.json'), JSON.stringify(R, null, 1));
}
const calls: string[] = []; p.on('request', (q) => { if (q.method() !== 'GET' && /\/api\//.test(q.url()) && !/sentry|envelope|preferences/.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)} ${(q.postData() || '').slice(0, 160)}`); });
async function setActive(name: string, on: boolean) {
  // Settings > Staff (read off the build 2026-10-08): tabs Active(n) / Deactivated(n); "Search" is a button that opens
  // the box; each row ends with an edit icon that opens the staff member's form
  calls.length = 0;
  await p.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  if (on) { await p.getByText(/^Deactivated\(\d+\)$/).first().click().catch(() => {}); await p.waitForTimeout(2500); }
  await p.getByText('Search', { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(600);
  const inputs = p.locator('input:visible'); R['staffInputs_' + name] = await inputs.evaluateAll((es) => es.map((e) => (e as HTMLInputElement).placeholder || e.getAttribute('aria-label') || e.getAttribute('data-test-id') || '?'));
  const box = p.locator('input[data-test-id="page_search_input"]:visible, input[placeholder*="earch" i]:visible').first();
  // the staff search does not match "First Last" together (seen 2026-10-08: "Ina Active" finds nobody), so search the email
  const email0 = `zz.wob.${name.toLowerCase().replace(' ', '.')}`;
  if (await box.count()) await box.fill(email0); else await inputs.first().fill(email0);
  await p.waitForTimeout(3000); await shot(p, `staff-search-${name.replace(/\s/g, '')}-${on ? 'on' : 'off'}`);
  const email = `zz.wob.${name.toLowerCase().replace(' ', '.')}`;
  const row = p.locator('tr').filter({ hasText: email }).first();
  R['staffRowHtml_' + name] = await row.evaluate((e) => e.outerHTML.slice(-700)).catch(() => 'row not found');
  await row.locator('td').last().locator('button, [role=button], i, a').first().click(); await p.waitForTimeout(2500); await shot(p, `staff-edit-${name.replace(/\s/g, '')}-${on ? 'on' : 'off'}`);
  const btn = p.locator('button').filter({ hasText: on ? /(^|\s)(Activate|Reactivate)( Account)?\s*$/i : /Deactivate/i }).first();
  const label = await btn.innerText().catch(() => null);
  if (!label) return { done: false, url: p.url().replace(APP, ''), buttons: await p.evaluate(`[...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(-25)`) };
  await btn.click(); await p.waitForTimeout(1500);
  const ctext = await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ').slice(0, 200))`);
  const conf = p.locator('.q-dialog').last().locator('button').filter({ hasText: /Deactivate|Activate|Confirm|Yes|OK/i }).last();
  if (await conf.count()) { await conf.click(); await p.waitForTimeout(3000); }
  const save = p.locator('button').filter({ hasText: /^\s*Save( & Close)?\s*$/ }).first(); if (await save.count()) { await save.click().catch(() => {}); await p.waitForTimeout(2500); }
  return { done: true, label, confirm: ctext, calls: [...calls] };
}
async function scrollToGroupId(id: string) {
  const u = (await groups(p)).find((g) => g.id === 'unassigned'); const wasOpen = u && !u.collapsed; if (wasOpen) await toggleGroup(p, 'unassigned');
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`);
  for (let i = 0; i < 80; i++) { const l = p.locator(`[data-test-id="tech_view_group_${id}"]`); if (await l.count()) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${id}"]')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(1200); return { found: true, wasOpen }; } await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 400`); await p.waitForTimeout(300); }
  return { found: false, wasOpen };
}

// ── staff the cases need ───────────────────────────────────────────────
const rolesR = await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`);
const roles: any[] = rolesR.body?.data?.collection ?? rolesR.body?.data ?? [];
const role = (re: RegExp) => roles.find((r) => re.test(r.label ?? r.name ?? ''))?.id;
const techRole = role(/^Technician$/), officeRole = role(/^Office( User)?$/), tcRole = role(/^Time Clock( User)?$/);
R.roles = { count: roles.length, labels: roles.map((r) => r.label ?? r.name).slice(0, 20), techRole, officeRole, tcRole };
console.log(t(), 'roles', JSON.stringify(R.roles));
for (const [f, l, o] of [['Olive', 'Office', { role: officeRole, email: 'zz.wob.olive.office' + D, clockable: true }], ['Tim', 'Clockuser', { role: tcRole, email: 'zz.wob.tim.clockuser' + D, clockable: true }]] as [string, string, any][]) {
  if (o.role) { const r = await person(a, f, l, o); R[`staff_${f}`] = { role: r.row?.role_label, clockable: r.row?.clockable, active: r.row?.is_active, log: r.log }; }
}
// Esther (and the other technicians) billable; Billy not — billable is stored as 0/1
for (const e of ['esther.howard', 'aaron.zed', 'aaron.baker', 'brenda.martinez', 'chris.lee.1', 'chris.lee.2', 'ina.active', 'ralph.edwards', 'maximiliana']) await person(a, '', '', { role: techRole, email: `zz.wob.${e}${D}`, billable: 1 as any });
R.billable = Object.fromEntries(await Promise.all(['esther.howard', 'billy.nobill'].map(async (e) => [e, (await sid(`zz.wob.${e}${D}`))?.billable])));
console.log(t(), 'billable', JSON.stringify(R.billable), 'office/tc', JSON.stringify([R.staff_Olive, R.staff_Tim]));

await run('C96930', async () => {
  const ina0 = await sid('zz.wob.ina.active' + D); const ina = ina0?.is_active ? await setActive('Ina Active', false) : 'already deactivated';
  R.C96930 = { inaDeactivate: ina, inaActiveNow: (await sid('zz.wob.ina.active' + D))?.is_active };
  const names = ['Esther Howard', 'Billy Nobill', 'Ina Active', 'Nick Noclock', 'Olive Office', 'Tim Clockuser', 'Ella Elsewhere'];
  // every eligible technician keeps a group under a search, and a narrow search keeps the table short enough to walk
  await tv('ZZAUTOTEST F2 No Work Text');
  const un = (await groups(p)).find((g) => g.id === 'unassigned'); if (un && !un.collapsed) await toggleGroup(p, 'unassigned');
  const gs = (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_name_"]')].map(e => e.textContent.trim())`)) as string[];
  // a group further down is only drawn when scrolled to, so walk the table
  const seen = new Set(gs);
  for (let i = 0; i < 60; i++) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 900`); await p.waitForTimeout(350); for (const n of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_name_"]')].map(e => e.textContent.trim())`)) as string[]) seen.add(n); }
  R.C96930.tech = Object.fromEntries(names.map((n) => [n, seen.has(n)])); R.C96930.techGroups = seen.size;
  await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(800); if (un && !un.collapsed) await toggleGroup(p, 'unassigned').catch(() => {});
  await display(p, 'Board View');
  const cols = new Set<string>();
  for (let i = 0; i < 40; i++) { for (const n of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_name_"], [data-test-id^="board_column_header_"]')].map(e => e.innerText.split('\\n').filter(x => /[a-z]{3}/i.test(x) && !/drag_indicator|push_pin|assignment|person/.test(x))[0] || '')`)) as string[]) if (n) cols.add(n.trim()); await p.evaluate(`(() => { const h = document.querySelector('.board-view__scroller'); if (h) h.scrollLeft += 900; })()`); await p.waitForTimeout(350); }
  R.C96930.board = Object.fromEntries(names.map((n) => [n, cols.has(n)])); R.C96930.boardColumns = cols.size;
  await display(p, 'List');
  R.C96930.inaKeptInactive = 'Ina Active stays deactivated: that is her set-up for this case';
  // 15 Oct 2026 (staging second pass): the reading of "no group" proves something only if each person exists as the case
  // describes, so the staff records are read back here: role, Time Clock, active, billable, Location (and every location)
  R.C96930.staffProof = Object.fromEntries(await Promise.all(names.map(async (n) => { const e = `zz.wob.${n.toLowerCase().replace(' ', '.')}${D}`; const r = await sid(e);
    return [n, r ? { email: r.email, role: r.role_label, timeClock: r.clockable, active: r.is_active, billable: r.billable, location: r.defaultWorkplaceName ?? r.workplace_name ?? r.workplace_id, workplaces: (r.workplaces ?? r.departments ?? []).map((x: any) => x.name ?? x.workplace_name ?? x.label ?? x).slice(0, 6) } : 'NOT FOUND']; })));
  R.C96930.offeredAsLead = Object.fromEntries(names.map((n) => [n, (techs.some((x) => x.name === n))]));
  // 15 Oct 2026 (wave 11, picture only — the reading above is unchanged): the end picture showed List. Now, for each of the seven people,
  // a picture of Tech View and of Board View at the place the person's group / column sits (Esther Howard, Billy Nobill) or WOULD sit
  // in name order (the other five: the picture shows the neighbouring groups / columns either side and no group for that person).
  // The screen order is read by walking the whole table / board; R.C96930.pictures says what each picture shows.
  const slug = (n: string) => n.replace(/[^A-Za-z]+/g, '-');
  const spot = (order: string[], n: string) => { if (order.includes(n)) return { shows: n, exists: true };
    const after = order.filter((x) => x !== 'Unassigned').find((x) => x.localeCompare(n) > 0) ?? null; const i = after ? order.indexOf(after) : order.length; return { shows: after ?? order[order.length - 1], before: order[i - 1] ?? null, after, exists: false }; };
  R.C96930.pictures = { tech: {}, board: {} };
  await tv('ZZAUTOTEST F2 No Work Text');
  { const un2 = (await groups(p)).find((g) => g.id === 'unassigned'); if (un2 && !un2.collapsed) await toggleGroup(p, 'unassigned'); }
  const torder: string[] = []; await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(600);
  for (let i = 0; i < 120; i++) { for (const n of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_group_name_"]')].map(e => e.textContent.trim())`)) as string[]) if (!torder.includes(n)) torder.push(n);
    const moved = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); const b = s.scrollTop; s.scrollTop += 600; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; }
  R.C96930.techOrderLength = torder.length;
  for (const n of names) { const sp = spot(torder, n); await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(400);
    for (let i = 0; i < 120 && !(await p.locator('[data-test-id^="tech_view_group_name_"]').filter({ hasText: new RegExp('^\\s*' + sp.shows.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$') }).count()); i++) { const moved = await p.evaluate(`(() => { const s = document.querySelector('.q-table__middle'); const b = s.scrollTop; s.scrollTop += 600; return s.scrollTop !== b; })()`); await p.waitForTimeout(300); if (!moved) break; }
    await p.locator('[data-test-id^="tech_view_group_name_"]').filter({ hasText: sp.shows }).first().evaluate((e) => e.scrollIntoView({ block: 'center' })).catch(() => {}); await p.waitForTimeout(800);
    await shot(p, `C96930-tech-${slug(n)}`); R.C96930.pictures.tech[n] = { ...sp, picture: `C96930-tech-${slug(n)}.png` }; }
  await shot(p, 'C96930-end');
  await display(p, 'Board View'); await p.waitForTimeout(1500);
  const bcols: { id: string; name: string }[] = []; await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (h) h.scrollLeft = 0; })()`); await p.waitForTimeout(500);
  for (let i = 0; i < 250; i++) { for (const c of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_name_"]')].map(e => ({ id: e.getAttribute('data-test-id').replace('board_column_name_', ''), name: e.textContent.trim() }))`)) as { id: string; name: string }[]) if (!bcols.some((x) => x.id === c.id)) bcols.push(c);
    const moved = await p.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"], .board-view__scroller'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft += 900; return h.scrollLeft !== b; })()`); await p.waitForTimeout(300); if (!moved) break; }
  R.C96930.boardOrderLength = bcols.length; const border = bcols.map((x) => x.name);
  for (const n of names) { const sp = spot(border, n); const id = bcols.find((x) => x.name === sp.shows)?.id;
    if (id) { await toColumn(p, id); await p.mouse.move(1, 1); await p.waitForTimeout(600); }
    await shot(p, `C96930-board-${slug(n)}`); R.C96930.pictures.board[n] = { ...sp, picture: `C96930-board-${slug(n)}.png`, reached: !!id }; }
  await display(p, 'List');
});

// ── as User-B for name order and default sort ─────────────────────────
const UB = 'zzautotest.wob.userb.1008@staging.shopview.local';
const ub = (await staffRows(a, UB)).find((x) => x.email === UB);
async function asUserB<T>(f: () => Promise<T>): Promise<T> {
  const s = await a.post('/api/switch-user', { user_id: ub.id }); if (s.status >= 300) throw new Error(`switch ${s.status}`);
  await p.waitForTimeout(800); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') });
  try { return await f(); } finally { const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); await p.waitForTimeout(800); }
}
async function scrollToGroup(id: string) {
  const u = (await groups(p)).find((g) => g.id === 'unassigned'); const wasOpen = u && !u.collapsed; if (wasOpen) await toggleGroup(p, 'unassigned');
  for (let i = 0; i < 60; i++) { if (await p.locator(`[data-test-id="button_tech_view_group_toggle_${id}"]`).count()) return { found: true, wasOpen }; await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 500`); await p.waitForTimeout(350); }
  return { found: false, wasOpen };
}
const five = [['Aaron Zed', 'aaron.zed'], ['Aaron Baker', 'aaron.baker'], ['Brenda Martinez', 'brenda.martinez'], ['Chris Lee (first)', 'chris.lee.1'], ['Chris Lee (second)', 'chris.lee.2']];
await run('C96926', async () => {
  const ids = await Promise.all(five.map(async ([, e]) => (await sid(`zz.wob.${e}${D}`))?.staff_id));
  const wos = await seedCase(a, 'ZZAUTOTEST F2 Name Order', 'ZZF2NO', ids.map((id) => ({ lead: id })));
  const leadOf = Object.fromEntries((await workOrders(a, 'ZZAUTOTEST F2 Name Order')).map((w: any) => [w.techAssignedId, w.number]));
  R.C96926 = { wo1_firstChrisLee: leadOf[ids[3]], wo2_secondChrisLee: leadOf[ids[4]] };
  await asUserB(async () => {
    R.C96926.pinsB = ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).pinnedTechnicianIds ?? null;
    await tv('');
    const order: string[] = []; const seen = new Set<string>();
    const u = (await groups(p)).find((g) => g.id === 'unassigned'); if (u && !u.collapsed) await toggleGroup(p, 'unassigned');
    for (let i = 0; i < 60; i++) { for (const g of await groups(p)) if (!seen.has(g.id)) { seen.add(g.id); order.push(g.id); } await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 500`); await p.waitForTimeout(300); }
    const nm = Object.fromEntries(techs.map((x) => [x.id, x.name])); nm['unassigned'] = 'Unassigned';
    ids.forEach((id, i) => { nm[id!] = five[i][0]; });
    R.C96926.techAll = order.map((i) => nm[i] ?? i);
    R.C96926.tech = order.filter((i) => i === 'unassigned' || ids.includes(i)).map((i) => nm[i]);
    R.C96926.techNeighbours = R.C96926.techAll.slice(0, 12);
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await toggleGroup(p, 'unassigned').catch(() => {});
    await display(p, 'Board View');
    const bOrder = (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => e.getAttribute('data-test-id')).filter(x => /^board_column_(unassigned|[0-9a-f-]{36})$/.test(x)).map(x => x.replace('board_column_', ''))`)) as string[];
    let all = [...bOrder];
    for (let i = 0; i < 30; i++) { await p.evaluate(`(() => { const h = document.querySelector('.board-view__scroller'); if (h) h.scrollLeft += 900; })()`); await p.waitForTimeout(300); for (const x of (await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => e.getAttribute('data-test-id')).filter(x => /^board_column_(unassigned|[0-9a-f-]{36})$/.test(x)).map(x => x.replace('board_column_', ''))`)) as string[]) if (!all.includes(x)) all.push(x); }
    R.C96926.board = all.filter((i) => i === 'unassigned' || ids.includes(i)).map((i) => nm[i]);
    R.C96926.boardAll = all.map((i) => nm[i] ?? i).slice(0, 60);
    // 15 Oct 2026 (Rule 130): pictures of the five test technicians' columns, first one at the left edge
    if (await toColumn(p, ids[1]!)) { await p.evaluate(`document.querySelector('[data-test-id="board_column_${ids[1]}"]')?.scrollIntoView({ inline: 'start', block: 'nearest' })`); await p.waitForTimeout(1000); }
    await shot(p, 'C96926-board');
    await display(p, 'Tech View');
    { const u2 = (await groups(p)).find((g) => g.id === 'unassigned'); if (u2 && !u2.collapsed) await toggleGroup(p, 'unassigned'); }
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(600);
    for (let i = 0; i < 80; i++) { if (await p.locator(`[data-test-id="tech_view_group_${ids[1]}"]`).count()) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${ids[1]}"]')?.scrollIntoView({ block: 'start' })`); await p.waitForTimeout(1200); break; } await p.evaluate(`document.querySelector('.q-table__middle').scrollTop += 400`); await p.waitForTimeout(300); }
    await shot(p, 'C96926-tech'); (globalThis as any).__shotEach && await (globalThis as any).__shotEach('C96926');
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`);
    await display(p, 'List');
  });
});

await run('C96929', async () => {
  // 15 Oct 2026 (staging second pass): every reading was empty — the three work orders (Zeta Hauling, Alpha Freight, Mid Trucking,
  // led by Carol Neal) were made on the QA branch only and never on staging, and the "User-B" used has a saved List sort.
  // Now: (1) the three customers are made here, IN THIS ORDER (Zeta, Alpha, Mid), each with one Approved work order led by Carol
  // Neal; their names carry one shared word "ZZ96929" after the case's names, so a search for it shows exactly these three and
  // customer-name A-Z order is unchanged; (2) any other work order Carol leads is given no lead, so she leads exactly these three;
  // (3) the check is made by a BRAND-NEW user (Admin role, Time Clock off) who has never saved a sort, in their own window
  // (viewAs), reading List, then Carol's group in Tech View, then her column in Board View, each with the search applied.
  const carol = by('Carol Neal');
  if (!carol) throw new Error('Carol Neal is not offered as a technician at this location');
  const TOK = 'ZZ96929'; const nm: Record<string, string> = {}; // 16 Oct 2026: Mid Trucking's two work orders are told apart below by number
  for (const c of ['Zeta Hauling', 'Alpha Freight', 'Mid Trucking']) {
    const name = `${c} ${TOK}`; let have = await workOrders(a, name);
    if (!have.length) { await workOrder(a, await customer(a, name, `ZZ29${c.slice(0, 2).toUpperCase()}`), 'approved', carol.id); have = await workOrders(a, name); }
    for (const w of have) { nm[w.number] = c; if (w.techAssignedId !== carol.id) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: carol.id }); }
    // 16 Oct 2026 (case rewritten 15 Oct): Customer-B (Mid Trucking) now has TWO work orders, the fourth made last, so the tie inside
    // one customer can be compared with List. Made once; a later run finds both by name.
    if (c === 'Mid Trucking' && have.length < 2) { await workOrder(a, await customer(a, name, 'ZZ29MI'), 'approved', carol.id); for (const w of await workOrders(a, name)) nm[w.number] = c; }
  }
  R.C96929_midNumbers = Object.keys(nm).filter((k) => nm[k] === 'Mid Trucking');
  for (const k of R.C96929_midNumbers) nm[k] = `Mid Trucking ${k}`;
  const others: string[] = [];
  for (let pg = 1; pg < 40; pg++) { const r = await a.get(`/api/work-orders?pagination[page]=${pg}&pagination[rowsPerPage]=200&filters[0][field]=tech_assigned_id&filters[0][value]=${carol.id}`); const ws = r.body?.data?.work_orders ?? [];
    for (const w of ws) if (!nm[w.number] && w.techAssignedId === carol.id) { const x = await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: null }); others.push(`${w.number} -> no lead ${x.status}`); }
    if (ws.length < 200) break; }
  R.C96929 = { lead: carol.name, seeded: nm, otherWorkOrdersUnassigned: others };
  // the brand-new user
  const rl = (await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data; const rr: any[] = Array.isArray(rl) ? rl : rl?.collection ?? [];
  const adminRole = rr.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id;
  const deps = (await a.get('/api/departments')).body?.data; const dl = Array.isArray(deps) ? deps : deps?.collection ?? [];
  const email = `zzautotest.wob.sort.${Date.now()}${D}`;
  const cr = await a.post('/api/iam/create', { email, first_name: 'ZZAUTOTEST', last_name: 'Never Sorted', role_id: adminRole, departments: [(dl.find((d: any) => (d.name ?? d.label) === 'Service') ?? dl[0])].filter(Boolean).map((d: any) => d.id), workplace_id: HEAVY });
  const nu = await sid(email); if (!nu) throw new Error(`new user not made: ${cr.status} ${JSON.stringify(cr.body).slice(0, 160)}`);
  if (nu.clockable) await a.post(`/api/staff/${nu.staff_id}/change`, { first_name: nu.first_name, last_name: nu.last_name, email: nu.email, role_id: nu.role_id, workplace_id: nu.workplace_id ?? HEAVY, job_title: nu.job_title, salary_type: nu.salary_type, salary: nu.salary, billable: !!nu.billable, clockable: false });
  R.C96929.user = { email, role: 'Admin', create: cr.status };
  const v = await viewAs(browser, p, a, nu.id, me.id);
  const pg = v.page; pg.setDefaultTimeout(30_000);
  try {
    R.C96929.user.savedPref = (await api(pg).get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? null;
    await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All'); await display(pg, 'List'); await search(pg, TOK);
    R.C96929.listSortHeader = await pg.evaluate(`[...document.querySelectorAll('thead th.sorted')].map(e => e.innerText.trim() + ' ' + (e.className.match(/sort-(asc|desc)/) || [''])[0])`);
    R.C96929.list = Object.keys(await read(pg, 'List')).map((x) => nm[x] ?? x); await shot(pg, 'C96929-list');
    await display(pg, 'Tech View'); if (!(await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(pg, TOK);
    let found = false; await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`);
    for (let i = 0; i < 120 && !found; i++) { found = (await pg.locator(`[data-test-id="tech_view_group_${carol.id}"]`).count()) > 0; if (!found) { await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop += 400`); await pg.waitForTimeout(300); } }
    R.C96929.techGroupFound = found;
    if (found) { await pg.evaluate(`document.querySelector('[data-test-id="tech_view_group_${carol.id}"]')?.scrollIntoView({ block: 'start' })`); await pg.waitForTimeout(1000);
      const g = (await groups(pg)).find((x) => x.id === carol.id); if (g?.collapsed) await toggleGroup(pg, carol.id);
      R.C96929.tech = ((await groups(pg)).find((x) => x.id === carol.id)?.rows ?? []).map((x) => nm[x] ?? x); }
    await shot(pg, 'C96929-tech');
    await display(pg, 'Board View'); if (!(await pg.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(pg, TOK);
    R.C96929.boardColumnFound = await toColumn(pg, carol.id);
    R.C96929.board = ((await pg.evaluate(`[...document.querySelectorAll('[data-test-id="board_column_${carol.id}"] [data-test-id="board_card_number"]')].map(e => e.textContent.trim())`)) as string[]).map((x) => nm[x] ?? x);
    await shot(pg, 'C96929-board'); (globalThis as any).__wobPage = pg; await (globalThis as any).__shotEach?.('C96929'); (globalThis as any).__wobPage = p;
  } finally { await v.close(); await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') }); }
});

await run('C368127', async () => {
  // 15 Oct 2026 (wave 11, fourth pass): User-B had Unassigned SAVED as collapsed by an earlier run of this case, so "how it opens" only
  // showed that saved choice. Now a BRAND-NEW user (Admin role, Time Clock off, made on every run) who has never opened Work Orders is
  // used, in their own window; nothing is expanded before the first look. The loading pause is watched while scrolling deep into
  // Unassigned: every list request the page sends (page number, time to answer) and any loading spinner or "Loading" text on screen;
  // if none is seen that is written down as "paging not seen by hand".
  const rl = (await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data; const rr: any[] = Array.isArray(rl) ? rl : rl?.collection ?? [];
  const adminRole = rr.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id;
  const email = `zzautotest.wob.unassigned.${Date.now()}${D}`;
  const nuR = await person(a, 'ZZAUTOTEST', `Never Collapsed ${Date.now() % 100000}`, { role: adminRole, email, clockable: false });
  const nu = nuR.row; if (!nu) throw new Error(`new user not made: ${nuR.log.join('; ')}`);
  R.C368127 = { user: { email, role: 'Admin', log: nuR.log } };
  const v = await viewAs(browser, p, a, nu.id, me.id); const pg = v.page; pg.setDefaultTimeout(30_000);
  try {
    R.C368127.savedPrefAtStart = (await api(pg).get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? null;
    const u = async () => (await groups(pg)).find((g) => g.id === 'unassigned');
    await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); await tab(pg, 'All'); await display(pg, 'Tech View'); await pg.waitForTimeout(1500);
    R.C368127.opensCollapsed = (await u())?.collapsed ?? 'group row not drawn'; await shot(pg, 'C368127-opened');
    if ((await u())?.collapsed) { await toggleGroup(pg, 'unassigned'); R.C368127.expandedByScriptToScroll = true; }
    R.C368127.count = (await u())?.count;
    const reqs: { at: number; page: string | null; ms: number | null; status: number | null }[] = []; const t0 = Date.now();
    pg.on('requestfinished', async (rq) => { const url = rq.url(); if (rq.method() !== 'GET' || !/\/api\/work-orders(\?|$)/.test(url)) return; const tm = rq.timing(); const rs = await rq.response().catch(() => null);
      reqs.push({ at: Date.now() - t0, page: (url.match(/pagination%5Bpage%5D=(\d+)|pagination\[page\]=(\d+)/) || []).slice(1).find(Boolean) ?? null, ms: tm && tm.responseEnd > 0 ? Math.round(tm.responseEnd) : null, status: rs ? rs.status() : null }); });
    const spin = () => pg.evaluate(`(() => { const s = [...document.querySelectorAll('.q-inner-loading, .q-spinner, .q-linear-progress--indeterminate, [class*="loading"], [class*="skeleton"]')].filter(e => e.getBoundingClientRect().width > 0); const tx = /Loading/i.test((document.querySelector('.q-table__middle') || document.body).innerText); return s.length || tx ? { spinners: s.slice(0, 3).map(e => String(e.className).slice(0, 60)), loadingText: tx } : null; })()`);
    R.C368127.scroll = []; let firstSpin = false;
    for (let y = 600; y <= 24000; y += 600) { await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop = ${y}`); await pg.waitForTimeout(250);
      const sp = await spin(); const at = Math.round(await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop`) as number);
      if (sp && !firstSpin) { firstSpin = true; await shot(pg, 'C368127-loading'); }
      R.C368127.scroll.push({ y, at, spinner: sp }); await pg.waitForTimeout(450); if (y > 1500 && at < y - 600) break; }
    R.C368127.listRequests = reqs.slice(0, 40);
    R.C368127.loadingPause = firstSpin ? 'a loading spinner or "Loading" text was seen (see scroll[], picture C368127-loading)' : `paging not seen by hand (no spinner or Loading text at any stop; ${reqs.length} list request(s) sent while scrolling)`;
    await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop = 1500`); await pg.waitForTimeout(2000);
    await shot(pg, 'C368127-mid-scroll');
    // 16 Oct 2026 (step 5 made exact: "just under the column header row"): the heading row's bottom and the held Unassigned header's box
    R.C368127.midScrollBoxes = await pg.evaluate(`(() => { const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) }; };
      const th = document.querySelector('thead tr'); const u = document.querySelector('[data-test-id="tech_view_group_unassigned"]'); const es = th ? document.elementsFromPoint(200, th.getBoundingClientRect().bottom + 6) : [];
      const g = es.map(x => x.closest && x.closest('[data-test-id^="tech_view_group_"]')).filter(Boolean)[0];
      return { headRow: r(th), unassignedHeader: r(u), unassignedPosition: u ? getComputedStyle(u).position : null, justUnderHeadings: g ? g.getAttribute('data-test-id') : null, scrollTop: document.querySelector('.q-table__middle').scrollTop }; })()`);
    // FIX-UP 2 (17 Oct 2026): on 16 Oct the point (90, 210) hit SPAN.tech-view-group-header__icon inside DIV.tech-view__sticky — the
    // header held at the top is a DRAWN COPY with no <button> — and the click there did not collapse the group. Step 7 now clicks that
    // sticky copy's own arrow icon (else the copy's header row), checks first that the copy reads "Unassigned", and reads the result
    // WITHOUT scrolling back up: the saved collapsed groups, the arrow icon's word, the scroll position and the rows still drawn; only
    // then is the table scrolled to the top and the group row's own data-collapsed read (the positive control).
    const stickyState = () => pg.evaluate(`(() => { const s = document.querySelector('.tech-view__sticky'); const ic = s && s.querySelector('.tech-view-group-header__icon'); const m = document.querySelector('.q-table__middle');
      return { sticky: !!s, text: s ? s.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80) : null, icon: ic ? ic.innerText.trim() : null, iconBox: ic ? (() => { const b = ic.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width) }; })() : null,
        scrollTop: m ? Math.round(m.scrollTop) : null, rowsDrawn: document.querySelectorAll('tr[data-group-key="unassigned"]').length }; })()`) as Promise<any>;
    const savedCollapsed = async () => ((await api(pg).get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).collapsedGroups ?? null;
    R.C368127.beforeClick = await stickyState(); R.C368127.savedBeforeClick = await savedCollapsed();
    console.log(t(), 'START STATE found C368127 step 7', JSON.stringify({ sticky: R.C368127.beforeClick, saved: R.C368127.savedBeforeClick }));
    const icon = pg.locator('.tech-view__sticky .tech-view-group-header__icon').first(); const head = pg.locator('.tech-view__sticky .tech-view-group-header').first();
    R.C368127.stickyArrow = { icon: await icon.count(), header: await head.count(), readsUnassigned: /Unassigned/i.test(String(R.C368127.beforeClick.text)) };
    await shot(pg, 'C368127-before-arrow');
    if (R.C368127.stickyArrow.icon) { await icon.click({ timeout: 8000 }).catch((e) => { R.C368127.stickyArrow.iconClickError = String(e?.message || e).slice(0, 120); }); R.C368127.stickyArrow.clicked = 'sticky header arrow icon'; }
    else if (R.C368127.stickyArrow.header) { await head.click({ timeout: 8000 }).catch(() => {}); R.C368127.stickyArrow.clicked = 'sticky header row'; }
    await pg.waitForTimeout(2500);
    R.C368127.afterClickInPlace = { ...(await stickyState()), saved: await savedCollapsed() }; await shot(pg, 'C368127-after-arrow-in-place');
    if (!(JSON.stringify(R.C368127.afterClickInPlace.saved ?? []).includes('unassigned')) && R.C368127.stickyArrow.header && R.C368127.stickyArrow.clicked !== 'sticky header row') {
      // the icon click changed nothing saved: try the copy's header row itself once, and say so
      await head.click({ timeout: 8000 }).catch(() => {}); await pg.waitForTimeout(2500); R.C368127.stickyArrow.secondTry = 'sticky header row'; R.C368127.afterSecondTry = { ...(await stickyState()), saved: await savedCollapsed() }; await shot(pg, 'C368127-after-header-row'); }
    R.C368127.scrolledBackUp = (R.C368127.afterSecondTry ?? R.C368127.afterClickInPlace).scrollTop !== null && (R.C368127.afterSecondTry ?? R.C368127.afterClickInPlace).scrollTop < 100;
    await pg.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await pg.waitForTimeout(1500);
    R.C368127.afterClick = { collapsed: (await u())?.collapsed ?? 'group row not drawn', savedCollapsed: await savedCollapsed() };
    await shot(pg, 'C368127-after-arrow'); await pg.screenshot({ path: path.join(EV, 'C368127-end.png') }).catch(() => {});
  } finally { await v.close(); }
  // List's own rows for the All tab, paged the way List asks for them, counted where the lead is empty
  // 15 Oct 2026 (staging second pass): the loop stopped at page 11 (5,500 rows) — staging's All tab holds more. Read EVERY page.
  let page = 1, total = 0, noLead = 0, meta: any = null; const seenIds = new Set<string>();
  for (;;) { const r = await a.get(`/api/work-orders?pagination[page]=${page}&pagination[rowsPerPage]=500&pagination[sortBy]=companyName&pagination[descending]=false&search=&showMyWorkOrders=0`); const w = r.body?.data?.work_orders ?? []; if (page === 1) meta = JSON.stringify(r.body?.data?.pagination ?? r.body?.meta ?? null).slice(0, 200);
    for (const x of w) { if (seenIds.has(x.id)) continue; seenIds.add(x.id); total++; if (!x.techAssignedId) noLead++; }
    if (w.length < 500 || page >= 200) break; page++; }
  R.C368127.listAllTab = { rows: total, withoutLead: noLead, pages: page, firstPageMeta: meta, matchesHeader: R.C368127.count === noLead };
});

await run('C96927', async () => {
  // 15 Oct 2026 (staging second pass): only the table columns were read. Now BOTH Column Selection menus are read item by item
  // (List: button_column_selection, Tech View: button_tech_view_column_selection; each item is a switch with a label).
  // 16 Oct 2026 (case rewritten 15 Oct, new steps 8-20): Tech View's columns start from the defaults (the saved choice is taken off
  // first and put back at the end); EVERY entry of the menu is read with on/off and locked; then On Site, VIN/Serial # and Lead
  // Technician on; Assigned Techs off and on; try Status, Number and Customer off; Unit off and on — headers read after each.
  const PREF = '/api/users/me/preferences/work-orders-list'; const ORIG = (await a.get(PREF)).body?.data?.value ?? {};
  { const v: any = {}; for (const [k, x] of Object.entries(ORIG)) if (k !== 'techViewColumns') v[k] = x; R.C96927_prefReset = (await a.put(PREF, { value: v })).status; }
  const name = 'ZZAUTOTEST F2 Tech Columns'; let have = await workOrders(a, name);
  if (!have.length) { const est = await sid('zz.wob.esther.howard' + D); const c = await customer(a, name, 'ZZF2TC'); const id = await workOrder(a, c, 'approved', est?.staff_id ?? null);
    const cl = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/work-orders/canned-lines')).body?.data)[0]; await a.post(`/api/work-orders/${id}/lines/create-from-canned-line`, { canned_line_id: cl?.id, status: 'authorized' }); have = await workOrders(a, name); }
  const readMenu = async (btn: string) => { await p.locator(`[data-test-id="${btn}"]`).click(); await p.waitForTimeout(1200);
    const items = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
      const sws = [...m.querySelectorAll('[role=switch]')]; return sws.map(sw => { const host = sw.closest('[data-test-id^="toggle_"]') || sw; const lab = sw.getAttribute('aria-label') || (sw.closest('.q-item') || host).innerText.replace(/\\s+/g, ' ').trim();
        const dis = sw.getAttribute('aria-disabled') === 'true' || /disabled/.test(String(sw.className) + ' ' + String(host.className));
        return { label: lab, key: (host.getAttribute('data-test-id') || '').replace(/^toggle_(tech_view_column_|column_)/, ''), on: sw.getAttribute('aria-checked'), locked: dis }; }); })()`);
    return items as { label: string; key: string; on: string; locked: boolean }[] | null; };
  const heads = async () => (await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.replace(/arrow_drop_(up|down)/g, '').trim()).filter(Boolean)`)) as string[];
  const flip = async (label: string, want: 'true' | 'false') => { const sw = p.locator(`.q-menu [role=switch][aria-label="${label}"]`).first(); if (!(await sw.count())) return 'not in the menu';
    const b = await sw.getAttribute('aria-checked'); if (b !== want) { await sw.scrollIntoViewIfNeeded().catch(() => {}); await sw.click({ timeout: 5000 }).catch(() => {}); await p.waitForTimeout(1300); } return `${b} -> ${await sw.getAttribute('aria-checked')}`; };
  const close = async () => { await p.keyboard.press('Escape'); await p.waitForTimeout(1000); };
  const openTv = async () => { await p.locator('[data-test-id="button_tech_view_column_selection"]').click(); await p.waitForTimeout(1200); };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'List'); await search(p, name);
  const listMenu = await readMenu('button_column_selection'); await shot(p, 'C96927-s4-list-menu'); await close();
  await display(p, 'Tech View'); if (!(await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(p, name);
  const techMenu = await readMenu('button_tech_view_column_selection'); await shot(p, 'C96927-s7-tech-menu');
  await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (m) { const s = [m, ...m.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 4); if (s) s.scrollTop = s.scrollHeight; } })()`); await p.waitForTimeout(600); await shot(p, 'C96927-s7-tech-menu-end');
  const L = (listMenu ?? []).map((x) => x.label), T = (techMenu ?? []).map((x) => x.label);
  R.C96927 = { wo: have.map((w: any) => w.number), techViewButton: await p.locator('[data-test-id="button_tech_view_column_selection"]').count(), listMenu: L, techMenuFull: techMenu,
    listOffersAssignedTechs: L.includes('Assigned Techs'), techOffersAssignedTechs: T.includes('Assigned Techs'), inListNotInTech: L.filter((x) => !T.includes(x)), inTechNotInList: T.filter((x) => !L.includes(x)) };
  R.C96927.s8_10 = { onSite: await flip('On Site', 'true'), vin: await flip('VIN/Serial #', 'true'), lead: await flip('Lead Technician', 'true') }; await close();
  R.C96927.s11_headers = await heads(); await shot(p, 'C96927-s11-headers');
  await openTv(); R.C96927.s13 = await flip('Assigned Techs', 'false'); await close(); R.C96927.s14_headers = await heads(); await shot(p, 'C96927-s14-headers');
  await openTv(); R.C96927.s15 = await flip('Assigned Techs', 'true'); await close(); R.C96927.s16_headers = await heads(); await shot(p, 'C96927-s16-headers');
  await openTv(); R.C96927.s17 = { Status: await flip('Status', 'false'), Number: await flip('Number', 'false'), Customer: await flip('Customer', 'false') }; R.C96927.s18_unit = await flip('Unit', 'false');
  R.C96927.s17_menuNow = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=switch]')].map(sw => (sw.getAttribute('aria-label') || '') + '=' + sw.getAttribute('aria-checked'))`); await shot(p, 'C96927-s17-menu');
  await close(); R.C96927.s19_headers = await heads(); await shot(p, 'C96927-s19-headers');
  await openTv(); R.C96927.s20_unit = await flip('Unit', 'true'); await close(); R.C96927.s20_headers = await heads();
  R.C96927.prefRestored = (await a.put(PREF, { value: ORIG })).status;
  await display(p, 'List'); R.C96927.listHeaders = await heads();
});

await run('C368161', async () => {
  const lead = await sid('zz.wob.esther.howard' + D), line = await sid('zz.wob.aaron.baker' + D);
  const n = 'ZZAUTOTEST F2 Initials Avatar';
  let [w] = await workOrders(a, n);
  if (!w) { const c = await customer(a, n, 'ZZF2IA'); const id = await workOrder(a, c, 'approved', lead.staff_id); w = (await workOrders(a, n))[0]; }
  R.C368161 = { wo: w.number, lead: 'Esther Howard', lineTech: 'Aaron Baker' };
  const canned = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = (Array.isArray(canned) ? canned : canned?.collection ?? [])[0];
  if (!w.linesCount) { const r = await a.post(`/api/work-orders/${w.id}/lines/create-from-canned-line`, { canned_line_id: cl?.id, status: 'authorized' }); R.C368161.lineCreate = r.status; }
  // give the line to Aaron Baker through the line editor (click the line > Add Technician > Save & Close) — done once
  // (2026-10-08, the editor saved PUT /api/work-orders/lines/<id>/technicians {staffIds:[Aaron Baker]}); not repeated
  if (!process.env.LINE_DONE) await p.goto(`${APP}/workorders/${w.id}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  calls.length = 0;
  R.C368161.canned = cl?.name ?? cl?.title ?? cl?.line_name ?? JSON.stringify(cl).slice(0, 120);
  R.C368161.linesPageText = ((await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ').slice(0, 300);
  if (!process.env.LINE_DONE) { await p.waitForTimeout(5000);
  await p.getByText(/Transmission service/i).first().click().catch((e) => { R.C368161.lineClick = String(e.message).slice(0, 80); }); } await p.waitForTimeout(2500); await shot(p, 'C368161-line-editor');
  const add = p.locator('.q-dialog .q-field').filter({ hasText: /Add technician/i }).first(); R.C368161.editorOpen = await add.count();
  if (!process.env.LINE_DONE && await add.count()) {
    await add.click(); await p.waitForTimeout(1500);
    R.C368161.techOptions = (await p.locator('.q-menu .q-item, [role=option]').allInnerTexts()).slice(0, 8);
    await p.locator('.q-menu .q-item, [role=option]').filter({ hasText: 'Aaron Baker' }).first().click().catch(async () => { await p.keyboard.type('Aaron Baker'); await p.waitForTimeout(1500); await p.locator('.q-menu .q-item, [role=option]').filter({ hasText: 'Aaron Baker' }).first().click(); });
    await p.waitForTimeout(1000); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(500);
    R.C368161.editorButtons = await p.evaluate(`[...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(x => /save|close|cancel/i.test(x))`);
    await p.locator('button').filter({ hasText: /Save\s*&\s*Close/i }).last().click(); await p.waitForTimeout(3000);
  }
  R.C368161.lineCalls = [...calls];
  await tv(n); R.C368161.reach = await scrollToGroupId(lead.staff_id);
  R.C368161.header = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id="tech_view_group_${lead.staff_id}"]'); if (!g) return null; const av = g.querySelector('.q-avatar'); return { avatar: av ? av.innerText.trim() : null, hasImg: !!g.querySelector('img'), text: g.innerText.replace(/\\s+/g, ' ') }; })()`);
  await p.locator('[data-test-id="button_tech_view_column_selection"]').click(); await p.waitForTimeout(1000);
  const sw = p.locator('.q-menu [role=switch][aria-label="Assigned Techs"]').first(); if ((await sw.getAttribute('aria-checked')) !== 'true') { await sw.click(); await p.waitForTimeout(1500); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  R.C368161.rowAvatars = await p.evaluate(`(() => { const r = document.querySelector('[data-test-id="tech_view_row_${w.id}"]'); if (!r) return null; return { avatars: [...r.querySelectorAll('.q-avatar')].map(a => a.innerText.trim() || (a.querySelector('img') ? 'img' : 'EMPTY')), brokenImg: [...r.querySelectorAll('img')].filter(i => !i.complete || i.naturalWidth === 0).length }; })()`);
  await shot(p, 'C368161-tech');
  await display(p, 'Board View');
  await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${lead.staff_id}"]'); const h = document.querySelector('.board-view__scroller'); for (let i = 0; i < 40 && !document.querySelector('[data-test-id="board_column_${lead.staff_id}"]'); i++) h.scrollLeft += 600; })()`);
  for (let i = 0; i < 30 && !(await p.locator(`[data-test-id="board_column_${lead.staff_id}"]`).count()); i++) { await p.evaluate(`document.querySelector('.board-view__scroller').scrollLeft += 600`); await p.waitForTimeout(400); }
  await p.evaluate(`document.querySelector('[data-test-id="board_column_${lead.staff_id}"]')?.scrollIntoView({ inline: 'center' })`); await p.waitForTimeout(1000);
  R.C368161.boardHeader = await p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${lead.staff_id}"]'); if (!c) return null; const av = c.querySelector('.q-avatar'); return av ? av.innerText.trim() : null; })()`);
  const fieldsBtn = p.locator('button[aria-label*="Fields" i], [data-test-id*="field" i]').first();
  R.C368161.fieldsButton = await fieldsBtn.evaluate((e) => e.getAttribute('aria-label') || e.getAttribute('data-test-id')).catch(() => null);
  if (await fieldsBtn.count()) {
    await fieldsBtn.click(); await p.waitForTimeout(1200);
    R.C368161.fieldsMenu = await p.evaluate(`[...document.querySelectorAll('.q-menu [role=switch], .q-menu [role=checkbox]')].map(e => (e.getAttribute('aria-label') || '') + '=' + e.getAttribute('aria-checked'))`);
    const lt2 = p.locator('.q-menu [role=switch][aria-label="Line technicians"], .q-menu [role=checkbox][aria-label="Line technicians"]').first();
    if ((await lt2.getAttribute('aria-checked')) !== 'true') { await lt2.click().catch(() => {}); await p.waitForTimeout(1500); }
    await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  }
  R.C368161.lineTechOn = await p.locator('[aria-label="Fields to display"]').first().click().then(async () => { await p.waitForTimeout(800); const v = await p.locator('.q-menu [aria-label="Line technicians"]').first().getAttribute('aria-checked'); await p.keyboard.press('Escape'); return v; }).catch(() => null);
  R.C368161.cardAvatars = await p.evaluate(`(() => { const c = [...document.querySelectorAll('[data-test-id^="board_column_"] *')].find(e => e.children.length === 0 && e.textContent.trim() === ${JSON.stringify(w.number)}); let card = c; while (card && !(card.querySelectorAll && card.innerText && card.innerText.includes('Customer') && card.querySelector('.q-avatar'))) card = card.parentElement; if (!card) return null; return { avatars: [...card.querySelectorAll('.q-avatar')].map(a => a.innerText.trim() || (a.querySelector('img') ? 'img' : 'EMPTY')), text: card.innerText.replace(/\\s+/g, ' ').slice(0, 200) }; })()`);
  await shot(p, 'C368161-board'); await display(p, 'List');
});

await run('C96938', async () => {
  const mx = await sid('zz.wob.maximiliana' + D);
  const n = 'ZZAUTOTEST F2 Name Tooltip';
  await seedCase(a, n, 'ZZF2NT2', [{ lead: tA.id }, { lead: mx.staff_id }]);
  // 15 Oct 2026 (staging second pass): every hover read came back empty. The pointer is now moved onto the element's centre and
  // held still, the page is polled up to 5 s for a drawn tooltip, a picture is taken while hovering, and the title / aria-label
  // the browser would show (a native tooltip is not drawn in a headless picture) is read from the element under the pointer
  // and its parents at that moment — Tech-A's avatar is read while her group is on screen (it was read after scrolling away).
  await tv(n);
  const tip = async (sel: string, pic: string) => { await p.mouse.move(5, 5); await p.waitForTimeout(500);
    const el = p.locator(sel).first(); if (!(await el.count())) return { found: false };
    await el.scrollIntoViewIfNeeded().catch(() => {}); await p.waitForTimeout(500); const bx = await el.boundingBox(); if (!bx) return { found: false };
    const x = bx.x + bx.width / 2, y = bx.y + bx.height / 2; await p.mouse.move(x - 3, y - 2, { steps: 4 }); await p.mouse.move(x, y, { steps: 3 });
    let tooltip = ''; for (let i = 0; i < 12 && !tooltip; i++) { await p.waitForTimeout(400); tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip, [role=tooltip]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim()).join(' | ')`) as string; }
    await shot(p, pic);
    const under = await p.evaluate(`(() => { const out = []; for (let e = document.elementFromPoint(${x}, ${y}); e && out.length < 7; e = e.parentElement) { const t = e.getAttribute('title'), a = e.getAttribute('aria-label'); if (t || a) out.push(e.tagName.toLowerCase() + (t ? ' title="' + t + '"' : '') + (a ? ' aria-label="' + a + '"' : '')); } return out; })()`);
    return { found: true, tooltip, titleUnderPointer: under }; };
  const sA = await scrollToGroupId(tA.id);
  R.C96938 = { techA: tA.name, reachA: sA.found, avatarA: await tip(`[data-test-id="tech_view_group_${tA.id}"] .q-avatar`, 'C96938-hover-avatar-A') };
  const sM = await scrollToGroupId(mx.staff_id); R.C96938.reachLong = sM.found;
  R.C96938.nameLong = await tip(`[data-test-id="tech_view_group_name_${mx.staff_id}"]`, 'C96938-hover-long-name');
  R.C96938.avatarLong = await tip(`[data-test-id="tech_view_group_${mx.staff_id}"] .q-avatar`, 'C96938-hover-long-avatar');
  R.C96938.nameLongShown = await p.evaluate(`(() => { const e = document.querySelector('[data-test-id="tech_view_group_name_${mx.staff_id}"]'); return e ? { text: e.textContent.trim(), title: e.getAttribute('title'), truncated: e.scrollWidth > e.clientWidth } : null; })()`);
  await shot(p, 'C96938-hover');
});

await run('C96934', async () => {
  const ralph = await sid('zz.wob.ralph.edwards' + D);
  const n = 'ZZAUTOTEST F2 Inactive Lead';
  await seedCase(a, n, 'ZZF2IL', [{ lead: ralph.staff_id }, { lead: ralph.staff_id }]);
  const r0 = await sid('zz.wob.ralph.edwards' + D);
  R.C96934 = { deactivate: r0?.is_active ? await setActive('Ralph Edwards', false) : 'already deactivated', activeNow: (await sid('zz.wob.ralph.edwards' + D))?.is_active };
  await tv(n); R.C96934.reach = await scrollToGroupId(ralph.staff_id);
  R.C96934.group = (await groups(p)).find((g) => g.id === ralph.staff_id) ?? null;
  R.C96934.header = await p.evaluate(`(() => { const g = document.querySelector('[data-test-id="tech_view_group_${ralph.staff_id}"]'); return g ? g.innerText.replace(/\\s+/g, ' ') : null; })()`);
  R.C96934.inactiveMarker = await p.locator(`[data-test-id="tech_view_group_${ralph.staff_id}"] [data-test-id*="inactive"], [data-test-id="tech_view_group_${ralph.staff_id}"] .q-badge, [data-test-id="tech_view_group_${ralph.staff_id}"] .q-chip`).allInnerTexts().catch(() => []);
  await shot(p, 'C96934-inactive');
  await display(p, 'List');
  const rr = await sid('zz.wob.ralph.edwards' + D); const back = await a.post('/api/iam/change-status', { id: rr.id });
  R.C96934.reactivate = back.status; R.C96934.activeAfter = (await sid('zz.wob.ralph.edwards' + D))?.is_active;
});

await run('C368125', async () => {
  // 15 Oct 2026 (staging second pass): the script used Ayesha Khan's group (the case names Esther Howard) and, once the search
  // was typed, her group was far down among ~119 technicians and not drawn, so its toggle was never found. Now: both work orders
  // are led by Esther Howard (set if not), Esther is pinned at sign-in (WOB_PIN_NAMES=Esther Howard, right after Unassigned), and
  // her group is brought on screen before every read and toggle.
  const ES = by('Esther Howard'); if (!ES) throw new Error('Esther Howard is not offered as a technician here');
  const leads: string[] = [];
  for (const [n, u] of [['ZZAUTOTEST F2 Collapse Kept', 'ZZF2CK'], ['ZZAUTOTEST F2 Collapse Other', 'ZZF2CO']]) {
    await seedCase(a, n, u, [{ lead: ES.id }]);
    for (const w of await workOrders(a, n)) { if (w.techAssignedId !== ES.id) leads.push(`${w.number} -> Esther ${(await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: ES.id })).status}`); }
  }
  await tv('');
  const bring = async () => { const r = await scrollToGroup(ES.id); if (r.found) { await p.evaluate(`document.querySelector('[data-test-id="tech_view_group_${ES.id}"]')?.scrollIntoView({ block: 'center' })`); await p.waitForTimeout(800); } return r; };
  const sg = await bring(); if (!sg.found) throw new Error('Esther Howard group not reached');
  const gA = async () => (await groups(p)).find((g) => g.id === ES.id);
  if (!(await gA())?.collapsed) await toggleGroup(p, ES.id);
  R.C368125 = { leadFixes: leads, pinnedNow: (await groups(p)).filter((g) => g.pin?.pressed === 'true').map((g) => g.name), collapsedBefore: (await gA())?.collapsed, countBefore: (await gA())?.count };
  await search(p, 'Collapse Kept'); await bring(); const d = await gA(); R.C368125.during = d ? { count: d.count, collapsed: d.collapsed, rows: d.rows } : 'group not drawn'; await shot(p, 'C368125-during-search');
  await toggleGroup(p, ES.id); await p.waitForTimeout(800); const e = await gA(); R.C368125.expanded = e && { count: e.count, collapsed: e.collapsed, rows: e.rows }; await shot(p, 'C368125-expanded');
  R.C368125.kept = (await workOrders(a, 'ZZAUTOTEST F2 Collapse Kept')).map((w: any) => w.number); R.C368125.other = (await workOrders(a, 'ZZAUTOTEST F2 Collapse Other')).map((w: any) => w.number);
  await (globalThis as any).__shotEach?.('C368125');
  await search(p, ''); if (sg.wasOpen) { await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await toggleGroup(p, 'unassigned').catch(() => {}); }
});

await run('C368130-not-here', async () => {
  // a location with no technicians: at ZZAUTOTEST Empty Shop the only one is Admin ShopView, so his Time Clock is
  // switched off for the check and back on straight after (read back)
  const adm = (await staffRows(a, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com');
  const set = (clock: boolean) => a.post(`/api/staff/${adm.staff_id}/change`, { first_name: adm.first_name, last_name: adm.last_name, email: adm.email, role_id: adm.role_id, workplace_id: adm.workplace_id, job_title: adm.job_title, salary_type: adm.salary_type, salary: adm.salary, billable: adm.billable, clockable: clock });
  R.C368130 = { adminClockableBefore: adm.clockable };
  const off = await set(false); R.C368130.off = off.status;
  try {
    await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
    if (process.env.WOB_LOC_SELECT) await switchLocUI(p, process.env.WOB_EMPTY_LOC || 'ZZAUTOTEST Empty Shop'); else {
    await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200);
    await p.locator('.q-menu').getByText(/ - \d{3,5}$|ZZAUTOTEST Empty Shop/).first().click(); await p.waitForTimeout(1500);
    await p.locator('.q-menu').filter({ hasText: 'Staging Lethbridge' }).locator('.q-item').filter({ hasText: 'ZZAUTOTEST Empty Shop' }).first().click(); await p.waitForTimeout(6000); await p.keyboard.press('Escape').catch(() => {}); }
    R.C368130.location = await p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => /Empty Shop| - \\d{3,5}$/.test(l)) || null`);
    await tab(p, 'All'); await display(p, 'Tech View');
    R.C368130.tech = { groups: (await groups(p)).map((g) => `${g.name}(${g.count}) [${g.rows.join(' ')}]`), text: ((await p.evaluate(`(document.querySelector('[data-test-id="tech_view"]') || document.body).innerText`)) as string).replace(/\s+/g, ' ').slice(0, 500) };
    await shot(p, 'C368130-tech');
    await display(p, 'Board View');
    R.C368130.board = { columns: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => e.getAttribute('data-test-id')).filter(x => /^board_column_(unassigned|[0-9a-f-]{36})$/.test(x))`), text: ((await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ').slice(0, 600) };
    await shot(p, 'C368130-board'); await display(p, 'List');
  } finally {
    const on = await set(true); R.C368130.on = on.status;
    R.C368130.adminClockableAfter = (await staffRows(a, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com')?.clockable;
  }
});

fs.writeFileSync(path.join(EV, 's2-batchC.json'), JSON.stringify(R, null, 1));
await done(browser);
