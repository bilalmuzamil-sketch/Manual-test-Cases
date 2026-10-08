import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('as1b'); const S=st(); const b=await start(S.custUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 let t;
 await page.getByRole('tab',{name:/Assets/}).first().click(); await page.waitForTimeout(3000);
 await page.locator('tbody tr:visible').filter({hasText:'RW-1'}).first().click(); await page.waitForTimeout(5000); log('ASSET URL',page.url()); t=await body(); log('ASSET PAGE',t.slice(300,2500)); await dump('AS1-asset-page');
 log('ASSET BTNS',(await btns(page)).slice(10,45)); log('ASSET TABS',await page.evaluate(()=>[...document.querySelectorAll('[role=tab],.q-tab')].map(e=>e.innerText.replace(/\s+/g,' ').trim())));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('AS1-err');}
await b.browser.close();
