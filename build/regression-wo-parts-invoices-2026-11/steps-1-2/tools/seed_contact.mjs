// Add a contact to the ZZAUTOTEST customer on screen (needed: the New Work Order customer picker lists only customers with contacts). SECRET-FREE.
import { start, APP, LOC, netlog } from './common.mjs';
const CUST = process.argv[2] || 'ab32fdf2-4227-4a00-ab46-6a64c162959f';
const { browser, page } = await start({ workplaceId: LOC.id, timezone: LOC.tz });
const net = []; netlog(page, net);
await page.goto(APP + `/customers/${CUST}/work-orders`, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(5000);
await page.locator('[data-test-id="button_maintenance_customer_add_contact"]').click({ force: true }); await page.waitForTimeout(2000);
const f = async (id, v) => { await page.locator(`[data-test-id="${id}"] input, input[data-test-id="${id}"]`).first().fill(v); };
await f('input_first_name', 'ZZAUTOTEST'); await f('input_last_name', 'RGWO');
await page.locator('[data-test-id="button_confirm_dialog"]').click({ force: true }); await page.waitForTimeout(4000);
console.log(net.map(n => n.m + ' ' + n.u + ' ' + n.s + ' ' + n.resp.slice(0, 150)).join('\n'));
await browser.close();
