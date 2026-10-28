// W4 evidence capture (deviceScaleFactor 2). Usage: node evidence.mjs <tag> <workplaceId> <tz> <path> '<groups json>' '<rows json>'
// Opens the page as a fresh quick-login Admin, expands the named group rows, scrolls the first target
// row into view, screenshots, and records element boxes (in screenshot pixels) for annotate_v2.py. SECRET-FREE.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const [tag, WP, TZ, path, groupsJson, rowsJson] = process.argv.slice(2);
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w4/ev';
fs.mkdirSync(OUT, { recursive: true });
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
await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForTimeout(14000);
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const meta = { tag, path, observed_at_utc: new Date().toISOString(), appVersion: await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null), groups: {}, rows: {} };
for (const g of JSON.parse(groupsJson || '[]')) {
  const row = page.locator('tr').filter({ hasText: g }).first();
  await row.scrollIntoViewIfNeeded().catch(() => {});
  await row.getByText('arrow_drop_down').first().click().catch(() => {});
  await page.waitForTimeout(3000);
  meta.groups[g] = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
}
const targets = JSON.parse(rowsJson || '[]');
if (targets.length) { const r0 = page.locator('tr').filter({ hasText: targets[0] }).first(); await r0.evaluate(el => el.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1200); }
for (const r of targets) {
  const row = page.locator('tr').filter({ hasText: r }).first();
  meta.rows[r] = { box: B(await row.boundingBox().catch(() => null)), text: (await row.innerText().catch(() => '')).replace(/\s+/g, ' | ') };
}
for (const lbl of ['Date:', 'Past Due', 'Open Balance', 'Current (']) { meta['box_' + lbl] = B(await page.getByText(lbl).first().boundingBox().catch(() => null)); }
meta.header = (await page.locator('header').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
await page.screenshot({ path: `${OUT}/${tag}.png` });
fs.writeFileSync(`${OUT}/${tag}.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta, null, 1));
await browser.close();
