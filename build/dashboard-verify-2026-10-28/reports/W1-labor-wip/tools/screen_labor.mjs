// Screen check (L1) for Technician Utilization, Timesheet Activities, Shop Efficiency and the hidden Payroll
// Timesheet page, at one location: visible text of table/footer + the API responses the page received,
// saved for comparison. Captures at deviceScaleFactor 2. SECRET-FREE (own login, nothing printed).
// Usage: node screen_labor.mjs <workplaceId> <timezone> <outDir>
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const [WP, TZ, OUT] = process.argv.slice(2);
const APP = 'https://app.staging.shopview.com';
fs.mkdirSync(OUT, { recursive: true });
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
const resp = [];
page.on('response', async r => { const u = r.url(); if (/technician-utilization|punch-clock|shop-billing|payroll-time/.test(u) && !u.includes('export')) { let b = null; try { b = await r.json(); } catch {} resp.push({ url: u.replace(/^.*\/api/, ''), status: r.status(), body: b }); } });
const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.clear(); localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const meta = { observed_at_utc: new Date().toISOString(), wp: WP, tz: TZ, pages: {} };
const PAGES = process.argv[5] ? process.argv[5].split(',') : ['tu', 'ta', 'se', 'pay'];
const ALLP = { tu: '/reports/technician-utilization', ta: '/reports/punch-clock-activities', se: '/reports/shop-billing-efficiency', pay: '/reports/payroll-timesheet' };
for (const [key, path] of PAGES.map(k => [k, ALLP[k]])) {
  const before = resp.length; const e0 = errs.length;
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(14000);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  const main = page.locator('main').first();
  const headers = (await page.locator('thead th').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim());
  const rows = [];
  for (const tr of (await page.locator('tbody tr').all()).slice(0, 60)) rows.push((await tr.innerText()).replace(/\s+/g, ' ').trim());
  meta.pages[key] = { url: page.url().replace(/^.*shopview.com/, ''), title: await page.title(), headers, rows,
    text: (await main.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 2500),
    notifications: (await page.locator('.q-notification').allInnerTexts().catch(() => [])).map(x => x.replace(/\n+/g, ' ')),
    consoleErrors: errs.slice(e0), responses: resp.slice(before).map(r => ({ url: r.url.slice(0, 300), status: r.status, summary: r.body?.data?.summary, totals: r.body?.data?.totals || r.body?.data?.metadata, n: r.body?.data?.collection?.length, err: r.body?.errors })) };
  const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
  meta.pages[key].boxes = {};
  const hdr = page.locator('thead th').filter({ hasText: /Utilization %|Total Hours|Efficiency/ }).first();
  meta.pages[key].boxes.header = B(await hdr.boundingBox({ timeout: 2000 }).catch(() => null));
  const sumRow = page.locator('tbody tr, tfoot tr').filter({ hasText: /^\s*(Summary|Totals)/ }).last();
  meta.pages[key].boxes.summary = B(await sumRow.boundingBox({ timeout: 2000 }).catch(() => null));
  const r1 = page.locator('tbody tr').filter({ hasText: process.argv[6] || '%' }).first();
  meta.pages[key].boxes.row = B(await r1.boundingBox({ timeout: 2000 }).catch(() => null));
  meta.pages[key].boxes.rowText = (await r1.innerText().catch(() => '')).replace(/\s+/g, ' ');
  await page.screenshot({ path: `${OUT}/${key}.png`, fullPage: false });
  console.log(key, meta.pages[key].url, 'rows', rows.length, 'resp', meta.pages[key].responses.map(r => r.status).join(','), 'errors', meta.pages[key].consoleErrors.length);
}
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
await browser.close();
