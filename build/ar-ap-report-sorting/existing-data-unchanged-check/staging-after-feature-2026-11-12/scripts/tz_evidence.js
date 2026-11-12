// Evidence for the held draft: documents at Staging Lethbridge - 4310 (America/Edmonton) aged in the signed-in
// location's calendar (Staging Heavy Duty - 9919, Asia/Karachi). Two reads, minutes apart (Rule 110).
const { open, APP, stamp, dir, rows } = require('./stg');
const fs = require('fs');
(async () => {
  const { browser, page } = await open();
  const O = dir('held-defect-drafts/evidence'); const N = [];
  for (const run of [1, 2]) {
    const mk = (await page.request.get(APP + '/').then((r) => r.text())).match(/app-version" content="([^"]+)/)?.[1];
    await page.goto(APP + '/reports/ar-aging-detail?asOfDate=2026-11-12&customerIds=b8ac806d-44b2-4803-9632-31c87c79ec0a', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
    await page.locator('[data-test-id$="_toggle_all"]').first().click().catch(() => {}); await page.waitForTimeout(5000);
    let r = await rows(page); const s1 = r.filter((x) => /S3-39986|Current \(|1-30 days past due \(/.test(x));
    await page.screenshot({ path: `${O}/PIC${run}-staging-after-AR-Detail-E2E-Credits-Customer.png`, fullPage: true });
    await page.goto(APP + '/reports/ar-aging-collection?asOfDate=2026-11-12&customerIds=e7a7bb7e-046f-4684-a6ad-78ff3674b543', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
    await page.locator('[data-test-id$="_toggle_all"]').first().click().catch(() => {}); await page.waitForTimeout(5000);
    r = await rows(page); const s2 = r.filter((x) => /S3-1714[789]|S3-17238/.test(x));
    await page.screenshot({ path: `${O}/PIC${run}-staging-after-AR-Collection-Tucson-Truck-Center.png`, fullPage: true });
    N.push(`Read ${run} at ${stamp()} (build ${mk}):\n  A/R Detail, E2E Credits Customer: ${s1.join(' // ')}\n  A/R Collection, Tucson Truck Center: ${s2.join(' // ')}`);
    if (run === 1) await page.waitForTimeout(120000);
  }
  fs.writeFileSync(`${O}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  await browser.close();
})();
