// Estimate date on the first N Estimate cards of a location's Work Orders board (Estimates tab), each in the location's own zone. Usage: LOC=leth N=2 TZ=America/Edmonton node est_date_board.mjs. Rule 99. SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const L = process.env.LOC || 'leth', N = +(process.env.N || 2);
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-11-03/estimate-date/board-${L}-2026-11-04`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot(L);
const meta = { location: LNAME, location_tz: TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, at_utc: new Date().toISOString(), local_now: new Date().toLocaleString('en-CA', { timeZone: TZ }), cards: [] };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
await page.goto('https://app.staging.shopview.com/workorders', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
meta.loc_start = await assertLoc(page, LNAME, WP);
const est = page.getByText('Estimates', { exact: true }).first(); if (await est.count()) { await est.click(); await page.waitForTimeout(8000); }
const nums = [...new Set((await page.locator('main').innerText()).match(/\bS\d-\d{4,6}\b/g) || [])].slice(0, N);
for (const wo of nums) {
  await page.goto('https://app.staging.shopview.com/workorders', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
  if (await est.count()) { await est.click(); await page.waitForTimeout(6000); }
  await page.getByText(wo, { exact: true }).first().click(); await page.waitForTimeout(8000);
  const m = page.url().match(/workorders\/([0-9a-f-]{36})/); const c = { wo, url: page.url() };
  if (m) { await page.goto(`https://app.staging.shopview.com/workorders/${m[1]}/finance`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000);
    const body = (await page.locator('main').innerText().catch(() => '')).split('\n').map(s => s.trim());
    c.lines = body.filter(s => /Estimate date|Invoice date|Started:/i.test(s)).slice(0, 4);
    await page.screenshot({ path: `${OUT}/${wo}-finance.png` }); }
  c.local_now = new Date().toLocaleString('en-CA', { timeZone: TZ }); meta.cards.push(c);
}
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok; meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ L, VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, key: meta.app_timezone_key, cards: meta.cards.map(c => [c.wo, c.local_now, c.lines]) }));
await browser.close();
