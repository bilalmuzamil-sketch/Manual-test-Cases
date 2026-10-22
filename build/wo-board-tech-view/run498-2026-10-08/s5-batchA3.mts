/**
 * S5 batch A3 (2026-10-09) — A2 again with a proper second browser (sign-in storage only) and Lethbridge enrolment.
 * S5 batch A2 (2026-10-09): the parts of C96975 / C96976 that batch A could not reach (a second browser — that
 * browser lacked the certificate setting — and a second location — the test admin was enrolled at one location
 * only), and C96983 again with every save the page sends recorded while the saved choices cannot load.
 * Runs as our own test admin (runner.mts). Location: the runner is enrolled at Lethbridge too (departments), then
 * moved there with iam/change-location and a fresh browser is opened, whose top bar is read to prove where it is.
 */
import { LOC1_NAME, LOC2_NAME } from './profile.mts';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP } from './session.mts';
import { asRunner } from './runner.mts';
import { api, customer, workOrder, workOrders } from './data.mts';
import { EV, t, shot, display, tab, search, searchValue, expandSmallGroups, switchLocUI } from './wob.mts';
import { startState } from './fixup-1017.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';
import { RUNNER_EMAIL } from './runner.mts';

const only = (process.env.ONLY || '').split(',').filter(Boolean);
const want = (id: string) => !only.length || only.includes(id);
const { browser, page: p0 } = await open('/workorders?tab=all');
const RUN = await asRunner(browser, p0, api(p0)); const p = RUN.p;  // our own test admin (runner.mts)
p.setDefaultTimeout(30_000);
const a = api(p);
await startState(p, a, 's5-batchA3');   // L0415, fix-up 2
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
// 15 Oct 2026 (staging second pass): with ONLY=C96975,C96976,… the second-location part ('loc2') never ran, so "at the second
// location" was never checked. It now runs whenever C96975 or C96976 runs, and those two print their ONE log line after it,
// with the second-location reading inside (secondLocation).
const DEFER = new Set(['C96975', 'C96976']);
async function run(id: string, f: () => Promise<void>) {
  if (!want(id) && !(id === 'loc2' && (want('C96975') || want('C96976')))) return;
  try { await f(); await (globalThis as any).__shotEach?.(id); } catch (e: any) { R[id] = { ...(R[id] || {}), error: String(e?.message || e).slice(0, 400) }; await shot(p, `${id}-error`); }
  if (!DEFER.has(id)) console.log(t(), id, JSON.stringify(R[id]).slice(0, 8000));
  fs.writeFileSync(path.join(EV, 's5-batchA3.json'), JSON.stringify(R, null, 1));
}
const seed = async (name: string, unit: string, leads: (string | null)[]) => { let w = await workOrders(a, name); if (!w.length) { const c = await customer(a, name, unit); for (const l of leads) await workOrder(a, c, 'approved', l); w = await workOrders(a, name); } return w; };


const say = (r: any) => `${r.status}${r.status >= 300 ? ' ' + JSON.stringify(r.body).slice(0, 200) : ''}`;
// 22 Oct 2026: the top bar's location line — staging names end in " - 9919"; production's ("Truck Hill 1") do not, so the profile's names are matched too
const where = (pg: Page) => pg.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l) || l.includes(${JSON.stringify(LOC1_NAME)}) || l.includes(${JSON.stringify(LOC2_NAME)})) || null`) as Promise<string | null>;


const LS = await p.evaluate(`Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))`) as Record<string, string>;
R.localStorageKeys = Object.keys(LS);
const second = async () => { const st = await p.context().storageState(); const ctx = await browser.newContext({ storageState: { cookies: st.cookies, origins: [] }, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|mercure\.qa|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
  const keep = Object.fromEntries(Object.entries(LS).filter(([k]) => /^(user|fe_permissions_wrapper|token)$/.test(k)));
  await ctx.addInitScript((kv: Record<string, string>) => { try { if (!sessionStorage.getItem('zz_seeded')) { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); sessionStorage.setItem('zz_seeded', '1'); } } catch { /* */ } }, keep);
  return { ctx, pg: await ctx.newPage(), kept: Object.keys(keep) }; };

// FIX-UP 2 (17 Oct 2026, C96975): the script turned Assigned Techs ON in Tech View, while the case (read live 17 Oct) turns it OFF at
// step 8; it also skipped the case's own readings. It now follows the case: the preconditions are SET and read back (List: Service
// Advisor and Progress on; Tech View: Service Advisor, Progress and Assigned Techs on), then steps 1-15 with a reading at 3, 11 and 15,
// steps 19-20 in a second browser, and steps 21-23 at Lethbridge in the 'loc2' block (which now ends back at Heavy Duty, read back).
// Steps 16-18 (log out, log back in) are NOT done: logging out ends the ONE shared staging sign-in that the whole queue runs on
// (L0394); a fresh page load of the same user is read in their place and labelled so.
const keyOf = async (d: string, rx: RegExp, pg: Page = p) => { const m = await menu(d, pg); await close(pg); return ((m.items ?? []).find((x: any) => rx.test(String(x[1]))) ?? [])[0] ?? null; };
const setBy = async (d: string, rx: RegExp, on: boolean, pg: Page = p) => { const k = await keyOf(d, rx, pg); return k ? `${k}=${on ? 'on' : 'off'} ${await setSwitch(d, k, on, pg)}` : `no ${rx.source} in the ${d} menu`; };
const readView = async (d: string, pg: Page = p) => { const m = await menu(d, pg); await close(pg); return { on: onKeys(m), labelsOn: (m.items ?? []).filter((x: any) => x[2] === 'true').map((x: any) => x[1]), heads: await heads(pg) }; };
await run('C96975', async () => {
  const n = 'ZZAUTOTEST F2 Tech Own Columns'; await seed(n, 'ZZF2TC', [ES.staff_id]); const o: any = (R.C96975 = {});
  // preconditions: found, then set, then read back
  await go('List'); o.locationFound = await where(p); if (!String(o.locationFound).includes(LOC1_NAME)) { o.locationSwitch = await switchLocUI(p, LOC1_NAME); await go('List'); o.locationNow = await where(p); if (!String(o.locationNow).includes(LOC1_NAME)) throw new Error(`the runner is not at Staging Heavy Duty - 9919 (top bar: ${o.locationNow})`); }   // fix-up 2: the runner's own location (not the Admin's) is checked first
  o.foundList = await readView('List'); await display(p, 'Tech View'); await p.waitForTimeout(1500); o.foundTech = await readView('Tech View');
  console.log(t(), 'START STATE found C96975', JSON.stringify({ list: o.foundList.labelsOn, tech: o.foundTech.labelsOn, location: await where(p) }));
  o.setup = [await setBy('Tech View', /Service Advisor/i, true), await setBy('Tech View', /Progress/i, true), await setBy('Tech View', /Assigned Techs/i, true)];
  await display(p, 'List'); await p.waitForTimeout(1500); o.setup.push(await setBy('List', /Service Advisor/i, true), await setBy('List', /Progress/i, true));
  // steps 1-4: All tab, List, Column Selection read
  await go('List', n); o.step3 = await readView('List');
  console.log(t(), 'START STATE set C96975', JSON.stringify({ setup: o.setup, list: o.step3.labelsOn }));
  // steps 5-9: Tech View, Service Advisor OFF, Assigned Techs OFF
  await display(p, 'Tech View'); await p.waitForTimeout(1500); o.step7 = await setBy('Tech View', /Service Advisor/i, false); o.step8 = await setBy('Tech View', /Assigned Techs/i, false); o.techAfter8 = await readView('Tech View'); await shot(p, 'C96975-s9-tech');
  // steps 10-11: List — Service Advisor still shown, no Assigned Techs column
  await display(p, 'List'); await p.waitForTimeout(1500); o.step11 = await readView('List'); o.step11.serviceAdvisorShown = o.step11.heads.some((h: string) => /Service Advisor/i.test(h)); o.step11.assignedTechsShown = o.step11.heads.some((h: string) => /Assigned Techs/i.test(h)); await shot(p, 'C96975-s11-list');
  // steps 12-13: List — Progress OFF
  o.step13 = await setBy('List', /Progress/i, false);
  // steps 14-15: Tech View — Progress still shown
  await display(p, 'Tech View'); await p.waitForTimeout(1500); o.step15 = await readView('Tech View'); o.step15.progressShown = o.step15.heads.some((h: string) => /Progress/i.test(h)); await shot(p, 'C96975-s15-tech');
  // steps 16-18: NOT done (see above); a fresh page load of the same user instead
  o.steps16to18 = 'not done: logging out ends the one shared staging sign-in (L0394); fresh page load read instead';
  await go('Tech View', n); o.step18reload = { tech: await readView('Tech View') }; await display(p, 'List'); await p.waitForTimeout(1500); o.step18reload.list = await readView('List'); await shot(p, 'C96975-s18-reload');
  // steps 19-20: a second browser, same user
  const s = await second(); o.secondKept = s.kept; try { await go('Tech View', n, s.pg); o.secondBrowser = { at: await where(s.pg), tech: await readView('Tech View', s.pg) }; await shot(s.pg, 'C96975-s20-second-tech');
    await display(s.pg, 'List'); await s.pg.waitForTimeout(1500); o.secondBrowser.list = await readView('List', s.pg); await shot(s.pg, 'C96975-second-browser'); } finally { await s.ctx.close(); }
});

await run('loc2', async () => {
  const meRow = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL);
  const ay = (await staffRows(a, 'ayesha')).find((x) => /ayesha/i.test(`${x.first_name}`));
  R.loc2 = { runnerDeps: meRow?.departments, ayeshaDeps: ay?.departments, ayeshaWorkplace: ay?.defaultWorkplaceName };
  const lethDeps = (ay?.departments ?? []).filter((d: any) => /lethbridge/i.test(JSON.stringify(d)));
  const ids = [...new Set([...(meRow?.departments ?? []), ...lethDeps].map((d: any) => d?.id ?? d?.department_id ?? d).filter((x: any) => typeof x === 'string' && /^[0-9a-f-]{36}$/.test(x)))];
  R.loc2.ids = ids.length;
  // 15 Oct 2026: staff/change with departments does NOT add a location (playbook) — enrol the runner at Lethbridge (Service) with
  // the app's own enrolment route first; the old call is kept after it.
  { const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const svc = (dd.find((d: any) => (d.name ?? d.label) === 'Service') ?? dd[0]);
    if (meRow) R.loc2.enrolLeth = say(await a.post('/api/staff/enrollment/create', { staffId: meRow.staff_id, workplaceId: LETH, departmentId: svc?.id })); }
  if (lethDeps.length && meRow) R.loc2.enrol = say(await a.post(`/api/staff/${meRow.staff_id}/change`, { first_name: meRow.first_name, last_name: meRow.last_name, email: meRow.email, role_id: meRow.role_id, workplace_id: meRow.workplace_id ?? HEAVY, job_title: meRow.job_title, salary_type: meRow.salary_type, salary: meRow.salary, billable: !!meRow.billable, clockable: false, departments: ids }));
  R.loc2.runnerDepsAfter = (await staffRows(a, RUNNER_EMAIL)).find((x) => x.email === RUNNER_EMAIL)?.departments;
  // switch through the screen: initials > Change Location > Lethbridge
  await go('List');
  if (process.env.WOB_LOC_SELECT) R.loc2.switched = await switchLocUI(p, LOC2_NAME);
  else await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500);
  const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); R.loc2.menuButton = await cur.count();
  if (!process.env.WOB_LOC_SELECT && await cur.count()) { await cur.click(); await p.waitForTimeout(1500); R.loc2.options = await p.locator('.q-menu .q-item').allInnerTexts();
    await p.locator('.q-menu .q-item').filter({ hasText: LOC2_NAME }).first().click().catch((e) => { R.loc2.pickError = String(e).slice(0, 120); }); await p.waitForTimeout(6000); }
  await p.keyboard.press('Escape').catch(() => {});
  R.loc2.at = await where(p); await shot(p, 'S5-loc2-switch');
  if (/lethbridge/i.test(String(R.loc2.at))) {
    await go('Tech View'); R.loc2.atAfterOpen = await where(p); R.loc2.tech = onKeys(await menu('Tech View')); await close(); R.loc2.techHeads = await heads(); await shot(p, 'S5-loc2-tech');
    await display(p, 'Board View'); await p.waitForTimeout(1500); R.loc2.board = onKeys(await menu('Board View')); await close(); await shot(p, 'S5-loc2-board');
    await display(p, 'List'); await p.waitForTimeout(1500); R.loc2.list = onKeys(await menu('List')); await close(); await shot(p, 'S5-loc2');
    R.loc2.density = (await prefGet()).density;
  }
  R.loc2.back = process.env.WOB_LOC_SELECT ? await switchLocUI(p, LOC1_NAME) : say(await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: (process.env.WOB_LOC_TZ || 'America/Edmonton') }));
  // fix-up 2 (17 Oct 2026): on 16 Oct the page was left at Lethbridge — read the top bar back on a fresh load and switch again through the menu if needed
  for (let k = 0; k < 2; k++) { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); R.loc2.backReadBack = await where(p); if (String(R.loc2.backReadBack).includes(LOC1_NAME)) break; R.loc2[`backRetry${k}`] = await switchLocUI(p, LOC1_NAME); }
  console.log(t(), 'LOCATION after the second-location part', JSON.stringify({ back: R.loc2.back, readBack: R.loc2.backReadBack }));
});

for (const id of DEFER) if (want(id)) console.log(t(), id, JSON.stringify({ ...(R[id] ?? {}), secondLocation: R.loc2 ?? 'not run' }).slice(0, 8000));
const BACK = ORIGINAL; await a.put(PREF, { value: BACK }); R.restored = JSON.stringify(await prefGet()) === JSON.stringify(BACK);
fs.writeFileSync(path.join(EV, 's5-batchA3.json'), JSON.stringify(R, null, 1)); console.log(t(), 'restored', R.restored);
await RUN.end();
await done(browser);
