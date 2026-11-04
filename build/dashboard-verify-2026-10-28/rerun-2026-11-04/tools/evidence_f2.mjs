// Evidence capture for finding F2 (Technician Efficiency counts a declined line). Captures at deviceScaleFactor 2
// for annotate_v2.py. SECRET-FREE (cookies via staging-boot2.mjs). Writes PNG + element boxes JSON to /tmp/cln/dv/ev/.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/dv/seed.json'));
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', APP = 'https://app.staging.shopview.com';
fs.mkdirSync('/tmp/cln/dv/ev', { recursive: true });
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); }, { u: { data: t.data }, f: fe.body?.data, w: WP });
const box = async sel => { const b = await page.locator(sel).first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const boxText = async (text, scope = 'body') => { const b = await page.locator(scope).getByText(text, { exact: false }).first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const meta = { appVersion: null, shots: {} };
// 1. Dashboard — Technician Efficiency and Billing Efficiency tiles, This Month (default)
await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="hero_value_techEfficiencyKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
await page.screenshot({ path: '/tmp/cln/dv/ev/f2-1-dashboard.png' });
meta.shots['f2-1-dashboard'] = { te_tile: await box('[data-test-id="hero_tile_techEfficiencyKpi"]'), te_value: await box('[data-test-id="hero_value_techEfficiencyKpi"]'), te_meta: await box('[data-test-id="hero_meta_techEfficiencyKpi"]'),
  be_tile: await box('[data-test-id="hero_tile_billingEfficiencyKpi"]'), be_meta: await box('[data-test-id="hero_meta_billingEfficiencyKpi"]'), loc: await boxText('DVI Test', 'header'),
  te_text: await page.locator('[data-test-id="hero_value_techEfficiencyKpi"]').innerText(), te_meta_text: await page.locator('[data-test-id="hero_meta_techEfficiencyKpi"]').innerText(),
  be_text: await page.locator('[data-test-id="hero_value_billingEfficiencyKpi"]').innerText(), be_meta_text: await page.locator('[data-test-id="hero_meta_billingEfficiencyKpi"]').innerText() };
// 2. Work order Lines tab — line 2 Declined
await page.goto(`${APP}/workorders/${S.wo_A1}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await page.screenshot({ path: '/tmp/cln/dv/ev/f2-2-lines.png' });
meta.shots['f2-2-lines'] = { declined: await boxText('Declined'), complete: await boxText('Complete', 'main'), body: (await page.locator('main').innerText().catch(() => '')).slice(0, 1500) };
// 3. Finance tab — the invoice lists one line
await page.goto(`${APP}/workorders/${S.wo_A1}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await page.screenshot({ path: '/tmp/cln/dv/ev/f2-3-invoice.png' });
meta.shots['f2-3-invoice'] = { labor_total: await boxText('Labor Total'), subtotal: await boxText('Subtotal') };
// 4. Technician Efficiency report, Invoiced tab, This Month
await page.goto(`${APP}/reports/technician-efficiency`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
await page.screenshot({ path: '/tmp/cln/dv/ev/f2-4-te-report.png' });
meta.shots['f2-4-te-report'] = { esther: await boxText('Esther Howard'), body: (await page.locator('main').innerText().catch(() => '')).slice(0, 2000) };
fs.writeFileSync('/tmp/cln/dv/ev/f2-meta.json', JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ v: meta.appVersion, te: meta.shots['f2-1-dashboard'].te_text, te_meta: meta.shots['f2-1-dashboard'].te_meta_text, be: meta.shots['f2-1-dashboard'].be_text, be_meta: meta.shots['f2-1-dashboard'].be_meta_text }));
await browser.close();
