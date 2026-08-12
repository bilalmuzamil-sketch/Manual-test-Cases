// probeP1.cjs — finish4, 2026-08-12.
// Closes the two desktop customer-dropdown remainders left by finish3:
//   C29568 expectation 3 — a customer name long enough to OVERFLOW the panel, so the
//           ellipsis question can actually be answered. finish3's 84-char name rendered
//           in full (613 px inside a 645 px panel), so its check COULD NOT FAIL.
//           A 185-char customer was seeded for this run.
//   C29569 expectation 3 — the PLURAL half: with 2+ selected, removing one tag must leave
//           the OTHER tag and its tick intact. finish3 had only one selected.
//
// CONTROL THAT MAKES THE ELLIPSIS CHECK ABLE TO FAIL: a SHORT name is measured in the same
// panel in the same run. If the short one also reported truncation, the detector is wrong.
//
// Selector facts inherited from finish3 (do not rederive):
//   * options are DIV[data-test-id^="filter_option_"]
//   * Customer options are q-item with NO aria-checked; selection appends q-item__section--side
//   * menu search = set input.value + dispatch 'input'
//   * close with Escape, never a page click

const { makeHarness, APP, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');

const LONG_ID = '5b4b41b9-a34a-45b4-957b-9299edfc14fa';   // 185 chars, seeded this run
const LONG_PREFIX = 'ZZAUTOTEST Extraordinarily';
const SHORT_A = { id: 'bee84acf-d719-4268-8b9d-48b6be794392', name: 'ZZAUTOTEST Alpha' };
const SHORT_B = { id: 'b47aac6c-b81b-4c13-a54b-e1532bf9d523', name: 'ZZAUTOTEST Bravo' };

const S = (p, ms) => p.waitForTimeout(ms);
const res = {};
const put = (k, v) => { res[k] = v; };

/** Type into the open menu's search box the way the SPA expects. */
async function typeMenu(page, text) {
  return page.evaluate((t) => {
    const m = document.querySelector('.q-menu');
    if (!m) return false;
    const i = m.querySelector('input:not(.hidden)');
    if (!i) return false;
    i.value = t;
    i.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }, text);
}

/** Measure every tag in the dropdown's input area. This is the load-bearing measurement
 *  for C29568 expectation 3, so it returns BOTH readings of the text (textContent and the
 *  rendered innerText), the overflow geometry AND the computed text-overflow/white-space. */
async function measureTags(page) {
  return page.evaluate(() => {
    const m = document.querySelector('.q-menu');
    if (!m) return { menu: false };
    // The tags live in the field's own control area at the top of the menu.
    const chips = Array.from(m.querySelectorAll('.q-chip'));
    const panel = m.getBoundingClientRect();
    return {
      menu: true,
      panelWidth: Math.round(panel.width),
      chips: chips.map(c => {
        const lbl = c.querySelector('.q-chip__content') || c;
        const cs = getComputedStyle(lbl);
        const r = c.getBoundingClientRect();
        return {
          textContent: (c.textContent || '').replace(/\s+/g, ' ').trim(),
          innerText: (c.innerText || '').replace(/\s+/g, ' ').trim(),
          chipWidth: Math.round(r.width),
          labelScrollWidth: lbl.scrollWidth,
          labelClientWidth: lbl.clientWidth,
          overflowing: lbl.scrollWidth > lbl.clientWidth,
          textOverflow: cs.textOverflow,
          whiteSpace: cs.whiteSpace,
          overflow: cs.overflow,
          hasRemoveIcon: !!c.querySelector('.q-chip__icon--remove, [class*="remove"]')
        };
      })
    };
  });
}

/** Which customer options currently carry the selection glyph. */
async function tickedCustomers(page) {
  return page.$$eval('div[data-test-id^="filter_option_company_id_"]', els => els
    .filter(e => !!e.querySelector('.q-item__section--side i')
      || e.getAttribute('aria-checked') === 'true'
      || !!e.querySelector('.q-checkbox__inner--truthy'))
    .map(e => ({ id: e.getAttribute('data-test-id'), text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) })));
}

(async () => {
  const H = await makeHarness('admin');
  const page = H.page;
  try {
    await L.goWO(page, '?tab=all');
    await L.clearAll(page); await S(page, 2500);

    // ---------------------------------------------------------------- C29568 expectation 3
    {
      const e = { case: 'C29568', expectation: 3 };
      // Open Customer, search the LONG name, pick it, and measure its tag.
      const oc = await L.openChip(page, 'filter_chip_company_id');
      e.chipOpened = oc.found;
      e.typedLong = await typeMenu(page, LONG_PREFIX);
      await S(page, 2200);
      const pkLong = await L.pickOption(page, `filter_option_company_id_${LONG_ID}`);
      e.pickedLong = pkLong.clicked;
      await S(page, 1800);
      e.afterLongOnly = await measureTags(page);

      // CONTROL: add a SHORT name in the SAME panel, same run.
      e.typedShort = await typeMenu(page, 'ZZAUTOTEST Alpha');
      await S(page, 2200);
      const pkShort = await L.pickOption(page, `filter_option_company_id_${SHORT_A.id}`);
      e.pickedShort = pkShort.clicked;
      await S(page, 1800);
      e.withLongAndShort = await measureTags(page);
      await L.shot(page, OUT, 'P1-c29568-tags');
      put('29568', e);
    }

    // ---------------------------------------------------------------- C29569 expectation 3
    {
      const e = { case: 'C29569', expectation: 3 };
      // We now hold LONG + SHORT_A. Add SHORT_B so the removal has unambiguous survivors,
      // then remove SHORT_A's tag by its own x and prove the OTHER TWO survive.
      e.typedB = await typeMenu(page, 'ZZAUTOTEST Bravo');
      await S(page, 2200);
      const pkB = await L.pickOption(page, `filter_option_company_id_${SHORT_B.id}`);
      e.pickedB = pkB.clicked;
      await S(page, 2000);

      e.beforeTags = await measureTags(page);
      e.beforeTicked = await tickedCustomers(page);
      e.beforeUrl = page.url();
      e.beforeSelectedCount = e.beforeTicked.length;

      // Click the x on SHORT_A's tag SPECIFICALLY — located by its own text, not by index.
      const removal = await page.evaluate((name) => {
        const m = document.querySelector('.q-menu');
        if (!m) return { menu: false };
        const chips = Array.from(m.querySelectorAll('.q-chip'));
        const target = chips.find(c => (c.textContent || '').includes(name));
        if (!target) return { menu: true, targetFound: false, chipTexts: chips.map(c => (c.textContent || '').trim().slice(0, 40)) };
        const x = target.querySelector('.q-chip__icon--remove, i[class*="remove"], .q-icon:last-child');
        if (!x) return { menu: true, targetFound: true, xFound: false, html: target.outerHTML.slice(0, 500) };
        x.click();
        return { menu: true, targetFound: true, xFound: true };
      }, SHORT_A.name);
      e.removal = removal;
      await S(page, 3000);

      e.afterTags = await measureTags(page);
      e.afterTicked = await tickedCustomers(page);
      e.afterUrl = page.url();
      await L.shot(page, OUT, 'P1-c29569-after-removal');

      // Expectation 4: the table no longer includes that customer's work orders.
      await L.closeMenu(page); await S(page, 3500);
      e.rowsAfter = await L.rows(page);
      e.savedPreference = (await L.pref(page)).value;
      put('29569', e);
    }

    await L.clearAll(page); await S(page, 2000);
  } catch (err) {
    put('fatal', String(err).slice(0, 800));
  }
  res._meta = {
    identity: H.who, read_at_utc: new Date().toISOString(),
    bridge_errors: H.bridgeErrors.length, bridge_detail: H.bridgeErrors.slice(0, 5),
    api_4xx5xx: H.apiLog.filter(a => a.s >= 400).slice(0, 20)
  };
  fs.writeFileSync(`${OUT}/probeP1.json`, JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1).slice(0, 7000));
  await H.browser.close();
})();
