import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
// multi-select status: estimate, approved, in_progress
await page.click('[data-test-id=filter_chip_status]'); await T(800);
for(const v of ['estimate','approved','in_progress']){ await page.click('[data-test-id=filter_option_status_'+v+']').catch(()=>{}); await T(500); }
await page.keyboard.press('Escape'); await T(1000);
console.log('MULTI_CHIP', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
console.log('MULTI_URL', page.url());
// hover to see X
await page.hover('[data-test-id=filter_chip_status]'); await T(500);
console.log('HAS_CLEAR_X', await page.evaluate(()=>!!document.querySelector('[data-test-id=filter_chip_clear_status]')));
// Imported greys out others (C38877): open status, tick Imported, see if others disabled
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
await page.click('[data-test-id=filter_chip_status]'); await T(800);
await page.click('[data-test-id=filter_option_status_imported]').catch(()=>{}); await T(1200);
const imp=await page.evaluate(()=>{
  const opts=[...document.querySelectorAll('[data-test-id^=filter_option_status_]')].map(e=>({v:e.getAttribute('data-test-id').replace('filter_option_status_',''),disabled:e.getAttribute('aria-disabled')==='true'||e.classList.contains('disabled')||e.classList.contains('q-checkbox--disable'),checked:e.getAttribute('aria-checked')}));
  return opts;
});
console.log('IMPORTED_STATE', JSON.stringify(imp));
// also assigned toggle: no arrow, url param
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
await page.click('[data-test-id=filter_chip_assigned_to_me]'); await T(1500);
console.log('ASSIGNED_URL', page.url());
console.log('ASSIGNED_CHIP', JSON.stringify(await page.textContent('[data-test-id=filter_chip_assigned_to_me]').catch(()=>null)));
// asset single select: choose Yes then No -> replaces
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
await page.click('[data-test-id=filter_chip_vehicleHere]'); await T(800);
const assetOpts=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_option]')].map(e=>e.getAttribute('data-test-id')));
console.log('ASSET_OPTS', JSON.stringify(assetOpts));
await browser.close();
