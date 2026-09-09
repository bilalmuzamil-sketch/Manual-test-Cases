import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
// open first WO
await page.locator('table tbody tr').first().locator('td').nth(1).click().catch(()=>{});
await page.waitForTimeout(6000);
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{});
await page.waitForTimeout(4000);
// dump all buttons that mention "part"
const btns=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,a,[role=button]')].map(lab).filter(t=>/part/i.test(t)&&t.length<40))];}, lab);
console.log('BUTTONS w/ "part":', JSON.stringify(btns));
await page.screenshot({path:OUT+'/wo-line-addpart-sv8683.png',fullPage:true}).catch(()=>{});
await browser.close();
