// Put the review requirement back off - it was off before this pass turned it on for C44597/C44601.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { setSetting } from './lib-seed.mjs';
const {browser,page}=await bootProdLogin('/administration/settings',{settle:16000,viewport:{width:1680,height:1000}});
page.setDefaultTimeout(45000);
await page.waitForTimeout(4000);
try{ console.log(await setSetting(page,'Require Review Before Completion',false)); }
catch(e){ console.log('could not:',e.message.slice(0,220)); }
// read every setting back so the shop's state is on the record
const tabs=page.locator('[role=tab], .q-tab'); const n=await tabs.count();
for(let i=n-1;i>=0;i--) if((await tabs.nth(i).innerText()).trim()==='Work Orders'){ await tabs.nth(i).click(); break; }
await page.waitForTimeout(5000);
const now=await page.evaluate(()=>{const panel=[...document.querySelectorAll('.q-tab-panel')].find(p=>(p.innerText||'').includes('Save Settings'));
  if(!panel)return null; const labels=(panel.innerText||'').split('\n').map(s=>s.trim()).filter(l=>/^Require /i.test(l));
  const tg=[...panel.querySelectorAll('.q-toggle')];
  return labels.map((l,i)=>({label:l,on:tg[i]&&tg[i].getAttribute('aria-checked')==='true'}));});
console.log('\nthe shop settings as they now stand:');
(now||[]).forEach(s=>console.log('  ',s.on?'ON ':'off','|',s.label));
await browser.close();
