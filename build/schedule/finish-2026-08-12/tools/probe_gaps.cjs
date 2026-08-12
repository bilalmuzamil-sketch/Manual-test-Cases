// probe_gaps.cjs -- drive the surfaces that hold the labels runnability.py could not resolve.
//
// SAFETY, learned the hard way today: this probe NEVER presses a destructive control.
// The delete-scope wording is already on record from an earlier pass on this same build,
// so there is nothing here worth pressing Delete for a second time.  Non-GET calls are
// printed at exit and are expected to be empty.
const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
const RESULT = `${OUT}/gaps.json`, OPLOG = `${OUT}/gaps-oplog.json`;
const out = {};
function note(op, result, extra) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result }, extra || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${String(result).slice(0, 150)}`);
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
    if (vis(d)) panels.push({ text: (d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1400) });
  });
  return { texts: [...texts], ids: [...ids], panels };
};
async function snap(page, name, ms = 1600) {
  await page.waitForTimeout(ms);
  const s = await page.evaluate(SNAP); out[name] = s;
  fs.writeFileSync(RESULT, JSON.stringify(out, null, 1));
  note(`snap ${name}`, `${s.panels.length} panel(s)` + (s.panels[0] ? ` :: ${s.panels[0].text.slice(0, 130)}` : ''));
  return s;
}
async function clickId(page, tid, nth = 0) {
  return page.evaluate(({ tid, nth }) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const els = [...document.querySelectorAll(`[data-test-id="${tid}"]`)].filter(vis);
    const el = els[nth]; if (!el) return false;
    el.scrollIntoView({ block: 'center' }); el.click(); return true;
  }, { tid, nth });
}
async function clickText(page, needle) {
  return page.evaluate((needle) => {
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    for (const el of document.querySelectorAll('button,.q-btn,.q-item,[role="button"],a,td,div,span,label')) {
      if (!vis(el)) continue;
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (t && t.length < 80 && t.includes(needle)) { el.scrollIntoView({ block: 'center' }); el.click(); return t; }
    }
    return null;
  }, needle);
}
async function esc(p) { await p.keyboard.press('Escape'); await p.waitForTimeout(700); }

(async () => {
  const h = await makeHarness('gaps'); const page = h.page;
  try {
    // ---------- 1. empty-cell menu: Create Event / New Work Order ----------
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(11000);
    // Day view gives the widest empty lanes
    await clickText(page, 'Day'); await page.waitForTimeout(2600);
    const c = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const cal = document.querySelector('[data-test-id="schedule_calendar"]'); if (!cal) return null;
      const lanes = [...cal.querySelectorAll('.schedule-lane')].filter(v =>
        vis(v) && !v.querySelector('[data-test-id*="block"]'));
      const ln = lanes.find(v => { const r = v.getBoundingClientRect(); return r.y > 150 && r.y < innerHeight - 120 && r.width > 200; });
      if (!ln) return { lanes: lanes.length };
      const r = ln.getBoundingClientRect();
      return { x: Math.round(r.x + r.width * 0.6), y: Math.round(r.y + r.height / 2), lanes: lanes.length };
    });
    note('day empty lane', JSON.stringify(c));
    if (c && c.x) {
      await page.mouse.click(c.x, c.y); await snap(page, 'cell-click-day', 1800);
      await page.screenshot({ path: `${OUT}/g-cell-day.png` }).catch(() => {});
      await esc(page);
      await page.mouse.dblclick(c.x, c.y); await snap(page, 'cell-dblclick-day', 1800);
      await page.screenshot({ path: `${OUT}/g-cell-dbl.png` }).catch(() => {}); await esc(page);
      await page.mouse.click(c.x, c.y, { button: 'right' }); await snap(page, 'cell-rightclick-day', 1800);
      await page.screenshot({ path: `${OUT}/g-cell-right.png` }).catch(() => {}); await esc(page);
    }

    // ---------- 2. sidebar Filters -> Clear all ----------
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(9000);
    if (await clickId(page, 'button_sidebar_filters')) { await snap(page, 'sidebar-filters', 1700);
      await page.screenshot({ path: `${OUT}/g-sidebar-filters.png` }).catch(() => {}); }
    await esc(page);

    // ---------- 3. shift detail modal: full body, look for Reassign ----------
    const sh = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const b = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis)[0];
      if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return true;
    });
    if (sh) {
      await snap(page, 'shift-modal-full', 2400);
      await page.screenshot({ path: `${OUT}/g-shift-modal.png` }).catch(() => {});
      // the colour control and the lane heading, without pressing delete
      if (await clickId(page, 'button_shift_detail_color')) { await snap(page, 'shift-colour-menu', 1500); await esc(page); }
      await esc(page);
    }

    // ---------- 4. tooltip overflow (+N more) ----------
    const many = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const bs = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')].filter(vis);
      const b = bs.find(x => /lines/.test(x.innerText || '')) || bs[0];
      if (!b) return null; b.scrollIntoView({ block: 'center' });
      const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    if (many) { await page.mouse.move(many.x, many.y); await page.waitForTimeout(400);
      await page.mouse.move(many.x + 2, many.y + 2); await snap(page, 'tooltip-overflow', 2400);
      await page.screenshot({ path: `${OUT}/g-tooltip.png` }).catch(() => {}); await page.mouse.move(4, 4); }

    // ---------- 5. roles screen -> a role -> Reset to template / View Permissions ----------
    await page.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(8000);
    await snap(page, 'roles-list', 1500);
    await page.screenshot({ path: `${OUT}/g-roles-list.png` }).catch(() => {});
    const kebab = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const el = [...document.querySelectorAll('.q-icon,button,[role="button"]')]
        .filter(vis).find(e => /more_vert|more_horiz/.test((e.innerText || '') + (e.className || '')));
      if (!el) return false; el.click(); return true;
    });
    note('role kebab', kebab ? 'clicked' : 'not found');
    if (kebab) { await snap(page, 'role-kebab-menu', 1500);
      await page.screenshot({ path: `${OUT}/g-role-kebab.png` }).catch(() => {}); await esc(page); }
    const opened = await clickText(page, 'Technician');
    note('open role', opened ? `clicked ${opened}` : 'not found');
    if (opened) { await snap(page, 'role-edit-screen', 2600);
      await page.screenshot({ path: `${OUT}/g-role-edit.png`, fullPage: true }).catch(() => {}); }

    // ---------- 6. working hours: settings -> schedule, and a technician's hours ----------
    for (const [route, tag] of [['/administration/settings', 'settings'], ['/administration/staff', 'staff']]) {
      await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.waitForTimeout(7000);
      await snap(page, `route-${tag}`, 1200);
      for (const needle of ['Schedule', 'Working', 'Hours', 'Business']) {
        const hit = await clickText(page, needle);
        if (hit) { note(`${tag} -> ${needle}`, `clicked ${hit}`); await snap(page, `${tag}-${needle}`, 2200);
          await page.screenshot({ path: `${OUT}/g-${tag}-${needle}.png`, fullPage: true }).catch(() => {}); break; }
      }
    }
  } catch (e) { note('FATAL', String(e).slice(0, 300)); }
  const nonGet = h.apiLog.filter(a => a.m !== 'GET');
  fs.writeFileSync(`${OUT}/gaps-meta.json`, JSON.stringify({ read_at_utc: new Date().toISOString(),
    non_get_calls: nonGet, api_4xx5xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors }, null, 1));
  console.log('NON-GET (must be empty):', JSON.stringify(nonGet));
  await h.browser.close();
})();
