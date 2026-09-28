// Ranking, part 5 - the two CONTEXT cases, which need a real page open behind the palette.
//  C44853  from a customer's own page, that customer's assets and work orders should rank higher
//          than they do from an unrelated page. Same query both times; only the page differs.
//  C44854  from a work order's page, parts already ON that work order should be pushed down.
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

// --- C44853 -----------------------------------------------------------------
// Reach the customer page the way a tester does: from the palette, by name.
await P.openPalette(b.page, 'click');
await P.type(b.page, 'ZZAUTOTEST Fibridge Logistics', 3400);
const opened = await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('Fibridge Logistics'));
  if (!r) return false; r.click(); return true;
});
await b.page.waitForTimeout(7000);
out.customerUrl = b.page.url();
console.log('customer page:', out.customerUrl, '| opened =', opened);
out.C44853 = { url: out.customerUrl,
  onCustomerPage: { wo: await look(b.page, 'Fibridge', 'Work orders'),
                    assets: await look(b.page, 'Fibridge', 'Assets') } };
await b.page.goto('https://app.staging.shopview.com/workorders', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
out.C44853.elsewhereUrl = b.page.url();
out.C44853.elsewhere = { wo: await look(b.page, 'Fibridge', 'Work orders'),
                         assets: await look(b.page, 'Fibridge', 'Assets') };
const first = a => (a[0] || '').slice(0, 60);
console.log('C44853 work orders  on customer page:', first(out.C44853.onCustomerPage.wo));
console.log('C44853 work orders  from /workorders :', first(out.C44853.elsewhere.wo));
console.log('C44853 assets       on customer page:', first(out.C44853.onCustomerPage.assets));
console.log('C44853 assets       from /workorders :', first(out.C44853.elsewhere.assets));

// --- C44854 -----------------------------------------------------------------
await P.openPalette(b.page, 'click');
await P.type(b.page, 'S2-34138', 3400);
const openedWo = await b.page.evaluate(() => {
  const r = [...document.querySelectorAll('.search-row')].find(e => (e.innerText || '').includes('S2-34138'));
  if (!r) return false; r.click(); return true;
});
await b.page.waitForTimeout(7000);
out.woUrl = b.page.url();
// what parts are actually on it?
await b.page.goto(out.woUrl.replace(/\/lines.*$/, '/parts'), { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
out.C44854 = { woUrl: out.woUrl, partsUrl: b.page.url(),
  partsOnWo: await b.page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 1200)) };
out.C44854.fromWoPage = await look(b.page, 'ZZT-FIB', 'Parts');
await b.page.goto('https://app.staging.shopview.com/customers', { waitUntil: 'domcontentloaded' });
await b.page.waitForTimeout(6000);
out.C44854.fromElsewhere = await look(b.page, 'ZZT-FIB', 'Parts');
console.log('C44854 parts page:', out.C44854.partsUrl);
console.log('  from the work order page:'); out.C44854.fromWoPage.forEach((r, i) => console.log(`     ${i + 1}. ${r}`));
console.log('  from an unrelated page  :'); out.C44854.fromElsewhere.forEach((r, i) => console.log(`     ${i + 1}. ${r}`));
fs.writeFileSync('sweep-rank5.json', JSON.stringify(out, null, 1));
await b.browser.close();
