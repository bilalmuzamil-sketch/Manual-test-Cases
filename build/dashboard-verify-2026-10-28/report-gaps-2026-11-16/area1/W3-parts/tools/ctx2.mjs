// Shared evidence browser (deviceScaleFactor 2) for W3. SECRET-FREE: cookies come from /tmp via staging-admin.mjs.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
export const APP = 'https://app.staging.shopview.com';
export async function open2(WP, TZ, scale = 2, width = 1600, height = 950) {
  const t = await login('admin');
  await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
  const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
  const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, ignoreHTTPSErrors: true, timezoneId: TZ });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(({ u, f, w, tz }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(tz)); }, { u: { data: t.data }, f: fe.body?.data, w: WP, tz: TZ });
  return { browser, ctx, page };
}
export const box = async (l, s = 2) => { const b = await l.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * s), y: Math.round(b.y * s), w: Math.round(b.width * s), h: Math.round(b.height * s) }; };
