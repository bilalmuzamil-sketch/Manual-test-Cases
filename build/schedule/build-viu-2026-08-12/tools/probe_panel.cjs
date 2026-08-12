// probe_panel.cjs — do the six panel cases (C43582-C43587) have an interface on
// this build?  They assert a button at the far-left of the toolbar row above the
// grid, to the LEFT of `Today`, that hides the left panel.
//
// The state is established as one where it SHOULD appear before anything is
// called absent: Schedule loaded, the left panel VISIBLE (so a control to hide it
// is meaningful), the toolbar rendered, and a wide viewport (the cases put the
// auto-fold at <960px, so 1680 is the width where the button must be present).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

(async () => {
  const h = await makeHarness('probe-panel');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);

  const r = await page.evaluate(() => {
    const txt = document.body.innerText;
    // locate the Today control and read the toolbar row it belongs to
    const all = Array.from(document.querySelectorAll('button,[role=button],.q-btn,i,div,span'));
    const today = all.filter(e => (e.innerText || '').trim() === 'Today')
                     .filter(e => !all.some(o => o !== e && e.contains(o)))[0];
    let row = null, rowItems = [], leftOfToday = [];
    if (today) {
      row = today.parentElement;
      for (let i = 0; i < 3 && row; i++) {
        const kids = Array.from(row.children);
        if (kids.length >= 3) break;
        row = row.parentElement;
      }
      if (row) {
        const tr = today.getBoundingClientRect();
        rowItems = Array.from(row.querySelectorAll('button,[role=button],.q-btn,i')).map(e => {
          const rc = e.getBoundingClientRect();
          return { text: (e.textContent || '').trim().slice(0, 40), testid: e.getAttribute('data-test-id'),
                   aria: e.getAttribute('aria-label'), title: e.getAttribute('title'),
                   x: Math.round(rc.x), w: Math.round(rc.width) };
        }).filter(e => e.w > 0);
        leftOfToday = rowItems.filter(e => e.x < tr.x);
      }
    }
    // any control anywhere whose id/aria/text suggests panel collapse
    const panelish = [];
    document.querySelectorAll('[data-test-id],[aria-label],[title]').forEach(e => {
      const s = [e.getAttribute('data-test-id'), e.getAttribute('aria-label'), e.getAttribute('title')].join(' ');
      if (/panel|collapse|sidebar_toggle|hide_side|drawer/i.test(s)) {
        const rc = e.getBoundingClientRect();
        panelish.push({ testid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'),
                        title: e.getAttribute('title'), text: (e.textContent||'').trim().slice(0,40),
                        visible: rc.width > 0 && rc.height > 0 });
      }
    });
    return {
      today_found: !!today,
      left_panel_visible: !!document.querySelector('[data-test-id=schedule_sidebar]') &&
        (document.querySelector('[data-test-id=schedule_sidebar]').getBoundingClientRect().width > 0),
      sidebar_width: document.querySelector('[data-test-id=schedule_sidebar]')
        ? Math.round(document.querySelector('[data-test-id=schedule_sidebar]').getBoundingClientRect().width) : null,
      viewport: window.innerWidth,
      toolbar_items: rowItems, controls_left_of_today: leftOfToday,
      panel_like_controls: panelish,
      has_department_header: /Department/.test(txt)
    };
  });

  await page.screenshot({ path: `${OUT}/probe-panel.png` }).catch(()=>{});
  fs.writeFileSync(`${OUT}/probe-panel.json`, JSON.stringify({ ...r, bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 2));
  console.log(JSON.stringify(r, null, 1).slice(0, 2600));
  await h.browser.close();
})();
