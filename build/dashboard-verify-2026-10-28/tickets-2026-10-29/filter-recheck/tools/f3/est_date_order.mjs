// Estimate date on a work order opened by its /order/<uuid> link, then the Finance tab. Usage: LOC=hd ID=<uuid> WO=S2-33740 TZ=Asia/Karachi node est_date_order.mjs. Rule 99. SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const L = process.env.LOC || 'hd', WO = process.env.WO, ID = process.env.ID;
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-11-03/estimate-date/${WO}-2026-11-04`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot(L);
const meta = { wo: WO, id: ID, location: LNAME, location_tz: TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString(), local_now: new Date().toLocaleString('en-CA', { timeZone: TZ }) };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
await page.goto(`https://app.staging.shopview.com/order/${ID}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
meta.loc_start = await assertLoc(page, LNAME, WP); meta.url1 = page.url();
await page.screenshot({ path: `${OUT}/order.png` });
const link = page.getByText(WO, { exact: false }).first(); const [pop] = await Promise.all([page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null), link.click()]);
const tgt = pop || page; await tgt.waitForTimeout(9000); meta.wo_url = tgt.url(); const mm = meta.wo_url.match(/workorders\/([0-9a-f-]{36})/);
if (mm) { await page.goto(`https://app.staging.shopview.com/workorders/${mm[1]}/finance`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(11000); }
const fin = page.getByText('__none__', { exact: true }).first(); if (await fin.count()) { await fin.click(); await page.waitForTimeout(9000); }
meta.url2 = page.url();
const body = (await page.locator('main').innerText().catch(() => '')).split('\n').map(s => s.trim());
meta.lines = body.filter(s => /Estimate date|^EST-|Invoice date|^INV-|Started:/i.test(s)).slice(0, 10);
const el = page.getByText('Estimate date:', { exact: false }).first(); const b = await el.boundingBox().catch(() => null);
meta.est_box = b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
await page.screenshot({ path: `${OUT}/finance.png` });
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok; meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, key: meta.app_timezone_key, local_now: meta.local_now, url1: meta.url1.slice(-70), url2: meta.url2.slice(-70), lines: meta.lines, box: meta.est_box }));
await browser.close();
