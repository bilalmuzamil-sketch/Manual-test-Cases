// probeT1 — READ-ONLY. Before editing any staff record, test whether the block on C29581 and
// C29588 is real (Standing Rule 68: prove it, and check it is not self-serviceable first).
//
// THE OBSERVATION THAT PROMPTS THIS: the estate ALREADY contains 17 inactive staff, including
// 9 inactive Technicians and 3 inactive Sales Representatives.  So "a deactivated person" is
// not a state we have to create — it is a state that already exists.  If an inactive
// technician is ABSENT from the Lead Technician filter list, the substance of C29581 is
// established without touching one staff record.
//
// Nothing here writes anything. No staff record is created, edited or deactivated.
const { makeHarness, OUT, APP, API } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

(async () => {
  const R = { probe: 'T1', at: new Date().toISOString(), build: 'v3.7-20e801b', readOnly: true };
  const h = await makeHarness('admin'); const P = h.page;

  // the staff roster, straight from the API the app itself uses
  R.staff = await P.evaluate(async (api) => {
    const r = await fetch(api + '/api/staff?limit=300', { headers: { accept: 'application/json' } });
    const j = await r.json();
    const arr = j.data.collection;
    return { http: r.status, total: arr.length,
      active: arr.filter(s => s.is_active).map(s => `${s.first_name} ${s.last_name}`),
      inactive: arr.filter(s => !s.is_active).map(s => ({
        name: `${s.first_name} ${s.last_name}`, role: s.role_label })) };
  }, API);

  await P.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await P.waitForTimeout(13000); await L.ensureBarOpen(P);

  for (const [key, chipId] of [['leadTechnician', 'filter_chip_tech_assigned_id'],
                               ['serviceAdvisor', 'filter_chip_service_advisor_id']]) {
    const o = await L.openChip(P, chipId);
    const names = o.options.map(x => x.text.trim());
    await L.closeMenu(P); await P.waitForTimeout(1200);
    const inactiveNames = R.staff.inactive.map(s => s.name);
    const activeNames = R.staff.active;
    R[key] = {
      optionCount: names.length,
      options: names,
      inactiveStaffAppearing: inactiveNames.filter(n => names.includes(n)),
      activeStaffAppearing: activeNames.filter(n => names.includes(n)),
      inactiveStaffAbsent: inactiveNames.filter(n => !names.includes(n)),
      // THE CONTROL: if NO active staff appear either, the list is not built from staff at all
      // and an absence proves nothing.
      detectorCanFail: activeNames.filter(n => names.includes(n)).length > 0
    };
    console.log(`${key}: ${names.length} options | active appearing ${R[key].activeStaffAppearing.length}/${activeNames.length}`
      + ` | inactive appearing ${R[key].inactiveStaffAppearing.length}/${inactiveNames.length}`
      + ` | canFail=${R[key].detectorCanFail}`);
    console.log('   inactive APPEARING:', JSON.stringify(R[key].inactiveStaffAppearing));
  }

  // C29581/C29588 step 2 is a SEARCH inside the filter. Drive it on an inactive technician.
  const target = (R.staff.inactive.find(s => /Technician/i.test(s.role)) || {}).name;
  R.searchTarget = target;
  if (target) {
    const o = await L.openChip(P, 'filter_chip_tech_assigned_id');
    R.searchInsideFilter = { opened: o.found, beforeCount: o.options.length };
    const typed = await P.evaluate(async (word) => {
      const m = document.querySelector('.q-menu,.q-dialog'); if (!m) return { found: false };
      const inp = m.querySelector('input');
      if (!inp) return { found: false, note: 'no input inside the menu' };
      inp.focus(); inp.value = word;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return { found: true, placeholder: inp.getAttribute('placeholder'), value: inp.value };
    }, target.split(' ')[0]);
    await P.waitForTimeout(2600);
    const after = await P.$$eval(L.OPT, els => els.map(e => (e.innerText || '').trim()));
    R.searchInsideFilter.typed = typed;
    R.searchInsideFilter.afterCount = after.length;
    R.searchInsideFilter.afterOptions = after.slice(0, 15);
    R.searchInsideFilter.targetFound = after.includes(target);
    // CONTROL: search an ACTIVE technician's first name and confirm the box does filter
    const activeTech = R.staff.active.find(n => n && n !== target);
    if (typed.found && activeTech) {
      await P.evaluate(async (word) => {
        const m = document.querySelector('.q-menu,.q-dialog'); const inp = m && m.querySelector('input');
        if (inp) { inp.focus(); inp.value = word; inp.dispatchEvent(new Event('input', { bubbles: true })); }
      }, activeTech.split(' ')[0]);
      await P.waitForTimeout(2600);
      const ctrl = await P.$$eval(L.OPT, els => els.map(e => (e.innerText || '').trim()));
      R.searchInsideFilter.control = { word: activeTech.split(' ')[0], count: ctrl.length,
        sample: ctrl.slice(0, 6), found: ctrl.includes(activeTech) };
    }
    await L.closeMenu(P);
    console.log('search inside filter:', JSON.stringify(R.searchInsideFilter).slice(0, 700));
  }

  R.bridgeErrors = h.bridgeErrors.length;
  await h.browser.close();
  fs.writeFileSync(`${OUT}/probeT1.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeT1.json');
})();
