/**
 * S6 (2026-10-09) — density across the three displays: C96987 (choices, Regular by default, none in List),
 * C96988 (spacing only, never content), C96989 (one shared choice, kept), C96990 (Compact text not smaller than List
 * text), C96991 (saved density cannot load -> Regular), C96992 (List and other tables unchanged).
 * Density control `button_density`, options `option_density_compact|regular|comfortable` (measured 2026-10-08);
 * the choice is saved in the work-orders-list preference as `density`. Runs as our own test admin (runner.mts).
 * Sizes are read with getComputedStyle / getBoundingClientRect: font-size of the text in a row or card, row height,
 * card height and padding.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows, person, roleIds, HEAVY, LETH } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';
import { RUNNER_EMAIL } from './runner.mts';

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
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {}); return { ctx, pg: await ctx.newPage() }; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 's6-batch.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };



const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const where = (pg: Page) => pg.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) as Promise<string | null>;
const density = async (pg: Page = p) => {
  const b = pg.locator('[data-test-id="button_density"]'); if (!(await b.count()) || !(await b.isVisible())) return { present: false };
  await b.click(); await pg.waitForTimeout(1000);
  const opts = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ id: e.getAttribute('data-test-id').replace('option_density_', ''), label: e.innerText.replace(/\\s+/g, ' ').trim(), selected: e.getAttribute('aria-selected') === 'true' || e.getAttribute('aria-checked') === 'true' || /active|selected/.test(e.className) || !!e.querySelector('.q-radio__inner--truthy, [aria-checked=true], i.text-primary') }))`) as any[];
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  return { present: true, opts, selected: opts.filter((o) => o.selected).map((o) => o.label) };
};
const setDensity = async (d: string, pg: Page = p) => { await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800); await pg.locator(`[data-test-id="option_density_${d}"]`).click(); await pg.waitForTimeout(1500); await pg.keyboard.press('Escape').catch(() => {}); await pg.waitForTimeout(400); };
const sizes = (pg: Page, sel: string) => pg.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
  const texts = [...e.querySelectorAll('*')].filter(x => x.childNodes.length && [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)).map(x => parseFloat(getComputedStyle(x).fontSize));
  return { h: Math.round(r.height), w: Math.round(r.width), pad: cs.padding, minFont: Math.min(...texts), maxFont: Math.max(...texts), text: e.innerText.replace(/\\s+/g, ' ').slice(0, 300) }; })()`);
const rowSel = (wo: string) => `[data-test-id="tech_view_row_${wo}"]`, cardSel = (wo: string) => `[data-test-id="board_card_${wo}"]`;
const listRowSizes = (pg: Page, num: string) => pg.evaluate(`(() => { const tr = [...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes(${JSON.stringify(num)})); if (!tr) return null;
  const texts = [...tr.querySelectorAll('td *')].filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)).map(x => parseFloat(getComputedStyle(x).fontSize));
  return { h: Math.round(tr.getBoundingClientRect().height), minFont: Math.min(...texts), maxFont: Math.max(...texts) }; })()`);
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
const roles: any[] = ((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data?.collection ?? []);
const ADMIN_ROLE = roles.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(await roleIds(a)).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];

await run('C96987', async () => {
  const n = 'ZZAUTOTEST F1 Density Choices'; await seed(n, 'ZZF6DC', [null]);
  const { row: ub } = await person(a, 'ZZ Density', 'Newuser', { role: ADMIN_ROLE, email: `zz.wob.density.${Date.now() % 1000000}@staging.shopview.local` });
  const v = await viewAs(browser, p, a, ub.id, me.id, RUN.toRunner);
  try { const pg = v.page; const pref = (await a.get(PREF)).body?.data?.value ?? null;
    await go('List', n, pg); const list = await density(pg);
    await display(pg, 'Tech View'); await pg.waitForTimeout(1500); const tech = await density(pg); await shot(pg, 'C96987-tech');
    await display(pg, 'Board View'); await pg.waitForTimeout(1500); const board = await density(pg);
    R.C96987 = { savedBefore: pref, list, tech, board };
  } finally { await v.close(); }
});

await run('C96988', async () => {
  const n = 'ZZAUTOTEST F1 Density Content'; const w = await seed(n, 'ZZF6CT', [ES.staff_id]); const wo = w[0].id;
  await go('Board View', n); await setSwitch('Board View', 'time_estimate', true); await setSwitch('Board View', 'total_price', true);
  R.C96988 = { board: {}, tech: {} };
  for (const d of ['compact', 'regular', 'comfortable']) { await setDensity(d); R.C96988.board[d] = { card: await card(p, wo), size: await sizes(p, cardSel(wo)) }; await shot(p, `C96988-board-${d}`); }
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await expandSmallGroups(p);
  for (const d of ['compact', 'regular', 'comfortable']) { await setDensity(d); R.C96988.tech[d] = { heads: await heads(), size: await sizes(p, rowSel(wo)) }; }
  const same = (o: any, k: string) => new Set(Object.values(o).map((x: any) => JSON.stringify(x[k]))).size === 1;
  R.C96988.sameCardEverywhere = same(R.C96988.board, 'card'); R.C96988.sameTechHeads = same(R.C96988.tech, 'heads');
  R.C96988.sameRowText = new Set(Object.values(R.C96988.tech).map((x: any) => x.size?.text)).size === 1;
});

await run('C96989', async () => {
  const n = 'ZZAUTOTEST F1 Density Shared'; await seed(n, 'ZZF6SH', [null]);
  await go('Tech View', n); await setDensity('compact'); await setDensity('comfortable');
  await display(p, 'Board View'); await p.waitForTimeout(1500); R.C96989 = { boardAfterTechChange: (await density()).selected, saved: (await prefGet()).density };
  const s = await second(); try { await go('Board View', n, s.pg); R.C96989.secondBrowser = { at: await where(s.pg), board: (await density(s.pg)).selected };
    await display(s.pg, 'Tech View'); await s.pg.waitForTimeout(1500); R.C96989.secondBrowser.tech = (await density(s.pg)).selected; } finally { await s.ctx.close(); }
  R.C96989.move = say(await a.post('/api/iam/change-location', { workplace_id: LETH, workplace_timezone: 'America/Edmonton' }));
  const s2 = await second(); try { await s2.pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await s2.pg.waitForTimeout(6000); await tab(s2.pg, 'All'); await display(s2.pg, 'Tech View');
    R.C96989.loc2 = { at: await where(s2.pg), tech: (await density(s2.pg)).selected }; await shot(s2.pg, 'C96989-loc2'); } finally { await s2.ctx.close(); }
  R.C96989.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
});

await run('C96990', async () => {
  const n = 'ZZAUTOTEST F1 Compact Text'; const w = await seed(n, 'ZZF6CX', [ES.staff_id]); const wo = w[0].id, num = w[0].number;
  await go('List', n); R.C96990 = { list: await listRowSizes(p, num) };
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await expandSmallGroups(p); await setDensity('compact'); R.C96990.techCompact = await sizes(p, rowSel(wo)); await shot(p, 'C96990-tech-compact');
  await display(p, 'Board View'); await p.waitForTimeout(1500); R.C96990.boardCompact = await sizes(p, cardSel(wo)); await shot(p, 'C96990-board-compact');
  R.C96990.bodyFont = await p.evaluate(`parseFloat(getComputedStyle(document.body).fontSize)`);
});

await run('C96991', async () => {
  const n = 'ZZAUTOTEST F1 Density Load Fail'; await seed(n, 'ZZF6LF', [null]);
  await go('Tech View', n); await setDensity('comfortable'); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96991 = { normalReload: (await density()).selected };
  const fail = (u: URL) => /preferences\/work-orders-list/.test(u.toString());
  const handler = async (r: any) => { if (r.request().method() === 'GET') await r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"ZZ forced failure"}]}' }); else await r.continue(); };
  await p.route(fail, handler);
  await go('Tech View', n); R.C96991.failTech = (await density()).selected; await shot(p, 'C96991-fail-tech');
  await display(p, 'Board View'); await p.waitForTimeout(1500); R.C96991.failBoard = (await density()).selected;
  await p.unroute(fail, handler);
  R.C96991.savedStill = (await prefGet()).density;
});

await run('C96992', async () => {
  const n = 'ZZAUTOTEST F1 Density Scope'; const w = await seed(n, 'ZZF6SC', [ES.staff_id]); const wo = w[0].id, num = w[0].number;
  await go('Tech View', n); await setDensity('regular');
  await go('List', n); const list0 = await listRowSizes(p, num);
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const cust0 = await p.evaluate(`(() => { const tr = document.querySelector('tbody tr'); return tr ? Math.round(tr.getBoundingClientRect().height) : null; })()`);
  await go('Tech View', n); await expandSmallGroups(p); const t: any = {};
  for (const d of ['comfortable', 'compact']) { await setDensity(d); t[d] = (await sizes(p, rowSel(wo)))?.h; }
  await display(p, 'Board View'); await p.waitForTimeout(1500); const boardCompact = await sizes(p, cardSel(wo)); await setDensity('comfortable'); const boardComfortable = await sizes(p, cardSel(wo)); await setDensity('compact');
  await go('List', n); const list1 = await listRowSizes(p, num);
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const cust1 = await p.evaluate(`(() => { const tr = document.querySelector('tbody tr'); return tr ? Math.round(tr.getBoundingClientRect().height) : null; })()`);
  R.C96992 = { listRowBefore: list0, listRowAfterCompact: list1, techRow: t, boardCard: { compact: { h: boardCompact?.h, pad: boardCompact?.pad }, comfortable: { h: boardComfortable?.h, pad: boardComfortable?.pad } }, customersRow: { before: cust0, after: cust1 } };
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's6-batch.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
