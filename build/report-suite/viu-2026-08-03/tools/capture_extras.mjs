// capture_extras.mjs — the remaining build labels: the date-range option list, the
// icon-button TOOLTIPS (column selector / export / info icons), the empty-state text,
// and the expanded-row (drill-down) column headers.
// Usage: node capture_extras.mjs <route-slug>
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const slug = process.argv[2];
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
const res = { slug };

// ---------- 1. date-range picker ----------
const dateBtn = page.locator('.q-btn').filter({ hasText: /expand_more/ }).first();
try {
  const b = await dateBtn.boundingBox();
  res.dateButtonText = (await dateBtn.innerText()).replace(/\s+/g, ' ').trim();
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  await page.waitForTimeout(1500);
  res.dateRangeOptions = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.q-menu .q-item, .q-menu .q-list > *'))
      .map(i => (i.innerText || '').trim()).filter(Boolean));
  res.dateMenuWholeText = await page.evaluate(() => {
    const m = document.querySelector('.q-menu'); return m ? (m.innerText || '').slice(0, 1500) : null; });
  await page.screenshot({ path: OUT + 'menu-date-range.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
} catch (e) { res.dateRangeError = String(e).slice(0, 150); }

// ---------- 2. tooltips on every icon button ----------
res.tooltips = [];
const iconBtns = page.locator('.q-btn');
const n = await iconBtns.count();
for (let i = 0; i < Math.min(n, 24); i++) {
  const el = iconBtns.nth(i);
  const label = (await el.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  if (!/^(more_horiz|width_normal|info_outline|download|filter_list|view_column|refresh)$/.test(label)) continue;
  try {
    const b = await el.boundingBox(); if (!b) continue;
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(1300);
    const tip = await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.q-tooltip')).filter(e => {
        const r = e.getBoundingClientRect(); return r.width > 0; });
      return t.map(e => (e.innerText || '').trim());
    });
    const aria = await el.getAttribute('aria-label');
    const title = await el.getAttribute('title');
    res.tooltips.push({ icon: label, index: i, tooltip: tip, aria, title });
    await page.mouse.move(2, 2); await page.waitForTimeout(350);
  } catch {}
}

// ---------- 3. empty / zero state ----------
res.emptyStateText = await page.evaluate(() => {
  const main = document.querySelector('main') || document.body;
  const t = (main.innerText || '');
  const m = t.match(/(There (are|is) no[^\n]*|No (results|data|records)[^\n]*|Empty[^\n]*|Nothing[^\n]*|Get Going[^\n]*)/gi);
  return m ? [...new Set(m)] : [];
});

// ---------- 4. expanded / drill-down headers (click the first expander) ----------
try {
  const exp = page.locator('[class*=expand], .q-btn:has-text("keyboard_arrow_down"), tbody tr td:first-child .q-btn').first();
  const b = await exp.boundingBox();
  if (b) {
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(3000);
    res.afterExpandTables = await page.evaluate(() => Array.from(document.querySelectorAll('table')).map(t =>
      Array.from(t.querySelectorAll('thead tr')).map(tr => Array.from(tr.querySelectorAll('th,td'))
        .map(th => (th.innerText || '').trim().replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim()))));
    await page.screenshot({ path: OUT + 'after-expand.png', fullPage: true });
  }
} catch (e) { res.expandError = String(e).slice(0, 150); }

fs.writeFileSync(OUT + 'extras.json', JSON.stringify(res, null, 2));
console.log('=== ' + slug + ' extras ===');
console.log('date button:', res.dateButtonText);
console.log('date options:', JSON.stringify(res.dateRangeOptions));
console.log('tooltips:', JSON.stringify(res.tooltips));
console.log('empty-state:', JSON.stringify(res.emptyStateText));
console.log('after-expand tables:', JSON.stringify(res.afterExpandTables));
await browser.close();
