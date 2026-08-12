// probeP9.cjs — finish4, 2026-08-12. The decisive re-check of filter RESTORE on a fresh profile.
//
// WHY THIS EXISTS. probeP6 saw a fresh browser profile NOT restore a saved filter, while the
// account-level preference plainly held it. That would be a serious finding against S10-R1/S10-R2
// on release eve — EXCEPT that finish3 recorded the OPPOSITE on the SAME build and the SAME
// harness ("a brand-new browser opened -> Status : Declined came back"). Two passes disagreeing
// is not evidence; it is a reason to measure more carefully.
//
// THE DECISIVE DATUM, which neither earlier run captured: DOES THE SPA ITSELF REQUEST THE
// PREFERENCE ENDPOINT ON BOOT? The harness logs every API call, so:
//   * if the SPA never GETs /api/users/me/preferences/... then our earlier "pref exists" read was
//     OUR OWN fetch and proves nothing about what the app had available -> harness artifact,
//   * if the SPA DOES GET it and the chips still show no value, the restore genuinely fails.
//
// It also samples the chips REPEATEDLY over 25 seconds, because a single read at 11s cannot tell
// "never restores" from "restores late".
//
// No forced PUT anywhere in this probe: the filter is set through the chip like a tester, so
// nothing about the stored shape is ours.

const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);
const out = { case: 'C29614', step: 6, read_at_utc: new Date().toISOString() };

const prefCalls = (h) => h.apiLog.filter(a => /preferences/.test(a.u));

(async () => {
  // ---------- PROFILE 1: set a filter through the chip, exactly as a tester would.
  const P1 = await makeHarness('admin', { width: 1500, height: 950 });
  try {
    await L.goWO(P1.page, '?tab=all');
    await L.clearAll(P1.page); await S(P1.page, 3000);     // via the UI control, not a PUT
    out.p1_prefAfterClear = (await L.pref(P1.page)).value?.filters;

    await L.openChip(P1.page, 'filter_chip_status');
    out.p1_picked = (await L.pickOption(P1.page, 'filter_option_status_declined')).clicked;
    await L.closeMenu(P1.page); await S(P1.page, 5000);
    out.p1_url = P1.page.url();
    out.p1_chips = (await L.chips(P1.page)).map(c => c.text).filter(t => /Status/.test(t));
    const pp = await L.pref(P1.page);
    out.p1_pref = pp.value?.filters;
    out.p1_prefUpdatedAt = pp.updatedAt;
    out.p1_saved = JSON.stringify(pp.value?.filters || {}).includes('declined');
    out.p1_prefApiCalls = prefCalls(P1);
    await L.shot(P1.page, OUT, 'P9-profile1-declined');
  } catch (e) { out.error1 = String(e).slice(0, 400); }
  await P1.browser.close();

  // ---------- PROFILE 2: a genuinely separate chromium process and profile.
  const P2 = await makeHarness('admin', { width: 1500, height: 950 });
  try {
    out.p2_localStorageBeforeNav = await P2.page.evaluate(() => {
      try { return Object.keys(localStorage).sort(); } catch (_) { return ['unreadable']; } });
    const apiBefore = P2.apiLog.length;
    await P2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });

    // Sample the chips repeatedly: a single read cannot distinguish "never" from "late".
    out.p2_samples = [];
    for (const t of [6000, 6000, 6000, 7000]) {
      await S(P2.page, t);
      const chips = await P2.page.$$eval('[data-test-id^="filter_chip_"]',
        els => els.map(e => (e.innerText || '').replace(/\s+/g, ' ').trim()))
        .catch(() => null);
      out.p2_samples.push({
        atMs: out.p2_samples.reduce((a, s) => a + s.waited, 0) + t,
        waited: t,
        statusChip: (chips || []).find(c => /Status/.test(c)) || null,
        url: P2.page.url()
      });
    }
    // THE DECISIVE DATUM: did the SPA itself ask for the preference?
    out.p2_prefApiCallsBySpa = P2.apiLog.slice(apiBefore).filter(a => /preferences/.test(a.u));
    out.p2_allApiPathsSample = [...new Set(P2.apiLog.slice(apiBefore).map(a => a.u.split('?')[0]))].slice(0, 25);
    out.p2_finalStatusChip = out.p2_samples[out.p2_samples.length - 1].statusChip;
    out.p2_restored = /Declined/i.test(out.p2_finalStatusChip || '');
    out.p2_url = P2.page.url();
    out.p2_rows = await L.rows(P2.page);
    // Our own read of the stored value, AFTER the SPA had its chance.
    out.p2_prefReadByUs = (await L.pref(P2.page)).value?.filters;
    await L.shot(P2.page, OUT, 'P9-profile2-fresh');

    // A reload in the SAME profile: does it restore then? Separates "fresh profile" from
    // "restore is broken generally".
    await P2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await S(P2.page, 12000);
    out.p2_afterReloadStatusChip = (await L.chips(P2.page)).map(c => c.text).find(t => /Status/.test(t)) || null;
    out.p2_afterReloadUrl = P2.page.url();
    out.p2_afterReloadRestored = /Declined/i.test(out.p2_afterReloadStatusChip || '');
    await L.shot(P2.page, OUT, 'P9-profile2-after-reload');
    out.p2_bridgeErrors = P2.bridgeErrors.length;
    out.p2_api4xx = P2.apiLog.filter(a => a.s >= 400 && !/sso\/check/.test(a.u)).slice(0, 8);
  } catch (e) { out.error2 = String(e).slice(0, 400); }
  await P2.browser.close();

  fs.writeFileSync(`${OUT}/probeP9.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 6000));
})();
