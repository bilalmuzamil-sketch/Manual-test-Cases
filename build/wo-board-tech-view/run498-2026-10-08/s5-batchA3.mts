/**
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
  fs.writeFileSync(path.join(EV, 's5-batchA3.json'), JSON.stringify(R, null, 1));
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

await run('C96975', async () => {
  const n = 'ZZAUTOTEST F2 Tech Own Columns'; await seed(n, 'ZZF2TC', [ES.staff_id]);
  await go('Tech View', n); R.C96975 = { set: [await setSwitch('Tech View', 'service_advisor', false), await setSwitch('Tech View', 'assigned_techs', true)] };
  await display(p, 'List'); await p.waitForTimeout(1500); R.C96975.setList = await setSwitch('List', 'progress', false);
  const s = await second(); R.C96975.secondKept = s.kept; try { await go('Tech View', n, s.pg); R.C96975.secondBrowser = { at: await where(s.pg), tech: onKeys(await menu('Tech View', s.pg)), techHeads: await heads(s.pg) }; await close(s.pg);
    await display(s.pg, 'List'); await s.pg.waitForTimeout(1500); R.C96975.secondBrowser.list = onKeys(await menu('List', s.pg)); await close(s.pg); await shot(s.pg, 'C96975-second-browser'); } finally { await s.ctx.close(); }
});

await run('C96976', async () => {
  const n = 'ZZAUTOTEST F2 Board Fields Saved'; const w = await seed(n, 'ZZF2BF', [ES.staff_id]); const wo = w[0].id;
  await go('Board View', n); R.C96976 = { set: [await setSwitch('Board View', 'company_name', false), await setSwitch('Board View', 'vin', true)], card: await card(p, wo) };
  const s = await second(); try { await go('Board View', n, s.pg); R.C96976.secondBrowser = { at: await where(s.pg), on: onKeys(await menu('Board View', s.pg)), card: await card(s.pg, wo) }; await close(s.pg); await shot(s.pg, 'C96976-second-browser'); } finally { await s.ctx.close(); }
});

await run('C96983', async () => {
  const n = 'ZZAUTOTEST F2 Saved Choice Failure'; await seed(n, 'ZZF2SF', [null]);
  const saves: string[] = [];
  p.on('request', (r) => { if (/preferences\/work-orders-list/.test(r.url()) && r.method() !== 'GET') saves.push(`${r.method()} ${String(r.postData() ?? '').slice(0, 200)}`); });
  // positive control: a normal change IS seen being saved by this recorder
  await go('Board View', n); await setSwitch('Board View', 'line_technicians', true); await p.waitForTimeout(2500);
  R.C96983 = { controlSaves: saves.splice(0).map((x) => x.slice(0, 120)) };
  await setSwitch('Board View', 'line_technicians', false); await p.waitForTimeout(2500); saves.splice(0);
  R.C96983.before = onKeys(await menu('Board View')); await close();
  const fail = (u: URL) => /preferences\/work-orders-list/.test(u.toString());
  const handler = async (r: any) => { if (r.request().method() === 'GET') await r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"ZZ forced failure"}]}' }); else await r.continue(); };
  await p.route(fail, handler);
  await go('Board View', n); R.C96983.failBoard = onKeys(await menu('Board View')); await close();
  R.C96983.change = await setSwitch('Board View', 'vehicle_here', true); await p.waitForTimeout(4000);
  R.C96983.failBoardAfterChange = onKeys(await menu('Board View')); await close(); await shot(p, 'C96983-fail-after-change');
  R.C96983.savesDuringFailure = saves.splice(0);
  await p.unroute(fail, handler);
  await go('Board View', n); R.C96983.afterReload = onKeys(await menu('Board View')); await close(); await shot(p, 'C96983-after-reload');
});

await run('loc2', async () => {
  const meRow = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL);
  const ay = (await staffRows(a, 'ayesha')).find((x) => /ayesha/i.test(`${x.first_name}`));
  R.loc2 = { runnerDeps: meRow?.departments, ayeshaDeps: ay?.departments, ayeshaWorkplace: ay?.defaultWorkplaceName };
  const lethDeps = (ay?.departments ?? []).filter((d: any) => /lethbridge/i.test(JSON.stringify(d)));
  const ids = [...new Set([...(meRow?.departments ?? []), ...lethDeps].map((d: any) => d?.id ?? d?.department_id ?? d).filter((x: any) => typeof x === 'string' && /^[0-9a-f-]{36}$/.test(x)))];
  R.loc2.ids = ids.length;
  if (lethDeps.length && meRow) R.loc2.enrol = say(await a.post(`/api/staff/${meRow.staff_id}/change`, { first_name: meRow.first_name, last_name: meRow.last_name, email: meRow.email, role_id: meRow.role_id, workplace_id: meRow.workplace_id ?? HEAVY, job_title: meRow.job_title, salary_type: meRow.salary_type, salary: meRow.salary, billable: !!meRow.billable, clockable: false, departments: ids }));
  R.loc2.runnerDepsAfter = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL)?.departments;
  // switch through the screen: initials > Change Location > Lethbridge
  await go('List'); await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500);
  const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); R.loc2.menuButton = await cur.count();
  if (await cur.count()) { await cur.click(); await p.waitForTimeout(1500); R.loc2.options = await p.locator('.q-menu .q-item').allInnerTexts();
    await p.locator('.q-menu .q-item').filter({ hasText: 'Lethbridge' }).first().click().catch((e) => { R.loc2.pickError = String(e).slice(0, 120); }); await p.waitForTimeout(6000); }
  await p.keyboard.press('Escape').catch(() => {});
  R.loc2.at = await where(p); await shot(p, 'S5-loc2-switch');
  if (/lethbridge/i.test(String(R.loc2.at))) {
    await go('Tech View'); R.loc2.tech = onKeys(await menu('Tech View')); await close();
    await display(p, 'Board View'); await p.waitForTimeout(1500); R.loc2.board = onKeys(await menu('Board View')); await close();
    await display(p, 'List'); await p.waitForTimeout(1500); R.loc2.list = onKeys(await menu('List')); await close(); await shot(p, 'S5-loc2');
    R.loc2.density = (await prefGet()).density;
  }
  R.loc2.back = say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' }));
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's5-batchA3.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
