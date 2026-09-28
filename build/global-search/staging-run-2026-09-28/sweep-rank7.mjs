// C44853 and C44854, third attempt, driven off the structure recorded by explore-ui.mjs:
//   - the customer is opened from the palette's CUSTOMERS group (the earlier version matched the
//     first row containing the name, which was one of that customer's work orders);
//   - the work order's Parts tab is a `.q-tab__label` inside the page (the earlier version clicked
//     the left-hand navigation's "Parts" department and left the work order entirely).
// Each step proves it arrived before anything is measured.
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

// --- C44853 ---------------------------------------------------------------
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST Fibridge Logistics', 3600);
await clickTab(b.page, 'Customers');           // the CUSTOMERS tab, so only customer rows are on screen
const clicked = await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('Fibridge Logistics'));
  if (!r) return null; const t = (r.innerText || '').replace(/\s+/g, ' ').slice(0, 70); r.click(); return t;
});
await b.page.waitForTimeout(9000);
out.customerUrl = b.page.url();
out.onCustomer = /\/customers\/[0-9a-f-]{8,}/.test(out.customerUrl);   // a DETAIL url, not the list
console.log('C44853 clicked:', clicked, '\n   url:', out.customerUrl, '| on a customer DETAIL page:', out.onCustomer);
if (out.onCustomer) {
  out.C44853 = { url: out.customerUrl,
    here: { wo: await look(b.page, 'Fibridge', 'Work orders'), assets: await look(b.page, 'Fibridge', 'Assets') } };
  await b.page.goto('https://app.staging.shopview.com/parts/inventory', { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(7000);
  out.C44853.awayUrl = b.page.url();
  out.C44853.away = { wo: await look(b.page, 'Fibridge', 'Work orders'), assets: await look(b.page, 'Fibridge', 'Assets') };
  const at = (a) => a.map((r, i) => [i + 1, r]).filter(([, r]) => r.includes('Fibridge Logistics')).map(([i]) => i);
  out.C44853.ownWoHere = at(out.C44853.here.wo); out.C44853.ownWoAway = at(out.C44853.away.wo);
  out.C44853.ownAsHere = at(out.C44853.here.assets); out.C44853.ownAsAway = at(out.C44853.away.assets);
  console.log('   its work orders  on its own page:', out.C44853.ownWoHere, ' from Inventory:', out.C44853.ownWoAway);
  console.log('   its assets       on its own page:', out.C44853.ownAsHere, ' from Inventory:', out.C44853.ownAsAway);
}

// --- C44854 ---------------------------------------------------------------
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-34138', 3400);
await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (r) r.click();
});
await b.page.waitForTimeout(9000);
const partsTab = await b.page.evaluate(() => {
  const l = [...document.querySelectorAll('.q-tab__label')].find(e => (e.innerText || '').trim() === 'Parts');
  if (!l) return null; (l.closest('.q-tab') || l).click(); return true;
});
await b.page.waitForTimeout(7000);
out.C44854 = { url: b.page.url(), partsTab,
  onWoParts: /\/workorders\/[0-9a-f-]{8,}\/parts/.test(b.page.url()),
  partsOnWo: await b.page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 1500)) };
console.log('C44854 url:', out.C44854.url, '| on the work order\'s Parts tab:', out.C44854.onWoParts);
if (out.C44854.onWoParts) {
  out.C44854.fromWo = await look(b.page, 'ZZT-FIB', 'Parts');
  console.log('   parts listed ON the work order:', out.C44854.partsOnWo.slice(300, 900));
  console.log('   palette, searched FROM the work order:');
  out.C44854.fromWo.forEach((r, i) => console.log(`      ${i + 1}. ${r}`));
}
fs.writeFileSync('sweep-rank7.json', JSON.stringify(out, null, 1));
await b.browser.close();
