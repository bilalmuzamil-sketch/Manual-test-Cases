/**
 * S5 batch A (2026-10-09) — fields and columns, as Admin ShopView: C96975 (Tech View columns separate from List),
 * C96976 (Board View Fields to display saved per user), C96977 (number/unit/status always on), C96981 (changes apply
 * without a reload), C96983 (saved choices cannot load), and the menu readings for C368160 / C368164.
 * Menus measured by probe-fields.mts: List `button_column_selection` (switches `toggle_column_<camel>`), Tech View
 * `button_tech_view_column_selection` (`toggle_tech_view_column_<snake>`), Board View `button_board_fields_selection`
 * (`toggle_board_field_<snake>`); each is a list of switches, nothing else. Choices are saved in the user's
 * work-orders-list preference (columns / techViewColumns / boardFields). The admin's preference is saved at the start
 * and put back at the end. "A second browser" = a new browser with the sign-in cookies only (no page storage).
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
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
  fs.writeFileSync(path.join(EV, 's5-batchA.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };

// the menus as they stand (C368160 / C368164 — "what you should see today")
await run('menus', async () => {
  await go('Tech View'); const tv = await menu('Tech View');
  R.menus = { techView: { box: tv.box, items: tv.items.map((x: any) => `${x[1]}=${x[2]}`) } };
  R.menus.techViewWords = await p.evaluate(`[...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop()?.innerText.replace(/\\s+/g, ' ')`);
  R.menus.techViewHasSearch = await p.locator('.q-menu input:visible').count(); R.menus.techViewButtons = await p.locator('.q-menu button:visible').allInnerTexts();
  R.menus.tooltip = await p.evaluate(`[...document.querySelectorAll('.q-tooltip')].map(e => e.innerText.trim())`);
  await shot(p, 'S5-techview-columns-menu'); await close();
  await go('Board View'); const bvm = await menu('Board View');
  R.menus.board = { box: bvm.box, items: bvm.items.map((x: any) => `${x[1]}=${x[2]}`) };
  R.menus.boardHasSearch = await p.locator('.q-menu input:visible').count(); R.menus.boardButtons = await p.locator('.q-menu button:visible').allInnerTexts();
  await shot(p, 'S5-board-fields-menu'); await close();
});

await run('C96975', async () => {
  const n = 'ZZAUTOTEST F2 Tech Own Columns'; await seed(n, 'ZZF2TC', [ES.staff_id]);
  await go('List', n); const list0 = onKeys(await menu('List')); await close();
  R.C96975 = { listStart: list0, listHeadsStart: await heads() };
  await go('Tech View', n); R.C96975.techStart = onKeys(await menu('Tech View')); await close();
  R.C96975.setTech = [await setSwitch('Tech View', 'service_advisor', false), await setSwitch('Tech View', 'assigned_techs', true)];
  R.C96975.techHeadsAfterSet = await heads();
  await display(p, 'List'); await p.waitForTimeout(1500);
  R.C96975.listAfterTechChange = { on: onKeys(await menu('List')), heads: await heads() }; await close();
  R.C96975.setList = await setSwitch('List', 'progress', false); R.C96975.listHeadsAfterProgressOff = await heads();
  await display(p, 'Tech View'); await p.waitForTimeout(1500); R.C96975.techAfterListChange = { on: onKeys(await menu('Tech View')), heads: await heads() }; await close();
  const s = await second(); try { await go('Tech View', n, s.pg); R.C96975.secondBrowserTech = { on: onKeys(await menu('Tech View', s.pg)), heads: await heads(s.pg) }; await close(s.pg);
    await display(s.pg, 'List'); R.C96975.secondBrowserList = { on: onKeys(await menu('List', s.pg)) }; await close(s.pg); await shot(s.pg, 'C96975-second-browser'); } finally { await s.ctx.close(); }
  const pr = await prefGet(); R.C96975.saved = { columns: pr.columns, techViewColumns: pr.techViewColumns };
});

await run('C96976', async () => {
  const n = 'ZZAUTOTEST F2 Board Fields Saved'; const w = await seed(n, 'ZZF2BF', [ES.staff_id]); const wo = w[0].id;
  await go('Tech View'); const tvBox = (await menu('Tech View')).box; await close();
  await go('Board View', n); const m0 = await menu('Board View'); await close();
  R.C96976 = { techViewButtonAt: tvBox, boardButtonAt: m0.box, start: onKeys(m0), cardStart: await card(p, wo), vin: w[0].vin ?? w[0].vehicleVin ?? null };
  R.C96976.set = [await setSwitch('Board View', 'company_name', false), await setSwitch('Board View', 'vin', true)];
  R.C96976.cardAfter = await card(p, wo); await shot(p, 'C96976-card-after');
  const s = await second(); try { await go('Board View', n, s.pg); R.C96976.secondBrowser = { on: onKeys(await menu('Board View', s.pg)), card: await card(s.pg, wo) }; await close(s.pg); } finally { await s.ctx.close(); }
  R.C96976.saved = (await prefGet()).boardFields;
});

await run('C96977', async () => {
  const n = 'ZZAUTOTEST F2 Card Always On'; const w = await seed(n, 'TRK-118', [ES.staff_id]); const wo = w[0].id;
  await go('Board View', n); const m = await menu('Board View');
  R.C96977 = { menuItems: m.items.map((x: any) => x[1]), offersNumberUnitStatus: m.items.filter((x: any) => /number|unit|status/i.test(x[0] + x[1])).map((x: any) => x[1]) };
  await shot(p, 'C96977-menu'); await close();
  for (const k of m.items.filter((x: any) => x[2] === 'true').map((x: any) => x[0])) await setSwitch('Board View', k, false);
  R.C96977.cardAllOff = await card(p, wo); R.C96977.unitOnAsset = w[0].unit ?? w[0].vehicleUnit ?? null; await shot(p, 'C96977-card');
});

await run('C96981', async () => {
  const n = 'ZZAUTOTEST F2 Fields No Reload'; const w = await seed(n, 'ZZF2NR', [ES.staff_id, ES.staff_id, RE.staff_id]);
  await go('Board View', n); await setSwitch('Board View', 'start_date', false); await setSwitch('Board View', 'company_name', true);
  const before = Object.fromEntries(await Promise.all(w.map(async (x: any) => [x.number, await card(p, x.id)])));
  await p.evaluate(`window.__zzNoReload = 1`);
  const mm = await menu('Board View'); await p.locator('[data-test-id="toggle_board_field_start_date"]').click(); await p.waitForTimeout(400); await p.locator('[data-test-id="toggle_board_field_company_name"]').click(); await p.waitForTimeout(400);
  const during = Object.fromEntries(await Promise.all(w.map(async (x: any) => [x.number, await card(p, x.id)]))); await close();
  R.C96981 = { menuWas: onKeys(mm), before, after: during, stillSamePage: await p.evaluate(`window.__zzNoReload === 1`), search: await searchValue(p) };
  await shot(p, 'C96981-after');
});

await run('C96983', async () => {
  const n = 'ZZAUTOTEST F2 Saved Choice Failure'; await seed(n, 'ZZF2SF', [null]);
  await go('Board View'); R.C96983 = { normalBoard: onKeys(await menu('Board View')) }; await close();
  await display(p, 'Tech View'); R.C96983.normalTech = await heads();
  await display(p, 'Board View'); R.C96983.normalSave = await setSwitch('Board View', 'start_date', true); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  R.C96983.afterReload = onKeys(await menu('Board View')); await close();
  // forced failure: the saved choices cannot be read (the preference read answers 500)
  let reads = 0; await p.route((u) => /preferences\/work-orders-list/.test(u.toString()), async (r) => { if (r.request().method() === 'GET') { reads++; await r.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"error":"ZZ forced failure"}]}' }); } else await r.continue(); });
  await go('Board View', n); R.C96983.failBoard = { on: onKeys(await menu('Board View')), reads }; await shot(p, 'C96983-fail-board'); await close();
  await display(p, 'Tech View'); await p.waitForTimeout(1500); R.C96983.failTech = { heads: await heads(), on: onKeys(await menu('Tech View')) }; await close();
  await display(p, 'Board View'); await p.waitForTimeout(1000);
  R.C96983.changeDuringFailure = await setSwitch('Board View', 'vehicle_here', true); await p.waitForTimeout(1500);
  await p.unroute((u) => /preferences\/work-orders-list/.test(u.toString())).catch(() => {}); await p.unrouteAll({ behavior: 'ignoreErrors' }).catch(() => {});
  await go('Board View', n); R.C96983.afterFailureRemoved = onKeys(await menu('Board View')); await close();
  R.C96983.savedNow = (await prefGet()).boardFields;
});

// [Loc-2] for C96975 / C96976 — last, because the location menu cannot reliably switch back in one sign-in
await run('loc2', async () => {
  const where = () => p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`) as Promise<string | null>;
  await go('List'); await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').getByText(/ - \d{3,5}$/).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').filter({ hasText: 'ZZAUTOTEST Empty Shop' }).locator('.q-item').filter({ hasText: 'Lethbridge' }).first().click(); await p.waitForTimeout(6000);
  R.loc2 = { at: await where() };
  await go('Tech View'); R.loc2.tech = onKeys(await menu('Tech View')); await close();
  await display(p, 'Board View'); R.loc2.board = onKeys(await menu('Board View')); await close();
  await display(p, 'List'); R.loc2.list = onKeys(await menu('List')); await close(); await shot(p, 'S5-loc2');
  await a.post('/api/iam/change-location', { workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', workplace_timezone: 'America/Edmonton' });
});

const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's5-batchA.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
