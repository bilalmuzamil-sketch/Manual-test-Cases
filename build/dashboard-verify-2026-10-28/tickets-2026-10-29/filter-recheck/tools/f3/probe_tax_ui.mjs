// F3 probe: Sales Tax Collected menus (date presets, status options), the request for Custom, the See All Tax Rates route. SECRET-FREE.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com'; const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', TZ = 'Asia/Karachi';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, timezoneId: TZ } });
const reqs = []; page.on('request', r => { const u = decodeURIComponent(r.url()); if (u.includes('/api/reporting')) reqs.push(u.replace(/^.*\/api/, '/api').slice(0, 400)); });
await page.goto(APP + '/reports/sales-tax/invoices', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
const m = {};
await page.locator('[data-test-id="filter_chip_range"]').click(); await page.waitForTimeout(1500);
m.presets = await page.locator('[data-test-id^="filter_preset_range_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + '=' + e.innerText.trim()));
await page.locator('[data-test-id="filter_preset_range_custom"]').click(); await page.waitForTimeout(1200);
m.custom_ids = await page.locator('.q-menu [data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')));
for (const [id, v] of [['date_input_range_start', '10/20/2026'], ['date_input_range_end', '10/20/2026']]) { const f = page.locator(`[data-test-id="${id}"]`); await f.click({ clickCount: 3 }); await f.fill(v); await page.keyboard.press('Tab'); await page.waitForTimeout(800); }
const ap = page.locator('.q-menu button').filter({ hasText: /Apply/i }); if (await ap.count()) await ap.first().click();
await page.keyboard.press('Escape'); await page.waitForTimeout(8000);
m.chip = (await page.locator('[data-test-id="filter_chip_range"]').innerText()).replace(/\s+/g, ' ');
m.url_after_custom = page.url();
await page.locator('[data-test-id="filter_chip_statuses"]').click(); await page.waitForTimeout(1200);
m.status_menu = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
m.search_inputs = await page.locator('main input').evaluateAll(es => es.map(e => (e.getAttribute('data-test-id') || '') + '|' + (e.placeholder || '') + '|' + e.type));
m.main_buttons = await page.locator('main button, main a').evaluateAll(es => es.map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 40));
await page.locator('button, a').filter({ hasText: 'See All Tax Rates' }).first().click(); await page.waitForTimeout(8000);
m.rates_url = page.url(); m.rates_chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + ' = ' + e.innerText.replace(/\s+/g, ' ').trim()));
m.rates_text = (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 900);
m.ls = await page.evaluate(() => Object.keys(localStorage));
m.reqs = reqs; console.log(JSON.stringify(m, null, 1).slice(0, 6000));
await browser.close();
