// Estimate date check (no ticket yet; related SV-12161): S1-38222 Finance tab, read "Estimate date" vs the Toronto date now. Rule 99. SECRET-FREE.
// Usage: TAG=<label> TZ=America/Toronto node est_date_check.mjs
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-11-03/estimate-date/${process.env.TAG || 'run'}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot('dvi');
const meta = { location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString(),
  toronto_now: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }) };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
meta.browser_now = await page.evaluate(() => new Date().toString());
await page.goto('https://app.staging.shopview.com/workorders/3a8e11b5-c8dd-4506-8ee4-9e970fd70154/finance', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(11000);
meta.loc_start = await assertLoc(page, LNAME, WP); meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
const body = (await page.locator('main').innerText()).split('\n').map(s => s.trim());
meta.estimate_lines = body.filter(s => /Estimate( date)?:|Estimate date|EST-S1-38222|Started:/i.test(s)).slice(0, 8);
const el = page.getByText('Estimate date:', { exact: false }).first(); const b = await el.boundingBox().catch(() => null);
meta.est_box = b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
await page.screenshot({ path: `${OUT}/finance-estimate.png` });
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok;
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, key: meta.app_timezone_key, toronto_now: meta.toronto_now, est: meta.estimate_lines, box: meta.est_box }));
await browser.close();
