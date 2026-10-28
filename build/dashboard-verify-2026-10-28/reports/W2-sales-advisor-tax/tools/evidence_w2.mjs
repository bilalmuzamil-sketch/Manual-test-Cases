// W2 evidence captures (deviceScaleFactor 2) with element boxes for annotate_v2.py. SECRET-FREE.
//  A. Sales By Representative, DVI Test, This month, Show Unassigned on, Unassigned expanded -> same-day row order
//  B. Sales By Customer, Heavy Duty, This month -> TestVT1 row Margin % next to Margin / Subtotal / Shop Supplies
//  C. Follow Up (/reports/sales-follow-up), DVI Test -> what the screen shows when the server fails
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w2/ev2'; fs.mkdirSync(OUT, { recursive: true });
const which = process.argv[2] || 'A';
const LOC = { A: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'], B: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'], C: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'] };
const [WP, TZ] = LOC[which];
const t = await login('admin');
await api(t.sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP, workplace_timezone: TZ });
const fe = await api(t.sessCookie, 'GET', '/api/auth/me/fe-permissions');
const cookies = t.sessCookie.split('; ').map(p => { const i = p.indexOf('='); return { name: p.slice(0, i), value: p.slice(i + 1), domain: '.staging.shopview.com', path: '/' }; });
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: process.env.HTTPS_PROXY }, args: ['--no-sandbox', '--ignore-certificate-errors', '--ssl-version-max=tls1.2'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: TZ });
await ctx.addCookies(cookies);
const page = await ctx.newPage();
const net = []; page.on('response', r => { if (r.url().includes('/api/reporting')) net.push(r.status() + ' ' + decodeURIComponent(r.url().replace('https://api.staging.shopview.com', '')).slice(0, 300)); });
await page.goto(APP + '/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.evaluate(({ u, f, w, z }) => { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(f)); if (u.data?.token) localStorage.setItem('token', JSON.stringify(u.data.token)); localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, { u: { data: t.data }, f: fe.body?.data, w: WP, z: TZ });
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async l => B(await l.first().boundingBox().catch(() => null));
const meta = { which, observed_at_utc: new Date().toISOString() };
if (which === 'A') {
  await page.goto(APP + '/reports/sales-by-representative', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
  await page.locator('[data-test-id="filter_chip_showUnassigned"]').click(); await page.waitForTimeout(5000);
  await page.locator('[data-test-id="button_sbr_expand_rep_00000000-0000-0000-0000-000000000000"]').click(); await page.waitForTimeout(6000);
  await page.screenshot({ path: `${OUT}/A-sbr-order.png` });
  const rows = page.locator('[data-test-id^="text_sbr_invoice_"], [data-test-id^="link_sbr_invoice_"]');
  meta.invoices = []; for (let i = 0; i < await rows.count(); i++) { const r = rows.nth(i); const tr = r.locator('xpath=ancestor::tr[1]'); meta.invoices.push({ text: (await tr.innerText()).replace(/\s+/g, ' ').slice(0, 160), box: await box(tr) }); }
  meta.chip = await box(page.locator('[data-test-id="filter_chip_dateRange"]'));
  meta.unassigned = await box(page.locator('[data-test-id="button_sbr_expand_rep_00000000-0000-0000-0000-000000000000"]').locator('xpath=ancestor::tr[1]'));
}
if (which === 'B') {
  await page.goto(APP + '/reports/sales-by-customer', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  await page.locator('[data-test-id="filter_chip_customerIds"]').click(); await page.waitForTimeout(1500);
  await page.keyboard.type('TestVT1'); await page.waitForTimeout(3500);
  await page.locator('.q-menu').last().getByText('TestVT1', { exact: true }).first().click().catch(e => console.log('pick', e.message.split('\n')[0]));
  await page.waitForTimeout(1000); await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
  const row = page.locator('tbody tr').filter({ hasText: 'TestVT1' }).first();
  await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/B-sbc-margin.png` });
  meta.row = { text: (await row.innerText().catch(() => '')).replace(/\s+/g, ' '), box: await box(row) };
  meta.header = (await page.locator('thead tr').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  meta.headerBox = await box(page.locator('thead tr').first());
  const cells = row.locator('td'); meta.cells = []; for (let i = 0; i < await cells.count(); i++) meta.cells.push({ t: (await cells.nth(i).innerText()).trim(), box: await box(cells.nth(i)) });
  const tot = page.locator('[data-test-id="row_sbc_totals"]'); meta.totals = (await tot.innerText().catch(() => '')).replace(/\s+/g, ' '); meta.totalsBox = await box(tot);
}
if (which === 'C') {
  await page.goto(APP + '/reports/sales-follow-up', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  await page.screenshot({ path: `${OUT}/C-followup.png` });
  meta.main = (await page.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 800);
  meta.toast = (await page.locator('.q-notification').allInnerTexts().catch(() => [])).join(' | ');
  meta.toastBox = await box(page.locator('.q-notification'));
  meta.mainBox = await box(page.locator('main'));
}
meta.net = net; meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/${which}-meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta).slice(0, 2500));
await browser.close();
