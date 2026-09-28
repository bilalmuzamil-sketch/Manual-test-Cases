// The wrong highlight was seen three times in one earlier session and not once since. Repeat it
// enough times, in both the ways a tester opens the palette, to say which it is.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = [];
for (let i = 0; i < 8; i++) {
  const byClick = i % 2 === 0;
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6500);
  if (byClick) { await P.openPalette(b.page, 'click'); await P.type(b.page, 'Bridgeport', 4000); }
  else { await b.page.mouse.move(3, 3); await b.page.keyboard.press('Control+k'); await b.page.waitForTimeout(2200); await b.page.keyboard.type('Bridgeport', { delay: 45 }); await b.page.waitForTimeout(4200); }
  const s = await P.read(b.page);
  out.push({ i, how: byClick ? 'click' : 'keyboard', rows: s.rowCount, idx: s.selectedIndex,
             row: s.selectedIndex >= 0 ? s.rows[s.selectedIndex].text.slice(0, 44) : null });
  console.log(`${i} ${byClick ? 'click   ' : 'keyboard'} rows=${s.rowCount} highlight=${s.selectedIndex}  ${out[i].row}`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(600);
}
const bad = out.filter(r => r.idx !== 0);
console.log(`\nhighlight was NOT on the first row in ${bad.length} of ${out.length} attempts`);
fs.writeFileSync('probe-enter3.json', JSON.stringify(out, null, 1));
await b.browser.close();
