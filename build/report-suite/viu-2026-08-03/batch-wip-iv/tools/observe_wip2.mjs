// observe_wip2.mjs — WIP observation WITH DATA. Widens the date range to "Last 12 Months" first
// (the default "This Week" leaves three of the four tabs empty), then observes every tab's rows,
// Totals row, summary-strip values, sorting, filters, the two-line Asset cell, the Inv. Hrs
// colouring, the WO # link, and persistence. SECRET-FREE.
// Usage: NODE_USE_ENV_PROXY=1 node observe_wip2.mjs <outJson>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/obs-wip2.json';
const SHOTS = '/tmp/report-suite-viu/shots-wip2';
fs.mkdirSync(SHOTS, { recursive: true });
const R = { report: 'work-in-progress', buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };

const { browser, page } = await boot('admin');
await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(12000);

const shot = n => page.screenshot({ path: `${SHOTS}/${n}.png`, fullPage: false });
const clickPoint = p => page.mouse.click(p.x, p.y);
const ctr = el => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };

// ---- widen the date range to Last 12 Months ----
async function setPreset(name) {
  const dl = await page.evaluate(() => { const e = document.querySelector('.date-range-label'); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (!dl) return false;
  await clickPoint(dl); await page.waitForTimeout(1800);
  const p = await page.evaluate(n => { const i = Array.from(document.querySelectorAll('.q-menu *'))
      .find(e => e.children.length === 0 && (e.textContent || '').trim() === n);
    if (!i) return null; const r = i.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, name);
  if (!p) { await page.keyboard.press('Escape'); return false; }
  await clickPoint(p); await page.waitForTimeout(1500);
  const ap = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.q-menu .q-btn, .q-menu button'))
      .find(e => (e.innerText || '').trim() === 'Apply'); if (!b) return null;
    const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (ap) { await clickPoint(ap); }
  await page.waitForTimeout(9000);
  return true;
}
R.setPresetLast12 = await setPreset('Last 12 Months');
R.dateRangeAfter = await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null);

// report tabs live inside the page; match on the WIP tab captions only
const reportTabs = () => page.evaluate(() => {
  const re = /^(Approved - Partially Completed|Approved - Not Started|Completed|Estimates)\s*\(\d+\)$/;
  const seen = new Map();
  Array.from(document.querySelectorAll('*')).forEach(e => {
    if (e.children.length) return;
    const t = (e.textContent || '').trim();
    if (!re.test(t)) return;
    const host = e.closest('.q-tab, [role="tab"], a, div');
    const cs = getComputedStyle(e);
    seen.set(t, { text: t, color: cs.color, fontWeight: cs.fontWeight, hostCls: host?.className || '' });
  });
  return Array.from(seen.values());
});
const tabPoint = label => page.evaluate(l => {
  const e = Array.from(document.querySelectorAll('*')).find(x => !x.children.length && (x.textContent || '').trim().startsWith(l + ' ('));
  if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
}, label);

const grid = () => page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const clean = s => (s || '').replace(/arrow_drop_(up|down)|info_outline/g, '').trim();
  const heads = Array.from(t.querySelectorAll('thead th, thead td')).map(th => clean(th.innerText)).filter(Boolean);
  const trs = Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1);
  const cellsOf = tr => Array.from(tr.querySelectorAll('td')).map(td => (td.innerText || '').replace(/\n/g, ' ⏎ ').trim());
  const rows = trs.map(cellsOf);
  const totalsEl = Array.from(document.querySelectorAll('tr, tfoot tr, .report-totals, [class*="total"]'))
    .find(e => /^\s*Totals\b/.test(e.innerText || ''));
  const assetTd = (() => { for (const tr of trs) { const tds = tr.querySelectorAll('td');
    for (const td of tds) if (td.innerHTML.includes('wip-asset')) return td.innerHTML.replace(/\s+/g, ' ').slice(0, 500); } return null; })();
  const link = (() => { const a = t.querySelector('tbody a'); return a ? { text: a.innerText.trim(), href: a.getAttribute('href'), target: a.getAttribute('target') } : null; })();
  const badges = Array.from(t.querySelectorAll('tbody tr td:nth-child(2) *')).slice(0, 4)
    .map(b => ({ text: (b.innerText || '').trim(), cls: b.className, bg: getComputedStyle(b).backgroundColor, color: getComputedStyle(b).color }))
    .filter(b => b.text);
  return { heads, rowCount: rows.length, rows: rows.slice(0, 6), lastRows: rows.slice(-2),
    totalsRow: totalsEl ? (totalsEl.innerText || '').replace(/\n/g, ' | ').trim() : null,
    totalsRowCells: totalsEl ? Array.from(totalsEl.querySelectorAll('td,th')).map(c => (c.innerText || '').trim()) : null,
    assetTd, link, badges };
});
const summary = () => page.evaluate(() => {
  const el = document.querySelector('main, .q-page') || document.body;
  const t = (el.innerText || ''); const i = t.indexOf('TOTAL EARNED');
  const strip = i < 0 ? null : t.slice(i, i + 420).split('Approved -')[0].replace(/\n+/g, ' | ').trim();
  const tips = Array.from(document.querySelectorAll('[data-testid^="wip_summary_info_"]'))
    .map(b => ({ testId: b.getAttribute('data-testid'), tooltip: b.getAttribute('aria-label'), tabIndex: b.getAttribute('tabindex') ?? b.tabIndex }));
  const hero = (() => { const h = Array.from(document.querySelectorAll('*')).find(e => !e.children.length && /TOTAL EARNED/.test(e.textContent || ''));
    if (!h) return null; let v = h.parentElement; const val = Array.from(v.querySelectorAll('*')).find(e => !e.children.length && /^\$/.test(e.textContent || ''));
    return val ? { text: val.textContent.trim(), fontSize: getComputedStyle(val).fontSize,
      borderBottom: getComputedStyle(val).borderBottomWidth + ' ' + getComputedStyle(val).borderBottomColor } : null; })();
  const estMuted = (() => { const h = Array.from(document.querySelectorAll('*')).find(e => !e.children.length && (e.textContent || '').trim() === 'ESTIMATES');
    if (!h) return null; const v = h.parentElement; const val = Array.from(v.querySelectorAll('*')).find(e => !e.children.length && /^\$/.test(e.textContent || ''));
    return val ? { text: val.textContent.trim(), color: getComputedStyle(val).color } : null; })();
  return { strip, tips, hero, estMuted };
});

// ---- per-tab observation ----
R.tabsSeen = await reportTabs();
R.perTab = {};
for (const label of ['Approved - Partially Completed', 'Approved - Not Started', 'Completed', 'Estimates']) {
  const p = await tabPoint(label);
  if (p) { await clickPoint(p); await page.waitForTimeout(4000); }
  R.perTab[label] = { clicked: !!p, grid: await grid(), summary: await summary(), tabs: await reportTabs() };
  await shot('tab-' + label.replace(/\W+/g, '_'));
  console.log(label, '-> rows', R.perTab[label].grid?.rowCount, '| totals', R.perTab[label].grid?.totalsRow?.slice(0, 90));
}

// ---- back to the default tab, turn every optional column ON, and read a full row ----
{
  const p = await tabPoint('Approved - Partially Completed'); if (p) { await clickPoint(p); await page.waitForTimeout(3500); }
  const openSel = async () => { const b = await page.evaluate(() => { const el = document.querySelector('[data-testid="button_column_selection"]');
      if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (b) { await clickPoint(b); await page.waitForTimeout(1600); } return !!b; };
  R.toggleTrace = [];
  for (const want of ['VIN', 'Location', 'Last Activity', 'Labor Earned', 'Labor Remaining', 'Parts Earned', 'Parts Remaining', 'Inv. Hrs']) {
    await openSel();
    const c = await page.evaluate(w => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => (i.innerText || '').trim() === w);
      if (!it) return null; const tg = it.querySelector('.q-toggle') || it; const r = tg.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, want);
    if (c) { await clickPoint(c); await page.waitForTimeout(1200); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    const h = await page.evaluate(() => Array.from(document.querySelectorAll('table thead th')).map(th => (th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim()).filter(Boolean));
    R.toggleTrace.push({ toggled: want, found: !!c, headersNow: h });
    console.log('  +', want, '->', h.length, 'cols');
  }
  R.allColumns = await grid();
  R.invHrsColours = await page.evaluate(() => {
    const t = document.querySelector('table'); if (!t) return null;
    const heads = Array.from(t.querySelectorAll('thead th')).map(th => (th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim());
    const idx = heads.findIndex(h => h === 'Inv. Hrs'); if (idx < 0) return { idx };
    return { idx, cells: Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1).slice(0, 12)
      .map(tr => { const td = tr.querySelectorAll('td')[idx]; return td ? { text: td.innerText.trim(), color: getComputedStyle(td).color, cls: td.className } : null; }).filter(Boolean) };
  });
  R.alignments = await page.evaluate(() => { const t = document.querySelector('table');
    const heads = Array.from(t.querySelectorAll('thead th'));
    const firstRow = Array.from(t.querySelectorAll('tbody tr')).find(x => x.querySelectorAll('td').length > 1);
    const tds = firstRow ? Array.from(firstRow.querySelectorAll('td')) : [];
    return heads.map((th, i) => ({ head: (th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim(),
      headAlign: getComputedStyle(th).textAlign, cellAlign: tds[i] ? getComputedStyle(tds[i]).textAlign : null })); });
  await shot('allcolumns');
  // persistence check
  R.persistBefore = { headers: R.allColumns?.heads, dateRange: await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null),
    tabs: await reportTabs(), storage: await page.evaluate(() => localStorage.getItem('report_view:wip')) };
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(12000);
  R.persistAfter = { headers: (await grid())?.heads, dateRange: await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null),
    tabs: await reportTabs() };
  await shot('after-reload');
}

// ---- sorting ----
{
  const sortProbe = async label => {
    const c = await page.evaluate(l => { const th = Array.from(document.querySelectorAll('table thead th')).find(t => (t.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim() === l);
      if (!th) return null; const r = th.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, label);
    if (!c) return { label, found: false };
    const snap = async () => page.evaluate(l => { const t = document.querySelector('table');
      const heads = Array.from(t.querySelectorAll('thead th')).map(th => (th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim());
      const i = heads.indexOf(l);
      const trs = Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1);
      const th = Array.from(t.querySelectorAll('thead th'))[i];
      return { col: heads[i], values: trs.slice(0, 6).map(x => (x.querySelectorAll('td')[i]?.innerText || '').trim()),
        raw: th ? th.innerText.replace(/\s+/g, '') : null, aria: th?.getAttribute('aria-sort') ?? null,
        totalsStillLast: /^\s*Totals/.test((trs[trs.length - 1]?.innerText) || '') || null }; }, label);
    const before = await snap();
    await clickPoint(c); await page.waitForTimeout(2600); const c1 = await snap();
    await clickPoint(c); await page.waitForTimeout(2600); const c2 = await snap();
    await clickPoint(c); await page.waitForTimeout(2600); const c3 = await snap();
    return { label, found: true, before, click1: c1, click2: c2, click3: c3 };
  };
  R.sort = {};
  for (const col of ['Days Open', 'Customer', 'Total', 'Status']) R.sort[col] = await sortProbe(col);
}

// ---- filters: real option lists, and whether narrowing reloads or is screen-only ----
{
  R.filterProbe = [];
  const boxes = await page.evaluate(() => Array.from(document.querySelectorAll('.q-select')).map(s => {
    const r = s.getBoundingClientRect();
    return { label: (s.querySelector('.q-field__label')?.innerText || '').trim(), text: (s.innerText || '').replace(/\n/g, ' ').trim(),
      x: r.x + r.width / 2, y: r.y + r.height / 2, width: Math.round(r.width) }; }));
  R.filterBoxes = boxes;
  for (const b of boxes) {
    if (!b.label || b.label === 'Search') continue;
    await clickPoint(b); await page.waitForTimeout(2200);
    const opts = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
      return { hasSearchField: !!m.querySelector('input'),
        items: Array.from(m.querySelectorAll('.q-item')).slice(0, 30).map(i => ({ text: (i.innerText || '').trim(),
          checked: i.querySelector('input')?.getAttribute('aria-checked') ?? null })),
        itemCount: m.querySelectorAll('.q-item').length,
        wholeText: (m.innerText || '').replace(/\n+/g, ' | ').slice(0, 700) }; });
    R.filterProbe.push({ label: b.label, width: b.width, options: opts });
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  }
  // pick the first real Advisor option and prove it narrows on screen with NO new /reporting call
  const netBefore = [];
  page.on('response', r => { if (r.url().includes('/api/reporting/reports/work-in-progress')) netBefore.push(r.url()); });
  const adv = boxes.find(b => b.label === 'Advisor');
  if (adv) {
    const rowsBefore = (await grid())?.rowCount;
    const sumBefore = (await summary())?.strip;
    await clickPoint(adv); await page.waitForTimeout(2200);
    const opt = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
      const it = Array.from(m.querySelectorAll('.q-item')).find(i => { const t = (i.innerText || '').trim();
        return t && !/All advisors|Clear all|No results/.test(t); });
      if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: (it.innerText || '').trim() }; });
    if (opt) { await clickPoint(opt); await page.waitForTimeout(3000); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
    R.advisorFilterEffect = { picked: opt?.text ?? null, rowsBefore, rowsAfter: (await grid())?.rowCount,
      summaryBefore: sumBefore, summaryAfter: (await summary())?.strip,
      totalsAfter: (await grid())?.totalsRow, newReportingCalls: netBefore.length,
      filterLabelNow: await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Advisor/.test(x.innerText || ''));
        return s ? (s.innerText || '').replace(/\n/g, ' ').trim() : null; }),
      clearActionVisible: await page.evaluate(() => /Clear/i.test(document.querySelector('.q-menu')?.innerText || '')) };
    await shot('advisor-filtered');
    // clear it again
    await clickPoint(adv); await page.waitForTimeout(2000);
    const clr = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
      const it = Array.from(m.querySelectorAll('.q-item')).find(i => /^(Clear all|Clear)$/i.test((i.innerText || '').trim()));
      if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: (it.innerText || '').trim() }; });
    R.advisorClearAction = clr?.text ?? null;
    if (clr) { await clickPoint(clr); await page.waitForTimeout(2500); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
    R.rowsAfterClear = (await grid())?.rowCount;
  }
  // Location filter: narrow to ONE location and see whether the report reloads and the Location column hides
  const loc = boxes.find(b => b.label === 'Location');
  if (loc) {
    await clickPoint(loc); await page.waitForTimeout(2200);
    const one = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
      const it = Array.from(m.querySelectorAll('.q-item')).find(i => /Lethbridge/.test(i.innerText || ''));
      if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: (it.innerText || '').trim() }; });
    // first clear all, then pick exactly one
    const clrAll = await page.evaluate(() => { const m = document.querySelector('.q-menu'); if (!m) return null;
      const it = Array.from(m.querySelectorAll('.q-item')).find(i => /^Clear all$/i.test((i.innerText || '').trim()));
      if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (clrAll) { await clickPoint(clrAll); await page.waitForTimeout(2500); }
    if (one) { await clickPoint(one); await page.waitForTimeout(4000); }
    await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
    R.singleLocationScope = { picked: one?.text ?? null,
      headers: (await grid())?.heads, rowCount: (await grid())?.rowCount,
      filterLabel: await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Location/.test(x.innerText || ''));
        return s ? { text: (s.innerText || '').replace(/\n/g, ' ').trim(), width: Math.round(s.getBoundingClientRect().width) } : null; }) };
    await shot('single-location');
  }
}
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT);
await browser.close();
