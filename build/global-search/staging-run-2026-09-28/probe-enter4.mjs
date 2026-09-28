// Pin down WHEN it goes wrong. Two conditions, three attempts each:
//   A) a freshly opened browser, one search
//   B) the same browser, page reloaded between searches
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const out = { freshBrowser: [], afterReload: [] };
for (let i = 0; i < 3; i++) {
  const b = await P.openStaging('/customers', 'admin');
  await b.page.waitForTimeout(6000);
  await P.openPalette(b.page, 'click'); await P.type(b.page, 'Bridgeport', 4200);
  const s = await P.read(b.page);
  out.freshBrowser.push(s.selectedIndex);
  console.log(`fresh browser ${i + 1}: rows=${s.rowCount} highlight=${s.selectedIndex}`);
  await b.browser.close();
}
const b = await P.openStaging('/customers', 'admin');
for (let i = 0; i < 3; i++) {
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6500);
  await P.openPalette(b.page, 'click'); await P.type(b.page, 'Bridgeport', 4200);
  const s = await P.read(b.page);
  out.afterReload.push(s.selectedIndex);
  console.log(`after a reload ${i + 1}: rows=${s.rowCount} highlight=${s.selectedIndex}`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);
}
await b.browser.close();
console.log('\nfresh browser  :', out.freshBrowser.join(', '));
console.log('after a reload :', out.afterReload.join(', '));
fs.writeFileSync('enter-defect/when.json', JSON.stringify(out, null, 1));
