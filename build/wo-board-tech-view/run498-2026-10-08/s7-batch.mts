/**
 * S7 (2026-10-09) — line technicians on cards and rows: C96993 (lead + line techs + a scheduled tech), C96994 (lead
 * first, each once), C96995 (+N and every name on hover), C96996 (blank only with nobody), C368141 (Assigned Techs right
 * after Lines), C368142 / C368143 (the Lines tab shows scheduled technicians instead of Unassigned).
 * S8 look (C96997-C97000): the Lines tab of a work order with and without a tech story, photographed and its parts
 * listed, on the normal page and as a technician (Esther Howard, viewAs) — judged from the pictures.
 * Line technicians: PUT /api/work-orders/lines/{lineId}/technicians {staffIds}; shifts on lines: shifts.mts mkShift.
 * Runs as our own test admin (runner.mts).
 */
import { ME_NAME } from './profile.mts';
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
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
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
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 6000));
  fs.writeFileSync(path.join(EV, 's7-batch.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };



const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const DO = await sid('dana.ortiz'), JW = await sid('jenny.wilson'), KW = await sid('kristin.watson'), TW = await sid('theresa.webb');
R.people = Object.fromEntries(Object.entries({ ES, RE, DO, JW, KW, TW }).map(([k, v]: [string, any]) => [k, !!v?.staff_id]));
await a.put(PREF, { value: { ...(await prefGet()), pinnedTechnicianIds: [ES.staff_id, RE.staff_id] } });
const me = (await candidates(a)).find((x) => x.name === ME_NAME)!;
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

// 15 Oct 2026 (staging second pass): the three story cases were one block with the id 'S8', so a run filtered with
// ONLY=C96997,C96999,C97000 skipped it and logged nothing. Each case now has its own block, its own customer (the case's name +
// a run number), its own lines, and logs its own line: the Lines tab read on the normal page and — for C96997 / C97000 — in the
// Tech View work order mode as Esther Howard (Technician role, her own window via viewAs). Per line: the text around its Story row,
// every icon drawn inside the line, and any element whose test-id or class mentions story / check / required.
const storyRead = (pg: Page) => pg.evaluate(`(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const story = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.children.length === 0 && /story/i.test(e.textContent || '')).map(e => { let c = e; for (let i = 0; i < 3 && c.parentElement; i++) c = c.parentElement; return c.innerText.replace(/\\s+/g, ' ').trim().slice(0, 200); });
  const marks = [...document.querySelectorAll('[data-test-id], [class]')].filter(e => vis(e) && /story|check|required/i.test((e.getAttribute('data-test-id') || '') + ' ' + (typeof e.className === 'string' ? e.className : ''))).map(e => (e.getAttribute('data-test-id') || e.className).toString().replace(/[0-9a-f-]{36}/g, '<id>').slice(0, 80));
  const icons = [...document.querySelectorAll('i.q-icon, i.material-icons, svg')].filter(vis).map(e => (e.innerText || e.getAttribute('data-test-id') || e.getAttribute('aria-label') || '').trim()).filter(Boolean);
  return { storyRows: [...new Set(story)].slice(0, 8), storyOrCheckElements: [...new Set(marks)].slice(0, 20), checkIcons: icons.filter(x => /check|done|task_alt|verified/i.test(x)), icons: [...new Set(icons)].slice(0, 60) }; })()`);
async function storyCase(id: string, name: string, unit: string, stories: (string | null)[], techToo: boolean) {
  const n = `${name} ${Date.now() % 100000}`; const c = await customer(a, n, unit);
  const { w, ls } = await wo(c, stories.length, ES.staff_id);
  const o: any = { workOrder: null, lines: stories.map((st, i) => ({ line: lineName(i + 1), story: st })) };
  for (let i = 0; i < stories.length; i++) if (stories[i]) o.lines[i].saved = say(await a.post('/api/work-orders/lines/change-story', { line_id: ls[i], tech_story: stories[i], work_order_id: w }));
  o.workOrder = (await workOrders(a, n))[0]?.number;
  await p.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await shot(p, `${id}-lines-admin`);
  o.admin = await storyRead(p);
  if (techToo) { const v = await viewAs(browser, p, a, ES.id, me.id, RUN.toRunner);
    try { await v.page.goto(`${APP}/workorders/${w}/lines`, { waitUntil: 'domcontentloaded' }); await v.page.waitForTimeout(7000); await shot(v.page, `${id}-lines-tech-mode`);
      o.techMode = { user: 'Esther Howard', perms: v.perms, url: v.page.url().replace(APP, ''), ...((await storyRead(v.page)) as any) }; }
    finally { await v.close(); } }
  R[id] = o;
}
await run('C96997', () => storyCase('C96997', 'ZZAUTOTEST F3 Story Check Mark', 'ZZF3SC', ['Brought unit in. Completed inspection.'], true));
await run('C96999', async () => { await storyCase('C96999', 'ZZAUTOTEST F3 No Story Look', 'ZZF3NL', [null], false);
  // 15 Oct 2026 (wave 12): a REAL production comparison (QA lead 15 Oct: production allowed for comparisons). Production is signed in
  // with prod-login-boot.mjs (as report-filters-stg.mts / high1-batch.mts), READ ONLY: the most recent work orders are read through the
  // app's own list call and the first one with a line that has NO tech story is opened on its Lines tab; the same reading as staging
  // (storyRead) is taken there, with a picture of the page and of that line on each side. Nothing is changed on production.
  const lineClip = async (pg: Page, name: string) => { const b = await pg.evaluate(`(() => { const e = [...document.querySelectorAll('body *')].find(x => x.children.length === 0 && /story/i.test(x.textContent || '') && x.getBoundingClientRect().width > 0); if (!e) return null; let c = e; for (let i = 0; i < 5 && c.parentElement && c.getBoundingClientRect().height < 120; i++) c = c.parentElement; const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()`).catch(() => null) as any;
    if (b) await pg.screenshot({ path: path.join(EV, `${name}.png`), clip: { x: Math.max(0, b.x - 16), y: Math.max(0, b.y - 60), width: Math.min(b.w + 32, 1600), height: Math.min(b.h + 120, 900) } }).catch(() => {}); return b ? `${name}.png` : 'no story row found'; };
  R.C96999.stagingLinePicture = await lineClip(p, 'C96999-staging-line');
  let prod: any = null; try { prod = await bootProdLogin('/workorders', { deviceScaleFactor: Number(process.env.QA_DPR || process.env.WOB_SCALE || 1) }); } catch (e: any) { R.C96999.production = { error: 'production sign-in: ' + String(e?.message || e).slice(0, 200) }; }
  if (prod) { const pp: Page = prod.page; const P = prod.APP; const pr: any = { build: prod.version ?? await pp.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null), tried: [] };
    try {
      const PAPI = 'https://api.shopview.com';
      const get = (u: string) => pp.evaluate(`fetch(${JSON.stringify(PAPI)} + ${JSON.stringify(u)}, { credentials: 'include', headers: { Accept: 'application/json' } }).then(async r => ({ status: r.status, body: await r.json().catch(() => null) }))`) as Promise<any>;
      const list = await get('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=40&pagination[sortBy]=createdAt&pagination[descending]=true&search=');
      pr.listStatus = list.status; const ws: any[] = list.body?.data?.work_orders ?? [];
      for (const w of ws.filter((x) => /approved|in_progress/.test(String(x.status))).slice(0, 15)) { const d = (await get(`/api/work-orders/lines/${w.id}`)).body?.data; const ls: any[] = Array.isArray(d) ? d : d?.collection ?? d?.lines ?? [];
        const noStory = ls.find((l) => !String(l.tech_story ?? '').trim()); pr.tried.push(`${w.number} ${w.status}: ${ls.length} line(s), ${noStory ? 'one without a story' : 'all have stories'}`); if (noStory) { pr.workOrder = w.number; pr.workOrderId = w.id; pr.line = String(noStory.line_name ?? noStory.name ?? '').trim().slice(0, 60); break; } }
      if (pr.workOrderId) { await pp.goto(`${P}/workorders/${pr.workOrderId}/lines`, { waitUntil: 'domcontentloaded' }); await pp.waitForTimeout(9000);
        await pp.screenshot({ path: path.join(EV, 'C96999-production-lines.png') }).catch(() => {}); pr.reading = await storyRead(pp); pr.linePicture = await lineClip(pp, 'C96999-production-line'); }
      else pr.note = 'no recent Approved / In Progress production work order with a line without a story among the ones read';
    } catch (e: any) { pr.error = String(e?.message || e).slice(0, 300); await pp.screenshot({ path: path.join(EV, 'C96999-production-error.png') }).catch(() => {}); }
    finally { await prod.browser.close().catch(() => {}); }
    R.C96999.production = pr; }
  R.C96999.note = 'staging: C96999-lines-admin.png + C96999-staging-line.png; production: C96999-production-lines.png + C96999-production-line.png (read only)'; });
await run('C97000', () => storyCase('C97000', 'ZZAUTOTEST F3 No Story Marker', 'ZZF3NM', ['Brought unit in. Completed inspection.', null], true));

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's7-batch.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
