/**
 * Rule 104 - prove the instrument before any negative claim.
 *
 * "Telephone search returns nothing on production" has an innocent explanation that must be ruled
 * out FIRST: the customer I created may simply not have the phone stored. The record is findable by
 * name and by postcode, so the record exists - but that says nothing about the phone field.
 *
 * So: read the phone back off the record itself, then search it several ways.
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);

// 1. read the record back from the API - is the phone actually stored?
const rec = await page.evaluate(async () => {
  const r = await fetch('https://api.shopview.com/api/customers?search=ZZPHONE', {credentials:'include'});
  const b = await r.json().catch(()=>null);
  const rows = b?.data || b?.customers || b || [];
  const hit = (Array.isArray(rows)?rows:[]).find(c=>/ZZPHONE/i.test(c.name||''));
  return hit ? {name:hit.name, phone:hit.phone, postal:hit.postal_code, city:hit.city, id:hit.id} : {none:true, sample:JSON.stringify(rows).slice(0,200)};
});
console.log('record as stored:', JSON.stringify(rec));

// 2. does an EXISTING production customer's phone match? positive control - if no phone matches
//    anywhere, the feature is off; if another one matches, mine is a data problem.
const control = await page.evaluate(async () => {
  const r = await fetch('https://api.shopview.com/api/customers?limit=25', {credentials:'include'});
  const b = await r.json().catch(()=>null);
  const rows = b?.data || b?.customers || b || [];
  const withPhone = (Array.isArray(rows)?rows:[]).filter(c=>c.phone && c.phone.replace(/\D/g,'').length>=10).slice(0,3);
  return withPhone.map(c=>({name:c.name, phone:c.phone}));
});
console.log('existing production customers with a phone:', JSON.stringify(control));

async function q(term){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1100);
  await page.fill('.search-modal input',''); await page.waitForTimeout(250);
  await page.type('.search-modal input', term, {delay:30}); await page.waitForTimeout(3400);
  const r=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,2)
    .map(x=>x.innerText.replace(/\s*\n\s*/g,' | ').slice(0,95)));
  console.log(`  ${JSON.stringify(term).padEnd(18)} -> ${r.length?r[0]:'NO ROWS'}`);
  return r.length;
}
console.log('--- my seeded record, several ways ---');
await q('609-461-6502'); await q('6094616502'); await q('(609) 461-6502'); await q('461-6502');
console.log('--- a PRE-EXISTING production customer (the positive control) ---');
for (const c of control) { await q(c.phone); await q(c.phone.replace(/\D/g,'')); }
console.log('PHONE VERIFY DONE');
await browser.close();
