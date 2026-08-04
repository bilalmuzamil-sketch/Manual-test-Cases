// Live UI observation (READ-ONLY navigation): can a NON-TECHNICAL manual tester
// reach a past day's stored figures on Inventory Value, and is there any
// equivalent affordance on Work In Progress?  Rule 12 — observed, with evidence.
import { boot } from '../../viu-2026-08-03/tools/boot8582.mjs';
import { writeFileSync } from 'fs';
const DIR = new URL('../evidence/', import.meta.url).pathname;
const { browser, page, netlog } = await boot('admin');
const out = { observed_at_utc: new Date().toISOString(), build: 'v3.4.1-0ed4433', views: [] };

async function look(name, path) {
  await page.goto('https://sv8582.qa.shopview.com' + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6500);
  const txt = await page.evaluate(() => document.body.innerText);
  const rec = {
    name, path,
    as_of_text: (txt.match(/As of[^\n]{0,40}/gi) || []),
    date_labels: (txt.match(/(Last 12 Months|This Month|Last Month|This Year|Last Year|Last 30 Days|Last 90 Days|Today|Yesterday|Custom)/g) || [])
                   .filter((v, i, a) => a.indexOf(v) === i),
    has_calendar: /\b(Apply|Cancel)\b/.test(txt),
    snapshot_words: (txt.match(/(snapshot|history|recorded day)/gi) || []),
    first_800: txt.replace(/\n{2,}/g, '\n').slice(0, 800),
  };
  out.views.push(rec);
  await page.screenshot({ path: DIR + name + '.png', fullPage: false });
  console.log('=== ' + name + ' (' + path + ')');
  console.log('  As of  :', JSON.stringify(rec.as_of_text));
  console.log('  presets:', JSON.stringify(rec.date_labels));
  console.log('  snap   :', JSON.stringify(rec.snapshot_words.slice(0,5)));
}

await look('ui-inventory-value', '/reports/inventory-value');
await look('ui-work-in-progress', '/reports/work-in-progress');
out.netlog = netlog.filter(n => n.url.includes('reporting')).map(n => n.method + ' ' + n.status + ' ' + n.url.split('?')[0] + (n.url.includes('?') ? '?' + n.url.split('?')[1].slice(0,160) : ''));
writeFileSync(DIR + 'ui-observation.json', JSON.stringify(out, null, 1));
console.log('\n--- reporting calls the SPA made ---');
out.netlog.forEach(l => console.log('  ' + l));
await browser.close();
