// probeE.cjs — characterise the saved-preference write, then retry C29616 with a real guard.
//
// WHY: four separate blocks in this pass recorded "the save was not observed" (C29603's
// collapsed flag, C29616's precondition twice, C43560 step 5, C38876's tab). A single
// explanation would account for all of them, so it is measured rather than assumed:
// how long after a filter change does GET .../preferences/work-orders-list reflect it?
//
// This is a TIMING CHARACTERISTIC OF OUR OWN READS, not a product defect claim. It is
// recorded as such. It also matters to the tester: C43560's own steps say "wait a few
// seconds", so the lag is anticipated by the case.

const { makeHarness, OUT, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';
const ck = w => fs.readFileSync(`/tmp/qa-cookies/filters-${w}.txt`, 'utf8').trim();

(async () => {
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeE', R); };

  // ============================================================ the timing measurement
  {
    const H = await makeHarness('admin');
    const m = { samples: [] };
    try {
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 10000);
      await L.ensureBarOpen(H.page);
      await L.clearAll(H.page); await S(H.page, 5000);
      const before = await L.pref(H.page);
      m.baseline = { updatedAt: before.updatedAt, filters: before.value?.filters };

      const o = await L.openChip(H.page, 'filter_chip_status');
      const t0 = Date.now();
      const pk = await L.pickOption(H.page, 'filter_option_status_paid');
      await L.closeMenu(H.page);
      m.picked = pk.clicked;
      m.urlImmediately = H.page.url();
      // poll for up to 30s
      for (let i = 0; i < 15; i++) {
        const p = await L.pref(H.page);
        const landed = JSON.stringify(p.value?.filters || {}).includes('paid');
        m.samples.push({ atMs: Date.now() - t0, updatedAt: p.updatedAt, landed,
          filters: p.value?.filters });
        if (landed) break;
        await S(H.page, 2000);
      }
      const hit = m.samples.find(s => s.landed);
      m.landedAfterMs = hit ? hit.atMs : null;
      m.neverLandedWithin30s = !hit;
      m.conclusion = hit
        ? `the change reached the saved preference after about ${Math.round(hit.atMs / 1000)}s; a read taken sooner returns the PREVIOUS value`
        : 'the change did not reach the saved preference within 30s of the pick';
      m.bridge_errors = H.bridgeErrors.length;
    } catch (e) { m.error = String(e).slice(0, 400); }
    put('preference-write-timing', m);
    await H.browser.close();
  }

  const waitMs = (R.cases['preference-write-timing'].landedAfterMs || 12000) + 6000;
  R.wait_used_for_saves_ms = waitMs;
  L.save(OUT, 'probeE', R);

  // ============================================================ C29616 retry, guarded
  {
    const f = { wait_used_ms: waitMs };
    try {
      const name = 'ZZAUTOTEST Deleted Remembered Value Two';
      const created = await fetch(`${API}/api/customers/create`, {
        method: 'POST', headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ name }) }).then(r => r.json());
      const cid = created?.data?.company_id;
      f.seeded = { name, id: cid };
      if (cid) {
        const H = await makeHarness('admin');
        await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(H.page, 10000);
        await L.ensureBarOpen(H.page);
        await L.clearAll(H.page); await S(H.page, 5000);
        const oc = await L.openChip(H.page, 'filter_chip_company_id');
        await H.page.evaluate((t) => { const m = document.querySelector('.q-menu');
          const i = m && m.querySelector('input:not(.hidden)');
          if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, 'ZZAUTOTEST Deleted');
        await S(H.page, 2200);
        const visible = await H.page.$$eval(L.OPT, e => e.map(x => (x.innerText || '').trim()));
        const pk = await L.pickOption(H.page, `filter_option_company_id_${cid}`);
        await L.closeMenu(H.page);
        f.optionVisible = visible; f.pickedInUi = pk.clicked; f.urlAfterPick = H.page.url();
        // POLL until the value is genuinely REMEMBERED
        let saved = null;
        for (let i = 0; i < 12; i++) {
          const p = await L.pref(H.page);
          if (JSON.stringify(p.value?.filters || {}).includes(cid)) { saved = p; break; }
          await S(H.page, 2500);
        }
        f.savedPreference = saved ? saved.value?.filters : null;
        f.preconditionAchieved = !!saved;
        await H.browser.close();

        if (saved) {
          f.delete = await fetch(`${API}/api/customers/delete`, {
            method: 'POST', headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
            body: JSON.stringify({ company_id: cid }), redirect: 'manual' }).then(r => ({ status: r.status }));
          f.reReadAfterDelete = await fetch(`${API}/api/customers/${cid}`,
            { headers: { cookie: ck('admin'), accept: 'application/json' } }).then(r => ({ status: r.status }));

          const H2 = await makeHarness('admin');
          await H2.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
          await S(H2.page, 12000);
          await L.ensureBarOpen(H2.page);
          const req = H2.apiLog.filter(a => /\/api\/work-orders\?/.test(a.u)).slice(-1)[0];
          const chip = await L.label(H2.page, '[data-test-id="filter_chip_company_id"]');
          f.arrivedPlainly = { url: H2.page.url(),
            customerChip: chip.innerText, customerChipShowsAValue: /:/.test(chip.innerText || ''),
            chips: (await L.chips(H2.page)).map(x => x.text),
            rows: await L.rows(H2.page),
            lastListRequest: req ? { status: req.s, decoded: decodeURIComponent(req.u) } : null,
            deletedIdStillSent: req ? decodeURIComponent(req.u).includes(cid) : null,
            pageErrored: await H2.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
            realConsoleErrors: H2.consoleErrs.filter(x => !/ERR_FAILED|404/.test(x)).slice(0, 3) };
          f.savedPreferenceAfterArrival = (await L.pref(H2.page)).value?.filters;
          f.could_fail = true;
          await L.shot(H2.page, OUT, 'c29616-remembered-deleted-guarded');
          await H2.browser.close();
        } else {
          f.note = 'the seeded customer never reached the saved preference even with polling, so the precondition was not achieved and nothing is concluded';
        }
      }
    } catch (e) { f.error = String(e).slice(0, 400); }
    put('29616', f);
  }

  // ============================================================ C29603 retry, phase-safe
  {
    const c = {};
    try {
      const H = await makeHarness('admin');
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      await L.ensureBarOpen(H.page);          // guarantees EXPANDED before anything
      c.startedExpanded = !!(await H.page.$('[data-test-id="filter_chip_status"]'));

      // A: expanded -> leave -> return, and the saved flag polled until it agrees
      let p = null;
      for (let i = 0; i < 10; i++) { p = await L.pref(H.page); if (p.value?.collapsed === false) break; await S(H.page, 2500); }
      c.expandedSavedFlag = p.value?.collapsed;
      await H.page.goto(APP + '/customers', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 6000);
      await H.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 11000);
      c.expandedSurvivedReturn = !!(await H.page.$('[data-test-id="filter_chip_status"]'));

      // B: collapse -> poll the flag -> leave -> return
      const cl = await L.clickSel(H.page, '[data-test-id="toggle_filter_bar"]');
      await S(H.page, 2600);
      c.collapseClicked = cl;
      c.collapsedInUi = !(await H.page.$('[data-test-id="filter_chip_status"]'));
      let p2 = null;
      for (let i = 0; i < 12; i++) { p2 = await L.pref(H.page); if (p2.value?.collapsed === true) break; await S(H.page, 2500); }
      c.collapsedSavedFlag = p2.value?.collapsed;
      c.collapsedFlagEverSaved = p2.value?.collapsed === true;
      await H.page.goto(APP + '/parts/inventory', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 6000);
      await H.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 }); await S(H.page, 11000);
      c.collapsedSurvivedReturn = !(await H.page.$('[data-test-id="filter_chip_status"]'));
      c.bothDirectionsHold = c.expandedSurvivedReturn === true && c.collapsedSurvivedReturn === true;
      c.could_fail = cl.clicked === true && c.startedExpanded === true;
      await L.shot(H.page, OUT, 'c29603-collapsed-after-return-guarded');
      // leave it expanded for the human tester
      await L.ensureBarOpen(H.page);
      c.bridge_errors = H.bridgeErrors.length;
      await H.browser.close();
    } catch (e) { c.error = String(e).slice(0, 400); }
    put('29603', c);
  }

  console.log(JSON.stringify({ timing: R.cases['preference-write-timing']?.conclusion,
    c29616: R.cases['29616']?.preconditionAchieved, c29603: R.cases['29603']?.bothDirectionsHold }, null, 1));
})();
