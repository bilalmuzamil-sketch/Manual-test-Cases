// probe_retry.cjs — C38876 and C43560 failed as CHECKS last run (the status clicks
// never registered: the preference's updatedAt never moved, so "last save wins"
// compared two identical unchanged values and COULD NOT FAIL). Retry with the
// waitForFunction that worked in probe_desk2, and PROVE each click landed by
// requiring updatedAt to move.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const fs = require('fs');
const S = 9000, OPT = '[data-test-id^="filter_option_"]';
const readPref = (pg) => pg.evaluate(async () => {
  const r = await fetch('https://sv8785api.qa.shopview.com/api/users/me/preferences/work-orders-list', { credentials: 'include' });
  const j = await r.json().catch(()=>null);
  return j && j.data ? { filters: j.data.value.filters, tab: j.data.value.tab, updatedAt: j.data.updatedAt } : { status: r.status };
});
async function pickStatus(pg, value) {
  await pg.click('[data-test-id="filter_chip_status"]');
  await pg.waitForFunction((sel) => {
    const vis = (e)=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const ms = Array.from(document.querySelectorAll('.q-menu')).filter(m=>vis(m)&&m.innerText.trim());
    const m = ms[ms.length-1]; return !!m && m.querySelectorAll(sel).length > 0;
  }, OPT, { timeout: 25000 }).catch(()=>{});
  await pg.waitForTimeout(1200);
  const ok = await pg.$(`[data-test-id="filter_option_status_${value}"]`);
  if (!ok) return false;
  await pg.click(`[data-test-id="filter_option_status_${value}"]`);
  await pg.waitForTimeout(4500);
  await pg.keyboard.press('Escape').catch(()=>{});
  await pg.waitForTimeout(1500);
  return true;
}
(async () => {
  const out = { build:'v3.6-3e9dd6d', started_utc:new Date().toISOString(), checks:{} };
  const hA = await makeHarness('admin');
  try {
    await hA.page.goto(APP+'/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:120000}); await hA.page.waitForTimeout(S);
    const p0 = await readPref(hA.page);
    const okA = await pickStatus(hA.page, 'declined');
    const pA = await readPref(hA.page);
    out.checks.c43560_A = { clicked: okA, before: p0, after: pA, moved: p0.updatedAt !== pA.updatedAt, url: hA.page.url() };

    // context B, same person, sets a DIFFERENT status afterwards
    const hB = await makeHarness('admin');
    await hB.page.goto(APP+'/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:120000}); await hB.page.waitForTimeout(S);
    const okB = await pickStatus(hB.page, 'invoiced');
    const pB = await readPref(hB.page);
    out.checks.c43560_B = { clicked: okB, after: pB, moved: pA.updatedAt !== pB.updatedAt, url: hB.page.url() };

    // reload context A -- the LATER save should be what it shows
    await hA.page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:120000}); await hA.page.waitForTimeout(S);
    const pF = await readPref(hA.page);
    out.checks.c43560_reload_A = { pref: pF,
      chips: await hA.page.evaluate(()=>Array.from(document.querySelectorAll('[data-test-id^="filter_chip_"]')).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,32))),
      url: hA.page.url() };
    out.checks.c43560_verdict = {
      A_set: JSON.stringify(pA.filters), B_set: JSON.stringify(pB.filters), reload_A: JSON.stringify(pF.filters),
      check_could_fail: JSON.stringify(pA.filters) !== JSON.stringify(pB.filters),
      last_save_wins: JSON.stringify(pF.filters) === JSON.stringify(pB.filters) };
    out.bridge_B = hB.bridgeErrors.length;
    await hB.browser.close();

    // ---- C38876 : last-used tab remembered ----
    await hA.page.goto(APP+'/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:120000}); await hA.page.waitForTimeout(S);
    const t0 = await readPref(hA.page);
    const tabClicked = await hA.page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"], .q-tab'));
      const t = tabs.find(e => /^estimates$/i.test(e.innerText.trim()));
      if (!t) return { found:false, seen: tabs.map(e=>e.innerText.trim()).slice(0,6) };
      t.click(); return { found:true };
    });
    await hA.page.waitForTimeout(6000);
    const t1 = await readPref(hA.page);
    out.checks.c38876_tab_click = { tabClicked, before: t0, afterClick: t1,
      moved: t0.updatedAt !== t1.updatedAt, url: hA.page.url(),
      activeTab: await hA.page.evaluate(()=>{const t=document.querySelector('[role="tab"][aria-selected="true"], .q-tab--active'); return t?t.innerText.trim():null;}) };
    // now leave and come back PLAINLY
    await hA.page.goto(APP+'/customers',{waitUntil:'domcontentloaded',timeout:120000}); await hA.page.waitForTimeout(S);
    await hA.page.goto(APP+'/workorders',{waitUntil:'domcontentloaded',timeout:120000}); await hA.page.waitForTimeout(S);
    out.checks.c38876_on_return = { url: hA.page.url(), pref: await readPref(hA.page),
      activeTab: await hA.page.evaluate(()=>{const t=document.querySelector('[role="tab"][aria-selected="true"], .q-tab--active'); return t?t.innerText.trim():null;}) };
    await hA.page.screenshot({ path: `${OUT}/c38876-return.png` });
  } catch(e){ out.error = String(e).slice(0,400); }
  out.bridge_A = hA.bridgeErrors.length;
  fs.writeFileSync(`${OUT}/retry.json`, JSON.stringify(out,null,2));
  console.log(JSON.stringify(out.checks,null,1).slice(0,4500));
  console.log('BRIDGE A', out.bridge_A, 'ERR', out.error||'-');
  await hA.browser.close();
})();
