// staging-cookie-boot.mjs — sign a headless browser into app.staging.shopview.com for the Global
// Search work, using the cookie the QA lead supplies plus the app's own DEV MODE quick login.
//
// WHY. 2026-09-28: QA branch sv9160 was merged into staging and DELETED, so Global Search moves to
// staging. The QA lead supplied cookies that day.
//
// THE METHOD, taken unchanged from qa-branch-boot.mjs (Rule 27 — reuse the recorded recipe):
// let the APP log itself in. The staging sign-in card carries a "DEV MODE — QUICK LOGIN" panel with
// Admin / Tech buttons; clicking one makes the SPA call POST /api/quick-login and write
// localStorage.user / fe_permissions_wrapper / token itself. Nothing is hand-minted, so the role and
// the permissions come from the server (Rules 12 and 26).
//
// THE TRAPS, all measured previously and all live here:
//  1. 🛑 STAGING IS THE OPPOSITE OF A QA BRANCH ON COOKIES. On a QA branch you carry ONLY
//     sv_sso_session and must NOT carry PHPSESSID. On staging you must carry ALL THREE —
//     sv_sso_session, PHPSESSID and cf_clearance — on BOTH hosts. Measured 2026-09-28: with
//     PHPSESSID dropped, staging bounces to a GOOGLE sign-in page and /api/api/sso/check answers
//     401; with all three, ShopView's own card appears with the DEV MODE panel and
//     /api/auth/me/fe-permissions answers 200. A Google sign-in screen here means a cookie is
//     missing or expired — it is not the sleeping-branch trap, which staging does not have.
//  2. SCOPE COOKIES HOST-ONLY. A domain-scoped cookie plus the host-only one quick-login sets means
//     two same-name cookies on the API host; the server reads the stale one and answers 409.
//  3. The panel is filled by an API call, so POLL for its button rather than checking once.
//  4. Retry the quick login up to three times — two sessions booting together can leave the page on
//     /login with `user` already stored, which is a transient, not a dead session.
//  5. Chromium cannot TLS through the egress proxy: a fresh local bridge per run is required
//     (run this through build/testing-tools/run_probe.sh).
//
// SECRETS: read from /tmp/shopview/gs-staging.env (chmod 600, outside the repo). NEVER printed,
// never written into a log, a screenshot path or a commit — this repo is PUBLIC (Rule 82).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const APP  = process.env.SV_APP  || 'https://app.staging.shopview.com';
const APIH = process.env.SV_APIH || 'api.staging.shopview.com';
const ENVF = process.env.SV_ENVF || '/tmp/shopview/gs-staging.env';

function creds() {
  if (!fs.existsSync(ENVF)) throw new Error(`no cookies at ${ENVF} — never inline them`);
  const d = {};
  for (const l of fs.readFileSync(ENVF, 'utf8').split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(l.trim()); if (m) d[m[1]] = m[2];
  }
  if (!d.SV_SSO_SESSION) throw new Error(`${ENVF} has no SV_SSO_SESSION`);
  return d;
}

export async function boot(route = '/', opts = {}) {
  const key = opts.key || 'admin';
  const c = creds();
  const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
  const browser = await chromium.launch({
    args: ['--no-sandbox'],
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
    proxy: { server: `http://127.0.0.1:${port}` },
  });
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: opts.viewport || { width: 1680, height: 1000 },
    deviceScaleFactor: opts.deviceScaleFactor || 1,
  });
  const host = new URL(APP).hostname;
  const mk = (n, v, d) => ({ name: n, value: v, domain: d, path: '/', secure: true });
  const jar = [];
  for (const d of [host, APIH]) {
    jar.push(mk('sv_sso_session', c.SV_SSO_SESSION, d));
    if (c.PHPSESSID)    jar.push(mk('PHPSESSID',    c.PHPSESSID,    d));
    if (c.CF_CLEARANCE) jar.push(mk('cf_clearance', c.CF_CLEARANCE, d));
  }
  await ctx.addCookies(jar);

  const api = [];
  const page = await ctx.newPage();
  page.on('response', r => { if (/\/api\//.test(r.url())) api.push(`${r.status()} ${r.url().split('?')[0].slice(-58)}`); });

  await page.goto(`${APP}/login?redirect=${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle || 9000);

  const btnLabel = key === 'tech' ? 'Tech' : 'Admin';
  const btn = page.locator(`button:has-text("${btnLabel}")`).first();
  for (let w = 0; w < 20 && !(await btn.count()); w++) await page.waitForTimeout(1500);
  if (!(await btn.count())) {
    console.log(`no DEV MODE "${btnLabel}" button on staging after 30s — STOP`);
    console.log('api calls:'); [...new Set(api)].forEach(x => console.log('   ' + x));
    await browser.close(); process.exit(2);
  }

  let signedIn = false, onLogin = true;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await btn.click().catch(() => {});   // getByRole('button',{name}) does NOT match these
    await page.waitForTimeout(9000);
    signedIn = await page.evaluate(() => !!localStorage.getItem('user'));
    onLogin = /\/login/.test(page.url());
    if (signedIn && !onLogin) break;
    if (attempt === 3) break;
    console.log(`   quick-login attempt ${attempt} left the page on ${page.url()} — clearing and retrying`);
    await ctx.clearCookies().catch(() => {});
    await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} }).catch(() => {});
    await ctx.addCookies(jar).catch(() => {});
    await page.waitForTimeout(6000 * attempt);
    await page.goto(`${APP}/login?redirect=${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    for (let w = 0; w < 20 && !(await btn.count()); w++) await page.waitForTimeout(1500);
  }
  if (!signedIn || onLogin) {
    console.log('NOT SIGNED IN after 3 quick-login attempts. url=' + page.url() + ' user-in-localStorage=' + signedIn);
    console.log('api calls:'); [...new Set(api)].forEach(x => console.log('   ' + x));
    console.log('a 409 on fe-permissions after a 200 quick-login = a duplicate PHPSESSID.');
    await browser.close(); process.exit(2);
  }

  if (route !== '/' && !page.url().includes(route)) {
    await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(opts.settle || 9000);
  }

  // judge the session by what the person can DO, never by role.name (it reads "Tech View" on a
  // correct admin boot and has cost sessions real time)
  const ident = await page.evaluate(() => {
    let slug = null, n = 0, role = null;
    try { const w = JSON.parse(localStorage.getItem('fe_permissions_wrapper') || '{}');
          slug = w.template_slug || w.data?.template_slug || null;
          const p = w.fe_permissions || w.data?.fe_permissions || []; n = Array.isArray(p) ? p.length : 0; } catch {}
    try { const u = JSON.parse(localStorage.getItem('user') || '{}'); role = u.data?.role?.name || u.role?.name || null; } catch {}
    return { slug, n, role };
  });
  const stamp = new Date().toISOString().slice(11, 19);
  console.log(`${stamp} staging ${page.url()} | template_slug=${ident.slug} | fe_permissions=${ident.n}` +
              `  (role.name="${ident.role}" — unreliable label, do not assert on it)`);
  return { browser, ctx, page, APP, APIH, templateSlug: ident.slug, nFePerms: ident.n, api };
}
