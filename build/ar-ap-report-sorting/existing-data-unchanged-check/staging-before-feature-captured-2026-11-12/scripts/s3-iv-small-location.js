// Section 3 extra (staging): Inventory Value's PDF fails for Staging Heavy Duty - 9919 before the feature (HTTP 500,
// "too large"), so C715475 also gets a baseline it can compare: Inventory Value with ONLY "DVI Test" ticked —
// screenshot, both downloads, page address.
const { open, APP, stamp, dir } = require('./stg');
const fs = require('fs');
const OUT = dir('3-files-and-links');
const LOC = ['39522bc6-abca-4f67-bd12-2840043c2d68', 'DVI Test'];
(async () => {
  const { browser, page } = await open();
  await page.goto(APP + '/reports/inventory-value', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-test-id="filter_chip_locationIds"]', { timeout: 60000 }); await page.waitForTimeout(5000);
  await page.click('[data-test-id="filter_chip_locationIds"]'); await page.waitForTimeout(1000);
  await page.click('[data-test-id="filter_clear_selection_locationIds"]'); await page.waitForTimeout(800);
  await page.click(`[data-test-id="filter_option_locationIds_${LOC[0]}"]`); await page.waitForTimeout(800);
  await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
  const chip = (await page.locator('[data-test-id="filter_chip_locationIds"]').innerText()).replace(/\s+/g, ' ').replace(/place|keyboard_arrow_down|cancel/g, '').trim();
  const date = (await page.locator('[data-test-id="filter_chip_asOfDate"]').innerText()).replace(/\s+/g, ' ').replace(/calendar_today|keyboard_arrow_down/g, '').trim();
  await page.screenshot({ path: `${OUT}/Inventory Value (DVI Test) - one location ticked.png` });
  const files = [];
  for (const tid of ['action_iv_export_pdf', 'action_iv_export_csv']) {
    await page.click('[data-test-id="btn_dropdown_iv_export"]'); await page.waitForTimeout(800);
    const dl = page.waitForEvent('download', { timeout: 180000 });
    await page.click(`[data-test-id="${tid}"]`);
    const d = await dl.catch(() => null);
    if (d) { const f = `${OUT}/Inventory Value (DVI Test) - ${tid.replace('action_iv_export_', '')} - ${d.suggestedFilename()}`; await d.saveAs(f); files.push(f.split('/').pop() + ' (' + fs.statSync(f).size + ' bytes)'); }
    else files.push(`${tid}: no download within 3 minutes`);
    await page.waitForTimeout(2000);
  }
  fs.writeFileSync(`${OUT}/Inventory Value (DVI Test) - page address.txt`, page.url() + '\n');
  const note = `\nInventory Value with ONLY DVI Test ticked (${stamp()}) — the baseline C715475 can compare, since the Heavy Duty PDF fails\n  ${date}\n  Location filter: ${chip}\n  Files: ${files.join(', ')}\n  Page address: ${page.url()}\n`;
  fs.appendFileSync(`${OUT}/NOTES.txt`, note); console.log(note);
  await browser.close();
})();
