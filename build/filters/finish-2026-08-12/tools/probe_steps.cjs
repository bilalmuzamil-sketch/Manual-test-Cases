// probe_steps.cjs — drives the actual STEP SEQUENCES of the priority cases.
// This is the runnability walk: precondition reachable · path exists · control
// where the step says · steps work in the written order · labels as painted.
//
// RULE-OUT-YOUR-OWN-HARNESS DISCIPLINE: every "not found" records the state it
// was looked for in, and each check is proven able to FAIL (a control that is
// present in one state and absent in another is reported with both readings).
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');

const R = { read_at_utc: new Date().toISOString(), checks: [] };
const log = (name, data) => { R.checks.push(Object.assign({ name }, data)); console.log(`\n### ${name}\n` + JSON.stringify(data, null, 1).slice(0, 1400)); };

// visible-text scan: returns painted text of everything on screen
const VIS = () => [...document.querySelectorAll('button,[role=button],a,div,span,td,th,input,label')]
  .filter(el => { const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0 && r.height > 0; })
  .map(el => ({ t: (el.innerText || '').trim().slice(0, 90), tid: el.getAttribute('data-test-id') || null,
                x: Math.round(el.getBoundingClientRect().x), y: Math.round(el.getBoundingClientRect().y) }))
  .filter(e => e.t || e.tid);

const has = (vis, s) => vis.some(v => v.t && v.t.toLowerCase().includes(s.toLowerCase()));
const tid = (vis, s) => vis.filter(v => v.tid && v.tid.includes(s)).map(v => ({ tid: v.tid, t: v.t.slice(0, 50), x: v.x, y: v.y }));

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const rows = async () => p.locator('tbody tr').count().catch(() => -1);
  const go = async (u) => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(8000); };

  await go('/workorders');

  // ---------- C38883 / C38898 / C38899 : the page toolbar Search control ----------
  {
    const before = await p.evaluate(VIS);
    const toggle = p.locator('[data-test-id="page_search_toggle"]');
    const existed = await toggle.count();
    const boxBefore = await p.locator('[data-test-id="page_search_toggle"] input, input[placeholder*="Search" i]').count();
    await toggle.scrollIntoViewIfNeeded().catch(() => {});
    await toggle.click({ timeout: 8000 });
    await p.waitForTimeout(1800);
    const afterOpen = await p.evaluate(VIS);
    const inputs = await p.evaluate(() => [...document.querySelectorAll('input')]
      .filter(i => { const r = i.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .map(i => ({ ph: i.placeholder, tid: i.getAttribute('data-test-id'), x: Math.round(i.getBoundingClientRect().x), w: Math.round(i.getBoundingClientRect().width) })));
    const n0 = await rows();
    // type
    const box = p.locator('input[placeholder*="Search" i]').last();
    await box.fill('Iibay').catch(() => {});
    await p.waitForTimeout(3500);
    const n1 = await rows();
    const urlAfterType = p.url();
    // look for an Apply/Submit button near the box  (C38899 step 3)
    const applyish = (await p.evaluate(VIS)).filter(v => /^(apply|submit|go|search)$/i.test(v.t));
    // the round x
    const clearBtns = await p.evaluate(() => [...document.querySelectorAll('button,i,[role=button]')]
      .filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
      .filter(el => /close|clear|cancel/i.test((el.getAttribute('data-test-id') || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + el.className + ' ' + el.innerText))
      .map(el => ({ tid: el.getAttribute('data-test-id'), aria: el.getAttribute('aria-label'), t: el.innerText.trim().slice(0, 30), x: Math.round(el.getBoundingClientRect().x) })).slice(0, 12));
    log('C38883/98/99 page search', {
      toggle_exists: existed, toggle_pos: tid(before, 'page_search_toggle'),
      input_visible_before_click: boxBefore, inputs_after_click: inputs,
      rows_before_type: n0, rows_after_type_Iibay: n1, narrowed: n1 < n0 && n1 >= 0,
      url_after_type: urlAfterType,
      apply_or_submit_button_found: applyish, clear_candidates: clearBtns
    });
    await p.screenshot({ path: `${OUT}/steps-search-open.png` }).catch(() => {});
  }

  // ---------- C38900 : one search box across tabs ----------
  {
    const tabs = ['tab_estimates', 'tab_completed', 'tab_all'];
    const seq = [];
    for (const t of tabs) {
      await p.locator(`[data-test-id="${t}"]`).click({ timeout: 8000 }).catch(e => seq.push({ t, err: String(e).slice(0, 90) }));
      await p.waitForTimeout(3500);
      const v = await p.evaluate(() => { const i = [...document.querySelectorAll('input[placeholder]')].filter(x => /search/i.test(x.placeholder))[0]; return i ? { value: i.value, ph: i.placeholder, visible: i.getBoundingClientRect().width > 0 } : null; });
      seq.push({ tab: t, url: p.url(), search_box: v, rows: await rows() });
    }
    log('C38900 search across tabs', { seq });
  }

  // ---------- C38897 : empty result, clear each separately ----------
  {
    await go('/workorders');
    // apply a Status filter first
    await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 });
    await p.waitForTimeout(1800);
    const picked = await p.evaluate(() => {
      const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
      const it = [...m.querySelectorAll('.q-item')].find(i => /approved/i.test(i.innerText));
      if (it) { it.click(); return it.innerText.trim(); } return null;
    });
    await p.waitForTimeout(3000);
    await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
    const nFiltered = await rows();
    await p.locator('[data-test-id="page_search_toggle"]').click({ timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(1200);
    await p.locator('input[placeholder*="Search" i]').last().fill('zzzznomatchqqq').catch(() => {});
    await p.waitForTimeout(4000);
    const nEmpty = await rows();
    const vis = await p.evaluate(VIS);
    const msgBlock = await p.evaluate(() => {
      const c = [...document.querySelectorAll('div,td,p')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 100 && r.height > 10 && /no |nothing|found|match|result/i.test(el.innerText || ''); });
      return c.slice(-4).map(el => ({ t: (el.innerText || '').trim().slice(0, 300), tids: [...el.querySelectorAll('[data-test-id]')].map(x => x.getAttribute('data-test-id')).slice(0, 8) }));
    });
    log('C38897 empty state', {
      status_picked: picked, rows_with_filter: nFiltered, rows_with_filter_and_search: nEmpty,
      empty_message_blocks: msgBlock,
      clear_search_offer: vis.filter(v => /clear.*search|search.*clear/i.test(v.t)).slice(0, 5),
      clear_filters_offer: vis.filter(v => /clear.*filter|filter.*clear/i.test(v.t)).slice(0, 5),
      url: p.url()
    });
    await p.screenshot({ path: `${OUT}/steps-empty-state.png` }).catch(() => {});
  }

  R.bridge_errors = h.bridgeErrors;
  R.api_errors = h.apiLog.filter(a => a.s >= 400);
  fs.writeFileSync(`${OUT}/steps-batch1.json`, JSON.stringify(R, null, 1));
  console.log('\nBRIDGE ERRORS:', h.bridgeErrors.length, '| API 4xx/5xx:', JSON.stringify(R.api_errors.slice(0, 5)));
  await h.browser.close();
})();
