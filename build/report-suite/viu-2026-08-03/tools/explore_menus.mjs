// explore_menus.mjs — open every menu/dropdown on a report page and record its EXACT wording.
// This is what settles export-control wording, the date-range option list, filter option lists,
// and whether a COLUMN SELECTOR exists (and what it offers).
// Read-only: opens menus and reads text; changes no data.
//
// Usage: node explore_menus.mjs <route-slug>
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node explore_menus.mjs <route-slug>'); process.exit(1); }
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

const result = { slug, menus: [] };

// read whatever popup/menu/dialog is currently open
async function readOpen() {
  return page.evaluate(() => {
    const t = el => (el.innerText || '').trim();
    const pops = Array.from(document.querySelectorAll('.q-menu, .q-dialog, [role=menu], [role=listbox]'))
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    return pops.map(p => ({
      cls: p.className.toString().slice(0, 100),
      items: Array.from(p.querySelectorAll('.q-item, [role=option], [role=menuitem], .q-checkbox, .q-toggle'))
        .map(i => ({ text: t(i).replace(/\n+/g, ' | '),
          checked: i.getAttribute('aria-checked') || i.getAttribute('aria-selected') || null,
          disabled: i.getAttribute('aria-disabled') || null })).filter(i => i.text),
      wholeText: t(p).slice(0, 3000),
    }));
  });
}
async function closeAll() {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(350);
  await page.mouse.click(5, 5).catch(() => {});
  await page.waitForTimeout(350);
}

// Click a target by its rendered text/icon and capture what opens.
async function openAndRead(name, locator, idx = 0) {
  try {
    const el = locator.nth(idx);
    if (!(await el.count())) { result.menus.push({ name, error: 'not found' }); return; }
    const box = await el.boundingBox();
    if (!box) { result.menus.push({ name, error: 'not visible' }); return; }
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1600);
    const pops = await readOpen();
    result.menus.push({ name, popups: pops });
    console.log('--- ' + name + ' ---');
    for (const p of pops) console.log('  items:', JSON.stringify(p.items.map(i => i.text)));
    if (!pops.length) console.log('  (nothing opened; page text may have changed inline)');
    await page.screenshot({ path: OUT + 'menu-' + name.replace(/[^a-z0-9]+/gi, '-') + '.png' });
  } catch (e) { result.menus.push({ name, error: String(e).slice(0, 200) }); console.log('--- ' + name + ' --- ERROR', String(e).slice(0, 120)); }
  await closeAll();
}

// 1. the ⋮ / more_horiz overflow (export + likely column controls)
await openAndRead('more_horiz-overflow', page.locator('button:has-text("more_horiz"), .q-btn:has-text("more_horiz")'));
// 2. the width/density control
await openAndRead('width_normal', page.locator('button:has-text("width_normal"), .q-btn:has-text("width_normal")'));
// 3. the date-range selector
await openAndRead('date-range', page.locator('.q-btn:has-text("expand_more")'));
// 4. each filter select, by index
const nSel = await page.locator('.q-select').count();
console.log('q-select count:', nSel);
for (let i = 0; i < Math.min(nSel, 8); i++) {
  const lbl = await page.locator('.q-select').nth(i).innerText().catch(() => '') || ('select' + i);
  await openAndRead('filter-' + i + '-' + lbl.replace(/\n/g, ' ').trim().slice(0, 24), page.locator('.q-select'), i);
}

fs.writeFileSync(OUT + 'menus.json', JSON.stringify(result, null, 2));
console.log('\nwrote', OUT + 'menus.json');
await browser.close();
