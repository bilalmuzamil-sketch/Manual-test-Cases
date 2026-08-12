// probeF.cjs — is the filter selection SAVED at all? Watch the actual write request.
// Discriminator: does the SPA send PUT .../preferences/work-orders-list, what does it
// return, and does a following GET reflect it? Rules out our own harness before any claim.
const B = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12/tools/';
const { makeHarness, OUT, API } = require(B + 'harness.cjs');
const L = require(B + 'lib.cjs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), blocks: [] };
  try {
    await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 11000);
    await L.ensureBarOpen(H.page);

    const prefCalls = () => H.apiLog.filter(a => /preferences\/work-orders-list/.test(a.u))
      .map(a => ({ m: a.m, s: a.s }));

    // 1) COLLAPSE (known to save) -- the control
    let mark = H.apiLog.length;
    await L.clickSel(H.page, '[data-test-id="toggle_filter_bar"]');
    await S(H.page, 6000);
    R.blocks.push({ action: 'collapse toggle (CONTROL: known to save)',
      prefCallsSincePick: H.apiLog.slice(mark).filter(a => /preferences\/work-orders-list/.test(a.u)).map(a => ({ m: a.m, s: a.s })),
      prefNow: (await L.pref(H.page)).value?.collapsed });
    await L.clickSel(H.page, '[data-test-id="toggle_filter_bar"]');
    await S(H.page, 6000);

    // 2) STATUS pick -- the thing under test
    mark = H.apiLog.length;
    const before = await L.pref(H.page);
    const o = await L.openChip(H.page, 'filter_chip_status');
    const pk = await L.pickOption(H.page, 'filter_option_status_review');
    await L.closeMenu(H.page);
    await S(H.page, 9000);
    const writes = H.apiLog.slice(mark).filter(a => /preferences\/work-orders-list/.test(a.u));
    const after = await L.pref(H.page);
    R.blocks.push({ action: 'status pick (UNDER TEST)',
      menuOptions: o.options.length, picked: pk.clicked, urlAfter: H.page.url(),
      prefCallsSincePick: writes.map(a => ({ m: a.m, s: a.s })),
      anyPutSent: writes.some(a => a.m === 'PUT' || a.m === 'POST' || a.m === 'PATCH'),
      prefBefore: before.value?.filters, prefAfter: after.value?.filters,
      updatedAtMoved: before.updatedAt !== after.updatedAt,
      before_updatedAt: before.updatedAt, after_updatedAt: after.updatedAt });

    // 3) a DIRECT write, to separate "the SPA does not send it" from "the server rejects it"
    const direct = await H.page.evaluate(async ({ api, val }) => {
      const r = await fetch(`${api}/api/users/me/preferences/work-orders-list`, {
        method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ value: val }) });
      let j = null; try { j = await r.json(); } catch (_) {}
      return { status: r.status, body: JSON.stringify(j).slice(0, 300) };
    }, { api: API, val: Object.assign({}, after.value || {}, { filters: { status: ['review'] } }) });
    await S(H.page, 2500);
    const afterDirect = await L.pref(H.page);
    R.blocks.push({ action: 'direct PUT from the page',
      response: direct, prefAfterDirect: afterDirect.value?.filters,
      directWriteWorked: JSON.stringify(afterDirect.value?.filters || {}).includes('review') });

    // 4) all preference traffic seen this session, for the record
    R.all_preference_calls = prefCalls();
    R.bridge_errors = H.bridgeErrors.length;
    R.realConsoleErrors = H.consoleErrs.filter(e => !/ERR_FAILED|404/.test(e)).slice(0, 6);
  } catch (e) { R.error = String(e).slice(0, 500); }
  L.save(OUT, 'probeF', R);
  console.log(JSON.stringify(R, null, 1).slice(0, 3000));
  await H.browser.close();
})();
