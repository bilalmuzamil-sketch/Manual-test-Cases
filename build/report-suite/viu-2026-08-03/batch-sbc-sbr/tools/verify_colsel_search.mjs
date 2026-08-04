// verify_colsel_search.mjs — carefully re-verify two findings that must not be reported loosely:
//   (a) does unticking a column in the Column Selection menu actually remove the column?
//   (b) does typing in the entity filter's search box actually narrow the option list?
// SECRET-FREE. Usage: node verify_colsel_search.mjs <slug>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid, closeMenu } from './reportlib.mjs';

const slug = process.argv[2];
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);
const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(3500);

// ---------- (a) COLUMN SELECTOR ----------
rec.columnSelector = { steps: [] };
const headersNow = async () => (await readGrid(page)).headRows?.[0]?.map(h => h.text);
rec.columnSelector.headersBefore = await headersNow();

await clickEl(page, page.locator('[aria-label="Column Selection"]').first(), 2200);
rec.columnSelector.menuItems = await page.evaluate(() => {
  const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
  const m = ms[ms.length - 1]; if (!m) return null;
  return Array.from(m.querySelectorAll('.q-item')).map((i, idx) => ({
    idx, text: (i.innerText || '').trim(),
    checked: !!i.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy'),
    innerHTMLHead: i.innerHTML.slice(0, 160) }));
});
L('MENU ITEMS:'); (rec.columnSelector.menuItems || []).forEach(i => L('  ', i.idx, JSON.stringify(i.text), 'checked=' + i.checked));

// untick a MID-LIST metric column that certainly exists on screen
const target = (rec.columnSelector.menuItems || []).find(i => /Labor Margin|Parts Margin/.test(i.text))
  || (rec.columnSelector.menuItems || [])[1];
L('unticking:', JSON.stringify(target?.text));
const item = page.locator('.q-menu .q-item').nth(target.idx);
await clickEl(page, item, 3000);
rec.columnSelector.menuItemsAfterClick = await page.evaluate(() => {
  const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
  const m = ms[ms.length - 1]; if (!m) return null;
  return Array.from(m.querySelectorAll('.q-item')).map(i => ({ text: (i.innerText || '').trim(),
    checked: !!i.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy') }));
});
L('after click, that item checked =',
  (rec.columnSelector.menuItemsAfterClick || []).find(i => i.text === target.text)?.checked);
await page.screenshot({ path: OUT + 'colsel-after-untick.png' });
await closeMenu(page);
await page.waitForTimeout(2500);
rec.columnSelector.headersAfter = await headersNow();
rec.columnSelector.targetColumn = target?.text;
rec.columnSelector.removed = !(rec.columnSelector.headersAfter || []).includes(target.text);
L('HEADERS BEFORE:', JSON.stringify(rec.columnSelector.headersBefore));
L('HEADERS AFTER :', JSON.stringify(rec.columnSelector.headersAfter));
L('=> column removed?', rec.columnSelector.removed);
await page.screenshot({ path: OUT + 'colsel-effect.png', fullPage: true });

// put it back
await clickEl(page, page.locator('[aria-label="Column Selection"]').first(), 2000);
await clickEl(page, page.locator('.q-menu .q-item').nth(target.idx), 2500);
await closeMenu(page);
rec.columnSelector.headersRestored = await headersNow();
L('HEADERS RESTORED:', JSON.stringify(rec.columnSelector.headersRestored));

// ---------- (b) ENTITY FILTER SEARCH BOX ----------
if (slug === 'sales-by-customer') {
  rec.search = {};
  const sel = page.locator('.q-select').nth(2);
  await clickEl(page, sel, 2200);
  const read = () => page.evaluate(() => {
    const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
    const m = ms[ms.length - 1]; if (!m) return null;
    return { items: Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()),
      inputs: Array.from(m.querySelectorAll('input')).map(i => ({ v: i.value, ph: i.getAttribute('placeholder') })) };
  });
  rec.search.before = await read();
  L('OPTIONS BEFORE typing:', rec.search.before.items.length, JSON.stringify(rec.search.before.items.slice(0, 6)));
  L('menu inputs:', JSON.stringify(rec.search.before.inputs));
  // type into the search input INSIDE the menu (click it first so focus is right)
  const inp = page.locator('.q-menu input').first();
  if (await inp.count()) {
    await inp.click({ force: true }).catch(() => {});
    await inp.type('Zuline', { delay: 80 }).catch(() => {});
  } else {
    // fall back to the select's own inline input
    await page.keyboard.type('Zuline', { delay: 80 });
  }
  await page.waitForTimeout(3200);
  rec.search.after = await read();
  L('OPTIONS AFTER  typing "Zuline":', rec.search.after?.items?.length, JSON.stringify(rec.search.after?.items?.slice(0, 6)));
  L('menu inputs now:', JSON.stringify(rec.search.after?.inputs));
  rec.search.narrowed = (rec.search.after?.items?.length ?? 0) < (rec.search.before?.items?.length ?? 0);
  L('=> option list narrowed?', rec.search.narrowed);
  await page.screenshot({ path: OUT + 'filter-search-typed.png' });
}

fs.writeFileSync(OUT + 'colsel-search-verify.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'colsel-search-verify.json');
await browser.close();
