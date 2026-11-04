// Estimate date on a named work order found through the app's search box. Usage: LOC=hd WO=S2-33740 TZ=Asia/Karachi node est_date_wo.mjs. Rule 99. SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const L = process.env.LOC || 'hd', WO = process.env.WO;
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-11-03/estimate-date/${WO}-2026-11-04`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot(L);
const meta = { wo: WO, location: LNAME, location_tz: TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString(), local_now: new Date().toLocaleString('en-CA', { timeZone: TZ }) };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(8000);
meta.loc_start = await assertLoc(page, LNAME, WP);
await page.getByText('Search customers, work orders', { exact: false }).first().click(); await page.waitForTimeout(1500);
await page.keyboard.type(WO, { delay: 60 }); await page.waitForTimeout(6000);
await page.getByText(WO, { exact: false }).last().click(); await page.waitForTimeout(9000);
meta.url = page.url(); const m = meta.url.match(/(?:workorders|order)\/([0-9a-f-]{36})/);
if (m) { await page.goto(`https://app.staging.shopview.com/workorders/${m[1]}/finance`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000); }
const body = (await page.locator('main').innerText().catch(() => '')).split('\n').map(s => s.trim());
meta.lines = body.filter(s => /Estimate date|^EST-|Invoice date|^INV-|Started:|Approved|Invoiced/i.test(s)).slice(0, 10);
await page.screenshot({ path: `${OUT}/finance.png` });
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok; meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, key: meta.app_timezone_key, local_now: meta.local_now, url: meta.url.slice(-60), lines: meta.lines }));
await browser.close();
