// As the technician (9 permissions, Tech view, may pick, may not order, may not see money):
// switch into the seeded shop, open the work order and read what they are offered.
// Serves C44565(3), C44582, C44580(3), C44607, C44608, C44609, C44574(1).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 13000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
out.perms = ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]);
console.log('permissions:', out.perms.length, JSON.stringify(out.perms));
const wps = await (await ctx.request.get(`https://${APIH}/api/staff/my-workplaces`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
const list = wps.collection || wps.data?.collection || [];
const target = list.find(w => w.name === 'Trucks Hill 2');
console.log('shops offered:', JSON.stringify(list.map(w=>w.name)), '| target id:', target && target.id);
if (target) {
  const r = await ctx.request.post(`https://${APIH}/api/iam/change-location`, { data: { workplace_id: target.id }, headers: { 'Content-Type':'application/json', Accept:'application/json' }, ignoreHTTPSErrors: true });
  console.log('change-location ->', r.status(), (await r.text()).slice(0,120));
  await page.reload({ waitUntil:'domcontentloaded' }); await page.waitForTimeout(9000);
}
await openWo(page, WO); await page.waitForTimeout(8000);
const t = await bodyText(page);
fs.writeFileSync(`${EV}/tech-view-wo.txt`, t);
await page.screenshot({ path: `${EV}/tech-view-wo.png`, fullPage: true });
out.reached = t.includes('S2-908');
out.cols = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim().replace(/arrow_drop_up|arrow_drop_down/g,'')).filter(Boolean));
out.money = { amounts:(t.match(/\$[\d,]+\.?\d*/g)||[]).slice(0,8), count:(t.match(/\$/g)||[]).length };
out.actions = await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()))].filter(x=>['Order','Pick','Receive','Approve','Decline','Complete','Return','New Line','Add Part','Start'].includes(x)));
out.tickBoxes = await page.evaluate(()=>document.querySelectorAll('[data-test-id^="line_checkbox_"]').length);
console.log('\nreached the seeded work order:', out.reached);
console.log('columns:', JSON.stringify(out.cols));
console.log('money on the page:', JSON.stringify(out.money));
console.log('actions offered:', JSON.stringify(out.actions));
console.log('line tick boxes:', out.tickBoxes);
fs.writeFileSync(`${EV}/rerun-tech-view.json`, JSON.stringify(out,null,1));
await browser.close();
