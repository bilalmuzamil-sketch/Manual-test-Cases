// Safety first: what role am I in now, and if it is not Admin, put me back.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setMyRole } from '../seed/lib-role.mjs';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const perms = async () => { const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json(); return (j?.data?.fe_permissions||[]).length; };
console.log('permissions right now:', await perms());
for (const f of ['Admin','ZZAUTOTEST No Parts Perms','ZZAUTOTEST Receive Later']) {
  await page.goto('https://app.shopview.com/administration/staff?roles='+encodeURIComponent(f), {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const x = await page.evaluate(()=>document.body.innerText);
  const mine = x.includes('bilal.muzamil@shopview.com');
  console.log(`  under "${f}": my row present =`, mine);
  if (mine && f !== 'Admin') { console.log('  -> putting me back on Admin'); console.log('  ', await setMyRole(page, f, 'Admin')); }
}
console.log('permissions after:', await perms());
await browser.close();
