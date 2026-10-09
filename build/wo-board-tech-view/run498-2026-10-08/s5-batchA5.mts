/**
 * S5 batch A5 (2026-10-09) — the second-location parts, read as Ayesha Khan (a test-site person already enrolled at Heavy Duty and Lethbridge; the runner could not be enrolled at a second location). Her choices are saved first and put back at the end.
 * S5 batch A4 (2026-10-09) — the second-location parts of C96975, C96976 and C96989: the runner is enrolled at Lethbridge with a Lethbridge department (read while located there), then switched there through the location menu.
 * S5 batch A3 (2026-10-09) — A2 again with a proper second browser (sign-in storage only) and Lethbridge enrolment.
 * S5 batch A2 (2026-10-09): the parts of C96975 / C96976 that batch A could not reach (a second browser — that
 * browser lacked the certificate setting — and a second location — the test admin was enrolled at one location
 * only), and C96983 again with every save the page sends recorded while the saved choices cannot load.
 * Runs as our own test admin (runner.mts). Location: the runner is enrolled at Lethbridge too (departments), then
 * moved there with iam/change-location and a fresh browser is opened, whose top bar is read to prove where it is.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups } from './wob.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';
import { RUNNER_EMAIL } from './runner.mts';
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
const second_old = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {}); return { ctx, pg: await ctx.newPage() }; };
async function run(id: string, f: () => Promise<void>) {
  if (!want(id)) return;
  try { await f(); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  console.log(t(), id, JSON.stringify(R[id]).slice(0, 2600));
  fs.writeFileSync(path.join(EV, 's5-batchA5.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };


const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
const where = (pg: Page) => pg.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) as Promise<string | null>;


const LS = await p.evaluate(`Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))`) as Record<string, string>;
R.localStorageKeys = Object.keys(LS);
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
  const keep = Object.fromEntries(Object.entries(LS).filter(([k]) => /^(user|fe_permissions_wrapper|token)$/.test(k)));
  await ctx.addInitScript((kv: Record<string, string>) => { try { if (!sessionStorage.getItem('zz_seeded')) { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); sessionStorage.setItem('zz_seeded', '1'); } } catch { /* */ } }, keep);
  return { ctx, pg: await ctx.newPage(), kept: Object.keys(keep) }; };



const density = async (pg: Page) => { await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(900);
  const sel = await pg.evaluate(`[...document.querySelectorAll('[data-test-id^="option_density_"]')].filter(e => e.getBoundingClientRect().width > 0 && /check/.test(e.innerText)).map(e => e.innerText.replace('check','').trim())`); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400); return sel; };
await run('loc2', async () => {
  const ay = (await staffRows(a, 'ayesha')).find((x) => /ayesha/i.test(`${x.first_name}`)); const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
  R.loc2 = { who: `${ay?.first_name} ${ay?.last_name}`, role: ay?.role_label, deps: ay?.departments };
  const v = await viewAs(browser, p, a, ay.id, me.id, RUN.toRunner); const pg = v.page; R.loc2.perms = v.perms;
  try {
    const before = (await a.get(PREF)).body?.data?.value ?? {}; fs.writeFileSync(path.join(EV, 'S5-ayesha-pref-before.json'), JSON.stringify(before, null, 1));
    await go('Tech View', '', pg); R.loc2.techSet = [await setSwitch('Tech View', 'service_advisor', false, pg), await setSwitch('Tech View', 'assigned_techs', true, pg)];
    await pg.locator('[data-test-id="button_density"]').click(); await pg.waitForTimeout(800); await pg.locator('[data-test-id="option_density_comfortable"]').click(); await pg.waitForTimeout(1500); await pg.keyboard.press('Escape');
    await display(pg, 'List'); await pg.waitForTimeout(1500); R.loc2.listSet = await setSwitch('List', 'progress', false, pg);
    await display(pg, 'Board View'); await pg.waitForTimeout(1500); R.loc2.boardSet = [await setSwitch('Board View', 'company_name', false, pg), await setSwitch('Board View', 'vin', true, pg)];
    R.loc2.heavy = { at: await where(pg) };
    await pg.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await pg.waitForTimeout(1500);
    const cur = pg.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); R.loc2.menuButton = await cur.count();
    if (await cur.count()) { await cur.click(); await pg.waitForTimeout(1500); R.loc2.options = await pg.locator('.q-menu .q-item').allInnerTexts();
      await pg.locator('.q-menu .q-item').filter({ hasText: 'Lethbridge' }).first().click().catch((e) => { R.loc2.pickError = String(e).slice(0, 120); }); await pg.waitForTimeout(6000); }
    await pg.keyboard.press('Escape').catch(() => {}); R.loc2.at = await where(pg); await shot(pg, 'S5-loc2-ayesha');
    if (/lethbridge/i.test(String(R.loc2.at))) {
      await go('Tech View', '', pg); R.loc2.tech = onKeys(await menu('Tech View', pg)); await close(pg); R.loc2.techDensity = await density(pg);
      await display(pg, 'Board View'); await pg.waitForTimeout(1500); R.loc2.board = onKeys(await menu('Board View', pg)); await close(pg); R.loc2.boardDensity = await density(pg);
      await display(pg, 'List'); await pg.waitForTimeout(1500); R.loc2.list = onKeys(await menu('List', pg)); await close(pg); await shot(pg, 'S5-loc2-lethbridge');
    }
    R.loc2.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
    await a.put(PREF, { value: before }); R.loc2.restored = JSON.stringify((await a.get(PREF)).body?.data?.value ?? {}) === JSON.stringify(before);
  } finally { await v.close(); }
});
fs.writeFileSync(path.join(EV, 's5-batchA5.json'), JSON.stringify(R, null, 1)); console.log(t(), 'done');
await RUN.end();
await done(browser);
