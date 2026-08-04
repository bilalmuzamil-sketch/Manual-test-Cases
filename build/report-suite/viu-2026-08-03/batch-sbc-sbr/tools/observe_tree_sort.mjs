// observe_tree_sort.mjs — the tree/drill-down + per-column sorting + expand-all + row-click link
// behaviour of one report, observed live. SECRET-FREE.
// Usage: node observe_tree_sort.mjs <slug>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid, closeMenu } from './reportlib.mjs';

const slug = process.argv[2];
const OUT = new URL(`../evidence/${slug}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const rec = { slug, capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433' };
const L = (...a) => console.log(...a);

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(4000);

const parentRowSel = 'tbody tr:not(.report-totals-row)';

// ---------- 1. expand ONE parent row via its chevron button ----------
{
  const before = netlog.length;
  const chev = page.locator(parentRowSel + ' td:first-child .q-btn').first();
  rec.expandOne = { chevronFound: (await chev.count()) > 0 };
  rec.expandOne.clicked = await clickEl(page, chev, 5000);
  rec.expandOne.api = netlog.slice(before).filter(n => n.url.includes('/api/'))
    .map(n => ({ status: n.status, method: n.method, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
  const g = await readGrid(page);
  rec.expandOne.rowCount = g.bodyRows?.length;
  rec.expandOne.rows = (g.bodyRows || []).slice(0, 12);
  await page.screenshot({ path: OUT + 'tree-one-expanded.png', fullPage: true });
  L('EXPAND ONE: chevron found', rec.expandOne.chevronFound, 'clicked', rec.expandOne.clicked,
    '| rows', rec.expandOne.rowCount, '| api', JSON.stringify(rec.expandOne.api.map(a => a.status + ' ' + a.path.slice(0, 160))));
  rec.expandOne.rows.forEach((r, i) => L('  r' + i, r.cls, 'pad=' + r.indentPx, JSON.stringify(r.cells),
    r.links.length ? 'LINKS ' + JSON.stringify(r.links) : ''));
}

// ---------- 2. clickable child row -> navigation target ----------
{
  const childRow = page.locator('tbody tr').filter({ hasNotText: 'Totals' }).nth(1);
  const cls = await childRow.getAttribute('class').catch(() => null);
  rec.childRowClass = cls;
  const before = netlog.length;
  const cell = childRow.locator('td').nth(1);
  await clickEl(page, cell, 5000);
  rec.childClickNav = { urlAfter: page.url(),
    api: netlog.slice(before).filter(n => n.url.includes('/api/')).map(n => n.status + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 140)) };
  await page.screenshot({ path: OUT + 'child-row-clicked.png', fullPage: true });
  L('CHILD ROW class:', cls, '| after click url:', rec.childClickNav.urlAfter);
  L('  api:', JSON.stringify(rec.childClickNav.api.slice(0, 6)));
  // return
  if (!page.url().includes('/reports/' + slug)) {
    await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    await setPreset(page, 'Last 12 Months');
    await page.waitForTimeout(3500);
  }
}

// ---------- 3. expand-all (keyboard_double_arrow_down in the header) ----------
{
  const before = netlog.length;
  const btn = page.locator('thead .q-btn').first();
  rec.expandAll = { found: (await btn.count()) > 0, aria: await btn.getAttribute('aria-label').catch(() => null),
    title: await btn.getAttribute('title').catch(() => null) };
  rec.expandAll.clicked = await clickEl(page, btn, 6000);
  const g = await readGrid(page);
  rec.expandAll.rowCount = g.bodyRows?.length;
  rec.expandAll.sampleRows = (g.bodyRows || []).slice(0, 10);
  rec.expandAll.api = netlog.slice(before).filter(n => n.url.includes('/api/')).map(n => n.status + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 150));
  await page.screenshot({ path: OUT + 'tree-expand-all.png', fullPage: true });
  L('EXPAND ALL: aria=', rec.expandAll.aria, 'clicked', rec.expandAll.clicked, '| rows', rec.expandAll.rowCount);
  rec.expandAll.sampleRows.forEach((r, i) => L('  r' + i, r.cls, JSON.stringify(r.cells).slice(0, 210)));
  // collapse back
  await clickEl(page, btn, 4000);
}

// ---------- 4. sorting on EVERY header column ----------
rec.sortMatrix = [];
{
  const heads = (await readGrid(page)).headRows[0].map(h => h.text).filter(Boolean);
  for (const col of heads) {
    const th = page.locator('thead th').filter({ hasText: new RegExp('^' + col.replace(/[.%*+?^${}()|[\]\\]/g, '\\$&')) }).first();
    if (!(await th.count())) { rec.sortMatrix.push({ column: col, error: 'th not found' }); continue; }
    const before = netlog.length;
    const ok = await clickEl(page, th, 4200);
    const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
    const m = (calls.slice(-1)[0] || '').match(/sortBy%5D=([^&]*)&pagination%5Bdescending%5D=(\w+)/);
    const g = await readGrid(page);
    const hdr = g.headRows[0].find(h => h.text === col);
    rec.sortMatrix.push({ column: col, clicked: ok, sortBy: m?.[1] || null, descending: m?.[2] || null,
      headerRaw: hdr?.raw, apiFired: calls.length,
      firstThreeKeyCells: (g.bodyRows || []).filter(r => r.cls.includes('row--')).slice(0, 3).map(r => [r.cells[1], r.cells[r.cells.length - 1]]) });
    L('SORT', JSON.stringify(col), '-> sortBy=' + (m?.[1] || 'NONE'), 'desc=' + (m?.[2] || '-'), '| hdr', JSON.stringify(hdr?.raw));
  }
}

fs.writeFileSync(OUT + 'tree-sort.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'tree-sort.json');
await browser.close();
