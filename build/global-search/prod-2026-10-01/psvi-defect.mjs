/**
 * Production HAS part sales and vendor invoices - the API returns them to this very account - yet
 * global search shows 0 on both tabs for every term tried. If a record that exists and is readable
 * cannot be found by searching its own number, that is a defect, and seeding would have been
 * entirely the wrong fix.
 *
 * Rule 104: take the identifier FROM the record, then search THAT. A term I invent proves nothing.
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);

const recs = await page.evaluate(async () => {
  const get=async p=>{const x=await fetch('https://api.shopview.com'+p,{credentials:'include'});
    return (await x.json().catch(()=>null))?.data||null; };
  const ps=await get('/api/part-sales?limit=5');
  const vi=await get('/api/inventory/deliveries?limit=5');
  const pick=(o,keys)=>Object.fromEntries(keys.filter(k=>o&&o[k]!=null).map(k=>[k,o[k]]));
  return {
    partSales:(ps?.partSales||[]).slice(0,3).map(r=>pick(r,['number','partSaleNumber','name','customerName','id','totalPrice'])),
    vendorInvoices:(vi?.collection||[]).slice(0,3).map(r=>pick(r,['invoice_number','vendor_name','id','total'])),
  };
});
console.log('part sales on production:', JSON.stringify(recs.partSales));
console.log('vendor invoices on production:', JSON.stringify(recs.vendorInvoices));

async function q(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1000);
  await page.fill('.search-modal input',''); await page.waitForTimeout(220);
  await page.type('.search-modal input', String(term), {delay:28}); await page.waitForTimeout(3300);
  const tabs=await page.evaluate(()=>[...document.querySelectorAll('.search-tabs__tab')]
    .map(e=>e.innerText.replace(/\s+/g,' ').trim()));
  const rows=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,3)
    .map(r=>r.innerText.replace(/\s*\n\s*/g,' | ').slice(0,90)));
  console.log(`  searched ${JSON.stringify(String(term))} (${tab})`);
  console.log(`     tabs: ${tabs.filter(t=>/Part sales|Vendor invoices/.test(t)).join('  ')}`);
  console.log(`     rows: ${rows.length?rows[0]:'NONE'}`);
  return rows.length;
}
console.log('--- searching values taken FROM the records themselves ---');
for (const r of recs.partSales) for (const v of Object.values(r).filter(v=>typeof v==='string'&&v.length>3&&v.length<40)) await q(v,'Part sales');
for (const r of recs.vendorInvoices) for (const v of Object.values(r).filter(v=>typeof v==='string'&&v.length>3&&v.length<40)) await q(v,'Vendor invoices');
fs.writeFileSync(OUT+'psvi-records.json', JSON.stringify(recs,null,1));
console.log('PSVI CHECK DONE');
await browser.close();
