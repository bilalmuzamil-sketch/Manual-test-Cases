// staging-boot2.mjs — SPA hydration/login for Chromium against ShopView staging.
// Performs the dev quick-login, hydrates localStorage (user + fe_permissions)
// the way the real SPA does, and returns a live Playwright page so you can drive
// / screenshot the app as a given role.
//
// SECRET-FREE: reads cookies from /tmp/cln/cookies.json (via staging-admin.mjs).
// Reads $HTTPS_PROXY live each run — the proxy port rotates between sessions.
//
// Usage (CLI): SV_KEY=tech node staging-boot2.mjs /workorders
// Usage (import): import { boot2 } from './staging-boot2.mjs';
//
// NOTE: paths to playwright / chromium below match the staging test env. Adjust
// executablePath / the playwright import if your environment differs.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from './staging-admin.mjs';
const { chromium } = pw;
const APP = 'https://app.staging.shopview.com';

export async function boot2(roleKey = 'tech', opts = {}) {
  const t = await login(roleKey);
  if (t.status === 409) { console.log('COOKIES_EXPIRED at login'); process.exit(2); }
  // Switch to a specific workplace so WO pages in that workplace resolve (not the random default).
  // opts.workplaceId (+ opts.timezone) or env SV_WORKPLACE / SV_TZ. Endpoint: POST /api/iam/change-location.
  const wp = opts.workplaceId || process.env.SV_WORKPLACE;
  if (wp) { await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: wp, workplace_timezone: opts.timezone || process.env.SV_TZ || 'America/Edmonton' }); }
  const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  if (fe.status === 409) { console.log('COOKIES_EXPIRED at fe-permissions'); process.exit(2); }
  const feData = fe.body?.data;
  const userObj = { data: t.data };
  // parse sessCookie into browser cookies
  const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); const name = p.slice(0, i); const value = p.slice(i + 1); return { name, value, domain: '.staging.shopview.com', path: '/' }; });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  // land on app origin (a lightweight route) to be able to set localStorage
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(({ u, f }) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (u.data && u.data.token) localStorage.setItem('token', JSON.stringify(u.data.token));
  }, { u: userObj, f: feData });
  await page.waitForTimeout(500);
  return { browser, ctx, page, feData, user: t.data };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, page, feData } = await boot2(process.env.SV_KEY || 'tech');
  console.log('perms count', feData?.fe_permissions?.length, 'view_mode', feData?.view_mode);
  const dest = process.argv[2] || '/workorders';
  await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  console.log('url', page.url());
  const txt = (await page.locator('body').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  console.log('body', txt);
  await page.screenshot({ path: '/tmp/cln/boot2_shot.png' });
  await browser.close();
}
