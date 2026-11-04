// sv11828.mjs — SV-11828: Dashboard just under 1024 px. Staging Heavy Duty - 9919, TZ=America/Edmonton. SECRET-FREE.
// Runs: viewport 1023 (as instructed), 1022 and 1024 (controls), and a FRACTIONAL width ~1023.33 CSS px
// (window 1535 px with Chrome's own page zoom at 150 % via the profile preference partition.default_zoom_level = log(1.5)/log(1.2),
// i.e. exactly what Ctrl + does — the ticket's "actual width is fractional 1023.x" condition).
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { boot, finish, shot, save, sleep, LOC, APP, API, OUT, headerCheck } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11828';
const measure = async page => page.evaluate(() => {
  const tiles = [...document.querySelectorAll('[data-test-id^="hero_tile_"]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-test-id'), left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width) }; });
  const vis = sel => [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null).map(e => e.getAttribute('data-test-id'));
  return { innerWidth: window.innerWidth, docWidthFractional: document.documentElement.getBoundingClientRect().width, visualViewport: window.visualViewport?.width, dpr: window.devicePixelRatio,
    mq_max_1023: matchMedia('(max-width:1023px)').matches, mq_max_1023_98: matchMedia('(max-width:1023.98px)').matches,
    tiles, distinctTileColumns: [...new Set(tiles.map(t => t.left))].length, kpiRowTops: [...new Set(tiles.slice(0, 4).map(t => t.top))].length,
    footers_view_report: vis('[data-test-id^="link_view_report_"]'), footers_view_details: vis('[data-test-id^="btn_toggle_details_"]'),
    footerTexts: [...document.querySelectorAll('[data-test-id^="link_view_report_"], [data-test-id^="btn_toggle_details_"]')].filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).slice(0, 12) };
});
const out = { runs: [] }; let r99;
const prevEv = (() => { try { return JSON.parse(fs.readFileSync(OUT + '/' + T + '/evidence.json', 'utf8')); } catch { return null; } })();
if (process.env.ONLY_FRACTIONAL && prevEv) { for (const k of Object.keys(prevEv)) if (k.startsWith('rule99_10') || k === 'app_version') out[k] = prevEv[k]; out.runs = prevEv.runs.filter(r => !r.run.startsWith('fractional')); }
for (const w of (process.env.ONLY_FRACTIONAL ? [] : [1023, 1022, 1024])) {
  const { browser, page, rule99, app_version } = await boot(loc, { viewport: { width: w, height: 1200 } });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(5000);
  const m = await measure(page); const pic = await shot(page, T, `viewport-${w}`, { fullPage: true });
  out.runs.push({ run: `viewport ${w}px (integer)`, measure: m, picture: pic }); out.app_version = app_version;
  r99 = await finish(page, loc, rule99); out[`rule99_${w}`] = r99;
  console.log(w, JSON.stringify({ iw: m.innerWidth, doc: m.docWidthFractional, mq: [m.mq_max_1023, m.mq_max_1023_98], cols: m.distinctTileColumns, kpiRows: m.kpiRowTops, vr: m.footers_view_report.length, vd: m.footers_view_details.length, txt: m.footerTexts.slice(0, 4) }));
  await browser.close();
}
// fractional width: own launch (qaBoot fixes the viewport); same SSO sign-in steps as qa-branch-boot.mjs, no quick-login
{
  const c = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/cookies.json', 'utf8'));
  const cookies = Object.entries(c).map(([name, value]) => ({ name, value, domain: '.qa.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance', sameSite: 'Lax' }));
  const prof = '/tmp/cln/qa11839/zprof-run'; fs.rmSync(prof, { recursive: true, force: true }); fs.mkdirSync(prof + '/Default', { recursive: true });
  fs.writeFileSync(prof + '/Default/Preferences', JSON.stringify({ partition: { default_zoom_level: { x: Math.log(1.5) / Math.log(1.2) } } }));
  const ctx = await pw.chromium.launchPersistentContext(prof, { executablePath: '/opt/pw-browsers/chromium', headless: true, viewport: null, ignoreHTTPSErrors: true, timezoneId: loc.tz,
    proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--window-size=1535,1500'] });
  const browser = { close: () => ctx.close() }; await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  const cl = await page.evaluate(async ([API, w, z]) => {
    const get = async p => { const r = await fetch(API + p, { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: r.status, j: await r.json().catch(() => null) }; };
    const prof = await get('/iam/view-profile/'); const fe = await get('/auth/me/fe-permissions'); const u = prof.j?.data?.user || {};
    localStorage.setItem('user', JSON.stringify({ data: { details: { user_id: u.id || u.user_id || null, name: `${u.first_name || ''} ${u.last_name || ''}`.trim(), email: u.email, default_workplace: w, workplace_timezone: z, staff_id: u.staff_id || null, roles: [], clockable: false }, role: { id: u.role_id, system_role: fe.j?.data?.system_role, view_mode: fe.j?.data?.view_mode } } }));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fe.j?.data)); localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z));
    const r = await fetch(API + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) }); return r.status;
  }, [API, loc.id, loc.tz]);
  for (let i = 0; i < 2; i++) { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000); await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [loc.id, loc.tz]); }
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(6000);
  const m = await measure(page); const pic = await shot(page, T, 'fractional-1023_33', { fullPage: true });
  const hdr = await headerCheck(page, loc);
  const z = await page.evaluate(() => ({ browser_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, ls_timezone: localStorage.getItem('timezone'), ls_location: localStorage.getItem('location') }));
  out.runs.push({ run: 'fractional width 1023.33 CSS px (window 1535 px, Chrome page zoom 150 %)', measure: m, picture: pic });
  out.rule99_fractional = { location: loc.name, location_tz: loc.tz, change_location_http: cl, browser_timezoneId: z.browser_tz, process_TZ: process.env.TZ, localStorage_timezone: z.ls_timezone, localStorage_location: z.ls_location, header: hdr,
    all_match: z.browser_tz === loc.tz && process.env.TZ === loc.tz && JSON.parse(z.ls_timezone) === loc.tz && cl === 200 && hdr.shows_location };
  console.log('fractional', JSON.stringify({ iw: m.innerWidth, doc: m.docWidthFractional, dpr: m.dpr, mq: [m.mq_max_1023, m.mq_max_1023_98], cols: m.distinctTileColumns, kpiRows: m.kpiRowTops, vr: m.footers_view_report.length, vd: m.footers_view_details.length, txt: m.footerTexts.slice(0, 4) }), 'r99', out.rule99_fractional.all_match);
  await browser.close();
}
save(T, { ticket: T, location: loc.name, observed_at_utc: new Date().toISOString(), ...out });
