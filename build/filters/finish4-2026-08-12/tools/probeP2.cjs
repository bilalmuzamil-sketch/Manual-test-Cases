// probeP2.cjs — finish4, 2026-08-12.
//
// (1) C29568 expectation 3, PROPERLY: does a long customer name on a TAG ever get an
//     ellipsis? probeP1 showed the dropdown PANEL GROWS to fit (1422 px at a 1680 viewport),
//     so nothing truncated. That could be a width artefact of a very wide viewport, so this
//     runs THREE desktop widths: 1680, 1366, 1024.
//     CONTROL THAT PROVES THE DETECTOR CAN FIRE: the BAR chip is measured in the same run.
//     finish3 proved the bar chip DOES shorten ('ZZAUTOTEST Extr...'). If the detector
//     reports truncation on the bar chip and none on the tag, it demonstrably works.
//     Without this control a flat "no ellipsis anywhere" reading could not fail.
//
// (2) C29569 expectations 2 and 3, PROPERLY: probeP1's tick count of 1 was MY OWN ARTEFACT —
//     the menu search box still held 'ZZAUTOTEST Bravo', so only ONE option row was in the
//     DOM to be counted. The URL carried three ids and three tags were present. This run
//     CLEARS the search box before counting, so all selected rows are actually rendered.

const { makeHarness, APP, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

const LONG_ID = '5b4b41b9-a34a-45b4-957b-9299edfc14fa';
const LONG_NAME = 'ZZAUTOTEST Extraordinarily';
const A = { id: 'bee84acf-d719-4268-8b9d-48b6be794392', name: 'ZZAUTOTEST Alpha' };
const B = { id: 'b47aac6c-b81b-4c13-a54b-e1532bf9d523', name: 'ZZAUTOTEST Bravo' };

const S = (p, ms) => p.waitForTimeout(ms);
const res = {};

async function typeMenu(page, text) {
  return page.evaluate((t) => {
    const m = document.querySelector('.q-menu'); if (!m) return false;
    const i = m.querySelector('input:not(.hidden)'); if (!i) return false;
    i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); return true;
  }, text);
}

/** Measure a chip's label for real truncation: geometry AND computed text-overflow AND
 *  whether the rendered text is actually shorter than the full name. */
function chipMetric() {
  return (c) => {
    const lbl = c.querySelector('.q-chip__content') || c;
    const cs = getComputedStyle(lbl);
    return {
      innerText: (c.innerText || '').replace(/\s+/g, ' ').trim(),
      chipWidth: Math.round(c.getBoundingClientRect().width),
      scrollWidth: lbl.scrollWidth, clientWidth: lbl.clientWidth,
      geometricallyOverflowing: lbl.scrollWidth > lbl.clientWidth,
      textOverflow: cs.textOverflow, whiteSpace: cs.whiteSpace, overflow: cs.overflow
    };
  };
}

async function measureBoth(page, fullName) {
  return page.evaluate((full) => {
    const metric = (c) => {
      const lbl = c.querySelector('.q-chip__content') || c;
      const cs = getComputedStyle(lbl);
      const txt = (c.innerText || '').replace(/\s+/g, ' ').replace(/\s*cancel$/, '').trim();
      return {
        innerText: txt,
        renderedShorterThanFullName: txt.length < full.length,
        showsEllipsisCharacter: /[.]{3}|…/.test(txt),
        chipWidth: Math.round(c.getBoundingClientRect().width),
        scrollWidth: lbl.scrollWidth, clientWidth: lbl.clientWidth,
        geometricallyOverflowing: lbl.scrollWidth > lbl.clientWidth,
        textOverflow: cs.textOverflow, whiteSpace: cs.whiteSpace, overflow: cs.overflow
      };
    };
    const menu = document.querySelector('.q-menu');
    const out = { viewportWidth: window.innerWidth, fullNameLength: full.length };
    // TAG inside the dropdown panel — what expectation 3 is actually about.
    if (menu) {
      out.panelWidth = Math.round(menu.getBoundingClientRect().width);
      out.tags = Array.from(menu.querySelectorAll('.q-chip')).map(metric);
    } else { out.menuOpen = false; }
    // CONTROL: the BAR chip outside the menu, which finish3 proved does shorten.
    const bar = document.querySelector('[data-test-id="filter_chip_company_id"]');
    if (bar) {
      const cs = getComputedStyle(bar);
      const txt = (bar.innerText || '').replace(/\s+/g, ' ').trim();
      out.barChip = {
        innerText: txt,
        renderedShorterThanFullName: txt.length < full.length,
        showsEllipsisCharacter: /[.]{3}|…/.test(txt),
        width: Math.round(bar.getBoundingClientRect().width),
        scrollWidth: bar.scrollWidth, clientWidth: bar.clientWidth,
        geometricallyOverflowing: bar.scrollWidth > bar.clientWidth,
        textOverflow: cs.textOverflow
      };
    }
    return out;
  }, fullName);
}

const FULL = 'ZZAUTOTEST Extraordinarily And Exceedingly Long Customer Business Name For Tag Ellipsis Truncation Verification Incorporated Limited Liability Partnership Of Southern Alberta And Region';

(async () => {
  // ---------------------------------------------- C29568 across three desktop widths
  res['29568'] = { case: 'C29568', expectation: 3, fullNameLength: FULL.length, widths: {} };
  for (const w of [1680, 1366, 1024]) {
    const H = await makeHarness('admin', { width: w, height: 950 });
    try {
      await L.goWO(H.page, '?tab=all');
      await L.clearAll(H.page); await S(H.page, 2200);
      const oc = await L.openChip(H.page, 'filter_chip_company_id');
      await typeMenu(H.page, LONG_NAME); await S(H.page, 2200);
      const pk = await L.pickOption(H.page, `filter_option_company_id_${LONG_ID}`);
      await S(H.page, 2000);
      const m = await measureBoth(H.page, FULL);
      m.chipOpened = oc.found; m.picked = pk.clicked;
      res['29568'].widths[w] = m;
      await L.shot(H.page, OUT, `P2-c29568-tag-${w}`);
      await L.clearAll(H.page); await S(H.page, 1500);
    } catch (e) { res['29568'].widths[w] = { error: String(e).slice(0, 300) }; }
    await H.browser.close();
  }

  // ---------------------------------------------- C29569 expectations 2 and 3, search CLEARED
  {
    const H = await makeHarness('admin', { width: 1680, height: 1080 });
    const page = H.page;
    const e = { case: 'C29569', expectations: [1, 2, 3, 4] };
    try {
      await L.goWO(page, '?tab=all');
      await L.clearAll(page); await S(page, 2500);
      e.rowsUnfiltered = await L.rows(page);

      await L.openChip(page, 'filter_chip_company_id');
      // One search term that matches BOTH, so both rows can be picked, then CLEARED.
      await typeMenu(page, 'ZZAUTOTEST'); await S(page, 2400);
      const pA = await L.pickOption(page, `filter_option_company_id_${A.id}`);
      await S(page, 1600);
      const pB = await L.pickOption(page, `filter_option_company_id_${B.id}`);
      await S(page, 2000);
      e.pickedA = pA.clicked; e.pickedB = pB.clicked;

      // CLEAR the search box so EVERY selected row is rendered and countable.
      // This is the artefact that made probeP1 report one tick instead of two.
      e.searchCleared = await typeMenu(page, '');
      await S(page, 2600);

      e.before = {
        ticked: await L.tickedCustomers ? null : null,
        tickedRows: await page.$$eval('div[data-test-id^="filter_option_company_id_"]', els => els
          .filter(x => !!x.querySelector('.q-item__section--side i') || x.getAttribute('aria-checked') === 'true'
            || !!x.querySelector('.q-checkbox__inner--truthy'))
          .map(x => (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50))),
        optionRowsRendered: await page.$$eval('div[data-test-id^="filter_option_company_id_"]', e2 => e2.length),
        tags: await page.evaluate(() => { const m = document.querySelector('.q-menu');
          return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').replace(/\s+/g, ' ').replace(/\s*cancel$/, '').trim()) : null; }),
        url: page.url()
      };
      await L.shot(page, OUT, 'P2-c29569-two-selected');

      // Remove A by its OWN x, located by its text.
      e.removal = await page.evaluate((name) => {
        const m = document.querySelector('.q-menu'); if (!m) return { menu: false };
        const chips = Array.from(m.querySelectorAll('.q-chip'));
        const t = chips.find(c => (c.textContent || '').includes(name));
        if (!t) return { menu: true, targetFound: false, chips: chips.map(c => (c.textContent || '').slice(0, 30)) };
        const x = t.querySelector('.q-chip__icon--remove, i[class*="remove"], .q-icon:last-child');
        if (!x) return { menu: true, targetFound: true, xFound: false };
        x.click(); return { menu: true, targetFound: true, xFound: true };
      }, A.name);
      await S(page, 3200);

      e.after = {
        tickedRows: await page.$$eval('div[data-test-id^="filter_option_company_id_"]', els => els
          .filter(x => !!x.querySelector('.q-item__section--side i') || x.getAttribute('aria-checked') === 'true'
            || !!x.querySelector('.q-checkbox__inner--truthy'))
          .map(x => (x.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50))),
        optionRowsRendered: await page.$$eval('div[data-test-id^="filter_option_company_id_"]', e2 => e2.length),
        tags: await page.evaluate(() => { const m = document.querySelector('.q-menu');
          return m ? Array.from(m.querySelectorAll('.q-chip')).map(c => (c.innerText || '').replace(/\s+/g, ' ').replace(/\s*cancel$/, '').trim()) : null; }),
        url: page.url()
      };
      await L.shot(page, OUT, 'P2-c29569-one-removed');
      await L.closeMenu(page); await S(page, 3500);
      e.rowsAfter = await L.rows(page);
      e.savedPreference = (await L.pref(page)).value?.filters;
      await L.clearAll(page); await S(page, 1800);
    } catch (err) { e.error = String(err).slice(0, 500); }
    res['29569'] = e;
    res._meta = { identity: H.who, read_at_utc: new Date().toISOString(),
      bridge_errors: H.bridgeErrors.length, api_4xx5xx: H.apiLog.filter(a => a.s >= 400).slice(0, 10) };
    await H.browser.close();
  }

  fs.writeFileSync(`${OUT}/probeP2.json`, JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1).slice(0, 9000));
})();
