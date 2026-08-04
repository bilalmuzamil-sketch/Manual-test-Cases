// probe_colselector.mjs — dump the Column Selection menu's real DOM for a report, then prove a
// toggle actually changes the rendered header row. The earlier pass's coordinate-click on
// `.q-menu .q-item` did NOT change the headers, so the interaction had to be re-derived.
// SECRET-FREE. Usage: NODE_USE_ENV_PROXY=1 node probe_colselector.mjs <report-slug> <ColumnLabel>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const SLUG = process.argv[2] || 'work-in-progress';
const WANT = process.argv[3] || 'Location';
const OUT = '/tmp/report-suite-viu/colsel-' + SLUG + '.json';

const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/' + SLUG, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(11000);

const heads = () => page.evaluate(() => Array.from(document.querySelectorAll('table thead th, table thead td'))
  .map(th => (th.innerText || '').replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim())
  .filter(Boolean));

const res = { slug: SLUG, buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };
res.headersBefore = await heads();

// open the Column Selection button by its accessible name (proven stable: aria-label="Column Selection")
const btn = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="button_column_selection"], [aria-label="Column Selection"]');
  if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
res.colSelButtonFound = !!btn;
if (btn) { await page.mouse.click(btn.x, btn.y); await page.waitForTimeout(1800); }

// full structural dump of the open menu
res.menuDump = await page.evaluate(() => {
  const m = document.querySelector('.q-menu');
  if (!m) return null;
  const items = Array.from(m.querySelectorAll('.q-item')).map((it, i) => ({
    i,
    text: (it.innerText || '').trim(),
    cls: it.className,
    hasToggle: !!it.querySelector('.q-toggle'),
    hasCheckbox: !!it.querySelector('.q-checkbox'),
    ariaChecked: it.querySelector('[aria-checked]')?.getAttribute('aria-checked') ?? null,
    inputChecked: (() => { const inp = it.querySelector('input'); return inp ? inp.getAttribute('aria-checked') ?? String(inp.checked) : null; })(),
    toggleClass: it.querySelector('.q-toggle')?.className ?? null,
  }));
  return { outerHTMLHead: m.outerHTML.slice(0, 1500), itemCount: items.length, items };
});

// toggle the wanted column by clicking its q-item's toggle control, then confirm the header row changed
async function clickItem(label) {
  return page.evaluate(l => {
    const m = document.querySelector('.q-menu'); if (!m) return null;
    const it = Array.from(m.querySelectorAll('.q-item')).find(x => (x.innerText || '').trim() === l);
    if (!it) return null;
    const tgt = it.querySelector('.q-toggle') || it;
    const r = tgt.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, tag: tgt.className };
  }, label);
}
const c = await clickItem(WANT);
res.wantedItem = { label: WANT, found: !!c, target: c };
if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(2000); }
res.headersWhileMenuOpen = await heads();
await page.keyboard.press('Escape');
await page.waitForTimeout(2500);
res.headersAfterToggleOn = await heads();
await page.screenshot({ path: `/tmp/report-suite-viu/colsel-${SLUG}-after-on.png`, fullPage: false });

// toggle it back OFF and confirm it disappears again
if (btn) { await page.mouse.click(btn.x, btn.y); await page.waitForTimeout(1600); }
const c2 = await clickItem(WANT);
if (c2) { await page.mouse.click(c2.x, c2.y); await page.waitForTimeout(2000); }
await page.keyboard.press('Escape');
await page.waitForTimeout(2500);
res.headersAfterToggleOff = await heads();

fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log('BEFORE      ', JSON.stringify(res.headersBefore));
console.log('AFTER ON    ', JSON.stringify(res.headersAfterToggleOn));
console.log('AFTER OFF   ', JSON.stringify(res.headersAfterToggleOff));
console.log('MENU ITEMS  ', res.menuDump ? res.menuDump.items.map(i => `${i.text}[toggle=${i.hasToggle} checked=${i.inputChecked ?? i.ariaChecked}]`).join(' · ') : 'NO MENU');
console.log('WROTE', OUT);
await browser.close();
