// Clean evidence for F2 (second reproduction, WO for "ZZAUTOTEST Dash F2", technician Fabian Bonjean, DVI Test).
// Captures at deviceScaleFactor 2 and records element boxes for annotate_v2.py. SECRET-FREE.
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/dv/seed.json')); const WO = S.F2.wo;
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/dv/ev2';
fs.mkdirSync(OUT, { recursive: true });
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
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async l => B(await l.first().boundingBox().catch(() => null));
const meta = { observed_at_utc: new Date().toISOString(), shots: {} };
// 1. Dashboard, Technician Efficiency expanded
await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="hero_value_techEfficiencyKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
await page.locator('[data-test-id="btn_toggle_details_techEfficiencyKpi"]').click(); await page.waitForTimeout(6000);
const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
const fabRow = panel.locator('tbody tr').filter({ hasText: 'Fabian Bonjean' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/1-dashboard.png`, fullPage: true });
meta.shots['1-dashboard'] = { tile: await box(page.locator('[data-test-id="hero_tile_techEfficiencyKpi"]')), value: await box(page.locator('[data-test-id="hero_value_techEfficiencyKpi"]')),
  meta: await box(page.locator('[data-test-id="hero_meta_techEfficiencyKpi"]')), pill: await box(page.locator('[data-test-id="hero_tile_techEfficiencyKpi"] [data-test-id*="hero_range_"]')),
  fabian: await box(fabRow), loc: await box(page.locator('header').getByText('DVI Test')),
  texts: { value: await page.locator('[data-test-id="hero_value_techEfficiencyKpi"]').innerText(), meta: await page.locator('[data-test-id="hero_meta_techEfficiencyKpi"]').innerText(), fabian: (await fabRow.first().innerText().catch(() => '')).replace(/\s+/g, ' ') } };
// 2. Work order lines
await page.goto(`${APP}/workorders/${WO}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await page.screenshot({ path: `${OUT}/2-lines.png` });
meta.shots['2-lines'] = { wo: await box(page.locator('text=/^S1-\\d+$/')), complete: await box(page.getByText('Complete', { exact: true }).nth(1)), declined: await box(page.getByText('Declined', { exact: true })),
  row1: await box(page.getByText('1.00 / 1.00')), row2: await box(page.getByText('0.50 / 1.00')), woNumber: await page.locator('text=/^S1-\\d+$/').first().innerText().catch(() => null) };
// 3. Finance / invoice
await page.goto(`${APP}/workorders/${WO}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await page.screenshot({ path: `${OUT}/3-invoice.png` });
meta.shots['3-invoice'] = { laborTotal: await box(page.getByText('Labor Total')), lineName: await box(page.getByText('Test DVI Line')), subtotal: await box(page.getByText('Subtotal', { exact: true })), status: await box(page.getByText(/^(Invoiced|Paid)$/)) };
// 4. Technician Efficiency report, This month, Fabian expanded
await page.goto(`${APP}/reports/technician-efficiency`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
const fr = page.getByText('Fabian Bonjean').first();
const exp = page.locator('tr, div').filter({ hasText: /^\s*expand_more\s*Fabian Bonjean/ }).last().getByText('expand_more').first();
await (await exp.count() ? exp : page.getByText('expand_more').nth(1)).click().catch(e => console.log('expand', e.message.split('\n')[0])); await page.waitForTimeout(4000);
await page.screenshot({ path: `${OUT}/4-report.png`, fullPage: true });
await page.screenshot({ path: `${OUT}/4-report.png` });
meta.shots['4-report'] = { fabian: await box(fr), date: await box(page.getByText(/Date:\s*This month/)), lines: await page.locator('main').innerText().then(x => x.slice(0, 2500)).catch(() => '') };
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(meta.appVersion, JSON.stringify(meta.shots['1-dashboard'].texts), meta.shots['2-lines'].woNumber);
await browser.close();
