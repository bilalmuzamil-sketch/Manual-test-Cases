// probeH.cjs — RULE OUT OUR OWN DOING. probeF wrote filters={status:['review']} straight into
// the saved preference by direct PUT, and 'review' is NOT a valid status key on this build
// (the real one is ready_for_review). If that poisoned value is what stopped the SPA saving,
// then the "filters are not saved" observation is OURS, not the product's.
// Test: restore a clean preference, reload, drive a chip, and see whether saving resumes.
const B = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12/tools/';
const { makeHarness, OUT, API } = require(B + 'harness.cjs');
const L = require(B + 'lib.cjs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString() };
  try {
    await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 11000);
    R.poisonedPreference = (await L.pref(H.page)).value?.filters;

    // restore a CLEAN, valid preference (empty filters) by direct PUT
    const cur = (await L.pref(H.page)).value || {};
    R.restore = await H.page.evaluate(async ({ api, val }) => {
      const r = await fetch(`${api}/api/users/me/preferences/work-orders-list`, {
        method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ value: val }) });
      return { status: r.status };
    }, { api: API, val: Object.assign({}, cur, { filters: {} }) });
    await S(H.page, 3000);
    R.preferenceAfterRestore = (await L.pref(H.page)).value?.filters;

    // full reload so the SPA re-reads the clean value
    await H.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 12000);
    await L.ensureBarOpen(H.page);

    // now drive a chip and watch for the write
    const mark = H.apiLog.length;
    const before = await L.pref(H.page);
    const o = await L.openChip(H.page, 'filter_chip_status');
    const pk = await L.pickOption(H.page, 'filter_option_status_declined');
    await L.closeMenu(H.page);
    await S(H.page, 10000);
    const writes = H.apiLog.slice(mark).filter(a => /preferences\/work-orders-list/.test(a.u));
    const after = await L.pref(H.page);
    R.afterRestore = { menuOptions: o.options.length, picked: pk.clicked, urlAfter: H.page.url(),
      writeRequestsSeen: writes.map(a => ({ m: a.m, s: a.s })),
      aWriteWasSent: writes.some(a => ['PUT', 'POST', 'PATCH'].includes(a.m)),
      prefBefore: before.value?.filters, prefAfter: after.value?.filters,
      updatedAtMoved: before.updatedAt !== after.updatedAt,
      savingResumed: JSON.stringify(after.value?.filters || {}).includes('declined') };
    R.verdict = R.afterRestore.savingResumed
      ? 'SAVING RESUMED after restoring a valid preference -- the earlier "filters are not saved" observation was CAUSED BY OUR OWN direct PUT of an invalid status value. NOT a product finding.'
      : 'saving did NOT resume even with a clean preference -- our direct PUT is ruled OUT as the cause, and the observation stands as unexplained';
    // leave the account tidy for the human tester either way
    await L.clearAll(H.page); await S(H.page, 3000);
    R.finalPreference = (await L.pref(H.page)).value?.filters;
    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 400); }
  L.save(OUT, 'probeH', R);
  console.log(JSON.stringify(R, null, 1).slice(0, 2200));
  await H.browser.close();
})();
