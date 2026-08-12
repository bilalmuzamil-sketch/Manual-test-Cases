// probe_viewonly.cjs — drive the Schedule page AS THE TECHNICIAN (Schedule: View,
// no Edit, no Delete) and record what that user actually sees.
//
// Targets C30074, C30075, C30082, C30044.
//
// TWO RULES THIS PROBE OBEYS:
//  * labels are read from the VISIBLE TEXT NODE with the COMPUTED text-transform
//    recorded beside them.  These panels are styled uppercase, so textContent
//    alone certifies wording no tester sees, and a screenshot certifies the
//    painted string rather than the stored one.
//  * before recording a control ABSENT, the state it should appear in is proven
//    first and written into the evidence, so an absence can never be an artefact
//    of the state we were standing in.
//
// It creates nothing and saves nothing.  Every interaction is a read.

const { makeHarness, APP, OUT } = require('./harness_tech.cjs');
const fs = require('fs');

const READ = () => `(${function () {
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        out.push({ raw: n.textContent.trim(), transform: cs.textTransform,
                   tag: el.tagName.toLowerCase(),
                   tid: el.getAttribute('data-test-id') || el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
      }
    }
  });
  return out;
}})()`;

(async () => {
  const h = await makeHarness('tech-viewonly');
  const p = h.page;
  const R = { steps: [], read_at_utc: new Date().toISOString() };
  const shot = async n => p.screenshot({ path: `${OUT}/tech-${n}.png` }).catch(() => {});

  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(12000);

  // ---- identity, on screen, before anything else -------------------------
  R.identity = await p.evaluate(() => ({
    nav: [...document.querySelectorAll('nav a, header a, aside a')]
          .map(a => a.innerText.trim()).filter(Boolean).slice(0, 20),
    avatar: document.body.innerText.match(/\b[A-Z]{2}\b/) ? 'see screenshot' : null,
    url: location.href,
  }));
  await shot('01-landed');

  // ---- C30074 item 1: the three views ------------------------------------
  R.views = {};
  for (const v of ['day', 'week', 'month']) {
    const tid = `button_schedule_view_${v}`;
    const el = await p.$(`[data-test-id="${tid}"]`);
    if (!el) { R.views[v] = { control: 'ABSENT' }; continue; }
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await el.click().catch(() => {});
    await p.waitForTimeout(3500);
    R.views[v] = await p.evaluate((t) => ({
      control: 'present',
      pressed: document.querySelector(`[data-test-id="${t}"]`)?.getAttribute('aria-pressed'),
      grid_rows: document.querySelectorAll('[data-test-id^="schedule_row"], [data-test-id^="grid_row"]').length,
      blocks: document.querySelectorAll('[data-test-id^="shift_block"], [data-test-id^="event_block"]').length,
    }), tid);
    await shot(`02-view-${v}`);
  }

  // back to week, the default
  await p.click('[data-test-id="button_schedule_view_week"]').catch(() => {});
  await p.waitForTimeout(3000);

  // ---- C30082 / C30074 item 3: whose shifts are visible -------------------
  R.grid_population = await p.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-test-id]')]
      .filter(e => /technician_row|schedule_row|row_tech/.test(e.getAttribute('data-test-id') || ''));
    const names = [...new Set(rows.map(r => (r.innerText || '').split('\n')[0].trim()).filter(Boolean))];
    return { row_count: rows.length, technician_names: names.slice(0, 40) };
  });

  // ---- C30075 item 1: drag handles on the sidebar -------------------------
  R.sidebar_drag = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')];
    return {
      cards: cards.length,
      draggable_true: cards.filter(c => c.getAttribute('draggable') === 'true').length,
      any_draggable_descendant: cards.filter(c => c.querySelector('[draggable="true"]')).length,
      arm_buttons: document.querySelectorAll('[data-test-id^="button_sidebar_arm"]').length,
      handle_like: [...document.querySelectorAll('[class*="handle"],[class*="drag"]')].length,
    };
  });

  // ---- C30075 item 3: left-click an empty grid cell ----------------------
  const cell = await p.$('[data-test-id^="schedule_cell"], [data-test-id^="grid_cell"]');
  R.cell_menu = { cell_found: !!cell };
  if (cell) {
    await cell.scrollIntoViewIfNeeded().catch(() => {});
    const box = await cell.boundingBox();
    if (box) {
      await p.mouse.click(box.x + box.width / 2, Math.min(box.y + box.height / 2, 1000));
      await p.waitForTimeout(2500);
      R.cell_menu.menus_open = await p.evaluate(() => {
        const m = [...document.querySelectorAll('.q-menu')].filter(x => x.offsetParent !== null);
        const last = m[m.length - 1];
        return { count: m.length, text: last ? last.innerText.trim().slice(0, 300) : null };
      });
      await shot('03-cell-leftclick');
      await p.keyboard.press('Escape').catch(() => {});
    }
  }

  // ---- C30074 item 4 / C30075 item 4: the shift detail modal -------------
  const block = await p.$('[data-test-id^="shift_block"]');
  R.modal = { block_found: !!block };
  if (block) {
    await block.scrollIntoViewIfNeeded().catch(() => {});
    const bb = await block.boundingBox();
    if (bb) {
      await p.mouse.move(bb.x + bb.width / 2, Math.min(bb.y + bb.height / 2, 1000));
      await p.waitForTimeout(2000);
      R.modal.tooltip = await p.evaluate(() => {
        const t = [...document.querySelectorAll('.q-tooltip')].filter(x => x.offsetParent !== null);
        return t.length ? t[t.length - 1].innerText.trim().slice(0, 400) : null;
      });
      await shot('04-tooltip');
      await p.mouse.click(bb.x + bb.width / 2, Math.min(bb.y + bb.height / 2, 1000));
      await p.waitForTimeout(3500);
      R.modal.open = await p.evaluate(() => {
        const d = [...document.querySelectorAll('.q-dialog')].filter(x => x.offsetParent !== null);
        if (!d.length) return null;
        const last = d[d.length - 1];
        const inputs = [...last.querySelectorAll('input,textarea,select')];
        return {
          text: last.innerText.trim().slice(0, 900),
          test_ids: [...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')),
          inputs: inputs.length,
          inputs_enabled: inputs.filter(i => !i.disabled && !i.readOnly).length,
          buttons: [...last.querySelectorAll('button')].map(b => ({
            t: b.innerText.trim(), disabled: b.disabled,
            tid: b.getAttribute('data-test-id') })).filter(b => b.t || b.tid),
        };
      });
      await shot('05-modal');
      await p.keyboard.press('Escape').catch(() => {});
      await p.waitForTimeout(1500);
    }
  }

  // ---- C30044 / C30082: 'My Shifts' inside 'Filter & display' ------------
  R.filter_display = { opened: false };
  for (const sel of ['[data-test-id="button_schedule_filter_display"]',
                     '[aria-label="Filter and display options"]',
                     '[data-test-id="schedule_filter_display_menu"]']) {
    const b = await p.$(sel);
    if (!b) continue;
    await b.scrollIntoViewIfNeeded().catch(() => {});
    const bx = await b.boundingBox();
    if (!bx) continue;
    await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2);
    await p.waitForTimeout(2500);
    const got = await p.evaluate(() => {
      const m = [...document.querySelectorAll('.q-menu')].filter(x => x.offsetParent !== null);
      if (!m.length) return null;
      const last = m[m.length - 1];
      const nodes = [];
      last.querySelectorAll('*').forEach(el => {
        for (const n of el.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim()) {
            const cs = getComputedStyle(el);
            nodes.push({ raw: n.textContent.trim(), transform: cs.textTransform,
                         tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
          }
        }
      });
      return { nodes, test_ids: [...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')) };
    });
    if (got) { R.filter_display = { opened: true, selector: sel, ...got }; await shot('06-filter-display'); break; }
    await p.keyboard.press('Escape').catch(() => {});
  }

  R.api_4xx = h.apiLog.filter(a => a.s >= 400);
  R.api_calls = h.apiLog.length;
  R.bridge_errors = h.bridgeErrors;
  R.console_errors = h.consoleErrs.slice(0, 20);
  R.all_text = await p.evaluate(READ()).catch(() => []);
  fs.writeFileSync(`${OUT}/tech-viewonly.json`, JSON.stringify(R, null, 1));

  console.log('views      :', JSON.stringify(R.views));
  console.log('sidebar    :', JSON.stringify(R.sidebar_drag));
  console.log('cell menu  :', JSON.stringify(R.cell_menu));
  console.log('modal      :', R.modal.open ? JSON.stringify(R.modal.open).slice(0, 700) : 'NOT OPENED');
  console.log('filter&disp:', R.filter_display.opened ? JSON.stringify(R.filter_display.nodes.map(n => n.raw)) : 'NOT OPENED');
  console.log('bridge errs:', R.bridge_errors.length, '| api 4xx:', JSON.stringify(R.api_4xx));
  await h.browser.close();
})();
