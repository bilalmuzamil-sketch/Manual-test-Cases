import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
// baseline chip states
const base=await page.evaluate(()=>['filter_chip_assigned_to_me','filter_chip_vehicleHere'].map(id=>{const c=document.querySelector('[data-test-id='+id+']'); return {id,disabled:c?(c.disabled||c.getAttribute('aria-disabled')==='true'||/disabled|disable/.test(c.className)):null, op:c?getComputedStyle(c).opacity:null};}));
console.log('BASELINE', JSON.stringify(base));
// select Imported
await page.click('[data-test-id=filter_chip_status]'); await T(800);
await page.click('[data-test-id=filter_option_status_imported]'); await T(1000);
await page.keyboard.press('Escape'); await T(1200);
const after=await page.evaluate(()=>['filter_chip_assigned_to_me','filter_chip_vehicleHere'].map(id=>{const c=document.querySelector('[data-test-id='+id+']'); return {id,disabled:c?(c.disabled||c.getAttribute('aria-disabled')==='true'||/disabled|disable/.test(c.className)):null, op:c?getComputedStyle(c).opacity:null, pe:c?getComputedStyle(c).pointerEvents:null};}));
console.log('AFTER_IMPORTED', JSON.stringify(after));
console.log('URL', page.url());
await browser.close();
