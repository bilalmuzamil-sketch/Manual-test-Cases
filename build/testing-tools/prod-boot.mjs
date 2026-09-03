// prod-boot.mjs — hydrate a headless browser into PRODUCTION (app.shopview.com) from EXISTING cookies.
//
// 🛑 WHY IT NEVER LOGS IN. Playbook §K: "A fresh login for the SAME user EXPIRES the previous
// PHPSESSID" - so calling POST /api/login would evict the QA lead from his own browser mid-session
// (Rule 83's collision mode 2). This harness therefore takes cookies he already has and NEVER
// authenticates. If the cookies are dead it fails loudly and asks for fresh ones.
//
// 🛑 PRODUCTION IS NOT DISPOSABLE. Rule 6's "act freely" covers staging / QA / prod TEST ORGS - not
// the live app. Reads and per-user VIEW state (filter chips, column pickers, sort order) only.
// Never create, edit or delete business data here.
//
// Cookies: /tmp/shopview/prod-cookies.json {PHPSESSID, cf_clearance} - chmod 600, outside the repo,
// never printed, never committed (Rule 82; the repo is PUBLIC).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP = 'https://app.shopview.com', APIH = 'api.shopview.com';
const CKF = process.env.PROD_CK || '/tmp/shopview/prod-cookies.json';

export async function bootProd(route = '/', opts = {}) {
  const ck = JSON.parse(fs.readFileSync(CKF, 'utf8'));
  const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
  const browser = await chromium.launch({ args: ['--no-sandbox'],
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium',
    proxy: { server: `http://127.0.0.1:${port}` } });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true,
    viewport: opts.viewport || { width: 1680, height: 1050 } });
  // HOST-ONLY on the app host, plus the same pair on the API host. The recorded trap is a
  // DOMAIN-scoped duplicate of a same-name cookie making the server read the stale one.
  const jar = [];
  for (const host of ['app.shopview.com', 'api.shopview.com'])
    for (const [name, value] of Object.entries(ck))
      jar.push({ name, value, domain: host, path: '/', httpOnly: false, secure: true, sameSite: 'Lax' });
  await ctx.addCookies(jar);
  const page = await ctx.newPage();
  page.setDefaultTimeout(opts.timeout || 90000);
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

  // prove the SESSION before blaming the UI for anything
  const me = await page.request.get(`https://${APIH}/api/auth/me/fe-permissions`,
    { headers: { Accept: 'application/json' }, ignoreHTTPSErrors: true });
  if (me.status() !== 200) { await browser.close();
    throw new Error(`prod session is dead: /api/auth/me/fe-permissions -> ${me.status()}. Ask for fresh cookies.`); }
  const nFePerms = ((await me.json())?.data?.fe_permissions || []).length;

  // 🛑 SPA BOOT IS NOT AUTOMATED HERE, BY DESIGN (2026-09-03). Cookies authenticate the API but NOT
  // the SPA: with valid cookies and localStorage holding only `mode`, app.shopview.com/reports
  // redirects to /login and makes zero API calls - it decides it is logged out without asking the
  // server. The two ways past that were both rejected: POST /api/login evicts the real user's own
  // session (playbook §K), and hand-forging the localStorage session blob to enter PRODUCTION was
  // stopped by the permission classifier - correctly; that is a human decision, not an automated one.
  // So this returns an authenticated API context (page.request, cookie-auth) but does NOT forge SPA
  // hydration. For UI work on prod, capture localStorage from a REAL signed-in browser and pass it as
  // opts.session; nothing is reconstructed here.
  if (opts.session) {
    await ctx.addInitScript((sess) => { try {
      for (const [k, v] of Object.entries(sess)) localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    } catch (e) {} }, opts.session);
  }

  await page.goto(`${APP}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(opts.settle || 12000);
  const version = await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content || null);
  log(`prod ${page.url()} | app-version=${version} | fe_permissions=${nFePerms}`);
  if (/\/login/.test(page.url()))
    log('⚠ landed on /login - the cookies authenticate the API but the SPA wants its own hydration');
  return { browser, page, ctx, APP, APIH, version, nFePerms };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { browser, page } = await bootProd(process.argv[2] || '/');
  console.log('final url:', page.url());
  await browser.close();
}
