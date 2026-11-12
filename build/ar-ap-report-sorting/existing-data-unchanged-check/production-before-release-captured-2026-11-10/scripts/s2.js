// Section 2: CM-4411 (ZZAUTOTEST, dated 18 Nov) on A/R Aging Detail as of its own date, every bucket expanded
const { open } = require('./prod');
const fs = require('fs');
const OUT = 'out/2-credit-memo';
(async () => {
  const { browser, page } = await open();
  await page.goto('https://app.shopview.com/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 60000 }); await page.waitForTimeout(3000);
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await page.waitForTimeout(800);
  await page.locator('[data-test-id="filter_single_date_asOfDate"] .q-date__calendar-item button, [data-test-id="filter_single_date_asOfDate"] button').filter({ hasText: /^18$/ }).first().click();
  await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
  const asOf = (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' ');
  for (const t of await page.locator('[data-test-id^="button_aging_detail_report_toggle_"]').all()) { await t.click(); await page.waitForTimeout(1500); }
  await page.waitForTimeout(3000);
  const rows = await page.evaluate(() => [...document.querySelectorAll('table tr')].map((tr) => [...tr.children].map((c) => c.innerText.trim().replace(/\s+/g, ' ')).join(' | ')));
  fs.writeFileSync(`${OUT}/AR Aging Detail as of 2026-11-18 - rows.txt`, rows.join('\n') + '\n');
  // which bucket holds CM-4411: the nearest bucket heading above its row
  let bucket = null, cmRow = null;
  for (const r of rows) { if (/past due \(|Current \(/.test(r)) bucket = r.split(' | ').find((x) => /past due|Current/.test(x)); if (/CM1?-4411/.test(r)) { cmRow = r; break; } }
  const row = page.locator('tr', { hasText: 'CM1-4411' }).first();
  if (await row.count()) {
    await row.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
    await page.screenshot({ path: `${OUT}/AR Aging Detail as of 2026-11-18 - CM1-4411 row.png` });
  }
  await page.screenshot({ path: `${OUT}/AR Aging Detail as of 2026-11-18 - all buckets expanded - full page.png`, fullPage: true });
  const note = `As-of date on the report: ${asOf}\nCredit memo: CM1-4411 (the API calls it CM-4411), $5.00, customer "ZZAUTOTEST SV11744 Q3", dated 2026-11-18, reason "ZZAUTOTEST before-release capture for C1062590 (A/R and A/P release 19 Nov 2026)", status open (unused)\nThere is NO customer filter on production's A/R Aging Detail before the release, so step 2 "tick its customer" could not be done; every bucket was expanded instead.\nBucket it is in: ${bucket}\nIts row: ${cmRow}\n`;
  fs.writeFileSync(`${OUT}/NOTES.txt`, note); console.log(note);
  await browser.close();
})();
