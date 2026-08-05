// Establish a working sv8781 session WITHOUT ever calling quick-login.
// quick-login rotates PHPSESSID and invalidates the supplied session (409).
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
export const APP = 'https://sv8781.qa.shopview.com';
export const API = 'https://sv8781api.qa.shopview.com';

export async function session() {
  const PORT = fs.readFileSync('/tmp/sv8781/bridge.log', 'utf8').match(/BRIDGE_LISTENING 127\.0\.0\.1:(\d+)/)[1];
  const cookies = fs.readFileSync('/tmp/sv8781/cookies.txt', 'utf8').trim().split('\n').map(l => { const i = l.indexOf('='); return { name: l.slice(0, i), value: l.slice(i + 1), domain: '.qa.shopview.com', path: '/', secure: true }; });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: 'http://127.0.0.1:' + PORT }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const api = (path, init) => page.evaluate(async ({ API, path, init }) => {
    const r = await fetch(API + path, { credentials: 'include', ...(init || {}) });
    const t = await r.text();
    let j = null; try { j = JSON.parse(t); } catch {}
    return { status: r.status, json: j, text: t.slice(0, 300) };
  }, { API, path, init });

  const fe = await api('/api/auth/me/fe-permissions');
  if (fe.status !== 200) { console.log('SESSION DEAD at fe-permissions:', fe.status, fe.text); await browser.close(); process.exit(2); }

  // find a user payload for localStorage WITHOUT quick-login
  let user = null;
  for (const ep of ['/api/sso/check', '/api/staff/me', '/api/profile', '/api/auth/user', '/api/users/me']) {
    const r = await api(ep);
    if (r.status === 200 && r.json?.data) { user = r.json.data; console.log('user payload from', ep); break; }
  }
  return { browser, ctx, page, api, fe: fe.json.data, user };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const s = await session();
  console.log('fe perms:', s.fe.fe_permissions.length, 'role:', s.fe.template_slug);
  console.log('user payload found:', s.user ? 'YES keys=' + Object.keys(s.user).join(',').slice(0, 160) : 'NO');
  fs.writeFileSync('/tmp/sv8781/fe-body.json', JSON.stringify({ data: s.fe }));
  if (s.user) fs.writeFileSync('/tmp/sv8781/user-body.json', JSON.stringify({ data: s.user }));
  await s.browser.close();
}
