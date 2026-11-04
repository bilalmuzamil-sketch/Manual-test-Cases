// Read-only: which date range the Dashboard tiles land on after a fresh load (Heavy Duty, Asia/Karachi, Rule 99). SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/f3boot.mjs';
const { browser, page, WP, TZ, LNAME } = await f3boot('hd');
const reqs = []; page.on('request', r => { if (r.url().includes('/api/dashboard/reports')) reqs.push(decodeURIComponent(r.url()).replace(/^.*\/api/, '/api')); });
await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="hero_value_techEfficiencyKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
const out = { at_utc: new Date().toISOString(), rule99: { location: LNAME, location_tz: TZ, process_TZ: process.env.TZ, browser_zone: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), ls_timezone: await page.evaluate(() => localStorage.getItem('timezone')) }, loc: await assertLoc(page, LNAME, WP), tiles: {} };
for (const k of ['techEfficiencyKpi', 'techUtilizationKpi', 'billingEfficiencyKpi']) out.tiles[k] = { value: await page.locator(`[data-test-id="hero_value_${k}"]`).innerText().catch(() => null), range: (await page.locator(`[data-test-id="hero_tile_${k}"]`).innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160) };
out.dashboard_requests = [...new Set(reqs.map(u => (u.match(/from=[^&]+&to=[^&]+/) || [u])[0]))];
fs.writeFileSync('/tmp/cln/s3/tile_ranges.json', JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 2500));
await browser.close();
