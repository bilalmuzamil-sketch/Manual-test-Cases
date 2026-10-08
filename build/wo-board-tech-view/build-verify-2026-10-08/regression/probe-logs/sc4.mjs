import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('sc4'); const S=st(); const b=await start(S.woG.url.replace(B,'')+'/lines','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const lines=async()=>{const t=await body(); const i=t.indexOf('Name/Description'); return t.slice(i,i+600);};
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 log('G LINES desktop',await lines()); await dump('SC4-G-lines-scheduled');
 await page.goto(S.woE.url+'/lines'); await page.waitForTimeout(6000); log('E LINES',await lines());
 // phone width
 await page.goto(S.woG.url+'/lines'); await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(7000); await dump('SC4-G-phone'); await page.screenshot({path:OUT+'SC4-G-phone.png',fullPage:true});
 log('PHONE text',(await body()).slice(0,1500));
 const card=page.getByText('Service - Full grease service').first(); await card.click(); await page.waitForTimeout(2500); log('PHONE expanded',(await body()).slice(0,2000)); await page.screenshot({path:OUT+'SC4-G-phone-expanded.png',fullPage:true}); await dump('SC4-G-phone-expanded');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('SC4-err');}
await b.browser.close();
