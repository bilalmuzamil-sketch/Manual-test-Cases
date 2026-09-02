// staging-boot2.mjs — sign a headless Chromium into ShopView STAGING, the authentic way.
//
// 🟠 NOT YET VERIFIED LIVE ON STAGING — converted 2026-09-02 from the proven sv9315 recipe; first
//    user must confirm. The marker was NARROWED on 2026-09-02 after a repo-evidence pass; what is
//    SETTLED and what is NOT is now separated, so nobody re-litigates the settled half:
//
//    ✅ SETTLED (repo record, 2026-09-02): quick login DOES exist on staging and was used
//       throughout the Custom Roles project — but every recorded staging use is the API endpoint
//       `POST /api/quick-login {key:'admin'|'tech'}` called from Node under the THREE cookies and
//       followed by HAND-WRITING localStorage, never a click on a DEV MODE panel. See
//       build/TESTING-RUNBOOK.md §3 · staging-admin.mjs login() · custom-roles-run/RUN331-STATE.md ·
//       custom-roles-run/live-ui-2026-07-16/staging/approve-decline-TECH-PT.json · and as recently
//       as 2026-08-19 filters/build-verify-2026-08-19/tools/mobile.mjs, which opens /login only as a
//       same-origin landing pad for localStorage.setItem() and never clicks anything.
//
//    ❌ STILL UNOBSERVED — exactly two things, and this script depends on BOTH:
//       1. Whether `app.staging.shopview.com/login` renders a CLICKABLE `DEV MODE — QUICK LOGIN`
//          panel. No observation of one exists anywhere in this repo. The only recorded remark is
//          NEGATIVE — "DEV login buttons don't reliably work"
//          (custom-roles-run/WORDING-VIU-STATE-2026-07-13.md). On QA branches that remark is
//          explained by a Quasar selector bug (getByRole does not match q-btn), but that was proven
//          on a QA BRANCH and is a PLAUSIBLE, not a demonstrated, explanation of the staging note.
//       2. Whether `sv_sso_session` ALONE gets past staging's edge. Staging sits behind CLOUDFLARE
//          (cf_clearance), unlike the CloudFront+nginx QA branches, so trap 1 of the recipe
//          ("one cookie is enough") is unproven here and may be false.
//
//    Could not be settled live on 2026-09-02: we hold no staging `sv_sso_session`, and stored
//    staging cookies return 401 (build/BLOCKED-shopview-app-session.md).
//    If the panel is absent the run STOPS with `no DEV MODE "Admin" button` — that is the honest
//    outcome, not a crash. Fall back to §A's hand-hydration recipe in
//    build/APP-ACTIONS-PLAYBOOK.md ONLY in that case, and RECORD WHAT YOU OBSERVED here.
//
// 🔴 WHAT CHANGED, AND WHY THE OLD VERSION WAS DANGEROUS. Until 2026-09-02 this script did its own
//    `POST /api/quick-login`, then HAND-WROTE localStorage.user / fe_permissions_wrapper / token, and
//    scoped its cookies to the PARENT DOMAIN. It worked, which is exactly what made it dangerous —
//    every session that copied it inherited both landmines:
//      1. AUTHENTICITY. A hand-assembled `user` object means the role and permissions come from a
//         blob WE wrote rather than from the server, silently invalidating every permission-dependent
//         verdict (Rules 12, 26).
//      2. THE 409 TRAP. Parent-domain cookie scoping sends TWO same-name PHPSESSIDs to the API host;
//         the server reads the stale one and `fe-permissions` answers 409 immediately after a 200
//         login — a correct login that looks failed, routinely misdiagnosed as "the cookies are dead".
//    It now DELEGATES to `bootOrigin()` in qa-branch-boot.mjs: the app logs ITSELF in from the DEV
//    MODE panel, cookies are HOST-ONLY, and only `sv_sso_session` is ever carried.
//    Canonical recipe + traps: build/APP-ACTIONS-PLAYBOOK.md §A "THE AUTHENTIC QA-BRANCH LOGIN";
//    build/skills/14-ACCESS-RESILIENCE.md §3 + §3.1.
//
// PREREQUISITES
//   1. A FRESH MITM bridge:  source build/testing-tools/ensure_bridge.sh
//      (bridge: build/atlassian-login/bridge.mjs — committed; port in /tmp/atlassian/bridge-port.txt,
//      and it ROTATES, so never hard-code it.)
//   2. `sv_sso_session` and NOTHING ELSE — no PHPSESSID, no cf_clearance. Default source file
//      /tmp/staging-cookie.txt (any file containing `sv_sso_session=<value>` works; override with
//      $SV_SSO_FILE). chmod 600, /tmp only, NEVER committed — this repo is public (Rule 82).
//   3. playwright at /opt/node22/lib/node_modules/playwright/index.js.
//
// EVICTION: every quick-login rotates the shared PHPSESSID, so two sessions on one environment evict
// each other (Rule 83 — one session per environment). A mid-test 401/409 is a RE-BOOT, not a blocker
// and not a reason to contact the QA lead: run this again and continue. Never persist a PHPSESSID.
//
// Usage (CLI):    SV_KEY=tech node build/testing-tools/staging-boot2.mjs /workorders
// Usage (import): import { boot2 } from './staging-boot2.mjs';
import { bootOrigin } from './qa-branch-boot.mjs';

export const APP = 'https://app.staging.shopview.com';
export const API_HOST = 'api.staging.shopview.com';
const SSO_FILE = process.env.SV_SSO_FILE || '/tmp/staging-cookie.txt';

// Signature kept for existing callers: boot2(roleKey, opts). opts.route lands you somewhere other
// than '/'; opts.workplaceId (or $SV_WORKPLACE) switches workplace after sign-in.
export async function boot2(roleKey = 'tech', opts = {}) {
  const route = opts.route || '/';
  const r = await bootOrigin({
    app: APP,
    apiHost: API_HOST,
    ssoFile: SSO_FILE,
    label: 'staging',
    route,
    key: roleKey === 'admin' ? 'admin' : 'tech',
  });
  const { ctx, page } = r;

  // Optional workplace switch, so WO pages in that workplace resolve rather than the random default.
  // Driven through ctx.request, which SHARES the browser's cookie jar — so it always uses the
  // freshly minted PHPSESSID and we never hand-manage (or persist) a session cookie.
  const wp = opts.workplaceId || process.env.SV_WORKPLACE;
  if (wp) {
    await ctx.request.post(`https://${API_HOST}/api/iam/change-location`, {
      data: { workplace_id: wp, workplace_timezone: opts.timezone || process.env.SV_TZ || 'America/Edmonton' },
    }).catch(e => console.log('change-location failed: ' + String(e).slice(0, 160)));
    await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
  }

  // Read the permissions the SERVER gave us, out of what the app itself wrote. Never hand-built.
  const feData = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('fe_permissions_wrapper') || 'null'); } catch (_) { return null; }
  });
  const user = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null')?.data ?? null; } catch (_) { return null; }
  });
  return { ...r, feData, user };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = process.argv[2] || '/workorders';
  const { browser, page, feData } = await boot2(process.env.SV_KEY || 'tech', { route: dest });
  // Judge the session by permission COUNT + template_slug, never by role.name (playbook §A).
  console.log('perms count :', feData?.fe_permissions?.length, '| template_slug:', feData?.template_slug,
    '| view_mode:', feData?.view_mode);
  console.log('landed url  :', page.url(), '| title:', await page.title());
  const txt = await page.evaluate(() => document.body?.innerText || '');
  console.log('body chars  :', txt.length);   // a ~225-char page is the sign-in form, i.e. NOT signed in
  console.log('body        :', txt.replace(/\n+/g, ' | ').slice(0, 400));
  await page.screenshot({ path: '/tmp/cln/boot2_shot.png' }).catch(() => {});
  await browser.close();
}
