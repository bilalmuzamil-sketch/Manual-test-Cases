// probe_surfaces2.cjs -- the surfaces probe_harvest.cjs could not reach by text.
// Drives by data-test-id, which is what the build actually exposes.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/harvest2.json`;
const OPLOG = `${OUT}/harvest2-oplog.json`;
const out = {};

function note(op, result, extra) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result }, extra || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${result}`);
}

const VISFN = `(el)=>{const r=el.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>0.01;}`;

const SNAP = () => {
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const texts = new Set(), ids = new Set();
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    const t = el.getAttribute('data-test-id') || el.getAttribute('data-testid'); if (t) ids.add(t);
    let own = ''; el.childNodes.forEach(n => { if (n.nodeType === 3) own += n.nodeValue; });
    own = own.replace(/\s+/g, ' ').trim(); if (own && own.length <= 120) texts.add(own);
    if (el.tagName === 'INPUT') { const p = el.getAttribute('placeholder'); if (p) texts.add(p.trim()); }
  });
  const panels = [];
  document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"]').forEach(d => {
    if (vis(d)) panels.push({ cls: d.className.slice(0, 60), text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1200) });
  });
  return { texts: [...texts], ids: [...ids], panels };
};

async function snap(page, name, ms = 1500) {
  await page.waitForTimeout(ms);
  const s = await page.evaluate(SNAP);
  out[name] = s; fs.writeFileSync(RESULT, JSON.stringify(out, null, 1));
  note(`snap ${name}`, `${s.texts.length} strings, ${s.panels.length} panel(s)`);
  return s;
}

async function clickId(page, tid, nth = 0) {
  return page.evaluate(({ tid, nth }) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const els = [...document.querySelectorAll(`[data-test-id="${tid}"],[data-testid="${tid}"]`)].filter(vis);
    const el = els[nth]; if (!el) return false;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
    return true;
  }, { tid, nth });
}

async function esc(page) { await page.keyboard.press('Escape'); await page.waitForTimeout(700); }

(async () => {
  const h = await makeHarness('h2'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(11000);

    // the two toolbar menus, by their real ids
    for (const [tid, tag] of [['schedule_view_options_menu', 'view-options'], ['schedule_filter_display_menu', 'filter-display']]) {
      const ok = await clickId(page, tid);
      note(`click ${tid}`, ok ? 'clicked' : 'NOT FOUND');
      if (ok) { await snap(page, `menu-${tag}`, 1600); await page.screenshot({ path: `${OUT}/s2-${tag}.png` }).catch(() => {}); await esc(page); }
    }

    // sidebar filters panel + search box
    if (await clickId(page, 'button_sidebar_filters')) { await snap(page, 'sidebar-filters', 1600);
      await page.screenshot({ path: `${OUT}/s2-sidebar-filters.png` }).catch(() => {}); await esc(page); }
    if (await clickId(page, 'button_schedule_search_toggle')) { await snap(page, 'toolbar-search', 1400); await esc(page); }

    // conflicts control
    if (await clickId(page, 'button_schedule_conflicts')) { await snap(page, 'conflicts', 1600);
      await page.screenshot({ path: `${OUT}/s2-conflicts.png` }).catch(() => {}); await esc(page); }

    // work-order card drill-down to its lines
    if (await clickId(page, 'sidebar_work_order_card')) { await snap(page, 'wo-card-clicked', 1800);
      await page.screenshot({ path: `${OUT}/s2-wo-card.png` }).catch(() => {}); }

    // the calendar grid: find an EMPTY cell and click it (Create Event / New Work Order menu)
    const cellInfo = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      const cal = document.querySelector('[data-test-id="schedule_calendar"]');
      if (!cal) return { err: 'no schedule_calendar' };
      const blocks = [...cal.querySelectorAll('[data-test-id="schedule_shift_block"],[data-test-id="schedule_event_block"],[data-test-id="schedule_series_block"]')]
        .filter(vis).map(b => b.getBoundingClientRect());
      // candidate cells: leaf-ish divs inside the calendar with real area
      const cands = [...cal.querySelectorAll('div')].filter(d => {
        if (!vis(d)) return false;
        const r = d.getBoundingClientRect();
        if (r.width < 60 || r.height < 24 || r.height > 200) return false;
        if (d.querySelector('[data-test-id*="block"]')) return false;
        return !blocks.some(b => !(r.right < b.left || r.left > b.right || r.bottom < b.top || r.top > b.bottom));
      });
      const t = cands[Math.floor(cands.length / 2)];
      if (!t) return { err: 'no empty cell', cands: cands.length, blocks: blocks.length };
      const r = t.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), cands: cands.length, cls: t.className.slice(0, 70) };
    }, VISFN);
    note('locate empty cell', JSON.stringify(cellInfo).slice(0, 200));
    if (cellInfo && cellInfo.x) {
      await page.mouse.click(cellInfo.x, cellInfo.y); await snap(page, 'cell-left-click', 1600);
      await page.screenshot({ path: `${OUT}/s2-cell-left.png` }).catch(() => {}); await esc(page);
      await page.mouse.click(cellInfo.x, cellInfo.y, { button: 'right' }); await snap(page, 'cell-right-click', 1600);
      await page.screenshot({ path: `${OUT}/s2-cell-right.png` }).catch(() => {}); await esc(page);
    }

    // hover a shift for the tooltip
    const hov = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      const b = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0];
      if (!b) return null; const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    }, VISFN);
    if (hov) { await page.mouse.move(hov.x, hov.y); await snap(page, 'tooltip', 2200);
      await page.screenshot({ path: `${OUT}/s2-tooltip.png` }).catch(() => {}); await page.mouse.move(5, 5); }

    // a SERIES block -> its detail modal (the delete-scope route lives here)
    const ser = await page.evaluate((visSrc) => {
      const vis = eval(visSrc);
      const b = [...document.querySelectorAll('[data-test-id="schedule_series_block"]')].filter(vis)[0];
      if (!b) return null; const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    }, VISFN);
    if (ser) { await page.mouse.click(ser.x, ser.y); await snap(page, 'series-modal', 2400);
      await page.screenshot({ path: `${OUT}/s2-series-modal.png` }).catch(() => {}); }
    else note('series block', 'none visible in this range');
  } catch (e) { note('FATAL', String(e).slice(0, 300)); }
  fs.writeFileSync(`${OUT}/harvest2-meta.json`, JSON.stringify({
    read_at_utc: new Date().toISOString(), api_4xx5xx: h.apiLog.filter(a => a.s >= 400),
    non_get: h.apiLog.filter(a => a.m !== 'GET'), bridge_errors: h.bridgeErrors }, null, 1));
  console.log('NON-GET API CALLS:', JSON.stringify(h.apiLog.filter(a => a.m !== 'GET')));
  await h.browser.close();
})();
