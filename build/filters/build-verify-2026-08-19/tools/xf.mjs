import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
async function chk(url,label){
  const errs=[]; page.once('pageerror',e=>errs.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
  const r=await page.evaluate(()=>({rows:document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length, err:/error|something went wrong|broke/i.test(document.body.innerText)&&document.body.innerText.length<300, url:location.href, statusChip:(document.querySelector('[data-test-id=filter_chip_status]')||{}).textContent}));
  console.log(label, JSON.stringify(r), 'jsErr', errs.length);
}
// C29619 deleted/unknown filter value
await chk('https://app.staging.shopview.com/workorders?tab=all&status=nonexistentvalue','C29619_deleted_value');
// C29620 broken filter URL
await chk('https://app.staging.shopview.com/workorders?tab=all&status[]=&foo=bar&status=%%%','C29620_broken_url');
await browser.close();
// C29634 malformed API params
const t=await login('admin');
const r1=await api(t.sessCookie,'GET','/api/work-orders?filters[0][field]=status&filters[0][value]=nonexistent&pagination[rowsPerPage]=30&pagination[page]=1');
console.log('C29634_unknown_value API', r1.status, JSON.stringify(r1.body).slice(0,120));
const r2=await api(t.sessCookie,'GET','/api/work-orders?filters[0][garbage]=xxx&filters=notanarray&pagination[page]=abc');
console.log('C29634_malformed API', r2.status, JSON.stringify(r2.body).slice(0,150));
