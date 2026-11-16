// Create the ZZAUTOTEST customer on screen (Customers > New Customer). Logged. SECRET-FREE.
import fs from 'fs';
import { start, APP, LOC, netlog, call } from './common.mjs';
const NAME = process.argv[2] || 'ZZAUTOTEST RGWO Customer A';
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const net = []; netlog(page, net);
await page.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(5000);
await page.locator('[data-test-id="button_new_customer"]').click({ force: true }); await page.waitForTimeout(2000);
await page.locator('[data-test-id="input_customer_name"] input, input[data-test-id="input_customer_name"]').first().fill(NAME);
await page.locator('[data-test-id="input_customer_city"] input, input[data-test-id="input_customer_city"]').first().fill('Calgary');
await page.locator('[data-test-id="button_save_customer"]').click({ force: true }); await page.waitForTimeout(5000);
console.log('URL', page.url());
await page.screenshot({ path: '/tmp/cln/rgwo/cust-after.png' });
console.log(net.map(n => n.m + ' ' + n.u + ' ' + n.s + ' ' + n.resp.slice(0, 200)).join('\n'));
await browser.close();
