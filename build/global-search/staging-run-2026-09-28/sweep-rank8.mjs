// C44854 only. The work order's Parts tab lives at /workorders/{id}/part-requests - NOT /parts,
// which is what the previous check asserted, so a correct arrival was rejected as a wrong screen.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')]
      .find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1600);
  return got;
}
const rowsOf = s => (s.rows || []).map(r => r.text.replace(/\s+/g, ' ').slice(0, 120));
async function look(page, q, tab) {
  await P.openPalette(page, 'click'); await P.type(page, q, 3400);
  if (tab) await clickTab(page, tab);
  const r = rowsOf(await P.read(page));
  await page.keyboard.press('Escape'); await page.waitForTimeout(700); return r;
}
const b = await P.openStaging('/customers', 'admin');
const out = {};
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-34138', 3400);
await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (r) r.click();
});
await b.page.waitForTimeout(9000);
await b.page.evaluate(() => {
  // the label reads "Parts (3)" once the work order HAS parts, so an exact match finds nothing -
  // the same trap as the palette's own tab strip.
  const l = [...document.querySelectorAll('.q-tab__label')].find(e => (e.innerText || '').trim().startsWith('Parts'));
  if (l) (l.closest('.q-tab') || l).click();
});
await b.page.waitForTimeout(7000);
out.url = b.page.url();
// The case says "open the work order's page", so ANY of its tabs counts as being on it.
out.onWoParts = /\/workorders\/[0-9a-f-]{8,}\//.test(out.url);
out.screen = await b.page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' '));
console.log('url:', out.url, '| on the work order\'s Parts tab:', out.onWoParts);
// which ZZT-FIB parts are actually ON this work order? Without that the case has nothing to compare.
out.fibOnWo = ['ZZT-FIB-1001', 'ZZT-FIB-1002', 'ZZT-FIB-1003', 'ZZT-FIB-1004', 'ZZT-FIB-1005']
  .filter(p => out.screen.includes(p));
out.partsPane = out.screen.slice(out.screen.indexOf('Lines'), out.screen.indexOf('Lines') + 900);
console.log('ZZT-FIB parts present on the work order:', out.fibOnWo.length ? out.fibOnWo.join(', ') : '(none)');
console.log('parts pane says:', out.partsPane.slice(0, 420));
if (out.onWoParts) {
  out.fromWo = await look(b.page, 'ZZT-FIB', 'Parts');
  console.log('palette from the work order:'); out.fromWo.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
  await b.page.goto('https://app.staging.shopview.com/parts/inventory', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(7000);
  out.fromAway = await look(b.page, 'ZZT-FIB', 'Parts');
  console.log('palette from an unrelated page:'); out.fromAway.forEach((r, i) => console.log(`   ${i + 1}. ${r}`));
}
fs.writeFileSync('sweep-rank8.json', JSON.stringify(out, null, 1));
await b.browser.close();
