// Which shops is this person actually enrolled in, and which are they in right now?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 11000 });
const me = await (await ctx.request.get(`https://${APIH}/api/iam/view-profile/`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('email:', me.user?.email, '| name:', me.user?.first_name, me.user?.last_name, '| job:', me.user?.job_title);
console.log('enrolments:', JSON.stringify((me.user?.enrollments||[]).map(e=>e.workplace_name)));
const wps = await (await ctx.request.get(`https://${APIH}/api/staff/my-workplaces`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
console.log('workplaces offered:', JSON.stringify((wps.collection||wps.data?.collection||[]).map(w=>w.name)));
const wo = await ctx.request.get(`https://${APIH}/api/work-orders/view/068f9856-9d28-4500-a3dd-dd6d7aafb15a`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
console.log('can read the seeded work order:', wo.status());
await browser.close();
