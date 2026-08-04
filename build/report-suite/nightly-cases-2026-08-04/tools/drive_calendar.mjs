// Drive the Inventory Value date control exactly as a manual tester would:
// open the range dropdown, pick a past day on the calendar, Apply, read "As of" + Totals.
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { writeFileSync } from 'fs';
const DIR = new URL('../evidence/', import.meta.url).pathname;
const { browser, page } = await boot('admin');
const out = { observed_at_utc: new Date().toISOString(), build: 'v3.4.1-0ed4433', steps: [] };
const log = (s, o) => { out.steps.push({ step: s, ...o }); console.log('* ' + s + ' :: ' + JSON.stringify(o).slice(0, 500)); };

await page.goto('https://sv8582.qa.shopview.com/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(8000);

const readState = async () => await page.evaluate(() => {
  const t = document.body.innerText;
  return { as_of: (t.match(/As of[^\n]{0,30}/i) || [null])[0],
           range_btn: (t.match(/(This Month|Custom|Last 12 Months|Last Month|This Year|Last Year|Today|Yesterday|Last 30 Days|Last 90 Days)\nexpand_more/) || [null])[0],
           totals: (t.match(/Totals[^\n]*\n[^\n]*/i) || [null])[0],
           dollars: (t.match(/\$[\d,]+\.\d\d/g) || []).slice(0, 4) };
});
log('initial', await readState());

// open the range dropdown by clicking the button whose text starts with the current preset
const opened = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button,.q-btn')].find(x => /expand_more/.test(x.innerText) && /Month|Custom|Year|Days|Today|Yesterday/.test(x.innerText));
  if (!b) return false; const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
log('range button rect', opened);
if (opened) { await page.mouse.click(opened.x, opened.y); await page.waitForTimeout(2500); }
await page.screenshot({ path: DIR + 'cal-01-dropdown-open.png' });
const menu = await page.evaluate(() => {
  const t = document.body.innerText;
  return { presets: (t.match(/(Last 12 Months|This Month|Last Month|This Year|Last Year|Last 30 Days|Last 90 Days|Last 7 Days|Today|Yesterday|Custom)/g) || []).filter((v,i,a)=>a.indexOf(v)===i),
           has_apply: /\bApply\b/.test(t), month_hdr: (t.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}/g) || []),
           arrows: (t.match(/(chevron_left|chevron_right|arrow_left|arrow_right|keyboard_arrow_left)/g)||[]).filter((v,i,a)=>a.indexOf(v)===i) };
});
log('dropdown contents', menu);
writeFileSync(DIR + 'ui-calendar.json', JSON.stringify(out, null, 1));
await browser.close();
