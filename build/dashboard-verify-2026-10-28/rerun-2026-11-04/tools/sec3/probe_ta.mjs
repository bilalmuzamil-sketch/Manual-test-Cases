// Probe (read-only): which request Timesheet Activities sends for a deep link, DVI Test in Pacific/Fiji. SECRET-FREE.
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { LOC } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/f3boot.mjs';
const [WP, TZ] = LOC.dvi;
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { timezoneId: TZ } });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
page.on('request', r => { if (/punch-clock/.test(r.url())) console.log('REQ', decodeURIComponent(r.url()).replace(/^.*\/api/, '')); });
for (const u of ['/reports/punch-clock-activities?range=custom&startDate=2026-10-29&endDate=2026-10-29', '/reports/punch-clock-activities?range=custom&startDate=10/29/2026&endDate=10/29/2026']) {
  await page.goto('https://app.staging.shopview.com' + u, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(10000);
  console.log('URL', u, '| rows', await page.locator('tbody tr').count(), '| chip', (await page.locator('[data-test-id="filter_chip_range"]').innerText().catch(() => '')).replace(/\s+/g, ' '));
}
console.log('LS', await page.evaluate(() => Object.keys(localStorage).filter(k => /punch|range|report/.test(k)).map(k => k + '=' + localStorage.getItem(k).slice(0, 120))));
await browser.close();
