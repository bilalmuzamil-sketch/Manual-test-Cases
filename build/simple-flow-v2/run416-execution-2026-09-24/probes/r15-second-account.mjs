// Use the SECOND production account for the lower-permission work, instead of changing my own role.
// First: does it log in, is it a staff member of this shop, and what role is it in?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
// NOTE: PROD_ENVF must be set on the command line - an assignment here runs AFTER the import,
// because module imports are evaluated first, and the helper reads the variable at load time.
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 12000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const me = await (await ctx.request.get(`https://${APIH}/api/iam/view-profile/`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('signed in as:', me.user?.first_name, me.user?.last_name, '|', me.user?.email);
console.log('workplaces:', (me.user?.enrollments||[]).map(e=>e.workplace_name).join(', ').slice(0,200));
const perms = ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('permissions held:', perms.length);
console.log('  pick parts:', perms.includes('woPickParts'), '| order parts:', perms.includes('woOrderParts'), '| financial:', perms.includes('seeFinancialData'), '| lines create/edit:', perms.includes('workOrderLinesCreateAndEdit'));
fs.writeFileSync(`${EV}/second-account-perms.json`, JSON.stringify(perms,null,1));
const t = await page.evaluate(()=>document.body.innerText);
console.log('shop shown top right:', (t.match(/Trucks Hill 2|Truck Hill 1|Inventory \d|Import Test|QA [A-Za-z]+/g)||[]).slice(0,3));
await page.screenshot({ path: `${EV}/second-account.png` });
await browser.close();
