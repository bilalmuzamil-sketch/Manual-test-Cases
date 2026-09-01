// boot8218.mjs — SPA hydration for the Invoice Refresh QA branch sv8218.
//
// ADAPTED from build/testing-tools/staging-boot2.mjs (Rule 27 — reuse the proven pattern).
// Environment differences, all of them forced:
//   * hosts are sv8218.qa.shopview.com / sv8218api.qa.shopview.com (NO dot before `api`)
//   * the QA lead's cookies bootstrap it, then POST /api/quick-login {key:'admin'} mints the
//     real session — cookies alone are NOT enough: the SPA bounces to /login?redirect=… unless
//     localStorage carries user + token, and only quick-login returns those.
//   * chromium goes through the LOCAL MITM BRIDGE, never $HTTPS_PROXY directly.
//
// 🔴 quick-login ROTATES the shared PHPSESSID, so it evicts any other worker on this branch.
// The QA lead confirmed 2026-08-31 that nobody else is driving sv8218. Admin key is used first:
// a failed {key:'tech'} burns the session and everything then 409s (core §6.2).
//
// Hydration order is the proven one and it matters: seed cookies -> land on a light route on the
// app origin -> write localStorage -> only THEN navigate. The DEV login buttons are unreliable.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;

export const APP = 'https://sv8218.qa.shopview.com';
export const API = 'https://sv8218api.qa.shopview.com';
const SEED = fs.readFileSync('/tmp/qa-cookies/sv8218-cookie-header.txt', 'utf8').trim();
const PORT = () => fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();

// the live session cookie header — starts as the seed, replaced after quick-login
let SESS = SEED;
export const sess = () => SESS;

export async function apiGet(path) {
  const r = await fetch(API + path, { headers: { Cookie: SESS, Accept: 'application/json' } });
  let body = null; try { body = await r.json(); } catch (_) {}
  return { status: r.status, body };
}
export async function apiPost(path, payload) {
  const r = await fetch(API + path, {
    method: 'POST',
    headers: { Cookie: SESS, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload ?? {}),
  });
  let body = null; try { body = await r.json(); } catch (_) {}
  // capture a rotated PHPSESSID without ever logging its value
  const sc = r.headers.getSetCookie ? r.headers.getSetCookie() : [];
  for (const c of sc) {
    const m = /^PHPSESSID=([^;]+)/.exec(c);
    if (m) SESS = SESS.replace(/PHPSESSID=[^;]*/, `PHPSESSID=${m[1]}`);
  }
  return { status: r.status, body };
}

export async function quickLogin(key = 'admin') {
  const r = await apiPost('/api/quick-login', { key });
  if (r.status !== 200) return { ok: false, status: r.status, body: r.body };
  const d = r.body?.data || {};
  fs.writeFileSync('/tmp/qa-cookies/sv8218-live-session.txt', SESS, { mode: 0o600 });
  return { ok: true, token: d.token, role: d.role, details: d.details };
}

export async function boot(dest = '/workorders', key = 'admin') {
  const ql = await quickLogin(key);
  if (!ql.ok) { console.log(`quick-login {${key}} HTTP ${ql.status} — STOP`); process.exit(2); }
  const fe = await apiGet('/api/auth/me/fe-permissions');
  if (fe.status !== 200) { console.log('fe-permissions HTTP ' + fe.status); process.exit(2); }
  const feData = fe.body?.data;

  const cookies = SESS.split('; ').map(p => {
    const i = p.indexOf('=');
    return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/' };
  });

  const browser = await chromium.launch({
    executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true,
    proxy: { server: `http://127.0.0.1:${PORT()}` },
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 180)));

  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(({ u, f, t }) => {
    localStorage.setItem('user', JSON.stringify(u));
    if (f) localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
    if (t) localStorage.setItem('token', JSON.stringify(t));
  }, { u: { data: { token: ql.token, role: ql.role, details: ql.details } }, f: feData, t: ql.token });

  await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);

  // 🛑 SLEEP GUARD. sv8218 auto-sleeps and then EVERY route serves sleep.qa.shopview.com — a ~148
  // character page reading "Environment Sleeping". A run that does not check this reports every
  // field on every screen as absent, which is what happened on 2026-09-01 before the guard existed.
  // The API answers for a while after the SPA host sleeps, so quick-login succeeding proves nothing.
  const asleep = async () => page.evaluate(() =>
    /Environment Sleeping|sleep\.qa\.shopview\.com/i.test(document.body?.innerText || '') ||
    location.host.startsWith('sleep.'));
  if (await asleep()) {
    console.log('ENVIRONMENT ASLEEP — waking sv8218 and retrying');
    await fetch('https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'wake', env: 'sv8218' }),
    }).catch(() => {});
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(15000);
      await page.goto(APP + dest, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(3000);
      if (!(await asleep())) break;
    }
    if (await asleep()) { console.log('sv8218 still asleep after waking — STOP'); process.exit(3); }
    console.log('sv8218 awake, continuing');
  }
  return { browser, ctx, page, feData, errs, role: ql.role, asleep };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dest = process.argv[2] || '/workorders';
  const { browser, page, feData, errs, role } = await boot(dest);
  console.log('role       :', typeof role === 'object' ? JSON.stringify(role).slice(0, 80) : role);
  console.log('perms      :', feData?.fe_permissions?.length, '| view_mode:', feData?.view_mode);
  console.log('landed url :', page.url());
  console.log('title      :', await page.title());
  const txt = await page.evaluate(() => document.body?.innerText || '');
  console.log('body chars :', txt.length);
  console.log('first text :', JSON.stringify(txt.slice(0, 500)));
  if (errs.length) console.log('page errors:', errs.slice(0, 3));
  fs.mkdirSync('build/invoice-ui-refresh/build-verify-2026-08-31/evidence', { recursive: true });
  await page.screenshot({ path: 'build/invoice-ui-refresh/build-verify-2026-08-31/evidence/pilot-landing.png' });
  await browser.close();
}
