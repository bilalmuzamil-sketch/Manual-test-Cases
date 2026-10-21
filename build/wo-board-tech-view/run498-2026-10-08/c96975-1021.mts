/** c96975-1021.mts — 21 Oct 2026: C96975 retest after SV-11499 (List column choice lost after log-out) was fixed. ALL 23 steps, as written,
 *  as the signed-in Admin ("you"), on GS_APP (sv11499 QA branch first; staging if that branch is not reachable).
 *  Steps 1-15 through the screen (Column Selection switches, read by label) · 16 real log-out (initials > Logout) · 17 real sign-in on
 *  the sign-in page (Admin quick-login) · 18 read · 19 a NEW browser signs in as the same user · 20 read · 21 Change Location to
 *  Location-B (WOB_LOC_B, or the first other location the picker lists) · 22-23 read. The saved Work Orders preference is read from the
 *  server alongside each reading, so another session changing it shows up. Start state per the case: List has Service Advisor + Progress
 *  on; Tech View has Service Advisor, Progress and Assigned Techs on (set through the screen and logged as START STATE set).
 *  Helpers copied from signout-1017.mts (that file runs on import). Output EV/c96975-1021.json, pictures EV/C96975-1021-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page, Browser } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { api, type Api } from './data.mts';
import { EV, t, display, tab, switchLocUI } from './wob.mts';

const OUT = path.join(EV, 'c96975-1021.json');
const o: any = { app: APP, started: new Date().toISOString() };
const save = () => fs.writeFileSync(OUT, JSON.stringify(o, null, 1));
let { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000);
let a: Api = api(p);
o.exitSwitch = (await a.post('/api/exit-switch-user', {})).status;
o.build = await p.evaluate(`document.querySelector('meta[name="app-version"]')?.content || null`).catch(() => null);
const W = (ms: number, pg: Page = p) => pg.waitForTimeout(ms);
const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `C96975-1021-${n}.png`) }).catch(() => {});
const PREF = '/api/users/me/preferences/work-orders-list';
const perm = (pg: Page) => pg.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.status).catch(() => 0)`) as Promise<number>;
const who = (pg: Page) => pg.evaluate(`(() => { try { const u = JSON.parse(localStorage.getItem('user') || 'null'); const d = u && (u.data || u); const x = d && (d.user || d); return x ? ((x.first_name || '') + ' ' + (x.last_name || '')).trim() || x.email || null : null; } catch (e) { return null; } })()`).catch(() => null);
const topBar = (pg: Page) => pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
const goWO = async (pg: Page) => { await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, pg); await tab(pg, 'All').catch(() => {}); };
const prefNow = async (pg: Page) => { const r = await api(pg).get(PREF); const d = r.body?.data ?? {}; const v = d.value ?? {};
  return { status: r.status, updated: d.updated_at ?? d.updatedAt ?? null, keys: Object.fromEntries(Object.entries(v).filter(([k]) => /column/i.test(k))) }; };

const menuBtn: Record<string, string> = { List: 'button_column_selection', 'Tech View': 'button_tech_view_column_selection' };
/** open the display's Column Selection, optionally set switches by label, close it; returns the labels that are ON */
async function columns(pg: Page, d: 'List' | 'Tech View', set?: Record<string, boolean>, pic?: string) {
  await pg.locator(`[data-test-id="${menuBtn[d]}"]`).first().click().catch(() => {}); await W(1200, pg);
  const read = () => pg.evaluate(`(() => { const m = [...document.querySelectorAll('.q-menu')].filter(e => e.getBoundingClientRect().width > 0).pop(); if (!m) return null;
    return [...m.querySelectorAll('[data-test-id^="toggle_"], .q-toggle')].map(e => { const sw = e.matches('[role=switch]') ? e : e.querySelector('[role=switch],[aria-checked]'); return { label: ((e.closest('.q-item') || e).innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30), on: sw ? sw.getAttribute('aria-checked') === 'true' : !!e.querySelector('.q-toggle__inner--truthy'), tid: e.getAttribute('data-test-id') }; }); })()`) as Promise<{ label: string; on: boolean; tid: string | null }[] | null>;
  let r = await read();
  if (set) for (const [lab, on] of Object.entries(set)) { const it = (r ?? []).find((x) => x.label.toLowerCase() === lab.toLowerCase());
    if (it && it.on !== on) { const loc = it.tid ? pg.locator(`.q-menu [data-test-id="${it.tid}"]`).first() : pg.locator('.q-menu .q-toggle').filter({ hasText: lab }).first(); await loc.click().catch(() => {}); await W(1000, pg); r = await read(); } }
  if (pic) await shot(pg, pic);
  await pg.keyboard.press('Escape').catch(() => {}); await W(900, pg);
  if (r === null) console.log(t(), 'COLUMN MENU NOT READ', d);
  return (r ?? []).filter((x) => x.on).map((x) => x.label);
}
const heads = (pg: Page) => pg.evaluate(`[...new Set([...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/arrow_drop_(up|down)|arrow_(up|down)ward/g, '').replace(/\\s+/g, ' ').trim()).filter(Boolean))]`).catch(() => []) as Promise<string[]>;
const has = (l: string[], x: string) => l.some((y) => y.toLowerCase() === x.toLowerCase());
/** Tech View then List, both read (switches + visible headings), with pictures */
async function readBoth(pg: Page, tag: string) {
  await display(pg, 'Tech View'); await W(2500, pg); const tv = { on: await columns(pg, 'Tech View', undefined, `${tag}-tech-menu`), heads: await heads(pg) }; await shot(pg, `${tag}-tech`);
  await display(pg, 'List'); await W(2500, pg); const li = { on: await columns(pg, 'List', undefined, `${tag}-list-menu`), heads: await heads(pg) }; await shot(pg, `${tag}-list`);
  const r = { techView: tv, list: li, pref: await prefNow(pg), topBar: await topBar(pg), user: await who(pg),
    verdict: { techNoServiceAdvisor: !has(tv.on, 'Service Advisor'), techNoAssignedTechs: !has(tv.on, 'Assigned Techs'), techProgress: has(tv.on, 'Progress'),
      listServiceAdvisor: has(li.on, 'Service Advisor'), listNoProgress: !has(li.on, 'Progress') } };
  console.log(t(), 'READ', tag, JSON.stringify(r)); return r;
}
async function signIn(pg: Page, tag: string) {
  const r: any = {};
  if (!/\/login/.test(pg.url())) { await pg.goto(APP + '/login', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000, pg); }
  const btn = pg.locator('button:has-text("Admin")').first();
  for (let i = 0; i < 20 && !(await btn.count()); i++) await W(1500, pg);
  r.button = await btn.count(); if (r.button) { await btn.click().catch(() => {}); await W(9000, pg); }
  r.url = pg.url().replace(APP, '').slice(0, 100); r.permissions = await perm(pg); r.user = await who(pg); r.ok = r.permissions === 200 && !/\/login|accounts\.google/.test(pg.url());
  await shot(pg, `${tag}-signed-in`); console.log(t(), r.ok ? 'SIGN-IN done' : 'SIGN-IN FAILED', tag, JSON.stringify(r)); return r;
}

try {
  // START STATE (preconditions): List = Service Advisor + Progress on; Tech View = Service Advisor, Progress, Assigned Techs on
  await goWO(p); o.location = await topBar(p);
  await display(p, 'List'); o.startListFound = await columns(p, 'List'); o.startListSet = await columns(p, 'List', { 'Service Advisor': true, Progress: true });
  await display(p, 'Tech View'); o.startTechFound = await columns(p, 'Tech View'); o.startTechSet = await columns(p, 'Tech View', { 'Service Advisor': true, Progress: true, 'Assigned Techs': true });
  console.log(t(), 'START STATE set C96975', JSON.stringify({ list: [o.startListFound, o.startListSet], tech: [o.startTechFound, o.startTechSet], location: o.location, build: o.build }));
  // Steps 1-4
  await goWO(p); await display(p, 'List'); await W(2000); o.s3 = { on: await columns(p, 'List', undefined, 's3-list-menu'), heads: await heads(p) };
  // Steps 5-9
  await display(p, 'Tech View'); await W(2000); o.s7_8 = await columns(p, 'Tech View', { 'Service Advisor': false, 'Assigned Techs': false }, 's8-tech-menu'); await shot(p, 's9-tech');
  // Steps 10-11
  await display(p, 'List'); await W(2500); o.s11 = { on: await columns(p, 'List', undefined, 's11-list-menu'), heads: await heads(p) }; await shot(p, 's11-list');
  o.s11.ok = has(o.s11.heads, 'Service Advisor') && !has(o.s11.heads, 'Assigned Techs');
  // Steps 12-13
  o.s13 = await columns(p, 'List', { Progress: false }, 's13-list-menu'); o.s13heads = await heads(p); await shot(p, 's13-list');
  // Steps 14-15
  await display(p, 'Tech View'); await W(2500); o.s15 = { on: await columns(p, 'Tech View', undefined, 's15-tech-menu'), heads: await heads(p) }; await shot(p, 's15-tech');
  o.s15.ok = has(o.s15.heads, 'Progress');
  o.prefBeforeLogout = await prefNow(p);
  console.log(t(), 'STEPS 1-15', JSON.stringify({ s3: o.s3, s7_8: o.s7_8, s11: o.s11, s13: o.s13, s15: o.s15, pref: o.prefBeforeLogout }));
  save();
  // Step 16: REAL log-out
  await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await W(900);
  const lo = p.locator('.q-menu').getByText('Logout', { exact: true }).last(); o.s16 = { logoutItem: await lo.count() };
  if (o.s16.logoutItem) { await lo.click(); await W(6000); }
  o.s16.url = p.url().replace(APP, '').slice(0, 100); o.s16.permissions = await perm(p); await shot(p, 's16-signed-out');
  console.log(t(), o.s16.logoutItem ? 'SIGN-OUT done' : 'SIGN-OUT NOT DONE', JSON.stringify(o.s16));
  // Step 17: sign in again as the same user; open Work Orders
  o.s17 = await signIn(p, 's17');
  if (!o.s17.ok) { o.stopped = 'signing back in failed'; save(); await done(browser, 9); }
  a = api(p); await goWO(p);
  // Step 18
  o.s18 = await readBoth(p, 's18'); save();
  // Step 19: a second browser signs in as the same user (a NEW browser, its own sign-in)
  const b2 = await open('/workorders?tab=all'); const p2 = b2.page; p2.setDefaultTimeout(30_000);
  o.s19 = { user: await who(p2), permissions: await perm(p2), topBar: await topBar(p2) }; console.log(t(), 'SIGN-IN done second browser', JSON.stringify(o.s19));
  await goWO(p2);
  // Step 20
  o.s20 = await readBoth(p2, 's20'); save();
  // Step 21: Change Location to Location-B, in the second browser (the session now live). 21 Oct fix: the location choices sit INSIDE the
  // profile menu as "check <name>" rows (first run picked "Edit Profile"); read them there, then switch with switchLocUI and read the top bar back.
  await p2.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await W(1200, p2);
  await p2.locator('[data-test-id="select_location"]').click().catch(() => {}); await W(1500, p2);
  const here = (await topBar(p2)) || '';
  const offered = (await p2.locator('.q-menu .q-item').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
  const locs = offered.filter((x) => /^check\s+/.test(x)).map((x) => x.replace(/^check\s+/, ''));
  await p2.keyboard.press('Escape').catch(() => {}); await W(600, p2); await p2.keyboard.press('Escape').catch(() => {}); await W(600, p2);
  const want = process.env.WOB_LOC_B || locs.find((x) => !here.includes(x) && !/^ZZAUTOTEST/i.test(x)) || locs.find((x) => !here.includes(x));
  o.s21 = { from: here, locations: locs, chose: want ?? null };
  if (want) o.s21.to = await switchLocUI(p2, want);
  o.s21.ok = !!want && !!o.s21.to && o.s21.to.includes(want.slice(0, 20)); await shot(p2, 's21-location-b');
  console.log(t(), 'STEP 21', JSON.stringify(o.s21));
  // Steps 22-23
  await goWO(p2); o.s23 = await readBoth(p2, 's23');
  // put the first location back for later runs
  o.restore = { from: await topBar(p2), to: await switchLocUI(p2, here.replace(/\s+[A-Z]{2}$/, '')) };
  const V = (r: any) => r && Object.values(r.verdict).every(Boolean);
  o.summary = { s11: o.s11.ok, s15: o.s15.ok, s18: V(o.s18), s20: V(o.s20), s21: o.s21.ok, s23: V(o.s23) };
  console.log(t(), 'SUMMARY C96975', JSON.stringify(o.summary));
  await b2.browser.close().catch(() => {});
} catch (e: any) { o.error = String(e?.message || e).slice(0, 400); console.log(t(), 'ERROR', o.error); await shot(p, 'error'); }
o.ended = new Date().toISOString(); save();
await done(browser, o.error ? 1 : 0);
