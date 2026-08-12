// probe_gaps2.cjs -- second attempt at the four surfaces gaps.cjs did not reach.
// Every target is scrolled into view FIRST and its rectangle re-read after the scroll.
// No destructive control is pressed anywhere in this file.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/gaps2.json`, OPLOG = `${OUT}/gaps2-oplog.json`;
const out = {};
function note(op, r, x) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result: r }, x || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${String(r).slice(0, 170)}`);
}
const SNAP = () => {
  const vis = (el) => { const r = el.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
  const texts = new Set(), ids = new Set();
  document.querySelectorAll('*').forEach(el => {
    if (!vis(el)) return;
    const t = el.getAttribute('data-test-id'); if (t) ids.add(t);
    let own = ''; el.childNodes.forEach(n => { if (n.nodeType === 3) own += n.nodeValue; });
    own = own.replace(/\s+/g, ' ').trim(); if (own && own.length <= 140) texts.add(own);
    if (el.tagName === 'INPUT') { const p = el.getAttribute('placeholder'); if (p) texts.add(p.trim()); }
  });
  const panels = [];
  document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"],.q-tooltip').forEach(d => {
    if (vis(d)) panels.push({ text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1600) });
  });
  return { texts: [...texts], ids: [...ids], panels };
};
async function snap(page, name, ms = 1700) {
  await page.waitForTimeout(ms);
  const s = await page.evaluate(SNAP); out[name] = s;
  fs.writeFileSync(RESULT, JSON.stringify(out, null, 1));
  note(`snap ${name}`, `${s.panels.length} panel(s)` + (s.panels[0] ? ` :: ${s.panels[0].text.slice(0, 140)}` : ''));
  return s;
}
async function esc(p) { await p.keyboard.press('Escape'); await p.waitForTimeout(600); }

(async () => {
  const h = await makeHarness('gaps2'); const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(11000);

    // --- 1. empty cell: scroll a block-free lane into view, THEN read its rect -----
    const coord = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const cal = document.querySelector('[data-test-id="schedule_calendar"]'); if (!cal) return null;
      const lanes = [...cal.querySelectorAll('.schedule-lane')].filter(v => vis(v) && !v.querySelector('[data-test-id*="block"]'));
      if (!lanes.length) return { lanes: 0 };
      const ln = lanes[Math.floor(lanes.length / 2)];
      ln.scrollIntoView({ block: 'center', inline: 'center' });
      return new Promise(res => setTimeout(() => {
        const r = ln.getBoundingClientRect();
        res({ x: Math.round(r.x + r.width * 0.55), y: Math.round(r.y + r.height / 2),
              w: Math.round(r.width), hgt: Math.round(r.height), lanes: lanes.length,
              onscreen: r.y > 60 && r.y < innerHeight - 40 });
      }, 700));
    });
    note('empty lane (scrolled)', JSON.stringify(coord));
    if (coord && coord.onscreen) {
      await page.mouse.click(coord.x, coord.y); await snap(page, 'cell-click', 1900);
      await page.screenshot({ path: `${OUT}/g2-cell-click.png` }).catch(() => {}); await esc(page);
      await page.mouse.dblclick(coord.x, coord.y); await snap(page, 'cell-dblclick', 1900);
      await page.screenshot({ path: `${OUT}/g2-cell-dbl.png` }).catch(() => {}); await esc(page);
      await page.mouse.click(coord.x, coord.y, { button: 'right' }); await snap(page, 'cell-right', 1900);
      await page.screenshot({ path: `${OUT}/g2-cell-right.png` }).catch(() => {}); await esc(page);
    }

    // --- 2. sidebar filters: tick a status, THEN look for a clear control ---------
    await page.evaluate(() => { const el = document.querySelector('[data-test-id="button_sidebar_filters"]'); if (el) el.click(); });
    await page.waitForTimeout(1500);
    const ticked = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const m = [...document.querySelectorAll('.q-menu,[role="menu"]')].find(vis); if (!m) return null;
      const item = [...m.querySelectorAll('.q-item,label,div')].filter(vis)
        .find(e => /Approved/.test((e.innerText || '')) && (e.innerText || '').length < 40);
      if (!item) return null; item.click(); return (item.innerText || '').trim();
    });
    note('tick a status filter', ticked || 'no item found');
    await snap(page, 'sidebar-filters-active', 1900);
    await page.screenshot({ path: `${OUT}/g2-filters-active.png` }).catch(() => {}); await esc(page);
    // and the toolbar Filters chip area once a filter is on
    await snap(page, 'board-with-filter', 1500);

    // --- 3. roles: open a role's own edit screen (row click, not the kebab) -------
    await page.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(8000);
    const rowOpened = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      // a table row whose text names a role -> click the row itself
      const rows = [...document.querySelectorAll('tr,.q-item,[class*="row"]')].filter(vis)
        .filter(e => /Technician/.test(e.innerText || '') && (e.innerText || '').length < 200);
      if (!rows.length) return null;
      const r = rows[0]; r.scrollIntoView({ block: 'center' }); r.click();
      return (r.innerText || '').replace(/\s+/g, ' ').slice(0, 90);
    });
    note('role row click', rowOpened || 'no row matched');
    await snap(page, 'role-after-row-click', 2600);
    await page.screenshot({ path: `${OUT}/g2-role-row.png`, fullPage: true }).catch(() => {});
    note('url after role click', page.url());

    // --- 4. staff: the pencil on a technician -> working hours -------------------
    await page.goto(APP + '/administration/staff', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(9000);
    await snap(page, 'staff-list', 1500);
    const pencil = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const el = [...document.querySelectorAll('.q-icon,button,[role="button"],i')].filter(vis)
        .find(e => /edit|create|mode_edit/.test((e.innerText || '') + ' ' + (e.className || '')));
      if (!el) return null; el.scrollIntoView({ block: 'center' }); el.click();
      return (el.innerText || el.className || '').slice(0, 60);
    });
    note('staff pencil', pencil || 'not found');
    if (pencil) { await snap(page, 'staff-edit-dialog', 2800);
      await page.screenshot({ path: `${OUT}/g2-staff-edit.png`, fullPage: true }).catch(() => {});
      // inside the dialog, look for the working-hours entry point (READ ONLY)
      const wh = await page.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const d = [...document.querySelectorAll('.q-dialog,[role="dialog"]')].filter(vis)[0]; if (!d) return null;
        const e = [...d.querySelectorAll('button,.q-btn,.q-item,label,div,span')].filter(vis)
          .find(x => /hours/i.test(x.innerText || '') && (x.innerText || '').length < 80);
        if (!e) return null; e.scrollIntoView({ block: 'center' }); e.click();
        return (e.innerText || '').replace(/\s+/g, ' ').trim();
      });
      note('working-hours entry', wh || 'no "hours" control in the staff dialog');
      if (wh) { await snap(page, 'working-hours', 2400);
        await page.screenshot({ path: `${OUT}/g2-working-hours.png`, fullPage: true }).catch(() => {}); }
      await esc(page); await esc(page);
    }
  } catch (e) { note('FATAL', String(e).slice(0, 300)); }
  const nonGet = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/gaps2-meta.json`, JSON.stringify({ read_at_utc: new Date().toISOString(),
    non_get_calls: nonGet, api_4xx5xx: h.apiLog.filter(a => a.s >= 400) }, null, 1));
  console.log('NON-GET (must be empty):', JSON.stringify(nonGet));
  await h.browser.close();
})();
