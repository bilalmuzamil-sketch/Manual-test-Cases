// probeI.cjs — complete the two cases the poisoned preference had blocked.
//   C29616  a REMEMBERED (saved) deleted filter value
//   C43560  steps 5-6, the customer added in Browser A appearing in Browser B
// The preference is verified CLEAN and SAVING before either block starts.
const B = '/home/user/Manual-test-Cases/build/filters/finish3-2026-08-12/tools/';
const { makeHarness, OUT, API } = require(B + 'harness.cjs');
const L = require(B + 'lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);
const APP = 'https://sv8785.qa.shopview.com';
const ck = w => fs.readFileSync(`/tmp/qa-cookies/filters-${w}.txt`, 'utf8').trim();

async function pickCustomerByName(page, name, cid) {
  const oc = await L.openChip(page, 'filter_chip_company_id');
  await page.evaluate((t) => { const m = document.querySelector('.q-menu');
    const i = m && m.querySelector('input:not(.hidden)');
    if (i) { i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); } }, name.slice(0, 18));
  await page.waitForTimeout(2200);
  const visible = await page.$$eval(L.OPT, e => e.map(x => ({ id: x.getAttribute('data-test-id'), t: (x.innerText || '').trim() })));
  const hit = cid ? visible.find(v => v.id.endsWith(cid)) : visible[0];
  const r = hit ? await L.pickOption(page, hit.id) : { clicked: false };
  await L.closeMenu(page);
  return { menuOptions: oc.options.length, visible: visible.slice(0, 3), picked: r.clicked, hit };
}

(async () => {
  const R = { read_at_utc: new Date().toISOString(), cases: {} };
  const put = (id, o) => { R.cases[id] = o; L.save(OUT, 'probeI', R); };

  // ---------------------------------------------------------------- C29616
  {
    const f = {};
    try {
      const name = 'ZZAUTOTEST Deleted Remembered Three';
      const cr = await fetch(`${API}/api/customers/create`, { method: 'POST',
        headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ name }) }).then(r => r.json());
      const cid = cr?.data?.company_id;
      f.seeded = { name, id: cid };

      const H = await makeHarness('admin');
      await H.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(H.page, 11000);
      await L.ensureBarOpen(H.page);
      await L.clearAll(H.page); await S(H.page, 4000);
      // PROVE saving works before relying on it
      let o = await L.openChip(H.page, 'filter_chip_status');
      await L.pickOption(H.page, 'filter_option_status_declined');
      await L.closeMenu(H.page); await S(H.page, 8000);
      const sanity = await L.pref(H.page);
      f.savingProvenBeforeStart = JSON.stringify(sanity.value?.filters || {}).includes('declined');

      const pc = await pickCustomerByName(H.page, name, cid);
      await S(H.page, 9000);
      const saved = await L.pref(H.page);
      f.customerPick = pc; f.urlAfterPick = H.page.url();
      f.savedPreference = saved.value?.filters;
      f.preconditionAchieved = JSON.stringify(saved.value?.filters || {}).includes(cid);
      await H.browser.close();

      if (f.preconditionAchieved) {
        f.delete = await fetch(`${API}/api/customers/delete`, { method: 'POST',
          headers: { cookie: ck('admin'), 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ company_id: cid }), redirect: 'manual' }).then(r => ({ status: r.status }));
        f.reReadAfterDelete = await fetch(`${API}/api/customers/${cid}`,
          { headers: { cookie: ck('admin'), accept: 'application/json' } }).then(r => ({ status: r.status }));

        const H2 = await makeHarness('admin');
        await H2.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(H2.page, 12000);
        await L.ensureBarOpen(H2.page);
        const req = H2.apiLog.filter(a => /\/api\/work-orders\?/.test(a.u)).slice(-1)[0];
        const chip = await L.label(H2.page, '[data-test-id="filter_chip_company_id"]');
        const st = await L.label(H2.page, '[data-test-id="filter_chip_status"]');
        f.arrivedPlainly = { url: H2.page.url(),
          customerChip: chip.innerText, customerChipShowsAValue: /:/.test(chip.innerText || ''),
          statusChip: st.innerText, statusStillApplied: /Declined/.test(st.innerText || ''),
          rows: await L.rows(H2.page),
          lastListRequest: req ? { status: req.s, decoded: decodeURIComponent(req.u) } : null,
          deletedIdStillSent: req ? decodeURIComponent(req.u).includes(cid) : null,
          pageErrored: await H2.page.evaluate(() => /something went wrong|unexpected error/i.test(document.body.innerText)),
          realConsoleErrors: H2.consoleErrs.filter(x => !/ERR_FAILED|404/.test(x)).slice(0, 3) };
        f.could_fail = true;
        await L.shot(H2.page, OUT, 'c29616-final');
        await H2.browser.close();
      }
    } catch (e) { f.error = String(e).slice(0, 400); }
    put('29616', f);
  }

  // ---------------------------------------------------------------- C43560 steps 5-6
  {
    const c = {};
    try {
      const A = await makeHarness('admin');
      const Bh = await makeHarness('admin');
      for (const h of [A, Bh]) {
        await h.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded', timeout: 120000 });
        await S(h.page, 10000); await L.ensureBarOpen(h.page);
      }
      await L.clearAll(A.page); await S(A.page, 5000);
      const p0 = await L.pref(A.page);
      // A sets a status, then ALSO a customer (step 5)
      let o = await L.openChip(A.page, 'filter_chip_status');
      await L.pickOption(A.page, 'filter_option_status_declined');
      await L.closeMenu(A.page); await S(A.page, 8000);
      const p1 = await L.pref(A.page);
      const pc = await pickCustomerByName(A.page, 'Brabay Maintenance', null);
      await S(A.page, 9000);
      const p2 = await L.pref(A.page);
      c.step5 = { baseline: p0.value?.filters, afterStatus: p1.value?.filters,
        customerPick: pc, urlAfter: A.page.url(), afterCustomer: p2.value?.filters,
        bothSavesObserved: p1.updatedAt !== p0.updatedAt && p2.updatedAt !== p1.updatedAt };
      // step 6 — reload B
      await Bh.page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await S(Bh.page, 12000);
      await L.ensureBarOpen(Bh.page);
      const chips = await L.chips(Bh.page);
      c.step6 = { url: Bh.page.url(), chips: chips.map(x => x.text),
        showsStatus: /Declined/.test(chips.find(x => x.id === 'filter_chip_status')?.text || ''),
        showsCustomer: /:/.test(chips.find(x => x.id === 'filter_chip_company_id')?.text || ''),
        customerChip: chips.find(x => x.id === 'filter_chip_company_id')?.text,
        nothingDuplicated: (chips.filter(x => x.id === 'filter_chip_status').length === 1) };
      c.could_fail = c.step5.bothSavesObserved === true && pc.picked === true;
      await L.shot(Bh.page, OUT, 'c43560-step6-final');
      c.bridge_errors = A.bridgeErrors.length + Bh.bridgeErrors.length;
      // leave it clean
      await L.clearAll(A.page); await S(A.page, 3000);
      await A.browser.close(); await Bh.browser.close();
    } catch (e) { c.error = String(e).slice(0, 400); }
    put('43560-steps5-6', c);
  }

  console.log(JSON.stringify({ c29616: R.cases['29616']?.preconditionAchieved,
    c29616_symptom: R.cases['29616']?.arrivedPlainly?.deletedIdStillSent,
    c43560: R.cases['43560-steps5-6']?.could_fail }, null, 1));
})();
