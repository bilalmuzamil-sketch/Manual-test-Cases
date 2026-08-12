// diagScroll.cjs — is there really no pagination, or did we scroll the wrong element?
//
// probeP7 concluded "no pager" after scrolling WINDOW. But docHeight was 1107 and scrollY
// reached only 27, which is the signature of a table that scrolls INSIDE ITS OWN CONTAINER.
// The unfiltered list renders ~33 rows while the org holds 1000+ work orders, so SOMETHING
// must reveal more. Absence may not be reported until the right element has been scrolled.
//
// This finds every scrollable ancestor of the table body, scrolls each to its end, and
// re-counts rows. If rows grow, the build uses virtual/infinite scrolling and C38886 step 2's
// "move to the next page" needs a wording correction rather than a defect.
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
    await L.clearAll(page); await S(page, 2500);
    out.serverTotalUnfiltered = (await L.serverCount(page, [])).total;
    out.rowsInitial = await page.evaluate(() => document.querySelectorAll('tbody tr').length);

    out.scrollables = await page.evaluate(() => {
      const tb = document.querySelector('tbody');
      const chain = [];
      let e = tb;
      while (e && e !== document.documentElement) {
        const cs = getComputedStyle(e);
        chain.push({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 70),
          scrollHeight: e.scrollHeight, clientHeight: e.clientHeight,
          scrollable: e.scrollHeight > e.clientHeight + 4,
          overflowY: cs.overflowY });
        e = e.parentElement;
      }
      return chain;
    });

    // Scroll EVERY scrollable ancestor to its end, repeatedly, and watch the row count.
    out.growth = [];
    for (let round = 1; round <= 4; round++) {
      await page.evaluate(() => {
        const tb = document.querySelector('tbody');
        let e = tb;
        while (e && e !== document.documentElement) {
          if (e.scrollHeight > e.clientHeight + 4) e.scrollTop = e.scrollHeight;
          e = e.parentElement;
        }
        window.scrollTo(0, document.body.scrollHeight);
        const last = document.querySelector('tbody tr:last-child');
        if (last && last.scrollIntoView) last.scrollIntoView({ block: 'end' });
      });
      await S(page, 3000);
      out.growth.push({ round, rows: await page.evaluate(() => document.querySelectorAll('tbody tr').length) });
    }

    out.afterScrolling = await page.evaluate(() => ({
      rows: document.querySelectorAll('tbody tr').length,
      virtualScrollMarkers: Array.from(document.querySelectorAll('[class*="virtual"],[class*="infinite"]'))
        .map(e => (e.className || '').toString().slice(0, 60)).slice(0, 6),
      bottomText: document.body.innerText.slice(-200),
      anyLoadMore: Array.from(document.querySelectorAll('button,a'))
        .map(b => (b.innerText || '').trim()).filter(t => /load more|show more|more results/i.test(t))
    }));
    await L.shot(page, OUT, 'diag-scroll-bottom');
  } catch (e) { out.error = String(e).slice(0, 400); }
  fs.writeFileSync(`${OUT}/diagScroll.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 4000));
  await H.browser.close();
})();
