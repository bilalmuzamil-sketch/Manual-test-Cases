import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = {};
// C44897 - the OLD endpoint, on the api host where it lived (the app host just serves the page)
out.old = await b.page.evaluate(async () => {
  const r = {};
  for (const u of ['https://api.staging.shopview.com/api/global-search/fetch?q=Bridgeport',
                   'https://api.staging.shopview.com/api/search?q=Bridgeport']) {
    try { const x = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } });
          r[u.split('/api/')[1].split('?')[0]] = { status: x.status, body: (await x.text()).slice(0, 110) }; }
    catch (e) { r[u] = { error: String(e) }; }
  }
  return r;
});
console.log('C44897:', JSON.stringify(out.old, null, 1));
// C44898/C45134 - does tapping a row open the record on a phone?
await b.page.setViewportSize({ width: 390, height: 844 });
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(7000);
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST Bridgeport Hauling', 4000);
const before = b.page.url();
const tapped = await b.page.evaluate(() => {
  const r = document.querySelector('.search-modal .search-row'); if (!r) return null;
  const box = r.getBoundingClientRect();
  r.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); r.click();
  return (r.innerText || '').replace(/\s+/g, ' ').slice(0, 60);
});
await b.page.waitForTimeout(8000);
out.tap = { tapped, before, after: b.page.url(), opened: b.page.url() !== before };
console.log('mobile tap:', JSON.stringify(out.tap));
fs.writeFileSync('probe-final2.json', JSON.stringify(out, null, 1));
await b.browser.close();
