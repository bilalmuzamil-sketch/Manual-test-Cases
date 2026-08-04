// observe_full.mjs — complete live observation of ONE report (SBC or SBR) with DATA present.
// SECRET-FREE. Usage: node observe_full.mjs <sales-by-customer|sales-by-representative>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid, openSelect, closeMenu, readToolbar } from './reportlib.mjs';

const slug = process.argv[2];
if (!slug) { console.error('usage: node observe_full.mjs <slug>'); process.exit(1); }
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

// 0. default state (This Month, likely empty) — the EMPTY STATE observation
rec.defaultLabel = await page.locator('span.date-range-label').first().innerText().catch(() => null);
rec.emptyState = await readGrid(page);
rec.emptyStateText = (await readToolbar(page)).bodyText.slice(0, 3000);
await page.screenshot({ path: OUT + 'state-default-empty.png', fullPage: true });
L('DEFAULT RANGE LABEL:', JSON.stringify(rec.defaultLabel));
L('EMPTY STATE body rows:', rec.emptyState.bodyRows?.length, '| text snippet:', JSON.stringify(rec.emptyStateText.slice(0, 300)));

// 1. date-range popup contents (presets, calendar, readout, Apply) then apply Last 12 Months
{
  const trig = page.locator('span.date-range-label').first();
  await clickEl(page, trig, 1700);
  rec.datePopup = await page.evaluate(() => {
    const m = Array.from(document.querySelectorAll('.q-menu, .q-dialog')).filter(e => e.getClientRects().length)[0];
    if (!m) return null;
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    return {
      presetOptions: Array.from(m.querySelectorAll('.preset-option')).map(p => ({
        text: txt(p), active: p.classList.contains('active') })),
      rangeIndicator: txt(m.querySelector('.range-indicator') || {}) || null,
      headerText: (m.innerText || '').trim().split('\n')[0],
      hasCalendar: !!m.querySelector('.q-date'),
      buttons: Array.from(m.querySelectorAll('.q-btn')).map(b => txt(b)).filter(Boolean),
      allText: txt(m).slice(0, 2000),
      customButtonPresent: /(^|\s)Custom(\s|$)/.test(txt(m)),
      todayPresent: /(^|\s)Today(\s|$)/.test(txt(m)),
    };
  });
  await page.screenshot({ path: OUT + 'date-range-popup.png' });
  await closeMenu(page);
  L('DATE PRESETS (' + (rec.datePopup?.presetOptions || []).length + '):',
    JSON.stringify((rec.datePopup?.presetOptions || []).map(p => p.text + (p.active ? '*' : ''))));
  L('  Custom button present?', rec.datePopup?.customButtonPresent, '| Today?', rec.datePopup?.todayPresent,
    '| buttons:', JSON.stringify(rec.datePopup?.buttons), '| readout:', JSON.stringify(rec.datePopup?.rangeIndicator));
}
rec.presetApply = await setPreset(page, 'Last 12 Months');
L('APPLIED Last 12 Months ->', JSON.stringify(rec.presetApply));
await page.waitForTimeout(4000);
rec.grid = await readGrid(page);
await page.screenshot({ path: OUT + 'state-12mo.png', fullPage: true });
L('HEADERS:', JSON.stringify(rec.grid.headRows?.map(r => r.map(c => c.text))));
L('SORT INDICATORS:', JSON.stringify(rec.grid.headRows?.[0]?.filter(c => c.sortIndicator).map(c => c.text)));
L('BODY ROWS:', rec.grid.bodyRows?.length);
(rec.grid.bodyRows || []).slice(0, 5).forEach((r, i) => L('  row' + i, JSON.stringify(r.cells)));
L('TFOOT/TOTALS:', JSON.stringify(rec.grid.tfoot));

// 2. expand the first data row -> child rows + the API call fired
rec.expand = {};
{
  const before = netlog.length;
  const firstCell = page.locator('tbody tr td:first-child').first();
  rec.expand.clicked = await clickEl(page, firstCell, 5000);
  rec.expand.apiCalls = netlog.slice(before).filter(n => n.url.includes('/api/'))
    .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
  rec.expand.grid = await readGrid(page);
  await page.screenshot({ path: OUT + 'row-expanded.png', fullPage: true });
  L('EXPAND api:', JSON.stringify(rec.expand.apiCalls.map(c => c.status + ' ' + c.path.slice(0, 170))));
  L('EXPAND rows now:', rec.expand.grid.bodyRows?.length);
  (rec.expand.grid.bodyRows || []).slice(0, 10).forEach((r, i) =>
    L('  r' + i, r.indentPx, JSON.stringify(r.cells), r.links.length ? 'LINKS=' + JSON.stringify(r.links) : ''));
}

// 3. column selector
{
  const btn = page.locator('[aria-label="Column Selection"]').first();
  if (await clickEl(page, btn, 1900)) {
    rec.columnSelector = await page.evaluate(() => {
      const ms = Array.from(document.querySelectorAll('.q-menu, .q-dialog')).filter(e => e.getClientRects().length);
      const m = ms[ms.length - 1]; if (!m) return { noMenu: true };
      const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
      return { allText: txt(m).slice(0, 3000),
        items: Array.from(m.querySelectorAll('.q-item')).map(i => ({ text: txt(i),
          checked: !!i.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy')
            || i.getAttribute('aria-checked') === 'true' })).filter(x => x.text),
        buttons: Array.from(m.querySelectorAll('.q-btn')).map(b => txt(b)).filter(Boolean) };
    });
    await page.screenshot({ path: OUT + 'column-selector.png' });
    await closeMenu(page);
  }
  L('COLUMN SELECTOR:', JSON.stringify((rec.columnSelector?.items || []).map(i => i.text + (i.checked ? '[on]' : '[off]'))));
  L('  buttons:', JSON.stringify(rec.columnSelector?.buttons));
}

// 4. every filter dropdown
rec.filters = [];
{
  const n = await page.locator('.q-select').count();
  for (let i = 0; i < n; i++) {
    const r = await openSelect(page, i);
    await page.screenshot({ path: OUT + `filter-${i}.png` });
    await closeMenu(page);
    rec.filters.push({ index: i, ...r });
    L('FILTER', i, JSON.stringify(r.label), '->', JSON.stringify((r.menu?.items || []).map(x => x.text).slice(0, 20)),
      'search?', r.menu?.hasSearchInput);
  }
}

// 5. export menu
{
  const btn = page.locator('[aria-label="Export report"]').first();
  if (await clickEl(page, btn, 1800)) {
    rec.exportMenu = await page.evaluate(() => {
      const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
      const m = ms[ms.length - 1]; if (!m) return { noMenu: true };
      return { items: Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()).filter(Boolean),
        allText: (m.innerText || '').trim().replace(/\s+/g, ' ') };
    });
    await page.screenshot({ path: OUT + 'export-menu.png' });
    await closeMenu(page);
  }
  L('EXPORT MENU:', JSON.stringify(rec.exportMenu?.items));
}

// 6. toolbar + Print sweep
rec.toolbar = await readToolbar(page);
L('TOOLBAR buttons:', JSON.stringify(rec.toolbar.buttons.map(b => b.text || b.aria).slice(0, 25)));
L('PRINT CONTROLS FOUND:', JSON.stringify(rec.toolbar.printControls));

// 7. sorting — click a text col and a numeric col, capture api + resulting order
rec.sorting = [];
for (const col of (slug === 'sales-by-customer' ? ['Customer', 'Subtotal', 'Margin %'] : ['Sales Representative', 'Subtotal', 'Margin %'])) {
  const th = page.locator('thead th').filter({ hasText: new RegExp('^' + col.replace(/[.%]/g, '\\$&')) }).first();
  const before = netlog.length;
  if (!(await clickEl(page, th, 4500))) { rec.sorting.push({ column: col, error: 'header not clickable' }); continue; }
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  const g = await readGrid(page);
  const hdr = g.headRows?.[0]?.find(h => h.text === col);
  rec.sorting.push({ column: col, apiCalls: calls, headerRaw: hdr?.raw, ariaSort: hdr?.ariaSort,
    firstRows: (g.bodyRows || []).slice(0, 4).map(r => r.cells) });
  L('SORT', col, '->', JSON.stringify((calls.slice(-1)[0] || '').match(/sortBy%5D=([^&]*)&pagination%5Bdescending%5D=(\w+)/)?.slice(1)),
    '| hdr:', JSON.stringify(hdr?.raw));
  // second click = reverse
  const before2 = netlog.length;
  await clickEl(page, th, 4000);
  const calls2 = netlog.slice(before2).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  rec.sorting[rec.sorting.length - 1].secondClick = {
    apiCalls: calls2, firstRows: (await readGrid(page)).bodyRows?.slice(0, 4).map(r => r.cells) };
  L('  reverse ->', JSON.stringify((calls2.slice(-1)[0] || '').match(/sortBy%5D=([^&]*)&pagination%5Bdescending%5D=(\w+)/)?.slice(1)));
}

// 8. mobile
{
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(4500);
  rec.mobile = await page.evaluate(() => {
    const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
    const t = document.querySelector('table');
    const sc = t && (t.closest('.q-table__middle') || t.parentElement);
    return { hasTable: !!t, tableScrollWidth: t ? t.scrollWidth : null,
      containerClientWidth: sc ? sc.clientWidth : null,
      horizontallyScrollable: sc && t ? t.scrollWidth > sc.clientWidth + 2 : null,
      overflowX: sc ? getComputedStyle(sc).overflowX : null,
      buttons: Array.from(document.querySelectorAll('button,.q-btn')).filter(b => b.getClientRects().length)
        .map(b => txt(b)).filter(Boolean).slice(0, 30),
      bodyText: txt(document.querySelector('main') || document.body).slice(0, 5000) };
  });
  await page.screenshot({ path: OUT + 'mobile-390.png', fullPage: true });
  L('MOBILE: scrollable=', rec.mobile.horizontallyScrollable, 'tableW=', rec.mobile.tableScrollWidth,
    'contW=', rec.mobile.containerClientWidth, 'overflowX=', rec.mobile.overflowX);
  await page.setViewportSize({ width: 1680, height: 1050 });
  await page.waitForTimeout(2500);
}

rec.allApiCalls = netlog.filter(n => n.url.includes('/api/'))
  .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
fs.writeFileSync(OUT + 'observe-full.json', JSON.stringify(rec, null, 1));
fs.writeFileSync(OUT + 'body-12mo.txt', rec.toolbar.bodyText);
L('\nwrote', OUT + 'observe-full.json');
await browser.close();
