// Ticket pictures (16 Nov 2026): one document on the NEW aging screen, as of 11/12/2026, with the browser's stored screen
// zone set (localStorage "timezone", SV-12663 handoff). Args: zone slug partyKey partyId groupText docNumber outName.
// Filter key names read from app/src/components/ts/reporting/aging/useAgingReportFilters.ts. Read-only browser.
const path = require('path');
const { open, APP } = require(path.resolve(__dirname, '../../staging-after-feature-2026-11-12/scripts/stg.js'));
(async () => {
  const [Z, slug, key, id, group, doc, name] = process.argv.slice(2); const out = { zone: Z, slug, doc };
  const { browser, ctx, page } = await open({ tz: Z });
  await ctx.addInitScript((z) => { try { localStorage.setItem('timezone', JSON.stringify(z)); } catch (e) {} }, Z);
  const sent = []; page.on('request', (r) => { if (r.url().includes(`reporting/reports/${slug}`)) sent.push(r.url().replace(/^https:\/\/[^/]+/, '')); });
  await page.goto(`${APP}/reports/${slug}?asOfDate=2026-11-12&${key}=${id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(`tr:has-text("${group}")`, { timeout: 90000 }); await page.waitForTimeout(3000);
  out.build = await page.evaluate(() => document.querySelector('meta[name="app-version"]')?.content);
  await page.locator('tr', { hasText: group }).first().locator('i, .q-icon, button').filter({ hasText: 'keyboard_arrow_right' }).first().click();
  const row = page.locator('tr', { hasText: doc }).first(); await row.waitFor({ timeout: 60000 }); await row.scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
  out.row = (await row.innerText()).replace(/\s+/g, ' | '); out.requestSample = sent.find((u) => u.includes('timezone=')) || sent[0]; out.at = new Date().toISOString();
  const b = await row.boundingBox(); await page.screenshot({ path: `screen/${name}.png`, clip: { x: 0, y: Math.max(0, b.y - 170), width: 1440, height: 270 } });
  require('fs').writeFileSync(`screen/${name}.json`, JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1)); await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
