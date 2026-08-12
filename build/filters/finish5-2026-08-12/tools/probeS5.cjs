// probeS5 — probeS4 could not fail on either of its two questions, for TWO harness reasons
// of my own, both named here rather than reported as build behaviour:
//
//   1. my "active tab" test matched /active/ anywhere in the class string, so it called ALL
//      tabs active; the tab I then clicked as "the other one" was the one already showing,
//      which is why no URL moved.  Fixed: read aria-selected, and fall back to the exact
//      class token q-tab--active.
//   2. my option enumeration only counts div[data-test-id^="filter_option_"].  probeQ5 had
//      already established that a Date Range panel is NOT built that way — its entries are
//      plain menu text — so "optionCount 0" was my selector, not an empty menu.  Fixed: pick
//      a date period by its visible text, the way a tester does.
const { makeHarness, OUT, APP } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const chipInfo = p => p.$$eval('[data-test-id^="filter_chip_"]', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').replace(/\s*keyboard_arrow_down$/, '').trim() })));
const rows = p => p.evaluate(() => document.querySelectorAll('tbody tr').length);
const tabs = p => p.$$eval('[role="tab"], .q-tab', els => els.map(e => ({
  id: e.getAttribute('data-test-id'),
  domText: (e.innerText || '').replace(/\s+/g, ' ').trim(),
  textTransform: getComputedStyle(e).textTransform,
  ariaSelected: e.getAttribute('aria-selected'),
  active: e.getAttribute('aria-selected') === 'true'
    || e.className.split(/\s+/).includes('q-tab--active')
})).filter(t => !/^(report_nav|parts_nav)/.test(t.id || '')));
const searchBox = p => p.evaluate(() => {
  const e = document.querySelector('input[type="search"], [data-test-id*="search"] input');
  return e ? { value: e.value, visible: !!e.offsetParent } : null; });

(async () => {
  const R = { probe: 'S5', at: new Date().toISOString(), build: 'v3.7-20e801b' };
  const h = await makeHarness('admin'); const P = h.page;
  const go = async (p, w = 10000) => { await P.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 120000 });
                                      await P.waitForTimeout(w); await L.ensureBarOpen(P); };
  const clickTab = async (id) => { const r = await L.clickSel(P, `[data-test-id="${id}"]`);
                                   await P.waitForTimeout(7000); await L.ensureBarOpen(P); return r; };

  // ---------- C38880 step 4, on a report that has BOTH tabs and a filter bar ----------
  {
    const c = { report: '/reports/technician-efficiency' };
    await go(c.report);
    c.tabsOnArrival = await tabs(P);
    c.chipsOnArrival = await chipInfo(P);
    c.rowsOnArrival = await rows(P);
    c.urlOnArrival = P.url();
    c.activeOnArrival = (c.tabsOnArrival.find(t => t.active) || {}).domText;

    // apply the Date filter by its VISIBLE TEXT (the panel is not a filter_option list)
    const chip = c.chipsOnArrival[0];
    await L.clickSel(P, `[data-test-id="${chip.id}"]`); await P.waitForTimeout(1600);
    c.panelText = await P.evaluate(() => { const m = document.querySelector('.q-menu,.q-dialog');
      return m ? (m.innerText || '').replace(/\s+/g, ' ').slice(0, 260) : null; });
    c.pickedPeriod = 'Last year';
    c.periodClicked = await P.evaluate(want => {
      const m = document.querySelector('.q-menu,.q-dialog'); if (!m) return false;
      const e = [...m.querySelectorAll('*')].find(x => !x.children.length
        && (x.innerText || '').trim().toLowerCase() === want.toLowerCase());
      if (!e) return false;
      (e.closest('.q-item, [role="option"], li') || e).click(); return true;
    }, c.pickedPeriod);
    await P.waitForTimeout(4200); await L.closeMenu(P); await P.waitForTimeout(2600);
    c.afterFilter = { url: P.url(), chips: await chipInfo(P), rows: await rows(P) };
    c.filterActuallyApplied = c.afterFilter.url !== c.urlOnArrival
      || JSON.stringify(c.afterFilter.chips) !== JSON.stringify(c.chipsOnArrival);

    const other = c.tabsOnArrival.find(t => !t.active);
    c.otherTab = other && other.domText;
    if (other && other.id) {
      c.switchClick = await clickTab(other.id);
      c.onOtherTab = { url: P.url(), chips: await chipInfo(P), rows: await rows(P),
                       active: ((await tabs(P)).find(t => t.active) || {}).domText };
      c.tabSwitchActuallyHappened = c.onOtherTab.active === other.domText;
      const first = c.tabsOnArrival.find(t => t.active);
      if (first && first.id) {
        await clickTab(first.id);
        c.backOnFirst = { url: P.url(), chips: await chipInfo(P), rows: await rows(P),
                          active: ((await tabs(P)).find(t => t.active) || {}).domText };
      }
    }
    c.executable = !!(c.tabsOnArrival.length >= 2 && c.chipsOnArrival.length >= 1
                      && c.periodClicked && c.filterActuallyApplied && c.tabSwitchActuallyHappened);
    R.c38880_step4 = c;
    console.log('C38880 s4:', JSON.stringify({ tabs: c.tabsOnArrival.map(t => [t.domText, t.active]),
      panel: !!c.panelText, picked: c.pickedPeriod, clicked: c.periodClicked,
      applied: c.filterActuallyApplied, urlAfter: c.afterFilter.url.replace(APP, ''),
      other: c.otherTab, switched: c.tabSwitchActuallyHappened,
      chipOnOther: c.onOtherTab && c.onOtherTab.chips.map(x => x.domText),
      chipBack: c.backOnFirst && c.backOnFirst.chips.map(x => x.domText), executable: c.executable }));
  }

  // ---------- C38901 step 4, on the one report that has BOTH tabs and a page search ----------
  {
    const c = { report: '/reports/batch-transactions' };
    await go(c.report);
    c.tabsOnArrival = await tabs(P);
    c.activeOnArrival = (c.tabsOnArrival.find(t => t.active) || {}).domText;
    c.pageSearchPresent = !!(await P.$('[data-test-id="page_search_toggle"]'));
    c.rowsOnArrival = await rows(P);

    const s = await L.search(P, 'a');
    await P.waitForTimeout(3000);
    c.searchOnFirstTab = { drove: s, url: P.url(), rows: await rows(P), box: await searchBox(P) };
    c.searchActuallyApplied = /[?&]search=/.test(P.url()) || c.searchOnFirstTab.rows !== c.rowsOnArrival;

    const other = c.tabsOnArrival.find(t => !t.active);
    c.otherTab = other && other.domText;
    if (other && other.id) {
      c.switchClick = await clickTab(other.id);
      c.onOtherTab = { url: P.url(), rows: await rows(P),
                       active: ((await tabs(P)).find(t => t.active) || {}).domText,
                       pageSearchPresent: !!(await P.$('[data-test-id="page_search_toggle"]')),
                       box: await searchBox(P) };
      c.tabSwitchActuallyHappened = c.onOtherTab.active === other.domText;
      // type a DIFFERENT word here, then go back — that is the case's step 3/4 shape
      if (c.onOtherTab.pageSearchPresent) {
        const s2 = await L.search(P, 'b'); await P.waitForTimeout(3000);
        c.searchOnOtherTab = { drove: s2, url: P.url(), rows: await rows(P), box: await searchBox(P) };
      }
      const first = c.tabsOnArrival.find(t => t.active);
      if (first && first.id) { await clickTab(first.id);
        c.backOnFirst = { url: P.url(), rows: await rows(P),
                          active: ((await tabs(P)).find(t => t.active) || {}).domText,
                          pageSearchPresent: !!(await P.$('[data-test-id="page_search_toggle"]')),
                          box: await searchBox(P) }; }
    }
    c.executable = !!(c.tabsOnArrival.length >= 2 && c.pageSearchPresent
                      && c.searchActuallyApplied && c.tabSwitchActuallyHappened);
    R.c38901_step4 = c;
    console.log('C38901 s4:', JSON.stringify({ tabs: c.tabsOnArrival.map(t => [t.domText, t.active]),
      search: c.pageSearchPresent, applied: c.searchActuallyApplied,
      urlA: c.searchOnFirstTab.url.replace(APP, ''), other: c.otherTab,
      switched: c.tabSwitchActuallyHappened, onOther: c.onOtherTab && { url: c.onOtherTab.url.replace(APP, ''),
        search: c.onOtherTab.pageSearchPresent, rows: c.onOtherTab.rows },
      onOtherTyped: c.searchOnOtherTab && c.searchOnOtherTab.url.replace(APP, ''),
      back: c.backOnFirst && c.backOnFirst.url.replace(APP, ''), executable: c.executable }));
  }

  R.bridgeErrors = h.bridgeErrors.length;
  await h.browser.close();
  fs.writeFileSync(`${OUT}/probeS5.json`, JSON.stringify(R, null, 2));
  console.log('WROTE probeS5.json');
})();
