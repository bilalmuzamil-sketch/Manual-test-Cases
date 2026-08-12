// probe_drilldown.cjs — open a work-order card's line drill-down in the Schedule
// sidebar and harvest it, plus the toolbar's Filter & display / View options
// menus, which are anchored to controls the earlier sweep never located.
//
// The menus are found by their OWN test-id (schedule_filter_display_menu /
// schedule_view_options_menu) and clicked via their Quasar ANCHOR - a QMenu is
// mounted as a child of the element that opens it, so walking up from the menu
// finds the button reliably where a text search does not.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const GRAB_OPEN = `(() => {
  const open = Array.from(document.querySelectorAll('.q-menu,.q-dialog__inner,[role=dialog]'))
    .filter(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
                   return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0; });
  const scope = open[open.length - 1]; if (!scope) return { open: 0 };
  const out = []; const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const t=(n.nodeValue||'').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if (cs.display==='none'||cs.visibility==='hidden') continue;
    out.push({raw:t, transform:cs.textTransform}); }
  return { open: open.length, testid: scope.getAttribute('data-test-id'), nodes: out };
})()`;

const GRAB_SIDEBAR = `(() => {
  const sb = document.querySelector('[data-test-id=schedule_sidebar]'); if(!sb) return {ok:false};
  const out=[]; const w=document.createTreeWalker(sb,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())){ const t=(n.nodeValue||'').trim(); if(!t) continue;
    const p=n.parentElement; if(!p) continue; const cs=getComputedStyle(p);
    if(cs.display==='none'||cs.visibility==='hidden') continue;
    out.push({raw:t,transform:cs.textTransform}); }
  const ids=Array.from(new Set(Array.from(sb.querySelectorAll('[data-test-id]'))
     .map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]+/g,'<id>'))));
  return {ok:true, nodes:out, ids};
})()`;

(async () => {
  const h = await makeHarness('drill');
  const page = h.page;
  const res = {};
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);

  // --- 1. the two toolbar menus, opened via their QMenu anchor ---
  for (const id of ['schedule_filter_display_menu', 'schedule_view_options_menu']) {
    const r = await page.evaluate((menuId) => {
      const m = document.querySelector(`[data-test-id="${menuId}"]`);
      if (!m) return { ok: false, why: 'menu element absent' };
      // walk up to the nearest clickable ancestor that is on screen
      let a = m.parentElement, tries = 0;
      while (a && tries++ < 6) {
        const rc = a.getBoundingClientRect();
        if (rc.width > 0 && rc.height > 0 && rc.y < 400) return { ok: true, x: rc.x + rc.width / 2, y: rc.y + rc.height / 2, tag: a.tagName, testid: a.getAttribute('data-test-id') };
        a = a.parentElement;
      }
      return { ok: false, why: 'no visible anchor' };
    }, id);
    if (r.ok) { await page.mouse.click(r.x, r.y); await page.waitForTimeout(4000); }
    res[id] = { anchor: r, harvest: await page.evaluate(GRAB_OPEN) };
    await page.screenshot({ path: `${OUT}/menu-${id}.png` }).catch(()=>{});
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  }

  // --- 2. the drill-down: open the line list of a MULTI-LINE card ---
  const before = await page.evaluate(GRAB_SIDEBAR);
  const opened = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-test-id=sidebar_work_order_card]'));
    const multi = cards.find(c => /(\d+) lines/.test(c.innerText || '') && parseInt((c.innerText.match(/(\d+) lines/) || [])[1] || '0') > 1) || cards[0];
    if (!multi) return { ok: false };
    multi.scrollIntoView({ block: 'center' });
    const i = Array.from(multi.querySelectorAll('i')).find(e => (e.textContent || '').trim() === 'chevron_right');
    const t = i || multi; const rc = t.getBoundingClientRect();
    return { ok: true, card: (multi.innerText || '').replace(/\s+/g, ' ').slice(0, 110), x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 };
  });
  if (opened.ok) { await page.waitForTimeout(800); await page.mouse.click(opened.x, opened.y); await page.waitForTimeout(6000); }
  const after = await page.evaluate(GRAB_SIDEBAR);
  await page.screenshot({ path: `${OUT}/drilldown.png` }).catch(()=>{});
  res.drilldown = { opened, sidebar_before_ids: before.ids, sidebar_after: after };

  fs.writeFileSync(`${OUT}/drilldown.json`, JSON.stringify({ ...res, bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() }, null, 1));

  for (const k of ['schedule_filter_display_menu', 'schedule_view_options_menu']) {
    console.log('==', k, JSON.stringify(res[k].anchor).slice(0, 120));
    (res[k].harvest.nodes || []).forEach(n => console.log('   ' + JSON.stringify(n.raw) + (n.transform !== 'none' ? ' [' + n.transform + ']' : '')));
  }
  console.log('== DRILL-DOWN card:', opened.card || JSON.stringify(opened));
  (after.nodes || []).slice(0, 70).forEach(n => console.log('   ' + JSON.stringify(n.raw) + (n.transform !== 'none' ? ' [' + n.transform + ']' : '')));
  console.log('== drill test-ids:', JSON.stringify(after.ids).slice(0, 700));
  await h.browser.close();
})();
