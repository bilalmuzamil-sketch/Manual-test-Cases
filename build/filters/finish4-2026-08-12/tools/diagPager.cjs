// diagPager.cjs — establish (a) how the table is sorted and how to PROVE a sort happened,
// and (b) the real next-page control. probeP5 clicked a header and asserted "the search
// survived" without proving the sort occurred at all, and found no pager, so both halves of
// C38886 step 2 were unproven rather than passing.
//
// The saved preference carries sortBy/descending, so it is an INDEPENDENT witness that a
// sort really happened -- better than reading the URL, which does not carry it.
const { makeHarness, APP, OUT } = require('./harness.cjs');
const L = require('./lib.cjs');
const fs = require('fs');
const S = (p, n) => p.waitForTimeout(n);

(async () => {
  const H = await makeHarness('admin', { width: 1680, height: 1080 });
  const page = H.page;
  const out = {};
  try {
    await L.goWO(page, '?tab=all');
    await L.clearAll(page); await S(page, 2200);

    out.prefBefore = (await L.pref(page)).value;
    // First column values, so an order change is visible.
    const firstCol = async () => page.evaluate(() => Array.from(document.querySelectorAll('tbody tr'))
      .slice(0, 8).map(tr => { const td = tr.querySelectorAll('td');
        return td.length > 3 ? (td[3].innerText || '').trim().slice(0, 20) : null; }).filter(Boolean));
    out.numbersBefore = await firstCol();

    // Click the Number header (index 3) and prove the sort landed in the preference.
    await page.evaluate(() => { const th = document.querySelectorAll('thead th')[3]; if (th) th.click(); });
    await S(page, 4500);
    out.prefAfterSort = (await L.pref(page)).value;
    out.numbersAfterSort = await firstCol();
    out.sortByChanged = out.prefBefore?.sortBy !== out.prefAfterSort?.sortBy
      || out.prefBefore?.descending !== out.prefAfterSort?.descending;
    out.orderChanged = JSON.stringify(out.numbersBefore) !== JSON.stringify(out.numbersAfterSort);

    // ---- The pager: enumerate EVERYTHING at the bottom of the page.
    out.pagerScan = await page.evaluate(() => {
      const vh = window.innerHeight;
      const all = Array.from(document.querySelectorAll('button,[role="button"],.q-btn,[data-test-id],i'))
        .map(e => { const r = e.getBoundingClientRect();
          return { id: e.getAttribute('data-test-id'), tag: e.tagName,
            text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30),
            aria: e.getAttribute('aria-label'), y: Math.round(r.y), visible: r.width > 0 };
        }).filter(e => e.visible);
      return { lowest: all.filter(e => e.y > 400).slice(-30),
        withNextish: all.filter(e => /next|chevron|arrow_forward|keyboard_arrow_right|page/i.test((e.id || '') + (e.text || '') + (e.aria || ''))),
        bodyTail: document.body.innerText.slice(-400) };
    });
    await L.shot(page, OUT, 'diag-pager');
  } catch (e) { out.error = String(e).slice(0, 400); }
  fs.writeFileSync(`${OUT}/diagPager.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 5000));
  await H.browser.close();
})();
