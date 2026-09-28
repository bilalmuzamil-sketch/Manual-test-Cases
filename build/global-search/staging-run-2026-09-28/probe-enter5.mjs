// Is the pointer the cause? A closed report (the mouse moving across the results changing what
// Enter opens) describes that mechanism. Clicking the search box leaves the pointer exactly where
// the panel then opens, so this compares: click then MOVE THE POINTER AWAY before typing, against
// click and leave it, against keyboard-open with the pointer deliberately over a row.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const out = [];
const vp = await b.page.evaluate(() => ({ w: innerWidth, h: innerHeight }));
console.log('viewport', JSON.stringify(vp));
for (const mode of ['click, pointer left where it landed', 'click, then pointer moved to the far corner', 'keyboard, pointer parked in the corner', 'keyboard, pointer placed over the middle of the list']) {
  await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6500);
  if (mode.startsWith('click')) {
    await P.openPalette(b.page, 'click');
    if (mode.includes('far corner')) await b.page.mouse.move(vp.w - 5, vp.h - 5);
  } else {
    if (mode.includes('corner')) await b.page.mouse.move(vp.w - 5, vp.h - 5);
    else await b.page.mouse.move(Math.round(vp.w / 2), Math.round(vp.h / 2));
    await b.page.keyboard.press('Control+k');
    await b.page.waitForTimeout(2200);
  }
  await P.type(b.page, 'Bridgeport', 4200);
  const s = await P.read(b.page);
  const pos = await b.page.evaluate(() => {
    const r = document.querySelector('.search-modal .q-card, .search-modal');
    const box = r.getBoundingClientRect();
    return { left: Math.round(box.left), top: Math.round(box.top), w: Math.round(box.width) };
  });
  out.push({ mode, idx: s.selectedIndex, rows: s.rowCount, panel: pos });
  console.log(`${mode}: highlight=${s.selectedIndex} (panel starts at x=${pos.left}, y=${pos.top}, width ${pos.w})`);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);
}
fs.writeFileSync('enter-defect/pointer-test.json', JSON.stringify({ vp, out }, null, 1));
await b.browser.close();
