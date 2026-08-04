// observe_deep.mjs — deep live observation of ONE report (SBC or SBR) on sv8582 with DATA present.
// SECRET-FREE (cookies read at runtime from /tmp via qa8582.mjs).
//
// Covers, in one run: the 12-month date range (so rows exist) · full header row with sort affordances ·
// the totals row · row-expand drill-down (and the API call it fires) · invoice link targets ·
// the column selector contents · the date-range popup presets · every filter dropdown's options ·
// the export menu entries · sorting · mobile viewport · and the whole rendered body text.
//
// Usage: node observe_deep.mjs <sales-by-customer|sales-by-representative>
import fs from 'fs';
import { boot, spaGo } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node observe_deep.mjs <slug>'); process.exit(1); }
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const log = (...a) => console.log(...a);

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

// ---------- helper: click any element by its centre coordinate (Quasar-safe) ----------
async function clickEl(locator, waitMs = 1200) {
  const bb = await locator.boundingBox().catch(() => null);
  if (!bb) return false;
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(waitMs);
  return true;
}

// ---------- 1. widen the date range to Last 12 Months so rows exist ----------
rec.dateRange = {};
const drLabel = page.locator('span.date-range-label').first();
rec.dateRange.defaultLabel = await drLabel.innerText().catch(() => null);
if (await clickEl(drLabel, 1500)) {
  const popup = await page.evaluate(() => {
    const m = document.querySelector('.q-menu, .q-popup-proxy, .q-dialog');
    if (!m) return null;
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    return {
      presets: Array.from(m.querySelectorAll('.q-item, button, .q-btn'))
        .map(i => txt(i)).filter(Boolean),
      allText: txt(m).slice(0, 3000),
      hasCalendar: !!m.querySelector('.q-date'),
    };
  });
  rec.dateRange.popup = popup;
  await page.screenshot({ path: OUT + 'date-range-popup.png' });
  // pick Last 12 Months then Apply
  const p12 = page.locator('.q-menu .q-item, .q-menu .q-btn, .q-popup-proxy .q-item')
    .filter({ hasText: /^Last 12 Months$/ }).first();
  const clicked = await clickEl(p12, 1500);
  rec.dateRange.clickedLast12Months = clicked;
  const apply = page.locator('.q-menu button, .q-menu .q-btn, .q-popup-proxy .q-btn')
    .filter({ hasText: /^Apply$/ }).first();
  rec.dateRange.clickedApply = await clickEl(apply, 6000);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(3000);
  rec.dateRange.labelAfter = await drLabel.innerText().catch(() => null);
}
await page.screenshot({ path: OUT + 'page-12mo.png', fullPage: true });

// ---------- 2. header row + totals + sort affordances ----------
async function readGrid() {
  return page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const clean = s => s.replace(/arrow_drop_(up|down)/g, '').replace(/arrow_(upward|downward)/g, '')
      .replace(/keyboard_double_arrow_(down|up)/g, '').replace(/info_outline|help_outline/g, '').trim();
    const t = document.querySelector('table');
    if (!t) return { noTable: true };
    const headRows = Array.from(t.querySelectorAll('thead tr')).map(tr =>
      Array.from(tr.querySelectorAll('th,td')).map(th => ({
        text: clean(txt(th)), raw: txt(th),
        sortIndicator: /arrow_drop|arrow_upward|arrow_downward/.test(txt(th)),
        cls: th.className.toString().slice(0, 120),
        ariaSort: th.getAttribute('aria-sort'),
      })));
    // every visible tbody row that actually has cells (grid is virtualised → filter spacers)
    const bodyRows = Array.from(t.querySelectorAll('tbody tr'))
      .map(tr => Array.from(tr.querySelectorAll('td,th')).map(td => txt(td)))
      .filter(cells => cells.length > 1 && cells.some(c => c));
    const tfoot = Array.from(t.querySelectorAll('tfoot tr'))
      .map(tr => Array.from(tr.querySelectorAll('td,th')).map(td => txt(td)));
    return { headRows, bodyRows, tfoot, bodyRowCount: t.querySelectorAll('tbody tr').length };
  });
}
rec.grid12mo = await readGrid();
log('HEADERS:', JSON.stringify(rec.grid12mo.headRows?.map(r => r.map(c => c.text))));
log('BODY ROWS visible:', rec.grid12mo.bodyRows?.length, 'first:', JSON.stringify(rec.grid12mo.bodyRows?.[0]));
log('TFOOT:', JSON.stringify(rec.grid12mo.tfoot));

// ---------- 3. row expand (drill-down) + the API call it fires ----------
rec.expand = {};
{
  const before = netlog.length;
  // the expander is the first cell's chevron in a data row
  const exp = page.locator('tbody tr td:first-child .q-btn, tbody tr td:first-child i, tbody tr td:first-child button').first();
  rec.expand.clicked = await clickEl(exp, 4500);
  rec.expand.apiCalls = netlog.slice(before)
    .filter(n => n.url.includes('/api/'))
    .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
  rec.expand.gridAfter = await readGrid();
  await page.screenshot({ path: OUT + 'row-expanded.png', fullPage: true });
  log('EXPAND api:', JSON.stringify(rec.expand.apiCalls));
  log('EXPAND rows after:', rec.expand.gridAfter.bodyRows?.length);
  (rec.expand.gridAfter.bodyRows || []).slice(0, 8).forEach((r, i) => log('  r' + i + ':', JSON.stringify(r)));
}

// ---------- 4. links in the expanded child rows ----------
rec.links = await page.evaluate(() => Array.from(document.querySelectorAll('table a, table [href], table .cursor-pointer'))
  .slice(0, 40).map(a => ({ text: (a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
    href: a.getAttribute('href'), cls: a.className.toString().slice(0, 80) })));
log('LINKS:', JSON.stringify(rec.links.slice(0, 12)));

// ---------- 5. column selector ----------
rec.columnSelector = {};
{
  const btn = page.locator('button:has-text("width_normal"), .q-btn:has-text("width_normal"), [aria-label="Column Selection"]').first();
  if (await clickEl(btn, 1800)) {
    rec.columnSelector = await page.evaluate(() => {
      const m = document.querySelector('.q-menu, .q-dialog');
      if (!m) return { noMenu: true };
      const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
      return {
        allText: txt(m).slice(0, 3000),
        items: Array.from(m.querySelectorAll('.q-item, .q-checkbox, .q-toggle')).map(i => ({
          text: txt(i),
          checked: i.getAttribute('aria-checked') === 'true'
            || !!i.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy'),
        })).filter(x => x.text),
        buttons: Array.from(m.querySelectorAll('button, .q-btn')).map(b => txt(b)).filter(Boolean),
      };
    });
    await page.screenshot({ path: OUT + 'column-selector.png' });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(700);
  }
  log('COLUMN SELECTOR items:', JSON.stringify((rec.columnSelector.items || []).map(i => i.text + (i.checked ? '[on]' : '[off]'))));
  log('COLUMN SELECTOR buttons:', JSON.stringify(rec.columnSelector.buttons));
}

// ---------- 6. every filter dropdown's options ----------
rec.filters = [];
{
  const sels = await page.locator('.q-select').all();
  for (let i = 0; i < sels.length; i++) {
    const label = await sels[i].innerText().catch(() => '');
    const before = netlog.length;
    if (!(await clickEl(sels[i], 1800))) { rec.filters.push({ index: i, label, error: 'not clickable' }); continue; }
    const opts = await page.evaluate(() => {
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => m.offsetParent !== null);
      const m = menus[menus.length - 1];
      if (!m) return null;
      const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
      return { items: Array.from(m.querySelectorAll('.q-item')).map(x => txt(x)).filter(Boolean).slice(0, 60),
        allText: txt(m).slice(0, 1500),
        hasSearch: !!m.querySelector('input'),
      };
    });
    rec.filters.push({ index: i, label: label.replace(/\s+/g, ' ').trim(), options: opts,
      apiOnOpen: netlog.slice(before).filter(n => n.url.includes('/api/')).map(n => n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 160)) });
    await page.screenshot({ path: OUT + `filter-${i}.png` });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(700);
    log('FILTER', i, JSON.stringify(label.replace(/\s+/g, ' ').trim()), '->', JSON.stringify(opts?.items?.slice(0, 15)));
  }
}

// ---------- 7. export / overflow menu ----------
rec.exportMenu = {};
{
  const btn = page.locator('button:has-text("more_horiz"), .q-btn:has-text("more_horiz"), [aria-label="Export report"]').first();
  if (await clickEl(btn, 1600)) {
    rec.exportMenu = await page.evaluate(() => {
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m => m.offsetParent !== null);
      const m = menus[menus.length - 1];
      if (!m) return { noMenu: true };
      const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
      return { items: Array.from(m.querySelectorAll('.q-item')).map(x => txt(x)).filter(Boolean), allText: txt(m).slice(0, 1200) };
    });
    await page.screenshot({ path: OUT + 'export-menu.png' });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(600);
  }
  log('EXPORT MENU:', JSON.stringify(rec.exportMenu.items));
}

// ---------- 8. toolbar buttons + any Print control (Print is retired by ruling) ----------
rec.toolbar = await page.evaluate(() => {
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
  const main = document.querySelector('main') || document.body;
  return {
    buttons: Array.from(main.querySelectorAll('button, .q-btn, [role=button]'))
      .filter(b => b.offsetParent !== null)
      .map(b => ({ text: txt(b), aria: b.getAttribute('aria-label'), title: b.getAttribute('title'),
        disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' }))
      .filter(b => b.text || b.aria || b.title),
    printMatches: (document.body.innerText.match(/print/gi) || []).length,
    bodyText: txt(main).slice(0, 20000),
  };
});
log('PRINT occurrences in page text:', rec.toolbar.printMatches);

// ---------- 9. sorting: click a numeric header, capture the API call + order ----------
rec.sorting = [];
for (const colName of ['Subtotal', 'Margin %']) {
  const th = page.locator('thead th').filter({ hasText: colName }).first();
  const before = netlog.length;
  if (await clickEl(th, 4000)) {
    const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting'))
      .map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
    const g = await readGrid();
    rec.sorting.push({ column: colName, apiCalls: calls,
      headerRaw: g.headRows?.[0]?.find(h => h.text === colName) || null,
      firstRows: (g.bodyRows || []).slice(0, 4) });
    log('SORT', colName, '->', JSON.stringify(calls.slice(-1)));
  }
}

// ---------- 10. mobile viewport ----------
{
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(4000);
  rec.mobile = await page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const t = document.querySelector('table');
    const sc = t && t.closest('.q-table__middle, .scroll, [style*="overflow"]');
    return {
      hasTable: !!t,
      tableScrollWidth: t ? t.scrollWidth : null,
      containerClientWidth: sc ? sc.clientWidth : null,
      horizontallyScrollable: sc ? t.scrollWidth > sc.clientWidth + 2 : null,
      visibleButtons: Array.from(document.querySelectorAll('button,.q-btn')).filter(b => b.offsetParent !== null)
        .map(b => txt(b)).filter(Boolean).slice(0, 25),
      bodyText: txt(document.querySelector('main') || document.body).slice(0, 4000),
    };
  });
  await page.screenshot({ path: OUT + 'mobile.png', fullPage: true });
  log('MOBILE scrollable:', rec.mobile.horizontallyScrollable, 'tableW', rec.mobile.tableScrollWidth, 'contW', rec.mobile.containerClientWidth);
  await page.setViewportSize({ width: 1680, height: 1050 });
  await page.waitForTimeout(2500);
}

// ---------- 11. full API call log ----------
rec.allApiCalls = netlog.filter(n => n.url.includes('/api/'))
  .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));

fs.writeFileSync(OUT + 'observe-deep.json', JSON.stringify(rec, null, 1));
fs.writeFileSync(OUT + 'body-12mo.txt', rec.toolbar.bodyText || '');
log('\nwrote', OUT + 'observe-deep.json');
await browser.close();
