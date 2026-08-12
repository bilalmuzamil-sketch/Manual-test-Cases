// probe_batch2.cjs — C38897 (filter+search) · C38877 Imported · C38878 Asset on Site
//                    C38903 collapse-with-search · C38896 Back to my view
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const R = { read_at_utc: new Date().toISOString(), checks: [] };
const put = (n, d) => { R.checks.push(Object.assign({ name: n }, d)); console.log(`\n### ${n}\n` + JSON.stringify(d, null, 1).slice(0, 1800)); };

const STATE = () => {
  const vis = el => { const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0 && r.height > 0; };
  const chip = t => { const e = document.querySelector(`[data-test-id="${t}"]`); if (!e) return null;
    const cs = getComputedStyle(e);
    return { painted: (e.innerText || '').trim().replace(/\n/g, ' ').slice(0, 70), disabled: e.hasAttribute('disabled') || e.getAttribute('aria-disabled') === 'true' || e.classList.contains('disabled'),
             opacity: cs.opacity, pointer: cs.pointerEvents, cls: (e.className || '').toString().slice(0, 70) }; };
  const emptyEl = [...document.querySelectorAll('*')].filter(vis).filter(e => /^No .*(match|found)/i.test((e.innerText || '').trim()));
  return {
    url: location.href,
    rows: document.querySelectorAll('tbody tr').length,
    chips: { status: chip('filter_chip_status'), customer: chip('filter_chip_company_id'), tech: chip('filter_chip_tech_assigned_id'),
             advisor: chip('filter_chip_service_advisor_id'), asset: chip('filter_chip_vehicleHere') },
    empty: emptyEl.length ? (emptyEl[emptyEl.length - 1].innerText || '').trim().slice(0, 200) : null,
    visible_tids: [...document.querySelectorAll('[data-test-id]')].filter(vis).map(e => e.getAttribute('data-test-id')),
    back_to_view: [...document.querySelectorAll('*')].filter(vis)
      .filter(e => /back to (my )?(view|saved)/i.test((e.innerText || '').trim()) && (e.innerText || '').trim().length < 60)
      .map(e => ({ t: (e.innerText || '').trim(), tid: e.getAttribute('data-test-id') })).slice(0, 3),
    onsite_col: [...document.querySelectorAll('tbody tr')].slice(0, 40).map(r => {
      const c = r.querySelector('td'); return c ? (c.innerText || '').trim().slice(0, 20) : ''; })
  };
};

(async () => {
  const h = await makeHarness('admin');
  const p = h.page;
  const go = async u => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 120000 }); await p.waitForTimeout(9000); };
  const st = async () => p.evaluate(STATE);

  // ---------- C38897 : filter AND search, both active ----------
  await go('/workorders?tab=all&status=approved');
  const a = await st();
  await go('/workorders?tab=all&status=approved&search=zzzznomatchqqq');
  const b = await st();
  await p.screenshot({ path: `${OUT}/c38897-filter-and-search.png` }).catch(() => {});
  put('C38897 filter+search empty state', {
    with_filter_only: { url: a.url, rows: a.rows, empty: a.empty, status_chip: a.chips.status },
    with_filter_and_search: { url: b.url, rows: b.rows, empty: b.empty, status_chip: b.chips.status },
    empty_message_text: b.empty,
    offers_clear_filters: b.visible_tids.includes('empty_state_clear_filters'),
    offers_clear_search_in_message: b.visible_tids.filter(t => /clear.*search|search.*clear/i.test(t)),
    page_search_clear_present_in_box: b.visible_tids.includes('page_search_clear'),
    NOTE: 'scanner proven able to see page_search_clear (empty-state.json rule-out)'
  });

  // ---------- C38877 : Imported disables the other chips ----------
  await go('/workorders?tab=all');
  const before = await st();
  await p.locator('[data-test-id="filter_chip_status"]').click({ timeout: 8000 });
  await p.waitForTimeout(2200);
  const menuItems = await p.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
    return m ? [...m.querySelectorAll('.q-item')].map(i => ({ t: (i.innerText || '').trim(), dis: i.getAttribute('aria-disabled') === 'true' || i.classList.contains('disabled') })) : null; });
  const clickedImported = await p.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
    const it = [...m.querySelectorAll('.q-item')].find(i => /imported/i.test(i.innerText)); if (!it) return null; it.click(); return (it.innerText || '').trim(); });
  await p.waitForTimeout(3500);
  const menuAfter = await p.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
    return m ? [...m.querySelectorAll('.q-item')].map(i => ({ t: (i.innerText || '').trim(), dis: i.getAttribute('aria-disabled') === 'true' || i.classList.contains('disabled') || getComputedStyle(i).opacity < '0.7' })) : null; });
  await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  const withImported = await st();
  await p.screenshot({ path: `${OUT}/c38877-imported.png` }).catch(() => {});
  put('C38877 Imported', {
    status_menu_items: menuItems, clicked: clickedImported,
    other_status_items_after_imported: menuAfter,
    chips_before: before.chips, chips_with_imported: withImported.chips,
    url: withImported.url, rows: withImported.rows
  });

  // ---------- C38878 : Asset on Site = No ----------
  await go('/workorders?tab=all');
  await p.locator('[data-test-id="filter_chip_vehicleHere"]').click({ timeout: 8000 });
  await p.waitForTimeout(2000);
  const pickedNo = await p.evaluate(() => { const ms = [...document.querySelectorAll('.q-menu')]; const m = ms[ms.length - 1];
    const it = [...m.querySelectorAll('.q-item')].find(i => i.innerText.trim().toLowerCase() === 'no'); if (!it) return null; it.click(); return it.innerText.trim(); });
  await p.waitForTimeout(4000); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  const noState = await st();
  await p.screenshot({ path: `${OUT}/c38878-asset-no.png` }).catch(() => {});
  put('C38878 Asset on Site No', { picked: pickedNo, url: noState.url, rows: noState.rows,
    chip: noState.chips.asset, first_col_values: [...new Set(noState.onsite_col)].slice(0, 6) });

  // ---------- C38903 : collapse the filter bar with a search active ----------
  await go('/workorders?tab=all&search=Iibay');
  const pre = await st();
  const searchBoxPre = await p.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]');
    return i ? { value: i.value, visible: i.getBoundingClientRect().width > 0, y: Math.round(i.getBoundingClientRect().y) } : null; });
  await p.locator('[data-test-id="toggle_filter_bar"]').click({ timeout: 8000 });
  await p.waitForTimeout(3000);
  const post = await st();
  const searchBoxPost = await p.evaluate(() => { const i = document.querySelector('[data-test-id="page_search_input"]');
    return i ? { value: i.value, visible: i.getBoundingClientRect().width > 0, y: Math.round(i.getBoundingClientRect().y) } : null; });
  const chipsVisiblePost = Object.entries(post.chips).filter(([, v]) => v).map(([k]) => k);
  await p.locator('[data-test-id="toggle_filter_bar"]').click({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const back = await st();
  await p.screenshot({ path: `${OUT}/c38903-collapsed.png` }).catch(() => {});
  put('C38903 collapse with search', {
    before: { rows: pre.rows, url: pre.url, search_box: searchBoxPre, chips_present: Object.entries(pre.chips).filter(([, v]) => v).map(([k]) => k) },
    after_collapse: { rows: post.rows, url: post.url, search_box: searchBoxPost, chips_present: chipsVisiblePost },
    after_expand: { rows: back.rows, chips_present: Object.entries(back.chips).filter(([, v]) => v).map(([k]) => k) }
  });

  // ---------- C38896 : Back to my view, on your OWN view ----------
  await go('/workorders?tab=all');
  const own = await st();
  put('C38896 back-to-my-view on own view', {
    url: own.url, back_to_view_matches: own.back_to_view,
    any_tid_like_back: own.visible_tids.filter(t => /back|my_view|saved/i.test(t))
  });

  R.bridge_errors = h.bridgeErrors;
  R.api_errors = h.apiLog.filter(a => a.s >= 400);
  fs.writeFileSync(`${OUT}/steps-batch2.json`, JSON.stringify(R, null, 1));
  console.log('\nbridge_errors:', h.bridgeErrors.length, '| api 4xx/5xx:', JSON.stringify(R.api_errors.slice(0, 4)));
  await h.browser.close();
})();
