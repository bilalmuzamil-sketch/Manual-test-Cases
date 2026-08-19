import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await page.click('[data-test-id=filter_chip_status]'); await T(1200);
// dump panel option structure
const struct=await page.evaluate(()=>{
  const pops=[...document.querySelectorAll('.q-menu, .q-popup__content')];
  const pp=pops[pops.length-1]; if(!pp) return {err:'no panel'};
  const kids=[...pp.querySelectorAll('*')].filter(e=>/^Estimate$/.test((e.textContent||'').trim()));
  return {panelHTML: pp.innerHTML.slice(0,600), estimateTags: kids.map(k=>({tag:k.tagName,cls:k.className.slice(0,40),dti:k.getAttribute('data-test-id')}))};
});
console.log('PANEL_STRUCT', JSON.stringify(struct,null,0).slice(0,1200));
// click the Estimate row (the q-item, not inner span)
const clicked=await page.evaluate(()=>{
  const pops=[...document.querySelectorAll('.q-menu, .q-popup__content')]; const pp=pops[pops.length-1]; if(!pp)return 'nopanel';
  const items=[...pp.querySelectorAll('.q-item, [role=option], button')];
  const it=items.find(e=>/Estimate/.test(e.textContent||''));
  if(it){ it.click(); return 'clicked '+it.tagName+' '+it.className.slice(0,30);} return 'notfound';
});
console.log('CLICK', clicked); await T(2000); await page.keyboard.press('Escape'); await T(1000);
console.log('URL', page.url());
console.log('CHIP', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
await browser.close();
