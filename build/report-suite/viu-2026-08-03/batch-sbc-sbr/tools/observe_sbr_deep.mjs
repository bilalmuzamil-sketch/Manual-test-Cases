// observe_sbr_deep.mjs — the Sales By Representative behaviours that need real invoice data:
// Show Unassigned, the rep tree, payment-status badges, invoice links, sorting order, totals,
// the invoice-status filter, and the location filter. Uses the Unassigned row (203 invoices).
// SECRET-FREE. Usage: node observe_sbr_deep.mjs
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid, openSelect, closeMenu, readToolbar } from './reportlib.mjs';

const slug = 'sales-by-representative';
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const rec = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);
const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(4000);

// ---------- 1. the Show Unassigned control: what kind of control is it? ----------
rec.showUnassigned = await page.evaluate(() => {
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ');
  const out = [];
  for (const el of document.querySelectorAll('.q-toggle, .q-checkbox, .q-btn, label, div')) {
    const t = txt(el);
    if (!/^Show Unassigned/i.test(t) || t.length > 60) continue;
    out.push({ tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 150), text: t,
      checked: el.getAttribute('aria-checked') ?? (el.querySelector('.q-toggle__inner--truthy, .q-checkbox__inner--truthy') ? 'true' : 'false'),
      role: el.getAttribute('role') });
  }
  return out.slice(0, 6);
});
L('SHOW UNASSIGNED CONTROL:', JSON.stringify(rec.showUnassigned, null, 1).slice(0, 900));

rec.beforeToggle = await readGrid(page);
L('rows BEFORE toggle:', rec.beforeToggle.bodyRows?.length,
  JSON.stringify((rec.beforeToggle.bodyRows || []).map(r => r.cells[1])));

// toggle it on
{
  const before = netlog.length;
  const t = page.locator('.q-toggle, .q-checkbox').filter({ hasText: /Show Unassigned/i }).first();
  rec.toggleClicked = await clickEl(page, (await t.count()) ? t : page.locator('text=Show Unassigned').first(), 6000);
  rec.toggleApi = netlog.slice(before).filter(n => n.url.includes('/api/reporting'))
    .map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  L('toggle clicked:', rec.toggleClicked);
  L('toggle api:', JSON.stringify(rec.toggleApi.slice(-1)));
}
rec.afterToggle = await readGrid(page);
L('rows AFTER toggle:', rec.afterToggle.bodyRows?.length,
  JSON.stringify((rec.afterToggle.bodyRows || []).map(r => r.cells[1])));
await page.screenshot({ path: OUT + 'unassigned-on.png', fullPage: true });
rec.afterToggleRows = (rec.afterToggle.bodyRows || []).map(r => ({ cls: r.cls, cells: r.cells }));

// ---------- 2. expand the Unassigned row -> invoice rows, badges, links ----------
{
  const before = netlog.length;
  await clickEl(page, page.locator('tbody tr td:first-child .q-btn').first(), 6000);
  rec.expandApi = netlog.slice(before).filter(n => n.url.includes('/api/'))
    .map(n => n.status + ' ' + n.url.replace(/^https:\/\/[^/]+/, ''));
  const g = await readGrid(page);
  rec.expanded = { rowCount: g.bodyRows?.length,
    classes: [...new Set((g.bodyRows || []).map(r => r.cls.replace(/q-tr |q-virtual-scroll--with-prev/g, '').trim()))],
    rows: (g.bodyRows || []).slice(0, 14).map(r => ({ cls: r.cls, cells: r.cells, links: r.links })) };
  L('EXPAND api:', JSON.stringify(rec.expandApi.map(a => a.slice(0, 170))));
  L('EXPANDED classes:', JSON.stringify(rec.expanded.classes), '| rows', rec.expanded.rowCount);
  rec.expanded.rows.slice(0, 10).forEach((r, i) => L('  r' + i, r.cls.replace('q-tr ', '').slice(0, 40),
    JSON.stringify(r.cells).slice(0, 190), r.links.length ? 'LINK ' + JSON.stringify(r.links) : ''));
  await page.screenshot({ path: OUT + 'unassigned-expanded.png', fullPage: true });
}

// ---------- 3. the payment-status badge: exact text, colour, element ----------
rec.badges = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('tbody .q-badge, tbody .q-chip, tbody [class*="badge"], tbody [class*="status"]')) {
    const t = (el.innerText || '').trim();
    if (!t) continue;
    const cs = getComputedStyle(el);
    out.push({ text: t, cls: el.className.toString().slice(0, 120),
      bg: cs.backgroundColor, color: cs.color, tag: el.tagName.toLowerCase() });
  }
  const uniq = [];
  for (const b of out) if (!uniq.some(u => u.text === b.text && u.bg === b.bg)) uniq.push(b);
  return uniq.slice(0, 12);
});
L('BADGES:', JSON.stringify(rec.badges, null, 1).slice(0, 1200));

// ---------- 4. invoice-status filter, applied for real ----------
rec.statusFilter = [];
for (const opt of ['Paid', 'Partially Paid', 'Unpaid', 'All Statuses']) {
  const sel = await openSelect(page, 2);
  const item = page.locator('.q-menu .q-item').filter({ hasText: new RegExp('^(check )?' + opt + '$') }).first();
  const before = netlog.length;
  const ok = await clickEl(page, item, 5000);
  await closeMenu(page);
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  const g = await readGrid(page);
  const statuses = [...new Set((g.bodyRows || []).map(r => r.cells[4]).filter(Boolean))];
  rec.statusFilter.push({ option: opt, clicked: ok, label: sel.label,
    queryInvoiceStatus: (calls.slice(-1)[0] || '').match(/invoiceStatus=([^&]*)/)?.[1] || null,
    rowCount: g.bodyRows?.length, statusCellsSeen: statuses.slice(0, 8),
    totalsRow: (g.bodyRows || []).find(r => r.cls.includes('totals'))?.cells });
  L('STATUS FILTER', opt, '-> invoiceStatus=' + (rec.statusFilter.at(-1).queryInvoiceStatus),
    '| rows', g.bodyRows?.length, '| status cells', JSON.stringify(statuses.slice(0, 6)));
}
await page.screenshot({ path: OUT + 'status-filter-applied.png', fullPage: true });

// ---------- 5. sorting with two rows: is Unassigned pinned to the top? ----------
rec.sortWithUnassigned = [];
for (const col of ['Subtotal', 'Margin %']) {
  const th = page.locator('thead th').filter({ hasText: new RegExp('^' + col.replace('%', '%')) }).first();
  const before = netlog.length;
  await clickEl(page, th, 4500);
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  const g = await readGrid(page);
  const order = (g.bodyRows || []).filter(r => !r.cls.includes('totals')).map(r => r.cells[1]);
  rec.sortWithUnassigned.push({ column: col, order,
    sortBy: (calls.slice(-1)[0] || '').match(/sortBy%5D=([^&]*)/)?.[1] || null,
    descending: (calls.slice(-1)[0] || '').match(/descending%5D=(\w+)/)?.[1] || null,
    unassignedFirst: order[0] === 'Unassigned' || /^Unassigned/.test(order[0] || '') });
  L('SORT', col, '->', JSON.stringify(order.slice(0, 4)), '| unassigned first:', rec.sortWithUnassigned.at(-1).unassignedFirst);
}

// ---------- 6. location filter: single location -> is the Location column hidden? ----------
{
  const sel = await openSelect(page, 3);
  rec.locationOptions = sel.menu?.items?.map(i => i.text);
  const clear = page.locator('.q-menu .q-item').filter({ hasText: /^Clear all$/ }).first();
  await clickEl(page, clear, 2500);
  const one = page.locator('.q-menu .q-item').filter({ hasText: /Staging Heavy Duty - 9919/ }).first();
  const before = netlog.length;
  await clickEl(page, one, 6000);
  await closeMenu(page);
  await page.waitForTimeout(3000);
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  const g = await readGrid(page);
  rec.singleLocation = { queryLocations: (calls.slice(-1)[0] || '').match(/locations=([^&]*)/)?.[1] || null,
    headers: g.headRows?.[0]?.map(h => h.text),
    locationColumnPresent: (g.headRows?.[0] || []).some(h => h.text === 'Location'),
    filterLabel: await page.locator('.q-select').nth(3).innerText().catch(() => null) };
  L('SINGLE LOCATION -> headers:', JSON.stringify(rec.singleLocation.headers));
  L('   Location column present?', rec.singleLocation.locationColumnPresent,
    '| filter label:', JSON.stringify((rec.singleLocation.filterLabel || '').replace(/\s+/g, ' ')));
  await page.screenshot({ path: OUT + 'single-location.png', fullPage: true });
}

rec.toolbar = await readToolbar(page);
rec.printControls = rec.toolbar.printControls;
L('PRINT CONTROLS:', JSON.stringify(rec.printControls));
fs.writeFileSync(OUT + 'sbr-deep.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'sbr-deep.json');
await browser.close();
