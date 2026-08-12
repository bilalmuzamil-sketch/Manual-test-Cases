const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs = require('fs');
(async () => {
  const h = await makeHarness('ids'); const page = h.page;
  await page.goto(APP + '/schedule', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(13000);
  const out = await page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) return false;
      const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; };
    const ids = {};
    document.querySelectorAll('[data-test-id]').forEach(e => {
      const k = e.getAttribute('data-test-id');
      if (!ids[k]) ids[k] = { n: 0, vis: 0, sample: (e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60), tag: e.tagName };
      ids[k].n++; if (vis(e)) ids[k].vis++;
    });
    return ids;
  });
  fs.writeFileSync(`${OUT}/testids.json`, JSON.stringify(out, null, 1));
  const keys = Object.keys(out).sort();
  console.log('TOTAL test-ids:', keys.length);
  keys.forEach(k => console.log(`${String(out[k].n).padStart(3)}/${String(out[k].vis).padStart(3)}  ${k}  ${JSON.stringify(out[k].sample)}`));
  console.log('BRIDGE ERRORS:', h.bridgeErrors.length);
  await h.browser.close();
})();
