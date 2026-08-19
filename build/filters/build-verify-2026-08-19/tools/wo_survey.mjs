import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const reqs=[]; page.on('request', r=>{ const u=r.url(); if(u.includes('/api/work-orders')||u.includes('filter')) reqs.push(r.method()+' '+u.replace(/^https:\/\/[^/]+/,'')); });
async function snap(tag){ console.log('===URL['+tag+']',page.url()); }
const T=(s)=> page.waitForTimeout(s);
// Go to All tab explicitly
await page.goto('https://app.staging.shopview.com/workorders?tab=all', { waitUntil:'domcontentloaded', timeout:60000 });
await T(6000);
await snap('all-tab');
// chips present in toolbar (order)
let chips = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip]')].map(e=>({id:e.getAttribute('data-test-id'),txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)})));
console.log('CHIPS_ALLTAB', JSON.stringify(chips));
// Is there a Status chip? try open it
const statusChip = await page.$('[data-test-id*=status i]') || await page.$('button:has-text("Status")');
async function openChip(sel,label){
  const el = await page.$(sel);
  if(!el){ console.log('NO_CHIP',label,sel); return; }
  await el.click(); await T(1200);
  const panel = await page.evaluate(()=>{
    // capture any open popover/menu
    const pops=[...document.querySelectorAll('.q-menu, [role=menu], .q-popup, [data-test-id*=panel i], .q-card')];
    const p=pops[pops.length-1]; if(!p) return null;
    const inputs=[...p.querySelectorAll('input')].map(i=>i.getAttribute('placeholder'));
    const items=[...p.querySelectorAll('[role=option],.q-item,li,label')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40);
    const btns=[...p.querySelectorAll('button,[data-test-id]')].map(e=>((e.textContent||'').replace(/\s+/g,' ').trim()||e.getAttribute('data-test-id'))).filter(t=>t&&t.length<40);
    return {placeholders:inputs, items:items.slice(0,25), btns:btns.slice(0,20)};
  });
  console.log('PANEL',label,JSON.stringify(panel));
  await page.keyboard.press('Escape'); await T(500);
}
await openChip('[data-test-id=filter_chip_status]','Status(dti)');
// fallback find by text
let byText = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip]')].map(e=>e.getAttribute('data-test-id')));
console.log('CHIP_DTIS', JSON.stringify(byText));
await openChip('[data-test-id=filter_chip_vehicleHere]','AssetOnSite');
// Tabs: check status chip visibility per tab
for(const t of ['estimates','work_orders','completed','all']){
  await page.goto('https://app.staging.shopview.com/workorders?tab='+t,{waitUntil:'domcontentloaded',timeout:60000}); await T(3500);
  const c=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip]')].map(e=>e.getAttribute('data-test-id')));
  console.log('TAB',t,'chips',JSON.stringify(c));
}
console.log('---REQS---'); console.log([...new Set(reqs)].slice(0,30).join('\n'));
await browser.close();
