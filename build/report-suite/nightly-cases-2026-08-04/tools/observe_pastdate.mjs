// Drive the Inventory Value report to a PAST end date in the UI and read back the
// "As of" indicator + the Totals row.  This is the manual verification route under test.
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { writeFileSync } from 'fs';
const DIR = new URL('../evidence/', import.meta.url).pathname;
const { browser, page } = await boot('admin');
const out = { observed_at_utc: new Date().toISOString(), build: 'v3.4.1-0ed4433', attempts: [] };

async function read(label, url, shot) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(7000);
  const txt = await page.evaluate(() => document.body.innerText);
  const rec = { label, url,
    as_of: (txt.match(/As of[^\n]{0,30}/i) || [null])[0],
    totals_line: (txt.match(/\$[\d,]+\.\d\d/g) || []).slice(0, 6),
    date_shown: (txt.match(/\d\d\/\d\d\/\d{4}\s*-\s*\d\d\/\d\d\/\d{4}/) || [null])[0] };
  out.attempts.push(rec);
  if (shot) await page.screenshot({ path: DIR + shot + '.png' });
  console.log(label, '| as_of:', rec.as_of, '| range:', rec.date_shown, '| $:', JSON.stringify(rec.totals_line));
  return rec;
}

// 1. default view
await read('default', 'https://sv8582.qa.shopview.com/reports/inventory-value', 'iv-default-today');
// 2. try URL-driven past date (several param spellings)
for (const qs of ['?range=custom&start_date=2026-07-31&end_date=2026-07-31',
                  '?start_date=2026-07-31&end_date=2026-07-31',
                  '?from=2026-07-31&to=2026-07-31']) {
  await read('url ' + qs, 'https://sv8582.qa.shopview.com/reports/inventory-value' + qs, null);
}
writeFileSync(DIR + 'ui-pastdate.json', JSON.stringify(out, null, 1));
await browser.close();
