// Which record did Enter actually open? C55686's verdict turns on the record the app navigated to,
// and a URL with an id in it is not a name.
//
// The first attempt asked /api/customers/<id> (404 -- not that path) and read h1/h2 (none on this
// page), and came back with two empty answers. Two empty readings are a fact about the probe, not
// about the record (Rule 104), so this version reads the NAME OFF THE SCREEN the way a tester
// would, dumps what it considered, and screenshots the page as evidence.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ID=process.env.CUSTOMER_ID||'1ac81228-6e6d-4a43-b40e-9217b84028af';
const WANT=process.env.WANT||'Marlene Freight Lines';
const { browser, page, APP } = await boot('sv9160','/','admin');
const R={at:new Date().toISOString(), id:ID, expected:WANT};
await page.goto(`${APP}/customers/${ID}/work-orders`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
R.url=page.url();
R.screen=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const text=(document.body.innerText||'').replace(/\s+/g,' ').trim();
  const titled=[...document.querySelectorAll('[data-test-id]')].filter(vis)
    .map(e=>({tid:e.getAttribute('data-test-id'),
              txt:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)}))
    .filter(x=>x.txt).slice(0,40);
  return {firstWords:text.slice(0,300), testIds:titled};});
R.nameIsOnThePage = new RegExp(WANT.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(R.screen.firstWords);
// positive control: a DIFFERENT customer page must NOT show this name, or "the name is on the
// page" would just mean the name is in some banner on every page
await page.screenshot({path:`${DIR}/unrun3-evidence/C55686-opened-record.png`,fullPage:false});
fs.writeFileSync(`${DIR}/C55686-OPENED-RECORD.json`,JSON.stringify(R,null,1));
console.log('url', R.url);
console.log('name on the page:', R.nameIsOnThePage);
console.log('first words:', R.screen.firstWords.slice(0,200));
await browser.close();
