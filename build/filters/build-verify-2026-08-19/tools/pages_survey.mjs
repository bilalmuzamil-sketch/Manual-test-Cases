import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
async function surv(path,tag){
  try{ await page.goto('https://app.staging.shopview.com'+path,{waitUntil:'domcontentloaded',timeout:60000}); }catch(e){ console.log(tag,'GOTO_ERR',e.message); return; }
  await T(6000);
  const info = await page.evaluate(()=>{
    const dt=[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/filter|chip|search|status|customer|technician|advisor|asset|clear|page_search/i.test(x));
    const psToggle = !!document.querySelector('[data-test-id=page_search_toggle]');
    const gs = !!document.querySelector('[data-test-id=select_global_search]');
    const bodyStart = document.body.innerText.slice(0,400);
    return {dt:[...new Set(dt)], psToggle, gs, bodyStart};
  });
  console.log('==='+tag,'URL',page.url());
  console.log('  DTI', JSON.stringify(info.dt));
  console.log('  page_search_toggle', info.psToggle, '| global_search', info.gs);
  console.log('  BODY', info.bodyStart.replace(/\n+/g,' | '));
}
await surv('/parts','PARTS');
await surv('/reports','REPORTS');
await surv('/customers','CUSTOMERS');
await surv('/schedule','SCHEDULE');
await surv('/parts/orders','PARTS_ORDERS');
await browser.close();
