// Don't guess the customer-list query shape - capture the one the Customers screen itself fires,
// and print the first row's keys so the balance field is read, not assumed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const seen=[];
page.on('response', async r=>{ const u=r.url(); if(!u.includes(APIH)) return;
  if(!/customer/i.test(u)) return; let b=null; try{b=await r.json();}catch{}
  seen.push({url:u.replace(`https://${APIH}`,''), status:r.status(), b}); });
await page.goto(`${APP}/customers`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
for (const s of seen) {
  const top = s.b && typeof s.b==='object' ? Object.keys(s.b) : null;
  const coll = s.b?.response?.collection || s.b?.collection;
  console.log(s.status, s.url.slice(0,150));
  if (top) console.log('   top keys:', JSON.stringify(top));
  if (Array.isArray(coll)) console.log('   collection len', coll.length, 'row0 keys:', JSON.stringify(Object.keys(coll[0]||{})).slice(0,600));
  else if (s.b?.response) console.log('   response keys:', JSON.stringify(Object.keys(s.b.response)).slice(0,400));
}
await browser.close();
