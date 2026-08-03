// capture_exports.mjs — click every export entry on a report's overflow menu, capture the
// generated file, and record the export ENDPOINT + the file's actual headers/content.
// This is the end-to-end Location-column check (on screen AND in each export).
//
// Usage: node capture_exports.mjs <route-slug>
import fs from 'fs';
import path from 'path';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node capture_exports.mjs <route-slug>'); process.exit(1); }
const OUT = new URL(`../evidence/${slug}/exports/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

// on-screen column headers, for the side-by-side comparison
const onScreen = await page.evaluate(() => {
  const t = document.querySelector('table');
  if (!t) return [];
  return Array.from(t.querySelectorAll('thead tr')).slice(-1)[0]
    ?.querySelectorAll('th,td') ? Array.from(t.querySelectorAll('thead tr')).map(tr =>
      Array.from(tr.querySelectorAll('th,td')).map(th => (th.innerText || '').trim()
        .replace(/arrow_drop_(up|down)/g, '').replace(/keyboard_double_arrow_down/g, '')
        .replace(/info_outline/g, '').trim())) : [];
});

async function openOverflow() {
  const btn = page.locator('button:has-text("more_horiz"), .q-btn:has-text("more_horiz")').first();
  const b = await btn.boundingBox();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1200);
}
await openOverflow();
const entries = await page.evaluate(() => Array.from(document.querySelectorAll('.q-menu .q-item'))
  .map(i => (i.innerText || '').trim()).filter(Boolean));
await page.keyboard.press('Escape'); await page.waitForTimeout(400);
console.log('EXPORT ENTRIES:', JSON.stringify(entries));

const results = [];
for (const label of entries) {
  const before = netlog.length;
  await openOverflow();
  const dlPromise = page.waitForEvent('download', { timeout: 60000 }).catch(() => null);
  const item = page.locator('.q-menu .q-item', { hasText: label }).first();
  const bb = await item.boundingBox().catch(() => null);
  if (!bb) { results.push({ label, error: 'menu item not clickable' }); await page.keyboard.press('Escape'); continue; }
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  const dl = await dlPromise;
  await page.waitForTimeout(3500);
  const calls = netlog.slice(before).filter(n => n.url.includes('shopview.com/api/'))
    .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
  const rec = { label, endpointCalls: calls };
  if (dl) {
    const fname = (dl.suggestedFilename() || 'export.bin');
    const dest = OUT + label.replace(/[^a-z0-9]+/gi, '-') + '__' + fname;
    await dl.saveAs(dest).catch(e => rec.saveError = String(e).slice(0, 150));
    rec.file = path.basename(dest);
    rec.suggestedFilename = fname;
    if (fs.existsSync(dest)) {
      rec.bytes = fs.statSync(dest).size;
      if (/\.csv$/i.test(fname)) {
        const txt = fs.readFileSync(dest, 'utf8');
        rec.csvFirstLines = txt.split(/\r?\n/).slice(0, 12);
      }
    }
  } else { rec.noDownload = true; }
  results.push(rec);
  console.log('---', label, '->', rec.file || (rec.noDownload ? 'NO DOWNLOAD EVENT' : ''), rec.bytes ? rec.bytes + 'B' : '');
  for (const c of calls) console.log('    ', c.status, c.method, c.path.slice(0, 220));
  if (rec.csvFirstLines) rec.csvFirstLines.forEach((l, i) => console.log('    csv[' + i + ']:', l.slice(0, 300)));
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(600);
}

fs.writeFileSync(OUT + 'exports.json', JSON.stringify({ slug, onScreenHeaderRows: onScreen, entries, results }, null, 2));
console.log('\nON-SCREEN HEADERS:', JSON.stringify(onScreen));
await browser.close();
