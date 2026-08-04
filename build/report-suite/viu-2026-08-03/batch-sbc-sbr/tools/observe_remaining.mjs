// observe_remaining.mjs — the remaining behaviours for BOTH reports: product-type filter, customer
// filter, column-selector effect, persistence across reload, empty state, error state, single-location
// column hiding, asset labels, and export-reflects-filters. SECRET-FREE.
// Usage: node observe_remaining.mjs <slug>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid, openSelect, closeMenu, readToolbar } from './reportlib.mjs';

const slug = process.argv[2];
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);
const { browser, page, netlog } = await boot('admin');
const lastReportCall = () => (netlog.filter(n => n.url.includes('/api/reporting/reports/' + slug)).slice(-1)[0]?.url || '')
  .replace(/^https:\/\/[^/]+/, '');

await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);

// ---------- 1. EMPTY STATE (default This Month has no data) ----------
rec.emptyState = { rangeLabel: await page.locator('span.date-range-label').first().innerText().catch(() => null) };
{
  const g = await readGrid(page);
  const tb = await readToolbar(page);
  rec.emptyState.bodyRows = g.bodyRows?.length;
  rec.emptyState.headers = g.headRows?.[0]?.map(h => h.text);
  rec.emptyState.message = await page.evaluate(() => {
    const t = document.querySelector('table');
    const cand = Array.from(document.querySelectorAll('.q-table__bottom, .q-table__middle, main div'))
      .map(e => (e.innerText || '').trim()).filter(x => x && x.length < 200
        && /no data|no result|nothing|empty|no invoices|no customers|no rep/i.test(x));
    return [...new Set(cand)].slice(0, 5);
  });
  rec.emptyState.fullText = tb.bodyText.slice(0, 1200);
  L('EMPTY STATE rows:', rec.emptyState.bodyRows, '| messages:', JSON.stringify(rec.emptyState.message));
  await page.screenshot({ path: OUT + 'empty-state.png', fullPage: true });
}

await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(4000);

// ---------- 2. PRODUCT TYPE filter, applied for real ----------
rec.productType = [];
for (const opt of ['Parts only', 'Service only', 'Parts & Service']) {
  await openSelect(page, 1);
  const item = page.locator('.q-menu .q-item').filter({ hasText: new RegExp('^(check )?' + opt.replace('&', '&') + '$') }).first();
  const ok = await clickEl(page, item, 5500);
  await closeMenu(page);
  const g = await readGrid(page);
  const totals = (g.bodyRows || []).find(r => r.cls.includes('totals'))?.cells;
  rec.productType.push({ option: opt, clicked: ok,
    queryProductType: lastReportCall().match(/productType=([^&]*)/)?.[1] || null,
    rowCount: g.bodyRows?.length, totalsRow: totals,
    label: (await page.locator('.q-select').nth(1).innerText().catch(() => '')).replace(/\s+/g, ' ') });
  L('PRODUCT TYPE', opt, '-> productType=' + rec.productType.at(-1).queryProductType,
    '| rows', g.bodyRows?.length, '| totals', JSON.stringify((totals || []).slice(-3)));
}
await page.screenshot({ path: OUT + 'product-type-applied.png', fullPage: true });

// ---------- 3. entity filter (Customer on SBC) applied for real ----------
if (slug === 'sales-by-customer') {
  const sel = await openSelect(page, 2);
  rec.customerFilter = { label: sel.label, optionCount: sel.menu?.items?.length,
    hasSearch: sel.menu?.hasSearchInput, firstOptions: sel.menu?.items?.slice(0, 6).map(i => i.text) };
  // type to search
  await page.keyboard.type('Aagate', { delay: 60 });
  await page.waitForTimeout(2600);
  rec.customerFilter.searchResults = await page.evaluate(() => {
    const ms = Array.from(document.querySelectorAll('.q-menu')).filter(e => e.getClientRects().length);
    const m = ms[ms.length - 1];
    return m ? Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()).slice(0, 8) : [];
  });
  L('CUSTOMER FILTER search "Aagate" ->', JSON.stringify(rec.customerFilter.searchResults));
  const pick = page.locator('.q-menu .q-item').filter({ hasText: /Aagate Landscaping/ }).first();
  await clickEl(page, pick, 5500);
  await closeMenu(page);
  const g = await readGrid(page);
  rec.customerFilter.afterPick = { rowCount: g.bodyRows?.length,
    rows: (g.bodyRows || []).map(r => r.cells[1]).slice(0, 5),
    queryCustomers: lastReportCall().match(/customer[s]?(?:Ids)?=([^&]*)/i)?.[1] || null,
    fullQuery: lastReportCall().slice(0, 420) };
  L('CUSTOMER FILTER applied -> rows', g.bodyRows?.length, JSON.stringify(rec.customerFilter.afterPick.rows));
  L('   query:', rec.customerFilter.afterPick.fullQuery);
  await page.screenshot({ path: OUT + 'customer-filter-applied.png', fullPage: true });

  // asset label form: expand the single customer
  await clickEl(page, page.locator('tbody tr td:first-child .q-btn').first(), 5000);
  const g2 = await readGrid(page);
  rec.assetLabels = (g2.bodyRows || []).filter(r => r.cls.includes('asset'))
    .slice(0, 6).map(r => r.cells[1]);
  rec.assetLabelHtml = await page.evaluate(() => {
    const tr = Array.from(document.querySelectorAll('tbody tr')).find(t => /asset/.test(t.className));
    if (!tr) return null;
    const td = tr.querySelectorAll('td')[1];
    return { html: td.innerHTML.slice(0, 400), text: (td.innerText || '').trim(),
      icons: Array.from(td.querySelectorAll('i, .q-icon')).map(i => (i.innerText || '').trim()) };
  });
  L('ASSET LABELS:', JSON.stringify(rec.assetLabels));
  L('ASSET CELL:', JSON.stringify(rec.assetLabelHtml));
  await page.screenshot({ path: OUT + 'asset-labels.png', fullPage: true });
  // clear the customer filter for the persistence test
  await openSelect(page, 2);
  await clickEl(page, page.locator('.q-menu .q-item').filter({ hasText: /^Clear all$/ }).first(), 3000);
  await closeMenu(page);
}

// ---------- 4. COLUMN SELECTOR: does unticking actually remove the column? ----------
{
  await clickEl(page, page.locator('[aria-label="Column Selection"]').first(), 2000);
  const first = page.locator('.q-menu .q-item').first();
  const name = (await first.innerText().catch(() => '')).trim();
  await clickEl(page, first, 3500);
  await closeMenu(page);
  await page.waitForTimeout(2000);
  const g = await readGrid(page);
  rec.columnToggle = { untickedColumn: name, headersAfter: g.headRows?.[0]?.map(h => h.text),
    columnStillPresent: (g.headRows?.[0] || []).some(h => h.text === name) };
  L('COLUMN TOGGLE unticked', JSON.stringify(name), '-> still present?', rec.columnToggle.columnStillPresent);
  L('   headers now:', JSON.stringify(rec.columnToggle.headersAfter));
  await page.screenshot({ path: OUT + 'column-unticked.png', fullPage: true });
}

// ---------- 5. PERSISTENCE: reload and see whether range / product type / column choice survive ----------
{
  rec.beforeReload = { range: await page.locator('span.date-range-label').first().innerText().catch(() => null),
    productType: (await page.locator('.q-select').nth(1).innerText().catch(() => '')).replace(/\s+/g, ' '),
    headers: (await readGrid(page)).headRows?.[0]?.map(h => h.text) };
  rec.localStorageKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => /report|sbc|sbr|sales|filter|column/i.test(k)));
  rec.localStorageSample = await page.evaluate(() => {
    const out = {};
    for (const k of Object.keys(localStorage)) if (/report|sbc|sbr|sales|filter|column/i.test(k)) out[k] = localStorage.getItem(k).slice(0, 400);
    return out;
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(10000);
  rec.afterReload = { range: await page.locator('span.date-range-label').first().innerText().catch(() => null),
    productType: (await page.locator('.q-select').nth(1).innerText().catch(() => '')).replace(/\s+/g, ' '),
    headers: (await readGrid(page)).headRows?.[0]?.map(h => h.text) };
  rec.persistence = {
    rangeRemembered: rec.beforeReload.range === rec.afterReload.range,
    productTypeRemembered: rec.beforeReload.productType === rec.afterReload.productType,
    columnChoiceRemembered: JSON.stringify(rec.beforeReload.headers) === JSON.stringify(rec.afterReload.headers) };
  L('PERSISTENCE:', JSON.stringify(rec.persistence));
  L('   before:', JSON.stringify(rec.beforeReload));
  L('   after :', JSON.stringify(rec.afterReload));
  L('   localStorage keys:', JSON.stringify(rec.localStorageKeys));
  await page.screenshot({ path: OUT + 'after-reload.png', fullPage: true });
}

// ---------- 6. URL state: does the report put its filters in the URL? ----------
rec.urlAfterFilters = page.url();
L('URL:', rec.urlAfterFilters);

fs.writeFileSync(OUT + 'remaining.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'remaining.json');
await browser.close();
