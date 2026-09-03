// qa-branch-boot.mjs — sign a headless browser into ANY ShopView QA branch, the authentic way.
//
// PROVEN LIVE on sv9315 (build v26.35.6-0f8d60b) on 2026-08-31/2026-09-02. See
// build/APP-ACTIONS-PLAYBOOK.md §A "THE AUTHENTIC QA-BRANCH LOGIN".
//
// ✅ RE-PROVEN 2026-09-02, AFTER the bootOrigin() refactor (commit f6e602b3) — the refactor landed
// after the original proof, so by Rule 12 the file as it stands had never been observed working.
// All THREE entry points were exercised clean against sv9315 / v26.35.6-0f8d60b: the CLI, the
// exported boot(), and the exported bootOrigin(). Observed: exit 0 · localStorage.user present ·
// landed https://sv9315.qa.shopview.com/customers (NOT /login) · GET /api/auth/me/fe-permissions 200
// · fe_permissions.length = 40 · template_slug = "administrator".
//
// 🛑 JUDGE THE SESSION BY template_slug, NEVER BY role.name. On sv9315 the ADMIN quick-login user's
// user.data.role.name reads "Tech View" while fe-permissions reports template_slug=administrator
// with 40 permissions — a CORRECT admin boot, not a wrong-role landing.
//
// 🆕 2026-09-02 — THE SUMMARY LINE NOW SAYS SO. It used to print `role: Tech View`, which made every
// correct admin boot look failed and cost sessions time chasing it. It now prints the IDENTITY —
// `template_slug` + `fe_permissions` count, read from localStorage["fe_permissions_wrapper"] — and
// carries role.name only as a trailing, explicitly-UNRELIABLE label. `boot()`/`bootOrigin()` return
// `templateSlug` and `nFePerms` alongside the unchanged `role`/`nPerms`; assert on the former.
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
// PREREQUISITES — all three, and it fails loudly without each:
//  (a) a FRESH MITM bridge:  source build/testing-tools/ensure_bridge.sh
//      (bridge itself: build/atlassian-login/bridge.mjs — committed; it writes the ROTATING port to
//      /tmp/atlassian/bridge-port.txt, which this script reads. NEVER hard-code a port.)
//      ✅ FIXED 2026-09-02 — ensure_bridge.sh IS now self-sufficient: it generates mitm.key/mitm.crt
//      itself, idempotently (only when absent or within 2 days of expiry), from the §A(2) openssl
//      recipe with the WIDE SAN list, and it FAILS NON-ZERO with the bridge log tail if the bridge
//      comes up with no port or no egress. It used to print "bridge: restarted -> , egress " and
//      report success, so the ENOENT death on the missing cert read as a pass. No manual openssl
//      step is needed any more; just source it and check its exit status.
//  (b) `sv_sso_session` ALONE in /tmp/qa-cookies/<branch>-sso.txt as `sv_sso_session=<value>`,
//      chmod 600, /tmp only, NEVER committed — this repo is public (Rule 82).
//  (c) playwright at /opt/node22/lib/node_modules/playwright/index.js and Chromium at
//      /opt/pw-browsers/chromium-1194/chrome-linux/chrome (override with $CHROME_BIN).
//
// EVICTION (recorded 2026-09-02): every quick-login ROTATES that branch's PHPSESSID — the proving
// runs rotated sv9315's seven times. So TWO SESSIONS ON ONE QA BRANCH WILL EVICT EACH OTHER; that is
// expected branch behaviour, not a fault. One session per branch (Rule 83). A mid-test 401/409 is
// NOT a blocker and NOT a reason to contact the QA lead — it is a RE-BOOT: run this again and carry
// on. Never persist a PHPSESSID between runs; carry sv_sso_session only, which does not rotate.
//
// USAGE:  node build/testing-tools/qa-branch-boot.mjs <branch> [route] [admin|tech]
//   e.g.  node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;

// `boot(branch, …)` is the QA-branch entry point and its contract is UNCHANGED.
// 2026-09-02: the body moved into `bootOrigin()` so other hosts (staging, a per-project boot script)
// can DELEGATE here instead of forking a third divergent implementation of the same recipe.
export async function boot(branch, route = '/', key = 'admin') {
  return bootOrigin({
    app: `https://${branch}.qa.shopview.com`,
    apiHost: `${branch}api.qa.shopview.com`,            // NO dot before `api`
    ssoFile: `/tmp/qa-cookies/${branch}-sso.txt`,
    label: branch,
    route,
    key,
  });
}

export async function bootOrigin({ app, apiHost, ssoFile, label = app, route = '/', key = 'admin' }) {
  const APP = app;
  const APIH = apiHost;
  const APPH = new URL(APP).host;
  const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();

  // sv_sso_session ONLY. Anything else you carry in can only hurt you (trap 1).
  const raw = fs.readFileSync(ssoFile, 'utf8').trim();
  const m = /sv_sso_session=([^;\s]+)/.exec(raw);
  if (!m) throw new Error(`no sv_sso_session in ${ssoFile}`);
  const sso = { name: 'sv_sso_session', value: m[1], path: '/', secure: true, sameSite: 'None' };

  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    proxy: { server: `http://127.0.0.1:${PORT}` },
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  // host-only on BOTH hosts, never a leading dot / parent domain (trap 2)
  await ctx.addCookies([{ ...sso, domain: APIH }, { ...sso, domain: APPH }]);

  const page = await ctx.newPage();
  page.setDefaultTimeout(60000);
  const api = [];
  page.on('response', r => {
    if (r.url().includes(APIH)) api.push(`${r.status()} ${r.request().method()} ${r.url().replace(`https://${APIH}`, '<api>').split('?')[0]}`);
  });

  // land on the sign-in screen so the DEV MODE panel renders, then let the APP log in
  await page.goto(`${APP}/login?redirect=${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 🛑 A SLEEPING BRANCH LOOKS EXACTLY LIKE A DEAD SESSION — AND IT REDIRECTS, SO CHECK THE URL.
  // QA branches are paused to save resources. The app host then redirects to
  //     https://sleep.qa.shopview.com/?app=<branch>&api=<branch>
  // which serves "Environment Sleeping … Click below to wake it up — it usually takes around 1
  // minute." with a single "Wake Up" button and NO sign-in form. The DEV MODE panel is therefore
  // absent and this script used to stop with "no DEV MODE Admin button" — which reads as expired
  // credentials, and is not. Measured on sv8218, 2026-09-03.
  // The redirect takes several seconds, so DETECT BY URL and POLL: a first fix checked once at +4s,
  // before the redirect had landed, and never fired.
  for (let attempt = 0; attempt < 3; attempt++) {
    let asleep = false;
    for (let w = 0; w < 8; w++) {
      asleep = /sleep\.qa\.shopview\.com/.test(page.url())
        || (await page.locator('button:has-text("Wake Up")').count()) > 0;
      if (asleep || /\/login/.test(page.url())) break;
      await page.waitForTimeout(2000);
    }
    if (!asleep) break;
    console.log(`${label} is ASLEEP (${page.url()}) — clicking "Wake Up"; it takes about a minute`);
    await page.locator('button:has-text("Wake Up")').first().click({ timeout: 20000 }).catch(() => {});
    for (let w = 0; w < 30; w++) {
      await page.waitForTimeout(5000);
      if (!/sleep\.qa\.shopview\.com/.test(page.url())) break;
    }
    await page.goto(`${APP}/login?redirect=${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(8000);
    if (!/sleep\.qa\.shopview\.com/.test(page.url())) { console.log(`${label} is awake`); break; }
  }

  const btnLabel = key === 'tech' ? 'Tech' : 'Admin';
  const btn = page.locator(`button:has-text("${btnLabel}")`).first();
  if (!(await btn.count())) { console.log(`no DEV MODE "${btnLabel}" button on ${label} — STOP`); await browser.close(); process.exit(2); }
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
  // IDENTITY comes from fe_permissions_wrapper (template_slug + fe_permissions), NOT from
  // user.data.role.name -- see the 🛑 note at the top of this file. `user.data.role` carries no
  // template_slug field at all, so looking for it there returns null and reads as a failure.
  const who = await page.evaluate(() => {
    let u = null, w = null;
    try { u = JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) { /* keep null */ }
    try { w = JSON.parse(localStorage.getItem('fe_permissions_wrapper') || 'null'); } catch (e) { /* keep null */ }
    const wd = w?.data ?? w;                       // wrapper has been seen both flat and under .data
    const fe = wd?.fe_permissions ?? wd?.fePermissions;
    return {
      templateSlug: wd?.template_slug ?? wd?.templateSlug ?? null,
      nFePerms: Array.isArray(fe) ? fe.length : (fe && typeof fe === 'object' ? Object.keys(fe).length : null),
      role: u?.data?.role?.name,                   // UNRELIABLE label -- never assert on it
      nPerms: u?.data?.role?.fePermissions?.length,
    };
  });
  return {
    browser, ctx, page, api, APP, APIH,
    templateSlug: who.templateSlug, nFePerms: who.nFePerms,
    role: who.role, nPerms: who.nPerms,            // kept for callers; secondary, not identity
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [branch, route = '/', key = 'admin'] = process.argv.slice(2);
  if (!branch) {
    console.log('usage: node build/testing-tools/qa-branch-boot.mjs <branch> [route] [admin|tech]');
    console.log('  e.g. node build/testing-tools/qa-branch-boot.mjs sv9315 /customers admin');
    console.log('PREREQUISITES:');
    console.log('  1. fresh MITM bridge   : source build/testing-tools/ensure_bridge.sh');
    console.log('                           (build/atlassian-login/bridge.mjs -> /tmp/atlassian/bridge-port.txt; port ROTATES)');
    console.log('  2. sv_sso_session ONLY : /tmp/qa-cookies/<branch>-sso.txt, chmod 600, /tmp only, NEVER committed');
    console.log('                           no PHPSESSID, no cf_clearance — carrying them is the 409 trap');
    console.log('  3. playwright          : /opt/node22/lib/node_modules/playwright/index.js');
    console.log('EVICTION: one session per QA branch (Rule 83). A mid-test 401/409 is a RE-BOOT, not a blocker.');
    console.log('Canonical recipe: build/APP-ACTIONS-PLAYBOOK.md §A "THE AUTHENTIC QA-BRANCH LOGIN"');
    process.exit(1);
  }
  const { browser, page, templateSlug, nFePerms, role, nPerms, api } = await boot(branch, route, key);
  console.log('build marker:', await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content));
  console.log('identity    : template_slug=' + templateSlug + ' | fe_permissions=' + nFePerms +
              '   [role.name="' + role + '"/' + nPerms + ' — UNRELIABLE, do not assert on it]');
  console.log('landed url  :', page.url(), '| title:', await page.title());
  console.log('body chars  :', (await page.evaluate(() => document.body?.innerText || '')).length);
  console.log('api calls   :'); [...new Set(api)].slice(0, 15).forEach(x => console.log('   ' + x));
  await browser.close();
}
