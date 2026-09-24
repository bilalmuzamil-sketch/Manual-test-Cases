import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page } = await bootProdLogin('/settings', { settle: 20000 });
await page.waitForTimeout(8000);
console.log('URL:', page.url());
const t = await page.evaluate(()=>document.body.innerText);
console.log('=== FULL TEXT (%d chars) ===', t.length);
console.log(t.slice(0,3000));
await page.screenshot({path:'/tmp/sfv2/settings-attempt.png'});
await browser.close();
