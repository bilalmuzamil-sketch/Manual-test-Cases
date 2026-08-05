import * as H from './h.mjs';
const {browser,page}=await H.open({settle:15000});
await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(11000);
const before={url:page.url(),chips:(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|'))};
// clear filters
const cf=page.locator('[data-test-id="clear_filters"]');
if(await cf.count()){ await cf.first().click({timeout:15000}); await page.waitForTimeout(4500); }
// clear any page search
const stog=page.locator('[data-test-id="page_search_toggle"]');
if(await stog.count()){ await stog.first().click({timeout:12000}).catch(()=>{}); await page.waitForTimeout(1500);
  const inp=page.locator('[data-test-id="page_search_input"]').first();
  if(await inp.count()){ await inp.fill(''); await page.waitForTimeout(4000); } }
// make sure the filter bar is EXPANDED (we collapsed it during testing)
const chipsNow=await H.chips(page);
if(chipsNow.length===0){ await page.locator('[data-test-id="toggle_filter_bar"]').first().click({timeout:12000}).catch(()=>{}); await page.waitForTimeout(3500); }
await page.waitForTimeout(2000);
// prove it by RELOADING - persistence is server-side, so a fresh load is the real test
await page.goto('https://sv8785.qa.shopview.com/workorders',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
const after={url:page.url(),chips:(await H.chips(page)).map(c=>c.text.replace(/\n/g,'|')),
  rows:(await H.rows(page)).n,
  clearFilters:await page.evaluate(()=>!!document.querySelector('[data-test-id="clear_filters"]')),
  searchVal:await page.evaluate(()=>{const i=document.querySelector('[data-test-id=page_search_input]');return i?i.value:null;})};
console.log('BEFORE:',JSON.stringify(before));
console.log('AFTER RELOAD:',JSON.stringify(after));
console.log('CLEAN?  no active chip value:', after.chips.every(c=>!c.includes(':')),
            '| no Clear Filters shown:', !after.clearFilters,
            '| bar expanded:', after.chips.length>0,
            '| no search text:', !after.searchVal);
await H.shot(page,'cleanup-final');
await browser.close();
