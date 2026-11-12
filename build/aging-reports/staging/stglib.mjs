// stglib.mjs — 12 Nov 2026: staging runs for aging run 557 with the QA LEAD'S OWN staging session (cookies in /tmp/qa-cookies/staging-full.json,
// chmod 600, never committed). NEVER sign in, sign out or change location from here: a fresh sign-in ends his session (session 5's re-check
// guide, facts only). So login/logout/change-location calls are refused inside the test browser, and the app's local state is rebuilt from
// view-profile / my-workplaces / fe-permissions if the page needs it. api(path) reads with the same cookies.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const { chromium } = pkg; import fs from 'fs';
export const APP = 'https://app.staging.shopview.com', API = 'https://api.staging.shopview.com';
export async function stgStart(OUT, { width = 1440, height = 900 } = {}) {
  fs.mkdirSync(OUT, { recursive: true }); const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim(); const c = JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json', 'utf8'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, timezoneId: process.env.BROWSER_TZ || 'Asia/Karachi', /* Rule 125: the QA lead's browser zone; 12 Nov: shown dates follow the browser zone */  ignoreHTTPSErrors: true, acceptDownloads: true }); const ck = [];
  for (const domain of ['app.staging.shopview.com', 'api.staging.shopview.com']) for (const [name, value] of Object.entries(c)) ck.push({ name, value, domain, path: '/', secure: true, sameSite: 'None' });
  await ctx.addCookies(ck);
  const blocked = []; await ctx.route(/\/api\/(auth\/)?(login|logout|quick-login|iam\/change-location|iam\/logout)/i, (r) => { blocked.push(r.request().url()); return r.abort(); });
  const H = { Accept: 'application/json' };
  const api = async (path) => { const r = await ctx.request.get(API + path, { headers: { ...H, Origin: APP, Referer: APP + '/' } }); let j = null; try { j = await r.json(); } catch {} return { st: r.status(), j }; };
  /* the app keeps its signed-in state in localStorage ('user', 'fe_permissions_wrapper', 'location'); rebuild it from the session's own
     profile / workplaces / permissions (the shape session 5 recorded, facts only) so no sign-in is ever made */
  const pr = await api('/api/iam/view-profile/'), wp = await api('/api/staff/my-workplaces'), fp = await api('/api/auth/me/fe-permissions');
  if (pr.st !== 200 || fp.st !== 200) throw new Error('staging session not valid: profile ' + pr.st + ' perms ' + fp.st);
  const u = pr.j.data.user, wl = wp.j?.data?.collection || [], fd = fp.j.data; const dw = wl.find((x) => x.is_default) || wl.find((x) => x.name === 'Staging Heavy Duty - 9919') || wl[0];
  const login = { role: { id: u.role_id, fePermissions: fd.fe_permissions, name: 'Admin', description: '', isDefault: true, isDeletable: false, isEditable: true },
    details: { user_id: null, intercom_data: {}, name: u.first_name + ' ' + u.last_name, email: u.email, avatar_url: null, default_workplace: dw.id, workplace_timezone: dw.timezone, staff_id: null, clockable: false, created_on: null, bookkeeping_enabled: true, last_page_visited: null } };
  await ctx.addInitScript(([lg, perms, loc]) => { try { localStorage.setItem('user', JSON.stringify({ data: lg })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(perms)); if (!localStorage.getItem('location')) localStorage.setItem('location', JSON.stringify(loc)); } catch (e) {} }, [login, fd, dw.id]);
  const page = await ctx.newPage(); page.setDefaultTimeout(20000); const where = { name: dw.name, id: dw.id, workplaces: wl.map((x) => x.name) };
  let k = 0; const shot = async (n) => { const f = `${OUT}/${String(++k).padStart(2, '0')}-${n}.png`; await page.screenshot({ path: f }).catch(() => {}); return f; };
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(2500); };
  const close = async () => { await Promise.race([browser.close(), new Promise((x) => setTimeout(x, 8000))]); };
  return { browser, ctx, page, api, shot, go, close, blocked, where };
}
