// probe_series_vin.cjs — two things the previous probe could not settle.
//
//  (1) the series DELETE SCOPE options            C30058 · C30059 · C30061
//  (2) whether the hover tooltip carries the VIN  C30034
//
// The scope dialog is OPENED, READ and CANCELLED, which is exactly what C30061's
// own steps ask for.  The confirm button is never pressed.  The board is compared
// BY ID before and after.
//
// The previous probe found 0 series blocks because it looked for the series cue as
// a DESCENDANT of a block.  That was my selector, not the build - so this probe
// locates series blocks three independent ways and records which one worked.

const { makeHarness, APP, OUT, CK, UA } = require('./harness_admin.cjs');
const fs = require('fs');

const DIALOG = `(${function () {
  const d = [...document.querySelectorAll('.q-dialog, .q-menu')]
    .filter(x => x.getBoundingClientRect().width > 0);
  if (!d.length) return null;
  const last = d[d.length - 1];
  const nodes = [];
  last.querySelectorAll('*').forEach(el => {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim())
      nodes.push({ raw: n.textContent.trim(), transform: getComputedStyle(el).textTransform,
                   tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
  });
  return { nodes,
    test_ids: [...new Set([...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))],
    buttons: [...last.querySelectorAll('button')].map(b => ({ t: b.innerText.trim().slice(0, 60), tid: b.getAttribute('data-test-id') })) };
}})()`;

const board = async () => {
  const r = await fetch('https://sv8685api.qa.shopview.com/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-08-31T23:59:59Z',
    { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
  const j = await r.json();
  const s = [];
  JSON.stringify(j, (k, v) => {
    if (v && typeof v === 'object' && v.id && v.staffId && v.startsAt)
      s.push({ id: v.id, staffId: v.staffId, startsAt: v.startsAt, endsAt: v.endsAt, seriesId: v.seriesId || null });
    return v;
  });
  return s;
};

(async () => {
  const h = await makeHarness('seriesvin');
  const p = h.page;
  const R = { read_at_utc: new Date().toISOString() };
  const shot = n => p.screenshot({ path: `${OUT}/sv-${n}.png` }).catch(() => {});

  R.board_before = await board();
  R.series_in_data = [...new Set(R.board_before.filter(s => s.seriesId).map(s => s.seriesId))].length;

  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(12000);
  await p.$(`[data-test-id="schedule_view_toggle"] >> text="Week"`).then(b => b && b.click()).catch(() => {});
  await p.waitForTimeout(4500);

  // ---------- locate series blocks, three ways ----------
  R.locate = await p.evaluate(() => {
    const blocks = [...document.querySelectorAll('[data-test-id="schedule_shift_block"]')];
    const cues = [...document.querySelectorAll('[data-test-id="schedule_block_series_cue"]')];
    return {
      blocks: blocks.length,
      cues: cues.length,
      cue_is_descendant_of_block: cues.filter(c => c.closest('[data-test-id="schedule_shift_block"]')).length,
      cue_contains_block: cues.filter(c => c.querySelector('[data-test-id="schedule_shift_block"]')).length,
      cue_parent_testid: cues.length ? (cues[0].parentElement?.getAttribute('data-test-id') || cues[0].parentElement?.className?.slice(0, 60)) : null,
    };
  });

  // ---------- open a series shift's detail modal, then its delete ----------
  R.series = { tried: [] };
  const cues = await p.$$('[data-test-id="schedule_block_series_cue"]');
  for (const c of cues.slice(0, 12)) {
    const bb = await c.boundingBox();
    if (!bb || bb.y > 900 || bb.width < 4) continue;
    await p.mouse.click(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 25));
    await p.waitForTimeout(4000);
    const modal = await p.evaluate(DIALOG);
    const t = { box: bb, modal_testids: modal ? modal.test_ids : null,
                modal_buttons: modal ? modal.buttons : null };
    const del = modal && modal.test_ids.find(x => /delete|remove|trash/i.test(x));
    t.delete_control = del || null;
    if (del) {
      const d = await p.$(`[data-test-id="${del}"]`);
      if (d) {
        await d.click().catch(() => {});
        await p.waitForTimeout(3500);
        t.scope_dialog = await p.evaluate(DIALOG);
        await shot('01-scope-dialog');
      }
    }
    R.series.tried.push(t);
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(1200);
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(1200);
    if (t.scope_dialog) break;
  }

  // ---------- C30034 : the VIN in the tooltip, with the toggle in BOTH states ----------
  R.vin = {};
  const hoverFirst = async () => {
    const blocks = await p.$$('[data-test-id="schedule_shift_block"]');
    for (const b of blocks.slice(0, 10)) {
      const bb = await b.boundingBox();
      if (!bb || bb.y > 900) continue;
      await p.mouse.move(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 25));
      await p.waitForTimeout(2300);
      const t = await p.evaluate(() => {
        const x = [...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0);
        return x.length ? x[x.length - 1].innerText.trim() : null;
      });
      if (t) return t;
    }
    return null;
  };
  R.vin.toggle_off = await hoverFirst();
  await shot('02-tooltip-vin-off');

  // turn the 'VIN Number' toggle ON inside 'Filter & display'
  const fd = await p.$('[data-test-id="schedule_filter_display_menu"]');
  if (fd) {
    const fb = await fd.boundingBox();
    if (fb) {
      await p.mouse.click(fb.x + fb.width / 2, fb.y + fb.height / 2);
      await p.waitForTimeout(2500);
      const v = await p.$('[data-test-id="toggle_schedule_show_vin"]');
      R.vin.toggle_control = !!v;
      if (v) {
        R.vin.state_before = await p.evaluate(() => {
          const i = document.querySelector('[data-test-id="toggle_schedule_show_vin"] input');
          return i ? (i.getAttribute('aria-checked') || String(i.checked)) : null;
        });
        await v.click().catch(() => {});
        await p.waitForTimeout(3500);
        R.vin.state_after = await p.evaluate(() => {
          const i = document.querySelector('[data-test-id="toggle_schedule_show_vin"] input');
          return i ? (i.getAttribute('aria-checked') || String(i.checked)) : null;
        });
      }
      await p.keyboard.press('Escape').catch(() => {});
      await p.waitForTimeout(2000);
    }
  }
  R.vin.toggle_on = await hoverFirst();
  await shot('03-tooltip-vin-on');

  // restore the toggle to how it was found
  const fd2 = await p.$('[data-test-id="schedule_filter_display_menu"]');
  if (fd2 && R.vin.toggle_control) {
    const fb2 = await fd2.boundingBox();
    if (fb2) {
      await p.mouse.click(fb2.x + fb2.width / 2, fb2.y + fb2.height / 2);
      await p.waitForTimeout(2200);
      const v2 = await p.$('[data-test-id="toggle_schedule_show_vin"]');
      if (v2) { await v2.click().catch(() => {}); await p.waitForTimeout(2500); }
      R.vin.state_restored = await p.evaluate(() => {
        const i = document.querySelector('[data-test-id="toggle_schedule_show_vin"] input');
        return i ? (i.getAttribute('aria-checked') || String(i.checked)) : null;
      });
      await p.keyboard.press('Escape').catch(() => {});
    }
  }

  R.board_after = await board();
  const B = new Map(R.board_before.map(s => [s.id, JSON.stringify(s)]));
  const A = new Map(R.board_after.map(s => [s.id, JSON.stringify(s)]));
  R.board_diff = { before: B.size, after: A.size,
    removed: [...B.keys()].filter(k => !A.has(k)),
    added: [...A.keys()].filter(k => !B.has(k)),
    changed: [...B.keys()].filter(k => A.has(k) && A.get(k) !== B.get(k)) };

  R.api_writes = h.apiLog.filter(a => !['GET', 'HEAD'].includes(a.m));
  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/series-vin.json`, JSON.stringify(R, null, 1));

  console.log('locate     :', JSON.stringify(R.locate));
  console.log('series data:', R.series_in_data, 'series in the month');
  const sd = R.series.tried.find(t => t.scope_dialog);
  console.log('delete ctrl:', JSON.stringify(R.series.tried.map(t => t.delete_control)));
  console.log('scope opts :', sd ? JSON.stringify(sd.scope_dialog.nodes.map(n => n.raw)) : 'NOT REACHED');
  console.log('VIN off    :', JSON.stringify(R.vin.toggle_off));
  console.log('VIN toggle :', R.vin.state_before, '->', R.vin.state_after, 'restored', R.vin.state_restored);
  console.log('VIN on     :', JSON.stringify(R.vin.toggle_on));
  console.log('BOARD DIFF :', JSON.stringify(R.board_diff));
  console.log('api writes :', JSON.stringify(R.api_writes), '| bridge', R.bridge_errors.length);
  await h.browser.close();
})();
