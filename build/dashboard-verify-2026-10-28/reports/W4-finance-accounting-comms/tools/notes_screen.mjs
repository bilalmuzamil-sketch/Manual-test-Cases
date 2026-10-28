// W4: count the note cards the Notes Report and Reminders Report show on screen (Date Range = All), scroll to the end. SECRET-FREE.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', TZ = 'Asia/Karachi', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w4/ev';
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
const responses = [];
page.on('response', async r => { if (r.url().includes('/api/notes?')) { try { const j = await r.json(); responses.push({ url: decodeURIComponent(r.url()).slice(0, 400), n: j?.data?.notes?.length, pagination: j?.data?.pagination }); } catch {} } });
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const out = { observed_at_utc: new Date().toISOString() };
for (const [k, path] of [['notes_all', '/reports/notes-report?range=all'], ['notes_lastmonth', '/reports/notes-report?range=last_month']]) {
  responses.length = 0;
  await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(15000);
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 4000); await page.waitForTimeout(400); }
  await page.waitForTimeout(4000);
  out[k] = { cards: await page.locator('.note-item').count(), chips: (await page.locator('main').innerText().catch(() => '')).slice(0, 300).replace(/\s+/g, ' '), requests: [...responses] };
  await page.screenshot({ path: `${OUT}/${k}-bottom.png` });
}
out.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/notes-screen.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
