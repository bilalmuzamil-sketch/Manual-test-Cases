/**
 * ANCHORS: real records from the environment under test, which the behaviour specs build their
 * queries from. A findability check needs "a name that exists", "a VIN that exists", "a part number
 * that exists" - not a literal I invented, which is how the suite ended up asking production about
 * staging's data.
 *
 * Writes anchors.json next to the environment's entity-config, so a spec reads one file and works
 * anywhere.
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT = process.env.ANCHOR_OUT || '/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/cfg/';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);

const a = await page.evaluate(async () => {
  const get = async p => { const x = await fetch('https://api.shopview.com'+p, {credentials:'include'});
    return (await x.json().catch(()=>null)); };
  const coll = o => o?.data?.collection || o?.collection || o?.data?.partSales || [];
  const cust = coll(await get('/api/customers?limit=40'));
  const veh  = coll(await get('/api/vehicles?limit=40'));
  const part = coll(await get('/api/inventory/parts?limit=40'));
  const po   = coll(await get('/api/inventory/orders?limit=20'));
  const ps   = coll(await get('/api/part-sales?limit=20'));
  const vi   = coll(await get('/api/inventory/deliveries?limit=20'));
  // pick values that are LONG enough to damage and still clear the spec's similarity threshold
  const longest = (rows, key) => rows.map(r=>r?.[key]).filter(v=>typeof v==='string'&&v.length>=7)
    .sort((x,y)=>y.length-x.length)[0] || null;
  const any = (rows, key) => rows.map(r=>r?.[key]).filter(Boolean)[0] ?? null;
  return {
    customerName : longest(cust,'name'),
    customerCity : any(cust,'city'),
    customerPost : any(cust,'postal_code'),
    // 🔴 FIELD NAMES READ OFF THE RECORD, NOT GUESSED. A vehicle's make is `vehicle_make`, its
    // unit is `unit` (not unit_number), and a part's description is `name` (not description).
    // Guessing produced three nulls on the first harvest and would have silently given the specs
    // nothing to search for.
    assetMake    : longest(veh,'vehicle_make')  || any(veh,'vehicle_make'),
    assetModel   : longest(veh,'vehicle_model') || any(veh,'vehicle_model'),
    assetVin     : any(veh,'vin'),
    assetUnit    : any(veh,'unit'),
    assetPlate   : any(veh,'licence_plate'),
    partDesc     : longest(part,'name'),
    partTags     : any(part,'tags'),
    partCategory : any(part,'category_label') || any(part,'category'),
    partVendor   : longest(part,'vendor_name'),
    partManuf    : longest(part,'manufacturer_name'),
    partNumber   : any(part,'part_number'),
    poNumber     : any(po,'number') || any(po,'order_number'),
    partSaleNo   : any(ps,'number'),
    invoiceNo    : any(vi,'invoice_number'),
    vendorName   : longest(vi,'vendor_name') || any(vi,'vendor_name'),
    counts: {customers:cust.length, vehicles:veh.length, parts:part.length,
             purchaseOrders:po.length, partSales:ps.length, vendorInvoices:vi.length},
  };
});
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(OUT+'anchors.json', JSON.stringify(a,null,1));
for (const [k,v] of Object.entries(a)) if(k!=='counts') console.log(`  ${k.padEnd(14)} ${JSON.stringify(v)}`);
console.log('  records seen:', JSON.stringify(a.counts));
await browser.close();
