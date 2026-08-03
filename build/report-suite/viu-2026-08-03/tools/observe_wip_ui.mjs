// observe_wip_ui.mjs — drive the WIP report in the UI with a date range that HAS data, so the
// Asset cell's actual rendering and the Location column's on-screen behaviour can be OBSERVED
// (Rule 12) rather than inferred from the payload.
// Settles: WIP-COL-05 (asset identifier), WIP-COL-02 (is Location automatic or a toggle?),
// WIP-PERS-01 (Total not offered), the Totals row, and the tab counts.
import fs from 'fs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';

const OUT = new URL('../evidence/work-in-progress/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
const res = { slug: 'work-in-progress', buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

// --- widen the date range to "Last 12 Months" so rows exist ---
async function pickRange(label) {
  const box = await page.evaluate(() => {
    const e = document.querySelector('.date-range-label'); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!box) return 'no date-range-label';
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(1800);
  const clicked = await page.evaluate(l => {
    const items = Array.from(document.querySelectorAll('.q-menu *')).filter(e => e.children.length === 0 && (e.textContent || '').trim() === l);
    if (!items.length) return false; items[0].click(); return true;
  }, label);
  await page.waitForTimeout(1200);
  const applied = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.q-menu button, .q-menu .q-btn')).find(x => /Apply/i.test(x.innerText || ''));
    if (b) { b.click(); return true; } return false;
  });
  await page.waitForTimeout(7000);
  return { clicked, applied };
}
res.rangePick = await pickRange('Last 12 Months');
res.dateButtonAfter = await page.evaluate(() => document.querySelector('.date-range-label')?.textContent?.trim());

// --- read the table as rendered ---
const readTable = () => page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const clean = s => (s || '').trim().replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim();
  return {
    headers: Array.from(t.querySelectorAll('thead tr')).map(tr => Array.from(tr.querySelectorAll('th,td')).map(th => clean(th.innerText))),
    rows: Array.from(t.querySelectorAll('tbody tr')).slice(0, 4).map(tr =>
      Array.from(tr.querySelectorAll('td,th')).map(td => ({ text: (td.innerText || '').trim(), html: td.innerHTML.slice(0, 260) }))),
    lastRow: (() => { const rs = Array.from(t.querySelectorAll('tbody tr, tfoot tr')); const l = rs[rs.length - 1];
      return l ? Array.from(l.querySelectorAll('td,th')).map(td => (td.innerText || '').trim()) : null; })(),
    rowCount: t.querySelectorAll('tbody tr').length,
  };
});
res.tabs = await page.evaluate(() => Array.from(document.querySelectorAll('.q-tab, [role=tab]')).map(t => (t.innerText || '').trim()));
res.defaultTable = await readTable();
await page.screenshot({ path: OUT + 'with-data-default-columns.png', fullPage: true });

// --- turn ON the VIN + Location + Inv. Hrs toggles and re-read ---
async function openColumnSelector() {
  const b = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.q-btn')).find(x => /width_normal/.test(x.innerText || ''));
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  if (!b) return false;
  await page.mouse.click(b.x, b.y); await page.waitForTimeout(1500); return true;
}
await openColumnSelector();
res.columnSelectorItems = await page.evaluate(() => Array.from(document.querySelectorAll('.q-menu .q-item'))
  .map(i => ({ text: (i.innerText || '').trim(), ariaChecked: i.getAttribute('aria-checked'),
    toggleOn: !!i.querySelector('.q-toggle--truthy, [aria-checked=true], input:checked') })));
for (const want of ['VIN', 'Location', 'Inv. Hrs']) {
  const ok = await page.evaluate(w => {
    const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => (i.innerText || '').trim() === w);
    if (!it) return false; it.click(); return true;
  }, want);
  res['toggled_' + want.replace(/\W/g, '')] = ok;
  await page.waitForTimeout(900);
}
await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
res.tableWithVinLocationInvHrs = await readTable();
await page.screenshot({ path: OUT + 'with-vin-location-invhrs.png', fullPage: true });

fs.writeFileSync(OUT + 'ui-observations.json', JSON.stringify(res, null, 2));
console.log('date button now:', res.dateButtonAfter, '| range pick:', JSON.stringify(res.rangePick));
console.log('tabs:', JSON.stringify(res.tabs));
console.log('DEFAULT headers:', JSON.stringify(res.defaultTable?.headers));
console.log('DEFAULT rowCount:', res.defaultTable?.rowCount);
console.log('DEFAULT row1:', JSON.stringify(res.defaultTable?.rows?.[0]?.map(c => c.text)));
console.log('DEFAULT row1 ASSET CELL HTML:', res.defaultTable?.rows?.[0]?.[3]?.html);
console.log('DEFAULT lastRow:', JSON.stringify(res.defaultTable?.lastRow));
console.log('COLUMN SELECTOR:', JSON.stringify(res.columnSelectorItems));
console.log('AFTER toggles headers:', JSON.stringify(res.tableWithVinLocationInvHrs?.headers));
console.log('AFTER toggles row1:', JSON.stringify(res.tableWithVinLocationInvHrs?.rows?.[0]?.map(c => c.text)));
await browser.close();
