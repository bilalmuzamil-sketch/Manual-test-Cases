// Is the wrong highlight caused by the POINTER resting over a row? SV-10061 (closed as obsolete)
// says moving the mouse across the results changes which record Enter opens. My earlier reading
// opened the palette by clicking the header, which leaves the pointer on screen - so it has to be
// repeated with the mouse parked in a corner and the palette opened from the keyboard.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = [];
for (const mode of ['keyboard, pointer parked bottom-left', 'keyboard, pointer parked top-left', 'click on the header trigger']) {
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(7000);
  if (mode.startsWith('keyboard')) {
    await b.page.mouse.move(5, mode.includes('bottom') ? 860 : 5);
    await b.page.keyboard.press('Control+k');
    await b.page.waitForTimeout(2500);
    await b.page.keyboard.type('Bridgeport', { delay: 45 });
    await b.page.waitForTimeout(4500);
  } else {
    await P.openPalette(b.page, 'click');
    await P.type(b.page, 'Bridgeport', 4000);
  }
  const s = await P.read(b.page);
  const pointer = await b.page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
  const rec = { mode, rows: s.rowCount, selectedIndex: s.selectedIndex,
                top: (s.rows[0] || {}).text.slice(0, 60),
                highlighted: s.selectedIndex >= 0 ? s.rows[s.selectedIndex].text.slice(0, 60) : null };
  const before = b.page.url();
  await b.page.keyboard.press('Enter');
  await b.page.waitForTimeout(8000);
  rec.opened = b.page.url();
  rec.navigated = rec.opened !== before;
  out.push(rec);
  console.log(`${mode}:`);
  console.log(`   ${rec.rows} rows, highlight at ${rec.selectedIndex}`);
  console.log(`   top row     : ${rec.top}`);
  console.log(`   highlighted : ${rec.highlighted}`);
  console.log(`   Enter opened: ${rec.opened.replace('https://app.staging.shopview.com', '')}`);
}
fs.writeFileSync('probe-enter2.json', JSON.stringify(out, null, 1));
await b.browser.close();
