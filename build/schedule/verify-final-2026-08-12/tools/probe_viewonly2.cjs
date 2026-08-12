// probe_viewonly2.cjs — second run, with the REAL test-ids discovered from the
// technician's own DOM.
//
// THE FIRST RUN REPORTED FOUR CONTROLS ABSENT AND ALL FOUR WERE MY SELECTORS,
// NOT THE BUILD: the view buttons live under `schedule_view_toggle`, not
// `button_schedule_view_day`; blocks are `schedule_shift_block`, not
// `shift_block`.  That is recorded rather than quietly fixed, because it is the
// exact shape of a false "the control is missing" finding.
//
// Nothing is created and nothing is saved.  Every interaction is a read.

const { makeHarness, APP, OUT } = require('./harness_tech.cjs');
const fs = require('fs');

const NODES = sel => `(${function (s) {
  const root = s ? document.querySelector(s) : document.body;
  if (!root) return null;
  const out = [];
  root.querySelectorAll('*').forEach(el => {
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        out.push({ raw: n.textContent.trim(), transform: cs.textTransform,
                   tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
      }
    }
  });
  return out;
}})(${JSON.stringify(sel)})`;

(async () => {
  const h = await makeHarness('tech2');
  const p = h.page;
  const R = { read_at_utc: new Date().toISOString(), note: 'run 2, real test-ids' };
  const shot = n => p.screenshot({ path: `${OUT}/tech2-${n}.png` }).catch(() => {});

  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(12000);

  // ---------- the state, PROVEN, before any absence is recorded ----------
  R.state = await p.evaluate(() => ({
    url: location.href,
    range: document.querySelector('[data-test-id="text_schedule_range"]')?.innerText.trim(),
    sidebar_cards: document.querySelectorAll('[data-test-id="sidebar_work_order_card"]').length,
    shift_blocks: document.querySelectorAll('[data-test-id="schedule_shift_block"]').length,
    event_blocks: document.querySelectorAll('[data-test-id="schedule_event_block"]').length,
    lanes: document.querySelectorAll('[data-test-id="schedule_lane_label"]').length,
    viewport: { w: innerWidth, h: innerHeight },
    nav: [...document.querySelectorAll('[data-test-id="button_desktop_nav_link"]')].map(a => a.innerText.trim()),
  }));
  await shot('01-landed');

  // ---------- C30074 item 1 : Day / Week / Month ----------
  R.views = {};
  const toggle = await p.$('[data-test-id="schedule_view_toggle"]');
  R.views.toggle_present = !!toggle;
  if (toggle) {
    for (const label of ['Day', 'Week', 'Month']) {
      const btn = await p.$(`[data-test-id="schedule_view_toggle"] >> text="${label}"`);
      if (!btn) { R.views[label] = 'BUTTON NOT FOUND'; continue; }
      await btn.scrollIntoViewIfNeeded().catch(() => {});
      await btn.click().catch(() => {});
      await p.waitForTimeout(4000);
      R.views[label] = await p.evaluate(() => ({
        range: document.querySelector('[data-test-id="text_schedule_range"]')?.innerText.trim(),
        blocks: document.querySelectorAll('[data-test-id="schedule_shift_block"]').length,
        lanes: document.querySelectorAll('[data-test-id="schedule_lane_label"]').length,
      }));
      await shot('02-view-' + label);
    }
    await p.$(`[data-test-id="schedule_view_toggle"] >> text="Week"`).then(b => b && b.click()).catch(() => {});
    await p.waitForTimeout(3500);
  }

  // ---------- C30082 : whose shifts are on the grid ----------
  R.who_is_visible = await p.evaluate(() => {
    const labels = [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')];
    const names = new Set();
    labels.forEach(l => l.innerText.split('\n').map(s => s.trim())
      .filter(s => s && s.length > 3 && /[a-z]/.test(s)).forEach(s => names.add(s)));
    return { lane_labels: labels.length, names: [...names] };
  });

  // ---------- C30075 item 1 : drag affordances in the sidebar ----------
  R.sidebar_drag = await p.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-test-id="sidebar_work_order_card"]')];
    return {
      cards: cards.length,
      card_draggable_attr: cards.map(c => c.getAttribute('draggable')).filter(Boolean).length,
      descendant_draggable: cards.filter(c => c.querySelector('[draggable="true"]')).length,
      arm_buttons: document.querySelectorAll('[data-test-id*="arm"]').length,
      cursor_grab: cards.filter(c => /grab|move/.test(getComputedStyle(c).cursor)).length,
      first_card_testids: cards.length ? [...cards[0].querySelectorAll('[data-test-id]')]
        .map(e => e.getAttribute('data-test-id')) : [],
    };
  });

  // ---------- C30075 item 3 : left-click an empty grid spot ----------
  R.cell_menu = {};
  const lane = await p.$('[data-test-id="schedule_lane_label"]');
  if (lane) {
    const lb = await lane.boundingBox();
    if (lb) {
      // click well to the right of the lane label, on the lane's own row, in an
      // area carrying no block - i.e. an empty cell
      const x = Math.min(lb.x + lb.width + 420, 1600);
      const y = Math.min(lb.y + lb.height / 2, 1000);
      R.cell_menu.clicked_at = { x, y };
      R.cell_menu.element_there = await p.evaluate(({ x, y }) => {
        const e = document.elementFromPoint(x, y);
        return e ? { tag: e.tagName, tid: e.closest('[data-test-id]')?.getAttribute('data-test-id') || null,
                     inside_block: !!e.closest('[data-test-id="schedule_shift_block"]') } : null;
      }, { x, y });
      await p.mouse.click(x, y);
      await p.waitForTimeout(2500);
      R.cell_menu.after = await p.evaluate(() => {
        const m = [...document.querySelectorAll('.q-menu')].filter(x => x.offsetParent !== null);
        const d = [...document.querySelectorAll('.q-dialog')].filter(x => x.offsetParent !== null);
        return { menus: m.length, menu_text: m.length ? m[m.length - 1].innerText.trim().slice(0, 300) : null,
                 dialogs: d.length, dialog_text: d.length ? d[d.length - 1].innerText.trim().slice(0, 300) : null };
      });
      await shot('03-empty-cell-click');
      await p.keyboard.press('Escape').catch(() => {});
      await p.waitForTimeout(1200);
    }
  }

  // ---------- C30074 item 4 / C30075 item 4 : tooltip + detail modal ----------
  R.modal = {};
  const block = await p.$('[data-test-id="schedule_shift_block"]');
  R.modal.block_found = !!block;
  if (block) {
    await block.scrollIntoViewIfNeeded().catch(() => {});
    const bb = await block.boundingBox();
    if (bb) {
      const cx = bb.x + bb.width / 2, cy = Math.min(bb.y + bb.height / 2, 1000);
      await p.mouse.move(cx, cy); await p.waitForTimeout(2200);
      R.modal.tooltip = await p.evaluate(() => {
        const t = [...document.querySelectorAll('.q-tooltip')].filter(x => x.offsetParent !== null);
        return t.length ? t[t.length - 1].innerText.trim().slice(0, 400) : null;
      });
      await shot('04-tooltip');
      await p.mouse.click(cx, cy); await p.waitForTimeout(4000);
      R.modal.opened = await p.evaluate(() => {
        const d = [...document.querySelectorAll('.q-dialog')].filter(x => x.offsetParent !== null);
        if (!d.length) return null;
        const last = d[d.length - 1];
        const inputs = [...last.querySelectorAll('input,textarea,select')];
        return {
          test_ids: [...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')),
          inputs: inputs.length,
          inputs_editable: inputs.filter(i => !i.disabled && !i.readOnly).length,
          buttons: [...last.querySelectorAll('button')].map(b => ({
            t: b.innerText.trim().slice(0, 40), disabled: b.disabled,
            tid: b.getAttribute('data-test-id') })),
        };
      });
      R.modal.nodes = await p.evaluate(NODES('.q-dialog'));
      await shot('05-modal');
      await p.keyboard.press('Escape').catch(() => {});
      await p.waitForTimeout(1500);
    }
  }

  // ---------- C30044 / C30082 : 'My Shifts' ----------
  R.my_shifts = {};
  const fd = await p.$('[data-test-id="schedule_filter_display_menu"]');
  R.my_shifts.menu_anchor_found = !!fd;
  if (fd) {
    const fb = await fd.boundingBox();
    if (fb) {
      await p.mouse.click(fb.x + fb.width / 2, fb.y + fb.height / 2);
      await p.waitForTimeout(2500);
      R.my_shifts.panel = await p.evaluate(NODES('.q-menu:last-of-type'));
      R.my_shifts.before = await p.evaluate(() => {
        const t = document.querySelector('[data-test-id="toggle_schedule_my_shifts"]');
        const inp = t && t.querySelector('input');
        return t ? { present: true, text: t.innerText.trim(),
                     checked: inp ? inp.getAttribute('aria-checked') || String(inp.checked) : null } : { present: false };
      });
      await shot('06-filter-display-open');

      const ms = await p.$('[data-test-id="toggle_schedule_my_shifts"]');
      if (ms) {
        const lanesBefore = await p.evaluate(() =>
          [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].length);
        await ms.click().catch(() => {});
        await p.waitForTimeout(4000);
        R.my_shifts.after_on = await p.evaluate(() => {
          const labels = [...document.querySelectorAll('[data-test-id="schedule_lane_label"]')];
          const names = new Set();
          labels.forEach(l => l.innerText.split('\n').map(s => s.trim())
            .filter(s => s && s.length > 3 && /[a-z]/.test(s)).forEach(s => names.add(s)));
          const inp = document.querySelector('[data-test-id="toggle_schedule_my_shifts"] input');
          return { lanes: labels.length, names: [...names],
                   checked: inp ? inp.getAttribute('aria-checked') || String(inp.checked) : null,
                   blocks: document.querySelectorAll('[data-test-id="schedule_shift_block"]').length };
        });
        R.my_shifts.lanes_before = lanesBefore;
        await shot('07-my-shifts-on');

        await ms.click().catch(() => {});          // restore - default is OFF
        await p.waitForTimeout(4000);
        R.my_shifts.after_off = await p.evaluate(() => {
          const inp = document.querySelector('[data-test-id="toggle_schedule_my_shifts"] input');
          return { lanes: document.querySelectorAll('[data-test-id="schedule_lane_label"]').length,
                   checked: inp ? inp.getAttribute('aria-checked') || String(inp.checked) : null };
        });
        await shot('08-my-shifts-off');
      }
      await p.keyboard.press('Escape').catch(() => {});
    }
  }

  R.api_4xx = h.apiLog.filter(a => a.s >= 400);
  R.api_writes = h.apiLog.filter(a => a.m !== 'GET');
  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/tech-viewonly2.json`, JSON.stringify(R, null, 1));

  console.log('state      :', JSON.stringify(R.state));
  console.log('views      :', JSON.stringify(R.views));
  console.log('who visible:', JSON.stringify(R.who_is_visible));
  console.log('sidebar    :', JSON.stringify(R.sidebar_drag));
  console.log('cell click :', JSON.stringify(R.cell_menu));
  console.log('modal      :', JSON.stringify(R.modal.opened));
  console.log('my shifts  :', JSON.stringify({ b: R.my_shifts.before, on: R.my_shifts.after_on, off: R.my_shifts.after_off }));
  console.log('api writes :', JSON.stringify(R.api_writes), '| 4xx:', JSON.stringify(R.api_4xx), '| bridge:', R.bridge_errors.length);
  await h.browser.close();
})();
