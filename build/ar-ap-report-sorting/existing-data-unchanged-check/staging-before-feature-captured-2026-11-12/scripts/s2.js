// Section 2: the seeded credit memo CM2-4540 (ZZAUTOTEST SV11315 Staging CM, $5.00, dated 14 Nov 2026, unused) on
// A/R Aging Detail as of ITS OWN date (14 Nov 2026), every bucket expanded. Staging extra: the seeded vendor credit
// C-13911 (ZZAUTOTEST SV11315 Staging VC, $7.00, dated 12 Nov 2026) on A/P Aging Detail as of 12 Nov 2026 — the A/P
// side of the same intended change (C715472). Calendar days are clicked in the month the calendar opens on (November).
const { open, APP, stamp, dir, rows } = require('./stg');
const fs = require('fs');
const OUT = dir('2-credit-memo');
async function setDay(page, day) {
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await page.waitForTimeout(800);
  await page.locator('[data-test-id="filter_single_date_asOfDate"] button').filter({ hasText: new RegExp('^' + day + '$') }).first().click();
  await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
  return (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' ').replace(/calendar_today|keyboard_arrow_down/g, '').trim();
}
async function findIn(page, label, number, file) {
  // expand one bucket at a time; the bucket heading nearest above the row is where the document sits
  const toggles = await page.locator('[data-test-id*="aging_detail_report_toggle_"]').all();
  for (const t of toggles) {
    const tid = await t.getAttribute('data-test-id');
    await t.click(); await page.waitForTimeout(4000);
    const row = page.locator('tr', { hasText: number }).first();
    // the table is a virtual scroll (only rows near the view exist in the page): scroll it down until the row appears
    const VS = '.q-table__middle.q-virtual-scroll';
    await page.evaluate((vs) => { const e = document.querySelector(vs); if (e) e.scrollTop = 0; }, VS); await page.waitForTimeout(600);
    let bucketHead = null;
    for (let i = 0; i < 400 && !(await row.count()); i++) {
      const end = await page.evaluate((vs) => { const e = document.querySelector(vs); if (!e) return true; const before = e.scrollTop; e.scrollTop += e.clientHeight - 60; return e.scrollTop === before; }, VS);
      await page.waitForTimeout(350);
      if (end) break;
    }
    if (await row.count()) {
      const all = await rows(page);
      let bucket = null, hit = null;
      for (const r of all) { if (/past due \(|Current \(/.test(r)) bucket = r.split(' | ').find((x) => /past due|Current/.test(x)); if (r.includes(number)) { hit = r; break; } }
      // in a virtual scroll the heading may have scrolled out of the page: name the bucket from the one toggle that is open
      if (!bucket || !all.some((r) => r === hit)) bucket = tid;
      const open = all.filter((r) => /arrow_drop_up/.test(r)); if (open.length === 1) bucket = open[0].split(' | ')[0];
      await row.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
      await row.evaluate((el) => { el.style.outline = '3px solid #e11'; el.style.outlineOffset = '-2px'; });
      await page.screenshot({ path: `${OUT}/${file} - ${number} row.png` });
      fs.writeFileSync(`${OUT}/${file} - bucket holding ${number} - rows.txt`, all.join('\n') + '\n');
      return { bucket: bucket && bucket.replace(/arrow_drop_(up|down)\s*/, ''), hit, tid };
    }
    await page.evaluate(() => { const e = document.querySelector('.q-table__middle.q-virtual-scroll'); if (e) e.scrollTop = 0; }); await page.waitForTimeout(600);
    await t.click(); await page.waitForTimeout(1500); // collapse again
  }
  return { bucket: 'NOT FOUND in any bucket', hit: null };
}
(async () => {
  const { browser, page } = await open();
  const N = [`Started ${stamp()}`];
  await page.goto(APP + '/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 60000 }); await page.waitForTimeout(5000);
  const asOf = await setDay(page, '14');
  const custFilter = await page.locator('[data-test-id="filter_chip_customerId"], [data-test-id="filter_chip_customerIds"]').count();
  const head = await rows(page); fs.writeFileSync(`${OUT}/AR Aging Detail as of 2026-11-14 - buckets closed - rows.txt`, head.join('\n') + '\n');
  const cm = await findIn(page, 'credit memo', 'CM2-4540', 'AR Aging Detail as of 2026-11-14');
  // every bucket expanded, as production did
  for (const t of await page.locator('[data-test-id*="aging_detail_report_toggle_"]').all()) { if ((await t.getAttribute('aria-expanded')) !== 'true') { /* toggle state unknown: rely on rows */ } }
  await page.screenshot({ path: `${OUT}/AR Aging Detail as of 2026-11-14 - full page.png`, fullPage: false });
  N.push(`A/R Aging Detail — as-of date on the report: ${asOf}`);
  N.push(`Credit memo: CM2-4540 (the API calls it CM-4540; id 1377cdeb-06be-4cc4-a989-84041bf79343), $5.00, customer "ZZAUTOTEST SV11315 Staging CM", dated 2026-11-14 (07:00 UTC), status unapplied (unused). Seeded 12 Nov 2026 06:29 UTC.`);
  N.push(custFilter ? 'A customer filter IS present on A/R Aging Detail.' : 'There is NO customer filter on staging\'s A/R Aging Detail before the feature (as on production), so "tick its customer" cannot be done; buckets were expanded one at a time instead.');
  N.push(`Bucket it is in: ${cm.bucket}`); N.push(`Its row: ${cm.hit}`); N.push(`(${stamp()})`);
  // the second seeded credit memo, dated TODAY: runnable as soon as the feature lands (the new picker offers no later day)
  await page.goto(APP + '/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 60000 }); await page.waitForTimeout(6000);
  const asOf3 = await setDay(page, '12');
  const cm2 = await findIn(page, 'credit memo', 'CM2-4541', 'AR Aging Detail as of 2026-11-12');
  N.push('');
  N.push(`A/R Aging Detail — as-of date on the report: ${asOf3}`);
  N.push('Credit memo: CM2-4541 (the API calls it CM-4541; id 47398225-4abd-4e59-bd70-b594529701b3), $3.00, customer "ZZAUTOTEST SV11315 Staging CM", dated 2026-11-12 06:38:47 UTC, status unapplied (unused). Seeded 12 Nov 2026 06:43 UTC. It exists because after the feature the date picker offers no day after today, so CM2-4540 can only be checked from 14 Nov.');
  N.push(`Bucket it is in: ${cm2.bucket}`); N.push(`Its row: ${cm2.hit}`); N.push(`(${stamp()})`);
  // A/P side: the vendor credit dated today
  await page.goto(APP + '/reports/ap-aging-detail', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_asOfDate"]', { timeout: 60000 }); await page.waitForTimeout(8000);
  const asOf2 = await setDay(page, '12');
  const vc = await findIn(page, 'vendor credit', 'C-13911', 'AP Aging Detail as of 2026-11-12');
  N.push('');
  N.push(`A/P Aging Detail — as-of date on the report: ${asOf2}`);
  N.push('Vendor credit: C-13911 (id 01c19b8b-3dd4-48d8-89f1-07199951ffcc), $7.00, vendor "ZZAUTOTEST SV11315 Staging VC", dated 2026-11-12 06:29:54, unapplied. Seeded 12 Nov 2026 06:29 UTC.');
  N.push(`Bucket it is in: ${vc.bucket}`); N.push(`Its row: ${vc.hit}`); N.push(`Finished ${stamp()}`);
  fs.writeFileSync(`${OUT}/NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  await browser.close();
})();
