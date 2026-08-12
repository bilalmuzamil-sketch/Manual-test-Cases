// probe_picker.cjs — open the scope picker on a MULTI-LINE work order and
// harvest it fully, then exercise 'Select multiple' (C29967 items 1-4).
//
// A 1-line order opens NO picker and is not expected to; the earlier "the
// picker never appears" reports were all dragging a 1-line card.  The second
// trap was a drop target computed at y=2095 in a 1080-tall viewport, which
// lands on nothing.  Both are guarded below.
//
// NOTHING IS COMMITTED IN THIS PROBE.  Confirm is never pressed.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const { READ_OVERLAY } = require('./lib.cjs');
const fs = require('fs');

(async () => {
  const h = await makeHarness('picker');
  const page = h.page;
  const rec = { steps: [] };
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);

  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button,[role=button],.q-btn'))
      .find(e => (e.textContent || '').trim() === 'Week');
    if (b) b.click();
  });
  await page.waitForTimeout(5000);

  // pick the card with the MOST lines - more lines = more to read in the picker
  const src = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    let best = null, bestN = 1;
    for (const c of cards) {
      const m = (c.innerText || '').match(/(\d+)\s+lines/);
      if (m && +m[1] > bestN) { bestN = +m[1]; best = c; }
    }
    if (!best) return { ok: false, cards: cards.length };
    best.scrollIntoView({ block: 'center' });
    const r = best.getBoundingClientRect();
    return { ok: true, lines: bestN, text: (best.innerText || '').replace(/\s+/g, ' ').slice(0, 120),
             x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  rec.src = src;

  const tgt = await page.evaluate(() => {
    const vh = window.innerHeight, vw = window.innerWidth;
    const cells = Array.from(document.querySelectorAll('.q-calendar-agenda__day, [class*=day-column], td'))
      .filter(e => { const r = e.getBoundingClientRect();
        return r.width > 60 && r.height > 25 && r.x > 320 && r.x + r.width < vw
               && r.y > 250 && r.y + Math.min(30, r.height) < vh - 20; });
    const c = cells[Math.floor(cells.length / 2)];
    if (!c) return { ok: false, cells: cells.length, vh, vw };
    const r = c.getBoundingClientRect();
    return { ok: true, x: Math.round(r.x + r.width / 2), y: Math.round(r.y + Math.min(30, r.height / 2)), cells: cells.length, vh, vw };
  });
  rec.tgt = tgt;

  if (src.ok && tgt.ok) {
    await page.mouse.move(src.x, src.y); await page.mouse.down();
    for (let i = 1; i <= 25; i++) {
      await page.mouse.move(src.x + (tgt.x - src.x) * i / 25, src.y + (tgt.y - src.y) * i / 25);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(700); await page.mouse.up(); await page.waitForTimeout(6000);
  }
  rec.steps.push({ step: 'after drag', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/picker-01-opened.png` }).catch(() => {});

  // ---- 'Select multiple'
  const clicked = await page.evaluate(() => {
    const open = Array.from(document.querySelectorAll('.q-dialog__inner,[role=dialog],.q-menu'))
      .filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const s = open[open.length - 1]; if (!s) return { ok: false, why: 'no overlay' };
    const b = Array.from(s.querySelectorAll('button,[role=button],.q-btn,div,span'))
      .find(e => (e.innerText || '').trim() === 'Select multiple');
    if (!b) return { ok: false, why: 'no Select multiple' };
    b.scrollIntoView({ block: 'center' }); b.click();
    return { ok: true };
  });
  rec.select_multiple_click = clicked;
  await page.waitForTimeout(3500);
  rec.steps.push({ step: 'after Select multiple', overlay: await page.evaluate(READ_OVERLAY) });
  await page.screenshot({ path: `${OUT}/picker-02-selectmultiple.png` }).catch(() => {});

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(2000);
  fs.writeFileSync(`${OUT}/picker.json`, JSON.stringify({ ...rec, api_4xx: h.apiLog.filter(a => a.s >= 400), bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();

  console.log('SRC:', JSON.stringify(src).slice(0, 150));
  console.log('TGT:', JSON.stringify(tgt));
  for (const s of rec.steps) {
    console.log('\n### ' + s.step + '  (overlays open: ' + s.overlay.open + ')');
    (s.overlay.nodes || []).forEach(n => console.log('   TXT ' + JSON.stringify(n.shown) + (n.transform !== 'none' ? ' [' + n.transform + ']' : '')));
    (s.overlay.buttons || []).forEach(b => console.log('   BTN ' + JSON.stringify(b.shown) + ' tid=' + b.tid + ' tag=' + b.tag + (b.disabled ? ' DISABLED' : '') + ' @' + b.x + ',' + b.y));
  }
})();
