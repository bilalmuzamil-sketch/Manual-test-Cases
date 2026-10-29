// F3 Sales Tax Collected independence runs, through the screen. Each run starts from a fresh page load (no URL query),
// sets Date Range (+ optional Invoice Status), searches each target number, reads See All Tax Rates. Rule 99 zones recorded.
// Usage: TZ=<zone> node screen_tax.mjs <hd|dvi> <ticket> '<targets csv>' '<runs json>'   SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com';
const LOC = { dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'], hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'] };
const [l, ticket, tcsv, runsJson] = process.argv.slice(2); const L3 = l; const [WP, TZ, LNAME] = LOC[l]; const targets = tcsv.split(',').filter(Boolean); const runs = JSON.parse(runsJson);
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/${ticket}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await f3boot(L3); // sets localStorage location + timezone (F4 trap, Rule 99)
let reqs = []; page.on('request', r => { const u = decodeURIComponent(r.url()); if (/\/api\/(reporting\/sales-tax|.*tax)/.test(u) && !/envelope/.test(u)) reqs.push(u.replace(/^.*?\/api/, '/api').slice(0, 400)); });
const meta = { ticket, location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), runs: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
meta.browser_now = await page.evaluate(() => new Date().toString());
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async loc => B(await loc.first().boundingBox().catch(() => null));
const rows = async () => page.locator('main tbody tr').evaluateAll(trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()));
const setRange = async r => {
  await page.locator('[data-test-id="filter_chip_range"]').click(); await page.waitForTimeout(1500);
  await page.locator(`[data-test-id="filter_preset_range_${r[0]}"]`).click(); await page.waitForTimeout(1200);
  if (r[0] === 'custom') { for (const [id, v] of [['date_input_range_start', r[1]], ['date_input_range_end', r[2]]]) { const f = page.locator(`[data-test-id="${id}"]`); await f.click({ clickCount: 3 }); await f.fill(v); await page.keyboard.press('Tab'); await page.waitForTimeout(800); }
    const ap = page.locator('.q-menu button').filter({ hasText: /Apply/i }); if (await ap.count()) await ap.first().click(); }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000); };
const setStatus = async s => { await page.locator('[data-test-id="filter_chip_statuses"]').click(); await page.waitForTimeout(1200);
  await page.locator('.q-menu').last().getByText(s, { exact: true }).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(7000); };
for (const run of runs) {
  reqs = []; const R = { spec: run };
  await page.goto(APP + '/reports/sales-tax/invoices', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
  R.loc_start = await assertLoc(page, LNAME, WP);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  if (run.range) await setRange(run.range);
  if (run.status) await setStatus(run.status);
  R.chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
  R.url = page.url(); R.rows_page1 = await rows(); R.bottom = await txt(page.locator('.q-table__bottom'));
  if (run.shot) { R.rowboxes = await page.locator('main tbody tr').evaluateAll(trs => trs.map(t => { const b = t.getBoundingClientRect(); return [t.innerText.replace(/\s+/g, ' ').slice(0, 40), Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; }));
    R.chipbox = { range: await box(page.locator('[data-test-id="filter_chip_range"]')), status: await box(page.locator('[data-test-id="filter_chip_statuses"]')) };
    await page.screenshot({ path: `${OUT}/${run.name}.png` }); }
  R.search = {};
  for (const t of targets) {
    await page.locator('main button').filter({ hasText: 'Search' }).first().click().catch(() => {}); await page.waitForTimeout(800);
    const si = page.locator('main input:visible').first(); await si.fill(t); await page.waitForTimeout(6000);
    R.search[t] = { rows: await rows(), empty: await txt(page.locator('main').getByText('No record', { exact: false })) };
    await si.fill(''); await page.waitForTimeout(4000);
  }
  if (run.rates) { await page.locator('button, a').filter({ hasText: 'See All Tax Rates' }).first().click(); await page.waitForTimeout(8000);
    R.rates_url = page.url(); R.rates = await page.locator('main tbody tr').evaluateAll(trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim())); }
  R.loc_end = await assertLoc(page, LNAME, WP); R.VALID = R.loc_start.ok && R.loc_end.ok;
  R.reqs = reqs; meta.runs[run.name] = R; fs.writeFileSync(`${OUT}/screen-meta.json`, JSON.stringify(meta, null, 1));
  console.log(run.name, 'VALID=' + R.VALID, JSON.stringify({ chips: R.chips, n: R.rows_page1.length, bottom: R.bottom, search: Object.fromEntries(Object.entries(R.search).map(([k, v]) => [k, v.rows.filter(x => x.includes(k)).join(' || ') || ('NONE ' + v.empty)])), rates: R.rates }).slice(0, 1500));
}
console.log(JSON.stringify({ v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, tz: meta.location_tz, key: meta.app_timezone_key }));
await browser.close();
