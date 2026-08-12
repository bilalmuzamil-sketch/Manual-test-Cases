// diagAsset.cjs — find the REAL chip id and option element shape for Asset on Site.
// probeP5 failed to click them: pickOption uses `div[data-test-id=...]` and the click
// returned false, so either the chip id or the element tag is wrong. Establish it, do not guess.
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

    out.allChips = await page.$$eval('[data-test-id^="filter_chip_"]',
      els => els.map(e => ({ id: e.getAttribute('data-test-id'), tag: e.tagName,
        text: (e.innerText || '').replace(/\s+/g, ' ').trim() })));

    const assetChip = out.allChips.find(c => /Asset on Site/i.test(c.text));
    out.assetChip = assetChip;
    if (assetChip) {
      const c = await L.clickSel(page, `[data-test-id="${assetChip.id}"]`);
      out.chipClick = c;
      await S(page, 1800);
      out.menuOptions = await page.evaluate(() => {
        const m = document.querySelector('.q-menu');
        if (!m) return { menuOpen: false };
        return { menuOpen: true,
          allTestIds: Array.from(m.querySelectorAll('[data-test-id]'))
            .map(e => ({ id: e.getAttribute('data-test-id'), tag: e.tagName,
              text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40) })),
          menuText: (m.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) };
      });
      // Try clicking Yes by test-id WITHOUT the div prefix.
      const yes = (out.menuOptions.allTestIds || []).find(x => /vehicleHere_1|_1$/.test(x.id || ''));
      out.yesCandidate = yes;
      if (yes) {
        out.yesClickTagAgnostic = await L.clickSel(page, `[data-test-id="${yes.id}"]`);
        await S(page, 3500);
        out.urlAfterYes = page.url();
      }
    }
  } catch (e) { out.error = String(e).slice(0, 400); }
  fs.writeFileSync(`${OUT}/diagAsset.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1).slice(0, 4000));
  await H.browser.close();
})();
