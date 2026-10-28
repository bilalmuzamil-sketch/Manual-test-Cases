// PV + IV screen checks at DVI Test (SECRET-FREE). Opens each report fresh (no saved view), records:
// default date label + the request it fires, the date option list, visible headers, tooltips, the seeded
// ZZAUTOTEST rows as rendered, and IV defaults/totals row. Shots in /tmp/cln/w3/shots.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w3/shots';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: 'America/Toronto' });
await page.evaluate(w => { localStorage.setItem('location', JSON.stringify(w)); for (const k of Object.keys(localStorage)) if (/velocity|inventory-value|inventoryValue|partsVelocity|report/i.test(k)) localStorage.removeItem(k); }, WP);
const R = { reqs: [] };
page.on('request', r => { const u = r.url(); if (/reports\/(parts-velocity|inventory-value)\?/.test(u)) R.reqs.push(decodeURIComponent(u.replace(/^.*\/api\//, ''))); });
R.appVersion = null;
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="table_parts_velocity"]', { timeout: 90000 }); await page.waitForTimeout(12000);
R.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
R.pv_headers = await page.locator('[data-test-id="table_parts_velocity"] thead th').allInnerTexts();
R.pv_filterbar = (await page.locator('.pv-filter-band').innerText().catch(() => '')).split('\n').filter(Boolean);
await page.screenshot({ path: `${OUT}/pv-01-default.png` });
// tooltips
for (const t of ['units_sold', 'demand']) { const el = page.locator(`[data-test-id="icon_pv_${t}_info"]`); R['tip_' + t] = await el.getAttribute('aria-label').catch(() => null); }
// date chip options
const chips = page.locator('.pv-filter-band button, .pv-filter-band [role="button"]');
R.chipTexts = await chips.allInnerTexts();
const dateChip = chips.filter({ hasText: /Last 90|days|Year|Month|Week|Today|Quarter|Custom/i }).first();
await dateChip.click(); await page.waitForTimeout(1500);
R.dateMenu = (await page.locator('.q-menu').last().innerText().catch(() => '')).split('\n').filter(Boolean);
await page.screenshot({ path: `${OUT}/pv-02-date-menu.png` });
// choose Today
const today = page.locator('.q-menu').last().getByText('Today', { exact: true }).first();
if (await today.count()) { await today.click(); await page.waitForTimeout(800); const ap = page.locator('.q-menu').last().getByText(/^Apply$/); if (await ap.count()) await ap.first().click(); }
await page.keyboard.press('Escape'); await page.waitForTimeout(8000);
// search
const s = page.locator('[data-test-id="input_report_search"], input[placeholder*="Search"]').first();
if (await s.count() === 0) { const mag = page.locator('[data-test-id*="search"]').first(); await mag.click().catch(() => {}); await page.waitForTimeout(800); }
await page.locator('input[placeholder*="Search"]').first().fill('ZZAUTOTEST').catch(e => R.searchErr = e.message.split('\n')[0]);
await page.waitForTimeout(9000);
R.pv_rows = (await page.locator('[data-test-id="table_parts_velocity"] tbody tr').allInnerTexts()).map(t => t.replace(/\s*\n\s*/g, ' | '));
R.pv_headers_after = await page.locator('[data-test-id="table_parts_velocity"] thead th').allInnerTexts();
await page.screenshot({ path: `${OUT}/pv-03-seeded-today.png` });
// IV
await page.goto(APP + '/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(14000);
R.iv_headers = await page.locator('table thead th').allInnerTexts();
R.iv_toolbar = (await page.locator('.q-page').first().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 40);
R.iv_rows = (await page.locator('table tbody tr').allInnerTexts()).map(t => t.replace(/\s*\n\s*/g, ' | ')).slice(0, 10);
R.iv_footer = (await page.locator('table tfoot tr, tr.totals-row, [data-test-id*="total"]').allInnerTexts().catch(() => [])).map(t => t.replace(/\s*\n\s*/g, ' | '));
await page.screenshot({ path: `${OUT}/iv-01-default.png`, fullPage: true });
fs.writeFileSync(`${OUT}/screen.json`, JSON.stringify(R, null, 1));
console.log(JSON.stringify(R, null, 1).slice(0, 6000));
await browser.close();
