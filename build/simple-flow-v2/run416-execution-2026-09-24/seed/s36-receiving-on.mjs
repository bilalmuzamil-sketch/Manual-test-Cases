// Receive later vanished from the receive window. The two settings that govern ordering and
// receiving were switched on and off by me earlier in this pass - read them, then put the two
// this check needs back on.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setSetting } from './lib-seed.mjs';
const {browser,page}=await bootProdLogin('/administration/settings',{settle:14000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(40000);
const read=async()=>{
  const tabs=page.locator('[role=tab], .q-tab'); const n=await tabs.count();
  for(let i=n-1;i>=0;i--) if((await tabs.nth(i).innerText()).trim()==='Work Orders'){ await tabs.nth(i).click(); break; }
  await page.waitForTimeout(5000);
  return await page.evaluate(()=>{const panel=[...document.querySelectorAll('.q-tab-panel')].find(p=>(p.innerText||'').includes('Save Settings'));
    const labels=(panel.innerText||'').split('\n').map(s=>s.trim()).filter(l=>/^Require /i.test(l));
    const tg=[...panel.querySelectorAll('.q-toggle')];
    return labels.map((l,i)=>({label:l,on:tg[i]&&tg[i].getAttribute('aria-checked')==='true'}));});
};
console.log('as they stand:');
(await read()).forEach(s=>console.log('  ',s.on?'ON ':'off','|',s.label));
for(const want of ['Require Ordering Parts','Require Receiving Parts Before Completion']){
  try{ console.log('\n',await setSetting(page,want,true)); }catch(e){ console.log('\n could not set',want,'-',e.message.slice(0,200)); }
}
console.log('\nafter:');
(await read()).forEach(s=>console.log('  ',s.on?'ON ':'off','|',s.label));
await browser.close();
