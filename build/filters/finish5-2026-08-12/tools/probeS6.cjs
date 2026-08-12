// probeS6 — C43562 step 6, the half nobody has driven: "Repeat steps 1 to 5 on a report
// that has a filter bar".  Steps 1-3 on a report were driven by probeQ6 (c43562_report);
// step 4 (shared address in a fresh window) and step 5 (phone) were only ever driven on the
// PARTS page.  Same design as probeS3(A): the shared address names a DIFFERENT value from
// the one the profile last used, so the control and the shared arm cannot look alike.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').replace(/\s*keyboard_arrow_down$/, '').trim() })));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);

(async () => {
  const R = { probe: 'S6', at: new Date().toISOString(), build: 'v3.7-20e801b',
              report: '/reports/punch-clock-activities' };

  // ---- steps 1-4 on a report: filter by staff, then share that address to a fresh window
  {
    const h = await makeHarness('admin'); const P = h.page;
    await P.goto(APP + R.report, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(12000); await L.ensureBarOpen(P);
    const a = { arrivedUrl: P.url(), arrivedChips: await chipInfo(P), arrivedRows: await rows(P) };

    const staffChip = a.arrivedChips.find(c => /staff/i.test(c.id + c.domText));
    const o = await L.openChip(P, staffChip.id);
    a.staffOptions = o.options.length;
    const A = o.options[0], B = o.options[1] || o.options[0];
    a.setInProfile = A && A.text; a.sharedValue = B && B.text;
    await L.pickOption(P, A.id); await P.waitForTimeout(3800); await L.closeMenu(P); await P.waitForTimeout(2400);
    a.afterSetA = { url: P.url(), chips: await chipInfo(P), rows: await rows(P) };
    a.filterApplied = a.afterSetA.url !== a.arrivedUrl;

    const bId = B.id.replace(/^filter_option_[^_]*_/, '');
    a.sharedUrl = `${APP}${R.report}?staffId=${bId}`;
    await h.browser.close();

    const h2 = await makeHarness('admin'); const P2 = h2.page;
    await P2.goto(a.sharedUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P2.waitForTimeout(13000); await L.ensureBarOpen(P2);
    a.shared = { landedOn: P2.url(), chips: await chipInfo(P2), rows: await rows(P2) };
    await h2.browser.close();

    const h3 = await makeHarness('admin'); const P3 = h3.page;
    await P3.goto(APP + R.report, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P3.waitForTimeout(13000); await L.ensureBarOpen(P3);
    a.control_bare = { landedOn: P3.url(), chips: await chipInfo(P3), rows: await rows(P3) };
    await h3.browser.close();

    const g = s => (s.find(c => c.id === staffChip.id) || {}).domText || '';
    a.sharedChipText = g(a.shared.chips); a.controlChipText = g(a.control_bare.chips);
    a.detectorCanFail = a.sharedChipText !== a.controlChipText;
    R.step4_report = a;
    console.log('S6 step4:', JSON.stringify({ inProfile: a.setInProfile, shared: a.sharedValue,
      sharedChip: a.sharedChipText, controlChip: a.controlChipText,
      sharedRows: a.shared.rows, controlRows: a.control_bare.rows, canFail: a.detectorCanFail }));
  }

  // ---- step 5 on a report, at phone size
  {
    const h = await makeHarness('admin', { width: 390, height: 844 }); const P = h.page;
    await P.goto(APP + R.report, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await P.waitForTimeout(13000);
    const s = { viewport: '390x844' };
    s.chipsRaw = await P.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => {
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
      return { id: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
               x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), visible: cs.display !== 'none' }; }));
    s.horizontallyScrollable = await P.evaluate(() => {
      const c = [...document.querySelectorAll('*')].find(e => e.querySelector('[data-test-id^="filter_chip_"]')
        && e.scrollWidth > e.clientWidth + 8);
      return c ? { tag: c.tagName, scrollWidth: c.scrollWidth, clientWidth: c.clientWidth } : null; });
    s.toggleBar = !!(await P.$('[data-test-id="toggle_filter_bar"]'));
    if (s.chipsRaw.length) {
      const target = s.chipsRaw.find(c => /staff/i.test(c.id)) || s.chipsRaw[0];
      const o = await L.openChip(P, target.id);
      s.openedChip = target.id; s.opened = o.found; s.optionCount = o.options.length;
      s.sheetShape = await P.evaluate(() => { const m = document.querySelector('.q-menu,.q-dialog');
        if (!m) return null; const r = m.getBoundingClientRect();
        return { cls: m.className.slice(0, 60), x: Math.round(r.x), y: Math.round(r.y),
                 w: Math.round(r.width), h: Math.round(r.height),
                 hasApply: /apply/i.test(m.innerText || '') }; });
      if (o.options.length) { const before = P.url();
        await L.pickOption(P, o.options[0].id); await P.waitForTimeout(3200);
        s.appliedImmediately = P.url() !== before; s.urlAfter = P.url(); }
      await L.closeMenu(P);
    }
    await P.screenshot({ path: `${OUT}/c43562-phone-report.png` }).catch(() => {});
    R.step5_report_phone = s;
    await h.browser.close();
    console.log('S6 step5:', JSON.stringify({ chips: s.chipsRaw.map(c => c.text),
      scrollable: s.horizontallyScrollable, toggleBar: s.toggleBar, sheet: s.sheetShape,
      applied: s.appliedImmediately }));
  }

  fs.writeFileSync(`${OUT}/probeS6.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS6.json');
})();
