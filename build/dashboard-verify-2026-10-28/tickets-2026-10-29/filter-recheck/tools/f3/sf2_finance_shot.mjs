// SF2: Finance tab picture scrolled to the deposit lines (S1-38222, DVI Test). Rule 99 (America/Toronto). SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SF1/evening-2026-11-03';
const { browser, page, WP, TZ, LNAME } = await f3boot('dvi');
const meta = { location: LNAME, location_tz: TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString() };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
await page.goto('https://app.staging.shopview.com/workorders/3a8e11b5-c8dd-4506-8ee4-9e970fd70154/finance', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(11000);
meta.loc_start = await assertLoc(page, LNAME, WP);
const line = page.getByText('(Deposit) Nov 3, 2026 - Cash', { exact: true }).first();
await line.evaluate(el => el.scrollIntoView({ block: 'center' })); await page.waitForTimeout(1500);
const b = await line.boundingBox(); meta.line_box = b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
await page.screenshot({ path: `${OUT}/finance-deposit-lines.png` });
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok;
fs.writeFileSync(`${OUT}/finance-deposit-lines-meta.json`, JSON.stringify(meta, null, 1)); console.log(JSON.stringify({ VALID: meta.VALID, bz: meta.browser_zone, key: meta.app_timezone_key, box: meta.line_box }));
await browser.close();
