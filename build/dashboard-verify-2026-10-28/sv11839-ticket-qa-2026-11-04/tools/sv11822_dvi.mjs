// sv11822_dvi.mjs — SV-11822 exact steps on sv11839's "DVI Test" (copied from staging, Pacific/Fiji) and the Lethbridge control.
// Usage: TZ=<target zone> node sv11822_dvi.mjs <DVI|LB> <width> <height>
//  Start: signed in at Staging Heavy Duty - 9919 (session + localStorage at Heavy Duty's own zone). Browser timezoneId + process TZ = the
//  TARGET location's zone, because every check happens after switching to it; the app's own switch then sets session + localStorage.
//  Steps: Profile → Change Location → target → reload (Dashboard, Reports > Sales, Work Orders) → Profile → click the target chip →
//  record the list (on screen? items?) → switch to Heavy Duty and back. SECRET-FREE (cookies from /tmp/cln/qa11839/cookies.json).
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { shot, sleep, LOC, APP, API, OUT, headerCheck } from './common.mjs';
const [which, W, H] = [process.argv[2], +process.argv[3], +process.argv[4]];
const TGT = which === 'DVI' ? { id: '93404b24-8d43-4459-b152-513e64e2ad81', name: 'DVI Test', tz: 'Pacific/Fiji' } : LOC.LB;
if (process.env.TZ !== TGT.tz) throw new Error('RULE99: TZ must be ' + TGT.tz);
const T = 'SV-11822'; const tag = `${which}-${W}x${H}`;
const c = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/cookies.json', 'utf8'));
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TGT.tz });
await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: '.qa.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance', sameSite: 'Lax' })));
const page = await ctx.newPage();
const mw = []; page.on('response', async r => { if (r.url().includes('/api/staff/my-workplaces')) { let body = null; try { body = await r.json(); } catch {} mw.push({ at_utc: new Date().toISOString(), status: r.status(), x_cache: r.headers()['x-cache'] ?? null, names: (body?.data?.collection || []).map(w => w.name), body }); } });
const cl = []; page.on('request', r => { if (r.url().includes('/api/iam/change-location')) cl.push({ at_utc: new Date().toISOString(), sent: r.postData() }); });
// sign in at Heavy Duty (no quick-login), exactly as qa-branch-boot.mjs does
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.evaluate(async ([api, w, z]) => {
  const g = async p => (await (await fetch(api + p, { credentials: 'include', headers: { Accept: 'application/json' } })).json());
  const prof = await g('/iam/view-profile/'); const fe = await g('/auth/me/fe-permissions'); const u = prof.data?.user || {};
  localStorage.setItem('user', JSON.stringify({ data: { details: { user_id: u.id || null, name: `${u.first_name || ''} ${u.last_name || ''}`.trim(), email: u.email, default_workplace: w, workplace_timezone: z, staff_id: u.staff_id || null, roles: [], clockable: false }, role: { id: u.role_id, system_role: fe.data?.system_role, view_mode: fe.data?.view_mode } } }));
  localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fe.data)); localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z));
  await fetch(api + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) });
}, [API, LOC.HD.id, LOC.HD.tz]);
for (let i = 0; i < 2; i++) { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000); await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [LOC.HD.id, LOC.HD.tz]); }
await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(8000);
const E = { ticket: T, tag, viewport: [W, H], target: TGT, app_version: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), start: { header: await headerCheck(page, LOC.HD) }, checks: [] };
const zone = async () => ({ browser_timezoneId: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), process_TZ: process.env.TZ, localStorage_timezone: await page.evaluate(() => localStorage.getItem('timezone')), localStorage_location: await page.evaluate(() => localStorage.getItem('location')), last_change_location_sent: cl.at(-1)?.sent ?? null });
const menuState = () => page.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms.find(x => x.querySelector('[data-test-id^="option_item_"]')) || ms[ms.length - 1];
  if (!m) return { menu_found: false }; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m);
  return { menu_found: true, teleported_to_body_end: m.parentElement === document.body || m.closest('body > *') === m || document.body.lastElementChild?.contains(m), inline_top: m.style.top, inline_left: m.style.left, rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
    computed_visibility: cs.visibility, on_screen: r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1 && cs.visibility === 'visible', viewport: [innerWidth, innerHeight],
    option_items: [...m.querySelectorAll('[data-test-id^="option_item_"]')].map(o => o.innerText.replace(/check\s*/, '').trim()) }; });
const openChip = async () => { await page.locator('[data-test-id="profile_menu_button"]').click(); await sleep(1200); await page.locator('[data-test-id="select_location"]').click(); await sleep(1500); return menuState(); };
const closeAll = async () => { for (let i = 0; i < 2; i++) { await page.keyboard.press('Escape'); await sleep(400); } };
const pickOpt = async name => { await page.locator('.q-menu [data-test-id^="option_item_"]').filter({ hasText: name }).first().click(); await sleep(7000); };
// step 2: Profile → Change Location → target
E.switch_from_heavy_duty = await openChip(); E.switch_from_heavy_duty.picture = await shot(page, T, `${tag}-0-list-before-switch`); await pickOpt(TGT.name);
E.after_switch = { header: await headerCheck(page, TGT), zone: await zone() };
// steps 3-4, three pages
for (const [i, [pname, path]] of [['dashboard', '/dashboard'], ['reports', '/reports/sales'], ['work-orders', '/workorders']].entries()) {
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(3000); await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000);
  const st = await openChip(); st.chip_text = await page.locator('[data-test-id="select_location"]').innerText().catch(() => null);
  st.picture = await shot(page, T, `${tag}-${i + 1}-after-reload-${pname}`); st.page = pname; st.header = await headerCheck(page, TGT); st.zone = await zone(); st.my_workplaces_last = mw.at(-1) ? { status: mw.at(-1).status, x_cache: mw.at(-1).x_cache, names: mw.at(-1).names } : null;
  E.checks.push(st); console.log(tag, pname, JSON.stringify({ on: st.on_screen, top: st.inline_top, left: st.inline_left, vis: st.computed_visibility, items: st.option_items, chip: st.chip_text, tz: st.zone.localStorage_timezone }));
  if (i < 2) await closeAll();
}
// switch to Heavy Duty and back (list is open from the last check)
if (E.checks.at(-1).on_screen) {
  await pickOpt('Staging Heavy Duty - 9919'); E.switched_away = await headerCheck(page, LOC.HD);
  await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(8000);
  const back = await openChip(); E.back_list = back; await pickOpt(TGT.name); E.switched_back = { header: await headerCheck(page, TGT), zone: await zone() };
} else { E.not_visible_capture = { my_workplaces: mw.at(-1) }; E.fail_picture = await shot(page, T, `${tag}-FAIL-raw`, { fullPage: true }); }
// leave the session at Heavy Duty (where every other run starts)
await page.evaluate(async ([api, w, z]) => fetch(api + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) }), [API, LOC.HD.id, LOC.HD.tz]);
E.my_workplaces_responses = mw.map(x => ({ at_utc: x.at_utc, status: x.status, x_cache: x.x_cache, names: x.names })); E.my_workplaces_body_last = mw.at(-1)?.body ?? null; E.change_location_requests = cl;
E.rule99_at_checks_all_match = E.checks.every(s => s.zone.browser_timezoneId === TGT.tz && s.zone.process_TZ === TGT.tz && JSON.parse(s.zone.localStorage_timezone || 'null') === TGT.tz && JSON.parse(s.zone.localStorage_location || 'null') === TGT.id && s.header.shows_location && (s.zone.last_change_location_sent || '').includes(TGT.tz));
fs.writeFileSync(`${OUT}/${T}/evidence-${tag}.json`, JSON.stringify(E, null, 1));
console.log(tag, 'switch away/back', JSON.stringify({ away: E.switched_away?.shows_location, back: E.switched_back?.header?.shows_location, back_items: E.back_list?.option_items, back_on: E.back_list?.on_screen }), 'RULE99@checks', E.rule99_at_checks_all_match, 'x-cache', JSON.stringify(E.my_workplaces_responses.map(x => x.x_cache)));
await browser.close();
