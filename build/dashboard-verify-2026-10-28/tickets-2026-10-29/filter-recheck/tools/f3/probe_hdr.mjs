import { f3boot, assertLoc } from './f3boot.mjs';
const { browser, page, LNAME, WP } = await f3boot(process.argv[2]);
await page.goto('https://app.staging.shopview.com/reports/sales-tax/invoices', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
console.log(JSON.stringify(await assertLoc(page, LNAME, WP)));
console.log((await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 600));
await browser.close();
