// Section 3 (staging): Inventory Value, Sales By Customer, Work In Progress — date left at its default (before the feature),
// exactly ONE location ticked (Staging Heavy Duty - 9919). After the feature: set IV and WIP to as of 12 Nov 2026 and
// Sales By Customer to November 2026 first, so the files cover the same period, then Download (PDF), Download (CSV) and the page address
const { open, APP, stamp, dir } = require('./stg');
const fs = require('fs');
const OUT = dir('3-files-and-links');
const R = [['inventory-value', 'Inventory Value', 'iv', 'asOfDate'], ['sales-by-customer', 'Sales By Customer', 'sbc', 'dateRange'], ['work-in-progress', 'Work In Progress', 'wip', 'asOfDate']];
const LOC = ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Staging Heavy Duty - 9919']; // the signed-in user's current (default) location
(async () => {
  const { browser, page } = await open();
  const notes = [`Started ${stamp()}`], menus = [];
  for (const [slug, name, k, dateChip] of R) {
    await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-test-id="filter_chip_locationIds"]', { timeout: 60000 }); await page.waitForTimeout(5000);
    await page.click('[data-test-id="filter_chip_locationIds"]'); await page.waitForTimeout(1000);
    await page.click('[data-test-id="filter_clear_selection_locationIds"]'); await page.waitForTimeout(800);
    const opts = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="filter_option_locationIds_"]')].map((e) => e.innerText.trim().replace(/\s+/g, ' ')));
    if (!(await page.locator(`[data-test-id="filter_option_locationIds_${LOC[0]}"]`).count())) throw new Error(name + ': location option ' + LOC[1] + ' not in the filter: ' + opts.join(', '));
    await page.click(`[data-test-id="filter_option_locationIds_${LOC[0]}"]`); await page.waitForTimeout(800);
    await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
    const chip = (await page.locator('[data-test-id="filter_chip_locationIds"]').innerText()).replace(/\s+/g, ' ').replace(/place|keyboard_arrow_down|cancel/g, '').trim();
    const date = (await page.locator(`[data-test-id="filter_chip_${dateChip}"]`).innerText()).replace(/\s+/g, ' ').replace(/calendar_today|keyboard_arrow_down/g, '').trim();
    await page.screenshot({ path: `${OUT}/${name} - one location ticked.png` });
    const files = [];
    // the export menu's own items (Sales By Customer has Summary and Expanded View variants before the release)
    await page.click(`[data-test-id="btn_dropdown_${k}_export"]`); await page.waitForTimeout(1000);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu [data-test-id^="action_"]')].map((e) => [e.getAttribute('data-test-id'), e.innerText.trim()]));
    await page.screenshot({ path: `${OUT}/${name} - export menu.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    menus.push(`${name} export menu: ${items.map((i) => i[1]).join(' | ')}`);
    for (const [tid] of items) {
      await page.click(`[data-test-id="btn_dropdown_${k}_export"]`); await page.waitForTimeout(800);
      const dl = page.waitForEvent('download', { timeout: 90000 });
      await page.click(`[data-test-id="${tid}"]`);
      const d = await dl.catch((e) => null);
      if (d) { const f = `${OUT}/${name} - ${tid.replace(/^action_\w+?_export_/, '')} - ${d.suggestedFilename()}`; await d.saveAs(f); files.push(f.split('/').pop()); }
      else files.push(`${tid}: no download started`);
      await page.waitForTimeout(1500);
    }
    const url = page.url();
    fs.writeFileSync(`${OUT}/${name} - page address.txt`, url + '\n');
    notes.push(`${name} (${stamp()})\n  ${date}\n  Location options listed: ${opts.join(' | ')}\n  Location filter: ${chip}\n  Files: ${files.join(', ')}\n  Page address: ${url}`);
    console.log(notes[notes.length - 1]);
  }
  fs.writeFileSync(`${OUT}/NOTES.txt`, notes.join('\n\n') + '\n\n' + menus.join('\n') + '\n');
  await browser.close();
})();
