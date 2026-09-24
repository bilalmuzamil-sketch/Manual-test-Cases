// Safety check: the role-switch probe was killed by its timeout. Make sure my account is back on Admin.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/staff?roles=Admin', { settle: 13000 });
page.setDefaultTimeout(25000);
const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('permissions I hold now:', (j?.data?.fe_permissions||[]).length);
const t = await page.evaluate(()=>document.body.innerText);
console.log('my row shows under the Admin filter:', t.includes('bilal.muzamil@shopview.com'));
await page.goto('https://app.shopview.com/administration/staff?roles=' + encodeURIComponent('ZZAUTOTEST Receive Later'), {waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const t2 = await page.evaluate(()=>document.body.innerText);
console.log('my row shows under the test role filter:', t2.includes('bilal.muzamil@shopview.com'));
await browser.close();
