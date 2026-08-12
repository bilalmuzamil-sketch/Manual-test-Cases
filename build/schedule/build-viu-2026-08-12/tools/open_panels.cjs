// open_panels.cjs — open the Schedule toolbar panels and the sidebar filter
// panel BY TEST-ID and harvest each one's raw text nodes separately, so a label
// is attributed to the surface it actually lives on.
//
// The 12:xx harvest failed to open these: clicking the visible word "Filters"
// hits the SIDEBAR filter button, while `schedule_filter_display_menu` and
// `schedule_view_options_menu` hang off different toolbar controls.  Quasar keeps
// a closed menu mounted but hidden, so its test-id is collectable while its text
// is not - which is exactly how a closed menu can look harvested when it is not.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const GRAB_OPEN = `(() => {
  // only menus/dialogs that are actually displayed
  const open = Array.from(document.querySelectorAll('.q-menu,.q-dialog__inner,[role=dialog],.q-drawer'))
    .filter(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
                   return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; });
  const scope = open[open.length - 1];
  if (!scope) return { open: 0 };
  const out = [];
  const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const t = (n.nodeValue||'').trim(); if (!t) continue;
    const p = n.parentElement; if (!p) continue; const cs = getComputedStyle(p);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    out.push({ raw: t, transform: cs.textTransform }); }
  const ids = Array.from(scope.querySelectorAll('[data-test-id]')).map(e => e.getAttribute('data-test-id'));
  return { open: open.length, testid: scope.getAttribute('data-test-id'), nodes: out, ids: ids.slice(0, 40) };
})()`;

// each: [tag, how to open]
const PLAN = [
  ['sidebar-filters', { testid: 'button_sidebar_filters' }],
  ['toolbar-a', { nthToolbarIcon: 0 }],
  ['toolbar-b', { nthToolbarIcon: 1 }],
  ['toolbar-c', { nthToolbarIcon: 2 }],
  ['conflicts', { testid: 'button_schedule_conflicts' }],
];

(async () => {
  const h = await makeHarness('panels');
  const page = h.page;
  const results = {};
  for (const [tag, how] of PLAN) {
    await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(12000);
    let clicked = null;
    if (how.testid) {
      clicked = await page.evaluate((id) => {
        const e = document.querySelector(`[data-test-id="${id}"]`);
        if (!e) return { ok: false };
        e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect();
        return { ok: true, x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }, how.testid);
    } else {
      // the toolbar icon buttons that are NOT today/prev/next/conflicts
      clicked = await page.evaluate((n) => {
        const known = ['button_schedule_today', 'button_schedule_prev', 'button_schedule_next', 'button_schedule_conflicts'];
        const btns = Array.from(document.querySelectorAll('.q-btn,button,[role=button]')).filter(b => {
          const id = b.getAttribute('data-test-id') || '';
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.y < 260 && r.x > 600 && !known.includes(id);
        });
        const b = btns[n]; if (!b) return { ok: false, count: btns.length };
        b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect();
        return { ok: true, x: r.x + r.width / 2, y: r.y + r.height / 2,
                 testid: b.getAttribute('data-test-id'), text: (b.textContent||'').trim().slice(0, 40), count: btns.length };
      }, how.nthToolbarIcon);
    }
    if (clicked && clicked.ok) { await page.waitForTimeout(800); await page.mouse.click(clicked.x, clicked.y); await page.waitForTimeout(4500); }
    const g = await page.evaluate(GRAB_OPEN);
    results[tag] = { clicked, harvest: g };
    await page.screenshot({ path: `${OUT}/panel-${tag}.png` }).catch(()=>{});
    console.log('==', tag, '| clicked:', JSON.stringify(clicked).slice(0, 140));
    console.log('   open:', g.open, 'testid:', g.testid, 'nodes:', (g.nodes||[]).length);
    (g.nodes||[]).slice(0, 45).forEach(n => console.log('     ' + JSON.stringify(n.raw) + (n.transform!=='none'?'  ['+n.transform+']':'')));
  }
  fs.writeFileSync(`${OUT}/panels.json`, JSON.stringify({ results, read_at_utc: new Date().toISOString() }, null, 1));
  await h.browser.close();
})();
