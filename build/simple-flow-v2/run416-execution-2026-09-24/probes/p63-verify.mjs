import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 13000 });
const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('permissions:', (j?.data?.fe_permissions||[]).length);
const t = await page.evaluate(()=>document.body.innerText);
console.log('work orders page loads:', t.includes('Work Orders'), '| settings group in the sidebar:', t.includes('Settings'));
for (const f of ['Admin','ZZAUTOTEST Receive Later']) {
  await page.goto('https://app.shopview.com/administration/staff?roles='+encodeURIComponent(f), {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const x = await page.evaluate(()=>document.body.innerText);
  console.log(`under "${f}": my row present =`, x.includes('bilal.muzamil@shopview.com'));
}
await browser.close();
