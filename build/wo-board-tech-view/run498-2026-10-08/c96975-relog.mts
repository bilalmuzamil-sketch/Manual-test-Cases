/** c96975-relog.mts — 17 Oct 2026, LIVE re-measure of C96975's List half before the held ticket D-C96975 is asked about.
 *  Route: a dedicated user cannot sign in for real (no password until the invitation e-mail is accepted, L0441), so this uses the
 *  shared "Admin ShopView" with a REAL log-out (initials > Logout) and the sign-in page's Admin button — and rules other sessions in or
 *  out by reading the saved Work Orders preference from the SERVER (the whole answer, including any updated time) right after Progress is
 *  turned off, immediately before the log-out, and immediately after the sign-in; any difference between "before log-out" and "after
 *  sign-in" that is not ours is logged as possible interference. Steps: Work Orders > All > List; Column Selection > Progress OFF (screen);
 *  headings read; log out; sign in; Work Orders > All > List; headings and the menu read; Progress put back ON (screen). Pictures at 2x
 *  (run with QA_DPR=2). Output EV/c96975-relog.json, pictures EV/C96975-relog-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import type { Page } from 'playwright';
import { open, done, APP, API } from './session.mts';
import { api, type Api } from './data.mts';
import { EV, t, tab, display } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(30_000); let a: Api = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status, route: 'shared Admin ShopView, real log-out + sign-in page Admin button; server preference read before log-out and after sign-in' };
const W = (ms: number) => p.waitForTimeout(ms);
const shot = (n: string) => p.screenshot({ path: path.join(EV, `C96975-relog-${n}.png`) }).catch(() => {});
const PREF = '/api/users/me/preferences/work-orders-list';
const perm = () => p.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.status).catch(() => 0)`) as Promise<number>;
/** the whole saved preference answer: value + every timestamp-looking field */
const prefFull = async () => { const r = await a.get(PREF); const d = r.body?.data ?? {}; const v = d.value ?? {};
  return { status: r.status, at: new Date().toISOString(), meta: Object.fromEntries(Object.entries(d).filter(([k]) => k !== 'value')), listKeys: Object.keys(v).filter((k) => /column|list|visible/i.test(k)), listValue: Object.fromEntries(Object.entries(v).filter(([k]) => /column|list|visible/i.test(k) && !/tech/i.test(k))), valueJson: JSON.stringify(v) }; };
const heads = () => p.evaluate(`[...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/arrow_drop_(up|down)|arrow_(up|down)ward/g, '').replace(/\\s+/g, ' ').trim()).filter(Boolean)`).catch(() => []) as Promise<string[]>;
const toList = async () => { await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000); await tab(p, 'All').catch(() => {}); await display(p, 'List'); await W(2500); };
const progressState = () => p.locator('.q-menu [data-test-id="toggle_column_progress"]').first().evaluate((e: any) => (e.matches('[role=switch]') ? e : e.querySelector('[role=switch],[aria-checked]') || e).getAttribute('aria-checked')).catch(() => null);
async function setProgress(on: boolean, tag: string) { const r: any = {};
  await p.locator('[data-test-id="button_column_selection"]').first().click().catch(() => {}); await W(1200); r.before = await progressState();
  if (r.before !== null && (r.before === 'true') !== on) { const tg = p.locator('.q-menu [data-test-id="toggle_column_progress"]').first(); const sw = tg.locator('[role=switch], .q-toggle__inner').first(); if (await sw.count()) await sw.click().catch(() => {}); else await tg.click().catch(() => {}); await W(1800); }
  r.after = await progressState(); await shot(`${tag}-menu`); await p.keyboard.press('Escape').catch(() => {}); await W(2000); r.headings = await heads(); return r; }
const hasProgress = (h: string[]) => h.some((x) => /^Progress$/i.test(x));
try {
  await toList(); o.start = { headings: await heads(), pref: await prefFull() }; await shot('start');
  console.log(t(), 'START STATE found C96975 relog', JSON.stringify({ progressShown: hasProgress(o.start.headings), meta: o.start.pref.meta, listKeys: o.start.pref.listKeys }));
  o.off = await setProgress(false, 'progress-off'); o.off.pref = await prefFull(); await shot('progress-off');
  console.log(t(), 'START STATE set C96975 relog (Progress off)', JSON.stringify({ menu: [o.off.before, o.off.after], progressShown: hasProgress(o.off.headings), listValue: o.off.pref.listValue, meta: o.off.pref.meta }));
  await W(3000); o.prefBeforeLogout = await prefFull(); await shot('before-logout');
  // REAL log-out
  await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await W(900);
  const lo = p.locator('.q-menu').getByText('Logout', { exact: true }).last(); o.logoutItem = await lo.count(); if (o.logoutItem) { await lo.click(); await W(6000); }
  o.afterLogout = { url: p.url().replace(APP, ''), permissions: await perm() }; await shot('signed-out');
  console.log(t(), o.logoutItem ? 'SIGN-OUT done' : 'SIGN-OUT NOT DONE', 'C96975 relog', JSON.stringify(o.afterLogout));
  // sign in again: the sign-in page's Admin button (the app's own route on staging)
  if (!/\/login/.test(p.url())) { await p.goto(APP + '/login', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(4000); }
  const btn = p.locator('button:has-text("Admin")').first(); for (let i = 0; i < 20 && !(await btn.count()); i++) await W(1500);
  if (await btn.count()) { await btn.click().catch(() => {}); await W(9000); }
  a = api(p); o.signIn = { url: p.url().replace(APP, '').slice(0, 80), permissions: await perm() }; o.signInOk = o.signIn.permissions === 200 && !/\/login|accounts\.google/.test(p.url());
  console.log(t(), o.signInOk ? 'SIGN-IN done' : 'SIGN-IN FAILED', 'C96975 relog', JSON.stringify(o.signIn));
  if (!o.signInOk) throw new Error('signing back in failed: sso_required? ' + JSON.stringify(o.signIn));
  o.prefAfterLogin = await prefFull();
  o.interference = { valueChangedBetween: o.prefBeforeLogout.valueJson !== o.prefAfterLogin.valueJson, metaBefore: o.prefBeforeLogout.meta, metaAfter: o.prefAfterLogin.meta, listBefore: o.prefBeforeLogout.listValue, listAfter: o.prefAfterLogin.listValue };
  console.log(t(), 'C96975 relog server preference across log-out/log-in', JSON.stringify(o.interference));
  await toList(); o.afterRelogin = { headings: await heads() }; await shot('after-relogin');
  await p.locator('[data-test-id="button_column_selection"]').first().click().catch(() => {}); await W(1200); o.afterRelogin.menuProgress = await progressState(); await shot('after-relogin-menu'); await p.keyboard.press('Escape').catch(() => {}); await W(1000);
  o.afterRelogin.pref = await prefFull();
  o.reproduced = hasProgress(o.afterRelogin.headings) && !hasProgress(o.off.headings);
  console.log(t(), 'C96975 relog result', JSON.stringify({ reproduced: o.reproduced, progressOffBeforeLogout: !hasProgress(o.off.headings), progressShownAfterLogin: hasProgress(o.afterRelogin.headings), menuProgressAfterLogin: o.afterRelogin.menuProgress, serverChangedBetween: o.interference.valueChangedBetween }));
  // restore Progress ON
  o.restore = await setProgress(true, 'progress-restored'); o.restore.pref = (await prefFull()).listValue;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); await shot('error'); }
fs.writeFileSync(path.join(EV, 'c96975-relog.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C96975 relog', JSON.stringify(o).slice(0, 2500)); await done(browser);
