// observe_wip.mjs — full live observation of the Work In Progress report UI (Rule 10/12/13).
// Captures every tester-facing fact the 79 WIP cases assert. SECRET-FREE.
// Usage: NODE_USE_ENV_PROXY=1 node observe_wip.mjs <outJson>
import fs from 'fs';
import { boot, spaGo } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/obs-wip.json';
const SHOTS = '/tmp/report-suite-viu/shots-wip';
fs.mkdirSync(SHOTS, { recursive: true });
const R = { report: 'work-in-progress', buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

const { browser, page, netlog } = await boot('admin');
await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(12000);

const clean = s => (s || '').replace(/arrow_drop_(up|down)|info_outline|keyboard_double_arrow_down/g, '').trim();
const heads = () => page.evaluate(() => Array.from(document.querySelectorAll('table thead th, table thead td'))
  .map(th => ({ text: (th.innerText || '').replace(/arrow_drop_(up|down)|info_outline/g, '').trim(),
                cls: th.className, align: getComputedStyle(th).textAlign, aria: th.getAttribute('aria-sort') })).filter(h => h.text));
const tabs = () => page.evaluate(() => Array.from(document.querySelectorAll('.q-tab, [role="tab"]'))
  .map(t => ({ text: (t.innerText || '').trim(), active: /q-tab--active|active/.test(t.className) || t.getAttribute('aria-selected') === 'true' })));
const clickTxt = async (sel, txt) => { const c = await page.evaluate(([s, t]) => {
    const el = Array.from(document.querySelectorAll(s)).find(x => (x.innerText || '').trim().includes(t));
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, [sel, txt]); if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(2500); } return !!c; };
const shot = async n => page.screenshot({ path: `${SHOTS}/${n}.png`, fullPage: false });

// 1) page title, tabs, default tab, headers, summary strip
R.docTitle = await page.title();
R.url = page.url();
R.tabs = await tabs();
R.headersDefault = await heads();
R.dateRangeLabel = await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null);
R.summaryStrip = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('[data-testid^="wip_summary_info_"]').forEach(b => {
    // walk up to the figure block and read its caption + value
    let n = b; for (let i = 0; i < 6 && n; i++) { if ((n.innerText || '').match(/\$/)) break; n = n.parentElement; }
    const t = (n?.innerText || '').replace(/info_outline/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ testId: b.getAttribute('data-testid'), tooltip: b.getAttribute('aria-label'), block: t });
  });
  return out;
});
R.summaryStripOrder = await page.evaluate(() => {
  const el = document.querySelector('main, .q-page') || document.body;
  const t = (el.innerText || '');
  const i = t.indexOf('TOTAL EARNED');
  return i < 0 ? null : t.slice(i, i + 400).replace(/\n+/g, ' | ');
});
await shot('01-default');

// 2) rows: virtualised grid — read what is rendered plus the totals row
const readGrid = () => page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const trs = Array.from(t.querySelectorAll('tbody tr'));
  const rows = trs.map(tr => Array.from(tr.querySelectorAll('td')).map(td => (td.innerText || '').replace(/\n/g, ' ⏎ ').trim()))
    .filter(r => r.length > 1);
  const last = rows[rows.length - 1] || null;
  const assetHtml = (() => { for (const tr of trs) { const td = tr.querySelectorAll('td')[3]; if (td && td.innerHTML.includes('wip-asset')) return td.innerHTML.replace(/\s+/g, ' '); } return null; })();
  const woLink = (() => { const a = t.querySelector('tbody a'); return a ? { text: a.innerText.trim(), href: a.getAttribute('href'), target: a.getAttribute('target'), tabindex: a.getAttribute('tabindex') } : null; })();
  const badge = (() => { const b = t.querySelector('tbody .q-badge, tbody .q-chip, tbody [class*="badge"], tbody [class*="status"]'); return b ? { text: b.innerText.trim(), cls: b.className, bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color } : null; })();
  return { renderedRowCount: rows.length, first3: rows.slice(0, 3), lastRow: last, assetHtml, woLink, badge };
});
R.gridDefault = await readGrid();
// Totals row is rendered outside tbody on some grids — capture any element whose text starts with Totals
R.totalsRowText = await page.evaluate(() => {
  const cands = Array.from(document.querySelectorAll('tr, .q-table__bottom, tfoot tr'))
    .filter(e => /^\s*Totals/.test(e.innerText || ''));
  return cands.map(e => (e.innerText || '').replace(/\n/g, ' | ').trim()).slice(0, 3);
});
R.pinnedTotal = await page.evaluate(() => {
  const ths = Array.from(document.querySelectorAll('table thead th'));
  const th = ths.find(t => (t.innerText || '').includes('Total'));
  if (!th) return null; const cs = getComputedStyle(th);
  return { cls: th.className, position: cs.position, right: cs.right, fontWeight: cs.fontWeight, textAlign: cs.textAlign };
});
R.rowShading = await page.evaluate(() => {
  const trs = Array.from(document.querySelectorAll('table tbody tr')).filter(t => t.querySelectorAll('td').length > 1).slice(0, 4);
  return trs.map(t => getComputedStyle(t).backgroundColor);
});
R.headerBg = await page.evaluate(() => { const th = document.querySelector('table thead th'); return th ? getComputedStyle(th).backgroundColor : null; });

// 3) export menu + Print check
const exBtn = await page.evaluate(() => { const el = document.querySelector('[data-testid="btn_dropdown_wip_export"], [aria-label="Export report"]');
  if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
if (exBtn) { await page.mouse.click(exBtn.x, exBtn.y); await page.waitForTimeout(1500); }
R.exportMenu = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
  return { items: Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()), wholeText: (m.innerText || '').trim() }; });
R.printControlAnywhere = await page.evaluate(() => /\bPrint\b/i.test(document.body.innerText || ''));
await shot('02-export-menu');
await page.keyboard.press('Escape'); await page.waitForTimeout(800);

// 4) date-range popup
const dr = await page.evaluate(() => { const e = document.querySelector('.date-range-label'); if (!e) return null;
  const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
if (dr) { await page.mouse.click(dr.x, dr.y); await page.waitForTimeout(2000); }
R.dateRangePopup = await page.evaluate(() => { const m = document.querySelector('.q-menu, .q-dialog'); if (!m) return null;
  return { presets: Array.from(m.querySelectorAll('.q-item, .q-btn, button')).map(i => (i.innerText || '').trim()).filter(Boolean),
           wholeText: (m.innerText || '').replace(/\n+/g, ' | ').trim().slice(0, 1200) }; });
await shot('03-date-range');
await page.keyboard.press('Escape'); await page.waitForTimeout(1000);

// 5) filter dropdown contents (advisor / customer / asset / location)
R.filters = [];
const selBoxes = await page.evaluate(() => Array.from(document.querySelectorAll('.q-select')).map((s, i) => {
  const r = s.getBoundingClientRect();
  return { i, label: (s.querySelector('.q-field__label')?.innerText || '').trim(), text: (s.innerText || '').replace(/\n/g, ' ').trim(),
           x: r.x + r.width / 2, y: r.y + r.height / 2, width: Math.round(r.width) };
}));
R.filterControls = selBoxes;
for (const s of selBoxes) {
  await page.mouse.click(s.x, s.y); await page.waitForTimeout(2200);
  const opts = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
    return { items: Array.from(m.querySelectorAll('.q-item')).map(i => ({ text: (i.innerText || '').trim(),
      checked: i.querySelector('input')?.getAttribute('aria-checked') ?? null })).slice(0, 40),
      hasSearchInput: !!m.querySelector('input[type="text"], .q-field input'), wholeText: (m.innerText || '').replace(/\n+/g, ' | ').slice(0, 800) }; });
  R.filters.push({ label: s.label, options: opts });
  await page.keyboard.press('Escape'); await page.waitForTimeout(900);
}

// 6) sorting — click a header twice and record the order + aria-sort
const sortProbe = async label => {
  const c = await page.evaluate(l => { const th = Array.from(document.querySelectorAll('table thead th')).find(t => (t.innerText || '').includes(l));
    if (!th) return null; const r = th.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, label);
  if (!c) return null;
  const snap = async () => page.evaluate(() => { const t = document.querySelector('table');
    const trs = Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1);
    return { first: trs.slice(0, 3).map(x => Array.from(x.querySelectorAll('td')).map(td => td.innerText.trim()).join(' | ')),
             aria: Array.from(t.querySelectorAll('thead th')).map(th => [(th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim(), th.getAttribute('aria-sort')]) }; });
  const before = await snap();
  await page.mouse.click(c.x, c.y); await page.waitForTimeout(2500); const click1 = await snap();
  await page.mouse.click(c.x, c.y); await page.waitForTimeout(2500); const click2 = await snap();
  await page.mouse.click(c.x, c.y); await page.waitForTimeout(2500); const click3 = await snap();
  return { label, before, click1, click2, click3 };
};
R.sortDaysOpen = await sortProbe('Days Open');
R.sortCustomer = await sortProbe('Customer');

// 7) tab switching + counts, then persistence across a reload
R.tabSwitch = [];
for (const t of ['Approved - Not Started', 'Completed', 'Estimates', 'Approved - Partially Completed']) {
  const ok = await clickTxt('.q-tab, [role="tab"]', t);
  R.tabSwitch.push({ tab: t, clicked: ok, tabs: await tabs(), headers: (await heads()).map(h => h.text),
    grid: await readGrid(), totals: await page.evaluate(() => Array.from(document.querySelectorAll('tr'))
      .filter(e => /^\s*Totals/.test(e.innerText || '')).map(e => (e.innerText || '').replace(/\n/g, ' | ').trim())[0] ?? null) });
  await shot('04-tab-' + t.replace(/\W+/g, '_'));
}

// 8) persistence: turn VIN on, switch to Estimates, reload, and see what is restored
{
  const b = await page.evaluate(() => { const el = document.querySelector('[data-testid="button_column_selection"]');
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (b) { await page.mouse.click(b.x, b.y); await page.waitForTimeout(1500);
    const c = await page.evaluate(() => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(x => (x.innerText || '').trim() === 'VIN');
      if (!it) return null; const tg = it.querySelector('.q-toggle') || it; const r = tg.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(1800); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200); }
  await clickTxt('.q-tab, [role="tab"]', 'Estimates');
  R.beforeReload = { headers: (await heads()).map(h => h.text), tabs: await tabs(), dateRange: await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null) };
  R.localStorageKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => /wip|report|column|inventory/i.test(k)));
  R.localStorageWip = await page.evaluate(() => { const o = {}; Object.keys(localStorage).filter(k => /wip|report/i.test(k)).forEach(k => o[k] = localStorage.getItem(k).slice(0, 400)); return o; });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(12000);
  R.afterReload = { headers: (await heads()).map(h => h.text), tabs: await tabs(), dateRange: await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null) };
  await shot('05-after-reload');
}

// 9) empty state — narrow the date range to a preset with no work orders is unreliable; instead
//    use an advisor+customer filter combination that yields nothing is also data-dependent, so
//    drive it via the URL/route the SPA uses. Read the no-data label if it appears in any tab.
R.noDataLabelPresentAnywhere = await page.evaluate(() => /Empty bays, endless possibilities/i.test(document.body.innerText || ''));

R.netApiCalls = netlog.filter(n => n.url.includes('/reporting/')).map(n => `${n.status} ${n.method} ${n.url.replace(/^https:\/\/[^/]+/, '')}`);
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT);
console.log('tabs', JSON.stringify(R.tabs));
console.log('headers', JSON.stringify(R.headersDefault.map(h => h.text)));
console.log('dateRange', R.dateRangeLabel, '| printAnywhere', R.printControlAnywhere);
console.log('exportMenu', JSON.stringify(R.exportMenu?.items));
console.log('totalsRow', JSON.stringify(R.totalsRowText));
await browser.close();
