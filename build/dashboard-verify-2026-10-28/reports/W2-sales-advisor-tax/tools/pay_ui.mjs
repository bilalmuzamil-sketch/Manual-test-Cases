// Take a payment of a given amount on a work order's Finance tab, through the screen (DVI Test). SECRET-FREE.
// Usage: node pay_ui.mjs <woId> <amount> <tag>
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const [wo, amount, tag] = process.argv.slice(2);
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', OUT = '/tmp/cln/w2/ev2';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
const log = []; page.on('response', async r => { if (/payment/i.test(r.url()) && r.request().method() === 'POST') { try { log.push({ u: r.url().replace(/^.*\/api/, ''), s: r.status(), req: (r.request().postData() || '').slice(0, 600), b: (await r.text()).slice(0, 200) }); } catch {} } });
await page.goto(`https://app.staging.shopview.com/workorders/${wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
const pb = page.locator('button').filter({ hasText: /Payment/i }).first();
console.log('payment buttons', JSON.stringify((await page.locator('button').filter({ hasText: /Payment/i }).allInnerTexts())));
await pb.click(); await page.waitForTimeout(3000);
const dlg = page.locator('.q-dialog').last();
console.log('dialog', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 500));
await dlg.locator('.q-select').first().click().catch(() => {}); await page.waitForTimeout(800);
const cash = page.locator('.q-menu .q-item').filter({ hasText: /cash/i }).first();
await (await cash.count() ? cash : page.locator('.q-menu .q-item').first()).click(); await page.waitForTimeout(800);
const inputs = dlg.locator('input[type="text"], input[type="number"], input:not([type])');
const n = await inputs.count(); const vals = [];
for (let i = 0; i < n; i++) vals.push([i, await inputs.nth(i).inputValue().catch(() => ''), await inputs.nth(i).getAttribute('data-test-id').catch(() => null), await inputs.nth(i).getAttribute('aria-label').catch(() => null)]);
console.log('inputs', JSON.stringify(vals));
// the amount field holds the invoice balance (e.g. "135.00"); replace it with the requested amount
const target = 'input_payment_amount';
const f = dlg.locator('[data-test-id="input_payment_amount"]'); await f.click({ clickCount: 3 }); await f.fill(String(amount)); await page.keyboard.press('Tab'); await page.waitForTimeout(1200);
console.log('after fill', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 500));
await page.screenshot({ path: `${OUT}/pay-${tag}-dialog.png` });
await dlg.getByText('Make Payment').click(); await page.waitForTimeout(6000);
await page.screenshot({ path: `${OUT}/pay-${tag}-after.png` });
console.log('target', target, 'posts', JSON.stringify(log).slice(0, 1500));
await browser.close();
