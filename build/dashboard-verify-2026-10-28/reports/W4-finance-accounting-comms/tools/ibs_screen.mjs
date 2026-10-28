// W4: IBS Batches > Sent tab at Staging Lethbridge - 4310 — read each batch row and its expanded invoices. SECRET-FREE.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const WP = process.env.WP || 'f8a8b802-7780-4b16-bf10-343caeb616b2', TZ = process.env.TZ2 || 'America/Edmonton', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w4/ev';
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
await page.goto(APP + '/reports/batch-transactions', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(12000);
await page.getByRole('tab', { name: /Sent/ }).first().click().catch(async () => { await page.getByText('Sent', { exact: true }).first().click(); });
await page.waitForTimeout(6000);
const out = { appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), before: (await page.locator('main').innerText()).slice(0, 1500) };
await page.screenshot({ path: `${OUT}/ibs-sent-collapsed.png` });
// expand every batch row
const row = page.locator('tr').filter({ hasText: 'Oct 2, 2026' }).first();
await row.locator('button, .q-icon, i').first().click({ force: true }).catch(e => console.log('exp', e.message.split('\n')[0]));
await page.waitForTimeout(4000);
if (!(await page.getByText('S3-17282').count())) { await row.click().catch(() => {}); await page.waitForTimeout(4000); }
await page.waitForTimeout(3000);
out.after = (await page.locator('main').innerText()).slice(0, 4000);
await page.screenshot({ path: `${OUT}/ibs-sent-expanded.png`, fullPage: true });
fs.writeFileSync(`${OUT}/ibs-screen.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
