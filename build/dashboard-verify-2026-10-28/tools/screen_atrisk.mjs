// Layer L1 for the At Risk tile: each inactivity window, fresh page per location. SECRET-FREE.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const WPS = [['b3c8c820-f815-4cf1-8938-10956c5ee71a','Staging Heavy Duty - 9919','Asia/Karachi'],['f8a8b802-7780-4b16-bf10-343caeb616b2','Staging Lethbridge - 4310','America/Edmonton'],['25a0d576-b371-4b82-bef4-41ba977f31c2','QB Location','America/Vancouver'],['39522bc6-abca-4f67-bd12-2840043c2d68','DVI Test','America/Toronto']];
for (const [wid, wname, tz] of WPS) {
  const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
  await page.evaluate(w => { localStorage.setItem('location', JSON.stringify(w)); localStorage.removeItem('dashboard_at_risk_risk_days'); }, wid);
  const responses = [];
  page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports') && u.includes('atRiskCustomers')) { try { responses.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), status: r.status(), body: await r.json() }); } catch {} } });
  await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_atRiskHero"]', { timeout: 90000 }); await page.waitForTimeout(6000);
  const read = async () => ({ value: (await page.locator('[data-test-id="hero_value_atRiskHero"]').innerText()).trim(), meta: (await page.locator('[data-test-id="hero_meta_atRiskHero"]').innerText()).trim(),
    emptyChart: await page.locator('[data-test-id="hero_sparkline_empty_atRiskHero"]').count(), sparkline: await page.locator('[data-test-id="hero_sparkline_atRiskHero"]').count(),
    pill: (await page.locator('[data-test-id="hero_tile_atRiskHero"]').innerText()).match(/(\d+) Days/)?.[1] });
  const out = { workplace: wname, id: wid, tz, observed_at_utc: new Date().toISOString(), initial: { atRiskHero: await read() }, steps: [] };
  let cur = out.initial.atRiskHero.pill;
  for (const days of [30, 60, 90, 120, 180]) {
    const n0 = responses.length;
    await page.locator('[data-test-id="hero_tile_atRiskHero"]').getByText(`${cur} Days`).first().click();
    await page.waitForTimeout(800);
    const opt = page.locator(`[data-test-id="option_risk_days_hero_${days}"]`);
    if (!(await opt.count())) { out.steps.push({ key: 'atRiskHero', preset: `${days} Days`, error: 'option not found' }); await page.keyboard.press('Escape'); continue; }
    await opt.first().click();
    for (let i = 0; i < 40 && responses.length === n0 && days != cur; i++) await page.waitForTimeout(250);
    await page.waitForTimeout(2500);
    const shown = await read(); cur = shown.pill;
    const req = responses.length > n0 ? responses.slice(n0) : responses.filter(r => r.url.includes(`risk_days=${days}`)).slice(-1);
    out.steps.push({ key: 'atRiskHero', preset: `${days} Days`, shown, requests: req });
  }
  fs.writeFileSync(`/tmp/cln/dv/out/screenrisk-${wid.slice(0, 8)}.json`, JSON.stringify(out));
  console.log(wname, out.steps.map(s => s.error || `${s.preset}:${s.shown.value}`).join(' '));
  await browser.close();
}
