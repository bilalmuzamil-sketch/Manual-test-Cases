// C44854 re-measured against the 21 September method. That reading compared the work order page
// with the CUSTOMERS page; mine compared it with /parts/inventory - which is itself a parts screen
// and so may not be neutral at all. Same query and same three parts as 21 September, alternating
// pages twice, so a difference has to survive repetition.
import fs from 'fs';
const P = await import('/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs');
const clean = s => (s || '').replace(/≈ close match:\s*/g, '').replace(/\s+/g, ' ');
async function clickTab(page, name) {
  const got = await page.evaluate((n) => {
    const t = [...document.querySelectorAll('.search-tabs__tab')].find(e => (e.innerText || '').trim().toLowerCase().startsWith(n.toLowerCase()));
    if (!t) return null; t.click(); return (t.innerText || '').trim();
  }, name);
  if (got) await page.waitForTimeout(1600); return got;
}
const b = await P.openStaging('/customers', 'admin');
const WO = 'https://app.staging.shopview.com/workorders/8f8f9e6f-cd93-4f1d-a41d-c0f32ef1820c/part-requests';
const NEUTRAL = 'https://app.staging.shopview.com/customers';
const INVENTORY = 'https://app.staging.shopview.com/parts/inventory';
async function read(url, label) {
  await b.page.goto(url, { waitUntil: 'domcontentloaded' });
  await b.page.waitForTimeout(7000);
  await P.openPalette(b.page, 'click');
  await b.page.mouse.move(5, 5);                       // keep the pointer off the rows (L0233)
  await P.type(b.page, 'ZZAUTOTEST Fibridge', 4000);
  await clickTab(b.page, 'Parts');
  const s = await P.read(b.page);
  const rows = (s.rows || []).map(r => clean(r.text).slice(0, 62));
  await b.page.keyboard.press('Escape'); await b.page.waitForTimeout(800);
  console.log(`${label.padEnd(26)} ${rows.map((r, i) => `${i + 1}. ${r.split(' ').slice(2, 5).join(' ')}`).join('   |   ')}`);
  return rows;
}
const out = { passes: [] };
for (let i = 1; i <= 2; i++) {
  out.passes.push({
    pass: i,
    customers: await read(NEUTRAL, `pass ${i} · Customers page`),
    workOrder: await read(WO, `pass ${i} · the work order`),
    inventory: await read(INVENTORY, `pass ${i} · Parts inventory`),
  });
}
const p1 = out.passes[0], p2 = out.passes[1];
const same = (a, b2) => JSON.stringify(a) === JSON.stringify(b2);
out.stable = same(p1.customers, p2.customers) && same(p1.workOrder, p2.workOrder);
out.changesWithPage = !same(p1.customers, p1.workOrder);
out.inventoryLooksLikeWorkOrder = same(p1.inventory, p1.workOrder);
out.inventoryLooksLikeCustomers = same(p1.inventory, p1.customers);
console.log(`\nboth passes agree: ${out.stable}`);
console.log(`THE ORDER CHANGES WITH WHERE YOU STAND: ${out.changesWithPage}`);
console.log(`the inventory page matches the work order reading: ${out.inventoryLooksLikeWorkOrder}`);
console.log(`the inventory page matches the customers reading : ${out.inventoryLooksLikeCustomers}`);
fs.writeFileSync('recheck-44854.json', JSON.stringify(out, null, 1));
await b.browser.close();
