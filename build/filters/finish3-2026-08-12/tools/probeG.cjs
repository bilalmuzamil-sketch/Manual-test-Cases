// probeG.cjs — decide the open question with a VALID option id.
// probeF used filter_option_status_review, which does not exist (the real id is
// filter_option_status_ready_for_review), so its click never happened and it proved nothing.
const B = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12/tools/';
const { makeHarness, OUT } = require(B + 'harness.cjs');
const L = require(B + 'lib.cjs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';

(async () => {
  const H = await makeHarness('admin');
  const R = { read_at_utc: new Date().toISOString(), attempts: [] };
  try {
    await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(H.page, 11000);
    await L.ensureBarOpen(H.page);

    for (const target of ['filter_option_status_ready_for_review', 'filter_option_status_paid', 'filter_option_status_complete']) {
      const mark = H.apiLog.length;
      const before = await L.pref(H.page);
      const o = await L.openChip(H.page, 'filter_chip_status');
      const ids = o.options.map(x => x.id);
      const pk = await L.pickOption(H.page, target);
      const tickedNow = await L.tickedCount(H.page);
      await L.closeMenu(H.page);
      await S(H.page, 10000);
      const writes = H.apiLog.slice(mark).filter(a => /preferences\/work-orders-list/.test(a.u));
      const after = await L.pref(H.page);
      R.attempts.push({ target, targetExistsInMenu: ids.includes(target),
        picked: pk.clicked, tickedAfterPick: tickedNow, urlAfter: H.page.url(),
        writeRequestsSeen: writes.map(a => ({ m: a.m, s: a.s })),
        aWriteWasSent: writes.some(a => ['PUT', 'POST', 'PATCH'].includes(a.m)),
        prefBefore: before.value?.filters, prefAfter: after.value?.filters,
        updatedAtMoved: before.updatedAt !== after.updatedAt,
        savedWhatWasPicked: JSON.stringify(after.value?.filters || {}).includes(target.replace('filter_option_status_', '')) });
      await L.shot(H.page, OUT, `probeG-${target}`);
    }
    R.bridge_errors = H.bridgeErrors.length;
  } catch (e) { R.error = String(e).slice(0, 400); }
  L.save(OUT, 'probeG', R);
  console.log(JSON.stringify(R.attempts, null, 1).slice(0, 2600));
  await H.browser.close();
})();
