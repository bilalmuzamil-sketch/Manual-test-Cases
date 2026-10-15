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
const OWN_END = new Set(['C96926', 'C96929']); // 15 Oct 2026: these take their end picture where the result shows
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
  const TOK = 'ZZ96929'; const nm: Record<string, string> = {};
  for (const c of ['Zeta Hauling', 'Alpha Freight', 'Mid Trucking']) {
    const name = `${c} ${TOK}`; let have = await workOrders(a, name);
    if (!have.length) { await workOrder(a, await customer(a, name, `ZZ29${c.slice(0, 2).toUpperCase()}`), 'approved', carol.id); have = await workOrders(a, name); }
    for (const w of have) { nm[w.number] = c; if (w.techAssignedId !== carol.id) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w.id, tech_assigned_id: carol.id }); }
  }
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
  await asUserB(async () => {
    await tv('');
    const u = async () => (await groups(p)).find((g) => g.id === 'unassigned');
    // 15 Oct 2026: record how Unassigned OPENS. Setup per the case: if it is collapsed, expand it once, then open Work Orders again.
    const saved0 = ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).collapsedGroups ?? null;
    const first = (await u())?.collapsed;
    if (first) { await toggleGroup(p, 'unassigned'); await tv(''); }
    R.C368127 = { savedCollapsedAtStart: saved0, collapsedAtFirstLook: first, setupExpandedOnce: !!first, opensCollapsed: (await u())?.collapsed ?? 'group row not drawn' };
    await shot(p, 'C368127-opened');
    if ((await u())?.collapsed) await toggleGroup(p, 'unassigned');
    R.C368127.count = (await u())?.count;
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 1500`); await p.waitForTimeout(2000);
    await shot(p, 'C368127-mid-scroll');
    // the header kept at the top is drawn over the table; click the arrow where it sits
    const hit = await p.evaluate(`(() => { const els = document.elementsFromPoint(90, 210); const b = els.map(e => e.closest && e.closest('button')).find(Boolean); return { y: 210, what: els.slice(0, 4).map(e => e.tagName + '.' + String(e.className).slice(0, 40)), button: b ? (b.getAttribute('aria-label') || b.getAttribute('data-test-id')) : null, text: (els[0] && els[0].closest('tr, div') || {}).innerText?.replace(/\\s+/g, ' ').slice(0, 80) }; })()`) as any;
    R.C368127.stickyArrow = hit;
    await p.mouse.click(90, hit.y); await p.waitForTimeout(2000);
    await p.evaluate(`document.querySelector('.q-table__middle').scrollTop = 0`); await p.waitForTimeout(1500);
    R.C368127.afterClick = { collapsed: (await u())?.collapsed ?? 'group row not drawn', savedCollapsed: ((await a.get('/api/users/me/preferences/work-orders-list')).body?.data?.value ?? {}).collapsedGroups ?? null };
    await shot(p, 'C368127-after-arrow');
    if ((await u())?.collapsed) await toggleGroup(p, 'unassigned');
  });
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
  const readMenu = async (btn: string) => { await p.locator(`[data-test-id="${btn}"]`).click(); await p.waitForTimeout(1200);
    const items = await p.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
      const sws = [...m.querySelectorAll('[role=switch]')]; return sws.map(sw => { const host = sw.closest('[data-test-id^="toggle_"]') || sw; const lab = sw.getAttribute('aria-label') || (sw.closest('.q-item') || host).innerText.replace(/\\s+/g, ' ').trim();
        return { label: lab, key: (host.getAttribute('data-test-id') || '').replace(/^toggle_(tech_view_column_|column_)/, ''), on: sw.getAttribute('aria-checked') }; }); })()`);
    return items as { label: string; key: string; on: string }[] | null; };
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await tab(p, 'All'); await display(p, 'List'); await search(p, 'ZZAUTOTEST F2 Tech Columns');
  const listMenu = await readMenu('button_column_selection'); await shot(p, 'C96927-list-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  await display(p, 'Tech View'); if (!(await p.locator('[data-test-id="page_search_input"]').inputValue().catch(() => ''))) await search(p, 'ZZAUTOTEST F2 Tech Columns');
  const techMenu = await readMenu('button_tech_view_column_selection'); await shot(p, 'C96927-tech-menu');
  const L = (listMenu ?? []).map((x) => x.label), T = (techMenu ?? []).map((x) => x.label);
  R.C96927 = { techViewButton: await p.locator('[data-test-id="button_tech_view_column_selection"]').count(), listMenu: L, techMenu: T,
    listOffersAssignedTechs: L.includes('Assigned Techs'), techOffersAssignedTechs: T.includes('Assigned Techs'), inListNotInTech: L.filter((x) => !T.includes(x)), inTechNotInList: T.filter((x) => !L.includes(x)) };
  const sw = p.locator('.q-menu [role=switch][aria-label="Assigned Techs"]').first();
  R.C96927.before = await sw.getAttribute('aria-checked').catch(() => null);
  if (R.C96927.before !== 'true') { await sw.click().catch(() => {}); await p.waitForTimeout(1500); }
  R.C96927.after = await sw.getAttribute('aria-checked').catch(() => null); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
  R.C96927.headers = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`); await shot(p, 'C96927-assigned-techs-column');
  await display(p, 'List'); R.C96927.listHeaders = await p.evaluate(`[...document.querySelectorAll('thead th')].map(e => e.innerText.trim()).filter(Boolean)`);
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
  await tv(n); await scrollToGroupId(tA.id); const posA = 1;
  const tip = async (sel: string) => { await p.mouse.move(5, 5); await p.waitForTimeout(400); await p.locator(sel).first().hover(); await p.waitForTimeout(1300); return p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim()).join(' | ')`); };
  R.C96938 = {
    avatarA: await tip(`[data-test-id="tech_view_group_${tA.id}"] .q-avatar`),
    nameLong: (await scrollToGroupId(mx.staff_id), await tip(`[data-test-id="tech_view_group_name_${mx.staff_id}"]`)),
    avatarLong: (await scrollToGroupId(mx.staff_id), await tip(`[data-test-id="tech_view_group_${mx.staff_id}"] .q-avatar`)),
    avatarAttrs: await p.evaluate(`(() => { const av = document.querySelector('[data-test-id="tech_view_group_${mx.staff_id}"] .q-avatar'); const chain = []; for (let e = av; e && chain.length < 8; e = e.parentElement) chain.push({ tag: e.tagName, cls: String(e.className).slice(0, 30), title: e.getAttribute('title'), aria: e.getAttribute('aria-label') }); return chain; })()`),
    avatarAChain: await p.evaluate(`(() => { const av = document.querySelector('[data-test-id="tech_view_group_${tA.id}"] .q-avatar'); const t = []; for (let e = av; e && t.length < 8; e = e.parentElement) if (e.getAttribute('title') || e.getAttribute('aria-label')) t.push(e.tagName + ':' + (e.getAttribute('title') || e.getAttribute('aria-label'))); return t; })()`),
    nameLongShown: await p.evaluate(`(() => { const e = document.querySelector('[data-test-id="tech_view_group_name_${mx.staff_id}"]'); return e ? { text: e.textContent.trim(), title: e.getAttribute('title'), truncated: e.scrollWidth > e.clientWidth } : null; })()`),
  };
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
  await tv('');
  const sg = await scrollToGroup(tA.id); if (!sg.found) throw new Error('Ayesha Khan group not reached');
  const gA = async () => (await groups(p)).find((g) => g.id === tA.id);
  if (!(await gA())?.collapsed) await toggleGroup(p, tA.id);
  R.C368125 = { collapsedBefore: (await gA())?.collapsed, countBefore: (await gA())?.count };
  await search(p, 'Collapse Kept'); const d = await gA(); R.C368125.during = d && { count: d.count, collapsed: d.collapsed, rows: d.rows }; await shot(p, 'C368125-during-search');
  await toggleGroup(p, tA.id); const e = await gA(); R.C368125.expanded = e && { count: e.count, collapsed: e.collapsed, rows: e.rows }; await shot(p, 'C368125-expanded');
  R.C368125.kept = (await workOrders(a, 'ZZAUTOTEST F2 Collapse Kept')).map((w: any) => w.number); R.C368125.other = (await workOrders(a, 'ZZAUTOTEST F2 Collapse Other')).map((w: any) => w.number);
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
