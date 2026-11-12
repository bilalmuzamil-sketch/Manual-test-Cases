// Section 3 retry: Inventory Value "Download (PDF)" with Staging Heavy Duty - 9919 ticked, waiting up to 5 minutes and
// recording any on-screen message and the export call's HTTP answer (s3.js waited 90 s and saw no download).
const { open, APP, stamp, dir } = require('./stg');
const fs = require('fs');
const OUT = dir('3-files-and-links');
const LOC = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
(async () => {
  const { browser, ctx, page } = await open();
  const net = [];
  page.on('response', (r) => { if (/export|pdf/i.test(r.url()) && r.url().includes('/api/')) net.push(`${stamp()} ${r.status()} ${r.request().method()} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 160)}`); });
  page.on('requestfailed', (r) => { if (/export|pdf/i.test(r.url())) net.push(`${stamp()} FAILED ${r.failure()?.errorText} ${r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 160)}`); });
  await page.goto(APP + '/reports/inventory-value?locationIds=' + LOC, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="btn_dropdown_iv_export"]', { timeout: 60000 }); await page.waitForTimeout(8000);
  const chip = (await page.locator('[data-test-id="filter_chip_locationIds"]').innerText()).replace(/\s+/g, ' ');
  const t0 = stamp();
  await page.click('[data-test-id="btn_dropdown_iv_export"]'); await page.waitForTimeout(800);
  const dl = page.waitForEvent('download', { timeout: 300000 }).catch(() => null);
  const pop = ctx.waitForEvent('page', { timeout: 300000 }).catch(() => null);
  await page.click('[data-test-id="action_iv_export_pdf"]');
  const msgs = new Set();
  const poll = setInterval(async () => { try { (await page.evaluate(() => [...document.querySelectorAll('.q-notification, [role=alert]')].map((e) => e.innerText.trim().replace(/\s+/g, ' ')))).forEach((m) => m && msgs.add(m)); } catch (e) {} }, 1000);
  const first = await Promise.race([dl, pop]);
  clearInterval(poll);
  let res = 'nothing within 5 minutes';
  if (first && first.suggestedFilename) { const f = `${OUT}/Inventory Value - pdf - ${first.suggestedFilename()}`; await first.saveAs(f); res = 'downloaded ' + first.suggestedFilename() + ' (' + fs.statSync(f).size + ' bytes)'; }
  else if (first) { res = 'a new tab opened: ' + first.url().slice(0, 100); }
  await page.screenshot({ path: `${OUT}/Inventory Value - after Download (PDF) retry.png` });
  const note = `\nInventory Value — Download (PDF) retry\n  Clicked at ${t0} with chip "${chip}"; result at ${stamp()}: ${res}\n  Messages seen: ${[...msgs].join(' / ') || 'none'}\n  Export calls: ${net.join(' ; ') || 'none seen'}\n`;
  fs.appendFileSync(`${OUT}/NOTES.txt`, note); console.log(note);
  await browser.close();
})();
