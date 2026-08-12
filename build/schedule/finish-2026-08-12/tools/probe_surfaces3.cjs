// probe_surfaces3.cjs -- tooltip, empty-cell menu, series block + its scope dialog.
//
// Fixes the fault in probe_surfaces2: it computed a cell centre at y=1817 in a 1080-high
// viewport and clicked nothing.  Every target here is scrolled into view FIRST and its
// rectangle re-read AFTER the scroll, so the coordinate is the one on screen.
//
// NOTHING IS CONFIRMED.  Any dialog that could write is opened, read and CANCELLED, and the
// non-GET call list is printed at the end to prove it.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/harvest3.json`, OPLOG = `${OUT}/harvest3-oplog.json`;
const out = {};
function note(op, result, extra) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result }, extra || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${result}`);
}
const SNAP = () => {
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const texts = new Set(), ids = new Set();
  document.querySelectorAll('*').forEach(el => {
    if (!vis(el)) return;
    const t = el.getAttribute('data-test-id'); if (t) ids.add(t);
    let own = ''; el.childNodes.forEach(n => { if (n.nodeType === 3) own += n.nodeValue; });
    own = own.replace(/\s+/g, ' ').trim(); if (own && own.length <= 120) texts.add(own);
  });
  const panels = [];
  document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip').forEach(d => {
    if (vis(d)) panels.push({ cls: d.className.slice(0, 50), text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1200) });
  });
  return { texts: [...texts], ids: [...ids], panels };
};
async function snap(page, name, ms = 1600) {
  await page.waitForTimeout(ms);
  const s = await page.evaluate(SNAP);
  out[name] = s; fs.writeFileSync(RESULT, JSON.stringify(out, null, 1));
  note(`snap ${name}`, `${s.panels.length} panel(s)` + (s.panels[0] ? ` :: ${s.panels[0].text.slice(0, 110)}` : ''));
  return s;
}
// scroll into view, THEN read the rect -> a coordinate that is actually on screen
async function centreOf(page, sel, nth = 0) {
  return page.evaluate(({ sel, nth }) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const els = [...document.querySelectorAll(sel)].filter(vis);
    const el = els[nth]; if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    return new Promise(res => setTimeout(() => {
      const r = el.getBoundingClientRect();
      res({ x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), n: els.length,
            onscreen: r.y > 0 && r.y < innerHeight && r.x > 0 && r.x < innerWidth });
    }, 500));
  }, { sel, nth });
}
async function esc(page) { await page.keyboard.press('Escape'); await page.waitForTimeout(700); }

(async () => {
  const h = await makeHarness('h3'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(11000);

    // 1 - hover tooltip on a shift block
    const s = await centreOf(page, '[data-test-id="schedule_shift_block"]');
    note('shift block', JSON.stringify(s));
    if (s && s.onscreen) {
      await page.mouse.move(s.x, s.y); await page.waitForTimeout(400); await page.mouse.move(s.x + 3, s.y + 3);
      await snap(page, 'tooltip', 2400);
      await page.screenshot({ path: `${OUT}/s3-tooltip.png` }).catch(() => {});
      await page.mouse.move(4, 4); await page.waitForTimeout(800);
    }

    // 2 - empty lane cell: left click, then right click
    const cell = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const cal = document.querySelector('[data-test-id="schedule_calendar"]'); if (!cal) return null;
      const lanes = [...cal.querySelectorAll('.schedule-lane')].filter(vis);
      for (const ln of lanes) {
        if (ln.querySelector('[data-test-id*="block"]')) continue;
        ln.scrollIntoView({ block: 'center' }); return { found: true, lanes: lanes.length };
      }
      return { found: false, lanes: lanes.length };
    });
    note('empty lane', JSON.stringify(cell));
    if (cell && cell.found) {
      const c = await page.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const cal = document.querySelector('[data-test-id="schedule_calendar"]');
        const ln = [...cal.querySelectorAll('.schedule-lane')].filter(v => vis(v) && !v.querySelector('[data-test-id*="block"]'))
          .find(v => { const r = v.getBoundingClientRect(); return r.y > 120 && r.y < innerHeight - 80; });
        if (!ln) return null; const r = ln.getBoundingClientRect();
        return { x: Math.round(r.x + Math.min(r.width / 2, 400)), y: Math.round(r.y + r.height / 2) };
      });
      note('empty cell coord', JSON.stringify(c));
      if (c) {
        await page.mouse.click(c.x, c.y); await snap(page, 'cell-left', 1700);
        await page.screenshot({ path: `${OUT}/s3-cell-left.png` }).catch(() => {}); await esc(page);
        await page.mouse.click(c.x, c.y, { button: 'right' }); await snap(page, 'cell-right', 1700);
        await page.screenshot({ path: `${OUT}/s3-cell-right.png` }).catch(() => {}); await esc(page);
      }
    }

    // 3 - a SERIES block -> modal -> delete -> scope dialog -> CANCEL
    const ser = await centreOf(page, '[data-test-id="schedule_series_block"]');
    note('series block', JSON.stringify(ser));
    if (ser && ser.onscreen) {
      await page.mouse.click(ser.x, ser.y); await snap(page, 'series-modal', 2400);
      await page.screenshot({ path: `${OUT}/s3-series-modal.png` }).catch(() => {});
      const del = await page.evaluate(() => {
        const el = document.querySelector('[data-test-id="button_shift_detail_delete"]');
        if (!el) return false; el.click(); return true;
      });
      note('series delete button', del ? 'clicked -> scope dialog expected' : 'not present');
      if (del) {
        await snap(page, 'series-scope-dialog', 2000);
        await page.screenshot({ path: `${OUT}/s3-series-scope.png` }).catch(() => {});
        await esc(page); await esc(page);   // CANCEL -- confirm is never pressed
      }
      await esc(page);
    }

    // 4 - a plain shift -> delete -> whatever confirm it shows -> CANCEL
    const sh = await centreOf(page, '[data-test-id="schedule_shift_block"]', 1);
    if (sh && sh.onscreen) {
      await page.mouse.click(sh.x, sh.y); await page.waitForTimeout(2200);
      const del = await page.evaluate(() => { const el = document.querySelector('[data-test-id="button_shift_detail_delete"]');
        if (!el) return false; el.click(); return true; });
      if (del) { await snap(page, 'shift-delete-confirm', 2000);
        await page.screenshot({ path: `${OUT}/s3-shift-delete.png` }).catch(() => {}); }
      await esc(page); await esc(page);
    }
  } catch (e) { note('FATAL', String(e).slice(0, 300)); }
  const nonGet = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/harvest3-meta.json`, JSON.stringify({ read_at_utc: new Date().toISOString(),
    non_get_calls: nonGet, api_4xx5xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors }, null, 1));
  console.log('NON-GET API CALLS (must be empty):', JSON.stringify(nonGet));
  await h.browser.close();
})();
