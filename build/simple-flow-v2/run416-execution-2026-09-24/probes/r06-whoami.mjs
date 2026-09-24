import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 12000 });
const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('permissions:', (j?.data?.fe_permissions||[]).length);
await page.goto('https://app.shopview.com/administration/staff?roles=Admin',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
console.log('my row under Admin:', (await page.evaluate(()=>document.body.innerText)).includes('bilal.muzamil@shopview.com'));
await browser.close();
