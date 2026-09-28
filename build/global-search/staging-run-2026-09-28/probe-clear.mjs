// C137996: the clear control inside the search box.
//  1. nothing typed  -> the x must NOT be there ("Clear all" by Recent searches is a different thing)
//  2. something typed -> the x appears
//  3. click it -> the box empties, the panel STAYS open, and the cursor stays in the box
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
await b.page.waitForTimeout(6000);
const state = () => b.page.evaluate(() => {
  const m = document.querySelector('.search-modal');
  if (!m) return { open: false };
  const inp = m.querySelector('input');
  const clr = m.querySelector('.search-modal__clear');
  const vis = e => !!(e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length));
  const txt = e => ((e && e.innerText) || '').replace(/\s+/g, ' ').trim();
  return {
    open: true,
    value: inp ? inp.value : null,
    focused: inp ? document.activeElement === inp : null,
    clearInsideBox: vis(clr),
    clearClass: clr ? String(clr.className) : null,
    // the OTHER control, to prove the two are not being confused
    clearAllPresent: [...m.querySelectorAll('*')].some(e => /^clear all$/i.test(txt(e)) && e.children.length === 0),
  };
});
const out = {};
await P.openPalette(b.page, 'key');
await b.page.waitForTimeout(2500);
out.beforeTyping = await state();
console.log('nothing typed :', JSON.stringify(out.beforeTyping));
await P.type(b.page, 'Bridgeport', 3600);
out.afterTyping = await state();
console.log('after typing  :', JSON.stringify(out.afterTyping));
await b.page.screenshot({ path: 'enter-defect/clear-shown.png' });
const clicked = await b.page.evaluate(() => {
  const c = document.querySelector('.search-modal .search-modal__clear');
  if (!c) return false; c.click(); return true;
});
await b.page.waitForTimeout(2500);
out.afterClicking = await state();
out.clicked = clicked;
console.log('after clicking:', JSON.stringify(out.afterClicking));
// can you carry straight on typing without clicking back in?
await b.page.keyboard.type('Kestrel', { delay: 45 });
await b.page.waitForTimeout(3000);
out.typedAgain = (await state()).value;
console.log('typed straight on ->', JSON.stringify(out.typedAgain));
fs.writeFileSync('clear-control.json', JSON.stringify(out, null, 1));
await b.browser.close();
