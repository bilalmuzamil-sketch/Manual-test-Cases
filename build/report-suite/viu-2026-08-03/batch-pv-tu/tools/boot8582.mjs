// boot8582.mjs — SPA hydration/login for Chromium against the Report Suite QA branch (sv8582).
// Mirrors build/testing-tools/staging-boot2.mjs (the proven boot2 pattern, CLAUDE.md Rule 27)
// retargeted at sv8582.qa.shopview.com / sv8582api.qa.shopview.com.
//
// SECRET-FREE: cookies come from /tmp/report-suite-viu/cookies.json via qa8582.mjs.
// Reads $HTTPS_PROXY live each run — the proxy port rotates between sessions.
//
// Usage (CLI): node boot8582.mjs /reports            # navigate + dump body text + screenshot
// Usage (import): import { boot } from './boot8582.mjs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api, APP } from './qa8582.mjs';
const { chromium } = pw;

export async function boot(roleKey = 'admin', opts = {}) {
  const t = await login(roleKey);
  if (t.status !== 200) { console.log('LOGIN_FAILED', t.status, t.error || ''); process.exit(2); }
  const wp = opts.workplaceId || process.env.SV_WORKPLACE;
  if (wp) await api(t.sessCookie, 'POST', '/api/iam/change-location',
    { workplace_id: wp, workplace_timezone: opts.timezone || process.env.SV_TZ || 'America/Edmonton' });
  const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
  if (fe.status !== 200) { console.log('FE_PERMS_FAILED', fe.status); process.exit(2); }
  const feData = fe.body?.data;
  const userObj = { data: t.data };
  const cookies = t.sessCookie.split('; ').map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/' };
  });
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true,
    proxy: { server: process.env.HTTPS_PROXY },
    args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 1680, height: 1050 }, ignoreHTTPSErrors: true });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  // Network log — every /api call the SPA makes (this is how report endpoints get discovered).
  const netlog = [];
  page.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/')) return;
    netlog.push({ status: r.status(), method: r.request().method(), url: u });
  });
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(({ u, f }) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (u.data && u.data.token) localStorage.setItem('token', JSON.stringify(u.data.token));
  }, { u: userObj, f: feData });
  await page.waitForTimeout(400);
  return { browser, ctx, page, feData, user: t.data, sessCookie: t.sessCookie, netlog };
}

// In-SPA navigation (deep-link goto can bounce; pushState+popstate is the proven fix).
export async function spaGo(page, path, waitMs = 5000) {
  await page.evaluate(p => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')); }, path);
  await page.waitForTimeout(waitMs);
  return page.url();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = process.argv[2] || '/workorders';
  const { browser, page, feData, netlog } = await boot(process.env.SV_KEY || 'admin');
  console.log('perms', feData?.fe_permissions?.length, 'view_mode', feData?.view_mode);
  await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  console.log('url', page.url());
  console.log('BODY:', (await page.locator('body').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 3000));
  console.log('API CALLS:'); for (const n of netlog) console.log(' ', n.status, n.method, n.url.replace(/^https:\/\/[^/]+/, ''));
  await page.screenshot({ path: '/tmp/report-suite-viu/shot.png', fullPage: true });
  await browser.close();
}
