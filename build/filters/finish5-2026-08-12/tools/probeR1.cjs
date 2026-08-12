// probeR1 — SETTLE the filter-restore contradiction between finish3 (restore WORKED) and
// finish4 (restore FAILED) on the same build v3.7-20e801b.
//
// DESIGN, deliberately different from repeating either run:
//  * the baseline is cleaned THROUGH THE INTERFACE (Clear Filters), never by an API write --
//    finish3 proved a junk preference value silently disables saving altogether, and finish4
//    ran with {"status":["declined"]} left behind by its own probe;
//  * the filter is set ONLY through the chip;
//  * A CONTROL runs first: reload in the SAME profile, where restore is known to work.  If the
//    control does not restore, the detector is broken and no absence may be reported;
//  * the ONE variable finish3 and finish4 differ on is tested explicitly: the URL the fresh
//    profile lands on.  A BARE /workorders is what "restored when the page loads" means;
//    /workorders?tab=all carries explicit state that may legitimately win.
const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

const readPref = (page) => L.pref(page);
const chipText = (page) => page.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e =>
  (e.innerText||'').replace(/\s+/g,' ').replace(/\s*keyboard_arrow_down$/,'').trim()));

(async () => {
  const R = { probe:'R1', at:new Date().toISOString(), build:'v3.7-20e801b', stages:[] };

  // ============ PROFILE 1 — clean the baseline through the UI, then set a filter through the chip
  const h1 = await makeHarness('admin');
  const P1 = h1.page;
  await P1.goto(APP + '/workorders', { waitUntil:'domcontentloaded', timeout:120000 });
  await P1.waitForTimeout(12000);
  await L.ensureBarOpen(P1);

  R.prefOnArrival = await readPref(P1);
  R.chipsOnArrival = await chipText(P1);
  R.urlOnArrival = P1.url();

  // clean THROUGH THE INTERFACE
  const cl = await L.clearAll(P1); await P1.waitForTimeout(3500);
  R.clearFilters = { control: cl, chips: await chipText(P1), url: P1.url() };
  R.prefAfterClear = await readPref(P1);
  R.baselineClean = JSON.stringify(R.prefAfterClear.value?.filters) === '[]'
                 || R.prefAfterClear.value?.filters == null
                 || Object.keys(R.prefAfterClear.value?.filters || {}).length === 0;

  // set Status : Declined through the chip only
  const o = await L.openChip(P1,'filter_chip_status');
  const dec = o.options.find(x=>/^declined$/i.test(x.text));
  R.setFilter = { optionsSeen:o.options.length, declinedPresent: !!dec };
  if (dec) { await L.pickOption(P1, dec.id); await P1.waitForTimeout(4000); }
  await L.closeMenu(P1); await P1.waitForTimeout(3000);
  R.setFilter.chipsAfter = await chipText(P1);
  R.setFilter.url = P1.url();
  R.setFilter.rows = await P1.evaluate(()=>document.querySelectorAll('tbody tr').length);
  // the app's OWN save request, from the bridge log
  R.setFilter.appPUT = h1.apiLog.filter(a=>a.m==='PUT' && /preferences\/work-orders-list/.test(a.u));
  R.prefAfterSet = await readPref(P1);

  // ---- CONTROL: reload in the SAME profile. Restore is known to work here.
  await P1.goto(APP + '/workorders', { waitUntil:'domcontentloaded', timeout:120000 });
  await P1.waitForTimeout(13000);
  await L.ensureBarOpen(P1);
  R.control_sameProfileBareReload = { url:P1.url(), chips: await chipText(P1),
    statusHasValue: (await chipText(P1)).some(t=>/Status\s*:/.test(t)) };
  console.log('CONTROL (same profile, bare /workorders):', JSON.stringify(R.control_sameProfileBareReload));

  await h1.browser.close();

  // ============ PROFILE 2 — a genuinely separate browser process. TWO landing URLs.
  for (const [tag, path] of [['bare','/workorders'], ['tabAll','/workorders?tab=all']]) {
    const h2 = await makeHarness('admin');
    const P2 = h2.page;
    await P2.goto(APP + path, { waitUntil:'domcontentloaded', timeout:120000 });
    const samples = [];
    for (const ms of [6000,6000,6000,7000]) {
      await P2.waitForTimeout(ms);
      await L.ensureBarOpen(P2);
      const c = await chipText(P2);
      samples.push({ atMs: samples.reduce((a,s)=>a+0,0), chips:c, url:P2.url(),
        statusHasValue: c.some(t=>/Status\s*:/.test(t)) });
    }
    // a further reload inside the same fresh profile
    await P2.goto(APP + path, { waitUntil:'domcontentloaded', timeout:120000 });
    await P2.waitForTimeout(13000); await L.ensureBarOpen(P2);
    const c2 = await chipText(P2);
    const rec = { landing:path, samples,
      afterFurtherReload:{ chips:c2, url:P2.url(), statusHasValue:c2.some(t=>/Status\s*:/.test(t)) },
      appGET: h2.apiLog.filter(a=>a.m==='GET' && /preferences\/work-orders-list/.test(a.u)),
      appPUT: h2.apiLog.filter(a=>a.m==='PUT' && /preferences\/work-orders-list/.test(a.u)),
      prefNow: await readPref(P2), bridgeErrors: h2.bridgeErrors.length,
      api4xx: h2.apiLog.filter(a=>a.s>=400).slice(0,5) };
    R.stages.push({ tag, ...rec });
    console.log(`FRESH PROFILE / landing=${path}`);
    console.log('   samples statusHasValue:', JSON.stringify(samples.map(s=>s.statusHasValue)));
    console.log('   chips last            :', JSON.stringify(samples[samples.length-1].chips));
    console.log('   after further reload  :', rec.afterFurtherReload.statusHasValue, JSON.stringify(c2));
    console.log('   app GET pref          :', JSON.stringify(rec.appGET), 'PUT:', JSON.stringify(rec.appPUT));
    console.log('   pref value            :', JSON.stringify(rec.prefNow.value?.filters), 'bridgeErr', rec.bridgeErrors);
    await h2.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeR1.json`, JSON.stringify(R,null,2));
  console.log('--- baselineClean:', R.baselineClean, ' prefAfterClear:', JSON.stringify(R.prefAfterClear.value?.filters));
  console.log('--- prefAfterSet :', JSON.stringify(R.prefAfterSet.value?.filters), ' appPUT:', JSON.stringify(R.setFilter.appPUT));
  console.log('--- chip after set:', JSON.stringify(R.setFilter.chipsAfter));
})();
