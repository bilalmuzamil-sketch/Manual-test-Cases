// sv11822_dpr.mjs — SV-11822 retest of Mudassir's comment 80176 (5 Nov 2026): Chrome, viewport 1536x936, devicePixelRatio 1.25,
// plain page load / reload with ANY active location → Profile → click the location chip.
// Usage: TZ=<browser zone> node sv11822_dpr.mjs <TL|DVI|LB> <dpr> [width] [height]
// Browser timezoneId = process TZ (Rule 99 match when TZ == the location's zone; a mismatch is recorded as a deliberate diagnostic).
// SECRET-FREE: cookies from /tmp/cln/qa11839/cookies.json, never printed. No quick-login / switch-user.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/SV-11822-retest';
const APP = 'https://sv11839.qa.shopview.com', API = 'https://sv11839api.qa.shopview.com/api';
const L = { TL: { id: 'f9da140e-f4eb-4e3b-adc8-028214ebaf4c', name: 'Test Location', tz: 'Asia/Karachi' },
  DVI: { id: '93404b24-8d43-4459-b152-513e64e2ad81', name: 'DVI Test', tz: 'Pacific/Fiji' },
  LB: { id: 'f8a8b802-7780-4b16-bf10-343caeb616b2', name: 'Staging Lethbridge - 4310', tz: 'America/Edmonton' } };
const [which, dpr, W = 1536, H = 936] = [process.argv[2], +process.argv[3], +(process.argv[4] || 1536), +(process.argv[5] || 936)];
const TGT = L[which]; const BTZ = process.env.TZ; const THR = +(process.env.THROTTLE || 1); const FORCE = process.env.FORCE_DSF === '1';
const tag = `${which}-dpr${dpr}-${BTZ.replace('/', '_')}${THR > 1 ? '-cpu' + THR + 'x' : ''}${FORCE ? '-forcedsf' : ''}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const c = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/cookies.json', 'utf8'));
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', ...(FORCE ? [`--force-device-scale-factor=${dpr}`, `--window-size=${W},${H}`] : [])] });
const ctx = await browser.newContext({ ...(FORCE ? { viewport: null } : { viewport: { width: W, height: H }, deviceScaleFactor: dpr }), ignoreHTTPSErrors: true, timezoneId: BTZ });
await ctx.addCookies(Object.entries(c).map(([name, value]) => ({ name, value, domain: '.qa.shopview.com', path: '/', secure: true, httpOnly: name !== 'cf_clearance', sameSite: 'Lax' })));
const page = await ctx.newPage();
if (THR > 1) { const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: THR }); }
const errs = []; page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ type: m.type(), text: m.text().slice(0, 300) }); }); page.on('pageerror', e => errs.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
const cl = await page.evaluate(async ([api, w, z]) => {
  const g = async p => (await (await fetch(api + p, { credentials: 'include', headers: { Accept: 'application/json' } })).json());
  const prof = await g('/iam/view-profile/'); const fe = await g('/auth/me/fe-permissions'); const u = prof.data?.user || {};
  localStorage.setItem('user', JSON.stringify({ data: { details: { user_id: u.id || null, name: `${u.first_name || ''} ${u.last_name || ''}`.trim(), email: u.email, default_workplace: w, workplace_timezone: z, staff_id: u.staff_id || null, roles: [], clockable: false }, role: { id: u.role_id, system_role: fe.data?.system_role, view_mode: fe.data?.view_mode } } }));
  localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fe.data)); localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z));
  return (await fetch(api + '/iam/change-location', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ workplace_id: w, workplace_timezone: z }) })).status;
}, [API, TGT.id, TGT.tz]);
const menuState = () => page.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms.find(x => x.querySelector('[data-test-id^="option_item_"]')) || ms[ms.length - 1];
  if (!m) return { menu_found: false, n_menus: ms.length }; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m);
  return { menu_found: true, classes: m.className, inline_style: m.getAttribute('style'), inline_top: m.style.top, inline_left: m.style.left, rect: { top: +r.top.toFixed(2), left: +r.left.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) },
    computed_visibility: cs.visibility, on_screen: r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1 && cs.visibility === 'visible',
    viewport: [innerWidth, innerHeight], dpr: devicePixelRatio, option_items: [...m.querySelectorAll('[data-test-id^="option_item_"]')].map(o => o.innerText.replace(/check\s*/, '').trim()) }; });
const zone = () => page.evaluate(() => ({ browser_timezoneId: Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage_timezone: localStorage.getItem('timezone'), localStorage_location: localStorage.getItem('location'), header: (document.querySelector('header, .q-header')?.innerText || '').replace(/\s+/g, ' ').slice(0, 300) }));
const E = { ticket: 'SV-11822', tag, cpu_throttle: THR, force_device_scale_factor_flag: FORCE, viewport: [W, H], deviceScaleFactor: dpr, target: TGT, browser_tz: BTZ, process_TZ: process.env.TZ, rule99_match: BTZ === TGT.tz, change_location_status: cl, checks: [] };
for (const [i, path] of ['/dashboard', '/workorders', '/dashboard'].entries()) {
  if (i === 2) { await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(3000); await page.reload({ waitUntil: 'domcontentloaded' }); }
  else await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(9000);
  if (!E.app_version) E.app_version = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  await page.locator('[data-test-id="profile_menu_button"]').click(); await sleep(1200);
  await page.locator('[data-test-id="select_location"]').click(); await sleep(1800);
  const st = await menuState(); st.load = i === 2 ? 'reload' : 'plain load'; st.path = path; st.zone = await zone(); st.at_utc = new Date().toISOString();
  st.picture = `SV-11822-retest/${tag}-${i}.png`; await page.screenshot({ path: `${OUT}/${tag}-${i}.png` });
  E.checks.push(st); console.log(tag, st.load, path, JSON.stringify({ on: st.on_screen, top: st.inline_top, left: st.inline_left, vis: st.computed_visibility, rect: st.rect, n: st.option_items?.length, dpr: st.dpr }));
  for (let k = 0; k < 2; k++) { await page.keyboard.press('Escape'); await sleep(400); }
}
E.console = errs.slice(0, 40);
fs.writeFileSync(`${OUT}/evidence-${tag}.json`, JSON.stringify(E, null, 1));
await browser.close();
