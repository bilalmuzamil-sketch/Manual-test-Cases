// Closing the last hole in C55716: does my write actually bump the record's updated timestamp?
// If it does not, the tie-break was never exercised and the finding is MY fault, not the product's.
import { open } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/customers','admin');
await page.waitForTimeout(3000);
const req=(m,u,b)=>page.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return{s:r.status,t:t.slice(0,200),j}},[m,API+u,b]);
const list=async()=> (await req('GET','/api/customers?pagination[rowsPerPage]=10&search=ZZTIEBREAK')).j?.data?.collection||[];
const stamp=(c)=>JSON.stringify({updated_at:c.updated_at, updatedAt:c.updatedAt, modified:c.modified_at, changed:c.changed_at});
let c=await list();
const One=c.find(x=>/Transport One/i.test(x.name)), Two=c.find(x=>/Transport Two/i.test(x.name));
console.log('keys on the record:', Object.keys(One).join(', '));
console.log('BEFORE  One:', stamp(One));
console.log('BEFORE  Two:', stamp(Two));
const v=await req('GET','/api/customers/view/'+One.id);
console.log('view One keys:', Object.keys(v.j?.data?.company||{}).join(', '));
console.log('view One stamp:', stamp(v.j?.data?.company||{}));
console.log('\ntouching One ->', (await req('POST','/api/customers/change', {...One, company_id:One.id, id:One.id, notes:'stampcheck-'+Date.now()})).s);
await page.waitForTimeout(6000);
const v2=await req('GET','/api/customers/view/'+One.id);
console.log('view One stamp AFTER :', stamp(v2.j?.data?.company||{}));
c=await list();
console.log('AFTER   One:', stamp(c.find(x=>/Transport One/i.test(x.name))));
console.log('AFTER   Two:', stamp(c.find(x=>/Transport Two/i.test(x.name))));
await browser.close();
