// One job only: move my account between roles. Kept short so it never runs into a timeout mid-switch.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setMyRole } from '../seed/lib-role.mjs';
const from = process.argv[2], to = process.argv[3];
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
console.log('before:', await perms());
console.log(await setMyRole(page, from, to));
await page.waitForTimeout(4000);
console.log('after:', await perms());
await browser.close();
