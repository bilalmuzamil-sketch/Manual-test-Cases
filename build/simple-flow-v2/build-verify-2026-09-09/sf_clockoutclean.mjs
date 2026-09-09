import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(6000);
// if a timer is running, stop it and clock out (cleanup)
const running=await page.evaluate(()=>/stop_circle|Clock Out/i.test(document.body.innerText));
console.log('timer indicator present:', running);
// click the running-timer chip / Clock In area to stop
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button],.q-chip')].find(e=>/stop_circle|\d\d:\d\d:\d\d/.test(e.textContent||''));if(b)b.click();});
await page.waitForTimeout(2500);
await page.locator('button:has-text("Clock out"),.q-btn:has-text("Clock out")').first().click().catch(()=>{});
await page.waitForTimeout(2000);
console.log('cleanup attempted');
await browser.close();
