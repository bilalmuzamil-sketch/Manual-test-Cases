// probe_arm.cjs — is the click-to-arm alternative to dragging (C29962 / SV-8957)
// present on the build now running?
//
// BEFORE recording a control as ABSENT this establishes that the current state is
// one where it SHOULD appear: Schedule page loaded, sidebar populated with work
// orders, at least one card with an APPROVED line, and Schedule: Edit held (the
// grid accepts drags).  Three looks: on load, on hover, and inside an expanded
// line list — because the 5 Aug observation of `button_sidebar_arm_<woId>` was
// made on cards in exactly those states.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const SCAN = `(() => {
  const hit = (root) => {
    const out = { testids: [], aria_pressed: [], arm_words: [] };
    root.querySelectorAll('[data-test-id],[data-testid]').forEach(e => {
      const t = e.getAttribute('data-test-id') || e.getAttribute('data-testid');
      if (/arm|place|click_to|schedule_by/i.test(t)) out.testids.push(t);
    });
    root.querySelectorAll('[aria-pressed]').forEach(e => out.aria_pressed.push({
      testid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'),
      pressed: e.getAttribute('aria-pressed'), text: (e.textContent||'').trim().slice(0,60) }));
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const t = (n.nodeValue||'').trim();
      if (/click to (schedule|place)|stop placing|place on|arm/i.test(t)) out.arm_words.push(t.slice(0,90)); }
    return out;
  };
  const all = hit(document);
  // every data-test-id on the sidebar, so "not found" is backed by what IS there
  const side = document.querySelector('aside, .q-drawer, [class*=sidebar]') || document;
  const sideIds = Array.from(new Set(Array.from(side.querySelectorAll('[data-test-id]'))
      .map(e => e.getAttribute('data-test-id').replace(/[0-9a-f-]{8,}/g,'<id>')))).slice(0,60);
  return { all, sidebar_testids: sideIds,
           cards: document.querySelectorAll('[data-test-id^=card_], [class*=wo-card], [class*=workOrderCard]').length };
})()`;

(async () => {
  const h = await makeHarness('probe-arm');
  const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(14000);

  const state = await page.evaluate(() => {
    const txt = document.body.innerText;
    return {
      sidebar_shows_orders: /S8685-\d+/.test(txt),
      approved_line_present: /Approved/.test(txt),
      order_count: (txt.match(/S8685-\d+/g) || []).length,
      grid_present: !!document.querySelector('[class*=calendar], .q-calendar, [class*=schedule-grid]')
    };
  });

  const onLoad = await page.evaluate(SCAN);

  // hover the first work-order card
  const hovered = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div,li,article')).find(e => /^S8685-\d+/.test((e.innerText||'').trim()));
    if (!el) return null; el.scrollIntoView({block:'center'}); const r = el.getBoundingClientRect();
    return { x: r.x + r.width/2, y: r.y + 12, text: (el.innerText||'').replace(/\s+/g,' ').slice(0,90) };
  });
  if (hovered) { await page.mouse.move(hovered.x, hovered.y); await page.waitForTimeout(2500); }
  const onHover = await page.evaluate(SCAN);

  // expand a card's line list (the chevron) and look again
  const expanded = await page.evaluate(() => {
    const i = Array.from(document.querySelectorAll('i')).find(e => (e.textContent||'').trim() === 'chevron_right');
    if (!i) return null; i.scrollIntoView({block:'center'}); const r = i.getBoundingClientRect();
    return { x: r.x + r.width/2, y: r.y + r.height/2 };
  });
  if (expanded) { await page.mouse.click(expanded.x, expanded.y); await page.waitForTimeout(3500); }
  const onExpand = await page.evaluate(SCAN);

  await page.screenshot({ path: `${OUT}/probe-arm.png` }).catch(()=>{});
  const res = { state, hovered, expanded_clicked: !!expanded, onLoad, onHover, onExpand,
                bridge_errors: h.bridgeErrors, read_at_utc: new Date().toISOString() };
  fs.writeFileSync(`${OUT}/probe-arm.json`, JSON.stringify(res, null, 2));
  console.log('STATE  :', JSON.stringify(state));
  console.log('onLoad :', JSON.stringify(onLoad.all));
  console.log('onHover:', JSON.stringify(onHover.all));
  console.log('onExpnd:', JSON.stringify(onExpand.all));
  console.log('sidebar test-ids:', JSON.stringify(onExpand.sidebar_testids).slice(0,900));
  await h.browser.close();
})();
