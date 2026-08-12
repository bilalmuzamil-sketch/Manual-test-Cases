// probeT2 — READ-ONLY. probeT1's search-inside-the-filter could NOT FAIL: typing by setting
// input.value and dispatching an 'input' event emptied the list for BOTH the deactivated name
// and the ACTIVE control name, so "not found" meant nothing.  Vue's v-model does not see a
// value set that way.  Here the box is typed with REAL KEYSTROKES, and an active technician is
// searched first so the box is proved to work before any absence is read from it.
//
// Nothing here writes anything. No staff record is created, edited or deactivated.
const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

(async () => {
  const R = { probe: 'T2', at: new Date().toISOString(), build: 'v3.7-20e801b', readOnly: true, runs: [] };
  const h = await makeHarness('admin'); const P = h.page;

  const staff = await P.evaluate(async (api) => {
    const r = await fetch(api + '/api/staff?limit=300', { headers: { accept: 'application/json' } });
    const arr = (await r.json()).data.collection;
    return { inactive: arr.filter(s => !s.is_active).map(s => ({ n: `${s.first_name} ${s.last_name}`, r: s.role_label })),
             active: arr.filter(s => s.is_active).map(s => ({ n: `${s.first_name} ${s.last_name}`, r: s.role_label })) };
  }, API);
  R.staffCounts = { active: staff.active.length, inactive: staff.inactive.length };

  await P.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(13000); await L.ensureBarOpen(P);

  // type with real keystrokes into the menu's own search box
  const typeInMenu = async (word) => {
    const inp = await P.$('.q-menu input, .q-dialog input');
    if (!inp) return { found: false };
    await inp.click({ timeout: 6000 }).catch(() => {});
    await P.keyboard.down('Control'); await P.keyboard.press('KeyA'); await P.keyboard.up('Control');
    await P.keyboard.press('Backspace');
    await P.keyboard.type(word, { delay: 90 });
    await P.waitForTimeout(2800);
    return { found: true, value: await inp.inputValue().catch(() => null),
             placeholder: await inp.getAttribute('placeholder') };
  };
  const opts = () => P.$$eval(L.OPT, els => els.map(e => (e.innerText || '').trim()));

  for (const [caseId, chipId, roleWanted] of [
        ['C29581', 'filter_chip_tech_assigned_id', /Technician/i],
        ['C29588', 'filter_chip_service_advisor_id', /Advisor|Sales Representative/i]]) {
    const run = { case: caseId, chipId };
    const o = await L.openChip(P, chipId);
    run.step1_openFilter = { opened: o.found, optionCount: o.options.length };
    const listed = o.options.map(x => x.text.trim());

    // CONTROL FIRST — an ACTIVE person who IS in this list. If the box cannot find them,
    // the box is broken and no absence may be reported.
    const activeInList = staff.active.find(s => listed.includes(s.n));
    run.control = { name: activeInList && activeInList.n };
    if (activeInList) {
      run.control.typed = await typeInMenu(activeInList.n.split(' ')[0]);
      const after = await opts();
      run.control.resultCount = after.length;
      run.control.results = after.slice(0, 8);
      run.control.found = after.includes(activeInList.n);
      run.control.boxWorks = run.control.found;
    }

    // THE TEST — a DEACTIVATED person of the right kind
    const inact = staff.inactive.find(s => roleWanted.test(s.r)) || staff.inactive[0];
    run.step2_searchDeactivated = { name: inact && inact.n, role: inact && inact.r };
    if (inact) {
      run.step2_searchDeactivated.typed = await typeInMenu(inact.n.split(' ')[0]);
      const after = await opts();
      run.step3_lookAtList = { resultCount: after.length, results: after.slice(0, 10),
                               deactivatedPersonFound: after.includes(inact.n) };
      // and their surname too, in case the first name is shared
      await typeInMenu(inact.n.split(' ').slice(-1)[0]);
      const after2 = await opts();
      run.step3_lookAtList.bySurname = { resultCount: after2.length, results: after2.slice(0, 10),
                                         deactivatedPersonFound: after2.includes(inact.n) };
    }
    run.detectorCanFail = !!(run.control && run.control.boxWorks);
    run.everyStepExecutable = !!(run.step1_openFilter.opened
      && run.step2_searchDeactivated.typed && run.step2_searchDeactivated.typed.found
      && run.step3_lookAtList);
    await L.closeMenu(P); await P.waitForTimeout(1500);
    R.runs.push(run);
    console.log(`${caseId}: options ${run.step1_openFilter.optionCount}`
      + ` | CONTROL "${run.control.name}" found=${run.control.found} (${run.control.resultCount} results)`
      + ` | deactivated "${run.step2_searchDeactivated.name}" found=${run.step3_lookAtList.deactivatedPersonFound}`
      + ` bySurname=${run.step3_lookAtList.bySurname.deactivatedPersonFound}`
      + ` | canFail=${run.detectorCanFail} executable=${run.everyStepExecutable}`);
  }

  R.bridgeErrors = h.bridgeErrors.length;
  await h.browser.close();
  fs.writeFileSync(`${OUT}/probeT2.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeT2.json');
})();
