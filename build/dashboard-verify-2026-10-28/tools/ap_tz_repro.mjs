// AP1 re-test with the BROWSER in the LOCATION's own time zone (QA lead, 28 Oct 2026). SECRET-FREE.
// node ap_tz_repro.mjs <tag> <workplaceId> <tz> <detail|unpaid> <day> '<rows json>' [vendorId]
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const [tag, WP, TZ, mode, day, rowsJson, vendorId] = process.argv.slice(2);
const APP = 'https://app.staging.shopview.com', OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/filed-2026-10-28/pictures';
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const path = mode === 'detail' ? '/reports/ap-aging-detail' : '/reports/ap-unpaid-invoices' + (vendorId ? `?vendorId=${vendorId}` : '');
await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(12000);
const browserTz = await page.evaluate(() => ({ tz: Intl.DateTimeFormat().resolvedOptions().timeZone, now: new Date().toString() }));
await page.getByText(/^Date:/).first().click(); await page.waitForTimeout(2500);
const menu = page.locator('.q-menu').last();
await menu.locator('button').filter({ hasText: new RegExp(`^${day}$`) }).first().click(); await page.waitForTimeout(10000);
const dateLabel = await page.getByText(/^Date:/).first().innerText().catch(() => '');
if (mode === 'unpaid') { await page.locator('tr').filter({ hasText: /\(\d+\)/ }).first().locator('i, button').first().click().catch(() => {}); await page.waitForTimeout(5000); }
if (mode === 'detail') { await page.locator('tr').filter({ hasText: 'Current (' }).first().getByText('arrow_drop_down').click().catch(() => {}); await page.waitForTimeout(3500); }
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const targets = JSON.parse(rowsJson);
const r0 = page.locator('tr').filter({ hasText: targets[0] }).first(); await r0.evaluate(el => el.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1200);
const meta = { tag, path, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, browser: browserTz, observed_at_utc: new Date().toISOString(), appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), url: page.url(), dateLabel, rows: {} };
for (const r of targets) { const row = page.locator('tr').filter({ hasText: r }).first(); meta.rows[r] = { box: B(await row.boundingBox().catch(() => null)), text: (await row.innerText().catch(() => '')).replace(/\s+/g, ' | ') }; }
meta.box_date = B(await page.getByText(/^Date:/).first().boundingBox().catch(() => null));
await page.screenshot({ path: `${OUT}/${tag}.png` });
fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ proc: [meta.process_TZ, meta.process_zone], tz: meta.browser, dateLabel, url: meta.url, ver: meta.appVersion, rows: Object.fromEntries(Object.entries(meta.rows).map(([k, v]) => [k, v.text])) }, null, 1));
await browser.close();
