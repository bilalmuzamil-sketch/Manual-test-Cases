// Build the limited role for the permission checks: the Admin template with Pick parts, Order parts
// and See Financial Data turned OFF. Built from Admin so it keeps App Settings - without that I could
// not put myself back afterwards.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { createRole } from './lib-role.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const { browser, page, ctx, APIH } = await bootProdLogin('/administration/roles-permissions', { settle: 13000 });
page.setDefaultTimeout(25000);
const before = (await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions || [];
console.log('I currently hold', before.length, 'permissions');
const r = await createRole(page, 'ZZAUTOTEST No Parts Perms', {
  'Pick parts': false, 'Order parts': false, 'See financial data': false, 'See Financial Data': false });
console.log(JSON.stringify(r, null, 1));
await page.goto('https://app.shopview.com/administration/roles-permissions', {waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const t = await page.evaluate(()=>document.body.innerText);
console.log('the new role is on the list:', t.includes('ZZAUTOTEST No Parts Perms'));
fs.writeFileSync(`${EV}/roles-after-limited.txt`, t);
await page.screenshot({ path: `${EV}/roles-after-limited.png`, fullPage: true });
await browser.close();
