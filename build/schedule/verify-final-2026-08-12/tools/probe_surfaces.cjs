// probe_surfaces.cjs — the surfaces no harvest of this build had reached, driven
// as the administrator.  Targets C29946, C30034, C30058, C30059, C30061.
//
// EVERY INTERACTION IS A READ.  The series delete dialog is opened, its options
// are read, and it is CANCELLED - which is what C30061's own steps ask for.  The
// confirm button is never pressed.  The board is snapshotted before and after and
// compared shift by shift, because a cleanup step in this workspace yesterday
// matched on a customer NAME and destroyed a pre-existing shift.  Matching here
// is by ID only.

const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');

const DIALOG_NODES = `(${function () {
  const d = [...document.querySelectorAll('.q-dialog, .q-menu')]
    .filter(x => x.getBoundingClientRect().width > 0);   // offsetParent is null for position:fixed
  if (!d.length) return null;
  const last = d[d.length - 1];
  const nodes = [];
  last.querySelectorAll('*').forEach(el => {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim())
      nodes.push({ raw: n.textContent.trim(), transform: getComputedStyle(el).textTransform,
                   tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
  });
  return { nodes, test_ids: [...new Set([...last.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))],
           buttons: [...last.querySelectorAll('button')].map(b => ({ t: b.innerText.trim().slice(0, 50), tid: b.getAttribute('data-test-id') })) };
}})()`;

(async () => {
  const h = await makeHarness('surfaces');
  const p = h.page;
  const R = { read_at_utc: new Date().toISOString() };
  const shot = n => p.screenshot({ path: `${OUT}/surf-${n}.png` }).catch(() => {});

  // ---------- board snapshot, taken from the API HOST directly ----------
  // NOT from inside the page: a relative fetch before navigation resolves against
  // the login page and returns HTML, which is how the first run of this probe died.
  const { CK, UA } = require('./harness_admin.cjs');
  const board = async () => {
    const r = await fetch('https://sv8685api.qa.shopview.com/api/schedule/board?from=2026-08-01T00:00:00Z&to=2026-08-31T23:59:59Z',
      { headers: { cookie: CK, accept: 'application/json', 'user-agent': UA } });
    const j = await r.json();
    const shifts = [];
    JSON.stringify(j, (k, v) => {
      if (v && typeof v === 'object' && v.id && v.staffId && v.startsAt)
        shifts.push({ id: v.id, staffId: v.staffId, startsAt: v.startsAt, endsAt: v.endsAt, seriesId: v.seriesId || null });
      return v;
    });
    return shifts;
  };
  R.board_before = await board();

  await p.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(12000);

  // ---------- C29946 : sidebar filters, then 'Clear all' ----------
  R.clear_all = { steps: [] };
  const sf = await p.$('[data-test-id="button_sidebar_filters"]');
  if (sf) {
    await sf.click(); await p.waitForTimeout(2500);
    R.clear_all.panel_before = await p.evaluate(DIALOG_NODES);
    R.clear_all.steps.push('filters panel opened');
    // apply two filters by clicking their rows
    const applied = await p.evaluate(() => {
      const m = [...document.querySelectorAll('.q-menu, .q-dialog')].filter(x => x.getBoundingClientRect().width > 0);
      if (!m.length) return [];
      const last = m[m.length - 1];
      const rows = [...last.querySelectorAll('[data-test-id]')]
        .filter(e => /filter|status|assign/i.test(e.getAttribute('data-test-id') || ''));
      return rows.map(e => e.getAttribute('data-test-id')).slice(0, 12);
    });
    R.clear_all.candidate_rows = applied;
    for (const tid of applied.slice(0, 2)) {
      const el = await p.$(`[data-test-id="${tid}"]`);
      if (el) { await el.click().catch(() => {}); await p.waitForTimeout(2000); R.clear_all.steps.push('clicked ' + tid); }
    }
    R.clear_all.panel_after_two = await p.evaluate(DIALOG_NODES);
    R.clear_all.cards_now = await p.evaluate(() => document.querySelectorAll('[data-test-id="sidebar_work_order_card"]').length);
    await shot('01-filters-applied');
    // is there a 'Clear all'?
    R.clear_all.found = await p.evaluate(() => {
      const m = [...document.querySelectorAll('.q-menu, .q-dialog, [data-test-id="schedule_sidebar"]')]
        .filter(x => x.getBoundingClientRect().width > 0);
      const hits = [];
      m.forEach(root => root.querySelectorAll('*').forEach(el => {
        for (const n of el.childNodes) if (n.nodeType === 3 && /clear/i.test(n.textContent))
          hits.push({ raw: n.textContent.trim(), transform: getComputedStyle(el).textTransform,
                      tid: el.closest('[data-test-id]')?.getAttribute('data-test-id') || null });
      }));
      return hits;
    });
    await p.keyboard.press('Escape').catch(() => {});
    await p.waitForTimeout(1500);
  }

  // ---------- C30034 : the hover tooltip and its line cap ----------
  await p.$(`[data-test-id="schedule_view_toggle"] >> text="Week"`).then(b => b && b.click()).catch(() => {});
  await p.waitForTimeout(4000);
  R.tooltip = { tried: 0 };
  const blocks = await p.$$('[data-test-id="schedule_shift_block"]');
  for (const b of blocks.slice(0, 8)) {
    const bb = await b.boundingBox();
    if (!bb || bb.y > 950) continue;
    await p.mouse.move(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 30));
    await p.waitForTimeout(2200);
    R.tooltip.tried++;
    const t = await p.evaluate(() => {
      const x = [...document.querySelectorAll('.q-tooltip')].filter(e => e.getBoundingClientRect().width > 0);
      return x.length ? x[x.length - 1].innerText.trim() : null;
    });
    if (t && /more line/i.test(t)) { R.tooltip.with_overflow = t; await shot('02-tooltip-overflow'); break; }
    if (t && !R.tooltip.sample) R.tooltip.sample = t;
  }

  // ---------- C30058 / C30059 / C30061 : the delete SCOPE options ----------
  // opened, read, CANCELLED.  The confirm button is never pressed.
  R.series = { attempts: [] };
  const seriesBlocks = await p.$$('[data-test-id="schedule_shift_block"]');
  for (const b of seriesBlocks.slice(0, 10)) {
    const isSeries = await b.$('[data-test-id="schedule_block_series_cue"]');
    if (!isSeries) continue;
    const bb = await b.boundingBox();
    if (!bb || bb.y > 950) continue;
    await p.mouse.click(bb.x + bb.width / 2, bb.y + Math.min(bb.height / 2, 30));
    await p.waitForTimeout(4000);
    const modal = await p.evaluate(DIALOG_NODES);
    const attempt = { modal_testids: modal ? modal.test_ids : null };
    // find a delete affordance inside the modal
    const delTid = modal && modal.test_ids.find(t => /delete|remove|trash/i.test(t));
    attempt.delete_control = delTid || null;
    if (delTid) {
      const d = await p.$(`[data-test-id="${delTid}"]`);
      if (d) {
        await d.click().catch(() => {});
        await p.waitForTimeout(3000);
        attempt.scope_dialog = await p.evaluate(DIALOG_NODES);
        await shot('03-series-delete-scope');
      }
    }
    R.series.attempts.push(attempt);
    // ALWAYS escape twice - scope dialog, then the detail modal
    await p.keyboard.press('Escape').catch(() => {});
    await p.waitForTimeout(1200);
    await p.keyboard.press('Escape').catch(() => {});
    await p.waitForTimeout(1200);
    if (attempt.scope_dialog) break;
  }

  // ---------- board AFTER, compared BY ID ----------
  R.board_after = await board();
  const before = new Map(R.board_before.map(s => [s.id, JSON.stringify(s)]));
  const after = new Map(R.board_after.map(s => [s.id, JSON.stringify(s)]));
  R.board_diff = {
    before_count: before.size, after_count: after.size,
    removed: [...before.keys()].filter(k => !after.has(k)),
    added: [...after.keys()].filter(k => !before.has(k)),
    changed: [...before.keys()].filter(k => after.has(k) && after.get(k) !== before.get(k)),
  };

  R.api_writes = h.apiLog.filter(a => !['GET', 'HEAD'].includes(a.m));
  R.api_4xx = h.apiLog.filter(a => a.s >= 400);
  R.bridge_errors = h.bridgeErrors;
  fs.writeFileSync(`${OUT}/surfaces.json`, JSON.stringify(R, null, 1));

  console.log('clear-all hits :', JSON.stringify(R.clear_all.found));
  console.log('cards after 2  :', R.clear_all.cards_now, '| rows tried:', JSON.stringify(R.clear_all.steps));
  console.log('tooltip overflow:', JSON.stringify((R.tooltip.with_overflow || R.tooltip.sample || '').slice(0, 400)));
  console.log('series attempts:', R.series.attempts.length,
              '| delete control:', JSON.stringify(R.series.attempts.map(a => a.delete_control)));
  const sd = R.series.attempts.find(a => a.scope_dialog);
  console.log('scope dialog   :', sd ? JSON.stringify(sd.scope_dialog.nodes.map(n => n.raw)) : 'NOT REACHED');
  console.log('BOARD DIFF     :', JSON.stringify(R.board_diff));
  console.log('api writes     :', JSON.stringify(R.api_writes), '| bridge', R.bridge_errors.length);
  await h.browser.close();
})();
