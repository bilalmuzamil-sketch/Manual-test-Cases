// W2 screen probe: for each report screen — every filter chip and what its menu offers, every date preset
// and the exact date window the screen then requests, the main text (first rows, totals), and any API
// error. Captures at deviceScaleFactor 1. SECRET-FREE (session via staging-boot2).
// Usage: node screen_probe.mjs HD|DVI|LETH|QB [reportKey,...]
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w2/ev';
const LOC = { HD: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'], DVI: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'],
  LETH: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton'], QB: ['25a0d576-b371-4b82-bef4-41ba977f31c2', 'America/Vancouver'] };
const which = process.argv[2] || 'HD';
const only = process.argv[3] ? process.argv[3].split(',') : null;
const [wid, tz] = LOC[which];
const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [wid, tz]);
const res = { browserTz: await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone) }; const net = [];
page.on('response', r => { const u = r.url(); if (u.includes('api.staging.shopview.com/api/') && !u.includes('punch-clock') && !u.includes('notification')) net.push({ status: r.status(), url: decodeURIComponent(u.replace('https://api.staging.shopview.com', '')).slice(0, 500) }); });
const main = async () => (await page.locator('main').innerText().catch(() => '')).replace(/\n+/g, ' | ');
const REPORTS = { 'follow-up': '/reports/sales-follow-up', sbc: '/reports/sales-by-customer', sbr: '/reports/sales-by-representative', sales: '/reports/sales',
  saa: '/reports/service-advisor-analysis', tax: '/reports/sales-tax/invoices', 'tax-rates': '/reports/sales-tax/all-tax-rates', te: '/reports/technician-efficiency' };
for (const [key, route] of Object.entries(REPORTS)) {
  if (only && !only.includes(key)) continue;
  net.length = 0;
  await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  await page.screenshot({ path: `${OUT}/${which}-${key}.png` });
  const r = res[key] = { url: page.url(), main: (await main()).slice(0, 2500), load: [...net], chips: {} };
  const chips = page.locator('[data-test-id^="filter_chip_"]:not([data-test-id^="filter_chip_resolved_"]):not([data-test-id^="filter_chip_clear_"])');
  const ids = await chips.evaluateAll(es => es.map(e => e.getAttribute('data-test-id')));
  for (const id of [...new Set(ids)]) {
    const chip = page.locator(`[data-test-id="${id}"]`).first();
    const c = r.chips[id] = { text: (await chip.innerText().catch(() => '')).replace(/\s+/g, ' ') };
    await chip.click().catch(() => {}); await page.waitForTimeout(1500);
    const menu = page.locator('.q-menu').last();
    c.menu = (await menu.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 1200);
    const presets = await page.locator('[data-test-id^="filter_preset_"]').evaluateAll(es => es.map(e => [e.getAttribute('data-test-id'), e.innerText.trim()]));
    c.presets = presets;
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    if (presets.length) {
      c.windows = {};
      for (const [pid, label] of presets) {
        net.length = 0;
        await chip.click().catch(() => {}); await page.waitForTimeout(1000);
        await page.locator(`[data-test-id="${pid}"]`).first().click().catch(() => {}); await page.waitForTimeout(3500);
        await page.keyboard.press('Escape'); await page.waitForTimeout(300);
        c.windows[label] = { chip: (await chip.innerText().catch(() => '')).replace(/\s+/g, ' '), requests: net.filter(n => n.url.includes('/reporting/')).map(n => n.status + ' ' + n.url) };
      }
    }
  }
}
res.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
fs.writeFileSync(`${OUT}/${which}-probe.json`, JSON.stringify(res, null, 1));
console.log(res.appVersion, res.browserTz, Object.keys(res).length);
await browser.close();
