/**
 * S6b (2026-10-09) — density follow-ups: C96988 with lines that carry estimated hours, C96992's other-table measurement, C96989 at a second location (the runner is enrolled at Lethbridge by s5-batchA3).
 * S6 (2026-10-09) — density across the three displays: C96987 (choices, Regular by default, none in List),
 * C96988 (spacing only, never content), C96989 (one shared choice, kept), C96990 (Compact text not smaller than List
 * text), C96991 (saved density cannot load -> Regular), C96992 (List and other tables unchanged).
 * Density control `button_density`, options `option_density_compact|regular|comfortable` (measured 2026-10-08);
 * the choice is saved in the work-orders-list preference as `density`. Runs as our own test admin (runner.mts).
 * Sizes are read with getComputedStyle / getBoundingClientRect: font-size of the text in a row or card, row height,
 * card height and padding.
 */
import { ME_NAME, LOC1_NAME, LOC2_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups, switchLocUI } from './wob.mts';
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
const second_old = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {}); return { ctx, pg: await ctx.newPage() }; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000));
  fs.writeFileSync(path.join(EV, 's6b-batch.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };



const LS = await p.evaluate(`Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))`) as Record<string, string>;
R.localStorageKeys = Object.keys(LS);
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
  const keep = Object.fromEntries(Object.entries(LS).filter(([k]) => /^(user|fe_permissions_wrapper|token)$/.test(k)));
  await ctx.addInitScript((kv: Record<string, string>) => { try { if (!sessionStorage.getItem('zz_seeded')) { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); sessionStorage.setItem('zz_seeded', '1'); } } catch { /* */ } }, keep);
  return { ctx, pg: await ctx.newPage(), kept: Object.keys(keep) }; };


const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const where = (pg: Page) => pg.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l) || l.includes(${JSON.stringify(LOC1_NAME)}) || l.includes(${JSON.stringify(LOC2_NAME)})) || null /* 22 Oct 2026: production names have no ' - 9919' */`) as Promise<string | null>;
// 15 Oct 2026 (wave 12): `pic` = take that picture WHILE the Density menu is open, so the ticked choice shows (C96989)
const density = async (pg: Page = p, pic?: string) => {
  const b = pg.locator('[data-test-id="button_density"]'); if (!(await b.count()) || !(await b.isVisible())) return { present: false };
  await b.click(); await pg.waitForTimeout(1000); if (pic) { await pg.mouse.move(1, 1); await pg.waitForTimeout(300); await shot(pg, pic); }
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
const me = (await candidates(a)).find((x) => x.name === ME_NAME)!;
const ORG = (await import('./profile.mts')).ORG;
const roles: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data) /* 15 Oct 2026: staging answers a plain list (L0339) */;
const ADMIN_ROLE = roles.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(await roleIds(a)).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];


const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const custRow = async () => { for (let i = 0; i < 15; i++) { const h = await p.evaluate(`(() => { const r = [...document.querySelectorAll('tbody tr')].find(x => x.getBoundingClientRect().height > 0); return r ? Math.round(r.getBoundingClientRect().height) : null; })()`); if (h) return h; await p.waitForTimeout(1000); } return null; };

await run('C96988', async () => {
  const n = `ZZAUTOTEST F1 Density Content ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF6CT');
  const w = await workOrder(a, c, 'estimate', null); for (const i of [1, 2, 3]) await mkLine(w, i);
  await a.post('/api/work-orders/change-status', { id: w, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: ES.staff_id });
  // 22 Oct 2026: the case is Tech View only (PRD v73 S6-R1; Board View has no density control, S3-R11). Lead Technician turned on,
  // start at Regular (step 1 = the reference), then Compact (steps 2-3) and Comfortable (steps 4-5): headings + the row's text each time.
  await go('Tech View', n); R.C96988 = { leadSwitch: await setSwitch('Tech View', 'technician', true), totalSwitch: await setSwitch('Tech View', 'total_price', true), tech: {} }; // 23 Oct: the Lead Technician switch is toggle_tech_view_column_technician
  await expandSmallGroups(p);
  for (const d of ['regular', 'compact', 'comfortable']) { await setDensity(d); await expandSmallGroups(p); R.C96988.tech[d] = { heads: await heads(), size: await sizes(p, rowSel(w)) }; await shot(p, `C96988-tech-${d}`); }
  R.C96988.order = ['regular', 'compact', 'comfortable'];
  R.C96988.heights = Object.fromEntries(Object.entries(R.C96988.tech).map(([k, v]: any) => [k, v.size?.h ?? null]));
  const same = (o: any, k: string) => new Set(Object.values(o).map((x: any) => JSON.stringify(x[k]))).size === 1;
  R.C96988.sameTechHeads = same(R.C96988.tech, 'heads');
  R.C96988.sameRowText = new Set(Object.values(R.C96988.tech).map((x: any) => x.size?.text)).size === 1;
});

// 15 Oct 2026 (staging second pass): C96992 compared only the Customers table, and C96989 looked for the old location menu
// (not on staging), so nothing after "Comfortable" was recorded. Both now follow their steps; see each block.
const rowH = (sel: string) => p.evaluate(`(() => { const r = [...document.querySelectorAll(${JSON.stringify(sel)})].find(x => x.getBoundingClientRect().height > 0); return r ? Math.round(r.getBoundingClientRect().height) : null; })()`) as Promise<number | null>;
const cardsIn = (colId: string) => p.evaluate(`(() => { const c = document.querySelector('[data-test-id="board_column_${'${C}'}"]'); if (!c) return null; const cs = [...c.querySelectorAll('[data-test-id^="board_card_"]')].filter(e => /^board_card_[0-9a-f-]{36}$/.test(e.getAttribute('data-test-id'))).map(e => e.getBoundingClientRect()).filter(r => r.height > 0).sort((x, y) => x.top - y.top);
  return { cards: cs.length, heights: cs.map(r => Math.round(r.height)), gaps: cs.slice(1).map((r, i) => Math.round(r.top - cs[i].bottom)), padding: getComputedStyle(c.querySelector('[data-test-id^="board_card_"]') || c).padding }; })()`.split('${C}').join(colId));
await run('C96992', async () => {
  const n = 'ZZAUTOTEST F6 Density Rows'; const ws = await seed(n, 'ZZF6DR', [ES.staff_id, ES.staff_id, ES.staff_id]);
  const o: any = { workOrders: ws.map((w: any) => w.number) };
  // step 5's "before": another table (Customers) at the starting density
  await go('Tech View'); await setDensity('regular'); o.start = (await density()).selected;
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); o.customersBefore = await custRow(); await shot(p, 'C96992-customers-before');
  // step 1: List row height
  await go('List', n); await p.waitForTimeout(1500); o.listBefore = await rowH('tbody tr'); await shot(p, 'C96992-list-before');
  // step 2: Tech View rows at Regular, Comfortable, Compact
  await go('Tech View', n); o.tech = { regular: await rowH('[data-test-id^="tech_view_row_"]') };
  await setDensity('comfortable'); o.tech.comfortable = await rowH('[data-test-id^="tech_view_row_"]'); await shot(p, 'C96992-tech-comfortable');
  await setDensity('compact'); o.tech.compact = await rowH('[data-test-id^="tech_view_row_"]'); await shot(p, 'C96992-tech-compact');
  // step 3: Board View cards at Compact (and Regular as the reference, then back to Compact)
  await display(p, 'Board View'); await p.waitForTimeout(1500); o.board = { selected: (await density()).selected, compact: await cardsIn(ES.staff_id) }; await shot(p, 'C96992-board-compact');
  // 22 Oct 2026: the case (PRD v73) reads Board View with NO density button — nothing is set on Board View; the card is read as it is
  o.board.densityButtons = await p.locator('[data-test-id="button_density"]:visible').count();
  // step 4: List again
  await display(p, 'List'); await p.waitForTimeout(1500); o.listAfter = await rowH('tbody tr'); await shot(p, 'C96992-list-after');
  // step 5: Customers again
  await p.goto(APP + '/customers', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); o.customersAfter = await custRow(); await shot(p, 'C96992-customers-after');
  R.C96992 = o;
});

await run('C96989', async () => {
  const o: any = {}; R.C96989 = o;
  // step 1-2: Comfortable in Tech View, then Board View
  await go('Tech View'); await setDensity('comfortable'); o.techAfterSet = (await density(p, 'C96989-tech-density-menu-open')).selected; o.saved = (await prefGet()).density;
  await display(p, 'Board View'); await p.waitForTimeout(1500); o.board = (await density(p, 'C96989-board-density-menu-open')).selected;
  // step 3-4: "log out and back in" and "a second browser" — a NEW browser window carrying only the sign-in (no page storage
  // except the sign-in's own user record). A real sign-out would end the shared staging session for every later script (L0342).
  const s2 = await second();
  try { await go('Tech View', '', s2.pg); o.newWindowTech = (await density(s2.pg, 'C96989-new-window-tech-density-menu-open')).selected;
    await display(s2.pg, 'Board View'); await s2.pg.waitForTimeout(1500); o.newWindowBoard = (await density(s2.pg, 'C96989-new-window-board-density-menu-open')).selected;
  } finally { await s2.ctx.close().catch(() => {}); }
  o.signOutNote = 'step 3 done as a new browser window, not a real sign-out: signing out ends the shared staging session (L0342)';
  // step 5: the second location — enrol the runner at Lethbridge (app enrolment route), switch ON SCREEN (profile menu > select_location)
  const meRow = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL);
  const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = (dd.find((d: any) => (d.name ?? d.label) === 'Service') ?? dd[0]);
  if (meRow) o.enrolLeth = say(await a.post('/api/staff/enrollment/create', { staffId: meRow.staff_id, workplaceId: LETH, departmentId: svc?.id }));
  await go('Tech View'); o.switched = await switchLocUI(p, LOC2_NAME); o.at = await where(p);
  if (String(o.at).includes(LOC2_NAME)) { await go('Tech View'); o.atAfterOpen = await where(p); o.loc2Tech = (await density(p, 'C96989-lethbridge-tech-density-menu-open')).selected; await display(p, 'Board View'); await p.waitForTimeout(1500); o.loc2Board = (await density(p, 'C96989-lethbridge-board-density-menu-open')).selected; }
  o.backOnScreen = await switchLocUI(p, LOC1_NAME);
  o.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') }));
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's6b-batch.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
