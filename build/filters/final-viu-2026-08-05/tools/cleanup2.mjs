import * as H from './h.mjs';
const {browser,page}=await H.open({settle:15000});
const st=async()=>({url:page.url(),clearFilters:await page.evaluate(()=>!!document.querySelector('[data-test-id="clear_filters"]')),
  tab:await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,[role=tab]')].find(x=>x.getAttribute('aria-selected')==='true'||x.className.includes('active'));return t?t.innerText.trim():null;}),
  rows:(await H.rows(page)).n});
for(let pass=1;pass<=4;pass++){
  await page.goto('https://sv8785.qa.shopview.com/workorders',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const s=await st();
  console.log(`pass ${pass} on load:`, JSON.stringify(s));
  if(!s.clearFilters && !/company_id|status=|search=/.test(s.url)) { console.log('  already clean'); break; }
  const cf=page.locator('[data-test-id="clear_filters"]');
  if(await cf.count()){ await cf.first().click({timeout:15000}); await page.waitForTimeout(5000); }
  // put the tab back to All so the saved tab is not a surprise
  const all=page.locator('.q-tab,[role=tab]').filter({hasText:/^All$/}).first();
  if(await all.count()){ await all.click({timeout:12000}).catch(()=>{}); await page.waitForTimeout(4500); }
  console.log('  after clearing:', JSON.stringify(await st()));
}
await page.goto('https://sv8785.qa.shopview.com/workorders',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
const fin=await st();
console.log('FINAL after a fresh load:', JSON.stringify(fin));
console.log('CLEAN?', !fin.clearFilters && !/company_id|status=|search=/.test(fin.url));
await H.shot(page,'cleanup-proven');
await browser.close();
