/** 16 Oct 2026 (batch 40) — a BROWSER signed in as the QA lead's "Analyst 1" (bilal.muzamil+dako, the SECOND staging company), from its
 *  own three cookies in /tmp/qa-cookies/staging-analyst1.json (chmod 600, never printed or committed). It is a DIFFERENT Google sign-in
 *  from the Admin one, so it is a separate app session and can be open at the same time as an Admin run (L0394, L0395). NEVER quick-login
 *  with these cookies: that would replace the Analyst session. Cookies are host-only on the app and API hosts (qa-branch-boot trap 2),
 *  the browser goes through the relay like every other run, TZ comes from the caller (TZ=Asia/Karachi through wob-run.sh).
 *  analystBrowser(route) -> { browser, ctx, page, api } ; api(page) is data.mts's in-page fetch, so it uses the page's own jar. */
import fs from 'node:fs';
import { chromium } from 'playwright';
import { api } from './data.mts';
export const ANALYST_FILE = '/tmp/qa-cookies/staging-analyst1.json';
export async function analystBrowser(route = '/workorders', w = 1600, h = 1000) {
  const C = JSON.parse(fs.readFileSync(ANALYST_FILE, 'utf8'));
  const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
  const APP = 'https://app.staging.shopview.com', hosts = ['app.staging.shopview.com', 'api.staging.shopview.com'];
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ignoreHTTPSErrors: true });
  await ctx.addCookies(hosts.flatMap((d) => ['sv_sso_session', 'PHPSESSID', 'cf_clearance'].filter((n) => C[n]).map((n) => ({ name: n, value: C[n], domain: d, path: '/', secure: true, sameSite: 'None' as const }))));
  await ctx.route((u) => /maps\.googleapis|intercom|sentry\.io|googletagmanager|google-analytics|hotjar|fullstory/i.test(u.toString()), (r) => r.abort()).catch(() => {});
  const page = await ctx.newPage(); page.setDefaultTimeout(30_000);
  // the app keeps the signed-in person in localStorage ("user", "fe_permissions_wrapper"); the app origin is opened once, then the
  // person and permissions are read from the API with the cookies and written there before the real page loads (as quick-login leaves them)
  await page.goto(APP + '/404-zz', { waitUntil: 'domcontentloaded' }).catch(() => {}); await page.waitForTimeout(2500);
  const a = api(page);
  const prof = await a.get('/api/iam/view-profile/'); const tok = await a.post('/api/token', {}); const fe = await a.get('/api/auth/me/fe-permissions');
  const info: any = { profile: prof.status, profileKeys: prof.body?.data ? Object.keys(prof.body.data).slice(0, 25) : null, token: tok.status, tokenKeys: tok.body?.data ? Object.keys(tok.body.data).slice(0, 25) : null, fe: fe.status, hadUser: await page.evaluate(() => !!localStorage.getItem('user')) };
  await page.goto(APP + route, { waitUntil: 'domcontentloaded' }).catch(() => {}); await page.waitForTimeout(7000);
  // not signed in to the app yet (the page sits on /login): sign in through the app's own Email / Password form, as Analyst 1 does by
  // hand (Login.vue posts /api/login and stores the person). The password stays in /tmp/shopview/staging-analyst1.env; nothing printed.
  if (/\/login/.test(page.url())) { const env = Object.fromEntries(fs.readFileSync('/tmp/shopview/staging-analyst1.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '')]));
    for (let i = 0; i < 10 && !(await page.locator('input[type=password]').count()); i++) await page.waitForTimeout(1000);
    await page.locator('input[type=email], input[type=text]').first().fill(env.SV_USER ?? ''); await page.locator('input[type=password]').first().fill(env.SV_PASS ?? '');
    await page.locator('button').filter({ hasText: /^\s*Login\s*$/ }).first().click().catch(() => {}); await page.waitForTimeout(9000); info.formSignIn = !/\/login/.test(page.url());
    if (info.formSignIn) { const php = (await ctx.cookies('https://api.staging.shopview.com')).find((c) => c.name === 'PHPSESSID'); if (php && php.value !== C.PHPSESSID) { C.PHPSESSID = php.value; fs.writeFileSync(ANALYST_FILE, JSON.stringify(C), { mode: 0o600 }); info.savedNewSession = true; } }
    if (!page.url().includes(route.split('?')[0])) { await page.goto(APP + route, { waitUntil: 'domcontentloaded' }).catch(() => {}); await page.waitForTimeout(6000); } }
  info.url = page.url().replace(APP, ''); info.top = await page.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
  return { browser, ctx, page, api: a, info, APP };
}
