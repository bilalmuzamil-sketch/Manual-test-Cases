// C45154 settled. The recent list is now known to be stable across repeated reads (three identical
// reads with nothing done between them), so a change after selecting the record IS attributable.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const b = await P.openStaging('/customers', 'admin');
const recents = async () => {
  await P.openPalette(b.page, 'click'); await b.page.waitForTimeout(1200);
  // reopening keeps the PREVIOUS query in the box, so without clearing this reads the leftover
  // results and calls them the recent list - which is what made the first comparison meaningless
  await b.page.evaluate(() => { const i = document.querySelector('.search-modal input'); if (i && i.value) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
  await b.page.waitForTimeout(3500);
  const r = await b.page.evaluate(() => [...document.querySelectorAll('.search-row')].map(x => (x.innerText || '').replace(/\s+/g, ' ').slice(0, 40)));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(900);
  return r;
};
const CUST = 'https://app.staging.shopview.com/customers/3d760beb-ee5e-4cfe-8fe5-9250ca5c4dc7/work-orders';
await b.page.goto(CUST, { waitUntil: 'domcontentloaded' }); await b.page.waitForTimeout(9000);
const out = { onPage: CUST };
out.before = await recents();
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST Bridgeport Hauling', 3800);
const u0 = b.page.url();
out.clicked = await b.page.evaluate(() => {
  const g = [...document.querySelectorAll('.search-group')].find(x => /^Customers/.test(((x.querySelector('.search-group__header') || {}).innerText || '').trim()));
  const r = g && [...g.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('Bridgeport Hauling'));
  if (!r) return null; const t = (r.innerText || '').replace(/\s+/g, ' ').slice(0, 50); r.click(); return t;
});
await b.page.waitForTimeout(8000);
out.navigated = b.page.url() !== u0;
out.urlAfter = b.page.url();
out.after = await recents();
out.recentsUnchanged = JSON.stringify(out.before) === JSON.stringify(out.after);
console.log('clicked:', out.clicked);
console.log('navigated:', out.navigated, '| url:', out.urlAfter.replace('https://app.staging.shopview.com', ''));
console.log('recents unchanged:', out.recentsUnchanged);
console.log('   before:', out.before.slice(0, 3).join(' ;; '));
console.log('   after :', out.after.slice(0, 3).join(' ;; '));
fs.writeFileSync('sweep-v1i.json', JSON.stringify(out, null, 1));
await b.browser.close();
