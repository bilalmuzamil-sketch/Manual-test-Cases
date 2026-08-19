import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
async function openAndDump(path,chipDti,label){
  await page.goto('https://app.staging.shopview.com'+path,{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
  const el=await page.$('[data-test-id='+chipDti+']');
  if(!el){ console.log(label,'NO_CHIP',chipDti); return; }
  await el.click(); await T(1500);
  const p=await page.evaluate(()=>{
    const pops=[...document.querySelectorAll('.q-menu,[role=menu],.q-popup__content,.q-card')];
    const pp=pops[pops.length-1]; if(!pp) return null;
    const placeholders=[...pp.querySelectorAll('input')].map(i=>i.getAttribute('placeholder')).filter(Boolean);
    const items=[...pp.querySelectorAll('[role=option],.q-item__label,label,li')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<45);
    const btns=[...pp.querySelectorAll('button')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40);
    const dti=[...pp.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,20);
    return {placeholders,items:items.slice(0,15),btns:btns.slice(0,12),dti};
  });
  console.log(label,'PANEL',JSON.stringify(p));
  await page.keyboard.press('Escape'); await T(400);
}
await openAndDump('/parts/inventory','filter_chip_category','PARTS_CATEGORY');
await openAndDump('/parts/inventory','filter_chip_gridLocation','PARTS_GRIDLOC');
await openAndDump('/reports/sales-by-customer','filter_chip_staffId','REPORTS_STAFF');
await openAndDump('/reports/sales-by-customer','filter_chip_range','REPORTS_RANGE');
// Schedule sidebar filters
await page.goto('https://app.staging.shopview.com/schedule',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const sf=await page.$('[data-test-id=button_sidebar_filters]');
if(sf){ await sf.click(); await T(1500);
  const sp=await page.evaluate(()=>{ const pops=[...document.querySelectorAll('.q-menu,.q-card,[role=menu]')]; const pp=pops[pops.length-1]; if(!pp)return null;
    return {placeholders:[...pp.querySelectorAll('input')].map(i=>i.getAttribute('placeholder')).filter(Boolean), labels:[...pp.querySelectorAll('label,.q-item__label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40).slice(0,20)}; });
  console.log('SCHEDULE_SIDEBAR_FILTERS',JSON.stringify(sp));
}
await browser.close();
