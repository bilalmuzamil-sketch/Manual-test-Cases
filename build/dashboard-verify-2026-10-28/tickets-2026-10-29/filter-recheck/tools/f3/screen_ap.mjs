// F3 A/P (SV-11922) and A/R (SV-11935) screen runs. run = {name, path, day?(calendar day number in current month), query?, open?('Current'), rows:[...], shot?}
// Usage: TZ=<zone> node screen_ap.mjs <leth|hd|dvi> <ticket> '<runs json>'   SECRET-FREE. Rule 99 zones recorded.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const LOC = { dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'], hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], leth: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'] };
const [l, ticket, runsJson] = process.argv.slice(2); const [WP, TZ, LNAME] = LOC[l]; const runs = JSON.parse(runsJson);
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/${ticket}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ } });
let reqs = []; page.on('request', r => { const u = decodeURIComponent(r.url()); if (/account-(payable|receivable)|vendor/.test(u) && !/envelope/.test(u)) reqs.push(u.replace(/^.*?\/api/, '/api').slice(0, 400)); });
const meta = { ticket, location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), runs: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone')); meta.browser_now = await page.evaluate(() => new Date().toString());
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
for (const run of runs) {
  reqs = []; const R = { spec: run };
  await page.goto(APP + run.path + (run.query || ''), { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  if (run.day) { await page.locator('[data-test-id="filter_chip_asOfDate"]').click(); await page.waitForTimeout(2500);
    await page.locator('.q-menu').last().locator('button').filter({ hasText: new RegExp(`^${run.day}$`) }).first().click(); await page.waitForTimeout(10000); }
  if (run.open) { await page.locator('tr').filter({ hasText: run.open + ' (' }).first().getByText('arrow_drop_down').click().catch(() => {}); await page.waitForTimeout(4000); }
  if (run.expandVendors) { const vs = page.locator('tr').filter({ hasText: /\(\d+\)/ }); const n = Math.min(await vs.count(), 40);
    for (let i = 0; i < n; i++) { await vs.nth(i).locator('i, button').first().click().catch(() => {}); await page.waitForTimeout(600); } await page.waitForTimeout(5000); }
  R.chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + ' = ' + e.innerText.replace(/\s+/g, ' ').trim()));
  R.url = page.url(); R.rows = {};
  for (const r of run.rows) { const row = page.locator('tr').filter({ hasText: r }).first(); if (run.shot && r === run.rows[0]) { await row.evaluate(el => el.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1200); }
    R.rows[r] = { text: (await row.innerText({ timeout: 3000 }).catch(() => '')).replace(/\s+/g, ' ') }; }
  if (run.shot) { for (const r of run.rows) R.rows[r].box = B(await page.locator('tr').filter({ hasText: r }).first().boundingBox().catch(() => null));
    R.chipboxes = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => { const b = e.getBoundingClientRect(); return [e.getAttribute('data-test-id'), Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; }));
    R.heads = await page.locator('thead th').evaluateAll(es => es.map(e => { const b = e.getBoundingClientRect(); return [e.innerText.trim(), Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; }));
    await page.screenshot({ path: `${OUT}/${run.name}.png` }); }
  R.reqs = reqs; meta.runs[run.name] = R; fs.writeFileSync(`${OUT}/screen-meta.json`, JSON.stringify(meta, null, 1));
  console.log(run.name, JSON.stringify({ chips: R.chips, url: R.url.replace(APP, ''), rows: Object.fromEntries(Object.entries(R.rows).map(([k, v]) => [k, v.text.slice(0, 150)])), reqs: reqs.slice(0, 3) }).slice(0, 1600));
}
console.log(JSON.stringify({ v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, tz: meta.location_tz, key: meta.app_timezone_key }));
await browser.close();
