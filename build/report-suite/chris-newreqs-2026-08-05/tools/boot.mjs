// boot.mjs — hydrate Chromium against the Report Suite QA branch WITHOUT calling quick-login.
// The shared sv_sso_session must not be rotated (coordinator's instruction), so this uses the
// supplied raw cookies only. SECRET-FREE: values are read from /tmp/rs-viu/cookies.json at runtime.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const c = JSON.parse(fs.readFileSync('/tmp/rs-viu/cookies.json', 'utf8'));
export const APP = 'https://sv8582.qa.shopview.com';
export const API = 'https://sv8582api.qa.shopview.com';
export const COOKIE = `sv_sso_session=${c.sv_sso_session}; PHPSESSID=${c.PHPSESSID}; cf_clearance=${c.cf_clearance}`;

export async function api(method, path, body) {
  const r = await fetch(API + path, { method, redirect: 'manual',
    headers: { Cookie: COOKIE, Accept: 'application/json', 'Content-Type': 'application/json',
      Origin: APP, Referer: APP + '/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/147.0.0.0 Safari/537.36' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch {}
  return { status: r.status, body: j ?? t };
}

export async function boot(opts = {}) {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true,
    proxy: { server: process.env.HTTPS_PROXY },
    args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1680, height: 1050 }, ignoreHTTPSErrors: true });
  await ctx.addCookies(['sv_sso_session', 'PHPSESSID', 'cf_clearance'].map(n => ({ name: n, value: c[n], domain: '.qa.shopview.com', path: '/' })));
  const page = await ctx.newPage();
  const netlog = [];
  page.on('response', r => { const u = r.url(); if (u.includes('/api/')) netlog.push({ status: r.status(), method: r.request().method(), url: u }); });
  // Hydrate localStorage from the LIVE session (never fabricated): the SPA needs fe_permissions_wrapper.
  const fe = await api('GET', '/api/auth/me/fe-permissions');
  if (fe.status !== 200) { console.log('FE_PERMS_FAILED', fe.status); process.exit(2); }
  await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(f => localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)), fe.body.data);
  await page.waitForTimeout(400);
  return { browser, ctx, page, netlog, feData: fe.body.data };
}
export async function spaGo(page, path, waitMs = 9000) {
  await page.evaluate(p => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')); }, path);
  await page.waitForTimeout(waitMs); return page.url();
}
