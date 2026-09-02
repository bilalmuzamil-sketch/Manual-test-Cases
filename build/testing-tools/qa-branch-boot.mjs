// qa-branch-boot.mjs — sign a headless browser into ANY ShopView QA branch, the authentic way.
//
// PROVEN LIVE on sv9315 (build v26.35.6-0f8d60b) on 2026-08-31/2026-09-02. See
// build/APP-ACTIONS-PLAYBOOK.md §A "THE AUTHENTIC QA-BRANCH LOGIN".
//
// THE METHOD: let the APP log itself in. Every QA branch's sign-in screen carries a
// "DEV MODE — QUICK LOGIN" panel with Admin / Tech buttons (populated from
// GET /api/quick-login/users). Clicking one makes the SPA call POST /api/quick-login itself and
// write localStorage.user / fe_permissions_wrapper / token from the response. Nothing is
// hand-minted, so the role and permissions come from the server (Rules 12 and 26).
//
// THREE THINGS THAT MAKE OR BREAK IT — all measured, none guessable:
//  1. ONLY `sv_sso_session` IS NEEDED. Do NOT carry PHPSESSID into the browser: quick-login
//     rotates it, and a stale one is the whole "409 Session has expired" latch. cf_clearance is
//     not needed either (these hosts are CloudFront + nginx, not Cloudflare).
//  2. SCOPE COOKIES HOST-ONLY, NEVER TO `.qa.shopview.com`. A domain-scoped PHPSESSID plus the
//     host-only one quick-login sets = two same-name cookies on the API host, the server reads
//     the stale one, and fe-permissions answers 409 even though quick-login returned 200.
//  3. Chromium cannot TLS through the egress proxy — a FRESH local MITM bridge per run is
//     required, and its port rotates within a session. See the playbook recipe.
//
// USAGE:  node build/testing-tools/qa-branch-boot.mjs <branch> [route] [admin|tech]
//   e.g.  node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin
// Expects the SSO token alone in /tmp/qa-cookies/<branch>-sso.txt as `sv_sso_session=<value>`
// (chmod 600, /tmp only, never committed — Rule 82).
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;

export async function boot(branch, route = '/', key = 'admin') {
  const APP = `https://${branch}.qa.shopview.com`;
  const APIH = `${branch}api.qa.shopview.com`;          // NO dot before `api`
  const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();

  // sv_sso_session ONLY. Anything else you carry in can only hurt you (trap 1).
  const raw = fs.readFileSync(`/tmp/qa-cookies/${branch}-sso.txt`, 'utf8').trim();
  const m = /sv_sso_session=([^;\s]+)/.exec(raw);
  if (!m) throw new Error('no sv_sso_session in the /tmp token file');
  const sso = { name: 'sv_sso_session', value: m[1], path: '/', secure: true, sameSite: 'None' };

  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    proxy: { server: `http://127.0.0.1:${PORT}` },
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  // host-only on BOTH hosts, never `.qa.shopview.com` (trap 2)
  await ctx.addCookies([{ ...sso, domain: APIH }, { ...sso, domain: `${branch}.qa.shopview.com` }]);

  const page = await ctx.newPage();
  page.setDefaultTimeout(60000);
  const api = [];
  page.on('response', r => {
    if (r.url().includes(APIH)) api.push(`${r.status()} ${r.request().method()} ${r.url().replace(`https://${APIH}`, '<api>').split('?')[0]}`);
  });

  // land on the sign-in screen so the DEV MODE panel renders, then let the APP log in
  await page.goto(`${APP}/login?redirect=${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const label = key === 'tech' ? 'Tech' : 'Admin';
  const btn = page.locator(`button:has-text("${label}")`).first();
  if (!(await btn.count())) { console.log(`no DEV MODE "${label}" button on ${branch} — STOP`); await browser.close(); process.exit(2); }
  await btn.click();                       // NB: getByRole('button',{name}) does NOT match these
  await page.waitForTimeout(9000);

  // LANDING PROOF — assert it, so a false success cannot pass
  const signedIn = await page.evaluate(() => !!localStorage.getItem('user'));
  const onLogin = /\/login/.test(page.url());
  if (!signedIn || onLogin) {
    console.log('NOT SIGNED IN. url=' + page.url() + ' user-in-localStorage=' + signedIn);
    console.log('api calls:'); [...new Set(api)].forEach(x => console.log('   ' + x));
    console.log('a 409 on fe-permissions after a 200 quick-login = trap 2, a duplicate PHPSESSID.');
    await browser.close(); process.exit(2);
  }
  if (route !== '/' && !page.url().endsWith(route)) {
    await page.goto(APP + route, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
  }
  const who = await page.evaluate(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return { role: u?.data?.role?.name, nPerms: u?.data?.role?.fePermissions?.length };
  });
  return { browser, ctx, page, api, APP, APIH, role: who.role, nPerms: who.nPerms };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [branch, route = '/', key = 'admin'] = process.argv.slice(2);
  if (!branch) { console.log('usage: node qa-branch-boot.mjs <branch> [route] [admin|tech]'); process.exit(1); }
  const { browser, page, role, nPerms, api } = await boot(branch, route, key);
  console.log('build marker:', await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content));
  console.log('role        :', role, '|', nPerms, 'permissions');
  console.log('landed url  :', page.url(), '| title:', await page.title());
  console.log('body chars  :', (await page.evaluate(() => document.body?.innerText || '')).length);
  console.log('api calls   :'); [...new Set(api)].slice(0, 15).forEach(x => console.log('   ' + x));
  await browser.close();
}
