// Rule 12 screen check (16 Nov 2026): the NEW A/P Aging Detail, as of 11/12/2026, Vendor: Covina Truck Repair (vendorIds, read from
// useAgingReportFilters.ts), 91+ bucket opened, in a browser whose
// stored screen zone is Z (localStorage "timezone", as the SV-12663 handoff describes). Reads GNV306853's Due Date and
// Past Due as the user sees them, and the timezone= the screen sent. Read-only; logout/login/change-location blocked.
const path = require('path');
const { open, APP } = require(path.resolve(__dirname, '../../staging-after-feature-2026-11-12/scripts/stg.js'));
(async () => {
  const Z = process.argv[2]; const out = {};
  const { browser, ctx, page } = await open({ tz: Z });
  await ctx.addInitScript((z) => { try { localStorage.setItem('timezone', JSON.stringify(z)); } catch (e) {} }, Z);
  const sent = []; page.on('request', (r) => { if (/reporting\/reports\/ap-aging-detail/.test(r.url())) sent.push(r.url().replace(/^https:\/\/[^/]+/, '')); });
  await page.goto(`${APP}/reports/ap-aging-detail?asOfDate=2026-11-12&vendorIds=8ee34c14-ec5b-4298-8de2-75b682647dff`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=91 or more days past due', { timeout: 90000 }); await page.waitForTimeout(3000);
  out.build = await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content);
  out.storedZone = await page.evaluate(() => localStorage.getItem('timezone'));
  out.chip = (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' ');
  await page.locator('tr', { hasText: '91 or more days past due' }).first().locator('i, .q-icon, button').filter({ hasText: 'keyboard_arrow_right' }).first().click(); await page.waitForTimeout(6000);
  await page.screenshot({ path: `screen/debug-after-click-${Z.replace('/', '-')}.png` });
  out.firstRows = (await page.evaluate(() => [...document.querySelectorAll('table tr')].slice(0, 12).map((tr) => tr.innerText.replace(/\s+/g, ' | ')))); console.log(JSON.stringify(out, null, 1));
  const row = page.locator('tr', { hasText: 'GNV306853' }).first();
  await row.waitFor({ timeout: 20000 }); await row.scrollIntoViewIfNeeded();
  out.row = (await row.innerText()).replace(/\s+/g, ' | ');
  out.requests = sent.slice(0, 6); out.at = new Date().toISOString();
  await page.screenshot({ path: `screen/AP-Detail-GNV306853-${Z.replace('/', '-')}.png`, clip: await row.boundingBox().then(b => ({ x: 0, y: Math.max(0, b.y - 160), width: 1440, height: 260 })) });
  await page.screenshot({ path: `screen/AP-Detail-full-${Z.replace('/', '-')}.png` });
  console.log(JSON.stringify(out, null, 1)); await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
