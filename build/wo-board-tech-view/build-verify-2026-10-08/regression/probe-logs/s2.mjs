import {start,mk,L,menu,btns,newContact,newAsset,st} from './h.mjs';
const log=L('s2'); const u=st().custUrl.replace('https://sv10043.qa.shopview.com',''); const b=await start(u,'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.waitForTimeout(3000); log('tabs',await page.evaluate(()=>[...document.querySelectorAll('[role=tab]')].map(e=>e.innerText.replace(/\s+/g,' '))));

 await newContact(page,'ZZAUTOTEST','Walker',log);
 await newAsset(page,{unit:'RW-1',mileage:'120000'},log);
 await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(3000); await dump('S2-cust-assets');
 await page.goto('https://sv10043.qa.shopview.com/administration/staff'); await page.waitForTimeout(9000); const bt=await body(); log('has Ana',bt.includes('ZZAUTOTEST Ana'),'Cal',(bt.match(/ZZAUTOTEST Cal/g)||[]).length,'TechSV',bt.includes('Tech ShopView')); await dump('S2-staff');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
