// The correct state, for the side-by-side: the SECOND search in the same sitting behaves properly.
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await b.page.waitForTimeout(6000);
await P.openPalette(b.page, 'click'); await P.type(b.page, 'Bridgeport', 4200);
let s = await P.read(b.page);
console.log('first search  : highlight at', s.selectedIndex);
await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(1200);
await P.openPalette(b.page, 'click'); await P.type(b.page, 'Bridgeport', 4200);
s = await P.read(b.page);
console.log('second search : highlight at', s.selectedIndex, '|', s.rows[s.selectedIndex].text.replace(/\s+/g,' ').slice(0,56));
if (s.selectedIndex === 0) { await b.page.screenshot({ path: 'enter-defect/correct-highlight.png' }); console.log('   captured the correct one'); }
await b.browser.close();
