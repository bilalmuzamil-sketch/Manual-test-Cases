// Estimate date on another location's work order (no ticket yet; related SV-12161). Usage: LOC=hd TZ=Asia/Karachi node est_date_other.mjs. Rule 99. SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const L = process.env.LOC || 'hd';
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-11-03/estimate-date/other-${L}-2026-11-04`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot(L);
const meta = { location: LNAME, location_tz: TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString(), local_now: new Date().toLocaleString('en-CA', { timeZone: TZ }) };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
await page.goto('https://app.staging.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
meta.loc_start = await assertLoc(page, LNAME, WP);
const rows = page.locator('main tbody tr'); const n = await rows.count(); meta.list_rows = n; meta.tried = [];
for (let i = 0; i < Math.min(n, 12); i++) {
  const t = (await rows.nth(i).innerText()).replace(/\s+/g, ' ');
  if (/invoic|paid|closed/i.test(t)) { meta.tried.push({ i, skip: t.slice(0, 120) }); continue; }
  await rows.nth(i).click(); await page.waitForTimeout(8000);
  const u = page.url(); const m = u.match(/workorders\/([0-9a-f-]{36})/); if (!m) { meta.tried.push({ i, url: u }); await page.goBack(); await page.waitForTimeout(6000); continue; }
  await page.goto(`https://app.staging.shopview.com/workorders/${m[1]}/finance`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000);
  const body = (await page.locator('main').innerText()).split('\n').map(s => s.trim());
  const est = body.filter(s => /Estimate date|^Estimate:|^EST-|Invoice date|^INV-/i.test(s));
  meta.tried.push({ i, wo: m[1], row: t.slice(0, 120), est });
  if (est.some(s => /Estimate date/.test(s))) { meta.found = { wo: m[1], row: t.slice(0, 160), est }; await page.screenshot({ path: `${OUT}/finance-estimate.png` }); break; }
  await page.goto('https://app.staging.shopview.com/workorders', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
}
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok;
meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, key: meta.app_timezone_key, local_now: meta.local_now, found: meta.found, tried: meta.tried.length }));
await browser.close();
