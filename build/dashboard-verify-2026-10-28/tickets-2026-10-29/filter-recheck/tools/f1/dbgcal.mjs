import { fresh, finish } from './f1lib.mjs';
const c = await fresh('DVI', 'dbg-cal'); const { page } = c;
await c.go('/dashboard', 4000); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
await page.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_trigger"]').click(); await page.waitForTimeout(2000);
const m = page.locator('.q-menu').last();
const cal = m.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_calendar"]');
console.log('cal count', await cal.count(), 'menu ids', JSON.stringify(await m.locator('[data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')))).slice(0, 900));
console.log('in-buttons', await cal.locator('.q-date__calendar-item--in button').count(), (await cal.innerText().catch(() => '')).replace(/\n/g, ' ').slice(0, 300));
const ind = () => c.txt(m.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_range_indicator"]'));
const nav = cal.locator('.q-date__arrow button'); console.log('arrows', await nav.count()); await nav.first().click(); await page.waitForTimeout(600); await nav.nth(1).click(); await page.waitForTimeout(600);
console.log('month now', (await cal.innerText()).split('\n').slice(0,3).join(' '));
for (const d of [25, 28]) { const b = cal.locator('.q-date__calendar-item--in button').filter({ hasText: new RegExp('^' + d + '$') }); console.log('btn', d, await b.count()); const bb = await b.first().boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(300); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(800); console.log('cls', await b.first().evaluate(e => e.closest('.q-date__calendar-item').className)); console.log('after', d, await ind()); }
await m.locator('[data-test-id="button_hero_range_techEfficiencyKpi_apply"]').click(); await page.waitForTimeout(7000);
console.log('trigger', await c.txt(page.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_trigger"]')), await c.txt(page.locator('[data-test-id="hero_meta_techEfficiencyKpi"]')));
await finish(c, {});
