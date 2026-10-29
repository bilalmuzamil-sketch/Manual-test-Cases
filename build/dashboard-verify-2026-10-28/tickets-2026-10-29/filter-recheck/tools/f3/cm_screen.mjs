// SV-11949 follow-up: confirm CM2-4523 (and CM2-4520) on screen at Staging Heavy Duty - 9919 (Karachi) - customer TestVT1 Invoices tab with
// Open only OFF + search, then open the credit memo; then re-read This-month All Tax Rates. Rule 99 + location key + header check. SECRET-FREE.
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SV-11949-followup'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page, WP, TZ, LNAME } = await f3boot('hd');
const meta = { location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), reads: {}, shots: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone); meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const go = async (p, w = 11000) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(w); meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
await go('/dashboard', 6000); meta.loc_start = await assertLoc(page, LNAME, WP);
for (const [cid, cname, cm] of [['1c385fee-d4cc-46f4-b20a-b8e01987e0ff', 'TestVT1', 'CM2-4523'], ['3bffe815-a953-450d-9674-bca2e905bb42', 'Testing Company Milos', 'CM2-4520']]) {
  await go(`/customers/${cid}/invoices`, 12000);
  const tog = page.locator('[data-test-id="toggle_filter_open_invoices"]'); const before = await tog.getAttribute('aria-checked').catch(() => null);
  if (before === 'true') { await tog.click(); await page.waitForTimeout(7000); }
  await page.locator('[data-test-id="page_search_toggle"]').click().catch(() => {}); await page.waitForTimeout(800);
  const si = page.locator('main input:visible').first(); await si.fill(cm).catch(() => {}); await page.waitForTimeout(7000);
  const row = page.locator('main tbody tr').filter({ hasText: cm }).first();
  const R = { open_only_before: before, open_only_after: await tog.getAttribute('aria-checked').catch(() => null), heads: await page.locator('main thead th').allInnerTexts().catch(() => []), row: (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').trim(), rowbox: B(await row.boundingBox().catch(() => null)) };
  await page.screenshot({ path: `${OUT}/${cm}-invoices-tab.png` }); meta.shots[`${cm}-invoices-tab`] = { row: R.rowbox, toggle: B(await tog.boundingBox().catch(() => null)), search: B(await si.boundingBox().catch(() => null)) };
  // open the credit memo itself
  const link = row.locator('a, .cursor-pointer, [data-test-id*="link"]').filter({ hasText: cm }).first();
  const pages0 = page.context().pages().length;
  await link.click().catch(async () => { await row.getByText(cm).first().click().catch(() => {}); }); await page.waitForTimeout(8000);
  const tgt = page.context().pages().length > pages0 ? page.context().pages().at(-1) : page;
  await tgt.waitForTimeout(3000);
  R.opened_url = tgt.url(); R.dialog = (await tgt.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 1200);
  R.main = (await tgt.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 1500);
  await tgt.screenshot({ path: `${OUT}/${cm}-opened.png` }).catch(() => {});
  meta.reads[cm] = R; save();
  if (tgt !== page) await tgt.close().catch(() => {});
}
await go('/reports/sales-tax/invoices', 10000);
meta.reads.tax_chip = (await page.locator('[data-test-id="filter_chip_range"]').innerText()).replace(/\s+/g, ' ');
await page.locator('button, a').filter({ hasText: 'See All Tax Rates' }).first().click(); await page.waitForTimeout(9000);
meta.reads.rates = await page.locator('main tbody tr').evaluateAll(trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()));
meta.reads.rates_at_karachi = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Karachi' }); meta.reads.rates_at_utc = new Date().toISOString();
await page.screenshot({ path: `${OUT}/all-tax-rates-this-month.png` });
meta.loc_end = await assertLoc(page, LNAME, WP); meta.VALID = meta.loc_start.ok && meta.loc_end.ok; save();
console.log(JSON.stringify({ VALID: meta.VALID, v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, key: meta.app_timezone_key, reads: meta.reads }).slice(0, 6000));
await browser.close();
