// probe_harvest.cjs -- Schedule finish pass, 2026-08-12.
//
// Walks every surface the 176 cases send a tester to and records, per surface, the
// strings that are ACTUALLY VISIBLE -- computed style checked, not textContent, and
// not aria-label.  A label a tester cannot see is not a label they can follow.
//
// TWO TRAPS THIS PROBE DELIBERATELY AVOIDS (both cost a previous run a false absence):
//   * offsetParent !== null is ALWAYS false for a position:fixed element, and every
//     Quasar dialog is fixed -- so that test reports a fully open modal as closed.
//     Visibility here is getBoundingClientRect().width > 0 && height > 0 plus the
//     computed display/visibility/opacity.
//   * the series cue is a SIBLING structure, not a descendant of the shift block.
//
// Evidence per surface is written after EVERY surface, so a killed run keeps its work.

const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');

const RESULT = `${OUT}/harvest.json`;
const OPLOG = `${OUT}/harvest-oplog.json`;
const surfaces = {};

function note(op, result, extra) {
  const rows = fs.existsSync(OPLOG) ? JSON.parse(fs.readFileSync(OPLOG, 'utf8')) : [];
  rows.push(Object.assign({ at: new Date().toISOString(), op, result }, extra || {}));
  fs.writeFileSync(OPLOG, JSON.stringify(rows, null, 1));
  console.log(`  [${op}] ${result}`);
}

// Collected inside the page.  Returns only strings a human can see.
const HARVEST_FN = () => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01;
  };
  const texts = new Set();
  const testids = new Set();
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    const tid = el.getAttribute('data-test-id') || el.getAttribute('data-testid');
    if (tid) testids.add(tid);
    // own text only -- a container's innerText would swallow the whole page
    let own = '';
    el.childNodes.forEach((n) => { if (n.nodeType === 3) own += n.nodeValue; });
    own = own.replace(/\s+/g, ' ').trim();
    if (own && own.length <= 120) texts.add(own);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const p = el.getAttribute('placeholder');
      if (p) texts.add(p.trim());
    }
  });
  // dialogs open right now, by their real geometry
  const dialogs = [];
  document.querySelectorAll('.q-dialog, [role="dialog"], .q-menu').forEach((d) => {
    if (!vis(d)) return;
    dialogs.push((d.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 900));
  });
  return { texts: [...texts], testids: [...testids], dialogs, url: location.pathname + location.search };
};

async function grab(page, name) {
  await page.waitForTimeout(1400);
  const h = await page.evaluate(HARVEST_FN);
  surfaces[name] = h;
  fs.writeFileSync(RESULT, JSON.stringify(surfaces, null, 1));
  note(`harvest ${name}`, `${h.texts.length} visible strings, ${h.testids.length} test-ids, ${h.dialogs.length} open dialog(s)`);
  return h;
}

// click the first visible element whose own text matches, or whose test-id matches
async function clickByText(page, needle, opts = {}) {
  const done = await page.evaluate(({ needle, exact }) => {
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden';
    };
    const cands = [...document.querySelectorAll('button,[role="button"],.q-item,.q-btn,.q-tab,a,label,div,span')];
    for (const el of cands) {
      if (!vis(el)) continue;
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
      const hit = exact ? t === needle : t.includes(needle);
      if (hit && t.length < 90) {
        el.scrollIntoView({ block: 'center' });
        el.click();
        return true;
      }
    }
    return false;
  }, { needle, exact: !!opts.exact });
  return done;
}

async function clickTestId(page, tid) {
  return page.evaluate((tid) => {
    const el = document.querySelector(`[data-test-id="${tid}"],[data-testid="${tid}"]`);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 0) return false;
    el.scrollIntoView({ block: 'center' });
    el.click();
    return true;
  }, tid);
}

async function esc(page) { await page.keyboard.press('Escape'); await page.waitForTimeout(600); }

(async () => {
  const h = await makeHarness('harvest');
  const page = h.page;
  try {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(11000);
    await grab(page, 'schedule-default');
    await page.screenshot({ path: `${OUT}/hv-01-default.png` }).catch(() => {});

    // ---- the three views -------------------------------------------------
    for (const v of ['Day', 'Week', 'Month']) {
      const ok = await clickByText(page, v, { exact: true });
      if (ok) { await page.waitForTimeout(2600); await grab(page, `view-${v}`); }
      else note(`view ${v}`, 'control not found by exact text');
    }
    await clickByText(page, 'Week', { exact: true }); await page.waitForTimeout(2200);

    // ---- toolbar dropdowns ------------------------------------------------
    for (const [label, tag] of [['View options', 'view-options'], ['Filter & display', 'filter-display'], ['Filters', 'filters']]) {
      const ok = await clickByText(page, label);
      if (ok) { await page.waitForTimeout(1200); await grab(page, `menu-${tag}`);
                await page.screenshot({ path: `${OUT}/hv-menu-${tag}.png` }).catch(() => {}); await esc(page); }
      else note(`menu ${label}`, 'control not found');
    }

    // ---- sidebar drill-down (expand a work order to its lines) ------------
    const drill = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const el = [...document.querySelectorAll('[data-test-id*="expand"],[data-test-id*="chevron"],.q-icon')]
        .find(e => vis(e) && (e.innerText || '').trim() === 'chevron_right');
      if (!el) return false;
      el.scrollIntoView({ block: 'center' }); el.click(); return true;
    });
    if (drill) { await page.waitForTimeout(2000); await grab(page, 'sidebar-drilldown');
                 await page.screenshot({ path: `${OUT}/hv-drilldown.png` }).catch(() => {}); }
    else note('sidebar drill-down', 'chevron not found');

    // ---- shift detail modal ----------------------------------------------
    const opened = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const b = [...document.querySelectorAll('[data-test-id^="schedule_shift_block"],[data-test-id*="shift_block"]')].find(vis);
      if (!b) return false;
      b.scrollIntoView({ block: 'center' }); b.click(); return true;
    });
    if (opened) { await page.waitForTimeout(2400); await grab(page, 'shift-modal');
                  await page.screenshot({ path: `${OUT}/hv-shift-modal.png` }).catch(() => {}); await esc(page); }
    else note('shift modal', 'no visible shift block found');

    // ---- empty-cell menu (Create Event / New Work Order) ------------------
    const cell = await page.evaluate(() => {
      const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
      const c = [...document.querySelectorAll('[data-test-id*="cell"],.q-calendar__day,[class*="day-cell"]')].filter(vis);
      const t = c[Math.floor(c.length / 2)];
      if (!t) return false;
      const r = t.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    if (cell) {
      await page.mouse.click(cell.x, cell.y); await page.waitForTimeout(1600);
      await grab(page, 'cell-menu');
      await page.screenshot({ path: `${OUT}/hv-cell-menu.png` }).catch(() => {});
      await esc(page);
    } else note('cell menu', 'no calendar cell located');

    // ---- other routes the cases send a tester to -------------------------
    for (const [route, tag] of [
      ['/administration/roles-permissions', 'roles'],
      ['/administration/staff', 'staff'],
      ['/administration/settings', 'settings'],
    ]) {
      await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
      await page.waitForTimeout(7000);
      await grab(page, `route-${tag}`);
    }
  } catch (e) {
    note('FATAL', String(e).slice(0, 300));
  }
  fs.writeFileSync(`${OUT}/harvest-meta.json`, JSON.stringify({
    read_at_utc: new Date().toISOString(),
    api_4xx5xx: h.apiLog.filter(a => a.s >= 400),
    bridge_errors: h.bridgeErrors,
  }, null, 1));
  console.log('surfaces harvested:', Object.keys(surfaces).join(', '));
  await h.browser.close();
})();
