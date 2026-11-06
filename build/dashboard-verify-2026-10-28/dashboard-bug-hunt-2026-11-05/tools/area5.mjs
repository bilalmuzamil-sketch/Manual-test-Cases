// Area 5 — Stories 6–9 gaps on sv11839 (Heavy Duty, America/Edmonton): custom range edges, Today, per-visit memory, tooltip = data.
import { boot, LOC, gotoDash, tile, shot, save, sleep, netlog, setRange, finish, TILES } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports');
const ev = { app_version, browser_today: await page.evaluate(() => new Date().toString()), checks: {} };
await gotoDash(page);
const P = k => `date-range-selector_hero_range_${k}`;
const openPicker = async k => { await page.locator(`[data-test-id="${P(k)}_trigger"]`).click(); await sleep(1000); return page.locator(`[data-test-id="${P(k)}_calendar"]`); };
const day = (cal, d) => cal.locator('button').filter({ hasText: new RegExp(`^${d}$`) }).first();
const lastReq = n0 => net.slice(n0).map(r => r.url.match(/from=[^&]+&to=[^&]+/)?.[0]).filter(Boolean);
async function custom(k, a, b, name) {
  const n0 = net.length; const cal = await openPicker(k); await day(cal, a).click(); await sleep(400); await day(cal, b).click(); await sleep(600);
  const ind = (await page.locator(`[data-test-id="${P(k)}_range_indicator"]`).innerText().catch(() => '')).trim();
  const apply = page.locator(`[data-test-id="button_hero_range_${k}_apply"]`); const disabled = await apply.isDisabled().catch(() => null);
  const header = (await page.locator('.q-menu').last().innerText()).split('\n')[0];
  await shot(page, 'area5', `${name}-picker`);
  if (!disabled) { await apply.click(); await sleep(5000); } else await page.keyboard.press('Escape');
  const r = { picked: [a, b], picker_header: header, range_indicator: ind, apply_disabled: disabled, tile: await tile(page, k), requests: lastReq(n0), body: net.at(-1)?.body?.data && { from: net.at(-1).body.data.from, to: net.at(-1).body.data.to, group: net.at(-1).body.data.group, revenueKpi: net.at(-1).body.data.revenueKpi?.value, sparkline: net.at(-1).body.data.revenueKpi?.sparkline } };
  await shot(page, 'area5', `${name}-tile`); ev.checks[name] = r; console.log(name, JSON.stringify(r).slice(0, 700)); return r;
}
await custom('revenueKpi', 4, 4, '5.2a-single-day-nov4');
await custom('revenueKpi', 3, 20, '5.2b-ends-in-future-nov3-nov20');
// expanded chart for the future-ending range: screenshot (canvas) to see where it ends
await page.locator('[data-test-id="btn_toggle_details_revenueKpi"]').click(); await sleep(6000); await shot(page, 'area5', '5.2b-expanded-chart'); 
await page.locator('[data-test-id="btn_toggle_details_revenueKpi"]').click(); await sleep(1500);
{ const n0 = net.length; await openPicker('techEfficiencyKpi'); await page.locator('[data-test-id="button_hero_range_techEfficiencyKpi_today"]').click(); await sleep(800);
  const ind = (await page.locator('[data-test-id="date-range-selector_hero_range_techEfficiencyKpi_range_indicator"]').innerText().catch(() => '')).trim();
  const apply = page.locator('[data-test-id="button_hero_range_techEfficiencyKpi_apply"]'); if (await apply.isVisible().catch(() => false) && !(await apply.isDisabled())) await apply.click(); else await page.keyboard.press('Escape');
  await sleep(5000); ev.checks['5.2c-today-button'] = { range_indicator: ind, tile: await tile(page, 'techEfficiencyKpi'), requests: lastReq(n0) }; console.log('today', JSON.stringify(ev.checks['5.2c-today-button'])); }
// 5.1 per-visit memory: ranges NOT remembered (S7-R8), expanded tile remembered (S6-R16)
await setRange(page, 'billingEfficiencyKpi', 'Last Year'); await setRange(page, 'salesByCustomer', 'This Week');
await page.locator('[data-test-id="btn_toggle_details_techUtilizationKpi"]').click(); await sleep(5000);
const beforeReload = Object.fromEntries(await Promise.all(TILES.map(async k => [k, (await tile(page, k)).chip])));
await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(7000);
const afterReload = Object.fromEntries(await Promise.all(TILES.map(async k => [k, (await tile(page, k)).chip])));
const expanded = await page.evaluate(() => { const p = document.querySelector('[data-test-id="hero_detail_panel"]'); return p ? p.innerText.replace(/\s+/g, ' ').slice(0, 120) : null; });
await shot(page, 'area5', '5.1-after-reload'); ev.checks['5.1-reload'] = { beforeReload, afterReload, expanded_after_reload: expanded };
console.log('5.1', JSON.stringify(ev.checks['5.1-reload']));
ev.rule99 = await finish(page, loc, rule99); save('area5', 'area5-HD', ev); console.log(app_version, 'rule99', ev.rule99.all_match);
await browser.close();
