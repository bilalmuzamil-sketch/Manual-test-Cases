import { boot, LOC, gotoDash, shot, save, sleep } from './hb.mjs';
const { browser, page, rule99, app_version } = await boot(LOC.HD);
await gotoDash(page);
await page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_trigger"]').click(); await sleep(1200);
const menu = page.locator('.q-menu').last();
const info = await menu.evaluate(m => ({ text: m.innerText.replace(/\s+/g, ' ').slice(0, 600), ids: [...new Set([...m.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))], btns: [...m.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(0, 60) }));
await shot(page, 'explore', 'picker-open');
save('explore', 'picker', { app_version, rule99, info }); console.log(JSON.stringify(info).slice(0, 2500));
await browser.close();
