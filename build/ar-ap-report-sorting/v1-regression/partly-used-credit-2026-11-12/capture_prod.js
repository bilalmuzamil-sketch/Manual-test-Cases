// Production (old reports): A/R Aging Detail row of ZZAUTOTEST's partly used credit CM1-4414, and the customer's
// Invoices tab showing that credit's original amount and what is left. Signed in with /tmp/prod (one login, reused).
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = __dirname + '/shots'; const CUST = process.argv[2];
(async () => {
  const login = JSON.parse(fs.readFileSync('/tmp/prod/login-resp.json')); const perms = JSON.parse(fs.readFileSync('/tmp/prod/fe-perms.json'));
  const sess = JSON.parse(fs.readFileSync('/tmp/prod/session.json')).PHPSESSID;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: Number(process.env.W || 1440), height: 900 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true, timezoneId: 'Asia/Karachi' });
  await ctx.addCookies([{ name: 'PHPSESSID', value: sess, domain: '.shopview.com', path: '/', secure: true, httpOnly: true }]);
  await ctx.addInitScript(([u, p]) => { try { localStorage.setItem('user', JSON.stringify({ data: u })); localStorage.setItem('fe_permissions_wrapper', JSON.stringify(p)); } catch (e) {} }, [login.data, perms.data || perms]);
  const page = await ctx.newPage(); const notes = [];
  const ver = async () => (await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null));
  await page.goto('https://app.shopview.com/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 60000 }); await page.waitForTimeout(3000);
  notes.push('build ' + await ver(), 'as of: ' + (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' '));
  for (const t of await page.locator('[data-test-id^="button_aging_detail_report_toggle_"]').all()) { await t.click(); await page.waitForTimeout(1500); }
  await page.waitForTimeout(3000);
  const row = page.locator('tr', { hasText: 'CM1-4414' }).first();
  notes.push('report row: ' + (await row.innerText()).replace(/\s+/g, ' | '));
  const head = await page.locator('thead tr').first().innerText().catch(() => ''); notes.push('headings: ' + head.replace(/\s+/g, ' | '));
  await row.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, -300)); await page.waitForTimeout(600);
  await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
  await page.screenshot({ path: `${OUT}/prod-1-AR-Aging-Detail-CM1-4414-row.png` });
  await page.goto(`https://app.shopview.com/customers/${CUST}/invoices`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const cr = page.locator('tr', { hasText: '4414' }).first();
  notes.push('customer Invoices tab row: ' + ((await cr.count()) ? (await cr.innerText()).replace(/\s+/g, ' | ') : 'NOT FOUND'));
  if (await cr.count()) await cr.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
  await page.screenshot({ path: `${OUT}/prod-2-customer-Invoices-tab-CM1-4414.png` });
  notes.push('utc ' + new Date().toISOString());
  fs.writeFileSync(`${OUT}/prod-NOTES.txt`, notes.join('\n') + '\n'); console.log(notes.join('\n'));
  await browser.close();
})();
