// observe_ui_final.mjs — the remaining UI facts for WIP and IV, on a FRESH browser profile each
// time (the playbook warns that re-hydrating a profile keeps the previous column selection in
// localStorage and can fake a Location column).
// SECRET-FREE. Usage: NODE_USE_ENV_PROXY=1 node observe_ui_final.mjs <outJson>
import fs from 'fs';
import { boot } from '../../tools/boot8582.mjs';
import { APP } from '../../tools/qa8582.mjs';

const OUT = process.argv[2] || '/tmp/report-suite-viu/obs-final.json';
const SHOTS = '/tmp/report-suite-viu/shots-final';
fs.mkdirSync(SHOTS, { recursive: true });
const R = { buildMarker: 'v3.4.1-0ed4433', capturedAt: new Date().toISOString() };
const LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2';

const grid = page => page.evaluate(() => {
  const t = document.querySelector('table'); if (!t) return null;
  const cl = s => (s || '').replace(/arrow_drop_(up|down)|info_outline/g, '').trim();
  const ths = Array.from(t.querySelectorAll('thead th'));
  const trs = Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1);
  const totalsEl = Array.from(document.querySelectorAll('tr,tfoot tr')).find(e => /^\s*Totals?\b/.test(e.innerText || ''));
  return {
    heads: ths.map(th => cl(th.innerText)),
    headMeta: ths.map((th, i) => { const td = trs[0]?.querySelectorAll('td')[i];
      return { head: cl(th.innerText), headAlign: getComputedStyle(th).textAlign, cellAlign: td ? getComputedStyle(td).textAlign : null,
        headWeight: getComputedStyle(th).fontWeight, position: getComputedStyle(th).position, right: getComputedStyle(th).right,
        aria: th.getAttribute('aria-sort'), cls: th.className }; }),
    rowCount: trs.length,
    rows: trs.slice(0, 4).map(tr => Array.from(tr.querySelectorAll('td')).map(td => (td.innerText || '').replace(/\n/g, ' ⏎ ').trim())),
    totalsLabel: totalsEl ? (totalsEl.querySelector('td,th')?.innerText || '').trim() : null,
    totalsRow: totalsEl ? (totalsEl.innerText || '').replace(/\n/g, ' | ').trim() : null,
    rowBg: trs.slice(0, 4).map(x => getComputedStyle(x).backgroundColor),
    headBg: ths[0] ? getComputedStyle(ths[0]).backgroundColor : null,
    noData: /Empty bays, endless possibilities/i.test(document.body.innerText || ''),
  };
});
const openColSel = async page => { const b = await page.evaluate(() => { const el = document.querySelector('[data-testid="button_column_selection"]');
    if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (b) { await page.mouse.click(b.x, b.y); await page.waitForTimeout(1700); } return !!b; };
const toggleCol = async (page, label) => { const c = await page.evaluate(w => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => (i.innerText || '').trim() === w);
    if (!it) return null; const tg = it.querySelector('.q-toggle') || it; const r = tg.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, label);
  if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(1400); } return !!c; };
const setPreset = async (page, name) => {
  const dl = await page.evaluate(() => { const e = document.querySelector('.date-range-label'); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (!dl) return false;
  await page.mouse.click(dl.x, dl.y); await page.waitForTimeout(1800);
  const p = await page.evaluate(n => { const i = Array.from(document.querySelectorAll('.q-menu *')).find(e => !e.children.length && (e.textContent || '').trim() === n);
    if (!i) return null; const r = i.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, name);
  if (!p) { await page.keyboard.press('Escape'); return false; }
  await page.mouse.click(p.x, p.y); await page.waitForTimeout(1300);
  const ap = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.q-menu .q-btn, .q-menu button')).find(e => (e.innerText || '').trim() === 'Apply');
    if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (ap) await page.mouse.click(ap.x, ap.y);
  await page.waitForTimeout(9000); return true;
};

// ===================== WIP =====================
{
  const { browser, page } = await boot('admin');
  await page.goto(APP + '/reports/work-in-progress', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(12000);
  R.wip = {};
  R.wip.freshDefault = await grid(page);
  await setPreset(page, 'Last 12 Months');
  R.wip.withData = await grid(page);
  // turn every optional column on, one at a time, re-opening the menu each time
  R.wip.toggleTrace = [];
  for (const w of ['VIN', 'Location', 'Last Activity', 'Labor Earned', 'Labor Remaining', 'Parts Earned', 'Parts Remaining', 'Inv. Hrs']) {
    const opened = await openColSel(page);
    const hit = opened ? await toggleCol(page, w) : false;
    await page.keyboard.press('Escape'); await page.waitForTimeout(1100);
    const h = (await grid(page))?.heads;
    R.wip.toggleTrace.push({ column: w, menuOpened: opened, itemFound: hit, headsNow: h });
    console.log('WIP +', w, '->', h?.length, 'cols', h?.includes(w) ? 'PRESENT' : 'ABSENT');
  }
  R.wip.allColumns = await grid(page);
  R.wip.invHrs = await page.evaluate(() => { const t = document.querySelector('table');
    const heads = Array.from(t.querySelectorAll('thead th')).map(th => (th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim());
    const i = heads.indexOf('Inv. Hrs'); if (i < 0) return { idx: -1, heads };
    return { idx: i, cells: Array.from(t.querySelectorAll('tbody tr')).filter(x => x.querySelectorAll('td').length > 1).slice(0, 15)
      .map(tr => { const td = tr.querySelectorAll('td')[i]; return td ? { text: td.innerText.trim(), color: getComputedStyle(td).color } : null; }).filter(Boolean),
      totalsCell: (() => { const e = Array.from(document.querySelectorAll('tr')).find(x => /^\s*Totals/.test(x.innerText || ''));
        const td = e?.querySelectorAll('td')[i]; return td ? { text: td.innerText.trim(), color: getComputedStyle(td).color } : null; })() }; });
  await page.screenshot({ path: `${SHOTS}/wip-allcolumns.png`, fullPage: false });
  // asset placeholders: find a row with no VIN and a row with no unit number
  R.wip.assetPlaceholders = await page.evaluate(() => {
    const out = []; document.querySelectorAll('table tbody tr').forEach(tr => {
      const td = Array.from(tr.querySelectorAll('td')).find(x => x.innerHTML.includes('wip-asset'));
      if (!td) return; const txt = td.innerText.replace(/\n/g, ' | ');
      if (/no unit|no VIN|—/.test(txt)) out.push({ text: txt, html: td.innerHTML.replace(/\s+/g, ' ').slice(0, 300) });
    }); return out.slice(0, 6); });
  // single-location scope -> is Location auto-hidden?
  {
    const loc = await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Location/.test(x.innerText || ''));
      if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: Math.round(r.width) }; });
    R.wip.locFilterWidthAll = loc?.width;
    if (loc) {
      await page.mouse.click(loc.x, loc.y); await page.waitForTimeout(2200);
      R.wip.locOptions = await page.evaluate(() => { const m = document.querySelector('.q-menu');
        return m ? Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()) : null; });
      const clr = await page.evaluate(() => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => /^Clear all$/i.test((i.innerText || '').trim()));
        if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (clr) { await page.mouse.click(clr.x, clr.y); await page.waitForTimeout(2500); }
      const one = await page.evaluate(() => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => /Lethbridge/.test(i.innerText || ''));
        if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (one) { await page.mouse.click(one.x, one.y); await page.waitForTimeout(4000); }
      await page.keyboard.press('Escape'); await page.waitForTimeout(5000);
      R.wip.singleLoc = { grid: await grid(page),
        filter: await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Location/.test(x.innerText || ''));
          return s ? { text: (s.innerText || '').replace(/\n/g, ' ').trim(), width: Math.round(s.getBoundingClientRect().width) } : null; }) };
      await page.screenshot({ path: `${SHOTS}/wip-singleloc.png`, fullPage: false });
      console.log('WIP single-loc heads:', JSON.stringify(R.wip.singleLoc.grid?.heads));
    }
  }
  R.wip.printAnywhere = await page.evaluate(() => /\bPrint\b/i.test(document.body.innerText || ''));
  R.wip.paginationControl = await page.evaluate(() => { const p = document.querySelector('.q-table__bottom, .q-pagination, [class*="pagination"]');
    return p ? (p.innerText || '').replace(/\n/g, ' | ').trim().slice(0, 200) : null; });
  await browser.close();
}

// ===================== IV =====================
{
  const { browser, page } = await boot('admin');
  await page.goto(APP + '/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(14000);
  R.iv = {};
  R.iv.freshDefault = await grid(page);
  R.iv.dateRangeLabel = await page.evaluate(() => document.querySelector('.date-range-label')?.innerText?.trim() ?? null);
  R.iv.asOfIndicator = await page.evaluate(() => { const m = (document.body.innerText || '').match(/As of[^\n]{0,30}/); return m ? m[0] : null; });
  R.iv.toolbarOrder = await page.evaluate(() => Array.from(document.querySelectorAll('.q-select, [data-testid="button_column_selection"], [aria-label="Export report"], .date-range-label, input'))
    .map(e => ({ tag: e.tagName, label: (e.querySelector?.('.q-field__label')?.innerText || e.getAttribute?.('aria-label') || e.getAttribute?.('placeholder') || (e.innerText || '').slice(0, 24)).trim(),
      x: Math.round(e.getBoundingClientRect().x) })).filter(e => e.label).sort((a, b) => a.x - b.x));
  R.iv.paginationControl = await page.evaluate(() => { const p = document.querySelector('.q-table__bottom, .q-pagination, [class*="pagination"]');
    return p ? (p.innerText || '').replace(/\n/g, ' | ').trim().slice(0, 250) : null; });
  R.iv.printAnywhere = await page.evaluate(() => /\bPrint\b/i.test(document.body.innerText || ''));
  R.iv.exportMenu = await (async () => { const b = await page.evaluate(() => { const el = document.querySelector('[data-testid="btn_dropdown_iv_export"], [aria-label="Export report"]');
      if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (!b) return null; await page.mouse.click(b.x, b.y); await page.waitForTimeout(1500);
    const m = await page.evaluate(() => { const m = document.querySelector('.q-menu'); return m ? Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()) : null; });
    await page.keyboard.press('Escape'); await page.waitForTimeout(800); return m; })();
  await page.screenshot({ path: `${SHOTS}/iv-default.png`, fullPage: false });
  // search for W4707QP and read Margin % on screen (the export says 56.1%)
  {
    const si = await page.evaluate(() => { const i = Array.from(document.querySelectorAll('input')).find(x => /search/i.test(x.getAttribute('placeholder') || x.getAttribute('aria-label') || '')
        || x.closest('[data-testid*="search"]'));
      if (!i) return null; const r = i.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    R.iv.searchInputFound = !!si;
    if (si) { await page.mouse.click(si.x, si.y); await page.keyboard.type('W4707QP'); await page.waitForTimeout(6000); }
    R.iv.searchResult = await grid(page);
    await page.screenshot({ path: `${SHOTS}/iv-search-W4707QP.png`, fullPage: false });
    console.log('IV search rows:', JSON.stringify(R.iv.searchResult?.rows));
    if (si) { await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control');
      await page.keyboard.press('Backspace'); await page.waitForTimeout(6000); }
  }
  // column selector: what is offered, what is on by default
  { const opened = await openColSel(page);
    R.iv.colSelItems = await page.evaluate(() => { const m = document.querySelector('.q-menu');
      return m ? Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()) : null; });
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    R.iv.colSelOpened = opened; }
  // single-location scope -> Location column hidden?
  { const loc = await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Location/.test(x.innerText || ''));
      if (!s) return null; const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: Math.round(r.width) }; });
    R.iv.locFilterWidthAll = loc?.width;
    if (loc) { await page.mouse.click(loc.x, loc.y); await page.waitForTimeout(2200);
      R.iv.locOptions = await page.evaluate(() => { const m = document.querySelector('.q-menu');
        return m ? Array.from(m.querySelectorAll('.q-item')).map(i => (i.innerText || '').trim()) : null; });
      const clr = await page.evaluate(() => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => /^Clear all$/i.test((i.innerText || '').trim()));
        if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (clr) { await page.mouse.click(clr.x, clr.y); await page.waitForTimeout(2500); }
      const one = await page.evaluate(() => { const it = Array.from(document.querySelectorAll('.q-menu .q-item')).find(i => /Lethbridge/.test(i.innerText || ''));
        if (!it) return null; const r = it.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (one) { await page.mouse.click(one.x, one.y); await page.waitForTimeout(5000); }
      await page.keyboard.press('Escape'); await page.waitForTimeout(6000);
      R.iv.singleLoc = { grid: await grid(page),
        filter: await page.evaluate(() => { const s = Array.from(document.querySelectorAll('.q-select')).find(x => /Location/.test(x.innerText || ''));
          return s ? { text: (s.innerText || '').replace(/\n/g, ' ').trim(), width: Math.round(s.getBoundingClientRect().width) } : null; }) };
      await page.screenshot({ path: `${SHOTS}/iv-singleloc.png`, fullPage: false });
      console.log('IV single-loc heads:', JSON.stringify(R.iv.singleLoc.grid?.heads)); }
  }
  // sort a header and confirm the server re-fetch + first page
  { const c = await page.evaluate(() => { const th = Array.from(document.querySelectorAll('table thead th')).find(t => /Part #/.test(t.innerText || ''));
      if (!th) return null; const r = th.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (c) { await page.mouse.click(c.x, c.y); await page.waitForTimeout(5000);
      R.iv.sortAsc = (await grid(page))?.rows?.map(r => r[0]);
      await page.mouse.click(c.x, c.y); await page.waitForTimeout(5000);
      R.iv.sortDesc = (await grid(page))?.rows?.map(r => r[0]);
      await page.mouse.click(c.x, c.y); await page.waitForTimeout(5000);
      R.iv.sortThird = (await grid(page))?.rows?.map(r => r[0]);
      R.iv.sortAria = await page.evaluate(() => Array.from(document.querySelectorAll('table thead th')).map(th => [(th.innerText || '').replace(/arrow_drop_(up|down)/g, '').trim(), th.getAttribute('aria-sort')])); } }
  R.iv.localStorageKey = await page.evaluate(() => { const k = Object.keys(localStorage).find(x => /inventory|iv/i.test(x)); return k ? { key: k, value: localStorage.getItem(k).slice(0, 400) } : null; });
  await browser.close();
}

fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('WROTE', OUT);
console.log('WIP fresh heads:', JSON.stringify(R.wip.freshDefault?.heads));
console.log('WIP totalsLabel:', R.wip.withData?.totalsLabel, '| IV totalsLabel:', R.iv.freshDefault?.totalsLabel);
console.log('IV fresh heads:', JSON.stringify(R.iv.freshDefault?.heads));
console.log('IV colSelItems:', JSON.stringify(R.iv.colSelItems));
console.log('IV pagination:', R.iv.paginationControl, '| printAnywhere', R.iv.printAnywhere);
console.log('IV asOf:', R.iv.asOfIndicator);
