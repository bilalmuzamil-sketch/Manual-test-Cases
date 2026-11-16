// LE A/P Unpaid Invoices, as of 2026-10-29, vendor 4Refuel: scroll the 173-row group until bill 976974 is on screen.
import { boot, LOC, APP, sleep, rule99, save } from '../report-gaps-2026-11-16/tools/sboot.mjs';
const loc = LOC.LE; const EV = new URL('./', import.meta.url).pathname; const prev = JSON.parse((await import('fs')).readFileSync(EV + 'retest-LE.json', 'utf8'));
const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } }); const out = { start: await rule99(page, loc) };
await page.goto(`${APP}/reports/ap-unpaid-invoices?asOfDate=2026-10-29&locationIds=${loc.id}&vendorIds=${prev.example_vendorId}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(8000);
const grp = page.locator('tr', { hasText: '4Refuel (' }).first(); const open = await page.getByText('976974', { exact: true }).count();
if (!(await page.locator('tbody tr', { hasText: 'Invoice' }).count())) { await grp.locator('.q-icon, i, button').first().click().catch(() => grp.click()); await sleep(6000); }
await page.getByText('Date', { exact: true }).first().click().catch(() => {}); await sleep(7000);
if (!(await page.locator('tbody tr', { hasText: 'Invoice' }).count())) { await page.locator('tr', { hasText: '4Refuel (' }).first().locator('.q-icon, i, button').first().click().catch(() => {}); await sleep(6000); }
out.sorted = await page.locator('thead th', { hasText: 'Date' }).first().getAttribute('aria-sort'); await page.mouse.move(900, 500);
for (let i = 0; i < 120; i++) { const t = page.getByText('976974', { exact: true }); if (await t.count() && await t.first().isVisible()) break; await page.mouse.wheel(0, 600); await sleep(500); }
const row = page.locator('tr', { has: page.getByText('976974', { exact: true }) }).first();
out.row = (await row.count()) ? (await row.innerText()).replace(/\s+/g, ' ').trim() : 'row not found';
if (await row.count()) { await row.scrollIntoViewIfNeeded(); await sleep(800); out.box = await row.boundingBox(); }
await page.screenshot({ path: EV + 'screen-LE-unpaid.png' }); out.end = await rule99(page, loc); save(EV + 'unpaid-LE-scroll.json', out); await browser.close(); console.log(out.row, JSON.stringify(out.box));
