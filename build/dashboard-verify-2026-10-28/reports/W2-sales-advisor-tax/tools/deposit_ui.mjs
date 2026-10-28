// Take a DEPOSIT on a not-yet-invoiced work order through the screen (Finance tab), DVI Test. SECRET-FREE.
// Usage: node deposit_ui.mjs <woId> <amount> <tag> [explore]
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const [wo, amount, tag, explore] = process.argv.slice(2);
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', OUT = '/tmp/cln/w2/ev2';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
const log = []; page.on('response', async r => { if (r.request().method() === 'POST' && /deposit|payment/i.test(r.url())) { try { log.push({ u: r.url().replace(/^.*\/api/, ''), s: r.status(), b: (await r.text()).slice(0, 160) }); } catch {} } });
await page.goto(`https://app.staging.shopview.com/workorders/${wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
console.log('buttons', JSON.stringify((await page.locator('button').allInnerTexts()).filter(t => t.trim()).slice(0, 40)));
await page.screenshot({ path: `${OUT}/dep-${tag}-finance-before.png` });
const pb = page.locator('button').filter({ hasText: /Payment|Deposit/i }).first();
await pb.click(); await page.waitForTimeout(3000);
const dlg = page.locator('.q-dialog').last();
console.log('dialog', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 700));
const ids = await dlg.locator('[data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')));
console.log('testids', JSON.stringify(ids));
await page.screenshot({ path: `${OUT}/dep-${tag}-dialog-open.png` });
if (explore) { await browser.close(); process.exit(0); }
await dlg.locator('[data-test-id="select_create_deposit_payment_method"]').click().catch(() => {}); await page.waitForTimeout(800);
const cash = page.locator('.q-menu .q-item').filter({ hasText: /cash/i }).first();
if (await cash.count()) { await cash.click(); await page.waitForTimeout(800); }
const f = dlg.locator('[data-test-id="input_create_deposit_amount"]'); await f.click({ clickCount: 3 }); await f.fill(String(amount)); await page.keyboard.press('Tab'); await page.waitForTimeout(1200);
console.log('after fill', (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(0, 600));
await page.screenshot({ path: `${OUT}/dep-${tag}-dialog-filled.png` });
await dlg.locator('[data-test-id="button_confirm_dialog"]').click(); await page.waitForTimeout(6000);
await page.screenshot({ path: `${OUT}/dep-${tag}-after.png` });
await page.goto(`https://app.staging.shopview.com/workorders/${wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(8000);
console.log('finance after', (await page.locator('main, .q-page').first().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 900));
await page.screenshot({ path: `${OUT}/dep-${tag}-finance-after.png` });
console.log('posts', JSON.stringify(log).slice(0, 1500));
await browser.close();
