// C45153 each type opens the right page · C45154 selecting the record you are on · C53586/87 a new
// record is findable within 30 seconds · C53589 typing is never lost while results load.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
const b = await P.openStaging('/customers', 'admin');
const out = {};
async function openRow(q, contains) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, q, 3600);
  const before = b.page.url();
  const hit = await b.page.evaluate((c) => {
    const r = [...document.querySelectorAll('.search-row')]
      .find(e => (e.innerText || '').replace(/≈ close match:\s*/g, '').includes(c));
    if (!r) return null; const t = (r.innerText || '').replace(/\s+/g, ' ').slice(0, 60); r.click(); return t;
  }, contains);
  await b.page.waitForTimeout(8000);
  return { q, contains, row: hit, before, after: b.page.url(), navigated: b.page.url() !== before };
}
// C45153
out.C45153 = {};
for (const [type, q, c] of [
  ['Work order', 'S2-34367', 'S2-34367'],
  ['Customer', 'ZZAUTOTEST Bridgeport Hauling', 'Bridgeport Hauling'],
  ['Asset', 'ZZT-4471', 'ZZT-4471'],
  ['Stocked part', 'ZZT-88-4412', 'Brake Chamber Kestrel'],
  ['Vendor', 'ZZAUTOTEST Kestrel Parts Supply', 'Kestrel Parts Supply'],
  ['Part sale', 'P2-2248', 'P2-2248'],
  ['Purchase order', 'I2-1513', 'I2-1513'],
  ['Vendor invoice', 'ZZTINV-GSV2-1001', 'ZZTINV-GSV2-1001'],
]) {
  const r = await openRow(q, c);
  out.C45153[type] = r;
  console.log(`C45153 ${type.padEnd(15)} -> ${r.row ? '' : 'ROW NOT FOUND '}${r.after.replace('https://app.staging.shopview.com', '')}`);
  await b.page.waitForTimeout(800);
}
// C45154 - already on the customer's page, select it again
const cust = out.C45153.Customer.after;
await b.page.goto(cust, { waitUntil: 'domcontentloaded' }); await b.page.waitForTimeout(7000);
const again = await openRow('ZZAUTOTEST Bridgeport Hauling', 'Bridgeport Hauling');
out.C45154 = { onPage: cust, ...again };
console.log(`C45154 already on ${cust.replace('https://app.staging.shopview.com', '')} -> after selecting it again: ${again.after.replace('https://app.staging.shopview.com', '')} (navigated: ${again.navigated})`);

// C53586 / C53587 - create, then search without reloading
const stamp = Date.now();
out.created = await b.page.evaluate(async (st) => {
  const post = async (p, body) => {
    const r = await fetch('https://api.staging.shopview.com' + p, { method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json().catch(() => null) };
  };
  const cust = await post('/api/customers/create', { name: 'ZZAUTOTEST Halloway Freight ' + st,
    address: '1 Halloway Way', city: 'Fernvale', state_or_province: 'Ohio', postal_code: '44872-2001',
    phone: '(264) 400-0500', country_code: 'US' });
  return { cust, stamp: st };
}, stamp);
console.log('C53586 created customer ->', out.created.cust.status);
const t0 = Date.now();
let found = false, waited = 0;
for (let i = 0; i < 10 && !found; i++) {
  await P.openPalette(b.page, 'click');
  await P.type(b.page, 'Halloway ' + stamp, 2600);
  const s = await P.read(b.page);
  found = (s.rows || []).some(r => clean(r.text).includes('Halloway Freight ' + stamp));
  waited = Math.round((Date.now() - t0) / 1000);
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(500);
  if (!found) await b.page.waitForTimeout(2500);
}
out.C53586 = { found, seconds: waited };
console.log(`C53586 new customer findable: ${found} after about ${waited}s`);

// C53589 - type fast and check nothing is dropped
await P.openPalette(b.page, 'click');
await b.page.evaluate(() => { const i = document.querySelector('.search-modal input'); if (i) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } });
await b.page.type('.search-modal input', 'Bridgeport Hauling', { delay: 15 });
const mid = await b.page.evaluate(() => (document.querySelector('.search-modal input') || {}).value);
await b.page.waitForTimeout(4000);
const end = await b.page.evaluate(() => (document.querySelector('.search-modal input') || {}).value);
out.C53589 = { typed: 'Bridgeport Hauling', immediately: mid, afterResults: end,
               kept: mid === 'Bridgeport Hauling' && end === 'Bridgeport Hauling' };
console.log('C53589 typed fast ->', JSON.stringify(out.C53589));
fs.writeFileSync('sweep-v1e.json', JSON.stringify(out, null, 1));
await b.browser.close();
