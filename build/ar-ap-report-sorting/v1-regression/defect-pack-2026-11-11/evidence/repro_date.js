const { open } = require('./env');
const fs = require('fs'); const { execSync } = require('child_process');
const O = 'repro';
const marker = () => execSync("curl -s https://sv11315.qa.shopview.com/ | grep -o 'app-version\" content=\"[^\"]*' | cut -d'\"' -f3").toString().trim();
(async () => {
  const log = { start_marker: marker(), start_utc: new Date().toISOString(), runs: [] };
  const { browser, page, app } = await open('qa');
  for (const run of [1, 2]) {
    await page.goto(app + '/reports/ar-aging-detail', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-test-id="btn_dropdown_ardet_export"]', { timeout: 60000 }); await page.waitForTimeout(5000);
    await page.click('[data-test-id="btn_dropdown_ardet_export"]'); await page.waitForTimeout(800);
    if (run === 1) await page.screenshot({ path: `${O}/AR Aging Detail - Export menu.png` });
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click('[data-test-id="action_ardet_export_pdf"]')]);
    const f = `${O}/AR Aging Detail - run ${run}.pdf`; await dl.saveAs(f);
    const txt = execSync(`pdftotext -layout "${f}" -`).toString();
    const rows = txt.split('\n').filter((l) => /^\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2},? \d{4}\s/.test(l));
    log.runs.push({ run, utc: new Date().toISOString(), file: f, header: txt.split('\n').filter((l) => l.trim()).slice(0, 3), row_count: rows.length, first_rows: rows.slice(0, 3).map((l) => l.trim().replace(/\s{2,}/g, ' | ')), rows_with_comma: rows.filter((l) => /^\s*\w{3} \d{1,2}, \d{4}/.test(l)).length });
  }
  // app-wide reference on the same build: Sales By Customer expanded PDF
  await page.goto(app + '/reports/sales-by-customer', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(8000);
  try {
    await page.click('[data-test-id="btn_dropdown_sbc_export"]'); await page.waitForTimeout(800);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu [data-test-id^="action_"]')].map((e) => e.getAttribute('data-test-id') + '=' + e.innerText.trim()));
    const id = (items.find((i) => /expanded.*pdf/i.test(i)) || items.find((i) => /pdf/i.test(i)) || '').split('=')[0];
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), page.click(`[data-test-id="${id}"]`)]);
    const f = `${O}/Sales By Customer - same build.pdf`; await dl.saveAs(f);
    const txt = execSync(`pdftotext -layout "${f}" -`).toString();
    log.sbc = { menu: items, used: id, dates: [...new Set(txt.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2},? \d{4}\b/g) || [])].slice(0, 8) };
  } catch (e) { log.sbc = { error: e.message.slice(0, 200) }; }
  await browser.close();
  log.end_marker = marker(); log.end_utc = new Date().toISOString(); log.marker_unchanged = log.start_marker === log.end_marker;
  fs.writeFileSync(`${O}/repro-log.json`, JSON.stringify(log, null, 1)); console.log(JSON.stringify(log, null, 1));
})();
