// boot.mjs — drive the sv8785 (Filters) QA branch with the SUPPLIED cookies only.
// NEVER calls quick-login or switch-user (a sibling worker shares the token).
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pw;
export const APP = 'https://sv8785.qa.shopview.com';
export const API = 'https://sv8785api.qa.shopview.com';
const COOKIE = fs.readFileSync('/tmp/qa-cookies/filters-cookie-header.txt', 'utf8').trim();

export async function apiGet(path) {
  const r = await fetch(API + path, { headers: { Cookie: COOKIE, Accept: 'application/json' } });
  let b; try { b = await r.json(); } catch { b = await r.text(); }
  return { status: r.status, body: b };
}

export async function boot(opts = {}) {
  const fe = await apiGet('/api/auth/me/fe-permissions');
  if (fe.status !== 200) { console.log('SESSION_DEAD', fe.status, JSON.stringify(fe.body).slice(0, 200)); process.exit(2); }
  const cookies = COOKIE.split('; ').map(p => {
    const i = p.indexOf('='); return { name: p.slice(0, i).trim(), value: p.slice(i + 1), domain: '.qa.shopview.com', path: '/' };
  });
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    headless: true, proxy: { server: process.env.HTTPS_PROXY },
    args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'],
  });
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 1600, height: 1000 },
    ignoreHTTPSErrors: true,
    ...(opts.mobile ? { isMobile: true, hasTouch: true, deviceScaleFactor: 3 } : {}),
  });
  await ctx.addCookies(cookies);
  const page = await ctx.newPage();
  // hydrate localStorage the way the SPA does after sign-in (NO quick-login called)
  const user = JSON.parse(fs.readFileSync('/tmp/fv/user.json', 'utf8'));
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(({ u, f }) => {
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f));
  }, { u: user, f: fe.body.data });
  await page.waitForTimeout(400);
  const reqs = [];
  page.on('request', r => { if (r.url().includes('/api/')) reqs.push(r.method() + ' ' + r.url()); });
  return { browser, ctx, page, feData: fe.body.data, reqs };
}

export async function go(page, path, wait = 6000) {
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(wait);
  return page.url();
}
