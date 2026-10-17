/** prod-c96975.mts — 17 Oct 2026, LIVE Rule 121 comparison for C96975 on PRODUCTION (a dummy environment, authorised; the SECOND
 *  production account's password sign-in, prod-login-boot.mjs, its own browser — staging is not touched). Question: does production keep
 *  List's "Progress" column OFF across a real log-out and log-in? (Staging brought Progress back.) Steps: Work Orders > List; Column
 *  Selection read (every toggle and the headings); Progress turned OFF through the menu; headings read; REAL log-out (initials > Logout);
 *  log-in through the app's own Email / Password form; Work Orders > List; headings and the menu read again; then Progress turned back ON
 *  (restore) and read. The saved list preference is read from the server at each point. Credentials stay in /tmp; nothing printed.
 *  Captured at 2x when QA_DPR=2 (Rule 116); the saved preference (server, with its updatedAt) and the browser's stored column keys are read at each point.
 *  Output EV/prod-c96975.json, pictures EV/C96975-prod-*.png. */
import fs from 'node:fs'; import path from 'node:path';
const EV = process.env.WOB_EV || path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence');
const t = () => new Date().toISOString().slice(11, 19);
const { bootProdLogin } = await import('../../testing-tools/prod-login-boot.mjs') as any;
const o: any = {}; let P: any = null;
const shot = (pg: any, n: string) => pg.screenshot({ path: path.join(EV, `C96975-prod-${n}.png`) }).catch(() => {});
try {
  P = await bootProdLogin('/workorders', { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: Number(process.env.QA_DPR || 1) }); const pg = P.page; pg.setDefaultTimeout(20_000); const APP = P.APP;
  o.version = P.version ?? null; o.permissions = P.nFePerms;
  const W = (ms: number) => pg.waitForTimeout(ms);
  const apiGet = (u: string) => pg.evaluate(async (u0: string) => { const r = await fetch(`https://api.shopview.com${u0}`, { credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }); let b: any = null; try { b = await r.json(); } catch { /* */ } return { status: r.status, body: b }; }, u);
  const savedPref = async () => { const r = await apiGet('/api/users/me/preferences/work-orders-list'); const v = r.body?.data?.value ?? null; return { status: r.status, updatedAt: r.body?.data?.updatedAt ?? null, local: await pg.evaluate(() => Object.keys(localStorage).filter((k) => /column|work.?order|prefer/i.test(k)).map((k) => k + '=' + String(localStorage.getItem(k)).slice(0, 160))).catch(() => null), keys: v ? Object.keys(v) : null, listColumns: v ? (v.listColumns ?? v.columns ?? v.visibleColumns ?? Object.fromEntries(Object.entries(v).filter(([k]) => /column/i.test(k)))) : null }; };
  const toList = async () => { await pg.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(8000);
    const allTab = pg.locator('.q-tab, [role=tab]').filter({ hasText: /^\s*All\s*$/ }).first(); if (await allTab.count()) { await allTab.click().catch(() => {}); await W(3000); }
    const lst = pg.locator('[aria-label="List"]').first(); if (await lst.count()) { await lst.click().catch(() => {}); await W(3000); }
    return { url: pg.url().replace(APP, ''), switcher: await pg.locator('[aria-label="Tech View"]').count() }; };
  const heads = () => pg.evaluate(`[...document.querySelectorAll('thead th')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.innerText.replace(/arrow_drop_(up|down)|arrow_(up|down)ward/g, '').replace(/\\s+/g, ' ').trim()).filter(Boolean)`).catch(() => []) as Promise<string[]>;
  const menuBtn = async () => { for (const s of ['[data-test-id="button_column_selection"]', 'button[aria-label*="olumn" i]', 'button:has(i:text-is("view_column"))']) { const l = pg.locator(s).first(); if (await l.count()) return { l, s }; } return null; };
  const menu = async () => { const b = await menuBtn(); if (!b) return { button: 'not found' }; await b.l.click().catch(() => {}); await W(1200);
    const items = await pg.evaluate(`[...document.querySelectorAll('.q-menu [data-test-id^="toggle_column_"], .q-menu .q-item, .q-menu .q-toggle')].filter(e => e.getBoundingClientRect().width > 0).map(e => ({ tid: e.getAttribute('data-test-id'), text: e.innerText.replace(/\\s+/g, ' ').trim().slice(0, 30), on: (e.querySelector('[role=switch]') || e.querySelector('[aria-checked]') || e).getAttribute('aria-checked') }))`).catch(() => []);
    return { button: b.s, items }; };
  const progressToggle = () => pg.locator('.q-menu [data-test-id="toggle_column_progress"], .q-menu .q-item:has-text("Progress"), .q-menu .q-toggle:has-text("Progress")').first();
  const setProgress = async (on: boolean, tag: string) => { const m = await menu(); const r: any = { menuBefore: m }; const tg = progressToggle(); r.found = await tg.count();
    if (r.found) { const st = await tg.evaluate((e: any) => (e.querySelector('[role=switch]') || e.querySelector('[aria-checked]') || e).getAttribute('aria-checked')).catch(() => null); r.stateBefore = st;
      if ((st === 'true') !== on) { const sw = tg.locator('[role=switch], .q-toggle__inner').first(); if (await sw.count()) await sw.click().catch(() => {}); else await tg.click().catch(() => {}); await W(1500); }
      r.stateAfter = await tg.evaluate((e: any) => (e.querySelector('[role=switch]') || e.querySelector('[aria-checked]') || e).getAttribute('aria-checked')).catch(() => null); }
    await shot(pg, `${tag}-menu`); await pg.keyboard.press('Escape').catch(() => {}); await W(1500); r.headings = await heads(); return r; };
  // 1) List, the columns as they are
  o.start = { list: await toList(), headings: await heads(), menu: await menu(), saved: await savedPref() }; await pg.keyboard.press('Escape').catch(() => {}); await W(800); await shot(pg, 'start');
  console.log(t(), 'START STATE found C96975 production', JSON.stringify({ version: o.version, list: o.start.list, headings: o.start.headings, progressItem: (o.start.menu.items ?? []).filter((x: any) => /progress/i.test(x.tid + ' ' + x.text)) }));
  // 2) Progress OFF through Column Selection
  o.off = await setProgress(false, 'progress-off'); o.off.saved = await savedPref(); await shot(pg, 'progress-off');
  console.log(t(), 'START STATE set C96975 production (Progress off)', JSON.stringify({ stateAfter: o.off.stateAfter, headings: o.off.headings }));
  // 3) REAL log-out: initials > Logout
  await pg.locator('[data-test-id="profile_menu_button"]').first().click().catch(() => {}); await W(1000);
  const lo = pg.locator('.q-menu').getByText(/^\s*(Logout|Log out|Sign out)\s*$/).last(); o.logoutItem = await lo.count();
  if (o.logoutItem) { await lo.click().catch(() => {}); await W(7000); } o.afterLogout = { url: pg.url().replace(APP, ''), onLogin: /\/login/.test(pg.url()) }; await shot(pg, 'after-logout');
  console.log(t(), o.logoutItem ? 'SIGN-OUT done (production)' : 'SIGN-OUT NOT DONE (production)', JSON.stringify(o.afterLogout));
  // 4) log in through the app's own form (the second production account; password from /tmp, never printed)
  const env = Object.fromEntries(fs.readFileSync(process.env.PROD_ENVF || '/tmp/shopview/prod-login.env', 'utf8').split('\n').map((l) => /^([A-Z_]+)=(.*)$/.exec(l.trim())).filter(Boolean).map((m: any) => [m[1], m[2]]));
  if (!/\/login/.test(pg.url())) { await pg.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(6000); }
  await pg.locator('input[type=email], input[autocomplete=username]').first().fill(env.SV_USER ?? '').catch(() => {}); await pg.locator('input[type=password]').first().fill(env.SV_PASS ?? '').catch(() => {});
  await pg.locator('button:has-text("Login"), button:has-text("Sign in"), button[type=submit]').first().click().catch(() => {});
  for (let i = 0; i < 20 && /\/login/.test(pg.url()); i++) await W(1500);
  o.afterLogin = { url: pg.url().replace(APP, ''), signedIn: !/\/login/.test(pg.url()) }; console.log(t(), o.afterLogin.signedIn ? 'SIGN-IN done (production)' : 'SIGN-IN NOT DONE (production)', JSON.stringify(o.afterLogin));
  // 5) List again
  o.afterRelogin = { list: await toList(), headings: await heads(), menu: await menu(), saved: await savedPref() }; await pg.keyboard.press('Escape').catch(() => {}); await W(800); await shot(pg, 'after-relogin');
  o.progressKeptOff = !(o.afterRelogin.headings as string[]).some((h) => /^Progress$/i.test(h)) && (o.off.headings as string[]).every((h) => !/^Progress$/i.test(h));
  o.progressMenuAfterRelogin = (o.afterRelogin.menu.items ?? []).filter((x: any) => /progress/i.test(x.tid + ' ' + x.text));
  console.log(t(), 'C96975 production after log-out / log-in', JSON.stringify({ progressKeptOff: o.progressKeptOff, headingsBefore: o.start.headings, headingsOff: o.off.headings, headingsAfterRelogin: o.afterRelogin.headings, menuProgress: o.progressMenuAfterRelogin }));
  // 6) restore: Progress back ON
  o.restore = await setProgress(true, 'progress-restored'); console.log(t(), 'C96975 production restore', JSON.stringify({ stateAfter: o.restore.stateAfter, headings: o.restore.headings }));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'prod-c96975.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C96975 production', JSON.stringify(o).slice(0, 2500));
if (P) await Promise.race([P.browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
