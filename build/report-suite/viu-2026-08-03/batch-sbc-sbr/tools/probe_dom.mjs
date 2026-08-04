// probe_dom.mjs — one-off DOM structure probe: find the real selectors for the date-range presets,
// the filter dropdown menus and the export menu on a report page. SECRET-FREE.
// Usage: node probe_dom.mjs <slug>
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const slug = process.argv[2] || 'sales-by-customer';
const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

async function clickEl(loc, w = 1400) {
  const bb = await loc.boundingBox().catch(() => null);
  if (!bb) return false;
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(w); return true;
}

// --- date range popup: dump every element containing a preset word ---
await clickEl(page.locator('span.date-range-label').first(), 1800);
const dr = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const t = (el.textContent || '').trim();
    if (/^(Last 12 Months|This Year|This Month|Last Week|Range: \d+ days|Apply)$/.test(t) && el.children.length === 0) {
      out.push({ text: t, tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 160),
        parentTag: el.parentElement?.tagName.toLowerCase(), parentCls: el.parentElement?.className.toString().slice(0, 160) });
    }
  }
  return out;
});
console.log('=== DATE PRESET ELEMENTS ===');
dr.forEach(d => console.log(JSON.stringify(d)));
await page.keyboard.press('Escape'); await page.waitForTimeout(600);

// --- filter dropdown: what container appears? ---
const sels = await page.locator('.q-select').all();
console.log('=== q-select count:', sels.length);
for (let i = 1; i < sels.length; i++) {
  const lbl = (await sels[i].innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  await clickEl(sels[i], 2000);
  const info = await page.evaluate(() => {
    const cands = ['.q-menu', '.q-dialog', '.q-popup-proxy', '[role=listbox]'];
    const found = {};
    for (const c of cands) {
      const els = Array.from(document.querySelectorAll(c));
      found[c] = els.map(e => ({ visible: e.offsetParent !== null || e.getClientRects().length > 0,
        cls: e.className.toString().slice(0, 100),
        text: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 400),
        itemCount: e.querySelectorAll('.q-item').length }));
    }
    return found;
  });
  console.log('--- FILTER', i, JSON.stringify(lbl));
  for (const [k, v] of Object.entries(info)) if (v.length) console.log('   ', k, JSON.stringify(v).slice(0, 900));
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}

// --- export menu ---
await clickEl(page.locator('[aria-label="Export report"], button:has-text("more_horiz")').first(), 1800);
const ex = await page.evaluate(() => Array.from(document.querySelectorAll('.q-menu, .q-dialog, [role=menu]'))
  .map(e => ({ cls: e.className.toString().slice(0, 100), rects: e.getClientRects().length,
    text: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 500),
    items: Array.from(e.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()) })));
console.log('=== EXPORT MENU CONTAINERS ==='); ex.forEach(e => console.log(JSON.stringify(e)));
await browser.close();
