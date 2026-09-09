import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// open a WO by clicking the Customer cell text of the first In-Progress row (has content)
await page.getByText('4 Star Truck Repair').first().click().catch(()=>{});
await page.waitForTimeout(6000);
console.log('URL after open:', page.url());
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(4000);
// expand the first line (click its row) to reveal per-line controls
await page.evaluate(()=>{const r=document.querySelector('.line-row,.q-expansion-item,[class*=line]');if(r)r.click();});
await page.waitForTimeout(2500);
const btns=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,a,[role=button],.q-item')].map(lab).filter(t=>t&&t.length<32&&/add|part/i.test(t)))];}, lab);
console.log('ADD/PART CONTROLS:', JSON.stringify(btns));
await page.screenshot({path:OUT+'/wo-lines-expanded-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
