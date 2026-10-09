/**
 * S7 (2026-10-09) — line technicians on cards and rows: C96993 (lead + line techs + a scheduled tech), C96994 (lead
 * first, each once), C96995 (+N and every name on hover), C96996 (blank only with nobody), C368141 (Assigned Techs right
 * after Lines), C368142 / C368143 (the Lines tab shows scheduled technicians instead of Unassigned).
 * S8 look (C96997-C97000): the Lines tab of a work order with and without a tech story, photographed and its parts
 * listed, on the normal page and as a technician (Esther Howard, viewAs) — judged from the pictures.
 * Line technicians: PUT /api/work-orders/lines/{lineId}/technicians {staffIds}; shifts on lines: shifts.mts mkShift.
 * Runs as our own test admin (runner.mts).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';
import { viewAs } from './viewas.mts';
import { candidates } from './data.mts';
import { mkShift } from './shifts.mts';
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
  fs.writeFileSync(path.join(EV, 's7-batch.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };



const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const DO = await sid('dana.ortiz'), JW = await sid('jenny.wilson'), KW = await sid('kristin.watson'), TW = await sid('theresa.webb');
R.people = Object.fromEntries(Object.entries({ ES, RE, DO, JW, KW, TW }).map(([k, v]: [string, any]) => [k, !!v?.staff_id]));
await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const lineName = (i: number) => String(canned[i % canned.length].canned_line_name ?? canned[i % canned.length].name ?? '').trim();
const giveLine = async (l: string, staff: string[]) => say(await a.put(`/api/work-orders/lines/${l}/technicians`, { staffIds: staff }));
/** a work order with lines added BEFORE the lead (so a line with no explicit technician has nobody), then the lead */
async function wo(c: any, nLines: number, lead: string | null) {
  const w = await workOrder(a, c, 'estimate', null); const ls: string[] = []; for (let i = 1; i <= nLines; i++) ls.push(await mkLine(w, i));
  await a.post('/api/work-orders/change-status', { id: w, status: 'approved' });
  if (lead) await a.post('/api/work-orders/change-lead-technician', { work_order_id: w, tech_assigned_id: lead });
  return { w, ls };
}
const tooltip = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
/** the avatars in one container, in order: initials (or +N) and what hovering each shows */
async function avatars(container: string) {
  const host = p.locator(container); if (!(await host.count())) return { missing: container };
  const items = host.locator('.q-avatar, [class*="avatar"]:not(:has(.q-avatar))').filter({ visible: true });
  const n = await items.count(); const out: any[] = [];
  for (let i = 0; i < n; i++) { const it = items.nth(i); const txt = (await it.innerText().catch(() => '')).trim();
    const box = JSON.stringify(await it.boundingBox()); if (out.some((o) => o.box === box)) continue;
    await it.hover().catch(() => {}); await p.waitForTimeout(900); out.push({ text: txt, hover: await tooltip(), box });
    await p.mouse.move(5, 5); await p.waitForTimeout(400); }
  const plus = host.getByText(/^\+\d+$/).first(); let plusHover = null;
  if (await plus.count()) { await plus.hover(); await p.waitForTimeout(1000); plusHover = { text: await plus.innerText(), hover: await tooltip() }; await p.mouse.move(5, 5); }
  return { list: out.map((o) => ({ text: o.text, hover: o.hover })), plus: plusHover, whole: (await host.innerText().catch(() => '')).replace(/\s+/g, ' ') };
}
/** the Tech View cell under a header, for the row of this work order */
const techCell = (woId: string, head: string) => `[data-test-id="tech_view_row_${woId}"] > td:nth-child(${0})`.replace('nth-child(0)', `nth-child(${head})`);
async function assignedCell(woId: string) {
  const idx = await p.evaluate(`[...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).findIndex(e => /Assigned Techs/.test(e.innerText)) + 1`);
  return idx > 0 ? `[data-test-id="tech_view_row_${woId}"] > td:nth-child(${idx})` : null;
}
const both = async (n: string, wos: string[], tag: string) => {
  const out: any = { board: {}, tech: {} };
  await go('Board View', n); await setSwitch('Board View', 'line_technicians', true);
  for (const w of wos) out.board[w] = await avatars(`[data-test-id="board_card_${w}"] [data-test-id="board_card_field_line_technicians"]`);
  await shot(p, `${tag}-board`);
  await display(p, 'Tech View'); await p.waitForTimeout(1500); await expandSmallGroups(p); await setSwitch('Tech View', 'assigned_techs', true);
  for (const w of wos) { const cell = await assignedCell(w); out.tech[w] = cell ? await avatars(cell) : 'no Assigned Techs column'; }
  await shot(p, `${tag}-tech`); return out;
};

await run('C96993', async () => {
  const n = `ZZAUTOTEST F3 Avatar Group ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3AG');
  const { w, ls } = await wo(c, 3, ES.staff_id);
  R.C96993 = { give: [await giveLine(ls[0], [RE.staff_id]), await giveLine(ls[1], [DO.staff_id])], shift: await mkShift(a, w, JW.staff_id, 1, '08:00', 120, [ls[2]]).then(() => 'ok', (e) => String(e).slice(0, 160)) };
  R.C96993.lineTechs = ((await a.get(`/api/work-orders/${w}/line-technicians`)).body?.data?.lineTechnicians ?? []).map((x: any) => (x.technicians ?? []).map((t: any) => `${t.firstName} ${t.lastName}`).join('+') || '-');
  Object.assign(R.C96993, await both(n, [w], 'C96993'));
  await display(p, 'List'); await p.waitForTimeout(1500); R.C96993.listOffers = (await menu('List')).items.map((x: any) => x[1]); await close();
});

await run('C96994', async () => {
  const n = `ZZAUTOTEST F3 Lead First Once ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3LF');
  const { w, ls } = await wo(c, 3, ES.staff_id);
  R.C96994 = { give: [await giveLine(ls[0], [ES.staff_id]), await giveLine(ls[1], [RE.staff_id]), await giveLine(ls[2], [RE.staff_id])] };
  Object.assign(R.C96994, await both(n, [w], 'C96994'));
});

await run('C96995', async () => {
  const n = `ZZAUTOTEST F3 Plus N Avatars ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3PN');
  const { w, ls } = await wo(c, 5, ES.staff_id);
  R.C96995 = { give: await Promise.all([RE, DO, JW, KW, TW].map((s, i) => giveLine(ls[i], [s.staff_id]))) };
  Object.assign(R.C96995, await both(n, [w], 'C96995'));
});

await run('C96996', async () => {
  const n = `ZZAUTOTEST F3 Blank Technician ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3BT');
  const A = await wo(c, 1, null), B = await wo(c, 1, null), C = await wo(c, 1, ES.staff_id);
  R.C96996 = { giveB: await giveLine(B.ls[0], [RE.staff_id]) };
  const all = await workOrders(a, n); const num = (id: string) => all.find((x: any) => x.id === id)?.number;
  R.C96996.ids = { a: num(A.w), b: num(B.w), c: num(C.w) };
  Object.assign(R.C96996, await both(n, [A.w, B.w, C.w], 'C96996'));
});

await run('C368141', async () => {
  const n = `ZZAUTOTEST F3 Assigned Techs Column ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3AT'); await wo(c, 1, ES.staff_id);
  await go('Tech View', n); await expandSmallGroups(p); await setSwitch('Tech View', 'assigned_techs', false);
  R.C368141 = { startOn: onKeys(await menu('Tech View')).includes('assigned_techs') }; await close();
  await setSwitch('Tech View', 'lines_count', true); await setSwitch('Tech View', 'assigned_techs', true);
  const h = await heads(); R.C368141.heads = h; R.C368141.rightOfLines = h[h.indexOf('Lines') + 1]; await shot(p, 'C368141-on');
  await setSwitch('Tech View', 'assigned_techs', false); R.C368141.afterOff = (await heads()).includes('Assigned Techs');
});

for (const id of ['C368142', 'C368143']) await run(id, async () => {
  const n = `ZZAUTOTEST F3 ${id === 'C368142' ? 'Scheduled Techs Lines' : 'Unassigned Labor Row'} ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3SL');
  const { w, ls } = await wo(c, 3, null);
  const o: any = { names: [lineName(1), lineName(2), lineName(3)] };
  o.shifts = [await mkShift(a, w, JW.staff_id, 1, '08:00', 120, [ls[1]]).then(() => 'ok', (e) => String(e).slice(0, 120)), await mkShift(a, w, RE.staff_id, 1, '10:00', 120, [ls[2]]).then(() => 'ok', (e) => String(e).slice(0, 120)), await mkShift(a, w, DO.staff_id, 1, '13:00', 120, [ls[2]]).then(() => 'ok', (e) => String(e).slice(0, 120))];
  const page = async (tag: string) => { await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await shot(p, `${id}-${tag}`);
    return p.evaluate(`(() => { const out = {}; const blocks = [...document.querySelectorAll('[data-test-id^="line_"], .line-item, .work-order-line, [class*="line-card"]')];
      const ids = [...new Set([...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g, '<id>')).filter(t => /labor|labour|line|story|badge|tech/i.test(t)))].slice(0, 80);
      const labor = [...document.querySelectorAll('*')].filter(e => e.children.length < 8 && /^\\s*Labor/.test(e.innerText || '') && e.getBoundingClientRect().height < 120).map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 200));
      return { ids, labor: [...new Set(labor)].slice(0, 12), needsTechs: document.body.innerText.includes('Needs techs'), text: (document.querySelector('main, .q-page') || document.body).innerText.replace(/\\s+/g, ' ').slice(0, 2500) }; })()`); };
  o.page = await page('lines');
  if (id === 'C368143') { o.giveLine1 = await giveLine(ls[0], [RE.staff_id]); o.after = await page('after'); }
  R[id] = o;
});

// S8 look: tech story check mark — one line with a story, one without
await run('S8', async () => {
  const n = `ZZAUTOTEST F3 Story Check Mark ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF3SC');
  const { w, ls } = await wo(c, 2, ES.staff_id);
  R.S8 = { story: say(await a.post('/api/work-orders/lines/change-story', { line_id: ls[0], tech_story: 'Brought unit in. Completed inspection.', work_order_id: w })), names: [lineName(1), lineName(2)] };
  await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await shot(p, 'S8-lines-admin');
  R.S8.icons = await p.evaluate(`[...new Set([...document.querySelectorAll('i.q-icon, i.material-icons, svg')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.innerText || e.getAttribute('data-test-id') || e.getAttribute('aria-label') || '').trim()).filter(Boolean))]`);
  R.S8.storyIds = await p.evaluate(`[...new Set([...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g, '<id>')).filter(t => /story|check|note/i.test(t)))]`);
  const v = await viewAs(browser, p, a, ES.id, me.id, RUN.toRunner);
  try { await v.page.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(7000); await shot(v.page, 'S8-lines-tech');
    R.S8.tech = { perms: v.perms, url: v.page.url().replace(APP, ''), icons: await v.page.evaluate(`[...new Set([...document.querySelectorAll('i.q-icon, i.material-icons')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.trim()).filter(Boolean))]`) }; }
  finally { await v.close(); }
  R.S8.wo = (await workOrders(a, n))[0]?.number;
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's7-batch.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
