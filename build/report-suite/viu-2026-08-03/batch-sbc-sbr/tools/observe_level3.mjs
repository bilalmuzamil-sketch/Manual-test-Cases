// observe_level3.mjs — drill to the DEEPEST tree level of SBC/SBR, capture the invoice rows,
// their link targets, the asset label form, and re-verify the ambiguous sort columns individually.
// SECRET-FREE. Usage: node observe_level3.mjs <slug>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';
import { clickEl, setPreset, readGrid } from './reportlib.mjs';

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

// ---------- descend level by level, expanding the FIRST expandable row at each new level ----------
rec.levels = [];
for (let depth = 1; depth <= 4; depth++) {
  const before = netlog.length;
  // the deepest-class row that still shows a collapsed chevron
  const target = page.locator('tbody tr td:first-child .q-btn').nth(depth - 1);
  const clicked = await clickEl(page, target, 5000);
  const api = netlog.slice(before).filter(n => n.url.includes('/api/'))
    .map(n => ({ status: n.status, path: n.url.replace(/^https:\/\/[^/]+/, '') }));
  const g = await readGrid(page);
  const classes = [...new Set((g.bodyRows || []).map(r => r.cls.replace(/q-tr |q-virtual-scroll--with-prev/g, '').trim()))];
  rec.levels.push({ depth, clicked, api, rowCount: g.bodyRows?.length, rowClasses: classes,
    sample: (g.bodyRows || []).slice(0, 8).map(r => ({ cls: r.cls, cells: r.cells, links: r.links })) });
  L('DEPTH', depth, 'clicked', clicked, '| classes', JSON.stringify(classes), '| api',
    JSON.stringify(api.map(a => a.status + ' ' + a.path.slice(0, 150))));
  (g.bodyRows || []).slice(0, 6).forEach((r, i) => L('   ', i, r.cls.replace('q-tr ', ''), JSON.stringify(r.cells).slice(0, 200),
    r.links.length ? 'LINK ' + JSON.stringify(r.links) : ''));
  await page.screenshot({ path: OUT + `tree-depth-${depth}.png`, fullPage: true });
  if (!clicked) break;
}

// ---------- the deepest row: is it clickable, and where does it go? ----------
{
  const g = await readGrid(page);
  const deepCls = (g.bodyRows || []).map(r => r.cls).filter(c => /invoice|--wo|work/i.test(c));
  rec.deepestRowClasses = [...new Set(deepCls)];
  L('DEEPEST candidate classes:', JSON.stringify(rec.deepestRowClasses));
  const idx = (g.bodyRows || []).findIndex(r => /invoice|--wo|work/i.test(r.cls));
  if (idx >= 0) {
    const row = page.locator('tbody tr').nth(idx);
    rec.deepRowCells = g.bodyRows[idx].cells;
    rec.deepRowStyle = await row.evaluate(el => ({ cursor: getComputedStyle(el).cursor, cls: el.className }));
    const before = netlog.length;
    await clickEl(page, row.locator('td').nth(1), 6000);
    rec.deepRowClick = { urlAfter: page.url(),
      api: netlog.slice(before).filter(n => n.url.includes('/api/')).map(n => n.status + ' ' + n.url.replace(/^https:\/\/[^/]+/, '').slice(0, 150)) };
    await page.screenshot({ path: OUT + 'deep-row-clicked.png', fullPage: true });
    L('DEEP ROW cells:', JSON.stringify(rec.deepRowCells));
    L('DEEP ROW style:', JSON.stringify(rec.deepRowStyle));
    L('DEEP ROW click -> url', rec.deepRowClick.urlAfter);
    L('   api', JSON.stringify(rec.deepRowClick.api.slice(0, 8)));
  }
}

// ---------- re-verify ambiguous sort columns one at a time, from a fresh page ----------
await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(9000);
await setPreset(page, 'Last 12 Months');
await page.waitForTimeout(4000);
rec.sortRecheck = [];
const cols = slug === 'sales-by-customer'
  ? ['Customer', 'Margin', 'Margin %', 'Location']
  : ['Sales Representative', 'Margin', 'Margin %', 'Location', 'Status'];
for (const col of cols) {
  const ths = await page.locator('thead th').all();
  let th = null;
  for (const t of ths) {
    const raw = (await t.innerText().catch(() => '')).replace(/arrow_drop_(up|down)/g, '').trim();
    if (raw === col) { th = t; break; }
  }
  if (!th) { rec.sortRecheck.push({ column: col, error: 'exact th not found' }); L('SORT-RECHECK', col, 'TH NOT FOUND'); continue; }
  const before = netlog.length;
  const bb = await th.boundingBox();
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(4200);
  const calls = netlog.slice(before).filter(n => n.url.includes('/api/reporting')).map(n => n.url.replace(/^https:\/\/[^/]+/, ''));
  const m = (calls.slice(-1)[0] || '').match(/sortBy%5D=([^&]*)&pagination%5Bdescending%5D=(\w+)/);
  const rawAfter = (await th.innerText().catch(() => '')).trim();
  const g = await readGrid(page);
  rec.sortRecheck.push({ column: col, sortBy: m?.[1] ?? null, descending: m?.[2] ?? null, apiFired: calls.length,
    headerRawAfter: rawAfter,
    firstRows: (g.bodyRows || []).filter(r => !r.cls.includes('totals')).slice(0, 3).map(r => r.cells) });
  L('SORT-RECHECK', JSON.stringify(col), '-> apiFired=' + calls.length, 'sortBy=' + (m?.[1] ?? 'NONE'),
    'desc=' + (m?.[2] ?? '-'), '| hdrAfter', JSON.stringify(rawAfter));
  // reload to isolate each column
  await page.goto(APP + '/reports/' + slug, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(8000);
  await setPreset(page, 'Last 12 Months');
  await page.waitForTimeout(3500);
}

fs.writeFileSync(OUT + 'level3-sort.json', JSON.stringify(rec, null, 1));
L('\nwrote', OUT + 'level3-sort.json');
await browser.close();
