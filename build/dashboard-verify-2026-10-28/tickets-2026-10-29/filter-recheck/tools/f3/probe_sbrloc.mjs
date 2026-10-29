import { f3boot, assertLoc } from './f3boot.mjs';
const { browser, page, LNAME, WP } = await f3boot('dvi');
await page.goto('https://app.staging.shopview.com/reports/sales-by-representative', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
await page.locator('[data-test-id="filter_chip_locationIds"]').click(); await page.waitForTimeout(2000);
console.log((await page.locator('.q-menu').last().innerText()).replace(/\n+/g, ' | '));
console.log(JSON.stringify(await page.locator('.q-menu').last().locator('[data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')))));
console.log(JSON.stringify(await assertLoc(page, LNAME, WP)).slice(0, 80));
await browser.close();
