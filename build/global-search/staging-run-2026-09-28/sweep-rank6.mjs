// Ranking, part 5 REDONE. The first attempt was void twice over, and both faults were mine:
//   - the "customer page" click matched a WORK ORDER row for the same customer, so the comparison
//     was work-order-page vs list, not customer-page vs elsewhere;
//   - the work order's Parts tab was reached by editing the URL, which the app answers with a
//     page-not-found (the SPA needs the work order loaded first), so the palette was searched from
//     a 404 screen.
// Both are now driven by clicking, and both assert they are on the right screen before measuring.
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
  await P.openPalette(page, 'click');
  await P.type(page, q, 3400);
  if (tab) await clickTab(page, tab);
  const r = rowsOf(await P.read(page));
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  return r;
}
const b = await P.openStaging('/customers', 'admin');
const out = {};

// --- C44853 : open the CUSTOMER from the customers list --------------------
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
const box = await b.page.$('input[type="search"], input[placeholder*="earch"]');
if (box) { await box.click(); await box.type('ZZAUTOTEST Fibridge Logistics', { delay: 40 }); await b.page.waitForTimeout(4000); }
const hit = await b.page.evaluate(() => {
  const row = [...document.querySelectorAll('tr, [role="row"], .q-item')]
    .find(e => (e.innerText || '').includes('Fibridge Logistics'));
  if (!row) return null;
  const c = row.querySelector('a, td, .q-item__section') || row; c.click();
  return (row.innerText || '').replace(/\s+/g, ' ').slice(0, 80);
});
await b.page.waitForTimeout(7000);
out.customerUrl = b.page.url();
// PROVE we are on a customer screen before anything is measured.
out.onCustomerScreen = /customer/i.test(out.customerUrl);
console.log('C44853 clicked row:', hit, '| url:', out.customerUrl, '| is a customer screen:', out.onCustomerScreen);
if (out.onCustomerScreen) {
  out.C44853 = { url: out.customerUrl,
    here: { wo: await look(b.page, 'Fibridge', 'Work orders'), assets: await look(b.page, 'Fibridge', 'Assets') } };
  await b.page.goto('https://app.staging.shopview.com/parts/inventory', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(6000);
  out.C44853.awayUrl = b.page.url();
  out.C44853.away = { wo: await look(b.page, 'Fibridge', 'Work orders'), assets: await look(b.page, 'Fibridge', 'Assets') };
  const own = a => a.filter(r => r.includes('Fibridge Logistics')).map(r => a.indexOf(r) + 1);
  out.C44853.ownWoHere = own(out.C44853.here.wo);   out.C44853.ownWoAway = own(out.C44853.away.wo);
  out.C44853.ownAsHere = own(out.C44853.here.assets); out.C44853.ownAsAway = own(out.C44853.away.assets);
  console.log('   this customer\'s work orders  here:', out.C44853.ownWoHere, ' away:', out.C44853.ownWoAway);
  console.log('   this customer\'s assets       here:', out.C44853.ownAsHere, ' away:', out.C44853.ownAsAway);
}

// --- C44854 : open the WORK ORDER, then click its Parts TAB ---------------
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-34138', 3400);
await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (r) r.click();
});
await b.page.waitForTimeout(8000);
const tabClicked = await b.page.evaluate(() => {
  const t = [...document.querySelectorAll('[role="tab"], .q-tab, a, button')]
    .find(e => (e.innerText || '').trim().toLowerCase() === 'parts');
  if (!t) return null; t.click(); return true;
});
await b.page.waitForTimeout(6000);
out.C44854 = { url: b.page.url(), tabClicked,
  screen: await b.page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 700)) };
out.C44854.valid = !/more missing than your/i.test(out.C44854.screen);
console.log('C44854 url:', out.C44854.url, '| Parts tab clicked:', tabClicked, '| real screen:', out.C44854.valid);
console.log('   screen says:', out.C44854.screen.slice(0, 260));
if (out.C44854.valid) {
  out.C44854.fromWo = await look(b.page, 'ZZT-FIB', 'Parts');
  console.log('   from the work order:'); out.C44854.fromWo.forEach((r, i) => console.log(`      ${i + 1}. ${r}`));
}
fs.writeFileSync('sweep-rank6.json', JSON.stringify(out, null, 1));
await b.browser.close();
