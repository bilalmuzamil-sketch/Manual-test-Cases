// boot8218.mjs — sign a headless browser into the Invoice Refresh QA branch sv8218.
//
// 🟠 NOT YET VERIFIED LIVE — converted 2026-09-02 from the proven sv9315 recipe; first user must
//    confirm. The RECIPE is proven (six consecutive clean runs on sv9315, build v26.35.6-0f8d60b);
//    what is unverified is this branch — sv8218 has not been re-driven since the conversion, and it
//    AUTO-SLEEPS (see the sleep guard below).
//
// 🔴 WHAT CHANGED, AND WHY THE OLD VERSION WAS DANGEROUS. Until 2026-09-02 this script did its own
//    `POST /api/quick-login`, HAND-WROTE localStorage.user / fe_permissions_wrapper / token, kept a
//    rotating PHPSESSID in a module variable, PERSISTED it to /tmp, and scoped its browser cookies to
//    `.qa.shopview.com`. It worked, which is exactly what made it dangerous — anyone copying it
//    inherited both landmines:
//      1. AUTHENTICITY. A hand-assembled `user` object means the role and permissions come from a
//         blob WE wrote rather than from the server, silently invalidating every permission-dependent
//         verdict (Rules 12, 26).
//      2. THE 409 TRAP. Parent-domain cookie scoping sends TWO same-name PHPSESSIDs to the API host;
//         the server reads the stale one and `fe-permissions` answers 409 immediately after a 200
//         login — a correct login that looks failed, and the old comment here even told you to
//         hydrate by hand because "the DEV login buttons are unreliable". They are not: that was a
//         SELECTOR bug (`getByRole('button',{name:/^Admin$/})` does not match a Quasar q-btn;
//         `button:has-text("Admin")` does).
//    It now DELEGATES to `boot()` in build/testing-tools/qa-branch-boot.mjs — one implementation of
//    the recipe, not three. Canonical: build/APP-ACTIONS-PLAYBOOK.md §A "THE AUTHENTIC QA-BRANCH
//    LOGIN"; build/skills/14-ACCESS-RESILIENCE.md §3 + §3.1.
//
// PREREQUISITES
//   1. A FRESH MITM bridge:  source build/testing-tools/ensure_bridge.sh
//      (bridge: build/atlassian-login/bridge.mjs — committed; port in /tmp/atlassian/bridge-port.txt,
//      and it ROTATES, so never hard-code it.)
//   2. `sv_sso_session` and NOTHING ELSE — no PHPSESSID, no cf_clearance — in
//      /tmp/qa-cookies/sv8218-sso.txt as `sv_sso_session=<value>`, chmod 600. /tmp only, NEVER
//      committed: this repo is public (Rule 82).
//      (The old /tmp/qa-cookies/sv8218-cookie-header.txt three-cookie header is no longer used, and
//      /tmp/qa-cookies/sv8218-live-session.txt is no longer written — a persisted PHPSESSID IS the
//      409 latch.)
//   3. playwright at /opt/node22/lib/node_modules/playwright/index.js.
//
// EVICTION: every quick-login ROTATES this branch's PHPSESSID, so two sessions on sv8218 evict each
// other. One session per branch (Rule 83). A mid-test 401/409 is NOT a blocker and NOT a reason to
// contact the QA lead — it is a RE-BOOT: run this again and continue from the case you were on.
//
// Usage:  node build/invoice-ui-refresh/build-verify-2026-08-31/tools/boot8218.mjs /workorders
import { boot as bootBranch } from '../../../testing-tools/qa-branch-boot.mjs';
import fs from 'fs';

export const BRANCH = 'sv8218';
export const APP = 'https://sv8218.qa.shopview.com';
export const API = 'https://sv8218api.qa.shopview.com';
const WAKE_API = 'https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv';

// 🛑 SLEEP GUARD, PART 1 — RUN IT BEFORE THE LOGIN. sv8218 auto-sleeps, and then EVERY route serves
// sleep.qa.shopview.com: a ~148-character page reading "Environment Sleeping". A run that does not
// check reports every field on every screen as absent, which is what happened on 2026-09-01 before
// the guard existed. Checking BEFORE the login matters: asleep, there is no DEV MODE panel to click,
// so the harness would stop with "no DEV MODE Admin button" and the real cause would be hidden.
export async function wakeIfAsleep() {
  const asleepNow = async () => {
    try {
      const r = await fetch(APP + '/', { redirect: 'follow' });
      const body = (await r.text()).slice(0, 4000);
      return /Environment Sleeping/i.test(body) || /sleep\.qa\.shopview\.com/i.test(r.url);
    } catch (_) { return false; }          // a network error is not "asleep" — let the boot report it
  };
  if (!(await asleepNow())) return true;
  console.log('ENVIRONMENT ASLEEP — waking sv8218');
  await fetch(WAKE_API, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'wake', env: BRANCH }),
  }).catch(() => {});
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 15000));
    if (!(await asleepNow())) { console.log('sv8218 awake, continuing'); return true; }
  }
  console.log('sv8218 still asleep after waking — STOP');
  return false;
}

// The live browser context, set by boot(). The module-level helpers below read it so the ~30 dated
// evidence scripts in this folder keep working unchanged (`import { boot, APP, apiGet, apiPost, sess }`).
let _ctx = null;
const _need = () => { if (!_ctx) throw new Error('call boot() first — the API helpers use the browser session'); return _ctx; };

// API helpers. These go through ctx.request, which SHARES the browser's cookie jar — so every call
// uses the freshly minted PHPSESSID and we never hand-manage, log, or persist a session cookie.
export async function apiGet(path) {
  const res = await _need().request.get(API + path, { headers: { Accept: 'application/json' } });
  let body = null; try { body = await res.json(); } catch (_) {}
  return { status: res.status(), body };
}
export async function apiPost(path, payload) {
  const res = await _need().request.post(API + path, { data: payload ?? {}, headers: { Accept: 'application/json' } });
  let body = null; try { body = await res.json(); } catch (_) {}
  return { status: res.status(), body };
}

// Back-compat for the one older script that wants a raw Cookie header. It is READ LIVE from the
// browser's own jar on every call and never cached, stored or logged — a PHPSESSID you kept is the
// 409 latch (playbook §A). Prefer apiGet/apiPost, which need no header at all.
export async function sess() {
  const cookies = await _need().cookies();
  return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}

export async function boot(dest = '/workorders', key = 'admin') {
  if (!(await wakeIfAsleep())) process.exit(3);
  const r = await bootBranch(BRANCH, dest, key);
  const { ctx, page } = r;
  _ctx = ctx;

  // 🛑 SLEEP GUARD, PART 2 — it can fall asleep mid-pass, so re-checkable from the caller.
  const asleep = async () => page.evaluate(() =>
    /Environment Sleeping|sleep\.qa\.shopview\.com/i.test(document.body?.innerText || '') ||
    location.host.startsWith('sleep.'));

  // `errs` is collected from HERE ON — errors thrown during the sign-in itself are reported by the
  // harness's own landing proof, not captured in this array.
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 180)));

  const feData = (await apiGet('/api/auth/me/fe-permissions')).body?.data ?? null;
  return { ...r, feData, errs, asleep, apiGet, apiPost, sess };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = process.argv[2] || '/workorders';
  const { browser, page, feData, api } = await boot(dest);
  // Judge the session by permission COUNT + template_slug, never by role.name (playbook §A).
  console.log('perms      :', feData?.fe_permissions?.length, '| template_slug:', feData?.template_slug,
    '| view_mode:', feData?.view_mode);
  console.log('landed url :', page.url());
  console.log('title      :', await page.title());
  const txt = await page.evaluate(() => document.body?.innerText || '');
  console.log('body chars :', txt.length);   // ~225 = the sign-in form; ~148 = Environment Sleeping
  console.log('first text :', JSON.stringify(txt.slice(0, 500)));
  console.log('api calls  :'); [...new Set(api)].slice(0, 15).forEach(x => console.log('   ' + x));
  fs.mkdirSync('build/invoice-ui-refresh/build-verify-2026-08-31/evidence', { recursive: true });
  await page.screenshot({ path: 'build/invoice-ui-refresh/build-verify-2026-08-31/evidence/pilot-landing.png' });
  await browser.close();
}
