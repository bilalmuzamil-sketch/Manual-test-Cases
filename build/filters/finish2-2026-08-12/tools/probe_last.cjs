// probe_last.cjs — the remaining Untested READY cases:
// C38879 (shared link must not overwrite your own saved filters) | C43560 (last save wins)
// C38876 (last-used tab remembered) | C43561 s4-7 (phone kebabs) | C38893 s4 (pick a real record)
const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const fs = require('fs');
const S = 9000;
(async () => {
  const out = { build: 'v3.6-3e9dd6d', started_utc: new Date().toISOString(), checks: {} };
  const h = await makeHarness('admin'); const page = h.page;
  const go = async (p) => { await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(S); };
  const pref = () => page.evaluate(async () => {
    const r = await fetch('https://sv8785api.qa.shopview.com/api/users/me/preferences/work-orders-list', { credentials: 'include' });
    const j = await r.json().catch(() => null);
    return j && j.data ? { filters: j.data.value.filters, tab: j.data.value.tab, collapsed: j.data.value.collapsed, updatedAt: j.data.updatedAt } : { status: r.status };
  });
  try {
    // ---- C38879 : open a shared link -> your OWN saved filters must be untouched ----
    await go('/workorders?tab=all');
    await page.evaluate(() => { const b = document.querySelector('[data-test-id="clear_filters"]'); if (b) b.click(); });
    await page.waitForTimeout(3000);
    // set MY OWN filter deliberately, via the real control
    await page.click('[data-test-id="filter_chip_status"]'); await page.waitForTimeout(2500);
    await page.click('[data-test-id="filter_option_status_approved"]').catch(()=>{});
    await page.waitForTimeout(4000);
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
    const mine = await pref();
    out.checks.c38879_my_saved_before = { pref: mine, url: page.url() };
    // now open a link carrying DIFFERENT filters (the "someone else's link" case)
    await go('/workorders?tab=all&status=paid&vehicleHere=1');
    const onShared = await pref();
    out.checks.c38879_while_on_shared_link = { pref: onShared, url: page.url(),
      chips: await page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,30))) };
    // leave the shared link WITHOUT clicking Back To My Saved Filters, return plainly
    await go('/customers'); await go('/workorders');
    const after = await pref();
    out.checks.c38879_after_return = { pref: after, url: page.url(),
      chips: await page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,30))) };
    out.checks.c38879_verdict = {
      my_filters_before: JSON.stringify(mine.filters), on_shared: JSON.stringify(onShared.filters),
      after_return: JSON.stringify(after.filters),
      shared_link_overwrote_my_saved: JSON.stringify(mine.filters) !== JSON.stringify(after.filters) };

    // ---- C38876 : last-used tab remembered ----
    await go('/workorders?tab=all');
    await page.evaluate(() => { const t = Array.from(document.querySelectorAll('[role="tab"],.q-tab')).find(e=>/estimates/i.test(e.innerText)); if (t) t.click(); });
    await page.waitForTimeout(5000);
    const tabPref = await pref();
    await go('/customers'); await go('/workorders');
    out.checks.c38876_tab_memory = { pref_after_choosing_estimates: tabPref,
      url_on_plain_return: page.url(),
      activeTab: await page.evaluate(() => { const t = document.querySelector('[role="tab"][aria-selected="true"], .q-tab--active'); return t ? t.innerText.trim() : null; }) };

    // ---- C43560 : two contexts, same person, last save wins ----
    const h2 = await makeHarness('admin');
    await h2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await h2.page.waitForTimeout(S);
    // context A sets Declined
    await page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(S);
    await page.click('[data-test-id="filter_chip_status"]'); await page.waitForTimeout(2500);
    await page.click('[data-test-id="filter_option_status_declined"]').catch(()=>{});
    await page.waitForTimeout(4000); await page.keyboard.press('Escape').catch(()=>{});
    const prefA = await pref();
    // context B then sets Invoiced -- the LATER save
    await h2.page.click('[data-test-id="filter_chip_status"]'); await h2.page.waitForTimeout(2500);
    await h2.page.click('[data-test-id="filter_option_status_invoiced"]').catch(()=>{});
    await h2.page.waitForTimeout(4000); await h2.page.keyboard.press('Escape').catch(()=>{});
    const prefB = await h2.page.evaluate(async () => {
      const r = await fetch('https://sv8785api.qa.shopview.com/api/users/me/preferences/work-orders-list', { credentials: 'include' });
      const j = await r.json().catch(()=>null); return j && j.data ? { filters: j.data.value.filters, updatedAt: j.data.updatedAt } : { status: r.status }; });
    // a THIRD read from context A after B saved
    await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForTimeout(S);
    const prefFinal = await pref();
    out.checks.c43560 = { contextA_set: prefA, contextB_set: prefB, reload_in_A: prefFinal,
      chips_in_A_after_reload: await page.evaluate(() => Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,30))),
      last_save_wins: JSON.stringify(prefFinal.filters) === JSON.stringify(prefB.filters) };
    out.bridge_ctx2 = h2.bridgeErrors.length;
    await h2.browser.close();

    // ---- C38893 step 4 : pick a REAL record row in the nav search ----
    await go('/workorders?tab=all');
    const nav = await page.$('[data-test-id="select_global_search"], input[placeholder*="Search"]');
    if (nav) { await nav.click().catch(()=>{}); await page.waitForTimeout(1200);
      await page.keyboard.type('Iibay', { delay: 100 }); await page.waitForTimeout(5000); }
    out.checks.c38893_step4 = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width>0 && r.height>0; };
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m=>vis(m)&&m.innerText.trim());
      const m = menus[menus.length-1]; if (!m) return { menu:false };
      const items = Array.from(m.querySelectorAll('.q-item')).map(e=>({ text:e.innerText.replace(/\s+/g,' ').trim().slice(0,60), clickable: e.classList.contains('q-item--clickable') || !!e.getAttribute('tabindex') }));
      return { menu:true, items: items.slice(0,8) };
    });
    const clicked = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width>0 && r.height>0; };
      const menus = Array.from(document.querySelectorAll('.q-menu')).filter(m=>vis(m)&&m.innerText.trim());
      const m = menus[menus.length-1]; if (!m) return null;
      const it = Array.from(m.querySelectorAll('.q-item')).find(e => e.classList.contains('q-item--clickable') && e.innerText.trim().length>3);
      if (!it) return null; const t = it.innerText.replace(/\s+/g,' ').trim().slice(0,50); it.click(); return t; });
    await page.waitForTimeout(7000);
    out.checks.c38893_step4_result = { picked: clicked, landed: page.url() };
    await page.screenshot({ path: `${OUT}/c38893-picked-record.png` });
  } catch (e) { out.error = String(e).slice(0,500); }
  out.api_4xx5xx = h.apiLog.filter(a=>a.s>=400);
  out.bridge_errors = h.bridgeErrors.length;
  fs.writeFileSync(`${OUT}/last-batch.json`, JSON.stringify(out,null,2));
  console.log(JSON.stringify(out.checks,null,1).slice(0,6500));
  console.log('BRIDGE', out.bridge_errors, 'ERR', out.error||'-');
  await h.browser.close();
})();
