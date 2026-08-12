// probeP6.cjs — finish4, 2026-08-12. The two cross-browser remainders.
//
//  C43560 STEPS 5-6 — steps 1-4 are re-driven too, because they are cheap and it makes the
//    whole case walked in one continuous run rather than stitched across two passes.
//    finish3 failed this twice on a POLLUTED BASELINE, so this run starts from a preference
//    it has PROVEN clean and says so in the output.
//
//  C29614 STEP 6 — "On a different computer (OR A DIFFERENT BROWSER PROFILE), sign in as the
//    same person and open the Work Orders page." finish3 recorded this as needing "a different
//    physical computer, which cannot be produced here" and stopped. But THE CASE'S OWN TEXT
//    offers the browser-profile route as an equal alternative, and that IS producible: a fresh
//    chromium process gets its own profile directory and its own localStorage, with the same
//    account cookie injected = the same person signing in on a different profile.
//    HONEST LIMIT, STATED ON THE FINDING: it is the same physical machine, so what is proven is
//    "saved to the account, not to one browser profile", which is the mechanism expectation 3
//    is about. A second physical computer is still not producible here.
//
// Both blocks run SEQUENTIALLY and the preference is reset between them, because they both
// write the same account-level saved filter and would otherwise corrupt each other.

const { makeHarness, APP, API, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n = 2200) => p.waitForTimeout(n);
const R = { read_at_utc: new Date().toISOString(), cases: {} };
const CUST = { id: 'bee84acf-d719-4268-8b9d-48b6be794392', name: 'ZZAUTOTEST Alpha' };

async function forceClean(page) {
  await page.evaluate(async (api) => {
    const g = await fetch(`${api}/api/users/me/preferences/work-orders-list`, { headers: { accept: 'application/json' } });
    const cur = (await g.json())?.data?.value || {};
    cur.filters = [];                     // [] is the shape the app itself stores when clean.
    await fetch(`${api}/api/users/me/preferences/work-orders-list`, { method: 'PUT',
      headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ value: cur }) });
  }, API);
  await page.waitForTimeout(1500);
  return L.pref(page);
}

/** Set a Status filter through the chip, as a tester does. */
async function setStatus(page, optId) {
  await L.ensureBarOpen(page);
  const oc = await L.openChip(page, 'filter_chip_status');
  const pk = await L.pickOption(page, optId);
  await L.closeMenu(page);
  await page.waitForTimeout(4000);
  return { opened: oc.found, picked: pk.clicked, url: page.url() };
}
async function clearStatus(page, optId) {
  await L.openChip(page, 'filter_chip_status');
  const pk = await L.pickOption(page, optId);   // clicking a ticked option unticks it
  await L.closeMenu(page);
  await page.waitForTimeout(4000);
  return { unpicked: pk.clicked, url: page.url() };
}
async function chipState(page) {
  await L.ensureBarOpen(page);
  return { chips: (await L.chips(page)).map(c => c.text), url: page.url(), rows: await L.rows(page) };
}

(async () => {
  // ==================================================== C43560 steps 1-6, two live browsers
  {
    const e = { case: 'C43560', steps: '1-6' };
    const A = await makeHarness('admin', { width: 1500, height: 950 });
    const B = await makeHarness('admin', { width: 1500, height: 950 });
    try {
      await L.goWO(A.page, '?tab=all');
      const cleaned = await forceClean(A.page);
      e.baseline = cleaned.value?.filters;
      e.baselineIsClean = Array.isArray(e.baseline) && e.baseline.length === 0;
      e.baselineUpdatedAt = cleaned.updatedAt;

      // Reload BOTH so neither holds stale in-memory state from before the clean.
      await A.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(A.page, 9000);
      await L.goWO(B.page, '?tab=all');
      e.bothStarted = { A: A.page.url(), B: B.page.url() };

      // STEP 1 — Browser A sets Approved.
      e.step1_A_setApproved = await setStatus(A.page, 'filter_option_status_approved');
      e.prefAfterStep1 = (await L.pref(A.page)).value?.filters;

      // STEP 2 — Browser B sets Estimate and clears Approved.
      e.step2_B_setEstimate = await setStatus(B.page, 'filter_option_status_estimate');
      const bTicked = await L.tickedCount(B.page);
      e.step2_B_tickedBeforeClearing = bTicked;
      e.step2_B_clearApproved = await clearStatus(B.page, 'filter_option_status_approved');
      e.prefAfterStep2 = (await L.pref(B.page)).value?.filters;
      await L.shot(B.page, OUT, 'P6-c43560-step2-B');

      // STEP 3 — Browser A reloads. STEP 4 — look at chips and table.
      await A.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(A.page, 10000);
      e.step4_A_afterReload = await chipState(A.page);
      e.step4_A_showsEstimateNotApproved =
        /Estimate/i.test(JSON.stringify(e.step4_A_afterReload.chips)) &&
        !/Approved/i.test(JSON.stringify(e.step4_A_afterReload.chips));
      await L.shot(A.page, OUT, 'P6-c43560-step4-A');

      // STEP 5 — Browser A ALSO sets a Customer filter.
      await L.ensureBarOpen(A.page);
      await L.openChip(A.page, 'filter_chip_company_id');
      await A.page.evaluate((t) => { const m = document.querySelector('.q-menu');
        const i = m && m.querySelector('input:not(.hidden)');
        if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 'ZZAUTOTEST Alpha');
      await S(A.page, 2400);
      e.step5_A_pickedCustomer = (await L.pickOption(A.page, `filter_option_company_id_${CUST.id}`)).clicked;
      await L.closeMenu(A.page); await S(A.page, 5000);
      e.step5_A_url = A.page.url();
      const p5 = await L.pref(A.page);
      e.prefAfterStep5 = p5.value?.filters;
      e.step5_savedCustomer = JSON.stringify(p5.value?.filters || {}).includes(CUST.id);
      await L.shot(A.page, OUT, 'P6-c43560-step5-A');

      // STEP 6 — Browser B reloads and must show the newest saved state INCLUDING the customer.
      await B.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(B.page, 10500);
      e.step6_B_afterReload = await chipState(B.page);
      const bJson = JSON.stringify(e.step6_B_afterReload.chips);
      e.step6_B_showsCustomerFromA = /ZZAUTOTEST Alpha|Customer\s*:/i.test(bJson);
      e.step6_B_showsEstimate = /Estimate/i.test(bJson);
      e.step6_B_url = B.page.url();
      e.step6_B_urlCarriesCustomer = e.step6_B_url.includes(CUST.id);
      await L.shot(B.page, OUT, 'P6-c43560-step6-B');

      // Expectation 5 — no error message in either browser.
      e.consoleErrorsA = A.consoleErrs.filter(x => !/sso\/check/.test(x)).slice(0, 5);
      e.consoleErrorsB = B.consoleErrs.filter(x => !/sso\/check/.test(x)).slice(0, 5);
      e.api4xxA = A.apiLog.filter(a => a.s >= 400 && !/sso\/check/.test(a.u)).slice(0, 5);
      e.api4xxB = B.apiLog.filter(a => a.s >= 400 && !/sso\/check/.test(a.u)).slice(0, 5);
      e.errorTextOnScreen = await B.page.evaluate(() =>
        (document.body.innerText.match(/error|failed|something went wrong/i) || [null])[0]);

      await forceClean(A.page);
      e.prefResetAfter = (await L.pref(A.page)).value?.filters;
    } catch (err) { e.error = String(err).slice(0, 700); }
    e.bridge_errors_A = A.bridgeErrors.length; e.bridge_errors_B = B.bridgeErrors.length;
    R.cases['43560'] = e; L.save(OUT, 'probeP6', R);
    await A.browser.close(); await B.browser.close();
  }

  // ==================================================== C29614 step 6 — a different browser profile
  {
    const e = { case: 'C29614', step: 6,
      route: "the case's own alternative: 'or a different browser profile'" };
    const P1 = await makeHarness('admin', { width: 1500, height: 950 });
    try {
      await L.goWO(P1.page, '?tab=all');
      const cl = await forceClean(P1.page);
      e.baseline = cl.value?.filters;
      e.baselineIsClean = Array.isArray(e.baseline) && e.baseline.length === 0;
      await P1.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(P1.page, 9000);

      // Profile 1 applies a filter a tester can see at a glance.
      e.profile1_set = await setStatus(P1.page, 'filter_option_status_declined');
      e.profile1_chips = (await L.chips(P1.page)).map(c => c.text);
      const pp = await L.pref(P1.page);
      e.profile1_pref = pp.value?.filters;
      e.profile1_saved = JSON.stringify(pp.value?.filters || {}).includes('declined');
      await L.shot(P1.page, OUT, 'P6-c29614-profile1');
    } catch (err) { e.error1 = String(err).slice(0, 500); }
    await P1.browser.close();     // profile 1 gone entirely

    // A SECOND, INDEPENDENT chromium process = its own profile directory and localStorage.
    const P2 = await makeHarness('admin', { width: 1500, height: 950 });
    try {
      // Prove the profile really is fresh BEFORE navigating: no app state carried over.
      e.profile2_localStorageBefore = await P2.page.evaluate(() => {
        try { return { keys: Object.keys(localStorage).sort() }; } catch (_) { return { unreadable: true }; }
      });
      await P2.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(P2.page, 11000);
      await L.ensureBarOpen(P2.page);
      e.profile2_chips = (await L.chips(P2.page)).map(c => c.text);
      e.profile2_url = P2.page.url();
      e.profile2_rows = await L.rows(P2.page);
      e.profile2_pref = (await L.pref(P2.page)).value?.filters;
      e.profile2_showsDeclined = /Declined/i.test(JSON.stringify(e.profile2_chips));
      await L.shot(P2.page, OUT, 'P6-c29614-profile2');
      e.consoleErrors = P2.consoleErrs.filter(x => !/sso\/check/.test(x)).slice(0, 5);
      await forceClean(P2.page);
      e.prefResetAfter = (await L.pref(P2.page)).value?.filters;
    } catch (err) { e.error2 = String(err).slice(0, 500); }
    e.bridge_errors = P2.bridgeErrors.length;
    R.cases['29614'] = e; L.save(OUT, 'probeP6', R);
    await P2.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP6.json`, JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1).slice(0, 9000));
})();
