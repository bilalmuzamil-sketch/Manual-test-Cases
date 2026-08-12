// recon.cjs — READ ONLY.  Map the grid so a drag can be aimed accurately.
// No clicks, no drags, no writes.  Prints its non-GET call list at exit; it
// must be empty.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

(async () => {
  const h = await makeHarness('recon');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);

  const map = await page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
      const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity || '1') > 0.01; };
    const box = e => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; };

    // every distinct data-test-id with a count and a sample box
    const ids = {};
    document.querySelectorAll('[data-test-id]').forEach(e => {
      const k = e.getAttribute('data-test-id');
      if (!ids[k]) ids[k] = { n: 0, sample: box(e), text: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 60) };
      ids[k].n++;
    });

    // sidebar work order cards with their line counts
    const cards = [...document.querySelectorAll('[data-test-id=sidebar_work_order_card]')].map(c => {
      const t = (c.innerText || '').replace(/\s+/g, ' ');
      const m = t.match(/(\d+)\s+lines?/);
      return { text: t.slice(0, 80), lines: m ? +m[1] : null, box: box(c) };
    });

    // technician lane labels (the 199px label column) and the row bands
    const lanes = [...document.querySelectorAll('.schedule-lane')].map(e => ({
      text: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 50), box: box(e)
    }));

    // anything that looks like a grid cell / day column
    const cellSel = ['.q-calendar-agenda__day', '[class*=day-column]', '[class*=schedule-cell]', 'td'];
    const cells = {};
    cellSel.forEach(s => {
      const l = [...document.querySelectorAll(s)].filter(vis);
      cells[s] = { n: l.length, boxes: l.slice(0, 6).map(box) };
    });

    // is there an Unassigned row?
    const unassigned = [...document.querySelectorAll('*')].filter(vis)
      .filter(e => e.children.length === 0 && /^unassigned$/i.test((e.textContent || '').trim()))
      .map(e => ({ tag: e.tagName, box: box(e), cls: (e.className || '').toString().slice(0, 80) }));

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      ids, cards, lanes: lanes.slice(0, 40), lane_count: lanes.length, cells, unassigned,
      range: (document.querySelector('[data-test-id=text_schedule_range]') || {}).innerText || null
    };
  });

  await page.screenshot({ path: `${OUT}/recon.png` }).catch(() => { });
  fs.writeFileSync(`${OUT}/recon.json`, JSON.stringify(map, null, 1));
  await h.browser.close();

  console.log('viewport', JSON.stringify(map.viewport), 'range', map.range);
  console.log('lanes', map.lane_count, 'first:', JSON.stringify(map.lanes.slice(0, 3)));
  console.log('unassigned rows found:', map.unassigned.length, JSON.stringify(map.unassigned.slice(0, 3)));
  console.log('cards:', map.cards.length);
  map.cards.slice(0, 8).forEach(c => console.log('   lines=' + c.lines, JSON.stringify(c.box), c.text.slice(0, 55)));
  Object.entries(map.cells).forEach(([k, v]) => console.log('cells', k, v.n, JSON.stringify(v.boxes.slice(0, 3))));
  const NONGET = h.apiLog.filter(a => a.m !== 'GET');
  console.log('NON-GET CALLS (must be empty):', JSON.stringify(NONGET));
  console.log('bridge errors:', h.bridgeErrors.length);
})();
