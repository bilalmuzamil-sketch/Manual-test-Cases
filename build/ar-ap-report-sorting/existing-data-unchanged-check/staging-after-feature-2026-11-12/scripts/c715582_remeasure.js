// C715582 re-measure (Rule 120): the A/R Collection address saved before the upgrade, pasted as it is, read at 5, 15
// and 30 s, twice; plus a control: the same customer ticked through the new address form (customerIds=).
const { open, APP, stamp, dir, rows } = require('./stg');
const fs = require('fs');
const O = dir('6-drill-down-links');
const OLD = '/reports/ar-aging-collection?customerName=Mobile+Truck+%26+Trailer+Repair+Island+Lake&customerId=023402eb-206e-4a9b-8260-b42cdb330a9a';
const NEW = '/reports/ar-aging-collection?customerIds=023402eb-206e-4a9b-8260-b42cdb330a9a';
(async () => {
  const { browser, page } = await open();
  const calls = []; page.on('request', (r) => { if (/reports\/ar-aging-(collection|customers)/.test(r.url())) calls.push(stamp() + ' ' + r.url().replace('https://api.staging.shopview.com', '')); });
  const N = [];
  const read = async (tag) => {
    const chips = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="filter_chip_"]:not([data-test-id^="filter_chip_clear"])')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()));
    const groups = await page.evaluate(() => [...document.querySelectorAll('[data-test-id*="collection_report_row_"][data-test-id$="_cell_customer_name"]')].map((e) => e.innerText.trim()));
    const r = await rows(page);
    return `${tag} (${stamp()}): url ${page.url()} · chips ${chips.join(' | ')} · groups ${groups.length}: ${groups.slice(0, 5).join(' ; ')} · rows in view ${r.length}; first: ${r.slice(1, 3).join(' // ').slice(0, 300)}`;
  };
  for (const [label, url] of [['OLD address try 1', OLD], ['OLD address try 2', OLD], ['NEW address (control)', NEW]]) {
    calls.length = 0;
    await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
    await page.goto(APP + url, { waitUntil: 'domcontentloaded' });
    for (const s of [5, 15, 30]) { await page.waitForTimeout(s === 5 ? 5000 : s === 15 ? 10000 : 15000); N.push(await read(`${label} @${s}s`)); }
    await page.screenshot({ path: `${O}/C715582 ${label} at 30 s.png` });
    N.push(`  data calls: ${calls.join(' ; ').slice(0, 900)}`);
  }
  fs.writeFileSync(`${O}/C715582 re-measure NOTES.txt`, N.join('\n') + '\n'); console.log(N.join('\n'));
  await browser.close();
})();
