// probe_modal_readonly.cjs — the shift detail modal, the block affordances, and
// the three navigation controls C30074 step 3 names, all AS THE TECHNICIAN.
//
// A HARNESS TRAP, RECORDED BECAUSE IT PRODUCED A FALSE ABSENCE IN RUN 2:
//   `offsetParent !== null` IS ALWAYS FALSE FOR A position:fixed ELEMENT.
//   Quasar dialogs are fixed, so that test reported "the modal did not open"
//   while the modal was open and fully populated.  Visibility here is decided by
//   getBoundingClientRect().width > 0, which is correct for fixed elements.
//
// Nothing is created, nothing saved, nothing dragged.  Every interaction is a read.

const { makeHarness, APP, OUT } = require('./harness_tech.cjs');
const fs = require('fs');

const VISIBLE_DIALOG = `(${function () {
  const d = [...document.querySelectorAll('.q-dialog')]
    .filter(x => x.getBoundingClientRect().width > 0);
  return d.length ? d[d.length - 1] : null;
}})()`;

(async () => {
  const h = await makeHarness('tech3');
  const p = h.page;
  const R = { read_at_utc: new Date().toISOString() };
  const shot = n => p.screenshot({ path: `${OUT}/tech3-${n}.png` }).catch(() => {});

  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(12000);

  // ---- C30074 step 3 : mini calendar, toolbar search, sidebar filter ----
  R.nav_controls = {};

  // mini calendar - click a specific day and read the range
  const before = await p.evaluate(() => document.querySelector('[data-test-id="text_schedule_range"]')?.innerText.trim());
  const day = await p.$('[data-test-id="button_mini_calendar_day_2026-08-19"]');
  if (day) {
    await day.click().catch(() => {});
    await p.waitForTimeout(3500);
  }
  R.nav_controls.mini_calendar = {
    control: !!day, range_before: before,
    range_after: await p.evaluate(() => document.querySelector('[data-test-id="text_schedule_range"]')?.innerText.trim()),
  };
  await shot('01-minical');

  // toolbar search
  const st = await p.$('[data-test-id="button_schedule_search_toggle"]');
  R.nav_controls.search = { toggle: !!st };
  if (st) {
    await st.click().catch(() => {});
    await p.waitForTimeout(2000);
    const cardsBefore = await p.evaluate(() => document.querySelectorAll('[data-test-id="sidebar_work_order_card"]').length);
    const inp = await p.$('[data-test-id="input_sidebar_search"], [data-test-id="schedule_sidebar"] input');
    if (inp) {
      await inp.fill('Fuline').catch(() => {});
      await p.waitForTimeout(4000);
      R.nav_controls.search.cards_before = cardsBefore;
      R.nav_controls.search.cards_after = await p.evaluate(() =>
        document.querySelectorAll('[data-test-id="sidebar_work_order_card"]').length);
      R.nav_controls.search.first_card = await p.evaluate(() =>
        document.querySelector('[data-test-id="sidebar_work_order_card"]')?.innerText.replace(/\n/g, ' | ').slice(0, 120));
      await shot('02-search');
      await inp.fill('').catch(() => {});
      await p.waitForTimeout(3000);
    }
  }

  // sidebar filter panel
  const sf = await p.$('[data-test-id="button_sidebar_filters"]');
  R.nav_controls.sidebar_filters = { control: !!sf };
  if (sf) {
    await sf.click().catch(() => {});
    await p.waitForTimeout(2500);
    R.nav_controls.sidebar_filters.panel = await p.evaluate(() => {
      const m = [...document.querySelectorAll('.q-menu, .q-dialog')].filter(x => x.getBoundingClientRect().width > 0);
      if (!m.length) return null;
      const last = m[m.length - 1];
      const out = [];
      last.querySelectorAll('*').forEach(el => {
        for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim())
          out.push({ raw: n.textContent.trim(), transform: getComputedStyle(el).textTransform,
                     tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
      });
      return out;
    });
    await shot('03-sidebar-filters');
    await p.keyboard.press('Escape').catch(() => {});
    await p.waitForTimeout(1500);
  }

  // ---- C30075 item 2 : resize handles on an existing block, in Day view ----
  await p.$(`[data-test-id="schedule_view_toggle"] >> text="Day"`).then(b => b && b.click()).catch(() => {});
  await p.waitForTimeout(4000);
  R.block_affordances = await p.evaluate(() => {
    const b = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')];
    if (!b.length) return { blocks: 0 };
    const first = b[0];
    return {
      blocks: b.length,
      draggable_attr: b.filter(x => x.getAttribute('draggable') === 'true').length,
      descendant_draggable: b.filter(x => x.querySelector('[draggable="true"]')).length,
      resize_like: b.filter(x => x.querySelector('[class*="resize"],[class*="handle"],[data-test-id*="resize"]')).length,
      cursor: getComputedStyle(first).cursor,
      first_testids: [...first.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).slice(0, 12),
    };
  });

  // ---- the detail modal, read-only or not ----
  R.modal = {};
  const blk = await p.$('[data-test-id="schedule_shift_block"]');
  if (blk) {
    await blk.scrollIntoViewIfNeeded().catch(() => {});
    const bb = await blk.boundingBox();
    R.modal.block_box = bb;
    if (bb) {
      const cx = bb.x + bb.width / 2, cy = bb.y + Math.min(bb.height / 2, 40);
      await p.mouse.move(cx, cy); await p.waitForTimeout(2500);
      R.modal.tooltip = await p.evaluate(() => {
        const t = [...document.querySelectorAll('.q-tooltip')].filter(x => x.getBoundingClientRect().width > 0);
        return t.length ? t[t.length - 1].innerText.trim().slice(0, 500) : null;
      });
      await shot('04-tooltip');
      await p.mouse.click(cx, cy); await p.waitForTimeout(4500);
      R.modal.detail = await p.evaluate(() => {
        const d = [...document.querySelectorAll('.q-dialog')].filter(x => x.getBoundingClientRect().width > 0);
        if (!d.length) return null;
        const last = d[d.length - 1];
        const inputs = [...last.querySelectorAll('input,textarea,select')];
        const nodes = [];
        last.querySelectorAll('*').forEach(el => {
          for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim())
            nodes.push({ raw: n.textContent.trim(), transform: getComputedStyle(el).textTransform,
                         tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
        });
        return {
          test_ids: [...new Set([...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))],
          input_count: inputs.length,
          inputs_editable: inputs.filter(i => !i.disabled && !i.readOnly).length,
          input_detail: inputs.map(i => ({ tid: i.closest('[data-test-id]')?.getAttribute('data-test-id') || null,
                                           disabled: i.disabled, readonly: i.readOnly, type: i.type })),
          buttons: [...last.querySelectorAll('button')].map(b => ({
            t: b.innerText.trim().slice(0, 40), disabled: b.disabled,
            tid: b.getAttribute('data-test-id') || b.closest('[data-test-id]')?.getAttribute('data-test-id') || null })),
          nodes,
        };
      });
      await shot('05-modal');
      await p.keyboard.press('Escape').catch(() => {});
    }
  }

  R.api_writes = h.apiLog.filter(a => a.m !== 'GET');
  R.api_4xx = h.apiLog.filter(a => a.s >= 400);
  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/tech-modal.json`, JSON.stringify(R, null, 1));

  console.log('mini cal  :', JSON.stringify(R.nav_controls.mini_calendar));
  console.log('search    :', JSON.stringify(R.nav_controls.search));
  console.log('sb filters:', (R.nav_controls.sidebar_filters.panel || []).map(n => n.raw).join(' | ').slice(0, 320));
  console.log('block aff :', JSON.stringify(R.block_affordances));
  console.log('tooltip   :', JSON.stringify(R.modal.tooltip));
  if (R.modal.detail) {
    console.log('modal tids:', JSON.stringify(R.modal.detail.test_ids));
    console.log('inputs    :', R.modal.detail.input_count, 'editable', R.modal.detail.inputs_editable);
    console.log('buttons   :', JSON.stringify(R.modal.detail.buttons));
  } else console.log('modal     : NOT OPEN');
  console.log('api writes:', JSON.stringify(R.api_writes), '| bridge', R.bridge_errors.length);
  await h.browser.close();
})();
