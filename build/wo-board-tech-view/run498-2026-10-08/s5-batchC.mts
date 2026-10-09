/**
 * S5 batch C (2026-10-09) — card values against the work order's own data: C96978 (the 13 optional fields and their
 * values, compared with List), C96982 (every optional field off), C96984 (no unit shows the asset; a real zero shows),
 * C96985 (optional fields with no value are left off). Runs as our own test admin (runner.mts).
 * Assets are shaped with POST /api/vehicles/change {vehicle_id, company_id, customer_id, unit, year, vehicle_maker_id,
 * vehicle_model_id, vin} (create ignores make/model/unit — playbook §C); make/model ids are borrowed from an existing
 * vehicle of that make and model. (c) of C96984 is not built: the New Asset form will not save without a Make, and
 * the case says to skip it.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders, vehicle } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows } from './staff.mts';

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
  fs.writeFileSync(path.join(EV, 's5-batchC.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };


const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 160) : ''}`;
const canned: any[] = []; { const c = (await a.get('/api/work-orders/canned-lines')).body?.data; canned.push(...(Array.isArray(c) ? c : c?.collection ?? [])); }
const mkLine = async (wo: string, i: number) => (await a.post(`/api/work-orders/${wo}/lines/create-from-canned-line`, { canned_line_id: canned[i % canned.length].id, status: 'authorized' })).body?.data?.line_id as string;
const linesRaw = async (wo: string) => { const d = (await a.get(`/api/work-orders/lines/${wo}`)).body?.data; return Array.isArray(d) ? d : d?.collection ?? d?.lines ?? []; };
/** make/model ids borrowed from an existing vehicle whose make and model match */
const vehiclesSeen: any[] = [];
async function makeModel(make: RegExp, model: RegExp) {
  // vehicles carry the names as vehicle_make / vehicle_model (a string or {name}) next to vehicle_maker_id / vehicle_model_id
  const nm = (x: any) => typeof x === 'string' ? x : x?.name ?? x?.title ?? '';
  const qs = [model.source.replace(/[^A-Za-z0-9 ]/g, ''), make.source.replace(/[^A-Za-z0-9 ]/g, ''), ''];
  for (const q of qs) for (let page = 1; page <= (q ? 2 : 6); page++) {
    const r = await a.get(`/api/vehicles?pagination[rowsPerPage]=200&pagination[page]=${page}${q ? '&search=' + encodeURIComponent(q) : ''}`);
    const rows = r.body?.data?.collection ?? r.body?.data?.vehicles ?? r.body?.data ?? [];
    if (!Array.isArray(rows) || !rows.length) break;
    vehiclesSeen.push(...rows.slice(0, 2).map((v: any) => `${v.year} ${nm(v.vehicle_make)} ${nm(v.vehicle_model)}`));
    const hit = rows.find((v: any) => make.test(nm(v.vehicle_make)) && model.test(nm(v.vehicle_model)) && v.vehicle_maker_id && v.vehicle_model_id);
    if (hit) return { maker: hit.vehicle_maker_id, model: hit.vehicle_model_id, from: `${hit.year ?? ''} ${nm(hit.vehicle_make)} ${nm(hit.vehicle_model)}`.trim() };
  }
  return null;
}
async function shape(c: any, vid: string, o: { unit: string; year?: number; mm?: any; vin?: string }) {
  return say(await a.post('/api/vehicles/change', { vehicle_id: vid, company_id: c.company_id, customer_id: c.contact_id, unit: o.unit, year: o.year ?? null, vehicle_maker_id: o.mm?.maker ?? null, vehicle_model_id: o.mm?.model ?? null, ...(o.vin !== undefined ? { vin: o.vin } : {}) }));
}
const listRow = async (num: string, pg: Page = p) => pg.evaluate(`(() => { const hs = [...document.querySelectorAll('thead th')].map(e => e.innerText.replace('arrow_drop_up','').trim());
  const tr = [...document.querySelectorAll('tbody tr')].find(r => r.innerText.includes(${JSON.stringify(num)})); if (!tr) return null;
  const o = {}; [...tr.children].forEach((td, i) => { if (hs[i]) o[hs[i]] = td.innerText.replace(/\\s+/g, ' ').trim(); }); return o; })()`) as Promise<Record<string, string> | null>;
const tooltip = (pg: Page = p) => pg.evaluate(`[...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/\\s+/g, ' ').trim())`) as Promise<string[]>;
const allOn = async () => { const m = await menu('Board View'); await close(); for (const it of m.items ?? []) if (it[2] !== 'true') await setSwitch('Board View', it[0], true); };
const allOff = async () => { const m = await menu('Board View'); await close(); for (const it of m.items ?? []) if (it[2] === 'true') await setSwitch('Board View', it[0], false); };
const MM: any = {};
await run('assets', async () => {
  MM.explorer = await makeModel(/ford/i, /explorer/i); MM.m2 = await makeModel(/freightliner/i, /m2/i);
  R.assets = { explorer: MM.explorer, m2: MM.m2, seen: vehiclesSeen.slice(0, 12) };
  if (!MM.explorer || !MM.m2) throw new Error('make/model not found — the asset cases cannot be judged this run');
});

await run('C96978', async () => {
  const n = `ZZAUTOTEST F2 Card Field Values ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF2FV');
  const wo = await workOrder(a, c, 'estimate', null, true);
  const ls = [await mkLine(wo, 1), await mkLine(wo, 2), await mkLine(wo, 3)];
  await a.post('/api/work-orders/change-status', { id: wo, status: 'approved' });
  await a.post('/api/work-orders/change-lead-technician', { work_order_id: wo, tech_assigned_id: ES.staff_id });
  R.C96978 = { line2: say(await a.put(`/api/work-orders/lines/${ls[1]}/technicians`, { staffIds: [RE.staff_id] })) };
  R.C96978.advisor = say(await a.post('/api/work-orders/change-service-advisor', { work_order_id: wo, service_advisor_id: ES.staff_id }));
  // Esther clocked in on Line 1, Ralph on Line 2
  const clockIn = async (who: any, line: string) => { let s = await a.post('/api/switch-user', { user_id: who.id }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: who.id }); }
    try { const tk = ((await linesRaw(wo)).find((l: any) => l.line_id === line)?.tasks ?? []).find((x: any) => x.tech_assigned_id === who.staff_id)?.id;
      await a.post('/api/iam/change-location', { workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', workplace_timezone: 'America/Edmonton' });
      return say(await a.post('/api/technician-tasks/check-in', { task_id: tk, line_id: line, work_order_id: wo, refresh_lines: true })); } finally { await RUN.toRunner(); } };
  R.C96978.clock = [await clockIn(ES, ls[0]), await clockIn(RE, ls[1])];
  const lines = await linesRaw(wo); R.C96978.lineEstimates = lines.map((l: any) => l.time_estimate); R.C96978.sumEstimateMinutes = lines.reduce((s: number, l: any) => s + (+l.time_estimate || 0), 0);
  const num = (await workOrders(a, n))[0]?.number; R.C96978.wo = num;
  await go('List', n); R.C96978.list = await listRow(num); await shot(p, 'C96978-list');
  const ci = p.locator('tbody tr').filter({ hasText: num }).locator('td').nth(Object.keys(R.C96978.list ?? {}).indexOf('Clocked In'));
  await ci.hover().catch(() => {}); await p.waitForTimeout(1200); R.C96978.listClockHover = await tooltip();
  await display(p, 'Board View'); await p.waitForTimeout(1500);
  const m = await menu('Board View'); R.C96978.offered = (m.items ?? []).map((x: any) => x[1]); R.C96978.offeredCount = (m.items ?? []).length; await close();
  await allOn(); R.C96978.menuAfterAllOn = onKeys(await menu('Board View')); await close(); R.C96978.card = await card(p, wo); await shot(p, 'C96978-card');
  const fld = p.locator(`[data-test-id="board_card_${wo}"] [data-test-id="board_card_field_clocked_in_technicians"]`);
  R.C96978.cardClockHover = [];
  for (const target of [fld.getByText(/\+\d+/).first(), fld.getByText(/Ralph|Esther/).first(), fld]) {
    if (!(await target.count())) continue; await target.hover().catch(() => {}); await p.waitForTimeout(1300);
    const tt = await tooltip(); R.C96978.cardClockHover.push(tt); if (tt.length) { await shot(p, 'C96978-card-clock-hover'); break; } }
  R.C96978.estimate = { wo: (await a.get(`/api/work-orders/view/${wo}`)).body?.data?.work_order?.time_estimate ?? null, cardHasField: await p.locator(`[data-test-id="board_card_${wo}"] [data-test-id="board_card_field_time_estimate"]`).count() };
  // stop both clocks
  for (const who of [ES, RE]) { await a.post('/api/switch-user', { user_id: who.id }); try { const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data; if (cur?.technician_task?.id) await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id }); } finally { await RUN.toRunner(); } }
});

await run('C96982', async () => {
  const n = `ZZAUTOTEST F2 Required Only ${Date.now() % 100000}`; const c = await customer(a, n, 'TRK-118');
  const v2 = await vehicle(a, c, 'ZZNOUNIT');
  R.C96982 = { shape1: await shape(c, c.vehicle_id, { unit: 'TRK-118', year: 2022, mm: MM.m2, vin: '1FVACWDT0NHZZ0118' }), shape2: await shape(c, v2, { unit: '', year: 1999, mm: MM.explorer, vin: '1FMZU34E9XZZ00999' }) };
  const w1 = await workOrder(a, c, 'approved', ES.staff_id), w2 = await workOrder(a, { ...c, vehicle_id: v2 }, 'approved', ES.staff_id);
  const all = await workOrders(a, n); R.C96982.wos = all.map((w: any) => `${w.number} unit=${w.unit ?? w.vehicleUnit ?? '-'}`);
  await go('Board View', n); await allOff(); R.C96982.menuAfter = onKeys(await menu('Board View')); await close();
  R.C96982.card1 = await card(p, w1); R.C96982.card2 = await card(p, w2);
  R.C96982.text = await p.evaluate(`[${JSON.stringify(w1)}, ${JSON.stringify(w2)}].map(id => document.querySelector('[data-test-id="board_card_' + id + '"]')?.innerText.replace(/\\s+/g, ' '))`);
  await shot(p, 'C96982-cards');
});

await run('C96984', async () => {
  const n = `ZZAUTOTEST F2 Unit Fallback ${Date.now() % 100000}`; const c = await customer(a, n, 'TRK-118');
  const vb = await vehicle(a, c, 'ZZNOUNIT');
  R.C96984 = { shapeA: await shape(c, c.vehicle_id, { unit: 'TRK-118', year: 2022, mm: MM.m2, vin: '1FVACWDT0NHZZ0218' }), shapeB: await shape(c, vb, { unit: '', year: 1999, mm: MM.explorer, vin: '1FMZU34E9XZZ01999' }) };
  const wa = await workOrder(a, c, 'estimate', null); await mkLine(wa, 1); await a.post('/api/work-orders/change-status', { id: wa, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wa, tech_assigned_id: ES.staff_id });
  const wb = await workOrder(a, { ...c, vehicle_id: vb }, 'estimate', null); await mkLine(wb, 1); await a.post('/api/work-orders/change-status', { id: wb, status: 'approved' }); await a.post('/api/work-orders/change-lead-technician', { work_order_id: wb, tech_assigned_id: ES.staff_id });
  const wd = await workOrder(a, c, 'approved', ES.staff_id);   // no lines: 0 lines, $0.00, 0%
  await go('Board View', n); await allOff(); for (const k of ['vehicle', 'lines_count', 'total_price', 'progress']) await setSwitch('Board View', k, true);
  R.C96984.on = onKeys(await menu('Board View')); await close();
  R.C96984.a = await card(p, wa); R.C96984.b = await card(p, wb); R.C96984.d = await card(p, wd); await shot(p, 'C96984-cards');
  R.C96984.c = '(c) not built - an asset needs a Make';
});

await run('C96985', async () => {
  const n = `ZZAUTOTEST F2 Empty Fields Hidden ${Date.now() % 100000}`; const c = await customer(a, n, 'ZZF2EH');
  const nv = await a.post('/api/vehicles/create', { company_id: c.company_id, customer_id: c.contact_id, year: 2022, unit: 'ZZF2EH' });
  const vid = nv.body?.data?.vehicle_id ?? nv.body?.data?.id ?? nv.body?.vehicle_id;
  R.C96985 = { createNoVin: say(nv), shape: vid ? await shape(c, vid, { unit: 'ZZF2EH', year: 2022, mm: MM.m2 }) : 'no vehicle' };
  const wo = await workOrder(a, { ...c, vehicle_id: vid ?? c.vehicle_id }, 'approved', ES.staff_id);
  R.C96985.noAdvisor = say(await a.post('/api/work-orders/change-service-advisor', { work_order_id: wo, service_advisor_id: null }));
  const w = (await workOrders(a, n))[0]; R.C96985.wo = { number: w?.number, advisor: w?.serviceAdvisorFirstName ?? null, vin: w?.vin ?? w?.vehicleVin ?? null };
  await go('Board View', n); await allOff(); for (const k of ['service_advisor', 'vin', 'clocked_in_technicians', 'technician', 'company_name', 'progress']) await setSwitch('Board View', k, true);
  R.C96985.on = onKeys(await menu('Board View')); await close();
  R.C96985.card = await card(p, wo); R.C96985.text = await p.locator(`[data-test-id="board_card_${wo}"]`).innerText().catch(() => null); await shot(p, 'C96985-card');
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's5-batchC.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
