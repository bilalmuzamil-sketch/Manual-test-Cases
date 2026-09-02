// READ-ONLY. C45097 / C45098: does a work order with no customer, or no asset, EXIST?
//
// TWO CORRECTIONS BAKED IN, both from mistakes made minutes ago on this very question:
//  (1) the list lives under data.work_orders, NOT data.collection. Reading the wrong key returned
//      an empty array and would have "proved" zero records.
//  (3) plain ?page= and ?limit= are SILENTLY IGNORED - the real params are pagination[page] and
//      pagination[rowsPerPage]. A wrong param name returns page 1 with HTTP 200 and no error, so a
//      loop over ?page= re-reads the same 100 records for ever and calls it the whole population.
//  (2) the customer field is `companyName` and the asset is `vehicleMakeName`/`vehicleModelName`,
//      NOT `customer`/`asset`. Probing a field that does not exist returned undefined for every
//      record and would have "proved" that ALL 100 lack a customer.
// So: enumerate the real field names first, then count. Never count a field you have not confirmed.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status,json:j};
}, API+path);

const blank = v => v===null || v===undefined || (typeof v==='string' && v.trim()==='');
const all=new Map();
for (let page=1; page<=60; page++) {
  const r = await get(`/api/work-orders?pagination[page]=${page}&pagination[rowsPerPage]=500`);
  const wos = r.json?.data?.work_orders;
  if (!Array.isArray(wos) || !wos.length) break;
  const before = all.size;
  for (const w of wos) all.set(w.id, w);
  if (all.size === before) break;            // the endpoint ignored the page param -> stop
  if (wos.length < 500) break;
}
const list=[...all.values()];
const FIELDS = list.length ? Object.keys(list[0]) : [];
console.log('work orders read:', list.length);
console.log('customer field present in the payload?', FIELDS.includes('companyName'));
console.log('asset fields present?', ['vehicleMakeName','vehicleModelName','vin','unit','licencePlate'].filter(f=>FIELDS.includes(f)).join(', '));

const noCust  = list.filter(w => blank(w.companyName));
const noAsset = list.filter(w => blank(w.vehicleMakeName) && blank(w.vehicleModelName)
                                && blank(w.vin) && blank(w.unit) && blank(w.licencePlate));
console.log('\nWITH NO CUSTOMER:', noCust.length, noCust.slice(0,8).map(w=>`${w.number} (${w.status})`));
console.log('WITH NO ASSET   :', noAsset.length, noAsset.slice(0,8).map(w=>`${w.number} (${w.status})`));
const sparse = list.filter(w => !blank(w.vehicleMakeName)+ !blank(w.vehicleModelName) + !blank(w.vin) < 2);
console.log('asset present but SPARSE (fewer than 2 of make/model/vin):', sparse.length,
            sparse.slice(0,5).map(w=>`${w.number} make=${w.vehicleMakeName||'-'} model=${w.vehicleModelName||'-'} vin=${w.vin||'-'}`));
fs.writeFileSync('build/probe-2026-09-02/wo-scan.json', JSON.stringify({
  read:list.length, fields:FIELDS,
  noCustomer:noCust.map(w=>({number:w.number,status:w.status})),
  noAsset:noAsset.map(w=>({number:w.number,status:w.status,make:w.vehicleMakeName,model:w.vehicleModelName,vin:w.vin,unit:w.unit,plate:w.licencePlate})),
}, null, 1));
await b.close();
