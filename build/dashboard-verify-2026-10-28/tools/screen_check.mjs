// Layer L1 — what the SCREEN shows equals what the server sent, for every tile x preset x location,
// and the dates the screen asks for equal the PRD's preset definitions (computed independently in check_screen.py).
// SECRET-FREE: cookies come from /tmp via staging-boot2.mjs. Output: /tmp/cln/dv/out/screen-<wp>.json + screenshots.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';

const WPS = [
  ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Staging Heavy Duty - 9919', 'Asia/Karachi'],
  ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'Staging Lethbridge - 4310', 'America/Edmonton'],
  ['25a0d576-b371-4b82-bef4-41ba977f31c2', 'QB Location', 'America/Vancouver'],
  ['39522bc6-abca-4f67-bd12-2840043c2d68', 'DVI Test', 'America/Toronto'],
];
const PRESETS = ['Last 12 Months', 'This Year', 'Last Year', 'This Quarter', 'Last Quarter', 'This Month', 'Last Month', 'This Week', 'Last Week'];
const TILES = ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer'];
const only = process.argv[2];
fs.mkdirSync('/tmp/cln/dv/out/shots', { recursive: true });

for (const [wid, wname, tz] of WPS) {
  if (only && !wname.includes(only)) continue;
  const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
  await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), wid);
  const responses = [];
  page.on('response', async r => {
    const u = r.url(); if (!u.includes('/api/dashboard/reports')) return;
    try { responses.push({ url: decodeURIComponent(u), status: r.status(), body: await r.json(), t: Date.now() }); } catch {}
  });
  await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 });
  await page.waitForTimeout(6000);
  const read = async key => ({
    value: (await page.locator(`[data-test-id="hero_value_${key}"]`).innerText().catch(() => null))?.trim(),
    meta: (await page.locator(`[data-test-id="hero_meta_${key}"]`).innerText().catch(() => null))?.trim(),
    pill: (await page.locator(`[data-test-id="hero_tile_${key}"] .date-range-label, [data-test-id="hero_tile_${key}"] [class*="date"]`).first().innerText().catch(() => null))?.trim(),
    emptyChart: await page.locator(`[data-test-id="hero_sparkline_empty_${key}"]`).count(),
    sparkline: await page.locator(`[data-test-id="hero_sparkline_${key}"]`).count(),
  });
  const out = { workplace: wname, id: wid, tz, observed_at_utc: new Date().toISOString(), initial: {}, steps: [] };
  for (const k of [...TILES, 'atRiskHero']) out.initial[k] = await read(k);
  out.initialRequests = responses.map(r => r.url.replace(/^.*\/api/, '/api'));
  await page.screenshot({ path: `/tmp/cln/dv/out/shots/${wid.slice(0, 8)}-initial.png`, fullPage: true });
  for (const key of TILES) {
    for (const preset of PRESETS) {
      const before = Object.fromEntries(await Promise.all(TILES.filter(k => k !== key).map(async k => [k, await read(k)])));
      const n0 = responses.length;
      const tile = page.locator(`[data-test-id="hero_tile_${key}"]`);
      await tile.locator('.date-range-label, [class*="date-label"], button').filter({ hasText: /Month|Year|Quarter|Week|Months|Custom|\d/ }).first().click();
      await page.waitForTimeout(700);
      const opt = page.locator('.q-menu').last().getByText(preset, { exact: true }).first();
      if (!(await opt.count())) { out.steps.push({ key, preset, error: 'preset option not found' }); await page.keyboard.press('Escape'); continue; }
      await opt.click();
      for (let i = 0; i < 40 && responses.length === n0; i++) await page.waitForTimeout(250);
      await page.waitForTimeout(2500);
      const after = Object.fromEntries(await Promise.all(TILES.filter(k => k !== key).map(async k => [k, await read(k)])));
      const req = responses.slice(n0).map(r => ({ url: r.url.replace(/^.*\/api/, '/api'), status: r.status, body: r.body }));
      out.steps.push({ key, preset, shown: await read(key), requests: req,
        othersChanged: Object.keys(after).filter(k => JSON.stringify(after[k]) !== JSON.stringify(before[k])) });
      if (preset === 'This Month' || preset === 'Last 12 Months')
        await page.screenshot({ path: `/tmp/cln/dv/out/shots/${wid.slice(0, 8)}-${key}-${preset.replace(/ /g, '')}.png`, fullPage: true });
    }
    // put the tile back on its default (S7-R7) so the next tile starts from the documented state
    const def = key === 'salesByCustomer' ? 'Last 12 Months' : 'This Month';
    const tile = page.locator(`[data-test-id="hero_tile_${key}"]`);
    await tile.locator('.date-range-label, [class*="date-label"], button').filter({ hasText: /Month|Year|Quarter|Week|Months|Custom|\d/ }).first().click();
    await page.waitForTimeout(600);
    await page.locator('.q-menu').last().getByText(def, { exact: true }).first().click().catch(() => {});
    await page.waitForTimeout(2500);
  }
  // At Risk inactivity window
  for (const days of [30, 60, 90, 120, 180]) {
    const n0 = responses.length;
    await page.locator('[data-test-id="hero_tile_atRiskHero"]').getByText(/\d+ Days/).first().click().catch(() => {});
    await page.waitForTimeout(700);
    const opt = page.locator(`[data-test-id="option_risk_days_hero_${days}"]`).first();
    if (!(await opt.count())) { out.steps.push({ key: 'atRiskHero', preset: `${days} Days`, error: 'option not found' }); await page.keyboard.press('Escape'); continue; }
    await opt.click();
    for (let i = 0; i < 40 && responses.length === n0; i++) await page.waitForTimeout(250);
    await page.waitForTimeout(2500);
    out.steps.push({ key: 'atRiskHero', preset: `${days} Days`, shown: await read('atRiskHero'),
      requests: responses.slice(n0).map(r => ({ url: r.url.replace(/^.*\/api/, '/api'), status: r.status, body: r.body })) });
  }
  fs.writeFileSync(`/tmp/cln/dv/out/screen-${wid.slice(0, 8)}.json`, JSON.stringify(out));
  console.log(wname, 'steps', out.steps.length, 'errors', out.steps.filter(s => s.error).length);
  await browser.close();
}
