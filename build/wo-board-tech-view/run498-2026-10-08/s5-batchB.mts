/**
 * S5 batch B (2026-10-09) — fields and columns as brand-new people: C96979 and C368160 (Nora New, Admin role),
 * C96980 (Fay Financial: Admin role, which sees financial data; Nate Nofinance: the "ZZAUTOTEST WO View Only" role
 * with See Financial Data off), C96986 (a second Nate Nofinance whose role has See Financial Data on, then off).
 * Each person is created fresh for this run (new email), so none of them has ever saved a Work Orders choice.
 * See Financial Data is the role's cross toggle `seeFinancialData` (PUT /api/roles/{id} with fe_permissions as ids and
 * cross_toggles; playbook §C). The role is saved to evidence first and put back, then read back, at the end.
 * The screen is seen as each person through viewAs.mts (switch on the server + that person's own page storage).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
const R: Record<string, any> = { runner: { id: RUN.id.slice(0, 8), perms: RUN.perms, who: RUN.who, log: RUN.log } };
const D = '@staging.shopview.local';
const sid = async (e: string) => (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
const ES = await sid('esther.howard'), RE = await sid('ralph.edwards');
const PREF = '/api/users/me/preferences/work-orders-list';
const prefGet = async () => (await a.get(PREF)).body?.data?.value ?? {};
const ORIGINAL = await prefGet(); fs.writeFileSync(path.join(EV, 'S5-admin-pref-before.json'), JSON.stringify(ORIGINAL, null, 1));
await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const BTN: Record<string, string> = { List: 'button_column_selection', 'Tech View': 'button_tech_view_column_selection', 'Board View': 'button_board_fields_selection' };
const go = async (d: string, n = '', pg: Page = p) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4500); await tab(pg, 'All'); await display(pg, d); if (n) await search(pg, n); if (d === 'Tech View') await expandSmallGroups(pg); };
/** open the display's menu and read every switch {test-id suffix: on/off}, plus its box */
const menu = async (d: string, pg: Page = p) => {
  const b = pg.locator(`[data-test-id="${BTN[d]}"]`); const box = await b.boundingBox(); await b.click(); await pg.waitForTimeout(1200);
  const items = await pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id^="toggle_"]')].map(e => { const s = e.matches('[role=switch]') ? e : e.querySelector('[role=switch]') || e; return [e.getAttribute('data-test-id').replace(/^toggle_(tech_view_column_|board_field_|column_)/, ''), (e.innerText || '').trim() || (e.closest('.q-item') || e).innerText.trim(), s.getAttribute('aria-checked'), s.getAttribute('aria-disabled')]; }); })()`) as any[];
  return { box: box ? { x: Math.round(box.x), y: Math.round(box.y) } : null, items };
};
const close = async (pg: Page = p) => { await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); };
const setSwitch = async (d: string, key: string, on: boolean, pg: Page = p) => {
  const prefix = d === 'List' ? 'toggle_column_' : d === 'Tech View' ? 'toggle_tech_view_column_' : 'toggle_board_field_';
  const m = await menu(d, pg); const it = (m.items ?? []).find((x: any) => x[0] === key);
  if (!it) { await close(pg); return `no ${key} in menu`; }
  if ((it[2] === 'true') !== on) { await pg.locator(`[data-test-id="${prefix}${key}"]`).click(); await pg.waitForTimeout(1500); }
  await close(pg); return 'ok';
};
const onKeys = (m: any) => (m.items ?? []).filter((x: any) => x[2] === 'true').map((x: any) => x[0]);
const heads = (pg: Page = p) => pg.evaluate(`[...new Set([...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace('arrow_drop_up','').trim()).filter(Boolean))]`) as Promise<string[]>;
const card = (pg: Page, wo: string) => pg.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_card_${wo}"]'); if (!c) return null;
  const o = {}; for (const e of c.querySelectorAll('[data-test-id]')) { const k = e.getAttribute('data-test-id'); if (/^board_card_(number|status|unit|field_)/.test(k)) o[k.replace('board_card_', '')] = e.innerText.replace(/\\s+/g, ' ').trim(); } return o; })()`) as Promise<Record<string, string> | null>;
/** a second browser: the sign-in cookies only, no page storage */
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 } });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {}); return { ctx, pg: await ctx.newPage() }; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 's5-batchB.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };


const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const roles: any[] = ((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data?.collection ?? []);
const fromStaff = await roleIds(a);
const rid = (re: RegExp) => roles.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(fromStaff).find(([l]) => re.test(l))?.[1];
const ADMIN_ROLE = rid(/^admin(istrator)?$/i), VIEW_ROLE = rid(/^ZZAUTOTEST WO View Only$/) ?? (await sid('viewonly'))?.role_id;
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
R.roles = { admin: !!ADMIN_ROLE, viewOnly: !!VIEW_ROLE, names: roles.map((r) => r.label ?? r.name).slice(0, 40) };
const stamp = Date.now() % 1000000;
const mkUser = async (first: string, last: string, role: string, tag: string) => { const r = await person(a, first, last, { role, email: `zz.wob.${tag}.${stamp}${D}` }); return r.row; };
const roleRead = async (id: string) => (await a.get(`/api/roles/${id}`)).body?.data;
const roleSetFinancial = async (id: string, on: boolean) => { const r = await roleRead(id);
  const body = { name: r.name, description: r.description, view_mode: r.view_mode, template_id: r.template_id, fe_permissions: (r.fe_permissions ?? []).map((x: any) => x.id), cross_toggles: { ...(r.cross_toggles ?? {}), seeFinancialData: on } };
  const w = await a.put(`/api/roles/${id}`, body); const back = await roleRead(id); return `${w.status} now seeFinancialData=${back?.cross_toggles?.seeFinancialData}`; };
const asUser = async <T>(u: any, f: (pg: Page) => Promise<T>) => { const v = await viewAs(browser, p, a, u.id, me.id, RUN.toRunner); try { return await f(v.page); } finally { await v.close(); } };
const filters = async (pg: Page) => { const out: Record<string, string[]> = {};
  for (const tid of await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="filter_chip_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-test-id'))`) as string[]) {
    await pg.locator(`[data-test-id="${tid}"]`).click(); await pg.waitForTimeout(1000);
    out[tid] = await pg.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 300))`) as string[];
    await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); }
  return out; };
/** find a card on the board, scrolling the board sideways (columns off to the right are not drawn until reached) */
async function cardFound(pg: Page, wo: string) {
  for (let i = 0; i < 30; i++) { if (await pg.locator(`[data-test-id="board_card_${wo}"]`).count()) { await pg.locator(`[data-test-id="board_card_${wo}"]`).scrollIntoViewIfNeeded().catch(() => {}); return card(pg, wo); }
    const moved = await pg.evaluate(`(() => { const h = document.querySelector('[data-test-id="board_view_scroller"]'); if (!h) return false; const b = h.scrollLeft; h.scrollLeft = b + 900; return h.scrollLeft !== b; })()`);
    await pg.waitForTimeout(700); if (!moved) break; }
  return null;
}
const dollars = (o: any) => JSON.stringify(o).match(/\$\s?[\d,]+(\.\d\d)?/g) ?? [];

await run('C96979', async () => {
  const n = 'ZZAUTOTEST F2 Tech Default Columns'; await seed(n, 'ZZF2TD', [null]);
  const nora = await mkUser('Nora', 'New', ADMIN_ROLE, 'nora.new'); R.C96979 = { nora: nora?.email };
  R.C96979.nora = await asUser(nora, async (pg) => { const prefBefore = (await a.get(PREF)).body?.data?.value ?? null;
    await go('List', n, pg); const list = { heads: await heads(pg), on: onKeys(await menu('List', pg)) }; await close(pg);
    await display(pg, 'Tech View'); await pg.waitForTimeout(1500); await expandSmallGroups(pg); const tech = { heads: await heads(pg), on: onKeys(await menu('Tech View', pg)) }; await close(pg);
    await shot(pg, 'C96979-nora-techview'); return { prefBefore, list, tech }; });
  // own user: List Service Advisor off, Created on on, reload; change a Tech View column; back to List, reload
  await go('List'); R.C96979.mine = [await setSwitch('List', 'serviceAdvisor', false), await setSwitch('List', 'startDate', true)];
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C96979.mineAfterReload = onKeys(await menu('List')); await close();
  await display(p, 'Tech View'); await p.waitForTimeout(1500); R.C96979.techChange = await setSwitch('Tech View', 'lines_count', false);
  await display(p, 'List'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); R.C96979.mineAfterSwitchAndReload = onKeys(await menu('List')); await close();
});

await run('C368160', async () => {
  const n = 'ZZAUTOTEST F2 Columns Count'; await seed(n, 'ZZF2CC', [ES.staff_id]);
  const nora = await mkUser('Nora', 'New', ADMIN_ROLE, 'nora.new.cc');
  R.C368160 = await asUser(nora, async (pg) => {
    await go('Tech View', n, pg); const h0 = await heads(pg); const m0 = await menu('Tech View', pg);
    const words = await pg.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop()?.innerText.replace(/\\s+/g, ' ')`);
    const buttons = await pg.locator('.q-menu button:visible').allInnerTexts(); await shot(pg, 'C368160-menu'); await close(pg);
    await setSwitch('Tech View', 'start_date', false, pg); const h1 = await heads(pg); const m1 = onKeys(await menu('Tech View', pg)); await close(pg);
    return { headsStart: h0, menuWords: words, buttons, countShown: /\d+ of \d+ shown/.test(String(words)), onStart: onKeys(m0), afterUntickCreatedOn: { heads: h1, on: m1 } }; });
});

await run('C96980', async () => {
  const n = 'ZZAUTOTEST F2 Board Default Fields'; const w = await seed(n, 'ZZF2BD', [ES.staff_id]); const wo = w[0].id;
  R.C96980 = { roleViewOnlyBefore: (await roleRead(VIEW_ROLE))?.cross_toggles };
  fs.writeFileSync(path.join(EV, 'S5-role-viewonly-before.json'), JSON.stringify(await roleRead(VIEW_ROLE), null, 1));
  if (R.C96980.roleViewOnlyBefore?.seeFinancialData) R.C96980.setOff = await roleSetFinancial(VIEW_ROLE, false);
  const fay = await mkUser('Fay', 'Financial', ADMIN_ROLE, 'fay.financial'), nate = await mkUser('Nate', 'Nofinance', VIEW_ROLE, 'nate.nofinance');
  for (const [k, u] of [['fay', fay], ['nate', nate]] as [string, any][]) R.C96980[k] = await asUser(u, async (pg) => {
    await go('Board View', n, pg); const c = await cardFound(pg, wo); await shot(pg, `C96980-${k}`); const m = await menu('Board View', pg); await close(pg);
    return { card: c, on: onKeys(m), offered: (m.items ?? []).map((x: any) => x[0]), perms: (await a.get('/api/auth/me/fe-permissions')).body?.data?.length ?? null }; });
});

await run('C96986', async () => {
  const n = 'ZZAUTOTEST F2 No Dollar Amounts'; const w = await seed(n, 'ZZF2ND', [ES.staff_id]); const wo = w[0].id;
  R.C96986 = { setOn: await roleSetFinancial(VIEW_ROLE, true) };
  const nate = await mkUser('Nate', 'Nofinance', VIEW_ROLE, 'nate.nofinance.nd');
  R.C96986.withFinance = await asUser(nate, async (pg) => {
    await go('Tech View', n, pg); await setSwitch('Tech View', 'total_price', false, pg); const s1 = await setSwitch('Tech View', 'total_price', true, pg); const h = await heads(pg);
    await display(pg, 'Board View'); await pg.waitForTimeout(1500); await setSwitch('Board View', 'total_price', false, pg); const s2 = await setSwitch('Board View', 'total_price', true, pg); const c = await cardFound(pg, wo);
    return { s1, s2, techHeads: h, card: c, pref: { tech: ((await a.get(PREF)).body?.data?.value ?? {}).techViewColumns, board: ((await a.get(PREF)).body?.data?.value ?? {}).boardFields } }; });
  R.C96986.setOff = await roleSetFinancial(VIEW_ROLE, false);
  R.C96986.withoutFinance = await asUser(nate, async (pg) => {
    await go('Tech View', n, pg); const h = await heads(pg); const m = await menu('Tech View', pg); await close(pg); await shot(pg, 'C96986-techview');
    const rowText = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="tech_view_row_"]')].map(r => r.innerText.replace(/\\s+/g, ' ')).join(' | ')`);
    const f = await filters(pg);
    await display(pg, 'Board View'); await pg.waitForTimeout(1500); const c = await cardFound(pg, wo); await shot(pg, 'C96986-board'); const bm = await menu('Board View', pg); await close(pg);
    await display(pg, 'List'); await pg.waitForTimeout(1500); const lh = await heads(pg);
    return { techHeads: h, techOffered: (m.items ?? []).map((x: any) => x[1]), techRowDollars: dollars(rowText), filters: f, filterDollars: dollars(f), card: c, cardDollars: dollars(c), boardOffered: (bm.items ?? []).map((x: any) => x[1]), listHeads: lh }; });
});

// put the role back exactly as it was, and read it back
if (fs.existsSync(path.join(EV, 'S5-role-viewonly-before.json'))) { const orig = JSON.parse(fs.readFileSync(path.join(EV, 'S5-role-viewonly-before.json'), 'utf8'));
  R.roleRestore = await roleSetFinancial(VIEW_ROLE, !!orig?.cross_toggles?.seeFinancialData);
  const now = await roleRead(VIEW_ROLE); R.roleRestoredExactly = JSON.stringify(now?.cross_toggles) === JSON.stringify(orig?.cross_toggles) && JSON.stringify((now?.fe_permissions ?? []).map((x: any) => x.id).sort()) === JSON.stringify((orig?.fe_permissions ?? []).map((x: any) => x.id).sort()); }
const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's5-batchB.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored, 'role', R.roleRestore, R.roleRestoredExactly);
await RUN.end();
await done(browser);
