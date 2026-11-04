// Layer L1 for the At Risk tile: each inactivity window, fresh page per location. SECRET-FREE.
import fs from 'fs';
import { qaBoot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const boot2 = (_k, o) => qaBoot({ branch: 'sv11839', cookieFile: '/tmp/cln/qa11839/cookies.json', workplaceId: o.workplaceId, timezone: o.timezone });
const WPS = [['b3c8c820-f815-4cf1-8938-10956c5ee71a','Staging Heavy Duty - 9919','America/Edmonton'],['f8a8b802-7780-4b16-bf10-343caeb616b2','Staging Lethbridge - 4310','America/Edmonton'],['f9da140e-f4eb-4e3b-adc8-028214ebaf4c','Test Location','Asia/Karachi']];
const only = process.argv[2];
for (const [wid, wname, tz] of WPS) {
  if (only && !wname.includes(only)) continue;
  const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
  await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); localStorage.removeItem('dashboard_at_risk_risk_days'); }, [wid, tz]);
  console.log('RULE99', JSON.stringify({ loc: wname, location_tz: tz, process_tz: Intl.DateTimeFormat().resolvedOptions().timeZone, browser: await page.evaluate(() => [Intl.DateTimeFormat().resolvedOptions().timeZone, localStorage.getItem('timezone'), localStorage.getItem('location')]) }));
  const responses = [];
  page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports') && u.includes('atRiskCustomers')) { try { responses.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), status: r.status(), body: await r.json() }); } catch {} } });
  await page.goto('https://sv11839.qa.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
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
  fs.writeFileSync(`/tmp/cln/dvqa/out/screenrisk-${wid.slice(0, 8)}.json`, JSON.stringify(out));
  console.log(wname, out.steps.map(s => s.error || `${s.preset}:${s.shown.value}`).join(' '));
  await browser.close();
}
