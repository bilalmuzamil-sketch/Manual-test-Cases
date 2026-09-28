// C55673 in isolation. In the batch run the highlight sat at row 7 and Enter opened a record that
// was not the top one - but that run had just closed another search, so a carried-over selection
// could explain it. Here each attempt gets a FRESH page load, and the state is read twice with a
// longer settle before Enter is pressed.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = [];
for (const q of ['Bridgeport', 'Kestrel', 'Bridgeport']) {
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6000);
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 4000);
  await b.page.waitForTimeout(2500);                 // settle again before reading
  const s1 = await P.read(b.page);
  await b.page.waitForTimeout(1500);
  const s2 = await P.read(b.page);
  const before = b.page.url();
  await b.page.keyboard.press('Enter');
  await b.page.waitForTimeout(8000);
  const rec = { q, selectedIndex1: s1.selectedIndex, selectedIndex2: s2.selectedIndex,
    rowCount: s2.rowCount, top: (s2.rows[0] || {}).text,
    selectedRow: s2.selectedIndex >= 0 ? s2.rows[s2.selectedIndex].text : null,
    before, after: b.page.url() };
  rec.navigated = rec.after !== rec.before;
  out.push(rec);
  console.log(`"${q}": ${rec.rowCount} rows | highlight at ${rec.selectedIndex1}/${rec.selectedIndex2}`);
  console.log(`   top row      : ${(rec.top || '').slice(0, 78)}`);
  console.log(`   highlighted  : ${(rec.selectedRow || '(none)').slice(0, 78)}`);
  console.log(`   Enter        : ${rec.navigated ? rec.after : 'did not navigate'}`);
}
fs.writeFileSync('probe-enter.json', JSON.stringify(out, null, 1));
await b.browser.close();
