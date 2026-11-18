// 18 Nov 2026, Rule 125 production side: PRODUCTION (old reports), A/R Aging Detail as of TODAY, untouched, the
// production test account's partly used credit CM1-4414; then the customer's own Invoices tab. One login (/tmp/prod).
// Settings forced AND read back: browser time zone UTC, app time-zone setting (localStorage "timezone") "UTC".
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = __dirname + '/shots'; const CUST = 'e2ec979d-f856-43bd-92c7-99e2ba8a4bf7';
(async () => {
  const login = JSON.parse(fs.readFileSync('/tmp/prod/login-resp.json')); const perms = JSON.parse(fs.readFileSync('/tmp/prod/fe-perms.json'));
  const sess = JSON.parse(fs.readFileSync('/tmp/prod/session.json')).PHPSESSID;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: Number(process.env.W || 1440), height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: 'UTC' });
  await ctx.addCookies([{ name: 'PHPSESSID', value: sess, domain: '.shopview.com', path: '/', secure: true, httpOnly: true }]);
  await ctx.addInitScript(([u, p]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); localStorage.setItem('timezone', JSON.stringify('UTC')); } catch (e) {} }, [login.data, perms.data || perms]);
  await ctx.route(/\/api\/(logout|iam\/change-location)/, (r) => r.abort());
  const page = await ctx.newPage(); const n = {};
  await page.goto('https://app.shopview.com/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 90000 }); await page.waitForTimeout(3000);
  n.build = await page.locator('meta[name="app-version"]').getAttribute('content');
  n.as_of = (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' ');
  n.settings = await page.evaluate(() => ({ app_timezone_setting: localStorage.getItem('timezone'), selected_location: localStorage.getItem('location'), browser_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, browser_now: new Date().toString() }));
  n.top_right = (await page.locator('header').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(-60);
  for (const t of await page.locator('[data-test-id^="button_aging_detail_report_toggle_"]').all()) { await t.click(); await page.waitForTimeout(1500); }
  await page.waitForTimeout(3000);
  const row = page.locator('tr', { hasText: 'CM1-4414' }).first();
  n.headings = (await page.locator('thead tr').first().innerText()).replace(/\s+/g, ' | ');
  n.report_row = (await row.innerText()).replace(/\s+/g, ' | ');
  await row.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -300)); await page.waitForTimeout(600);
  await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
  await page.screenshot({ path: `${OUT}/prod-1-AR-Aging-Detail-CM1-4414.png` });
  await page.goto(`https://app.shopview.com/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(7000);
  const cr = page.locator('tr', { hasText: '4414' }).first();
  n.customer_page_row = (await cr.count()) ? (await cr.innerText()).replace(/\s+/g, ' | ') : 'NOT FOUND';
  n.customer_page_headings = (await page.locator('thead tr').first().innerText().catch(() => '')).replace(/\s+/g, ' | ');
  if (await cr.count()) await cr.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
  await page.screenshot({ path: `${OUT}/prod-2-customer-Invoices-tab-CM1-4414.png` });
  n.utc = new Date().toISOString();
  fs.writeFileSync(`${OUT}/prod-NOTES.json`, JSON.stringify(n, null, 1)); console.log(JSON.stringify(n, null, 1)); await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
